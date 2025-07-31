import { useColorMode } from "@/components/ui/color-mode";
import { MAP_TRANSITION_DURATION } from "@/constants/duration";
import useSearchAddress from "@/constants/useSearchAddress";
import useActiveMapStyle from "@/context/useActiveMapStyle";
import useBasemap from "@/context/useBasemap";
import useCurrentLocation from "@/context/useCurrentLocation";
import useLayout from "@/context/useLayout";
import useMapStyle from "@/context/useMapStyle";
import useMapViewState from "@/context/useMapViewState";
import useMapsZoom from "@/context/useMapZoom";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Map, { MapRef, Marker } from "react-map-gl/mapbox";
import MapMarkerCircle from "../MapMarkerCircle";
import LayerManager from "../LayerManager";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const MIN_ZOOM = 1;
const MAX_ZOOM = 22;

const BaseMap = () => {
  // Hooks
  const { colorMode } = useColorMode();

  // Contexts
  const { mapStyle } = useMapStyle();
  const { layout } = useLayout();
  const { currentLocation } = useCurrentLocation();
  const { mapZoomPercent, setMapZoomPercent } = useMapsZoom();
  const { basemap } = useBasemap();
  const { selectedSearchResult } = useSearchAddress(); // long = 0, lat = 1 (center)

  // Refs
  const mapRef = useRef<MapRef>(null);

  // States
  const { activeMapStyle, setActiveMapStyle } = useActiveMapStyle();
  const [mapLoad, setMapLoad] = useState<boolean>(false);
  const { mapViewState, setMapViewState, setMapRef } = useMapViewState();
  const mapKey = `${activeMapStyle?.id}${mapStyle.id}`;

  // Handle init mapRef
  useEffect(() => {
    if (mapRef) {
      setMapRef(mapRef);
    }
  }, [mapRef]);

  // Handle resize on layout change
  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.getMap().resize();
    }, 1);
  }, [layout]);

  // Handle current location
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      mapRef.current?.flyTo({
        center: [currentLocation.lon, currentLocation.lat],
        zoom: 14, // atau sesuaikan dengan kebutuhan
        duration: MAP_TRANSITION_DURATION,
        essential: true,
      });
    }
  }, [currentLocation]);

  // Handle search address
  useEffect(() => {
    if (mapRef.current && selectedSearchResult) {
      mapRef.current.easeTo({
        center: {
          lat: selectedSearchResult.center[1],
          lon: selectedSearchResult.center[0],
        },
        zoom: 11,
        duration: 1000,
      });
    }
  }, [selectedSearchResult]);

  // Handle zoom percent
  function handleZoomFromPercent(percent: number) {
    const zoomLevel = (percent / 100) * (MAX_ZOOM - MIN_ZOOM) + MIN_ZOOM;

    if (mapRef.current) {
      mapRef.current?.getMap().easeTo({
        zoom: zoomLevel,
        duration: 300,
      });
    }
  }
  function handleZoomFromLevel(zoomLevel: number) {
    const mapZoomPercent =
      ((zoomLevel - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100;

    setMapZoomPercent(mapZoomPercent);
  }
  useEffect(() => {
    handleZoomFromPercent(mapZoomPercent);
  }, [mapZoomPercent]);

  // Handle activeMapStyle url to json object w/ basemap filter
  async function initializeBasemap() {
    let styleJson;

    if (typeof mapStyle.tile[colorMode] === "string") {
      const response = await fetch(mapStyle.tile[colorMode]);
      styleJson = await response.json();
    } else {
      styleJson = { ...(mapStyle.tile[colorMode] as any) };
    }

    const layerMapping: Record<string, string[]> = {
      road: [
        "road_service_case",
        "road_minor_case",
        "road_pri_case_ramp",
        "road-pri-case-ramp",
        "road_trunk_case_ramp",
        "road_mot_case_ramp",
        "road_sec_case_noramp",
        "road_pri_case_noramp",
        "road_trunk_case_noramp",
        "road_mot_case_noramp",
        "road_path",
        "road_service_fill",
        "road_minor_fill",
        "road_pri_fill_ramp",
        "road_trunk_fill_ramp",
        "road_mot_fill_ramp",
        "road_sec_fill_noramp",
        "road_pri_fill_noramp",
        "road_trunk_fill_noramp",
        "road_mot_fill_noramp",
        "roadname_minor",
        "roadname_sec",
        "roadname_pri",
        "roadname_major",
      ],
      water: ["water", "water-shadow", "waterway"],
      building: [
        // "building", // Default hidden
        "building-top",
        "building-extrusion",
        "building-outline",
      ],
    };

    const filteredLayers = Object.entries(layerMapping).flatMap(
      ([key, layers]) => (basemap[key as keyof typeof basemap] ? [] : layers)
    );

    const updatedLayers = styleJson.layers.map((layer: any) =>
      filteredLayers?.includes(layer.id) || layer.id === "building"
        ? {
            ...layer,
            layout: {
              ...layer.layout,
              visibility: "none",
            },
          }
        : layer
    );

    setActiveMapStyle({ ...styleJson, layers: updatedLayers });
  }
  useEffect(() => {
    if (mapStyle.id === 1) {
      // Carto
      initializeBasemap();
    } else {
      setActiveMapStyle(mapStyle.tile[colorMode]);
    }
  }, [mapStyle, colorMode]);

  return (
    <Map
      key={mapKey}
      ref={mapRef}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      projection="mercator"
      // maxPitch={90}
      // maxBounds={[-180, -85, 180, 85]}
      {...mapViewState}
      onLoad={() => {
        setMapLoad(true);
      }}
      onRemove={() => {
        setMapLoad(false);
      }}
      onMove={(evt) => setMapViewState(evt.viewState)}
      style={{ width: "100%", height: "100dvh" }}
      mapStyle={activeMapStyle}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapLib={mapboxgl}
      onZoomEnd={(e) => {
        handleZoomFromLevel(e.viewState.zoom);
      }}
    >
      {mapLoad && (
        <>
          {/* Current LocationMarker */}
          {currentLocation && (
            <Marker
              longitude={currentLocation.lon}
              latitude={currentLocation.lat}
            >
              <MapMarkerCircle />
            </Marker>
          )}

          {/* Search Marker */}
          {selectedSearchResult && (
            <Marker
              longitude={selectedSearchResult?.center[0]}
              latitude={selectedSearchResult?.center[1]}
            >
              <MapMarkerCircle color="fg" />
            </Marker>
          )}

          {/* Polygon Layer */}
          <LayerManager key={mapKey} />
        </>
      )}
    </Map>
  );
};

export default BaseMap;

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
import LayerManager from "../LayerManager";
import MapMarkerCircle from "../MapMarkerCircle";
import SelectedPolygonLayer from "../SelectedPolygonLayer";
import PolygonPopover from "../basemapOverlay/PolygonPopover";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const MIN_ZOOM = 1;
const MAX_ZOOM = 22;

const BaseMap = () => {
  const { colorMode } = useColorMode();

  const mapStyle = useMapStyle((s) => s.mapStyle);
  const layout = useLayout((s) => s.layout);
  const currentLocation = useCurrentLocation((s) => s.currentLocation);
  const { mapZoomPercent, setMapZoomPercent } = useMapsZoom();
  const basemap = useBasemap((s) => s.basemap);
  const selectedSearchResult = useSearchAddress((s) => s.selectedSearchResult);

  const mapRef = useRef<MapRef>(null);

  const { activeMapStyle, setActiveMapStyle } = useActiveMapStyle();
  const [mapLoad, setMapLoad] = useState(false);
  const { mapViewState, setMapViewState, setMapRef } = useMapViewState();
  const [mapKey, setMapKey] = useState(1);

  // Set mapRef in zustand only once mapRef.current is ready
  useEffect(() => {
    if (mapRef.current) {
      setMapRef(mapRef);
    }
  }, [mapRef.current]);

  // Resize on layout changes
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef?.current?.getMap().resize();
      }, 1);
    }
  }, [layout]);

  // Fly to current location if available
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      mapRef.current.flyTo({
        center: [currentLocation.lon, currentLocation.lat],
        zoom: 12,
        duration: MAP_TRANSITION_DURATION,
        essential: true,
      });
    }
  }, [currentLocation]);

  // Ease to search result if available
  useEffect(() => {
    if (mapRef.current && selectedSearchResult) {
      mapRef.current.flyTo({
        center: [
          selectedSearchResult.center[0],
          selectedSearchResult.center[1],
        ],
        zoom: 12,
        duration: MAP_TRANSITION_DURATION,
      });
    }
  }, [selectedSearchResult]);

  // Zoom from percent (0-100)
  function handleZoomFromPercent(percent: number) {
    const zoomLevel = (percent / 100) * (MAX_ZOOM - MIN_ZOOM) + MIN_ZOOM;
    if (mapRef.current) {
      mapRef.current.getMap().easeTo({
        zoom: zoomLevel,
        duration: 300,
      });
    }
  }

  // Update zoom percent from zoom level
  function handleZoomFromLevel(zoomLevel: number) {
    const zoomPercent = ((zoomLevel - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100;
    setMapZoomPercent(zoomPercent);
  }

  useEffect(() => {
    handleZoomFromPercent(mapZoomPercent);
  }, [mapZoomPercent]);

  // Initialize basemap style
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
      filteredLayers.includes(layer.id) || layer.id === "building"
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
      initializeBasemap();
    } else {
      setActiveMapStyle(mapStyle.tile[colorMode]);
    }

    setTimeout(() => {
      setMapKey((prev) => prev + 1);
    }, 1);
  }, [mapStyle, colorMode]);

  return (
    <Map
      key={mapKey}
      ref={mapRef}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      projection="globe"
      doubleClickZoom={false}
      {...mapViewState}
      onLoad={() => setMapLoad(true)}
      onRemove={() => setMapLoad(false)}
      onMove={(evt) => {
        if (evt.viewState) setMapViewState(evt.viewState);
      }}
      style={{ width: "100%", height: "100dvh" }}
      mapStyle={activeMapStyle}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapLib={mapboxgl}
      onZoomEnd={(e) => {
        if (e.viewState) handleZoomFromLevel(e.viewState.zoom);
      }}
    >
      {mapLoad && (
        <>
          {/* Current Location Marker */}
          {currentLocation && (
            <Marker
              longitude={currentLocation.lon}
              latitude={currentLocation.lat}
            >
              <MapMarkerCircle />
            </Marker>
          )}
          {/* Search Result Marker */}
          {selectedSearchResult && (
            <Marker
              longitude={selectedSearchResult.center[0]}
              latitude={selectedSearchResult.center[1]}
            >
              <MapMarkerCircle color="fg" />
            </Marker>
          )}

          {/* Main Layer  */}
          <LayerManager />

          {/* Selected Polygon Layer */}
          <SelectedPolygonLayer />

          <PolygonPopover />
        </>
      )}
    </Map>
  );
};

export default BaseMap;

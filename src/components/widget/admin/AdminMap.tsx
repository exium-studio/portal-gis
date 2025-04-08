import { useColorMode } from "@/components/ui/color-mode";
import { DISPLAYED_DUMMY_DATA } from "@/constants/dummy";
import useCurrentLocation from "@/context/useCurrentLocation";
import useDisplayedData from "@/context/useDisplayedData";
import useLayout from "@/context/useLayout";
import useMapStyle from "@/context/useMapStyle";
import useMapViewState from "@/context/useMapViewState";
import useMapsZoom from "@/context/useMapZoom";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Map, { MapRef, Marker } from "react-map-gl/mapbox";
import MapMarkerCircle from "../MapMarkerCircle";
import FacilityLayer from "./FacilityLayer";
import KKLayer from "./KKLayer";
import VillageAssetLayer from "./VillageAssetLayer";
import useActiveMapStyle from "@/context/useActiveMapStyle";
import useBasemap from "@/context/useBasemap";
import useSearchAddress from "@/constants/useSearchAddress";

const MIN_ZOOM = 0;
const MAX_ZOOM = 22;

const AdminMap = () => {
  // Contexts
  const { colorMode } = useColorMode();
  const { mapStyle } = useMapStyle();
  const { layout } = useLayout();
  const { currentLocation } = useCurrentLocation();
  const { mapZoomPercent, setMapZoomPercent } = useMapsZoom();
  const { displayedData } = useDisplayedData();
  const { basemap } = useBasemap();
  const { selectedSearchResult } = useSearchAddress(); // long = 0, lat = 1 (center)

  // States, Refs
  const { activeMapStyle, setActiveMapStyle } = useActiveMapStyle();
  const [mapLoad, setMapLoad] = useState<boolean>(false);
  const mapRef = useRef<MapRef>(null);
  const { mapViewState, setMapViewState, setMapRef } = useMapViewState();
  const data = DISPLAYED_DUMMY_DATA;

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
      mapRef.current.easeTo({
        center: {
          lat: currentLocation.lat,
          lon: currentLocation.lon,
        },
        zoom: 17,
        duration: 1000,
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
      initializeBasemap();
    } else {
      setActiveMapStyle(mapStyle.tile[colorMode]);
    }
  }, [mapStyle]);

  // Handle rerender layer
  useEffect(() => {
    const timeoutRef: { first: number; second: number } = {
      first: 0,
      second: 0,
    };

    timeoutRef.first = window.setTimeout(() => {
      setMapViewState({
        ...mapViewState,
        latitude: mapViewState.latitude + 0.000000001,
      });
    }, 100);

    timeoutRef.second = window.setTimeout(() => {
      setMapViewState({
        ...mapViewState,
        latitude: mapViewState.latitude - 0.000000001,
      });
    }, 200);

    return () => {
      clearTimeout(timeoutRef.first);
      clearTimeout(timeoutRef.second);
    };
  }, [activeMapStyle, mapStyle]);

  return (
    <Map
      ref={mapRef}
      {...mapViewState}
      onLoad={() => {
        setMapLoad(true);
      }}
      onRemove={() => {
        setMapLoad(false);
      }}
      onMove={(evt) => setMapViewState(evt.viewState)}
      style={{ width: "100%", height: "100vh" }}
      mapStyle={activeMapStyle}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      mapLib={mapboxgl}
      onZoomEnd={(e) => {
        handleZoomFromLevel(e.viewState.zoom);
      }}
    >
      {mapLoad && (
        <>
          {/* Markers */}
          {currentLocation && (
            <Marker
              longitude={currentLocation.lon}
              latitude={currentLocation.lat}
            >
              <MapMarkerCircle />
            </Marker>
          )}

          {/* Data layer */}
          {data && (
            <>
              {displayedData.kk && <KKLayer data={data.kk} />}

              {displayedData.facility && <FacilityLayer data={data.facility} />}

              {displayedData.village_asset && (
                <VillageAssetLayer data={data.village_asset} />
              )}
            </>
          )}
        </>
      )}

      {/* Coba */}
    </Map>
  );
};

export default AdminMap;

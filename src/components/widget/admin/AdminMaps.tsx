import { useColorMode } from "@/components/ui/color-mode";
import useCurrentLocation from "@/context/useCurrentLocation";
import useLayout from "@/context/useLayout";
import useMapStyle from "@/context/useMapsStyle";
import useMapsViewState from "@/context/useMapsViewState";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Map, { MapRef, Marker } from "react-map-gl/mapbox";
import MapMarkerCircle from "../MapMarkerCircle";
import useMapsZoom from "@/context/useMapsZoom";
import { DISPLAYED_DUMMY_DATA } from "@/constants/dummy";
import KKLayer from "./KKLayer";
import FacilityLayer from "./FacilityLayer";
import VillageAssetLayer from "./VillageAssetLayer";

const MIN_ZOOM = 0;
const MAX_ZOOM = 22;
const ACTIVE_MAP_STYLE_DEFAULT =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const AdminMaps = () => {
  // Contexts
  const { colorMode } = useColorMode();
  const { mapsStyle } = useMapStyle();
  const { layout } = useLayout();
  const { currentLocation } = useCurrentLocation();
  const { zoomPercent, setZoomPercent } = useMapsZoom();

  // States, Refs
  const [activeMapStyle, setActiveMapStyle] = useState(
    ACTIVE_MAP_STYLE_DEFAULT
  );
  const [mapLoad, setMapLoad] = useState<boolean>(false);
  const mapRef = useRef<MapRef>(null);
  const { mapsViewState, setMapsViewState, setMapRef } = useMapsViewState();
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

  // Handle map style depend on color mode
  useEffect(() => {
    setActiveMapStyle(mapsStyle.tile[colorMode as keyof typeof mapsStyle.tile]);
  }, [colorMode, mapsStyle]);

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
    const zoomPercent = ((zoomLevel - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100;

    setZoomPercent(zoomPercent);
  }
  useEffect(() => {
    handleZoomFromPercent(zoomPercent);
  }, [zoomPercent]);

  return (
    <Map
      ref={mapRef}
      {...mapsViewState}
      onLoad={() => {
        setMapLoad(true);
      }}
      onRemove={() => {
        setMapLoad(false);
      }}
      onMove={(evt) => setMapsViewState(evt.viewState)}
      style={{ width: "100%", height: "100vh" }}
      mapStyle={activeMapStyle || ACTIVE_MAP_STYLE_DEFAULT}
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

          {data && (
            <>
              <KKLayer data={data.kk} />

              <FacilityLayer data={data.facility} />

              <VillageAssetLayer data={data.village_asset} />
            </>
          )}
        </>
      )}
    </Map>
  );
};

export default AdminMaps;

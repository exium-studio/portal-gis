import { useColorMode } from "@/components/ui/color-mode";
import useCurrentLocation from "@/context/useCurrentLocation";
import useLayout from "@/context/useLayout";
import useMapStyle from "@/context/useMapStyle";
import useMapsViewState from "@/context/useMapsViewState";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Map, { MapRef, Marker } from "react-map-gl/mapbox";
import MapMarkerCircle from "../MapMarkerCircle";
import useMapsZoom from "@/context/useMapsZoom";

const minZoom = 0;
const maxZoom = 22;

const AdminMaps = () => {
  // Contexts
  const { colorMode } = useColorMode();
  const { mapStyle, setMapStyle } = useMapStyle();
  const { layout } = useLayout();
  const { currentLocation } = useCurrentLocation();
  const { zoomPercent, setZoomPercent } = useMapsZoom();

  // States, Refs
  const [mapLoad, setMapLoad] = useState<boolean>(false);
  const mapRef = useRef<MapRef>(null);
  const { mapsViewState, setMapsViewState, setMapRef } = useMapsViewState();
  const tiles: Record<string, string> = {
    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  };

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
    if (colorMode === "light") setMapStyle(tiles.light);
    if (colorMode === "dark") setMapStyle(tiles.dark);
  }, [colorMode]);

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
    const zoomLevel = (percent / 100) * (maxZoom - minZoom) + minZoom;

    if (mapRef.current) {
      mapRef.current?.getMap().easeTo({
        zoom: zoomLevel,
        duration: 300,
      });
    }
  }
  function handleZoomFromLevel(zoomLevel: number) {
    const zoomPercent = ((zoomLevel - minZoom) / (maxZoom - minZoom)) * 100;

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
      mapStyle={mapStyle}
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
        </>
      )}
    </Map>
  );
};

export default AdminMaps;

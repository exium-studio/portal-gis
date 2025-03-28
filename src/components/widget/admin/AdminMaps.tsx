import { useColorMode } from "@/components/ui/color-mode";
import useLayout from "@/context/useLayout";
import useMapStyle from "@/context/useMapStyle";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl/mapbox";

const AdminMaps = () => {
  // Contexts
  const { colorMode } = useColorMode();
  const { mapStyle, setMapStyle } = useMapStyle();
  const { layout } = useLayout();

  // States, Refs
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: -2.5489,
    longitude: 118.0149,
    zoom: 3,
  });
  const tiles: Record<string, string> = {
    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  };

  // Handle resize on layout change
  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.getMap().resize();
    }, 0);
  }, [layout]);

  // Handle map style depend on color mode
  useEffect(() => {
    if (colorMode === "light") setMapStyle(tiles.light);
    if (colorMode === "dark") setMapStyle(tiles.dark);
  }, [colorMode]);

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100vh" }}
      mapStyle={mapStyle}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      mapLib={mapboxgl}
    />
  );
};

export default AdminMaps;

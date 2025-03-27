import { useColorMode } from "@/components/ui/color-mode";
import useMapStyle from "@/context/useMapStyle";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl/mapbox";

const AdminMaps = () => {
  // Contexts
  const { colorMode } = useColorMode();
  const { mapStyle, setMapStyle } = useMapStyle();

  // States, Refs
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 0,
  });
  const tiles: Record<string, string> = {
    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  };

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

import { useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import { useColorMode } from "@/components/ui/color-mode";

const AdminMaps = () => {
  const { colorMode } = useColorMode();
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

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100vh" }}
      mapStyle={tiles[colorMode as keyof typeof tiles] ?? tiles.light}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      mapLib={mapboxgl}
    />
  );
};

export default AdminMaps;

import { useColorMode } from "@/components/ui/color-mode";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import * as turf from "@turf/turf";
import { Popup } from "react-map-gl/mapbox";

export default function PolygonPopover() {
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  if (!selectedPolygon) return null;

  const { colorMode } = useColorMode();

  const centroid = turf.centroid(selectedPolygon.polygon);
  const [lng, lat] = centroid.geometry.coordinates;

  // generate CSS dinamis by condition
  const popupStyle = `
    .mapboxgl-popup-content {
      padding: 8px !important;
      border-radius: 6px !important;
      background: ${colorMode === "dark" ? "#151515" : "#ffffff"} !important;
      color: ${colorMode === "dark" ? "#f8fafc" : "#0f172a"} !important;
    }
    .mapboxgl-popup-tip {
      border-top-color: ${
        colorMode === "dark" ? "#111827" : "#ffffff"
      } !important;
    }
  `;

  return (
    <>
      <style>{popupStyle}</style>
      <Popup
        longitude={lng}
        latitude={lat}
        anchor="bottom"
        closeButton={false}
        closeOnClick={false}
      >
        <div>
          <strong>{selectedPolygon.activeLayer.name}</strong>
          <div>Wksp: {selectedPolygon.activeWorkspace.title}</div>
        </div>
      </Popup>
    </>
  );
}

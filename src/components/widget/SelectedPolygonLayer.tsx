import { useEffect, useRef } from "react";
import useMapViewState from "@/context/useMapViewState";
import useSelectedPolygon from "@/context/useSelectedPolygon";

const SelectedPolygonLayer = () => {
  const mapRef = useMapViewState((s) => s.mapRef);
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const lastGeojsonRef = useRef<any>(null);

  useEffect(() => {
    const map = mapRef?.current?.getMap();
    if (!map) return;

    const sourceId = "selected-polygon-source";
    const fillLayerId = "selected-polygon-fill";
    const lineLayerId = "selected-polygon-outline";

    // Bersihkan dulu biar nggak dobel
    if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
    if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    if (!selectedPolygon) return;

    const geojson = {
      type: "FeatureCollection",
      features: [selectedPolygon.polygon],
    };

    lastGeojsonRef.current = geojson;

    map.addSource(sourceId, { type: "geojson", data: geojson });

    // Fill layer highlight
    map.addLayer({
      id: fillLayerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": selectedPolygon.fillColor,
        "fill-opacity": 0.5,
      },
    });

    return () => {
      if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
      if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [mapRef, selectedPolygon]);

  return null;
};

export default SelectedPolygonLayer;

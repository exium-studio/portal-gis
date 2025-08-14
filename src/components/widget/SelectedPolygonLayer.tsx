import { useEffect, useRef } from "react";
import useMapViewState from "@/context/useMapViewState";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import empty from "@/utils/empty";

const SelectedPolygonLayer = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);

  // Refs
  const lastGeojsonRef = useRef<any>(null);
  const mapRef = useMapViewState((s) => s.mapRef);

  useEffect(() => {
    const map = mapRef?.current?.getMap();
    if (!map) return;

    const sourceId = "selected-polygon-source";
    const fillLayerId = "selected-polygon-fill";
    const lineLayerId = "selected-polygon-outline";

    // layer cleanup, prevent duplicate
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
        "fill-opacity": 0.8,
      },
    });

    // TODO fix cleanup error get own layer on mapstyle changes
    // return () => {
    //   if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
    //   if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
    //   if (map.getSource(sourceId)) map.removeSource(sourceId);
    // };
  }, [mapRef, selectedPolygon]);

  useEffect(() => {
    if (!empty(selectedPolygon)) {
      setSelectedPolygon({
        ...selectedPolygon,
        fillColor: themeConfig?.primaryColorHex,
      });
    }
  }, [themeConfig?.primaryColorHex]);

  return null;
};

export default SelectedPolygonLayer;

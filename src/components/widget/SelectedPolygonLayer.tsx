import { useEffect, useRef } from "react";
import useMapViewState from "@/context/useMapViewState";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import empty from "@/utils/empty";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";

const FILL_LAYER_ID = "selected-polygon-fill";

const SelectedPolygonLayer = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);
  const activeWorkspaceByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );

  // Refs
  const lastGeojsonRef = useRef<any>(null);
  const mapRef = useMapViewState((s) => s.mapRef);

  useEffect(() => {
    const map = mapRef?.current?.getMap();
    if (!map) return;

    const sourceId = "selected-polygon-source";

    // layer cleanup, prevent duplicate
    if (map.getLayer(FILL_LAYER_ID)) map.removeLayer(FILL_LAYER_ID);
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
      id: FILL_LAYER_ID,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": selectedPolygon.fillColor,
        "fill-opacity": 0.8,
      },
    });

    // TODO fix cleanup error get own layer on mapstyle changes
    // return () => {
    //   if (map.getLayer(FILL_LAYER_ID)) map.removeLayer(FILL_LAYER_ID);
    //   if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
    //   if (map.getSource(sourceId)) map.removeSource(sourceId);
    // };
  }, [mapRef, selectedPolygon]);

  useEffect(() => {
    const map = mapRef?.current?.getMap();
    if (!map) return;

    if (map.getLayer(FILL_LAYER_ID)) {
      map.moveLayer(FILL_LAYER_ID);
    }
  }, [activeWorkspaceByCategory]);

  useEffect(() => {
    if (!empty(selectedPolygon)) {
      setSelectedPolygon({
        ...selectedPolygon,
        fillColor: themeConfig?.primaryColorHex,
      });
    }
  }, [themeConfig?.primaryColorHex]);

  console.log("selectedPolygon", selectedPolygon);

  return null;
};

export default SelectedPolygonLayer;

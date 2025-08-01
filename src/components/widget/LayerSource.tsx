import {
  Interface__ActiveLayer,
  Interface__ActiveWorkspace,
} from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLegend from "@/context/useLegend";
import useMapViewState from "@/context/useMapViewState";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useCallback, useEffect } from "react";

interface LayerSourceProps {
  activeWorkspace: Interface__ActiveWorkspace;
  activeLayer: Interface__ActiveLayer;
}

const LayerSource = (props: LayerSourceProps) => {
  // Props
  const { activeWorkspace, activeLayer } = props;

  // Contexts
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const { mapRef } = useMapViewState();
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );
  const { themeConfig } = useThemeConfig();
  const legends = useLegend((s) => s.legends);

  // States
  const legendType = "GUNATANAHK";
  const geojson = activeLayer?.data?.geojson;
  const defaultFillColor = "#9E9E9E";
  const defaultLineColor = "#ccc";
  const fillLayerId = `${activeLayer.id}-fill`;
  const lineLayerId = `${activeLayer.id}-outline`;
  const sourceId = `${activeLayer.id}-source`;
  const isFillLayer = activeLayer.layer_type === "fill";
  const isLineLayer = activeLayer.layer_type === "line";
  const selectedPolygonId = selectedPolygon?.polygon?.properties?.id || null;
  const fillColor = [
    "case",
    ["==", ["get", "id"], selectedPolygonId],
    themeConfig.primaryColorHex,
    [
      "match",
      ["get", legendType],
      ...legends.flatMap((legend) => [legend.label, legend.color]),
      defaultFillColor,
    ],
  ];
  const fillOpacity = !activeLayer?.visible
    ? 0
    : [
        "case",
        ["==", ["get", "id"], selectedPolygonId],
        0.8,
        [
          "case",
          [
            "all",
            ["==", ["literal", activeLayer.visible], true],
            ["!", ["==", ["literal", isLineLayer], true]],
          ],
          0.8,
          0,
        ],
      ];

  // Utils
  const handleOnClickPolygon = useCallback(
    (event: any) => {
      if (!activeLayer.visible) return;

      const clickedFeature = event.features?.[0];
      if (!clickedFeature) {
        clearSelectedPolygon();
        return;
      }

      const selectedId = selectedPolygon?.polygon?.properties?.id;
      const clickedId = clickedFeature.properties?.id;

      if (selectedId === clickedId) {
        clearSelectedPolygon();
      } else {
        setSelectedPolygon({
          polygon: clickedFeature,
          activeLayer,
          activeWorkspace,
          fillColor: themeConfig.primaryColorHex,
        });
      }
    },
    [
      selectedPolygon?.polygon?.properties?.id,
      activeWorkspace,
      activeLayer,
      themeConfig.primaryColorHex,
      fillColor,
    ]
  );

  // Handle initialize layers
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !geojson) return;

    // Add or update source
    const existingSource = map.getSource(sourceId);
    const existingFill = map.getLayer(fillLayerId);
    const existingLine = map.getLayer(lineLayerId);

    if (existingSource) {
      (existingSource as any).setData(geojson);
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data: geojson,
      });
    }

    // Fill layer
    if (isFillLayer) {
      if (!existingFill) {
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": fillColor,
            "fill-opacity": fillOpacity,
          },
        });
      } else {
        map.setPaintProperty(fillLayerId, "fill-color", fillColor);
        map.setPaintProperty(fillLayerId, "fill-opacity", fillOpacity);
      }
    }

    // Outline layer
    if (isLineLayer) {
      if (!existingLine) {
        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": isLineLayer
              ? themeConfig.primaryColorHex
              : defaultLineColor,
            "line-width": 1,
            "line-opacity": activeLayer.visible ? 1 : 0,
          },
        });
      } else {
        map.setPaintProperty(
          lineLayerId,
          "line-opacity",
          activeLayer.visible ? 1 : 0
        );
      }
    }

    // Click event
    if (activeLayer.visible) {
      map.on("click", fillLayerId, handleOnClickPolygon);
    }

    return () => {
      map.off("click", fillLayerId, handleOnClickPolygon);
    };
  }, [
    geojson,
    activeLayer.id,
    activeLayer.visible,
    activeLayer.layer_type,
    legends,
    themeConfig.primaryColorHex,
    selectedPolygon,
    fillColor,
    fillOpacity,
    activeWorkspaces,
  ]);

  // Cleanup on layer unmount
  useEffect(() => {
    return () => {
      const map = mapRef.current?.getMap();
      if (!map) return;
      if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
      if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [activeLayer.id]);

  return null;
};
export default LayerSource;

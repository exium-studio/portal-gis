import {
  Interface__ActiveLayer,
  Interface__ActiveWorkspace,
} from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLegend from "@/context/useLegend";
import useMapStyle from "@/context/useMapStyle";
import useMapViewState from "@/context/useMapViewState";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useCallback, useEffect } from "react";
import { useColorMode } from "../ui/color-mode";

interface LayerSourceProps {
  activeWorkspace: Interface__ActiveWorkspace;
  activeLayer: Interface__ActiveLayer;
}

const LayerSource = (props: LayerSourceProps) => {
  // Props
  const { activeWorkspace, activeLayer } = props;

  // Contexts
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const mapRef = useMapViewState((s) => s.mapRef);
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );
  const { themeConfig } = useThemeConfig();
  const legends = useLegend((s) => s.legends);
  const mapStyle = useMapStyle((s) => s.mapStyle);
  const { colorMode } = useColorMode();

  // States
  const legendType = "GUNATANAHK";
  const geojson = activeLayer?.data?.geojson;
  const plainLight = colorMode === "light" && mapStyle?.id === 1;
  const plainDark = colorMode === "dark" && mapStyle?.id === 1;
  const colorful = mapStyle?.id === 2;
  const satellite = mapStyle?.id === 3;
  const defaultFillColor = plainLight
    ? "#bbb"
    : plainDark
    ? "#444"
    : colorful
    ? "#bbb"
    : satellite
    ? "#bbb"
    : "#fff";
  const defaultLineColor = plainLight
    ? "#555"
    : plainDark
    ? "#ddd"
    : colorful
    ? "#333"
    : satellite
    ? "#555"
    : "#ccc";
  const fillLayerId = `${activeLayer.id}-fill`;
  const lineLayerId = `${activeLayer.id}-outline`;
  const sourceId = `${activeLayer.id}-source`;
  const isFillLayer = activeLayer.layer_type === "fill";
  const isLineLayer = activeLayer.layer_type === "line";
  const selectedPolygonId = selectedPolygon?.polygon?.properties?.id || null;

  const fillColor = [
    "case",
    ["==", ["get", "id"], selectedPolygonId],
    selectedPolygon?.fillColor || defaultFillColor,
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
        0.6,
        [
          "case",
          [
            "all",
            ["==", ["literal", activeLayer.visible], true],
            ["!", ["==", ["literal", isLineLayer], true]],
          ],
          0.6,
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
        const clickedPolygon = activeLayer?.data?.geojson?.features?.find(
          (feature) => feature?.properties?.id === clickedId
        );
        setSelectedPolygon({
          polygon: clickedPolygon,
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
    if (isFillLayer || isLineLayer) {
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
    if (isFillLayer || isLineLayer) {
      if (!existingLine) {
        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": defaultLineColor,
            "line-width": isLineLayer ? 2 : 1,
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

    map.moveLayer(lineLayerId, fillLayerId);

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

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !geojson) return;

    map.moveLayer(lineLayerId, fillLayerId);
  }, [activeWorkspaces]);

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

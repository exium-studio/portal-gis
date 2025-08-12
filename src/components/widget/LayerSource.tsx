import {
  Interface__ActiveLayer,
  Interface__ActiveWorkspace,
} from "@/constants/interfaces";
import useMapViewState from "@/context/useMapViewState";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import useLegend from "@/context/useLegend";
import useMapStyle from "@/context/useMapStyle";
import { useColorMode } from "../ui/color-mode";
import { useCallback, useEffect, useRef } from "react";

interface LayerSourceProps {
  activeWorkspace: Interface__ActiveWorkspace;
  activeLayer: Interface__ActiveLayer;
}

const LayerSource = ({ activeWorkspace, activeLayer }: LayerSourceProps) => {
  const mapRef = useMapViewState((s) => s.mapRef);
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );
  const { themeConfig } = useThemeConfig();
  const legend = useLegend((s) => s.legend);
  const colorway = useLegend((s) => s.colorway);
  const mapStyle = useMapStyle((s) => s.mapStyle);
  const { colorMode } = useColorMode();

  const geojson = activeLayer?.data?.geojson;
  const fillLayerId = `${activeLayer.id}-fill`;
  const lineLayerId = `${activeLayer.id}-outline`;
  const sourceId = `${activeLayer.id}-source`;

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
    ? "#aaa"
    : plainDark
    ? "#888"
    : colorful
    ? "#777"
    : satellite
    ? "#ddd"
    : "#ccc";

  const fillColor = ["coalesce", ["get", "color"], defaultFillColor];
  const fillOpacity = 0.6;
  const isFillLayer = activeLayer.layer_type === "fill";
  const isLineLayer = activeLayer.layer_type === "line";

  const lastGeojsonRef = useRef<any>(null);

  const handleOnClickPolygon = useCallback(
    (event: any) => {
      if (!activeLayer.visible) return;
      const clickedFeature = event.features?.[0];
      if (!clickedFeature) {
        clearSelectedPolygon();
        return;
      }
      const clickedId = clickedFeature.properties?.id;
      const selectedId = selectedPolygon?.polygon?.properties?.id;
      if (selectedId === clickedId) {
        clearSelectedPolygon();
      } else {
        const clickedPolygon = geojson?.features?.find(
          (f) => f.properties?.id === clickedId
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
      activeLayer,
      activeWorkspace,
      selectedPolygon,
      geojson,
      themeConfig.primaryColorHex,
    ]
  );

  useEffect(() => {
    const map = mapRef?.current?.getMap();
    if (!map || !geojson) return;

    // Add/Update source
    const existingSource = map.getSource(sourceId);
    if (existingSource) {
      if (lastGeojsonRef.current !== geojson) {
        (existingSource as any).setData(geojson);
        lastGeojsonRef.current = geojson;
      }
    } else {
      map.addSource(sourceId, { type: "geojson", data: geojson });
      lastGeojsonRef.current = geojson;
    }

    // Add or update layers
    if (isFillLayer) {
      // Line
      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": defaultLineColor,
            "line-width": 1,
            "line-opacity": 1,
          },
        });
      }

      // Fill
      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: { "fill-color": fillColor, "fill-opacity": fillOpacity },
        });
      } else {
        map.setPaintProperty(fillLayerId, "fill-color", fillColor);
        map.setPaintProperty(fillLayerId, "fill-opacity", fillOpacity);
      }
    }

    if (isLineLayer) {
      // Line
      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": defaultLineColor,
            "line-width": 1,
            "line-opacity": 1,
            "line-dasharray": [3, 4],
          },
        });
      } else {
        map.setPaintProperty(lineLayerId, "line-opacity", 1);
      }

      // Invisible fill for click area
      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: { "fill-color": "#000", "fill-opacity": 0 },
        });
      }
    }

    // Event click (per layer)
    if (activeLayer.visible) {
      map.on("click", fillLayerId, handleOnClickPolygon);
    }

    return () => {
      map.off("click", fillLayerId, handleOnClickPolygon);
    };
  }, [
    geojson,
    activeLayer.visible,
    legend,
    themeConfig.primaryColorHex,
    fillColor,
    fillOpacity,
    colorway,
  ]);

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      const map = mapRef?.current?.getMap();
      if (!map) return;
      if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
      if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, []);

  return null;
};

export default LayerSource;

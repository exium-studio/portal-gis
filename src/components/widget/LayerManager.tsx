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

const LayerSource = ({ activeWorkspace, activeLayer }: LayerSourceProps) => {
  const { mapRef } = useMapViewState();
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );
  const { themeConfig } = useThemeConfig();
  const legends = useLegend((s) => s.legends);
  const legendType = "GUNATANAHK";

  const geojson = activeLayer?.data?.geojson;
  const defaultFillColor = "#9E9E9E";
  const defaultLineColor = "#ccc";
  const fillLayerId = `${activeLayer?.id}-fill`;
  const outlineLayerId = `${activeLayer?.id}-outline`;
  const sourceId = `${activeLayer?.id}-source`;
  const isFillLayer = activeLayer.layer_type === "fill";
  const isLineLayer = activeLayer.layer_type === "line";

  const handleOnClickPolygon = useCallback(
    (event: any) => {
      if (!activeLayer.visible) return;

      console.log(outlineLayerId);

      const clickedFeature = event.features?.[0];
      if (!clickedFeature) {
        clearSelectedPolygon();
        return;
      }

      console.log(clickedFeature);

      setSelectedPolygon({
        polygon: clickedFeature,
        activeLayer,
        activeWorkspace,
        fillColor: themeConfig.primaryColorHex,
      });
    },
    [selectedPolygon, activeWorkspace, activeLayer, themeConfig.primaryColorHex]
  );

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !activeLayer?.id || !geojson) return;

    // Source
    const existingSource = map.getSource(sourceId);
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
      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": [
              "match",
              ["get", legendType],
              ...legends.flatMap((legend) => [legend.label, legend.color]),
              defaultFillColor,
            ],
            "fill-opacity": activeLayer.visible ? 0.8 : 0,
          },
        });
      } else {
        map.setPaintProperty(
          fillLayerId,
          "fill-opacity",
          activeLayer.visible ? 0.8 : 0
        );
      }
    }

    // Outline layer
    if (isFillLayer || isLineLayer) {
      if (!map.getLayer(outlineLayerId)) {
        map.addLayer({
          id: outlineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": isLineLayer ? "orange" : defaultLineColor,
            "line-width": 1,
            "line-opacity": activeLayer.visible ? 1 : 0,
          },
        });
      } else {
        map.setPaintProperty(
          outlineLayerId,
          "line-opacity",
          activeLayer.visible ? 1 : 0
        );
      }
    }

    // Click handler
    if (activeLayer.visible) {
      map.on("click", fillLayerId, handleOnClickPolygon);
      map.on("click", outlineLayerId, handleOnClickPolygon);
    } else {
      map.off("click", fillLayerId, handleOnClickPolygon);
      map.off("click", outlineLayerId, handleOnClickPolygon);
    }

    return () => {
      map.off("click", fillLayerId, handleOnClickPolygon);
      map.off("click", outlineLayerId, handleOnClickPolygon);
    };
  }, [
    geojson,
    activeLayer?.id,
    activeLayer.visible,
    activeLayer.layer_type,
    legends,
    themeConfig.primaryColorHex,
  ]);

  useEffect(() => {
    return () => {
      const map = mapRef.current?.getMap();
      if (!map || !activeLayer?.id) return;
      if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
      if (map.getLayer(outlineLayerId)) map.removeLayer(outlineLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [activeLayer?.id]);

  return null;
};

const LayerManager = () => {
  const { mapRef } = useMapViewState();
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const { themeConfig } = useThemeConfig();

  useEffect(() => {
    const map = mapRef.current?.getMap();
    const selectedPolygonLayerId = "selected-polygon-fill";
    const selectedPolygonSourceId = "selected-polygon-source";

    if (!map) return;

    // Cleanup previous
    if (map.getLayer(selectedPolygonLayerId))
      map.removeLayer(selectedPolygonLayerId);
    if (map.getSource(selectedPolygonSourceId))
      map.removeSource(selectedPolygonSourceId);

    if (!selectedPolygon?.polygon) return;

    const selectedFeature = selectedPolygon.polygon;

    map.addSource(selectedPolygonSourceId, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [selectedFeature],
      },
      generateId: true,
    });

    map.addLayer({
      id: selectedPolygonLayerId,
      type: "fill",
      source: selectedPolygonSourceId,
      paint: {
        "fill-color": themeConfig.primaryColorHex,
        "fill-opacity": 0.6,
      },
      layout: {},
      minzoom: 0,
      maxzoom: 24,
    });

    // Always bring to front
    map.moveLayer(selectedPolygonLayerId);

    return () => {
      if (map.getLayer(selectedPolygonLayerId))
        map.removeLayer(selectedPolygonLayerId);
      if (map.getSource(selectedPolygonSourceId))
        map.removeSource(selectedPolygonSourceId);
    };
  }, [selectedPolygon, themeConfig.primaryColorHex]);

  return (
    <>
      {activeWorkspaces
        .filter((workspace) => workspace.visible)
        .flatMap((workspace) =>
          (workspace.layers || []).map((layer) => (
            <LayerSource
              key={`${workspace.id}-${layer.id}`}
              activeWorkspace={workspace}
              activeLayer={layer}
            />
          ))
        )}
    </>
  );
};

export default LayerManager;

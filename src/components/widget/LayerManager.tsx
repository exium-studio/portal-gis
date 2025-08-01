import {
  Interface__ActiveLayer,
  Interface__ActiveWorkspace,
} from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLegend from "@/context/useLegend";
import useMapViewState from "@/context/useMapViewState";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useCallback, useEffect, useMemo } from "react";

interface LayerSourceProps {
  activeWorkspace: Interface__ActiveWorkspace;
  activeLayer: Interface__ActiveLayer;
  layersToRender: any[];
}

const LayerSource = (props: LayerSourceProps) => {
  const { activeWorkspace, activeLayer } = props;
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
  const selectedFeatureId = selectedPolygon?.polygon?.properties?.id;
  const defaultFillColor = "#9E9E9E";
  const defaultLineColor = "#ccc";
  const fillLayerId = `${activeLayer?.id}-fill`;
  const outlineLayerId = `${activeLayer?.id}-outline`;
  const sourceId = `${activeLayer?.id}-source`;
  const fillLayer = activeLayer.layer_type === "fill";
  const lineLayer = activeLayer.layer_type === "line";

  const handleOnClickPolygon = useCallback(
    (event: any) => {
      const clickedFeature = event.features?.[0];
      if (!clickedFeature) {
        clearSelectedPolygon();
        return;
      }

      const alreadySelected =
        selectedFeatureId === clickedFeature?.properties?.id &&
        selectedPolygon?.activeWorkspace?.id === activeWorkspace?.id &&
        selectedPolygon?.activeLayer?.id === activeLayer?.id;

      if (alreadySelected) {
        clearSelectedPolygon();
      } else {
        setSelectedPolygon({
          activeWorkspace,
          activeLayer,
          polygon: clickedFeature,
          fillColor: themeConfig.primaryColorHex,
        });
      }
    },
    [selectedPolygon, activeWorkspace, activeLayer, themeConfig.primaryColorHex]
  );

  // Single comprehensive useEffect untuk handle semua layer operations
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !activeLayer?.id || !geojson || !activeLayer.visible) return;

    // Handle source
    const existingSource = map.getSource(sourceId);
    if (existingSource) {
      if ("setData" in existingSource) {
        existingSource.setData(geojson);
      }
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data: geojson,
      });
    }

    // Remove existing layers if any
    if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
    if (map.getLayer(outlineLayerId)) map.removeLayer(outlineLayerId);

    // Add new layers
    if (fillLayer) {
      map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "id"], selectedFeatureId || ""],
            themeConfig.primaryColorHex,
            [
              "match",
              ["get", legendType],
              ...legends.flatMap((legend) => [legend.label, legend.color]),
              defaultFillColor,
            ],
          ],
          "fill-opacity": 0.8,
        },
      });
    }

    if (fillLayer || lineLayer) {
      map.addLayer({
        id: outlineLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": defaultLineColor,
          "line-width": 1,
        },
      });
    }

    // Add event listeners
    map.on("click", fillLayerId, handleOnClickPolygon);

    return () => {
      map.off("click", fillLayerId, handleOnClickPolygon);
    };
  }, [
    geojson,
    activeLayer?.id,
    activeLayer?.visible,
    activeLayer?.layer_type,
    selectedFeatureId,
    themeConfig.primaryColorHex,
  ]);

  return null; // Render handled by Mapbox directly
};

const LayerManager = () => {
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);

  const layersToRender = useMemo(() => {
    return [...activeWorkspaces]
      .filter((workspace) => workspace.visible)
      .flatMap((workspace) =>
        (workspace.layers || [])
          .filter((layer) => layer.visible)
          .map((layer) => ({ workspace, layer }))
      );
  }, [activeWorkspaces]);

  // useEffect(() => {
  //   console.log("Active layers updated:", layersToRender.length);
  //   console.log("layersToRender", layersToRender);
  //   console.log("activeWorkspaces", activeWorkspaces);
  // }, [layersToRender]);

  return (
    <>
      {layersToRender.map(({ workspace, layer }) => {
        // console.log(`${workspace.id}-${layer.id}-${layer.visible}`);
        return (
          <LayerSource
            key={`${workspace.id}-${layer.id}-${layer.visible}`}
            activeWorkspace={workspace}
            activeLayer={layer}
            layersToRender={layersToRender}
          />
        );
      })}
    </>
  );
};

export default LayerManager;

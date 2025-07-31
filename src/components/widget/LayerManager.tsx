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
import { Layer, Source } from "react-map-gl/mapbox";

interface LayerSourceProps {
  activeWorkspace: Interface__ActiveWorkspace;
  activeLayer: Interface__ActiveLayer;
}

const LayerSource = (props: LayerSourceProps) => {
  // Props
  const { activeWorkspace, activeLayer } = props;

  // Contexts
  const { mapRef } = useMapViewState();
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );
  const { themeConfig } = useThemeConfig();
  const legends = useLegend((s) => s.legends);
  const legendType = "GUNATANAHK"; // properties key / column name

  // States
  const geojson = activeLayer?.data?.geojson;
  const selectedFeatureId = selectedPolygon?.polygon?.properties?.id;
  const defaultFillColor = "#808080";
  const defaultLineColor = "5E5E5E";
  const fillLayerId = `${activeLayer?.id}-fill`;
  const outlineLayerId = `${activeLayer?.id}-outline`;
  const sourceId = `${activeLayer?.id}-source`;
  const fillLayer = activeLayer.layer_type === "fill";
  const lineLayer = activeLayer.layer_type === "line";

  // Modified click handler
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
          activeWorkspace: activeWorkspace,
          activeLayer: activeLayer,
          polygon: clickedFeature,
          fillColor: themeConfig.primaryColorHex,
        });
      }
    },
    [selectedPolygon, activeWorkspace, activeLayer, themeConfig.primaryColorHex]
  );

  // Enhanced layer effect
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !activeLayer?.id) return;

    map.on("click", fillLayerId, handleOnClickPolygon);

    return () => {
      map.off("click", fillLayerId, handleOnClickPolygon);
    };
  }, [mapRef, handleOnClickPolygon, fillLayerId, activeLayer?.id]);

  if (!activeLayer.visible || !geojson) return null;

  return (
    <Source id={sourceId} type="geojson" data={geojson}>
      {fillLayer && (
        <Layer
          id={fillLayerId}
          type="fill"
          paint={{
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
          }}
        />
      )}
      {lineLayer && (
        <Layer
          id={outlineLayerId}
          type="line"
          paint={{
            "line-color": defaultLineColor,
            "line-width": 1,
          }}
        />
      )}
    </Source>
  );
};

const LayerManager = () => {
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);

  return (
    <>
      {activeWorkspaces
        .filter((activeWorkspace) => activeWorkspace.visible)
        .map((activeWorkspace) =>
          activeWorkspace.layers
            ?.filter((layer) => layer.visible)
            ?.map((activeLayer) => (
              <LayerSource
                key={`${activeWorkspace.id}-${activeLayer.id}`}
                activeWorkspace={activeWorkspace}
                activeLayer={activeLayer}
              />
            ))
        )}
    </>
  );
};

export default LayerManager;

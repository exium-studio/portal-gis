import useActiveLayers from "@/context/useActiveWorkspaces";
import useLegend from "@/context/useLegend";
import useMapViewState from "@/context/useMapViewState";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useCallback, useEffect } from "react";
import { Layer, Source } from "react-map-gl/mapbox";

const LayerSource = (props: any) => {
  // Props
  const { data } = props;

  // Contexts
  const { mapRef } = useMapViewState();
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );
  const { themeConfig } = useThemeConfig();
  const legends = useLegend((s) => s.legends);
  const legendType = "penggunaan"; // properties key / column name

  // States
  const layer = data?.layer;
  const geojson = data?.layer?.geojson;
  const selectedFeatureId = selectedPolygon?.polygon?.properties?.id;
  const defaultFillColor = "#808080";
  const defaultLineColor = "#ccc";
  const fillLayerId = `${layer?.layer_id}-fill`;
  const outlineLayerId = `${layer?.layer_id}-outline`;
  const sourceId = `${layer?.layer_id}-source`;

  // Modified click handler
  const handleOnClickPolygon = useCallback(
    (event: any) => {
      const clickedFeature = event.features?.[0];
      if (!clickedFeature) {
        clearSelectedPolygon();
        return;
      }

      // Use layer_id instead of id for consistency
      const isAlreadySelected =
        selectedPolygon?.polygon?.properties?.id ===
          clickedFeature?.properties?.id &&
        selectedPolygon?.polygon?.layer?.id === layer?.layer_id; // Changed here

      if (isAlreadySelected) {
        clearSelectedPolygon();
      } else {
        setSelectedPolygon({
          data: data,
          polygon: {
            ...clickedFeature,
            layer: { id: layer?.layer_id }, // Changed here
          },
          fillColor: themeConfig.primaryColorHex,
        });
      }
    },
    [selectedPolygon, layer?.layer_id, themeConfig.primaryColorHex]
  );

  // Enhanced layer effect
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !layer?.layer_id) return;

    map.on("click", fillLayerId, handleOnClickPolygon);

    return () => {
      map.off("click", fillLayerId, handleOnClickPolygon);
    };
  }, [mapRef, handleOnClickPolygon, fillLayerId]);

  return (
    <Source id={sourceId} type="geojson" data={geojson}>
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
      <Layer
        id={outlineLayerId}
        type="line"
        paint={{
          "line-color": defaultLineColor,
          "line-width": 1,
          // "line-opacity": 0.5,
        }}
      />
    </Source>
  );
};

const LayerManager = () => {
  const activeLayerGroups = useActiveLayers((s) => s.activeLayerGroups);

  return (
    <>
      {activeLayerGroups.map((data) => (
        <LayerSource key={data.layer.layer_id} data={data} />
      ))}
    </>
  );
};
export default LayerManager;

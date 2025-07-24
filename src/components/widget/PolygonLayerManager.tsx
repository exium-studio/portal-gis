import useActiveLayers from "@/context/useActiveLayers";
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
  const defaultColor = "#7e7e7e";

  // Utils
  const handleOnClickPolygon = useCallback(
    (event: any) => {
      const clickedFeature = event.features[0];
      if (!clickedFeature) {
        clearSelectedPolygon();
        return;
      }

      const isAlreadySelected =
        selectedPolygon?.polygon?.properties?.id ===
          clickedFeature?.properties?.id &&
        selectedPolygon?.polygon?.layer?.id === layer?.id;

      if (isAlreadySelected) {
        clearSelectedPolygon();
      } else {
        setSelectedPolygon({
          polygon: {
            ...clickedFeature,
            layer: { id: layer?.id },
          },
          fillColor: themeConfig.primaryColorHex,
        });
      }
    },
    [selectedPolygon, layer?.id, themeConfig.primaryColorHex]
  );

  // Handle onClick event
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.on("click", `${layer?.id}`, handleOnClickPolygon);

    return () => {
      map.off("click", `${layer?.id}`, handleOnClickPolygon);
    };
  }, [mapRef, handleOnClickPolygon, layer?.id]);

  return (
    <Source type="geojson" data={geojson}>
      <Layer
        id={`${layer?.id}`}
        type="fill"
        paint={{
          "fill-color": [
            "case",
            ["==", ["get", "id"], selectedFeatureId || ""],
            themeConfig.primaryColorHex,
            [
              "match",
              ["get", legendType], // Property to match against
              ...legends.flatMap((legend) => [legend.label, legend.color]),
              defaultColor,
            ],
          ],
          "fill-opacity": 0.8,
        }}
      />
      <Layer
        id={`${layer?.id}-outline`}
        type="line"
        paint={{
          "line-color": "#ccc",
          "line-width": 1,
        }}
        layout={{
          "line-cap": "round",
          "line-join": "round",
        }}
      />
    </Source>
  );
};

const PolygonLayerManager = () => {
  const activeLayerGroups = useActiveLayers((s) => s.activeLayerGroups);

  return (
    <>
      {activeLayerGroups?.map((data: any, i: number) => {
        return <LayerSource key={i} data={data} />;
      })}
    </>
  );
};

export default PolygonLayerManager;

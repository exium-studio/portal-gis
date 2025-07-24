import useActiveLayers from "@/context/useActiveLayers";
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

  // States
  const layer = data?.layer;
  const geojson = data?.layer?.geojson;
  // console.log("geojson", geojson);

  // Default fill color
  const defaultFillColor = "#7e7e7e";

  // Determine if current layer has selected polygon
  const selectedFeatureId = selectedPolygon?.polygon?.properties?.id;

  // Utils
  const handleOnClickPolygon = useCallback(
    (event: any) => {
      const clickedFeature = event.features[0];
      if (!clickedFeature) {
        clearSelectedPolygon();
        return;
      }

      // Check if clicked feature is already selected
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
            layer: { id: layer?.id }, // Store layer info with the feature
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
            themeConfig.primaryColorHex || "#000000",
            defaultFillColor,
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

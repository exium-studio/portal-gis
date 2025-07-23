import useActiveLayers from "@/context/useActiveLayers";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import useMapViewState from "@/context/useMapViewState";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useCallback, useEffect } from "react";
import { Layer, Source } from "react-map-gl/mapbox";

const LayerSource = (props: any) => {
  // Props
  const { data } = props;

  // Contexts
  const { mapRef } = useMapViewState();

  // const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );

  // States
  const { themeConfig } = useThemeConfig();
  const layer = data?.layers?.[0];
  const geojson = data?.layers?.[0]?.data;
  const fillColor = "#7e7e7e";

  // Utils
  const handleOnClickPolygon = useCallback(
    (event: any) => {
      const clickedFeature = event.features[0];
      if (!clickedFeature) {
        clearSelectedPolygon();
        return;
      }

      const fillColor = themeConfig.primaryColorHex;

      setSelectedPolygon({
        polygon: clickedFeature,
        fillColor: fillColor,
      });
    },
    [data]
  );

  // Handle onClick event
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.on("click", `${layer?.id}`, handleOnClickPolygon);

    return () => {
      map.off("click", `${layer?.id}`, handleOnClickPolygon);
    };
  }, [mapRef, handleOnClickPolygon]);

  return (
    <Source type="geojson" data={geojson}>
      <Layer
        id={`${layer?.id}`}
        type="fill"
        paint={{
          "fill-color": fillColor,
          // "fill-opacity": selectedGeoJSONKelurahan ? 0.1 : 0.8,
          "fill-opacity": 0.8,
        }}
      />
      <Layer
        id="all-kelurahan-layer-line"
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
      {activeLayerGroups?.map((layerGroup: any, i: number) => {
        return <LayerSource key={i} data={layerGroup} />;
      })}
    </>
  );
};

export default PolygonLayerManager;

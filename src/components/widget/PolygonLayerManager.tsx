import useActiveLayers from "@/context/useActiveLayers";
import { Layer, Source } from "react-map-gl/mapbox";

const LayerSource = (props: any) => {
  // Props
  const { data } = props;

  // States
  const layerData = data?.layers?.[0];
  const geojson = data?.layers?.[0]?.data;

  console.log(layerData?.visible);

  return (
    <Source type="geojson" data={geojson}>
      <Layer
        id="all-kelurahan-layer-fill"
        type="fill"
        paint={{
          "fill-color": ["get", "fillColor"],
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

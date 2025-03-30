import { Source, Layer } from "react-map-gl/mapbox";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { ABS_COLORS } from "@/constants/colors";

interface Props {
  data: {
    id: number;
    location: { lon: number; lat: number };
  }[];
}

const KKLayer = ({ data }: Props) => {
  const kkGeoJSON: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: data.map((item) => ({
      type: "Feature",
      properties: { id: item.id },
      geometry: {
        type: "Point",
        coordinates: [item.location.lon, item.location.lat],
      },
    })),
  };

  return (
    <Source id="kk-data" type="geojson" data={kkGeoJSON}>
      <Layer
        id="kk-layer"
        type="circle"
        paint={{
          "circle-radius": 3,
          "circle-color": ABS_COLORS.blue,
        }}
      />
    </Source>
  );
};

export default KKLayer;

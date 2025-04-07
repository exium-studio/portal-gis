import { Source, Layer } from "react-map-gl/mapbox";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { ABS_COLORS } from "@/constants/colors";

interface Props {
  data: {
    id: number;
    status: string;
    location: { lon: number; lat: number };
  }[];
}

const KKLayer = ({ data }: Props) => {
  const geoJSONData: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: data.map((item) => ({
      type: "Feature",
      properties: { id: item.id, status: item.status },
      geometry: {
        type: "Point",
        coordinates: [item.location.lon, item.location.lat],
      },
    })),
  };

  return (
    <Source id="kk-data" type="geojson" data={geoJSONData}>
      <Layer
        id="kk-layer"
        type="circle"
        paint={{
          "circle-radius": 10,
          // "circle-color": [
          //   "case",
          //   ["==", ["get", "status"], "poor"],
          //   ABS_COLORS.light_blue,
          //   ABS_COLORS.blue,
          // ],
          "circle-color": ABS_COLORS.blue,
        }}
      />
    </Source>
  );
};

export default KKLayer;

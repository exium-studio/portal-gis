import { Source, Layer } from "react-map-gl/mapbox";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { ABS_COLORS } from "@/constants/colors";

interface Props {
  data: {
    id: number;
    location: { lon: number; lat: number };
  }[];
}

const FacilityLayer = ({ data }: Props) => {
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
    <Source id="facility-data" type="geojson" data={kkGeoJSON}>
      <Layer
        id="facility-layer"
        type="circle"
        paint={{
          "circle-radius": 5,
          "circle-color": ABS_COLORS.orange,
        }}
      />
    </Source>
  );
};

export default FacilityLayer;

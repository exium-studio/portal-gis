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
  const geoJSONDataDot: FeatureCollection<Geometry, GeoJsonProperties> = {
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

  // const size = 0.00005;
  // const geoJSONData3d: FeatureCollection<Geometry, GeoJsonProperties> = {
  //   type: "FeatureCollection",
  //   features: data.map((item) => ({
  //     type: "Feature",
  //     properties: { id: item.id, height: 10 },
  //     geometry: {
  //       type: "Polygon",
  //       coordinates: [
  //         [
  //           [item.location.lon - size, item.location.lat - size], // left bottom
  //           [item.location.lon + size, item.location.lat - size], // right bototm
  //           [item.location.lon + size, item.location.lat + size], // right top
  //           [item.location.lon - size, item.location.lat + size], // left top
  //           [item.location.lon - size, item.location.lat - size], // close loop
  //         ],
  //       ],
  //     },
  //   })),
  // };

  return (
    <Source id="facility-data-3d" type="geojson" data={geoJSONDataDot}>
      <Layer
        id="facility-layer"
        type="circle"
        paint={{
          "circle-radius": 10,
          "circle-color": ABS_COLORS.orange,
        }}
      />
    </Source>

    //  <Source id="facility-data-3d" type="geojson" data={geoJSONData3d}>
    //   <Layer
    //     id="facility-layer"
    //     type="fill-extrusion"
    //     paint={{
    //       "fill-extrusion-color": ABS_COLORS.orange,
    //       "fill-extrusion-height": ["get", "height"],
    //       "fill-extrusion-base": 0,
    //       "fill-extrusion-opacity": 0.9,
    //     }}
    //   />
    // </Source>
  );
};

export default FacilityLayer;

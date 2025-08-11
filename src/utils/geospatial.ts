import { Interface__ActiveLayer } from "@/constants/interfaces";
import * as turf from "@turf/turf";

/**
 * Extract all features with Turf-supported geometries (Point, LineString, Polygon, etc.)
 */
function extractSupportedFeatures(
  geojson: GeoJSON.FeatureCollection
): GeoJSON.Feature[] {
  const supportedFeatures: GeoJSON.Feature[] = [];

  geojson.features.forEach((feature) => {
    if (
      feature.geometry &&
      (feature.geometry.type === "Point" ||
        feature.geometry.type === "LineString" ||
        feature.geometry.type === "Polygon" ||
        feature.geometry.type === "MultiPoint" ||
        feature.geometry.type === "MultiLineString" ||
        feature.geometry.type === "MultiPolygon")
    ) {
      supportedFeatures.push(feature);
    }
  });

  return supportedFeatures;
}

/**
 * Compute BBOX and center from GeoJSON collections
 */
export function computeBboxAndCenter(
  featureCollections: GeoJSON.FeatureCollection[]
) {
  // Collect all supported features
  const allFeatures: GeoJSON.Feature[] = [];
  featureCollections.forEach((collection) => {
    allFeatures.push(...extractSupportedFeatures(collection));
  });

  if (allFeatures.length === 0) {
    return { bbox: undefined, center: undefined };
  }

  // Calculate outermost BBOX
  const bbox = turf.bbox(turf.featureCollection(allFeatures));

  // Calculate center point
  const center = turf.center(turf.featureCollection(allFeatures)).geometry
    .coordinates;

  return { bbox, center };
}

export function computeCombinedBboxAndCenterFromActiveWorkspace(activeWorkspace: {
  workspaces: { layers?: Interface__ActiveLayer[] }[];
}) {
  const featureCollections: GeoJSON.FeatureCollection[] = [];

  activeWorkspace.workspaces.forEach((workspace) => {
    workspace.layers?.forEach((layer) => {
      if (layer.data?.geojson) {
        featureCollections.push(layer.data.geojson);
      }
    });
  });

  return computeBboxAndCenter(featureCollections);
}

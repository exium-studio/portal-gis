import { useMemo } from "react";
import { normalizeKeys } from "@/utils/normalizeKeys";
import { FilterGeoJSON } from "@/constants/types";

function applyGeoJSONFilter(
  geojson: GeoJSON.FeatureCollection,
  filter: Record<string, string[]>
): GeoJSON.FeatureCollection {
  if (!filter || Object.keys(filter).length === 0) return geojson;

  const normalizedFilter = normalizeKeys(filter);

  const filteredFeatures = geojson.features.filter((feature) => {
    const props = normalizeKeys(feature.properties || {});

    return Object.entries(normalizedFilter).every(([key, blockedValues]) => {
      if (!blockedValues || blockedValues.length === 0) return true;
      const value = props[key];
      return !blockedValues.includes(value);
    });
  });

  return { ...geojson, features: filteredFeatures };
}

export default function useFilteredGeoJSON(
  geojson: GeoJSON.FeatureCollection | undefined,
  filter: FilterGeoJSON | Record<string, string[]>
) {
  return useMemo(() => {
    if (!geojson) return null;
    return applyGeoJSONFilter(geojson, filter || {});
  }, [geojson, filter]);
}

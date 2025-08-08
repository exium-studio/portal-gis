import {
  Interface__ActiveWorkspace,
  Interface__FilterOptionGroup,
  Interface__FilterOptionValue,
} from "@/constants/interfaces";
import { FilterGeoJSON } from "@/context/useFilterGeoJSON";

const FILTER_KEYS: (keyof FilterGeoJSON)[] = [
  "KABUPATEN",
  "TIPEHAK",
  "GUNATANAHK",
];

const norm = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function filterOptionGroups(
  activeWorkspaces: Interface__ActiveWorkspace[],
  current: FilterGeoJSON
): Interface__FilterOptionGroup[] {
  // Kumpulkan unik per property
  const buckets: Record<keyof FilterGeoJSON, Set<string>> = {
    KABUPATEN: new Set(),
    TIPEHAK: new Set(),
    GUNATANAHK: new Set(),
  };

  for (const ws of activeWorkspaces ?? []) {
    for (const layer of ws.layers ?? []) {
      const features = layer.data?.geojson?.features ?? [];
      for (const f of features) {
        const props = (f?.properties ?? {}) as Record<string, unknown>;
        for (const key of FILTER_KEYS) {
          const val = norm(props[key]);
          if (val) buckets[key].add(val);
        }
      }
    }
  }

  const byAsc = (a: string, b: string) =>
    a.localeCompare(b, "id", { sensitivity: "base" });

  // Bentuk output + tandai active dari state
  const groups: Interface__FilterOptionGroup[] = FILTER_KEYS.map((key) => {
    const uniqueValues = Array.from(buckets[key]).sort(byAsc);
    const activeList = new Set(current?.[key] ?? []);
    const values: Interface__FilterOptionValue[] = uniqueValues.map((v) => ({
      value: v,
      active: activeList.has(v),
    }));
    return { property: key, values };
  });

  return groups;
}

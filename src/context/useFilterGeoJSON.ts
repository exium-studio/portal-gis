import { create } from "zustand";

export type FilterGeoJSON = {
  KABUPATEN: string[];
  TIPEHAK: string[];
  GUNATANAHK: string[];
};

type Store = {
  filterGeoJSON: FilterGeoJSON;
  setFilterGeoJSON: (data: FilterGeoJSON) => void;
  addFilterGeoJSON: (data: Partial<FilterGeoJSON>) => void;
  removeFilterGeoJSON: (key: keyof FilterGeoJSON, value: string) => void;
  clearFilterGeoJSON: () => void;
};

const DEFAULT: FilterGeoJSON = {
  KABUPATEN: [],
  TIPEHAK: [],
  GUNATANAHK: [],
};

const uniq = (arr: string[]) => Array.from(new Set(arr));

export const useFilterGeoJSON = create<Store>((set) => ({
  filterGeoJSON: DEFAULT,

  setFilterGeoJSON: (data) => set({ filterGeoJSON: { ...DEFAULT, ...data } }),

  addFilterGeoJSON: (data) =>
    set((s) => {
      const next: FilterGeoJSON = { ...s.filterGeoJSON };
      let changed = false;

      (Object.keys(data) as (keyof FilterGeoJSON)[]).forEach((k) => {
        const incoming = data[k] ?? [];
        const combined = uniq([...(s.filterGeoJSON[k] ?? []), ...incoming]);
        if (
          combined.length !== s.filterGeoJSON[k]?.length ||
          combined.some((val, idx) => val !== s.filterGeoJSON[k][idx])
        ) {
          next[k] = combined;
          changed = true;
        } else {
          next[k] = s.filterGeoJSON[k];
        }
      });

      if (!changed) return s; // no changes, skip set

      return { filterGeoJSON: next };
    }),

  removeFilterGeoJSON: (key, value) =>
    set((s) => {
      const current = s.filterGeoJSON[key] ?? [];
      const filtered = current.filter((v) => v !== value);
      if (filtered.length === current.length) return s; // nothing changed
      return { filterGeoJSON: { ...s.filterGeoJSON, [key]: filtered } };
    }),

  clearFilterGeoJSON: () => set({ filterGeoJSON: { ...DEFAULT } }),
}));

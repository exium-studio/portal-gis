import { create } from "zustand";

export type FilterGeoJSON = {
  KABUPATEN: string[];
  TIPEHAK: string[];
  GUNATANAHK: string[];
};

type Store = {
  confirmFilterGeoJSON: FilterGeoJSON;
  confirmDefaultFilterGeoJSON: FilterGeoJSON;
  setConfirmFilterGeoJSON: (data: FilterGeoJSON) => void;
  addConfirmFilterGeoJSON: (data: Partial<FilterGeoJSON>) => void;
  removeConfirmFilterGeoJSON: (key: keyof FilterGeoJSON, value: string) => void;
  clearConfirmFilterGeoJSON: () => void;
};

const DEFAULT: FilterGeoJSON = {
  KABUPATEN: [],
  TIPEHAK: [],
  GUNATANAHK: [],
};

const uniq = (arr: string[]) => Array.from(new Set(arr));

export const useConfirmFilterGeoJSON = create<Store>((set) => ({
  confirmFilterGeoJSON: DEFAULT,

  confirmDefaultFilterGeoJSON: DEFAULT,

  setConfirmFilterGeoJSON: (data) =>
    set({ confirmFilterGeoJSON: { ...DEFAULT, ...data } }),

  addConfirmFilterGeoJSON: (data) =>
    set((s) => {
      const next: FilterGeoJSON = { ...s.confirmFilterGeoJSON };
      let changed = false;

      (Object.keys(data) as (keyof FilterGeoJSON)[]).forEach((k) => {
        const incoming = data[k] ?? [];
        const combined = uniq([
          ...(s.confirmFilterGeoJSON[k] ?? []),
          ...incoming,
        ]);
        if (
          combined.length !== s.confirmFilterGeoJSON[k]?.length ||
          combined.some((val, idx) => val !== s.confirmFilterGeoJSON[k][idx])
        ) {
          next[k] = combined;
          changed = true;
        } else {
          next[k] = s.confirmFilterGeoJSON[k];
        }
      });

      if (!changed) return s; // no changes, skip set

      return { confirmFilterGeoJSON: next };
    }),

  removeConfirmFilterGeoJSON: (key, value) =>
    set((s) => {
      const current = s.confirmFilterGeoJSON[key] ?? [];
      const filtered = current.filter((v) => v !== value);
      if (filtered.length === current.length) return s; // nothing changed
      return {
        confirmFilterGeoJSON: { ...s.confirmFilterGeoJSON, [key]: filtered },
      };
    }),

  clearConfirmFilterGeoJSON: () =>
    set({ confirmFilterGeoJSON: { ...DEFAULT } }),
}));

import { create } from "zustand";

const STORAGE_KEY = "basemap";
const DEFAULT = {
  road: true,
  water: true,
  building: true,
};

interface Props {
  basemap: any;
  setBasemap: (newState: any) => void;
}

const useBasemap = create<Props>((set) => {
  const getStoredFormat = (): any => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as any;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT));
    } catch (error) {
      console.error("Failed to access basemap from localStorage:", error);
    }
    return DEFAULT;
  };

  return {
    basemap: getStoredFormat(),
    setBasemap: (newState) =>
      set((state) => {
        if (state.basemap !== newState) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
          return { basemap: newState };
        }
        return state;
      }),
  };
});

export default useBasemap;

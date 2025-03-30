import MAP_STYLES from "@/constants/mapsStylesOptions";
import { create } from "zustand";

const STORAGE_KEY = "mapStyle";
const DEFAULT = MAP_STYLES[0];

interface Props {
  mapStyle: (typeof MAP_STYLES)[0];
  setMapStyle: (newState: Props["mapStyle"]) => void;
}

const useMapStyle = create<Props>((set) => {
  let initial: Props["mapStyle"] = DEFAULT;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      initial = JSON.parse(stored);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT));
    }
  } catch (error) {
    console.error("Failed to parse map style from localStorage:", error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT));
  }

  return {
    mapStyle: initial,
    setMapStyle: (newState) =>
      set(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        return { mapStyle: newState };
      }),
  };
});

export default useMapStyle;

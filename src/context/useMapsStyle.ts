import MAP_STYLES from "@/constants/mapsStylesOptions";
import { create } from "zustand";

const STORAGE_KEY = "mapStyle";
const DEFAULT = MAP_STYLES[0];

interface Props {
  mapsStyle: (typeof MAP_STYLES)[0];
  setMapsStyle: (newState: Props["mapsStyle"]) => void;
}

const useMapStyle = create<Props>((set) => {
  let initial: Props["mapsStyle"] = DEFAULT;

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
    mapsStyle: initial,
    setMapsStyle: (newState) =>
      set(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        return { mapsStyle: newState };
      }),
  };
});

export default useMapStyle;

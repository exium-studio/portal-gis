import { Interface__Gens } from "@/constant/interfaces";
import { LAYOUT_OPTIONS } from "@/constant/layoutOptions";
import { create } from "zustand";

const STORAGE_KEY = "layout";
const DEFAULT = LAYOUT_OPTIONS[0];

interface Props {
  layout: Interface__Gens;
  setLayout: (newState: Interface__Gens) => void;
}

const useLayout = create<Props>((set) => {
  const getStoredFormat = (): Interface__Gens => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Interface__Gens;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT));
    } catch (error) {
      console.error("Failed to access layout from localStorage:", error);
    }
    return DEFAULT;
  };

  return {
    layout: getStoredFormat(),
    setLayout: (newState) =>
      set((state) => {
        if (state.layout !== newState) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
          return { layout: newState };
        }
        return state;
      }),
  };
});

export default useLayout;

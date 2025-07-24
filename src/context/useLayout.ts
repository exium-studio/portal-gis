import { Interface__Gens } from "@/constants/interfaces";
import { LAYOUT_OPTIONS } from "@/constants/layoutOptions";
import { create } from "zustand";

const STORAGE_KEY = "layout";
const DEFAULT = LAYOUT_OPTIONS[0];

interface Props {
  layout: Interface__Gens;
  setLayout: (newState: Interface__Gens) => void;

  // Derived states
  fullPanel: boolean;
  halfPanel: boolean;
  closedPanel: boolean;
}

const useLayout = create<Props>((set, get) => {
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

  const setLayout = (newState: Interface__Gens) => {
    const shouldUpdate = get().layout.id !== newState.id;
    if (shouldUpdate) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      set(() => ({
        layout: newState,
        fullPanel: newState.id === 2,
        halfPanel: newState.id === 1,
        closedPanel: newState.id === 3,
      }));
    }
  };

  const initialLayout = getStoredFormat();

  return {
    layout: initialLayout,
    setLayout,
    halfPanel: initialLayout.id === 1,
    fullPanel: initialLayout.id === 2,
    closedPanel: initialLayout.id === 3,
  };
});

export default useLayout;

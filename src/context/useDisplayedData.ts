import DATA_DISPLAYED_LIST from "@/static/displayedDataList";
import { Interface__Gens } from "@/constants/interfaces";
import { create } from "zustand";

const STORAGE_KEY = "dataDisplayed";
const DEFAULT = DATA_DISPLAYED_LIST.filter((item) => !item.disabled);

interface Props {
  displayedData: Interface__Gens[];
  setDisplayedData: (newState: Interface__Gens[]) => void;
}

const useDisplayedData = create<Props>((set) => {
  const getStoredFormat = (): Interface__Gens[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Interface__Gens[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT));
    } catch (error) {
      console.error("Failed to access displayedData from localStorage:", error);
    }
    return DEFAULT;
  };

  return {
    displayedData: getStoredFormat(),
    setDisplayedData: (newState) =>
      set((state) => {
        if (state.displayedData !== newState) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
          return { displayedData: newState };
        }
        return state;
      }),
  };
});

export default useDisplayedData;

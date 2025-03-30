import { create } from "zustand";

const STORAGE_KEY = "displayedData";
const DEFAULT = {
  kk: true,
  facility: true,
  environment: true,
  infrastructure: true,
  village_asset: true,
  land_field: false,
};

interface Props {
  displayedData: any;
  setDisplayedData: (newState: any) => void;
}

const useDisplayedData = create<Props>((set) => {
  const getStoredFormat = (): any => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as any;
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

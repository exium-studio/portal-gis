import { create } from "zustand";

const STORAGE_KEY = "mapStyle";
const DEFAULT = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

interface Props {
  mapStyle: string;
  setMapStyle: (newState: string) => void;
}

const useMapStyle = create<Props>((set) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) localStorage.setItem(STORAGE_KEY, DEFAULT);
  const initial = stored ? stored : DEFAULT;

  return {
    mapStyle: initial,
    setMapStyle: (newState) =>
      set(() => {
        localStorage.setItem(STORAGE_KEY, newState);
        return {
          mapStyle: newState,
        };
      }),
  };
});

export default useMapStyle;

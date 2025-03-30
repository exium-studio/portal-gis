import { create } from "zustand";

const minZoom = 0;
const maxZoom = 22;

interface State_Actions {
  mapZoomPercent: number;
  setMapZoomPercent: (newState: any) => void;
}

const useMapsZoom = create<State_Actions>((set) => {
  return {
    mapZoomPercent: ((3 - minZoom) / (maxZoom - minZoom)) * 100,
    setMapZoomPercent: (newState: any) => set({ mapZoomPercent: newState }),
  };
});

export default useMapsZoom;

import { create } from "zustand";

const minZoom = 0;
const maxZoom = 22;

interface State_Actions {
  zoomPercent: number;
  setZoomPercent: (newState: any) => void;
}

const useMapsZoom = create<State_Actions>((set) => {
  return {
    zoomPercent: ((3 - minZoom) / (maxZoom - minZoom)) * 100,
    setZoomPercent: (newState: any) => set({ zoomPercent: newState }),
  };
});

export default useMapsZoom;

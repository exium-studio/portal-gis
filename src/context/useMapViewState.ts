import { create } from "zustand";

const DEFAULT_MAPS_VIEW_STATE = {
  latitude: 1.831874664,
  longitude: 98.745963431,
  zoom: 6,
};

interface Props {
  mapRef: any;
  setMapRef: (newState: any) => void;
  mapViewState: any;
  setMapViewState: (newState: Partial<typeof DEFAULT_MAPS_VIEW_STATE>) => void;
}

const useMapViewState = create<Props>((set) => ({
  mapRef: null,
  setMapRef: (newState) =>
    set(() => ({
      mapRef: newState,
    })),
  mapViewState: DEFAULT_MAPS_VIEW_STATE,
  setMapViewState: (newState) =>
    set((state) => ({
      mapViewState: { ...state.mapViewState, ...newState },
    })),
}));

export default useMapViewState;

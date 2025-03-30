import { create } from "zustand";

const DEFAULT_MAPS_VIEW_STATE = {
  latitude: -2.5489,
  longitude: 118.0149,
  zoom: 3,
};

interface Props {
  mapRef: any;
  setMapRef: (newState: any) => void;
  mapViewState: typeof DEFAULT_MAPS_VIEW_STATE;
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

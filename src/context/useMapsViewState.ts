import { create } from "zustand";

const DEFAULT_MAPS_VIEW_STATE = {
  latitude: -2.5489,
  longitude: 118.0149,
  zoom: 3,
};

interface Props {
  mapRef: any;
  setMapRef: (newState: any) => void;
  mapsViewState: typeof DEFAULT_MAPS_VIEW_STATE;
  setMapsViewState: (newState: Partial<typeof DEFAULT_MAPS_VIEW_STATE>) => void;
}

const useMapsViewState = create<Props>((set) => ({
  mapRef: null,
  setMapRef: (newState) =>
    set(() => ({
      mapRef: newState,
    })),
  mapsViewState: DEFAULT_MAPS_VIEW_STATE,
  setMapsViewState: (newState) =>
    set((state) => ({
      mapsViewState: { ...state.mapsViewState, ...newState },
    })),
}));

export default useMapsViewState;

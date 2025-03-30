import { create } from "zustand";

const ACTIVE_MAP_STYLE_DEFAULT =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

interface MapStyleState {
  activeMapStyle: any;
  setActiveMapStyle: (style: any) => void;
}

const useActiveMapStyle = create<MapStyleState>((set) => ({
  activeMapStyle: ACTIVE_MAP_STYLE_DEFAULT,
  setActiveMapStyle: (style) => set({ activeMapStyle: style }),
}));

export default useActiveMapStyle;

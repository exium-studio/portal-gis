import { create } from "zustand";

interface WMSLayer {
  id: string;
  url: string;
  layers: string;
  workspaceId: string;
  opacity: number;
  visible: boolean;
}

interface WMSLayerState {
  activeLayers: WMSLayer[];
  addLayer: (layer: Omit<WMSLayer, "id">) => void;
  removeLayer: (id: string) => void;
  toggleLayer: (id: string) => void;
  updateOpacity: (id: string, opacity: number) => void;
}

const useActiveWMSLayers = create<WMSLayerState>((set) => ({
  activeLayers: [],

  addLayer: (layer) =>
    set((state) => ({
      activeLayers: [
        ...state.activeLayers,
        { ...layer, id: Date.now().toString() },
      ],
    })),

  removeLayer: (id) =>
    set((state) => ({
      activeLayers: state.activeLayers.filter((l) => l.id !== id),
    })),

  toggleLayer: (id) =>
    set((state) => ({
      activeLayers: state.activeLayers.map((l) =>
        l.id === id ? { ...l, visible: !l.visible } : l
      ),
    })),

  updateOpacity: (id, opacity) =>
    set((state) => ({
      activeLayers: state.activeLayers.map((l) =>
        l.id === id ? { ...l, opacity } : l
      ),
    })),
}));

export default useActiveWMSLayers;

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
  addLayer: (layer: Omit<WMSLayer, "id">) => {
    success: boolean;
    message: string;
  };
  removeLayer: (id: string) => void;
  toggleLayer: (id: string) => void;
  updateOpacity: (id: string, opacity: number) => void;
  layerExists: (url: string, layers: string) => boolean;
}

const useActiveWMSLayers = create<WMSLayerState>((set, get) => ({
  activeLayers: [],

  // Fungsi pengecekan layer exist
  layerExists: (url, layers) => {
    return get().activeLayers.some((l) => l.url === url && l.layers === layers);
  },

  // Add layer dengan validasi
  addLayer: (layer) => {
    const { url, layers } = layer;

    if (get().layerExists(url, layers)) {
      return {
        success: false,
        message: "Layer dengan URL dan nama layers yang sama sudah ada",
      };
    }

    set((state) => ({
      activeLayers: [
        ...state.activeLayers,
        { ...layer, id: Date.now().toString() },
      ],
    }));

    return { success: true, message: "Layer berhasil ditambahkan" };
  },

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

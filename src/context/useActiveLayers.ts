import { create } from "zustand";

interface Layer {
  layer_id: string | number;
  layer_name: string;
  description?: string;
  table_name?: string;
  geojson: any;
  visible?: boolean;
}

interface Workspace {
  id: string | number;
  [key: string]: any; // additional workspace properties
}

interface LayerGroup {
  workspace: Workspace;
  layers: Layer[]; // Changed from single layer to array of layers
  visible: boolean;
}

interface GeoJSONLayerState {
  activeLayerGroups: LayerGroup[]; // Renamed to better reflect the structure
  addLayerGroup: (group: LayerGroup) => void;
  addLayerToGroup: (workspaceId: string | number, layer: Layer) => void;
  toggleGroupVisibility: (workspaceId: string | number) => void;
  toggleLayerVisibility: (
    workspaceId: string | number,
    layer_id: string | number
  ) => void;
  updateLayerData: (
    workspaceId: string | number,
    layer_id: string | number,
    data: any
  ) => void;
  removeLayer: (
    workspaceId: string | number,
    layer_id: string | number
  ) => void;
  removeLayerGroup: (workspaceId: string | number) => void;
  clearAllLayers: () => void;
}

const useActiveLayers = create<GeoJSONLayerState>((set) => ({
  activeLayerGroups: [],

  // Add a new layer group with initial layers
  addLayerGroup: (newGroup) =>
    set((state) => {
      const groupExists = state.activeLayerGroups.some(
        (g) => g.workspace.id === newGroup.workspace.id
      );

      if (groupExists) {
        console.warn(`Workspace ${newGroup.workspace.id} already exists`);
        return state;
      }

      return {
        activeLayerGroups: [
          ...state.activeLayerGroups,
          {
            ...newGroup,
            visible: true,
            layers: newGroup.layers.map((layer) => ({
              ...layer,
              visible: true,
            })),
          },
        ],
      };
    }),

  // Add layer to existing group
  addLayerToGroup: (workspaceId, newLayer) =>
    set((state) => ({
      activeLayerGroups: state.activeLayerGroups.map((group) => {
        if (group.workspace.id !== workspaceId) return group;

        const layerExists = group.layers.some(
          (l) => l.layer_id === newLayer.layer_id
        );

        if (layerExists) {
          console.warn(
            `Layer ${newLayer.layer_id} already exists in workspace ${workspaceId}`
          );
          return group;
        }

        return {
          ...group,
          layers: [...group.layers, { ...newLayer, visible: true }],
        };
      }),
    })),

  // Toggle entire group visibility
  toggleGroupVisibility: (workspaceId) =>
    set((state) => ({
      activeLayerGroups: state.activeLayerGroups.map((group) =>
        group.workspace.id === workspaceId
          ? { ...group, visible: !group.visible }
          : group
      ),
    })),

  // Toggle specific layer visibility within a group
  toggleLayerVisibility: (workspaceId, layer_id) =>
    set((state) => ({
      activeLayerGroups: state.activeLayerGroups.map((group) => {
        if (group.workspace.id !== workspaceId) return group;

        return {
          ...group,
          layers: group.layers.map((layer) =>
            layer.layer_id === layer_id
              ? { ...layer, visible: !layer.visible }
              : layer
          ),
        };
      }),
    })),

  // TODO layer id gausah karna dah pasti index 0
  // Update layer data
  updateLayerData: (workspaceId, layer_id, data) =>
    set((state) => ({
      activeLayerGroups: state.activeLayerGroups.map((group) => {
        if (group.workspace.id !== workspaceId) return group;

        return {
          ...group,
          layers: group.layers.map((layer) =>
            layer.layer_id === layer_id ? { ...layer, geojson: data } : layer
          ),
        };
      }),
    })),

  // Remove entire layer group
  removeLayerGroup: (workspaceId) =>
    set((state) => ({
      activeLayerGroups: state.activeLayerGroups.filter(
        (g) => g.workspace.id !== workspaceId
      ),
    })),

  // Remove specific layer from group
  removeLayer: (workspaceId, layer_id) =>
    set((state) => ({
      activeLayerGroups: state.activeLayerGroups.map((group) => {
        if (group.workspace.id !== workspaceId) return group;

        return {
          ...group,
          layers: group.layers.filter((l) => l.layer_id !== layer_id),
        };
      }),
    })),

  // Clear all layer groups
  clearAllLayers: () => set({ activeLayerGroups: [] }),
}));

export default useActiveLayers;

import { create } from "zustand";

interface Layer {
  layer_id: string | number;
  layer_name: string;
  description?: string;
  table_name?: string;
  data: any;
  visible?: boolean;
}

interface Workspace {
  id: string | number;
  [key: string]: any; // additional workspace properties
}

interface LayerGroup {
  workspace: Workspace;
  layer: Layer;
  visible: boolean;
}

interface GeoJSONLayerState {
  activeLayerGroups: LayerGroup[];
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

  // Add a new layer group with initial layer
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
            visible: newGroup.visible !== undefined ? newGroup.visible : true,
          },
        ],
      };
    }),

  // Add layer to existing group by creating a new group with the same workspace
  addLayerToGroup: (workspaceId, newLayer) =>
    set((state) => ({
      activeLayerGroups: [
        ...state.activeLayerGroups.filter(
          (g) => g.workspace.id !== workspaceId
        ),
        ...state.activeLayerGroups
          .filter((g) => g.workspace.id === workspaceId)
          .map((group) => ({
            ...group,
            layer: newLayer,
          })),
      ],
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
        if (
          group.workspace.id !== workspaceId ||
          group.layer.layer_id !== layer_id
        ) {
          return group;
        }

        return {
          ...group,
          layer: {
            ...group.layer,
            visible: !group.layer.visible,
          },
        };
      }),
    })),

  // Update layer data
  updateLayerData: (workspaceId, layer_id, data) =>
    set((state) => ({
      activeLayerGroups: state.activeLayerGroups.map((group) => {
        if (
          group.workspace.id !== workspaceId ||
          group.layer.layer_id !== layer_id
        ) {
          return group;
        }

        return {
          ...group,
          layer: {
            ...group.layer,
            data: data,
          },
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

  // Remove specific layer from group (which removes the entire group since each group has only one layer)
  removeLayer: (workspaceId, layer_id) =>
    set((state) => ({
      activeLayerGroups: state.activeLayerGroups.filter(
        (group) =>
          group.workspace.id !== workspaceId ||
          group.layer.layer_id !== layer_id
      ),
    })),

  // Clear all layer groups
  clearAllLayers: () => set({ activeLayerGroups: [] }),
}));

export default useActiveLayers;

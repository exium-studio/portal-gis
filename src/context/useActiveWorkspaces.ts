import {
  Interface__ActiveWorkspace,
  Interface__Layer,
  Interface__LayerData,
} from "@/constants/interfaces";
import { create } from "zustand";

interface Interface__ActiveWorkspaces {
  activeWorkspaces: Interface__ActiveWorkspace[];
  loadWorkspace: (newWorkspace: Interface__ActiveWorkspace) => void;
  addLayerToActiveWorkspace: (
    workspaceId: string,
    layer: Interface__Layer
  ) => void;
  toggleActiveWorkspaceVisibility: (workspaceId: string) => void;
  toggleLayerVisibility: (workspaceId: string, layerId: number) => void;
  updateLayerData: (
    workspaceId: string,
    layerId: number,
    data: Interface__LayerData
  ) => void;
  removeLayer: (workspaceId: string, layerId: number) => void;
  unloadWorkspace: (workspaceId: string) => void;
  clearAllWorkspaces: () => void;
  workspaceActive: (workspaceId: string) => boolean;
  getActiveWorkspace: (
    workspaceId: string
  ) => Interface__ActiveWorkspace | undefined;
  // New z-index management functions
  moveWorkspaceUp: (workspaceId: string) => void;
  moveWorkspaceDown: (workspaceId: string) => void;
  bringWorkspaceToFront: (workspaceId: string) => void;
  sendWorkspaceToBack: (workspaceId: string) => void;
  moveLayerUp: (workspaceId: string, layerId: number) => void;
  moveLayerDown: (workspaceId: string, layerId: number) => void;
  bringLayerToFront: (workspaceId: string, layerId: number) => void;
  sendLayerToBack: (workspaceId: string, layerId: number) => void;
}

const useActiveWorkspaces = create<Interface__ActiveWorkspaces>((set, get) => ({
  activeWorkspaces: [],

  // Add a new workspace
  loadWorkspace: (newActiveWorkspace) =>
    set((state) => {
      const workspaceExists = state.activeWorkspaces.some(
        (workspace) => workspace.id === newActiveWorkspace.id
      );

      if (workspaceExists) {
        console.warn(`Workspace ${newActiveWorkspace.id} already exists`);
        return state;
      }

      // Calculate next zIndex for workspace
      const maxWorkspaceZIndex = state.activeWorkspaces.reduce(
        (max, ws) => Math.max(max, ws.zIndex || 0),
        0
      );

      // Initialize layers with zIndex
      const layersWithZIndex = newActiveWorkspace.layers?.map(
        (layer, index) => ({
          ...layer,
          visible: layer.visible ?? true,
          zIndex: index, // Initial zIndex based on array position
        })
      );

      return {
        activeWorkspaces: [
          ...state.activeWorkspaces,
          {
            ...newActiveWorkspace,
            visible: newActiveWorkspace.visible ?? true,
            zIndex: maxWorkspaceZIndex + 1,
            layers: layersWithZIndex,
          },
        ],
      };
    }),

  // Add layer to existing workspace
  addLayerToActiveWorkspace: (workspaceId, newLayer) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((workspace) => {
        if (workspace.id !== workspaceId) return workspace;

        const existingLayers = workspace.layers || [];
        const maxLayerZIndex = existingLayers.reduce(
          (max, layer) => Math.max(max, layer.zIndex || 0),
          0
        );

        return {
          ...workspace,
          layers: [
            ...existingLayers,
            {
              ...newLayer,
              visible: true,
              zIndex: maxLayerZIndex + 1,
            },
          ],
        };
      }),
    })),

  // Toggle entire workspace visibility
  toggleActiveWorkspaceVisibility: (workspaceId) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((workspace) =>
        workspace.id === workspaceId
          ? { ...workspace, visible: !workspace.visible }
          : workspace
      ),
    })),

  // Toggle specific layer visibility within a workspace
  toggleLayerVisibility: (workspaceId, layerId) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((workspace) => {
        if (workspace.id !== workspaceId) {
          return workspace;
        }

        return {
          ...workspace,
          layers: workspace.layers?.map((layer) =>
            layer.id === layerId
              ? {
                  ...layer,
                  visible: !layer.visible,
                }
              : layer
          ),
        };
      }),
    })),

  // Update layer data
  updateLayerData: (workspaceId, layerId, newData) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((workspace) => {
        if (workspace.id !== workspaceId) {
          return workspace;
        }

        return {
          ...workspace,
          layers: workspace.layers?.map((layer) =>
            layer.id === layerId
              ? {
                  ...layer,
                  data: newData,
                }
              : layer
          ),
        };
      }),
    })),

  // Remove specific layer from workspace
  removeLayer: (workspaceId, layerId) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((workspace) => {
        if (workspace.id !== workspaceId) {
          return workspace;
        }

        return {
          ...workspace,
          layers: workspace.layers?.filter((layer) => layer.id !== layerId),
        };
      }),
    })),

  // Remove entire workspace
  unloadWorkspace: (workspaceId) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.filter(
        (workspace) => workspace.id !== workspaceId
      ),
    })),

  // Clear all workspaces
  clearAllWorkspaces: () => set({ activeWorkspaces: [] }),

  // Check if workspace is active
  workspaceActive: (workspaceId) => {
    return get().activeWorkspaces.some(
      (activeWorkspace) => activeWorkspace.id === workspaceId
    );
  },
  getActiveWorkspace: (workspaceId) => {
    return get().activeWorkspaces.find(
      (workspace) => workspace.id === workspaceId
    );
  },

  // Workspace z-index management
  moveWorkspaceUp: (workspaceId) =>
    set((state) => {
      const workspaces = [...state.activeWorkspaces];
      const currentIndex = workspaces.findIndex((w) => w.id === workspaceId);

      if (currentIndex < workspaces.length - 1) {
        const nextZ = workspaces[currentIndex + 1].zIndex;
        workspaces[currentIndex + 1].zIndex = workspaces[currentIndex].zIndex;
        workspaces[currentIndex].zIndex = nextZ;
      }

      return { activeWorkspaces: workspaces };
    }),

  moveWorkspaceDown: (workspaceId) =>
    set((state) => {
      const workspaces = [...state.activeWorkspaces];
      const currentIndex = workspaces.findIndex((w) => w.id === workspaceId);

      if (currentIndex > 0) {
        const prevZ = workspaces[currentIndex - 1].zIndex;
        workspaces[currentIndex - 1].zIndex = workspaces[currentIndex].zIndex;
        workspaces[currentIndex].zIndex = prevZ;
      }

      return { activeWorkspaces: workspaces };
    }),

  bringWorkspaceToFront: (workspaceId) =>
    set((state) => {
      const workspaces = [...state.activeWorkspaces];
      const workspace = workspaces.find((w) => w.id === workspaceId);

      if (workspace) {
        const maxZIndex = Math.max(...workspaces.map((w) => w.zIndex));
        workspace.zIndex = maxZIndex + 1;
      }

      return { activeWorkspaces: workspaces };
    }),

  sendWorkspaceToBack: (workspaceId) =>
    set((state) => {
      const workspaces = [...state.activeWorkspaces];
      const workspace = workspaces.find((w) => w.id === workspaceId);

      if (workspace) {
        const minZIndex = Math.min(...workspaces.map((w) => w.zIndex));
        workspace.zIndex = minZIndex - 1;
      }

      return { activeWorkspaces: workspaces };
    }),

  // Layer z-index management
  moveLayerUp: (workspaceId, layerId) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((workspace) => {
        if (workspace.id !== workspaceId || !workspace.layers) return workspace;

        const layers = [...workspace.layers];
        const currentIndex = layers.findIndex((l) => l.id === layerId);

        if (currentIndex < layers.length - 1) {
          const nextZ = layers[currentIndex + 1].zIndex;
          layers[currentIndex + 1].zIndex = layers[currentIndex].zIndex;
          layers[currentIndex].zIndex = nextZ;
        }

        return { ...workspace, layers };
      }),
    })),

  moveLayerDown: (workspaceId, layerId) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((workspace) => {
        if (workspace.id !== workspaceId || !workspace.layers) return workspace;

        const layers = [...workspace.layers];
        const currentIndex = layers.findIndex((l) => l.id === layerId);

        if (currentIndex > 0) {
          const prevZ = layers[currentIndex - 1].zIndex;
          layers[currentIndex - 1].zIndex = layers[currentIndex].zIndex;
          layers[currentIndex].zIndex = prevZ;
        }

        return { ...workspace, layers };
      }),
    })),

  bringLayerToFront: (workspaceId, layerId) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((workspace) => {
        if (workspace.id !== workspaceId || !workspace.layers) return workspace;

        const maxZIndex = Math.max(...workspace.layers.map((l) => l.zIndex));
        return {
          ...workspace,
          layers: workspace.layers.map((layer) =>
            layer.id === layerId ? { ...layer, zIndex: maxZIndex + 1 } : layer
          ),
        };
      }),
    })),

  sendLayerToBack: (workspaceId, layerId) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((workspace) => {
        if (workspace.id !== workspaceId || !workspace.layers) return workspace;

        const minZIndex = Math.min(...workspace.layers.map((l) => l.zIndex));
        return {
          ...workspace,
          layers: workspace.layers.map((layer) =>
            layer.id === layerId ? { ...layer, zIndex: minZIndex - 1 } : layer
          ),
        };
      }),
    })),
}));

export default useActiveWorkspaces;

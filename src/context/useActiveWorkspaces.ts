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

      return {
        activeWorkspaces: [
          ...state.activeWorkspaces,
          {
            ...newActiveWorkspace,
            visible: newActiveWorkspace.visible ?? true,
            layers: newActiveWorkspace.layers?.map((layer) => ({
              ...layer,
              visible: layer.visible ?? true,
            })),
          },
        ],
      };
    }),

  // Add layer to existing workspace
  addLayerToActiveWorkspace: (workspaceId, newLayer) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              layers: [
                ...(workspace.layers || []),
                {
                  ...newLayer,
                  visible: true,
                },
              ],
            }
          : workspace
      ),
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
}));

export default useActiveWorkspaces;

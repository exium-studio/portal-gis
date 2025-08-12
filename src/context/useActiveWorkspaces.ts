import { create } from "zustand";
import useMapViewState from "./useMapViewState";
import {
  Interface__ActiveWorkspace,
  Interface__ActiveWorkspacesByWorkspaceCategory,
  Interface__LayerData,
} from "@/constants/interfaces";

// Generic helper to toggle visibility in an array
function toggleVisibility<T extends { visible: boolean }>(
  list: T[],
  matchFn: (item: T) => boolean
) {
  return list.map((item) =>
    matchFn(item) ? { ...item, visible: !item.visible } : item
  );
}

// Generic helper to rearrange array order
function rearrange<T>(
  list: T[],
  matchFn: (item: T) => boolean,
  action: "front" | "back" | "up" | "down"
) {
  const index = list.findIndex(matchFn);
  if (index === -1) return list;

  const item = list[index];
  list.splice(index, 1);

  switch (action) {
    case "front":
      list.push(item); // move to last position
      break;
    case "back":
      list.unshift(item); // move to first position
      break;
    case "up":
      list.splice(Math.min(index + 1, list.length), 0, item); // move one step forward
      break;
    case "down":
      list.splice(Math.max(index - 1, 0), 0, item); // move one step backward
      break;
  }
  return list;
}

interface ActiveWorkspacesStore {
  activeWorkspaces: Interface__ActiveWorkspacesByWorkspaceCategory[];

  getActiveWorkspace: (
    workspaceId: string
  ) => Interface__ActiveWorkspace | undefined;

  allWorkspaces: () => Interface__ActiveWorkspace[];

  loadWorkspace: (
    categoryId: number,
    workspace: Interface__ActiveWorkspace
  ) => void;
  unloadWorkspace: (categoryId: number, workspaceId: string) => void;

  toggleCategoryVisibility: (categoryId: number) => void;
  toggleWorkspaceVisibility: (categoryId: number, workspaceId: string) => void;
  toggleLayerVisibility: (workspaceId: string, layerId: number) => void;

  rearrangeCategory: (
    categoryId: number,
    action: "front" | "back" | "up" | "down"
  ) => void;
  rearrangeWorkspace: (
    categoryId: number,
    workspaceId: string,
    action: "front" | "back" | "up" | "down"
  ) => void;
  rearrangeLayer: (
    workspaceId: string,
    layerId: number,
    action: "front" | "back" | "up" | "down"
  ) => void;
  updateLayerData: (
    workspaceId: string,
    layerId: number,
    newData: Partial<Interface__LayerData>
  ) => void;
}

const useActiveWorkspaces = create<ActiveWorkspacesStore>((set, get) => ({
  activeWorkspaces: [],

  // Get active workspace by workspace id
  getActiveWorkspace: (workspaceId) => {
    const state = get();
    for (const category of state.activeWorkspaces) {
      const workspace = category.workspaces.find((ws) => ws.id === workspaceId);
      if (workspace) return workspace;
    }
    return undefined;
  },

  // Get all workspaces flat map
  allWorkspaces: () =>
    get().activeWorkspaces.flatMap(
      (activeWorkspace) => activeWorkspace?.workspaces
    ),

  // Add a workspace into a category
  loadWorkspace: (categoryId, workspace) =>
    set((state) => {
      const category = state.activeWorkspaces.find(
        (c) => c.workspace_category.id === categoryId
      );

      if (category) {
        category.workspaces.push(workspace);
      } else {
        state.activeWorkspaces.push({
          workspace_category: {
            id: categoryId,
            label: workspace?.workspace_category?.label,
          },
          workspaces: [workspace],
          visible: true,
        } as Interface__ActiveWorkspacesByWorkspaceCategory);
      }
      return { activeWorkspaces: [...state.activeWorkspaces] };
    }),

  // Remove a workspace from a category
  unloadWorkspace: (categoryId, workspaceId) =>
    set((state) => {
      const updatedCategories = state.activeWorkspaces
        .map((category) => {
          if (category.workspace_category.id !== categoryId) return category;

          const remainingWorkspaces = category.workspaces.filter(
            (ws) => ws.id !== workspaceId
          );

          // Kalau masih ada workspace, return category yang diperbarui
          if (remainingWorkspaces.length > 0) {
            return { ...category, workspaces: remainingWorkspaces };
          }

          // Kalau udah gak ada workspace, return null untuk dihapus
          return null;
        })
        .filter(
          (c): c is Interface__ActiveWorkspacesByWorkspaceCategory => c !== null
        );

      return { activeWorkspaces: updatedCategories };
    }),

  // Toggle category visibility and update all related layers in the map
  toggleCategoryVisibility: (categoryId) =>
    set((state) => {
      const mapRef = useMapViewState.getState().mapRef;

      const newState = {
        activeWorkspaces: toggleVisibility(
          state.activeWorkspaces,
          (c) => c.workspace_category.id === categoryId
        ),
      };

      const category = newState.activeWorkspaces.find(
        (c) => c.workspace_category.id === categoryId
      );

      if (mapRef?.current && category) {
        const map = mapRef.current.getMap();
        category.workspaces.forEach((ws) =>
          ws.layers?.forEach((layer) => {
            const layerIdStr = String(layer.id);
            if (map.getLayer(layerIdStr)) {
              map.setLayoutProperty(
                layerIdStr,
                "visibility",
                category.visible ? "visible" : "none"
              );
            } else {
              console.warn(
                `Layer ${layerIdStr} does not exist in the map's style. (Category toggle)`
              );
            }
          })
        );
      }
      return newState;
    }),

  // Toggle workspace visibility and update all layers inside it
  toggleWorkspaceVisibility: (categoryId, workspaceId) =>
    set((state) => {
      const mapRef = useMapViewState.getState().mapRef;

      const newState = {
        activeWorkspaces: state.activeWorkspaces.map((c) =>
          c.workspace_category.id === categoryId
            ? {
                ...c,
                workspaces: toggleVisibility(
                  c.workspaces,
                  (ws) => ws.id === workspaceId
                ),
              }
            : c
        ),
      };

      const category = newState.activeWorkspaces.find(
        (c) => c.workspace_category.id === categoryId
      );
      const workspace = category?.workspaces.find(
        (ws) => ws.id === workspaceId
      );

      if (mapRef?.current && workspace) {
        const map = mapRef.current.getMap();
        workspace.layers?.forEach((layer) => {
          const layerIdStr = String(layer.id);
          if (map.getLayer(layerIdStr)) {
            map.setLayoutProperty(
              layerIdStr,
              "visibility",
              workspace.visible ? "visible" : "none"
            );
          } else {
            console.warn(
              `Layer ${layerIdStr} does not exist in the map's style. (Workspace toggle)`
            );
          }
        });
      }
      return newState;
    }),

  // Toggle single layer visibility
  toggleLayerVisibility: (workspaceId, layerId) =>
    set((state) => {
      const mapRef = useMapViewState.getState().mapRef;

      const newState = {
        activeWorkspaces: state.activeWorkspaces.map((c) => ({
          ...c,
          workspaces: c.workspaces.map((ws) =>
            ws.id === workspaceId
              ? {
                  ...ws,
                  layers: toggleVisibility(
                    ws.layers ?? [],
                    (l) => l.id === layerId
                  ),
                }
              : ws
          ),
        })),
      };

      if (mapRef?.current) {
        const map = mapRef.current.getMap();
        const layer = newState.activeWorkspaces
          .flatMap((c) => c.workspaces)
          .find((ws) => ws.id === workspaceId)
          ?.layers?.find((l) => l.id === layerId);

        if (layer) {
          const layerIdStr = String(layer.id);
          if (map.getLayer(layerIdStr)) {
            map.setLayoutProperty(
              layerIdStr,
              "visibility",
              layer.visible ? "visible" : "none"
            );
          } else {
            console.warn(
              `Layer ${layerIdStr} does not exist in the map's style. (Layer toggle)`
            );
          }
        }
      }

      return newState;
    }),

  // Rearrange category order
  rearrangeCategory: (categoryId, action) =>
    set((state) => ({
      activeWorkspaces: rearrange(
        [...state.activeWorkspaces],
        (c) => c.workspace_category.id === categoryId,
        action
      ),
    })),

  // Rearrange workspace order within a category
  rearrangeWorkspace: (categoryId, workspaceId, action) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((c) =>
        c.workspace_category.id === categoryId
          ? {
              ...c,
              workspaces: rearrange(
                [...c.workspaces],
                (ws) => ws.id === workspaceId,
                action
              ),
            }
          : c
      ),
    })),

  // Rearrange layer order within a workspace
  rearrangeLayer: (workspaceId, layerId, action) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((c) => ({
        ...c,
        workspaces: c.workspaces.map((ws) =>
          ws.id === workspaceId
            ? {
                ...ws,
                layers: rearrange(
                  [...(ws.layers ?? [])],
                  (l) => l.id === layerId,
                  action
                ),
              }
            : ws
        ),
      })),
    })),

  // Update layer data in a workspace
  updateLayerData: (workspaceId, layerId, newData) =>
    set((state) => ({
      activeWorkspaces: state.activeWorkspaces.map((category) => ({
        ...category,
        workspaces: category.workspaces.map((workspace) =>
          workspace.id === workspaceId
            ? {
                ...workspace,
                layers: workspace.layers?.map((layer) =>
                  layer.id === layerId
                    ? {
                        ...layer,
                        data: {
                          ...layer.data,
                          ...newData,
                        },
                      }
                    : layer
                ),
              }
            : workspace
        ),
      })),
    })),
}));

export default useActiveWorkspaces;

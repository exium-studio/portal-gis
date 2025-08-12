// store
import { create } from "zustand";

interface WorkspaceLoadingState {
  loadingWorkspaceIds: number[];
  addWorkspaceLoading: (id: number) => void;
  removeWorkspaceLoading: (id: number) => void;
  clearWorkspaceLoading: () => void;
}

export const useWorkspaceLoading = create<WorkspaceLoadingState>((set) => ({
  loadingWorkspaceIds: [],
  addWorkspaceLoading: (id) =>
    set((state) => ({
      loadingWorkspaceIds: state.loadingWorkspaceIds.includes(id)
        ? state.loadingWorkspaceIds
        : [...state.loadingWorkspaceIds, id],
    })),
  removeWorkspaceLoading: (id) =>
    set((state) => ({
      loadingWorkspaceIds: state.loadingWorkspaceIds.filter(
        (item) => item !== id
      ),
    })),
  clearWorkspaceLoading: () => set({ loadingWorkspaceIds: [] }),
}));

// custom hook selector
export const useIsWorkspaceLoading = (id: number) =>
  useWorkspaceLoading((s) => s.loadingWorkspaceIds.includes(id));

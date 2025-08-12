// store
import { create } from "zustand";

interface WorkspaceLoadingState {
  loadingWorkspaceIds: string[];
  addWorkspaceLoading: (id: string) => void;
  removeWorkspaceLoading: (id: string) => void;
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
export const useIsWorkspaceLoading = (id: string) =>
  useWorkspaceLoading((s) => s.loadingWorkspaceIds.includes(id));

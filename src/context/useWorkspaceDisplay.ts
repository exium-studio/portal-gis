import { create } from "zustand";

type DisplayMode = "rows" | "list";

interface WorkspaceDisplayState {
  displayMode: DisplayMode;
  toggleDisplayMode: () => void;
  setDisplayMode: (mode: DisplayMode) => void;
}

const useWorkspaceDisplay = create<WorkspaceDisplayState>((set) => ({
  displayMode: "rows", // Default: "rows"
  toggleDisplayMode: () =>
    set((state) => ({
      displayMode: state.displayMode === "rows" ? "list" : "rows",
    })),
  setDisplayMode: (mode) => set({ displayMode: mode }),
}));

export default useWorkspaceDisplay;

import { create } from "zustand";

interface State {
  searchMode: boolean;
}

interface Actions {
  setSearchMode: (newState: State["searchMode"]) => void;
  toggleSearchMode: () => void;
}

const useSearchMode = create<State & Actions>((set) => ({
  searchMode: localStorage.getItem("searchMode") === "1" ? true : false,
  setSearchMode: (newState) => set(() => ({ searchMode: newState })),
  toggleSearchMode: () =>
    set((ps) => ({
      searchMode: !ps.searchMode,
    })),
}));

export default useSearchMode;

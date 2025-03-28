import { create } from "zustand";

interface State {
  searchAddress: string;
  searchResult: any;
  selectedSearchResult: any;
}

interface Actions {
  setSearchAddress: (newState: State["searchAddress"]) => void;
  setSearchResult: (newState: State["searchResult"]) => void;
  setSelectedSearchResult: (newState: State["selectedSearchResult"]) => void;
}

const useSearchAddress = create<State & Actions>((set) => ({
  searchAddress: "",
  setSearchAddress: (newState) => set({ searchAddress: newState }),

  searchResult: [],
  setSearchResult: (newState) => set({ searchResult: newState }),

  selectedSearchResult: "",
  setSelectedSearchResult: (newState) =>
    set({ selectedSearchResult: newState }),
}));

export default useSearchAddress;

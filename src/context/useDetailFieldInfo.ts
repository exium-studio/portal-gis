import { create } from "zustand";

interface State_Actions {
  open: boolean;
  setOpen: (newState: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

const useDetailFieldInfo = create<State_Actions>((set, get) => ({
  open: false,
  setOpen: (newState) => set({ open: newState }),
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
  onToggle: () => set({ open: !get().open }),
}));

export default useDetailFieldInfo;

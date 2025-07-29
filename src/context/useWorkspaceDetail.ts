import { Interface__Workspace } from "@/constants/interfaces";
import { create } from "zustand";

interface DataState extends Interface__Workspace {
  layersOnly?: boolean;
}
interface ColorStore {
  open: boolean;
  data: DataState | null;
  onOpen: () => void;
  onToggle: () => void;
  onClose: () => void;
  setOpen: (newState: boolean) => void;
  setData: (newState: any) => void;
}

const useWorkspaceDetail = create<ColorStore>((set) => ({
  open: false,
  data: null,
  onOpen: () => set({ open: true }),
  onToggle: () => set((state) => ({ open: !state.open })),
  onClose: () => set({ open: false }),
  setOpen: (newState) => set({ open: newState }),
  setData: (newState) => set({ data: newState }),
}));

export default useWorkspaceDetail;

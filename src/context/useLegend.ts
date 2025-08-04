import { LEGEND_COLOR_OPTIONS } from "@/constants/colors";
import { create } from "zustand";

interface LegendObject {
  label: string;
  list: {
    label: string;
    color: string;
  }[];
}

interface LegendStore {
  open: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onClose: () => void;
  setOpen: (newState: boolean) => void;
  legend: LegendObject;
  setLegend: (newLegend: LegendObject) => void;
  colorway: any;
  setColorway: (colors: string[]) => void;
}

const useLegend = create<LegendStore>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onToggle: () => set((state) => ({ open: !state.open })),
  onClose: () => set({ open: false }),
  setOpen: (newState) => set({ open: newState }),
  legend: {
    label: "",
    list: [],
  },
  setLegend: (newLegend) => set({ legend: newLegend }),
  colorway: LEGEND_COLOR_OPTIONS[0],
  setColorway: (colors) => set({ colorway: colors }),
}));

export default useLegend;

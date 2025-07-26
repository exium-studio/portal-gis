import { create } from "zustand";

interface ColorObject {
  label: string;
  color: string;
}

interface ColorStore {
  open: boolean;
  data: any;
  onOpen: () => void;
  onToggle: () => void;
  onClose: () => void;
  setOpen: (newState: boolean) => void;
  setData: (newState: any) => void;
  legends: ColorObject[];
  addLegend: (newColor: ColorObject) => void;
  removeLegend: (label: string) => void;
  updateLegend: (label: string, updatedColor: Partial<ColorObject>) => void;
  setLegends: (newColors: ColorObject[]) => void;
}

const useLegend = create<ColorStore>((set) => ({
  open: false,
  data: null,
  onOpen: () => set({ open: true }),
  onToggle: () => set((state) => ({ open: !state.open })),
  onClose: () => set({ open: false }),
  setOpen: (newState) => set({ open: newState }),
  setData: (newState) => set({ data: newState }),

  legends: [],

  // Add a new color object to the array
  addLegend: (newColor) =>
    set((state) => ({ legends: [...state.legends, newColor] })),

  // Remove a color object by its label
  removeLegend: (label) =>
    set((state) => ({
      legends: state.legends.filter((color) => color.label !== label),
    })),

  // Update a color object by its label
  updateLegend: (label, updatedColor) =>
    set((state) => ({
      legends: state.legends.map((color) =>
        color.label === label ? { ...color, ...updatedColor } : color
      ),
    })),

  // Replace the entire array
  setLegends: (newColors) => set({ legends: newColors }),
}));

export default useLegend;

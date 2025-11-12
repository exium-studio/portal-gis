import { Interface__SelectedPolygon } from "@/constants/interfaces";
import { create } from "zustand";

interface ActivePolygonState {
  selectedPolygon: Interface__SelectedPolygon | null;
  setSelectedPolygon: (polygon: any) => void;
  clearSelectedPolygon: () => void;
  // Optional: Tambahan metadata
  properties: Record<string, any> | null;
  setProperties: (props: Record<string, any>) => void;
}

const useSelectedPolygon = create<ActivePolygonState>((set) => ({
  selectedPolygon: null,
  properties: null,

  // Set active polygon
  setSelectedPolygon: (polygon) =>
    set({
      selectedPolygon: polygon,
      properties: polygon?.properties || null,
    }),

  // Clear selection
  clearSelectedPolygon: () =>
    set({
      selectedPolygon: null,
      properties: null,
    }),

  // Update properties
  setProperties: (props) => set({ properties: props }),
}));

export default useSelectedPolygon;

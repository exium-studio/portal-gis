import { LatLong } from "@/constants/types";
import { create } from "zustand";

interface Props {
  currentLocation: LatLong | undefined;
  setCurrentLocation: (newState: LatLong) => void;
}

const useCurrentLocation = create<Props>((set) => {
  return {
    currentLocation: undefined,
    setCurrentLocation: (newState: any) => set({ currentLocation: newState }),
  };
});

export default useCurrentLocation;

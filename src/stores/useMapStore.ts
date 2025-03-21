import { create } from "zustand"
import { IMapStore } from "../types/IMapStore"

export const useMapStore = create<IMapStore>((set) => ({
  selectedCity: null,
  setSelectedCity: (city) => set({ selectedCity: city })
}))

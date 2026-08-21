import { create } from "zustand";
import type { GeocodeResult } from "@/lib/api";

export type Units = "metric" | "imperial";

interface SelectedPlace {
  name: string;
  latitude: number;
  longitude: number;
}

interface AppState {
  units: Units;
  toggleUnits: () => void;
  selectedPlace: SelectedPlace | null; // null = use device location
  recentSearches: GeocodeResult[];
  selectPlace: (place: SelectedPlace | null) => void;
  addRecentSearch: (place: GeocodeResult) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  units: "metric",
  toggleUnits: () =>
    set((s) => ({ units: s.units === "metric" ? "imperial" : "metric" })),
  selectedPlace: null,
  recentSearches: [],
  selectPlace: (place) => set({ selectedPlace: place }),
  addRecentSearch: (place) => {
    const existing = get().recentSearches.filter((p) => p.id !== place.id);
    set({ recentSearches: [place, ...existing].slice(0, 5) });
  },
}));

export function toDisplayTemp(celsius: number, units: Units): number {
  return units === "metric" ? celsius : celsius * (9 / 5) + 32;
}

export function toDisplaySpeed(kmh: number, units: Units): number {
  return units === "metric" ? kmh : kmh * 0.621371;
}

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GeocodeResult } from "@/lib/api";

export type Units = "metric" | "imperial";
export type ThemeOverride = "auto" | "light" | "dark";

interface SelectedPlace {
  name: string;
  latitude: number;
  longitude: number;
}

interface AppState {
  units: Units;
  toggleUnits: () => void;
  themeOverride: ThemeOverride;
  cycleTheme: () => void;
  selectedPlace: SelectedPlace | null; // null = use device location
  recentSearches: GeocodeResult[];
  selectPlace: (place: SelectedPlace | null) => void;
  addRecentSearch: (place: GeocodeResult) => void;
}

const THEME_CYCLE: ThemeOverride[] = ["auto", "light", "dark"];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      units: "metric",
      toggleUnits: () =>
        set((s) => ({ units: s.units === "metric" ? "imperial" : "metric" })),
      themeOverride: "auto",
      cycleTheme: () =>
        set((s) => {
          const next =
            THEME_CYCLE[(THEME_CYCLE.indexOf(s.themeOverride) + 1) % THEME_CYCLE.length];
          return { themeOverride: next };
        }),
      selectedPlace: null,
      recentSearches: [],
      selectPlace: (place) => set({ selectedPlace: place }),
      addRecentSearch: (place) => {
        const existing = get().recentSearches.filter((p) => p.id !== place.id);
        set({ recentSearches: [place, ...existing].slice(0, 5) });
      },
    }),
    {
      name: "weather-now-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ units: state.units, recentSearches: state.recentSearches }),
    }
  )
);

export function toDisplayTemp(celsius: number, units: Units): number {
  return units === "metric" ? celsius : celsius * (9 / 5) + 32;
}

export function toDisplaySpeed(kmh: number, units: Units): number {
  return units === "metric" ? kmh : kmh * 0.621371;
}

// Maps Open-Meteo's WMO weather codes to a short label and an Ionicons name.
// https://open-meteo.com/en/docs (see "WMO Weather interpretation codes")

import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface WeatherInfo {
  label: string;
  icon: IconName;
}

export function describeWeatherCode(code: number, isDay: boolean): WeatherInfo {
  const day = isDay;
  if (code === 0) return { label: "Clear sky", icon: day ? "sunny" : "moon" };
  if (code === 1) return { label: "Mostly clear", icon: day ? "partly-sunny" : "moon" };
  if (code === 2) return { label: "Partly cloudy", icon: day ? "partly-sunny" : "cloudy-night" };
  if (code === 3) return { label: "Overcast", icon: "cloud" };
  if (code === 45 || code === 48) return { label: "Fog", icon: "reorder-three" };
  if ([51, 53, 55].includes(code)) return { label: "Drizzle", icon: "rainy" };
  if ([56, 57].includes(code)) return { label: "Freezing drizzle", icon: "rainy" };
  if ([61, 63, 65].includes(code)) return { label: "Rain", icon: "rainy" };
  if ([66, 67].includes(code)) return { label: "Freezing rain", icon: "rainy" };
  if ([71, 73, 75].includes(code)) return { label: "Snow", icon: "snow" };
  if (code === 77) return { label: "Snow grains", icon: "snow" };
  if ([80, 81, 82].includes(code)) return { label: "Rain showers", icon: "rainy" };
  if ([85, 86].includes(code)) return { label: "Snow showers", icon: "snow" };
  if (code === 95) return { label: "Thunderstorm", icon: "thunderstorm" };
  if ([96, 99].includes(code)) return { label: "Thunderstorm w/ hail", icon: "thunderstorm" };
  return { label: "Unknown", icon: "help-circle" };
}

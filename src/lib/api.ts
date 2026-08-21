// Thin client around Open-Meteo's free, keyless APIs.
// Docs: https://open-meteo.com/en/docs and https://open-meteo.com/en/docs/geocoding-api

export interface GeocodeResult {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface HourlyPoint {
  time: string; // ISO
  temperature: number;
  weatherCode: number;
}

export interface DailySummary {
  date: string; // ISO date
  sunrise: string; // ISO
  sunset: string; // ISO
  tempMax: number;
  tempMin: number;
}

export interface CurrentConditions {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
  observedAt: string; // ISO
}

export interface WeatherSnapshot {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentConditions;
  hourly: HourlyPoint[]; // next ~24h
  today: DailySummary;
}

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchPlaces(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return [];
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  return (data.results ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure",
    hourly: "temperature_2m,weather_code",
    daily: "sunrise,sunset,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "2", // today + tomorrow, so "next 24h" never runs off the end
  });

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Forecast failed: ${res.status}`);
  const data = await res.json();

  const nowIso: string = data.current.time;
  const hourlyTimes: string[] = data.hourly.time;
  const startIdx = hourlyTimes.findIndex((t) => t >= nowIso);
  const sliceStart = startIdx === -1 ? 0 : startIdx;

  const hourly: HourlyPoint[] = hourlyTimes
    .slice(sliceStart, sliceStart + 24)
    .map((time, i) => ({
      time,
      temperature: data.hourly.temperature_2m[sliceStart + i],
      weatherCode: data.hourly.weather_code[sliceStart + i],
    }));

  return {
    latitude,
    longitude,
    timezone: data.timezone,
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      pressure: data.current.surface_pressure,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      observedAt: nowIso,
    },
    hourly,
    today: {
      date: data.daily.time[0],
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
      tempMax: data.daily.temperature_2m_max[0],
      tempMin: data.daily.temperature_2m_min[0],
    },
  };
}

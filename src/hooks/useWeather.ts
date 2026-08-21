import { useCallback, useEffect, useState } from "react";
import { fetchWeather, WeatherSnapshot } from "@/lib/api";

interface WeatherState {
  data: WeatherSnapshot | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useWeather(
  latitude: number | null,
  longitude: number | null
): WeatherState {
  const [data, setData] = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (latitude == null || longitude == null) return;
    setLoading(true);
    setError(null);
    try {
      const snapshot = await fetchWeather(latitude, longitude);
      setData(snapshot);
    } catch (e) {
      setError("Couldn't load the forecast. Pull down to try again.");
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

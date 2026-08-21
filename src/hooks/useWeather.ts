import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWeather, WeatherSnapshot } from "@/lib/api";

const LIVE_TICK_MS = 60_000;

interface WeatherState {
  data: WeatherSnapshot | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  // Live epoch ms, advanced from data.current.observedAt by real elapsed time
  // since the fetch — stays in the same parsed frame as sunrise/sunset instead
  // of going stale between fetches.
  nowMs: number | null;
}

export function useWeather(
  latitude: number | null,
  longitude: number | null
): WeatherState {
  const [data, setData] = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const fetchedAtMsRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    if (latitude == null || longitude == null) return;
    setLoading(true);
    setError(null);
    try {
      const snapshot = await fetchWeather(latitude, longitude);
      fetchedAtMsRef.current = Date.now();
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

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), LIVE_TICK_MS);
    return () => clearInterval(interval);
  }, []);

  const nowMs =
    data && fetchedAtMsRef.current != null
      ? new Date(data.current.observedAt).getTime() + (Date.now() - fetchedAtMsRef.current)
      : null;
  void tick; // triggers the periodic re-render nowMs is recomputed on

  return { data, loading, error, refresh, nowMs };
}

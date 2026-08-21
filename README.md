# Weather Now

Hyperlocal, distraction-free weather. Built with Expo + TypeScript.

## Design concept

A quiet paper-and-ink instrument rather than a glossy sky-gradient app.
The signature element is the **sun arc**: a horizontal timeline from sunrise
to sunset with hourly temperature ticks and an amber "needle" marking the
current time — read it like a barometer, not a cartoon icon.

- **Data**: [Open-Meteo](https://open-meteo.com) — free, no API key required,
  used for both geocoding (city search) and forecasts.
- **Location**: `expo-location`, GPS-based, with a graceful fallback to
  manual city search if permission is declined.
- **State**: `zustand` for units (°C/°F) and recent searches.
- **Type**: Space Grotesk (display), Inter (body), IBM Plex Mono (data
  readouts), all via `@expo-google-fonts` — no font files to manage.

## Setup

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go (iOS/Android), or press `i` / `a` for a
simulator, or `w` for web.

No environment variables or API keys needed — Open-Meteo is used
unauthenticated.

## Project structure

```
app/
  _layout.tsx       Font loading + navigation stack
  index.tsx          Home screen: current conditions, sun arc, data ledger
  search.tsx          Modal: city search
src/
  components/         TempDial, SunArc, DataLedger, SearchSheet
  hooks/               useLocation, useWeather
  lib/                  api.ts (Open-Meteo client), weatherCodes.ts
  store/                useAppStore.ts (units, recent searches)
  theme/                tokens.ts (colors, type scale)
```

## Next steps / ideas

- Swap the parabolic arc approximation in `SunArc.tsx` for the true solar
  elevation curve if you want astronomical accuracy.
- Add a 7-day outlook screen (Open-Meteo's `daily` params already support
  it — just extend `forecast_days` and the `WeatherSnapshot` type).
- Persist `recentSearches` and `units` with `AsyncStorage` so they survive
  app restarts.
- Add a night-mode illustration variant (the arc dips below the baseline
  after sunset instead of just fading).

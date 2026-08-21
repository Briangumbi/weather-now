// Design tokens for Weather Now.
// Aesthetic: a quiet paper-and-ink instrument, not a glossy sky-gradient app.
// One accent (amber, evoking a barometer needle) does all the work.

export const colors = {
  paper: "#F5F1E8", // warm background, day mode
  ink: "#12141C", // background, night mode
  textDark: "#1C1917", // primary text on paper
  textLight: "#F5F1E8", // primary text on ink
  muted: "#5C5342", // secondary text, labels — day mode (~6.7:1 on paper)
  mutedNight: "#C8BDA6", // secondary text, labels — night mode (~9.9:1 on ink)
  accent: "#C9853B", // amber — the single signature color
  hairline: "#DDD6C8", // dividers on paper
  hairlineDark: "#2A2D3A", // dividers on ink
  ledger: "#4A5D52", // data readout tint (humidity/pressure/wind)
} as const;

// Font family keys registered via useFonts() in app/_layout.tsx,
// sourced from @expo-google-fonts (no manual font files needed).
export const type = {
  display: "SpaceGrotesk_700Bold", // the big temperature number
  displayMedium: "SpaceGrotesk_500Medium",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  mono: "IBMPlexMono_400Regular", // instrument-ledger stats
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 24,
  pill: 999,
} as const;

export const spacing = (n: number) => n * 4;

export function paletteFor(isDay: boolean) {
  return {
    background: isDay ? colors.paper : colors.ink,
    text: isDay ? colors.textDark : colors.textLight,
    hairline: isDay ? colors.hairline : colors.hairlineDark,
    accent: colors.accent,
    muted: isDay ? colors.muted : colors.mutedNight,
  };
}

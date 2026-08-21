import React, { type ComponentProps } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, type, paletteFor } from "@/theme/tokens";
import { useLocation } from "@/hooks/useLocation";
import { useWeather } from "@/hooks/useWeather";
import { useAppStore } from "@/store/useAppStore";
import { TempDial } from "@/components/TempDial";
import { SunArc } from "@/components/SunArc";
import { DataLedger } from "@/components/DataLedger";

const THEME_ICON: Record<string, ComponentProps<typeof Ionicons>["name"]> = {
  auto: "contrast-outline",
  light: "sunny",
  dark: "moon",
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { units, toggleUnits, themeOverride, cycleTheme, selectedPlace } = useAppStore();

  const device = useLocation();
  const latitude = selectedPlace?.latitude ?? device.coords?.latitude ?? null;
  const longitude = selectedPlace?.longitude ?? device.coords?.longitude ?? null;

  const weather = useWeather(latitude, longitude);
  const isDay =
    themeOverride === "auto" ? weather.data?.current.isDay ?? true : themeOverride === "light";
  const palette = paletteFor(isDay);

  const placeName = selectedPlace?.name ?? "Current location";

  const isLoading = (device.loading && !selectedPlace) || weather.loading;
  const errorMessage = device.error || weather.error;

  return (
    <View style={[styles.screen, { backgroundColor: palette.background, paddingTop: insets.top }]}>
      <StatusBar style={isDay ? "dark" : "light"} />
      <View style={styles.topBar}>
        <Pressable onPress={() => router.push("/search")} hitSlop={12}>
          <Ionicons name="search" size={20} color={palette.text} />
        </Pressable>
        <View style={styles.topBarRight}>
          <Pressable onPress={cycleTheme} hitSlop={12}>
            <Ionicons name={THEME_ICON[themeOverride]} size={20} color={palette.text} />
          </Pressable>
          <Pressable onPress={toggleUnits} hitSlop={12}>
            <Text style={[styles.unitsToggle, { color: palette.text }]}>
              {units === "metric" ? "°C" : "°F"}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={weather.loading}
            onRefresh={weather.refresh}
            tintColor={colors.accent}
          />
        }
      >
        {isLoading && !weather.data && (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.accent} size="large" />
          </View>
        )}

        {device.permissionDenied && !selectedPlace && (
          <View style={styles.centered}>
            <Text style={[styles.errorText, { color: palette.text }]}>
              Location access is off. Search for a city instead, or enable location in
              Settings.
            </Text>
            <Pressable onPress={() => router.push("/search")} style={styles.searchCta}>
              <Text style={{ color: colors.accent, fontFamily: type.bodyMedium }}>
                Search for a city
              </Text>
            </Pressable>
          </View>
        )}

        {errorMessage && !device.permissionDenied && !weather.data && (
          <View style={styles.centered}>
            <Text style={[styles.errorText, { color: palette.text }]}>{errorMessage}</Text>
          </View>
        )}

        {weather.data && (
          <>
            <TempDial
              celsius={weather.data.current.temperature}
              feelsLikeCelsius={weather.data.current.feelsLike}
              weatherCode={weather.data.current.weatherCode}
              isDay={weather.data.current.isDay}
              units={units}
              textColor={palette.text}
              mutedColor={palette.muted}
              placeName={placeName}
            />
            <SunArc
              sunrise={weather.data.today.sunrise}
              sunset={weather.data.today.sunset}
              now={weather.nowMs ?? Date.now()}
              hourly={weather.data.hourly}
              units={units}
              hairlineColor={palette.hairline}
              mutedColor={palette.muted}
            />
            <DataLedger
              humidity={weather.data.current.humidity}
              windSpeed={weather.data.current.windSpeed}
              pressure={weather.data.current.pressure}
              precipitation={weather.data.current.precipitation}
              units={units}
              textColor={palette.text}
              hairlineColor={palette.hairline}
              mutedColor={palette.muted}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  unitsToggle: {
    fontFamily: type.mono,
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  errorText: {
    fontFamily: type.body,
    fontSize: 15,
    textAlign: "center",
    opacity: 0.8,
  },
  searchCta: {
    marginTop: 16,
  },
});

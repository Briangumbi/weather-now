import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, type } from "@/theme/tokens";
import { describeWeatherCode } from "@/lib/weatherCodes";
import { toDisplayTemp, Units } from "@/store/useAppStore";

interface TempDialProps {
  celsius: number;
  feelsLikeCelsius: number;
  weatherCode: number;
  isDay: boolean;
  units: Units;
  textColor: string;
  mutedColor: string;
  placeName: string;
}

export function TempDial({
  celsius,
  feelsLikeCelsius,
  weatherCode,
  isDay,
  units,
  textColor,
  mutedColor,
  placeName,
}: TempDialProps) {
  const { label, icon } = describeWeatherCode(weatherCode, isDay);
  const temp = Math.round(toDisplayTemp(celsius, units));
  const feelsLike = Math.round(toDisplayTemp(feelsLikeCelsius, units));
  const unitSuffix = units === "metric" ? "°C" : "°F";

  return (
    <View style={styles.wrap}>
      <Text style={[styles.place, { color: textColor }]} numberOfLines={1}>
        {placeName}
      </Text>
      <View style={styles.row}>
        <Text style={[styles.temp, { color: textColor }]}>{temp}°</Text>
        <View style={styles.meta}>
          <Ionicons name={icon} size={22} color={colors.accent} />
          <Text style={[styles.condition, { color: textColor }]}>{label}</Text>
        </View>
      </View>
      <Text style={[styles.feelsLike, { color: mutedColor }]}>
        Feels like {feelsLike}
        {unitSuffix}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", paddingTop: 8, paddingBottom: 20 },
  place: {
    fontFamily: type.bodyMedium,
    fontSize: 15,
    opacity: 0.8,
    marginBottom: 4,
  },
  row: { flexDirection: "row", alignItems: "flex-start" },
  temp: {
    fontFamily: type.display,
    fontSize: 88,
    lineHeight: 92,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    marginLeft: 8,
  },
  condition: {
    fontFamily: type.bodyMedium,
    fontSize: 16,
  },
  feelsLike: {
    fontFamily: type.mono,
    fontSize: 13,
    marginTop: 4,
  },
});

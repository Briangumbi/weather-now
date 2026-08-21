import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, type } from "@/theme/tokens";
import { describeWeatherCode } from "@/lib/weatherCodes";
import { toDisplayTemp, Units } from "@/store/useAppStore";
import type { HourlyPoint } from "@/lib/api";

interface HourlyStripProps {
  hourly: HourlyPoint[];
  sunrise: string;
  sunset: string;
  units: Units;
  textColor: string;
  mutedColor: string;
}

export function HourlyStrip({
  hourly,
  sunrise,
  sunset,
  units,
  textColor,
  mutedColor,
}: HourlyStripProps) {
  return (
    <FlatList
      data={hourly}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(h) => h.time}
      contentContainerStyle={styles.list}
      renderItem={({ item, index }) => {
        const isNow = index === 0;
        const isDayForHour = item.time >= sunrise && item.time <= sunset;
        const { icon } = describeWeatherCode(item.weatherCode, isDayForHour);
        const temp = Math.round(toDisplayTemp(item.temperature, units));
        const tint = isNow ? colors.accent : textColor;

        return (
          <View style={styles.item}>
            <Text style={[styles.hourLabel, { color: isNow ? colors.accent : mutedColor }]}>
              {isNow ? "Now" : formatHourShort(item.time)}
            </Text>
            <Ionicons name={icon} size={20} color={isNow ? colors.accent : mutedColor} />
            <Text style={[styles.temp, { color: tint }]}>{temp}°</Text>
          </View>
        );
      }}
    />
  );
}

function formatHourShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric" });
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 16,
    gap: 20,
  },
  item: {
    alignItems: "center",
    gap: 8,
    width: 44,
  },
  hourLabel: {
    fontFamily: type.mono,
    fontSize: 12,
  },
  temp: {
    fontFamily: type.mono,
    fontSize: 13,
  },
});

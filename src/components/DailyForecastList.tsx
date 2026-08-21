import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { type } from "@/theme/tokens";
import { describeWeatherCode } from "@/lib/weatherCodes";
import { toDisplayTemp, Units } from "@/store/useAppStore";
import type { DailyForecastEntry } from "@/lib/api";

interface DailyForecastListProps {
  days: DailyForecastEntry[];
  units: Units;
  textColor: string;
  hairlineColor: string;
  mutedColor: string;
}

export function DailyForecastList({
  days,
  units,
  textColor,
  hairlineColor,
  mutedColor,
}: DailyForecastListProps) {
  return (
    <View style={[styles.wrap, { borderColor: hairlineColor }]}>
      {days.map((d, i) => {
        const { label, icon } = describeWeatherCode(d.weatherCode, true);
        const high = Math.round(toDisplayTemp(d.tempMax, units));
        const low = Math.round(toDisplayTemp(d.tempMin, units));

        return (
          <View
            key={d.date}
            style={[
              styles.row,
              i !== days.length - 1 && {
                borderBottomColor: hairlineColor,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
            ]}
          >
            <Text style={[styles.dayLabel, { color: textColor }]}>{formatDayLabel(d.date, i)}</Text>
            <View style={styles.condition}>
              <Ionicons name={icon} size={16} color={mutedColor} />
              <Text style={[styles.conditionLabel, { color: mutedColor }]} numberOfLines={1}>
                {label}
              </Text>
            </View>
            <Text style={[styles.temps, { color: textColor }]}>
              {high}°<Text style={{ color: mutedColor }}> / {low}°</Text>
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// daily.time entries are date-only ("YYYY-MM-DD"); parsing that directly with
// new Date() reads it as UTC midnight, which can roll the weekday back a day
// in timezones behind UTC. Build a local Date from the components instead.
function formatDayLabel(dateStr: string, index: number): string {
  if (index === 0) return "Today";
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString([], { weekday: "short" });
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    marginTop: 24,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  dayLabel: {
    fontFamily: type.bodyMedium,
    fontSize: 14,
    width: 56,
  },
  condition: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  conditionLabel: {
    fontFamily: type.body,
    fontSize: 13,
    flexShrink: 1,
  },
  temps: {
    fontFamily: type.mono,
    fontSize: 13,
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { type } from "@/theme/tokens";
import { toDisplaySpeed, Units } from "@/store/useAppStore";

interface DataLedgerProps {
  humidity: number;
  windSpeed: number; // km/h from API
  pressure: number; // hPa
  precipitation: number; // mm
  units: Units;
  textColor: string;
  hairlineColor: string;
  mutedColor: string;
}

export function DataLedger({
  humidity,
  windSpeed,
  pressure,
  precipitation,
  units,
  textColor,
  hairlineColor,
  mutedColor,
}: DataLedgerProps) {
  const speed = Math.round(toDisplaySpeed(windSpeed, units));
  const speedUnit = units === "metric" ? "km/h" : "mph";

  const rows = [
    { label: "Humidity", value: `${Math.round(humidity)}%` },
    { label: "Wind", value: `${speed} ${speedUnit}` },
    { label: "Pressure", value: `${Math.round(pressure)} hPa` },
    { label: "Precipitation", value: `${precipitation.toFixed(1)} mm` },
  ];

  return (
    <View style={[styles.wrap, { borderColor: hairlineColor }]}>
      {rows.map((r, i) => (
        <View
          key={r.label}
          style={[
            styles.row,
            i !== rows.length - 1 && { borderBottomColor: hairlineColor, borderBottomWidth: StyleSheet.hairlineWidth },
          ]}
        >
          <Text style={[styles.label, { color: mutedColor }]}>{r.label}</Text>
          <Text style={[styles.value, { color: textColor }]}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
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
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    fontFamily: type.mono,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  value: {
    fontFamily: type.mono,
    fontSize: 13,
  },
});

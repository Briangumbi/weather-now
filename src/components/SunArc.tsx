import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Circle, Line, Text as SvgText } from "react-native-svg";
import { colors, type } from "@/theme/tokens";
import type { HourlyPoint } from "@/lib/api";

interface SunArcProps {
  sunrise: string;
  sunset: string;
  now: number; // live epoch ms, in the same parsed frame as sunrise/sunset
  hourly: HourlyPoint[]; // used to plot temp ticks along the arc
  units: "metric" | "imperial";
  hairlineColor: string;
  mutedColor: string;
}

const WIDTH = 340;
const HEIGHT = 160;
const ARC_TOP = 24;
const ARC_BOTTOM = 130;
const PAD_X = 20;

function fracOfDay(nowMs: number, sunriseIso: string, sunsetIso: string): number {
  const rise = new Date(sunriseIso).getTime();
  const set = new Date(sunsetIso).getTime();
  if (set === rise) return 0.5;
  return Math.min(1, Math.max(0, (nowMs - rise) / (set - rise)));
}

// Point on a shallow arc for a given fraction [0,1] across the day.
function pointOnArc(frac: number) {
  const x = PAD_X + frac * (WIDTH - PAD_X * 2);
  // Simple parabola: peak at frac=0.5, resting on ARC_BOTTOM at the edges.
  const y = ARC_BOTTOM - Math.sin(frac * Math.PI) * (ARC_BOTTOM - ARC_TOP);
  return { x, y };
}

export function SunArc({
  sunrise,
  sunset,
  now,
  hourly,
  hairlineColor,
  mutedColor,
}: SunArcProps) {
  const nowFrac = fracOfDay(now, sunrise, sunset);
  const nowPoint = pointOnArc(nowFrac);
  console.log("[SunArc debug]", {
    sunrise,
    sunset,
    now,
    nowAsDateString: new Date(now).toString(),
    deviceNowMs: Date.now(),
    deviceNowString: new Date().toString(),
    sunriseMs: new Date(sunrise).getTime(),
    sunsetMs: new Date(sunset).getTime(),
    nowFrac,
    hourlyTimeFirst3: hourly.slice(0, 3).map((h) => h.time),
    hourlyTimeLast3: hourly.slice(-3).map((h) => h.time),
  });

  const pathD = useMemo(() => {
    const steps = 40;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const { x, y } = pointOnArc(i / steps);
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  }, []);

  // Sample up to 6 evenly spaced hourly points that fall within daylight for tick marks.
  const ticks = useMemo(() => {
    if (!hourly.length) return [];
    const daylightHours = hourly.filter(
      (h) => h.time >= sunrise && h.time <= sunset
    );
    const pool = daylightHours.length ? daylightHours : hourly;
    const step = Math.max(1, Math.floor(pool.length / 6));
    return pool.filter((_, i) => i % step === 0).slice(0, 6);
  }, [hourly, sunrise, sunset]);

  const riseLabel = formatHour(sunrise);
  const setLabel = formatHour(sunset);

  return (
    <View style={styles.wrap}>
      <Svg width={WIDTH} height={HEIGHT}>
        <Path
          d={pathD}
          stroke={hairlineColor}
          strokeWidth={1.5}
          fill="none"
          strokeDasharray="1 5"
          strokeLinecap="round"
        />
        {ticks.map((h) => {
          const f = fracOfDay(new Date(h.time).getTime(), sunrise, sunset);
          const p = pointOnArc(f);
          return (
            <React.Fragment key={h.time}>
              <Circle cx={p.x} cy={p.y} r={2.5} fill={mutedColor} />
              <SvgText
                x={p.x}
                y={p.y - 10}
                fontSize={10}
                fontFamily={type.mono}
                fill={mutedColor}
                textAnchor="middle"
              >
                {Math.round(h.temperature)}°
              </SvgText>
            </React.Fragment>
          );
        })}
        {/* current-time marker: the "needle" */}
        <Line
          x1={nowPoint.x}
          y1={nowPoint.y}
          x2={nowPoint.x}
          y2={ARC_BOTTOM + 14}
          stroke={colors.accent}
          strokeWidth={1.5}
        />
        <Circle cx={nowPoint.x} cy={nowPoint.y} r={5} fill={colors.accent} />
      </Svg>
      <View style={styles.labels}>
        <Text style={[styles.labelText, { color: mutedColor }]}>{riseLabel} sunrise</Text>
        <Text style={[styles.labelText, { color: mutedColor }]}>{setLabel} sunset</Text>
      </View>
    </View>
  );
}

function formatHour(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", width: "100%" },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: WIDTH - PAD_X * 2,
    marginTop: -4,
  },
  labelText: {
    fontFamily: type.mono,
    fontSize: 11,
  },
});

"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface BarRaceProps {
  data: Array<{ label: string; values: Array<{ year: number; value: number }> }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valueSuffix?: string;
  maxBars?: number;
}

const BAR_COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

export const BarRaceTemplate: React.FC<BarRaceProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel, valueSuffix = "", maxBars = 8 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!data || data.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data provided</div></AbsoluteFill>;
  }

  const allYears = [...new Set(data.flatMap(d => d.values.map(v => v.year)))].sort();
  if (allYears.length === 0) return <AbsoluteFill style={{ backgroundColor: colors.background }} />;

  const yearProgress = interpolate(frame, [fps, durationInFrames - fps], [0, allYears.length - 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yearIdx = Math.min(Math.floor(yearProgress), allYears.length - 1);
  const yearFrac = yearProgress - yearIdx;
  const currentYear = allYears[yearIdx];
  const nextYear = allYears[Math.min(yearIdx + 1, allYears.length - 1)];

  const getVal = (entry: (typeof data)[0], year: number) => entry.values.find(v => v.year === year)?.value ?? 0;

  const ranked = data.map((entry, i) => {
    const v1 = getVal(entry, currentYear);
    const v2 = getVal(entry, nextYear);
    return { label: entry.label, value: v1 + (v2 - v1) * yearFrac, color: BAR_COLORS[i % BAR_COLORS.length] };
  }).sort((a, b) => b.value - a.value).slice(0, maxBars);

  const maxVal = Math.max(...ranked.map(r => r.value), 1);
  const barArea = { top: height * 0.2, left: width * 0.2, right: width * 0.05, bottom: height * 0.1 };
  const barH = ((height - barArea.top - barArea.bottom) / maxBars) * 0.7;
  const barGap = ((height - barArea.top - barArea.bottom) / maxBars) * 0.3;
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: barArea.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700 }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7 }}>{subtitle}</div>}
      </div>
      <div style={{ position: "absolute", top: height * 0.05, right: barArea.right, color: colors.accent, fontSize: width * 0.04, fontWeight: 800, opacity: 0.3 }}>{currentYear}</div>
      {ranked.map((item, i) => {
        const barW = (item.value / maxVal) * (width - barArea.left - barArea.right);
        const y = barArea.top + i * (barH + barGap);
        return (
          <div key={item.label} style={{ position: "absolute", top: y, left: 0, width: "100%", height: barH, display: "flex", alignItems: "center" }}>
            <div style={{ width: barArea.left - 10, textAlign: "right", paddingRight: 10, color: colors.text, fontSize: width * 0.013, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</div>
            <div style={{ width: barW, height: "80%", backgroundColor: item.color, borderRadius: 4, transition: "width 0.1s" }} />
            <span style={{ marginLeft: 8, color: colors.text, fontSize: width * 0.013, fontWeight: 600 }}>{Math.round(item.value).toLocaleString()}{valueSuffix}</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", bottom: height * 0.03, left: barArea.left, display: "flex", gap: 20, opacity: 0.5 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.011 }}>Source: {sourceLabel}</span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.011 }}>{brand}</span>}
      </div>
    </AbsoluteFill>
  );
};

"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface LineChartRaceProps {
  data: Array<{ state: string; values: Array<{ year: number; value: number }> }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const RACE_COLORS = ["#64ffda", "#ff6b6b", "#ffd93d", "#a78bfa", "#f472b6", "#3b82f6", "#06b6d4", "#f97316"];

export const LineChartRaceTemplate: React.FC<LineChartRaceProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.18, bottom: height * 0.12, left: width * 0.08, right: width * 0.15 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const allYears = [...new Set(data.flatMap(d => d.values.map(v => v.year)))].sort();
  const allValues = data.flatMap(d => d.values.map(v => v.value));
  const minVal = Math.min(...allValues) * 0.9;
  const maxVal = Math.max(...allValues) * 1.1;

  const progress = interpolate(frame, [fps * 0.5, fps * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const visibleYears = Math.floor(progress * allYears.length) + 1;
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  const toX = (year: number) => pad.left + ((year - allYears[0]) / (allYears[allYears.length - 1] - allYears[0])) * cW;
  const toY = (val: number) => pad.top + cH - ((val - minVal) / (maxVal - minVal)) * cH;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const yPos = pad.top + cH * (1 - p);
        return (
          <div key={i} style={{ position: "absolute", left: pad.left, top: yPos, width: cW, height: 1, background: `${colors.text}12` }}>
            <span style={{ position: "absolute", left: -pad.left * 0.7, top: -7, fontSize: width * 0.01, color: `${colors.text}50` }}>
              {Math.round(minVal + (maxVal - minVal) * p)}
            </span>
          </div>
        );
      })}

      {/* Year labels */}
      {allYears.map((yr, i) => (
        <div key={yr} style={{ position: "absolute", left: toX(yr) - 15, top: pad.top + cH + 8, fontSize: width * 0.01, color: `${colors.text}60` }}>{yr}</div>
      ))}

      {/* Lines and dots */}
      {data.map((series, si) => {
        const color = RACE_COLORS[si % RACE_COLORS.length];
        const visibleVals = series.values.filter((_, i) => i < visibleYears);

        return (
          <React.Fragment key={si}>
            {/* SVG for line paths */}
            <svg style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none" }}>
              {visibleVals.length > 1 && (
                <polyline
                  fill="none"
                  stroke={color}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={visibleVals.map(v => `${toX(v.year)},${toY(v.value)}`).join(" ")}
                />
              )}
            </svg>
            {/* End dot */}
            {visibleVals.length > 0 && (() => {
              const last = visibleVals[visibleVals.length - 1];
              return (
                <>
                  <div style={{
                    position: "absolute",
                    left: toX(last.year) - 5,
                    top: toY(last.value) - 5,
                    width: 10, height: 10, borderRadius: "50%",
                    background: color, border: "2px solid #fff",
                  }} />
                  <div style={{
                    position: "absolute",
                    left: toX(last.year) + 12,
                    top: toY(last.value) - 8,
                    color: colors.text, fontSize: width * 0.01, fontWeight: 600, whiteSpace: "nowrap",
                  }}>{series.state}: {last.value}</div>
                </>
              );
            })()}
          </React.Fragment>
        );
      })}

      {/* Current year indicator */}
      <div style={{
        position: "absolute",
        top: height * 0.06,
        right: width * 0.05,
        color: `${colors.text}30`,
        fontSize: width * 0.04,
        fontWeight: 800,
      }}>{allYears[Math.min(visibleYears - 1, allYears.length - 1)]}</div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

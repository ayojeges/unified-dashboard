"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface AreaRaceProps {
  series: Array<{ label: string; values: number[]; color?: string }>;
  years: number[];
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const AREA_COLORS = ["#64ffda", "#ff6b6b", "#ffd93d", "#a78bfa"];

export const AreaRaceTemplate: React.FC<AreaRaceProps> = ({ series = [], years = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!series.length || !years.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.18, bottom: height * 0.14, left: width * 0.07, right: width * 0.05 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  // Calculate stacked values
  const stacked: number[][] = years.map((_, yi) => {
    let cumulative = 0;
    return series.map(s => {
      cumulative += (s.values[yi] || 0);
      return cumulative;
    });
  });

  const maxVal = Math.max(...stacked.map(s => s[s.length - 1])) * 1.1;
  const toX = (i: number) => pad.left + (i / (years.length - 1)) * cW;
  const toY = (v: number) => pad.top + cH - (v / maxVal) * cH;

  const reveal = interpolate(frame, [fps * 0.5, fps * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clipWidth = pad.left + cW * reveal;
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <div key={i} style={{ position: "absolute", left: pad.left, top: toY(maxVal * p), width: cW, height: 1, background: `${colors.text}10` }}>
          <span style={{ position: "absolute", left: -pad.left * 0.7, top: -7, fontSize: width * 0.01, color: `${colors.text}50` }}>
            {Math.round(maxVal * p)}
          </span>
        </div>
      ))}

      {/* Year labels */}
      {years.map((yr, i) => (
        <div key={yr} style={{ position: "absolute", left: toX(i) - 15, top: pad.top + cH + 8, fontSize: width * 0.01, color: `${colors.text}60` }}>{yr}</div>
      ))}

      {/* Stacked areas (SVG) */}
      <svg style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none", clipPath: `inset(0 ${width - clipWidth}px 0 0)` }}>
        {[...series].reverse().map((s, revIdx) => {
          const si = series.length - 1 - revIdx;
          const color = s.color || AREA_COLORS[si % AREA_COLORS.length];
          const topPoints = years.map((_, yi) => `${toX(yi)},${toY(stacked[yi][si])}`);
          const bottomPoints = years.map((_, yi) => `${toX(yi)},${toY(si > 0 ? stacked[yi][si - 1] : 0)}`).reverse();
          const pathD = `M${topPoints.join(" L")} L${bottomPoints.join(" L")} Z`;

          return (
            <React.Fragment key={si}>
              <path d={pathD} fill={color} fillOpacity={0.5} />
              <polyline fill="none" stroke={color} strokeWidth={2} points={topPoints.join(" ")} />
            </React.Fragment>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ position: "absolute", bottom: height * 0.03, left: pad.left, display: "flex", gap: width * 0.03 }}>
        {series.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: s.color || AREA_COLORS[i % AREA_COLORS.length] }} />
            <span style={{ color: colors.text, fontSize: width * 0.01, opacity: 0.7 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

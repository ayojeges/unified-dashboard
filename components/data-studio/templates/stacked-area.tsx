"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface StackedAreaProps {
  series: Array<{ label: string; values: number[]; color: string }>;
  years: number[];
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

export const StackedAreaTemplate: React.FC<StackedAreaProps> = ({ series = [], years = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!series.length || !years.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.22, bottom: height * 0.15, left: width * 0.06, right: width * 0.04 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;
  const progress = interpolate(frame, [0, durationInFrames * 0.8], [0, 1], { extrapolateRight: "clamp" });
  const visiblePts = Math.max(1, Math.floor(years.length * progress));

  const stacked: number[][] = years.map((_, yi) => {
    let cumulative = 0;
    return series.map(s => { cumulative += (s.values[yi] || 0); return cumulative; });
  });
  const maxStacked = Math.max(...stacked.flat(), 1);

  const getX = (i: number) => pad.left + (i / (years.length - 1)) * cW;
  const getY = (val: number) => pad.top + cH - (val / maxStacked) * cH;
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700 }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <svg width={width} height={height}>
        {[...series].reverse().map((s, revIdx) => {
          const seriesIdx = series.length - 1 - revIdx;
          const pts: string[] = [];
          for (let i = 0; i < visiblePts; i++) {
            pts.push(`${getX(i)},${getY(stacked[i][seriesIdx])}`);
          }
          const bottomPts: string[] = [];
          for (let i = visiblePts - 1; i >= 0; i--) {
            bottomPts.push(`${getX(i)},${getY(seriesIdx > 0 ? stacked[i][seriesIdx - 1] : 0)}`);
          }
          return <polygon key={s.label} points={[...pts, ...bottomPts].join(" ")} fill={s.color} fillOpacity={0.7} />;
        })}
      </svg>
      <div style={{ position: "absolute", bottom: height * 0.03, left: pad.left, display: "flex", gap: 16 }}>
        {series.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: s.color }} />
            <span style={{ color: colors.text, fontSize: width * 0.011, opacity: 0.7 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

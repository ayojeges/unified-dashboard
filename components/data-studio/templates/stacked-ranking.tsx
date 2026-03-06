"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface StackedRankingProps {
  entries: Array<{ name: string; scores: number[]; color?: string }>;
  categories: string[];
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const ENTRY_COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];
const CAT_FILLS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#EF4444", "#F97316"];

export const StackedRankingTemplate: React.FC<StackedRankingProps> = ({
  entries = [], categories = [], title, subtitle, brand, colors, sourceLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!entries.length || !categories.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Calculate totals and sort
  const ranked = entries.map((e, i) => ({
    ...e,
    total: e.scores.reduce((a, b) => a + b, 0),
    color: e.color || ENTRY_COLORS[i % ENTRY_COLORS.length],
  })).sort((a, b) => b.total - a.total);

  const maxTotal = Math.max(...ranked.map(e => e.total), 1);
  const barTop = height * 0.25;
  const barBottom = height * 0.85;
  const barLeft = width * 0.22;
  const barRight = width * 0.92;
  const barW = barRight - barLeft;
  const rowH = Math.min((barBottom - barTop) / ranked.length, height * 0.1);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Category legend */}
      <div style={{
        position: "absolute", top: height * 0.15, width: "100%",
        display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap",
      }}>
        {categories.map((cat, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: CAT_FILLS[i % CAT_FILLS.length] }} />
            <span style={{ color: colors.text, fontSize: width * 0.009, opacity: 0.7 }}>{cat}</span>
          </div>
        ))}
      </div>

      {ranked.map((entry, i) => {
        const delay = i * 10;
        const prog = interpolate(frame, [20 + delay, 55 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = barTop + i * rowH;
        let offsetX = 0;

        return (
          <div key={i} style={{ position: "absolute", top: y, left: 0, width: "100%", height: rowH - 4, display: "flex", alignItems: "center" }}>
            {/* Rank */}
            <div style={{ width: width * 0.04, textAlign: "center", opacity: prog }}>
              <span style={{ color: i < 3 ? colors.accent : colors.text, fontSize: width * 0.016, fontWeight: 800, opacity: i < 3 ? 1 : 0.5 }}>{i + 1}</span>
            </div>
            {/* Name */}
            <div style={{ width: width * 0.17, paddingRight: 8, textAlign: "right", opacity: prog }}>
              <span style={{ color: colors.text, fontSize: width * 0.011, fontWeight: 600 }}>{entry.name}</span>
            </div>
            {/* Stacked bar */}
            <svg width={barW + 60} height={rowH - 4} style={{ overflow: "visible" }}>
              {entry.scores.map((score, si) => {
                const segW = (score / maxTotal) * barW * prog;
                const x = offsetX;
                offsetX += segW;
                return (
                  <rect key={si} x={x} y={(rowH - 4) * 0.15} width={Math.max(segW, 0)} height={(rowH - 4) * 0.7}
                    fill={CAT_FILLS[si % CAT_FILLS.length]} rx={3} opacity={0.85} />
                );
              })}
              {/* Total label */}
              <text x={offsetX + 8} y={(rowH - 4) * 0.6} fill={colors.text} fontSize={width * 0.01} fontWeight={700} opacity={prog}>
                {Math.round(entry.total * prog)}
              </text>
            </svg>
          </div>
        );
      })}

      {sourceLabel && (
        <div style={{ position: "absolute", bottom: height * 0.02, width: "100%", textAlign: "center" }}>
          <span style={{ color: colors.text, fontSize: width * 0.009, opacity: 0.35 }}>Source: {sourceLabel}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

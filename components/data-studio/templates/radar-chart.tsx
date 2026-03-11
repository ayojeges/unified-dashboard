"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface RadarChartProps {
  entries: Array<{ name: string; values: number[]; color: string }>;
  dimensions: string[];
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  maxValue?: number;
}

export const RadarChartTemplate: React.FC<RadarChartProps> = ({
  entries = [], dimensions = [], title, subtitle, brand, colors, sourceLabel, maxValue = 100,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!entries.length || !dimensions.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const cx = width / 2;
  const cy = height * 0.52;
  const radius = Math.min(width, height) * 0.28;
  const n = dimensions.length;
  const angleStep = (2 * Math.PI) / n;

  const getPoint = (dimIdx: number, val: number, r: number) => {
    const angle = -Math.PI / 2 + dimIdx * angleStep;
    const dist = (val / maxValue) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Axis lines
  const axes = dimensions.map((_, i) => {
    const p = getPoint(i, maxValue, radius);
    return { x1: cx, y1: cy, x2: p.x, y2: p.y };
  });

  // Dimension labels
  const labels = dimensions.map((dim, i) => {
    const p = getPoint(i, maxValue, radius + 40);
    return { text: dim, x: p.x, y: p.y };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>

      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        {/* Grid rings */}
        {rings.map((r, ri) => {
          const points = dimensions.map((_, i) => getPoint(i, maxValue * r, radius)).map(p => `${p.x},${p.y}`).join(" ");
          return <polygon key={ri} points={points} fill="none" stroke={colors.text} strokeOpacity={0.1} strokeWidth={1} />;
        })}

        {/* Axes */}
        {axes.map((a, i) => (
          <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke={colors.text} strokeOpacity={0.15} strokeWidth={1} />
        ))}

        {/* Data polygons */}
        {entries.map((entry, ei) => {
          const entryDelay = ei * 15;
          const prog = interpolate(frame, [20 + entryDelay, 60 + entryDelay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const points = entry.values.map((v, i) => {
            const p = getPoint(i, v * prog, radius);
            return `${p.x},${p.y}`;
          }).join(" ");
          return (
            <g key={ei}>
              <polygon points={points} fill={entry.color} fillOpacity={0.15} stroke={entry.color} strokeWidth={2.5} strokeOpacity={0.9} />
              {entry.values.map((v, i) => {
                const p = getPoint(i, v * prog, radius);
                return <circle key={i} cx={p.x} cy={p.y} r={4} fill={entry.color} opacity={prog} />;
              })}
            </g>
          );
        })}

        {/* Dimension labels */}
        {labels.map((l, i) => (
          <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle"
            fill={colors.text} fontSize={width * 0.012} fontWeight={600} opacity={0.8}>
            {l.text}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div style={{
        position: "absolute", bottom: height * 0.06, width: "100%",
        display: "flex", justifyContent: "center", gap: 24,
      }}>
        {entries.map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: e.color }} />
            <span style={{ color: colors.text, fontSize: width * 0.012, fontWeight: 500 }}>{e.name}</span>
          </div>
        ))}
      </div>

      {/* Source */}
      {sourceLabel && (
        <div style={{ position: "absolute", bottom: height * 0.02, width: "100%", textAlign: "center" }}>
          <span style={{ color: colors.text, fontSize: width * 0.009, opacity: 0.35 }}>Source: {sourceLabel}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface RadarCompareProps {
  entries: Array<{ name: string; values: number[]; color?: string }>;
  dimensions: string[];
  maxValue: number;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const SERIES_COLORS = ["#64ffda", "#ff6b6b", "#ffd93d", "#a78bfa"];

export const RadarCompareTemplate: React.FC<RadarCompareProps> = ({ entries = [], dimensions = [], maxValue = 10, title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!entries.length || !dimensions.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const cx = width * 0.48;
  const cy = height * 0.55;
  const radius = Math.min(width, height) * 0.28;
  const angleSlice = (Math.PI * 2) / dimensions.length;
  const levels = 5;
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  const getPoint = (dimIdx: number, value: number) => {
    const angle = dimIdx * angleSlice - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: width * 0.06, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      <svg style={{ position: "absolute", top: 0, left: 0, width, height }}>
        {/* Grid polygons */}
        {Array.from({ length: levels }).map((_, li) => {
          const lr = radius * ((li + 1) / levels);
          const points = dimensions.map((_, di) => {
            const angle = di * angleSlice - Math.PI / 2;
            return `${cx + Math.cos(angle) * lr},${cy + Math.sin(angle) * lr}`;
          }).join(" ");
          return <polygon key={li} points={points} fill="none" stroke={`${colors.text}12`} strokeWidth={1} />;
        })}

        {/* Axis lines */}
        {dimensions.map((_, di) => {
          const angle = di * angleSlice - Math.PI / 2;
          return (
            <line key={di} x1={cx} y1={cy} x2={cx + Math.cos(angle) * radius} y2={cy + Math.sin(angle) * radius} stroke={`${colors.text}20`} strokeWidth={1} />
          );
        })}

        {/* Data areas */}
        {entries.map((entry, ei) => {
          const delay = ei * fps * 0.3;
          const progress = interpolate(frame, [fps * 0.5 + delay, fps * 2 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const color = entry.color || SERIES_COLORS[ei % SERIES_COLORS.length];
          const points = entry.values.map((v, di) => {
            const p = getPoint(di, v * progress);
            return `${p.x},${p.y}`;
          }).join(" ");

          return (
            <React.Fragment key={ei}>
              <polygon points={points} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={2} />
              {entry.values.map((v, di) => {
                const p = getPoint(di, v * progress);
                return <circle key={di} cx={p.x} cy={p.y} r={4} fill={color} stroke="#fff" strokeWidth={2} />;
              })}
            </React.Fragment>
          );
        })}

        {/* Dimension labels */}
        {dimensions.map((dim, di) => {
          const angle = di * angleSlice - Math.PI / 2;
          const lx = cx + Math.cos(angle) * (radius + width * 0.03);
          const ly = cy + Math.sin(angle) * (radius + width * 0.03);
          return (
            <text key={di} x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fill={colors.text} fontSize={width * 0.009} fontWeight={600}>
              {dim}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ position: "absolute", top: height * 0.18, right: width * 0.04, display: "flex", flexDirection: "column", gap: 8 }}>
        {entries.map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: e.color || SERIES_COLORS[i % SERIES_COLORS.length] }} />
            <span style={{ color: colors.text, fontSize: width * 0.01 }}>{e.name}</span>
          </div>
        ))}
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface NightingaleRoseProps {
  data: Array<{ month: string; value: number }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const MONTH_COLORS = ["#3B82F6", "#2563EB", "#1D4ED8", "#10B981", "#059669", "#047857", "#F59E0B", "#D97706", "#B45309", "#EF4444", "#DC2626", "#B91C1C"];

export const NightingaleRoseTemplate: React.FC<NightingaleRoseProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const cx = width * 0.5;
  const cy = height * 0.55;
  const maxRadius = Math.min(width, height) * 0.3;
  const maxVal = Math.max(...data.map(d => d.value));
  const sliceAngle = (2 * Math.PI) / data.length;
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: width * 0.06, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      <svg style={{ position: "absolute", top: 0, left: 0, width, height }}>
        {/* Grid circles */}
        {[0.25, 0.5, 0.75, 1].map((p, i) => (
          <circle key={i} cx={cx} cy={cy} r={maxRadius * p} fill="none" stroke={`${colors.text}15`} strokeWidth={1} />
        ))}

        {/* Arcs */}
        {data.map((d, i) => {
          const delay = i * fps * 0.1;
          const progress = interpolate(frame, [fps * 0.5 + delay, fps * 1.5 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const r = (d.value / maxVal) * maxRadius * progress;
          const startAngle = i * sliceAngle - Math.PI / 2;
          const endAngle = startAngle + sliceAngle;
          const padAngle = 0.02;

          const x1 = cx + Math.cos(startAngle + padAngle) * r;
          const y1 = cy + Math.sin(startAngle + padAngle) * r;
          const x2 = cx + Math.cos(endAngle - padAngle) * r;
          const y2 = cy + Math.sin(endAngle - padAngle) * r;
          const largeArc = endAngle - startAngle - 2 * padAngle > Math.PI ? 1 : 0;
          const color = MONTH_COLORS[i % MONTH_COLORS.length];

          const pathD = r > 0 ? `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z` : "";

          return pathD ? (
            <path key={i} d={pathD} fill={color} fillOpacity={0.7} stroke={colors.background} strokeWidth={2} />
          ) : null;
        })}

        {/* Month labels */}
        {data.map((d, i) => {
          const midAngle = i * sliceAngle - Math.PI / 2 + sliceAngle / 2;
          const labelR = maxRadius + width * 0.025;
          const lx = cx + Math.cos(midAngle) * labelR;
          const ly = cy + Math.sin(midAngle) * labelR;
          return (
            <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fill={colors.text} fontSize={width * 0.01} fontWeight={600}>
              {d.month}
            </text>
          );
        })}
      </svg>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

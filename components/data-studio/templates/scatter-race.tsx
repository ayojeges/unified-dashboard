import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface ScatterRaceProps {
  bubbles: Array<{ label: string; snapshots: Array<{ x: number; y: number; size: number }>; color?: string }>;
  xLabel: string;
  yLabel: string;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  timeLabels?: string[];
}

const BUBBLE_COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

export const ScatterRaceTemplate: React.FC<ScatterRaceProps> = ({
  bubbles = [], xLabel = "X", yLabel = "Y", title, subtitle, brand, colors, sourceLabel, timeLabels = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!bubbles.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const maxSnaps = Math.max(...bubbles.map(b => b.snapshots.length));
  const timeProgress = interpolate(frame, [fps, durationInFrames - fps], [0, maxSnaps - 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const snapIdx = Math.min(Math.floor(timeProgress), maxSnaps - 2);
  const snapFrac = timeProgress - snapIdx;

  const allX = bubbles.flatMap(b => b.snapshots.map(s => s.x));
  const allY = bubbles.flatMap(b => b.snapshots.map(s => s.y));
  const allS = bubbles.flatMap(b => b.snapshots.map(s => s.size));
  const xMin = Math.min(...allX), xMax = Math.max(...allX);
  const yMin = Math.min(...allY), yMax = Math.max(...allY);
  const sMax = Math.max(...allS, 1);
  const xRange = xMax - xMin || 1, yRange = yMax - yMin || 1;

  const pad = { top: height * 0.22, bottom: height * 0.12, left: width * 0.1, right: width * 0.06 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const toX = (v: number) => pad.left + ((v - xMin) / xRange) * cW;
  const toY = (v: number) => pad.top + cH - ((v - yMin) / yRange) * cH;

  const currentTimeLabel = timeLabels[Math.round(timeProgress)] || `Step ${Math.round(timeProgress) + 1}`;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.024, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div style={{ position: "absolute", top: height * 0.05, right: pad.right, color: colors.accent, fontSize: width * 0.03, fontWeight: 800, opacity: 0.3 }}>{currentTimeLabel}</div>

      <svg width={width} height={height}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(frac => {
          const y = pad.top + cH * (1 - frac);
          const x = pad.left + cW * frac;
          return (
            <g key={frac}>
              <line x1={pad.left} y1={y} x2={pad.left + cW} y2={y} stroke={colors.text} strokeOpacity={0.06} />
              <line x1={x} y1={pad.top} x2={x} y2={pad.top + cH} stroke={colors.text} strokeOpacity={0.06} />
            </g>
          );
        })}
        {/* Axis labels */}
        <text x={pad.left + cW / 2} y={height - pad.bottom + 35} textAnchor="middle" fill={colors.text} fillOpacity={0.5} fontSize={width * 0.012}>{xLabel}</text>
        <text x={pad.left - 40} y={pad.top + cH / 2} textAnchor="middle" fill={colors.text} fillOpacity={0.5} fontSize={width * 0.012} transform={`rotate(-90, ${pad.left - 40}, ${pad.top + cH / 2})`}>{yLabel}</text>

        {/* Bubbles */}
        {bubbles.map((b, i) => {
          const s1 = b.snapshots[snapIdx] || b.snapshots[0];
          const s2 = b.snapshots[Math.min(snapIdx + 1, b.snapshots.length - 1)] || s1;
          const cx = toX(s1.x + (s2.x - s1.x) * snapFrac);
          const cy = toY(s1.y + (s2.y - s1.y) * snapFrac);
          const r = Math.max(8, ((s1.size + (s2.size - s1.size) * snapFrac) / sMax) * 40);
          const color = b.color || BUBBLE_COLORS[i % BUBBLE_COLORS.length];

          return (
            <g key={b.label}>
              <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.6} stroke={color} strokeWidth={2} />
              <text x={cx} y={cy - r - 6} textAnchor="middle" fill={colors.text} fontSize={width * 0.011} fontWeight={600}>{b.label}</text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ position: "absolute", bottom: height * 0.03, left: pad.left, display: "flex", gap: 16, opacity: 0.5 }}>
        {bubbles.slice(0, 6).map((b, i) => (
          <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: b.color || BUBBLE_COLORS[i % BUBBLE_COLORS.length] }} />
            <span style={{ color: colors.text, fontSize: width * 0.009 }}>{b.label}</span>
          </div>
        ))}
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.009 }}>| {sourceLabel}</span>}
      </div>
    </AbsoluteFill>
  );
};

"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface SlopeChartProps {
  data: Array<{ state: string; start: number; end: number }>;
  startYear: string;
  endYear: string;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const SLOPE_COLORS = ["#64ffda", "#ff6b6b", "#ffd93d", "#a78bfa", "#f472b6", "#3b82f6", "#06b6d4", "#f97316"];

export const SlopeChartTemplate: React.FC<SlopeChartProps> = ({ data = [], startYear = "2020", endYear = "2024", title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const sorted = [...data].sort((a, b) => (b.end - b.start) - (a.end - a.start)).slice(0, 10);
  const pad = { top: height * 0.2, bottom: height * 0.1, left: width * 0.18, right: width * 0.18 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const allVals = sorted.flatMap(d => [d.start, d.end]);
  const maxVal = Math.max(...allVals) * 1.1;
  const minVal = Math.min(...allVals) * 0.9;

  const toY = (v: number) => pad.top + cH - ((v - minVal) / (maxVal - minVal)) * cH;
  const x1 = pad.left;
  const x2 = pad.left + cW;

  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Column headers */}
      <div style={{ position: "absolute", left: x1, top: pad.top - height * 0.05, color: colors.text, fontSize: width * 0.016, fontWeight: 700, textAlign: "center" }}>{startYear}</div>
      <div style={{ position: "absolute", left: x2, top: pad.top - height * 0.05, color: colors.text, fontSize: width * 0.016, fontWeight: 700, textAlign: "center" }}>{endYear}</div>

      {/* Vertical guides */}
      <div style={{ position: "absolute", left: x1, top: pad.top, width: 1, height: cH, background: `${colors.text}20` }} />
      <div style={{ position: "absolute", left: x2, top: pad.top, width: 1, height: cH, background: `${colors.text}20` }} />

      <svg style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none" }}>
        {sorted.map((d, i) => {
          const delay = i * fps * 0.15;
          const lineProgress = interpolate(frame, [fps * 0.5 + delay, fps * 1.5 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const color = SLOPE_COLORS[i % SLOPE_COLORS.length];
          const y1 = toY(d.start);
          const y2 = toY(d.end);
          const curX2 = x1 + (x2 - x1) * lineProgress;
          const curY2 = y1 + (y2 - y1) * lineProgress;
          const change = d.end - d.start;
          const isUp = change >= 0;

          return (
            <React.Fragment key={i}>
              <line x1={x1} y1={y1} x2={curX2} y2={curY2} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
              <circle cx={x1} cy={y1} r={5} fill={color} stroke={colors.background} strokeWidth={2} />
              {lineProgress > 0.95 && <circle cx={x2} cy={y2} r={5} fill={color} stroke={colors.background} strokeWidth={2} />}
            </React.Fragment>
          );
        })}
      </svg>

      {/* Labels */}
      {sorted.map((d, i) => {
        const delay = i * fps * 0.15;
        const opacity = interpolate(frame, [fps * 0.5 + delay, fps * 1 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const change = d.end - d.start;

        return (
          <React.Fragment key={`label-${i}`}>
            <div style={{ position: "absolute", left: x1 - width * 0.15, top: toY(d.start) - 8, color: colors.text, fontSize: width * 0.01, fontWeight: 600, textAlign: "right", width: width * 0.13, opacity }}>{d.state}</div>
            <div style={{ position: "absolute", left: x2 + 8, top: toY(d.end) - 8, color: change >= 0 ? "#10B981" : "#EF4444", fontSize: width * 0.01, fontWeight: 600, opacity }}>
              {d.end} ({change >= 0 ? "+" : ""}{change})
            </div>
          </React.Fragment>
        );
      })}

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface LineRaceProps {
  data: Array<{ year: number; value: number }>;
  title: string;
  subtitle?: string;
  endNote?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

export const LineRaceTemplate: React.FC<LineRaceProps> = ({ data = [], title, subtitle, endNote, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!data || data.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: colors.text, fontSize: 32 }}>No data provided</div>
      </AbsoluteFill>
    );
  }

  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = Math.min(...data.map(d => d.value));
  const chartPadding = { top: height * 0.22, bottom: height * 0.15, left: width * 0.08, right: width * 0.05 };
  const chartW = width - chartPadding.left - chartPadding.right;
  const chartH = height - chartPadding.top - chartPadding.bottom;
  const progress = interpolate(frame, [0, durationInFrames * 0.8], [0, 1], { extrapolateRight: "clamp" });
  const visiblePoints = Math.max(1, Math.floor(data.length * progress));
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const getX = (i: number) => chartPadding.left + (i / (data.length - 1)) * chartW;
  const getY = (val: number) => chartPadding.top + chartH - ((val - minVal) / (maxVal - minVal || 1)) * chartH;

  const pathPoints = data.slice(0, visiblePoints).map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.value)}`).join(" ");
  const lastPoint = data[visiblePoints - 1];
  const lastX = getX(visiblePoints - 1);
  const lastY = getY(lastPoint.value);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: chartPadding.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.028, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.016, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        {[0, 0.25, 0.5, 0.75, 1].map(frac => {
          const y = chartPadding.top + chartH * (1 - frac);
          const val = minVal + (maxVal - minVal) * frac;
          return (
            <g key={frac}>
              <line x1={chartPadding.left} y1={y} x2={chartPadding.left + chartW} y2={y} stroke={colors.text} strokeOpacity={0.1} />
              <text x={chartPadding.left - 10} y={y + 4} textAnchor="end" fill={colors.text} fillOpacity={0.5} fontSize={width * 0.012}>{Math.round(val).toLocaleString()}</text>
            </g>
          );
        })}
        <path d={pathPoints} fill="none" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lastX} cy={lastY} r={6} fill={colors.accent} />
        <text x={lastX + 12} y={lastY + 5} fill={colors.accent} fontSize={width * 0.018} fontWeight={700}>{lastPoint.value.toLocaleString()}</text>
        <text x={lastX + 12} y={lastY + 22} fill={colors.text} fillOpacity={0.6} fontSize={width * 0.012}>{lastPoint.year}</text>
      </svg>
      <div style={{ position: "absolute", bottom: height * 0.03, left: chartPadding.left, display: "flex", gap: 20, opacity: 0.5 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.011 }}>Source: {sourceLabel}</span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.011 }}>{brand}</span>}
      </div>
      {endNote && frame > durationInFrames * 0.85 && (
        <div style={{ position: "absolute", bottom: height * 0.08, right: chartPadding.right, color: colors.accent, fontSize: width * 0.015, fontWeight: 600, opacity: interpolate(frame, [durationInFrames * 0.85, durationInFrames * 0.9], [0, 1], { extrapolateRight: "clamp" }) }}>{endNote}</div>
      )}
    </AbsoluteFill>
  );
};

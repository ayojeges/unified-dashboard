"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface SchoolMatrixProps {
  schools: Array<{ name: string; x: number; y: number; size?: number; color?: string }>;
  xLabel: string;
  yLabel: string;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  quadrants?: { topLeft: string; topRight: string; bottomLeft: string; bottomRight: string };
}

const DOT_COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316", "#14B8A6", "#6366F1"];

export const SchoolMatrixTemplate: React.FC<SchoolMatrixProps> = ({
  schools = [], xLabel, yLabel, title, subtitle, brand, colors, sourceLabel, quadrants,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!schools.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const chartLeft = width * 0.12;
  const chartRight = width * 0.92;
  const chartTop = height * 0.22;
  const chartBottom = height * 0.82;
  const chartW = chartRight - chartLeft;
  const chartH = chartBottom - chartTop;

  const maxX = Math.max(...schools.map(s => s.x), 1);
  const maxY = Math.max(...schools.map(s => s.y), 1);
  const minX = Math.min(...schools.map(s => s.x), 0);
  const minY = Math.min(...schools.map(s => s.y), 0);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Quadrant labels */}
      {quadrants && (() => {
        const qOpacity = interpolate(frame, [10, 30], [0, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <>
            <div style={{ position: "absolute", top: chartTop + 10, left: chartLeft + 10, color: colors.text, fontSize: width * 0.01, opacity: qOpacity, fontWeight: 600 }}>{quadrants.topLeft}</div>
            <div style={{ position: "absolute", top: chartTop + 10, right: width - chartRight + 10, color: colors.text, fontSize: width * 0.01, opacity: qOpacity, fontWeight: 600, textAlign: "right" }}>{quadrants.topRight}</div>
            <div style={{ position: "absolute", bottom: height - chartBottom + 10, left: chartLeft + 10, color: colors.text, fontSize: width * 0.01, opacity: qOpacity, fontWeight: 600 }}>{quadrants.bottomLeft}</div>
            <div style={{ position: "absolute", bottom: height - chartBottom + 10, right: width - chartRight + 10, color: colors.text, fontSize: width * 0.01, opacity: qOpacity, fontWeight: 600, textAlign: "right" }}>{quadrants.bottomRight}</div>
          </>
        );
      })()}

      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        {/* Grid */}
        <rect x={chartLeft} y={chartTop} width={chartW} height={chartH} fill="none" stroke={colors.text} strokeOpacity={0.1} strokeWidth={1} />
        {/* Crosshair lines */}
        <line x1={chartLeft + chartW / 2} y1={chartTop} x2={chartLeft + chartW / 2} y2={chartBottom} stroke={colors.text} strokeOpacity={0.08} strokeWidth={1} strokeDasharray="6,4" />
        <line x1={chartLeft} y1={chartTop + chartH / 2} x2={chartRight} y2={chartTop + chartH / 2} stroke={colors.text} strokeOpacity={0.08} strokeWidth={1} strokeDasharray="6,4" />

        {/* Axis labels */}
        <text x={chartLeft + chartW / 2} y={chartBottom + 36} textAnchor="middle" fill={colors.text} fontSize={width * 0.012} opacity={0.6} fontWeight={600}>{xLabel}</text>
        <text x={chartLeft - 14} y={chartTop + chartH / 2} textAnchor="middle" fill={colors.text} fontSize={width * 0.012} opacity={0.6} fontWeight={600} transform={`rotate(-90, ${chartLeft - 14}, ${chartTop + chartH / 2})`}>{yLabel}</text>

        {/* Schools as dots */}
        {schools.map((school, i) => {
          const delay = i * 6;
          const prog = interpolate(frame, [20 + delay, 45 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const px = chartLeft + ((school.x - minX) / rangeX) * chartW * 0.9 + chartW * 0.05;
          const py = chartBottom - ((school.y - minY) / rangeY) * chartH * 0.9 - chartH * 0.05;
          const dotColor = school.color || DOT_COLORS[i % DOT_COLORS.length];
          const dotR = (school.size || 20) * 0.4 + 6;

          return (
            <g key={i} opacity={prog}>
              <circle cx={px} cy={py} r={dotR * prog} fill={dotColor} fillOpacity={0.7} stroke={dotColor} strokeWidth={2} />
              <text x={px} y={py - dotR - 6} textAnchor="middle" fill={colors.text} fontSize={width * 0.009} fontWeight={600}>{school.name}</text>
            </g>
          );
        })}
      </svg>

      {sourceLabel && (
        <div style={{ position: "absolute", bottom: height * 0.02, width: "100%", textAlign: "center" }}>
          <span style={{ color: colors.text, fontSize: width * 0.009, opacity: 0.35 }}>Source: {sourceLabel}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

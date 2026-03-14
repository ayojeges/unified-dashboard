"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface TimelineSeries {
  label: string;
  color: string;
  data: Array<{ year: number; value: number }>;
}

interface Callout {
  year: number;
  text: string;
  color?: string;
}

interface FeesTimelineProps {
  series: TimelineSeries[];
  callouts?: Callout[];
  title?: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  yAxisLabel?: string;
}

export const FeesTimelineTemplate: React.FC<FeesTimelineProps> = ({
  series = [],
  callouts = [],
  title = "SCHOOL FEES TIMELINE",
  subtitle,
  brand,
  colors,
  sourceLabel,
  yAxisLabel = "Annual Fees (₦)",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!series || series.length === 0 || series.every((s) => s.data.length === 0)) {
    return (
      <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: colors.text, fontSize: 32 }}>No data provided</div>
      </AbsoluteFill>
    );
  }

  // Collect all years and values
  const allYears = [...new Set(series.flatMap((s) => s.data.map((d) => d.year)))].sort();
  const allValues = series.flatMap((s) => s.data.map((d) => d.value));
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const valueRange = maxVal - minVal || 1;

  // Chart dimensions
  const padding = {
    top: height * 0.2,
    bottom: height * 0.15,
    left: width * 0.1,
    right: width * 0.08,
  };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Animation phases
  const titleEnd = 25;
  const chartDrawEnd = durationInFrames * 0.75;
  const calloutsEnd = durationInFrames * 0.95;

  // Title
  const titleOpacity = interpolate(frame, [0, titleEnd], [0, 1], { extrapolateRight: "clamp" });

  // Chart drawing progress
  const chartProg = interpolate(frame, [titleEnd + 10, chartDrawEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Coordinate transforms
  const getX = (year: number) => padding.left + ((year - minYear) / (maxYear - minYear || 1)) * chartW;
  const getY = (value: number) => padding.top + chartH - ((value - minVal) / valueRange) * chartH;

  // Format value
  const formatVal = (v: number) => {
    if (v >= 1000000) return `₦${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `₦${(v / 1000).toFixed(0)}K`;
    return `₦${v}`;
  };

  // Grid lines (Y axis)
  const gridLines = 5;
  const gridValues = Array.from({ length: gridLines }, (_, i) => minVal + (valueRange / (gridLines - 1)) * i);

  // Generate path for each series
  const getSeriesPath = (data: Array<{ year: number; value: number }>, progress: number) => {
    const sortedData = [...data].sort((a, b) => a.year - b.year);
    const visibleCount = Math.max(1, Math.ceil(sortedData.length * progress));
    return sortedData.slice(0, visibleCount).map((d, i) => {
      const x = getX(d.year);
      const y = getY(d.value);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Background */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at 50% 0%, ${colors.primary}12 0%, transparent 60%)`,
      }} />

      {/* Title */}
      <div style={{
        position: "absolute",
        top: height * 0.03,
        width: "100%",
        textAlign: "center",
        opacity: titleOpacity,
        zIndex: 10,
      }}>
        <div style={{
          color: colors.accent,
          fontSize: width * 0.011,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}>
          {brand}
        </div>
        <div style={{
          color: colors.text,
          fontSize: width * 0.026,
          fontWeight: 800,
          marginTop: 2,
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 2 }}>{subtitle}</div>
        )}
      </div>

      {/* Y axis label */}
      <div style={{
        position: "absolute",
        top: padding.top + chartH / 2,
        left: width * 0.015,
        transform: "rotate(-90deg) translateX(-50%)",
        color: colors.text,
        fontSize: width * 0.01,
        opacity: 0.4,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}>
        {yAxisLabel}
      </div>

      {/* Chart SVG */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: interpolate(frame, [titleEnd, titleEnd + 15], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {/* Grid lines */}
        {gridValues.map((val, i) => {
          const y = getY(val);
          return (
            <g key={`grid-${i}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartW}
                y2={y}
                stroke={colors.text}
                strokeOpacity={0.08}
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fill={colors.text}
                fillOpacity={0.4}
                fontSize={width * 0.01}
              >
                {formatVal(Math.round(val))}
              </text>
            </g>
          );
        })}

        {/* X axis labels (years) */}
        {allYears.map((year) => {
          const x = getX(year);
          return (
            <text
              key={year}
              x={x}
              y={padding.top + chartH + 20}
              textAnchor="middle"
              fill={colors.text}
              fillOpacity={0.5}
              fontSize={width * 0.011}
            >
              {year}
            </text>
          );
        })}

        {/* Chart area fill */}
        {series.map((s, si) => {
          const sortedData = [...s.data].sort((a, b) => a.year - b.year);
          const visibleCount = Math.max(1, Math.ceil(sortedData.length * chartProg));
          if (visibleCount < 2) return null;

          const areaPath = sortedData
            .slice(0, visibleCount)
            .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(d.year)} ${getY(d.value)}`)
            .join(" ") +
            ` L ${getX(sortedData[visibleCount - 1].year)} ${padding.top + chartH}` +
            ` L ${getX(sortedData[0].year)} ${padding.top + chartH} Z`;

          return (
            <path key={`area-${si}`} d={areaPath} fill={`${s.color}10`} />
          );
        })}

        {/* Lines */}
        {series.map((s, si) => {
          const pathD = getSeriesPath(s.data, chartProg);
          return (
            <g key={`line-${si}`}>
              {/* Glow */}
              <path
                d={pathD}
                fill="none"
                stroke={s.color}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.2}
              />
              {/* Main line */}
              <path
                d={pathD}
                fill="none"
                stroke={s.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {/* Data points on lines */}
        {series.map((s, si) => {
          const sortedData = [...s.data].sort((a, b) => a.year - b.year);
          const visibleCount = Math.max(1, Math.ceil(sortedData.length * chartProg));
          return sortedData.slice(0, visibleCount).map((d, i) => {
            const isLast = i === visibleCount - 1;
            return (
              <circle
                key={`dot-${si}-${i}`}
                cx={getX(d.year)}
                cy={getY(d.value)}
                r={isLast ? 5 : 3}
                fill={s.color}
                stroke={colors.background}
                strokeWidth={isLast ? 2 : 1}
              />
            );
          });
        })}

        {/* Callout bubbles */}
        {callouts.map((co, ci) => {
          const calloutFrame = titleEnd + 20 + ci * 15;
          const calloutOpacity = interpolate(frame, [calloutFrame, calloutFrame + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const calloutY = interpolate(frame, [calloutFrame, calloutFrame + 15], [15, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          if (calloutOpacity <= 0) return null;

          const x = getX(co.year);
          // Find the Y from the first series for this year
          const firstSeriesData = series[0]?.data.find((d) => d.year === co.year);
          const baseY = firstSeriesData ? getY(firstSeriesData.value) : padding.top + chartH / 2;

          return (
            <g key={`callout-${ci}`} opacity={calloutOpacity}>
              {/* Connector line */}
              <line
                x1={x}
                y1={baseY - 10}
                x2={x}
                y2={baseY - 40 + calloutY}
                stroke={co.color || colors.accent}
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.6}
              />
              {/* Bubble */}
              <rect
                x={x - 60}
                y={baseY - 65 + calloutY}
                width={120}
                height={24}
                rx={6}
                fill={co.color || colors.accent}
                fillOpacity={0.15}
                stroke={co.color || colors.accent}
                strokeWidth={1}
                strokeOpacity={0.4}
              />
              <text
                x={x}
                y={baseY - 48 + calloutY}
                textAnchor="middle"
                fill={co.color || colors.accent}
                fontSize={width * 0.009}
                fontWeight={600}
              >
                {co.text}
              </text>
            </g>
          );
        })}

        {/* X axis line */}
        <line
          x1={padding.left}
          y1={padding.top + chartH}
          x2={padding.left + chartW}
          y2={padding.top + chartH}
          stroke={colors.text}
          strokeOpacity={0.15}
        />
      </svg>

      {/* Legend */}
      <div style={{
        position: "absolute",
        top: height * 0.13,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: width * 0.025,
        opacity: interpolate(frame, [titleEnd + 5, titleEnd + 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        {series.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 12,
              height: 3,
              backgroundColor: s.color,
              borderRadius: 2,
            }} />
            <span style={{
              color: colors.text,
              fontSize: width * 0.011,
              fontWeight: 500,
              opacity: 0.8,
            }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Branding */}
      <div style={{
        position: "absolute",
        bottom: height * 0.02,
        left: width * 0.04,
        display: "flex",
        alignItems: "center",
        gap: 8,
        opacity: 0.5,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: colors.primary }} />
        <span style={{ color: colors.text, fontSize: width * 0.011, fontWeight: 600 }}>{brand}</span>
        {sourceLabel && (
          <span style={{ color: colors.text, fontSize: width * 0.01, opacity: 0.5, fontStyle: "italic" }}>
            • Source: {sourceLabel}
          </span>
        )}
      </div>

      {/* Top progress bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: "clamp" })}%`,
        height: 3,
        background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
      }} />
    </AbsoluteFill>
  );
};

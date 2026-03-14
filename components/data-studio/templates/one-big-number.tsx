"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface OneBigNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  title: string;
  contextLine?: string;
  sourceLabel?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  trendData?: number[];
  trendLabels?: string[];
}

export const OneBigNumberTemplate: React.FC<OneBigNumberProps> = ({
  value = 0,
  prefix = "",
  suffix = "",
  title,
  contextLine,
  sourceLabel,
  brand,
  colors,
  trendData = [],
  trendLabels = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Phases
  const numberRevealEnd = durationInFrames * 0.35;
  const contextRevealEnd = durationInFrames * 0.55;
  const chartRevealEnd = durationInFrames * 0.85;

  // Animated counter
  const countProgress = spring({
    frame,
    fps,
    from: 0,
    to: value,
    config: { damping: 80, stiffness: 25, mass: 1.5 },
  });
  const displayValue = Math.round(countProgress);

  // Pulsing glow on the number
  const glowIntensity = interpolate(
    Math.sin(frame * 0.05) * 0.5 + 0.5,
    [0, 1],
    [0.2, 0.6]
  );

  // Title animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [20, 0], { extrapolateRight: "clamp" });

  // Number animation
  const numberOpacity = interpolate(frame, [5, numberRevealEnd], [0, 1], { extrapolateRight: "clamp" });
  const numberScale = spring({ frame, fps, from: 0.3, to: 1, config: { damping: 12, stiffness: 80 } });

  // Context line
  const contextOpacity = interpolate(
    frame,
    [numberRevealEnd, contextRevealEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Sparkline chart
  const chart = trendData || [];
  const chartMax = chart.length > 0 ? Math.max(...chart) : 1;
  const chartMin = chart.length > 0 ? Math.min(...chart) : 0;
  const chartRange = chartMax - chartMin || 1;

  const chartWidth = width * 0.5;
  const chartHeight = height * 0.12;
  const chartOpacity = interpolate(
    frame,
    [contextRevealEnd, chartRevealEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Chart drawing progress
  const chartProg = interpolate(
    frame,
    [contextRevealEnd + 10, chartRevealEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const visibleChartPoints = Math.max(1, Math.ceil(chart.length * chartProg));

  // Generate sparkline path
  const sparklinePath = chart.slice(0, visibleChartPoints).map((v, i) => {
    const x = (i / Math.max(chart.length - 1, 1)) * chartWidth;
    const y = chartHeight - ((v - chartMin) / chartRange) * (chartHeight - 20);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  // Area fill path
  const areaPath = chart.length > 0
    ? sparklinePath +
      ` L ${(visibleChartPoints - 1) / Math.max(chart.length - 1, 1) * chartWidth} ${chartHeight} L 0 ${chartHeight} Z`
    : "";

  // Trend direction
  const trendUp = chart.length >= 2 && chart[chart.length - 1] > chart[0];
  const trendColor = trendUp ? "#10B981" : "#EF4444";

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Background effects */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at 50% 35%, ${colors.primary}18 0%, transparent 60%)`,
      }} />

      {/* Subtle ring decoration */}
      <svg width={width} height={height} style={{ position: "absolute", opacity: 0.05 }}>
        <circle cx={width / 2} cy={height * 0.38} r={width * 0.2} fill="none" stroke={colors.primary} strokeWidth={1} />
        <circle cx={width / 2} cy={height * 0.38} r={width * 0.25} fill="none" stroke={colors.accent} strokeWidth={0.5} />
      </svg>

      {/* Title */}
      <div style={{
        position: "absolute",
        top: height * 0.08,
        width: "100%",
        textAlign: "center",
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
      }}>
        <div style={{
          color: colors.text,
          fontSize: width * 0.022,
          fontWeight: 500,
          opacity: 0.7,
          lineHeight: 1.3,
          maxWidth: width * 0.7,
          margin: "0 auto",
        }}>
          {title}
        </div>
      </div>

      {/* Big number */}
      <div style={{
        position: "absolute",
        top: height * 0.25,
        width: "100%",
        textAlign: "center",
        opacity: numberOpacity,
        transform: `scale(${numberScale})`,
      }}>
        {/* Glow effect behind number */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: width * 0.3,
          height: width * 0.2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.primary}${Math.round(glowIntensity * 99).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
        }} />

        <span style={{
          color: colors.primary,
          fontSize: width * 0.12,
          fontWeight: 900,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: `0 0 ${40 * glowIntensity}px ${colors.primary}55`,
          position: "relative",
        }}>
          {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
      </div>

      {/* Context line */}
      {contextLine && (
        <div style={{
          position: "absolute",
          top: height * 0.55,
          width: "100%",
          textAlign: "center",
          opacity: contextOpacity,
        }}>
          <div style={{
            color: colors.text,
            fontSize: width * 0.018,
            fontWeight: 400,
            opacity: 0.8,
            maxWidth: width * 0.6,
            margin: "0 auto",
            lineHeight: 1.5,
          }}>
            {contextLine}
          </div>
        </div>
      )}

      {/* Sparkline chart */}
      {chart.length > 1 && (
        <div style={{
          position: "absolute",
          top: height * 0.68,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: chartOpacity,
        }}>
          <svg width={chartWidth} height={chartHeight}>
            {/* Area fill */}
            <path d={areaPath} fill={`${colors.primary}15`} />
            {/* Line */}
            <path
              d={sparklinePath}
              fill="none"
              stroke={colors.primary}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* End dot */}
            {visibleChartPoints > 0 && (
              <circle
                cx={(visibleChartPoints - 1) / Math.max(chart.length - 1, 1) * chartWidth}
                cy={chartHeight - ((chart[visibleChartPoints - 1] - chartMin) / chartRange) * (chartHeight - 20)}
                r={5}
                fill={colors.accent}
                stroke={colors.background}
                strokeWidth={2}
              />
            )}
            {/* Trend arrow */}
            {visibleChartPoints === chart.length && (
              <text
                x={chartWidth + 10}
                y={chartHeight - ((chart[chart.length - 1] - chartMin) / chartRange) * (chartHeight - 20) + 5}
                fill={trendColor}
                fontSize={14}
                fontWeight={700}
              >
                {trendUp ? "↑" : "↓"}
              </text>
            )}
          </svg>

          {/* Trend labels */}
          {trendLabels.length > 0 && (
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              width: chartWidth,
              marginTop: 4,
            }}>
              {trendLabels.map((label, i) => (
                <span key={i} style={{
                  color: colors.text,
                  fontSize: width * 0.009,
                  opacity: 0.4,
                }}>
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Source citation */}
      <div style={{
        position: "absolute",
        bottom: height * 0.03,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: 16,
        opacity: interpolate(frame, [chartRevealEnd - 15, chartRevealEnd], [0, 0.5], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}>
        {sourceLabel && (
          <span style={{ color: colors.text, fontSize: width * 0.01, fontStyle: "italic" }}>
            Source: {sourceLabel}
          </span>
        )}
        <span style={{ color: colors.text, fontSize: width * 0.01, fontWeight: 600 }}>{brand}</span>
      </div>

      {/* Bottom accent bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: `${interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: "clamp" })}%`,
        height: 3,
        background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.accent})`,
      }} />
    </AbsoluteFill>
  );
};

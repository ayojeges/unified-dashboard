"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface ForecastLineProps {
  historical: Array<{ year: number; value: number }>;
  forecast: Array<{ year: number; value: number; low: number; high: number }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

export const ForecastLineTemplate: React.FC<ForecastLineProps> = ({ historical = [], forecast = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!historical.length && !forecast.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.18, bottom: height * 0.14, left: width * 0.08, right: width * 0.06 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const allYears = [...historical.map(d => d.year), ...forecast.map(d => d.year)];
  const allVals = [...historical.map(d => d.value), ...forecast.map(d => d.high || d.value)];
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const maxVal = Math.max(...allVals) * 1.15;

  const toX = (y: number) => pad.left + ((y - minYear) / (maxYear - minYear)) * cW;
  const toY = (v: number) => pad.top + cH - (v / maxVal) * cH;

  const histReveal = interpolate(frame, [fps * 0.5, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const foreReveal = interpolate(frame, [fps * 4, fps * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  const histClip = pad.left + (historical.length ? ((toX(historical[historical.length - 1].year) - pad.left) * histReveal) : 0);
  const foreStart = historical.length ? toX(historical[historical.length - 1].year) : pad.left;
  const foreEnd = forecast.length ? toX(forecast[forecast.length - 1].year) : foreStart;
  const foreClip = foreStart + (foreEnd - foreStart) * foreReveal;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <div key={i} style={{ position: "absolute", left: pad.left, top: toY(maxVal * p), width: cW, height: 1, background: `${colors.text}10` }}>
          <span style={{ position: "absolute", left: -pad.left * 0.7, top: -7, fontSize: width * 0.01, color: `${colors.text}50` }}>
            {Math.round(maxVal * p)}
          </span>
        </div>
      ))}

      <svg style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none" }}>
        {/* Confidence band */}
        {forecast.length > 0 && foreReveal > 0 && (
          <path
            d={[
              `M${toX(forecast[0].year)},${toY(forecast[0].high)}`,
              ...forecast.map(d => `L${toX(d.year)},${toY(d.high)}`),
              ...forecast.slice().reverse().map(d => `L${toX(d.year)},${toY(d.low)}`),
              "Z",
            ].join(" ")}
            fill={colors.primary}
            fillOpacity={0.12}
            clipPath={`inset(0 ${width - foreClip}px 0 0)`}
          />
        )}

        {/* Historical line */}
        {historical.length > 1 && (
          <polyline
            fill="none"
            stroke={colors.primary}
            strokeWidth={3}
            strokeLinecap="round"
            points={historical.map(d => `${toX(d.year)},${toY(d.value)}`).join(" ")}
            clipPath={`inset(0 ${width - histClip}px 0 0)`}
          />
        )}

        {/* Forecast line (dashed) */}
        {forecast.length > 0 && (
          <polyline
            fill="none"
            stroke={colors.primary}
            strokeWidth={3}
            strokeDasharray="8,6"
            strokeLinecap="round"
            opacity={0.7}
            points={[
              ...(historical.length ? [`${toX(historical[historical.length - 1].year)},${toY(historical[historical.length - 1].value)}`] : []),
              ...forecast.map(d => `${toX(d.year)},${toY(d.value)}`),
            ].join(" ")}
            clipPath={`inset(0 ${width - foreClip}px 0 0)`}
          />
        )}
      </svg>

      {/* Dots on historical */}
      {historical.map((d, i) => {
        const opacity = histReveal > (i / historical.length) ? 1 : 0;
        return (
          <div key={i} style={{
            position: "absolute",
            left: toX(d.year) - 4, top: toY(d.value) - 4,
            width: 8, height: 8, borderRadius: "50%",
            background: colors.primary, opacity,
          }} />
        );
      })}

      {/* Labels */}
      <div style={{ position: "absolute", bottom: height * 0.04, left: pad.left + cW * 0.2, fontSize: width * 0.011, color: colors.primary, fontWeight: 600 }}>Historical</div>
      <div style={{ position: "absolute", bottom: height * 0.04, left: pad.left + cW * 0.6, fontSize: width * 0.011, color: colors.primary, fontWeight: 600, opacity: 0.7 }}>Forecast</div>

      {/* Year axis */}
      {allYears.filter((_, i) => i % 2 === 0 || i === allYears.length - 1).map(yr => (
        <div key={yr} style={{ position: "absolute", left: toX(yr) - 12, top: pad.top + cH + 6, fontSize: width * 0.01, color: `${colors.text}60` }}>{yr}</div>
      ))}

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

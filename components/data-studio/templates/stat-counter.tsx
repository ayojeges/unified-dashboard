"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface StatCounterProps {
  value: number;
  title: string;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  contextLine?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  miniChartData?: number[];
}

export const StatCounterTemplate: React.FC<StatCounterProps> = ({ value = 0, title, subtitle, prefix = "", suffix = "", contextLine, brand, colors, sourceLabel, miniChartData }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const countProgress = spring({ frame, fps, from: 0, to: value, config: { damping: 80, stiffness: 30, mass: 1 } });
  const displayValue = Math.round(countProgress);
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const numberScale = interpolate(frame, [10, 40], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const chart = miniChartData || [];
  const chartMax = Math.max(...chart, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: width * 0.024, fontWeight: 500, opacity: 0.7 }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.015, opacity: 0.5, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div style={{ transform: `scale(${numberScale})`, textAlign: "center", margin: "20px 0" }}>
        <span style={{ color: colors.primary, fontSize: width * 0.08, fontWeight: 800, fontFamily: "system-ui" }}>
          {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
      </div>
      {contextLine && <div style={{ color: colors.text, fontSize: width * 0.016, opacity: 0.6, textAlign: "center" }}>{contextLine}</div>}
      {chart.length > 1 && (
        <svg width={width * 0.4} height={height * 0.12} style={{ marginTop: 20 }}>
          <path
            d={chart.map((v, i) => {
              const x = (i / (chart.length - 1)) * width * 0.4;
              const y = height * 0.12 - (v / chartMax) * height * 0.1;
              return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            }).join(" ")}
            fill="none" stroke={colors.primary} strokeWidth={2} strokeLinecap="round"
          />
        </svg>
      )}
      <div style={{ position: "absolute", bottom: height * 0.04, display: "flex", gap: 20, opacity: 0.4 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.011 }}>Source: {sourceLabel}</span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.011 }}>{brand}</span>}
      </div>
    </AbsoluteFill>
  );
};

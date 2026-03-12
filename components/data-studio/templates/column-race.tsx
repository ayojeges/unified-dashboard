"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface ColumnRaceProps {
  data: Array<{ name: string; value: number; color?: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valueSuffix?: string;
}

const BAR_COLORS = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

export const ColumnRaceTemplate: React.FC<ColumnRaceProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel, valueSuffix = "" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.2, bottom: height * 0.18, left: width * 0.08, right: width * 0.05 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map(d => d.value)) * 1.15;
  const barW = cW / data.length * 0.6;
  const gap = cW / data.length;

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.05, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.028, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
        <div key={i} style={{ position: "absolute", left: pad.left, top: pad.top + cH * (1 - pct), width: cW, height: 1, background: `${colors.text}15` }}>
          <span style={{ position: "absolute", left: -pad.left * 0.8, top: -8, fontSize: width * 0.011, color: `${colors.text}60` }}>
            {Math.round(maxVal * pct)}
          </span>
        </div>
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const barDelay = i * (fps * 0.3);
        const barProgress = interpolate(frame, [fps * 0.5 + barDelay, fps * 1.5 + barDelay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const barHeight = (d.value / maxVal) * cH * barProgress;
        const barColor = d.color || BAR_COLORS[i % BAR_COLORS.length];
        const x = pad.left + i * gap + (gap - barW) / 2;

        return (
          <React.Fragment key={i}>
            <div style={{
              position: "absolute",
              left: x,
              bottom: pad.bottom,
              width: barW,
              height: barHeight,
              background: barColor,
              borderRadius: `${width * 0.004}px ${width * 0.004}px 0 0`,
              transition: "height 0.1s",
            }} />
            {/* Value label */}
            <div style={{
              position: "absolute",
              left: x,
              bottom: pad.bottom + barHeight + 8,
              width: barW,
              textAlign: "center",
              color: barColor,
              fontSize: width * 0.014,
              fontWeight: 700,
              opacity: barProgress,
            }}>{d.value}{valueSuffix}</div>
            {/* Name label */}
            <div style={{
              position: "absolute",
              left: x,
              bottom: pad.bottom - height * 0.06,
              width: barW,
              textAlign: "center",
              color: colors.text,
              fontSize: width * 0.011,
              opacity: 0.8,
            }}>{d.name}</div>
          </React.Fragment>
        );
      })}

      {/* Source */}
      {sourceLabel && (
        <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>
      )}
    </AbsoluteFill>
  );
};

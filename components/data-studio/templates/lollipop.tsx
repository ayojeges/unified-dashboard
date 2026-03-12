"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface LollipopProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valueSuffix?: string;
}

export const LollipopTemplate: React.FC<LollipopProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel, valueSuffix = "%" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 15);
  const pad = { top: height * 0.18, bottom: height * 0.08, left: width * 0.15, right: width * 0.08 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const maxVal = Math.max(...sorted.map(d => d.value)) * 1.1;
  const minVal = Math.min(...sorted.map(d => d.value)) * 0.85;
  const rowH = cH / sorted.length;
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  // Color gradient from high to low
  const getColor = (val: number) => {
    const t = (val - minVal) / (maxVal - minVal);
    const r = Math.round(100 + t * 0);
    const g = Math.round(200 * t + 100);
    const b = Math.round(218 * t + 50);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {sorted.map((d, i) => {
        const delay = i * fps * 0.08;
        const progress = interpolate(frame, [fps * 0.4 + delay, fps * 1.5 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const lineWidth = ((d.value - minVal) / (maxVal - minVal)) * cW * progress;
        const y = pad.top + i * rowH + rowH * 0.5;
        const color = getColor(d.value);

        return (
          <React.Fragment key={i}>
            {/* Name */}
            <div style={{
              position: "absolute", left: width * 0.01, top: y - 8,
              width: pad.left - width * 0.02, textAlign: "right",
              color: colors.text, fontSize: width * 0.01, fontWeight: 600, opacity: progress,
            }}>{d.name}</div>

            {/* Line */}
            <div style={{
              position: "absolute", left: pad.left, top: y - 1,
              width: lineWidth, height: 2,
              background: color, borderRadius: 1, opacity: progress,
            }} />

            {/* Circle */}
            <div style={{
              position: "absolute",
              left: pad.left + lineWidth - 6, top: y - 6,
              width: 12, height: 12, borderRadius: "50%",
              background: color, border: "2px solid #fff", opacity: progress,
            }} />

            {/* Value */}
            {progress > 0.8 && (
              <div style={{
                position: "absolute",
                left: pad.left + lineWidth + 10, top: y - 7,
                color: colors.text, fontSize: width * 0.01, fontWeight: 700, opacity: progress,
              }}>{d.value.toFixed(1)}{valueSuffix}</div>
            )}
          </React.Fragment>
        );
      })}

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface BoxPlotProps {
  data: Array<{ type: string; min: number; q1: number; median: number; q3: number; max: number; outliers?: number[] }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

const BOX_COLORS = ["#64ffda", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

export const BoxPlotTemplate: React.FC<BoxPlotProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel, valuePrefix = "$", valueSuffix = "" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.2, bottom: height * 0.15, left: width * 0.1, right: width * 0.05 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const allVals = data.flatMap(d => [d.min, d.max, ...(d.outliers || [])]);
  const maxVal = Math.max(...allVals) * 1.1;
  const minVal = Math.min(0, ...allVals);
  const range = maxVal - minVal;

  const toY = (v: number) => pad.top + cH * (1 - (v - minVal) / range);
  const groupW = cW / data.length;
  const boxW = groupW * 0.5;

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.05, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Y-axis grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const val = minVal + range * pct;
        return (
          <div key={i} style={{ position: "absolute", left: pad.left, top: toY(val), width: cW, height: 1, background: `${colors.text}12` }}>
            <span style={{ position: "absolute", right: cW + 8, top: -8, fontSize: width * 0.01, color: `${colors.text}50`, whiteSpace: "nowrap" }}>
              {valuePrefix}{Math.round(val / 1000)}k{valueSuffix}
            </span>
          </div>
        );
      })}

      {/* Box plots */}
      {data.map((d, i) => {
        const delay = i * fps * 0.4;
        const progress = interpolate(frame, [fps * 0.5 + delay, fps * 1.5 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const boxColor = BOX_COLORS[i % BOX_COLORS.length];
        const x = pad.left + i * groupW + (groupW - boxW) / 2;
        const centerX = x + boxW / 2;

        return (
          <React.Fragment key={i}>
            {/* Whisker line */}
            <div style={{
              position: "absolute",
              left: centerX - 1,
              top: toY(d.max),
              width: 2,
              height: (toY(d.min) - toY(d.max)) * progress,
              background: `${colors.text}30`,
              borderStyle: "dashed",
            }} />
            {/* Min cap */}
            <div style={{ position: "absolute", left: x + boxW * 0.25, top: toY(d.min) - 1, width: boxW * 0.5, height: 2, background: `${colors.text}50`, opacity: progress }} />
            {/* Max cap */}
            <div style={{ position: "absolute", left: x + boxW * 0.25, top: toY(d.max) - 1, width: boxW * 0.5, height: 2, background: `${colors.text}50`, opacity: progress }} />
            {/* Box (Q1 to Q3) */}
            <div style={{
              position: "absolute",
              left: x,
              top: toY(d.q3),
              width: boxW,
              height: (toY(d.q1) - toY(d.q3)) * progress,
              background: `${boxColor}30`,
              border: `2px solid ${boxColor}`,
              borderRadius: 4,
            }} />
            {/* Median line */}
            <div style={{
              position: "absolute",
              left: x,
              top: toY(d.median) - 1.5,
              width: boxW,
              height: 3,
              background: "#ff6b6b",
              opacity: progress,
              borderRadius: 2,
            }} />
            {/* Outliers */}
            {(d.outliers || []).map((o, oi) => (
              <div key={oi} style={{
                position: "absolute",
                left: centerX - 5,
                top: toY(o) - 5,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#EF4444",
                opacity: progress,
              }} />
            ))}
            {/* Label */}
            <div style={{
              position: "absolute",
              left: x,
              top: pad.top + cH + 12,
              width: boxW,
              textAlign: "center",
              color: colors.text,
              fontSize: width * 0.012,
              opacity: 0.8,
            }}>{d.type}</div>
          </React.Fragment>
        );
      })}

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

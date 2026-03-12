"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface DotPlotProps {
  data: Array<{ type: string; min: number; median: number; max: number; outliers?: number[] }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valuePrefix?: string;
}

const DOT_COLORS = ["#64ffda", "#ff6b6b", "#ffd93d", "#a78bfa"];

export const DotPlotTemplate: React.FC<DotPlotProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel, valuePrefix = "$" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.2, bottom: height * 0.14, left: width * 0.14, right: width * 0.06 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const allVals = data.flatMap(d => [d.min, d.max, ...(d.outliers || [])]);
  const maxVal = Math.max(...allVals) * 1.15;
  const rowH = cH / data.length;

  const toX = (v: number) => pad.left + (v / maxVal) * cW;
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* X axis ticks */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <div key={i} style={{ position: "absolute", left: pad.left + cW * p, top: pad.top + cH + 6, fontSize: width * 0.01, color: `${colors.text}60`, transform: "translateX(-50%)" }}>
          {valuePrefix}{Math.round(maxVal * p / 1000)}k
        </div>
      ))}

      {data.map((d, i) => {
        const delay = i * fps * 0.3;
        const progress = interpolate(frame, [fps * 0.5 + delay, fps * 1.8 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = pad.top + i * rowH + rowH * 0.5;
        const color = DOT_COLORS[i % DOT_COLORS.length];

        return (
          <React.Fragment key={i}>
            {/* Type label */}
            <div style={{
              position: "absolute", left: width * 0.01, top: y - 8,
              width: pad.left - width * 0.02, textAlign: "right",
              color: colors.text, fontSize: width * 0.012, fontWeight: 600, opacity: progress,
            }}>{d.type}</div>

            {/* Range line */}
            <div style={{
              position: "absolute",
              left: toX(d.min), top: y - 2,
              width: (toX(d.max) - toX(d.min)) * progress,
              height: 4, background: color, opacity: 0.3 * progress, borderRadius: 2,
            }} />

            {/* Min dot */}
            <div style={{
              position: "absolute",
              left: toX(d.min) - 5, top: y - 5,
              width: 10, height: 10, borderRadius: "50%",
              background: color, opacity: progress,
            }} />

            {/* Max dot */}
            <div style={{
              position: "absolute",
              left: toX(d.max) - 5, top: y - 5,
              width: 10, height: 10, borderRadius: "50%",
              background: color, opacity: progress,
            }} />

            {/* Median dot (larger) */}
            <div style={{
              position: "absolute",
              left: toX(d.median) - 8, top: y - 8,
              width: 16, height: 16, borderRadius: "50%",
              background: "#fff", border: `3px solid ${color}`, opacity: progress,
            }} />

            {/* Outliers */}
            {(d.outliers || []).map((o, oi) => (
              <div key={oi} style={{
                position: "absolute",
                left: toX(o) - 4, top: y - 4,
                width: 8, height: 8, borderRadius: "50%",
                background: "#EF4444", opacity: progress * 0.7,
              }} />
            ))}

            {/* Value labels */}
            {progress > 0.9 && (
              <>
                <div style={{ position: "absolute", left: toX(d.min) - 15, top: y + 10, fontSize: width * 0.008, color: `${colors.text}60` }}>{valuePrefix}{d.min}</div>
                <div style={{ position: "absolute", left: toX(d.median) - 15, top: y - 22, fontSize: width * 0.009, color: colors.text, fontWeight: 700 }}>{valuePrefix}{d.median}</div>
                <div style={{ position: "absolute", left: toX(d.max) - 15, top: y + 10, fontSize: width * 0.008, color: `${colors.text}60` }}>{valuePrefix}{d.max}</div>
              </>
            )}
          </React.Fragment>
        );
      })}

      {/* Legend */}
      <div style={{ position: "absolute", bottom: height * 0.03, left: pad.left, display: "flex", gap: width * 0.03 }}>
        {[{ label: "Min/Max", shape: "circle" }, { label: "Median", shape: "ring" }, { label: "Outlier", shape: "red" }].map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.shape === "red" ? "#EF4444" : l.shape === "ring" ? "transparent" : "#64ffda", border: l.shape === "ring" ? "2px solid #64ffda" : "none" }} />
            <span style={{ color: `${colors.text}70`, fontSize: width * 0.009 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

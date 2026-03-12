"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface BulletChartProps {
  data: Array<{ state: string; actual: number; target: number; ranges: [number, number, number] }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valueSuffix?: string;
}

export const BulletChartTemplate: React.FC<BulletChartProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel, valueSuffix = "%" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const items = data.slice(0, 8);
  const pad = { top: height * 0.2, bottom: height * 0.1, left: width * 0.12, right: width * 0.08 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;
  const rowH = cH / items.length;
  const barH = rowH * 0.4;
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  const maxRange = Math.max(...items.map(d => d.ranges[2]));
  const toX = (v: number) => (v / maxRange) * cW * 0.7;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {items.map((d, i) => {
        const delay = i * fps * 0.15;
        const progress = interpolate(frame, [fps * 0.4 + delay, fps * 1.5 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = pad.top + i * rowH;
        const barY = y + (rowH - barH) / 2;

        return (
          <React.Fragment key={i}>
            {/* State label */}
            <div style={{
              position: "absolute", left: width * 0.01, top: barY + barH * 0.15,
              width: pad.left - width * 0.02, textAlign: "right",
              color: colors.text, fontSize: width * 0.011, fontWeight: 600, opacity: progress,
            }}>{d.state}</div>

            {/* Background ranges */}
            <div style={{ position: "absolute", left: pad.left, top: barY, width: toX(d.ranges[0]), height: barH, background: "#EF444430", borderRadius: 4 }} />
            <div style={{ position: "absolute", left: pad.left + toX(d.ranges[0]), top: barY, width: toX(d.ranges[1] - d.ranges[0]), height: barH, background: "#F59E0B30", borderRadius: 4 }} />
            <div style={{ position: "absolute", left: pad.left + toX(d.ranges[1]), top: barY, width: toX(d.ranges[2] - d.ranges[1]), height: barH, background: "#10B98130", borderRadius: 4 }} />

            {/* Actual bar */}
            <div style={{
              position: "absolute", left: pad.left, top: barY + barH * 0.25,
              width: toX(d.actual) * progress, height: barH * 0.5,
              background: colors.text, borderRadius: 2,
            }} />

            {/* Target marker */}
            <div style={{
              position: "absolute", left: pad.left + toX(d.target), top: barY - barH * 0.1,
              width: 3, height: barH * 1.2,
              background: "#EF4444", borderRadius: 2, opacity: progress,
            }} />

            {/* Value */}
            {progress > 0.8 && (
              <div style={{
                position: "absolute", left: pad.left + toX(d.actual) * progress + 8, top: barY + barH * 0.15,
                color: colors.text, fontSize: width * 0.01, fontWeight: 700,
              }}>{d.actual.toFixed(1)}{valueSuffix}</div>
            )}
          </React.Fragment>
        );
      })}

      {/* Legend */}
      <div style={{ position: "absolute", bottom: height * 0.03, left: pad.left, display: "flex", gap: width * 0.02 }}>
        {[{ label: "Poor", color: "#EF444430" }, { label: "Fair", color: "#F59E0B30" }, { label: "Good", color: "#10B98130" }, { label: "Target", color: "#EF4444" }].map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: i === 3 ? 3 : 14, height: i === 3 ? 14 : 10, borderRadius: 2, background: l.color }} />
            <span style={{ color: `${colors.text}70`, fontSize: width * 0.009 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

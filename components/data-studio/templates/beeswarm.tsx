"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface BeeswarmProps {
  data: Array<{ name: string; value: number; category: string; size?: number }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  xLabel?: string;
}

const CAT_COLORS: Record<string, string> = { A: "#64ffda", B: "#ff6b6b", C: "#ffd93d", D: "#a78bfa" };

export const BeeswarmTemplate: React.FC<BeeswarmProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel, xLabel = "Quality Score" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.2, bottom: height * 0.15, left: width * 0.08, right: width * 0.05 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map(d => d.value));

  // Simple force simulation - arrange dots to avoid overlap
  const positions = data.map((d, i) => {
    const x = pad.left + (d.value / maxVal) * cW;
    // Distribute vertically with some jitter based on index
    const row = Math.floor(i / 6);
    const col = i % 6;
    const y = pad.top + cH * 0.5 + (row - 3) * height * 0.06 + (col % 2 === 0 ? -10 : 10);
    return { x, y, d };
  });

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.05, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* X axis */}
      <div style={{ position: "absolute", left: pad.left, bottom: pad.bottom, width: cW, height: 1, background: `${colors.text}30` }} />
      {[0, 25, 50, 75, 100].map((v, i) => (
        <div key={i} style={{ position: "absolute", left: pad.left + (v / maxVal) * cW - 10, bottom: pad.bottom - 20, color: `${colors.text}50`, fontSize: width * 0.01, width: 20, textAlign: "center" }}>{v}</div>
      ))}
      <div style={{ position: "absolute", bottom: height * 0.04, left: "50%", transform: "translateX(-50%)", color: `${colors.text}60`, fontSize: width * 0.012 }}>{xLabel}</div>

      {/* Dots */}
      {positions.map(({ x, y, d }, i) => {
        const delay = i * 3;
        const progress = interpolate(frame, [fps * 0.3 + delay, fps * 0.8 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const r = (d.size || 8) * progress;
        const dotColor = CAT_COLORS[d.category] || colors.primary;

        return (
          <div key={i} style={{
            position: "absolute",
            left: x - r,
            top: y - r,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            background: `${dotColor}90`,
            border: `1px solid ${dotColor}`,
            opacity: progress,
          }} />
        );
      })}

      {/* Legend */}
      <div style={{ position: "absolute", top: pad.top, right: width * 0.04, display: "flex", flexDirection: "column", gap: 6 }}>
        {Object.entries(CAT_COLORS).map(([cat, color]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            <span style={{ color: colors.text, fontSize: width * 0.01 }}>Category {cat}</span>
          </div>
        ))}
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

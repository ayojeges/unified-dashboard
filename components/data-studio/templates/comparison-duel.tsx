"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface ComparisonDuelProps {
  left: { label: string; values: number[]; color: string };
  right: { label: string; values: number[]; color: string };
  categories: string[];
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

export const ComparisonDuelTemplate: React.FC<ComparisonDuelProps> = ({ left, right, categories = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!left || !right || categories.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const catArea = { top: height * 0.28, bottom: height * 0.12 };
  const catH = (height - catArea.top - catArea.bottom) / categories.length;
  const centerX = width / 2;
  const maxBarW = width * 0.35;
  const allValues = [...(left.values || []), ...(right.values || [])];
  const maxVal = Math.max(...allValues, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.028, fontWeight: 700 }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.016, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div style={{ position: "absolute", top: height * 0.17, width: "100%", display: "flex", justifyContent: "center", gap: width * 0.15 }}>
        <span style={{ color: left.color, fontSize: width * 0.02, fontWeight: 700 }}>{left.label}</span>
        <span style={{ color: colors.text, fontSize: width * 0.016, opacity: 0.4 }}>VS</span>
        <span style={{ color: right.color, fontSize: width * 0.02, fontWeight: 700 }}>{right.label}</span>
      </div>
      {categories.map((cat, i) => {
        const lv = (left.values || [])[i] || 0;
        const rv = (right.values || [])[i] || 0;
        const delay = i * 8;
        const prog = interpolate(frame, [delay + 15, delay + 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const lW = (lv / maxVal) * maxBarW * prog;
        const rW = (rv / maxVal) * maxBarW * prog;
        const y = catArea.top + i * catH;
        return (
          <g key={cat}>
            <div style={{ position: "absolute", top: y, width: "100%", textAlign: "center" }}>
              <span style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6 }}>{cat}</span>
            </div>
            <div style={{ position: "absolute", top: y + 22, left: centerX - lW - 5, width: lW, height: catH * 0.45, backgroundColor: left.color, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: 8 }}>
              <span style={{ color: "#fff", fontSize: width * 0.012, fontWeight: 600 }}>{Math.round(lv * prog)}</span>
            </div>
            <div style={{ position: "absolute", top: y + 22, left: centerX + 5, width: rW, height: catH * 0.45, backgroundColor: right.color, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
              <span style={{ color: "#fff", fontSize: width * 0.012, fontWeight: 600 }}>{Math.round(rv * prog)}</span>
            </div>
          </g>
        );
      })}
      <div style={{ position: "absolute", bottom: height * 0.03, width: "100%", textAlign: "center", opacity: 0.5 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.011 }}>Source: {sourceLabel}</span>}
      </div>
    </AbsoluteFill>
  );
};

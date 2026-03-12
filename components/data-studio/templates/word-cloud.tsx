"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface WordCloudProps {
  words: Array<{ text: string; size: number; count?: number }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const CLOUD_COLORS = ["#64ffda", "#ff6b6b", "#ffd93d", "#a78bfa", "#f472b6", "#3b82f6", "#06b6d4", "#f97316", "#10B981", "#EC4899"];

export const WordCloudTemplate: React.FC<WordCloudProps> = ({ words = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!words.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const maxSize = Math.max(...words.map(w => w.size));
  const minSize = Math.min(...words.map(w => w.size));
  const sorted = [...words].sort((a, b) => b.size - a.size);

  // Deterministic placement using seed-like approach
  const cx = width * 0.5;
  const cy = height * 0.55;
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  const positions = sorted.map((w, i) => {
    const angle = (i * 2.39996) + 0.5; // golden angle
    const radius = 20 + i * (Math.min(width, height) * 0.025);
    const x = cx + Math.cos(angle) * radius * 0.8;
    const y = cy + Math.sin(angle) * radius * 0.5;
    const fontSize = width * 0.01 + ((w.size - minSize) / (maxSize - minSize || 1)) * width * 0.035;
    return { ...w, x, y, fontSize };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: width * 0.06, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {positions.map((w, i) => {
        const delay = i * fps * 0.08;
        const opacity = interpolate(frame, [fps * 0.4 + delay, fps * 1.0 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const scale = interpolate(frame, [fps * 0.4 + delay, fps * 1.0 + delay], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const color = CLOUD_COLORS[i % CLOUD_COLORS.length];
        const rotation = (i % 3 === 0) ? -15 + (i % 5) * 8 : 0;

        return (
          <div key={i} style={{
            position: "absolute",
            left: w.x,
            top: w.y,
            transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
            fontSize: w.fontSize,
            fontWeight: 700,
            color,
            opacity,
            whiteSpace: "nowrap",
            fontFamily: "system-ui",
          }}>{w.text}</div>
        );
      })}

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

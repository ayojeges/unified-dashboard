"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface PackedBubbleProps {
  data: Array<{ name: string; value: number; children?: Array<{ name: string; value: number }> }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const BUBBLE_COLORS = ["#64ffda", "#ff6b6b", "#ffd93d", "#a78bfa", "#f472b6", "#3b82f6", "#06b6d4", "#f97316"];

function packCircles(items: Array<{ name: string; value: number }>, cx: number, cy: number, maxR: number) {
  const total = items.reduce((s, i) => s + i.value, 0);
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const circles: Array<{ name: string; value: number; x: number; y: number; r: number }> = [];
  const angleStep = (2 * Math.PI) / sorted.length;

  sorted.forEach((item, i) => {
    const ratio = item.value / total;
    const r = Math.sqrt(ratio) * maxR * 0.85;
    const angle = i * angleStep - Math.PI / 2;
    const dist = maxR * 0.35 + (i % 2) * maxR * 0.15;
    circles.push({ ...item, x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, r: Math.max(r, maxR * 0.08) });
  });
  return circles;
}

export const PackedBubbleTemplate: React.FC<PackedBubbleProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const centerX = width * 0.5;
  const centerY = height * 0.55;
  const maxRadius = Math.min(width, height) * 0.32;
  const circles = packCircles(data, centerX, centerY, maxRadius);
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: width * 0.06, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {circles.map((c, i) => {
        const delay = i * fps * 0.12;
        const scale = interpolate(frame, [fps * 0.4 + delay, fps * 1.2 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const color = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
        const r = c.r * scale;
        const showLabel = r > width * 0.025;

        return (
          <React.Fragment key={i}>
            <div style={{
              position: "absolute",
              left: c.x - r, top: c.y - r,
              width: r * 2, height: r * 2,
              borderRadius: "50%",
              background: `${color}50`,
              border: `2px solid ${color}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              {showLabel && (
                <>
                  <div style={{ color: colors.text, fontSize: Math.min(width * 0.011, r * 0.35), fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>
                    {c.name.length > 12 ? c.name.substring(0, 12) + "..." : c.name}
                  </div>
                  <div style={{ color: `${colors.text}90`, fontSize: Math.min(width * 0.009, r * 0.3), marginTop: 2 }}>{c.value}</div>
                </>
              )}
            </div>
          </React.Fragment>
        );
      })}

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

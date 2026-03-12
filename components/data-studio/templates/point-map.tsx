"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface PointMapProps {
  points: Array<{ name: string; lat: number; lng: number; type: string; city: string; color?: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

export const PointMapTemplate: React.FC<PointMapProps> = ({ points = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!points.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });

  // Map US bounds to screen
  const minLng = -125, maxLng = -66, minLat = 24, maxLat = 50;
  const padM = { top: height * 0.22, bottom: height * 0.1, left: width * 0.08, right: width * 0.08 };
  const mW = width - padM.left - padM.right;
  const mH = height - padM.top - padM.bottom;

  const toX = (lng: number) => padM.left + ((lng - minLng) / (maxLng - minLng)) * mW;
  const toY = (lat: number) => padM.top + mH - ((lat - minLat) / (maxLat - minLat)) * mH;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0a0e27 0%, #1a1f3a 100%)" }} />

      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.05, left: padM.left, opacity: titleOpacity, zIndex: 10 }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* US outline approximation */}
      <div style={{ position: "absolute", left: padM.left, top: padM.top, width: mW, height: mH, border: `1px solid ${colors.text}10`, borderRadius: 8 }} />

      {/* Points */}
      {points.map((p, i) => {
        const delay = i * fps * 0.3;
        const progress = interpolate(frame, [fps * 0.5 + delay, fps * 1.2 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const pinColor = p.color || (p.type === "premium" ? "#ff6b6b" : "#64ffda");
        const px = toX(p.lng);
        const py = toY(p.lat);

        return (
          <React.Fragment key={i}>
            {/* Pulse */}
            <div style={{
              position: "absolute", left: px - 20, top: py - 20, width: 40, height: 40,
              borderRadius: "50%", background: `${pinColor}20`, border: `1px solid ${pinColor}40`,
              opacity: progress, transform: `scale(${1 + Math.sin(frame * 0.05 + i) * 0.2})`,
            }} />
            {/* Pin */}
            <div style={{
              position: "absolute", left: px - 6, top: py - 6, width: 12, height: 12,
              borderRadius: "50%", background: pinColor, border: "2px solid #fff",
              opacity: progress, boxShadow: `0 0 8px ${pinColor}`,
            }} />
            {/* Label */}
            {progress > 0.8 && (
              <div style={{
                position: "absolute", left: px + 12, top: py - 10,
                background: "rgba(10,14,39,0.9)", padding: "4px 8px", borderRadius: 4,
                border: `1px solid ${pinColor}40`, opacity: progress,
              }}>
                <div style={{ color: "#fff", fontSize: width * 0.008, fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: `${colors.text}70`, fontSize: width * 0.006 }}>{p.city}</div>
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Legend */}
      <div style={{ position: "absolute", bottom: height * 0.06, left: padM.left, display: "flex", gap: width * 0.03 }}>
        {[{ label: "Verified", color: "#64ffda" }, { label: "Premium", color: "#ff6b6b" }].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
            <span style={{ color: colors.text, fontSize: width * 0.01, opacity: 0.7 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01, zIndex: 10 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

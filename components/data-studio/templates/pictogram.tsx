"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface PictogramProps {
  data: Array<{ state: string; count: number }>;
  icon: string;
  scale: number;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

export const PictogramTemplate: React.FC<PictogramProps> = ({ data = [], icon = "\u{1F69B}", scale = 50, title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 8);
  const pad = { top: height * 0.2, left: width * 0.12 };
  const rowH = (height * 0.7) / sorted.length;
  const iconSize = Math.min(rowH * 0.6, width * 0.025);
  const maxIcons = 12;
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {sorted.map((d, ri) => {
        const numIcons = Math.min(Math.ceil(d.count / scale), maxIcons);
        const y = pad.top + ri * rowH;
        const rowDelay = ri * fps * 0.15;
        const rowOpacity = interpolate(frame, [fps * 0.3 + rowDelay, fps * 0.7 + rowDelay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <React.Fragment key={ri}>
            {/* State label */}
            <div style={{
              position: "absolute", left: width * 0.01, top: y + rowH * 0.2,
              width: pad.left - width * 0.02, textAlign: "right",
              color: colors.text, fontSize: width * 0.012, fontWeight: 600, opacity: rowOpacity,
            }}>{d.state}</div>

            {/* Icons */}
            {Array.from({ length: numIcons }).map((_, ii) => {
              const iconDelay = rowDelay + ii * fps * 0.04;
              const iconOpacity = interpolate(frame, [fps * 0.5 + iconDelay, fps * 0.8 + iconDelay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={ii} style={{
                  position: "absolute",
                  left: pad.left + ii * (iconSize + width * 0.005),
                  top: y + rowH * 0.15,
                  fontSize: iconSize,
                  opacity: iconOpacity,
                }}>{icon}</div>
              );
            })}

            {/* Count */}
            <div style={{
              position: "absolute",
              left: pad.left + numIcons * (iconSize + width * 0.005) + width * 0.01,
              top: y + rowH * 0.25,
              color: `${colors.text}80`, fontSize: width * 0.01, opacity: rowOpacity,
            }}>{d.count} schools</div>
          </React.Fragment>
        );
      })}

      {/* Scale legend */}
      <div style={{ position: "absolute", bottom: height * 0.03, left: pad.left, color: `${colors.text}60`, fontSize: width * 0.01 }}>
        1 {icon} = {scale} schools
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

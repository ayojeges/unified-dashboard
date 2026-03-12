"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface ChoroplethProps {
  data: Array<{ state: string; value: number; label?: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valueSuffix?: string;
}

// Simplified US state grid positions (row, col) for a grid-based choropleth
const US_GRID: Record<string, [number, number]> = {
  AK: [0, 0], ME: [0, 10], VT: [1, 9], NH: [1, 10], WA: [2, 1], MT: [2, 2], ND: [2, 3], MN: [2, 4], WI: [2, 5], MI: [2, 7], NY: [2, 8], MA: [2, 9], CT: [2, 10],
  OR: [3, 1], ID: [3, 2], SD: [3, 3], IA: [3, 4], IL: [3, 5], IN: [3, 6], OH: [3, 7], PA: [3, 8], NJ: [3, 9], RI: [3, 10],
  CA: [4, 1], NV: [4, 2], WY: [4, 3], NE: [4, 4], MO: [4, 5], KY: [4, 6], WV: [4, 7], VA: [4, 8], MD: [4, 9], DE: [4, 10],
  AZ: [5, 2], UT: [5, 2.5], CO: [5, 3], KS: [5, 4], AR: [5, 5], TN: [5, 6], NC: [5, 7], SC: [5, 8], DC: [5, 9],
  NM: [6, 3], OK: [6, 4], LA: [6, 5], MS: [6, 6], AL: [6, 7], GA: [6, 8], FL: [6, 9],
  HI: [7, 0], TX: [7, 4],
};

export const ChoroplethTemplate: React.FC<ChoroplethProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel, valueSuffix = " schools" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const maxVal = Math.max(...data.map(d => d.value));
  const dataMap = new Map(data.map(d => [d.state, d]));
  const pad = { top: height * 0.2, left: width * 0.1 };
  const cellW = width * 0.07;
  const cellH = height * 0.085;

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });

  const colorInterp = (val: number) => {
    const t = val / maxVal;
    const r = Math.round(10 + t * 90);
    const g = Math.round(14 + t * 241);
    const b = Math.round(39 + t * 179);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.05, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Grid cells */}
      {Object.entries(US_GRID).map(([state, [row, col]], idx) => {
        const d = dataMap.get(state);
        const val = d?.value || 0;
        const delay = idx * 1.5;
        const cellOpacity = interpolate(frame, [fps * 0.5 + delay, fps * 1 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const bgColor = val > 0 ? colorInterp(val) : `${colors.text}15`;

        return (
          <div key={state} style={{
            position: "absolute",
            left: pad.left + col * (cellW + 3),
            top: pad.top + row * (cellH + 3),
            width: cellW,
            height: cellH,
            background: bgColor,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: cellOpacity,
            border: val > maxVal * 0.7 ? `2px solid ${colors.primary}` : "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{ color: "#fff", fontSize: width * 0.01, fontWeight: 700 }}>{state}</div>
            {val > 0 && <div style={{ color: "rgba(255,255,255,0.8)", fontSize: width * 0.007 }}>{val}</div>}
          </div>
        );
      })}

      {/* Legend */}
      <div style={{ position: "absolute", bottom: height * 0.06, left: pad.left, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ color: `${colors.text}60`, fontSize: width * 0.009 }}>Low</span>
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <div key={i} style={{ width: 24, height: 14, background: colorInterp(maxVal * t), borderRadius: 2 }} />
        ))}
        <span style={{ color: `${colors.text}60`, fontSize: width * 0.009 }}>High</span>
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

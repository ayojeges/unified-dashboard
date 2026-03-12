"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface HeatmapMatrixProps {
  data: Array<{ state: string; type: string; value: number }>;
  states: string[];
  types: string[];
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valuePrefix?: string;
}

export const HeatmapMatrixTemplate: React.FC<HeatmapMatrixProps> = ({ data = [], states = [], types = [], title, subtitle, brand, colors, sourceLabel, valuePrefix = "" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!data.length || !states.length || !types.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.22, bottom: height * 0.12, left: width * 0.12, right: width * 0.05 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const cellW = cW / types.length;
  const cellH = cH / states.length;
  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = Math.min(...data.map(d => d.value));
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  const getColor = (val: number) => {
    const t = (val - minVal) / (maxVal - minVal || 1);
    // Viridis-inspired: dark purple → teal → yellow
    const r = Math.round(68 + t * 185);
    const g = Math.round(1 + t * 220);
    const b = Math.round(84 + t * (-30));
    return `rgb(${Math.min(r, 253)}, ${Math.min(g, 231)}, ${Math.min(b, 55)})`;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Column headers */}
      {types.map((t, ti) => (
        <div key={ti} style={{
          position: "absolute",
          left: pad.left + ti * cellW,
          top: pad.top - height * 0.04,
          width: cellW, textAlign: "center",
          color: colors.text, fontSize: width * 0.01, fontWeight: 600,
        }}>{t}</div>
      ))}

      {/* Row headers */}
      {states.map((s, si) => (
        <div key={si} style={{
          position: "absolute",
          left: width * 0.01,
          top: pad.top + si * cellH + cellH * 0.3,
          width: pad.left - width * 0.02, textAlign: "right",
          color: colors.text, fontSize: width * 0.01, fontWeight: 600,
        }}>{s}</div>
      ))}

      {/* Cells */}
      {data.map((d, di) => {
        const si = states.indexOf(d.state);
        const ti = types.indexOf(d.type);
        if (si < 0 || ti < 0) return null;

        const delay = (si * types.length + ti) * fps * 0.02;
        const cellOpacity = interpolate(frame, [fps * 0.4 + delay, fps * 1.0 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const cellColor = getColor(d.value);
        const textColor = d.value > (maxVal + minVal) / 2 ? colors.background : colors.text;

        return (
          <React.Fragment key={di}>
            <div style={{
              position: "absolute",
              left: pad.left + ti * cellW + 2,
              top: pad.top + si * cellH + 2,
              width: cellW - 4, height: cellH - 4,
              background: cellColor,
              borderRadius: 4,
              opacity: cellOpacity,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: textColor, fontSize: Math.min(width * 0.01, cellW * 0.25), fontWeight: 600 }}>
                {valuePrefix}{d.value}
              </span>
            </div>
          </React.Fragment>
        );
      })}

      {/* Color scale legend */}
      <div style={{ position: "absolute", bottom: height * 0.04, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: `${colors.text}60`, fontSize: width * 0.009 }}>Low</span>
        <div style={{ width: width * 0.15, height: 10, borderRadius: 5, background: `linear-gradient(to right, ${getColor(minVal)}, ${getColor(maxVal)})` }} />
        <span style={{ color: `${colors.text}60`, fontSize: width * 0.009 }}>High</span>
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

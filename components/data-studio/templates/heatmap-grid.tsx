import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface HeatmapGridProps {
  rows: Array<{ label: string; values: number[] }>;
  columns: string[];
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  lowColor?: string;
  highColor?: string;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function lerpColor(c1: string, c2: string, t: number): string {
  const a = hexToRgb(c1), b = hexToRgb(c2);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r},${g},${bl})`;
}

export const HeatmapGridTemplate: React.FC<HeatmapGridProps> = ({
  rows = [], columns = [], title, subtitle, brand, colors, sourceLabel, lowColor, highColor,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  if (!rows.length || !columns.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const lo = lowColor || "#1E293B";
  const hi = highColor || colors.primary;
  const allVals = rows.flatMap(r => r.values);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const range = maxVal - minVal || 1;
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const gridLeft = width * 0.16;
  const gridTop = height * 0.24;
  const gridRight = width * 0.92;
  const gridBottom = height * 0.88;
  const cellW = (gridRight - gridLeft) / columns.length;
  const cellH = (gridBottom - gridTop) / rows.length;
  const gap = 3;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>
      {/* Column labels */}
      {columns.map((col, ci) => (
        <div key={col} style={{ position: "absolute", top: gridTop - 22, left: gridLeft + ci * cellW, width: cellW, textAlign: "center", color: colors.text, fontSize: width * 0.01, opacity: 0.6, whiteSpace: "nowrap", overflow: "hidden" }}>{col}</div>
      ))}
      {/* Row labels */}
      {rows.map((row, ri) => (
        <div key={row.label} style={{ position: "absolute", top: gridTop + ri * cellH + cellH / 2 - 8, left: 8, width: gridLeft - 12, textAlign: "right", color: colors.text, fontSize: width * 0.011, opacity: 0.6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.label}</div>
      ))}
      {/* Cells */}
      {rows.map((row, ri) =>
        row.values.map((val, ci) => {
          const delay = (ri * columns.length + ci) * 1.5;
          const cellProg = interpolate(frame, [delay + 10, delay + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const t = (val - minVal) / range;
          const bg = lerpColor(lo, hi, t * cellProg);
          return (
            <div key={`${ri}-${ci}`} style={{
              position: "absolute",
              top: gridTop + ri * cellH + gap / 2,
              left: gridLeft + ci * cellW + gap / 2,
              width: cellW - gap,
              height: cellH - gap,
              backgroundColor: bg,
              borderRadius: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: cellProg,
            }}>
              <span style={{ color: t > 0.5 ? "#FFF" : colors.text, fontSize: width * 0.01, fontWeight: 600, opacity: 0.9 }}>{Math.round(val)}</span>
            </div>
          );
        })
      )}
      {/* Legend gradient */}
      <div style={{ position: "absolute", bottom: height * 0.04, left: width * 0.35, width: width * 0.3, height: 14, background: `linear-gradient(to right, ${lo}, ${hi})`, borderRadius: 4 }} />
      <div style={{ position: "absolute", bottom: height * 0.02, left: width * 0.35, color: colors.text, fontSize: width * 0.009, opacity: 0.5 }}>{Math.round(minVal)}</div>
      <div style={{ position: "absolute", bottom: height * 0.02, left: width * 0.35 + width * 0.3 - 30, color: colors.text, fontSize: width * 0.009, opacity: 0.5 }}>{Math.round(maxVal)}</div>
      <div style={{ position: "absolute", bottom: height * 0.01, width: "100%", textAlign: "center", opacity: 0.4 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.009 }}>Source: {sourceLabel} </span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.009 }}>{brand}</span>}
      </div>
    </AbsoluteFill>
  );
};

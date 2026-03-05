import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface MapVizProps {
  states: Array<{ name: string; value: number; code?: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valueSuffix?: string;
}

// Simplified Nigeria state positions (grid layout for clean rendering)
const NIGERIA_GRID: Record<string, [number, number]> = {
  "Sokoto": [2, 0], "Zamfara": [3, 0], "Katsina": [4, 0], "Jigawa": [5, 0], "Yobe": [6, 0], "Borno": [7, 0],
  "Kebbi": [1, 1], "Niger": [3, 1], "Kano": [5, 1], "Bauchi": [6, 1], "Gombe": [7, 1],
  "Kaduna": [4, 1], "Kwara": [2, 2], "FCT": [4, 2], "Plateau": [5, 2], "Adamawa": [7, 2],
  "Nassarawa": [5, 3], "Taraba": [7, 3], "Oyo": [1, 3], "Osun": [2, 3], "Ekiti": [3, 3],
  "Kogi": [4, 3], "Benue": [6, 3], "Ogun": [1, 4], "Ondo": [2, 4], "Edo": [3, 4],
  "Enugu": [5, 4], "Ebonyi": [6, 4], "Cross River": [7, 4], "Lagos": [0, 5], "Delta": [3, 5],
  "Anambra": [4, 5], "Imo": [5, 5], "Abia": [6, 5], "Akwa Ibom": [7, 5],
  "Bayelsa": [3, 6], "Rivers": [5, 6],
};

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function lerpColor(c1: string, c2: string, t: number): string {
  const a = hexToRgb(c1), b = hexToRgb(c2);
  return `rgb(${Math.round(a.r + (b.r - a.r) * t)},${Math.round(a.g + (b.g - a.g) * t)},${Math.round(a.b + (b.b - a.b) * t)})`;
}

export const MapVizTemplate: React.FC<MapVizProps> = ({
  states = [], title, subtitle, brand, colors, sourceLabel, valueSuffix = "",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const stateMap = new Map(states.map(s => [s.name, s.value]));
  const allValues = states.map(s => s.value);
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 1);
  const range = maxVal - minVal || 1;

  const lo = "#1E293B";
  const hi = colors.primary;

  const gridOffsetX = width * 0.15;
  const gridOffsetY = height * 0.2;
  const cellSize = Math.min(width * 0.085, height * 0.095);
  const gap = 4;

  // Top 5 states for legend
  const topStates = [...states].sort((a, b) => b.value - a.value).slice(0, 5);
  const legendProgress = interpolate(frame, [durationInFrames * 0.5, durationInFrames * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.03, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.024, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Map grid */}
      {Object.entries(NIGERIA_GRID).map(([name, [col, row]]) => {
        const val = stateMap.get(name) || 0;
        const t = range > 0 ? (val - minVal) / range : 0;
        const idx = Object.keys(NIGERIA_GRID).indexOf(name);
        const delay = idx * 1.2;
        const cellProg = interpolate(frame, [delay + 10, delay + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const bg = lerpColor(lo, hi, t * cellProg);
        const x = gridOffsetX + col * (cellSize + gap);
        const y = gridOffsetY + row * (cellSize + gap);

        return (
          <div key={name} style={{
            position: "absolute", left: x, top: y,
            width: cellSize, height: cellSize,
            backgroundColor: bg, borderRadius: 6,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            opacity: cellProg, transform: `scale(${0.7 + cellProg * 0.3})`,
            border: val === maxVal ? `2px solid ${colors.accent}` : "1px solid rgba(255,255,255,0.05)",
          }}>
            <span style={{ color: t > 0.4 ? "#FFF" : colors.text, fontSize: cellSize * 0.18, fontWeight: 600, opacity: 0.9, textAlign: "center", lineHeight: 1.1 }}>
              {name.length > 6 ? name.slice(0, 5) + "." : name}
            </span>
            {val > 0 && <span style={{ color: t > 0.4 ? "#FFF" : colors.text, fontSize: cellSize * 0.16, opacity: 0.6, marginTop: 2 }}>{val.toLocaleString()}</span>}
          </div>
        );
      })}

      {/* Top states legend */}
      <div style={{ position: "absolute", top: height * 0.22, right: width * 0.03, opacity: legendProgress }}>
        <div style={{ color: colors.accent, fontSize: width * 0.012, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>TOP STATES</div>
        {topStates.map((s, i) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ color: colors.accent, fontSize: width * 0.012, fontWeight: 700, width: 18 }}>{i + 1}.</span>
            <span style={{ color: colors.text, fontSize: width * 0.011 }}>{s.name}</span>
            <span style={{ color: colors.text, fontSize: width * 0.011, opacity: 0.5, marginLeft: "auto" }}>{s.value.toLocaleString()}{valueSuffix}</span>
          </div>
        ))}
      </div>

      {/* Color legend */}
      <div style={{ position: "absolute", bottom: height * 0.05, left: width * 0.15, width: width * 0.25, height: 12, background: `linear-gradient(to right, ${lo}, ${hi})`, borderRadius: 4 }} />
      <div style={{ position: "absolute", bottom: height * 0.03, left: width * 0.15, color: colors.text, fontSize: width * 0.009, opacity: 0.4 }}>{Math.round(minVal)}{valueSuffix}</div>
      <div style={{ position: "absolute", bottom: height * 0.03, left: width * 0.15 + width * 0.23, color: colors.text, fontSize: width * 0.009, opacity: 0.4 }}>{Math.round(maxVal)}{valueSuffix}</div>

      <div style={{ position: "absolute", bottom: height * 0.01, width: "100%", textAlign: "center", opacity: 0.4 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.009 }}>Source: {sourceLabel} </span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.009 }}>{brand}</span>}
      </div>
    </AbsoluteFill>
  );
};

"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface DualRaceLineProps {
  raceData: Array<{ name: string; value: number; color?: string }>;
  lineData: Array<{ year: number; total: number }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valueSuffix?: string;
}

const BAR_COLORS = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899"];

export const DualRaceLineTemplate: React.FC<DualRaceLineProps> = ({ raceData = [], lineData = [], title, subtitle, brand, colors, sourceLabel, valueSuffix = "" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const pad = { top: height * 0.2, bottom: height * 0.1, left: width * 0.04 };
  const splitX = width * 0.55;

  // LEFT: Mini bar race
  const barPad = { top: pad.top + 10, left: pad.left + 10, right: splitX - 20 };
  const barH = height - pad.top - pad.bottom - 20;
  const maxBar = Math.max(...(raceData.map(d => d.value) || [1]));
  const barItemH = barH / Math.max(raceData.length, 1) * 0.8;
  const barGap = barH / Math.max(raceData.length, 1);

  // RIGHT: Line chart
  const lineLeft = splitX + width * 0.03;
  const lineRight = width * 0.95;
  const lineTop = pad.top + 10;
  const lineBottom = height - pad.bottom - 10;
  const lineW = lineRight - lineLeft;
  const lineH = lineBottom - lineTop;

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });
  const lineProgress = interpolate(frame, [fps, durationInFrames * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Line chart calculations
  const minYear = Math.min(...(lineData.map(d => d.year) || [0]));
  const maxYear = Math.max(...(lineData.map(d => d.year) || [1]));
  const minTotal = Math.min(...(lineData.map(d => d.total) || [0])) * 0.8;
  const maxTotal = Math.max(...(lineData.map(d => d.total) || [1])) * 1.1;

  const linePoints = lineData.map(d => ({
    x: lineLeft + ((d.year - minYear) / (maxYear - minYear || 1)) * lineW,
    y: lineTop + lineH - ((d.total - minTotal) / (maxTotal - minTotal || 1)) * lineH,
  }));

  const visiblePoints = Math.max(1, Math.ceil(linePoints.length * lineProgress));
  const pathStr = linePoints.slice(0, visiblePoints).map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaStr = pathStr + ` L ${linePoints[visiblePoints - 1]?.x || lineLeft} ${lineBottom} L ${lineLeft} ${lineBottom} Z`;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.05, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.024, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.012, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Divider */}
      <div style={{ position: "absolute", left: splitX, top: pad.top, width: 1, height: height - pad.top - pad.bottom, background: `${colors.text}15` }} />

      {/* LEFT: Bar race */}
      {raceData.slice(0, 6).map((d, i) => {
        const delay = i * fps * 0.2;
        const barProgress = interpolate(frame, [fps * 0.5 + delay, fps * 1.5 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const barColor = d.color || BAR_COLORS[i % BAR_COLORS.length];
        const barWidth = (d.value / maxBar) * (splitX - pad.left - 120) * barProgress;
        const y = pad.top + 10 + i * barGap;

        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: pad.left, top: y, color: colors.text, fontSize: width * 0.009, opacity: 0.8, width: 100, textAlign: "right", paddingRight: 8 }}>{d.name}</div>
            <div style={{ position: "absolute", left: pad.left + 105, top: y - 2, width: barWidth, height: barItemH, background: barColor, borderRadius: 4 }} />
            <div style={{ position: "absolute", left: pad.left + 110 + barWidth, top: y, color: barColor, fontSize: width * 0.009, fontWeight: 700, opacity: barProgress }}>{d.value}{valueSuffix}</div>
          </React.Fragment>
        );
      })}

      {/* RIGHT: Line chart */}
      <div style={{ position: "absolute", left: lineLeft, top: lineTop - 20, color: colors.text, fontSize: width * 0.012, fontWeight: 600 }}>Total Market Growth</div>
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={width} height={height}>
        <path d={areaStr} fill={`${colors.primary}15`} />
        <path d={pathStr} fill="none" stroke={colors.primary} strokeWidth={3} />
      </svg>

      {/* Line dots */}
      {linePoints.slice(0, visiblePoints).map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x - 4, top: p.y - 4, width: 8, height: 8, borderRadius: "50%", background: colors.primary }} />
      ))}

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

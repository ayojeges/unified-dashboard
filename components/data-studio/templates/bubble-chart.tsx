"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface BubbleChartProps {
  data: Array<{ name: string; tuition: number; hours: number; placement: number; enrollment: number; type: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  xLabel?: string;
  yLabel?: string;
}

const TYPE_COLORS: Record<string, string> = { private: "#3B82F6", community: "#10B981", company: "#EF4444" };

export const BubbleChartTemplate: React.FC<BubbleChartProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel, xLabel = "Tuition Cost ($)", yLabel = "Job Placement Rate (%)" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.2, bottom: height * 0.14, left: width * 0.08, right: width * 0.05 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const maxX = Math.max(...data.map(d => d.tuition)) * 1.15;
  const minY = Math.min(...data.map(d => d.placement)) - 5;
  const maxY = 100;
  const maxR = Math.max(...data.map(d => d.enrollment));

  const toX = (v: number) => pad.left + (v / maxX) * cW;
  const toY = (v: number) => pad.top + cH - ((v - minY) / (maxY - minY)) * cH;
  const toR = (v: number) => 10 + (v / maxR) * width * 0.03;

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.05, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: pad.left + cW * p, top: pad.top, width: 1, height: cH, background: `${colors.text}10` }} />
          <div style={{ position: "absolute", left: pad.left, top: pad.top + cH * (1 - p), width: cW, height: 1, background: `${colors.text}10` }} />
        </React.Fragment>
      ))}

      {/* Axis labels */}
      <div style={{ position: "absolute", bottom: height * 0.04, left: "50%", transform: "translateX(-50%)", color: `${colors.text}70`, fontSize: width * 0.012 }}>{xLabel}</div>
      <div style={{ position: "absolute", left: width * 0.02, top: "50%", transform: "rotate(-90deg) translateX(-50%)", transformOrigin: "left", color: `${colors.text}70`, fontSize: width * 0.012 }}>{yLabel}</div>

      {/* Bubbles */}
      {data.map((d, i) => {
        const delay = i * fps * 0.2;
        const progress = interpolate(frame, [fps * 0.5 + delay, fps * 1.5 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const bubbleColor = TYPE_COLORS[d.type] || colors.primary;
        const r = toR(d.enrollment) * progress;
        const bx = toX(d.tuition);
        const by = toY(d.placement);

        return (
          <React.Fragment key={i}>
            <div style={{
              position: "absolute",
              left: bx - r,
              top: by - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background: `${bubbleColor}80`,
              border: `2px solid ${bubbleColor}`,
              opacity: progress,
            }} />
            {progress > 0.8 && (
              <div style={{
                position: "absolute",
                left: bx + r + 4,
                top: by - 8,
                color: colors.text,
                fontSize: width * 0.009,
                opacity: progress,
                whiteSpace: "nowrap",
              }}>{d.name}</div>
            )}
          </React.Fragment>
        );
      })}

      {/* Legend */}
      <div style={{ position: "absolute", top: pad.top, right: width * 0.04, display: "flex", flexDirection: "column", gap: 8 }}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            <span style={{ color: colors.text, fontSize: width * 0.01, textTransform: "capitalize" }}>{type}</span>
          </div>
        ))}
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface GroupedBarProps {
  data: Array<{ state: string; values: Array<{ type: string; value: number }> }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

const GROUP_COLORS = ["#64ffda", "#ff6b6b", "#ffd93d", "#a78bfa"];

export const GroupedBarTemplate: React.FC<GroupedBarProps> = ({ data = [], title, subtitle, brand, colors, sourceLabel, valuePrefix = "$", valueSuffix = "" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!data.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.2, bottom: height * 0.16, left: width * 0.08, right: width * 0.05 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  const types = [...new Set(data.flatMap(d => d.values.map(v => v.type)))];
  const maxVal = Math.max(...data.flatMap(d => d.values.map(v => v.value))) * 1.15;

  const groupWidth = cW / data.length;
  const barWidth = (groupWidth * 0.7) / types.length;
  const groupPadding = groupWidth * 0.15;

  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <div key={i} style={{ position: "absolute", left: pad.left, top: pad.top + cH * (1 - p), width: cW, height: 1, background: `${colors.text}12` }}>
          <span style={{ position: "absolute", left: -pad.left * 0.7, top: -7, fontSize: width * 0.01, color: `${colors.text}50` }}>
            {valuePrefix}{Math.round(maxVal * p)}{valueSuffix}
          </span>
        </div>
      ))}

      {/* Bars */}
      {data.map((group, gi) => {
        const groupX = pad.left + gi * groupWidth + groupPadding;

        return (
          <React.Fragment key={gi}>
            {group.values.map((v, vi) => {
              const delay = (gi * types.length + vi) * fps * 0.08;
              const progress = interpolate(frame, [fps * 0.5 + delay, fps * 1.8 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const barH = (v.value / maxVal) * cH * progress;
              const color = GROUP_COLORS[vi % GROUP_COLORS.length];
              const x = groupX + vi * barWidth;

              return (
                <div key={vi} style={{
                  position: "absolute",
                  left: x, bottom: pad.bottom,
                  width: barWidth - 2, height: barH,
                  background: color,
                  borderRadius: `${width * 0.003}px ${width * 0.003}px 0 0`,
                }} />
              );
            })}

            {/* State label */}
            <div style={{
              position: "absolute",
              left: groupX,
              bottom: pad.bottom - height * 0.06,
              width: groupWidth - groupPadding * 2,
              textAlign: "center",
              color: colors.text, fontSize: width * 0.01, opacity: 0.8,
            }}>{group.state}</div>
          </React.Fragment>
        );
      })}

      {/* Legend */}
      <div style={{ position: "absolute", bottom: height * 0.03, left: "50%", transform: "translateX(-50%)", display: "flex", gap: width * 0.03 }}>
        {types.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: GROUP_COLORS[i % GROUP_COLORS.length] }} />
            <span style={{ color: colors.text, fontSize: width * 0.01, opacity: 0.7 }}>{t}</span>
          </div>
        ))}
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

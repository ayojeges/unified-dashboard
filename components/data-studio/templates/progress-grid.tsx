"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface ProgressGridProps {
  schools: Array<{ name: string; metrics: number[]; color?: string }>;
  metricLabels: string[];
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  maxValue?: number;
  valueSuffix?: string;
}

const SCHOOL_COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

export const ProgressGridTemplate: React.FC<ProgressGridProps> = ({
  schools = [], metricLabels = [], title, subtitle, brand, colors, sourceLabel, maxValue = 100, valueSuffix = "%",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!schools.length || !metricLabels.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const gridTop = height * 0.2;
  const gridLeft = width * 0.03;
  const schoolW = (width * 0.94) / schools.length;
  const metricH = Math.min((height * 0.7) / metricLabels.length, height * 0.12);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {schools.map((school, si) => {
        const schoolColor = school.color || SCHOOL_COLORS[si % SCHOOL_COLORS.length];
        const x = gridLeft + si * schoolW;
        const schoolDelay = si * 8;
        const headerProg = interpolate(frame, [10 + schoolDelay, 25 + schoolDelay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <div key={si} style={{ position: "absolute", top: gridTop, left: x, width: schoolW - 8 }}>
            {/* School name */}
            <div style={{
              textAlign: "center", marginBottom: 16, opacity: headerProg,
              borderBottom: `3px solid ${schoolColor}`, paddingBottom: 8,
            }}>
              <span style={{ color: schoolColor, fontSize: width * 0.014, fontWeight: 700 }}>{school.name}</span>
            </div>

            {/* Metrics */}
            {metricLabels.map((metric, mi) => {
              const val = school.metrics[mi] || 0;
              const delay = schoolDelay + mi * 6;
              const prog = interpolate(frame, [20 + delay, 55 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const barProg = interpolate(frame, [30 + delay, 60 + delay], [0, val / maxValue], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

              return (
                <div key={mi} style={{ marginBottom: metricH * 0.15, opacity: prog }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: colors.text, fontSize: width * 0.009, opacity: 0.7 }}>{metric}</span>
                    <span style={{ color: schoolColor, fontSize: width * 0.01, fontWeight: 700 }}>
                      {Math.round(val * prog)}{valueSuffix}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{
                    width: "100%", height: 10, backgroundColor: `${colors.text}10`, borderRadius: 5, overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${barProg * 100}%`, height: "100%", backgroundColor: schoolColor,
                      borderRadius: 5, transition: "none",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {sourceLabel && (
        <div style={{ position: "absolute", bottom: height * 0.02, width: "100%", textAlign: "center" }}>
          <span style={{ color: colors.text, fontSize: width * 0.009, opacity: 0.35 }}>Source: {sourceLabel}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

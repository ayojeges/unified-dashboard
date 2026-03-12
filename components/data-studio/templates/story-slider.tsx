"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface StorySliderProps {
  steps: Array<{ title: string; description: string; stat?: { value: string; label: string }; color?: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const STEP_COLORS = ["#64ffda", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

export const StorySliderTemplate: React.FC<StorySliderProps> = ({ steps = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!steps.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });

  // Calculate which step is active
  const framesPerStep = (durationInFrames - fps * 2) / steps.length;
  const activeIdx = Math.min(steps.length - 1, Math.floor((frame - fps) / framesPerStep));

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.05, left: width * 0.06, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Progress bar */}
      <div style={{ position: "absolute", top: height * 0.16, left: width * 0.06, right: width * 0.06, height: 4, background: `${colors.text}15`, borderRadius: 2 }}>
        <div style={{
          width: `${((activeIdx + 1) / steps.length) * 100}%`,
          height: "100%",
          background: colors.primary,
          borderRadius: 2,
          transition: "width 0.3s",
        }} />
      </div>

      {/* Step dots */}
      <div style={{ position: "absolute", top: height * 0.15, left: width * 0.06, right: width * 0.06, display: "flex", justifyContent: "space-between" }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: "50%",
            background: i <= activeIdx ? colors.primary : `${colors.text}30`,
            border: i === activeIdx ? `3px solid ${colors.primary}` : "none",
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      {/* Active step content */}
      {steps.map((step, i) => {
        const stepStart = fps + i * framesPerStep;
        const stepEnd = stepStart + framesPerStep;
        const isActive = frame >= stepStart && frame < stepEnd;
        const stepProgress = interpolate(frame, [stepStart, stepStart + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(frame, [stepEnd - fps * 0.3, stepEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const opacity = i === steps.length - 1 ? stepProgress : Math.min(stepProgress, fadeOut);
        const stepColor = step.color || STEP_COLORS[i % STEP_COLORS.length];

        if (!isActive && !(i === steps.length - 1 && frame >= stepStart)) return null;

        return (
          <div key={i} style={{
            position: "absolute",
            top: height * 0.25,
            left: width * 0.06,
            right: width * 0.06,
            opacity,
            transform: `translateY(${(1 - stepProgress) * 20}px)`,
          }}>
            {/* Step number */}
            <div style={{ color: stepColor, fontSize: width * 0.06, fontWeight: 900, opacity: 0.2, marginBottom: -height * 0.02 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ color: colors.text, fontSize: width * 0.03, fontWeight: 800, marginBottom: height * 0.02, fontFamily: "system-ui" }}>{step.title}</div>
            <div style={{ color: `${colors.text}90`, fontSize: width * 0.015, lineHeight: 1.6, maxWidth: "60%" }}>{step.description}</div>

            {/* Stat */}
            {step.stat && (
              <div style={{
                position: "absolute",
                right: 0,
                top: height * 0.05,
                background: `${stepColor}15`,
                border: `1px solid ${stepColor}30`,
                borderRadius: width * 0.01,
                padding: `${height * 0.04}px ${width * 0.03}px`,
                textAlign: "center",
              }}>
                <div style={{ color: stepColor, fontSize: width * 0.04, fontWeight: 900 }}>{step.stat.value}</div>
                <div style={{ color: `${colors.text}70`, fontSize: width * 0.011, marginTop: 4 }}>{step.stat.label}</div>
              </div>
            )}
          </div>
        );
      })}

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

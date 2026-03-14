"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface StateMetric {
  label: string;
  leftValue: number;
  rightValue: number;
  unit?: string;
  higherIsBetter?: boolean;
}

interface StateScorecardProps {
  leftState: string;
  rightState: string;
  metrics: StateMetric[];
  title?: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

export const StateScorecardTemplate: React.FC<StateScorecardProps> = ({
  leftState = "Lagos",
  rightState = "Abuja",
  metrics = [],
  title = "EDUCATION SHOWDOWN",
  subtitle,
  brand,
  colors,
  sourceLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!metrics || metrics.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: colors.text, fontSize: 32 }}>No data provided</div>
      </AbsoluteFill>
    );
  }

  // Phases
  const titleEnd = 25;
  const barsEnd = durationInFrames * 0.7;
  const revealStart = durationInFrames * 0.8;

  // Title
  const titleOpacity = interpolate(frame, [0, titleEnd], [0, 1], { extrapolateRight: "clamp" });

  // Calculate scores (who wins more metrics)
  const leftWins = metrics.filter((m) =>
    m.higherIsBetter !== false ? m.leftValue > m.rightValue : m.leftValue < m.rightValue
  ).length;
  const rightWins = metrics.length - leftWins;
  const winner = leftWins > rightWins ? leftState : rightWins > leftWins ? rightState : "TIE";

  // Reveal
  const isReveal = frame >= revealStart;
  const revealOpacity = isReveal ? interpolate(frame, [revealStart, revealStart + 20], [0, 1], { extrapolateRight: "clamp" }) : 0;

  const metricAreaTop = height * 0.22;
  const metricAreaBottom = height * 0.18;
  const metricH = (height - metricAreaTop - metricAreaBottom) / metrics.length;
  const centerX = width * 0.5;
  const maxBarW = width * 0.32;

  // Normalize values for bar display
  const allLeft = metrics.map((m) => m.leftValue);
  const allRight = metrics.map((m) => m.rightValue);
  const allVals = [...allLeft, ...allRight];
  const maxVal = Math.max(...allVals, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Background effects */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at 25% 20%, ${colors.primary}15 0%, transparent 50%),
                     radial-gradient(ellipse at 75% 20%, ${colors.secondary}15 0%, transparent 50%)`,
      }} />

      {/* Header */}
      <div style={{
        position: "absolute",
        top: height * 0.03,
        width: "100%",
        textAlign: "center",
        opacity: titleOpacity,
        zIndex: 10,
      }}>
        <div style={{
          color: colors.accent,
          fontSize: width * 0.012,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}>
          {brand} PRESENTS
        </div>
        <div style={{
          color: colors.text,
          fontSize: width * 0.03,
          fontWeight: 800,
          marginTop: 4,
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.6, marginTop: 2 }}>{subtitle}</div>
        )}
      </div>

      {/* State names at top */}
      <div style={{
        position: "absolute",
        top: height * 0.13,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        padding: `0 ${width * 0.08}px`,
        zIndex: 10,
      }}>
        <div style={{
          color: colors.primary,
          fontSize: width * 0.022,
          fontWeight: 800,
          textAlign: "center",
          textShadow: `0 0 30px ${colors.primary}44`,
        }}>
          {leftState}
        </div>
        <div style={{
          color: colors.text,
          fontSize: width * 0.014,
          opacity: 0.3,
          alignSelf: "center",
        }}>
          VS
        </div>
        <div style={{
          color: colors.secondary,
          fontSize: width * 0.022,
          fontWeight: 800,
          textAlign: "center",
          textShadow: `0 0 30px ${colors.secondary}44`,
        }}>
          {rightState}
        </div>
      </div>

      {/* Metric bars */}
      {!isReveal && metrics.map((metric, i) => {
        const delay = i * 12;
        const prog = interpolate(frame, [titleEnd + delay, titleEnd + delay + 40], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const leftBarW = (metric.leftValue / maxVal) * maxBarW * prog;
        const rightBarW = (metric.rightValue / maxVal) * maxBarW * prog;
        const y = metricAreaTop + i * metricH;

        const leftWinsMetric = metric.higherIsBetter !== false
          ? metric.leftValue > metric.rightValue
          : metric.leftValue < metric.rightValue;

        return (
          <div key={i} style={{ position: "absolute", top: y, left: 0, right: 0, height: metricH }}>
            {/* Metric label */}
            <div style={{
              position: "absolute",
              top: 0,
              width: "100%",
              textAlign: "center",
            }}>
              <span style={{
                color: colors.text,
                fontSize: width * 0.013,
                fontWeight: 600,
                opacity: interpolate(frame, [titleEnd + delay, titleEnd + delay + 15], [0, 0.8], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                backgroundColor: `${colors.background}CC`,
                padding: "2px 12px",
                borderRadius: 4,
              }}>
                {metric.label}
              </span>
            </div>

            {/* Left bar (grows rightward from center) */}
            <div style={{
              position: "absolute",
              top: metricH * 0.25,
              right: centerX,
              width: leftBarW,
              height: metricH * 0.4,
              background: leftWinsMetric
                ? `linear-gradient(270deg, ${colors.primary}, ${colors.primary}CC)`
                : `linear-gradient(270deg, ${colors.primary}88, ${colors.primary}44)`,
              borderRadius: "4px 0 0 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingLeft: 8,
              transition: "width 0.3s ease",
            }}>
              <span style={{
                color: "#fff",
                fontSize: width * 0.013,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}>
                {Math.round(metric.leftValue * prog)}{metric.unit || ""}
              </span>
            </div>

            {/* Right bar (grows leftward from center) */}
            <div style={{
              position: "absolute",
              top: metricH * 0.25,
              left: centerX,
              width: rightBarW,
              height: metricH * 0.4,
              background: !leftWinsMetric
                ? `linear-gradient(90deg, ${colors.secondary}, ${colors.secondary}CC)`
                : `linear-gradient(90deg, ${colors.secondary}88, ${colors.secondary}44)`,
              borderRadius: "0 4px 4px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 8,
            }}>
              <span style={{
                color: "#fff",
                fontSize: width * 0.013,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}>
                {Math.round(metric.rightValue * prog)}{metric.unit || ""}
              </span>
            </div>

            {/* Center divider */}
            <div style={{
              position: "absolute",
              top: metricH * 0.15,
              left: centerX - 1,
              width: 2,
              height: metricH * 0.6,
              backgroundColor: colors.text,
              opacity: 0.1,
            }} />
          </div>
        );
      })}

      {/* Bottom score display (before reveal) */}
      {!isReveal && (
        <div style={{
          position: "absolute",
          bottom: height * 0.06,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: width * 0.1,
          opacity: interpolate(frame, [barsEnd - 20, barsEnd], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: colors.primary, fontSize: width * 0.04, fontWeight: 900 }}>{leftWins}</div>
            <div style={{ color: colors.text, fontSize: width * 0.012, opacity: 0.6 }}>{leftState}</div>
          </div>
          <div style={{ color: colors.text, fontSize: width * 0.02, opacity: 0.3, alignSelf: "center" }}>—</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: colors.secondary, fontSize: width * 0.04, fontWeight: 900 }}>{rightWins}</div>
            <div style={{ color: colors.text, fontSize: width * 0.012, opacity: 0.6 }}>{rightState}</div>
          </div>
        </div>
      )}

      {/* WHO WINS? Reveal */}
      {isReveal && (
        <AbsoluteFill style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: revealOpacity,
        }}>
          <div style={{
            width: width * 0.5,
            height: width * 0.5,
            borderRadius: "50%",
            position: "absolute",
            background: `radial-gradient(circle, ${winner === leftState ? colors.primary : colors.secondary}22 0%, transparent 70%)`,
          }} />

          <div style={{
            color: colors.accent,
            fontSize: width * 0.02,
            fontWeight: 600,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}>
            {winner === "TIE" ? "IT'S A TIE!" : "WHO WINS?"}
          </div>

          <div style={{
            color: winner === leftState ? colors.primary : colors.secondary,
            fontSize: width * 0.06,
            fontWeight: 900,
            fontFamily: "system-ui",
            textShadow: `0 0 50px ${winner === leftState ? colors.primary : colors.secondary}55`,
            marginTop: 15,
          }}>
            {winner}
          </div>

          <div style={{
            color: colors.text,
            fontSize: width * 0.016,
            opacity: 0.6,
            marginTop: 10,
          }}>
            Wins {winner === leftState ? leftWins : rightWins} of {metrics.length} metrics
          </div>
        </AbsoluteFill>
      )}

      {/* Branding */}
      <div style={{
        position: "absolute",
        bottom: height * 0.02,
        left: width * 0.04,
        display: "flex",
        alignItems: "center",
        gap: 8,
        opacity: 0.5,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: colors.primary }} />
        <span style={{ color: colors.text, fontSize: width * 0.011, fontWeight: 600 }}>{brand}</span>
      </div>

      {/* Top accent */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: "clamp" })}%`,
        height: 3,
        background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent}, ${colors.secondary})`,
      }} />
    </AbsoluteFill>
  );
};

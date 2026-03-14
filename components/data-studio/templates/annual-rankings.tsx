"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

interface RankedSchool {
  rank: number;
  name: string;
  state: string;
  score: number;
}

interface AnnualRankingsProps {
  schools: RankedSchool[];
  title?: string;
  year?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

export const AnnualRankingsTemplate: React.FC<AnnualRankingsProps> = ({
  schools = [],
  title = "TOP SCHOOLS IN NIGERIA",
  year = "2024",
  brand,
  colors,
  sourceLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!schools || schools.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: colors.text, fontSize: 32 }}>No data provided</div>
      </AbsoluteFill>
    );
  }

  // Sort schools by rank (ascending)
  const sorted = [...schools].sort((a, b) => a.rank - b.rank);
  const totalSchools = sorted.length;

  // Timeline: intro (0-30), countdown (30-90%), #1 reveal (90-100%)
  const introEnd = 30;
  const countdownStart = 30;
  const countdownFrames = durationInFrames * 0.6;
  const revealStart = durationInFrames * 0.88;

  // Intro title animation
  const titleOpacity = interpolate(frame, [0, introEnd], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, introEnd], [-30, 0], { extrapolateRight: "clamp" });
  const yearOpacity = interpolate(frame, [10, introEnd], [0, 1], { extrapolateRight: "clamp" });

  // Determine which schools are currently visible in the countdown
  const countdownProgress = interpolate(frame, [countdownStart, countdownStart + countdownFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentSchoolIndex = Math.min(Math.floor(countdownProgress * totalSchools), totalSchools - 1);

  // Top 3 special treatment
  const isTop3 = (idx: number) => totalSchools - idx <= 3;

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#FFD700"; // Gold
    if (rank === 2) return "#C0C0C0"; // Silver
    if (rank === 3) return "#CD7F32"; // Bronze
    return colors.primary;
  };

  const getRankGlow = (rank: number) => {
    if (rank === 1) return "0 0 40px rgba(255, 215, 0, 0.6)";
    if (rank === 2) return "0 0 25px rgba(192, 192, 192, 0.4)";
    if (rank === 3) return "0 0 20px rgba(205, 127, 50, 0.3)";
    return "none";
  };

  // #1 Final reveal
  const isReveal = frame >= revealStart;
  const revealOpacity = isReveal ? interpolate(frame, [revealStart, revealStart + 20], [0, 1], { extrapolateRight: "clamp" }) : 0;
  const revealScale = isReveal ? spring({ frame: frame - revealStart, fps, from: 0.5, to: 1, config: { damping: 15, stiffness: 100 } }) : 0.5;

  // Visible schools in countdown mode
  const visibleSchools = sorted.slice(0, currentSchoolIndex + 1);

  // School row animation
  const getRowStyle = (idx: number) => {
    const entryFrame = countdownStart + (idx / totalSchools) * countdownFrames;
    const relativeFrame = frame - entryFrame;

    if (relativeFrame < 0) return { opacity: 0, transform: "translateX(-100px)" };

    const opacity = interpolate(relativeFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
    const translateX = interpolate(relativeFrame, [0, 15], [-100, 0], { extrapolateRight: "clamp" });

    return {
      opacity,
      transform: `translateX(${translateX}px)`,
    };
  };

  const isLast3 = (idx: number) => idx >= totalSchools - 3;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Background gradient */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(ellipse at 50% 0%, ${colors.primary}22 0%, transparent 70%)`,
      }} />

      {/* Subtle grid pattern */}
      <svg width={width} height={height} style={{ position: "absolute", opacity: 0.03 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * (height / 20)} x2={width} y2={i * (height / 20)} stroke={colors.text} strokeWidth={1} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={i * (width / 20)} y1={0} x2={i * (width / 20)} y2={height} stroke={colors.text} strokeWidth={1} />
        ))}
      </svg>

      {/* Header */}
      <div style={{
        position: "absolute",
        top: height * 0.03,
        width: "100%",
        textAlign: "center",
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
        zIndex: 10,
      }}>
        <div style={{
          color: colors.accent,
          fontSize: width * 0.012,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}>
          {brand}
        </div>
        <div style={{
          color: colors.text,
          fontSize: width * 0.03,
          fontWeight: 800,
          marginTop: 4,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
          {title}
        </div>
        <div style={{
          color: colors.accent,
          fontSize: width * 0.04,
          fontWeight: 900,
          marginTop: 2,
          fontFamily: "system-ui",
        }}>
          {year}
        </div>
      </div>

      {/* Countdown list */}
      {!isReveal && (
        <div style={{
          position: "absolute",
          top: height * 0.18,
          left: width * 0.08,
          right: width * 0.08,
          bottom: height * 0.12,
          display: "flex",
          flexDirection: "column",
          gap: height * 0.008,
        }}>
          {visibleSchools.map((school, idx) => {
            const style = getRowStyle(idx);
            const rankColor = getRankColor(school.rank);
            const isCurrentLast3 = isLast3(idx);
            const rowScale = isCurrentLast3 ? interpolate(frame, [countdownStart + ((idx) / totalSchools) * countdownFrames + 10, countdownStart + ((idx) / totalSchools) * countdownFrames + 25], [0.95, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

            return (
              <div
                key={school.rank}
                style={{
                  ...style,
                  display: "flex",
                  alignItems: "center",
                  padding: `${height * 0.012}px ${width * 0.02}px`,
                  background: isCurrentLast3
                    ? `linear-gradient(90deg, ${rankColor}22 0%, transparent 100%)`
                    : `linear-gradient(90deg, ${colors.primary}11 0%, transparent 100%)`,
                  borderRadius: 8,
                  borderLeft: `4px solid ${rankColor}`,
                  transform: `${style.transform} scale(${rowScale})`,
                  boxShadow: getRankGlow(school.rank),
                }}
              >
                {/* Rank number */}
                <div style={{
                  color: rankColor,
                  fontSize: isCurrentLast3 ? width * 0.035 : width * 0.025,
                  fontWeight: 900,
                  fontFamily: "system-ui",
                  minWidth: width * 0.06,
                  textAlign: "center",
                }}>
                  #{school.rank}
                </div>

                {/* School name */}
                <div style={{
                  color: colors.text,
                  fontSize: isCurrentLast3 ? width * 0.02 : width * 0.016,
                  fontWeight: isCurrentLast3 ? 700 : 500,
                  flex: 1,
                  marginLeft: width * 0.02,
                }}>
                  {school.name}
                </div>

                {/* State */}
                <div style={{
                  color: colors.text,
                  fontSize: width * 0.013,
                  opacity: 0.6,
                  marginRight: width * 0.02,
                }}>
                  {school.state}
                </div>

                {/* Score */}
                <div style={{
                  color: colors.accent,
                  fontSize: isCurrentLast3 ? width * 0.02 : width * 0.015,
                  fontWeight: 700,
                  minWidth: width * 0.06,
                  textAlign: "right",
                }}>
                  {school.score}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* #1 Reveal */}
      {isReveal && (
        <AbsoluteFill style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: revealOpacity,
          transform: `scale(${revealScale})`,
        }}>
          {/* Glow background */}
          <div style={{
            position: "absolute",
            width: width * 0.6,
            height: width * 0.6,
            borderRadius: "50%",
            background: `radial-gradient(circle, #FFD70033 0%, transparent 70%)`,
          }} />

          <div style={{
            color: colors.accent,
            fontSize: width * 0.015,
            fontWeight: 600,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 10,
          }}>
            🏆 THE WINNER 🏆
          </div>

          <div style={{
            color: "#FFD700",
            fontSize: width * 0.07,
            fontWeight: 900,
            fontFamily: "system-ui",
            textShadow: "0 0 60px rgba(255, 215, 0, 0.5)",
            textAlign: "center",
            lineHeight: 1.1,
          }}>
            #1
          </div>

          <div style={{
            color: colors.text,
            fontSize: width * 0.03,
            fontWeight: 700,
            marginTop: 15,
            textAlign: "center",
          }}>
            {sorted[sorted.length - 1]?.name}
          </div>

          <div style={{
            color: colors.text,
            fontSize: width * 0.016,
            opacity: 0.7,
            marginTop: 5,
          }}>
            {sorted[sorted.length - 1]?.state} • Score: {sorted[sorted.length - 1]?.score}
          </div>

          <div style={{
            color: colors.accent,
            fontSize: width * 0.02,
            fontWeight: 800,
            marginTop: 25,
            letterSpacing: 2,
          }}>
            BEST SCHOOL IN NIGERIA {year}
          </div>
        </AbsoluteFill>
      )}

      {/* Branding watermark */}
      <div style={{
        position: "absolute",
        bottom: height * 0.03,
        left: width * 0.04,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: 0.5,
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: colors.primary,
        }} />
        <span style={{ color: colors.text, fontSize: width * 0.011, fontWeight: 600 }}>{brand}</span>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.01, opacity: 0.5 }}>• Source: {sourceLabel}</span>}
      </div>

      {/* Animated accent line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: "clamp" })}%`,
        height: 3,
        background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
      }} />
    </AbsoluteFill>
  );
};

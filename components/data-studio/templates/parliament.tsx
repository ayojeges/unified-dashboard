"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface ParliamentProps {
  data: { verified: number; unverified: number };
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  verifiedColor?: string;
  unverifiedColor?: string;
}

export const ParliamentTemplate: React.FC<ParliamentProps> = ({ data, title, subtitle, brand, colors, sourceLabel, verifiedColor = "#64ffda", unverifiedColor = "#ff6b6b" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!data) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const total = data.verified + data.unverified;
  const pct = Math.round((data.verified / total) * 100);
  const cx = width / 2;
  const cy = height * 0.55;
  const innerR = width * 0.08;
  const outerR = width * 0.22;
  const rows = 8;

  // Generate seat positions
  const seats: Array<{ x: number; y: number; type: string }> = [];
  let seatIdx = 0;
  for (let r = 0; r < rows; r++) {
    const rowR = innerR + (outerR - innerR) * (r / (rows - 1));
    const arcLen = Math.PI * 1.4;
    const seatsInRow = Math.max(8, Math.floor(25 * ((r + 1) / rows)));
    for (let s = 0; s < seatsInRow; s++) {
      const angle = -Math.PI / 2 - arcLen / 2 + (arcLen * s / (seatsInRow - 1 || 1));
      seats.push({
        x: cx + Math.cos(angle) * rowR,
        y: cy + Math.sin(angle) * rowR,
        type: seatIdx < Math.round(seats.length * data.verified / total + data.verified * (r + 1) / (rows * total)) ? "verified" : "unverified",
      });
      seatIdx++;
    }
  }

  // Recalculate types based on actual proportion
  const verifiedCount = Math.round(seats.length * data.verified / total);
  seats.forEach((s, i) => { s.type = i < verifiedCount ? "verified" : "unverified"; });

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });
  const seatR = Math.min(width * 0.008, 7);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.05, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Seats */}
      {seats.map((seat, i) => {
        const delay = i * 0.4;
        const seatProgress = interpolate(frame, [fps * 0.5 + delay, fps * 0.8 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fillColor = seat.type === "verified" ? verifiedColor : unverifiedColor;
        return (
          <div key={i} style={{
            position: "absolute",
            left: seat.x - seatR,
            top: seat.y - seatR,
            width: seatR * 2,
            height: seatR * 2,
            borderRadius: "50%",
            background: fillColor,
            opacity: seatProgress * 0.85,
            transform: `scale(${seatProgress})`,
          }} />
        );
      })}

      {/* Center stat */}
      <div style={{
        position: "absolute",
        left: cx - width * 0.1,
        top: cy - height * 0.06,
        width: width * 0.2,
        textAlign: "center",
        opacity: interpolate(frame, [fps * 2, fps * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ color: colors.text, fontSize: width * 0.05, fontWeight: 900 }}>{pct}%</div>
        <div style={{ color: `${colors.text}80`, fontSize: width * 0.013 }}>Verified</div>
      </div>

      {/* Legend */}
      <div style={{ position: "absolute", bottom: height * 0.08, width: "100%", display: "flex", justifyContent: "center", gap: width * 0.04 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: verifiedColor }} />
          <span style={{ color: colors.text, fontSize: width * 0.012 }}>Verified ({data.verified})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: unverifiedColor }} />
          <span style={{ color: colors.text, fontSize: width * 0.012 }}>Unverified ({data.unverified})</span>
        </div>
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

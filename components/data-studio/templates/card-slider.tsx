"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface CardSliderProps {
  cards: Array<{ name: string; location: string; type: string; rating: number; tuition: string; duration: string; placement: string; color?: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const CARD_COLORS = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6"];

export const CardSliderTemplate: React.FC<CardSliderProps> = ({ cards = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!cards.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });
  const cardW = width * 0.22;
  const cardH = height * 0.55;
  const gap = width * 0.025;
  const totalW = cards.length * (cardW + gap);
  const scrollX = interpolate(frame, [fps, durationInFrames - fps], [width * 0.05, -(totalW - width * 0.9)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.05, left: width * 0.05, opacity: titleOpacity, zIndex: 10 }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Cards */}
      <div style={{ position: "absolute", top: height * 0.2, left: scrollX, display: "flex", gap }}>
        {cards.map((card, i) => {
          const cardColor = card.color || CARD_COLORS[i % CARD_COLORS.length];
          const delay = i * fps * 0.15;
          const cardOpacity = interpolate(frame, [fps * 0.3 + delay, fps * 0.8 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const cardY = interpolate(frame, [fps * 0.3 + delay, fps * 0.8 + delay], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              width: cardW,
              height: cardH,
              background: "linear-gradient(135deg, #1a1f3a 0%, #0a0e27 100%)",
              borderRadius: width * 0.01,
              padding: width * 0.015,
              border: `1px solid ${cardColor}30`,
              opacity: cardOpacity,
              transform: `translateY(${cardY}px)`,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
              {/* Badge */}
              <div style={{ alignSelf: "flex-start", background: cardColor, color: "#0a0e27", padding: "3px 10px", borderRadius: 20, fontSize: width * 0.008, fontWeight: 700 }}>{card.type}</div>
              {/* Title */}
              <div style={{ color: "#fff", fontSize: width * 0.013, fontWeight: 700, lineHeight: 1.3 }}>{card.name}</div>
              <div style={{ color: `${colors.text}80`, fontSize: width * 0.009 }}>{card.location}</div>
              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#ffd93d", fontSize: width * 0.012 }}>&#9733;</span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: width * 0.011 }}>{card.rating}</span>
              </div>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: "auto" }}>
                {[{ l: "Tuition", v: card.tuition }, { l: "Duration", v: card.duration }, { l: "Placement", v: card.placement }, { l: "Rating", v: `${card.rating}/5` }].map((s, si) => (
                  <div key={si} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: 8, textAlign: "center" }}>
                    <div style={{ color: cardColor, fontSize: width * 0.012, fontWeight: 700 }}>{s.v}</div>
                    <div style={{ color: `${colors.text}60`, fontSize: width * 0.007, marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01, zIndex: 10 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

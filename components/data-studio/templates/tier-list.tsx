"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface TierListProps {
  tiers: Array<{ tier: string; color: string; items: Array<{ name: string; score?: number }> }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const TIER_COLORS: Record<string, string> = {
  S: "#FF7F7F", A: "#FFBF7F", B: "#FFDF7F", C: "#FFFF7F", D: "#BFFF7F", F: "#94A3B8",
};

export const TierListTemplate: React.FC<TierListProps> = ({
  tiers = [], title, subtitle, brand, colors, sourceLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!tiers.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const rowTop = height * 0.18;
  const rowH = Math.min((height * 0.75) / tiers.length, height * 0.14);
  const labelW = width * 0.1;
  const contentLeft = labelW + width * 0.03;
  const contentW = width - contentLeft - width * 0.04;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {tiers.map((tier, ti) => {
        const delay = ti * 12;
        const slideIn = interpolate(frame, [15 + delay, 35 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const tierColor = tier.color || TIER_COLORS[tier.tier] || colors.primary;
        const y = rowTop + ti * rowH;

        return (
          <div key={ti} style={{ position: "absolute", top: y, left: width * 0.03, width: width * 0.94, height: rowH - 6, display: "flex", opacity: slideIn, transform: `translateX(${(1 - slideIn) * 60}px)` }}>
            {/* Tier label */}
            <div style={{
              width: labelW, height: "100%", backgroundColor: tierColor, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ color: "#1a1a2e", fontSize: width * 0.032, fontWeight: 900, fontFamily: "system-ui" }}>{tier.tier}</span>
            </div>

            {/* Items */}
            <div style={{
              flex: 1, marginLeft: 8, backgroundColor: `${colors.text}08`, borderRadius: 8,
              display: "flex", alignItems: "center", padding: "0 12px", gap: 10, flexWrap: "wrap", overflow: "hidden",
            }}>
              {tier.items.map((item, ii) => {
                const itemDelay = delay + ii * 4;
                const itemProg = interpolate(frame, [25 + itemDelay, 40 + itemDelay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={ii} style={{
                    padding: "6px 14px", backgroundColor: `${tierColor}25`, border: `1.5px solid ${tierColor}60`,
                    borderRadius: 6, opacity: itemProg, transform: `scale(${0.7 + itemProg * 0.3})`,
                  }}>
                    <span style={{ color: colors.text, fontSize: width * 0.011, fontWeight: 600 }}>{item.name}</span>
                    {item.score !== undefined && (
                      <span style={{ color: tierColor, fontSize: width * 0.009, marginLeft: 6, fontWeight: 700 }}>{item.score}</span>
                    )}
                  </div>
                );
              })}
            </div>
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

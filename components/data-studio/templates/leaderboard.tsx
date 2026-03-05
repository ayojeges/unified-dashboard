import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface LeaderboardProps {
  entries: Array<{ name: string; score: number; previousRank?: number; avatar?: string; badge?: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  scoreLabel?: string;
}

const RANK_COLORS = ["#F59E0B", "#94A3B8", "#CD7F32", "#6B7280", "#6B7280", "#6B7280", "#6B7280", "#6B7280", "#6B7280", "#6B7280"];

export const LeaderboardTemplate: React.FC<LeaderboardProps> = ({
  entries = [], title, subtitle, brand, colors, sourceLabel, scoreLabel = "Score",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!entries.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const sorted = [...entries].sort((a, b) => b.score - a.score).slice(0, 10);
  const maxScore = Math.max(...sorted.map(e => e.score), 1);
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const listTop = height * 0.2;
  const listBottom = height * 0.9;
  const rowH = (listBottom - listTop) / Math.min(sorted.length, 10);
  const barLeft = width * 0.38;
  const barMaxW = width * 0.48;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Header */}
      <div style={{ position: "absolute", top: listTop - 24, left: width * 0.04, display: "flex", width: "92%", opacity: 0.4 }}>
        <span style={{ width: width * 0.06, color: colors.text, fontSize: width * 0.01, textAlign: "center" }}>#</span>
        <span style={{ width: width * 0.26, color: colors.text, fontSize: width * 0.01 }}>Name</span>
        <span style={{ flex: 1, color: colors.text, fontSize: width * 0.01, textAlign: "right", paddingRight: width * 0.04 }}>{scoreLabel}</span>
      </div>

      {sorted.map((entry, i) => {
        const delay = i * 8;
        const slideIn = interpolate(frame, [delay + 10, delay + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const barGrow = interpolate(frame, [delay + 20, delay + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const barW = (entry.score / maxScore) * barMaxW * barGrow;
        const y = listTop + i * rowH;
        const rankColor = RANK_COLORS[i];
        const isTop3 = i < 3;

        // Rank change indicator
        const prevRank = entry.previousRank;
        const change = prevRank ? prevRank - (i + 1) : 0;

        return (
          <div key={entry.name} style={{
            position: "absolute", top: y, left: width * 0.02, width: "96%", height: rowH - 4,
            display: "flex", alignItems: "center",
            opacity: slideIn, transform: `translateX(${(1 - slideIn) * 60}px)`,
            backgroundColor: isTop3 ? `${rankColor}10` : "transparent",
            borderRadius: 8, paddingLeft: width * 0.02,
          }}>
            {/* Rank */}
            <div style={{
              width: width * 0.04, height: width * 0.04, borderRadius: isTop3 ? "50%" : 6,
              backgroundColor: isTop3 ? rankColor : "transparent",
              border: isTop3 ? "none" : `2px solid ${colors.text}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginRight: width * 0.02,
            }}>
              <span style={{ color: isTop3 ? colors.background : colors.text, fontSize: width * 0.014, fontWeight: 700 }}>{i + 1}</span>
            </div>

            {/* Name + change */}
            <div style={{ width: width * 0.22, overflow: "hidden" }}>
              <div style={{ color: colors.text, fontSize: width * 0.015, fontWeight: isTop3 ? 700 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {entry.name}
                {entry.badge && <span style={{ marginLeft: 6 }}>{entry.badge}</span>}
              </div>
              {change !== 0 && (
                <span style={{ color: change > 0 ? "#10B981" : "#EF4444", fontSize: width * 0.009 }}>
                  {change > 0 ? `+${change}` : change}
                </span>
              )}
            </div>

            {/* Bar */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: barW, height: rowH * 0.35, backgroundColor: isTop3 ? rankColor : colors.primary, borderRadius: 4, opacity: 0.8 }} />
              <span style={{ color: colors.text, fontSize: width * 0.013, fontWeight: 600 }}>
                {Math.round(entry.score * barGrow).toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", bottom: height * 0.02, width: "100%", textAlign: "center", opacity: 0.4 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.011 }}>Source: {sourceLabel} </span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.011 }}>{brand}</span>}
      </div>
    </AbsoluteFill>
  );
};

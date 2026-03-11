"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface TournamentBracketProps {
  rounds: Array<{
    name: string;
    matches: Array<{ a: { name: string; score: number }; b: { name: string; score: number } }>;
  }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  champion?: string;
}

export const TournamentBracketTemplate: React.FC<TournamentBracketProps> = ({
  rounds = [], title, subtitle, brand, colors, sourceLabel, champion,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!rounds.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const numRounds = rounds.length;
  const colW = (width * 0.88) / (numRounds + (champion ? 0.5 : 0));
  const startX = width * 0.06;
  const bracketTop = height * 0.2;
  const bracketBottom = height * 0.88;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {rounds.map((round, ri) => {
        const roundDelay = ri * 30;
        const roundProg = interpolate(frame, [20 + roundDelay, 50 + roundDelay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const matchCount = round.matches.length;
        const availH = bracketBottom - bracketTop;
        const matchH = availH / matchCount;
        const x = startX + ri * colW;

        return (
          <div key={ri} style={{ position: "absolute" }}>
            {/* Round label */}
            <div style={{
              position: "absolute", top: bracketTop - 28, left: x, width: colW - 10,
              textAlign: "center", opacity: roundProg * 0.5,
            }}>
              <span style={{ color: colors.text, fontSize: width * 0.01, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>{round.name}</span>
            </div>

            {round.matches.map((match, mi) => {
              const matchDelay = roundDelay + mi * 8;
              const matchProg = interpolate(frame, [25 + matchDelay, 50 + matchDelay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const y = bracketTop + mi * matchH + matchH * 0.15;
              const mh = matchH * 0.7;
              const aWins = match.a.score > match.b.score;
              const bWins = match.b.score > match.a.score;

              return (
                <div key={mi} style={{
                  position: "absolute", top: y, left: x, width: colW - 16,
                  opacity: matchProg, transform: `translateY(${(1 - matchProg) * 20}px)`,
                }}>
                  {/* Match card */}
                  <div style={{
                    backgroundColor: `${colors.text}0A`, borderRadius: 8,
                    border: `1px solid ${colors.text}15`, overflow: "hidden",
                  }}>
                    {/* Team A */}
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 12px", borderBottom: `1px solid ${colors.text}10`,
                      backgroundColor: aWins ? `${colors.primary}15` : "transparent",
                    }}>
                      <span style={{
                        color: aWins ? colors.primary : colors.text,
                        fontSize: width * 0.011, fontWeight: aWins ? 700 : 500,
                      }}>{match.a.name}</span>
                      <span style={{
                        color: aWins ? colors.primary : `${colors.text}80`,
                        fontSize: width * 0.012, fontWeight: 700, minWidth: 30, textAlign: "right",
                      }}>{Math.round(match.a.score * matchProg)}</span>
                    </div>
                    {/* Team B */}
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor: bWins ? `${colors.primary}15` : "transparent",
                    }}>
                      <span style={{
                        color: bWins ? colors.primary : colors.text,
                        fontSize: width * 0.011, fontWeight: bWins ? 700 : 500,
                      }}>{match.b.name}</span>
                      <span style={{
                        color: bWins ? colors.primary : `${colors.text}80`,
                        fontSize: width * 0.012, fontWeight: 700, minWidth: 30, textAlign: "right",
                      }}>{Math.round(match.b.score * matchProg)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Champion */}
      {champion && (() => {
        const champDelay = rounds.length * 30 + 10;
        const champProg = interpolate(frame, [champDelay, champDelay + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const champScale = interpolate(frame, [champDelay, champDelay + 20, champDelay + 30], [0.5, 1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div style={{
            position: "absolute", top: height * 0.4, right: width * 0.04, width: colW * 0.6,
            textAlign: "center", opacity: champProg, transform: `scale(${champScale})`,
          }}>
            <div style={{ color: colors.accent, fontSize: width * 0.04, marginBottom: 8 }}>&#9733;</div>
            <div style={{ color: colors.accent, fontSize: width * 0.018, fontWeight: 800, fontFamily: "system-ui" }}>{champion}</div>
            <div style={{ color: colors.text, fontSize: width * 0.01, opacity: 0.5, marginTop: 4 }}>CHAMPION</div>
          </div>
        );
      })()}

      {sourceLabel && (
        <div style={{ position: "absolute", bottom: height * 0.02, width: "100%", textAlign: "center" }}>
          <span style={{ color: colors.text, fontSize: width * 0.009, opacity: 0.35 }}>Source: {sourceLabel}</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

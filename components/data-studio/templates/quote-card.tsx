import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface QuoteCardProps {
  quote: string;
  author: string;
  role?: string;
  stat?: { value: string; label: string };
  title?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

export const QuoteCardTemplate: React.FC<QuoteCardProps> = ({
  quote = "", author = "", role, stat, title, brand, colors, sourceLabel,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const quoteMarkOpacity = interpolate(frame, [5, 25], [0, 0.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textProgress = interpolate(frame, [15, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const authorReveal = interpolate(frame, [85, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const statReveal = interpolate(frame, [120, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Typing effect for quote
  const visibleChars = Math.floor(quote.length * textProgress);
  const displayQuote = quote.slice(0, visibleChars);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Decorative elements */}
      <div style={{
        position: "absolute", top: -height * 0.1, right: -width * 0.1,
        width: width * 0.5, height: width * 0.5, borderRadius: "50%",
        background: `radial-gradient(circle, ${colors.primary}08 0%, transparent 70%)`,
      }} />
      <div style={{
        position: "absolute", bottom: -height * 0.1, left: -width * 0.1,
        width: width * 0.4, height: width * 0.4, borderRadius: "50%",
        background: `radial-gradient(circle, ${colors.accent}06 0%, transparent 70%)`,
      }} />

      {/* Giant quote mark */}
      <div style={{
        position: "absolute", top: height * 0.1, left: width * 0.08,
        fontSize: width * 0.2, fontFamily: "Georgia, serif", color: colors.primary, opacity: quoteMarkOpacity,
        lineHeight: 1,
      }}>
        {"\u201C"}
      </div>

      {title && (
        <div style={{
          position: "absolute", top: height * 0.06, width: "100%", textAlign: "center",
          color: colors.accent, fontSize: width * 0.013, fontWeight: 600,
          letterSpacing: 3, textTransform: "uppercase",
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          {title}
        </div>
      )}

      {/* Quote text */}
      <div style={{
        position: "absolute", top: height * 0.22, left: width * 0.1, right: width * 0.1,
        color: colors.text, fontSize: width * 0.028, fontWeight: 300,
        lineHeight: 1.6, fontFamily: "Georgia, serif", fontStyle: "italic",
        minHeight: height * 0.3,
      }}>
        {"\u201C"}{displayQuote}{textProgress >= 0.98 ? "\u201D" : ""}
        <span style={{ opacity: frame % 30 < 15 && textProgress < 0.98 ? 1 : 0, color: colors.accent }}>|</span>
      </div>

      {/* Author */}
      <div style={{
        position: "absolute", top: height * 0.6, left: width * 0.1,
        opacity: authorReveal, transform: `translateY(${(1 - authorReveal) * 20}px)`,
      }}>
        <div style={{ width: 48, height: 3, backgroundColor: colors.accent, marginBottom: 16 }} />
        <div style={{ color: colors.text, fontSize: width * 0.02, fontWeight: 700 }}>{author}</div>
        {role && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.5, marginTop: 4 }}>{role}</div>}
      </div>

      {/* Stat callout */}
      {stat && (
        <div style={{
          position: "absolute", top: height * 0.6, right: width * 0.1,
          textAlign: "right", opacity: statReveal,
          transform: `scale(${0.8 + statReveal * 0.2})`,
        }}>
          <div style={{ color: colors.accent, fontSize: width * 0.05, fontWeight: 800, fontFamily: "system-ui" }}>{stat.value}</div>
          <div style={{ color: colors.text, fontSize: width * 0.012, opacity: 0.5, marginTop: 4 }}>{stat.label}</div>
        </div>
      )}

      <div style={{ position: "absolute", bottom: height * 0.04, width: "100%", textAlign: "center", opacity: 0.4 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.011 }}>Source: {sourceLabel} </span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.011 }}>{brand}</span>}
      </div>
    </AbsoluteFill>
  );
};

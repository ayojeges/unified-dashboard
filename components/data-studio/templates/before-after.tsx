import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface BeforeAfterProps {
  before: { label: string; value: string; description?: string; color?: string };
  after: { label: string; value: string; description?: string; color?: string };
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  metric?: string;
}

export const BeforeAfterTemplate: React.FC<BeforeAfterProps> = ({
  before, after, title, subtitle, brand, colors, sourceLabel, metric,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const beforeProg = interpolate(frame, [20, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wipeProgress = interpolate(frame, [90, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const afterProg = interpolate(frame, [160, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const dividerX = width * 0.5;
  const contentY = height * 0.35;
  const beforeColor = before?.color || "#EF4444";
  const afterColor = after?.color || colors.primary;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.028, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.015, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
        {metric && <div style={{ color: colors.accent, fontSize: width * 0.014, marginTop: 8, fontWeight: 600 }}>{metric}</div>}
      </div>

      {/* Before side */}
      <div style={{
        position: "absolute", top: contentY, left: 0, width: dividerX - 20,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: beforeProg, transform: `translateX(${(1 - beforeProg) * -40}px)`,
      }}>
        <div style={{ color: beforeColor, fontSize: width * 0.016, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, marginBottom: 16 }}>
          {before?.label || "Before"}
        </div>
        <div style={{ color: beforeColor, fontSize: width * 0.065, fontWeight: 800, fontFamily: "system-ui", lineHeight: 1 }}>
          {before?.value || "0"}
        </div>
        {before?.description && (
          <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.5, marginTop: 12, textAlign: "center", maxWidth: "80%", lineHeight: 1.4 }}>
            {before.description}
          </div>
        )}
      </div>

      {/* Animated divider */}
      <div style={{
        position: "absolute", top: contentY - 20, left: dividerX - 2, width: 4,
        height: height * 0.5,
        background: `linear-gradient(to bottom, transparent, ${colors.accent}, transparent)`,
        opacity: interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `scaleY(${interpolate(frame, [70, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
      }} />

      {/* VS badge */}
      <div style={{
        position: "absolute", top: contentY + height * 0.18, left: dividerX - 24, width: 48, height: 48,
        borderRadius: "50%", backgroundColor: colors.accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `scale(${interpolate(frame, [80, 100], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
      }}>
        <span style={{ color: colors.background, fontSize: width * 0.013, fontWeight: 800 }}>VS</span>
      </div>

      {/* After side */}
      <div style={{
        position: "absolute", top: contentY, left: dividerX + 20, width: width - dividerX - 20,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: wipeProgress, transform: `translateX(${(1 - wipeProgress) * 40}px)`,
      }}>
        <div style={{ color: afterColor, fontSize: width * 0.016, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, marginBottom: 16 }}>
          {after?.label || "After"}
        </div>
        <div style={{ color: afterColor, fontSize: width * 0.065, fontWeight: 800, fontFamily: "system-ui", lineHeight: 1 }}>
          {after?.value || "0"}
        </div>
        {after?.description && (
          <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.5, marginTop: 12, textAlign: "center", maxWidth: "80%", lineHeight: 1.4 }}>
            {after.description}
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: height * 0.04, width: "100%", textAlign: "center", opacity: 0.4 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.011 }}>Source: {sourceLabel} </span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.011 }}>{brand}</span>}
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface TimelineProps {
  events: Array<{ date: string; title: string; description?: string; icon?: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const EVENT_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];

export const TimelineTemplate: React.FC<TimelineProps> = ({
  events = [], title, subtitle, brand, colors, sourceLabel,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  if (!events.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No events</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const lineX = width * 0.15;
  const topY = height * 0.2;
  const bottomY = height * 0.88;
  const totalHeight = bottomY - topY;
  const eventSpacing = totalHeight / Math.max(events.length - 1, 1);
  const lineGrowth = interpolate(frame, [10, durationInFrames * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Vertical line */}
      <div style={{
        position: "absolute", top: topY, left: lineX, width: 3,
        height: totalHeight * lineGrowth,
        background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent})`,
        borderRadius: 2,
      }} />

      {/* Events */}
      {events.map((event, i) => {
        const y = topY + i * eventSpacing;
        const delay = i * 18;
        const prog = interpolate(frame, [delay + 15, delay + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const eventColor = EVENT_COLORS[i % EVENT_COLORS.length];
        const isLeft = false; // all on right for cleaner look

        return (
          <div key={i} style={{ position: "absolute", top: y - 10, left: 0, width: "100%", opacity: prog, transform: `translateY(${(1 - prog) * 20}px)` }}>
            {/* Dot */}
            <div style={{
              position: "absolute", left: lineX - 8, top: 6, width: 20, height: 20,
              borderRadius: "50%", backgroundColor: eventColor, border: `3px solid ${colors.background}`,
              boxShadow: `0 0 0 2px ${eventColor}40`,
            }} />
            {/* Date */}
            <div style={{
              position: "absolute", left: lineX + 30, top: -2,
              color: colors.accent, fontSize: width * 0.012, fontWeight: 700, letterSpacing: 1,
            }}>
              {event.date}
            </div>
            {/* Title & description */}
            <div style={{ position: "absolute", left: lineX + 30, top: 18 }}>
              <div style={{ color: colors.text, fontSize: width * 0.017, fontWeight: 600, marginBottom: 4 }}>{event.title}</div>
              {event.description && (
                <div style={{ color: colors.text, fontSize: width * 0.011, opacity: 0.5, maxWidth: width * 0.6, lineHeight: 1.4 }}>{event.description}</div>
              )}
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", bottom: height * 0.03, width: "100%", textAlign: "center", opacity: 0.4 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.011 }}>Source: {sourceLabel} </span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.011 }}>{brand}</span>}
      </div>
    </AbsoluteFill>
  );
};

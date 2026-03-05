import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface DonutChartProps {
  segments: Array<{ label: string; value: number; color?: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  centerLabel?: string;
  centerValue?: string;
}

const DONUT_COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

export const DonutChartTemplate: React.FC<DonutChartProps> = ({
  segments = [], title, subtitle, brand, colors, sourceLabel, centerLabel, centerValue,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  if (!segments.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const cx = width * 0.42;
  const cy = height * 0.52;
  const outerR = Math.min(width, height) * 0.28;
  const innerR = outerR * 0.55;
  const sweepProgress = interpolate(frame, [15, durationInFrames * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let cumAngle = -Math.PI / 2;
  const arcs = segments.map((seg, i) => {
    const angle = (seg.value / total) * 2 * Math.PI * sweepProgress;
    const start = cumAngle;
    cumAngle += angle;
    const end = cumAngle;
    const mid = (start + end) / 2;
    const color = seg.color || DONUT_COLORS[i % DONUT_COLORS.length];
    return { ...seg, start, end, mid, color, pct: ((seg.value / total) * 100).toFixed(1) };
  });

  const arcPath = (startAngle: number, endAngle: number, r1: number, r2: number) => {
    if (endAngle - startAngle < 0.001) return "";
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    const sx1 = cx + r2 * Math.cos(startAngle), sy1 = cy + r2 * Math.sin(startAngle);
    const ex1 = cx + r2 * Math.cos(endAngle), ey1 = cy + r2 * Math.sin(endAngle);
    const sx2 = cx + r1 * Math.cos(endAngle), sy2 = cy + r1 * Math.sin(endAngle);
    const ex2 = cx + r1 * Math.cos(startAngle), ey2 = cy + r1 * Math.sin(startAngle);
    return `M ${sx1} ${sy1} A ${r2} ${r2} 0 ${large} 1 ${ex1} ${ey1} L ${sx2} ${sy2} A ${r1} ${r1} 0 ${large} 0 ${ex2} ${ey2} Z`;
  };

  const legendX = width * 0.72;
  const legendY = height * 0.25;
  const legendOpacity = interpolate(frame, [durationInFrames * 0.4, durationInFrames * 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <svg width={width} height={height}>
        {arcs.map((arc, i) => (
          <path key={i} d={arcPath(arc.start, arc.end, innerR, outerR)} fill={arc.color} />
        ))}
        {centerLabel && (
          <>
            <text x={cx} y={cy - 8} textAnchor="middle" fill={colors.text} fontSize={width * 0.014} fillOpacity={0.6}>{centerLabel}</text>
            <text x={cx} y={cy + 22} textAnchor="middle" fill={colors.accent} fontSize={width * 0.032} fontWeight={800}>{centerValue || total.toLocaleString()}</text>
          </>
        )}
      </svg>
      <div style={{ position: "absolute", top: legendY, left: legendX, opacity: legendOpacity }}>
        {segments.map((seg, i) => (
          <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: seg.color || DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }} />
            <div>
              <div style={{ color: colors.text, fontSize: width * 0.012, fontWeight: 500 }}>{seg.label}</div>
              <div style={{ color: colors.text, fontSize: width * 0.01, opacity: 0.5 }}>{seg.value.toLocaleString()} ({arcs[i]?.pct}%)</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: height * 0.03, width: "100%", textAlign: "center", opacity: 0.4 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.011 }}>Source: {sourceLabel} </span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.011 }}>{brand}</span>}
      </div>
    </AbsoluteFill>
  );
};

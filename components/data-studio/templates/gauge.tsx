import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface GaugeProps {
  value: number;
  maxValue: number;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  unit?: string;
  thresholds?: Array<{ value: number; color: string; label: string }>;
}

export const GaugeTemplate: React.FC<GaugeProps> = ({
  value = 0, maxValue = 100, title, subtitle, brand, colors, sourceLabel, unit = "", thresholds,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const needleProgress = spring({ frame, fps, from: 0, to: value / maxValue, config: { damping: 40, stiffness: 20, mass: 1.5 } });
  const displayVal = Math.round(needleProgress * value);

  const cx = width / 2;
  const cy = height * 0.58;
  const radius = Math.min(width, height) * 0.32;
  const startAngle = Math.PI * 0.8;
  const endAngle = Math.PI * 0.2;
  const totalArc = 2 * Math.PI - (startAngle - endAngle);
  const strokeW = radius * 0.15;

  const zones = thresholds || [
    { value: maxValue * 0.33, color: "#EF4444", label: "Low" },
    { value: maxValue * 0.66, color: "#F59E0B", label: "Medium" },
    { value: maxValue, color: "#10B981", label: "High" },
  ];

  const arcPath = (fromAngle: number, toAngle: number, r: number) => {
    const x1 = cx + r * Math.cos(fromAngle), y1 = cy + r * Math.sin(fromAngle);
    const x2 = cx + r * Math.cos(toAngle), y2 = cy + r * Math.sin(toAngle);
    const large = toAngle - fromAngle > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const needleAngle = startAngle + totalArc * needleProgress;
  const nx = cx + (radius - strokeW) * Math.cos(needleAngle);
  const ny = cy + (radius - strokeW) * Math.sin(needleAngle);

  let prevEnd = 0;
  const zoneArcs = zones.map((z) => {
    const from = startAngle + totalArc * (prevEnd / maxValue);
    const to = startAngle + totalArc * (z.value / maxValue);
    prevEnd = z.value;
    return { from, to, color: z.color, label: z.label };
  });

  // Tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => i / 10);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.06, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <svg width={width} height={height}>
        {/* Background arc */}
        <path d={arcPath(startAngle, startAngle + totalArc, radius)} fill="none" stroke={colors.text} strokeOpacity={0.08} strokeWidth={strokeW} strokeLinecap="round" />
        {/* Zone arcs */}
        {zoneArcs.map((z, i) => (
          <path key={i} d={arcPath(z.from, z.to, radius)} fill="none" stroke={z.color} strokeOpacity={0.6} strokeWidth={strokeW} strokeLinecap="butt" />
        ))}
        {/* Tick marks */}
        {ticks.map((t, i) => {
          const a = startAngle + totalArc * t;
          const x1 = cx + (radius + strokeW / 2 + 4) * Math.cos(a);
          const y1 = cy + (radius + strokeW / 2 + 4) * Math.sin(a);
          const x2 = cx + (radius + strokeW / 2 + 14) * Math.cos(a);
          const y2 = cy + (radius + strokeW / 2 + 14) * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.text} strokeOpacity={0.2} strokeWidth={2} />;
        })}
        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={colors.accent} strokeWidth={4} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={12} fill={colors.accent} />
        <circle cx={cx} cy={cy} r={6} fill={colors.background} />
        {/* Value display */}
        <text x={cx} y={cy + radius * 0.45} textAnchor="middle" fill={colors.accent} fontSize={width * 0.055} fontWeight={800}>{displayVal.toLocaleString()}{unit}</text>
        <text x={cx} y={cy + radius * 0.62} textAnchor="middle" fill={colors.text} fillOpacity={0.4} fontSize={width * 0.013}>of {maxValue.toLocaleString()}</text>
        {/* Min/Max labels */}
        <text x={cx + (radius + 30) * Math.cos(startAngle)} y={cy + (radius + 30) * Math.sin(startAngle)} textAnchor="middle" fill={colors.text} fillOpacity={0.4} fontSize={width * 0.01}>0</text>
        <text x={cx + (radius + 30) * Math.cos(startAngle + totalArc)} y={cy + (radius + 30) * Math.sin(startAngle + totalArc)} textAnchor="middle" fill={colors.text} fillOpacity={0.4} fontSize={width * 0.01}>{maxValue}</text>
      </svg>
      <div style={{ position: "absolute", bottom: height * 0.04, width: "100%", textAlign: "center", opacity: 0.4 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.011 }}>Source: {sourceLabel} </span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.011 }}>{brand}</span>}
      </div>
    </AbsoluteFill>
  );
};

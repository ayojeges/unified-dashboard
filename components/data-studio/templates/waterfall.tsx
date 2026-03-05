import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface WaterfallProps {
  items: Array<{ label: string; value: number; type?: "increase" | "decrease" | "total" }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valueSuffix?: string;
  valuePrefix?: string;
}

export const WaterfallTemplate: React.FC<WaterfallProps> = ({
  items = [], title, subtitle, brand, colors, sourceLabel, valueSuffix = "", valuePrefix = "",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  if (!items.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Calculate running totals
  let running = 0;
  const bars = items.map(item => {
    if (item.type === "total") {
      const bar = { ...item, start: 0, end: running, displayValue: running };
      return bar;
    }
    const start = running;
    running += item.value;
    return { ...item, start, end: running, displayValue: item.value };
  });

  const allValues = bars.flatMap(b => [b.start, b.end]);
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;

  const pad = { top: height * 0.22, bottom: height * 0.16, left: width * 0.08, right: width * 0.04 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;
  const barW = (cW / items.length) * 0.6;
  const barGap = (cW / items.length) * 0.4;
  const zeroY = pad.top + cH - ((0 - minVal) / range) * cH;

  const getY = (val: number) => pad.top + cH - ((val - minVal) / range) * cH;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.014, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>

      <svg width={width} height={height}>
        {/* Zero line */}
        <line x1={pad.left} y1={zeroY} x2={pad.left + cW} y2={zeroY} stroke={colors.text} strokeOpacity={0.15} strokeWidth={1} strokeDasharray="4,4" />

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(frac => {
          const val = minVal + range * frac;
          const y = getY(val);
          return (
            <g key={frac}>
              <line x1={pad.left} y1={y} x2={pad.left + cW} y2={y} stroke={colors.text} strokeOpacity={0.06} />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" fill={colors.text} fillOpacity={0.3} fontSize={width * 0.009}>{valuePrefix}{Math.round(val).toLocaleString()}{valueSuffix}</text>
            </g>
          );
        })}

        {/* Bars */}
        {bars.map((bar, i) => {
          const delay = i * 10;
          const barProg = interpolate(frame, [delay + 15, delay + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const x = pad.left + i * (barW + barGap) + barGap / 2;
          const isIncrease = bar.value >= 0;
          const isTotal = bar.type === "total";
          const barColor = isTotal ? colors.accent : isIncrease ? "#10B981" : "#EF4444";

          const topY = getY(Math.max(bar.start, bar.end));
          const bottomY = getY(Math.min(bar.start, bar.end));
          const barHeight = (bottomY - topY) * barProg;

          // Connector line to next bar
          const hasNext = i < bars.length - 1;

          return (
            <g key={bar.label}>
              {/* Bar */}
              <rect
                x={x} y={isIncrease || isTotal ? bottomY - barHeight : topY}
                width={barW} height={Math.max(barHeight, 2)}
                fill={barColor} rx={4} opacity={barProg}
              />
              {/* Connector line */}
              {hasNext && !isTotal && (
                <line
                  x1={x + barW} y1={getY(bar.end)}
                  x2={x + barW + barGap} y2={getY(bar.end)}
                  stroke={colors.text} strokeOpacity={0.15} strokeWidth={1} strokeDasharray="3,3"
                />
              )}
              {/* Value label */}
              <text
                x={x + barW / 2}
                y={isIncrease ? topY - 8 : bottomY + 16}
                textAnchor="middle" fill={barColor} fontSize={width * 0.012} fontWeight={700}
                fillOpacity={barProg}
              >
                {isTotal ? "" : (isIncrease ? "+" : "")}{valuePrefix}{Math.round(bar.displayValue * barProg).toLocaleString()}{valueSuffix}
              </text>
              {isTotal && (
                <text x={x + barW / 2} y={topY - 8} textAnchor="middle" fill={colors.accent} fontSize={width * 0.014} fontWeight={800} fillOpacity={barProg}>
                  {valuePrefix}{Math.round(bar.end * barProg).toLocaleString()}{valueSuffix}
                </text>
              )}
              {/* Label */}
              <text
                x={x + barW / 2} y={pad.top + cH + 20}
                textAnchor="middle" fill={colors.text} fillOpacity={0.6} fontSize={width * 0.01}
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", bottom: height * 0.03, width: "100%", textAlign: "center", opacity: 0.4 }}>
        {sourceLabel && <span style={{ color: colors.text, fontSize: width * 0.011 }}>Source: {sourceLabel} </span>}
        {brand && <span style={{ color: colors.text, fontSize: width * 0.011 }}>{brand}</span>}
      </div>
    </AbsoluteFill>
  );
};

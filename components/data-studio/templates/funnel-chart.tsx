import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface FunnelChartProps {
  stages: Array<{ label: string; value: number; color?: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
  valueSuffix?: string;
}

const STAGE_COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444", "#06B6D4"];

export const FunnelChartTemplate: React.FC<FunnelChartProps> = ({
  stages = [], title, subtitle, brand, colors, sourceLabel, valueSuffix = "",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  if (!stages.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const maxVal = Math.max(...stages.map(s => s.value), 1);
  const funnelTop = height * 0.22;
  const funnelBottom = height * 0.85;
  const funnelHeight = funnelBottom - funnelTop;
  const stageH = funnelHeight / stages.length;
  const maxW = width * 0.65;
  const minW = width * 0.18;
  const centerX = width / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, width: "100%", textAlign: "center", opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.028, fontWeight: 700, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.015, opacity: 0.7, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        {stages.map((stage, i) => {
          const delay = i * 12;
          const prog = interpolate(frame, [delay + 10, delay + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const ratio = stage.value / maxVal;
          const nextRatio = i < stages.length - 1 ? stages[i + 1].value / maxVal : ratio * 0.6;
          const topW = (minW + (maxW - minW) * ratio) * prog;
          const botW = (minW + (maxW - minW) * nextRatio) * prog;
          const y = funnelTop + i * stageH;
          const stageColor = stage.color || STAGE_COLORS[i % STAGE_COLORS.length];
          const convRate = i > 0 ? ((stage.value / stages[i - 1].value) * 100).toFixed(0) : "100";

          return (
            <g key={stage.label}>
              <polygon
                points={`${centerX - topW / 2},${y} ${centerX + topW / 2},${y} ${centerX + botW / 2},${y + stageH} ${centerX - botW / 2},${y + stageH}`}
                fill={stageColor}
                fillOpacity={0.85}
              />
              <text x={centerX} y={y + stageH / 2 - 6} textAnchor="middle" fill="#FFFFFF" fontSize={width * 0.016} fontWeight={700}>
                {stage.label}
              </text>
              <text x={centerX} y={y + stageH / 2 + 14} textAnchor="middle" fill="#FFFFFF" fontSize={width * 0.013} fillOpacity={0.9}>
                {Math.round(stage.value * prog).toLocaleString()}{valueSuffix}
              </text>
              {i > 0 && (
                <text x={centerX + topW / 2 + 16} y={y + 18} fill={colors.accent} fontSize={width * 0.011} fontWeight={600} fillOpacity={prog}>
                  {convRate}%
                </text>
              )}
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

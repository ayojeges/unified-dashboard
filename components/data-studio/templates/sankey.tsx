"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface SankeyProps {
  nodes: Array<{ name: string }>;
  links: Array<{ source: number; target: number; value: number }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const SANKEY_COLORS = ["#64ffda", "#ff6b6b", "#ffd93d", "#a78bfa", "#f472b6", "#3b82f6", "#06b6d4", "#f97316", "#10b981", "#8b5cf6"];

export const SankeyTemplate: React.FC<SankeyProps> = ({ nodes = [], links = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!nodes.length || !links.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.2, bottom: height * 0.1, left: width * 0.06, right: width * 0.06 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;
  const nodeWidth = width * 0.02;
  const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });

  // Compute node columns (simple: find depth by traversal)
  const nodeDepths: number[] = new Array(nodes.length).fill(0);
  links.forEach(l => { nodeDepths[l.target] = Math.max(nodeDepths[l.target], nodeDepths[l.source] + 1); });
  const maxDepth = Math.max(...nodeDepths);
  const columns: number[][] = Array.from({ length: maxDepth + 1 }, () => []);
  nodeDepths.forEach((d, i) => columns[d].push(i));

  // Node positions
  const nodePos: Array<{ x: number; y: number; h: number }> = [];
  const nodeValues = nodes.map((_, i) => {
    const inVal = links.filter(l => l.target === i).reduce((s, l) => s + l.value, 0);
    const outVal = links.filter(l => l.source === i).reduce((s, l) => s + l.value, 0);
    return Math.max(inVal, outVal, 1);
  });
  const maxColVal = columns.map(col => col.reduce((s, ni) => s + nodeValues[ni], 0));
  const globalMax = Math.max(...maxColVal);

  columns.forEach((col, ci) => {
    const colX = pad.left + ci * (cW / maxDepth);
    const totalH = col.reduce((s, ni) => s + nodeValues[ni], 0);
    const scale = (cH * 0.8) / (totalH || 1);
    let cumY = pad.top + (cH - totalH * scale) / 2;

    col.forEach(ni => {
      const h = nodeValues[ni] * scale;
      nodePos[ni] = { x: colX, y: cumY, h };
      cumY += h + cH * 0.02;
    });
  });

  // Track link vertical offsets per node
  const nodeOutOffsets = new Array(nodes.length).fill(0);
  const nodeInOffsets = new Array(nodes.length).fill(0);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      <svg style={{ position: "absolute", top: 0, left: 0, width, height }}>
        {/* Links */}
        {links.map((l, li) => {
          const delay = li * fps * 0.06;
          const opacity = interpolate(frame, [fps * 0.5 + delay, fps * 1.5 + delay], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const src = nodePos[l.source];
          const tgt = nodePos[l.target];
          if (!src || !tgt) return null;

          const srcScale = nodeValues[l.source] ? l.value / nodeValues[l.source] : 0;
          const tgtScale = nodeValues[l.target] ? l.value / nodeValues[l.target] : 0;
          const linkH = Math.max(src.h * srcScale, 2);

          const sy = src.y + nodeOutOffsets[l.source];
          const ty = tgt.y + nodeInOffsets[l.target];
          nodeOutOffsets[l.source] += linkH;
          nodeInOffsets[l.target] += linkH;

          const sx = src.x + nodeWidth;
          const tx = tgt.x;
          const mx = (sx + tx) / 2;

          return (
            <path key={li}
              d={`M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty} L${tx},${ty + linkH} C${mx},${ty + linkH} ${mx},${sy + linkH} ${sx},${sy + linkH} Z`}
              fill={SANKEY_COLORS[l.source % SANKEY_COLORS.length]}
              opacity={opacity}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, ni) => {
          const pos = nodePos[ni];
          if (!pos) return null;
          const delay = ni * fps * 0.05;
          const scale = interpolate(frame, [fps * 0.3 + delay, fps * 0.8 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <React.Fragment key={ni}>
              <rect x={pos.x} y={pos.y} width={nodeWidth} height={pos.h * scale} fill={SANKEY_COLORS[ni % SANKEY_COLORS.length]} rx={3} />
              <text
                x={nodeDepths[ni] < maxDepth / 2 ? pos.x + nodeWidth + 6 : pos.x - 6}
                y={pos.y + pos.h / 2}
                textAnchor={nodeDepths[ni] < maxDepth / 2 ? "start" : "end"}
                dominantBaseline="central"
                fill={colors.text} fontSize={width * 0.009} fontWeight={600} opacity={scale}
              >{n.name}</text>
            </React.Fragment>
          );
        })}
      </svg>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

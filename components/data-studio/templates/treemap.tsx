"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface TreemapProps {
  data: { name: string; children: Array<{ name: string; children: Array<{ name: string; value: number }> }> };
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const TREE_COLORS = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899"];

function layoutTreemap(children: Array<{ name: string; value: number; color: string }>, x: number, y: number, w: number, h: number) {
  const total = children.reduce((s, c) => s + c.value, 0);
  const rects: Array<{ name: string; value: number; color: string; x: number; y: number; w: number; h: number }> = [];
  let cx = x, cy = y;
  const isHoriz = w >= h;

  children.forEach(child => {
    const ratio = child.value / total;
    if (isHoriz) {
      const rw = w * ratio;
      rects.push({ ...child, x: cx, y, w: rw, h });
      cx += rw;
    } else {
      const rh = h * ratio;
      rects.push({ ...child, x, y: cy, w, h: rh });
      cy += rh;
    }
  });
  return rects;
}

export const TreemapTemplate: React.FC<TreemapProps> = ({ data, title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!data?.children?.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const pad = { top: height * 0.18, bottom: height * 0.08, left: width * 0.04, right: width * 0.04 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;

  // Flatten hierarchy
  const allItems: Array<{ name: string; parentName: string; value: number; color: string }> = [];
  data.children.forEach((group, gi) => {
    const color = TREE_COLORS[gi % TREE_COLORS.length];
    (group.children || []).forEach(child => {
      allItems.push({ name: child.name, parentName: group.name, value: child.value, color });
    });
  });
  allItems.sort((a, b) => b.value - a.value);

  // First level layout
  const groups = data.children.map((g, i) => ({
    name: g.name,
    value: (g.children || []).reduce((s, c) => s + c.value, 0),
    color: TREE_COLORS[i % TREE_COLORS.length],
    children: g.children || [],
  }));
  groups.sort((a, b) => b.value - a.value);
  const groupRects = layoutTreemap(groups, pad.left, pad.top, cW, cH);

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.04, left: pad.left, opacity: titleOpacity }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Treemap rectangles */}
      {groupRects.map((gr, gi) => {
        const childItems = groups[gi].children.map(c => ({ name: c.name, value: c.value, color: gr.color }));
        childItems.sort((a, b) => b.value - a.value);
        const childRects = layoutTreemap(childItems, gr.x, gr.y, gr.w, gr.h);

        return childRects.map((cr, ci) => {
          const delay = (gi * 3 + ci) * 2;
          const scale = interpolate(frame, [fps * 0.3 + delay, fps * 0.8 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const opacity = interpolate(frame, [fps * 0.3 + delay, fps * 0.6 + delay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={`${gi}-${ci}`} style={{
              position: "absolute",
              left: cr.x + 1,
              top: cr.y + 1,
              width: (cr.w - 2) * scale,
              height: (cr.h - 2) * scale,
              background: cr.color,
              opacity: opacity * 0.85,
              borderRadius: 4,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 6,
            }}>
              {cr.w > width * 0.06 && cr.h > height * 0.06 && (
                <>
                  <div style={{ color: "#fff", fontSize: Math.min(width * 0.012, cr.w * 0.15), fontWeight: 700, lineHeight: 1.2 }}>{cr.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: Math.min(width * 0.01, cr.w * 0.12), marginTop: 2 }}>{cr.value}</div>
                </>
              )}
            </div>
          );
        });
      })}

      {/* Legend */}
      <div style={{ position: "absolute", bottom: height * 0.02, left: pad.left, display: "flex", gap: width * 0.02 }}>
        {groups.map((g, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: g.color }} />
            <span style={{ color: colors.text, fontSize: width * 0.01, opacity: 0.7 }}>{g.name}</span>
          </div>
        ))}
      </div>

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

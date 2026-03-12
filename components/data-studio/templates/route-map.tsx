"use client";

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface RouteMapProps {
  routes: Array<{ from: { name: string; x: number; y: number }; to: { name: string; x: number; y: number }; color?: string; label?: string }>;
  title: string;
  subtitle?: string;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  sourceLabel?: string;
}

const ROUTE_COLORS = ["#64ffda", "#ff6b6b", "#ffd93d", "#a78bfa", "#3B82F6"];

export const RouteMapTemplate: React.FC<RouteMapProps> = ({ routes = [], title, subtitle, brand, colors, sourceLabel }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  if (!routes.length) {
    return <AbsoluteFill style={{ backgroundColor: colors.background, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: colors.text, fontSize: 32 }}>No data</div></AbsoluteFill>;
  }

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });

  // Normalize coordinates to viewport
  const allX = routes.flatMap(r => [r.from.x, r.to.x]);
  const allY = routes.flatMap(r => [r.from.y, r.to.y]);
  const minX = Math.min(...allX), maxX = Math.max(...allX);
  const minY = Math.min(...allY), maxY = Math.max(...allY);
  const padMap = { top: height * 0.22, bottom: height * 0.1, left: width * 0.1, right: width * 0.1 };
  const mW = width - padMap.left - padMap.right;
  const mH = height - padMap.top - padMap.bottom;

  const toScreenX = (v: number) => padMap.left + ((v - minX) / (maxX - minX || 1)) * mW;
  const toScreenY = (v: number) => padMap.top + ((v - minY) / (maxY - minY || 1)) * mH;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Map background */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1f3a 0%, #0a0e27 100%)" }} />

      {/* Title */}
      <div style={{ position: "absolute", top: height * 0.05, left: padMap.left, opacity: titleOpacity, zIndex: 10 }}>
        <div style={{ color: colors.text, fontSize: width * 0.026, fontWeight: 800, fontFamily: "system-ui" }}>{title}</div>
        {subtitle && <div style={{ color: colors.text, fontSize: width * 0.013, opacity: 0.6, marginTop: 4 }}>{subtitle}</div>}
      </div>

      {/* Routes */}
      {routes.map((route, i) => {
        const routeColor = route.color || ROUTE_COLORS[i % ROUTE_COLORS.length];
        const fx = toScreenX(route.from.x), fy = toScreenY(route.from.y);
        const tx = toScreenX(route.to.x), ty = toScreenY(route.to.y);
        const mx = (fx + tx) / 2, my = (fy + ty) / 2 - height * 0.05;

        // Animated particle along curve
        const cycleLen = fps * 3;
        const t = ((frame + i * fps * 0.5) % cycleLen) / cycleLen;
        const px = (1 - t) * (1 - t) * fx + 2 * (1 - t) * t * mx + t * t * tx;
        const py = (1 - t) * (1 - t) * fy + 2 * (1 - t) * t * my + t * t * ty;

        const lineOpacity = interpolate(frame, [fps * 0.3 + i * fps * 0.3, fps * 1 + i * fps * 0.3], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        // SVG curve
        const pathD = `M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`;

        return (
          <React.Fragment key={i}>
            {/* Route line (using div approximation) */}
            <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={width} height={height}>
              <path d={pathD} fill="none" stroke={routeColor} strokeWidth={3} opacity={lineOpacity} />
            </svg>

            {/* Moving particle */}
            <div style={{
              position: "absolute",
              left: px - 6,
              top: py - 6,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: routeColor,
              boxShadow: `0 0 12px ${routeColor}`,
              opacity: lineOpacity * 2,
            }} />

            {/* From marker */}
            <div style={{
              position: "absolute", left: fx - 8, top: fy - 8, width: 16, height: 16,
              borderRadius: "50%", background: "#fff", opacity: lineOpacity * 2,
            }} />
            <div style={{
              position: "absolute", left: fx - 40, top: fy + 14, width: 80, textAlign: "center",
              color: colors.text, fontSize: width * 0.009, opacity: lineOpacity * 2,
            }}>{route.from.name}</div>

            {/* To marker */}
            <div style={{
              position: "absolute", left: tx - 8, top: ty - 8, width: 16, height: 16,
              borderRadius: "50%", background: "#fff", opacity: lineOpacity * 2,
            }} />
            <div style={{
              position: "absolute", left: tx - 40, top: ty + 14, width: 80, textAlign: "center",
              color: colors.text, fontSize: width * 0.009, opacity: lineOpacity * 2,
            }}>{route.to.name}</div>
          </React.Fragment>
        );
      })}

      {sourceLabel && <div style={{ position: "absolute", bottom: height * 0.02, right: width * 0.03, color: `${colors.text}40`, fontSize: width * 0.01, zIndex: 10 }}>{sourceLabel}</div>}
    </AbsoluteFill>
  );
};

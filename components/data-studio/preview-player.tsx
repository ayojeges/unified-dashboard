"use client";

import React from "react";
import { Player } from "@remotion/player";
import { LineRaceTemplate } from "./templates/line-race";
import { BarRaceTemplate } from "./templates/bar-race";
import { ComparisonDuelTemplate } from "./templates/comparison-duel";
import { StatCounterTemplate } from "./templates/stat-counter";
import { StackedAreaTemplate } from "./templates/stacked-area";

interface PreviewPlayerProps {
  template: string;
  data: any;
  brand: string;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  playing: boolean;
  aspectRatio?: "16:9" | "1:1" | "9:16";
}

const FPS = 30;
const DURATION_SEC = 10;

const ASPECT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
};

const TEMPLATE_MAP: Record<string, React.FC<any>> = {
  line_race: LineRaceTemplate,
  bar_race: BarRaceTemplate,
  comparison_duel: ComparisonDuelTemplate,
  stat_counter: StatCounterTemplate,
  stacked_area: StackedAreaTemplate,
};

export const PreviewPlayer: React.FC<PreviewPlayerProps> = ({ template, data, brand, colors, playing, aspectRatio = "16:9" }) => {
  const durationInFrames = FPS * DURATION_SEC;
  const dims = ASPECT_DIMENSIONS[aspectRatio] || ASPECT_DIMENSIONS["16:9"];
  const Component = TEMPLATE_MAP[template] || LineRaceTemplate;

  const getInputProps = () => {
    const base = { brand, colors, sourceLabel: data?.sourceLabel || brand };
    switch (template) {
      case "line_race": return { ...base, data: data?.data || [], title: data?.title || "", subtitle: data?.subtitle, endNote: data?.endNote };
      case "bar_race": return { ...base, data: data?.data || [], title: data?.title || "", subtitle: data?.subtitle, valueSuffix: data?.valueSuffix || "", maxBars: data?.maxBars || 8 };
      case "comparison_duel": return { ...base, left: data?.left, right: data?.right, categories: data?.categories || [], title: data?.title || "", subtitle: data?.subtitle };
      case "stat_counter": return { ...base, value: data?.value || 0, prefix: data?.prefix || "", suffix: data?.suffix || "+", title: data?.title || "", subtitle: data?.subtitle, contextLine: data?.contextLine, miniChartData: data?.miniChartData };
      case "stacked_area": return { ...base, series: data?.series || [], years: data?.years || [], title: data?.title || "", subtitle: data?.subtitle };
      default: return base;
    }
  };

  return (
    <Player
      component={Component as any}
      inputProps={getInputProps()}
      durationInFrames={durationInFrames}
      fps={FPS}
      compositionWidth={dims.width}
      compositionHeight={dims.height}
      style={{ width: "100%" }}
      autoPlay={playing}
      loop
      controls
      acknowledgeRemotionLicense
    />
  );
};

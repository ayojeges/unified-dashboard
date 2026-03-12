"use client";

import React from "react";
import { Player } from "@remotion/player";
import { LineRaceTemplate } from "./templates/line-race";
import { BarRaceTemplate } from "./templates/bar-race";
import { ComparisonDuelTemplate } from "./templates/comparison-duel";
import { StatCounterTemplate } from "./templates/stat-counter";
import { StackedAreaTemplate } from "./templates/stacked-area";
import { FunnelChartTemplate } from "./templates/funnel-chart";
import { DonutChartTemplate } from "./templates/donut-chart";
import { HeatmapGridTemplate } from "./templates/heatmap-grid";
import { GaugeTemplate } from "./templates/gauge";
import { BeforeAfterTemplate } from "./templates/before-after";
import { TimelineTemplate } from "./templates/timeline";
import { LeaderboardTemplate } from "./templates/leaderboard";
import { QuoteCardTemplate } from "./templates/quote-card";
import { MapVizTemplate } from "./templates/map-viz";
import { ScatterRaceTemplate } from "./templates/scatter-race";
import { WaterfallTemplate } from "./templates/waterfall";
import { RadarChartTemplate } from "./templates/radar-chart";
import { TierListTemplate } from "./templates/tier-list";
import { TournamentBracketTemplate } from "./templates/tournament-bracket";
import { SchoolMatrixTemplate } from "./templates/school-matrix";
import { StackedRankingTemplate } from "./templates/stacked-ranking";
import { ProgressGridTemplate } from "./templates/progress-grid";
// New templates
import { ColumnRaceTemplate } from "./templates/column-race";
import { TreemapTemplate } from "./templates/treemap";
import { BoxPlotTemplate } from "./templates/box-plot";
import { ParliamentTemplate } from "./templates/parliament";
import { BubbleChartTemplate } from "./templates/bubble-chart";
import { ChoroplethTemplate } from "./templates/choropleth";
import { BeeswarmTemplate } from "./templates/beeswarm";
import { RouteMapTemplate } from "./templates/route-map";
import { CardSliderTemplate } from "./templates/card-slider";
import { DualRaceLineTemplate } from "./templates/dual-race-line";
import { PointMapTemplate } from "./templates/point-map";
import { StorySliderTemplate } from "./templates/story-slider";

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
  funnel_chart: FunnelChartTemplate,
  donut_chart: DonutChartTemplate,
  heatmap_grid: HeatmapGridTemplate,
  gauge: GaugeTemplate,
  before_after: BeforeAfterTemplate,
  timeline: TimelineTemplate,
  leaderboard: LeaderboardTemplate,
  quote_card: QuoteCardTemplate,
  map_viz: MapVizTemplate,
  scatter_race: ScatterRaceTemplate,
  waterfall: WaterfallTemplate,
  radar_chart: RadarChartTemplate,
  tier_list: TierListTemplate,
  tournament_bracket: TournamentBracketTemplate,
  school_matrix: SchoolMatrixTemplate,
  stacked_ranking: StackedRankingTemplate,
  progress_grid: ProgressGridTemplate,
  // New templates
  column_race: ColumnRaceTemplate,
  treemap: TreemapTemplate,
  box_plot: BoxPlotTemplate,
  parliament: ParliamentTemplate,
  bubble_chart: BubbleChartTemplate,
  choropleth: ChoroplethTemplate,
  beeswarm: BeeswarmTemplate,
  route_map: RouteMapTemplate,
  card_slider: CardSliderTemplate,
  dual_race_line: DualRaceLineTemplate,
  point_map: PointMapTemplate,
  story_slider: StorySliderTemplate,
};

export const PreviewPlayer: React.FC<PreviewPlayerProps> = ({ template, data, brand, colors, playing, aspectRatio = "16:9" }) => {
  const durationInFrames = FPS * DURATION_SEC;
  const dims = ASPECT_DIMENSIONS[aspectRatio] || ASPECT_DIMENSIONS["16:9"];
  const Component = TEMPLATE_MAP[template] || LineRaceTemplate;

  const getInputProps = () => {
    const base = { brand, colors, sourceLabel: data?.sourceLabel || brand };
    return { ...base, ...data };
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

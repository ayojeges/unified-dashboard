"use client";

import React, { useState, useCallback } from "react";
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
// Advanced templates (batch 2)
import { LineChartRaceTemplate } from "./templates/line-chart-race";
import { AreaRaceTemplate } from "./templates/area-race";
import { ForecastLineTemplate } from "./templates/forecast-line";
import { SlopeChartTemplate } from "./templates/slope-chart";
import { PackedBubbleTemplate } from "./templates/packed-bubble";
import { WordCloudTemplate } from "./templates/word-cloud";
import { PictogramTemplate } from "./templates/pictogram";
import { NightingaleRoseTemplate } from "./templates/nightingale-rose";
import { RadarCompareTemplate } from "./templates/radar-compare";
import { GroupedBarTemplate } from "./templates/grouped-bar";
import { LollipopTemplate } from "./templates/lollipop";
import { DotPlotTemplate } from "./templates/dot-plot";
import { SankeyTemplate } from "./templates/sankey";
import { BulletChartTemplate } from "./templates/bullet-chart";
import { HeatmapMatrixTemplate } from "./templates/heatmap-matrix";

const COMPONENT_MAP: Record<string, React.FC<any>> = {
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
  // Advanced templates (batch 2)
  line_chart_race: LineChartRaceTemplate,
  area_race: AreaRaceTemplate,
  forecast_line: ForecastLineTemplate,
  slope_chart: SlopeChartTemplate,
  packed_bubble: PackedBubbleTemplate,
  word_cloud: WordCloudTemplate,
  pictogram: PictogramTemplate,
  nightingale_rose: NightingaleRoseTemplate,
  radar_compare: RadarCompareTemplate,
  grouped_bar: GroupedBarTemplate,
  lollipop: LollipopTemplate,
  dot_plot: DotPlotTemplate,
  sankey: SankeyTemplate,
  bullet_chart: BulletChartTemplate,
  heatmap_matrix: HeatmapMatrixTemplate,
};

interface TemplateThumbnailProps {
  templateId: string;
  sampleData: any;
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  templateId,
  sampleData,
  colors,
}) => {
  const [hovered, setHovered] = useState(false);
  const Component = COMPONENT_MAP[templateId];

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  if (!Component || !sampleData) return null;

  const inputProps = { ...sampleData, colors, brand: "Preview", sourceLabel: "" };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: 6,
        overflow: "hidden",
        position: "relative",
        background: colors.background,
      }}
      data-testid={`thumbnail-${templateId}`}
    >
      <Player
        component={Component as any}
        inputProps={inputProps}
        durationInFrames={300}
        fps={30}
        compositionWidth={1920}
        compositionHeight={1080}
        style={{ width: "100%", height: "100%" }}
        autoPlay={hovered}
        loop
        acknowledgeRemotionLicense
      />
      {!hovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.15)",
            transition: "opacity 0.2s",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M1 1.5L11 7L1 12.5V1.5Z" fill="#0F172A" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

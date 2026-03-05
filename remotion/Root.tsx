import React from "react";
import { Composition } from "remotion";
import { LineRaceTemplate } from "../components/data-studio/templates/line-race";
import { BarRaceTemplate } from "../components/data-studio/templates/bar-race";
import { ComparisonDuelTemplate } from "../components/data-studio/templates/comparison-duel";
import { StatCounterTemplate } from "../components/data-studio/templates/stat-counter";
import { StackedAreaTemplate } from "../components/data-studio/templates/stacked-area";
import { FunnelChartTemplate } from "../components/data-studio/templates/funnel-chart";
import { DonutChartTemplate } from "../components/data-studio/templates/donut-chart";
import { HeatmapGridTemplate } from "../components/data-studio/templates/heatmap-grid";
import { GaugeTemplate } from "../components/data-studio/templates/gauge";
import { BeforeAfterTemplate } from "../components/data-studio/templates/before-after";
import { TimelineTemplate } from "../components/data-studio/templates/timeline";
import { LeaderboardTemplate } from "../components/data-studio/templates/leaderboard";
import { QuoteCardTemplate } from "../components/data-studio/templates/quote-card";
import { MapVizTemplate } from "../components/data-studio/templates/map-viz";
import { ScatterRaceTemplate } from "../components/data-studio/templates/scatter-race";
import { WaterfallTemplate } from "../components/data-studio/templates/waterfall";

const FPS = 30;
const DURATION = FPS * 10;
const defaultColors = { primary: "#3B82F6", secondary: "#60A5FA", background: "#0F172A", text: "#F8FAFC", accent: "#F59E0B" };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="LineRace" component={LineRaceTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ data: [], title: "", brand: "", colors: defaultColors }} />
    <Composition id="BarRace" component={BarRaceTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ data: [], title: "", brand: "", colors: defaultColors }} />
    <Composition id="ComparisonDuel" component={ComparisonDuelTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ left: { label: "", values: [], color: "" }, right: { label: "", values: [], color: "" }, categories: [], title: "", brand: "", colors: defaultColors }} />
    <Composition id="StatCounter" component={StatCounterTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ value: 0, title: "", brand: "", colors: defaultColors }} />
    <Composition id="StackedArea" component={StackedAreaTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ series: [], years: [], title: "", brand: "", colors: defaultColors }} />
    <Composition id="FunnelChart" component={FunnelChartTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ stages: [], title: "", brand: "", colors: defaultColors }} />
    <Composition id="DonutChart" component={DonutChartTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ segments: [], title: "", brand: "", colors: defaultColors }} />
    <Composition id="HeatmapGrid" component={HeatmapGridTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ rows: [], columns: [], title: "", brand: "", colors: defaultColors }} />
    <Composition id="Gauge" component={GaugeTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ value: 0, maxValue: 100, title: "", brand: "", colors: defaultColors }} />
    <Composition id="BeforeAfter" component={BeforeAfterTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ before: { label: "Before", value: "0" }, after: { label: "After", value: "0" }, title: "", brand: "", colors: defaultColors }} />
    <Composition id="Timeline" component={TimelineTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ events: [], title: "", brand: "", colors: defaultColors }} />
    <Composition id="Leaderboard" component={LeaderboardTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ entries: [], title: "", brand: "", colors: defaultColors }} />
    <Composition id="QuoteCard" component={QuoteCardTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ quote: "", author: "", brand: "", colors: defaultColors }} />
    <Composition id="MapViz" component={MapVizTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ states: [], title: "", brand: "", colors: defaultColors }} />
    <Composition id="ScatterRace" component={ScatterRaceTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ bubbles: [], xLabel: "X", yLabel: "Y", title: "", brand: "", colors: defaultColors }} />
    <Composition id="Waterfall" component={WaterfallTemplate as any} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ items: [], title: "", brand: "", colors: defaultColors }} />
  </>
);

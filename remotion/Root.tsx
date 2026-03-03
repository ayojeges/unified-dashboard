import React from "react";
import { Composition } from "remotion";
import { LineRaceTemplate } from "../components/data-studio/templates/line-race";
import { BarRaceTemplate } from "../components/data-studio/templates/bar-race";
import { ComparisonDuelTemplate } from "../components/data-studio/templates/comparison-duel";
import { StatCounterTemplate } from "../components/data-studio/templates/stat-counter";
import { StackedAreaTemplate } from "../components/data-studio/templates/stacked-area";

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
  </>
);

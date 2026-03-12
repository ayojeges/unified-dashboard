"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PreviewPlayer } from "@/components/data-studio/preview-player";
import {
  TrendingUp, BarChart3, GitCompare, Hash, Layers, Play, Palette, Database,
  ChevronLeft, ChevronRight, Download, FileText, Monitor, Square, Smartphone,
  Sparkles, AlertCircle, CheckCircle2, Filter, PieChart, Grid3X3, Gauge,
  ArrowLeftRight, Clock, Trophy, Quote, Map, ScatterChart, CandlestickChart, Send,
  Radar, ListOrdered, Swords, LayoutGrid, BarChart, Activity,
  Columns, TreePine, BoxSelect, Vote, Circle, MapPin, Navigation, GalleryHorizontalEnd,
  SplitSquareVertical, Locate, BookOpen, Zap, AreaChart, Target, ArrowUpDown,
  Cloudy, Type, Image, Flower, Hexagon, BarChart2, Minus, Dot, GitBranch, Crosshair, Table2,
} from "lucide-react";

type TemplateType = "line_race" | "bar_race" | "comparison_duel" | "stat_counter" | "stacked_area" | "funnel_chart" | "donut_chart" | "heatmap_grid" | "gauge" | "before_after" | "timeline" | "leaderboard" | "quote_card" | "map_viz" | "scatter_race" | "waterfall" | "radar_chart" | "tier_list" | "tournament_bracket" | "school_matrix" | "stacked_ranking" | "progress_grid" | "column_race" | "treemap" | "box_plot" | "parliament" | "bubble_chart" | "choropleth" | "beeswarm" | "route_map" | "card_slider" | "dual_race_line" | "point_map" | "story_slider" | "line_chart_race" | "area_race" | "forecast_line" | "slope_chart" | "packed_bubble" | "word_cloud" | "pictogram" | "nightingale_rose" | "radar_compare" | "grouped_bar" | "lollipop" | "dot_plot" | "sankey" | "bullet_chart" | "heatmap_matrix";

interface BrandColors {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

const BRAND_PRESETS: Record<string, BrandColors> = {
  schoolregistry: { name: "SchoolRegistry", primary: "#059669", secondary: "#34D399", background: "#0F172A", text: "#F8FAFC", accent: "#F59E0B" },
  cdlschools: { name: "CDL Schools", primary: "#1E40AF", secondary: "#3B82F6", background: "#0F172A", text: "#F8FAFC", accent: "#F97316" },
  chatautomate: { name: "ChatAutomate", primary: "#7C3AED", secondary: "#8B5CF6", background: "#0F172A", text: "#F8FAFC", accent: "#F59E0B" },
  guardiancryo: { name: "GuardianCryo", primary: "#0D9488", secondary: "#14B8A6", background: "#0F172A", text: "#F8FAFC", accent: "#F59E0B" },
  custom: { name: "Custom", primary: "#3B82F6", secondary: "#60A5FA", background: "#0F172A", text: "#F8FAFC", accent: "#F59E0B" },
};

const TEMPLATES: { id: TemplateType; name: string; description: string; useCase: string; example: string; category: string }[] = [
  // ── Comparison ──
  { id: "comparison_duel", name: "Comparison Duel", description: "Head-to-head split screen", useCase: "Product vs competitor, before/after metrics", example: "Public vs Private: WAEC Head-to-Head", category: "Comparison" },
  { id: "before_after", name: "Before / After", description: "Side-by-side wipe reveal", useCase: "Transformation stories, impact metrics", example: "Before vs After SchoolRegistry", category: "Comparison" },
  { id: "radar_chart", name: "Radar Chart", description: "Multi-dimensional spider chart", useCase: "Multi-metric school/product comparison", example: "School A vs B: 6 Metrics", category: "Comparison" },
  { id: "tournament_bracket", name: "Tournament Bracket", description: "Elimination-style matchups", useCase: "Competitive rankings, playoff-style content", example: "Top 8 Schools: Who Wins?", category: "Comparison" },
  { id: "school_matrix", name: "School Matrix", description: "Price vs Quality scatter", useCase: "Value analysis, positioning maps", example: "Schools: Fees vs Pass Rate", category: "Comparison" },
  { id: "progress_grid", name: "Progress Grid", description: "Side-by-side progress bars", useCase: "Multi-entity metric comparisons", example: "3 Schools: 5 Metrics Compared", category: "Comparison" },
  // ── Rankings ──
  { id: "leaderboard", name: "Leaderboard", description: "Ranked list with bars", useCase: "Top performers, score boards", example: "Top Schools by WAEC Performance", category: "Rankings" },
  { id: "bar_race", name: "Bar Race", description: "Horizontal bars reordering over time", useCase: "Animated state/category rankings over years", example: "Top 10 States by Score", category: "Rankings" },
  { id: "tier_list", name: "Tier List", description: "S/A/B/C/D tier classification", useCase: "Quality tiers, rating systems", example: "Lagos Schools Tier Ranking", category: "Rankings" },
  { id: "stacked_ranking", name: "Stacked Ranking", description: "Composite score breakdown", useCase: "Multi-factor weighted rankings", example: "Schools by Combined Score", category: "Rankings" },
  { id: "column_race", name: "Column Race", description: "Vertical animated bar chart", useCase: "Mobile-optimized capacity comparisons, category breakdowns", example: "CDL School Types: Capacity Comparison", category: "Rankings" },
  // ── Trends ──
  { id: "line_race", name: "Line Race", description: "Animated line chart over time", useCase: "Performance trends, growth tracking", example: "WAEC Performance 2016-2025", category: "Trends" },
  { id: "stacked_area", name: "Stacked Area", description: "Composition changes over time", useCase: "Market share shifts, segment growth", example: "Public vs Private Growth", category: "Trends" },
  { id: "scatter_race", name: "Scatter Race", description: "Animated bubble positions over time", useCase: "Multi-variable time-series", example: "Enrollment vs Pass Rate", category: "Trends" },
  { id: "timeline", name: "Timeline", description: "Milestones on vertical timeline", useCase: "Company history, journey stories", example: "Company Journey 2020-2026", category: "Trends" },
  { id: "dual_race_line", name: "Bar Race + Line", description: "Dual view: rankings + trend line", useCase: "Top schools + total market growth context", example: "Top CDL Schools + Market Growth", category: "Trends" },
  // ── Distribution ──
  { id: "donut_chart", name: "Donut Chart", description: "Animated percentage breakdown", useCase: "Market segments, composition", example: "School Types: Public vs Private", category: "Distribution" },
  { id: "funnel_chart", name: "Funnel Chart", description: "Conversion funnel stages", useCase: "User journey, sales pipeline", example: "Visitors to Enrollment", category: "Distribution" },
  { id: "heatmap_grid", name: "Heatmap Grid", description: "Color-coded matrix", useCase: "Performance by region/subject", example: "Pass Rate by State & Subject", category: "Distribution" },
  { id: "waterfall", name: "Waterfall", description: "Incremental gain/loss", useCase: "Revenue breakdowns, budget analysis", example: "Revenue by Quarter", category: "Distribution" },
  { id: "treemap", name: "Treemap", description: "Nested hierarchical blocks", useCase: "Category breakdown by type, state & status", example: "CDL Schools by Type & State", category: "Distribution" },
  { id: "box_plot", name: "Box Plot", description: "Statistical distribution", useCase: "Fee/score ranges, outlier detection", example: "Tuition Distribution by School Type", category: "Distribution" },
  { id: "beeswarm", name: "Beeswarm Chart", description: "Dense dot positioning", useCase: "Individual entity positioning without overlap", example: "School Quality Score Distribution", category: "Distribution" },
  // ── Maps ──
  { id: "map_viz", name: "Nigeria Map", description: "State-level grid map", useCase: "Nigerian school density by state", example: "School Density by State", category: "Maps" },
  { id: "point_map", name: "Point Map", description: "GPS markers with labels", useCase: "School locations, facility finder", example: "CDL School Locations Across US", category: "Maps" },
  { id: "choropleth", name: "Choropleth Map", description: "Color-coded US state grid", useCase: "State-level density heatmap, per capita metrics", example: "CDL Schools per State", category: "Maps" },
  { id: "route_map", name: "Route Map", description: "Animated flow lines", useCase: "Bus routes, supply chains, student migration", example: "School Bus Coverage & Routes", category: "Maps" },
  // ── Highlights ──
  { id: "stat_counter", name: "Stat Counter", description: "Large animated number", useCase: "Hero stats, milestone celebrations", example: "13,360+ Schools Verified", category: "Highlights" },
  { id: "gauge", name: "Gauge", description: "KPI speedometer", useCase: "Uptime, satisfaction scores, completion rates", example: "Platform Uptime: 99.7%", category: "Highlights" },
  { id: "quote_card", name: "Quote Card", description: "Testimonial with typing effect", useCase: "Customer quotes, social proof", example: "Customer Testimonial + Stat", category: "Highlights" },
  { id: "parliament", name: "Parliament Chart", description: "Hemicycle seat visualization", useCase: "Verification status, approval rates, voting", example: "85% FMCSA Verified Schools", category: "Highlights" },
  { id: "bubble_chart", name: "Bubble Chart", description: "Multi-dimensional bubbles", useCase: "Tuition vs hours vs placement (size=enrollment)", example: "CDL Schools: Cost vs Outcomes", category: "Highlights" },
  // ── Narrative ──
  { id: "card_slider", name: "Card Slider", description: "Scrolling showcase cards", useCase: "Featured schools, product catalogs", example: "Featured CDL School Showcase", category: "Narrative" },
  { id: "story_slider", name: "Story Slider", description: "Step-by-step journey guide", useCase: "Onboarding journeys, how-it-works guides", example: "CDL License: 3-Step Journey", category: "Narrative" },
  // ── Advanced Visualizations ──
  { id: "line_chart_race", name: "Line Chart Race", description: "Trajectory ranking lines", useCase: "State ranking evolution, volatility tracking", example: "State Ranking Trajectories 2020-2024", category: "Trends" },
  { id: "area_race", name: "Area Race", description: "Stacked area animation", useCase: "Cumulative market share, segment growth", example: "School Type Market Share Over Time", category: "Trends" },
  { id: "forecast_line", name: "Forecast Line", description: "Historical + projected with confidence", useCase: "Growth projections, scenario planning", example: "Projected Growth 2024-2028", category: "Trends" },
  { id: "slope_chart", name: "Slope Chart", description: "Before/after connecting lines", useCase: "Period-over-period comparison, gain/loss", example: "2020 vs 2024 State Comparison", category: "Comparison" },
  { id: "packed_bubble", name: "Packed Bubble", description: "Hierarchical circle packing", useCase: "Proportional category comparison, drill-down", example: "School Distribution by State", category: "Distribution" },
  { id: "word_cloud", name: "Word Cloud", description: "Weighted word visualization", useCase: "Naming trends, keyword frequency, review analysis", example: "Most Common School Names & Features", category: "Highlights" },
  { id: "pictogram", name: "Pictogram", description: "Icon-based unit chart", useCase: "Engaging count displays, social media content", example: "School Count by State (1 icon = 50)", category: "Highlights" },
  { id: "nightingale_rose", name: "Nightingale Rose", description: "Polar area chart", useCase: "Seasonal patterns, cyclical data", example: "Monthly Enrollment Patterns", category: "Distribution" },
  { id: "radar_compare", name: "Radar Compare", description: "Multi-series spider chart", useCase: "Multi-dimensional type comparison", example: "Private vs Community vs Company", category: "Comparison" },
  { id: "grouped_bar", name: "Grouped Bar", description: "Side-by-side bar groups", useCase: "Category comparison across groups", example: "Tuition by State & School Type", category: "Comparison" },
  { id: "lollipop", name: "Lollipop Chart", description: "Minimalist ranked display", useCase: "Clean rankings, precise value comparison", example: "Top Schools by Job Placement", category: "Rankings" },
  { id: "dot_plot", name: "Dot Plot", description: "Min/median/max range display", useCase: "Distribution ranges, outlier detection", example: "Tuition Range by School Type", category: "Distribution" },
  { id: "sankey", name: "Sankey Diagram", description: "Flow visualization", useCase: "Student journeys, conversion paths", example: "School Type to Carrier to Region", category: "Distribution" },
  { id: "bullet_chart", name: "Bullet Chart", description: "KPI with target ranges", useCase: "Progress vs targets, compliance tracking", example: "FMCSA Verification by State", category: "Highlights" },
  { id: "heatmap_matrix", name: "Heatmap Matrix", description: "Two-dimensional intensity grid", useCase: "State x Type density, gap analysis", example: "School Density: State x Type", category: "Distribution" },
];

const TEMPLATE_ICONS: Record<TemplateType, any> = {
  line_race: TrendingUp,
  bar_race: BarChart3,
  comparison_duel: GitCompare,
  stat_counter: Hash,
  stacked_area: Layers,
  funnel_chart: Filter,
  donut_chart: PieChart,
  heatmap_grid: Grid3X3,
  gauge: Gauge,
  before_after: ArrowLeftRight,
  timeline: Clock,
  leaderboard: Trophy,
  quote_card: Quote,
  map_viz: Map,
  scatter_race: ScatterChart,
  waterfall: CandlestickChart,
  radar_chart: Radar,
  tier_list: ListOrdered,
  tournament_bracket: Swords,
  school_matrix: LayoutGrid,
  stacked_ranking: BarChart,
  progress_grid: Activity,
  // New
  column_race: Columns,
  treemap: TreePine,
  box_plot: BoxSelect,
  parliament: Vote,
  bubble_chart: Circle,
  choropleth: Map,
  beeswarm: ScatterChart,
  route_map: Navigation,
  card_slider: GalleryHorizontalEnd,
  dual_race_line: SplitSquareVertical,
  point_map: MapPin,
  story_slider: BookOpen,
  // Advanced templates
  line_chart_race: AreaChart,
  area_race: Layers,
  forecast_line: Target,
  slope_chart: ArrowUpDown,
  packed_bubble: Hexagon,
  word_cloud: Type,
  pictogram: Image,
  nightingale_rose: Flower,
  radar_compare: Radar,
  grouped_bar: BarChart2,
  lollipop: Minus,
  dot_plot: Dot,
  sankey: GitBranch,
  bullet_chart: Crosshair,
  heatmap_matrix: Table2,
};

const SAMPLE_DATA: Record<TemplateType, string> = {
  line_race: JSON.stringify({ title: "WAEC Performance Trend", subtitle: "National average pass rate", endNote: "72% (2025)", sourceLabel: "SchoolRegistry.ng", data: [{ year: 2016, value: 48 }, { year: 2017, value: 51 }, { year: 2018, value: 55 }, { year: 2019, value: 63 }, { year: 2020, value: 58 }, { year: 2021, value: 60 }, { year: 2022, value: 65 }, { year: 2023, value: 68 }, { year: 2024, value: 71 }, { year: 2025, value: 72 }] }, null, 2),
  bar_race: JSON.stringify({ title: "Top Schools by Enrollment", subtitle: "Verified school enrollment figures", sourceLabel: "SchoolRegistry.ng", valueSuffix: " students", maxBars: 6, data: [{ label: "Lagos Model School", values: [{ year: 2020, value: 1200 }, { year: 2023, value: 1800 }] }, { label: "Abuja International", values: [{ year: 2020, value: 900 }, { year: 2023, value: 1500 }] }, { label: "Rivers Academy", values: [{ year: 2020, value: 700 }, { year: 2023, value: 1100 }] }] }, null, 2),
  comparison_duel: JSON.stringify({ title: "Public vs Private Schools", subtitle: "Performance metrics comparison", sourceLabel: "SchoolRegistry.ng", categories: ["Pass Rate", "Enrollment", "Teacher Ratio"], left: { label: "Public Schools", values: [52, 1200, 45], color: "#059669" }, right: { label: "Private Schools", values: [78, 800, 25], color: "#3B82F6" } }, null, 2),
  stat_counter: JSON.stringify({ title: "Schools Verified", subtitle: "Across all 36 states", value: 13360, prefix: "", suffix: "+", contextLine: "And growing every day", sourceLabel: "SchoolRegistry.ng", miniChartData: [2000, 4500, 6000, 7800, 9200, 10500, 11800, 12500, 13000, 13360] }, null, 2),
  stacked_area: JSON.stringify({ title: "School Type Distribution", subtitle: "Public vs Private school growth", sourceLabel: "SchoolRegistry.ng", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], series: [{ label: "Public", values: [5000, 5200, 5100, 5400, 5700, 6000, 6200, 6500], color: "#059669" }, { label: "Private", values: [3000, 3400, 3200, 3600, 4000, 4500, 5000, 5500], color: "#3B82F6" }] }, null, 2),
  funnel_chart: JSON.stringify({ title: "Enrollment Funnel", subtitle: "Website to verified enrollment", sourceLabel: "SchoolRegistry.ng", valueSuffix: " users", stages: [{ label: "Website Visitors", value: 50000 }, { label: "Sign-ups", value: 12000 }, { label: "School Search", value: 8500 }, { label: "Applications", value: 3200 }, { label: "Enrolled", value: 1800 }] }, null, 2),
  donut_chart: JSON.stringify({ title: "School Types in Nigeria", subtitle: "Distribution by ownership", sourceLabel: "SchoolRegistry.ng", centerLabel: "Total", centerValue: "13,360", segments: [{ label: "Public", value: 6200, color: "#059669" }, { label: "Private", value: 4800, color: "#3B82F6" }, { label: "Mission", value: 1500, color: "#F59E0B" }, { label: "Community", value: 860, color: "#8B5CF6" }] }, null, 2),
  heatmap_grid: JSON.stringify({ title: "WAEC Pass Rate by State & Subject", subtitle: "2024 Performance", sourceLabel: "SchoolRegistry.ng", columns: ["English", "Maths", "Physics", "Biology", "Chemistry"], rows: [{ label: "Lagos", values: [78, 72, 65, 70, 68] }, { label: "Abuja", values: [75, 68, 62, 67, 64] }, { label: "Rivers", values: [70, 64, 58, 63, 60] }, { label: "Kano", values: [55, 48, 42, 50, 45] }, { label: "Oyo", values: [72, 66, 60, 65, 62] }] }, null, 2),
  gauge: JSON.stringify({ title: "Platform Reliability", subtitle: "Current month uptime", sourceLabel: "SchoolRegistry.ng", value: 99.7, maxValue: 100, unit: "%", thresholds: [{ value: 90, color: "#EF4444", label: "Critical" }, { value: 99, color: "#F59E0B", label: "Fair" }, { value: 100, color: "#10B981", label: "Excellent" }] }, null, 2),
  before_after: JSON.stringify({ title: "The SchoolRegistry Effect", subtitle: "Parent experience transformation", sourceLabel: "SchoolRegistry.ng", metric: "Average school search time", before: { label: "Before", value: "3 weeks", description: "Parents visited multiple schools in person", color: "#EF4444" }, after: { label: "After", value: "15 min", description: "Compare verified schools online with data", color: "#10B981" } }, null, 2),
  timeline: JSON.stringify({ title: "SchoolRegistry Journey", subtitle: "From idea to scale", sourceLabel: "SchoolRegistry.ng", events: [{ date: "Jan 2020", title: "Founded", description: "Started with 50 schools" }, { date: "Jun 2021", title: "1,000 Schools", description: "Expanded to 5 states" }, { date: "Mar 2023", title: "5,000 Schools", description: "Launched verification" }, { date: "Jan 2025", title: "10,000+ Schools", description: "Nationwide coverage" }, { date: "Mar 2026", title: "13,360 Schools", description: "AI recommendations" }] }, null, 2),
  leaderboard: JSON.stringify({ title: "Top Schools by Performance", subtitle: "WAEC 2024 Results", sourceLabel: "SchoolRegistry.ng", scoreLabel: "Pass Rate", entries: [{ name: "Kings College Lagos", score: 96, previousRank: 2 }, { name: "Queens College", score: 94, previousRank: 1 }, { name: "Federal Govt College Abuja", score: 92, previousRank: 3 }, { name: "Loyola Jesuit Abuja", score: 90, previousRank: 5 }, { name: "British Nigerian Academy", score: 89, previousRank: 4 }, { name: "Chrisland Schools", score: 87, previousRank: 7 }, { name: "Greensprings School", score: 85, previousRank: 6 }, { name: "Atlantic Hall", score: 83, previousRank: 8 }] }, null, 2),
  quote_card: JSON.stringify({ title: "What Parents Say", quote: "SchoolRegistry completely transformed how we found the right school for our children.", author: "Mrs. Adebayo", role: "Parent, Lagos", stat: { value: "4.8/5", label: "Average Parent Rating" }, sourceLabel: "SchoolRegistry.ng" }, null, 2),
  map_viz: JSON.stringify({ title: "School Density by State", subtitle: "Number of verified schools", sourceLabel: "SchoolRegistry.ng", valueSuffix: " schools", states: [{ name: "Lagos", value: 2800 }, { name: "Oyo", value: 1200 }, { name: "Rivers", value: 950 }, { name: "FCT", value: 880 }, { name: "Kano", value: 1100 }, { name: "Kaduna", value: 750 }, { name: "Ogun", value: 680 }, { name: "Enugu", value: 520 }] }, null, 2),
  scatter_race: JSON.stringify({ title: "Schools: Enrollment vs Pass Rate", subtitle: "Bubble size = Student count", sourceLabel: "SchoolRegistry.ng", xLabel: "Enrollment", yLabel: "Pass Rate (%)", timeLabels: ["2020", "2022", "2024"], bubbles: [{ label: "Lagos Model", snapshots: [{ x: 800, y: 72, size: 80 }, { x: 1200, y: 78, size: 120 }, { x: 1800, y: 85, size: 180 }], color: "#3B82F6" }, { label: "Queens College", snapshots: [{ x: 600, y: 80, size: 60 }, { x: 900, y: 85, size: 90 }, { x: 1200, y: 92, size: 120 }], color: "#10B981" }] }, null, 2),
  waterfall: JSON.stringify({ title: "Revenue Breakdown Q1 2026", subtitle: "Sources of growth and costs", sourceLabel: "SchoolRegistry.ng", valuePrefix: "N", valueSuffix: "K", items: [{ label: "Starting", value: 5000, type: "total" }, { label: "New Subs", value: 3200, type: "increase" }, { label: "Upgrades", value: 1500, type: "increase" }, { label: "Ads", value: 800, type: "increase" }, { label: "Refunds", value: -400, type: "decrease" }, { label: "Hosting", value: -1200, type: "decrease" }, { label: "Salaries", value: -2800, type: "decrease" }, { label: "Ending", value: 0, type: "total" }] }, null, 2),
  radar_chart: JSON.stringify({ title: "School Performance Radar", subtitle: "Multi-dimensional comparison", sourceLabel: "SchoolRegistry.ng", maxValue: 100, dimensions: ["Academics", "Facilities", "Sports", "Arts", "Tech", "Community"], entries: [{ name: "Kings College", values: [92, 78, 85, 70, 88, 75], color: "#3B82F6" }, { name: "Queens College", values: [88, 82, 72, 85, 76, 90], color: "#EF4444" }] }, null, 2),
  tier_list: JSON.stringify({ title: "Lagos Schools Tier Ranking", subtitle: "Based on 2024 WAEC results", sourceLabel: "SchoolRegistry.ng", tiers: [{ tier: "S", color: "#FF7F7F", items: [{ name: "Kings College", score: 96 }, { name: "Queens College", score: 94 }] }, { tier: "A", color: "#FFBF7F", items: [{ name: "FGC Abuja", score: 92 }, { name: "Loyola Jesuit", score: 90 }] }, { tier: "B", color: "#FFDF7F", items: [{ name: "British Nigerian Academy", score: 89 }, { name: "Chrisland", score: 87 }] }, { tier: "C", color: "#FFFF7F", items: [{ name: "Greensprings", score: 85 }, { name: "Atlantic Hall", score: 83 }] }] }, null, 2),
  tournament_bracket: JSON.stringify({ title: "Top 8 Schools Showdown", subtitle: "Who takes the crown?", sourceLabel: "SchoolRegistry.ng", champion: "Kings College", rounds: [{ name: "Quarter Finals", matches: [{ a: { name: "Kings College", score: 96 }, b: { name: "Atlantic Hall", score: 83 } }, { a: { name: "Queens College", score: 94 }, b: { name: "Greensprings", score: 85 } }, { a: { name: "FGC Abuja", score: 92 }, b: { name: "Chrisland", score: 87 } }, { a: { name: "Loyola Jesuit", score: 90 }, b: { name: "BNA", score: 89 } }] }, { name: "Semi Finals", matches: [{ a: { name: "Kings College", score: 96 }, b: { name: "Queens College", score: 94 } }, { a: { name: "FGC Abuja", score: 92 }, b: { name: "Loyola Jesuit", score: 90 } }] }, { name: "Final", matches: [{ a: { name: "Kings College", score: 96 }, b: { name: "FGC Abuja", score: 92 } }] }] }, null, 2),
  school_matrix: JSON.stringify({ title: "Schools: Fees vs Pass Rate", subtitle: "Price-quality matrix", sourceLabel: "SchoolRegistry.ng", xLabel: "Annual Fees (NGN '000)", yLabel: "WAEC Pass Rate (%)", quadrants: { topLeft: "High Value", topRight: "Premium", bottomLeft: "Budget", bottomRight: "Overpriced" }, schools: [{ name: "Kings College", x: 150, y: 96, size: 30, color: "#3B82F6" }, { name: "Queens College", x: 120, y: 94, size: 25 }, { name: "Loyola Jesuit", x: 800, y: 90, size: 20, color: "#F59E0B" }, { name: "BNA", x: 1200, y: 89, size: 18, color: "#8B5CF6" }, { name: "Greensprings", x: 900, y: 85, size: 22, color: "#10B981" }, { name: "Public School A", x: 50, y: 55, size: 35, color: "#EF4444" }] }, null, 2),
  stacked_ranking: JSON.stringify({ title: "Schools Ranked by Combined Score", subtitle: "Across 4 key metrics", sourceLabel: "SchoolRegistry.ng", categories: ["Academics", "Facilities", "Sports", "Arts"], entries: [{ name: "Kings College", scores: [96, 78, 85, 70] }, { name: "Queens College", scores: [94, 82, 72, 85] }, { name: "FGC Abuja", scores: [92, 80, 68, 75] }, { name: "Loyola Jesuit", scores: [90, 88, 65, 72] }, { name: "Chrisland", scores: [87, 75, 80, 68] }, { name: "Greensprings", scores: [85, 85, 78, 65] }] }, null, 2),
  progress_grid: JSON.stringify({ title: "3 Schools: 5 Metrics Compared", subtitle: "Side-by-side performance", sourceLabel: "SchoolRegistry.ng", maxValue: 100, valueSuffix: "%", metricLabels: ["Pass Rate", "Attendance", "Satisfaction", "Facilities", "Tech"], schools: [{ name: "Kings College", metrics: [96, 88, 82, 78, 85], color: "#3B82F6" }, { name: "Queens College", metrics: [94, 90, 85, 82, 76], color: "#EF4444" }, { name: "FGC Abuja", metrics: [92, 85, 80, 80, 72], color: "#10B981" }] }, null, 2),
  // ── New CDL / Advanced templates ──
  column_race: JSON.stringify({ title: "CDL School Types by Capacity", subtitle: "Total training capacity comparison", sourceLabel: "CDLSchoolsUSA.com", valueSuffix: " slots", data: [{ name: "Private School", value: 450, color: "#3B82F6" }, { name: "Community College", value: 320, color: "#10B981" }, { name: "Company Sponsored", value: 280, color: "#EF4444" }, { name: "Trade School", value: 190, color: "#F59E0B" }] }, null, 2),
  treemap: JSON.stringify({ title: "CDL School Category Breakdown", subtitle: "By type and state", sourceLabel: "CDLSchoolsUSA.com", data: { name: "Schools", children: [{ name: "Private", children: [{ name: "Texas", value: 120 }, { name: "California", value: 95 }, { name: "Florida", value: 80 }, { name: "Other", value: 155 }] }, { name: "Community", children: [{ name: "Texas", value: 80 }, { name: "California", value: 75 }, { name: "Florida", value: 60 }, { name: "Other", value: 105 }] }, { name: "Company", children: [{ name: "Texas", value: 60 }, { name: "California", value: 55 }, { name: "Florida", value: 50 }, { name: "Other", value: 35 }] }, { name: "Trade", children: [{ name: "Texas", value: 60 }, { name: "California", value: 55 }, { name: "Florida", value: 50 }, { name: "Other", value: 35 }] }] } }, null, 2),
  box_plot: JSON.stringify({ title: "CDL Tuition Distribution", subtitle: "By school type with outliers", sourceLabel: "CDLSchoolsUSA.com", valuePrefix: "$", data: [{ type: "Private", min: 3000, q1: 4500, median: 6000, q3: 7500, max: 10000, outliers: [12000, 15000] }, { type: "Community", min: 1500, q1: 2500, median: 3500, q3: 4500, max: 6000, outliers: [] }, { type: "Company", min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [5000, 7000] }] }, null, 2),
  parliament: JSON.stringify({ title: "FMCSA Verification Status", subtitle: "US CDL school verification rates", sourceLabel: "CDLSchoolsUSA.com", data: { verified: 850, unverified: 150 } }, null, 2),
  bubble_chart: JSON.stringify({ title: "CDL Schools: Cost vs Outcomes", subtitle: "Bubble size = enrollment", sourceLabel: "CDLSchoolsUSA.com", xLabel: "Tuition Cost ($)", yLabel: "Job Placement Rate (%)", data: [{ name: "Elite CDL Academy", tuition: 8000, hours: 200, placement: 95, enrollment: 450, type: "private" }, { name: "Community College CDL", tuition: 3500, hours: 240, placement: 88, enrollment: 320, type: "community" }, { name: "Swift Academy", tuition: 0, hours: 120, placement: 100, enrollment: 800, type: "company" }, { name: "Metro Truck School", tuition: 5500, hours: 160, placement: 82, enrollment: 280, type: "private" }, { name: "State Tech Institute", tuition: 4200, hours: 280, placement: 91, enrollment: 190, type: "community" }, { name: "Werner Training", tuition: 0, hours: 100, placement: 98, enrollment: 650, type: "company" }] }, null, 2),
  choropleth: JSON.stringify({ title: "CDL Schools by State", subtitle: "State-level density heatmap", sourceLabel: "CDLSchoolsUSA.com", valueSuffix: " schools", data: [{ state: "TX", value: 320 }, { state: "CA", value: 280 }, { state: "FL", value: 240 }, { state: "NY", value: 180 }, { state: "IL", value: 160 }, { state: "PA", value: 150 }, { state: "OH", value: 140 }, { state: "GA", value: 130 }, { state: "NC", value: 110 }, { state: "MI", value: 95 }, { state: "NJ", value: 85 }, { state: "VA", value: 78 }, { state: "IN", value: 72 }, { state: "TN", value: 68 }, { state: "MO", value: 62 }] }, null, 2),
  beeswarm: JSON.stringify({ title: "School Quality Distribution", subtitle: "Individual school positioning", sourceLabel: "CDLSchoolsUSA.com", xLabel: "Quality Score", data: Array.from({ length: 30 }, (_, i) => ({ name: `School ${i + 1}`, value: 20 + Math.round(Math.random() * 80), category: ["A", "B", "C"][i % 3], size: 6 + Math.round(Math.random() * 8) })) }, null, 2),
  route_map: JSON.stringify({ title: "CDL Training Route Coverage", subtitle: "School bus routes and student flow", sourceLabel: "CDLSchoolsUSA.com", routes: [{ from: { name: "Phoenix, AZ", x: -112, y: 33.4 }, to: { name: "Dallas, TX", x: -96.8, y: 32.8 }, color: "#64ffda" }, { from: { name: "Detroit, MI", x: -83, y: 42.3 }, to: { name: "Chicago, IL", x: -87.6, y: 41.9 }, color: "#ff6b6b" }, { from: { name: "Sacramento, CA", x: -121.5, y: 38.6 }, to: { name: "Orlando, FL", x: -81.4, y: 28.5 }, color: "#ffd93d" }] }, null, 2),
  card_slider: JSON.stringify({ title: "Featured CDL Schools", subtitle: "Top-rated training programs", sourceLabel: "CDLSchoolsUSA.com", cards: [{ name: "Southwest Trucking Academy", location: "Phoenix, AZ", type: "FMCSA Verified", rating: 4.8, tuition: "$4,500", duration: "4 weeks", placement: "94%" }, { name: "Great Lakes CDL Training", location: "Detroit, MI", type: "Premium Partner", rating: 4.9, tuition: "$5,200", duration: "6 weeks", placement: "96%" }, { name: "Pacific Coast Truck Driving", location: "Sacramento, CA", type: "FMCSA Verified", rating: 4.7, tuition: "$6,800", duration: "8 weeks", placement: "92%" }, { name: "Lone Star CDL Institute", location: "Dallas, TX", type: "Company Sponsored", rating: 4.6, tuition: "$0*", duration: "3 weeks", placement: "98%" }, { name: "Florida Trucking Institute", location: "Orlando, FL", type: "FMCSA Verified", rating: 4.5, tuition: "$3,900", duration: "5 weeks", placement: "89%" }] }, null, 2),
  dual_race_line: JSON.stringify({ title: "CDL Market: Rankings + Growth", subtitle: "Top schools vs total market trend", sourceLabel: "CDLSchoolsUSA.com", valueSuffix: " schools", raceData: [{ name: "Texas", value: 320 }, { name: "California", value: 280 }, { name: "Florida", value: 240 }, { name: "New York", value: 180 }, { name: "Illinois", value: 160 }, { name: "Pennsylvania", value: 150 }], lineData: [{ year: 2020, total: 1200 }, { year: 2021, total: 1450 }, { year: 2022, total: 1680 }, { year: 2023, total: 1920 }, { year: 2024, total: 2200 }] }, null, 2),
  point_map: JSON.stringify({ title: "CDL School Locations", subtitle: "Interactive school finder", sourceLabel: "CDLSchoolsUSA.com", points: [{ name: "Southwest Trucking Academy", lat: 33.45, lng: -112.07, type: "verified", city: "Phoenix, AZ" }, { name: "Great Lakes CDL Training", lat: 42.33, lng: -83.05, type: "premium", city: "Detroit, MI" }, { name: "Pacific Coast Truck Driving", lat: 38.58, lng: -121.49, type: "verified", city: "Sacramento, CA" }, { name: "Lone Star CDL School", lat: 32.78, lng: -96.80, type: "premium", city: "Dallas, TX" }, { name: "Florida Trucking Institute", lat: 28.54, lng: -81.38, type: "verified", city: "Orlando, FL" }] }, null, 2),
  story_slider: JSON.stringify({ title: "Your CDL Journey", subtitle: "3 steps to your commercial license", sourceLabel: "CDLSchoolsUSA.com", steps: [{ title: "Choose Your Path", description: "Decide between Class A, B, or C license based on your career goals. Class A offers the highest earning potential with average salaries of $65K+.", stat: { value: "65%", label: "Choose Class A" } }, { title: "Verify Your School", description: "Only FMCSA-registered schools can legally provide ELDT training. Use our verification tool to ensure compliance.", stat: { value: "85%", label: "Verified Schools" } }, { title: "Compare Costs", description: "Factor in tuition, duration, and job placement rates. Company-sponsored programs offer $0 upfront costs.", stat: { value: "$0-$8K", label: "Cost Range" } }] }, null, 2),
  // ── Advanced Templates Sample Data ──
  line_chart_race: JSON.stringify({ title: "State Ranking Trajectories", subtitle: "CDL school count by state over time", sourceLabel: "CDLSchoolsUSA.com", data: [{ state: "Texas", values: [{ year: 2020, value: 180 }, { year: 2021, value: 210 }, { year: 2022, value: 250 }, { year: 2023, value: 290 }, { year: 2024, value: 320 }] }, { state: "California", values: [{ year: 2020, value: 200 }, { year: 2021, value: 220 }, { year: 2022, value: 245 }, { year: 2023, value: 265 }, { year: 2024, value: 280 }] }, { state: "Florida", values: [{ year: 2020, value: 120 }, { year: 2021, value: 155 }, { year: 2022, value: 190 }, { year: 2023, value: 218 }, { year: 2024, value: 240 }] }, { state: "New York", values: [{ year: 2020, value: 150 }, { year: 2021, value: 160 }, { year: 2022, value: 168 }, { year: 2023, value: 175 }, { year: 2024, value: 180 }] }, { state: "Illinois", values: [{ year: 2020, value: 130 }, { year: 2021, value: 138 }, { year: 2022, value: 145 }, { year: 2023, value: 152 }, { year: 2024, value: 160 }] }] }, null, 2),
  area_race: JSON.stringify({ title: "School Type Market Share", subtitle: "Cumulative enrollment by school type", sourceLabel: "CDLSchoolsUSA.com", years: [2020, 2021, 2022, 2023, 2024], series: [{ label: "Private", values: [180, 210, 240, 265, 290], color: "#64ffda" }, { label: "Community", values: [150, 165, 180, 200, 220], color: "#ff6b6b" }, { label: "Company", values: [100, 130, 155, 180, 210], color: "#ffd93d" }, { label: "Trade", values: [80, 88, 95, 105, 115], color: "#a78bfa" }] }, null, 2),
  forecast_line: JSON.stringify({ title: "CDL Market Growth Forecast", subtitle: "Historical + AI-projected through 2028", sourceLabel: "CDLSchoolsUSA.com", historical: [{ year: 2020, value: 1200 }, { year: 2021, value: 1400 }, { year: 2022, value: 1650 }, { year: 2023, value: 1900 }, { year: 2024, value: 2200 }], forecast: [{ year: 2025, value: 2450, low: 2200, high: 2700 }, { year: 2026, value: 2700, low: 2350, high: 3050 }, { year: 2027, value: 2950, low: 2500, high: 3400 }, { year: 2028, value: 3200, low: 2650, high: 3750 }] }, null, 2),
  slope_chart: JSON.stringify({ title: "2020 vs 2024 State Comparison", subtitle: "School count change by state", sourceLabel: "CDLSchoolsUSA.com", startYear: "2020", endYear: "2024", data: [{ state: "Texas", start: 180, end: 320 }, { state: "California", start: 200, end: 280 }, { state: "Florida", start: 120, end: 240 }, { state: "New York", start: 150, end: 180 }, { state: "Illinois", start: 130, end: 160 }, { state: "Pennsylvania", start: 110, end: 150 }, { state: "Ohio", start: 100, end: 140 }, { state: "Georgia", start: 85, end: 130 }] }, null, 2),
  packed_bubble: JSON.stringify({ title: "CDL Schools by State", subtitle: "Bubble size = number of schools", sourceLabel: "CDLSchoolsUSA.com", data: [{ name: "Texas", value: 320 }, { name: "California", value: 280 }, { name: "Florida", value: 240 }, { name: "New York", value: 180 }, { name: "Illinois", value: 160 }, { name: "Pennsylvania", value: 150 }, { name: "Ohio", value: 140 }, { name: "Georgia", value: 130 }] }, null, 2),
  word_cloud: JSON.stringify({ title: "Most Common School Features", subtitle: "Weighted by frequency in reviews", sourceLabel: "CDLSchoolsUSA.com", words: [{ text: "Job Placement", size: 50 }, { text: "Financial Aid", size: 42 }, { text: "FMCSA Verified", size: 48 }, { text: "Weekend Classes", size: 35 }, { text: "CDL Training", size: 55 }, { text: "Class A License", size: 45 }, { text: "Truck Simulator", size: 30 }, { text: "Housing", size: 25 }, { text: "Career Services", size: 38 }, { text: "Flexible Hours", size: 28 }, { text: "Veteran Friendly", size: 32 }, { text: "ELDT Certified", size: 40 }] }, null, 2),
  pictogram: JSON.stringify({ title: "Schools by State", subtitle: "Each icon represents 50 schools", sourceLabel: "CDLSchoolsUSA.com", icon: "\u{1F69B}", scale: 50, data: [{ state: "Texas", count: 320 }, { state: "California", count: 280 }, { state: "Florida", count: 240 }, { state: "New York", count: 180 }, { state: "Illinois", count: 160 }, { state: "Pennsylvania", count: 150 }, { state: "Ohio", count: 140 }, { state: "Georgia", count: 130 }] }, null, 2),
  nightingale_rose: JSON.stringify({ title: "Seasonal Enrollment Patterns", subtitle: "Monthly new student enrollment 2024", sourceLabel: "CDLSchoolsUSA.com", data: [{ month: "Jan", value: 65 }, { month: "Feb", value: 72 }, { month: "Mar", value: 85 }, { month: "Apr", value: 92 }, { month: "May", value: 110 }, { month: "Jun", value: 120 }, { month: "Jul", value: 105 }, { month: "Aug", value: 115 }, { month: "Sep", value: 130 }, { month: "Oct", value: 95 }, { month: "Nov", value: 78 }, { month: "Dec", value: 55 }] }, null, 2),
  radar_compare: JSON.stringify({ title: "School Type Comparison", subtitle: "6-dimensional performance radar", sourceLabel: "CDLSchoolsUSA.com", maxValue: 10, dimensions: ["Cost Efficiency", "Training Speed", "Quality", "Job Placement", "Facilities", "Flexibility"], entries: [{ name: "Private", values: [6, 7, 9, 8, 9, 7], color: "#64ffda" }, { name: "Community", values: [9, 5, 7, 7, 6, 8], color: "#ff6b6b" }, { name: "Company", values: [10, 9, 6, 10, 5, 4], color: "#ffd93d" }] }, null, 2),
  grouped_bar: JSON.stringify({ title: "Tuition by State & Type", subtitle: "Average tuition comparison", sourceLabel: "CDLSchoolsUSA.com", valuePrefix: "$", data: [{ state: "Texas", values: [{ type: "Private", value: 5500 }, { type: "Community", value: 3200 }, { type: "Trade", value: 4100 }] }, { state: "California", values: [{ type: "Private", value: 6800 }, { type: "Community", value: 3800 }, { type: "Trade", value: 4500 }] }, { state: "Florida", values: [{ type: "Private", value: 5200 }, { type: "Community", value: 2900 }, { type: "Trade", value: 3800 }] }, { state: "New York", values: [{ type: "Private", value: 7200 }, { type: "Community", value: 4100 }, { type: "Trade", value: 5200 }] }, { state: "Illinois", values: [{ type: "Private", value: 5800 }, { type: "Community", value: 3500 }, { type: "Trade", value: 4300 }] }] }, null, 2),
  lollipop: JSON.stringify({ title: "Top Schools by Job Placement", subtitle: "Verified placement rates", sourceLabel: "CDLSchoolsUSA.com", valueSuffix: "%", data: [{ name: "Swift Academy", value: 98.5 }, { name: "Werner Training", value: 97.2 }, { name: "Elite CDL Academy", value: 95.8 }, { name: "Great Lakes CDL", value: 94.1 }, { name: "Pacific Coast", value: 93.5 }, { name: "Lone Star Institute", value: 92.8 }, { name: "State Tech", value: 91.4 }, { name: "Metro Truck School", value: 90.2 }, { name: "Sunshine CDL", value: 89.7 }, { name: "Heartland Training", value: 88.3 }] }, null, 2),
  dot_plot: JSON.stringify({ title: "Tuition Range Distribution", subtitle: "Min, median, and max by school type", sourceLabel: "CDLSchoolsUSA.com", valuePrefix: "$", data: [{ type: "Private", min: 3000, median: 6000, max: 10000, outliers: [12000, 15000] }, { type: "Community", min: 1500, median: 3500, max: 6000, outliers: [] }, { type: "Company", min: 0, median: 0, max: 0, outliers: [5000] }, { type: "Trade", min: 2500, median: 4200, max: 7000, outliers: [9000] }] }, null, 2),
  sankey: JSON.stringify({ title: "Student Journey Flow", subtitle: "School type to carrier to job region", sourceLabel: "CDLSchoolsUSA.com", nodes: [{ name: "Private School" }, { name: "Community College" }, { name: "Company Training" }, { name: "Swift" }, { name: "Werner" }, { name: "Schneider" }, { name: "Other" }, { name: "Local" }, { name: "Regional" }, { name: "OTR" }], links: [{ source: 0, target: 3, value: 30 }, { source: 0, target: 4, value: 25 }, { source: 1, target: 3, value: 20 }, { source: 1, target: 5, value: 15 }, { source: 2, target: 3, value: 40 }, { source: 2, target: 6, value: 10 }, { source: 3, target: 7, value: 20 }, { source: 3, target: 8, value: 30 }, { source: 3, target: 9, value: 20 }, { source: 4, target: 8, value: 25 }, { source: 5, target: 9, value: 15 }] }, null, 2),
  bullet_chart: JSON.stringify({ title: "FMCSA Verification by State", subtitle: "Actual vs target compliance rates", sourceLabel: "CDLSchoolsUSA.com", valueSuffix: "%", data: [{ state: "Texas", actual: 92, target: 85, ranges: [50, 75, 100] }, { state: "California", actual: 88, target: 85, ranges: [50, 75, 100] }, { state: "Florida", actual: 78, target: 85, ranges: [50, 75, 100] }, { state: "New York", actual: 95, target: 85, ranges: [50, 75, 100] }, { state: "Illinois", actual: 82, target: 85, ranges: [50, 75, 100] }, { state: "Pennsylvania", actual: 73, target: 85, ranges: [50, 75, 100] }, { state: "Ohio", actual: 86, target: 85, ranges: [50, 75, 100] }, { state: "Georgia", actual: 69, target: 85, ranges: [50, 75, 100] }] }, null, 2),
  heatmap_matrix: JSON.stringify({ title: "School Density Matrix", subtitle: "State x Type distribution", sourceLabel: "CDLSchoolsUSA.com", states: ["Texas", "California", "Florida", "New York", "Illinois", "Pennsylvania", "Ohio", "Georgia"], types: ["Private", "Community", "Company", "Trade"], data: [{ state: "Texas", type: "Private", value: 120 }, { state: "Texas", type: "Community", value: 80 }, { state: "Texas", type: "Company", value: 60 }, { state: "Texas", type: "Trade", value: 60 }, { state: "California", type: "Private", value: 95 }, { state: "California", type: "Community", value: 75 }, { state: "California", type: "Company", value: 55 }, { state: "California", type: "Trade", value: 55 }, { state: "Florida", type: "Private", value: 80 }, { state: "Florida", type: "Community", value: 60 }, { state: "Florida", type: "Company", value: 50 }, { state: "Florida", type: "Trade", value: 50 }, { state: "New York", type: "Private", value: 70 }, { state: "New York", type: "Community", value: 50 }, { state: "New York", type: "Company", value: 30 }, { state: "New York", type: "Trade", value: 30 }, { state: "Illinois", type: "Private", value: 55 }, { state: "Illinois", type: "Community", value: 45 }, { state: "Illinois", type: "Company", value: 30 }, { state: "Illinois", type: "Trade", value: 30 }, { state: "Pennsylvania", type: "Private", value: 50 }, { state: "Pennsylvania", type: "Community", value: 40 }, { state: "Pennsylvania", type: "Company", value: 30 }, { state: "Pennsylvania", type: "Trade", value: 30 }, { state: "Ohio", type: "Private", value: 48 }, { state: "Ohio", type: "Community", value: 38 }, { state: "Ohio", type: "Company", value: 28 }, { state: "Ohio", type: "Trade", value: 26 }, { state: "Georgia", type: "Private", value: 45 }, { state: "Georgia", type: "Community", value: 35 }, { state: "Georgia", type: "Company", value: 25 }, { state: "Georgia", type: "Trade", value: 25 }] }, null, 2),
};

const STEPS = [
  { id: "template", label: "Template", icon: Layers },
  { id: "data", label: "Data", icon: Database },
  { id: "style", label: "Style", icon: Palette },
  { id: "preview", label: "Preview", icon: Play },
] as const;

const CATEGORIES = ["Comparison", "Rankings", "Trends", "Distribution", "Maps", "Highlights", "Narrative"];

export default function DataStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("line_race");
  const [selectedBrand, setSelectedBrand] = useState("schoolregistry");
  const [customColors, setCustomColors] = useState<BrandColors>(BRAND_PRESETS.custom);
  const [dataJson, setDataJson] = useState(SAMPLE_DATA.line_race);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState<"template" | "data" | "style" | "preview">("template");
  const [dataInputMode, setDataInputMode] = useState<"json" | "natural">("json");
  const [naturalText, setNaturalText] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "1:1" | "9:16">("16:9");
  const [aiParsing, setAiParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [suggestedTemplate, setSuggestedTemplate] = useState<TemplateType | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showQuickGenerate, setShowQuickGenerate] = useState(false);
  const [quickData, setQuickData] = useState("");
  const [quickAnalysis, setQuickAnalysis] = useState<{ template: TemplateType; confidence: string; reason: string } | null>(null);

  const brandColors = selectedBrand === "custom" ? customColors : BRAND_PRESETS[selectedBrand];

  const parseNaturalLanguage = async (text: string) => {
    if (!text.trim()) return;
    setAiParsing(true); setParseError(null); setParseSuccess(false); setSuggestedTemplate(null);
    try {
      const res = await fetch("/api/parse-data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, template: selectedTemplate }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to parse");
      setDataJson(JSON.stringify(json.data, null, 2));
      setParseSuccess(true);
      if (json.suggestedTemplate && json.suggestedTemplate !== selectedTemplate) {
        const valid = TEMPLATES.map(t => t.id);
        if (valid.includes(json.suggestedTemplate)) setSuggestedTemplate(json.suggestedTemplate);
      }
    } catch (err: any) { setParseError(err.message || "AI parsing failed."); } finally { setAiParsing(false); }
  };

  const applySuggestedTemplate = () => { if (suggestedTemplate) { setSelectedTemplate(suggestedTemplate); setSuggestedTemplate(null); parseNaturalLanguage(naturalText); } };

  const analyzeQuickData = (text: string) => {
    if (!text.trim()) { setQuickAnalysis(null); return; }
    const lines = text.trim().split("\n").filter(l => l.trim());
    const hasCommas = lines.some(l => l.includes(","));
    const hasTabs = lines.some(l => l.includes("\t"));
    const sep = hasTabs ? "\t" : hasCommas ? "," : null;

    if (!sep && lines.length < 2) { setQuickAnalysis(null); return; }

    // Parse CSV/TSV
    const rows = lines.map(l => l.split(sep || ",").map(c => c.trim().replace(/^"|"$/g, "")));
    const headers = rows[0] || [];
    const dataRows = rows.slice(1);
    const numCols = headers.length;
    const numRows = dataRows.length;

    // Detect column types
    const colTypes = headers.map((_, ci) => {
      const vals = dataRows.map(r => r[ci] || "");
      const numericCount = vals.filter(v => !isNaN(Number(v)) && v !== "").length;
      const yearLike = vals.filter(v => /^20\d{2}$/.test(v)).length;
      if (yearLike > vals.length * 0.5) return "year";
      if (numericCount > vals.length * 0.6) return "numeric";
      return "text";
    });

    const numericCols = colTypes.filter(t => t === "numeric").length;
    const textCols = colTypes.filter(t => t === "text").length;
    const hasYears = colTypes.includes("year") || headers.some(h => /year|date|time/i.test(h));
    const hasMultipleTimeCols = headers.filter(h => /20\d{2}/.test(h)).length >= 2;

    let template: TemplateType = "bar_race";
    let confidence = "Medium";
    let reason = "";

    if (hasMultipleTimeCols && numRows >= 3) {
      template = "line_chart_race"; confidence = "High"; reason = "Time-series data with multiple years → trajectory visualization";
    } else if (hasYears && numericCols >= 2) {
      template = "forecast_line"; confidence = "High"; reason = "Year-based data with values → trend/forecast chart";
    } else if (numCols === 3 && textCols === 1 && numericCols === 2) {
      template = "slope_chart"; confidence = "High"; reason = "Two value columns per category → before/after comparison";
    } else if (numCols === 2 && textCols === 1 && numericCols === 1 && numRows > 5) {
      template = "lollipop"; confidence = "High"; reason = "Category + value pairs → ranked display";
    } else if (numCols === 2 && textCols === 1 && numericCols === 1) {
      template = "column_race"; confidence = "Medium"; reason = "Category + value pairs → bar comparison";
    } else if (numericCols >= 3 && textCols === 1) {
      template = "radar_compare"; confidence = "Medium"; reason = "Multi-dimensional numeric data → radar comparison";
    } else if (numCols >= 3 && textCols >= 2 && numericCols >= 1) {
      template = "heatmap_matrix"; confidence = "Medium"; reason = "Cross-category data → density matrix";
    } else if (textCols >= 1 && numericCols >= 1 && numRows >= 5) {
      template = "grouped_bar"; confidence = "Medium"; reason = "Multi-category data → grouped comparison";
    } else if (numRows <= 3 && numericCols >= 1) {
      template = "stat_counter"; confidence = "Low"; reason = "Small dataset → highlight key numbers";
    }

    setQuickAnalysis({ template, confidence, reason });
  };

  const applyQuickGenerate = () => {
    if (!quickAnalysis || !quickData.trim()) return;
    const template = quickAnalysis.template;
    setSelectedTemplate(template);
    setDataJson(SAMPLE_DATA[template]);
    setNaturalText(quickData);
    setDataInputMode("natural");
    setShowQuickGenerate(false);
    setStep("data");
  };

  const handleExportMP4 = async () => {
    if (!parsedData) return;
    setIsRendering(true); setRenderProgress("Connecting to render service...");
    try {
      const res = await fetch("/api/render-video", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ template: selectedTemplate, data: parsedData, brand: brandColors.name, colors: brandColors, aspectRatio }) });
      if (!res.ok) { const e = await res.json().catch(() => ({ error: "Render service unavailable" })); throw new Error(e.error || "Render failed"); }
      setRenderProgress("Downloading...");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `data-studio-${selectedTemplate}-${aspectRatio.replace(":", "x")}.mp4`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      setRenderProgress("Done!"); setTimeout(() => setRenderProgress(null), 3000);
    } catch (err: any) { setRenderProgress(null); alert(err.message); } finally { setIsRendering(false); }
  };

  const handlePublishAll = async () => {
    if (!parsedData) return;
    setIsPublishing(true); setPublishResult(null);
    try {
      const postCaption = caption || parsedData.title || `Check out this visualization!`;
      const res = await fetch("/api/social-publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ template: selectedTemplate, data: parsedData, brand: brandColors.name, colors: brandColors, aspectRatio: aspectRatio === "16:9" ? "16:9" : "1:1", caption: postCaption, platforms: ["facebook", "instagram", "linkedin", "x"] }) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Publish failed");
      setPublishResult(result.message || "Published!"); setTimeout(() => setPublishResult(null), 5000);
    } catch (err: any) { setPublishResult(null); alert(err.message); } finally { setIsPublishing(false); }
  };

  const parsedData = useMemo(() => { try { return JSON.parse(dataJson); } catch { return null; } }, [dataJson]);
  const stepIndex = STEPS.findIndex(s => s.id === step);
  const canGoNext = stepIndex < STEPS.length - 1;
  const canGoPrev = stepIndex > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="data-studio-title">Data Studio</h1>
        <p className="text-muted-foreground text-sm">Create animated data visualization videos — {TEMPLATES.length} templates available</p>
      </div>

      {/* Quick Generate Button */}
      <div className="flex gap-3 items-center" data-testid="quick-generate-section">
        <Button
          variant={showQuickGenerate ? "default" : "outline"}
          size="sm"
          onClick={() => setShowQuickGenerate(!showQuickGenerate)}
          className={showQuickGenerate ? "" : "border-dashed border-2 hover:border-primary"}
          data-testid="quick-generate-toggle"
        >
          <Zap className="h-4 w-4 mr-1.5" />Quick Generate
        </Button>
        {!showQuickGenerate && <span className="text-xs text-muted-foreground">Paste CSV or text data — AI picks the best template</span>}
      </div>

      {/* Quick Generate Panel */}
      {showQuickGenerate && (
        <Card data-testid="quick-generate-panel">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Quick Generate</CardTitle>
            </div>
            <CardDescription>Paste your CSV, tab-separated, or text data below. We'll analyze the structure and recommend the best visualization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={quickData}
              onChange={(e) => { setQuickData(e.target.value); analyzeQuickData(e.target.value); }}
              className="font-mono text-xs min-h-[140px]"
              placeholder={"State,2020,2024\nTexas,180,320\nCalifornia,200,280\nFlorida,120,240\nNew York,150,180"}
              data-testid="quick-generate-input"
            />
            {quickAnalysis && (
              <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg" data-testid="quick-generate-result">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{TEMPLATES.find(t => t.id === quickAnalysis.template)?.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${quickAnalysis.confidence === "High" ? "bg-green-500/20 text-green-600" : quickAnalysis.confidence === "Medium" ? "bg-yellow-500/20 text-yellow-600" : "bg-orange-500/20 text-orange-600"}`}>{quickAnalysis.confidence} confidence</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{quickAnalysis.reason}</p>
                </div>
                <Button size="sm" onClick={applyQuickGenerate} data-testid="quick-generate-apply">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />Use This
                </Button>
              </div>
            )}
            {quickData.trim() && !quickAnalysis && (
              <p className="text-xs text-muted-foreground">Add more data rows (at least 2 lines with headers) for analysis...</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2" data-testid="step-indicator">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <Button variant={step === s.id ? "default" : "outline"} size="sm" onClick={() => setStep(s.id)} data-testid={`step-${s.id}-btn`}>
              <s.icon className="h-4 w-4 mr-1.5" />{s.label}
            </Button>
            {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* Step 1: Template — Compact List */}
      {step === "template" && (
        <div className="space-y-3" data-testid="template-gallery">
          {CATEGORIES.map(category => {
            const categoryTemplates = TEMPLATES.filter(t => t.category === category);
            const isExpanded = expandedCategory === category;
            return (
              <div key={category} className="border border-border/50 rounded-lg overflow-hidden" data-testid={`category-${category.toLowerCase()}`}>
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                  data-testid={`category-toggle-${category.toLowerCase()}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{category}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{categoryTemplates.length}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </button>

                {/* Always show compact list */}
                <div className={`${isExpanded ? "" : "max-h-0 overflow-hidden"} transition-all`}>
                  <div className="border-t border-border/30">
                    {categoryTemplates.map(t => {
                      const Icon = TEMPLATE_ICONS[t.id];
                      const isSelected = selectedTemplate === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => { setSelectedTemplate(t.id); setDataJson(SAMPLE_DATA[t.id]); }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors border-b border-border/20 last:border-b-0 ${isSelected ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-muted/30"}`}
                          data-testid={`template-${t.id}`}
                        >
                          <div className={`p-1.5 rounded-md flex-shrink-0 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>{t.name}</span>
                              {isSelected && <span className="text-[9px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">SELECTED</span>}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{t.useCase}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0 hidden sm:block">{t.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground text-center pt-2">Click a category to expand, then select a template. Proceed to Data step to customize.</p>
        </div>
      )}

      {/* Step 2: Data */}
      {step === "data" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="data-editor">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" /><CardTitle className="text-base">Data Input</CardTitle></div>
              <CardDescription>Enter data as plain text (AI-parsed) or JSON</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg">
                <button onClick={() => setDataInputMode("natural")} className={`flex items-center gap-1.5 flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dataInputMode === "natural" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`} data-testid="input-mode-natural"><Sparkles className="h-3.5 w-3.5" />Plain Text (AI)</button>
                <button onClick={() => setDataInputMode("json")} className={`flex items-center gap-1.5 flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dataInputMode === "json" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`} data-testid="input-mode-json"><Database className="h-3.5 w-3.5" />JSON</button>
              </div>
              {dataInputMode === "natural" ? (
                <>
                  <Textarea value={naturalText} onChange={(e) => { setNaturalText(e.target.value); setParseSuccess(false); setParseError(null); setSuggestedTemplate(null); }} className="text-sm min-h-[300px]" placeholder={`Describe your data in plain English.\n\nExamples:\n"Texas has 320 CDL schools, California 280, Florida 240"\n"Tuition ranges from $3K-$10K for private schools"\n"85% of CDL schools are FMCSA verified"`} data-testid="natural-text-input" />
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => parseNaturalLanguage(naturalText)} disabled={aiParsing || !naturalText.trim()} data-testid="parse-text-btn"><Sparkles className="h-3.5 w-3.5 mr-1.5" />{aiParsing ? "AI Parsing..." : "Parse with AI"}</Button>
                    <Button variant="outline" size="sm" onClick={() => { setNaturalText(""); setParseError(null); setParseSuccess(false); setSuggestedTemplate(null); setDataJson(SAMPLE_DATA[selectedTemplate]); }} data-testid="clear-text-btn">Clear</Button>
                  </div>
                  {aiParsing && <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 font-medium animate-pulse"><Sparkles className="h-3.5 w-3.5" />GPT is analyzing your text...</div>}
                  {parseError && <div className="mt-3 flex items-center gap-2 text-xs text-destructive font-medium"><AlertCircle className="h-3.5 w-3.5" />{parseError}</div>}
                  {parseSuccess && !parseError && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-green-600 font-medium"><CheckCircle2 className="h-3.5 w-3.5" />Data parsed successfully</div>
                      {suggestedTemplate && (
                        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                          <span className="text-xs text-blue-700 dark:text-blue-300">AI suggests <strong>{TEMPLATES.find(t => t.id === suggestedTemplate)?.name}</strong></span>
                          <Button size="sm" variant="outline" className="h-6 text-xs ml-auto" onClick={applySuggestedTemplate}>Switch</Button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Textarea value={dataJson} onChange={(e) => setDataJson(e.target.value)} className="font-mono text-xs min-h-[350px]" placeholder="Paste JSON data here..." data-testid="data-json-input" />
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => setDataJson(SAMPLE_DATA[selectedTemplate])} data-testid="load-sample-btn">Load Sample</Button>
                    <Button variant="outline" size="sm" onClick={() => { try { setDataJson(JSON.stringify(JSON.parse(dataJson), null, 2)); } catch {} }} data-testid="format-json-btn">Format JSON</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Data Preview</CardTitle><CardDescription>Parsed data structure</CardDescription></CardHeader>
            <CardContent>
              {parsedData ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2"><div className="h-2 w-2 bg-green-500 rounded-full" /><span className="text-sm font-medium text-green-600">Valid JSON</span></div>
                  <div className="bg-muted/50 rounded-lg p-4 text-xs font-mono max-h-[350px] overflow-auto"><pre>{JSON.stringify(parsedData, null, 2)}</pre></div>
                </div>
              ) : (
                <div className="flex items-center gap-2"><div className="h-2 w-2 bg-red-500 rounded-full" /><span className="text-sm text-red-600">Invalid JSON</span></div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Style */}
      {step === "style" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="style-editor">
          <Card>
            <CardHeader><div className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /><CardTitle className="text-base">Brand Preset</CardTitle></div></CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(BRAND_PRESETS).map(([key, brand]) => (
                <div key={key} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border ${selectedBrand === key ? "ring-2 ring-primary border-primary" : "border-transparent hover:bg-muted"}`} onClick={() => setSelectedBrand(key)} data-testid={`brand-${key}`}>
                  <div className="flex gap-1">{[brand.primary, brand.secondary, brand.accent].map((c, i) => <div key={i} className="h-6 w-6 rounded-full border" style={{ backgroundColor: c }} />)}</div>
                  <span className="font-medium text-sm">{brand.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          {selectedBrand === "custom" && (
            <Card>
              <CardHeader><CardTitle className="text-base">Custom Colors</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {(["primary", "secondary", "background", "text", "accent"] as const).map(k => (
                  <div key={k} className="flex items-center gap-3">
                    <input type="color" value={customColors[k]} onChange={(e) => setCustomColors(p => ({ ...p, [k]: e.target.value }))} className="h-8 w-8 rounded cursor-pointer border-0" />
                    <div><label className="text-sm font-medium capitalize">{k}</label><Input value={customColors[k]} onChange={(e) => setCustomColors(p => ({ ...p, [k]: e.target.value }))} className="h-8 font-mono text-xs mt-1 w-32" /></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Step 4: Preview */}
      {step === "preview" && parsedData && (
        <div className="space-y-4" data-testid="preview-section">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2"><Play className="h-5 w-5 text-primary" /><CardTitle className="text-base">Live Preview</CardTitle></div>
                <div className="flex gap-2 items-center flex-wrap">
                  <div className="flex gap-1 p-0.5 bg-muted rounded-md" data-testid="aspect-ratio-selector">
                    {([["16:9", Monitor, "Landscape"], ["1:1", Square, "Square"], ["9:16", Smartphone, "Portrait"]] as const).map(([ratio, Icon, label]) => (
                      <button key={ratio} onClick={() => setAspectRatio(ratio as any)} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${aspectRatio === ratio ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`} title={label} data-testid={`aspect-${ratio.replace(":", "-")}`}><Icon className="h-3 w-3" />{ratio}</button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} data-testid="play-toggle-btn">{isPlaying ? "Pause" : "Play"}</Button>
                  <Button size="sm" onClick={handleExportMP4} disabled={isRendering} data-testid="export-mp4-btn"><Download className="h-4 w-4 mr-1" />{isRendering ? (renderProgress || "Rendering...") : "Export MP4"}</Button>
                  <Button size="sm" variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={handlePublishAll} disabled={isPublishing || isRendering} data-testid="publish-all-btn">
                    <Send className="h-4 w-4 mr-1" />{isPublishing ? "Publishing..." : "Generate & Post All"}
                  </Button>
                </div>
              </div>
              <CardDescription>{TEMPLATES.find(t => t.id === selectedTemplate)?.name} | {brandColors.name} | {aspectRatio}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`bg-black rounded-lg overflow-hidden relative mx-auto ${aspectRatio === "9:16" ? "max-w-[400px]" : aspectRatio === "1:1" ? "max-w-[600px]" : ""}`} style={{ aspectRatio: aspectRatio === "16:9" ? "16/9" : aspectRatio === "1:1" ? "1/1" : "9/16", minHeight: aspectRatio === "9:16" ? 500 : 400 }}>
                <PreviewPlayer template={selectedTemplate} data={parsedData} brand={brandColors.name} colors={brandColors} playing={isPlaying} aspectRatio={aspectRatio} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" /><CardTitle className="text-base">Post Caption</CardTitle></div>
            </CardHeader>
            <CardContent>
              <textarea className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" rows={3} placeholder={parsedData?.title ? `${parsedData.title}` : "Enter caption..."} value={caption} onChange={e => setCaption(e.target.value)} data-testid="publish-caption-input" />
              {publishResult && <div className="mt-3 flex items-center gap-2 text-sm text-green-600" data-testid="publish-result"><CheckCircle2 className="h-4 w-4" />{publishResult}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Configuration</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div><p className="text-muted-foreground text-xs">Template</p><p className="font-medium">{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</p></div>
                <div><p className="text-muted-foreground text-xs">Brand</p><p className="font-medium">{brandColors.name}</p></div>
                <div><p className="text-muted-foreground text-xs">Duration</p><p className="font-medium">10 seconds</p></div>
                <div><p className="text-muted-foreground text-xs">Aspect Ratio</p><p className="font-medium">{aspectRatio}</p></div>
                <div><p className="text-muted-foreground text-xs">Resolution</p><p className="font-medium">{aspectRatio === "16:9" ? "1920x1080" : aspectRatio === "1:1" ? "1080x1080" : "1080x1920"}</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" disabled={!canGoPrev} onClick={() => setStep(STEPS[stepIndex - 1].id)}><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
        <Button disabled={!canGoNext} onClick={() => setStep(STEPS[stepIndex + 1].id)}>Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
      </div>
    </div>
  );
}

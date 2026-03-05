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
} from "lucide-react";

type TemplateType = "line_race" | "bar_race" | "comparison_duel" | "stat_counter" | "stacked_area" | "funnel_chart" | "donut_chart" | "heatmap_grid" | "gauge" | "before_after" | "timeline" | "leaderboard" | "quote_card" | "map_viz" | "scatter_race" | "waterfall";

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

const TEMPLATES: { id: TemplateType; name: string; description: string; example: string; category: string }[] = [
  { id: "line_race", name: "Line Race", description: "Animated line chart showing trends over time", example: "WAEC Performance Lagos 2016-2025", category: "Charts" },
  { id: "bar_race", name: "Bar Race", description: "Horizontal bars reordering dynamically over time", example: "Top 10 States by WAEC Score", category: "Charts" },
  { id: "comparison_duel", name: "Comparison Duel", description: "Head-to-head split screen comparison", example: "Lagos vs Abuja: WAEC Head-to-Head", category: "Charts" },
  { id: "stat_counter", name: "Stat Counter", description: "Large animated number with context", example: "13,360+ Schools Verified", category: "Charts" },
  { id: "stacked_area", name: "Stacked Area", description: "Composition changes over time", example: "Public vs Private School Growth", category: "Charts" },
  { id: "funnel_chart", name: "Funnel Chart", description: "Conversion funnel with animated stages", example: "Website Visitors to Enrollment", category: "Analytics" },
  { id: "donut_chart", name: "Donut Chart", description: "Animated percentage breakdown with legend", example: "School Types: Public vs Private vs Mission", category: "Analytics" },
  { id: "heatmap_grid", name: "Heatmap Grid", description: "Region heatmap with color intensity", example: "Pass Rate by State and Subject", category: "Analytics" },
  { id: "gauge", name: "Gauge", description: "KPI speedometer with animated needle", example: "Platform Uptime: 99.7%", category: "Analytics" },
  { id: "before_after", name: "Before / After", description: "Side-by-side comparison with reveal animation", example: "Before vs After SchoolRegistry", category: "Story" },
  { id: "timeline", name: "Timeline", description: "Milestones appearing on animated vertical timeline", example: "Company Journey 2020-2026", category: "Story" },
  { id: "leaderboard", name: "Leaderboard", description: "Ranked list with bars and rank-change indicators", example: "Top Schools by Student Performance", category: "Story" },
  { id: "quote_card", name: "Quote Card", description: "Animated testimonial with typing effect", example: "Customer Testimonial + Stat", category: "Story" },
  { id: "map_viz", name: "Nigeria Map", description: "State-level data visualization on grid map", example: "School Density by State", category: "Advanced" },
  { id: "scatter_race", name: "Scatter Race", description: "Animated bubble chart with positions over time", example: "Schools: Enrollment vs Pass Rate", category: "Advanced" },
  { id: "waterfall", name: "Waterfall", description: "Financial-style incremental gain/loss chart", example: "Revenue Breakdown by Quarter", category: "Advanced" },
];

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
  before_after: JSON.stringify({ title: "The SchoolRegistry Effect", subtitle: "Parent experience transformation", sourceLabel: "SchoolRegistry.ng", metric: "Average school search time", before: { label: "Before", value: "3 weeks", description: "Parents visited multiple schools in person, relying on word-of-mouth", color: "#EF4444" }, after: { label: "After", value: "15 min", description: "Compare verified schools online with real data and reviews", color: "#10B981" } }, null, 2),
  timeline: JSON.stringify({ title: "SchoolRegistry Journey", subtitle: "From idea to scale", sourceLabel: "SchoolRegistry.ng", events: [{ date: "Jan 2020", title: "Founded", description: "Started with 50 schools in Lagos" }, { date: "Jun 2021", title: "1,000 Schools", description: "Expanded to 5 states" }, { date: "Mar 2023", title: "5,000 Schools", description: "Launched verification program" }, { date: "Jan 2025", title: "10,000+ Schools", description: "Nationwide coverage across 36 states" }, { date: "Mar 2026", title: "13,360 Schools", description: "AI-powered recommendations launched" }] }, null, 2),
  leaderboard: JSON.stringify({ title: "Top Schools by Performance", subtitle: "WAEC 2024 Results", sourceLabel: "SchoolRegistry.ng", scoreLabel: "Pass Rate", entries: [{ name: "Kings College Lagos", score: 96, previousRank: 2 }, { name: "Queens College", score: 94, previousRank: 1 }, { name: "Federal Govt College Abuja", score: 92, previousRank: 3 }, { name: "Loyola Jesuit Abuja", score: 90, previousRank: 5 }, { name: "British Nigerian Academy", score: 89, previousRank: 4 }, { name: "Chrisland Schools", score: 87, previousRank: 7 }, { name: "Greensprings School", score: 85, previousRank: 6 }, { name: "Atlantic Hall", score: 83, previousRank: 8 }] }, null, 2),
  quote_card: JSON.stringify({ title: "What Parents Say", quote: "SchoolRegistry completely transformed how we found the right school for our children. Within minutes, we could compare verified data across dozens of schools that would have taken us weeks to visit.", author: "Mrs. Adebayo", role: "Parent, Lagos", stat: { value: "4.8/5", label: "Average Parent Rating" }, sourceLabel: "SchoolRegistry.ng" }, null, 2),
  map_viz: JSON.stringify({ title: "School Density by State", subtitle: "Number of verified schools", sourceLabel: "SchoolRegistry.ng", valueSuffix: " schools", states: [{ name: "Lagos", value: 2800 }, { name: "Oyo", value: 1200 }, { name: "Rivers", value: 950 }, { name: "FCT", value: 880 }, { name: "Kano", value: 1100 }, { name: "Kaduna", value: 750 }, { name: "Ogun", value: 680 }, { name: "Enugu", value: 520 }, { name: "Delta", value: 480 }, { name: "Anambra", value: 460 }, { name: "Edo", value: 380 }, { name: "Ondo", value: 320 }, { name: "Osun", value: 290 }, { name: "Kwara", value: 270 }, { name: "Abia", value: 250 }] }, null, 2),
  scatter_race: JSON.stringify({ title: "Schools: Enrollment vs Pass Rate", subtitle: "Bubble size = Student count", sourceLabel: "SchoolRegistry.ng", xLabel: "Enrollment", yLabel: "Pass Rate (%)", timeLabels: ["2020", "2022", "2024"], bubbles: [{ label: "Lagos Model", snapshots: [{ x: 800, y: 72, size: 80 }, { x: 1200, y: 78, size: 120 }, { x: 1800, y: 85, size: 180 }], color: "#3B82F6" }, { label: "Queens College", snapshots: [{ x: 600, y: 80, size: 60 }, { x: 900, y: 85, size: 90 }, { x: 1200, y: 92, size: 120 }], color: "#10B981" }, { label: "Rivers Academy", snapshots: [{ x: 500, y: 55, size: 50 }, { x: 700, y: 62, size: 70 }, { x: 1100, y: 70, size: 110 }], color: "#F59E0B" }] }, null, 2),
  waterfall: JSON.stringify({ title: "Revenue Breakdown Q1 2026", subtitle: "Sources of growth and costs", sourceLabel: "SchoolRegistry.ng", valuePrefix: "N", valueSuffix: "K", items: [{ label: "Starting", value: 5000, type: "total" }, { label: "New Subs", value: 3200, type: "increase" }, { label: "Upgrades", value: 1500, type: "increase" }, { label: "Ads", value: 800, type: "increase" }, { label: "Refunds", value: -400, type: "decrease" }, { label: "Hosting", value: -1200, type: "decrease" }, { label: "Salaries", value: -2800, type: "decrease" }, { label: "Ending", value: 0, type: "total" }] }, null, 2),
};

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
};

const STEPS = [
  { id: "template", label: "Template", icon: Layers },
  { id: "data", label: "Data", icon: Database },
  { id: "style", label: "Style", icon: Palette },
  { id: "preview", label: "Preview", icon: Play },
] as const;

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

  const brandColors = selectedBrand === "custom" ? customColors : BRAND_PRESETS[selectedBrand];

  const parseNaturalLanguage = async (text: string) => {
    if (!text.trim()) return;
    setAiParsing(true);
    setParseError(null);
    setParseSuccess(false);
    setSuggestedTemplate(null);
    try {
      const res = await fetch("/api/parse-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, template: selectedTemplate }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to parse");
      setDataJson(JSON.stringify(json.data, null, 2));
      setParseSuccess(true);

      // Handle template auto-suggestion
      if (json.suggestedTemplate && json.suggestedTemplate !== selectedTemplate) {
        const valid: TemplateType[] = ["line_race", "bar_race", "comparison_duel", "stat_counter", "stacked_area", "funnel_chart", "donut_chart", "heatmap_grid", "gauge", "before_after", "timeline", "leaderboard", "quote_card", "map_viz", "scatter_race", "waterfall"];
        if (valid.includes(json.suggestedTemplate)) {
          setSuggestedTemplate(json.suggestedTemplate);
        }
      }
    } catch (err: any) {
      setParseError(err.message || "AI parsing failed. Try rephrasing your description.");
    } finally {
      setAiParsing(false);
    }
  };

  const applySuggestedTemplate = () => {
    if (suggestedTemplate) {
      setSelectedTemplate(suggestedTemplate);
      setSuggestedTemplate(null);
      // Re-parse with new template
      parseNaturalLanguage(naturalText);
    }
  };

  const handleExportMP4 = async () => {
    if (!parsedData) return;
    setIsRendering(true);
    setRenderProgress("Connecting to render service...");
    try {
      const res = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: selectedTemplate, data: parsedData, brand: brandColors.name, colors: brandColors, aspectRatio }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({ error: "Render service unavailable" }));
        throw new Error(e.error || "Render failed");
      }
      setRenderProgress("Downloading...");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `data-studio-${selectedTemplate}-${aspectRatio.replace(":", "x")}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setRenderProgress("Done!");
      setTimeout(() => setRenderProgress(null), 3000);
    } catch (err: any) {
      setRenderProgress(null);
      alert(err.message || "Export failed. Make sure the render service is running on the VPS.");
    } finally {
      setIsRendering(false);
    }
  };

  const handlePublishAll = async () => {
    if (!parsedData) return;
    setIsPublishing(true);
    setPublishResult(null);
    try {
      const postCaption = caption || parsedData.title || `Check out this ${TEMPLATES.find(t => t.id === selectedTemplate)?.name} visualization!`;
      const res = await fetch("/api/social-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: selectedTemplate,
          data: parsedData,
          brand: brandColors.name,
          colors: brandColors,
          aspectRatio: aspectRatio === "16:9" ? "16:9" : "1:1",
          caption: postCaption,
          platforms: ["facebook", "instagram", "linkedin", "x"],
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Publish failed");
      setPublishResult(result.message || "Published successfully!");
      setTimeout(() => setPublishResult(null), 5000);
    } catch (err: any) {
      setPublishResult(null);
      alert(err.message || "Publishing failed. Check social media API configuration.");
    } finally {
      setIsPublishing(false);
    }
  };

  const parsedData = useMemo(() => { try { return JSON.parse(dataJson); } catch { return null; } }, [dataJson]);

  const stepIndex = STEPS.findIndex(s => s.id === step);
  const canGoNext = stepIndex < STEPS.length - 1;
  const canGoPrev = stepIndex > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="data-studio-title">Data Studio</h1>
        <p className="text-muted-foreground">Create animated data visualization videos with AI-powered data parsing</p>
      </div>

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

      {/* Step 1: Template */}
      {step === "template" && (
        <div className="space-y-6" data-testid="template-gallery">
          {["Charts", "Analytics", "Story", "Advanced"].map(category => {
            const categoryTemplates = TEMPLATES.filter(t => t.category === category);
            return (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {categoryTemplates.map(t => {
                    const Icon = TEMPLATE_ICONS[t.id];
                    return (
                      <Card key={t.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplate === t.id ? "ring-2 ring-primary" : ""}`} onClick={() => { setSelectedTemplate(t.id); setDataJson(SAMPLE_DATA[t.id]); }} data-testid={`template-${t.id}`}>
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${selectedTemplate === t.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}><Icon className="h-4 w-4" /></div>
                            <div className="min-w-0">
                              <CardTitle className="text-sm">{t.name}</CardTitle>
                              <CardDescription className="text-xs truncate">{t.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
                  <Textarea value={naturalText} onChange={(e) => { setNaturalText(e.target.value); setParseSuccess(false); setParseError(null); setSuggestedTemplate(null); }} className="text-sm min-h-[300px]" placeholder={`Describe your data in plain English. GPT will convert it to chart-ready JSON.\n\nExamples:\n"Nigeria's population grew from 180M in 2015 to 230M in 2025"\n"Lagos: 72%, Abuja: 70%, Rivers: 67%, Kano: 64%"\n"Over 13,360 schools verified across 36 states"\n"Compare public schools (52% pass rate) vs private schools (78% pass rate)"`} data-testid="natural-text-input" />
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => parseNaturalLanguage(naturalText)} disabled={aiParsing || !naturalText.trim()} data-testid="parse-text-btn">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      {aiParsing ? "AI Parsing..." : "Parse with AI"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setNaturalText(""); setParseError(null); setParseSuccess(false); setSuggestedTemplate(null); setDataJson(SAMPLE_DATA[selectedTemplate]); }} data-testid="clear-text-btn">Clear</Button>
                  </div>
                  {aiParsing && <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 font-medium animate-pulse"><Sparkles className="h-3.5 w-3.5" />GPT is analyzing your text...</div>}
                  {parseError && <div className="mt-3 flex items-center gap-2 text-xs text-destructive font-medium"><AlertCircle className="h-3.5 w-3.5" />{parseError}</div>}
                  {parseSuccess && !parseError && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-green-600 font-medium"><CheckCircle2 className="h-3.5 w-3.5" />Data parsed successfully &mdash; switch to JSON to review or go to Preview</div>
                      {suggestedTemplate && (
                        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                          <span className="text-xs text-blue-700 dark:text-blue-300">AI suggests using <strong>{TEMPLATES.find(t => t.id === suggestedTemplate)?.name}</strong> template for this data.</span>
                          <Button size="sm" variant="outline" className="h-6 text-xs ml-auto" onClick={applySuggestedTemplate}>Switch &amp; Re-parse</Button>
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
                  <div className="flex items-center gap-2"><div className="h-2 w-2 bg-green-500 rounded-full" /><span className="text-sm font-medium text-green-600">Valid JSON data</span></div>
                  <div className="bg-muted/50 rounded-lg p-4 text-xs font-mono max-h-[350px] overflow-auto"><pre>{JSON.stringify(parsedData, null, 2)}</pre></div>
                </div>
              ) : (
                <div className="flex items-center gap-2"><div className="h-2 w-2 bg-red-500 rounded-full" /><span className="text-sm text-red-600">Invalid JSON - check your data</span></div>
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
              <CardDescription>This caption will be used when posting to social media platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                rows={3}
                placeholder={parsedData?.title ? `${parsedData.title} - Powered by SchoolRegistry.ng` : "Enter a caption for your social media post..."}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                data-testid="publish-caption-input"
              />
              {publishResult && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600" data-testid="publish-result">
                  <CheckCircle2 className="h-4 w-4" />{publishResult}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Configuration Summary</CardTitle></CardHeader>
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

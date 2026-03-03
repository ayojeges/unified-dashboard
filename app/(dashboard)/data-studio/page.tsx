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
} from "lucide-react";

type TemplateType = "line_race" | "bar_race" | "comparison_duel" | "stat_counter" | "stacked_area";

interface BrandColors {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

const TEMPLATES: { id: TemplateType; name: string; icon: any; description: string }[] = [
  { id: "line_race", name: "Line Race", icon: TrendingUp, description: "Animated line chart showing progression over time" },
  { id: "bar_race", name: "Bar Race", icon: BarChart3, description: "Dynamic bar chart racing to show ranking changes" },
  { id: "comparison_duel", name: "Comparison Duel", icon: GitCompare, description: "Side-by-side comparison of two entities" },
  { id: "stat_counter", name: "Stat Counter", icon: Hash, description: "Animated counter showcasing a key metric" },
  { id: "stacked_area", name: "Stacked Area", icon: Layers, description: "Composition changes over time" },
];

const BRAND_PRESETS: Record<string, BrandColors> = {
  schoolregistry: { name: "SchoolRegistry", primary: "#059669", secondary: "#34D399", background: "#0F172A", text: "#F8FAFC", accent: "#F59E0B" },
  cdlschools: { name: "CDL Schools", primary: "#1E40AF", secondary: "#3B82F6", background: "#0F172A", text: "#F8FAFC", accent: "#F97316" },
  chatautomate: { name: "ChatAutomate", primary: "#7C3AED", secondary: "#8B5CF6", background: "#0F172A", text: "#F8FAFC", accent: "#F59E0B" },
  custom: { name: "Custom", primary: "#3B82F6", secondary: "#60A5FA", background: "#0F172A", text: "#F8FAFC", accent: "#F59E0B" },
};

const SAMPLE_DATA: Record<TemplateType, string> = {
  line_race: JSON.stringify({ title: "WAEC Performance Trend", subtitle: "National average pass rate", endNote: "72% (2025)", sourceLabel: "SchoolRegistry.ng", data: [{ year: 2016, value: 48 }, { year: 2017, value: 51 }, { year: 2018, value: 55 }, { year: 2019, value: 63 }, { year: 2020, value: 58 }, { year: 2021, value: 60 }, { year: 2022, value: 65 }, { year: 2023, value: 68 }, { year: 2024, value: 71 }, { year: 2025, value: 72 }] }, null, 2),
  bar_race: JSON.stringify({ title: "Top Schools by Enrollment", subtitle: "Verified school enrollment figures", sourceLabel: "SchoolRegistry.ng", valueSuffix: " students", maxBars: 6, data: [{ label: "Lagos Model School", values: [{ year: 2020, value: 1200 }, { year: 2023, value: 1800 }] }, { label: "Abuja International", values: [{ year: 2020, value: 900 }, { year: 2023, value: 1500 }] }, { label: "Rivers Academy", values: [{ year: 2020, value: 700 }, { year: 2023, value: 1100 }] }] }, null, 2),
  comparison_duel: JSON.stringify({ title: "Public vs Private Schools", subtitle: "Performance metrics comparison", sourceLabel: "SchoolRegistry.ng", categories: ["Pass Rate", "Enrollment", "Teacher Ratio"], left: { label: "Public Schools", values: [52, 1200, 45], color: "#059669" }, right: { label: "Private Schools", values: [78, 800, 25], color: "#3B82F6" } }, null, 2),
  stat_counter: JSON.stringify({ title: "Schools Verified", subtitle: "Across all 36 states", value: 13360, prefix: "", suffix: "+", contextLine: "And growing every day", sourceLabel: "SchoolRegistry.ng", miniChartData: [2000, 4500, 6000, 7800, 9200, 10500, 11800, 12500, 13000, 13360] }, null, 2),
  stacked_area: JSON.stringify({ title: "School Type Distribution", subtitle: "Public vs Private school growth", sourceLabel: "SchoolRegistry.ng", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], series: [{ label: "Public", values: [5000, 5200, 5100, 5400, 5700, 6000, 6200, 6500], color: "#059669" }, { label: "Private", values: [3000, 3400, 3200, 3600, 4000, 4500, 5000, 5500], color: "#3B82F6" }] }, null, 2),
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
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState<string | null>(null);

  const brandColors = selectedBrand === "custom" ? customColors : BRAND_PRESETS[selectedBrand];

  const parseNaturalLanguage = async (text: string) => {
    if (!text.trim()) return;
    setAiParsing(true);
    setParseError(null);
    try {
      const res = await fetch("/api/parse-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, template: selectedTemplate }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to parse");
      setDataJson(JSON.stringify(json.data, null, 2));
      if (json.suggestedTemplate && json.suggestedTemplate !== selectedTemplate) {
        const valid: TemplateType[] = ["line_race", "bar_race", "comparison_duel", "stat_counter", "stacked_area"];
        if (valid.includes(json.suggestedTemplate)) setSelectedTemplate(json.suggestedTemplate);
      }
    } catch (err: any) {
      setParseError(err.message || "AI parsing failed.");
    } finally {
      setAiParsing(false);
    }
  };

  const handleExportMP4 = async () => {
    if (!parsedData) return;
    setIsRendering(true);
    setRenderProgress("Starting render...");
    try {
      const res = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: selectedTemplate, data: parsedData, brand: brandColors.name, colors: brandColors, aspectRatio }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Render failed"); }
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
      alert(err.message || "Export failed.");
    } finally {
      setIsRendering(false);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="template-gallery">
          {TEMPLATES.map(t => (
            <Card key={t.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplate === t.id ? "ring-2 ring-primary" : ""}`} onClick={() => { setSelectedTemplate(t.id); setDataJson(SAMPLE_DATA[t.id]); }} data-testid={`template-${t.id}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedTemplate === t.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}><t.icon className="h-5 w-5" /></div>
                  <div><CardTitle className="text-sm">{t.name}</CardTitle><CardDescription className="text-xs">{t.description}</CardDescription></div>
                </div>
              </CardHeader>
            </Card>
          ))}
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
                <button onClick={() => setDataInputMode("natural")} className={`flex items-center gap-1.5 flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dataInputMode === "natural" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`} data-testid="input-mode-natural"><FileText className="h-3.5 w-3.5" />Plain Text (AI)</button>
                <button onClick={() => setDataInputMode("json")} className={`flex items-center gap-1.5 flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dataInputMode === "json" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`} data-testid="input-mode-json"><Database className="h-3.5 w-3.5" />JSON</button>
              </div>

              {dataInputMode === "natural" ? (
                <>
                  <Textarea value={naturalText} onChange={(e) => setNaturalText(e.target.value)} className="text-sm min-h-[350px]" placeholder={`Describe your data in plain English. GPT will convert it.\n\nExamples:\n"Nigeria's population grew from 180M in 2015 to 230M in 2025"\n"Lagos: 72%, Abuja: 70%, Rivers: 67%"\n"Over 13,360 schools verified across 36 states"`} data-testid="natural-text-input" />
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => parseNaturalLanguage(naturalText)} disabled={aiParsing || !naturalText.trim()} data-testid="parse-text-btn">{aiParsing ? "AI Parsing..." : "Parse with AI"}</Button>
                    <Button variant="outline" size="sm" onClick={() => { setNaturalText(""); setParseError(null); setDataJson(SAMPLE_DATA[selectedTemplate]); }} data-testid="clear-text-btn">Clear</Button>
                  </div>
                  {aiParsing && <div className="mt-3 text-xs text-blue-600 font-medium animate-pulse">GPT is analyzing your text...</div>}
                  {parseError && <div className="mt-3 text-xs text-destructive font-medium">{parseError}</div>}
                  {!aiParsing && !parseError && parsedData && naturalText.trim() && <div className="mt-3 text-xs text-green-600 font-medium">Data parsed successfully - switch to JSON to review or go to Preview</div>}
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

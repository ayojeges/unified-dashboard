import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TEMPLATE_SCHEMAS: Record<string, string> = {
  line_race: `{ "title": string, "subtitle": string, "endNote": string, "sourceLabel": string, "data": [{ "year": number, "value": number }, ...] }`,
  bar_race: `{ "title": string, "subtitle": string, "sourceLabel": string, "valueSuffix": string, "maxBars": number, "data": [{ "label": string, "values": [{ "year": number, "value": number }, ...] }, ...] }`,
  comparison_duel: `{ "title": string, "subtitle": string, "sourceLabel": string, "categories": [string, ...], "left": { "label": string, "values": [number, ...], "color": "#hex" }, "right": { "label": string, "values": [number, ...], "color": "#hex" } }`,
  stat_counter: `{ "title": string, "subtitle": string, "value": number, "prefix": string, "suffix": string, "contextLine": string, "sourceLabel": string, "miniChartData": [number, ...] }`,
  stacked_area: `{ "title": string, "subtitle": string, "sourceLabel": string, "years": [number, ...], "series": [{ "label": string, "values": [number, ...], "color": "#hex" }, ...] }`,
  funnel_chart: `{ "title": string, "subtitle": string, "sourceLabel": string, "valueSuffix": string, "stages": [{ "label": string, "value": number }, ...] }`,
  donut_chart: `{ "title": string, "subtitle": string, "sourceLabel": string, "centerLabel": string, "centerValue": string, "segments": [{ "label": string, "value": number, "color": "#hex" }, ...] }`,
  heatmap_grid: `{ "title": string, "subtitle": string, "sourceLabel": string, "columns": [string, ...], "rows": [{ "label": string, "values": [number, ...] }, ...] }`,
  gauge: `{ "title": string, "subtitle": string, "sourceLabel": string, "value": number, "maxValue": number, "unit": string, "thresholds": [{ "value": number, "color": "#hex", "label": string }, ...] }`,
  before_after: `{ "title": string, "subtitle": string, "sourceLabel": string, "metric": string, "before": { "label": string, "value": string, "description": string, "color": "#hex" }, "after": { "label": string, "value": string, "description": string, "color": "#hex" } }`,
  timeline: `{ "title": string, "subtitle": string, "sourceLabel": string, "events": [{ "date": string, "title": string, "description": string }, ...] }`,
  leaderboard: `{ "title": string, "subtitle": string, "sourceLabel": string, "scoreLabel": string, "entries": [{ "name": string, "score": number, "previousRank": number }, ...] }`,
  quote_card: `{ "title": string, "quote": string, "author": string, "role": string, "stat": { "value": string, "label": string }, "sourceLabel": string }`,
  map_viz: `{ "title": string, "subtitle": string, "sourceLabel": string, "valueSuffix": string, "states": [{ "name": string (Nigerian state name), "value": number }, ...] }`,
  scatter_race: `{ "title": string, "subtitle": string, "sourceLabel": string, "xLabel": string, "yLabel": string, "timeLabels": [string, ...], "bubbles": [{ "label": string, "snapshots": [{ "x": number, "y": number, "size": number }, ...], "color": "#hex" }, ...] }`,
  waterfall: `{ "title": string, "subtitle": string, "sourceLabel": string, "valuePrefix": string, "valueSuffix": string, "items": [{ "label": string, "value": number, "type": "increase"|"decrease"|"total" }, ...] }`,
  radar_chart: `{ "title": string, "subtitle": string, "sourceLabel": string, "maxValue": number, "dimensions": [string, ...], "entries": [{ "name": string, "values": [number, ...], "color": "#hex" }, ...] }`,
  tier_list: `{ "title": string, "subtitle": string, "sourceLabel": string, "tiers": [{ "tier": "S"|"A"|"B"|"C"|"D", "color": "#hex", "items": [{ "name": string, "score": number }, ...] }, ...] }`,
  tournament_bracket: `{ "title": string, "subtitle": string, "sourceLabel": string, "champion": string, "rounds": [{ "name": string, "matches": [{ "a": { "name": string, "score": number }, "b": { "name": string, "score": number } }, ...] }, ...] }`,
  school_matrix: `{ "title": string, "subtitle": string, "sourceLabel": string, "xLabel": string, "yLabel": string, "quadrants": { "topLeft": string, "topRight": string, "bottomLeft": string, "bottomRight": string }, "schools": [{ "name": string, "x": number, "y": number, "size": number, "color": "#hex" }, ...] }`,
  stacked_ranking: `{ "title": string, "subtitle": string, "sourceLabel": string, "categories": [string, ...], "entries": [{ "name": string, "scores": [number, ...] }, ...] }`,
  progress_grid: `{ "title": string, "subtitle": string, "sourceLabel": string, "maxValue": number, "valueSuffix": string, "metricLabels": [string, ...], "schools": [{ "name": string, "metrics": [number, ...], "color": "#hex" }, ...] }`,
};

export async function POST(req: NextRequest) {
  try {
    const { text, template } = await req.json();
    if (!text || typeof text !== "string") return NextResponse.json({ error: "Missing text input" }, { status: 400 });
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "OpenAI API key not configured. Add OPENAI_API_KEY to Vercel environment variables." }, { status: 500 });

    const schemaHint = template && TEMPLATE_SCHEMAS[template]
      ? `The user has selected the "${template}" template. Output MUST match this schema:\n${TEMPLATE_SCHEMAS[template]}\n\nHowever, also include a "suggestedTemplate" field if a different template would be a BETTER fit for this data. Valid templates: line_race, bar_race, comparison_duel, stat_counter, stacked_area, funnel_chart, donut_chart, heatmap_grid, gauge, before_after, timeline, leaderboard, quote_card, map_viz, scatter_race, waterfall, radar_chart, tier_list, tournament_bracket, school_matrix, stacked_ranking, progress_grid.`
      : `Choose the best template from: line_race, bar_race, comparison_duel, stat_counter, stacked_area, funnel_chart, donut_chart, heatmap_grid, gauge, before_after, timeline, leaderboard, quote_card, map_viz, scatter_race, waterfall, radar_chart, tier_list, tournament_bracket, school_matrix, stacked_ranking, progress_grid. Include a "suggestedTemplate" field with your choice.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a data extraction assistant for a video chart generator. Given natural language text, extract structured JSON for animated chart videos.

Rules:
- Extract ALL numbers, labels, years, and relationships from the text
- Template selection guide:
  * line_race: trends/growth OVER TIME with a single metric
  * bar_race: comparing MULTIPLE entities with time-series data
  * comparison_duel: comparing exactly TWO things side-by-side
  * stat_counter: highlighting a SINGLE impressive number
  * stacked_area: showing COMPOSITION changes over time with 2+ categories
  * funnel_chart: conversion/process stages showing drop-offs (visitors→signups→purchases)
  * donut_chart: percentage breakdown of a whole into parts (market share, distribution)
  * heatmap_grid: matrix of values across two dimensions (regions × metrics)
  * gauge: single KPI with target/threshold levels (uptime, score, completion)
  * before_after: dramatic transformation comparison (before/after a change)
  * timeline: chronological milestones or events (company history, project phases)
  * leaderboard: ranked list/competition (top performers, schools, products)
  * quote_card: testimonial or quote with a supporting stat
  * map_viz: Nigeria state-level geographic data (school density, pass rates by state)
  * scatter_race: relationship between 2 variables evolving over time (enrollment vs performance)
  * waterfall: incremental gains and losses (revenue breakdown, budget changes)
  * radar_chart: multi-dimensional comparison of 2+ entities across 4+ metrics (school comparison, player stats)
  * tier_list: S/A/B/C/D ranking classification (school rankings, product tiers)
  * tournament_bracket: elimination-style head-to-head matchups (top 8 competition)
  * school_matrix: scatter plot with quadrants showing two variables (fees vs quality, price vs performance)
  * stacked_ranking: composite scores with category breakdown bars (combined metrics ranking)
  * progress_grid: side-by-side progress bars comparing 2-4 entities across metrics
- For colors, use professional hex colors (#059669, #3B82F6, #F59E0B, #EF4444, #8B5CF6, #06B6D4)
- Always include a descriptive title and subtitle
- Set sourceLabel to "data-studio" unless the text mentions a specific source
- For miniChartData in stat_counter, generate 8-10 intermediate values showing growth toward the main value
- ALWAYS include a "suggestedTemplate" field with the template you think best fits the data
- Return ONLY valid JSON, no markdown, no explanation

${schemaHint}`,
        },
        { role: "user", content: text },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Try to extract JSON from the response if it has extra text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json({ error: "AI returned invalid JSON. Try rephrasing your description with more specific numbers and labels." }, { status: 422 });
      }
    }

    const suggestedTemplate = parsed.suggestedTemplate || template || null;
    // Remove suggestedTemplate from the data payload
    const { suggestedTemplate: _, ...data } = parsed;

    return NextResponse.json({ data, suggestedTemplate });
  } catch (err: any) {
    console.error("Parse data error:", err);
    if (err.code === "insufficient_quota") {
      return NextResponse.json({ error: "OpenAI API quota exceeded. Check your billing at platform.openai.com." }, { status: 429 });
    }
    if (err.code === "invalid_api_key") {
      return NextResponse.json({ error: "Invalid OpenAI API key. Update OPENAI_API_KEY in Vercel settings." }, { status: 401 });
    }
    return NextResponse.json({ error: err.message || "Failed to parse data" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TEMPLATE_SCHEMAS: Record<string, string> = {
  line_race: `{ "title": string, "subtitle": string, "endNote": string, "sourceLabel": string, "data": [{ "year": number, "value": number }, ...] }`,
  bar_race: `{ "title": string, "subtitle": string, "sourceLabel": string, "valueSuffix": string, "maxBars": number, "data": [{ "label": string, "values": [{ "year": number, "value": number }, ...] }, ...] }`,
  comparison_duel: `{ "title": string, "subtitle": string, "sourceLabel": string, "categories": [string, ...], "left": { "label": string, "values": [number, ...], "color": "#hex" }, "right": { "label": string, "values": [number, ...], "color": "#hex" } }`,
  stat_counter: `{ "title": string, "subtitle": string, "value": number, "prefix": string, "suffix": string, "contextLine": string, "sourceLabel": string, "miniChartData": [number, ...] }`,
  stacked_area: `{ "title": string, "subtitle": string, "sourceLabel": string, "years": [number, ...], "series": [{ "label": string, "values": [number, ...], "color": "#hex" }, ...] }`,
};

export async function POST(req: NextRequest) {
  try {
    const { text, template } = await req.json();
    if (!text || typeof text !== "string") return NextResponse.json({ error: "Missing text input" }, { status: 400 });
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });

    const schemaHint = template && TEMPLATE_SCHEMAS[template]
      ? `The user has selected the "${template}" template. Output MUST match this schema:\n${TEMPLATE_SCHEMAS[template]}`
      : `Choose the best template from: line_race, bar_race, comparison_duel, stat_counter, stacked_area. Include a "suggestedTemplate" field.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a data extraction assistant for a video chart generator. Given natural language text, extract structured JSON for animated chart videos.

Rules:
- Extract ALL numbers, labels, years, and relationships from the text
- If the text mentions growth/trends over time, use line_race or stacked_area
- If comparing multiple entities with time data, use bar_race
- If comparing exactly two things, use comparison_duel
- If highlighting a single impressive number, use stat_counter
- For colors, use professional hex colors (#059669, #3B82F6, #F59E0B, #EF4444, #8B5CF6, #06B6D4)
- Always include a descriptive title and subtitle
- Set sourceLabel to "data-studio" unless the text mentions a specific source
- For miniChartData in stat_counter, generate 8-10 intermediate values showing growth toward the main value
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
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({ data: parsed, suggestedTemplate: parsed.suggestedTemplate || template || null });
  } catch (err: any) {
    if (err instanceof SyntaxError) return NextResponse.json({ error: "AI returned invalid JSON. Try rephrasing." }, { status: 422 });
    return NextResponse.json({ error: err.message || "Failed to parse data" }, { status: 500 });
  }
}

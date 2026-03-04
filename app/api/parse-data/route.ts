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
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "OpenAI API key not configured. Add OPENAI_API_KEY to Vercel environment variables." }, { status: 500 });

    const schemaHint = template && TEMPLATE_SCHEMAS[template]
      ? `The user has selected the "${template}" template. Output MUST match this schema:\n${TEMPLATE_SCHEMAS[template]}\n\nHowever, also include a "suggestedTemplate" field if a different template would be a BETTER fit for this data. Valid templates: line_race, bar_race, comparison_duel, stat_counter, stacked_area.`
      : `Choose the best template from: line_race, bar_race, comparison_duel, stat_counter, stacked_area. Include a "suggestedTemplate" field with your choice.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a data extraction assistant for a video chart generator. Given natural language text, extract structured JSON for animated chart videos.

Rules:
- Extract ALL numbers, labels, years, and relationships from the text
- Template selection guide:
  * line_race: trends/growth OVER TIME with a single metric (e.g. population from 2015-2025)
  * bar_race: comparing MULTIPLE entities with time-series data (e.g. top 10 cities by population over years)
  * comparison_duel: comparing exactly TWO things side-by-side (e.g. public vs private schools)
  * stat_counter: highlighting a SINGLE impressive number (e.g. "13,360+ schools verified")
  * stacked_area: showing COMPOSITION changes over time with 2+ categories (e.g. public + private school mix)
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

# Data Studio Video — ClawdBot Skill

## Purpose
Generate animated data-visualization videos (MP4) for social media content. Converts plain-text data descriptions into branded chart animations using GPT + Remotion.

## When to Use
- Creating social media video content with data/stats
- Visualizing business metrics, growth numbers, comparisons
- Making branded educational or marketing videos with charts

## Two-Step Workflow

### Step 1 — Parse Data (AI)
Convert a natural-language description into structured chart JSON.

```
POST https://unified-dashboard-mauve.vercel.app/api/parse-data
Content-Type: application/json

{
  "text": "Nigeria's school enrollment grew from 8 million in 2015 to 22 million by 2025",
  "template": "line_race"
}
```

**Response:**
```json
{
  "data": { "title": "...", "subtitle": "...", ... },
  "suggestedTemplate": "line_race"
}
```

### Step 2 — Render Video (MP4)
Send the parsed data to the render service to get an MP4 file.

```
POST https://unified-dashboard-mauve.vercel.app/api/render-video
Content-Type: application/json

{
  "template": "line_race",
  "data": { ... },
  "brand": "SchoolRegistry",
  "colors": {
    "primary": "#059669",
    "secondary": "#34D399",
    "background": "#0F172A",
    "text": "#F8FAFC",
    "accent": "#F59E0B"
  },
  "aspectRatio": "16:9"
}
```

**Response:** Binary MP4 file (Content-Type: video/mp4)

## Available Templates

| Template | ID | Best For |
|---|---|---|
| Line Race | `line_race` | Trends over time (e.g., enrollment 2015–2025) |
| Bar Race | `bar_race` | Ranking multiple items over time |
| Comparison Duel | `comparison_duel` | Two entities side-by-side |
| Stat Counter | `stat_counter` | Single impressive number |
| Stacked Area | `stacked_area` | Composition changes over time |

## Available Brands

| Brand | Key | Primary Color |
|---|---|---|
| SchoolRegistry | `schoolregistry` | #059669 (green) |
| CDL Schools | `cdlschools` | #1E40AF (blue) |
| ChatAutomate | `chatautomate` | #7C3AED (purple) |
| GuardianCryo | `guardiancryo` | #0D9488 (teal) |

## Aspect Ratios
- `16:9` — Landscape (YouTube, LinkedIn) → 1920x1080
- `1:1` — Square (Instagram feed) → 1080x1080
- `9:16` — Portrait (Instagram Reels, TikTok) → 1080x1920

## Example: Full Workflow

1. **Parse**: Send `"Over 13,360 schools verified across 36 states"` with `template: "stat_counter"`
2. **Render**: Send parsed JSON with `brand: "SchoolRegistry"`, `aspectRatio: "1:1"`
3. **Result**: Download the MP4 and post to social media

## Dashboard UI
The Data Studio is also available as a visual tool at:
`https://unified-dashboard-mauve.vercel.app/data-studio`

## Dependencies
- OpenAI API key (configured in Vercel env vars)
- Render service running on VPS port 4100 (for MP4 export)
- Preview works without render service (browser-only via Remotion Player)

## Error Handling
- If render service is down: Preview still works in browser, MP4 export will fail
- If OpenAI key is invalid: Natural language parsing will return 401 error
- If quota exceeded: Returns 429 error — check billing at platform.openai.com

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const TEMPLATE_TO_COMP: Record<string, string> = {
  line_race: "LineRace",
  bar_race: "BarRace",
  comparison_duel: "ComparisonDuel",
  stat_counter: "StatCounter",
  stacked_area: "StackedArea",
};

const ASPECT_DIMS: Record<string, { width: number; height: number }> = {
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
};

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const { template, data, brand, colors, aspectRatio = "16:9" } = await req.json();
    if (!template || !data) return NextResponse.json({ error: "Missing template or data" }, { status: 400 });

    const compositionId = TEMPLATE_TO_COMP[template];
    if (!compositionId) return NextResponse.json({ error: `Unknown template: ${template}` }, { status: 400 });

    const dims = ASPECT_DIMS[aspectRatio] || ASPECT_DIMS["16:9"];
    const baseProps = { brand: brand || "DataStudio", colors, sourceLabel: data.sourceLabel || brand };
    let inputProps: Record<string, any>;

    switch (template) {
      case "line_race": inputProps = { ...baseProps, data: data.data || [], title: data.title || "", subtitle: data.subtitle, endNote: data.endNote }; break;
      case "bar_race": inputProps = { ...baseProps, data: data.data || [], title: data.title || "", subtitle: data.subtitle, valueSuffix: data.valueSuffix || "", maxBars: data.maxBars || 8 }; break;
      case "comparison_duel": inputProps = { ...baseProps, left: data.left, right: data.right, categories: data.categories || [], title: data.title || "", subtitle: data.subtitle }; break;
      case "stat_counter": inputProps = { ...baseProps, value: data.value || 0, prefix: data.prefix || "", suffix: data.suffix || "+", title: data.title || "", subtitle: data.subtitle, contextLine: data.contextLine, miniChartData: data.miniChartData }; break;
      case "stacked_area": inputProps = { ...baseProps, series: data.series || [], years: data.years || [], title: data.title || "", subtitle: data.subtitle }; break;
      default: inputProps = baseProps;
    }

    const tmpDir = os.tmpdir();
    const configFile = path.join(tmpDir, `render-config-${Date.now()}.json`);
    const outputFile = path.join(tmpDir, `render-${Date.now()}.mp4`);

    fs.writeFileSync(configFile, JSON.stringify({ compositionId, inputProps, width: dims.width, height: dims.height }));

    const scriptPath = path.resolve(process.cwd(), "render-script.mjs");
    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({ error: "Render script not found. Video rendering is only available on VPS." }, { status: 501 });
    }

    try {
      await execFileAsync("node", [scriptPath, configFile, outputFile], {
        timeout: 240_000,
        env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=4096" },
      });
    } catch (execErr: any) {
      try { fs.unlinkSync(configFile); } catch {}
      return NextResponse.json({ error: `Render failed: ${execErr.stderr || execErr.message}` }, { status: 500 });
    }

    try { fs.unlinkSync(configFile); } catch {}
    if (!fs.existsSync(outputFile)) return NextResponse.json({ error: "Output file not found" }, { status: 500 });

    const fileBuffer = fs.readFileSync(outputFile);
    try { fs.unlinkSync(outputFile); } catch {}

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="data-studio-${template}-${aspectRatio.replace(":", "x")}.mp4"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("Render error:", err);
    return NextResponse.json({ error: err.message || "Rendering failed" }, { status: 500 });
  }
}

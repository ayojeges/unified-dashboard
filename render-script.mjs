import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = process.argv[2];
const outputPath = process.argv[3];

if (!configPath || !outputPath) { console.error("Usage: node render-script.mjs <configJson> <outputPath>"); process.exit(1); }

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const { compositionId, inputProps, width, height } = config;

async function main() {
  console.log("Bundling...");
  const bundled = await bundle({ entryPoint: path.resolve(__dirname, "remotion/index.ts") });
  console.log("Selecting composition:", compositionId);
  const composition = await selectComposition({ serveUrl: bundled, id: compositionId, inputProps });
  console.log(`Rendering ${width}x${height}...`);
  await renderMedia({ composition: { ...composition, width, height }, serveUrl: bundled, codec: "h264", outputLocation: outputPath, inputProps });
  console.log("Done:", outputPath);
}

main().catch(e => { console.error("Failed:", e.message); process.exit(1); });

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { template, data, brand, colors, aspectRatio } = body;

    if (!template || !data) {
      return NextResponse.json({ error: "Missing template or data" }, { status: 400 });
    }

    // Call the VPS render service
    const renderUrl = process.env.RENDER_SERVICE_URL || process.env.NEXT_PUBLIC_RENDER_SERVICE_URL;

    if (!renderUrl) {
      return NextResponse.json(
        { error: "Render service not configured. Set RENDER_SERVICE_URL in environment variables." },
        { status: 501 }
      );
    }

    const renderRes = await fetch(`${renderUrl}/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, data, brand, colors, aspectRatio }),
    });

    if (!renderRes.ok) {
      const err = await renderRes.json().catch(() => ({ error: "Render service unavailable" }));
      return NextResponse.json(err, { status: renderRes.status });
    }

    // Stream the MP4 response back
    const blob = await renderRes.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": renderRes.headers.get("Content-Disposition") || 
          `attachment; filename="data-studio-${template}.mp4"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("Render proxy error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to connect to render service" },
      { status: 502 }
    );
  }
}

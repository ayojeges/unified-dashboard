import { NextRequest, NextResponse } from "next/server";

const SOCIAL_API = process.env.SOCIAL_API_URL || "http://72.61.8.193:3333";

export async function GET() {
  try {
    const resp = await fetch(`${SOCIAL_API}/api/social/platforms`, { cache: "no-store" });
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ configured: false, error: err.message }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resp = await fetch(`${SOCIAL_API}/api/social/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json(data, { status: resp.status });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}

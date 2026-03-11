import { NextResponse } from "next/server";

const VPS_API = process.env.SOCIAL_API_URL || "http://72.61.8.193:3333";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel_name = searchParams.get("channel_name") || "general";
  const limit = searchParams.get("limit") || "100";

  try {
    const res = await fetch(`${VPS_API}/api/messages?channel_name=${channel_name}&limit=${limit}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    // Use async endpoint - returns immediately, agent processes in background
    const res = await fetch(`${VPS_API}/api/chat/agent/async`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

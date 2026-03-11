import { NextResponse } from "next/server";

const VPS_API = process.env.SOCIAL_API_URL || "http://72.61.8.193:3333";

export async function GET() {
  try {
    const res = await fetch(`${VPS_API}/api/channels`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

const SOCIAL_API = process.env.SOCIAL_API_URL || "http://72.61.8.193:3333";

// GET /api/social/fb-callback?code=xxx - Handle Facebook OAuth callback
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return new NextResponse(
      `<html><body style="font-family:system-ui;max-width:600px;margin:40px auto;padding:20px;">
        <h2 style="color:#EF4444;">Facebook Authorization Failed</h2>
        <p>${error || "No authorization code received"}</p>
        <a href="/">Back to Dashboard</a>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    // Forward the code to the VPS to exchange for tokens
    const resp = await fetch(`${SOCIAL_API}/api/social/fb-exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      return new NextResponse(
        `<html><body style="font-family:system-ui;max-width:600px;margin:40px auto;padding:20px;">
          <h2 style="color:#EF4444;">Connection Failed</h2>
          <p>${data.error || "Failed to exchange token"}</p>
          <a href="/">Back to Dashboard</a>
        </body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    return new NextResponse(
      `<html><body style="font-family:system-ui;max-width:600px;margin:40px auto;padding:20px;">
        <h2 style="color:#10B981;">Facebook Connected!</h2>
        <table style="border-collapse:collapse;width:100%;">
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold;">Page</td><td style="padding:8px;border:1px solid #e5e7eb;">${data.pageName || "Connected"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold;">Page ID</td><td style="padding:8px;border:1px solid #e5e7eb;">${data.pageId || "-"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold;">Instagram</td><td style="padding:8px;border:1px solid #e5e7eb;">${data.igAccountId || "Not linked"}</td></tr>
        </table>
        <br><p style="color:#6B7280;">Tokens saved. You can now use "Generate & Post All" in Data Studio.</p>
        <a href="/data-studio" style="display:inline-block;margin-top:16px;padding:8px 20px;background:#3B82F6;color:white;border-radius:8px;text-decoration:none;">Go to Data Studio</a>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err: any) {
    return new NextResponse(
      `<html><body style="font-family:system-ui;max-width:600px;margin:40px auto;padding:20px;">
        <h2 style="color:#EF4444;">Error</h2>
        <p>${err.message}</p>
        <a href="/">Back to Dashboard</a>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}

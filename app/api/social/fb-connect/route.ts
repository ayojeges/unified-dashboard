import { NextResponse } from "next/server";

const META_APP_ID = process.env.META_APP_ID || "1597577891280088";
const REDIRECT_URI = "https://unified-dashboard-mauve.vercel.app/api/social/fb-callback";

export async function GET() {
  if (!META_APP_ID) {
    return NextResponse.json({ error: "META_APP_ID not configured" }, { status: 500 });
  }

  const scopes = "pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish,business_management";
  const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopes}&response_type=code`;

  return NextResponse.redirect(url);
}

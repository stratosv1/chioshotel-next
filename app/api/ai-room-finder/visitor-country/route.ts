import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The visitor's country from Vercel's IP geolocation (ISO code, e.g. "TR"),
// used only to add a home-holiday note in the Room Finder. Nothing is stored.
export function GET(request: NextRequest) {
  const raw = (request.headers.get("x-vercel-ip-country") || "").trim().toUpperCase();
  return NextResponse.json(
    { country: /^[A-Z]{2}$/.test(raw) ? raw : null },
    { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}

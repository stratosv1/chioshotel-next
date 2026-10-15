import { NextResponse } from "next/server";
import {
  recordRoomFinderConversation,
  type RoomFinderTrackingSnapshot,
} from "@/lib/ai-assistant/conversation-store";
import { isAllowedSiteOrigin } from "@/lib/ai-assistant/email-endpoint-guard";
import { checkPublicRateLimit } from "@/lib/ai-assistant/public-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The chat posts one small request per message (and per reaction), so a real
// conversation stays far below these limits. They exist so a script cannot
// fill the staff inbox or trigger a stream of alert emails.
const RATE_LIMITS = { perMinute: 40, perHour: 300 };
// One tracked message is at most 4,000 characters; leave room for metadata.
const MAX_BODY_BYTES = 64_000;

const privateHeaders = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

function reject(error: string, status: number, headers: Record<string, string> = {}) {
  return NextResponse.json({ ok: false, error }, { status, headers: { ...privateHeaders, ...headers } });
}

export async function POST(request: Request) {
  if (!isAllowedSiteOrigin(request)) return reject("Forbidden.", 403);

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return reject("Request is too large.", 413);
  }

  const rate = await checkPublicRateLimit(request, "room-finder:conversation", RATE_LIMITS);
  if (rate.limited) {
    return reject("Too many requests. Please try again later.", 429, { "Retry-After": String(rate.retryAfterSeconds) });
  }

  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return reject("Request is too large.", 413);

    const body = JSON.parse(raw) as RoomFinderTrackingSnapshot;
    const result = await recordRoomFinderConversation(body);
    const response = NextResponse.json({ ok: true, sessionId: result.sessionId });
    response.cookies.set("ai_rf_session", result.sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    for (const [key, value] of Object.entries(privateHeaders)) response.headers.set(key, value);
    return response;
  } catch (error) {
    console.error("AI Room Finder conversation tracking error", error);
    return reject("Could not record conversation.", 400);
  }
}

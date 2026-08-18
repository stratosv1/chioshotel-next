import { NextRequest, NextResponse } from "next/server";
import {
  recordRoomFinderConversation,
  type RoomFinderTrackingSnapshot,
} from "@/lib/ai-assistant/conversation-store";
import {
  checkPublicAiRateLimit,
  clientIp,
  isAllowedAiBrowserOrigin,
  requestBodyTooLarge,
} from "@/lib/ai-assistant/public-api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32_000;

function noStoreJson(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return NextResponse.json(body, { ...init, headers });
}

export async function POST(request: NextRequest) {
  try {
    if (!isAllowedAiBrowserOrigin(request)) {
      return noStoreJson({ ok: false, code: "FORBIDDEN_ORIGIN" }, { status: 403 });
    }
    if (requestBodyTooLarge(request, MAX_BODY_BYTES)) {
      return noStoreJson({ ok: false, code: "REQUEST_TOO_LARGE" }, { status: 413 });
    }

    const rate = await checkPublicAiRateLimit("room-finder-conversation", clientIp(request), {
      minute: 120,
      hour: 600,
    });
    if (rate.limited) {
      return noStoreJson(
        { ok: false, code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
      );
    }

    const body = (await request.json()) as RoomFinderTrackingSnapshot;
    if (Buffer.byteLength(JSON.stringify(body), "utf8") > MAX_BODY_BYTES) {
      return noStoreJson({ ok: false, code: "REQUEST_TOO_LARGE" }, { status: 413 });
    }

    const result = await recordRoomFinderConversation(body);
    const response = noStoreJson({ ok: true, sessionId: result.sessionId });
    response.cookies.set("ai_rf_session", result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    console.error("AI Room Finder conversation tracking error", error);
    return noStoreJson(
      { ok: false, error: "Could not record conversation.", code: "TRACKING_FAILED" },
      { status: 400 },
    );
  }
}

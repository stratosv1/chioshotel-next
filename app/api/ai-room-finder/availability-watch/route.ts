import { NextResponse } from "next/server";
import {
  createAvailabilityWatch,
  validateWatchInput,
  watchLanguage,
  WatchLimitError,
} from "@/lib/ai-assistant/availability-watch";
import { isAllowedSiteOrigin } from "@/lib/ai-assistant/email-endpoint-guard";
import { checkPublicRateLimit } from "@/lib/ai-assistant/public-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Guests only sign up once or twice; this blocks scripted sign-ups of
// third-party addresses.
const RATE_LIMITS = { perMinute: 3, perHour: 10 };

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

function reply(body: Record<string, unknown>, status = 200, extra: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...headers, ...extra } });
}

export async function POST(request: Request) {
  if (!isAllowedSiteOrigin(request)) return reply({ ok: false, code: "FORBIDDEN" }, 403);

  const rate = await checkPublicRateLimit(request, "room-finder:watch", RATE_LIMITS);
  if (rate.limited) {
    return reply({ ok: false, code: "RATE_LIMITED" }, 429, { "Retry-After": String(rate.retryAfterSeconds) });
  }

  try {
    const raw = await request.text();
    if (raw.length > 4_000) return reply({ ok: false, code: "REQUEST_TOO_LARGE" }, 413);
    const body = JSON.parse(raw) as Record<string, unknown>;
    if (body.privacyAccepted !== true) return reply({ ok: false, code: "PRIVACY_REQUIRED" }, 400);

    const input = {
      email: String(body.email ?? "").trim(),
      firstName: typeof body.firstName === "string" ? body.firstName : undefined,
      language: watchLanguage(body.language),
      checkin: String(body.checkin ?? ""),
      checkout: String(body.checkout ?? ""),
      groups: Array.isArray(body.groups) ? body.groups.map(Number) : [],
      sessionId: typeof body.sessionId === "string" ? body.sessionId : undefined,
    };
    const invalid = validateWatchInput(input);
    if (invalid) return reply({ ok: false, code: invalid }, 400);

    const result = await createAvailabilityWatch(input);
    return reply({ ok: true, created: result.created });
  } catch (error) {
    if (error instanceof WatchLimitError) return reply({ ok: false, code: "TOO_MANY_ALERTS" }, 429);
    console.error("AI Room Finder availability watch signup failed", error);
    return reply({ ok: false, code: "WATCH_FAILED" }, 500);
  }
}

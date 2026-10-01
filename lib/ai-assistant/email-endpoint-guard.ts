import { NextResponse } from "next/server";
import { checkPublicRateLimit } from "@/lib/ai-assistant/public-rate-limit";

// Abuse protection for the public enquiry-email endpoints
// (/api/ai-assistant/summary-email, /api/ai-assistant/request-email).
// Rate limiting is shared with the other public Room Finder endpoints via
// lib/ai-assistant/public-rate-limit.ts, using a separate key namespace.

const EMAIL_LIMITS = { perMinute: 3, perHour: 10 };

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  // Browsers always send Origin on fetch POST requests; scripts usually do not.
  if (!origin) return false;

  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    if (hostname === "chioshotel.gr" || hostname === "www.chioshotel.gr") return true;
    if (process.env.VERCEL_ENV === "production") return false;
    return hostname.endsWith(".vercel.app") || hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

/**
 * Returns a response to send back immediately when the request must be
 * rejected, or null when the request may proceed.
 */
export async function guardEmailEndpoint(request: Request, scope: string): Promise<NextResponse | null> {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
  }

  const { limited, retryAfterSeconds } = await checkPublicRateLimit(request, `email:${scope}`, EMAIL_LIMITS);
  if (limited) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds), "Cache-Control": "no-store" } },
    );
  }

  return null;
}

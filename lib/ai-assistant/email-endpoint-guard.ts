import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

// Abuse protection for the public enquiry-email endpoints
// (/api/ai-assistant/summary-email, /api/ai-assistant/request-email).
// Reuses the same Neon table as the AI interpreter rate limiter
// (ai_security.rate_limit_windows) with a separate key namespace.

const MINUTE_MAX_REQUESTS = 3;
const HOUR_MAX_REQUESTS = 10;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

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

async function isRateLimited(scope: string, ip: string) {
  if (!process.env.DATABASE_URL) {
    console.error(`Email endpoint rate limiting skipped for ${scope}: DATABASE_URL is missing`);
    return { limited: false, retryAfterSeconds: 0 };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const key = createHash("sha256").update(`${scope}:${ip}`).digest("hex");
    const rows = await sql`
      with hits as (
        insert into ai_security.rate_limit_windows (
          client_key,
          window_kind,
          window_start,
          request_count,
          updated_at
        ) values
          (${key}, 'minute', date_trunc('minute', now()), 1, now()),
          (${key}, 'hour', date_trunc('hour', now()), 1, now())
        on conflict (client_key, window_kind, window_start)
        do update set
          request_count = ai_security.rate_limit_windows.request_count + 1,
          updated_at = now()
        returning window_kind, request_count
      )
      select
        coalesce(max(request_count) filter (where window_kind = 'minute'), 0)::int as minute_count,
        coalesce(max(request_count) filter (where window_kind = 'hour'), 0)::int as hour_count
      from hits
    `;

    const row = rows[0] as Record<string, unknown> | undefined;
    const minuteLimited = Number(row?.minute_count || 0) > MINUTE_MAX_REQUESTS;
    const hourLimited = Number(row?.hour_count || 0) > HOUR_MAX_REQUESTS;
    return {
      limited: minuteLimited || hourLimited,
      retryAfterSeconds: minuteLimited ? 60 : hourLimited ? 3600 : 0,
    };
  } catch (error) {
    // Fail open: a database hiccup must not block a real guest's enquiry.
    console.error(`Email endpoint rate limiting failed for ${scope}`, error);
    return { limited: false, retryAfterSeconds: 0 };
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

  const { limited, retryAfterSeconds } = await isRateLimited(`email:${scope}`, getClientIp(request));
  if (limited) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds), "Cache-Control": "no-store" } },
    );
  }

  return null;
}

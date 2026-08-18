import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import type { NextRequest } from "next/server";

export type PublicAiRateLimit = {
  minute: number;
  hour: number;
};

export function isAllowedAiBrowserOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    if (hostname === "chioshotel.gr" || hostname === "www.chioshotel.gr") return true;
    return process.env.VERCEL_ENV !== "production" && hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

export function requestBodyTooLarge(request: NextRequest, maxBytes: number) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  return Number.isFinite(contentLength) && contentLength > maxBytes;
}

export function clientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function clientKey(scope: string, ip: string) {
  return createHash("sha256").update(`${scope}:${ip}`).digest("hex");
}

export async function checkPublicAiRateLimit(
  scope: string,
  ip: string,
  limits: PublicAiRateLimit,
) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing for AI rate limiting");
  }

  const sql = neon(process.env.DATABASE_URL);
  const key = clientKey(scope, ip);
  const rows = await sql`
    with cleanup as (
      delete from ai_security.rate_limit_windows
      where window_start < date_trunc('hour', now()) - interval '2 hours'
      returning 1
    ),
    hits as (
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
      coalesce(max(request_count) filter (where window_kind = 'hour'), 0)::int as hour_count,
      greatest(
        1,
        ceil(extract(epoch from (date_trunc('minute', now()) + interval '1 minute' - now())))
      )::int as minute_retry_after,
      greatest(
        1,
        ceil(extract(epoch from (date_trunc('hour', now()) + interval '1 hour' - now())))
      )::int as hour_retry_after
    from hits
  `;

  const row = rows[0] as Record<string, unknown> | undefined;
  const minuteCount = Number(row?.minute_count || 0);
  const hourCount = Number(row?.hour_count || 0);
  const minuteLimited = minuteCount > limits.minute;
  const hourLimited = hourCount > limits.hour;

  return {
    limited: minuteLimited || hourLimited,
    retryAfterSeconds: minuteLimited
      ? Number(row?.minute_retry_after || 60)
      : hourLimited
        ? Number(row?.hour_retry_after || 3600)
        : 0,
  };
}

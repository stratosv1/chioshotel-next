import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";

// Per-IP rate limiting for public AI Room Finder endpoints.
// Reuses the Neon table already used by the AI interpreter
// (ai_security.rate_limit_windows); each caller passes its own scope so the
// counters of different endpoints never mix.
//
// Fails open: if the database is unreachable the request is allowed, because
// blocking a real guest is worse than letting a few extra requests through.

export type RateLimitResult = { limited: boolean; retryAfterSeconds: number };

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function checkPublicRateLimit(
  request: Request,
  scope: string,
  limits: { perMinute: number; perHour: number },
): Promise<RateLimitResult> {
  if (!process.env.DATABASE_URL) {
    console.error(`Rate limiting skipped for ${scope}: DATABASE_URL is missing`);
    return { limited: false, retryAfterSeconds: 0 };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const key = createHash("sha256").update(`${scope}:${getClientIp(request)}`).digest("hex");
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
    const minuteLimited = Number(row?.minute_count || 0) > limits.perMinute;
    const hourLimited = Number(row?.hour_count || 0) > limits.perHour;
    return {
      limited: minuteLimited || hourLimited,
      retryAfterSeconds: minuteLimited ? 60 : hourLimited ? 3600 : 0,
    };
  } catch (error) {
    console.error(`Rate limiting failed for ${scope}`, error);
    return { limited: false, retryAfterSeconds: 0 };
  }
}

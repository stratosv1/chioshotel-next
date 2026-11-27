import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";

// Per-IP rate limiting for public AI Room Finder endpoints.
// Reuses the Neon table already used by the AI interpreter
// (ai_security.rate_limit_windows); each caller passes its own scope so the
// counters of different endpoints never mix.
//
// Read-only availability callers can fail open. Optional write/cost callers
// can explicitly fail closed if the shared counter is unavailable.

export type RateLimitResult = { limited: boolean; retryAfterSeconds: number };

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function checkPublicRateLimit(
  request: Request,
  scope: string,
  limits: { perMinute: number; perHour: number; failClosed?: boolean },
): Promise<RateLimitResult> {
  if (!process.env.DATABASE_URL) {
    console.error(`Rate limiting skipped for ${scope}: DATABASE_URL is missing`);
    return limits.failClosed ? { limited: true, retryAfterSeconds: 60 } : { limited: false, retryAfterSeconds: 0 };
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
    return limits.failClosed ? { limited: true, retryAfterSeconds: 60 } : { limited: false, retryAfterSeconds: 0 };
  }
}

/**
 * Site-wide hourly cap shared by every caller of `scope` (not per IP), for
 * actions whose cost is global, such as emails sent to guest-supplied
 * addresses. Fails closed: if the counter cannot be read the action is
 * refused, because these actions are optional extras.
 */
export async function checkGlobalHourlyLimit(scope: string, perHour: number): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    const sql = neon(process.env.DATABASE_URL);
    const key = createHash("sha256").update(`global:${scope}`).digest("hex");
    const rows = await sql`
      insert into ai_security.rate_limit_windows (client_key, window_kind, window_start, request_count, updated_at)
      values (${key}, 'hour', date_trunc('hour', now()), 1, now())
      on conflict (client_key, window_kind, window_start)
      do update set request_count = ai_security.rate_limit_windows.request_count + 1, updated_at = now()
      returning request_count
    `;
    return Number((rows[0] as Record<string, unknown> | undefined)?.request_count || 0) <= perHour;
  } catch (error) {
    console.error(`Global limit check failed for ${scope}`, error);
    return false;
  }
}

// Bound the actual streamed body, not only the client-supplied Content-Length.
export async function readBoundedJson(request: Request, maxBytes: number): Promise<
  { ok: true; value: unknown } | { ok: false; status: 400 | 413 }
> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maxBytes) return { ok: false, status: 413 };
  if (!request.body) return { ok: false, status: 400 };
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let raw = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, status: 413 };
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
    return { ok: true, value: JSON.parse(raw) as unknown };
  } catch {
    await reader.cancel().catch(() => undefined);
    return { ok: false, status: 400 };
  } finally {
    reader.releaseLock();
  }
}

import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { interpretRoomFinderMessage } from "@/lib/ai-assistant/room-finder-intent";
import { fallbackRoomFinderCommand } from "@/lib/ai-assistant/room-finder-fallback";
import type { RoomFinderConversationContext } from "@/lib/ai-assistant/room-finder-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 40;

const MAX_BODY_BYTES = 24_000;
const MAX_MESSAGE_CHARS = 1_500;
const MAX_CONTEXT_CHARS = 8_000;
const MAX_RECENT_MESSAGES = 12;
const MAX_RECENT_MESSAGE_CHARS = 500;
const BURST_MAX_REQUESTS = 20;
const HOUR_MAX_REQUESTS = 60;

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function clientKey(ip: string) {
  return createHash("sha256").update(`room-finder-interpreter:${ip}`).digest("hex");
}

// Used only when the shared Postgres limiter is unreachable, so a database
// outage does not take the whole Room Finder down. It is per serverless
// instance, which is enough to blunt a burst until the database is back.
const localWindows = new Map<string, { minute: number; minuteStart: number; hour: number; hourStart: number }>();

function checkLocalRateLimit(ip: string) {
  const now = Date.now();
  const key = clientKey(ip);
  const entry = localWindows.get(key) || { minute: 0, minuteStart: now, hour: 0, hourStart: now };
  if (now - entry.minuteStart >= 60_000) { entry.minute = 0; entry.minuteStart = now; }
  if (now - entry.hourStart >= 3_600_000) { entry.hour = 0; entry.hourStart = now; }
  entry.minute += 1;
  entry.hour += 1;
  localWindows.set(key, entry);
  if (localWindows.size > 5_000) localWindows.clear();
  const minuteLimited = entry.minute > BURST_MAX_REQUESTS;
  const hourLimited = entry.hour > HOUR_MAX_REQUESTS;
  return {
    limited: minuteLimited || hourLimited,
    retryAfterSeconds: minuteLimited
      ? Math.max(1, Math.ceil((entry.minuteStart + 60_000 - now) / 1_000))
      : hourLimited
        ? Math.max(1, Math.ceil((entry.hourStart + 3_600_000 - now) / 1_000))
        : 0,
  };
}

async function checkRateLimit(ip: string) {
  try {
    return await checkDistributedRateLimit(ip);
  } catch (error) {
    console.error(JSON.stringify({
      level: "error",
      msg: "ai_room_finder_rate_limit_store_unavailable",
      route: "/api/ai-assistant/interpret",
      error: error instanceof Error ? error.message : String(error),
    }));
    return checkLocalRateLimit(ip);
  }
}

async function checkDistributedRateLimit(ip: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing for AI rate limiting");
  }

  const sql = neon(process.env.DATABASE_URL);
  const key = clientKey(ip);
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
  const minuteLimited = minuteCount > BURST_MAX_REQUESTS;
  const hourLimited = hourCount > HOUR_MAX_REQUESTS;

  return {
    limited: minuteLimited || hourLimited,
    retryAfterSeconds: minuteLimited
      ? Number(row?.minute_retry_after || 60)
      : hourLimited
        ? Number(row?.hour_retry_after || 3600)
        : 0,
  };
}

function isAllowedBrowserOrigin(request: NextRequest) {
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

function sanitizeContext(value: unknown): RoomFinderConversationContext {
  if (!value || typeof value !== "object") return {};
  const raw = value as RoomFinderConversationContext;
  const recentMessages = Array.isArray(raw.recentMessages)
    ? raw.recentMessages
        .slice(-MAX_RECENT_MESSAGES)
        .filter(message => message && (message.role === "user" || message.role === "assistant"))
        .map(message => ({
          role: message.role,
          content: String(message.content || "").slice(0, MAX_RECENT_MESSAGE_CHARS),
        }))
    : undefined;

  const preferences = Array.isArray(raw.preferences)
    ? raw.preferences.filter(value => [
        "ground_floor",
        "no_stairs",
        "kitchen",
        "balcony",
        "garden",
        "budget",
        "family",
      ].includes(String(value)))
    : undefined;

  return {
    stayDestination: typeof raw.stayDestination === "string"
      ? raw.stayDestination.slice(0, 120)
      : undefined,
    destinationKind: ["property", "island", "other"].includes(String(raw.destinationKind))
      ? raw.destinationKind
      : undefined,
    checkin: raw.checkin,
    checkout: raw.checkout,
    roomCount: raw.roomCount,
    preferredRoomNumber: Number.isInteger(raw.preferredRoomNumber)
      && Number(raw.preferredRoomNumber) >= 1
      && Number(raw.preferredRoomNumber) <= 10
      ? Number(raw.preferredRoomNumber)
      : undefined,
    totalGuests: raw.totalGuests,
    guestGroups: Array.isArray(raw.guestGroups) ? raw.guestGroups.slice(0, 3) : undefined,
    currentRoom: raw.currentRoom,
    currentStep: raw.currentStep,
    language: raw.language,
    preferences,
    recentMessages,
  };
}

function noStoreJson(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");
  return NextResponse.json(body, { ...init, headers });
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = request.headers.get("x-vercel-id") || undefined;
  let message = "";
  let context: RoomFinderConversationContext = {};

  try {
    if (!isAllowedBrowserOrigin(request)) {
      return noStoreJson({ error: "Forbidden origin.", code: "FORBIDDEN_ORIGIN" }, { status: 403 });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return noStoreJson({ error: "Request is too large.", code: "REQUEST_TOO_LARGE" }, { status: 413 });
    }

    const body = await request.json();
    message = typeof body?.message === "string" ? body.message.trim() : "";
    context = sanitizeContext(body?.context);

    if (!message) {
      return noStoreJson({ error: "Message is required.", code: "MESSAGE_REQUIRED" }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return noStoreJson({ error: "Message is too long.", code: "MESSAGE_TOO_LONG" }, { status: 400 });
    }
    if (JSON.stringify(context).length > MAX_CONTEXT_CHARS) {
      return noStoreJson({ error: "Conversation context is too large.", code: "CONTEXT_TOO_LARGE" }, { status: 400 });
    }

    const rate = await checkRateLimit(getClientIp(request));
    if (rate.limited) {
      return noStoreJson(
        { error: "Too many requests. Please try again shortly.", code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
      );
    }

    console.info(JSON.stringify({
      level: "info",
      msg: "ai_room_finder_interpret_start",
      route: "/api/ai-assistant/interpret",
      requestId,
    }));
    const command = await interpretRoomFinderMessage(message, context);
    console.info(JSON.stringify({
      level: "info",
      msg: "ai_room_finder_interpret_done",
      route: "/api/ai-assistant/interpret",
      requestId,
      ms: Date.now() - startedAt,
    }));
    return noStoreJson({ ok: true, command });
  } catch (error) {
    const timeout = isAbortError(error);
    console.error(JSON.stringify({
      level: "error",
      msg: "ai_room_finder_interpret_failed",
      route: "/api/ai-assistant/interpret",
      requestId,
      errorName: error instanceof Error ? error.name : "UnknownError",
      error: error instanceof Error ? error.message : String(error),
      currentStep: context.currentStep,
      language: context.language,
      messageChars: message.length,
      ms: Date.now() - startedAt,
    }));

    // When the AI interpreter is down or too slow, keep the conversation
    // moving with the conservative deterministic parser. It only extracts
    // unambiguous facts (exact dates, counts, nights); anything uncertain is
    // left for the normal flow to ask. The client marks such turns for staff.
    if (message) {
      try {
        const fallback = fallbackRoomFinderCommand(message, context);
        if (fallback) {
          console.warn(JSON.stringify({
            level: "warning",
            msg: "ai_room_finder_interpret_degraded",
            route: "/api/ai-assistant/interpret",
            requestId,
            cause: timeout ? "AI_TIMEOUT" : "AI_UNAVAILABLE",
            actions: fallback.actions.map(action => action.type),
            ms: Date.now() - startedAt,
          }));
          return noStoreJson({
            ok: true,
            degraded: true,
            cause: timeout ? "AI_TIMEOUT" : "AI_UNAVAILABLE",
            command: fallback,
          });
        }
      } catch (fallbackError) {
        console.error("Room Finder deterministic fallback failed", fallbackError);
      }
    }

    return noStoreJson(
      {
        error: timeout ? "AI interpreter timed out." : "AI interpreter is temporarily unavailable.",
        code: timeout ? "AI_TIMEOUT" : "AI_UNAVAILABLE",
      },
      { status: timeout ? 504 : 502 },
    );
  }
}

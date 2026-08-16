import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { interpretRoomFinderMessage } from "@/lib/ai-assistant/room-finder-intent";
import type { RoomFinderConversationContext } from "@/lib/ai-assistant/room-finder-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 24_000;
const MAX_MESSAGE_CHARS = 500;
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

  return {
    checkin: raw.checkin,
    checkout: raw.checkout,
    roomCount: raw.roomCount,
    totalGuests: raw.totalGuests,
    guestGroups: Array.isArray(raw.guestGroups) ? raw.guestGroups.slice(0, 3) : undefined,
    currentRoom: raw.currentRoom,
    currentStep: raw.currentStep,
    language: raw.language,
    recentMessages,
  };
}

function noStoreJson(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");
  return NextResponse.json(body, { ...init, headers });
}

export async function POST(request: NextRequest) {
  try {
    if (!isAllowedBrowserOrigin(request)) {
      return noStoreJson({ error: "Forbidden origin.", code: "FORBIDDEN_ORIGIN" }, { status: 403 });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return noStoreJson({ error: "Request is too large.", code: "REQUEST_TOO_LARGE" }, { status: 413 });
    }

    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const context = sanitizeContext(body?.context);

    if (!message) {
      return noStoreJson({ error: "Message is required.", code: "MESSAGE_REQUIRED" }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return noStoreJson({ error: "Message is too long.", code: "MESSAGE_TOO_LONG" }, { status: 400 });
    }
    if (JSON.stringify(context).length > MAX_CONTEXT_CHARS) {
      return noStoreJson({ error: "Conversation context is too large.", code: "CONTEXT_TOO_LARGE" }, { status: 400 });
    }

    const rate = await checkDistributedRateLimit(getClientIp(request));
    if (rate.limited) {
      return noStoreJson(
        { error: "Too many requests. Please try again shortly.", code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
      );
    }

    const command = await interpretRoomFinderMessage(message, context);
    return noStoreJson({ ok: true, command });
  } catch (error) {
    console.error("AI Room Finder intent endpoint error", error);
    const timeout = isAbortError(error);
    return noStoreJson(
      {
        error: timeout ? "AI interpreter timed out." : "AI interpreter is temporarily unavailable.",
        code: timeout ? "AI_TIMEOUT" : "AI_UNAVAILABLE",
      },
      { status: timeout ? 504 : 502 },
    );
  }
}

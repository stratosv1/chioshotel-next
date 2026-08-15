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
const BURST_WINDOW_MS = 60_000;
const BURST_MAX_REQUESTS = 8;
const HOUR_WINDOW_MS = 60 * 60_000;
const HOUR_MAX_REQUESTS = 60;

type RateLimitEntry = { count: number; resetAt: number };
type GlobalWithInterpreterRateLimit = typeof globalThis & {
  __roomFinderInterpreterRateLimit?: Map<string, RateLimitEntry>;
};

const globalStore = globalThis as GlobalWithInterpreterRateLimit;
const rateLimitStore = globalStore.__roomFinderInterpreterRateLimit ?? new Map<string, RateLimitEntry>();
globalStore.__roomFinderInterpreterRateLimit = rateLimitStore;

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function consumeRateLimit(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterSeconds: 0 };
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return {
    limited: current.count > maxRequests,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  if (rateLimitStore.size > 500) {
    for (const [key, entry] of rateLimitStore) {
      if (entry.resetAt <= now) rateLimitStore.delete(key);
    }
  }

  const burst = consumeRateLimit(`${ip}:burst`, BURST_MAX_REQUESTS, BURST_WINDOW_MS);
  const hourly = consumeRateLimit(`${ip}:hour`, HOUR_MAX_REQUESTS, HOUR_WINDOW_MS);

  if (burst.limited) return burst;
  if (hourly.limited) return hourly;
  return { limited: false, retryAfterSeconds: 0 };
}

function isAllowedBrowserOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    return hostname === "chioshotel.gr"
      || hostname === "www.chioshotel.gr"
      || hostname.endsWith(".vercel.app");
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

    const ip = getClientIp(request);
    const rate = checkRateLimit(ip);
    if (rate.limited) {
      return noStoreJson(
        { error: "Too many requests. Please try again shortly.", code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
      );
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

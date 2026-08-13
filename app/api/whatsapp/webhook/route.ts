import { after, NextRequest, NextResponse } from "next/server";

import {
  applyWhatsAppStatusEvent,
  logMarketingOptOut,
} from "@/lib/whatsapp/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const username = process.env.STAFF_USERNAME;
  const password = process.env.STAFF_PASSWORD;
  if (!username || !password) return false;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return false;
    return decoded.slice(0, separatorIndex) === username && decoded.slice(separatorIndex + 1) === password;
  } catch {
    return false;
  }
}

function normalizedText(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isStopOffersMessage(message: Record<string, unknown>) {
  const type = normalizedText(message.type);
  const button = message.button && typeof message.button === "object" ? message.button as Record<string, unknown> : null;
  const interactive = message.interactive && typeof message.interactive === "object" ? message.interactive as Record<string, unknown> : null;
  const buttonReply = interactive?.button_reply && typeof interactive.button_reply === "object"
    ? interactive.button_reply as Record<string, unknown>
    : null;
  const textObject = message.text && typeof message.text === "object" ? message.text as Record<string, unknown> : null;

  const candidates = [
    type === "button" ? button?.text : "",
    type === "button" ? button?.payload : "",
    buttonReply?.title,
    buttonReply?.id,
    type === "text" ? textObject?.body : "",
  ].map(normalizedText);

  return candidates.some((candidate) => candidate === "stop offers" || candidate === "unsubscribe");
}

function getOptOutText(message: Record<string, unknown>) {
  const button = message.button && typeof message.button === "object" ? message.button as Record<string, unknown> : null;
  const interactive = message.interactive && typeof message.interactive === "object" ? message.interactive as Record<string, unknown> : null;
  const buttonReply = interactive?.button_reply && typeof interactive.button_reply === "object"
    ? interactive.button_reply as Record<string, unknown>
    : null;
  const textObject = message.text && typeof message.text === "object" ? message.text as Record<string, unknown> : null;

  for (const value of [button?.text, buttonReply?.title, textObject?.body]) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "Stop offers";
}

async function processWebhook(body: unknown) {
  if (!body || typeof body !== "object") return;
  const entries = (body as { entry?: unknown }).entry;
  if (!Array.isArray(entries)) return;

  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const changes = (entry as { changes?: unknown }).changes;
    if (!Array.isArray(changes)) continue;

    for (const change of changes) {
      if (!change || typeof change !== "object") continue;
      const value = (change as { value?: unknown }).value;
      if (!value || typeof value !== "object") continue;
      const valueRecord = value as Record<string, unknown>;

      const statuses = valueRecord.statuses;
      if (Array.isArray(statuses)) {
        for (const status of statuses) {
          if (status && typeof status === "object") {
            await applyWhatsAppStatusEvent(status as Record<string, unknown>);
          }
        }
      }

      const messages = valueRecord.messages;
      if (Array.isArray(messages)) {
        for (const rawMessage of messages) {
          if (!rawMessage || typeof rawMessage !== "object") continue;
          const message = rawMessage as Record<string, unknown>;
          if (!isStopOffersMessage(message)) continue;

          const from = typeof message.from === "string" ? message.from : "";
          const messageId = typeof message.id === "string" ? message.id : "";
          if (!from || !messageId) continue;

          await logMarketingOptOut({
            from,
            messageId,
            text: getOptOutText(message),
            rawMessage: message,
          });
        }
      }
    }
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  after(async () => {
    try {
      await processWebhook(body);
    } catch (error) {
      console.error("WhatsApp webhook processing failed", error);
    }
  });

  return NextResponse.json(
    { ok: true, received: true },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}

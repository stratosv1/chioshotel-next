import { NextRequest, NextResponse } from "next/server";

import {
  D360ApiError,
  getWhatsAppWebhookConfig,
  setWhatsAppWebhookConfig,
} from "@/lib/whatsapp/360dialog";
import { getWhatsAppTracking } from "@/lib/whatsapp/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "X-Robots-Tag": "noindex, nofollow",
  };
}

function unauthorized() {
  return new NextResponse(JSON.stringify({ ok: false, message: "Unauthorized" }), {
    status: 401,
    headers: {
      ...noStoreHeaders(),
      "Content-Type": "application/json",
      "WWW-Authenticate": 'Basic realm="Voulamandis Staff"',
    },
  });
}

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

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: noStoreHeaders() });
}

function providerError(error: unknown) {
  if (error instanceof D360ApiError) {
    return json({
      ok: false,
      message: error.message,
      providerStatus: error.status,
      providerResponse: error.details,
    }, error.status >= 400 && error.status < 600 ? error.status : 502);
  }

  const message = error instanceof Error ? error.message : "Unexpected WhatsApp tracking error.";
  return json({ ok: false, message }, 500);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const phones = (searchParams.get("phones") || "")
      .split(",")
      .map((phone) => phone.trim())
      .filter(Boolean)
      .slice(0, 500);
    const includeProvider = searchParams.get("includeProvider") === "1";

    const tracking = await getWhatsAppTracking(phones);
    const webhook = includeProvider ? await getWhatsAppWebhookConfig() : undefined;

    return json({ ok: true, tracking, ...(includeProvider ? { webhook } : {}) });
  } catch (error) {
    return providerError(error);
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, message: "Invalid JSON body." }, 400);
  }

  if (body.action !== "configure_webhook") {
    return json({ ok: false, message: "Unsupported action." }, 400);
  }

  const username = process.env.STAFF_USERNAME;
  const password = process.env.STAFF_PASSWORD;
  if (!username || !password) return json({ ok: false, message: "Staff credentials are not configured." }, 500);

  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  const host = forwardedHost || request.headers.get("host") || requestUrl.host;

  if (!host || host.endsWith(".vercel.app")) {
    return json({
      ok: false,
      message: "Webhook configuration is only enabled from the production chioshotel.gr deployment.",
    }, 409);
  }

  const webhookUrl = `${forwardedProto}://${host}/api/whatsapp/webhook`;
  const authorization = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

  try {
    const result = await setWhatsAppWebhookConfig({
      url: webhookUrl,
      headers: { Authorization: authorization },
    });

    return json({ ok: true, webhookUrl, result });
  } catch (error) {
    return providerError(error);
  }
}

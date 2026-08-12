import { NextRequest, NextResponse } from "next/server";

import {
  D360ApiError,
  D360TemplateComponent,
  listWhatsAppTemplates,
  sendWhatsAppTemplateMessage,
} from "@/lib/whatsapp/360dialog";

export const runtime = "nodejs";

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "X-Robots-Tag": "noindex, nofollow",
  };
}

function unauthorized() {
  return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
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

  if (!username || !password) {
    return false;
  }

  const header = request.headers.get("authorization");

  if (!header?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    return (
      decoded.slice(0, separatorIndex) === username &&
      decoded.slice(separatorIndex + 1) === password
    );
  } catch {
    return false;
  }
}

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: noStoreHeaders(),
  });
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function providerError(error: unknown) {
  if (error instanceof D360ApiError) {
    return jsonResponse(
      {
        ok: false,
        message: error.message,
        providerStatus: error.status,
        providerResponse: error.details,
      },
      error.status >= 400 && error.status < 600 ? error.status : 502,
    );
  }

  const message = error instanceof Error ? error.message : "Unexpected WhatsApp integration error.";
  return jsonResponse({ ok: false, message }, 500);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  try {
    const templates = await listWhatsAppTemplates();

    return jsonResponse({
      ok: true,
      provider: "360dialog",
      configured: Boolean(process.env.D360_API_KEY),
      templates,
    });
  } catch (error) {
    return providerError(error);
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse({ ok: false, message: "Invalid JSON body." }, 400);
  }

  const to = cleanString(body.to);
  const templateName = cleanString(body.templateName);
  const languageCode = cleanString(body.languageCode);
  const components = body.components;

  if (!to || !templateName || !languageCode) {
    return jsonResponse(
      {
        ok: false,
        message: "to, templateName and languageCode are required.",
      },
      400,
    );
  }

  if (!/^[a-z0-9_]+$/.test(templateName)) {
    return jsonResponse(
      {
        ok: false,
        message: "templateName must contain only lowercase letters, numbers and underscores.",
      },
      400,
    );
  }

  if (!/^[A-Za-z]{2,3}(?:_[A-Za-z]{2})?$/.test(languageCode)) {
    return jsonResponse({ ok: false, message: "Invalid languageCode." }, 400);
  }

  if (components !== undefined && !Array.isArray(components)) {
    return jsonResponse({ ok: false, message: "components must be an array when provided." }, 400);
  }

  try {
    const result = await sendWhatsAppTemplateMessage({
      to,
      templateName,
      languageCode,
      components: components as D360TemplateComponent[] | undefined,
    });

    return jsonResponse({
      ok: true,
      provider: "360dialog",
      result,
    });
  } catch (error) {
    return providerError(error);
  }
}

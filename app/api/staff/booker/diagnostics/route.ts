import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const beds24BaseUrl = "https://beds24.com/api/v2";

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "X-Robots-Tag": "noindex, nofollow",
  };
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: noStoreHeaders() });
}

function isAuthorized(request: NextRequest) {
  const username = process.env.STAFF_USERNAME;
  const password = process.env.STAFF_PASSWORD;
  if (!username || !password) return false;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;
    return decoded.slice(0, separator) === username && decoded.slice(separator + 1) === password;
  } catch {
    return false;
  }
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

function fingerprint(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

function safeBeds24Error(data: unknown) {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const allowedKeys = ["error", "message", "detail", "code", "success", "status"];
  const result: Record<string, unknown> = {};

  for (const key of allowedKeys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      result[key] = value;
    }
  }

  return Object.keys(result).length ? result : null;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const refreshToken = process.env.BEDS24_REFRESH_TOKEN?.trim() || "";
  if (!refreshToken) {
    return json({
      configured: false,
      environment: process.env.VERCEL_ENV || "unknown",
      deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA || null,
      message: "BEDS24_REFRESH_TOKEN is not configured in this deployment.",
    }, 503);
  }

  const tokenResponse = await fetch(`${beds24BaseUrl}/authentication/token`, {
    method: "GET",
    headers: {
      accept: "application/json",
      refreshToken,
    },
    cache: "no-store",
  });

  const tokenData = await tokenResponse.json().catch(() => null) as Record<string, unknown> | null;

  return json({
    configured: true,
    environment: process.env.VERCEL_ENV || "unknown",
    deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA || null,
    refreshCredential: {
      prefix: refreshToken.slice(0, 3),
      length: refreshToken.length,
      fingerprint: fingerprint(refreshToken),
    },
    beds24Authentication: {
      httpStatus: tokenResponse.status,
      ok: tokenResponse.ok,
      tokenIssued: Boolean(tokenData?.token),
      expiresIn: typeof tokenData?.expiresIn === "number" ? tokenData.expiresIn : null,
      refreshTokenReturned: Boolean(tokenData?.refreshToken),
      error: safeBeds24Error(tokenData),
    },
  }, tokenResponse.ok ? 200 : 502);
}

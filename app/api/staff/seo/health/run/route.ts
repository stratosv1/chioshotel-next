import { NextRequest, NextResponse } from "next/server";
import { runWeeklySeoHealth } from "@/lib/seo-health/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAuthorized(request: NextRequest) {
  const expectedUser = process.env.STAFF_USERNAME;
  const expectedPass = process.env.STAFF_PASSWORD;
  if (!expectedUser || !expectedPass) return false;

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    return (
      separator > -1 &&
      decoded.slice(0, separator) === expectedUser &&
      decoded.slice(separator + 1) === expectedPass
    );
  } catch {
    return false;
  }
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return json({ ok: false, error: "Unauthorized" }, 401);
  if (!isSameOrigin(request)) return json({ ok: false, error: "Cross-origin request rejected" }, 403);

  try {
    const result = await runWeeklySeoHealth(request, {
      siteUrl: "sc-domain:chioshotel.gr",
    });

    return json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[seo-health] manual full audit failed", error);
    return json({ ok: false, error: message }, 500);
  }
}

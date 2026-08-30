import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const beds24BaseUrl = "https://beds24.com/api/v2";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
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
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization");

  if (!cronSecret) {
    console.error("[beds24-refresh-keepalive] CRON_SECRET is not configured.");
    return json({ ok: false, error: "Cron security is not configured." }, 503);
  }

  if (authorization !== `Bearer ${cronSecret}`) {
    return json({ ok: false, error: "Unauthorized." }, 401);
  }

  const refreshToken = process.env.BEDS24_REFRESH_TOKEN?.trim();
  if (!refreshToken) {
    console.error("[beds24-refresh-keepalive] BEDS24_REFRESH_TOKEN is not configured.");
    return json({ ok: false, error: "Beds24 refresh credential is not configured." }, 503);
  }

  try {
    const tokenResponse = await fetch(`${beds24BaseUrl}/authentication/token`, {
      method: "GET",
      headers: {
        accept: "application/json",
        refreshToken,
      },
      cache: "no-store",
    });

    const tokenData = await tokenResponse.json().catch(() => null) as Record<string, unknown> | null;
    const tokenIssued = Boolean(tokenData?.token);

    if (!tokenResponse.ok || !tokenIssued) {
      console.error("[beds24-refresh-keepalive] Beds24 authentication failed.", {
        httpStatus: tokenResponse.status,
        error: safeBeds24Error(tokenData),
      });

      return json({
        ok: false,
        beds24Authentication: {
          httpStatus: tokenResponse.status,
          tokenIssued,
          error: safeBeds24Error(tokenData),
        },
      }, 502);
    }

    console.info("[beds24-refresh-keepalive] Beds24 refresh credential validated successfully.", {
      httpStatus: tokenResponse.status,
      expiresIn: typeof tokenData?.expiresIn === "number" ? tokenData.expiresIn : null,
    });

    return json({
      ok: true,
      beds24Authentication: {
        httpStatus: tokenResponse.status,
        tokenIssued: true,
        expiresIn: typeof tokenData?.expiresIn === "number" ? tokenData.expiresIn : null,
      },
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[beds24-refresh-keepalive] Request failed.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return json({ ok: false, error: "Beds24 keepalive request failed." }, 502);
  }
}

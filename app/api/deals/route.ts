import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 1800;

const DEFAULT_GOOGLE_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbzSK2Y12vl4RZJvbbcxIkzAl4un93fQManKZ96BGyLsp-vv6j9NQboYnwnc6GtUvOBj/exec";

function getGoogleWebAppUrl() {
  return process.env.GOOGLE_BOOKING_WEBAPP_URL || DEFAULT_GOOGLE_WEBAPP_URL;
}

async function fetchDealsWithGet() {
  const url = new URL(getGoogleWebAppUrl());
  url.searchParams.set("action", "cachedDeals");

  return fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json,text/plain,*/*",
      "User-Agent": "VoulamandisHouseNext/1.0",
    },
    next: {
      revalidate: 1800,
    },
  });
}

async function fetchDealsWithPost() {
  return fetch(getGoogleWebAppUrl(), {
    method: "POST",
    headers: {
      Accept: "application/json,text/plain,*/*",
      "Content-Type": "application/json",
      "User-Agent": "VoulamandisHouseNext/1.0",
    },
    body: JSON.stringify({
      action: "cachedDeals",
    }),
    next: {
      revalidate: 1800,
    },
  });
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  try {
    return {
      text,
      json: JSON.parse(text),
    };
  } catch {
    return {
      text,
      json: null,
    };
  }
}

export async function GET() {
  try {
    let response = await fetchDealsWithGet();
    let parsed = await readJsonResponse(response);
    let method = "GET";

    if (!response.ok || !parsed.json || typeof parsed.json !== "object") {
      response = await fetchDealsWithPost();
      parsed = await readJsonResponse(response);
      method = "POST fallback";
    }

    if (!response.ok || !parsed.json || typeof parsed.json !== "object") {
      return NextResponse.json(
        {
          ok: false,
          error: "Could not fetch deals from Google Apps Script.",
          source: "NEXT_DEALS_PROXY_ERROR",
          debug: {
            method,
            status: response.status,
            bodyPreview: parsed.text.slice(0, 500),
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ...parsed.json,
        servedBy: "NEXT",
        servedAt: new Date().toISOString(),
        nextCache: {
          revalidateSeconds: 1800,
          fetchMethod: method,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=1800, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown deals proxy error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
        source: "NEXT_DEALS_PROXY_EXCEPTION",
      },
      { status: 500 }
    );
  }
}

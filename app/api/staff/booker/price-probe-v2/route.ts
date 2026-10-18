import { NextRequest, NextResponse } from "next/server";

// Staff-only, read-only diagnostic: compares what the Beds24 API v2 returns for
// daily prices (calendar) and for computed offers, so we can decide how the site
// should read prices directly from Beds24 instead of via the Apps Script.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const beds24BaseUrl = "https://beds24.com/api/v2";
const ROOM_IDS = ["268803", "267788", "626129", "345347", "265595"];

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
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
    const i = decoded.indexOf(":");
    return i >= 0 && decoded.slice(0, i) === username && decoded.slice(i + 1) === password;
  } catch {
    return false;
  }
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function beds24Get(path: string, token: string) {
  const response = await fetch(`${beds24BaseUrl}${path}`, {
    headers: { accept: "application/json", token },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const body = await response.json().catch(() => null);
  return { status: response.status, body };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", "WWW-Authenticate": 'Basic realm="Voulamandis Staff"' },
    });
  }

  const refreshToken = process.env.BEDS24_REFRESH_TOKEN?.trim();
  if (!refreshToken) return json({ error: "BEDS24_REFRESH_TOKEN missing" }, 503);

  const tokenRes = await fetch(`${beds24BaseUrl}/authentication/token`, {
    headers: { accept: "application/json", refreshToken },
    cache: "no-store",
  });
  const tokenData = (await tokenRes.json().catch(() => null)) as Record<string, unknown> | null;
  const token = typeof tokenData?.token === "string" ? tokenData.token : "";
  if (!token) return json({ error: "token_failed", status: tokenRes.status }, 502);

  const params = request.nextUrl.searchParams;
  const start = params.get("start") || isoDate(new Date());
  const days = Math.min(Math.max(Number(params.get("days") || 14), 1), 60);
  const endDate = new Date(`${start}T12:00:00Z`);
  endDate.setUTCDate(endDate.getUTCDate() + days - 1);
  const end = isoDate(endDate);
  const nextDay = new Date(`${start}T12:00:00Z`);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const roomQuery = ROOM_IDS.map((id) => `roomId=${id}`).join("&");

  const scopes = await beds24Get("/authentication/details", token);
  const [calendar, offers2, offers4] = await Promise.all([
    beds24Get(
      `/inventory/rooms/calendar?${roomQuery}&startDate=${start}&endDate=${end}` +
        "&includePrices=true&includeNumAvail=true&includeMinStay=true&includeMaxStay=true",
      token,
    ),
    beds24Get(`/inventory/rooms/offers?${roomQuery}&arrival=${start}&departure=${isoDate(nextDay)}&numAdults=2`, token),
    beds24Get(`/inventory/rooms/offers?${roomQuery}&arrival=${start}&departure=${isoDate(nextDay)}&numAdults=4`, token),
  ]);

  const scopeBody = scopes.body as Record<string, unknown> | null;
  return json({
    range: { start, end },
    tokenInfo: {
      expiresIn: tokenData?.expiresIn ?? null,
      tokenLength: token.length,
      detailsStatus: scopes.status,
      details: JSON.parse(JSON.stringify(scopeBody ?? null, (k, v) => (/token/i.test(k) && typeof v === "string" ? "[hidden]" : v))),
    },
    calendar,
    offers: { adults2: offers2, adults4: offers4 },
  });
}

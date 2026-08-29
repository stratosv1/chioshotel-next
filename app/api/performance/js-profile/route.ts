const MAX_BODY_BYTES = 4_096;
const MAX_PATH_LENGTH = 240;
const ALLOWED_MARKERS = ["script", "gc", "style", "layout", "paint", "other", "unknown"] as const;

type MarkerName = (typeof ALLOWED_MARKERS)[number];

type ProfilePayload = {
  version?: unknown;
  path?: unknown;
  chromeMajor?: unknown;
  durationMs?: unknown;
  sampleIntervalMs?: unknown;
  sampleCount?: unknown;
  markers?: unknown;
  crossOriginIsolated?: unknown;
  navigationType?: unknown;
};

function finiteNumber(value: unknown, min: number, max: number): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    return null;
  }
  return value;
}

function sameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const host = request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) {
    return new Response(null, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  let body: ProfilePayload;
  try {
    body = (await request.json()) as ProfilePayload;
  } catch {
    return new Response(null, { status: 400 });
  }

  const path = typeof body.path === "string" && body.path.startsWith("/")
    ? body.path.slice(0, MAX_PATH_LENGTH)
    : null;
  const chromeMajor = finiteNumber(body.chromeMajor, 153, 999);
  const durationMs = finiteNumber(body.durationMs, 100, 10_000);
  const sampleIntervalMs = finiteNumber(body.sampleIntervalMs, 1, 1_000);
  const sampleCount = finiteNumber(body.sampleCount, 0, 2_000);

  if (!path || chromeMajor === null || durationMs === null || sampleIntervalMs === null || sampleCount === null) {
    return new Response(null, { status: 400 });
  }

  const markerSource = body.markers && typeof body.markers === "object"
    ? (body.markers as Record<string, unknown>)
    : {};

  const markers = Object.fromEntries(
    ALLOWED_MARKERS.map((marker) => [
      marker,
      Math.round(finiteNumber(markerSource[marker], 0, 2_000) ?? 0),
    ]),
  ) as Record<MarkerName, number>;

  const record = {
    event: "js-self-profiling-markers-v1",
    receivedAt: new Date().toISOString(),
    path,
    chromeMajor: Math.round(chromeMajor),
    durationMs: Math.round(durationMs),
    sampleIntervalMs: Math.round(sampleIntervalMs),
    sampleCount: Math.round(sampleCount),
    markers,
    crossOriginIsolated: body.crossOriginIsolated === true,
    navigationType:
      typeof body.navigationType === "string" ? body.navigationType.slice(0, 32) : "unknown",
  };

  // Store only aggregated marker counts in runtime logs. No raw stacks, URLs, frames,
  // IP addresses or user-agent strings are persisted by this application code.
  console.info("[JS_SELF_PROFILE_MARKERS]", JSON.stringify(record));

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

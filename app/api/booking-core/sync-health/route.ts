import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SOURCE_HEALTH_ACTION = "booking_core_health";
const SOURCE_TIMEOUT_MS = 12_000;
const DEFAULT_MAX_SOURCE_AGE_MINUTES = 45;

function text(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function isAuthorized(request: NextRequest) {
  const expected = text(process.env.CRON_SECRET);
  const authorization = text(request.headers.get("authorization"));
  return Boolean(expected && authorization === `Bearer ${expected}`);
}

async function fetchSourceHealth(baseUrl: string, secret: string) {
  const url = new URL(baseUrl);
  url.searchParams.set("action", SOURCE_HEALTH_ACTION);
  url.searchParams.set("_ts", String(Date.now()));
  if (secret) url.searchParams.set("secret", secret);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SOURCE_TIMEOUT_MS);
  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    const raw = await response.text();
    if (!response.ok) throw new Error(`Google Script health returned HTTP ${response.status}`);

    let payload: any;
    try {
      payload = JSON.parse(raw);
    } catch {
      throw new Error(`Google Script health did not return JSON. Body: ${raw.slice(0, 250)}`);
    }

    if (text(payload?.type) !== SOURCE_HEALTH_ACTION) {
      throw new Error(`Unexpected Google Script health type: ${text(payload?.type) || "EMPTY"}`);
    }

    const lastRefreshCompletedAt = text(payload?.lastRefreshCompletedAt);
    const lastRefreshMs = lastRefreshCompletedAt ? new Date(lastRefreshCompletedAt).getTime() : 0;
    if (!lastRefreshMs || Number.isNaN(lastRefreshMs)) {
      throw new Error("Google Script health has no valid lastRefreshCompletedAt");
    }

    return {
      refreshState: text(payload?.refreshState).toUpperCase(),
      lastRefreshCompletedAt,
      lastRefreshMs,
      lastPushError: text(payload?.lastPushError),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchSourceHealthWithRetry(baseUrl: string, secret: string) {
  try {
    return await fetchSourceHealth(baseUrl, secret);
  } catch (firstError) {
    await new Promise(resolve => setTimeout(resolve, 1_500));
    try {
      return await fetchSourceHealth(baseUrl, secret);
    } catch (secondError) {
      const first = firstError instanceof Error ? firstError.message : String(firstError);
      const second = secondError instanceof Error ? secondError.message : String(secondError);
      throw new Error(`Source health failed twice: ${first}; retry: ${second}`);
    }
  }
}

async function sendAlertEmail(reason: string) {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || "465");
  const smtpUser = text(process.env.SMTP_USER);
  const smtpPass = text(process.env.SMTP_PASS);
  const smtpFrom = text(process.env.SMTP_FROM) || smtpUser;
  const alertTo = text(process.env.BOOKING_CORE_ALERT_TO) || "evoulamandis@gmail.com";

  if (!smtpUser || !smtpPass || !smtpFrom || !alertTo) {
    throw new Error("Booking Core alert email is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.verify();
  const subject = "Booking Core alert: source health is stale";
  const body = [
    "Το Web App δεν επιβεβαιώνει πλέον ασφαλή και πρόσφατη πηγή availability.",
    `Αιτία: ${reason}`,
    "Το AI Room Finder θα απορρίπτει availability μέχρι να αποκατασταθεί η πηγή.",
  ].join("\n\n");

  const info = await transporter.sendMail({
    from: `"Voulamandis House Booking Core" <${smtpFrom}>`,
    to: alertTo,
    subject,
    text: body,
  });

  const accepted = (info.accepted || []).map(String).map(value => value.toLowerCase());
  if (!accepted.includes(alertTo.toLowerCase())) {
    throw new Error("Booking Core alert email was not accepted by SMTP server");
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const databaseUrl = text(process.env.DATABASE_URL);
  const scriptUrl = text(process.env.OCCUPANCY_SCRIPT_URL);
  const scriptSecret = text(process.env.OCCUPANCY_SCRIPT_SECRET);
  const configuredAge = Number(process.env.BOOKING_CORE_SOURCE_MAX_AGE_MINUTES || DEFAULT_MAX_SOURCE_AGE_MINUTES);
  const maxAgeMinutes = Number.isFinite(configuredAge) && configuredAge >= 20 ? configuredAge : DEFAULT_MAX_SOURCE_AGE_MINUTES;

  if (!databaseUrl) return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });
  if (!scriptUrl) return NextResponse.json({ ok: false, error: "OCCUPANCY_SCRIPT_URL is missing" }, { status: 500 });

  const sql = neon(databaseUrl);
  let healthy = false;
  let reason = "";
  let lastRefreshCompletedAt = "";
  let ageMinutes: number | null = null;

  try {
    const source = await fetchSourceHealthWithRetry(scriptUrl, scriptSecret);
    lastRefreshCompletedAt = source.lastRefreshCompletedAt;
    ageMinutes = (Date.now() - source.lastRefreshMs) / 60_000;

    if (source.refreshState === "ERROR") {
      reason = "Google Script refreshState is ERROR";
    } else if (source.lastPushError) {
      reason = `Pending Booking Core push error: ${source.lastPushError}`;
    } else if (ageMinutes > maxAgeMinutes) {
      reason = `Last successful Web App refresh is ${Math.round(ageMinutes)} minutes old`;
    } else {
      healthy = true;
    }
  } catch (error) {
    reason = error instanceof Error ? error.message : String(error);
  }

  try {
    const currentRows = await sql`
      select text_value
      from booking_core.settings
      where setting_key = 'source_health_status'
      limit 1
    `;
    const current = text((currentRows as any[])[0]?.text_value).toUpperCase() || "UNKNOWN";
    const desired = healthy ? "READY" : "STALE";
    const stateChanged = current !== desired;

    if (stateChanged) {
      await sql`
        insert into booking_core.settings(setting_key, text_value, description)
        values (
          ${"source_health_status"},
          ${desired},
          ${"Event-driven Booking Core source health. READY allows inventory reads; STALE fails closed."}
        )
        on conflict (setting_key) do update
        set text_value = excluded.text_value,
            description = excluded.description
      `;
    }

    if (!healthy && stateChanged) {
      try {
        await sendAlertEmail(reason || "Unknown source health failure");
      } catch (emailError) {
        console.error("booking_core source health alert email failed", emailError);
      }
    }

    return NextResponse.json({
      ok: healthy,
      healthy,
      sourceHealth: desired,
      stateChanged,
      maxAgeMinutes,
      ageMinutes: ageMinutes === null ? null : Math.round(ageMinutes * 100) / 100,
      lastRefreshCompletedAt: lastRefreshCompletedAt || null,
      reason: healthy ? null : reason,
    }, {
      status: healthy ? 200 : 503,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
    });
  } catch (error) {
    console.error("booking_core sync health check failed", error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Sync health check failed" }, {
      status: 503,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
    });
  }
}

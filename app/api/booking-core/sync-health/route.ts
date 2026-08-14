import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function text(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function isAuthorized(request: NextRequest) {
  const expected = text(process.env.CRON_SECRET);
  const authorization = text(request.headers.get("authorization"));
  return Boolean(expected && authorization === `Bearer ${expected}`);
}

async function sendAlertEmail(minutes: number, lastSuccess: string, lastError: string) {
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
  const subject = `Booking Core alert: ${minutes} λεπτά χωρίς επιτυχημένο sync`;
  const body = [
    `Έχουν περάσει τουλάχιστον ${minutes} λεπτά χωρίς επιτυχημένο sync στη Neon.`,
    `Τελευταίο επιτυχημένο sync: ${lastSuccess}`,
    lastError ? `Τελευταίο καταγεγραμμένο error: ${lastError}` : "Δεν υπάρχει καταγεγραμμένο error μετά το τελευταίο επιτυχημένο sync.",
    "Το AI Room Finder θα θεωρεί τα δεδομένα stale μέχρι να ολοκληρωθεί νέο επιτυχημένο sync.",
  ].join("\n\n");

  const info = await transporter.sendMail({
    from: `"Voulamandis House Booking Core" <${smtpFrom}>`,
    to: alertTo,
    subject,
    text: body,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#222"><h2>Booking Core sync alert</h2><p>Έχουν περάσει τουλάχιστον <strong>${minutes} λεπτά</strong> χωρίς επιτυχημένο sync στη Neon.</p><p><strong>Τελευταίο επιτυχημένο sync:</strong> ${lastSuccess}</p>${lastError ? `<p><strong>Τελευταίο error:</strong> ${lastError.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>` : ""}<p>Το AI Room Finder θα θεωρεί τα δεδομένα stale μέχρι να ολοκληρωθεί νέο επιτυχημένο sync.</p></div>`,
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
  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });
  }

  try {
    const sql = neon(databaseUrl);
    const rows = await sql`
      with cfg as (
        select coalesce(
          (select numeric_value from booking_core.settings where setting_key = 'max_inventory_age_minutes'),
          30
        )::integer as max_age
      ), last_ok as (
        select max(completed_at) as completed_at
        from booking_core.sync_runs
        where status = 'ok'
      ), last_alert as (
        select max(completed_at) as completed_at
        from booking_core.sync_runs
        where status = 'alerted' and source = 'sync_health_monitor'
      )
      select
        cfg.max_age,
        last_ok.completed_at as last_success,
        last_alert.completed_at as last_alert,
        extract(epoch from (now() - last_ok.completed_at)) / 60.0 as age_minutes
      from cfg cross join last_ok cross join last_alert
    `;

    const state = (rows as any[])[0] || {};
    const maxAge = Number(state.max_age || 30);
    const lastSuccess = state.last_success ? new Date(state.last_success).toISOString() : "";
    const lastAlert = state.last_alert ? new Date(state.last_alert).getTime() : 0;
    const lastSuccessMs = state.last_success ? new Date(state.last_success).getTime() : 0;
    const ageMinutes = Number(state.age_minutes || 0);

    if (!lastSuccess) {
      return NextResponse.json({ ok: false, healthy: false, code: "NO_SUCCESSFUL_SYNC" }, { status: 503 });
    }

    if (ageMinutes < maxAge) {
      return NextResponse.json({ ok: true, healthy: true, maxAgeMinutes: maxAge, ageMinutes: Math.round(ageMinutes * 100) / 100, lastSuccess }, { headers: { "Cache-Control": "no-store" } });
    }

    const alreadyAlertedForIncident = lastAlert > lastSuccessMs;
    if (alreadyAlertedForIncident) {
      return NextResponse.json({ ok: true, healthy: false, stale: true, alerted: false, maxAgeMinutes: maxAge, ageMinutes: Math.round(ageMinutes * 100) / 100, lastSuccess }, { headers: { "Cache-Control": "no-store" } });
    }

    const errorRows = await sql`
      select error_message
      from booking_core.sync_runs
      where status = 'error' and completed_at > ${lastSuccess}::timestamptz
      order by completed_at desc
      limit 1
    `;
    const lastError = text((errorRows as any[])[0]?.error_message);

    await sendAlertEmail(maxAge, lastSuccess, lastError);
    await sql`
      insert into booking_core.sync_runs (
        started_at,
        completed_at,
        status,
        source,
        error_message
      ) values (
        now(),
        now(),
        ${"alerted"},
        ${"sync_health_monitor"},
        ${`Stale sync alert sent after ${maxAge} minutes without successful sync`.slice(0, 4000)}
      )
    `;

    return NextResponse.json({ ok: true, healthy: false, stale: true, alerted: true, maxAgeMinutes: maxAge, ageMinutes: Math.round(ageMinutes * 100) / 100, lastSuccess }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("booking_core sync health check failed", error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Sync health check failed" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
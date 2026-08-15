import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";

type PricingSourceRow = {
  date: string;
  roomId: string;
  unitId: string;
  label: string;
  price: number | null;
  available: boolean;
  reason: string;
};

export type PriceChange = {
  date: string;
  label: string;
  before: number;
  after: number;
};

type PricingIssue = {
  issue_type: "PRICE_MISMATCH";
  stay_date: string;
  guests: number;
  room_number: number;
  display_name: string;
  base_price: number | null;
  guest_supplement: number | null;
  kitchen_adjustment: number | null;
  effective_price: number | null;
  expected_price: number | null;
  difference: number | null;
};

export type PricingAuditResult = {
  triggered: boolean;
  priceChanges: number;
  issues: number;
  emailSent: boolean;
  pendingAlert: boolean;
  auditError?: string;
};

function text(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function money(value: number | null | undefined) {
  return value === null || value === undefined || !Number.isFinite(value) ? "—" : `€${value.toFixed(2)}`;
}

function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function sendPricingAlertEmail(body: string) {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || "465");
  const smtpUser = text(process.env.SMTP_USER);
  const smtpPass = text(process.env.SMTP_PASS);
  const smtpFrom = text(process.env.SMTP_FROM) || smtpUser;
  const alertTo = text(process.env.BOOKING_CORE_ALERT_TO) || "evoulamandis@gmail.com";

  if (!smtpUser || !smtpPass || !smtpFrom || !alertTo) {
    throw new Error("Booking Core pricing alert email is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.verify();
  const info = await transporter.sendMail({
    from: `"Voulamandis House Booking Core" <${smtpFrom}>`,
    to: alertTo,
    subject: "Booking Core pricing alert",
    text: body,
  });

  const accepted = (info.accepted || []).map(String).map(value => value.toLowerCase());
  if (!accepted.includes(alertTo.toLowerCase())) {
    throw new Error("Booking Core pricing alert email was not accepted by SMTP server");
  }
}

async function createPendingAlert(databaseUrl: string, sourceGeneratedAt: string, body: string) {
  const sql = neon(databaseUrl);
  const rows = await sql`
    insert into booking_core.sync_runs (
      started_at,
      completed_at,
      status,
      source,
      source_generated_at,
      error_message
    ) values (
      now(),
      now(),
      ${"pricing_alert_pending"},
      ${"pricing_audit"},
      ${sourceGeneratedAt}::timestamptz,
      ${body}
    )
    returning id
  `;
  return Number((rows as any[])?.[0]?.id || 0);
}

async function markAlertSent(databaseUrl: string, id: number) {
  if (!id) return;
  const sql = neon(databaseUrl);
  await sql`
    update booking_core.sync_runs
    set status = ${"pricing_alerted"}, completed_at = now()
    where id = ${id}
  `;
}

export async function retryPendingPricingAlert(databaseUrl: string) {
  const sql = neon(databaseUrl);
  const rows = await sql`
    select id, error_message
    from booking_core.sync_runs
    where status = ${"pricing_alert_pending"}
      and source = ${"pricing_audit"}
    order by id asc
    limit 1
  `;
  const pending = (rows as any[])?.[0];
  if (!pending?.id || !text(pending.error_message)) return false;

  try {
    await sendPricingAlertEmail(text(pending.error_message));
    await markAlertSent(databaseUrl, Number(pending.id));
    return true;
  } catch (error) {
    console.error("booking_core pricing alert retry failed", error);
    return false;
  }
}

export async function detectPriceChanges(databaseUrl: string, rows: PricingSourceRow[]): Promise<PriceChange[]> {
  const sql = neon(databaseUrl);
  const existing = await sql`
    select
      stay_date::text as date,
      source_room_id,
      source_unit_id,
      base_price
    from booking_core.inventory
    where available = true
      and base_price is not null
  `;

  const currentPrices = new Map<string, number>();
  for (const row of existing as any[]) {
    const current = parseNumber(row.base_price);
    if (current === null) continue;
    currentPrices.set(`${text(row.date)}|${text(row.source_room_id)}|${text(row.source_unit_id)}`, current);
  }

  const changes: PriceChange[] = [];
  for (const row of rows) {
    if (!row.available) continue;
    if (row.price === null || !Number.isFinite(row.price)) continue;

    const key = `${row.date}|${row.roomId}|${row.unitId}`;
    const before = currentPrices.get(key);
    if (before === undefined) continue;
    if (Math.abs(before - row.price) < 0.005) continue;

    changes.push({
      date: row.date,
      label: row.label || `${row.roomId}/${row.unitId}`,
      before,
      after: row.price,
    });
  }

  return changes;
}

async function loadPricingIssues(databaseUrl: string): Promise<PricingIssue[]> {
  const sql = neon(databaseUrl);
  const rows = await sql`
    with cfg as (
      select coalesce(
        max(numeric_value) filter (
          where setting_key = 'apartment_minimum_premium_over_room1_4guests_per_night'
        ),
        10
      ) as apartment_premium
      from booking_core.settings
    ),
    dates as (
      select distinct stay_date
      from booking_core.inventory
      where stay_date >= current_date
    ),
    all_quotes as (
      select
        d.stay_date,
        g.guests,
        q.room_number,
        q.display_name,
        q.available,
        q.base_price,
        q.guest_supplement,
        q.kitchen_adjustment,
        q.effective_price
      from dates d
      cross join (values (1),(2),(3),(4),(5)) as g(guests)
      cross join lateral booking_core.nightly_quotes(
        d.stay_date,
        d.stay_date + 1,
        g.guests
      ) q
      where q.available = true
    ),
    room1 as (
      select stay_date, base_price
      from booking_core.inventory
      where room_number = 1
    ),
    expected as (
      select
        q.*,
        case
          when q.room_number in (8,9,10)
            and q.guests = 4
            and r1.base_price is not null
            and (r1.base_price + 30) >= q.base_price
          then r1.base_price + 30 + cfg.apartment_premium

          when q.room_number = 10
            and q.guests = 5
          then q.base_price + 15

          when q.room_number in (8,9,10)
            and q.guests between 1 and 3
          then q.base_price

          else q.base_price + q.guest_supplement
        end as expected_price
      from all_quotes q
      cross join cfg
      left join room1 r1 on r1.stay_date = q.stay_date
    )
    select
      'PRICE_MISMATCH'::text as issue_type,
      stay_date,
      guests,
      room_number,
      display_name,
      base_price,
      guest_supplement,
      kitchen_adjustment,
      effective_price,
      expected_price,
      effective_price - expected_price as difference
    from expected
    where effective_price is distinct from expected_price
    order by stay_date, guests, room_number
    limit 100
  `;

  return (rows as any[]).map(row => ({
    issue_type: "PRICE_MISMATCH",
    stay_date: text(row.stay_date).slice(0, 10),
    guests: Number(row.guests),
    room_number: Number(row.room_number),
    display_name: text(row.display_name),
    base_price: parseNumber(row.base_price),
    guest_supplement: parseNumber(row.guest_supplement),
    kitchen_adjustment: parseNumber(row.kitchen_adjustment),
    effective_price: parseNumber(row.effective_price),
    expected_price: parseNumber(row.expected_price),
    difference: parseNumber(row.difference),
  }));
}

function buildAlertBody(priceChanges: PriceChange[], issues: PricingIssue[], auditError?: string) {
  const lines = [
    "Booking Core pricing audit detected a problem after a real price change in available Neon inventory.",
    "",
    `Available price changes detected: ${priceChanges.length}`,
  ];

  for (const change of priceChanges.slice(0, 25)) {
    lines.push(`- ${change.date} | ${change.label}: ${money(change.before)} -> ${money(change.after)}`);
  }
  if (priceChanges.length > 25) lines.push(`- ...and ${priceChanges.length - 25} more price changes`);

  lines.push("");
  if (auditError) {
    lines.push("AUDIT EXECUTION ERROR:");
    lines.push(auditError);
    lines.push("");
    lines.push("The new inventory was saved, but the available-room pricing validation could not complete.");
    return lines.join("\n");
  }

  lines.push(`Pricing problems found: ${issues.length}`);
  for (const issue of issues.slice(0, 50)) {
    lines.push(
      `- ${issue.stay_date} | ${issue.guests} guests | ${issue.display_name} (Room ${issue.room_number}) | ` +
      `base ${money(issue.base_price)}, guest extra ${money(issue.guest_supplement)}, apartment adjustment ${money(issue.kitchen_adjustment)}, ` +
      `actual ${money(issue.effective_price)}, expected ${money(issue.expected_price)}, difference ${money(issue.difference)}`
    );
  }
  if (issues.length > 50) lines.push(`- ...and ${issues.length - 50} more pricing problems`);

  lines.push("");
  lines.push("Booked and closed rooms are intentionally excluded from audit results.");
  lines.push("No email is sent when the audit is clean.");
  return lines.join("\n");
}

export async function runPricingAuditAfterPriceChange(
  databaseUrl: string,
  sourceGeneratedAt: string,
  priceChanges: PriceChange[],
): Promise<PricingAuditResult> {
  if (priceChanges.length === 0) {
    return { triggered: false, priceChanges: 0, issues: 0, emailSent: false, pendingAlert: false };
  }

  let issues: PricingIssue[] = [];
  let auditError = "";
  try {
    issues = await loadPricingIssues(databaseUrl);
  } catch (error) {
    auditError = error instanceof Error ? error.message : String(error);
    console.error("booking_core pricing audit failed", error);
  }

  if (!auditError && issues.length === 0) {
    return { triggered: true, priceChanges: priceChanges.length, issues: 0, emailSent: false, pendingAlert: false };
  }

  const body = buildAlertBody(priceChanges, issues, auditError || undefined);
  const pendingId = await createPendingAlert(databaseUrl, sourceGeneratedAt, body);

  try {
    await sendPricingAlertEmail(body);
    await markAlertSent(databaseUrl, pendingId);
    return {
      triggered: true,
      priceChanges: priceChanges.length,
      issues: issues.length,
      emailSent: true,
      pendingAlert: false,
      ...(auditError ? { auditError } : {}),
    };
  } catch (error) {
    const emailError = error instanceof Error ? error.message : String(error);
    console.error("booking_core pricing alert send failed", error);
    return {
      triggered: true,
      priceChanges: priceChanges.length,
      issues: issues.length,
      emailSent: false,
      pendingAlert: true,
      auditError: auditError ? `${auditError}; email: ${emailError}` : `Email: ${emailError}`,
    };
  }
}

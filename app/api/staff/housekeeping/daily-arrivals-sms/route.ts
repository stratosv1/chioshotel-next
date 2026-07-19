import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ATHENS_TZ = "Europe/Athens";
const MESSAGE_TYPE = "housekeeping_daily_arrivals";
const SOURCE = "housekeeping_daily_cron";

function text(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function normalizeSmsPhone(value: unknown) {
  let phone = text(value).replace(/[^0-9+]/g, "");
  if (phone.startsWith("+")) phone = phone.slice(1);
  if (phone.startsWith("00")) phone = phone.slice(2);
  if (/^69[0-9]{8}$/.test(phone)) phone = `30${phone}`;
  return phone;
}

function athensParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ATHENS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    displayDate: `${get("day")}/${get("month")}`,
    hour: Number(get("hour")),
  };
}

function roomLabel(roomId: unknown, unitId: unknown) {
  const key = `${text(roomId)}:${text(unitId)}`;
  return ({
    "267788:1": "Δωμάτιο 1",
    "268803:1": "Δωμάτιο 2",
    "267788:2": "Δωμάτιο 3",
    "267788:3": "Δωμάτιο 4",
    "626129:1": "Δωμάτιο 5",
    "268803:2": "Δωμάτιο 6",
    "626129:2": "Δωμάτιο 7",
    "265595:1": "Διαμέρισμα 8",
    "265595:2": "Διαμέρισμα 9",
    "265595:3": "Διαμέρισμα 10",
  } as Record<string, string>)[key] || `Δωμάτιο ${text(unitId) || "-"}`;
}

export async function GET(request: NextRequest) {
  const databaseUrl = text(process.env.DATABASE_URL);
  const token = text(process.env.SMSAPI_TOKEN || process.env.VHC_SMSAPI_TOKEN);
  const sender = text(process.env.SMSAPI_FROM || process.env.VHC_SMSAPI_FROM || "Voulamandis");
  const phone = normalizeSmsPhone(process.env.HOUSEKEEPING_SMS_PHONE);
  const force = request.nextUrl.searchParams.get("force") === "1";

  if (!databaseUrl) return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });
  if (!token) return NextResponse.json({ ok: false, error: "SMSAPI_TOKEN is missing" }, { status: 500 });
  if (!phone) return NextResponse.json({ ok: false, error: "HOUSEKEEPING_SMS_PHONE is missing" }, { status: 500 });

  const athens = athensParts();
  if (!force && athens.hour !== 7) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Not 07:00 in Athens", athens });
  }

  const sql = neon(databaseUrl);
  const alreadySent = await sql`
    select id
    from staff_guest_communications
    where message_type = ${MESSAGE_TYPE}
      and source = ${SOURCE}
      and recipient_phone = ${phone}
      and status = 'sent'
      and (created_at at time zone ${ATHENS_TZ})::date = ${athens.date}::date
    limit 1
  `;

  if (!force && alreadySent.length) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Already sent today", date: athens.date });
  }

  const arrivals = await sql`
    select beds24_booking_id, room_id, unit_id, num_adult, num_child, guest_name
    from staff_bookings_snapshot
    where arrival = ${athens.date}::date
      and coalesce(lower(status), '') not in ('cancelled', 'canceled', 'deleted')
      and room_id <> '345347'
    order by unit_id::int
  `;

  let totalGuests = 0;
  const lines = arrivals.map((booking) => {
    const adults = Number(booking.num_adult || 0);
    const children = Number(booking.num_child || 0);
    const guests = adults + children;
    totalGuests += guests;
    const breakdown = children > 0 ? ` (${adults} ενήλ. + ${children} παιδ.)` : "";
    return `${roomLabel(booking.room_id, booking.unit_id)}: ${guests} άτομα${breakdown}`;
  });

  const message = arrivals.length
    ? `Voulamandis House - Αφίξεις ${athens.displayDate}\n${lines.join("\n")}\nΣύνολο: ${arrivals.length} δωμάτια / ${totalGuests} άτομα`
    : `Voulamandis House - Αφίξεις ${athens.displayDate}\nΔεν υπάρχουν αφίξεις σήμερα.`;

  const params = new URLSearchParams({ to: phone, from: sender, message, format: "json" });
  const smsResponse = await fetch("https://api.smsapi.com/sms.do", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    cache: "no-store",
  });

  const responseText = await smsResponse.text();
  let providerResponse: unknown = responseText;
  try { providerResponse = JSON.parse(responseText); } catch {}
  const providerHasError = Boolean(providerResponse && typeof providerResponse === "object" && "error" in providerResponse);
  const status = smsResponse.ok && !providerHasError ? "sent" : "error";

  await sql`
    insert into staff_guest_communications
      (channel, direction, message_type, recipient_phone, sender, message, status, provider, provider_response, source, raw_payload, created_by)
    values
      ('sms', 'outbound', ${MESSAGE_TYPE}, ${phone}, ${sender}, ${message}, ${status}, 'smsapi', ${JSON.stringify(providerResponse)}::jsonb, ${SOURCE}, ${JSON.stringify({ date: athens.date, arrivals: arrivals.length, totalGuests })}::jsonb, 'system')
  `;

  if (status === "error") {
    return NextResponse.json({ ok: false, error: "SMSAPI returned an error", providerResponse }, { status: 502 });
  }

  return NextResponse.json({ ok: true, sent: true, date: athens.date, arrivals: arrivals.length, totalGuests });
}

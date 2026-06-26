import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Staff Calendar SMS"',
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

function isAuthorized(request: NextRequest) {
  const expectedUser = process.env.STAFF_USERNAME;
  const expectedPass = process.env.STAFF_PASSWORD;

  if (!expectedUser || !expectedPass) return false;

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return false;

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return username === expectedUser && password === expectedPass;
  } catch {
    return false;
  }
}

function text(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeSmsPhone(value: unknown) {
  let phone = text(value).replace(/[^0-9+]/g, "");

  if (phone.startsWith("+")) phone = phone.slice(1);
  if (phone.startsWith("00")) phone = phone.slice(2);
  if (/^69[0-9]{8}$/.test(phone)) phone = `30${phone}`;

  return phone;
}

function buildSmsMessage(type: string, body: Record<string, unknown>) {
  const firstName = text(body.first_name || body.firstname);
  const lastName = text(body.last_name || body.lastname);
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  const bookingId = text(body.booking_id || body.beds24_booking_id);
  const checkin = text(body.checkin || body.arrival);
  const checkout = text(body.checkout || body.departure);
  const room = text(body.room || body.room_name || body.unit_name);
  const price = text(body.price);

  const normalizedType = type.toLowerCase();

  if (["cancel", "cancelled", "canceled"].includes(normalizedType)) {
    return `Voulamandis House
Η κράτησή σας ακυρώθηκε.
Booking ID: ${bookingId}
Check-in: ${checkin}
Check-out: ${checkout}
Δωμάτιο: ${room}`;
  }

  if (normalizedType === "request") {
    return `Voulamandis House
Το αίτημα κράτησης είναι σε αναμονή επιβεβαίωσης.
Όνομα: ${name}
Booking ID: ${bookingId}
Check-in: ${checkin}
Check-out: ${checkout}
Δωμάτιο: ${room}
Σύνολο: ${price}`;
  }

  return `Voulamandis House
Η κράτησή σας επιβεβαιώθηκε.
Όνομα: ${name}
Booking ID: ${bookingId}
Check-in: ${checkin}
Check-out: ${checkout}
Δωμάτιο: ${room}
Σύνολο: ${price}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is missing." }, { status: 500 });
  }

  const token = text(process.env.SMSAPI_TOKEN || process.env.VHC_SMSAPI_TOKEN);
  const sender = text(process.env.SMSAPI_FROM || process.env.VHC_SMSAPI_FROM || "Test");

  if (!token) {
    return NextResponse.json({ ok: false, error: "SMSAPI_TOKEN is missing." }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const type = text(body.type || "confirmed");
  const phone = normalizeSmsPhone(body.phone || body.mobile || body.recipient_phone);
  const message = text(body.message) || buildSmsMessage(type, body);

  if (!phone) {
    return NextResponse.json({ ok: false, error: "Δεν υπάρχει κινητό για αποστολή SMS." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ ok: false, error: "Δεν υπάρχει μήνυμα SMS." }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.set("to", phone);
  params.set("from", sender);
  params.set("message", message);
  params.set("format", "json");

  const sql = neon(databaseUrl);

  try {
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

    try {
      providerResponse = JSON.parse(responseText);
    } catch {
      providerResponse = responseText;
    }

    const providerHasError =
      providerResponse &&
      typeof providerResponse === "object" &&
      "error" in providerResponse;

    const status = smsResponse.ok && !providerHasError ? "sent" : "error";

    const rows = await sql`
      insert into staff_guest_communications (
        booking_id,
        beds24_booking_id,
        book_id,
        guest_name,
        first_name,
        last_name,
        channel,
        direction,
        message_type,
        recipient_phone,
        sender,
        message,
        status,
        provider,
        provider_response,
        source,
        raw_payload,
        created_by
      )
      values (
        ${text(body.booking_id) || null},
        ${text(body.beds24_booking_id) || text(body.booking_id) || null},
        ${text(body.book_id) || null},
        ${text(body.guest_name) || null},
        ${text(body.first_name) || null},
        ${text(body.last_name) || null},
        'sms',
        'outbound',
        ${type || "manual"},
        ${phone},
        ${sender},
        ${message},
        ${status},
        'smsapi',
        ${JSON.stringify(providerResponse)}::jsonb,
        'staff_calendar',
        ${JSON.stringify({ ...body, normalized_phone: phone })}::jsonb,
        ${text(body.created_by) || null}
      )
      returning *
    `;

    if (status === "error") {
      return NextResponse.json(
        {
          ok: false,
          error: "Το SMSAPI επέστρεψε σφάλμα.",
          providerResponse,
          communication: rows[0],
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Το SMS στάλθηκε μέσω SMSAPI.",
        providerResponse,
        communication: rows[0],
      },
      {
        headers: {
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown SMSAPI error.";

    await sql`
      insert into staff_guest_communications (
        booking_id,
        beds24_booking_id,
        channel,
        direction,
        message_type,
        recipient_phone,
        sender,
        message,
        status,
        provider,
        provider_response,
        source,
        raw_payload
      )
      values (
        ${text(body.booking_id) || null},
        ${text(body.beds24_booking_id) || text(body.booking_id) || null},
        'sms',
        'outbound',
        ${type || "manual"},
        ${phone || null},
        ${sender || null},
        ${message || ""},
        'error',
        'smsapi',
        ${JSON.stringify({ error: errorMessage })}::jsonb,
        'staff_calendar',
        ${JSON.stringify(body)}::jsonb
      )
    `;

    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}

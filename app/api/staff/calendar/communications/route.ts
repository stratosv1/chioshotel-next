import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Staff Calendar Communications"',
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

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is missing." }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const bookingId = text(searchParams.get("booking_id"));
  const beds24BookingId = text(searchParams.get("beds24_booking_id"));
  const limitRaw = Number(searchParams.get("limit") || 50);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;

  const sql = neon(databaseUrl);

  try {
    const rows = await sql`
      select
        id,
        booking_id,
        beds24_booking_id,
        book_id,
        guest_name,
        first_name,
        last_name,
        channel,
        direction,
        message_type,
        recipient_email,
        recipient_phone,
        sender,
        subject,
        message,
        status,
        provider,
        provider_message_id,
        provider_response,
        arrival_time,
        arrival_method,
        reviewed,
        reviewed_at,
        source,
        raw_payload,
        created_by,
        created_at,
        updated_at
      from staff_guest_communications
      where
        (${bookingId || null}::text is null or booking_id = ${bookingId || null})
        and (${beds24BookingId || null}::text is null or beds24_booking_id = ${beds24BookingId || null})
      order by created_at desc
      limit ${limit}
    `;

    return NextResponse.json(
      { ok: true, communications: rows },
      {
        headers: {
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown communications API error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is missing." }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));

  const channel = text(body.channel || "note");
  const message = text(body.message);

  if (!message) {
    return NextResponse.json({ ok: false, error: "message is required." }, { status: 400 });
  }

  const sql = neon(databaseUrl);

  try {
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
        recipient_email,
        recipient_phone,
        sender,
        subject,
        message,
        status,
        provider,
        provider_response,
        arrival_time,
        arrival_method,
        reviewed,
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
        ${channel},
        ${text(body.direction) || "outbound"},
        ${text(body.message_type) || "manual"},
        ${text(body.recipient_email) || null},
        ${text(body.recipient_phone) || null},
        ${text(body.sender) || null},
        ${text(body.subject) || null},
        ${message},
        ${text(body.status) || "saved"},
        ${text(body.provider) || null},
        ${body.provider_response ? JSON.stringify(body.provider_response) : null}::jsonb,
        ${text(body.arrival_time) || null},
        ${text(body.arrival_method) || null},
        ${Boolean(body.reviewed)},
        ${text(body.source) || "staff_calendar"},
        ${JSON.stringify(body)}::jsonb,
        ${text(body.created_by) || null}
      )
      returning *
    `;

    return NextResponse.json(
      { ok: true, communication: rows[0] },
      {
        headers: {
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown communication insert error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

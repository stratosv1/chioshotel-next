import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestBody = {
  name?: string;
  contact?: string;
  message?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  roomId?: string;
  unitId?: string;
  roomName?: string;
  originalTotal?: number;
  directTotal?: number;
};

function clean(value: unknown, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const name = clean(body.name, 120);
    const contact = clean(body.contact, 160);
    const message = clean(body.message, 1000);
    const checkin = clean(body.checkin, 10);
    const checkout = clean(body.checkout, 10);
    const roomId = clean(body.roomId, 40);
    const unitId = clean(body.unitId, 40);
    const roomName = clean(body.roomName, 160);
    const guests = Math.max(1, Math.min(Number(body.guests || 1), 10));
    const originalTotal = Number(body.originalTotal || 0);
    const directTotal = Number(body.directTotal || 0);

    if (!name || !contact || !roomName || !isDate(checkin) || !isDate(checkout) || checkout <= checkin) {
      return NextResponse.json({ ok: false, error: "Missing or invalid request details." }, { status: 400 });
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ ok: false, error: "Booking request storage is not configured." }, { status: 503 });
    }

    const sql = neon(databaseUrl);
    await sql`
      create table if not exists ai_booking_requests (
        id bigserial primary key,
        created_at timestamptz not null default now(),
        status text not null default 'new',
        guest_name text not null,
        contact text not null,
        guest_message text,
        checkin date not null,
        checkout date not null,
        guests integer not null,
        room_id text,
        unit_id text,
        room_name text not null,
        original_total numeric(10,2),
        direct_total numeric(10,2),
        source text not null default 'ai-assistant'
      )
    `;

    const inserted = await sql`
      insert into ai_booking_requests (
        guest_name, contact, guest_message, checkin, checkout, guests,
        room_id, unit_id, room_name, original_total, direct_total
      ) values (
        ${name}, ${contact}, ${message || null}, ${checkin}::date, ${checkout}::date, ${guests},
        ${roomId || null}, ${unitId || null}, ${roomName}, ${originalTotal || null}, ${directTotal || null}
      )
      returning id::text
    `;

    const requestId = String((inserted as any[])?.[0]?.id || "");
    let emailSent = false;
    const resendKey = process.env.RESEND_API_KEY;
    const receptionEmail = process.env.RECEPTION_EMAIL;

    if (resendKey && receptionEmail) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RECEPTION_FROM_EMAIL || "Voulamandis House <bookings@chioshotel.gr>",
          to: [receptionEmail],
          subject: `Νέο αίτημα κράτησης: ${roomName} (${checkin}–${checkout})`,
          text: [
            `Αριθμός αιτήματος: ${requestId}`,
            `Όνομα: ${name}`,
            `Επικοινωνία: ${contact}`,
            `Δωμάτιο: ${roomName}`,
            `Άφιξη: ${checkin}`,
            `Αναχώρηση: ${checkout}`,
            `Επισκέπτες: ${guests}`,
            `Αρχική τιμή: €${originalTotal.toFixed(2)}`,
            `Τιμή απευθείας κράτησης: €${directTotal.toFixed(2)}`,
            message ? `Μήνυμα: ${message}` : "",
          ].filter(Boolean).join("\n"),
        }),
        cache: "no-store",
      });
      emailSent = emailResponse.ok;
      if (!emailResponse.ok) console.error("Reception email failed", emailResponse.status);
    }

    return NextResponse.json(
      { ok: true, requestId, emailSent },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("AI booking request error", error);
    return NextResponse.json({ ok: false, error: "The request could not be sent." }, { status: 500 });
  }
}

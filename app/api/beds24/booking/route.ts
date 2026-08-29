import { neon } from "@neondatabase/serverless";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { BOOKING_CORE_DEALS_CACHE_TAG } from "@/lib/booking-core/cache-tags";
import { reconcileBookingCoreBookingEvent } from "@/lib/booking-core/reconcile-booking-event";

export const runtime = "nodejs";

export type Beds24BookingPayload = {
  booking_id?: string;
  status?: string;
  checkin?: string;
  checkout?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  property?: string;
  room?: string;
  room_id?: string;
  unit_id?: string;
  guest_language?: string;
  price?: string;
};

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function nullable(value: string): string | null {
  return value ? value : null;
}

async function saveBookingToDatabase(body: Beds24BookingPayload) {
  const databaseUrl = getRequiredEnv("DATABASE_URL");
  const sql = neon(databaseUrl);

  const bookingId = clean(body.booking_id);
  const status = clean(body.status);
  const checkin = clean(body.checkin);
  const checkout = clean(body.checkout);
  const firstname = clean(body.firstname);
  const lastname = clean(body.lastname);
  const email = clean(body.email);
  const property = clean(body.property);
  const room = clean(body.room);
  const guestLanguage = clean(body.guest_language);
  const price = clean(body.price);
  const rawJson = JSON.stringify(body);

  const rows = await sql`
    INSERT INTO public.beds24_bookings (
      booking_id,
      status,
      checkin,
      checkout,
      firstname,
      lastname,
      email,
      property,
      room,
      guest_language,
      price,
      raw_json
    )
    VALUES (
      ${bookingId},
      ${nullable(status)},
      ${nullable(checkin)},
      ${nullable(checkout)},
      ${nullable(firstname)},
      ${nullable(lastname)},
      ${nullable(email)},
      ${nullable(property)},
      ${nullable(room)},
      ${nullable(guestLanguage)},
      ${nullable(price)},
      ${rawJson}::jsonb
    )
    ON CONFLICT (booking_id)
    DO UPDATE SET
      status = COALESCE(EXCLUDED.status, public.beds24_bookings.status),
      checkin = COALESCE(EXCLUDED.checkin, public.beds24_bookings.checkin),
      checkout = COALESCE(EXCLUDED.checkout, public.beds24_bookings.checkout),
      firstname = COALESCE(EXCLUDED.firstname, public.beds24_bookings.firstname),
      lastname = COALESCE(EXCLUDED.lastname, public.beds24_bookings.lastname),
      email = COALESCE(EXCLUDED.email, public.beds24_bookings.email),
      property = COALESCE(EXCLUDED.property, public.beds24_bookings.property),
      room = COALESCE(EXCLUDED.room, public.beds24_bookings.room),
      guest_language = COALESCE(EXCLUDED.guest_language, public.beds24_bookings.guest_language),
      price = COALESCE(EXCLUDED.price, public.beds24_bookings.price),
      raw_json = EXCLUDED.raw_json,
      updated_at = NOW()
    WHERE ROW(
      public.beds24_bookings.status,
      public.beds24_bookings.checkin,
      public.beds24_bookings.checkout,
      public.beds24_bookings.firstname,
      public.beds24_bookings.lastname,
      public.beds24_bookings.email,
      public.beds24_bookings.property,
      public.beds24_bookings.room,
      public.beds24_bookings.guest_language,
      public.beds24_bookings.price,
      public.beds24_bookings.raw_json
    ) IS DISTINCT FROM ROW(
      COALESCE(EXCLUDED.status, public.beds24_bookings.status),
      COALESCE(EXCLUDED.checkin, public.beds24_bookings.checkin),
      COALESCE(EXCLUDED.checkout, public.beds24_bookings.checkout),
      COALESCE(EXCLUDED.firstname, public.beds24_bookings.firstname),
      COALESCE(EXCLUDED.lastname, public.beds24_bookings.lastname),
      COALESCE(EXCLUDED.email, public.beds24_bookings.email),
      COALESCE(EXCLUDED.property, public.beds24_bookings.property),
      COALESCE(EXCLUDED.room, public.beds24_bookings.room),
      COALESCE(EXCLUDED.guest_language, public.beds24_bookings.guest_language),
      COALESCE(EXCLUDED.price, public.beds24_bookings.price),
      EXCLUDED.raw_json
    )
    RETURNING booking_id
  `;

  return { changed: (rows as any[]).length > 0 };
}

async function sendBookingEmail(body: Beds24BookingPayload) {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || "465");
  const smtpUser = getRequiredEnv("SMTP_USER");
  const smtpPass = getRequiredEnv("SMTP_PASS");
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const contactTo = process.env.BEDS24_NOTIFY_TO || process.env.CONTACT_TO || "chioshotel@gmail.com";

  const bookingId = clean(body.booking_id);
  const status = clean(body.status);
  const checkin = clean(body.checkin);
  const checkout = clean(body.checkout);
  const firstName = clean(body.firstname);
  const lastName = clean(body.lastname);
  const guestEmail = clean(body.email);
  const property = clean(body.property);
  const room = clean(body.room);
  const roomId = clean(body.room_id);
  const unitId = clean(body.unit_id);
  const guestLanguage = clean(body.guest_language);
  const price = clean(body.price);

  const fullName = `${firstName} ${lastName}`.trim() || "-";

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const textLines = [
    "Beds24 booking notification",
    "",
    `Booking ID: ${bookingId}`,
    `Status: ${status || "-"}`,
    `Guest: ${fullName}`,
    `Email: ${guestEmail || "-"}`,
    `Check-in: ${checkin || "-"}`,
    `Check-out: ${checkout || "-"}`,
    `Property: ${property || "-"}`,
    `Room: ${room || "-"}`,
    `Room ID: ${roomId || "-"}`,
    `Unit ID: ${unitId || "-"}`,
    `Guest language: ${guestLanguage || "-"}`,
    `Price: ${price || "-"}`,
    "",
    "Raw JSON:",
    JSON.stringify(body, null, 2),
  ];

  const safe = {
    bookingId: escapeHtml(bookingId),
    status: escapeHtml(status || "-"),
    fullName: escapeHtml(fullName),
    guestEmail: escapeHtml(guestEmail || "-"),
    checkin: escapeHtml(checkin || "-"),
    checkout: escapeHtml(checkout || "-"),
    property: escapeHtml(property || "-"),
    room: escapeHtml(room || "-"),
    roomId: escapeHtml(roomId || "-"),
    unitId: escapeHtml(unitId || "-"),
    guestLanguage: escapeHtml(guestLanguage || "-"),
    price: escapeHtml(price || "-"),
    rawJson: escapeHtml(JSON.stringify(body, null, 2)),
  };

  await transporter.sendMail({
    from: `"Voulamandis House Beds24" <${smtpFrom}>`,
    to: contactTo,
    replyTo: guestEmail || smtpFrom,
    subject: `Beds24 booking ${bookingId} - ${status || "update"}`,
    text: textLines.join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
        <h2>Beds24 booking notification</h2>
        <p><strong>Booking ID:</strong> ${safe.bookingId}</p>
        <p><strong>Status:</strong> ${safe.status}</p>
        <p><strong>Guest:</strong> ${safe.fullName}</p>
        <p><strong>Email:</strong> ${safe.guestEmail}</p>
        <p><strong>Check-in:</strong> ${safe.checkin}</p>
        <p><strong>Check-out:</strong> ${safe.checkout}</p>
        <p><strong>Property:</strong> ${safe.property}</p>
        <p><strong>Room:</strong> ${safe.room}</p>
        <p><strong>Room ID:</strong> ${safe.roomId}</p>
        <p><strong>Unit ID:</strong> ${safe.unitId}</p>
        <p><strong>Guest language:</strong> ${safe.guestLanguage}</p>
        <p><strong>Price:</strong> ${safe.price}</p>
        <hr />
        <p><strong>Raw JSON:</strong></p>
        <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px">${safe.rawJson}</pre>
      </div>
    `,
  });
}

export async function POST(request: Request) {
  try {
    const expectedSecret = getRequiredEnv("BEDS24_WEBHOOK_SECRET");
    const receivedSecret = request.headers.get("x-webhook-secret") || "";

    if (receivedSecret !== expectedSecret) {
      return NextResponse.json({ ok: false, error: "Unauthorized webhook." }, { status: 401 });
    }

    const body = (await request.json()) as Beds24BookingPayload;
    const bookingId = clean(body.booking_id);

    if (!bookingId) {
      return NextResponse.json({ ok: false, error: "Missing booking_id." }, { status: 400 });
    }

    const stored = await saveBookingToDatabase(body);
    const bookingCore = await reconcileBookingCoreBookingEvent({
      bookingId,
      status: clean(body.status),
      checkin: clean(body.checkin),
      checkout: clean(body.checkout),
      roomId: clean(body.room_id),
      unitId: clean(body.unit_id),
    });

    if (bookingCore.rowsReleased > 0 || bookingCore.rowsBooked > 0) {
      try {
        revalidateTag(BOOKING_CORE_DEALS_CACHE_TAG, { expire: 0 });
      } catch (cacheError) {
        console.error("Beds24 webhook could not invalidate Booking Core deals cache", cacheError);
      }
    }

    await sendBookingEmail(body);

    return NextResponse.json({
      ok: true,
      received: true,
      stored: true,
      bookingChanged: stored.changed,
      emailed: true,
      booking_id: bookingId,
      bookingCore,
    });
  } catch (error) {
    console.error("Beds24 webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown Beds24 webhook error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

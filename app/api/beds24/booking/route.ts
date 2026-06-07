import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type Beds24BookingPayload = {
  booking_id?: string;
  status?: string;
  checkin?: string;
  checkout?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  property?: string;
  room?: string;
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

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export async function POST(request: Request) {
  try {
    const expectedSecret = getRequiredEnv("BEDS24_WEBHOOK_SECRET");
    const receivedSecret = request.headers.get("x-webhook-secret") || "";

    if (receivedSecret !== expectedSecret) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized webhook." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as Beds24BookingPayload;

    const bookingId = clean(body.booking_id);
    const status = clean(body.status);
    const checkin = clean(body.checkin);
    const checkout = clean(body.checkout);
    const firstName = clean(body.firstname);
    const lastName = clean(body.lastname);
    const guestEmail = clean(body.email);
    const property = clean(body.property);
    const room = clean(body.room);
    const guestLanguage = clean(body.guest_language);
    const price = clean(body.price);

    if (!bookingId) {
      return NextResponse.json(
        { ok: false, error: "Missing booking_id." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = getRequiredEnv("SMTP_USER");
    const smtpPass = getRequiredEnv("SMTP_PASS");
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const contactTo = process.env.BEDS24_NOTIFY_TO || process.env.CONTACT_TO || smtpUser;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const fullName = `${firstName} ${lastName}`.trim() || "-";

    const textLines = [
      "New Beds24 booking notification",
      "",
      `Booking ID: ${bookingId}`,
      `Status: ${status || "-"}`,
      `Guest: ${fullName}`,
      `Email: ${guestEmail || "-"}`,
      `Check-in: ${checkin || "-"}`,
      `Check-out: ${checkout || "-"}`,
      `Property: ${property || "-"}`,
      `Room: ${room || "-"}`,
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
          <p><strong>Guest language:</strong> ${safe.guestLanguage}</p>
          <p><strong>Price:</strong> ${safe.price}</p>
          <hr />
          <p><strong>Raw JSON:</strong></p>
          <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px">${safe.rawJson}</pre>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      received: true,
      booking_id: bookingId,
    });
  } catch (error) {
    console.error("Beds24 webhook error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown Beds24 webhook error";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}

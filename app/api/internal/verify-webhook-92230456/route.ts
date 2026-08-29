import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function formatDate(value: unknown): string {
  const raw = clean(value).slice(0, 10);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return raw || "-";
  const [, year, month, day] = match;
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  return `${local.slice(0, 2)}***@${domain}`;
}

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL?.trim();
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    const smtpHost = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpFrom = process.env.SMTP_FROM?.trim() || smtpUser;

    if (!databaseUrl || !smtpUser || !smtpPass || !smtpFrom) {
      return NextResponse.json(
        { ok: false, error: "Site email service is not fully configured in this environment" },
        { status: 500, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
      );
    }

    const sql = neon(databaseUrl);
    const bookingId = "92235579";
    const rows = await sql`
      select
        booking_id,
        status,
        checkin,
        checkout,
        firstname,
        lastname,
        email,
        room,
        guest_language,
        price,
        raw_json -> 'api_v2_lookup' ->> 'num_adult' as num_adult,
        raw_json -> 'api_v2_lookup' ->> 'num_child' as num_child
      from public.beds24_bookings
      where booking_id = ${bookingId}::text
      limit 1
    `;

    const booking = (rows as any[])[0];
    if (!booking) {
      return NextResponse.json({ ok: false, error: "Booking not found" }, { status: 404 });
    }

    const recipient = clean(booking.email).toLowerCase();
    if (!recipient || !recipient.includes("@")) {
      return NextResponse.json({ ok: false, error: "Booking has no valid guest email" }, { status: 400 });
    }

    const firstName = clean(booking.firstname) || "Guest";
    const lastName = clean(booking.lastname);
    const fullName = `${firstName} ${lastName}`.trim();
    const room = clean(booking.room) || "Room";
    const checkin = formatDate(booking.checkin);
    const checkout = formatDate(booking.checkout);
    const price = clean(booking.price);
    const adults = Number(clean(booking.num_adult) || "0");
    const children = Number(clean(booking.num_child) || "0");
    const guestText = [
      adults > 0 ? `${adults} adult${adults === 1 ? "" : "s"}` : "",
      children > 0 ? `${children} child${children === 1 ? "" : "ren"}` : "",
    ].filter(Boolean).join(", ") || "-";

    const start = new Date(`${clean(booking.checkin).slice(0, 10)}T00:00:00Z`);
    const end = new Date(`${clean(booking.checkout).slice(0, 10)}T00:00:00Z`);
    const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));

    const safe = {
      firstName: escapeHtml(firstName),
      fullName: escapeHtml(fullName),
      room: escapeHtml(room),
      checkin: escapeHtml(checkin),
      checkout: escapeHtml(checkout),
      price: escapeHtml(price),
      guestText: escapeHtml(guestText),
      bookingId: escapeHtml(bookingId),
      nights: String(nights),
    };

    const text = [
      `Dear ${firstName},`,
      "",
      "Thank you for choosing Voulamandis House. Your reservation is confirmed.",
      "",
      `Booking number: ${bookingId}`,
      `Guest: ${fullName}`,
      `Check-in: ${checkin}`,
      `Check-out: ${checkout}`,
      `Stay: ${nights} night${nights === 1 ? "" : "s"}`,
      `Room: ${room}`,
      `Guests: ${guestText}`,
      `Total booking amount: €${price}`,
      "",
      "Breakfast is not included unless specifically stated in your reservation.",
      "",
      "Payment can be made by cash or Visa / Mastercard. If you have arranged a bank transfer with us:",
      "IBAN: GR2602603120000410200846348",
      "Account holder: Efstratios Voulamandis",
      "Bank: Eurobank",
      "SWIFT: ERBKGRAA",
      "",
      "If you need any assistance before arrival, simply reply to this email or contact us on WhatsApp: +30 694 447 4226.",
      "",
      "We look forward to welcoming you to Chios.",
      "",
      "Voulamandis House",
      "Kampos, Chios",
      "https://chioshotel.gr",
    ].join("\n");

    const html = `<!doctype html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f0e8;font-family:Arial,Helvetica,sans-serif;color:#403a34;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f0e8;padding:30px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:660px;background:#ffffff;border:1px solid #e5ddd1;border-radius:16px;overflow:hidden;">
<tr><td align="center" style="padding:32px 34px 25px;background:#fbf8f3;">
<a href="https://chioshotel.gr/" target="_blank"><img src="https://media.xmlcal.com/pic/p0011/7813/37.png" width="78" alt="Voulamandis House" style="display:block;border:0;border-radius:10px;height:auto;margin:0 auto 16px;"></a>
<div style="font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.25;font-weight:bold;color:#4c4339;">Your booking is confirmed</div>
<div style="font-size:13px;color:#887b6d;margin-top:8px;letter-spacing:.2px;">VOULAMANDIS HOUSE · KAMPOS, CHIOS</div>
</td></tr>
<tr><td style="padding:30px 36px 34px;">
<p style="margin:0 0 12px;font-size:17px;line-height:1.6;">Dear <strong>${safe.firstName}</strong>,</p>
<p style="margin:0 0 25px;font-size:15px;line-height:1.7;color:#686057;">Thank you for choosing Voulamandis House. We are pleased to confirm your reservation and look forward to welcoming you to Chios.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #eae3d9;border-radius:12px;overflow:hidden;">
<tr><td colspan="2" style="padding:15px 18px;background:#f7f3ed;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:bold;color:#51483e;">Booking details</td></tr>
<tr><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;color:#827669;font-size:14px;">Booking number</td><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;text-align:right;font-weight:bold;font-size:14px;">${safe.bookingId}</td></tr>
<tr><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;color:#827669;font-size:14px;">Guest</td><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;text-align:right;font-weight:bold;font-size:14px;">${safe.fullName}</td></tr>
<tr><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;color:#827669;font-size:14px;">Check-in</td><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;text-align:right;font-weight:bold;font-size:14px;">${safe.checkin}</td></tr>
<tr><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;color:#827669;font-size:14px;">Check-out</td><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;text-align:right;font-weight:bold;font-size:14px;">${safe.checkout}</td></tr>
<tr><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;color:#827669;font-size:14px;">Stay</td><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;text-align:right;font-weight:bold;font-size:14px;">${safe.nights} night${nights === 1 ? "" : "s"}</td></tr>
<tr><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;color:#827669;font-size:14px;">Room</td><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;text-align:right;font-weight:bold;font-size:14px;">${safe.room}</td></tr>
<tr><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;color:#827669;font-size:14px;">Guests</td><td style="padding:12px 18px;border-bottom:1px solid #eee7dd;text-align:right;font-weight:bold;font-size:14px;">${safe.guestText}</td></tr>
<tr><td style="padding:16px 18px;background:#fcfaf7;color:#695f55;font-size:15px;">Total booking amount</td><td style="padding:16px 18px;background:#fcfaf7;text-align:right;font-size:21px;font-weight:bold;color:#4c4339;">€${safe.price}</td></tr>
</table>
<div style="margin-top:20px;padding:14px 16px;background:#faf7f2;border-radius:10px;color:#71675e;font-size:13px;line-height:1.6;"><strong>Breakfast:</strong> Not included unless specifically stated in your reservation.</div>
<div style="margin-top:27px;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:bold;color:#51483e;">Payment details</div>
<p style="margin:9px 0 13px;font-size:14px;line-height:1.7;color:#686057;">Payment can be made by cash or Visa / Mastercard. If you have arranged a bank transfer with us, please use the details below.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#faf8f4;border-radius:10px;font-size:13px;line-height:1.7;color:#5f574f;"><tr><td style="padding:14px 16px;"><strong>IBAN:</strong> GR2602603120000410200846348<br><strong>Account holder:</strong> Efstratios Voulamandis<br><strong>Bank:</strong> Eurobank &nbsp; · &nbsp; <strong>SWIFT:</strong> ERBKGRAA</td></tr></table>
<p style="margin:27px 0 18px;font-size:14px;line-height:1.7;color:#686057;">If you need to make any changes to your reservation or have any questions before arrival, simply reply to this email or contact us on WhatsApp.</p>
<div style="text-align:center;margin-top:24px;"><a href="https://chioshotel.gr/" target="_blank" style="display:inline-block;background:#6f604e;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:bold;margin:4px;">Visit our website</a><a href="https://wa.me/306944474226" target="_blank" style="display:inline-block;color:#5f554b;text-decoration:none;padding:11px 19px;border:1px solid #d7cec2;border-radius:8px;font-size:14px;font-weight:bold;margin:4px;">WhatsApp us</a></div>
</td></tr>
<tr><td align="center" style="border-top:1px solid #eee7dd;padding:23px 30px 28px;background:#fdfbf8;"><div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:bold;color:#51483e;">Voulamandis House</div><div style="margin-top:6px;font-size:12px;line-height:1.7;color:#938678;">Kampos, Chios · Greece<br>We look forward to welcoming you.</div></td></tr>
</table>
</td></tr></table>
</body></html>`;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const result = await transporter.sendMail({
      from: `"Voulamandis House" <${smtpFrom}>`,
      to: recipient,
      replyTo: smtpFrom,
      subject: `Your booking is confirmed | Voulamandis House #${bookingId}`,
      text,
      html,
    });

    return NextResponse.json(
      {
        ok: true,
        sent: true,
        booking_id: bookingId,
        recipient: maskEmail(recipient),
        message_id: result.messageId || null,
      },
      { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
    );
  } catch (error) {
    console.error("Temporary booking confirmation send failed:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "send_failed" },
      { status: 500, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
    );
  }
}

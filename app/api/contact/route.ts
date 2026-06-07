import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  checkin?: string;
  checkout?: string;
  room?: string;
  message?: string;
  language?: string;
  page?: string;
};

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const checkin = clean(body.checkin);
    const checkout = clean(body.checkout);
    const room = clean(body.room);
    const message = clean(body.message);
    const language = clean(body.language);
    const page = clean(body.page);

    if (!firstName || !lastName || !email || !phone || !checkin || !checkout) {
      return NextResponse.json(
        { ok: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (checkout <= checkin) {
      return NextResponse.json(
        { ok: false, error: "Check-out must be after check-in." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const contactTo = process.env.CONTACT_TO || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom || !contactTo) {
      const missing = [
        !smtpHost ? "SMTP_HOST" : "",
        !smtpUser ? "SMTP_USER" : "",
        !smtpPass ? "SMTP_PASS" : "",
        !smtpFrom ? "SMTP_FROM" : "",
        !contactTo ? "CONTACT_TO" : "",
      ].filter(Boolean);

      return NextResponse.json(
        {
          ok: false,
          error: `Email service is not configured. Missing: ${missing.join(", ")}`,
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const fullName = `${firstName} ${lastName}`.trim();

    const textLines = [
      "Voulamandis House - New website inquiry",
      "",
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Check-in: ${checkin}`,
      `Check-out: ${checkout}`,
      `Room: ${room || "-"}`,
      language ? `Language: ${language}` : "",
      page ? `Page: ${page}` : "",
      "",
      "Message:",
      message || "-",
    ].filter(Boolean);

    const safe = {
      fullName: escapeHtml(fullName),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      checkin: escapeHtml(checkin),
      checkout: escapeHtml(checkout),
      room: escapeHtml(room || "-"),
      language: escapeHtml(language || "-"),
      page: escapeHtml(page || "-"),
      message: escapeHtml(message || "-").replaceAll("\n", "<br />"),
    };

    await transporter.sendMail({
      from: `"Voulamandis House Website" <${smtpFrom}>`,
      to: contactTo,
      replyTo: email,
      subject: `New inquiry from ${fullName}`,
      text: textLines.join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
          <h2>New inquiry from chioshotel.gr</h2>
          <p><strong>Name:</strong> ${safe.fullName}</p>
          <p><strong>Email:</strong> ${safe.email}</p>
          <p><strong>Phone:</strong> ${safe.phone}</p>
          <p><strong>Check-in:</strong> ${safe.checkin}</p>
          <p><strong>Check-out:</strong> ${safe.checkout}</p>
          <p><strong>Room:</strong> ${safe.room}</p>
          <p><strong>Language:</strong> ${safe.language}</p>
          <p><strong>Page:</strong> ${safe.page}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${safe.message}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form email error:", error);

    return NextResponse.json(
      { ok: false, error: "Could not send message. Please try again later." },
      { status: 500 }
    );
  }
}

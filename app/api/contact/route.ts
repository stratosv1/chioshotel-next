import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 4;
const MIN_FORM_FILL_MS = 2500;

type RateLimitEntry = { count: number; resetAt: number };
type GlobalWithContactRateLimit = typeof globalThis & {
  __contactRateLimit?: Map<string, RateLimitEntry>;
};

const globalStore = globalThis as GlobalWithContactRateLimit;
const rateLimitStore = globalStore.__contactRateLimit ?? new Map<string, RateLimitEntry>();
globalStore.__contactRateLimit = rateLimitStore;

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
  website?: string;
  company?: string;
  formStartedAt?: number | string;
};

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function isValidPhone(phone: string): boolean {
  if (phone.length < 6 || phone.length > 35) return false;
  if (!/^[+()\-\s.\d]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 18;
}

function isValidPersonName(value: string): boolean {
  if (value.length < 2 || value.length > 50) return false;
  if (/\d|https?:\/\/|www\./i.test(value)) return false;
  if (!/^[\p{L}\p{M}'’\-.\s]+$/u.test(value)) return false;

  const letters = value.replace(/[^\p{L}]/gu, "");
  if (letters.length < 2) return false;

  // Long single-token strings with almost no vowels are typical bot-generated values.
  const compact = value.replace(/[^\p{L}]/gu, "");
  const vowels = (compact.match(/[aeiouyαεηιουωάέήίόύώϊΐϋΰ]/giu) || []).length;
  if (!/\s/.test(value) && compact.length >= 14 && vowels / compact.length < 0.18) return false;

  return true;
}

function isSuspiciousText(value: string): boolean {
  if (!value) return false;
  if (value.length > 3000) return true;
  if (/(https?:\/\/|www\.|<a\s|\[url)/i.test(value)) return true;
  if (/(.)\1{7,}/u.test(value)) return true;

  const compact = value.replace(/\s/g, "");
  if (compact.length >= 18) {
    const letters = compact.match(/[A-Za-z]/g)?.length ?? 0;
    const vowels = compact.match(/[aeiouy]/gi)?.length ?? 0;
    const mixedCaseTransitions = (compact.match(/[a-z][A-Z]|[A-Z][a-z]/g) || []).length;
    if (letters / compact.length > 0.85 && vowels / Math.max(letters, 1) < 0.16 && mixedCaseTransitions >= 4) {
      return true;
    }
  }

  return false;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) rateLimitStore.delete(key);
  }

  const current = rateLimitStore.get(ip);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  rateLimitStore.set(ip, current);
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function spamResponse() {
  // Return a generic success response so automated bots do not learn which check caught them.
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as ContactPayload;

    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const checkin = clean(body.checkin);
    const checkout = clean(body.checkout);
    const room = clean(body.room);
    const message = clean(body.message);
    const language = clean(body.language);
    const page = clean(body.page);
    const honeypot = clean(body.website || body.company);
    const formStartedAt = Number(body.formStartedAt || 0);

    if (honeypot) return spamResponse();

    if (formStartedAt > 0) {
      const elapsed = Date.now() - formStartedAt;
      if (!Number.isFinite(elapsed) || elapsed < MIN_FORM_FILL_MS || elapsed > 24 * 60 * 60 * 1000) {
        return spamResponse();
      }
    }

    if (!firstName || !lastName || !email || !phone || !checkin || !checkout) {
      return NextResponse.json(
        { ok: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!isValidPersonName(firstName) || !isValidPersonName(lastName)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid name." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    if (isSuspiciousText(message) || isSuspiciousText(room)) return spamResponse();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkin) || !/^\d{4}-\d{2}-\d{2}$/.test(checkout)) {
      return NextResponse.json(
        { ok: false, error: "Please enter valid dates." },
        { status: 400 }
      );
    }

    if (checkout <= checkin) {
      return NextResponse.json(
        { ok: false, error: "Check-out must be after check-in." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
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

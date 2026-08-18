import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { markRoomFinderEnquirySent } from "@/lib/ai-assistant/conversation-store";
import {
  checkPublicAiRateLimit,
  clientIp,
  isAllowedAiBrowserOrigin,
  requestBodyTooLarge,
} from "@/lib/ai-assistant/public-api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 24_000;

type SummaryEmailBody = {
  subject?: string;
  message?: string;
  source?: string;
  guest?: {
    firstName?: string;
    lastName?: string;
    name?: string;
    phone?: string;
    email?: string;
    privacyAccepted?: boolean;
    privacyAcceptedAt?: string;
  };
};

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") || "";
  for (const part of cookieHeader.split(";")) {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (rawKey === name) {
      try {
        return decodeURIComponent(rawValue.join("="));
      } catch {
        return rawValue.join("=");
      }
    }
  }
  return "";
}

function noStoreJson(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return NextResponse.json(body, { ...init, headers });
}

export async function POST(request: NextRequest) {
  try {
    if (!isAllowedAiBrowserOrigin(request)) {
      return noStoreJson({ ok: false, code: "FORBIDDEN_ORIGIN" }, { status: 403 });
    }
    if (requestBodyTooLarge(request, MAX_BODY_BYTES)) {
      return noStoreJson({ ok: false, code: "REQUEST_TOO_LARGE" }, { status: 413 });
    }

    const rate = await checkPublicAiRateLimit("room-finder-summary-email", clientIp(request), {
      minute: 5,
      hour: 20,
    });
    if (rate.limited) {
      return noStoreJson(
        { ok: false, code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
      );
    }

    const body = (await request.json()) as SummaryEmailBody;
    if (Buffer.byteLength(JSON.stringify(body), "utf8") > MAX_BODY_BYTES) {
      return noStoreJson({ ok: false, code: "REQUEST_TOO_LARGE" }, { status: 413 });
    }

    const subject = clean(body.subject, 180) || "Αίτημα διαμονής από AI Room Finder";
    const message = clean(body.message, 6000);
    const source = clean(body.source, 40);
    const heading = source === "room-wizard"
      ? "Νέο αίτημα διαμονής από το Room Wizard"
      : "Νέο αίτημα διαμονής από το AI Room Finder";
    const guestEmail = clean(body.guest?.email, 254);

    if (!message) {
      return noStoreJson({ ok: false, error: "Missing enquiry summary." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const receptionEmail = process.env.CONTACT_TO || "chioshotel@gmail.com";

    if (!smtpUser || !smtpPass || !smtpFrom || !receptionEmail) {
      return noStoreJson(
        { ok: false, error: "Email service is not configured." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.verify();

    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
    const info = await transporter.sendMail({
      from: `"Voulamandis House Website" <${smtpFrom}>`,
      to: receptionEmail,
      replyTo: isLikelyEmail(guestEmail) ? guestEmail : smtpUser,
      subject,
      text: message,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.65;color:#222">
          <h2>${escapeHtml(heading)}</h2>
          <p><strong>Προσοχή:</strong> Πρόκειται για αίτημα ενδιαφέροντος και όχι για επιβεβαιωμένη κράτηση.</p>
          <hr />
          <p>${safeMessage}</p>
        </div>
      `,
    });

    const accepted = (info.accepted || []).map(String);
    const rejected = (info.rejected || []).map(String);
    const deliveredToReception = accepted.some(
      (address) => address.toLowerCase() === receptionEmail.toLowerCase(),
    );

    if (!deliveredToReception) {
      console.error("AI summary email was not accepted by SMTP server", {
        accepted,
        rejected,
        response: info.response,
        messageId: info.messageId,
      });
      return noStoreJson(
        { ok: false, error: "The email server did not accept the reception address." },
        { status: 502 },
      );
    }

    if (source === "ai-room-finder") {
      const roomFinderSessionId = readCookie(request, "ai_rf_session");
      if (roomFinderSessionId && body.guest) {
        try {
          await markRoomFinderEnquirySent(roomFinderSessionId, body.guest);
        } catch (error) {
          console.error("Could not link AI Room Finder enquiry to staff inbox", error);
        }
      }
    }

    return noStoreJson({
      ok: true,
      emailSent: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("AI summary email error:", error);
    return noStoreJson(
      { ok: false, error: "Could not send enquiry email." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { markRoomFinderEnquirySent } from "@/lib/ai-assistant/conversation-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SummaryEmailBody;
    const subject = clean(body.subject, 180) || "Αίτημα διαμονής από AI Room Finder";
    const message = clean(body.message, 6000);
    const source = clean(body.source, 40);
    const heading = source === "room-wizard"
      ? "Νέο αίτημα διαμονής από το Room Wizard"
      : "Νέο αίτημα διαμονής από το AI Room Finder";
    const guestEmail = clean(body.guest?.email, 254);

    if (!message) {
      return NextResponse.json({ ok: false, error: "Missing enquiry summary." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const receptionEmail = process.env.CONTACT_TO || "chioshotel@gmail.com";

    if (!smtpUser || !smtpPass || !smtpFrom || !receptionEmail) {
      return NextResponse.json(
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
      return NextResponse.json(
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

    return NextResponse.json({
      ok: true,
      emailSent: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("AI summary email error:", error);
    return NextResponse.json(
      { ok: false, error: "Could not send enquiry email." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RECEPTION_EMAIL = "chioshotel@gmail.com";

type SummaryEmailBody = {
  subject?: string;
  message?: string;
};

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SummaryEmailBody;
    const subject = clean(body.subject, 180) || "Αίτημα διαμονής από AI Room Finder";
    const message = clean(body.message, 6000);

    if (!message) {
      return NextResponse.json({ ok: false, error: "Missing enquiry summary." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    if (!smtpUser || !smtpPass || !smtpFrom) {
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

    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

    await transporter.sendMail({
      from: `"Voulamandis House Website" <${smtpFrom}>`,
      to: RECEPTION_EMAIL,
      subject,
      text: message,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.65;color:#222">
          <h2>Νέο αίτημα διαμονής από το AI Room Finder</h2>
          <p><strong>Προσοχή:</strong> Πρόκειται για αίτημα ενδιαφέροντος και όχι για επιβεβαιωμένη κράτηση.</p>
          <hr />
          <p>${safeMessage}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, emailSent: true });
  } catch (error) {
    console.error("AI summary email error:", error);
    return NextResponse.json(
      { ok: false, error: "Could not send enquiry email." },
      { status: 500 },
    );
  }
}

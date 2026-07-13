import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  contact?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  conversation?: { role?: string; content?: string }[];
  language?: string;
};

function clean(value: unknown, max = 1200) {
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
    const body = (await request.json()) as Body;
    const name = clean(body.name, 120);
    const contact = clean(body.contact, 160);
    const checkin = clean(body.checkin, 10);
    const checkout = clean(body.checkout, 10);
    const guests = Number(body.guests || 0);
    const language = clean(body.language, 10) || "el";
    const conversation = Array.isArray(body.conversation)
      ? body.conversation
          .slice(-16)
          .map((item) => `${item?.role === "assistant" ? "Βοηθός" : "Πελάτης"}: ${clean(item?.content, 900)}`)
          .filter(Boolean)
          .join("\n")
      : "";

    if (!name || !contact || !checkin || !checkout || !Number.isInteger(guests) || guests < 1) {
      return NextResponse.json({ ok: false, error: "Missing enquiry details." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const contactTo = process.env.CONTACT_TO || process.env.RECEPTION_EMAIL || smtpUser;

    if (!smtpUser || !smtpPass || !smtpFrom || !contactTo) {
      return NextResponse.json({ ok: false, error: "Email service is not configured." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const subject = `Έλεγχος διαθεσιμότητας από AI Room Finder — ${checkin} έως ${checkout}`;
    const text = [
      "ΑΙΤΗΜΑ ΧΕΙΡΟΚΙΝΗΤΟΥ ΕΛΕΓΧΟΥ ΔΙΑΘΕΣΙΜΟΤΗΤΑΣ",
      "Δεν αποτελεί κράτηση ή επιβεβαίωση κράτησης.",
      "",
      `Όνομα: ${name}`,
      `Κινητό ή email: ${contact}`,
      `Άφιξη: ${checkin}`,
      `Αναχώρηση: ${checkout}`,
      `Επισκέπτες: ${guests}`,
      `Γλώσσα: ${language}`,
      "",
      "Ο πελάτης ζήτησε άμεσο έλεγχο από τη reception επειδή δεν προέκυψε επιβεβαιωμένη διαθεσιμότητα από τα πρόσφατα στοιχεία.",
      conversation ? `\nΣΥΝΟΜΙΛΙΑ\n${conversation}` : "",
      "",
      `Επικοινωνήστε άμεσα με τον πελάτη στο: ${contact}`,
    ].filter(Boolean).join("\n");

    const safeConversation = escapeHtml(conversation || "-").replaceAll("\n", "<br />");

    await transporter.sendMail({
      from: `"Voulamandis House Website" <${smtpFrom}>`,
      to: contactTo,
      replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ? contact : undefined,
      subject,
      text,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
          <h2>Αίτημα άμεσου ελέγχου διαθεσιμότητας</h2>
          <p><strong>Προσοχή:</strong> Δεν αποτελεί κράτηση ή επιβεβαίωση κράτησης.</p>
          <p><strong>Όνομα:</strong> ${escapeHtml(name)}</p>
          <p><strong>Κινητό ή email:</strong> ${escapeHtml(contact)}</p>
          <p><strong>Άφιξη:</strong> ${escapeHtml(checkin)}</p>
          <p><strong>Αναχώρηση:</strong> ${escapeHtml(checkout)}</p>
          <p><strong>Επισκέπτες:</strong> ${guests}</p>
          <p><strong>Γλώσσα:</strong> ${escapeHtml(language)}</p>
          <hr />
          <p>Ο πελάτης ζήτησε άμεσο χειροκίνητο έλεγχο από τη reception.</p>
          <p><strong>Συνομιλία:</strong></p>
          <p>${safeConversation}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("No-availability reception email error:", error);
    return NextResponse.json({ ok: false, error: "Could not send the enquiry." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ConversationMessage = { role?: string; content?: string };

type RequestEmailBody = {
  requestId?: string;
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
  proposedTotal?: number;
  phone?: string;
  email?: string;
  conversation?: ConversationMessage[];
};

function clean(value: unknown, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function isValidEmail(value: string) {
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestEmailBody;
    const requestId = clean(body.requestId, 80);
    const name = clean(body.name, 120);
    const contact = clean(body.contact, 220);
    const message = clean(body.message, 2000);
    const checkin = clean(body.checkin, 10);
    const checkout = clean(body.checkout, 10);
    const guests = Number(body.guests || 0);
    const roomId = clean(body.roomId, 40);
    const unitId = clean(body.unitId, 40);
    const roomName = clean(body.roomName, 160);
    const originalTotal = Number(body.originalTotal || 0);
    const directTotal = Number(body.directTotal || 0);
    const proposedTotal = Number(body.proposedTotal || 0);
    const phone = clean(body.phone, 80);
    const email = clean(body.email, 160);
    const conversation = Array.isArray(body.conversation)
      ? body.conversation
          .slice(-16)
          .map((item) => ({ role: clean(item?.role, 20), content: clean(item?.content, 700) }))
          .filter((item) => item.content)
      : [];
    const isPriceProposal = proposedTotal > 0;

    if (!name || !contact || !checkin || !checkout || !roomName || !Number.isInteger(guests) || guests < 1) {
      return NextResponse.json({ ok: false, error: "Missing request details." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const contactTo = process.env.CONTACT_TO || process.env.RECEPTION_EMAIL || smtpUser;

    if (!smtpUser || !smtpPass || !smtpFrom || !contactTo) {
      return NextResponse.json(
        { ok: false, error: "Email service is not configured with the contact-form SMTP settings." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const subjectId = requestId ? ` #${requestId}` : "";
    const subject = isPriceProposal
      ? `Νέα πρόταση ειδικής τιμής${subjectId} — ${roomName}`
      : `Νέο αίτημα ενδιαφέροντος${subjectId} — ${roomName}`;
    const conversationText = conversation.length
      ? conversation.map((item) => `${item.role === "user" ? "Πελάτης" : "AI"}: ${item.content}`).join("\n")
      : "";
    const text = [
      isPriceProposal ? "ΝΕΑ ΠΡΟΤΑΣΗ ΕΙΔΙΚΗΣ ΤΙΜΗΣ ΑΠΟ ΤΟ AI ASSISTANT" : "ΝΕΟ ΑΙΤΗΜΑ ΕΝΔΙΑΦΕΡΟΝΤΟΣ ΑΠΟ ΤΟ AI ASSISTANT",
      "Δεν αποτελεί κράτηση ή επιβεβαίωση κράτησης.",
      "",
      requestId ? `Αριθμός αιτήματος: #${requestId}` : "",
      `Όνομα: ${name}`,
      phone ? `Κινητό: ${phone}` : "",
      email ? `Email: ${email}` : "",
      !phone && !email ? `Στοιχεία επικοινωνίας: ${contact}` : "",
      `Δωμάτιο: ${roomName}`,
      roomId || unitId ? `Room ID / Unit ID: ${roomId || "-"} / ${unitId || "-"}` : "",
      `Άφιξη: ${checkin}`,
      `Αναχώρηση: ${checkout}`,
      `Επισκέπτες: ${guests}`,
      originalTotal > 0 ? `Αρχική τιμή: €${originalTotal.toFixed(2)}` : "",
      directTotal > 0 ? `Τρέχουσα απευθείας τιμή: €${directTotal.toFixed(2)}` : "",
      proposedTotal > 0 ? `Προτεινόμενη συνολική τιμή πελάτη: €${proposedTotal.toFixed(2)}` : "",
      "",
      `Μήνυμα / προτιμήσεις: ${message || "-"}`,
      conversationText ? "\nΤΕΛΕΥΤΑΙΑ ΣΥΝΟΜΙΛΙΑ:\n" + conversationText : "",
      "",
      `Επικοινωνήστε με τον πελάτη στο: ${phone || email || contact}`,
    ].filter(Boolean).join("\n");

    const safe = {
      requestId: escapeHtml(requestId || "-"),
      name: escapeHtml(name),
      contact: escapeHtml(contact),
      phone: escapeHtml(phone || "-"),
      email: escapeHtml(email || "-"),
      roomName: escapeHtml(roomName),
      roomId: escapeHtml(roomId || "-"),
      unitId: escapeHtml(unitId || "-"),
      checkin: escapeHtml(checkin),
      checkout: escapeHtml(checkout),
      guests: escapeHtml(String(guests)),
      message: escapeHtml(message || "-").replaceAll("\n", "<br />"),
      conversation: conversation.length
        ? conversation
            .map((item) => `<p style="margin:0 0 8px"><strong>${item.role === "user" ? "Πελάτης" : "AI"}:</strong> ${escapeHtml(item.content)}</p>`)
            .join("")
        : "",
    };

    await transporter.sendMail({
      from: `"Voulamandis House Website" <${smtpFrom}>`,
      to: contactTo,
      ...(isValidEmail(email || contact) ? { replyTo: email || contact } : {}),
      subject,
      text,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
          <h2>${isPriceProposal ? "Νέα πρόταση ειδικής τιμής" : "Νέο αίτημα ενδιαφέροντος"} από το AI Assistant</h2>
          <p><strong>Προσοχή:</strong> Δεν αποτελεί κράτηση ή επιβεβαίωση κράτησης.</p>
          <p><strong>Αριθμός αιτήματος:</strong> ${safe.requestId}</p>
          <p><strong>Όνομα:</strong> ${safe.name}</p>
          ${phone ? `<p><strong>Κινητό:</strong> ${safe.phone}</p>` : ""}
          ${email ? `<p><strong>Email:</strong> ${safe.email}</p>` : ""}
          ${!phone && !email ? `<p><strong>Στοιχεία επικοινωνίας:</strong> ${safe.contact}</p>` : ""}
          <p><strong>Δωμάτιο:</strong> ${safe.roomName}</p>
          <p><strong>Room ID / Unit ID:</strong> ${safe.roomId} / ${safe.unitId}</p>
          <p><strong>Άφιξη:</strong> ${safe.checkin}</p>
          <p><strong>Αναχώρηση:</strong> ${safe.checkout}</p>
          <p><strong>Επισκέπτες:</strong> ${safe.guests}</p>
          ${originalTotal > 0 ? `<p><strong>Αρχική τιμή:</strong> €${originalTotal.toFixed(2)}</p>` : ""}
          ${directTotal > 0 ? `<p><strong>Τρέχουσα απευθείας τιμή:</strong> €${directTotal.toFixed(2)}</p>` : ""}
          ${proposedTotal > 0 ? `<p style="font-size:18px"><strong>Προτεινόμενη συνολική τιμή πελάτη:</strong> €${proposedTotal.toFixed(2)}</p>` : ""}
          <hr />
          <p><strong>Μήνυμα / προτιμήσεις:</strong></p>
          <p>${safe.message}</p>
          ${safe.conversation ? `<hr /><h3>Τελευταία συνομιλία</h3>${safe.conversation}` : ""}
        </div>
      `,
    });

    return NextResponse.json({ ok: true, emailSent: true });
  } catch (error) {
    console.error("AI room-interest SMTP email error:", error);
    return NextResponse.json({ ok: false, error: "Could not send request email." }, { status: 500 });
  }
}

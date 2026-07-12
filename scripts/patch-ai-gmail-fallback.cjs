const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'app/api/ai-assistant/request/route.ts');
let source = fs.readFileSync(file, 'utf8');

if (!source.includes('import nodemailer from "nodemailer"')) {
  source = source.replace(
    'import { neon } from "@neondatabase/serverless";',
    'import { neon } from "@neondatabase/serverless";\nimport nodemailer from "nodemailer";'
  );
}

const marker = `    return NextResponse.json(
      { ok: true, requestId, emailSent, summarySaved: true, liveVerified: true, receptionEmail },`;

if (!source.includes('Gmail fallback failed') && source.includes(marker)) {
  const insertion = `    if (!emailSent) {
      const gmailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
      const gmailPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD || process.env.EMAIL_PASS;
      if (gmailUser && gmailPassword) {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: gmailUser, pass: gmailPassword },
          });
          await transporter.sendMail({
            from: process.env.RECEPTION_FROM_EMAIL || \`Voulamandis House <\${gmailUser}>\`,
            to: receptionEmail,
            replyTo: /@/.test(contact) ? contact : undefined,
            subject: \`Νέο επιβεβαιωμένο live αίτημα #\${requestId} — \${verifiedRoomName}\`,
            text: [
              "ΝΕΟ ΑΙΤΗΜΑ ΑΠΟ ΤΟ GUEST ASSISTANT",
              "LIVE ΔΙΑΘΕΣΙΜΟΤΗΤΑ ΚΑΙ ΤΙΜΗ ΕΠΑΝΕΛΕΓΧΘΗΚΑΝ",
              "",
              \`Αριθμός αιτήματος: #\${requestId}\`,
              \`Όνομα: \${name}\`,
              \`Τηλέφωνο ή email: \${contact}\`,
              message ? \`Μήνυμα πελάτη: \${message}\` : "Μήνυμα πελάτη: —",
              "",
              \`Δωμάτιο: \${verifiedRoomName}\`,
              \`Room ID / Unit ID: \${roomId} / \${unitId}\`,
              \`Άφιξη: \${checkin}\`,
              \`Αναχώρηση: \${checkout}\`,
              \`Νύχτες: \${nights}\`,
              \`Επισκέπτες: \${guests}\`,
              \`Αρχική τιμή: €\${originalTotal.toFixed(2)}\`,
              \`Τιμή απευθείας κράτησης: €\${directTotal.toFixed(2)}\`,
              "",
              "ΣΥΝΟΨΗ ΣΥΖΗΤΗΣΗΣ",
              conversationSummary,
              conversationTranscript ? "\\nΠΛΗΡΗΣ ΣΥΖΗΤΗΣΗ\\n" + conversationTranscript : "",
            ].filter(Boolean).join("\\n"),
          });
          emailSent = true;
        } catch (gmailError) {
          console.error("Gmail fallback failed", gmailError);
        }
      } else {
        console.error("Reception email not sent: configure RESEND_API_KEY or GMAIL_USER and GMAIL_APP_PASSWORD");
      }
    }

`;
  source = source.replace(marker, insertion + marker);
}

fs.writeFileSync(file, source);
console.log('AI Gmail fallback patched');

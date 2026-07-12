const fs = require('fs');

const path = 'app/api/ai-assistant/request/route.ts';
let source = fs.readFileSync(path, 'utf8');

if (!source.includes('import nodemailer from "nodemailer";')) {
  source = source.replace(
    'import { neon } from "@neondatabase/serverless";\n',
    'import { neon } from "@neondatabase/serverless";\nimport nodemailer from "nodemailer";\n',
  );
}

const start = source.indexOf('    let emailSent = false;');
const endMarker = '    return NextResponse.json(\n';
const end = source.indexOf(endMarker, start);

if (start === -1 || end === -1) {
  console.error('patch-ai-gmail-email: email block not found');
  process.exit(1);
}

const replacement = `    let emailSent = false;\n    const receptionEmail = process.env.RECEPTION_EMAIL || RECEPTION_EMAIL;\n    const gmailUser = process.env.GMAIL_USER;\n    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;\n\n    const emailText = [\n      "ΝΕΟ ΑΙΤΗΜΑ ΑΠΟ ΤΟ GUEST ASSISTANT",\n      "",\n      \\`Αριθμός αιτήματος: #\\${requestId}\\`,\n      "",\n      "ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ",\n      \\`Όνομα: \\${name}\\`,\n      \\`Τηλέφωνο ή email: \\${contact}\\`,\n      message ? \\`Μήνυμα πελάτη: \\${message}\\` : "Μήνυμα πελάτη: —",\n      "",\n      "ΣΤΟΙΧΕΙΑ ΔΙΑΜΟΝΗΣ",\n      \\`Δωμάτιο: \\${roomName}\\`,\n      \\`Room ID / Unit ID: \\${roomId || "—"} / \\${unitId || "—"}\\`,\n      \\`Άφιξη: \\${checkin}\\`,\n      \\`Αναχώρηση: \\${checkout}\\`,\n      \\`Επισκέπτες: \\${guests}\\`,\n      \\`Αρχική τιμή: €\\${originalTotal.toFixed(2)}\\`,\n      \\`Τιμή απευθείας κράτησης: €\\${directTotal.toFixed(2)}\\`,\n      "Δεν περιλαμβάνονται: φόρος ανθεκτικότητας 2 € ανά διανυκτέρευση και προαιρετικό πρωινό 12 € ανά άτομο ανά ημέρα.",\n      "",\n      "ΣΥΝΟΨΗ ΣΥΖΗΤΗΣΗΣ",\n      conversationSummary,\n      conversationTranscript ? "\\nΠΛΗΡΗΣ ΣΥΖΗΤΗΣΗ\\n" + conversationTranscript : "",\n      "",\n      "ΕΝΕΡΓΕΙΑ RECEPTION",\n      \\`Επικοινωνήστε με τον πελάτη στο: \\${contact}\\`,\n    ].filter(Boolean).join("\\n");\n\n    if (gmailUser && gmailAppPassword) {\n      try {\n        const transporter = nodemailer.createTransport({\n          service: "gmail",\n          auth: { user: gmailUser, pass: gmailAppPassword },\n        });\n\n        await transporter.sendMail({\n          from: \\`Voulamandis House <\\${gmailUser}>\\`,\n          to: receptionEmail,\n          subject: \\`Νέο αίτημα από Guest Assistant #\\${requestId} — \\${roomName}\\`,\n          text: emailText,\n          replyTo: contact.includes("@") ? contact : undefined,\n        });\n        emailSent = true;\n      } catch (emailError) {\n        console.error("Reception Gmail email failed", emailError);\n      }\n    } else {\n      console.error("Reception email not sent: GMAIL_USER or GMAIL_APP_PASSWORD is missing");\n    }\n\n`;

source = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(path, source);
console.log('patch-ai-gmail-email: applied');

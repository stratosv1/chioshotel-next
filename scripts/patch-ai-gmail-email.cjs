const fs = require('fs');

const path = 'app/api/ai-assistant/request/route.ts';

if (!fs.existsSync(path)) {
  console.log('patch-ai-gmail-email: target missing, skipping');
  process.exit(0);
}

let source = fs.readFileSync(path, 'utf8');

// The current AI request flow sends mail through dedicated SMTP routes.
// In that architecture this old build-time patch is no longer required.
const usesDedicatedEmailRoute =
  fs.existsSync('app/api/ai-assistant/request-email/route.ts') ||
  fs.existsSync('app/api/ai-assistant/no-availability-request/route.ts');

const hasLegacyEmailBlock = source.includes('    let emailSent = false;');

if (usesDedicatedEmailRoute && !hasLegacyEmailBlock) {
  console.log('patch-ai-gmail-email: dedicated SMTP email flow detected, no change needed');
  process.exit(0);
}

if (!source.includes('import nodemailer from "nodemailer";')) {
  source = source.replace(
    'import { neon } from "@neondatabase/serverless";\n',
    'import { neon } from "@neondatabase/serverless";\nimport nodemailer from "nodemailer";\n',
  );
}

const start = source.indexOf('    let emailSent = false;');
const endMarker = '    return NextResponse.json(\n';
const end = start === -1 ? -1 : source.indexOf(endMarker, start);

// Never fail production builds because a legacy patch target changed.
if (start === -1 || end === -1) {
  console.log('patch-ai-gmail-email: legacy email block not found, skipping');
  process.exit(0);
}

const replacement = [
  '    let emailSent = false;',
  '    const receptionEmail = process.env.RECEPTION_EMAIL || RECEPTION_EMAIL;',
  '    const gmailUser = process.env.GMAIL_USER;',
  '    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;',
  '',
  '    const emailText = [',
  '      "ΝΕΟ ΑΙΤΗΜΑ ΑΠΟ ΤΟ GUEST ASSISTANT",',
  '      "",',
  '      `Αριθμός αιτήματος: #${requestId}`,',
  '      "",',
  '      "ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ",',
  '      `Όνομα: ${name}`,',
  '      `Τηλέφωνο ή email: ${contact}`,',
  '      message ? `Μήνυμα πελάτη: ${message}` : "Μήνυμα πελάτη: —",',
  '      "",',
  '      "ΣΤΟΙΧΕΙΑ ΔΙΑΜΟΝΗΣ",',
  '      `Δωμάτιο: ${roomName}`,',
  '      `Room ID / Unit ID: ${roomId || "—"} / ${unitId || "—"}`,',
  '      `Άφιξη: ${checkin}`,',
  '      `Αναχώρηση: ${checkout}`,',
  '      `Επισκέπτες: ${guests}`,',
  '      `Αρχική τιμή: €${originalTotal.toFixed(2)}`,',
  '      `Τιμή απευθείας κράτησης: €${directTotal.toFixed(2)}`,',
  '      "Δεν περιλαμβάνονται: φόρος ανθεκτικότητας 2 € ανά διανυκτέρευση και προαιρετικό πρωινό 12 € ανά άτομο ανά ημέρα.",',
  '      "",',
  '      "ΣΥΝΟΨΗ ΣΥΖΗΤΗΣΗΣ",',
  '      conversationSummary,',
  '      conversationTranscript ? "\\nΠΛΗΡΗΣ ΣΥΖΗΤΗΣΗ\\n" + conversationTranscript : "",',
  '      "",',
  '      "ΕΝΕΡΓΕΙΑ RECEPTION",',
  '      `Επικοινωνήστε με τον πελάτη στο: ${contact}`,',
  '    ].filter(Boolean).join("\\n");',
  '',
  '    if (gmailUser && gmailAppPassword) {',
  '      try {',
  '        const transporter = nodemailer.createTransport({',
  '          service: "gmail",',
  '          auth: { user: gmailUser, pass: gmailAppPassword },',
  '        });',
  '',
  '        await transporter.sendMail({',
  '          from: `Voulamandis House <${gmailUser}>`,',
  '          to: receptionEmail,',
  '          subject: `Νέο αίτημα από Guest Assistant #${requestId} — ${roomName}`,',
  '          text: emailText,',
  '          replyTo: contact.includes("@") ? contact : undefined,',
  '        });',
  '        emailSent = true;',
  '      } catch (emailError) {',
  '        console.error("Reception Gmail email failed", emailError);',
  '      }',
  '    } else {',
  '      console.error("Reception email not sent: GMAIL_USER or GMAIL_APP_PASSWORD is missing");',
  '    }',
  '',
].join('\n');

source = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(path, source);
console.log('patch-ai-gmail-email: applied');

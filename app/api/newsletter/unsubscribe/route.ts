import { NextRequest, NextResponse } from "next/server";
import { isValidUnsubscribe, unsubscribeGuest } from "@/lib/crm/greetings";
import { normalizeEmail } from "@/lib/crm/store";
import type { EmailLanguage } from "@/lib/crm/email-design";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public link at the bottom of the seasonal greetings. The token is signed, so
// nobody can unsubscribe someone else.

const TEXT: Record<EmailLanguage, { ask: string; button: string; done: string; note: string; invalid: string }> = {
  el: { ask: "Θέλετε να σταματήσετε να λαμβάνετε ευχές και ενημερώσεις από το Voulamandis House;", button: "Ναι, διαγραφή", done: "Η διαγραφή έγινε", note: "Δεν θα λαμβάνετε πλέον ευχές και ενημερώσεις από το Voulamandis House. Τα email για τις κρατήσεις σας θα συνεχίσουν να έρχονται κανονικά.", invalid: "Ο σύνδεσμος δεν είναι έγκυρος." },
  en: { ask: "Would you like to stop receiving greetings and news from Voulamandis House?", button: "Yes, unsubscribe", done: "You have been unsubscribed", note: "You will no longer receive greetings or news from Voulamandis House. Emails about your bookings will still reach you as usual.", invalid: "This link is not valid." },
  tr: { ask: "Voulamandis House'tan tebrik ve haber almayı bırakmak istiyor musunuz?", button: "Evet, abonelikten çık", done: "Abonelikten çıkıldı", note: "Artık Voulamandis House'tan tebrik ve haber almayacaksınız. Rezervasyonlarınızla ilgili e-postalar her zamanki gibi gelmeye devam edecek.", invalid: "Bu bağlantı geçerli değil." },
};

const pickLanguage = (value: string | null): EmailLanguage => (value === "el" || value === "tr" ? value : "en");

type State = "ask" | "done" | "invalid";

function page(language: EmailLanguage, state: State, action = "") {
  const text = TEXT[language];
  const title = state === "ask" ? "Voulamandis House" : state === "done" ? text.done : text.invalid;
  const content =
    state === "ask" ? `<p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#4a5550">${text.ask}</p><form method="post" action="${action}"><button type="submit" style="border:0;border-radius:12px;background:#2f6b4f;color:#fff;padding:14px 24px;font-size:15px;font-weight:700;cursor:pointer">${text.button}</button></form>`
    : state === "done" ? `<p style="margin:0;font-size:16px;line-height:1.6;color:#4a5550">${text.note}</p>` : "";
  const html = `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head>
<body style="margin:0;background:#f6f2eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1d2b25">
<main style="max-width:520px;margin:12vh auto;padding:32px 24px;background:#fff;border-radius:20px">
<p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:.22em">VOULAMANDIS HOUSE</p>
<h1 style="margin:0 0 12px;font-size:24px">${title}</h1>
${content}
</main></body></html>`;
  return new NextResponse(html, { status: state === "invalid" ? 400 : 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}

const escapeAttr = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

function read(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const email = normalizeEmail(params.get("e"));
  return { email, language: pickLanguage(params.get("l")), valid: isValidUnsubscribe(email, params.get("t") ?? "") };
}

// Opening the link only asks: mail scanners that follow links must not unsubscribe anyone.
export async function GET(request: NextRequest) {
  const { language, valid } = read(request);
  return page(language, valid ? "ask" : "invalid", escapeAttr(`${request.nextUrl.pathname}${request.nextUrl.search}`));
}

// The button above, and Gmail's one-click unsubscribe (List-Unsubscribe-Post).
export async function POST(request: NextRequest) {
  const { email, language, valid } = read(request);
  if (!valid) return page(language, "invalid");
  try {
    await unsubscribeGuest(email, language);
    return page(language, "done");
  } catch (error) {
    console.error("newsletter unsubscribe failed", error);
    return new NextResponse("Error", { status: 500 });
  }
}

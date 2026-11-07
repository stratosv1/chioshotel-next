// Shared building blocks for every guest email: table-based HTML with inline
// styles, because email clients ignore most modern CSS. No Node or DB imports:
// staff previews render these in the browser.

export type EmailLanguage = "el" | "en" | "tr";

export const SITE_URL = "https://chioshotel.gr";
export const RESERVATIONS_EMAIL = "vhouse.reservations@gmail.com";
export const WHATSAPP_URL = "https://wa.me/306944474226";
export const MAPS_URL = "https://www.google.com/maps/place/Voulamandis+House";
const HERO_IMAGE = `${SITE_URL}/images/voulamandis-house-og.jpg`;

const INK = "#1d2b25";
const BODY = "#4a5550";
const MUTED = "#7c8682";
const LINE = "#e8e3da";
const SAND = "#f6f2eb";
const GREEN = "#2f6b4f";
const MANDARIN = "#c9822f";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export const esc = (value: unknown) =>
  String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

export function dateLabel(iso: string, language: EmailLanguage, withWeekday = false) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  const locale = { el: "el-GR", en: "en-GB", tr: "tr-TR" }[language];
  return new Intl.DateTimeFormat(locale, {
    weekday: withWeekday ? "short" : undefined,
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export const nightsBetween = (checkin: string, checkout: string) =>
  Math.max(0, Math.round((Date.parse(`${checkout}T00:00:00Z`) - Date.parse(`${checkin}T00:00:00Z`)) / 86_400_000));

/** Body text may contain trusted markup; callers escape guest values first. */
export const paragraph = (html: string) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:${BODY}">${html}</p>`;

export const sectionTitle = (text: string) =>
  `<p style="margin:28px 0 12px;font-size:12px;line-height:1.3;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:${MUTED}">${esc(text)}</p>`;

export const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0"><tr><td style="border-radius:12px;background:${GREEN}"><a href="${esc(href)}" style="display:inline-block;padding:14px 24px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none">${esc(label)}</a></td></tr></table>`;

export const callout = (title: string, html: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0"><tr><td style="background:${SAND};border-radius:14px;padding:18px 20px"><p style="margin:0 0 6px;font-size:15px;font-weight:700;color:${INK}">${esc(title)}</p><div style="font-size:15px;line-height:1.6;color:${BODY}">${html}</div></td></tr></table>`;

/** Numbered checklist for things the guest has to do. */
export function steps(items: { title: string; html: string }[]) {
  const rows = items.map((item, index) => `<tr>
    <td valign="top" width="40" style="padding:0 0 18px"><div style="width:28px;height:28px;line-height:28px;border-radius:14px;background:${GREEN};color:#ffffff;text-align:center;font-size:14px;font-weight:700">${index + 1}</div></td>
    <td valign="top" style="padding:3px 0 18px"><p style="margin:0 0 3px;font-size:16px;font-weight:700;color:${INK}">${esc(item.title)}</p><div style="font-size:15px;line-height:1.6;color:${BODY}">${item.html}</div></td>
  </tr>`).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0">${rows}</table>`;
}

export function linkList(items: { href: string; title: string; note?: string }[]) {
  const rows = items.map((item) => `<tr><td style="padding:13px 0;border-bottom:1px solid ${LINE}"><a href="${esc(item.href)}" style="color:${GREEN};font-size:16px;font-weight:700;text-decoration:none">${esc(item.title)} →</a>${item.note ? `<div style="margin-top:2px;font-size:14px;line-height:1.5;color:${MUTED}">${esc(item.note)}</div>` : ""}</td></tr>`).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}

export function detailRows(rows: { label: string; value: string }[]) {
  const body = rows.filter((row) => row.value).map((row) => `<tr>
    <td valign="top" width="42%" style="padding:10px 12px 10px 0;border-bottom:1px solid ${LINE};font-size:14px;color:${MUTED}">${esc(row.label)}</td>
    <td valign="top" style="padding:10px 0;border-bottom:1px solid ${LINE};font-size:15px;font-weight:600;color:${INK}">${row.value}</td>
  </tr>`).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table>`;
}

const TICKET_LABELS = {
  el: { checkin: "Άφιξη", checkout: "Αναχώρηση", night: "διανυκτέρευση", nights: "διανυκτερεύσεις" },
  en: { checkin: "Check-in", checkout: "Check-out", night: "night", nights: "nights" },
  tr: { checkin: "Giriş", checkout: "Çıkış", night: "gece", nights: "gece" },
};

/** The "stay ticket": the one visual every booking email shares. */
export function stayTicket(language: EmailLanguage, rooms: { room: string; checkin: string; checkout: string }[], reference: string) {
  const labels = TICKET_LABELS[language];
  const cards = rooms.map(({ room, checkin, checkout }) => {
    const nights = nightsBetween(checkin, checkout);
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;border:1px solid ${LINE};border-radius:16px;border-collapse:separate">
      <tr><td colspan="3" style="padding:16px 20px 0"><p style="margin:0;font-size:16px;font-weight:700;color:${INK}">${esc(room)}</p>${nights ? `<p style="margin:2px 0 0;font-size:13px;color:${MUTED}">${nights} ${nights === 1 ? labels.night : labels.nights}</p>` : ""}</td></tr>
      <tr>
        <td valign="top" width="46%" style="padding:14px 0 18px 20px"><p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${MUTED}">${labels.checkin}</p><p style="margin:3px 0 0;font-size:17px;font-weight:700;color:${INK}">${esc(dateLabel(checkin, language, true))}</p></td>
        <td valign="middle" width="8%" align="center" style="padding-top:8px;font-size:20px;color:${MANDARIN}">→</td>
        <td valign="top" width="46%" style="padding:14px 20px 18px 8px"><p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${MUTED}">${labels.checkout}</p><p style="margin:3px 0 0;font-size:17px;font-weight:700;color:${INK}">${esc(dateLabel(checkout, language, true))}</p></td>
      </tr>
    </table>`;
  }).join("");
  return `<div style="margin:20px 0 8px">${cards}${reference ? `<p style="margin:0;font-size:13px;color:${MUTED}">${esc(reference)}</p>` : ""}</div>`;
}

const FOOTER = {
  el: { sign: "Με εκτίμηση,", team: "Αγγελική, Στράτος &amp; Μιχάλης", map: "Χάρτης", site: "Ιστοσελίδα", place: "Κάμπος, Χίος" },
  en: { sign: "Warm regards,", team: "Angeliki, Stratos &amp; Mike", map: "Map", site: "Website", place: "Kambos, Chios" },
  tr: { sign: "Sevgilerimizle,", team: "Angeliki, Stratos &amp; Mike", map: "Harita", site: "Web sitesi", place: "Kambos, Sakız Adası" },
};

export function emailShell(params: { language: EmailLanguage; preheader: string; eyebrow: string; heading: string; body: string; heroImage?: string | null; footerNote?: string }) {
  const footer = FOOTER[params.language];
  const hero = params.heroImage === null ? "" : `<tr><td style="padding:0;font-size:0;line-height:0"><img src="${esc(params.heroImage ?? HERO_IMAGE)}" width="600" alt="Voulamandis House" style="display:block;width:100%;max-width:600px;height:auto;max-height:260px;object-fit:cover;border:0"></td></tr>`;
  const footerLink = (href: string, label: string) => `<a href="${esc(href)}" style="color:${GREEN};font-weight:600;text-decoration:none">${label}</a>`;
  return `<!doctype html>
<html lang="${params.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(params.heading)}</title></head>
<body style="margin:0;padding:0;background:${SAND};font-family:${FONT};-webkit-font-smoothing:antialiased">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(params.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SAND}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
  <tr><td align="center" style="padding:4px 0 18px;font-size:13px;font-weight:700;letter-spacing:.22em;color:${INK}">VOULAMANDIS HOUSE</td></tr>
  <tr><td style="background:#ffffff;border-radius:20px;overflow:hidden">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${hero}
      <tr><td style="padding:30px 28px 8px">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:.04em;color:${MANDARIN}">${esc(params.eyebrow)}</p>
        <h1 style="margin:0 0 20px;font-size:27px;line-height:1.2;font-weight:700;letter-spacing:-.01em;color:${INK}">${esc(params.heading)}</h1>
        ${params.body}
        <p style="margin:28px 0 26px;font-size:15px;line-height:1.6;color:${BODY}">${footer.sign}<br><strong style="color:${INK}">${footer.team}</strong></p>
      </td></tr>
    </table>
  </td></tr>
  <tr><td align="center" style="padding:22px 12px 8px;font-size:13px;line-height:1.8;color:${MUTED}">
    ${footerLink(SITE_URL, footer.site)} &nbsp;·&nbsp; ${footerLink(MAPS_URL, footer.map)} &nbsp;·&nbsp; ${footerLink(WHATSAPP_URL, "WhatsApp")} &nbsp;·&nbsp; ${footerLink(`mailto:${RESERVATIONS_EMAIL}`, "Email")}<br>
    Voulamandis House · ${footer.place}${params.footerNote ? `<br>${params.footerNote}` : ""}
  </td></tr>
</table></td></tr></table></body></html>`;
}

export function htmlToText(html: string) {
  return html
    .replace(/<div style="display:none[\s\S]*?<\/div>/, "")
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<a href="(?!mailto)([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, "$2: $1")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/(p|div|tr|h1|li)>/g, "\n")
    .replace(/<\/td>/g, "  ")
    .replace(/<[^>]+>/g, "")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}

/** "✅ 92640049,92640050 - Papadopoulos": the Gmail script reads the ids from this. */
export const subjectPrefix = (bookingIds: string[], lastName: string) => `✅ ${bookingIds.join(",")} - ${lastName}`.trim();

export const EMAIL_TYPES = ["arrival", "chios_info", "welcome", "daily", "checkout", "thank_you"] as const;
export type EmailType = (typeof EMAIL_TYPES)[number];
export const EMAIL_LANGUAGES = ["el", "en", "tr"] as const;
export type EmailLanguage = (typeof EMAIL_LANGUAGES)[number];

export const EMAIL_TYPE_LABELS: Record<EmailType, { label: string; when: string }> = {
  arrival: { label: "Πριν την άφιξη", when: "7 ημέρες πριν" },
  chios_info: { label: "Πληροφορίες για τη Χίο", when: "3 ημέρες πριν" },
  welcome: { label: "Καλωσόρισμα", when: "Ημέρα άφιξης" },
  daily: { label: "Πρόταση ημέρας", when: "Κάθε πρωί της διαμονής, με βάση τον καιρό" },
  checkout: { label: "Υπενθύμιση αναχώρησης", when: "Την προηγούμενη της αναχώρησης" },
  thank_you: { label: "Ευχαριστούμε", when: "Την επόμενη της αναχώρησης" },
};

export type DailySuggestion = {
  areaTitle: string;
  beachName: string | null;
  seaState: "calm" | "some-waves" | "wavy" | null;
  beaufort: number | null;
  swimSeason: boolean;
  routeUrl: string;
  stops: string[];
};

export type EmailContext = {
  firstName: string;
  room: string;
  checkin: string;
  checkout: string;
  suggestion?: DailySuggestion | null;
};

const SITE = "https://chioshotel.gr";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Voulamandis%20House%2C%20Kambos%2C%20Chios";
const SITE_HOME: Record<EmailLanguage, string> = { el: `${SITE}/el/`, en: `${SITE}/`, tr: `${SITE}/tr/` };

const esc = (value: unknown) =>
  String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

function dateLabel(iso: string, language: EmailLanguage) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year) return iso;
  const locale = { el: "el-GR", en: "en-GB", tr: "tr-TR" }[language];
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

const p = (text: string) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3a3028">${text}</p>`;
const button = (href: string, text: string) =>
  `<p style="margin:22px 0"><a href="${esc(href)}" style="display:inline-block;background:#3f6b4f;color:#ffffff;text-decoration:none;padding:13px 20px;border-radius:12px;font-size:15px;font-weight:700">${esc(text)}</a></p>`;

function layout(language: EmailLanguage, heading: string, body: string) {
  const sign = { el: "Με αγάπη από τον Κάμπο,", en: "Warm regards from Kambos,", tr: "Kambos’tan sevgilerle," }[language];
  return `<!doctype html><html lang="${language}"><body style="margin:0;padding:0;background:#f3eee6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3eee6"><tr><td align="center" style="padding:18px 8px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff">
<tr><td style="background:#4c3b30;padding:24px 22px;color:#ffffff"><div style="font-size:11px;letter-spacing:.2em;font-weight:700;color:#eadfce">VOULAMANDIS HOUSE · CHIOS</div><div style="font-size:26px;line-height:1.2;font-weight:700;margin-top:8px">${esc(heading)}</div></td></tr>
<tr><td style="padding:24px 22px">${body}<p style="margin:24px 0 0;font-size:16px;line-height:1.6;color:#3a3028">${sign}<br><strong>Stratos &amp; Angeliki</strong></p></td></tr>
</table></td></tr></table></body></html>`;
}

function dailyBody(language: EmailLanguage, ctx: EmailContext) {
  const s = ctx.suggestion;
  if (!s) return "";
  const sea = s.seaState ? {
    el: { calm: "ήρεμη", "some-waves": "με λίγο κύμα", wavy: "με κύμα" },
    en: { calm: "calm", "some-waves": "a little wavy", wavy: "wavy" },
    tr: { calm: "sakin", "some-waves": "biraz dalgalı", wavy: "dalgalı" },
  }[language][s.seaState] : null;
  const wind = s.beaufort !== null ? { el: `Άνεμος ${s.beaufort} μποφόρ.`, en: `Wind ${s.beaufort} Beaufort.`, tr: `Rüzgâr ${s.beaufort} bofor.` }[language] : "";
  const beachLine = s.swimSeason && s.beachName
    ? {
        el: `Η θάλασσα ${sea ? `στην παραλία <strong>${esc(s.beachName)}</strong> θα είναι ${sea}` : `μας πάει στην παραλία <strong>${esc(s.beachName)}</strong>`} σήμερα.`,
        en: `${sea ? `The sea at <strong>${esc(s.beachName)}</strong> should be ${sea} today` : `Today we suggest <strong>${esc(s.beachName)}</strong> beach`}.`,
        tr: `${sea ? `Bugün <strong>${esc(s.beachName)}</strong> plajında deniz ${sea} görünüyor` : `Bugün <strong>${esc(s.beachName)}</strong> plajını öneriyoruz`}.`,
      }[language]
    : "";
  const intro = {
    el: `Με βάση τον σημερινό καιρό, η πρότασή μας είναι: <strong>${esc(s.areaTitle)}</strong>.`,
    en: `Based on today’s weather, our suggestion is: <strong>${esc(s.areaTitle)}</strong>.`,
    tr: `Bugünkü hava durumuna göre önerimiz: <strong>${esc(s.areaTitle)}</strong>.`,
  }[language];
  const stops = s.stops.length
    ? `<ul style="margin:0 0 16px;padding-left:20px;font-size:16px;line-height:1.7;color:#3a3028">${s.stops.map((stop) => `<li>${esc(stop)}</li>`).join("")}</ul>`
    : "";
  const route = { el: "Όλη η διαδρομή στον χάρτη", en: "See the route on the map", tr: "Rotayı haritada gör" }[language];
  const planner = language === "el"
    ? p(`Θέλετε να την αλλάξετε; <a href="${SITE}/trip-planner/?src=crm" style="color:#3f6b4f;font-weight:700">Φτιάξτε τη δική σας μέρα</a>.`)
    : "";
  return p(intro) + p([beachLine, wind].filter(Boolean).join(" ")) + stops + button(s.routeUrl, route) + planner;
}

export function buildGuestEmail(type: EmailType, language: EmailLanguage, ctx: EmailContext) {
  const name = esc(ctx.firstName);
  const room = esc(ctx.room);
  const stay = `${dateLabel(ctx.checkin, language)} → ${dateLabel(ctx.checkout, language)}`;
  const content: Record<EmailType, Record<EmailLanguage, { subject: string; heading: string; body: string }>> = {
    arrival: {
      el: { subject: "Η διαμονή σας στο Voulamandis House πλησιάζει", heading: "Σας περιμένουμε!", body: p(`Αγαπητέ/ή ${name},`) + p(`Ανυπομονούμε να σας φιλοξενήσουμε στον Κάμπο της Χίου.`) + p(`<strong>${room}</strong><br>${stay}`) + p(`Πείτε μας απαντώντας σε αυτό το email τι ώρα περίπου θα φτάσετε και με ποιον τρόπο.`) + button(MAPS, "Βρείτε μας στον χάρτη") },
      en: { subject: "Your upcoming stay at Voulamandis House", heading: "We can’t wait to welcome you", body: p(`Dear ${name},`) + p(`We are looking forward to hosting you in Kambos, Chios.`) + p(`<strong>${room}</strong><br>${stay}`) + p(`Please reply to this email with your approximate arrival time and how you will be arriving.`) + button(MAPS, "Find us on the map") },
      tr: { subject: "Voulamandis House konaklamanız yaklaşıyor", heading: "Sizi bekliyoruz", body: p(`Sevgili ${name},`) + p(`Sizi Sakız Adası’nın Kambos bölgesinde ağırlamak için sabırsızlanıyoruz.`) + p(`<strong>${room}</strong><br>${stay}`) + p(`Lütfen bu e-postayı yanıtlayarak yaklaşık varış saatinizi ve nasıl geleceğinizi bize bildirin.`) + button(MAPS, "Haritada bizi bulun") },
    },
    chios_info: {
      el: { subject: "Ετοιμαστείτε για τη Χίο – τοπικές προτάσεις", heading: "Η Χίος σας περιμένει", body: p(`Αγαπητέ/ή ${name},`) + p(`Λίγες μέρες έμειναν. Στον οδηγό μας θα βρείτε τις αγαπημένες μας παραλίες, χωριά και τοπικές γεύσεις, για να δείτε τη Χίο με τα μάτια ενός ντόπιου.`) + button(SITE_HOME.el, "Δείτε τις προτάσεις μας") },
      en: { subject: "Get ready for Chios – local tips before you arrive", heading: "Chios is waiting for you", body: p(`Dear ${name},`) + p(`Only a few days to go. Our guide has our favourite beaches, villages and local flavours, so you can see Chios through the eyes of a local.`) + button(SITE_HOME.en, "See our suggestions") },
      tr: { subject: "Sakız Adası için hazırlanın – yerel öneriler", heading: "Sakız Adası sizi bekliyor", body: p(`Sevgili ${name},`) + p(`Sadece birkaç gün kaldı. Rehberimizde en sevdiğimiz plajları, köyleri ve yerel lezzetleri bulabilirsiniz; adayı bir yerli gözüyle keşfedin.`) + button(SITE_HOME.tr, "Önerilerimizi görün") },
    },
    welcome: {
      el: { subject: "Καλωσορίσατε στο Voulamandis House", heading: "Καλώς ήρθατε", body: p(`Αγαπητέ/ή ${name},`) + p(`Σήμερα είναι η μέρα σας! Είμαστε εδώ για ό,τι χρειαστείτε, ώστε η διαμονή σας να είναι άνετη και αξέχαστη.`) },
      en: { subject: "Welcome to Voulamandis House", heading: "Welcome", body: p(`Dear ${name},`) + p(`Today is the day! We are here for anything you need, to make your stay comfortable and memorable.`) },
      tr: { subject: "Voulamandis House’a hoş geldiniz", heading: "Hoş geldiniz", body: p(`Sevgili ${name},`) + p(`Bugün o gün! Konaklamanızın rahat ve unutulmaz olması için ihtiyacınız olan her şeyde yanınızdayız.`) },
    },
    daily: {
      el: { subject: "Σήμερα στη Χίο – η δική μας πρόταση", heading: "Καλημέρα από τον Κάμπο", body: p(`Καλημέρα ${name},`) + dailyBody("el", ctx) },
      en: { subject: "Today in Chios – our local suggestion", heading: "Good morning from Kambos", body: p(`Good morning ${name},`) + dailyBody("en", ctx) },
      tr: { subject: "Bugün Sakız’da – yerel önerimiz", heading: "Kambos’tan günaydın", body: p(`Günaydın ${name},`) + dailyBody("tr", ctx) },
    },
    checkout: {
      el: { subject: "Μια μικρή υπενθύμιση πριν το check-out", heading: "Η αναχώρησή σας", body: p(`Αγαπητέ/ή ${name},`) + p(`Σας υπενθυμίζουμε ότι η αναχώρησή σας είναι αύριο. Αν χρειάζεστε κάτι, πείτε μας.`) },
      en: { subject: "A small reminder before your check-out", heading: "Your departure", body: p(`Dear ${name},`) + p(`Just a reminder that your check-out is tomorrow. If you need anything, please let us know.`) },
      tr: { subject: "Check-out öncesi küçük bir hatırlatma", heading: "Ayrılışınız", body: p(`Sevgili ${name},`) + p(`Çıkışınızın yarın olduğunu hatırlatmak isteriz. Bir ihtiyacınız olursa lütfen bize bildirin.`) },
    },
    thank_you: {
      el: { subject: "Σας ευχαριστούμε για τη διαμονή σας", heading: "Ευχαριστούμε", body: p(`Αγαπητέ/ή ${name},`) + p(`Σας ευχαριστούμε που μείνατε μαζί μας. Ελπίζουμε να σας ξαναδούμε σύντομα στον Κάμπο.`) },
      en: { subject: "Thank you for staying with us", heading: "Thank you", body: p(`Dear ${name},`) + p(`Thank you for staying with us. We hope to see you again soon in Kambos.`) },
      tr: { subject: "Bizimle kaldığınız için teşekkür ederiz", heading: "Teşekkürler", body: p(`Sevgili ${name},`) + p(`Bizimle kaldığınız için teşekkür ederiz. Sizi yakında yeniden Kambos’ta görmeyi umuyoruz.`) },
    },
  };
  const entry = content[type][language];
  const html = layout(language, entry.heading, entry.body);
  const text = entry.body
    .replace(/<\/(p|li|ul)>/g, "\n")
    .replace(/<br>/g, "\n")
    .replace(/<a href="([^"]+)"[^>]*>([^<]*)<\/a>/g, "$2: $1")
    .replace(/<[^>]+>/g, "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&")
    .trim();
  return { subject: entry.subject, html, text };
}

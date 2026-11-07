import { button, emailShell, esc, htmlToText, paragraph as p, SITE_URL, type EmailLanguage } from "@/lib/crm/email-design";

// Seasonal greetings sent by hand from /staff/crm to past guests. No Node or
// DB imports: the staff panel renders previews in the browser.

export const GREETING_TYPES = ["christmas", "easter"] as const;
export type GreetingType = (typeof GREETING_TYPES)[number];

export const GREETING_LABELS: Record<GreetingType, string> = {
  christmas: "Χριστούγεννα & Νέος χρόνος",
  easter: "Πάσχα",
};

export type GreetingContext = { firstName: string; lastName: string; year: number; unsubscribeUrl: string };

const SITE_HOME: Record<EmailLanguage, string> = { el: `${SITE_URL}/el/`, en: `${SITE_URL}/`, tr: `${SITE_URL}/tr/` };

const UNSUBSCRIBE: Record<EmailLanguage, { text: string; link: string }> = {
  el: { text: "Δεν θέλετε να λαμβάνετε τέτοια μηνύματα;", link: "Διαγραφή" },
  en: { text: "Prefer not to receive messages like this?", link: "Unsubscribe" },
  tr: { text: "Bu tür mesajlar almak istemiyor musunuz?", link: "Abonelikten çık" },
};

type Entry = { subject: string; eyebrow: string; heading: string; preheader: string; body: string };

function entries(language: EmailLanguage, ctx: GreetingContext): Record<GreetingType, Entry> {
  const full = esc(`${ctx.firstName} ${ctx.lastName}`.trim());
  const next = ctx.year + 1;
  const home = SITE_HOME[language];
  const greet = (salutation: string) => (full ? p(`${salutation} ${full},`) : "");

  const content: Record<GreetingType, Record<EmailLanguage, Entry>> = {
    christmas: {
      el: {
        subject: "Καλά Χριστούγεννα από τον Κάμπο της Χίου 🎄",
        eyebrow: `Χριστούγεννα ${ctx.year}`,
        heading: `Καλά Χριστούγεννα και ευτυχισμένο ${next}!`,
        preheader: "Ζεστές ευχές από όλους μας στο Voulamandis House.",
        body: greet("Αγαπητέ/ή")
          + p("Τα μανταρίνια στον Κάμπο έχουν ωριμάσει, τα σπίτια γεμίζουν φως, και στο τέλος της χρονιάς σκεφτόμαστε με χαρά τους ανθρώπους που την έκαναν ξεχωριστή. Σας ευχαριστούμε που μείνατε μαζί μας.")
          + p(`Σας ευχόμαστε υγεία, αγάπη και ό,τι ωραιότερο για το ${next}. Στη Χίο θα έχετε πάντα ένα σπίτι που σας περιμένει.`)
          + button(home, "Voulamandis House"),
      },
      en: {
        subject: "Merry Christmas from Kambos, Chios 🎄",
        eyebrow: `Christmas ${ctx.year}`,
        heading: `Merry Christmas and a happy ${next}!`,
        preheader: "Warm wishes from all of us at Voulamandis House.",
        body: greet("Dear")
          + p("The mandarin trees in Kambos are heavy with fruit, and as the year comes to an end we are thinking of the guests who made it special. Thank you for staying with us.")
          + p(`We wish you and your loved ones health, warmth and joy in ${next}. Chios, and our garden, will be here whenever you would like to come back.`)
          + button(home, "Voulamandis House"),
      },
      tr: {
        subject: "Mutlu yıllar! Sakız Adası'ndan sevgilerle ✨",
        eyebrow: `Yeni yıl ${next}`,
        heading: `Mutlu Noeller ve mutlu yıllar!`,
        preheader: "Voulamandis House'taki hepimizden sıcak dilekler.",
        body: greet("Sevgili")
          + p("Kambos'taki mandalina ağaçları meyveyle doldu ve yılın sonunda bu yılı özel kılan misafirlerimizi sevgiyle anıyoruz. Bizimle kaldığınız için teşekkür ederiz.")
          + p(`Size ve sevdiklerinize ${next} yılında sağlık, huzur ve mutluluk diliyoruz. Sakız Adası'nda sizi her zaman bekleyen bir eviniz var.`)
          + button(home, "Voulamandis House"),
      },
    },
    easter: {
      el: {
        subject: "Καλό Πάσχα από τη Χίο 🌿",
        eyebrow: `Πάσχα ${ctx.year}`,
        heading: "Καλό Πάσχα και Καλή Ανάσταση!",
        preheader: "Ανοιξιάτικες ευχές από όλους μας στο Voulamandis House.",
        body: greet("Αγαπητέ/ή")
          + p("Ο Κάμπος έχει ανθίσει και το άρωμα από τα άνθη των εσπεριδοειδών γεμίζει τον αέρα. Είναι η πιο όμορφη εποχή στη Χίο και σας σκεφτόμαστε με χαρά.")
          + p("Σας ευχόμαστε Καλή Ανάσταση, υγεία και ένα όμορφο καλοκαίρι. Θα χαρούμε πολύ να σας ξαναδούμε κοντά μας.")
          + button(home, "Voulamandis House"),
      },
      en: {
        subject: "Happy Easter from Chios 🌿",
        eyebrow: `Easter ${ctx.year}`,
        heading: "Happy Easter!",
        preheader: "Spring wishes from all of us at Voulamandis House.",
        body: greet("Dear")
          + p("Kambos is in bloom and the scent of citrus blossom fills the air. It is the most beautiful time of year on Chios, and we are thinking of you.")
          + p("We wish you a joyful Easter, good health and a lovely summer ahead. It would be a pleasure to welcome you back.")
          + button(home, "Voulamandis House"),
      },
      tr: {
        subject: "İyi Paskalyalar! Sakız Adası'ndan bahar selamları 🌿",
        eyebrow: `Paskalya ${ctx.year}`,
        heading: "İyi Paskalyalar, güzel bir bahar dileriz!",
        preheader: "Voulamandis House'taki hepimizden bahar dilekleri.",
        body: greet("Sevgili")
          + p("Kambos çiçek açtı ve narenciye çiçeklerinin kokusu her yeri sardı. Sakız Adası'nın en güzel mevsiminde sizi sevgiyle anıyoruz.")
          + p("Size sağlık, huzur ve güzel bir yaz diliyoruz. Sizi yeniden ağırlamaktan mutluluk duyarız.")
          + button(home, "Voulamandis House"),
      },
    },
  };
  return { christmas: content.christmas[language], easter: content.easter[language] };
}

export function buildGreetingEmail(type: GreetingType, language: EmailLanguage, ctx: GreetingContext) {
  const entry = entries(language, ctx)[type];
  const unsubscribe = UNSUBSCRIBE[language];
  const footerNote = `${esc(unsubscribe.text)} <a href="${esc(ctx.unsubscribeUrl)}" style="color:#7c8682;text-decoration:underline">${esc(unsubscribe.link)}</a>`;
  const html = emailShell({ language, preheader: entry.preheader, eyebrow: entry.eyebrow, heading: entry.heading, body: entry.body, footerNote });
  return { subject: entry.subject, html, text: htmlToText(html) };
}

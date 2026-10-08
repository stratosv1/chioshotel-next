"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import type { DealsPageData } from "@/content/deals";
import type { HomePageData } from "@/content/home";
import { LazyLastMinuteDeals } from "@/components/home/LazyLastMinuteDeals";
import { LocalizedChiosHotelsLiveSearch } from "@/components/booking/LocalizedChiosHotelsLiveSearch";
import { CHIOS_HOTELS_GUIDE_PATHS } from "@/lib/chios-hotels-guide-i18n";
import { NewsletterSignupForm } from "@/components/newsletter/NewsletterSignupForm";

type DealsPageProps = {
  data: DealsPageData;
  lastMinute?: HomePageData["lastMinute"];
};

type Locale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type CountdownState = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
};

type DealsUiCopy = {
  time: [string, string, string, string];
  swipe: string;
  previous: string;
  next: string;
  tip: string;
  code: string;
  bookNow: string;
  viewRoom: string;
  copy: string;
  copied: string;
  offersCta: string;
  lastMinuteCta: string;
  liveOffers: (count: number) => string;
  noCommission: string;
  nextExpiry: string;
  endsIn: (days: number) => string;
  endsToday: string;
  noEndDate: string;
  emptyTitle: string;
  emptyText: string;
  lastMinuteKicker: string;
  lastMinuteTitle: string;
  lastMinuteText: string;
  searchNote: string;
  newsletterKicker: string;
  newsletterTitle: string;
  newsletterText: string;
  emailPlaceholder: string;
  consent: string;
  subscribe: string;
  subscribed: string;
  errorEmail: string;
  errorConsent: string;
  errorServer: string;
};

const uiCopy: Record<Locale, DealsUiCopy> = {
  en: {
    time: ["Days", "Hours", "Mins", "Secs"],
    swipe: "Swipe for more offers",
    previous: "Previous offer",
    next: "Next offer",
    tip: "Tip",
    code: "Code",
    bookNow: "Book now",
    viewRoom: "View room",
    copy: "Copy code",
    copied: "Copied!",
    offersCta: "See current offers",
    lastMinuteCta: "Last minute this week",
    liveOffers: (n) => (n === 1 ? "1 offer live now" : `${n} offers live now`),
    noCommission: "Direct booking, no commission",
    nextExpiry: "Next offer ends in",
    endsIn: (d) => (d === 1 ? "Ends tomorrow" : `Ends in ${d} days`),
    endsToday: "Ends today",
    noEndDate: "Available now",
    emptyTitle: "New offers are on the way",
    emptyText: "There is no running offer right now. See this week’s last-minute availability below, or join the newsletter to hear about the next one first.",
    lastMinuteKicker: "Last minute",
    lastMinuteTitle: "Last-minute rooms for the coming 7 days",
    lastMinuteText: "Live availability and direct prices for this week, updated automatically.",
    searchNote: "Planning further ahead? Check your own dates below and enter the offer code at the last booking step.",
    newsletterKicker: "Newsletter",
    newsletterTitle: "Get our offers first",
    newsletterText: "A few emails a year with new offers and direct-booking codes for Voulamandis House. No spam.",
    emailPlaceholder: "Your email",
    consent: "I agree to receive offers from Voulamandis House by email. I can unsubscribe at any time.",
    subscribe: "Sign up",
    subscribed: "Thank you! You are on the list.",
    errorEmail: "Please enter a valid email.",
    errorConsent: "Please tick the consent box.",
    errorServer: "Something went wrong. Please try again.",
  },
  el: {
    time: ["Ημέρες", "Ώρες", "Λεπτά", "Δευτ."],
    swipe: "Σύρετε για περισσότερες προσφορές",
    previous: "Προηγούμενη προσφορά",
    next: "Επόμενη προσφορά",
    tip: "Συμβουλή",
    code: "Κωδικός",
    bookNow: "Κράτηση τώρα",
    viewRoom: "Δείτε την κατηγορία",
    copy: "Αντιγραφή κωδικού",
    copied: "Αντιγράφηκε!",
    offersCta: "Δείτε τις προσφορές",
    lastMinuteCta: "Last minute εβδομάδας",
    liveOffers: (n) => (n === 1 ? "1 ενεργή προσφορά τώρα" : `${n} ενεργές προσφορές τώρα`),
    noCommission: "Απευθείας κράτηση χωρίς προμήθειες",
    nextExpiry: "Η πιο κοντινή προσφορά λήγει σε",
    endsIn: (d) => (d === 1 ? "Λήγει αύριο" : `Λήγει σε ${d} ημέρες`),
    endsToday: "Λήγει σήμερα",
    noEndDate: "Διαθέσιμη τώρα",
    emptyTitle: "Έρχονται νέες προσφορές",
    emptyText: "Αυτή τη στιγμή δεν τρέχει κάποια προσφορά. Δείτε παρακάτω τα last minute της εβδομάδας ή γραφτείτε στο newsletter για να μάθετε πρώτοι την επόμενη.",
    lastMinuteKicker: "Last minute",
    lastMinuteTitle: "Last minute δωμάτια για τις επόμενες 7 ημέρες",
    lastMinuteText: "Ζωντανή διαθεσιμότητα και απευθείας τιμές της εβδομάδας, που ενημερώνονται αυτόματα.",
    searchNote: "Σχεδιάζετε για αργότερα; Δείτε τιμές για τις δικές σας ημερομηνίες και βάλτε τον κωδικό της προσφοράς στο τελευταίο βήμα της κράτησης.",
    newsletterKicker: "Newsletter",
    newsletterTitle: "Μάθετε πρώτοι τις προσφορές μας",
    newsletterText: "Λίγα email τον χρόνο με νέες προσφορές και κωδικούς απευθείας κράτησης για το Voulamandis House. Χωρίς spam.",
    emailPlaceholder: "Το email σας",
    consent: "Συμφωνώ να λαμβάνω προσφορές από το Voulamandis House με email. Μπορώ να διαγραφώ όποτε θέλω.",
    subscribe: "Εγγραφή",
    subscribed: "Ευχαριστούμε! Είστε στη λίστα.",
    errorEmail: "Γράψτε ένα έγκυρο email.",
    errorConsent: "Τσεκάρετε τη συγκατάθεση.",
    errorServer: "Κάτι πήγε στραβά. Δοκιμάστε ξανά.",
  },
  fr: {
    time: ["Jours", "Heures", "Min", "Sec"],
    swipe: "Faites glisser pour voir plus d’offres",
    previous: "Offre précédente",
    next: "Offre suivante",
    tip: "Conseil",
    code: "Code",
    bookNow: "Réserver",
    viewRoom: "Voir la catégorie",
    copy: "Copier le code",
    copied: "Copié !",
    offersCta: "Voir les offres",
    lastMinuteCta: "Dernière minute cette semaine",
    liveOffers: (n) => (n === 1 ? "1 offre en cours" : `${n} offres en cours`),
    noCommission: "Réservation directe sans commission",
    nextExpiry: "La prochaine offre se termine dans",
    endsIn: (d) => (d === 1 ? "Se termine demain" : `Se termine dans ${d} jours`),
    endsToday: "Se termine aujourd’hui",
    noEndDate: "Disponible maintenant",
    emptyTitle: "De nouvelles offres arrivent",
    emptyText: "Aucune offre en cours pour le moment. Consultez la disponibilité de dernière minute de la semaine ci-dessous ou inscrivez-vous à la newsletter.",
    lastMinuteKicker: "Dernière minute",
    lastMinuteTitle: "Chambres de dernière minute pour les 7 prochains jours",
    lastMinuteText: "Disponibilité en direct et tarifs directs de la semaine, mis à jour automatiquement.",
    searchNote: "Vous prévoyez plus tard ? Vérifiez vos dates ci-dessous et saisissez le code de l’offre à la dernière étape de la réservation.",
    newsletterKicker: "Newsletter",
    newsletterTitle: "Recevez nos offres en premier",
    newsletterText: "Quelques e-mails par an avec de nouvelles offres et des codes de réservation directe. Pas de spam.",
    emailPlaceholder: "Votre e-mail",
    consent: "J’accepte de recevoir des offres de Voulamandis House par e-mail. Je peux me désinscrire à tout moment.",
    subscribe: "S’inscrire",
    subscribed: "Merci ! Vous êtes inscrit.",
    errorEmail: "Saisissez un e-mail valide.",
    errorConsent: "Cochez la case de consentement.",
    errorServer: "Une erreur s’est produite. Réessayez.",
  },
  de: {
    time: ["Tage", "Std.", "Min.", "Sek."],
    swipe: "Wischen für weitere Angebote",
    previous: "Vorheriges Angebot",
    next: "Nächstes Angebot",
    tip: "Tipp",
    code: "Code",
    bookNow: "Jetzt buchen",
    viewRoom: "Kategorie ansehen",
    copy: "Code kopieren",
    copied: "Kopiert!",
    offersCta: "Aktuelle Angebote",
    lastMinuteCta: "Last Minute diese Woche",
    liveOffers: (n) => (n === 1 ? "1 Angebot aktiv" : `${n} Angebote aktiv`),
    noCommission: "Direkt buchen ohne Provision",
    nextExpiry: "Das nächste Angebot endet in",
    endsIn: (d) => (d === 1 ? "Endet morgen" : `Endet in ${d} Tagen`),
    endsToday: "Endet heute",
    noEndDate: "Jetzt verfügbar",
    emptyTitle: "Neue Angebote folgen bald",
    emptyText: "Derzeit läuft kein Angebot. Sehen Sie unten die Last-Minute-Verfügbarkeit dieser Woche oder abonnieren Sie den Newsletter.",
    lastMinuteKicker: "Last Minute",
    lastMinuteTitle: "Last-Minute-Zimmer für die nächsten 7 Tage",
    lastMinuteText: "Live-Verfügbarkeit und Direktpreise dieser Woche, automatisch aktualisiert.",
    searchNote: "Sie planen weiter im Voraus? Prüfen Sie unten Ihre Daten und geben Sie den Angebotscode im letzten Buchungsschritt ein.",
    newsletterKicker: "Newsletter",
    newsletterTitle: "Unsere Angebote zuerst erhalten",
    newsletterText: "Wenige E-Mails im Jahr mit neuen Angeboten und Direktbuchungscodes. Kein Spam.",
    emailPlaceholder: "Ihre E-Mail",
    consent: "Ich möchte Angebote von Voulamandis House per E-Mail erhalten. Ich kann mich jederzeit abmelden.",
    subscribe: "Anmelden",
    subscribed: "Danke! Sie sind angemeldet.",
    errorEmail: "Bitte gültige E-Mail eingeben.",
    errorConsent: "Bitte Einwilligung bestätigen.",
    errorServer: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
  },
  it: {
    time: ["Giorni", "Ore", "Min", "Sec"],
    swipe: "Scorri per altre offerte",
    previous: "Offerta precedente",
    next: "Offerta successiva",
    tip: "Consiglio",
    code: "Codice",
    bookNow: "Prenota ora",
    viewRoom: "Vedi categoria",
    copy: "Copia codice",
    copied: "Copiato!",
    offersCta: "Vedi le offerte",
    lastMinuteCta: "Last minute questa settimana",
    liveOffers: (n) => (n === 1 ? "1 offerta attiva ora" : `${n} offerte attive ora`),
    noCommission: "Prenotazione diretta senza commissioni",
    nextExpiry: "La prossima offerta scade tra",
    endsIn: (d) => (d === 1 ? "Scade domani" : `Scade tra ${d} giorni`),
    endsToday: "Scade oggi",
    noEndDate: "Disponibile ora",
    emptyTitle: "Nuove offerte in arrivo",
    emptyText: "Al momento non ci sono offerte attive. Guarda qui sotto la disponibilità last minute della settimana o iscriviti alla newsletter.",
    lastMinuteKicker: "Last minute",
    lastMinuteTitle: "Camere last minute per i prossimi 7 giorni",
    lastMinuteText: "Disponibilità in tempo reale e prezzi diretti della settimana, aggiornati automaticamente.",
    searchNote: "Pianifichi più avanti? Controlla le tue date qui sotto e inserisci il codice all’ultimo passaggio della prenotazione.",
    newsletterKicker: "Newsletter",
    newsletterTitle: "Ricevi le nostre offerte per primo",
    newsletterText: "Poche email all’anno con nuove offerte e codici di prenotazione diretta. Niente spam.",
    emailPlaceholder: "La tua email",
    consent: "Accetto di ricevere offerte da Voulamandis House via email. Posso cancellarmi in qualsiasi momento.",
    subscribe: "Iscriviti",
    subscribed: "Grazie! Sei iscritto.",
    errorEmail: "Inserisci un’email valida.",
    errorConsent: "Seleziona la casella di consenso.",
    errorServer: "Qualcosa è andato storto. Riprova.",
  },
  es: {
    time: ["Días", "Horas", "Min", "Seg"],
    swipe: "Desliza para ver más ofertas",
    previous: "Oferta anterior",
    next: "Oferta siguiente",
    tip: "Consejo",
    code: "Código",
    bookNow: "Reservar ahora",
    viewRoom: "Ver categoría",
    copy: "Copiar código",
    copied: "¡Copiado!",
    offersCta: "Ver ofertas",
    lastMinuteCta: "Última hora esta semana",
    liveOffers: (n) => (n === 1 ? "1 oferta activa ahora" : `${n} ofertas activas ahora`),
    noCommission: "Reserva directa sin comisiones",
    nextExpiry: "La próxima oferta termina en",
    endsIn: (d) => (d === 1 ? "Termina mañana" : `Termina en ${d} días`),
    endsToday: "Termina hoy",
    noEndDate: "Disponible ahora",
    emptyTitle: "Llegan nuevas ofertas",
    emptyText: "Ahora mismo no hay ofertas activas. Consulte abajo la disponibilidad de última hora de la semana o suscríbase a la newsletter.",
    lastMinuteKicker: "Última hora",
    lastMinuteTitle: "Habitaciones de última hora para los próximos 7 días",
    lastMinuteText: "Disponibilidad en directo y precios directos de la semana, actualizados automáticamente.",
    searchNote: "¿Planifica para más adelante? Consulte sus fechas abajo e introduzca el código en el último paso de la reserva.",
    newsletterKicker: "Newsletter",
    newsletterTitle: "Reciba nuestras ofertas primero",
    newsletterText: "Pocos emails al año con nuevas ofertas y códigos de reserva directa. Sin spam.",
    emailPlaceholder: "Su email",
    consent: "Acepto recibir ofertas de Voulamandis House por email. Puedo darme de baja en cualquier momento.",
    subscribe: "Suscribirme",
    subscribed: "¡Gracias! Ya está en la lista.",
    errorEmail: "Introduzca un email válido.",
    errorConsent: "Marque la casilla de consentimiento.",
    errorServer: "Algo salió mal. Inténtelo de nuevo.",
  },
  tr: {
    time: ["Gün", "Saat", "Dk.", "Sn."],
    swipe: "Daha fazla fırsat için kaydırın",
    previous: "Önceki fırsat",
    next: "Sonraki fırsat",
    tip: "İpucu",
    code: "Kod",
    bookNow: "Şimdi rezervasyon",
    viewRoom: "Kategoriyi gör",
    copy: "Kodu kopyala",
    copied: "Kopyalandı!",
    offersCta: "Fırsatları görün",
    lastMinuteCta: "Bu haftanın son dakika fırsatları",
    liveOffers: (n) => `${n} aktif fırsat`,
    noCommission: "Komisyonsuz doğrudan rezervasyon",
    nextExpiry: "En yakın fırsatın bitmesine",
    endsIn: (d) => (d === 1 ? "Yarın bitiyor" : `${d} gün sonra bitiyor`),
    endsToday: "Bugün bitiyor",
    noEndDate: "Şimdi geçerli",
    emptyTitle: "Yeni fırsatlar yolda",
    emptyText: "Şu anda aktif bir fırsat yok. Aşağıda bu haftanın son dakika müsaitliğine bakın veya bültene kaydolun.",
    lastMinuteKicker: "Son dakika",
    lastMinuteTitle: "Önümüzdeki 7 gün için son dakika odaları",
    lastMinuteText: "Bu haftanın canlı müsaitliği ve doğrudan fiyatları, otomatik güncellenir.",
    searchNote: "Daha ileri bir tarih mi planlıyorsunuz? Tarihlerinizi aşağıdan kontrol edin ve fırsat kodunu rezervasyonun son adımında girin.",
    newsletterKicker: "Bülten",
    newsletterTitle: "Fırsatlarımızdan ilk siz haberdar olun",
    newsletterText: "Yılda birkaç e-posta: yeni fırsatlar ve doğrudan rezervasyon kodları. Spam yok.",
    emailPlaceholder: "E-posta adresiniz",
    consent: "Voulamandis House’tan e-posta ile fırsat almayı kabul ediyorum. İstediğim zaman abonelikten çıkabilirim.",
    subscribe: "Kaydol",
    subscribed: "Teşekkürler! Listedesiniz.",
    errorEmail: "Geçerli bir e-posta girin.",
    errorConsent: "Lütfen onay kutusunu işaretleyin.",
    errorServer: "Bir sorun oluştu. Tekrar deneyin.",
  },
};

const hotelsGuideLink: Record<Locale, { before: string; label: string; after: string }> = {
  en: { before: "Still comparing areas? See our guide to ", label: "Chios hotels", after: " and where to stay." },
  el: { before: "Συγκρίνετε ακόμη περιοχές; Δείτε τον οδηγό για ", label: "ξενοδοχεία στη Χίο", after: " και πού να μείνετε." },
  fr: { before: "Vous comparez encore les quartiers ? Consultez notre guide des ", label: "hôtels à Chios", after: "." },
  de: { before: "Sie vergleichen noch Gegenden? Lesen Sie unseren Ratgeber zu ", label: "Hotels auf Chios", after: "." },
  it: { before: "State ancora confrontando le zone? Leggete la nostra guida agli ", label: "hotel a Chios", after: "." },
  es: { before: "¿Todavía comparando zonas? Consulte nuestra guía de ", label: "hoteles en Quíos", after: "." },
  tr: { before: "Bölgeleri mi karşılaştırıyorsunuz? ", label: "Sakız Adası otelleri", after: " rehberimize göz atın." },
};

const CONSENT_KEY = "vh_cookie_consent_v1";

function emit(name: string, properties: Record<string, string | number | undefined>) {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;
  } catch {
    return;
  }
  const clean = Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined)) as Record<string, string | number>;
  track(name, clean);
  (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", name, clean);
}

function localeFromPath(path: string): Locale {
  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";
  return "en";
}

function getCountdown(targetIso: string): CountdownState {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (!targetIso || Number.isNaN(diff) || diff <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00", expired: true };
  }
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { days: pad(days), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds), expired: false };
}

function daysLeft(validUntil: string | null | undefined) {
  if (!validUntil) return null;
  const end = new Date(validUntil);
  if (Number.isNaN(end.getTime())) return null;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfEnd = new Date(end);
  startOfEnd.setHours(0, 0, 0, 0);
  return Math.round((startOfEnd.getTime() - startOfToday.getTime()) / 86_400_000);
}

/** Top strip: countdown to the nearest expiring offer, or a "live" status line. */
function StatusStrip({ data, labels, offerCount }: { data: DealsPageData; labels: DealsUiCopy; offerCount: number }) {
  const target = data.countdown.targetIso;
  const [countdown, setCountdown] = useState<CountdownState | null>(null);

  useEffect(() => {
    if (!target) return;
    setCountdown(getCountdown(target));
    const timer = window.setInterval(() => setCountdown(getCountdown(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const live = (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
      <span className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.12em] text-emerald-800">
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
        </span>
        {labels.liveOffers(offerCount)}
      </span>
      <span className="text-[12px] font-bold text-stone-600">{labels.noCommission}</span>
    </div>
  );

  return (
    <div
      className="relative z-10 mx-auto -mt-10 flex w-[min(720px,calc(100%-32px))] flex-col items-center justify-center gap-3 rounded-[2rem] border border-amber-800/15 bg-white px-5 py-5 shadow-2xl shadow-stone-900/10 md:flex-row md:gap-6 md:rounded-full md:px-7"
      role="status"
    >
      {offerCount > 0 ? live : <span className="text-sm font-black text-amber-800">{labels.emptyTitle}</span>}
      {target && countdown && !countdown.expired ? (
        <div className="flex items-center gap-3">
          <span className="hidden text-[10px] font-black uppercase tracking-[0.12em] text-amber-800 md:inline">{labels.nextExpiry}</span>
          <div className="grid grid-cols-4 gap-2 md:flex md:gap-3">
            {[
              [countdown.days, labels.time[0]],
              [countdown.hours, labels.time[1]],
              [countdown.minutes, labels.time[2]],
              [countdown.seconds, labels.time[3]],
            ].map(([value, label]) => (
              <div className="min-w-12 rounded-2xl bg-amber-50 px-2 py-1.5 text-center md:bg-transparent md:p-0" key={label}>
                <strong className="block text-xl font-black leading-none text-amber-800 md:text-2xl">{value}</strong>
                <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.11em] text-stone-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CopyCodeButton({ code, labels, offerId, locale }: { code: string; labels: DealsUiCopy; offerId: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          /* clipboard can be blocked; the code is visible anyway */
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
        emit("offer_copy_code", { offer_id: offerId, coupon_code: code, language: locale });
      }}
      className={`mt-3 inline-flex min-h-10 items-center justify-center rounded-full px-5 text-[11px] font-black uppercase tracking-[0.1em] transition ${
        copied ? "bg-emerald-700 text-white" : "bg-white text-amber-900 ring-1 ring-amber-800/30 hover:bg-amber-50"
      }`}
    >
      {copied ? labels.copied : labels.copy}
    </button>
  );
}

export function DealsPage({ data, lastMinute }: DealsPageProps) {
  const offersCarouselRef = useRef<HTMLDivElement>(null);
  const locale = localeFromPath(data.seo.canonicalPath);
  const labels = uiCopy[locale];
  const [highlighted, setHighlighted] = useState("");
  const guideLink = hotelsGuideLink[locale];
  const guideHref = CHIOS_HOTELS_GUIDE_PATHS[locale];
  const offerCount = data.offers.length;

  // Newsletter / social links point to #offer-<slug>: bring that offer into view and highlight it.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#offer-")) return;
    const slug = hash.slice("#offer-".length);
    const element = document.getElementById(`offer-${slug}`);
    if (!element) return;
    setHighlighted(slug);
    window.setTimeout(() => {
      // Scroll the carousel horizontally (never the page), then the window vertically.
      const carousel = offersCarouselRef.current;
      if (carousel && carousel.scrollWidth > carousel.clientWidth) {
        carousel.scrollTo({ left: Math.max(0, element.offsetLeft - 12), behavior: "smooth" });
      }
      const top = element.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: "smooth" });
    }, 300);
    const params = new URLSearchParams(window.location.search);
    emit("offer_link_open", { offer_id: slug, language: locale, source: params.get("utm_source") ?? undefined });
  }, [locale]);

  const sortedOffers = useMemo(() => data.offers, [data.offers]);

  function scrollOffers(direction: -1 | 1) {
    const carousel = offersCarouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector<HTMLElement>("[data-offer-card]");
    const cardWidth = card?.offsetWidth ?? carousel.clientWidth * 0.9;
    carousel.scrollBy({ left: direction * (cardWidth + 16), behavior: "smooth" });
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(142,102,7,.12),transparent_30rem),linear-gradient(180deg,#fffdfa_0%,#faf9f6_100%)] text-stone-800">
      <div className="relative z-10 border-b border-amber-800/15 bg-white px-4 py-3 text-center">
        <a className="text-[13px] font-black uppercase tracking-[0.1em] text-amber-800" href={data.hero.phoneHref}>{data.hero.phoneLabel}</a>
      </div>

      <section className="relative flex min-h-[500px] items-end overflow-hidden text-white max-md:min-h-[72svh]" aria-labelledby="deals-hero-title">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image src={data.hero.image} alt="" fill priority fetchPriority="high" sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(18,25,18,.86)_0%,rgba(55,43,24,.56)_58%,rgba(18,25,18,.26)_100%),linear-gradient(0deg,rgba(18,25,18,.78)_0%,transparent_62%)]" />
        <div className="relative z-[2] mx-auto w-[min(1240px,calc(100%-40px))] py-20 pt-28 max-md:w-[calc(100%-24px)] max-md:py-14 max-md:pt-5">
          <div className="max-w-[850px] rounded-[2.125rem] border border-white/20 bg-white/10 p-[clamp(30px,5vw,54px)] shadow-[0_34px_90px_rgba(0,0,0,.24)] backdrop-blur-xl max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-0">
            <span className="mb-5 inline-flex min-h-8 items-center rounded-full border border-white/25 bg-white/15 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-white">
              {data.hero.kicker}
            </span>
            <h1 id="deals-hero-title" className="m-0 max-w-[13ch] text-[clamp(40px,7vw,78px)] font-black leading-[0.96] tracking-[-0.055em] text-white drop-shadow-lg">
              {data.hero.title}
            </h1>
            <p className="mt-5 max-w-[720px] text-base leading-7 text-white/95 md:text-lg md:leading-8">{data.hero.description}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#offers" className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-[#d8b36a] px-6 text-[12px] font-black uppercase tracking-[0.1em] !text-[#201a10] shadow-lg">
                {labels.offersCta}
              </a>
              {lastMinute ? (
                <a href="#last-minute" className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-white/40 bg-white/15 px-6 text-[12px] font-black uppercase tracking-[0.1em] !text-white">
                  {labels.lastMinuteCta}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <StatusStrip data={data} labels={labels} offerCount={offerCount} />

      <section id="offers" className="scroll-mt-24 px-0 py-16 md:py-20" aria-labelledby="deals-intro-title">
        <div className="mx-auto w-[min(1240px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <header className="mx-auto mb-8 max-w-[840px] text-center md:mb-11">
            <span className="inline-flex min-h-8 items-center rounded-full bg-[#f1eadc] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-amber-800">
              {data.intro.kicker}
            </span>
            <h2 id="deals-intro-title" className="mt-4 text-[clamp(34px,5vw,62px)] font-black leading-none tracking-[-0.055em] text-amber-800">
              {data.intro.title}
            </h2>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-7 text-stone-600">{data.intro.description}</p>
            {guideLink && guideHref ? (
              <p className="mx-auto mt-3 max-w-[760px] text-sm leading-7 text-stone-600">
                {guideLink.before}
                <a className="font-black text-amber-800 underline decoration-amber-300 underline-offset-4" href={guideHref}>
                  {guideLink.label}
                </a>
                {guideLink.after}
              </p>
            ) : null}
          </header>

          {offerCount === 0 ? (
            <div className="mx-auto max-w-[680px] rounded-[2rem] border border-amber-800/15 bg-white p-8 text-center shadow-xl shadow-stone-900/5">
              <h3 className="text-2xl font-black text-amber-800">{labels.emptyTitle}</h3>
              <p className="mt-3 text-[15px] leading-7 text-stone-600">{labels.emptyText}</p>
            </div>
          ) : (
            <>
              {offerCount > 1 ? (
                <div className="mb-4 flex items-center justify-between lg:hidden">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-800">{labels.swipe}</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => scrollOffers(-1)} aria-label={labels.previous} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-800/15 bg-white text-xl font-black text-amber-900 shadow-sm transition active:scale-95">←</button>
                    <button type="button" onClick={() => scrollOffers(1)} aria-label={labels.next} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-800 text-xl font-black text-white shadow-md shadow-amber-900/15 transition active:scale-95">→</button>
                  </div>
                </div>
              ) : null}

              <div
                ref={offersCarouselRef}
                className="-mx-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-4 sm:gap-5 sm:px-4 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0"
              >
                {sortedOffers.map((offer) => {
                  const left = daysLeft(offer.validUntil);
                  const expiryLabel = left === null ? labels.noEndDate : left <= 0 ? labels.endsToday : labels.endsIn(left);
                  const urgent = left !== null && left <= 3;
                  return (
                    <article
                      id={`offer-${offer.id}`}
                      data-offer-card
                      className={`group relative basis-[92%] shrink-0 snap-center scroll-mt-28 overflow-hidden rounded-[2rem] border bg-white shadow-xl shadow-stone-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-900/10 sm:basis-[72%] lg:basis-auto lg:shrink ${
                        highlighted === offer.id ? "border-amber-600 ring-4 ring-amber-300" : "border-amber-800/15"
                      }`}
                      key={offer.id}
                    >
                      <div className="relative h-[240px] overflow-hidden bg-stone-200 md:h-[340px]">
                        <Image src={offer.image} alt={offer.imageAlt} fill sizes="(max-width: 1023px) 92vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                        <span
                          className={`absolute left-4 top-4 inline-flex min-h-8 items-center gap-2 rounded-full px-3 text-[11px] font-black uppercase tracking-[0.08em] shadow-lg ${
                            urgent ? "bg-red-700 text-white" : "bg-white/95 text-emerald-800"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${urgent ? "bg-white" : "bg-emerald-600"}`} aria-hidden="true" />
                          {expiryLabel}
                        </span>
                      </div>

                      <div className="p-[clamp(24px,4vw,38px)] text-center">
                        {offer.discountLabel ? (
                          <span className="inline-flex min-h-[30px] items-center rounded-full border border-amber-800/15 bg-amber-50 px-3 text-[10px] font-black uppercase tracking-[0.12em] text-amber-800">
                            {offer.discountLabel}
                          </span>
                        ) : null}
                        <h3 className="mt-4 text-[clamp(28px,4vw,44px)] font-black leading-none tracking-[-0.045em] text-amber-800">{offer.title}</h3>
                        <p className="mt-4 text-[15px] leading-7 text-stone-600">{offer.description}</p>

                        {offer.tags.length ? (
                          <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label={`${offer.title} tags`}>
                            {offer.tags.map((tag) => (
                              <span className="inline-flex min-h-7 items-center rounded-full border border-amber-800/20 bg-white px-3 text-[9px] font-black uppercase tracking-[0.1em] text-amber-800" key={tag}>{tag}</span>
                            ))}
                          </div>
                        ) : null}

                        {offer.tip ? (
                          <div className="mt-5 rounded-[1.125rem] border border-amber-800/15 bg-amber-50 p-4 text-[13px] leading-6 text-stone-800">
                            <strong className="text-amber-800">{labels.tip}:</strong> {offer.tip}
                          </div>
                        ) : null}

                        {offer.couponCode ? (
                          <div className="mt-4 rounded-[1.25rem] border-2 border-dashed border-amber-800 bg-[#f8f7f2] p-4" aria-label={`${offer.title} coupon code`}>
                            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.12em] text-stone-600">{labels.code}</span>
                            <strong className="block font-mono text-3xl font-black leading-none tracking-[0.06em] text-amber-800">{offer.couponCode}</strong>
                            <CopyCodeButton code={offer.couponCode} labels={labels} offerId={offer.id} locale={locale} />
                          </div>
                        ) : null}

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                          <a
                            className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-amber-800 px-4 text-[11px] font-black uppercase tracking-[0.1em] !text-white shadow-lg shadow-amber-900/15"
                            href={offer.bookingHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => emit("offer_book_click", { offer_id: offer.id, coupon_code: offer.couponCode, language: locale })}
                          >
                            {labels.bookNow}
                          </a>
                          <a className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-amber-800/20 bg-[#fff7ee] px-4 text-[11px] font-black uppercase tracking-[0.1em] text-amber-900" href={offer.roomPageHref}>
                            {labels.viewRoom}
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {lastMinute ? (
        <section className="scroll-mt-24 pb-6" id="last-minute" aria-label={labels.lastMinuteTitle}>
          <header className="mx-auto mb-2 w-[min(840px,calc(100%-32px))] text-center">
            <span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-red-50 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-red-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" aria-hidden="true" />
              {labels.lastMinuteKicker}
            </span>
            <p className="mt-3 text-[15px] leading-7 text-stone-600">{labels.lastMinuteText}</p>
          </header>
          <LazyLastMinuteDeals data={lastMinute} canonicalPath={data.seo.canonicalPath} title={labels.lastMinuteTitle} anchorId="last-minute-widget" />
        </section>
      ) : null}

      <section className="px-0 pb-4" aria-label="search">
        <p className="mx-auto mb-2 w-[min(840px,calc(100%-32px))] text-center text-sm leading-7 text-stone-600">{labels.searchNote}</p>
        <LocalizedChiosHotelsLiveSearch locale={locale} pathname={data.seo.canonicalPath} />
      </section>

      <section id="newsletter" className="scroll-mt-24 px-4 py-16 md:py-20" aria-labelledby="deals-newsletter-title">
        <div className="mx-auto max-w-[860px] rounded-[2.25rem] border border-amber-800/15 bg-white px-6 py-10 text-center shadow-2xl shadow-stone-900/10 md:px-12">
          <span className="inline-flex min-h-8 items-center rounded-full bg-[#f1eadc] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-amber-800">
            {labels.newsletterKicker}
          </span>
          <h2 id="deals-newsletter-title" className="mt-4 text-[clamp(28px,4vw,44px)] font-black leading-tight tracking-[-0.04em] text-amber-800">
            {labels.newsletterTitle}
          </h2>
          <p className="mx-auto mb-7 mt-3 max-w-[620px] text-[15px] leading-7 text-stone-600">{labels.newsletterText}</p>
          <NewsletterSignupForm locale={locale} source="deals-page" />
        </div>
      </section>
    </main>
  );
}

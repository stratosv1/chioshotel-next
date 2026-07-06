"use client";

import type { PreArrivalPageData } from "@/content/pre-arrival";
import {
  preArrivalContact,
  preArrivalDirectionsUrl,
  preArrivalAirportVideoUrl,
  preArrivalChiosHarborDirectionsUrl,
  preArrivalMestaDirectionsUrl,
} from "@/content/pre-arrival";

type PreArrivalPageProps = {
  data: PreArrivalPageData;
};

type RouteSection = {
  title: string;
  intro: string;
  routeLabel: string;
  routeUrl: string;
  videoLabel?: string;
  videoUrl?: string;
  steps: string[];
};

type PageCopy = {
  badge: string;
  title: string;
  intro: string;
  arrivalTitle: string;
  arrivalText: string;
  whatsapp: string;
  sms: string;
  email: string;
  warningTitle: string;
  warningText: string;
  routes: RouteSection[];
  helpTitle: string;
  call: string;
  languageLabel: string;
};

const airportStepsEn = [
  "When you exit Chios Airport, turn right towards Voulamandis House.",
  "Follow the road parallel to the airport runway until the end.",
  "You will see an ELIN gas station on your right.",
  "After a while, on your left hand, you will find MY MARKET supermarket and right next to it Lidl.",
  "After Lidl, at the end of the runway, turn left into Dimarchou Kalvokoressi Street.",
  "Continue only on Dimarchou Kalvokoressi Street until number 117.",
];

const harborStepsEn = [
  "Leave Chios Harbor and drive around the port towards Chios Airport.",
  "After about 10 minutes, you will see the airport gate on your right. Continue straight.",
  "Follow the road parallel to the airport runway until the end.",
  "You will see an ELIN gas station on your right.",
  "On your left, you will find MY MARKET supermarket and right next to it Lidl.",
  "After Lidl, at the end of the runway, turn left into Dimarchou Kalvokoressi Street.",
  "Continue only on Dimarchou Kalvokoressi Street until number 117.",
  "The road has some turns, tall stone walls and Chios mandarin orchards.",
];

const mestaStepsEn = [
  "Mesta Port is on the southwest side of Chios.",
  "The drive to Voulamandis House takes about 1 hour.",
  "Follow our recommended Google Maps route because other routes may be less convenient.",
  "You will drive towards the centre of the island.",
  "The route passes through or near Pyrgi, Armolia and local shops.",
  "You will arrive at Voulamandis House through the village of Thymiana.",
  "At the final part, follow Dimarchou Kalvokoressi Street until number 117.",
];

const airportStepsEl = [
  "Όταν βγείτε από το αεροδρόμιο Χίου, στρίψτε δεξιά προς Voulamandis House.",
  "Ακολουθήστε τον δρόμο που είναι παράλληλος με τον διάδρομο του αεροδρομίου μέχρι το τέλος.",
  "Θα δείτε ένα βενζινάδικο ELIN στα δεξιά σας.",
  "Μετά από λίγο, στα αριστερά σας, θα δείτε το MY MARKET και ακριβώς δίπλα το Lidl.",
  "Μετά το Lidl, στο τέλος του διαδρόμου, στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση.",
  "Συνεχίστε μόνο στην οδό Δημάρχου Καλβοκορέση μέχρι τον αριθμό 117.",
];

const harborStepsEl = [
  "Φεύγοντας από το λιμάνι της Χίου, κινηθείτε γύρω από το λιμάνι προς το αεροδρόμιο Χίου.",
  "Σε περίπου 10 λεπτά θα δείτε την πύλη του αεροδρομίου στα δεξιά σας. Συνεχίστε ευθεία.",
  "Ακολουθήστε τον δρόμο που είναι παράλληλος με τον διάδρομο του αεροδρομίου μέχρι το τέλος.",
  "Θα δείτε ένα βενζινάδικο ELIN στα δεξιά σας.",
  "Στα αριστερά σας θα δείτε το MY MARKET και ακριβώς δίπλα το Lidl.",
  "Μετά το Lidl, στο τέλος του διαδρόμου, στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση.",
  "Συνεχίστε μόνο στην οδό Δημάρχου Καλβοκορέση μέχρι τον αριθμό 117.",
  "Η διαδρομή έχει κάποιες στροφές, ψηλούς πέτρινους τοίχους και περιβόλια με μανταρίνια Χίου.",
];

const mestaStepsEl = [
  "Το λιμάνι των Μεστών βρίσκεται στη νοτιοδυτική πλευρά της Χίου.",
  "Η διαδρομή μέχρι το Voulamandis House διαρκεί περίπου 1 ώρα.",
  "Ακολουθήστε τη δική μας προτεινόμενη διαδρομή στο Google Maps, γιατί άλλες διαδρομές μπορεί να είναι λιγότερο βολικές.",
  "Θα κινηθείτε προς το κέντρο του νησιού.",
  "Η διαδρομή περνάει από ή κοντά σε Πυργί, Αρμόλια και τοπικά καταστήματα.",
  "Θα φτάσετε στο Voulamandis House μέσα από το χωριό Θυμιανά.",
  "Στο τελικό κομμάτι, ακολουθήστε την οδό Δημάρχου Καλβοκορέση μέχρι τον αριθμό 117.",
];

const copyEn: PageCopy = {
  badge: "Voulamandis House arrival guide",
  title: "How to get to Voulamandis House",
  intro:
    "This page gives you the exact route information you need before arriving.",
  arrivalTitle: "1. Tell us your arrival information",
  arrivalText:
    "Please send us what time you expect to arrive and how you are arriving: from Chios Airport, Chios Harbor or Mesta Port.",
  whatsapp: "Send by WhatsApp",
  sms: "Send by SMS",
  email: "Send by email",
  warningTitle: "Important Google Maps warning",
  warningText:
    "Google Maps may suggest Chalkousi Zanni ke Marias Street. Ignore that suggestion. Follow Dimarchou Kalvokoressi Street and continue until number 117.",
  routes: [
    {
      title: "2. If you arrive from Chios Airport",
      intro: "Voulamandis House is about 8 minutes from Chios Airport.",
      routeLabel: "Open airport route",
      routeUrl: preArrivalDirectionsUrl,
      videoLabel: "Watch airport video",
      videoUrl: preArrivalAirportVideoUrl,
      steps: airportStepsEn,
    },
    {
      title: "3. If you arrive from Chios Harbor",
      intro:
        "Follow the route towards Chios Airport and then continue using the same final road.",
      routeLabel: "Open Chios Harbor route",
      routeUrl: preArrivalChiosHarborDirectionsUrl,
      steps: harborStepsEn,
    },
    {
      title: "4. If you arrive from Mesta Port",
      intro:
        "Mesta Port is farther away. Use our recommended route and arrive through Thymiana.",
      routeLabel: "Open Mesta Port route",
      routeUrl: preArrivalMestaDirectionsUrl,
      steps: mestaStepsEn,
    },
  ],
  helpTitle: "Need help?",
  call: "Call Voulamandis House",
  languageLabel: "Languages",
};

const copyEl: PageCopy = {
  badge: "Οδηγός άφιξης Voulamandis House",
  title: "Πώς να φτάσετε στο Voulamandis House",
  intro:
    "Σε αυτή τη σελίδα θα βρείτε τις ακριβείς πληροφορίες διαδρομής πριν την άφιξή σας.",
  arrivalTitle: "1. Στείλτε μας πληροφορίες άφιξης",
  arrivalText:
    "Στείλτε μας περίπου τι ώρα θα φτάσετε και πώς έρχεστε: από αεροδρόμιο Χίου, λιμάνι Χίου ή λιμάνι Μεστών.",
  whatsapp: "Αποστολή με WhatsApp",
  sms: "Αποστολή με SMS",
  email: "Αποστολή με email",
  warningTitle: "Προσοχή στο Google Maps",
  warningText:
    "Το Google Maps μπορεί να σας προτείνει την οδό Χαλκούση Ζάννη και Μαρίας. Αγνοήστε αυτή την πρόταση. Ακολουθήστε την οδό Δημάρχου Καλβοκορέση και συνεχίστε μέχρι τον αριθμό 117.",
  routes: [
    {
      title: "2. Αν έρχεστε από το αεροδρόμιο Χίου",
      intro: "Το Voulamandis House απέχει περίπου 8 λεπτά από το αεροδρόμιο Χίου.",
      routeLabel: "Άνοιγμα διαδρομής από αεροδρόμιο",
      routeUrl: preArrivalDirectionsUrl,
      videoLabel: "Δείτε video από το αεροδρόμιο",
      videoUrl: preArrivalAirportVideoUrl,
      steps: airportStepsEl,
    },
    {
      title: "3. Αν έρχεστε από το λιμάνι της Χίου",
      intro:
        "Ακολουθήστε τη διαδρομή προς το αεροδρόμιο Χίου και μετά συνεχίστε στο ίδιο τελικό κομμάτι.",
      routeLabel: "Άνοιγμα διαδρομής από λιμάνι Χίου",
      routeUrl: preArrivalChiosHarborDirectionsUrl,
      steps: harborStepsEl,
    },
    {
      title: "4. Αν έρχεστε από το λιμάνι των Μεστών",
      intro:
        "Το λιμάνι των Μεστών είναι πιο μακριά. Χρησιμοποιήστε τη δική μας προτεινόμενη διαδρομή και φτάστε μέσω Θυμιανών.",
      routeLabel: "Άνοιγμα διαδρομής από λιμάνι Μεστών",
      routeUrl: preArrivalMestaDirectionsUrl,
      steps: mestaStepsEl,
    },
  ],
  helpTitle: "Χρειάζεστε βοήθεια;",
  call: "Καλέστε το Voulamandis House",
  languageLabel: "Γλώσσες",
};

const localizedCopy: Record<string, PageCopy> = {
  en: copyEn,
  el: copyEl,
  fr: {
    ...copyEn,
    badge: "Guide d’arrivée Voulamandis House",
    title: "Comment arriver à Voulamandis House",
    arrivalTitle: "1. Envoyez-nous vos informations d’arrivée",
    whatsapp: "Envoyer par WhatsApp",
    sms: "Envoyer par SMS",
    email: "Envoyer par email",
    helpTitle: "Besoin d’aide ?",
    call: "Appeler Voulamandis House",
    languageLabel: "Langues",
  },
  de: {
    ...copyEn,
    badge: "Anreise-Guide Voulamandis House",
    title: "So kommen Sie zum Voulamandis House",
    arrivalTitle: "1. Senden Sie uns Ihre Ankunftsinformationen",
    whatsapp: "Per WhatsApp senden",
    sms: "Per SMS senden",
    email: "Per E-Mail senden",
    helpTitle: "Brauchen Sie Hilfe?",
    call: "Voulamandis House anrufen",
    languageLabel: "Sprachen",
  },
  it: {
    ...copyEn,
    badge: "Guida di arrivo Voulamandis House",
    title: "Come arrivare a Voulamandis House",
    arrivalTitle: "1. Inviaci le informazioni di arrivo",
    whatsapp: "Invia con WhatsApp",
    sms: "Invia con SMS",
    email: "Invia con email",
    helpTitle: "Hai bisogno di aiuto?",
    call: "Chiama Voulamandis House",
    languageLabel: "Lingue",
  },
  es: {
    ...copyEn,
    badge: "Guía de llegada Voulamandis House",
    title: "Cómo llegar a Voulamandis House",
    arrivalTitle: "1. Envíenos su información de llegada",
    whatsapp: "Enviar por WhatsApp",
    sms: "Enviar por SMS",
    email: "Enviar por email",
    helpTitle: "¿Necesita ayuda?",
    call: "Llamar a Voulamandis House",
    languageLabel: "Idiomas",
  },
  tr: {
    ...copyEn,
    badge: "Voulamandis House varış rehberi",
    title: "Voulamandis House’a nasıl gelinir",
    arrivalTitle: "1. Varış bilgilerinizi gönderin",
    whatsapp: "WhatsApp ile gönder",
    sms: "SMS ile gönder",
    email: "E-posta ile gönder",
    helpTitle: "Yardıma mı ihtiyacınız var?",
    call: "Voulamandis House’u ara",
    languageLabel: "Diller",
  },
};

const languageLinks = [
  { label: "English", href: "/pre-arrival/", locale: "en" },
  { label: "Ελληνικά", href: "/el/pre-arrival/", locale: "el" },
  { label: "Français", href: "/fr/pre-arrival/", locale: "fr" },
  { label: "Deutsch", href: "/de/pre-arrival/", locale: "de" },
  { label: "Italiano", href: "/it/pre-arrival/", locale: "it" },
  { label: "Español", href: "/es/pre-arrival/", locale: "es" },
  { label: "Türkçe", href: "/tr/pre-arrival/", locale: "tr" },
];

function buildArrivalMessage(locale: string) {
  if (locale === "el") {
    return "Γεια σας Voulamandis House. Θα φτάσω περίπου στις: ____ . Έρχομαι από: αεροδρόμιο Χίου / λιμάνι Χίου / λιμάνι Μεστών.";
  }

  return "Hello Voulamandis House. I expect to arrive at: ____ . I am arriving from: Chios Airport / Chios Harbor / Mesta Port.";
}

function RouteCard({
  route,
  copy,
}: {
  route: RouteSection;
  copy: PageCopy;
}) {
  return (
    <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950 md:text-3xl">
            {route.title}
          </h2>
          <p className="mt-3 max-w-[760px] text-base leading-7 text-slate-700">
            {route.intro}
          </p>
        </div>

        <div className="grid gap-2 md:min-w-[260px]">
          <a
            href={route.routeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-teal-800 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white hover:bg-teal-900"
          >
            {route.routeLabel}
          </a>

          {route.videoUrl && route.videoLabel ? (
            <a
              href={route.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-red-700 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white hover:bg-red-800"
            >
              ▶ {route.videoLabel}
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-[20px] border border-yellow-300 bg-yellow-50 p-4 text-amber-950">
        <h3 className="font-black">{copy.warningTitle}</h3>
        <p className="mt-2 leading-7">{copy.warningText}</p>
      </div>

      <ol className="mt-5 grid gap-3">
        {route.steps.map((step, index) => (
          <li
            key={step}
            className="flex gap-4 rounded-[18px] bg-slate-50 p-4 ring-1 ring-slate-900/5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
              {index + 1}
            </span>
            <span className="leading-7 text-slate-700">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function PreArrivalPage({ data }: PreArrivalPageProps) {
  const copy = localizedCopy[data.locale] ?? localizedCopy.en;
  const message = buildArrivalMessage(data.locale);

  const whatsappHref = `${preArrivalContact.whatsappBase}?text=${encodeURIComponent(message)}`;
  const smsHref = `${preArrivalContact.smsBase}?body=${encodeURIComponent(message)}`;
  const emailHref = `mailto:${preArrivalContact.email}?subject=${encodeURIComponent(
    "Voulamandis House arrival information",
  )}&body=${encodeURIComponent(message)}`;

  return (
    <main className="min-h-screen bg-[#eef7f4] px-4 py-6 text-slate-950 md:px-6 md:py-10">
      <div className="mx-auto max-w-[980px]">
        <header className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-900/10 md:p-8">
          <span className="inline-flex rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-teal-800">
            {copy.badge}
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
            {copy.title}
          </h1>

          <p className="mt-4 max-w-[780px] text-lg leading-8 text-slate-700">
            {copy.intro}
          </p>
        </header>

        <section className="mt-5 rounded-[28px] bg-slate-950 p-6 text-white shadow-sm md:p-8">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.03em] md:text-3xl">
            {copy.arrivalTitle}
          </h2>

          <p className="mt-3 max-w-[820px] text-base leading-7 text-white/75">
            {copy.arrivalText}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-slate-950"
            >
              {copy.whatsapp}
            </a>

            <a
              href={smsHref}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/20 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              {copy.sms}
            </a>

            <a
              href={emailHref}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/20 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              {copy.email}
            </a>
          </div>
        </section>

        <div className="mt-5 grid gap-5">
          {copy.routes.map((route) => (
            <RouteCard route={route} copy={copy} key={route.title} />
          ))}
        </div>

        <section className="mt-5 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-900/10 md:p-8">
          <h2 className="text-2xl font-black tracking-[-0.03em]">
            {copy.helpTitle}
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <a
              href={preArrivalContact.phoneHref}
              className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-slate-950 px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              {copy.call}
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-teal-800 px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              WhatsApp
            </a>

            <a
              href={emailHref}
              className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-slate-950"
            >
              Email
            </a>

            <a
              href={smsHref}
              className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-slate-950"
            >
              SMS
            </a>
          </div>
        </section>

        <nav className="mt-5 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-900/10">
          <span className="sr-only">{copy.languageLabel}</span>
          <div className="flex flex-wrap justify-center gap-2">
            {languageLinks.map((item) => (
              <a
                href={item.href}
                key={item.locale}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  item.locale === data.locale
                    ? "bg-teal-800 !text-white"
                    : "bg-slate-100 !text-slate-950 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </main>
  );
}

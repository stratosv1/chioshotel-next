const fs = require("fs");

const componentFile = "components/pre-arrival/PreArrivalPage.tsx";
const layoutFile = "app/layout.tsx";

const component = String.raw`"use client";

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
  callNumber: string;
  whatsappNumber: string;
  smsNumber: string;
  languageLabel: string;
  message: string;
};

const routeUrls = {
  airport: preArrivalDirectionsUrl,
  airportVideo: preArrivalAirportVideoUrl,
  harbor: preArrivalChiosHarborDirectionsUrl,
  mesta: preArrivalMestaDirectionsUrl,
};

const languageLinks = [
  { label: "English", href: "/pre-arrival/", locale: "en" },
  { label: "λληνικά", href: "/el/pre-arrival/", locale: "el" },
  { label: "Français", href: "/fr/pre-arrival/", locale: "fr" },
  { label: "Deutsch", href: "/de/pre-arrival/", locale: "de" },
  { label: "Italiano", href: "/it/pre-arrival/", locale: "it" },
  { label: "Español", href: "/es/pre-arrival/", locale: "es" },
  { label: "Türkçe", href: "/tr/pre-arrival/", locale: "tr" },
];

const copy: Record<string, PageCopy> = {
  en: {
    badge: "Voulamandis House arrival guide",
    title: "How to get to Voulamandis House",
    intro: "Simple arrival instructions for Chios Airport, Chios Harbor and Mesta Port.",
    arrivalTitle: "1. Send us your arrival information",
    arrivalText: "Before you start, please tell us approximately what time you arrive and how you arrive.",
    whatsapp: "Send by WhatsApp",
    sms: "Send by SMS",
    email: "Send by email",
    warningTitle: "Important Google Maps warning",
    warningText: "Google Maps may suggest Chalkousi Zanni ke Marias Street. Ignore it. Follow Dimarchou Kalvokoressi Street and continue until number 117.",
    helpTitle: "Need help?",
    call: "Call",
    callNumber: "+30 6944764654",
    whatsappNumber: "+30 6944474226",
    smsNumber: "+30 6944474226",
    languageLabel: "Languages",
    message: "Hello Voulamandis House. I expect to arrive at: ____ . I am arriving from: Chios Airport / Chios Harbor / Mesta Port.",
    routes: [
      {
        title: "2. If you arrive from Chios Airport",
        intro: "Voulamandis House is about 8 minutes from Chios Airport.",
        routeLabel: "Open airport route",
        routeUrl: routeUrls.airport,
        videoLabel: "Watch airport video",
        videoUrl: routeUrls.airportVideo,
        steps: [
          "When you exit Chios Airport, turn right towards Voulamandis House.",
          "Follow the road parallel to the airport runway until the end.",
          "You will see an ELIN gas station on your right.",
          "After a while, on your left, you will find MY MARKET supermarket and right next to it Lidl.",
          "After Lidl, at the end of the runway, turn left into Dimarchou Kalvokoressi Street.",
          "Continue only on Dimarchou Kalvokoressi Street until number 117.",
        ],
      },
      {
        title: "3. If you arrive from Chios Harbor",
        intro: "Follow the route towards Chios Airport and then use the same final road.",
        routeLabel: "Open Chios Harbor route",
        routeUrl: routeUrls.harbor,
        steps: [
          "Leave Chios Harbor and drive around the port towards Chios Airport.",
          "After about 10 minutes, you will see the airport gate on your right. Continue straight.",
          "Follow the road parallel to the airport runway until the end.",
          "You will see an ELIN gas station on your right.",
          "On your left, you will find MY MARKET supermarket and right next to it Lidl.",
          "After Lidl, at the end of the runway, turn left into Dimarchou Kalvokoressi Street.",
          "Continue only on Dimarchou Kalvokoressi Street until number 117.",
          "The road has some turns, tall stone walls and Chios mandarin orchards.",
        ],
      },
      {
        title: "4. If you arrive from Mesta Port",
        intro: "Mesta Port is farther away. Use our recommended route and arrive through Thymiana.",
        routeLabel: "Open Mesta Port route",
        routeUrl: routeUrls.mesta,
        steps: [
          "Mesta Port is on the southwest side of Chios.",
          "The drive to Voulamandis House takes about 1 hour.",
          "Follow our recommended Google Maps route because other routes may be less convenient.",
          "Drive towards the centre of the island.",
          "The route passes through or near Pyrgi, Armolia and local shops.",
          "You will arrive at Voulamandis House through the village of Thymiana.",
          "At the final part, follow Dimarchou Kalvokoressi Street until number 117.",
        ],
      },
    ],
  },

  el: {
    badge: "δηγός άφιξης Voulamandis House",
    title: "ώς να φτάσετε στο Voulamandis House",
    intro: "πλές οδηγίες άφιξης από αεροδρόμιο ίου, λιμάνι ίου και λιμάνι εστών.",
    arrivalTitle: "1. τείλτε μας πληροφορίες άφιξης",
    arrivalText: "ριν ξεκινήσετε, στείλτε μας περίπου τι ώρα θα φτάσετε και από πού έρχεστε.",
    whatsapp: "ποστολή με WhatsApp",
    sms: "ποστολή με SMS",
    email: "ποστολή με email",
    warningTitle: "ροσοχή στο Google Maps",
    warningText: "ο Google Maps μπορεί να σας προτείνει την οδό αλκούση άννη και αρίας. γνοήστε την. κολουθήστε την οδό ημάρχου αλβοκορέση και συνεχίστε μέχρι τον αριθμό 117.",
    helpTitle: "ρειάζεστε βοήθεια;",
    call: "λήση",
    callNumber: "+30 6944764654",
    whatsappNumber: "+30 6944474226",
    smsNumber: "+30 6944474226",
    languageLabel: "λώσσες",
    message: "εια σας Voulamandis House. α φτάσω περίπου στις: ____ . Έρχομαι από: αεροδρόμιο ίου / λιμάνι ίου / λιμάνι εστών.",
    routes: [
      {
        title: "2. ν έρχεστε από το αεροδρόμιο ίου",
        intro: "ο Voulamandis House απέχει περίπου 8 λεπτά από το αεροδρόμιο ίου.",
        routeLabel: "Άνοιγμα διαδρομής από αεροδρόμιο",
        routeUrl: routeUrls.airport,
        videoLabel: "είτε video από το αεροδρόμιο",
        videoUrl: routeUrls.airportVideo,
        steps: [
          "Όταν βγείτε από το αεροδρόμιο ίου, στρίψτε δεξιά προς Voulamandis House.",
          "κολουθήστε τον δρόμο που είναι παράλληλος με τον διάδρομο του αεροδρομίου μέχρι το τέλος.",
          "α δείτε ένα βενζινάδικο ELIN στα δεξιά σας.",
          "ετά από λίγο, στα αριστερά σας, θα δείτε το MY MARKET και ακριβώς δίπλα το Lidl.",
          "ετά το Lidl, στο τέλος του διαδρόμου, στρίψτε αριστερά στην οδό ημάρχου αλβοκορέση.",
          "υνεχίστε μόνο στην οδό ημάρχου αλβοκορέση μέχρι τον αριθμό 117.",
        ],
      },
      {
        title: "3. ν έρχεστε από το λιμάνι της ίου",
        intro: "κολουθήστε τη διαδρομή προς το αεροδρόμιο ίου και μετά το ίδιο τελικό κομμάτι.",
        routeLabel: "Άνοιγμα διαδρομής από λιμάνι ίου",
        routeUrl: routeUrls.harbor,
        steps: [
          "εύγοντας από το λιμάνι της ίου, κινηθείτε γύρω από το λιμάνι προς το αεροδρόμιο ίου.",
          "ε περίπου 10 λεπτά θα δείτε την πύλη του αεροδρομίου στα δεξιά σας. υνεχίστε ευθεία.",
          "κολουθήστε τον δρόμο που είναι παράλληλος με τον διάδρομο του αεροδρομίου μέχρι το τέλος.",
          "α δείτε ένα βενζινάδικο ELIN στα δεξιά σας.",
          "τα αριστερά σας θα δείτε το MY MARKET και ακριβώς δίπλα το Lidl.",
          "ετά το Lidl, στο τέλος του διαδρόμου, στρίψτε αριστερά στην οδό ημάρχου αλβοκορέση.",
          "υνεχίστε μόνο στην οδό ημάρχου αλβοκορέση μέχρι τον αριθμό 117.",
          " διαδρομή έχει κάποιες στροφές, ψηλούς πέτρινους τοίχους και περιβόλια με μανταρίνια ίου.",
        ],
      },
      {
        title: "4. ν έρχεστε από το λιμάνι των εστών",
        intro: "ο λιμάνι των εστών είναι πιο μακριά. ρησιμοποιήστε τη δική μας προτεινόμενη διαδρομή.",
        routeLabel: "Άνοιγμα διαδρομής από λιμάνι εστών",
        routeUrl: routeUrls.mesta,
        steps: [
          "ο λιμάνι των εστών βρίσκεται στη νοτιοδυτική πλευρά της ίου.",
          " διαδρομή μέχρι το Voulamandis House διαρκεί περίπου 1 ώρα.",
          "κολουθήστε τη δική μας προτεινόμενη διαδρομή στο Google Maps, γιατί άλλες διαδρομές μπορεί να είναι λιγότερο βολικές.",
          "ινηθείτε προς το κέντρο του νησιού.",
          " διαδρομή περνάει από ή κοντά σε υργί, ρμόλια και τοπικά καταστήματα.",
          "α φτάσετε στο Voulamandis House μέσα από το χωριό υμιανά.",
          "το τελικό κομμάτι, ακολουθήστε την οδό ημάρχου αλβοκορέση μέχρι τον αριθμό 117.",
        ],
      },
    ],
  },
};

copy.fr = {
  ...copy.en,
  badge: "Guide d’arrivée Voulamandis House",
  title: "Comment arriver à Voulamandis House",
  intro: "Instructions simples depuis l’aéroport de Chios, le port de Chios et le port de Mesta.",
  arrivalTitle: "1. Envoyez-nous vos informations d’arrivée",
  arrivalText: "Avant de partir, indiquez-nous votre heure d’arrivée approximative et votre point d’arrivée.",
  whatsapp: "Envoyer par WhatsApp",
  sms: "Envoyer par SMS",
  email: "Envoyer par email",
  warningTitle: "Attention avec Google Maps",
  warningText: "Google Maps peut proposer la rue Chalkousi Zanni ke Marias. Ignorez cette suggestion. Suivez la rue Dimarchou Kalvokoressi jusqu’au numéro 117.",
  helpTitle: "Besoin d’aide ?",
  call: "Appeler",
  languageLabel: "Langues",
  message: "Bonjour Voulamandis House. J’arrive vers : ____ . J’arrive depuis : aéroport de Chios / port de Chios / port de Mesta.",
};

copy.de = {
  ...copy.en,
  badge: "Anreise-Guide Voulamandis House",
  title: "So kommen Sie zum Voulamandis House",
  intro: "Einfache Anreisehinweise vom Flughafen Chios, Hafen Chios und Hafen Mesta.",
  arrivalTitle: "1. Senden Sie uns Ihre Ankunftsinformationen",
  arrivalText: "Bitte teilen Sie uns vor der Abfahrt Ihre ungefähre Ankunftszeit und Ihren Ankunftsort mit.",
  whatsapp: "Per WhatsApp senden",
  sms: "Per SMS senden",
  email: "Per E-Mail senden",
  warningTitle: "Wichtiger Google-Maps-Hinweis",
  warningText: "Google Maps kann die Straße Chalkousi Zanni ke Marias vorschlagen. Ignorieren Sie diese Route. Folgen Sie der Straße Dimarchou Kalvokoressi bis Hausnummer 117.",
  helpTitle: "Brauchen Sie Hilfe?",
  call: "Anrufen",
  languageLabel: "Sprachen",
  message: "Hallo Voulamandis House. Ich komme ungefähr um: ____ . Ich komme von: Flughafen Chios / Hafen Chios / Hafen Mesta.",
};

copy.it = {
  ...copy.en,
  badge: "Guida di arrivo Voulamandis House",
  title: "Come arrivare a Voulamandis House",
  intro: "Indicazioni semplici dall’aeroporto di Chios, dal porto di Chios e dal porto di Mesta.",
  arrivalTitle: "1. Inviaci le informazioni di arrivo",
  arrivalText: "Prima di partire, comunicaci l’orario approssimativo di arrivo e da dove arrivi.",
  whatsapp: "Invia con WhatsApp",
  sms: "Invia con SMS",
  email: "Invia con email",
  warningTitle: "Attenzione a Google Maps",
  warningText: "Google Maps potrebbe suggerire via Chalkousi Zanni ke Marias. Ignora questo suggerimento. Segui via Dimarchou Kalvokoressi fino al numero 117.",
  helpTitle: "Hai bisogno di aiuto?",
  call: "Chiama",
  languageLabel: "Lingue",
  message: "Ciao Voulamandis House. Arriverò circa alle: ____ . Arrivo da: aeroporto di Chios / porto di Chios / porto di Mesta.",
};

copy.es = {
  ...copy.en,
  badge: "Guía de llegada Voulamandis House",
  title: "Cómo llegar a Voulamandis House",
  intro: "Instrucciones sencillas desde el aeropuerto de Chios, el puerto de Chios y el puerto de Mesta.",
  arrivalTitle: "1. Envíenos su información de llegada",
  arrivalText: "Antes de salir, indíquenos la hora aproximada de llegada y desde dónde llega.",
  whatsapp: "Enviar por WhatsApp",
  sms: "Enviar por SMS",
  email: "Enviar por email",
  warningTitle: "Advertencia importante de Google Maps",
  warningText: "Google Maps puede sugerir la calle Chalkousi Zanni ke Marias. Ignore esa sugerencia. Siga la calle Dimarchou Kalvokoressi hasta el número 117.",
  helpTitle: "¿Necesita ayuda?",
  call: "Llamar",
  languageLabel: "Idiomas",
  message: "Hola Voulamandis House. Llegaré aproximadamente a las: ____ . Llego desde: aeropuerto de Chios / puerto de Chios / puerto de Mesta.",
};

copy.tr = {
  ...copy.en,
  badge: "Voulamandis House varış rehberi",
  title: "Voulamandis House’a nasıl gelinir",
  intro: "Chios Havalimanı, Chios Limanı ve Mesta Limanı için basit varış talimatları.",
  arrivalTitle: "1. Varış bilgilerinizi gönderin",
  arrivalText: "Yola çıkmadan önce yaklaşık varış saatinizi ve nereden geldiğinizi bize bildirin.",
  whatsapp: "WhatsApp ile gönder",
  sms: "SMS ile gönder",
  email: "E-posta ile gönder",
  warningTitle: "Google Maps uyarısı",
  warningText: "Google Maps Chalkousi Zanni ke Marias Street yolunu önerebilir. Bu öneriyi dikkate almayın. Dimarchou Kalvokoressi Street’i takip edin ve 117 numaraya kadar devam edin.",
  helpTitle: "Yardıma mı ihtiyacınız var?",
  call: "Ara",
  languageLabel: "Diller",
  message: "Merhaba Voulamandis House. Yaklaşık varış saatim: ____ . Geldiğim yer: Chios Havalimanı / Chios Limanı / Mesta Limanı.",
};

function RouteCard({ route, pageCopy }: { route: RouteSection; pageCopy: PageCopy }) {
  return (
    <section className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_280px] md:items-start">
        <div>
          <h2 className="text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950 md:text-3xl">
            {route.title}
          </h2>
          <p className="mt-2 text-base leading-7 text-slate-700">{route.intro}</p>
        </div>

        <div className="grid gap-2">
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

      <div className="mt-4 rounded-[18px] border border-yellow-300 bg-yellow-50 p-4 text-amber-950">
        <h3 className="font-black">{pageCopy.warningTitle}</h3>
        <p className="mt-2 leading-7">{pageCopy.warningText}</p>
      </div>

      <ol className="mt-4 grid gap-2.5">
        {route.steps.map((step, index) => (
          <li
            key={step}
            className="flex gap-4 rounded-[16px] bg-slate-50 p-3.5 ring-1 ring-slate-900/5"
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
  const pageCopy = copy[data.locale] ?? copy.en;

  const whatsappHref = `${preArrivalContact.whatsappBase}?text=${encodeURIComponent(pageCopy.message)}`;
  const smsHref = `${preArrivalContact.smsBase}?&body=${encodeURIComponent(pageCopy.message)}`;
  const emailHref = `mailto:${preArrivalContact.email}?subject=${encodeURIComponent(
    "Voulamandis House arrival information",
  )}&body=${encodeURIComponent(pageCopy.message)}`;

  return (
    <main className="min-h-screen bg-[#eef7f4] px-4 py-5 text-slate-950 md:px-6 md:py-8">
      <div className="mx-auto max-w-[980px]">
        <header className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-7">
          <span className="inline-flex rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-teal-800">
            {pageCopy.badge}
          </span>

          <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
            {pageCopy.title}
          </h1>

          <p className="mt-3 max-w-[780px] text-lg leading-8 text-slate-700">
            {pageCopy.intro}
          </p>
        </header>

        <section className="mt-4 rounded-[24px] bg-slate-950 p-5 text-white shadow-sm md:p-7">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.03em] md:text-3xl">
            {pageCopy.arrivalTitle}
          </h2>

          <p className="mt-3 max-w-[820px] text-base leading-7 text-white/75">
            {pageCopy.arrivalText}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-slate-950"
            >
              {pageCopy.whatsapp}
            </a>

            <a
              href={smsHref}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/20 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              {pageCopy.sms}
            </a>

            <a
              href={emailHref}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/20 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              {pageCopy.email}
            </a>
          </div>
        </section>

        <div className="mt-4 grid gap-4">
          {pageCopy.routes.map((route) => (
            <RouteCard route={route} pageCopy={pageCopy} key={route.title} />
          ))}
        </div>

        <section className="mt-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-6">
          <h2 className="text-2xl font-black tracking-[-0.03em]">{pageCopy.helpTitle}</h2>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <a
              href={preArrivalContact.phoneHref}
              className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-slate-950 px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              {pageCopy.call}: {pageCopy.callNumber}
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-teal-800 px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              WhatsApp: {pageCopy.whatsappNumber}
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
              SMS: {pageCopy.smsNumber}
            </a>
          </div>
        </section>

        <nav className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-900/10">
          <span className="sr-only">{pageCopy.languageLabel}</span>
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
`;

fs.writeFileSync(componentFile, component, "utf8");

let layout = fs.readFileSync(layoutFile, "utf8");

if (
  layout.includes("<VoulamandisFooter language={htmlLanguage} />") &&
  !layout.includes("{!hideHeader ? <VoulamandisFooter language={htmlLanguage} /> : null}")
) {
  layout = layout.replace(
    "<VoulamandisFooter language={htmlLanguage} />",
    "{!hideHeader ? <VoulamandisFooter language={htmlLanguage} /> : null}"
  );
}

fs.writeFileSync(layoutFile, layout, "utf8");

console.log("Pre-arrival CTAs, layout and footer updated.");

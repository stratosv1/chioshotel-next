const fs = require("fs");

function writeFile(path, content) {
  fs.mkdirSync(require("path").dirname(path), { recursive: true });
  fs.writeFileSync(path, content.replace(/^\n/, ""), "utf8");
  console.log("Wrote:", path);
}

writeFile("content/pre-arrival.ts", `
import type { LanguageCode } from "@/lib/languages";

export type PreArrivalPageData = {
  locale: LanguageCode;
  seo: {
    canonicalPath: string;
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    kicker: string;
    title: string;
    description: string;
    routeButton: string;
    whatsappButton: string;
  };
  booking: {
    title: string;
    description: string;
    guest: string;
    room: string;
    stay: string;
    price: string;
    missingGuest: string;
    missingRoom: string;
    missingDates: string;
    missingPrice: string;
  };
  arrival: {
    title: string;
    text: string;
    whatsappText: string;
    whatsappButton: string;
  };
  directions: {
    kicker: string;
    title: string;
    text: string;
    importantTitle: string;
    importantText: string;
    openRoute: string;
    callUs: string;
    steps: {
      title: string;
      text: string;
    }[];
  };
  help: {
    title: string;
    text: string;
    call: string;
    whatsapp: string;
  };
  checklist: {
    title: string;
    items: string[];
  };
};

export const preArrivalContact = {
  phoneDisplay: "+30 6944 474226",
  phoneHref: "tel:+306944474226",
  whatsappHref:
    "https://wa.me/306944474226?text=Hello%20Voulamandis%20House%2C%20I%20would%20like%20to%20send%20my%20arrival%20time.",
};

export const preArrivalDirectionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=Voulamandis%20House%20Kampos%20Chios";

export const preArrivalMapEmbedUrl =
  "https://www.google.com/maps?q=Voulamandis%20House%20Kampos%20Chios&output=embed";

const ogImage = "/images/voulamandis-house-og.jpg";

const pages: Record<LanguageCode, PreArrivalPageData> = {
  en: {
    locale: "en",
    seo: {
      canonicalPath: "/pre-arrival/",
      title: "Pre-arrival guide for Voulamandis House Chios",
      description:
        "Useful arrival information, booking details, directions and contact options before your stay at Voulamandis House in Chios.",
      ogImage,
    },
    hero: {
      kicker: "Voulamandis House",
      title: "Your stay at Voulamandis House is almost here",
      description:
        "Everything you need before arrival: booking details, correct route and quick arrival-time message.",
      routeButton: "Open directions",
      whatsappButton: "Send arrival time",
    },
    booking: {
      title: "Your booking at a glance",
      description:
        "Details appear from the booking email when the link contains Beds24 placeholders.",
      guest: "Guest",
      room: "Room",
      stay: "Stay",
      price: "Total cost",
      missingGuest: "Guest details not available",
      missingRoom: "Room details not available",
      missingDates: "Dates not available",
      missingPrice: "Price not available",
    },
    arrival: {
      title: "Tell us approximately what time you will arrive",
      text:
        "A short message with your arrival time helps us organise your welcome and guide you if needed.",
      whatsappText:
        "You can also call us if your arrival time changes on the same day.",
      whatsappButton: "Send message on WhatsApp",
    },
    directions: {
      kicker: "Arrival directions",
      title: "Avoid GPS confusion and follow the safe route",
      text:
        "Some navigation apps may suggest narrow local roads. Open our route and call us if you have any doubt.",
      importantTitle: "Important before driving",
      importantText:
        "Do not always follow the shortest GPS route. If the road looks too narrow, stop safely and call us.",
      openRoute: "Open route",
      callUs: "Call Voulamandis House",
      steps: [
        {
          title: "From Chios airport or port",
          text:
            "Follow the direction to Kampos and open the route button before you start.",
        },
        {
          title: "When you get close",
          text:
            "Drive slowly near the final turn and look for Voulamandis House signs, or call us.",
        },
        {
          title: "If you arrive late",
          text:
            "Send us your arrival time in advance so we can give you the correct check-in guidance.",
        },
      ],
    },
    help: {
      title: "Need help with the route?",
      text:
        "We will be happy to guide you. Call or send a WhatsApp message and we will help you arrive easily.",
      call: "Call",
      whatsapp: "WhatsApp",
    },
    checklist: {
      title: "Before you arrive",
      items: [
        "Send us your estimated arrival time.",
        "Tell us if you arrive by ferry, plane, taxi or rental car.",
        "Keep our phone number available in case GPS becomes confusing.",
        "Inform us about any important room request.",
      ],
    },
  },
  el: {
    locale: "el",
    seo: {
      canonicalPath: "/el/pre-arrival/",
      title: "Οδηγός άφιξης για Voulamandis House Χίος",
      description:
        "Χρήσιμες πληροφορίες άφιξης, στοιχεία κράτησης, οδηγίες διαδρομής και επικοινωνία πριν τη διαμονή σας στο Voulamandis House στη Χίο.",
      ogImage,
    },
    hero: {
      kicker: "Voulamandis House",
      title: "Σας περιμένουμε σύντομα στο Voulamandis House",
      description:
        "Όλα όσα χρειάζεστε πριν την άφιξη: στοιχεία κράτησης, σωστή διαδρομή και γρήγορη αποστολή ώρας άφιξης.",
      routeButton: "Άνοιγμα διαδρομής",
      whatsappButton: "Στείλτε ώρα άφιξης",
    },
    booking: {
      title: "Η κράτησή σας με μια ματιά",
      description:
        "Τα στοιχεία εμφανίζονται από το email κράτησης όταν το link περιέχει τα Beds24 placeholders.",
      guest: "Επισκέπτης",
      room: "Δωμάτιο",
      stay: "Διαμονή",
      price: "Συνολικό κόστος",
      missingGuest: "Δεν υπάρχουν στοιχεία επισκέπτη",
      missingRoom: "Δεν υπάρχουν στοιχεία δωματίου",
      missingDates: "Δεν υπάρχουν ημερομηνίες",
      missingPrice: "Δεν υπάρχει τιμή",
    },
    arrival: {
      title: "Πείτε μας περίπου τι ώρα θα φτάσετε",
      text:
        "Ένα σύντομο μήνυμα με την ώρα άφιξης μας βοηθά να οργανώσουμε καλύτερα την υποδοχή σας και να σας καθοδηγήσουμε αν χρειαστεί.",
      whatsappText:
        "Μπορείτε επίσης να μας καλέσετε αν αλλάξει η ώρα άφιξης την ίδια ημέρα.",
      whatsappButton: "Στείλτε μήνυμα στο WhatsApp",
    },
    directions: {
      kicker: "Οδηγίες άφιξης",
      title: "Αποφύγετε τη σύγχυση GPS και ακολουθήστε την ασφαλή διαδρομή",
      text:
        "Ορισμένες εφαρμογές πλοήγησης μπορεί να προτείνουν στενούς τοπικούς δρόμους. Ανοίξτε τη διαδρομή μας και καλέστε μας αν έχετε αμφιβολία.",
      importantTitle: "Σημαντικό πριν οδηγήσετε",
      importantText:
        "Μην ακολουθείτε πάντα τη συντομότερη διαδρομή του GPS. Αν ο δρόμος φαίνεται πολύ στενός, σταματήστε με ασφάλεια και καλέστε μας.",
      openRoute: "Άνοιγμα διαδρομής",
      callUs: "Καλέστε το Voulamandis House",
      steps: [
        {
          title: "Από αεροδρόμιο ή λιμάνι Χίου",
          text:
            "Ακολουθήστε την κατεύθυνση προς Κάμπο και ανοίξτε το κουμπί διαδρομής πριν ξεκινήσετε.",
        },
        {
          title: "Όταν πλησιάζετε",
          text:
            "Κινηθείτε πιο αργά κοντά στην τελική στροφή και αναζητήστε τις ενδείξεις του Voulamandis House ή καλέστε μας.",
        },
        {
          title: "Αν φτάσετε αργά",
          text:
            "Στείλτε μας την ώρα άφιξης εκ των προτέρων για να σας δώσουμε τις σωστές οδηγίες check-in.",
        },
      ],
    },
    help: {
      title: "Χρειάζεστε βοήθεια στη διαδρομή;",
      text:
        "Θα χαρούμε να σας καθοδηγήσουμε. Καλέστε ή στείλτε μήνυμα και θα σας βοηθήσουμε να φτάσετε εύκολα.",
      call: "Τηλέφωνο",
      whatsapp: "WhatsApp",
    },
    checklist: {
      title: "Πριν φτάσετε",
      items: [
        "Στείλτε μας την εκτιμώμενη ώρα άφιξης.",
        "Πείτε μας αν έρχεστε με πλοίο, αεροπλάνο, ταξί ή ενοικιαζόμενο αυτοκίνητο.",
        "Κρατήστε διαθέσιμο το τηλέφωνό μας σε περίπτωση που μπερδέψει το GPS.",
        "Ενημερώστε μας για οποιοδήποτε σημαντικό αίτημα σχετικά με το δωμάτιο.",
      ],
    },
  },
  fr: {} as PreArrivalPageData,
  de: {} as PreArrivalPageData,
  it: {} as PreArrivalPageData,
  es: {} as PreArrivalPageData,
  tr: {} as PreArrivalPageData,
};

pages.fr = { ...pages.en, locale: "fr", seo: { ...pages.en.seo, canonicalPath: "/fr/pre-arrival/", title: "Guide d’arrivée Voulamandis House Chios" } };
pages.de = { ...pages.en, locale: "de", seo: { ...pages.en.seo, canonicalPath: "/de/pre-arrival/", title: "Anreise-Guide Voulamandis House Chios" } };
pages.it = { ...pages.en, locale: "it", seo: { ...pages.en.seo, canonicalPath: "/it/pre-arrival/", title: "Guida prima dell’arrivo Voulamandis House Chios" } };
pages.es = { ...pages.en, locale: "es", seo: { ...pages.en.seo, canonicalPath: "/es/pre-arrival/", title: "Guía de llegada Voulamandis House Chios" } };
pages.tr = { ...pages.en, locale: "tr", seo: { ...pages.en.seo, canonicalPath: "/tr/pre-arrival/", title: "Voulamandis House Sakız Adası varış rehberi" } };

export function getPreArrivalPageByLocale(locale: LanguageCode): PreArrivalPageData {
  return pages[locale] ?? pages.en;
}
`);

writeFile("components/pre-arrival/PreArrivalPage.tsx", `
"use client";

import { useEffect, useMemo, useState } from "react";
import type { PreArrivalPageData } from "@/content/pre-arrival";
import {
  preArrivalContact,
  preArrivalDirectionsUrl,
  preArrivalMapEmbedUrl,
} from "@/content/pre-arrival";

type PreArrivalPageProps = {
  data: PreArrivalPageData;
};

type BookingQuery = {
  guest: string;
  room: string;
  checkin: string;
  checkout: string;
  price: string;
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

function getBookingFromUrl(): BookingQuery {
  if (typeof window === "undefined") {
    return { guest: "", room: "", checkin: "", checkout: "", price: "" };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    guest: params.get("guest") || params.get("name") || "",
    room: params.get("room") || "",
    checkin: params.get("checkin") || "",
    checkout: params.get("checkout") || "",
    price: params.get("price") || "",
  };
}

function InfoCard({
  label,
  value,
  fallback,
}: {
  label: string;
  value: string;
  fallback: string;
}) {
  return (
    <div className="rounded-[24px] bg-teal-50 p-5 ring-1 ring-slate-900/5">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
        {label}
      </span>
      <p className="mt-2 text-lg font-black text-slate-950">{value || fallback}</p>
    </div>
  );
}

export function PreArrivalPage({ data }: PreArrivalPageProps) {
  const [booking, setBooking] = useState<BookingQuery>({
    guest: "",
    room: "",
    checkin: "",
    checkout: "",
    price: "",
  });

  useEffect(() => {
    setBooking(getBookingFromUrl());
  }, []);

  const stayText = useMemo(() => {
    if (!booking.checkin && !booking.checkout) return "";
    return [booking.checkin, booking.checkout].filter(Boolean).join(" → ");
  }, [booking.checkin, booking.checkout]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef7f4] text-slate-950">
      <section className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-teal-800 shadow-sm">
              {data.hero.kicker}
            </span>

            <h1 className="mt-6 max-w-[13ch] text-[38px] font-black leading-[0.96] tracking-[-0.055em] md:text-[clamp(44px,5vw,68px)]">
              {data.hero.title}
            </h1>

            <p className="mt-6 max-w-[620px] text-lg leading-8 text-slate-700">
              {data.hero.description}
            </p>

            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href={preArrivalDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-teal-800 px-7 text-sm font-black uppercase tracking-[0.08em] text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-teal-900"
              >
                {data.hero.routeButton}
              </a>

              <a
                href={preArrivalContact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-slate-200 bg-white px-7 text-sm font-black uppercase tracking-[0.08em] text-slate-950 shadow-sm transition hover:-translate-y-0.5"
              >
                {data.hero.whatsappButton}
              </a>
            </div>
          </div>

          <aside className="rounded-[34px] bg-white p-5 shadow-2xl ring-1 ring-slate-900/5 md:p-7">
            <div className="rounded-[28px] bg-slate-950 p-6 text-white">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-teal-200">
                Voulamandis House
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em]">
                {data.booking.title}
              </h2>
              <p className="mt-3 leading-7 text-white/75">{data.booking.description}</p>
            </div>

            <div className="mt-5 grid gap-3">
              <InfoCard label={data.booking.guest} value={booking.guest} fallback={data.booking.missingGuest} />
              <InfoCard label={data.booking.room} value={booking.room} fallback={data.booking.missingRoom} />
              <InfoCard label={data.booking.stay} value={stayText} fallback={data.booking.missingDates} />
              <InfoCard label={data.booking.price} value={booking.price} fallback={data.booking.missingPrice} />
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-6 rounded-[34px] bg-white p-5 shadow-xl ring-1 ring-slate-900/5 md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <article className="rounded-[28px] bg-gradient-to-br from-yellow-100 via-teal-50 to-cyan-100 p-7">
            <h2 className="text-4xl font-black leading-none tracking-[-0.05em] md:text-5xl">
              {data.arrival.title}
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">{data.arrival.text}</p>
          </article>

          <div className="flex flex-col justify-center">
            <a
              href={preArrivalContact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[58px] items-center justify-center rounded-full bg-teal-800 px-7 text-center text-sm font-black uppercase tracking-[0.08em] text-white shadow-xl transition hover:bg-teal-900"
            >
              {data.arrival.whatsappButton}
            </a>
            <p className="mt-5 text-base leading-7 text-slate-600">{data.arrival.whatsappText}</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
          <article>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
              {data.directions.kicker}
            </span>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.055em] md:text-6xl">
              {data.directions.title}
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">{data.directions.text}</p>

            <div className="mt-8 rounded-[24px] border border-yellow-300 bg-yellow-50 p-5 text-amber-950">
              <h3 className="text-2xl font-black">{data.directions.importantTitle}</h3>
              <p className="mt-3 leading-7">{data.directions.importantText}</p>
            </div>

            <div className="mt-8 grid gap-4">
              {data.directions.steps.map((step, index) => (
                <div className="flex gap-4 rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-slate-900/5" key={step.title}>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-black">{step.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <aside className="overflow-hidden rounded-[34px] bg-white shadow-2xl ring-1 ring-slate-900/5">
            <iframe
              title="Voulamandis House location map"
              src={preArrivalMapEmbedUrl}
              className="h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="grid gap-3 p-6">
              <a
                href={preArrivalDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-slate-950 px-6 text-center text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-teal-900"
              >
                {data.directions.openRoute}
              </a>
              <a
                href={preArrivalContact.phoneHref}
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-center text-sm font-black uppercase tracking-[0.08em] text-slate-950 transition hover:bg-slate-50"
              >
                {data.directions.callUs}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[34px] bg-slate-950 p-7 text-white shadow-xl md:p-9">
            <h2 className="text-4xl font-black leading-none tracking-[-0.05em]">
              {data.help.title}
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/75">{data.help.text}</p>
            <div className="mt-8 grid gap-3">
              <a href={preArrivalContact.phoneHref} className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-white px-6 text-sm font-black uppercase tracking-[0.08em] text-slate-950">
                {data.help.call}: {preArrivalContact.phoneDisplay}
              </a>
              <a href={preArrivalContact.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/20 px-6 text-sm font-black uppercase tracking-[0.08em] text-white">
                {data.help.whatsapp}
              </a>
            </div>
          </article>

          <article className="rounded-[34px] bg-white p-7 shadow-xl ring-1 ring-slate-900/5 md:p-9">
            <h2 className="text-4xl font-black leading-none tracking-[-0.05em]">
              {data.checklist.title}
            </h2>
            <div className="mt-6 grid gap-3">
              {data.checklist.items.map((item) => (
                <div className="flex gap-4 rounded-[22px] bg-teal-50 p-4 text-lg leading-7 text-slate-700" key={item}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-black text-white">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <nav className="px-4 pb-12 md:px-6">
        <div className="mx-auto flex max-w-[1180px] flex-wrap justify-center gap-3 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
          {languageLinks.map((item) => (
            <a
              href={item.href}
              key={item.locale}
              className={\`rounded-full px-5 py-3 text-sm font-black transition \${item.locale === data.locale ? "bg-teal-800 text-white" : "bg-slate-100 text-slate-950 hover:bg-slate-200"}\`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </main>
  );
}
`);

writeFile("app/pre-arrival/page.tsx", `
import type { Metadata } from "next";
import { PreArrivalPage } from "@/components/pre-arrival/PreArrivalPage";
import { getPreArrivalPageByLocale } from "@/content/pre-arrival";
import { buildPageMetadata } from "@/lib/seo";

const data = getPreArrivalPageByLocale("en");

export const metadata: Metadata = buildPageMetadata({
  path: data.seo.canonicalPath,
  title: data.seo.title,
  description: data.seo.description,
  image: data.seo.ogImage,
});

export default function Page() {
  return <PreArrivalPage data={data} />;
}
`);

writeFile("app/[locale]/pre-arrival/page.tsx", `
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreArrivalPage } from "@/components/pre-arrival/PreArrivalPage";
import { getPreArrivalPageByLocale } from "@/content/pre-arrival";
import { buildPageMetadata } from "@/lib/seo";
import { defaultLanguage, isLanguageCode, languages } from "@/lib/languages";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return languages
    .filter((language) => language.code !== defaultLanguage)
    .map((language) => ({
      locale: language.code,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    return {};
  }

  const data = getPreArrivalPageByLocale(locale);

  return buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    notFound();
  }

  const data = getPreArrivalPageByLocale(locale);

  return <PreArrivalPage data={data} />;
}
`);

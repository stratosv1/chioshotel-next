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

const languageLinks = [
  { label: "English", href: "/pre-arrival/", locale: "en" },
  { label: "Ελληνικά", href: "/el/pre-arrival/", locale: "el" },
  { label: "Français", href: "/fr/pre-arrival/", locale: "fr" },
  { label: "Deutsch", href: "/de/pre-arrival/", locale: "de" },
  { label: "Italiano", href: "/it/pre-arrival/", locale: "it" },
  { label: "Español", href: "/es/pre-arrival/", locale: "es" },
  { label: "Türkçe", href: "/tr/pre-arrival/", locale: "tr" },
];

const homeLinks: Record<string, string> = {
  en: "/",
  el: "/el/",
  fr: "/fr/",
  de: "/de/",
  it: "/it/",
  es: "/es/",
  tr: "/tr/",
};

const languageLabels: Record<string, string> = {
  en: "Languages",
  el: "Γλώσσες",
  fr: "Langues",
  de: "Sprachen",
  it: "Lingue",
  es: "Idiomas",
  tr: "Diller",
};

const homeLabels: Record<string, string> = {
  en: "Back to homepage",
  el: "Επιστροφή στην αρχική",
  fr: "Retour à l’accueil",
  de: "Zur Startseite",
  it: "Torna alla homepage",
  es: "Volver a la página principal",
  tr: "Ana sayfaya dön",
};

const routeNames: Record<string, { airport: string; harbor: string; mesta: string; video: string }> = {
  en: { airport: "Chios Airport", harbor: "Chios Harbor", mesta: "Mesta Port", video: "Airport video" },
  el: { airport: "Αεροδρόμιο Χίου", harbor: "Λιμάνι Χίου", mesta: "Λιμάνι Μεστών", video: "Video αεροδρομίου" },
  fr: { airport: "Aéroport de Chios", harbor: "Port de Chios", mesta: "Port de Mesta", video: "Vidéo aéroport" },
  de: { airport: "Flughafen Chios", harbor: "Hafen Chios", mesta: "Hafen Mesta", video: "Flughafen-Video" },
  it: { airport: "Aeroporto di Chios", harbor: "Porto di Chios", mesta: "Porto di Mesta", video: "Video aeroporto" },
  es: { airport: "Aeropuerto de Chios", harbor: "Puerto de Chios", mesta: "Puerto de Mesta", video: "Video aeropuerto" },
  tr: { airport: "Chios Havalimanı", harbor: "Chios Limanı", mesta: "Mesta Limanı", video: "Havalimanı videosu" },
};

function ExternalLink({
  href,
  children,
  dark = false,
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={
        dark
          ? "inline-flex min-h-[50px] items-center justify-center rounded-full bg-slate-950 px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
          : "inline-flex min-h-[50px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-slate-950"
      }
    >
      {children}
    </a>
  );
}

export function PreArrivalPage({ data }: PreArrivalPageProps) {
  const homeHref = homeLinks[data.locale] ?? homeLinks.en;
  const languageLabel = languageLabels[data.locale] ?? languageLabels.en;
  const homeLabel = homeLabels[data.locale] ?? homeLabels.en;
  const routes = routeNames[data.locale] ?? routeNames.en;

  return (
    <main className="min-h-screen bg-[#eef7f4] px-4 py-4 text-slate-950 md:px-6 md:py-6">
      <div className="mx-auto max-w-[980px]">
        <nav
          aria-label={languageLabel}
          className="mb-4 rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-slate-900/10"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
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

            <a
              href={homeHref}
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-center text-xs font-black uppercase tracking-[0.06em] !text-slate-950 hover:bg-slate-50"
            >
              ← {homeLabel}
            </a>
          </div>
        </nav>

        <header className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-7">
          <span className="inline-flex rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-teal-800">
            {data.hero.kicker}
          </span>

          <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
            {data.hero.title}
          </h1>

          <p className="mt-3 max-w-[780px] text-lg leading-8 text-slate-700">
            {data.hero.description}
          </p>
        </header>

        <section className="mt-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-6">
          <h2 className="text-2xl font-black tracking-[-0.03em]">{data.booking.title}</h2>
          <p className="mt-2 text-base leading-7 text-slate-700">{data.booking.description}</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-[18px] bg-slate-50 p-4 ring-1 ring-slate-900/5">
              <strong>{data.booking.guest}</strong>
              <br />
              {data.booking.missingGuest}
            </div>

            <div className="rounded-[18px] bg-slate-50 p-4 ring-1 ring-slate-900/5">
              <strong>{data.booking.room}</strong>
              <br />
              {data.booking.missingRoom}
            </div>

            <div className="rounded-[18px] bg-slate-50 p-4 ring-1 ring-slate-900/5">
              <strong>{data.booking.stay}</strong>
              <br />
              {data.booking.missingDates}
            </div>

            <div className="rounded-[18px] bg-slate-50 p-4 ring-1 ring-slate-900/5">
              <strong>{data.booking.price}</strong>
              <br />
              {data.booking.missingPrice}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-slate-950 p-5 text-white shadow-sm md:p-7">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.03em] md:text-3xl">
            {data.arrival.title}
          </h2>

          <p className="mt-3 max-w-[820px] text-base leading-7 text-white/75">
            {data.arrival.text}
          </p>

          <p className="mt-2 max-w-[820px] text-sm leading-6 text-white/60">
            {data.arrival.whatsappText}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <ExternalLink href={preArrivalContact.whatsappBase}>
              {data.help.whatsapp}
            </ExternalLink>

            <ExternalLink href={preArrivalContact.smsBase}>
              {data.help.sms}
            </ExternalLink>

            <ExternalLink href={`mailto:${preArrivalContact.email}`}>
              {data.help.email}
            </ExternalLink>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-6">
          <span className="inline-flex rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-teal-800">
            {data.directions.kicker}
          </span>

          <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950 md:text-3xl">
            {data.directions.title}
          </h2>

          <p className="mt-2 text-base leading-7 text-slate-700">{data.directions.text}</p>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <ExternalLink href={preArrivalDirectionsUrl} dark>
              {data.directions.openRoute}: {routes.airport}
            </ExternalLink>

            <ExternalLink href={preArrivalChiosHarborDirectionsUrl} dark>
              {data.directions.openRoute}: {routes.harbor}
            </ExternalLink>

            <ExternalLink href={preArrivalMestaDirectionsUrl} dark>
              {data.directions.openRoute}: {routes.mesta}
            </ExternalLink>

            <ExternalLink href={preArrivalAirportVideoUrl} dark>
              {routes.video}
            </ExternalLink>
          </div>

          <div className="mt-4 rounded-[18px] border border-yellow-300 bg-yellow-50 p-4 text-amber-950">
            <h3 className="font-black">{data.directions.importantTitle}</h3>
            <p className="mt-2 leading-7">{data.directions.importantText}</p>
          </div>

          <ol className="mt-4 grid gap-2.5">
            {data.directions.steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-[16px] bg-slate-50 p-3.5 ring-1 ring-slate-900/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                  {index + 1}
                </span>

                <span className="leading-7 text-slate-700">
                  <strong>{step.title}:</strong> {step.text}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-6">
          <h2 className="text-2xl font-black tracking-[-0.03em]">{data.checklist.title}</h2>

          <ul className="mt-4 grid gap-2.5">
            {data.checklist.items.map((item) => (
              <li
                key={item}
                className="rounded-[16px] bg-slate-50 p-3.5 leading-7 text-slate-700 ring-1 ring-slate-900/5"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-6">
          <h2 className="text-2xl font-black tracking-[-0.03em]">{data.help.title}</h2>
          <p className="mt-2 text-base leading-7 text-slate-700">{data.help.text}</p>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <ExternalLink href={preArrivalContact.phoneHref} dark>
              {data.help.call}: {preArrivalContact.phoneDisplay}
            </ExternalLink>

            <ExternalLink href={preArrivalContact.whatsappBase} dark>
              WhatsApp: {preArrivalContact.whatsappDisplay}
            </ExternalLink>

            <ExternalLink href={`mailto:${preArrivalContact.email}`}>
              {data.help.email}
            </ExternalLink>

            <ExternalLink href={preArrivalContact.smsBase}>
              {data.help.sms}: {preArrivalContact.smsDisplay}
            </ExternalLink>
          </div>
        </section>
      </div>
    </main>
  );
}

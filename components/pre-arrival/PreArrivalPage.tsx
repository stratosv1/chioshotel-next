"use client";

import type { PreArrivalPageData } from "@/content/pre-arrival";
import {
  preArrivalContact,
  preArrivalDirectionsUrl,
  preArrivalAirportVideoUrl,
  preArrivalChiosHarborDirectionsUrl,
  preArrivalMestaDirectionsUrl,
  preArrivalMapEmbedUrl,
} from "@/content/pre-arrival";

type PreArrivalPageProps = {
  data: PreArrivalPageData;
};

const routeButtonLabels = {
  en: {
    airport: "Route from Chios Airport",
    airportVideo: "Watch quick video directions from Chios Airport",
    harbor: "Route from Chios Harbor",
    mesta: "Route from Mesta Port",
  },
  el: {
    airport: "Διαδρομή από αεροδρόμιο Χίου",
    airportVideo: "Δείτε σύντομο video διαδρομής από το αεροδρόμιο",
    harbor: "Διαδρομή από λιμάνι Χίου",
    mesta: "Διαδρομή από λιμάνι Μεστών",
  },
  fr: {
    airport: "Itinéraire depuis l’aéroport de Chios",
    airportVideo: "Voir la vidéo rapide depuis l’aéroport",
    harbor: "Itinéraire depuis le port de Chios",
    mesta: "Itinéraire depuis le port de Mesta",
  },
  de: {
    airport: "Route vom Flughafen Chios",
    airportVideo: "Kurzes Video vom Flughafen ansehen",
    harbor: "Route vom Hafen Chios",
    mesta: "Route vom Hafen Mesta",
  },
  it: {
    airport: "Percorso dall’aeroporto di Chios",
    airportVideo: "Guarda il video rapido dall’aeroporto",
    harbor: "Percorso dal porto di Chios",
    mesta: "Percorso dal porto di Mesta",
  },
  es: {
    airport: "Ruta desde el aeropuerto de Chios",
    airportVideo: "Ver video rápido desde el aeropuerto",
    harbor: "Ruta desde el puerto de Chios",
    mesta: "Ruta desde el puerto de Mesta",
  },
  tr: {
    airport: "Chios Havalimanı rotası",
    airportVideo: "Havalimanından kısa rota videosunu izleyin",
    harbor: "Chios Limanı rotası",
    mesta: "Mesta Limanı’ndan rota",
  },
} as const;

const languageLinks = [
  { label: "English", href: "/pre-arrival/", locale: "en" },
  { label: "Ελληνικά", href: "/el/pre-arrival/", locale: "el" },
  { label: "Français", href: "/fr/pre-arrival/", locale: "fr" },
  { label: "Deutsch", href: "/de/pre-arrival/", locale: "de" },
  { label: "Italiano", href: "/it/pre-arrival/", locale: "it" },
  { label: "Español", href: "/es/pre-arrival/", locale: "es" },
  { label: "Türkçe", href: "/tr/pre-arrival/", locale: "tr" },
];

const arrivalHelpMessage = "Hello Voulamandis House, I need help with arrival directions.";

const communicationLinks = {
  whatsapp: `${preArrivalContact.whatsappBase}?text=${encodeURIComponent(arrivalHelpMessage)}`,
  sms: `${preArrivalContact.smsBase}?body=${encodeURIComponent(arrivalHelpMessage)}`,
  email: `mailto:${preArrivalContact.email}?subject=${encodeURIComponent(
    "Voulamandis House arrival directions",
  )}&body=${encodeURIComponent(arrivalHelpMessage)}`,
};

export function PreArrivalPage({ data }: PreArrivalPageProps) {
  const routeLabels = routeButtonLabels[data.locale] ?? routeButtonLabels.en;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef7f4] text-slate-950">
      <section className="px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-teal-800 shadow-sm">
              {data.hero.kicker}
            </span>

            <h1 className="mt-6 max-w-[14ch] text-[34px] font-black leading-[0.98] tracking-[-0.05em] md:text-[clamp(40px,4.4vw,58px)]">
              {data.hero.title}
            </h1>

            <p className="mt-6 max-w-[680px] text-lg leading-8 text-slate-700">
              {data.hero.description}
            </p>
          </div>

          <aside className="rounded-[34px] bg-white p-5 shadow-2xl ring-1 ring-slate-900/5 md:p-7">
            <div className="rounded-[28px] bg-slate-950 p-6 text-white">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-teal-200">
                Voulamandis House
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em]">
                {data.directions.title}
              </h2>
              <p className="mt-3 leading-7 text-white/75">
                {data.directions.text}
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              <a
                href={preArrivalDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-teal-800 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-teal-900"
              >
                {routeLabels.airport}
              </a>

              <a
                href={preArrivalAirportVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-red-700 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-red-800"
              >
                ▶ {routeLabels.airportVideo}
              </a>

              <a
                href={preArrivalChiosHarborDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-cyan-800 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-cyan-900"
              >
                {routeLabels.harbor}
              </a>

              <a
                href={preArrivalMestaDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-slate-950 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-slate-800"
              >
                {routeLabels.mesta}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
          <article>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-teal-800">
              {data.directions.kicker}
            </span>

            <h2 className="mt-4 text-3xl font-black leading-[1.02] tracking-[-0.05em] md:text-5xl">
              {data.directions.title}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              {data.directions.text}
            </p>

            <div className="mt-8 rounded-[24px] border border-yellow-300 bg-yellow-50 p-5 text-amber-950">
              <h3 className="text-2xl font-black">
                {data.directions.importantTitle}
              </h3>
              <p className="mt-3 leading-7">
                {data.directions.importantText}
              </p>
            </div>

            <div className="mt-8 grid gap-4">
              {data.directions.steps.map((step, index) => (
                <div
                  className="flex gap-4 rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-slate-900/5"
                  key={step.title}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-black">{step.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600">
                      {step.text}
                    </p>
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
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-teal-800 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-teal-900"
              >
                {routeLabels.airport}
              </a>

              <a
                href={preArrivalAirportVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-red-700 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-red-800"
              >
                ▶ {routeLabels.airportVideo}
              </a>

              <a
                href={preArrivalChiosHarborDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-cyan-800 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-cyan-900"
              >
                {routeLabels.harbor}
              </a>

              <a
                href={preArrivalMestaDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-slate-950 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-slate-800"
              >
                {routeLabels.mesta}
              </a>

              <a
                href={preArrivalContact.phoneHref}
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-slate-950 transition hover:bg-slate-50"
              >
                {data.directions.callUs}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto grid max-w-[1180px] gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[34px] bg-slate-950 p-7 text-white shadow-xl md:p-9">
            <h2 className="text-4xl font-black leading-none tracking-[-0.05em]">
              {data.help.title}
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/75">
              {data.help.text}
            </p>

            <div className="mt-8 grid gap-3">
              <a
                href={preArrivalContact.phoneHref}
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-white px-6 text-sm font-black uppercase tracking-[0.08em] !text-slate-950"
              >
                {data.help.call}: {preArrivalContact.phoneDisplay}
              </a>

              <a
                href={communicationLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/20 px-6 text-sm font-black uppercase tracking-[0.08em] !text-white"
              >
                {data.help.whatsapp}: {preArrivalContact.whatsappDisplay}
              </a>

              <a
                href={communicationLinks.email}
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/20 px-6 text-sm font-black uppercase tracking-[0.08em] !text-white"
              >
                {data.help.email}: {preArrivalContact.email}
              </a>

              <a
                href={communicationLinks.sms}
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/20 px-6 text-sm font-black uppercase tracking-[0.08em] !text-white"
              >
                {data.help.sms}: {preArrivalContact.smsDisplay}
              </a>
            </div>
          </article>

          <article className="rounded-[34px] bg-white p-7 shadow-xl ring-1 ring-slate-900/5 md:p-9">
            <h2 className="text-4xl font-black leading-none tracking-[-0.05em]">
              {data.checklist.title}
            </h2>

            <div className="mt-6 grid gap-3">
              {data.checklist.items.map((item) => (
                <div
                  className="flex gap-4 rounded-[22px] bg-teal-50 p-4 text-lg leading-7 text-slate-700"
                  key={item}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-black text-white">
                    ✓
                  </span>
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
              className={`rounded-full px-5 py-3 text-sm font-black transition ${
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
    </main>
  );
}

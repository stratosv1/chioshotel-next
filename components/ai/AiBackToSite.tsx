"use client";

import { useSearchParams } from "next/navigation";

const labels: Record<string, string> = {
  el: "Επιστροφή στο site",
  en: "Back to site",
  de: "Zurück zur Website",
  fr: "Retour au site",
  it: "Torna al sito",
  es: "Volver al sitio",
  tr: "Siteye dön",
};

export function AiBackToSite() {
  const searchParams = useSearchParams();
  const rawLanguage = searchParams.get("lang")?.toLowerCase().split("-")[0] || "en";
  const language = labels[rawLanguage] ? rawLanguage : "en";
  const href = language === "en" ? "/" : `/${language}/`;
  const label = labels[language];

  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className="fixed left-3 top-4 z-[70] grid h-11 w-11 place-items-center rounded-full border border-stone-300 bg-white text-stone-800 shadow-md transition hover:bg-stone-50 active:scale-[.96] sm:left-4 sm:h-12 sm:w-auto sm:grid-flow-col sm:gap-2 sm:px-4"
    >
      <span aria-hidden="true" className="text-xl leading-none">←</span>
      <span className="hidden text-sm font-semibold sm:inline">{label}</span>
    </a>
  );
}

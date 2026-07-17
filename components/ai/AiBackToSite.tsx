"use client";

import Link from "next/link";
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
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="fixed left-3 top-3 z-50 inline-flex h-10 items-center gap-2 rounded-full border border-stone-300 bg-white/95 px-3 text-sm font-semibold text-stone-700 shadow-md backdrop-blur transition hover:bg-white active:scale-[.98] sm:left-4 sm:top-3 sm:h-11 sm:px-4"
    >
      <span aria-hidden="true" className="text-lg leading-none">←</span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

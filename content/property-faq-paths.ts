import type { LanguageCode } from "@/lib/languages";

// Kept separate from content/property-faq so navigation code can link to the
// FAQ without bundling the FAQ content and knowledge seed.
export const propertyFaqPaths: Record<LanguageCode, string> = {
  en: "/frequently-asked-questions/",
  el: "/el/syxnes-erotiseis/",
  fr: "/fr/questions-frequentes/",
  de: "/de/haeufige-fragen/",
  it: "/it/domande-frequenti/",
  es: "/es/preguntas-frecuentes/",
  tr: "/tr/sik-sorulan-sorular/",
};

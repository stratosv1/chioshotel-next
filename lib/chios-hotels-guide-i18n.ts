import { absoluteUrl } from "@/lib/seo";

export type ChiosHotelsGuideLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

export const CHIOS_HOTELS_GUIDE_PATHS: Record<ChiosHotelsGuideLocale, string> = {
  en: "/chios-hotels/",
  el: "/el/xenodoxeia-xios/",
  fr: "/fr/hotels-chios/",
  de: "/de/hotels-auf-chios/",
  it: "/it/hotel-chios/",
  es: "/es/hoteles-chios/",
  tr: "/tr/sakiz-adasi-otelleri/",
};

export function chiosHotelsGuideLanguages() {
  return {
    en: absoluteUrl(CHIOS_HOTELS_GUIDE_PATHS.en),
    el: absoluteUrl(CHIOS_HOTELS_GUIDE_PATHS.el),
    fr: absoluteUrl(CHIOS_HOTELS_GUIDE_PATHS.fr),
    de: absoluteUrl(CHIOS_HOTELS_GUIDE_PATHS.de),
    it: absoluteUrl(CHIOS_HOTELS_GUIDE_PATHS.it),
    es: absoluteUrl(CHIOS_HOTELS_GUIDE_PATHS.es),
    tr: absoluteUrl(CHIOS_HOTELS_GUIDE_PATHS.tr),
    "x-default": absoluteUrl(CHIOS_HOTELS_GUIDE_PATHS.en),
  };
}

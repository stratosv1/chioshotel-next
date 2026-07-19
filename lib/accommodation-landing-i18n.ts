import { type LanguageCode, normalizePath } from "./languages";
import { CHIOS_HOTELS_GUIDE_PATHS } from "./chios-hotels-guide-i18n";
import { absoluteUrl } from "./seo";

export const ACCOMMODATION_LANDING_PATHS: Record<LanguageCode, string> = {
  en: "/chios-accommodation/",
  el: "/el/diamoni-sti-xio/",
  fr: "/fr/hebergement-chios/",
  de: "/de/chios-unterkunft/",
  it: "/it/alloggio-chios/",
  es: "/es/alojamiento-chios/",
  tr: "/tr/sakiz-adasi-konaklama/",
};

export function accommodationLandingLanguages() {
  return {
    en: absoluteUrl(ACCOMMODATION_LANDING_PATHS.en),
    el: absoluteUrl(ACCOMMODATION_LANDING_PATHS.el),
    fr: absoluteUrl(ACCOMMODATION_LANDING_PATHS.fr),
    de: absoluteUrl(ACCOMMODATION_LANDING_PATHS.de),
    it: absoluteUrl(ACCOMMODATION_LANDING_PATHS.it),
    es: absoluteUrl(ACCOMMODATION_LANDING_PATHS.es),
    tr: absoluteUrl(ACCOMMODATION_LANDING_PATHS.tr),
    "x-default": absoluteUrl(ACCOMMODATION_LANDING_PATHS.en),
  };
}

const PAGE_LANGUAGE_GROUPS: readonly Record<LanguageCode, string>[] = [
  ACCOMMODATION_LANDING_PATHS,
  CHIOS_HOTELS_GUIDE_PATHS,
];

export function getGroupedLanguagePath(
  pathname: string,
  language: LanguageCode,
): string | undefined {
  const normalizedPathname = normalizePath(pathname);
  const group = PAGE_LANGUAGE_GROUPS.find((paths) =>
    Object.values(paths).some(
      (path) => normalizePath(path) === normalizedPathname,
    ),
  );

  return group?.[language];
}

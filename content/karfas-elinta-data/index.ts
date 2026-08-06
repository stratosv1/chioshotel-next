import type { BeachDetailData } from "@/content/beach-details";
import type { LanguageCode } from "@/lib/languages";
import { karfasBeachEl, elintaBeachEl } from "./el";
import { karfasBeachEn, elintaBeachEn } from "./en";
import { karfasBeachFr, elintaBeachFr } from "./fr";
import { karfasBeachDe, elintaBeachDe } from "./de";
import { karfasBeachIt, elintaBeachIt } from "./it";
import { karfasBeachEs, elintaBeachEs } from "./es";
import { karfasBeachTr, elintaBeachTr } from "./tr";

export const karfasBeachByLanguage = {
  en: karfasBeachEn,
  el: karfasBeachEl,
  fr: karfasBeachFr,
  de: karfasBeachDe,
  it: karfasBeachIt,
  es: karfasBeachEs,
  tr: karfasBeachTr,
} satisfies Record<LanguageCode, BeachDetailData>;

export const elintaBeachByLanguage = {
  en: elintaBeachEn,
  el: elintaBeachEl,
  fr: elintaBeachFr,
  de: elintaBeachDe,
  it: elintaBeachIt,
  es: elintaBeachEs,
  tr: elintaBeachTr,
} satisfies Record<LanguageCode, BeachDetailData>;

export const karfasElintaBeachDetails: readonly BeachDetailData[] = [
  ...Object.values(karfasBeachByLanguage),
  ...Object.values(elintaBeachByLanguage),
];

export function getKarfasElintaBeachByPath(path: string) {
  return karfasElintaBeachDetails.find(
    (beach) => beach.seo.canonicalPath === path,
  );
}

export function getKarfasElintaBeachBySlug(slug: string) {
  return karfasElintaBeachDetails.find((beach) => beach.slug === slug);
}

import type { FamilyTravelPageContent } from "@/content/family-travel";
import { getFamilyTravelPageByLocale } from "@/content/family-travel";
import type { LanguageCode } from "@/lib/languages";

type FamilyTravelCopy = {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  apartmentHref: string;
  apartmentLabel: string;
};

const copy: Record<LanguageCode, FamilyTravelCopy> = {
  en: {
    seoTitle: "Family Holidays in Chios with Kids | Voulamandis House",
    seoDescription:
      "Plan family holidays in Chios with kids: beaches, museums, villages, easy activities and a peaceful base at Voulamandis House in Kambos.",
    heroTitle: "Family holidays in Chios with kids",
    apartmentHref: "/chios-rooms/family-chios-apartments/",
    apartmentLabel: "See family apartments",
  },
  el: {
    seoTitle: "Οικογενειακές Διακοπές στη Χίο με Παιδιά | Voulamandis House",
    seoDescription:
      "Οργανώστε οικογενειακές διακοπές στη Χίο με παιδιά: παραλίες, μουσεία, χωριά, εύκολες δραστηριότητες και ήρεμη βάση στο Voulamandis House στον Κάμπο.",
    heroTitle: "Οικογενειακές διακοπές στη Χίο με παιδιά",
    apartmentHref: "/el/domatia-xios/oikogeneiako-diamerisma/",
    apartmentLabel: "Δείτε οικογενειακά διαμερίσματα",
  },
  fr: {
    seoTitle: "Vacances en famille à Chios avec des enfants | Voulamandis House",
    seoDescription:
      "Préparez des vacances en famille à Chios avec des enfants : plages, musées, villages, activités faciles et séjour paisible à Kambos.",
    heroTitle: "Vacances en famille à Chios avec des enfants",
    apartmentHref: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
    apartmentLabel: "Voir les appartements familiaux",
  },
  de: {
    seoTitle: "Familienurlaub auf Chios mit Kindern | Voulamandis House",
    seoDescription:
      "Planen Sie Familienurlaub auf Chios mit Kindern: Strände, Museen, Dörfer, einfache Aktivitäten und eine ruhige Basis im Voulamandis House in Kambos.",
    heroTitle: "Familienurlaub auf Chios mit Kindern",
    apartmentHref: "/de/zimmer-chios/familienapartments-in-chios/",
    apartmentLabel: "Familienapartments ansehen",
  },
  it: {
    seoTitle: "Vacanze in famiglia a Chios con bambini | Voulamandis House",
    seoDescription:
      "Organizza vacanze in famiglia a Chios con bambini: spiagge, musei, villaggi, attività semplici e una base tranquilla a Kambos.",
    heroTitle: "Vacanze in famiglia a Chios con bambini",
    apartmentHref: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
    apartmentLabel: "Vedi gli appartamenti familiari",
  },
  es: {
    seoTitle: "Vacaciones en familia en Quíos con niños | Voulamandis House",
    seoDescription:
      "Organiza vacaciones en familia en Quíos con niños: playas, museos, pueblos, actividades sencillas y una base tranquila en Kambos.",
    heroTitle: "Vacaciones en familia en Quíos con niños",
    apartmentHref: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
    apartmentLabel: "Ver apartamentos familiares",
  },
  tr: {
    seoTitle: "Çocuklarla Sakız Adası Aile Tatili | Voulamandis House",
    seoDescription:
      "Çocuklarla Sakız Adası aile tatilinizi planlayın: plajlar, müzeler, köyler, kolay aktiviteler ve Kambos’ta sakin bir konaklama üssü.",
    heroTitle: "Çocuklarla Sakız Adası aile tatili",
    apartmentHref: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
    apartmentLabel: "Aile dairelerini görün",
  },
};

export function getFamilyTravelIntentData(
  locale: LanguageCode,
): FamilyTravelPageContent {
  const base = getFamilyTravelPageByLocale(locale);
  const text = copy[locale];

  return {
    ...base,
    seo: {
      ...base.seo,
      title: text.seoTitle,
      description: text.seoDescription,
    },
    hero: {
      ...base.hero,
      title: text.heroTitle,
      secondaryCta: {
        label: text.apartmentLabel,
        href: text.apartmentHref,
      },
    },
    stay: {
      ...base.stay,
      secondaryCta: {
        label: text.apartmentLabel,
        href: text.apartmentHref,
      },
    },
  };
}

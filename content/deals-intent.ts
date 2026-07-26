import {
  dealsPageDe,
  dealsPageEl,
  dealsPageEn,
  dealsPageEs,
  dealsPageFr,
  dealsPageIt,
  dealsPageTr,
  type DealsPageData,
} from "@/content/deals";
import type { LanguageCode } from "@/lib/languages";

const baseData: Record<LanguageCode, DealsPageData> = {
  en: dealsPageEn,
  el: dealsPageEl,
  fr: dealsPageFr,
  de: dealsPageDe,
  it: dealsPageIt,
  es: dealsPageEs,
  tr: dealsPageTr,
};

type DealsIntentCopy = {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  introKicker: string;
  introTitle: string;
  tagReplacements: Record<string, string | null>;
  imageAltReplacements: Array<[string, string]>;
};

const copy: Record<LanguageCode, DealsIntentCopy> = {
  en: {
    seoTitle: "Chios Accommodation Deals 2026 | Voulamandis House",
    seoDescription:
      "Discover accommodation deals in Chios, direct-booking offers and discount codes for rooms and family apartments at Voulamandis House in Kambos.",
    heroTitle: "Accommodation deals in Chios",
    heroDescription:
      "Discover direct-booking offers, stay packages and discount codes for your stay at Voulamandis House in Kambos.",
    introKicker: "Chios accommodation offers 2026",
    introTitle: "Direct-booking deals for your stay in Chios",
    tagReplacements: {},
    imageAltReplacements: [],
  },
  el: {
    seoTitle: "Προσφορές Διαμονής στη Χίο 2026 | Voulamandis House",
    seoDescription:
      "Ανακαλύψτε προσφορές διαμονής στη Χίο, πακέτα και εκπτωτικούς κωδικούς για απευθείας κράτηση στο Voulamandis House στον Κάμπο.",
    heroTitle: "Προσφορές διαμονής στη Χίο",
    heroDescription:
      "Δείτε ειδικές προσφορές, πακέτα διαμονής και εκπτωτικούς κωδικούς για απευθείας κράτηση στο Voulamandis House.",
    introKicker: "Προσφορές διαμονής στη Χίο 2026",
    introTitle: "Πακέτα και προσφορές για απευθείας διαμονή",
    tagReplacements: {
      "Δωμάτια Χίος": null,
    },
    imageAltReplacements: [["ξενοδοχείου", "διαμονής"], ["ξενοδοχείο", "κατάλυμα"]],
  },
  fr: {
    seoTitle: "Offres de séjour à Chios 2026 | Voulamandis House",
    seoDescription:
      "Découvrez des offres de séjour à Chios, des forfaits et des codes de réduction pour réserver directement chambres et appartements au Voulamandis House.",
    heroTitle: "Offres de séjour à Chios",
    heroDescription:
      "Découvrez des offres directes, des forfaits de séjour et des codes de réduction pour votre séjour au Voulamandis House à Kambos.",
    introKicker: "Offres de séjour à Chios 2026",
    introTitle: "Forfaits et offres pour réserver votre séjour en direct",
    tagReplacements: {
      "Hôtels Chios": "Séjour à Chios",
    },
    imageAltReplacements: [["Offre hôtel à Chios", "Offre de séjour à Chios"]],
  },
  de: {
    seoTitle: "Unterkunftsangebote auf Chios 2026 | Voulamandis House",
    seoDescription:
      "Entdecken Sie Unterkunftsangebote auf Chios, Direktbuchungsaktionen und Rabattcodes für Zimmer und Familienapartments im Voulamandis House in Kambos.",
    heroTitle: "Unterkunftsangebote auf Chios",
    heroDescription:
      "Entdecken Sie Direktbuchungsangebote, Aufenthaltspakete und Rabattcodes für Ihren Aufenthalt im Voulamandis House in Kambos.",
    introKicker: "Chios Unterkunftsangebote 2026",
    introTitle: "Direktbuchungsangebote für Ihren Aufenthalt auf Chios",
    tagReplacements: {},
    imageAltReplacements: [],
  },
  it: {
    seoTitle: "Offerte di soggiorno a Chios 2026 | Voulamandis House",
    seoDescription:
      "Scopri offerte di soggiorno a Chios, pacchetti e codici sconto per prenotare direttamente camere e appartamenti al Voulamandis House.",
    heroTitle: "Offerte di soggiorno a Chios",
    heroDescription:
      "Scopri offerte dirette, pacchetti soggiorno e codici sconto per il tuo soggiorno al Voulamandis House a Kambos.",
    introKicker: "Offerte di soggiorno a Chios 2026",
    introTitle: "Pacchetti e offerte per prenotare direttamente",
    tagReplacements: {
      "Hotel Chios": "Soggiorno Chios",
    },
    imageAltReplacements: [["Offerta hotel a Chios", "Offerta di soggiorno a Chios"]],
  },
  es: {
    seoTitle: "Ofertas de alojamiento en Quíos 2026 | Voulamandis House",
    seoDescription:
      "Descubre ofertas de alojamiento en Quíos, paquetes y códigos de descuento para reservar directamente habitaciones y apartamentos en Voulamandis House.",
    heroTitle: "Ofertas de alojamiento en Quíos",
    heroDescription:
      "Descubre ofertas directas, paquetes de estancia y códigos de descuento para alojarte en Voulamandis House, Kambos.",
    introKicker: "Ofertas de alojamiento en Quíos 2026",
    introTitle: "Paquetes y ofertas para reservar directamente",
    tagReplacements: {
      "Hoteles Chios": "Alojamiento Quíos",
    },
    imageAltReplacements: [["Oferta de hotel en Chios", "Oferta de alojamiento en Quíos"]],
  },
  tr: {
    seoTitle: "Sakız Adası Konaklama Fırsatları 2026 | Voulamandis House",
    seoDescription:
      "Sakız Adası konaklama fırsatlarını, paketleri ve Voulamandis House oda ve aile daireleri için direkt rezervasyon indirim kodlarını keşfedin.",
    heroTitle: "Sakız Adası konaklama fırsatları",
    heroDescription:
      "Kambos’taki Voulamandis House konaklamanız için direkt rezervasyon fırsatlarını, paketleri ve indirim kodlarını keşfedin.",
    introKicker: "Sakız Adası konaklama fırsatları 2026",
    introTitle: "Direkt konaklama paketleri ve fırsatları",
    tagReplacements: {
      "Sakız otelleri": "Sakız konaklama",
    },
    imageAltReplacements: [["Sakız Adası otel fırsatı", "Sakız Adası konaklama fırsatı"]],
  },
};

function replaceAll(value: string, replacements: Array<[string, string]>) {
  return replacements.reduce(
    (result, [from, to]) => result.split(from).join(to),
    value,
  );
}

export function getDealsIntentData(locale: LanguageCode): DealsPageData {
  const base = baseData[locale];
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
      description: text.heroDescription,
    },
    intro: {
      ...base.intro,
      kicker: text.introKicker,
      title: text.introTitle,
    },
    offers: base.offers.map((offer) => ({
      ...offer,
      imageAlt: replaceAll(offer.imageAlt, text.imageAltReplacements),
      tags: offer.tags.flatMap((tag) => {
        if (!(tag in text.tagReplacements)) return [tag];
        const replacement = text.tagReplacements[tag];
        return replacement ? [replacement] : [];
      }),
    })),
  };
}

import type { DealsPageData } from "@/content/deals";
import {
  absoluteUrl,
  getCanonicalUrl,
  getLanguageForPath,
  siteName,
  siteUrl,
} from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildHotelSchema,
  buildImageSchema,
  buildOrganizationSchema,
  buildSchemaGraph,
  buildWebsiteSchema,
  hotelId,
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

type DealsSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

const dealsLabelsByLanguage: Record<
  DealsSchemaLanguage,
  {
    accommodation: string;
    directGuests: string;
    couponCode: string;
    discountLabel: string;
    bookingTip: string;
    offerTags: string;
  }
> = {
  en: {
    accommodation: "Accommodation",
    directGuests: "Direct booking guests",
    couponCode: "Coupon code",
    discountLabel: "Discount label",
    bookingTip: "Booking tip",
    offerTags: "Offer tags",
  },
  el: {
    accommodation: "Διαμονή",
    directGuests: "Επισκέπτες απευθείας κράτησης",
    couponCode: "Κωδικός προσφοράς",
    discountLabel: "Περιγραφή έκπτωσης",
    bookingTip: "Συμβουλή κράτησης",
    offerTags: "Χαρακτηριστικά προσφοράς",
  },
  de: {
    accommodation: "Unterkunft",
    directGuests: "Direktbuchungsgäste",
    couponCode: "Gutscheincode",
    discountLabel: "Rabattbeschreibung",
    bookingTip: "Buchungstipp",
    offerTags: "Angebotsmerkmale",
  },
  fr: {
    accommodation: "Hébergement",
    directGuests: "Hôtes réservant en direct",
    couponCode: "Code promotionnel",
    discountLabel: "Description de la remise",
    bookingTip: "Conseil de réservation",
    offerTags: "Caractéristiques de l’offre",
  },
  it: {
    accommodation: "Alloggio",
    directGuests: "Ospiti con prenotazione diretta",
    couponCode: "Codice promozionale",
    discountLabel: "Descrizione dello sconto",
    bookingTip: "Consiglio di prenotazione",
    offerTags: "Caratteristiche dell’offerta",
  },
  es: {
    accommodation: "Alojamiento",
    directGuests: "Huéspedes con reserva directa",
    couponCode: "Código promocional",
    discountLabel: "Descripción del descuento",
    bookingTip: "Consejo de reserva",
    offerTags: "Características de la oferta",
  },
  tr: {
    accommodation: "Konaklama",
    directGuests: "Doğrudan rezervasyon misafirleri",
    couponCode: "İndirim kodu",
    discountLabel: "İndirim açıklaması",
    bookingTip: "Rezervasyon ipucu",
    offerTags: "Teklif özellikleri",
  },
};

function getDealsLabels(path: string) {
  const language = getLanguageForPath(path) as DealsSchemaLanguage;
  return dealsLabelsByLanguage[language] ?? dealsLabelsByLanguage.en;
}

function normalizeTelephone(phoneHref: string): string {
  const rawPhone = phoneHref.replace("tel:", "");
  const cleaned = rawPhone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  if (cleaned.startsWith("30")) {
    return `+${cleaned}`;
  }

  return cleaned;
}

function buildDealsCollectionPageSchema(data: DealsPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "CollectionPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: data.seo.title,
    headline: data.hero.title,
    description: data.seo.description,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: {
      "@id": hotelId(),
    },
    mainEntity: {
      "@id": schemaId(canonicalPath, "offer-catalog"),
    },
    primaryImageOfPage: {
      "@id": primaryImageId(canonicalPath),
    },
    breadcrumb: {
      "@id": schemaId(canonicalPath, "breadcrumb"),
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

function buildDealOfferSchema(
  data: DealsPageData,
  offer: DealsPageData["offers"][number],
): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);
  const labels = getDealsLabels(canonicalPath);

  return {
    "@type": "Offer",
    "@id": schemaId(canonicalPath, `offer-${offer.id}`),
    name: offer.title,
    description: offer.description,
    url: absoluteUrl(offer.bookingHref),
    category: labels.accommodation,
    inLanguage: language,
    availability: "https://schema.org/InStock",
    priceCurrency: "EUR",
    validThrough: data.countdown.targetIso,
    seller: {
      "@id": hotelId(),
    },
    itemOffered: {
      "@type": "Accommodation",
      "@id": schemaId(offer.roomPageHref, "room"),
      name: offer.title,
      url: absoluteUrl(offer.roomPageHref),
      image: absoluteUrl(offer.image),
      description: offer.description,
      inLanguage: language,
      containedInPlace: {
        "@id": hotelId(),
      },
    },
    image: absoluteUrl(offer.image),
    eligibleCustomerType: {
      "@type": "BusinessEntityType",
      name: labels.directGuests,
    },
    potentialAction: {
      "@type": "ReserveAction",
      name: offer.discountLabel,
      inLanguage: language,
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl(offer.bookingHref),
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "LodgingReservation",
        name: offer.title,
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: labels.couponCode,
        value: offer.couponCode,
      },
      {
        "@type": "PropertyValue",
        name: labels.discountLabel,
        value: offer.discountLabel,
      },
      {
        "@type": "PropertyValue",
        name: labels.bookingTip,
        value: offer.tip,
      },
      {
        "@type": "PropertyValue",
        name: labels.offerTags,
        value: offer.tags.join(", "),
      },
    ],
  };
}

function buildOfferCatalogSchema(data: DealsPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "OfferCatalog",
    "@id": schemaId(canonicalPath, "offer-catalog"),
    name: data.intro.title,
    description: data.intro.description,
    url: getCanonicalUrl(canonicalPath),
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.offers.length,
    itemListElement: data.offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: offer.title,
      url: absoluteUrl(offer.bookingHref),
      item: {
        "@id": schemaId(canonicalPath, `offer-${offer.id}`),
      },
    })),
  };
}

function buildDealsItemListSchema(data: DealsPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "offers-list"),
    name: data.intro.title,
    description: data.intro.description,
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.offers.length,
    itemListElement: data.offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: offer.title,
      description: offer.description,
      url: absoluteUrl(offer.bookingHref),
      image: absoluteUrl(offer.image),
    })),
  };
}

function buildDealsHotelSchema(data: DealsPageData): SchemaObject {
  return {
    ...buildHotelSchema({ path: data.seo.canonicalPath }),
    telephone: normalizeTelephone(data.hero.phoneHref),
    makesOffer: data.offers.map((offer) => ({
      "@id": schemaId(data.seo.canonicalPath, `offer-${offer.id}`),
    })),
  };
}

function buildDealsReservationActionSchema(data: DealsPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: data.hero.title,
    description: data.intro.description,
    inLanguage: getLanguageForPath(canonicalPath),
    target: data.offers.map((offer) => ({
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(offer.bookingHref),
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    })),
    object: {
      "@id": hotelId(),
    },
    result: {
      "@type": "LodgingReservation",
      name: data.seo.title,
    },
  };
}

export function buildDealsSchema(data: DealsPageData) {
  const canonicalPath = data.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildDealsHotelSchema(data),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage || data.hero.image,
        alt: data.hero.title,
        caption: `${data.hero.title} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildDealsCollectionPageSchema(data),
    buildOfferCatalogSchema(data),
    buildDealsItemListSchema(data),
    ...data.offers.map((offer) => buildDealOfferSchema(data, offer)),
    buildDealsReservationActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: data.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}

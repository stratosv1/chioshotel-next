import type { RatesPageData } from "@/content/rates";
import {
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

type RatesSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

const ratesLabelsByLanguage: Record<
  RatesSchemaLanguage,
  {
    accommodation: string;
    directGuests: string;
    discountCode: string;
    discountValue: string;
    bookingConditions: string;
  }
> = {
  en: {
    accommodation: "Accommodation",
    directGuests: "Direct booking guests",
    discountCode: "Discount code",
    discountValue: "Discount value",
    bookingConditions: "Booking conditions",
  },
  el: {
    accommodation: "Διαμονή",
    directGuests: "Επισκέπτες απευθείας κράτησης",
    discountCode: "Κωδικός έκπτωσης",
    discountValue: "Αξία έκπτωσης",
    bookingConditions: "Όροι κράτησης",
  },
  de: {
    accommodation: "Unterkunft",
    directGuests: "Direktbuchungsgäste",
    discountCode: "Rabattcode",
    discountValue: "Rabattwert",
    bookingConditions: "Buchungsbedingungen",
  },
  fr: {
    accommodation: "Hébergement",
    directGuests: "Hôtes réservant en direct",
    discountCode: "Code de réduction",
    discountValue: "Valeur de la réduction",
    bookingConditions: "Conditions de réservation",
  },
  it: {
    accommodation: "Alloggio",
    directGuests: "Ospiti con prenotazione diretta",
    discountCode: "Codice sconto",
    discountValue: "Valore dello sconto",
    bookingConditions: "Condizioni di prenotazione",
  },
  es: {
    accommodation: "Alojamiento",
    directGuests: "Huéspedes con reserva directa",
    discountCode: "Código de descuento",
    discountValue: "Valor del descuento",
    bookingConditions: "Condiciones de reserva",
  },
  tr: {
    accommodation: "Konaklama",
    directGuests: "Doğrudan rezervasyon misafirleri",
    discountCode: "İndirim kodu",
    discountValue: "İndirim değeri",
    bookingConditions: "Rezervasyon koşulları",
  },
};

function getRatesLabels(path: string) {
  const language = getLanguageForPath(path) as RatesSchemaLanguage;
  return ratesLabelsByLanguage[language] ?? ratesLabelsByLanguage.en;
}

function buildRatesWebPageSchema(data: RatesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "WebPage",
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
      "@id": schemaId(canonicalPath, "direct-booking-offer"),
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

function buildDirectBookingOfferSchema(data: RatesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);
  const labels = getRatesLabels(canonicalPath);

  return {
    "@type": "Offer",
    "@id": schemaId(canonicalPath, "direct-booking-offer"),
    name: data.discount.title,
    description: `${data.discount.text} ${data.discount.note}`,
    url: getCanonicalUrl(canonicalPath),
    category: labels.accommodation,
    inLanguage: language,
    availability: "https://schema.org/InStock",
    priceCurrency: "EUR",
    eligibleCustomerType: {
      "@type": "BusinessEntityType",
      name: labels.directGuests,
    },
    seller: {
      "@id": hotelId(),
    },
    itemOffered: {
      "@id": hotelId(),
    },
    potentialAction: {
      "@type": "ReserveAction",
      name: data.booking.title,
      inLanguage: language,
      target: {
        "@type": "EntryPoint",
        urlTemplate: data.booking.fallbackHref,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "LodgingReservation",
        name: data.booking.iframeTitle,
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: labels.discountCode,
        value: data.discount.code,
      },
      {
        "@type": "PropertyValue",
        name: labels.discountValue,
        value: data.discount.value,
      },
      {
        "@type": "PropertyValue",
        name: labels.bookingConditions,
        value: data.discount.note,
      },
    ],
  };
}

function buildDirectBookingBenefitsSchema(data: RatesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "direct-booking-benefits"),
    name: data.benefits.title,
    description: data.benefits.text,
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.benefits.items.length,
    itemListElement: data.benefits.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.text,
    })),
  };
}

function buildBookingActionSchema(data: RatesPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: data.booking.title,
    description: data.booking.text,
    inLanguage: getLanguageForPath(canonicalPath),
    target: {
      "@type": "EntryPoint",
      urlTemplate: data.booking.fallbackHref,
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    },
    object: {
      "@id": hotelId(),
    },
    result: {
      "@type": "LodgingReservation",
      name: data.booking.iframeTitle,
    },
  };
}

function buildRatesHotelSchema(data: RatesPageData): SchemaObject {
  return {
    ...buildHotelSchema({ path: data.seo.canonicalPath }),
    amenityFeature: data.benefits.items.map((item) => ({
      "@type": "LocationFeatureSpecification",
      name: item.title,
      value: true,
      description: item.text,
    })),
    makesOffer: {
      "@id": schemaId(data.seo.canonicalPath, "direct-booking-offer"),
    },
  };
}

export function buildRatesSchema(data: RatesPageData) {
  const canonicalPath = data.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildRatesHotelSchema(data),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage || data.hero.image,
        alt: data.hero.title,
        caption: `${data.hero.title} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildRatesWebPageSchema(data),
    buildDirectBookingOfferSchema(data),
    buildDirectBookingBenefitsSchema(data),
    buildBookingActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: data.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}

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

  return {
    "@type": "Offer",
    "@id": schemaId(canonicalPath, `offer-${offer.id}`),
    name: offer.title,
    description: offer.description,
    url: absoluteUrl(offer.bookingHref),
    category: "Accommodation",
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
      containedInPlace: {
        "@id": hotelId(),
      },
    },
    image: absoluteUrl(offer.image),
    eligibleCustomerType: {
      "@type": "BusinessEntityType",
      name: "Direct booking guests",
    },
    potentialAction: {
      "@type": "ReserveAction",
      name: `Book ${offer.title}`,
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
        name: `${offer.title} reservation`,
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Coupon code",
        value: offer.couponCode,
      },
      {
        "@type": "PropertyValue",
        name: "Discount label",
        value: offer.discountLabel,
      },
      {
        "@type": "PropertyValue",
        name: "Booking tip",
        value: offer.tip,
      },
      {
        "@type": "PropertyValue",
        name: "Offer tags",
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
    name: "Chios accommodation offers at Voulamandis House",
    description: data.intro.description,
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
    name: "Book a Chios accommodation offer",
    description: data.intro.description,
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
      name: "Voulamandis House reservation",
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
        name: "Chios Travel Deals",
        path: canonicalPath,
      },
    ]),
  ]);
}

import type { RatesPageData } from "@/content/rates";
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

  return {
    "@type": "Offer",
    "@id": schemaId(canonicalPath, "direct-booking-offer"),
    name: data.discount.title,
    description: `${data.discount.text} ${data.discount.note}`,
    url: getCanonicalUrl(canonicalPath),
    category: "Accommodation",
    availability: "https://schema.org/InStock",
    priceCurrency: "EUR",
    eligibleCustomerType: {
      "@type": "BusinessEntityType",
      name: "Direct booking guests",
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
        name: "Discount code",
        value: data.discount.code,
      },
      {
        "@type": "PropertyValue",
        name: "Discount value",
        value: data.discount.value,
      },
      {
        "@type": "PropertyValue",
        name: "Booking conditions",
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
        name: "Direct Booking",
        path: canonicalPath,
      },
    ]),
  ]);
}
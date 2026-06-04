import type { BeachDetailData } from "@/content/beach-details";
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

function buildBeachWebPageSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "WebPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: beach.seo.title,
    headline: beach.hero.title,
    description: beach.seo.description,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: [
      {
        "@id": schemaId(canonicalPath, "beach"),
      },
      {
        "@id": schemaId("/chios-island/", "destination"),
      },
      {
        "@id": hotelId(),
      },
    ],
    mainEntity: {
      "@id": schemaId(canonicalPath, "beach"),
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

function buildBeachPlaceSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;

  return {
    "@type": ["Beach", "TouristAttraction"],
    "@id": schemaId(canonicalPath, "beach"),
    name: beach.hero.title,
    alternateName: beach.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    url: getCanonicalUrl(canonicalPath),
    description: beach.hero.description,
    image: absoluteUrl(beach.hero.image || beach.seo.ogImage),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chios",
      addressRegion: "North Aegean",
      addressCountry: "GR",
    },
    touristType: beach.hero.tags,
    isPartOf: {
      "@id": schemaId("/chios-island/", "destination"),
    },
    subjectOf: {
      "@id": webPageId(canonicalPath),
    },
    hasMap: beach.media.map.gpsHref,
    additionalProperty: [
      ...beach.details.map((detail) => ({
        "@type": "PropertyValue",
        name: detail.title,
        value: detail.text,
      })),
      {
        "@type": "PropertyValue",
        name: "Distance from Voulamandis House",
        value: beach.media.map.distance,
      },
      {
        "@type": "PropertyValue",
        name: "Travel time from Voulamandis House",
        value: beach.media.map.time,
      },
      {
        "@type": "PropertyValue",
        name: "Tags",
        value: beach.hero.tags.join(", "),
      },
    ],
  };
}

function buildBeachVideoSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;

  return {
    "@type": "VideoObject",
    "@id": schemaId(canonicalPath, "video"),
    name: beach.media.video.title,
    description: beach.hero.description,
    thumbnailUrl: [absoluteUrl(beach.hero.image || beach.seo.ogImage)],
    uploadDate: "2026-01-01",
    embedUrl: beach.media.video.embedUrl,
    url: beach.media.video.embedUrl,
    creditText: beach.media.video.creditText,
    creator: {
      "@type": "Organization",
      name: beach.media.video.creditLabel,
      url: beach.media.video.creditHref,
    },
    about: {
      "@id": schemaId(canonicalPath, "beach"),
    },
    isPartOf: {
      "@id": webPageId(canonicalPath),
    },
  };
}

function buildBeachMapSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;

  return {
    "@type": "Map",
    "@id": schemaId(canonicalPath, "map"),
    name: beach.media.map.title,
    url: beach.media.map.gpsHref,
    mapType: "VenueMap",
    about: {
      "@id": schemaId(canonicalPath, "beach"),
    },
  };
}

function buildBeachDetailsItemListSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "beach-details"),
    name: `${beach.hero.title} travel details`,
    description: beach.hero.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: beach.details.length,
    itemListElement: beach.details.map((detail, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: detail.title,
      description: detail.text,
    })),
  };
}

function buildBeachLocalTipSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "local-tip"),
    name: beach.baseTip.title,
    text: beach.baseTip.text,
    url: absoluteUrl(beach.baseTip.href),
    about: [
      {
        "@id": schemaId(canonicalPath, "beach"),
      },
      {
        "@id": hotelId(),
      },
    ],
  };
}

function buildBeachStayActionSchema(beach: BeachDetailData): SchemaObject {
  const canonicalPath = beach.seo.canonicalPath;

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: beach.baseTip.linkLabel,
    description: beach.baseTip.text,
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(beach.baseTip.href),
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
      name: `${siteName} stay near Chios beaches`,
    },
  };
}

export function buildBeachDetailSchema(beach: BeachDetailData) {
  const canonicalPath = beach.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema(),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: beach.seo.ogImage || beach.hero.image,
        alt: beach.hero.title,
        caption: `${beach.hero.title} - Chios beach guide by ${siteName}`,
      },
      canonicalPath,
    ),
    buildBeachWebPageSchema(beach),
    buildBeachPlaceSchema(beach),
    buildBeachVideoSchema(beach),
    buildBeachMapSchema(beach),
    buildBeachDetailsItemListSchema(beach),
    buildBeachLocalTipSchema(beach),
    buildBeachStayActionSchema(beach),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: "Chios Island",
        path: "/chios-island/",
      },
      {
        name: "Chios Beaches",
        path: "/chios/chios-beaches/",
      },
      {
        name: beach.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}
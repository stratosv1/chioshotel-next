import type { MuseumDetailData } from "@/content/museum-details";
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
  getLocalizedSchemaAddress,
} from "@/lib/structured-data";

function buildMuseumWebPageSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "WebPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: museum.seo.title,
    headline: museum.hero.title,
    description: museum.seo.description,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: [
      {
        "@id": schemaId(canonicalPath, "museum"),
      },
      {
        "@id": schemaId("/chios-island/", "destination"),
      },
      {
        "@id": hotelId(),
      },
    ],
    mainEntity: {
      "@id": schemaId(canonicalPath, "museum"),
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

function buildMuseumPlaceSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": ["Museum", "TouristAttraction"],
    "@id": schemaId(canonicalPath, "museum"),
    name: museum.hero.title,
    alternateName: museum.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    url: getCanonicalUrl(canonicalPath),
    description: museum.hero.description || museum.seo.description,
    image: absoluteUrl(museum.hero.image || museum.seo.ogImage),
    address: {
      "@type": "PostalAddress",
      addressLocality: getLocalizedSchemaAddress(canonicalPath).addressLocality,
      addressRegion: getLocalizedSchemaAddress(canonicalPath).addressRegion,
      addressCountry: "GR",
    },
    touristType: museum.hero.tags,
    isAccessibleForFree: false,
    isPartOf: {
      "@id": schemaId("/chios-island/", "destination"),
    },
    subjectOf: {
      "@id": webPageId(canonicalPath),
    },
    additionalProperty: [
      ...museum.details.map((detail) => ({
        "@type": "PropertyValue",
        name: detail.title,
        value: detail.text,
      })),
      {
        "@type": "PropertyValue",
        name: "Museum tags",
        value: museum.hero.tags.join(", "),
      },
    ],
  };
}

function buildMuseumDetailsItemListSchema(
  museum: MuseumDetailData,
): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "museum-details"),
    name: `${museum.hero.title} details`,
    description: museum.hero.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: museum.details.length,
    itemListElement: museum.details.map((detail, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: detail.title,
      description: detail.text,
    })),
  };
}

function buildMuseumHighlightsSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "highlights"),
    name: museum.highlights.title,
    description: museum.highlights.items.join(" "),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: museum.highlights.items.length,
    itemListElement: museum.highlights.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item,
    })),
  };
}

function buildMuseumExperienceSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "experience"),
    name: museum.experience.title,
    text: museum.experience.paragraphs.join(" "),
    about: {
      "@id": schemaId(canonicalPath, "museum"),
    },
    isPartOf: {
      "@id": webPageId(canonicalPath),
    },
  };
}

function buildMuseumRouteIdeasSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "route-ideas"),
    name: museum.routeIdeas.title,
    description: museum.routeIdeas.items.map((item) => item.text).join(" "),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: museum.routeIdeas.items.length,
    itemListElement: museum.routeIdeas.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.text,
    })),
  };
}

function buildMuseumLocalTipSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "local-tip"),
    name: museum.baseTip.title,
    text: museum.baseTip.text,
    url: absoluteUrl(museum.baseTip.href),
    about: [
      {
        "@id": schemaId(canonicalPath, "museum"),
      },
      {
        "@id": hotelId(),
      },
    ],
  };
}

function buildMuseumStayActionSchema(museum: MuseumDetailData): SchemaObject {
  const canonicalPath = museum.seo.canonicalPath;

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: museum.baseTip.linkLabel,
    description: museum.baseTip.text,
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(museum.baseTip.href),
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
      name: `${siteName} stay for exploring Chios museums`,
    },
  };
}

export function buildMuseumDetailSchema(museum: MuseumDetailData) {
  const canonicalPath = museum.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: museum.seo.ogImage || museum.hero.image,
        alt: museum.hero.title,
        caption: `${museum.hero.title} - Chios museum guide by ${siteName}`,
      },
      canonicalPath,
    ),
    buildMuseumWebPageSchema(museum),
    buildMuseumPlaceSchema(museum),
    buildMuseumDetailsItemListSchema(museum),
    buildMuseumHighlightsSchema(museum),
    buildMuseumExperienceSchema(museum),
    buildMuseumRouteIdeasSchema(museum),
    buildMuseumLocalTipSchema(museum),
    buildMuseumStayActionSchema(museum),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: "Chios Island",
        path: "/chios-island/",
      },
      {
        name: "Chios Museums",
        path: "/chios/chios-museums/",
      },
      {
        name: museum.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}

import type { ChiosIslandPageData } from "@/content/chios-island";
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
  itemListId,
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

function buildChiosIslandWebPageSchema(data: ChiosIslandPageData): SchemaObject {
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
    about: [
      {
        "@id": schemaId(canonicalPath, "destination"),
      },
      {
        "@id": hotelId(),
      },
    ],
    mainEntity: {
      "@id": schemaId(canonicalPath, "destination"),
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

function buildChiosDestinationSchema(data: ChiosIslandPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "TouristDestination",
    "@id": schemaId(canonicalPath, "destination"),
    name: "Chios Island",
    alternateName: "Chios",
    url: getCanonicalUrl(canonicalPath),
    description: data.seo.description,
    image: absoluteUrl(data.seo.ogImage),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chios",
      addressRegion: "North Aegean",
      addressCountry: "GR",
    },
    touristType: [
      "Couples",
      "Families",
      "Cultural travelers",
      "Beach travelers",
      "Nature travelers",
      "Food travelers",
    ],
    includesAttraction: data.experiences.items.map((item) => ({
      "@id": schemaId(item.href, "place"),
    })),
    subjectOf: {
      "@id": webPageId(canonicalPath),
    },
  };
}

function buildExperiencePlaceSchema(
  item: ChiosIslandPageData["experiences"]["items"][number],
): SchemaObject {
  return {
    "@type": "TouristAttraction",
    "@id": schemaId(item.href, "place"),
    name: item.title,
    url: absoluteUrl(item.href),
    description: item.description,
    image: absoluteUrl(item.image),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chios",
      addressRegion: "North Aegean",
      addressCountry: "GR",
    },
    touristType: item.tags,
    isPartOf: {
      "@id": schemaId("/chios-island/", "destination"),
    },
  };
}

function buildChiosExperiencesItemListSchema(data: ChiosIslandPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: data.experiences.title,
    description: data.experiences.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.experiences.items.length,
    itemListElement: data.experiences.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.description,
      url: absoluteUrl(item.href),
      image: absoluteUrl(item.image),
      item: {
        "@id": schemaId(item.href, "place"),
      },
    })),
  };
}

function buildChiosIslandHighlightsSchema(data: ChiosIslandPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "highlights"),
    name: data.intro.title,
    description: data.intro.paragraphs.join(" "),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.intro.highlights.length,
    itemListElement: data.intro.highlights.map((highlight, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: highlight.label,
      description: highlight.value,
    })),
  };
}

function buildChiosStayActionSchema(data: ChiosIslandPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: data.stay.primaryCta.label,
    description: data.stay.text,
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(data.stay.primaryCta.href),
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
      name: `${siteName} stay in Chios`,
    },
  };
}

export function buildChiosIslandSchema(data: ChiosIslandPageData) {
  const canonicalPath = data.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema(),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage || data.hero.image,
        alt: data.hero.title,
        caption: `${data.hero.title} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildChiosIslandWebPageSchema(data),
    buildChiosDestinationSchema(data),
    buildChiosExperiencesItemListSchema(data),
    buildChiosIslandHighlightsSchema(data),
    ...data.experiences.items.map(buildExperiencePlaceSchema),
    buildChiosStayActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: "Chios Island",
        path: canonicalPath,
      },
    ]),
  ]);
}
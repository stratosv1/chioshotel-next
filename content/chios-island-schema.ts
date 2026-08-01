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
  getLocalizedSchemaAddress,
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
  const language = getLanguageForPath(canonicalPath);
  const address = getLocalizedSchemaAddress(canonicalPath);
  const touristTypes = Array.from(
    new Set(data.experiences.items.flatMap((item) => item.tags)),
  );

  return {
    "@type": "TouristDestination",
    "@id": schemaId(canonicalPath, "destination"),
    name: address.addressLocality,
    alternateName: data.hero.title,
    url: getCanonicalUrl(canonicalPath),
    description: data.seo.description,
    image: absoluteUrl(data.seo.ogImage),
    inLanguage: language,
    address: {
      "@type": "PostalAddress",
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      addressCountry: "GR",
    },
    touristType: touristTypes,
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
  parentPath: string,
): SchemaObject {
  const language = getLanguageForPath(item.href);
  const address = getLocalizedSchemaAddress(item.href);

  return {
    "@type": "TouristAttraction",
    "@id": schemaId(item.href, "place"),
    name: item.title,
    url: absoluteUrl(item.href),
    description: item.description,
    image: absoluteUrl(item.image),
    inLanguage: language,
    address: {
      "@type": "PostalAddress",
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      addressCountry: "GR",
    },
    touristType: item.tags,
    isPartOf: {
      "@id": schemaId(parentPath, "destination"),
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
    inLanguage: getLanguageForPath(canonicalPath),
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
    inLanguage: getLanguageForPath(canonicalPath),
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
    inLanguage: getLanguageForPath(canonicalPath),
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
      name: data.stay.title,
    },
  };
}

export function buildChiosIslandSchema(data: ChiosIslandPageData) {
  const canonicalPath = data.seo.canonicalPath;
  const address = getLocalizedSchemaAddress(canonicalPath);

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
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
    ...data.experiences.items.map((item) =>
      buildExperiencePlaceSchema(item, canonicalPath),
    ),
    buildChiosStayActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: address.addressLocality,
        path: canonicalPath,
      },
    ]),
  ]);
}

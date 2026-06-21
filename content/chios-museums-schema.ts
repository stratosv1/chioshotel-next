import type { ChiosMuseumsPageData } from "@/content/chios-museums";
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

function buildChiosMuseumsCollectionPageSchema(
  data: ChiosMuseumsPageData,
): SchemaObject {
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
    about: [
      {
        "@id": schemaId("/chios-island/", "destination"),
      },
      {
        "@id": hotelId(),
      },
    ],
    mainEntity: {
      "@id": itemListId(canonicalPath),
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

function buildMuseumPlaceSchema(
  museum: ChiosMuseumsPageData["museums"][number],
): SchemaObject {
  return {
    "@type": ["Museum", "TouristAttraction"],
    "@id": schemaId(museum.href, "museum"),
    name: museum.name,
    alternateName: museum.title,
    url: absoluteUrl(museum.href),
    description: museum.description,
    image: absoluteUrl(museum.image),
    address: {
      "@type": "PostalAddress",
      addressLocality: museum.region,
      addressRegion: "Chios",
      addressCountry: "GR",
    },
    touristType: museum.badges,
    isPartOf: {
      "@id": schemaId("/chios-island/", "destination"),
    },
    subjectOf: {
      "@id": webPageId(museum.href),
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Region",
        value: museum.region,
      },
      {
        "@type": "PropertyValue",
        name: "Theme",
        value: museum.mood,
      },
      {
        "@type": "PropertyValue",
        name: "Tags",
        value: museum.badges.join(", "),
      },
    ],
  };
}

function buildMuseumsItemListSchema(data: ChiosMuseumsPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: "Top Chios museums",
    description: data.intro.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.museums.length,
    itemListElement: data.museums.map((museum, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: museum.name,
      description: museum.description,
      url: absoluteUrl(museum.href),
      image: absoluteUrl(museum.image),
      item: {
        "@id": schemaId(museum.href, "museum"),
      },
    })),
  };
}

function buildMuseumPlanningSchema(data: ChiosMuseumsPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "museum-planning"),
    name: data.planning.title,
    description: data.planning.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.planning.items.length,
    itemListElement: data.planning.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.text,
    })),
  };
}

function buildMuseumGuideTipSchema(data: ChiosMuseumsPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "local-museum-tip"),
    name: data.intro.tip.title,
    text: data.intro.tip.text,
    url: absoluteUrl(data.intro.tip.href),
    about: [
      {
        "@id": itemListId(canonicalPath),
      },
      {
        "@id": hotelId(),
      },
    ],
  };
}

function buildMuseumStayActionSchema(data: ChiosMuseumsPageData): SchemaObject {
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
      name: `${siteName} stay for exploring Chios museums`,
    },
  };
}

export function buildChiosMuseumsSchema(data: ChiosMuseumsPageData) {
  const canonicalPath = data.seo.canonicalPath;

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
    buildChiosMuseumsCollectionPageSchema(data),
    buildMuseumsItemListSchema(data),
    buildMuseumPlanningSchema(data),
    buildMuseumGuideTipSchema(data),
    ...data.museums.map(buildMuseumPlaceSchema),
    buildMuseumStayActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: "Chios Island",
        path: "/chios-island/",
      },
      {
        name: "Chios Museums",
        path: canonicalPath,
      },
    ]),
  ]);
}
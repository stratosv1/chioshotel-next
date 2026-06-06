import type { ChiosActivitiesPageData } from "@/content/chios-activities";
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

function getActivityType(data: ChiosActivitiesPageData): string[] {
  if (data.key === "hub") {
    return ["CollectionPage"];
  }

  return ["WebPage"];
}

function buildActivitiesWebPageSchema(data: ChiosActivitiesPageData): SchemaObject {
  const canonicalPath = data.path;
  const language = getLanguageForPath(canonicalPath);
  const isHub = data.key === "hub";

  return {
    "@type": isHub ? "CollectionPage" : "WebPage",
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
      "@id": isHub
        ? itemListId(canonicalPath)
        : schemaId(canonicalPath, "activity"),
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

function buildActivityCardSchema(
  card: NonNullable<ChiosActivitiesPageData["cards"]>[number],
): SchemaObject {
  return {
    "@type": ["TouristAttraction", "CreativeWork"],
    "@id": schemaId(card.href, "activity"),
    name: card.title,
    url: absoluteUrl(card.href),
    description: card.description,
    image: absoluteUrl(card.image),
    isPartOf: {
      "@id": schemaId("/chios-island/", "destination"),
    },
    subjectOf: {
      "@id": webPageId(card.href),
    },
  };
}

function buildActivitiesItemListSchema(data: ChiosActivitiesPageData): SchemaObject | null {
  const canonicalPath = data.path;

  if (!data.cards?.length) {
    return null;
  }

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: data.hero.title,
    description: data.hero.subtitle,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.cards.length,
    itemListElement: data.cards.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: card.title,
      description: card.description,
      url: absoluteUrl(card.href),
      image: absoluteUrl(card.image),
      item: {
        "@id": schemaId(card.href, "activity"),
      },
    })),
  };
}

function buildSingleActivitySchema(data: ChiosActivitiesPageData): SchemaObject | null {
  const canonicalPath = data.path;

  if (data.key === "hub") {
    return null;
  }

  const sectionText = data.sections
    ?.flatMap((section) => section.text)
    .join(" ");

  return {
    "@type": ["TouristAttraction", "CreativeWork"],
    "@id": schemaId(canonicalPath, "activity"),
    name: data.hero.title,
    alternateName: data.hero.eyebrow,
    url: getCanonicalUrl(canonicalPath),
    description: data.hero.subtitle || data.seo.description,
    image: data.hero.image ? absoluteUrl(data.hero.image) : undefined,
    text: sectionText,
    isPartOf: {
      "@id": schemaId("/chios-island/", "destination"),
    },
    subjectOf: {
      "@id": webPageId(canonicalPath),
    },
    provider: {
      "@id": hotelId(),
    },
    touristType: [
      "Cultural travelers",
      "Nature travelers",
      "Couples",
      "Families",
      "Slow travel guests",
    ],
  };
}

function buildActivitySectionsSchema(data: ChiosActivitiesPageData): SchemaObject | null {
  const canonicalPath = data.path;

  if (!data.sections?.length) {
    return null;
  }

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "activity-sections"),
    name: `${data.hero.title} guide sections`,
    description: data.seo.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.sections.length,
    itemListElement: data.sections.map((section, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: section.title,
      description: section.text.join(" "),
    })),
  };
}

function buildActivityGallerySchema(data: ChiosActivitiesPageData): SchemaObject | null {
  const canonicalPath = data.path;

  if (!data.gallery?.length) {
    return null;
  }

  return {
    "@type": "ImageGallery",
    "@id": schemaId(canonicalPath, "gallery"),
    name: `${data.hero.title} gallery`,
    associatedMedia: data.gallery.map((image) => ({
      "@type": "ImageObject",
      url: absoluteUrl(image.src),
      contentUrl: absoluteUrl(image.src),
      caption: image.alt,
    })),
    about: {
      "@id": schemaId(canonicalPath, "activity"),
    },
  };
}

function buildActivityCtaActionSchema(data: ChiosActivitiesPageData): SchemaObject {
  const canonicalPath = data.path;
  const isExternal = data.cta.primaryHref.startsWith("http");

  return {
    "@type": isExternal ? "ViewAction" : "ReserveAction",
    "@id": schemaId(canonicalPath, "cta-action"),
    name: data.cta.primaryLabel,
    description: data.cta.text,
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(data.cta.primaryHref),
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    },
    object: isExternal
      ? {
          "@id": schemaId(canonicalPath, "activity"),
        }
      : {
          "@id": hotelId(),
        },
    result: isExternal
      ? undefined
      : {
          "@type": "LodgingReservation",
          name: `${siteName} stay in Chios`,
        },
  };
}

function buildActivityStayActionSchema(data: ChiosActivitiesPageData): SchemaObject | null {
  const canonicalPath = data.path;

  if (!data.cta.secondaryHref || !data.cta.secondaryLabel) {
    return null;
  }

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "stay-action"),
    name: data.cta.secondaryLabel,
    description: data.cta.text,
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(data.cta.secondaryHref),
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
      name: `${siteName} direct booking request`,
    },
  };
}

function buildActivityBreadcrumbs(data: ChiosActivitiesPageData) {
  const canonicalPath = data.path;

  if (data.key === "hub") {
    return buildBreadcrumbSchema(canonicalPath, [
      {
        name: "Chios Activities",
        path: canonicalPath,
      },
    ]);
  }

  return buildBreadcrumbSchema(canonicalPath, [
    {
      name: "Chios Island",
      path: "/chios-island/",
    },
    {
      name: "Chios Activities",
      path: "/chios-activities/",
    },
    {
      name: data.hero.title,
      path: canonicalPath,
    },
  ]);
}

export function buildChiosActivitiesSchema(data: ChiosActivitiesPageData) {
  const canonicalPath = data.path;
  const hubItemList = buildActivitiesItemListSchema(data);

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema(),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.hero.image || "/images/voulamandis-house-og.jpg",
        alt: data.hero.imageAlt || data.hero.title,
        caption: `${data.hero.title} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildActivitiesWebPageSchema(data),
    hubItemList,
    ...(data.cards?.map(buildActivityCardSchema) || []),
    buildSingleActivitySchema(data),
    buildActivitySectionsSchema(data),
    buildActivityGallerySchema(data),
    buildActivityCtaActionSchema(data),
    buildActivityStayActionSchema(data),
    buildActivityBreadcrumbs(data),
  ]);
}


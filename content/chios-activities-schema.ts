import {
  chiosActivitiesPaths,
  type ChiosActivitiesPageData,
} from "@/content/chios-activities";
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

const chiosIslandPaths: Record<ChiosActivitiesPageData["locale"], string> = {
  en: "/chios-island/",
  el: "/el/ti-na-do-sti-xio/",
  fr: "/fr/chios-en-grece/",
  de: "/de/chios-insel/",
  it: "/it/isola-di-chios/",
  es: "/es/isla-de-quios/",
  tr: "/tr/sakiz-adasi/",
};

const activitiesBreadcrumbNames: Record<
  ChiosActivitiesPageData["locale"],
  string
> = {
  en: "Chios Activities",
  el: "Δραστηριότητες στη Χίο",
  fr: "Activités à Chios",
  de: "Aktivitäten auf Chios",
  it: "Attività a Chios",
  es: "Actividades en Quíos",
  tr: "Sakız Adası Aktiviteleri",
};

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
        "@id": schemaId(chiosIslandPaths[data.locale], "destination"),
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
  collectionPath: string,
): SchemaObject {
  return {
    "@type": ["TouristAttraction", "CreativeWork"],
    "@id": schemaId(card.href, "activity"),
    name: card.title,
    url: absoluteUrl(card.href),
    description: card.description,
    image: absoluteUrl(card.image),
    inLanguage: getLanguageForPath(card.href),
    isPartOf: {
      "@id": webPageId(collectionPath),
    },
    subjectOf: {
      "@id": webPageId(card.href),
    },
  };
}

function buildActivitiesItemListSchema(
  data: ChiosActivitiesPageData,
): SchemaObject | null {
  const canonicalPath = data.path;

  if (!data.cards?.length) {
    return null;
  }

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: data.hero.title,
    description: data.hero.subtitle,
    inLanguage: getLanguageForPath(canonicalPath),
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

function buildSingleActivitySchema(
  data: ChiosActivitiesPageData,
): SchemaObject | null {
  const canonicalPath = data.path;

  if (data.key === "hub") {
    return null;
  }

  const sectionText = data.sections
    ?.flatMap((section) => section.text)
    .join(" ");
  const touristType = Array.from(
    new Set([
      data.hero.eyebrow,
      ...(data.sections?.map((section) => section.title) ?? []),
    ]),
  );

  return {
    "@type": ["TouristAttraction", "CreativeWork"],
    "@id": schemaId(canonicalPath, "activity"),
    name: data.hero.title,
    alternateName: data.hero.eyebrow,
    url: getCanonicalUrl(canonicalPath),
    description: data.hero.subtitle || data.seo.description,
    image: data.hero.image ? absoluteUrl(data.hero.image) : undefined,
    text: sectionText,
    inLanguage: getLanguageForPath(canonicalPath),
    isPartOf: {
      "@id": webPageId(chiosActivitiesPaths[data.locale]),
    },
    subjectOf: {
      "@id": webPageId(canonicalPath),
    },
    provider: {
      "@id": hotelId(),
    },
    touristType,
  };
}

function buildGreekCourseSchema(
  data: ChiosActivitiesPageData,
): SchemaObject | null {
  const canonicalPath = data.path;

  if (data.key !== "greekCourses") {
    return null;
  }

  const language = getLanguageForPath(canonicalPath);
  const sectionText = data.sections
    ?.flatMap((section) => section.text)
    .join(" ");

  return {
    "@type": "Course",
    "@id": schemaId(canonicalPath, "course"),
    name: data.hero.title,
    alternateName: data.hero.eyebrow,
    url: getCanonicalUrl(canonicalPath),
    description: data.hero.subtitle || data.seo.description,
    inLanguage: language,
    image: data.hero.image ? absoluteUrl(data.hero.image) : undefined,
    text: sectionText,
    provider: {
      "@type": "Organization",
      name: "Alexandria Institute",
      url: "https://alexandria-institute.com",
    },
    about: [
      {
        "@id": schemaId(chiosIslandPaths[data.locale], "destination"),
      },
      {
        "@id": schemaId(canonicalPath, "activity"),
      },
    ],
    teaches: data.sections?.[0]?.title || data.hero.title,
    subjectOf: {
      "@id": webPageId(canonicalPath),
    },
  };
}

function buildActivitySectionsSchema(
  data: ChiosActivitiesPageData,
): SchemaObject | null {
  const canonicalPath = data.path;

  if (!data.sections?.length) {
    return null;
  }

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "activity-sections"),
    name: data.intro?.title || data.hero.title,
    description: data.seo.description,
    inLanguage: getLanguageForPath(canonicalPath),
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

function buildActivityGallerySchema(
  data: ChiosActivitiesPageData,
): SchemaObject | null {
  const canonicalPath = data.path;

  if (!data.gallery?.length) {
    return null;
  }

  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "ImageGallery",
    "@id": schemaId(canonicalPath, "gallery"),
    name: data.hero.title,
    inLanguage: language,
    associatedMedia: data.gallery.map((image) => ({
      "@type": "ImageObject",
      url: absoluteUrl(image.src),
      contentUrl: absoluteUrl(image.src),
      caption: image.alt,
      inLanguage: language,
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
    inLanguage: getLanguageForPath(canonicalPath),
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
          name: data.cta.title,
        },
  };
}

function buildActivityStayActionSchema(
  data: ChiosActivitiesPageData,
): SchemaObject | null {
  const canonicalPath = data.path;

  if (!data.cta.secondaryHref || !data.cta.secondaryLabel) {
    return null;
  }

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "stay-action"),
    name: data.cta.secondaryLabel,
    description: data.cta.text,
    inLanguage: getLanguageForPath(canonicalPath),
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
      name: data.cta.title,
    },
  };
}

function buildActivityBreadcrumbs(data: ChiosActivitiesPageData) {
  const canonicalPath = data.path;
  const activitiesName = activitiesBreadcrumbNames[data.locale];

  if (data.key === "hub") {
    return buildBreadcrumbSchema(canonicalPath, [
      {
        name: activitiesName,
        path: canonicalPath,
      },
    ]);
  }

  return buildBreadcrumbSchema(canonicalPath, [
    {
      name: activitiesName,
      path: chiosActivitiesPaths[data.locale],
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
    buildHotelSchema({ path: canonicalPath }),
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
    ...(data.cards?.map((card) =>
      buildActivityCardSchema(card, canonicalPath),
    ) || []),
    buildSingleActivitySchema(data),
    buildGreekCourseSchema(data),
    buildActivitySectionsSchema(data),
    buildActivityGallerySchema(data),
    buildActivityCtaActionSchema(data),
    buildActivityStayActionSchema(data),
    buildActivityBreadcrumbs(data),
  ]);
}

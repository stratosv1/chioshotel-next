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
  getLocalizedSchemaLabels,
  hotelId,
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

type ImageLike =
  | string
  | {
      src: string;
      alt?: string;
    };

type LandingCard = {
  title?: string;
  name?: string;
  text?: string;
  description?: string;
  image?: ImageLike;
  href?: string;
  tag?: string;
};

type LandingCta = string | { label: string; href: string };

type LandingPageSchemaData = {
  path?: string;
  seo: {
    canonicalPath?: string;
    title: string;
    description: string;
    ogImage?: string;
    image?: string;
  };
  hero: {
    title: string;
    eyebrow?: string;
    subtitle?: string;
    description?: string;
    image?: ImageLike;
    primaryCta?: LandingCta;
    secondaryCta?: LandingCta;
  };
  intro?: {
    title?: string;
    text?: string | string[];
  };
  highlights?: {
    title?: string;
    subtitle?: string;
    cards?: LandingCard[];
    items?: Array<string | LandingCard>;
  };
  beaches?: LandingCard[];
  experiences?: {
    title?: string;
    subtitle?: string;
    text?: string;
    cards?: LandingCard[];
    items?: LandingCard[];
  };
  itinerary?: {
    title?: string;
    items?: LandingCard[];
  };
  stay?: {
    title?: string;
    text?: string;
    image?: ImageLike;
    cta?: string;
    primaryCta?: {
      label: string;
      href: string;
    };
    secondaryCta?: {
      label: string;
      href: string;
    };
  };
  finalCta?: {
    title?: string;
    text?: string;
    button?: string;
    primaryCta?: LandingCta;
    secondaryCta?: LandingCta;
  };
  links?: {
    booking?: string;
    rooms?: string;
    chiosGuide?: string;
    beaches?: string;
  };
};

const chiosIslandPathByLanguage: Record<string, string> = {
  en: "/chios-island/",
  el: "/el/ti-na-do-sti-xio/",
  fr: "/fr/chios-en-grece/",
  de: "/de/chios-insel/",
  it: "/it/isola-di-chios/",
  es: "/es/isla-de-quios/",
  tr: "/tr/sakiz-adasi/",
};

function getCanonicalPath(data: LandingPageSchemaData): string {
  return data.seo.canonicalPath || data.path || "/";
}

function getImageUrl(image?: ImageLike): string | undefined {
  if (!image) {
    return undefined;
  }

  if (typeof image === "string") {
    return image;
  }

  return image.src;
}

function getImageAlt(image: ImageLike | undefined, fallback: string): string {
  if (!image || typeof image === "string") {
    return fallback;
  }

  return image.alt || fallback;
}

function getPrimaryImage(data: LandingPageSchemaData): string {
  return (
    data.seo.ogImage ||
    data.seo.image ||
    getImageUrl(data.hero.image) ||
    "/images/voulamandis-house-og.jpg"
  );
}

function textToString(value?: string | string[]): string | undefined {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value.join(" ") : value;
}

function getCtaLabel(cta?: LandingCta): string | undefined {
  if (!cta) {
    return undefined;
  }

  return typeof cta === "string" ? cta : cta.label;
}

function getCardTitle(card: LandingCard, fallback: string): string {
  return card.title || card.name || fallback;
}

function getCardDescription(card: LandingCard): string | undefined {
  return card.description || card.text;
}

function getCardImage(card: LandingCard): string | undefined {
  return getImageUrl(card.image);
}

function getLandingCards(data: LandingPageSchemaData): LandingCard[] {
  const cards: LandingCard[] = [];

  if (data.beaches?.length) {
    cards.push(...data.beaches);
  }

  if (data.highlights?.cards?.length) {
    cards.push(...data.highlights.cards);
  }

  if (data.experiences?.cards?.length) {
    cards.push(...data.experiences.cards);
  }

  if (data.experiences?.items?.length) {
    cards.push(...data.experiences.items);
  }

  if (data.itinerary?.items?.length) {
    cards.push(...data.itinerary.items);
  }

  return cards;
}

function getChiosIslandPath(canonicalPath: string): string {
  const language = getLanguageForPath(canonicalPath);
  return chiosIslandPathByLanguage[language] || chiosIslandPathByLanguage.en;
}

function buildLandingWebPageSchema(data: LandingPageSchemaData): SchemaObject {
  const canonicalPath = getCanonicalPath(data);
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
        "@id": schemaId(canonicalPath, "travel-theme"),
      },
      {
        "@id": schemaId(getChiosIslandPath(canonicalPath), "destination"),
      },
      {
        "@id": hotelId(),
      },
    ],
    mainEntity: {
      "@id": schemaId(canonicalPath, "travel-theme"),
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

function buildTravelThemeSchema(data: LandingPageSchemaData): SchemaObject {
  const canonicalPath = getCanonicalPath(data);
  const image = getPrimaryImage(data);
  const language = getLanguageForPath(canonicalPath);
  const labels = getLocalizedSchemaLabels(canonicalPath);

  return {
    "@type": ["CreativeWork", "TouristTrip"],
    "@id": schemaId(canonicalPath, "travel-theme"),
    name: data.hero.title,
    alternateName: data.hero.eyebrow,
    url: getCanonicalUrl(canonicalPath),
    description:
      data.hero.subtitle ||
      data.hero.description ||
      data.seo.description,
    image: absoluteUrl(image),
    inLanguage: language,
    about: {
      "@id": schemaId(getChiosIslandPath(canonicalPath), "destination"),
    },
    provider: {
      "@id": hotelId(),
    },
    touristType: labels.touristTypes,
    subjectOf: {
      "@id": webPageId(canonicalPath),
    },
  };
}

function buildLandingContentItemListSchema(
  data: LandingPageSchemaData,
): SchemaObject | null {
  const canonicalPath = getCanonicalPath(data);
  const language = getLanguageForPath(canonicalPath);
  const cards = getLandingCards(data);

  if (!cards.length) {
    return null;
  }

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "landing-content"),
    name: data.highlights?.title || data.experiences?.title || data.hero.title,
    description:
      data.highlights?.subtitle ||
      data.experiences?.subtitle ||
      data.seo.description,
    inLanguage: language,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: cards.length,
    itemListElement: cards.map((card, index) => {
      const title = getCardTitle(card, data.hero.title);
      const description = getCardDescription(card);
      const image = getCardImage(card);

      return {
        "@type": "ListItem",
        position: index + 1,
        name: title,
        description,
        url: card.href ? absoluteUrl(card.href) : undefined,
        image: image ? absoluteUrl(image) : undefined,
        item: {
          "@type": ["CreativeWork", "TouristAttraction"],
          "@id": schemaId(
            card.href || `${canonicalPath}#item-${index + 1}`,
            "landing-item",
          ),
          name: title,
          description,
          image: image ? absoluteUrl(image) : undefined,
          url: card.href ? absoluteUrl(card.href) : undefined,
          inLanguage: card.href
            ? getLanguageForPath(card.href)
            : language,
          isPartOf: {
            "@id": schemaId(canonicalPath, "travel-theme"),
          },
        },
      };
    }),
  };
}

function buildIntroSchema(data: LandingPageSchemaData): SchemaObject | null {
  const canonicalPath = getCanonicalPath(data);

  if (!data.intro?.title && !data.intro?.text) {
    return null;
  }

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "intro"),
    name: data.intro.title || data.hero.title,
    text: textToString(data.intro.text),
    inLanguage: getLanguageForPath(canonicalPath),
    about: {
      "@id": schemaId(canonicalPath, "travel-theme"),
    },
    isPartOf: {
      "@id": webPageId(canonicalPath),
    },
  };
}

function buildStaySchema(data: LandingPageSchemaData): SchemaObject | null {
  const canonicalPath = getCanonicalPath(data);

  if (!data.stay?.title && !data.stay?.text) {
    return null;
  }

  const image = getImageUrl(data.stay.image);

  return {
    "@type": "CreativeWork",
    "@id": schemaId(canonicalPath, "stay-section"),
    name: data.stay.title || data.hero.title,
    text: data.stay.text,
    image: image ? absoluteUrl(image) : undefined,
    inLanguage: getLanguageForPath(canonicalPath),
    about: {
      "@id": hotelId(),
    },
    isPartOf: {
      "@id": webPageId(canonicalPath),
    },
  };
}

function buildBookingActionSchema(
  data: LandingPageSchemaData,
): SchemaObject | null {
  const canonicalPath = getCanonicalPath(data);

  const bookingHref =
    data.stay?.primaryCta?.href ||
    data.links?.booking ||
    data.links?.rooms ||
    undefined;

  const bookingLabel =
    data.stay?.primaryCta?.label ||
    data.finalCta?.button ||
    getCtaLabel(data.hero.primaryCta) ||
    data.hero.title;

  if (!bookingHref) {
    return null;
  }

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: bookingLabel,
    description:
      data.finalCta?.text ||
      data.stay?.text ||
      data.seo.description,
    inLanguage: getLanguageForPath(canonicalPath),
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(bookingHref),
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
      name: data.finalCta?.title || data.stay?.title || data.hero.title,
    },
  };
}

function buildSecondaryViewActionSchema(
  data: LandingPageSchemaData,
): SchemaObject | null {
  const canonicalPath = getCanonicalPath(data);

  const href =
    data.stay?.secondaryCta?.href ||
    data.links?.chiosGuide ||
    data.links?.beaches ||
    undefined;

  const label =
    data.stay?.secondaryCta?.label ||
    getCtaLabel(data.hero.secondaryCta) ||
    data.hero.title;

  if (!href) {
    return null;
  }

  return {
    "@type": "ViewAction",
    "@id": schemaId(canonicalPath, "view-action"),
    name: label,
    inLanguage: getLanguageForPath(canonicalPath),
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl(href),
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    },
    object: {
      "@id": schemaId(canonicalPath, "travel-theme"),
    },
  };
}

export function buildLandingPageSchema(data: LandingPageSchemaData) {
  const canonicalPath = getCanonicalPath(data);
  const image = getPrimaryImage(data);

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: image,
        alt: getImageAlt(data.hero.image, data.hero.title),
        caption: `${data.hero.title} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildLandingWebPageSchema(data),
    buildTravelThemeSchema(data),
    buildIntroSchema(data),
    buildLandingContentItemListSchema(data),
    buildStaySchema(data),
    buildBookingActionSchema(data),
    buildSecondaryViewActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: data.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}

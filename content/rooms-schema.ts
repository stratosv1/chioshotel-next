import type {
  RoomCategoryCard,
  RoomsCategoryPageData,
} from "@/content/rooms";
import {
  absoluteUrl,
  getCanonicalUrl,
  getLanguageForPath,
  siteName,
  siteUrl,
} from "@/lib/seo";
import { resolveSeoDynamicTokens } from "@/lib/seo-dynamic-tokens";
import { seoSnippetOverrides } from "@/lib/seo-snippet-overrides";
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

function getRoomCardSchemaId(card: RoomCategoryCard): string {
  return schemaId(card.href, card.id);
}

type RoomCategorySchemaImage = {
  card: RoomCategoryCard;
  id: string;
};

function getRoomCategorySchemaImages(
  data: RoomsCategoryPageData,
): RoomCategorySchemaImage[] {
  const preferredHero = data.cards[1] ?? data.cards[0];
  const orderedCards = preferredHero
    ? [preferredHero, ...data.cards.filter((card) => card.id !== preferredHero.id)]
    : data.cards;
  const seen = new Set<string>();

  return orderedCards
    .filter((card) => {
      if (seen.has(card.image)) return false;
      seen.add(card.image);
      return true;
    })
    .map((card) => ({
      card,
      id:
        card.image === data.seo.ogImage
          ? primaryImageId(data.seo.canonicalPath)
          : schemaId(data.seo.canonicalPath, `room-category-${card.id}-image`),
    }));
}

function getRoomCategoryImageReferences(
  data: RoomsCategoryPageData,
): SchemaObject[] {
  const primaryId = primaryImageId(data.seo.canonicalPath);

  return [
    { "@id": primaryId },
    ...getRoomCategorySchemaImages(data)
      .filter((image) => image.id !== primaryId)
      .map((image) => ({ "@id": image.id })),
  ];
}

function buildRoomCategoryImageSchemas(
  data: RoomsCategoryPageData,
): SchemaObject[] {
  const primaryId = primaryImageId(data.seo.canonicalPath);

  return getRoomCategorySchemaImages(data)
    .filter((image) => image.id !== primaryId)
    .map(({ card, id }) => ({
      "@type": "ImageObject",
      "@id": id,
      url: absoluteUrl(card.image),
      contentUrl: absoluteUrl(card.image),
      name: card.imageAlt,
      caption: card.title,
      inLanguage: getLanguageForPath(data.seo.canonicalPath),
    }));
}

function buildRoomCardSchema(card: RoomCategoryCard): SchemaObject {
  return {
    "@type": "Accommodation",
    "@id": getRoomCardSchemaId(card),
    name: card.title,
    alternateName: card.subtitle,
    url: absoluteUrl(card.href),
    description: card.description,
    image: absoluteUrl(card.image),
    inLanguage: getLanguageForPath(card.href),
    containedInPlace: {
      "@id": hotelId(),
    },
    isPartOf: {
      "@id": hotelId(),
    },
    amenityFeature: card.meta.map((item) => ({
      "@type": "LocationFeatureSpecification",
      name: item,
      value: true,
    })),
  };
}

function buildRoomsItemListSchema(data: RoomsCategoryPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: data.seo.title,
    description: data.seo.description,
    url: getCanonicalUrl(canonicalPath),
    inLanguage: getLanguageForPath(canonicalPath),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.cards.length,
    itemListElement: data.cards.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(card.href),
      name: card.title,
      description: card.description,
      image: absoluteUrl(card.image),
      item: {
        "@id": getRoomCardSchemaId(card),
      },
    })),
  };
}

type RoomsSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

const roomsSchemaLabelsByLanguage: Record<RoomsSchemaLanguage, { breadcrumbName: string }> = {
  en: { breadcrumbName: "Chios rooms and apartments" },
  el: { breadcrumbName: "Δωμάτια και διαμερίσματα στη Χίο" },
  de: { breadcrumbName: "Zimmer und Apartments auf Chios" },
  fr: { breadcrumbName: "Chambres et appartements à Chios" },
  it: { breadcrumbName: "Camere e appartamenti a Chios" },
  es: { breadcrumbName: "Habitaciones y apartamentos en Quíos" },
  tr: { breadcrumbName: "Sakız Adası odaları ve daireleri" },
};

function getRoomsSchemaLabels(path: string) {
  const language = getLanguageForPath(path) as RoomsSchemaLanguage;
  return roomsSchemaLabelsByLanguage[language] ?? roomsSchemaLabelsByLanguage.en;
}

function resolveRoomsSchemaSeo(data: RoomsCategoryPageData): RoomsCategoryPageData {
  const canonicalPath = data.seo.canonicalPath;
  const override = seoSnippetOverrides.get(canonicalPath);

  return {
    ...data,
    seo: {
      ...data.seo,
      title: resolveSeoDynamicTokens(override?.title ?? data.seo.title, canonicalPath),
      description: resolveSeoDynamicTokens(
        override?.description ?? data.seo.description,
        canonicalPath,
      ),
      ogImage: data.seo.ogImage,
    },
  };
}

function hardenGreekRoomsSchemaData(data: RoomsCategoryPageData): RoomsCategoryPageData {
  if (data.seo.canonicalPath !== "/el/domatia-xios/") return data;

  return {
    ...data,
    cards: data.cards.map((card) => {
      if (card.id === "economy-double") {
        return {
          ...card,
          subtitle: "Οικονομική επιλογή για 2 άτομα",
          description:
            "Η πιο οικονομική επιλογή για 2 άτομα. Ανακαινισμένα δωμάτια 16m² με σύγχρονες παροχές και αυθεντική αίσθηση Κάμπου.",
          badge: "Οικονομική επιλογή",
          meta: ["2 άτομα", "16m²", "Οικονομικό"],
        };
      }

      if (card.id === "first-floor") {
        return {
          ...card,
          description:
            "Απολαύστε την πανοραμική θέα στο κτήμα και τα εσπεριδοειδή από τη βεράντα σας. Φωτεινά δωμάτια με πιο αναβαθμισμένη αίσθηση.",
        };
      }

      return card;
    }),
  };
}

function buildRoomsCollectionPageSchema(data: RoomsCategoryPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);
  const pageImages = getRoomCategoryImageReferences(data);

  return {
    "@type": "CollectionPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: data.seo.title,
    headline: data.seo.title,
    description: data.seo.description,
    image: pageImages,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: {
      "@id": hotelId(),
    },
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

function getPrimaryImageCaption(data: RoomsCategoryPageData): string {
  if (data.seo.canonicalPath === "/el/domatia-xios/") {
    return "Δωμάτια και διαμερίσματα στο Voulamandis House";
  }

  return data.seo.title.includes(siteName)
    ? data.seo.title
    : `${data.seo.title} - ${siteName}`;
}

export function buildRoomsCategorySchema(data: RoomsCategoryPageData) {
  const safeData = resolveRoomsSchemaSeo(hardenGreekRoomsSchemaData(data));
  const canonicalPath = safeData.seo.canonicalPath;
  const labels = getRoomsSchemaLabels(canonicalPath);

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: safeData.seo.ogImage,
        alt: safeData.seo.title,
        caption: getPrimaryImageCaption(safeData),
      },
      canonicalPath,
    ),
    ...buildRoomCategoryImageSchemas(safeData),
    buildRoomsCollectionPageSchema(safeData),
    buildRoomsItemListSchema(safeData),
    ...safeData.cards.map(buildRoomCardSchema),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: labels.breadcrumbName,
        path: canonicalPath,
      },
    ]),
  ]);
}

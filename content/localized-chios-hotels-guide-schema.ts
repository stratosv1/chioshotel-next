import type { ChiosHotelsGuideContent } from "@/content/chios-hotels-guide-types";
import type { ChiosHotelsGuideLocale } from "@/lib/chios-hotels-guide-i18n";
import { absoluteUrl, getCanonicalUrl, siteUrl } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
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

const LABELS: Record<ChiosHotelsGuideLocale, {
  about: string;
  itemList: string;
  businessDescription: string;
  imageCaption: string;
  breadcrumb: string;
}> = {
  en: {
    about: "Chios hotels and accommodation",
    itemList: "Rooms and apartments at Voulamandis House",
    businessDescription: "Voulamandis House is a family-run guest accommodation in Kambos, Chios, offering private rooms and family apartments as an alternative to a traditional hotel stay.",
    imageCaption: "Rooms and apartments in historic Kambos, Chios",
    breadcrumb: "Chios hotels and where to stay",
  },
  el: {
    about: "Ξενοδοχεία και διαμονή στη Χίο",
    itemList: "Δωμάτια και διαμερίσματα στο Voulamandis House",
    businessDescription: "Το Voulamandis House είναι οικογενειακό κατάλυμα στον Κάμπο της Χίου με ιδιωτικά δωμάτια και οικογενειακά διαμερίσματα, ως εναλλακτική σε παραδοσιακό ξενοδοχείο.",
    imageCaption: "Δωμάτια και διαμερίσματα στον ιστορικό Κάμπο της Χίου",
    breadcrumb: "Ξενοδοχεία στη Χίο και πού να μείνετε",
  },
  fr: {
    about: "Hôtels et hébergements à Chios",
    itemList: "Chambres et appartements au Voulamandis House",
    businessDescription: "Voulamandis House est un hébergement familial à Kambos, Chios, proposant des chambres privées et des appartements familiaux comme alternative à un hôtel traditionnel.",
    imageCaption: "Chambres et appartements dans le Kambos historique à Chios",
    breadcrumb: "Hôtels à Chios et où séjourner",
  },
  de: {
    about: "Hotels und Unterkünfte auf Chios",
    itemList: "Zimmer und Apartments im Voulamandis House",
    businessDescription: "Voulamandis House ist eine familiengeführte Gästeunterkunft in Kambos auf Chios mit privaten Zimmern und Familienapartments als Alternative zu einem klassischen Hotel.",
    imageCaption: "Zimmer und Apartments im historischen Kambos auf Chios",
    breadcrumb: "Hotels auf Chios und wo übernachten",
  },
  it: {
    about: "Hotel e alloggi a Chios",
    itemList: "Camere e appartamenti al Voulamandis House",
    businessDescription: "Voulamandis House è una struttura ricettiva familiare a Kambos, Chios, con camere private e appartamenti familiari come alternativa a un hotel tradizionale.",
    imageCaption: "Camere e appartamenti nello storico Kambos a Chios",
    breadcrumb: "Hotel a Chios e dove soggiornare",
  },
  es: {
    about: "Hoteles y alojamiento en Chios",
    itemList: "Habitaciones y apartamentos en Voulamandis House",
    businessDescription: "Voulamandis House es un alojamiento familiar en Kambos, Chios, con habitaciones privadas y apartamentos familiares como alternativa a un hotel tradicional.",
    imageCaption: "Habitaciones y apartamentos en el Kambos histórico de Chios",
    breadcrumb: "Hoteles en Chios y dónde alojarse",
  },
  tr: {
    about: "Sakız Adası otelleri ve konaklama",
    itemList: "Voulamandis House oda ve daireleri",
    businessDescription: "Voulamandis House, Sakız Adası Kambos bölgesinde özel odalar ve aile daireleri sunan, klasik otele alternatif aile işletmesi bir konaklama tesisidir.",
    imageCaption: "Sakız Adası tarihi Kambos bölgesinde oda ve daireler",
    breadcrumb: "Sakız Adası otelleri ve nerede kalınır",
  },
};

function roomCategoryId(path: string, index: number) {
  return schemaId(path, `room-category-${index + 1}`);
}

function buildCollectionPage(data: ChiosHotelsGuideContent, locale: ChiosHotelsGuideLocale): SchemaObject {
  const path = data.seo.canonicalPath;
  return {
    "@type": "CollectionPage",
    "@id": webPageId(path),
    url: getCanonicalUrl(path),
    name: data.seo.title,
    headline: data.hero.title,
    description: data.seo.description,
    inLanguage: locale,
    isPartOf: { "@id": websiteId() },
    about: [
      { "@type": "Thing", name: LABELS[locale].about },
      { "@id": hotelId() },
    ],
    mainEntity: { "@id": itemListId(path) },
    primaryImageOfPage: { "@id": primaryImageId(path) },
    breadcrumb: { "@id": schemaId(path, "breadcrumb") },
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

function buildRoomCategoryNodes(data: ChiosHotelsGuideContent, locale: ChiosHotelsGuideLocale): SchemaObject[] {
  const path = data.seo.canonicalPath;
  return data.roomCategories.items.map((room, index) => ({
    "@type": "Accommodation",
    "@id": roomCategoryId(path, index),
    name: room.title,
    url: absoluteUrl(room.href),
    description: room.text,
    image: absoluteUrl(room.image),
    inLanguage: locale,
    containedInPlace: { "@id": hotelId() },
    isPartOf: { "@id": hotelId() },
    amenityFeature: room.facts.map((fact) => ({
      "@type": "LocationFeatureSpecification",
      name: fact,
      value: true,
    })),
  }));
}

function buildRoomItemList(data: ChiosHotelsGuideContent, locale: ChiosHotelsGuideLocale): SchemaObject {
  const path = data.seo.canonicalPath;
  return {
    "@type": "ItemList",
    "@id": itemListId(path),
    name: LABELS[locale].itemList,
    description: data.roomCategories.description,
    url: getCanonicalUrl(path),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: data.roomCategories.items.length,
    itemListElement: data.roomCategories.items.map((room, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: room.title,
      url: absoluteUrl(room.href),
      item: { "@id": roomCategoryId(path, index) },
    })),
  };
}

export function buildLocalizedChiosHotelsGuideSchema(data: ChiosHotelsGuideContent, locale: ChiosHotelsGuideLocale) {
  const path = data.seo.canonicalPath;
  const labels = LABELS[locale];
  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path, description: labels.businessDescription }),
    buildWebsiteSchema(),
    buildImageSchema({ url: data.seo.image, alt: data.seo.imageAlt, caption: labels.imageCaption }, path),
    buildCollectionPage(data, locale),
    buildRoomItemList(data, locale),
    ...buildRoomCategoryNodes(data, locale),
    buildBreadcrumbSchema(path, [{ name: labels.breadcrumb, path }]),
    buildFaqSchema({
      path,
      questions: data.faq.items.map((item) => ({ question: item.question, answer: item.answer })),
    }),
  ]);
}

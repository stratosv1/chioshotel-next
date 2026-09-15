import { absoluteUrl, getLanguageForPath } from "@/lib/seo";
import {
  primaryImageId,
  schemaId,
  type SchemaObject,
} from "@/lib/structured-data";

export type CommercialPageImage = {
  src: string;
  alt: string;
  caption?: string;
};

type CommercialLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

const galleryLabels: Record<CommercialLanguage, string> = {
  en: "Rooms and family apartments at Voulamandis House",
  el: "Δωμάτια και οικογενειακά διαμερίσματα στο Voulamandis House",
  fr: "Chambres et appartements familiaux au Voulamandis House",
  de: "Zimmer und Familienapartments im Voulamandis House",
  it: "Camere e appartamenti familiari al Voulamandis House",
  es: "Habitaciones y apartamentos familiares en Voulamandis House",
  tr: "Voulamandis House oda ve aile daireleri",
};

const roomSources = [
  "/images/rooms/received_1753964631359257.webp",
  "/images/rooms/double-triple-room.jpg",
  "/images/rooms/DSC07776-2-e1675109942622.webp",
  "/images/rooms/chios-apartments-voulamandis.webp",
] as const;

const roomAlts: Record<CommercialLanguage, readonly string[]> = {
  en: [
    "Economy double room at Voulamandis House in Kambos, Chios",
    "Ground-floor double and triple room at Voulamandis House",
    "First-floor room with terrace access at Voulamandis House",
    "Family apartment with kitchen at Voulamandis House in Chios",
  ],
  el: [
    "Οικονομικό δίκλινο δωμάτιο στο Voulamandis House στον Κάμπο Χίου",
    "Ισόγειο δίκλινο και τρίκλινο δωμάτιο στο Voulamandis House",
    "Δωμάτιο πρώτου ορόφου με πρόσβαση στη βεράντα στο Voulamandis House",
    "Οικογενειακό διαμέρισμα με κουζίνα στο Voulamandis House στη Χίο",
  ],
  fr: [
    "Chambre double économique au Voulamandis House à Kambos, Chios",
    "Chambre double et triple au rez-de-chaussée au Voulamandis House",
    "Chambre à l’étage avec accès à la terrasse au Voulamandis House",
    "Appartement familial avec cuisine au Voulamandis House à Chios",
  ],
  de: [
    "Economy-Doppelzimmer im Voulamandis House in Kambos auf Chios",
    "Doppel- und Dreibettzimmer im Erdgeschoss im Voulamandis House",
    "Zimmer im Obergeschoss mit Terrassenzugang im Voulamandis House",
    "Familienapartment mit Küche im Voulamandis House auf Chios",
  ],
  it: [
    "Camera doppia economy al Voulamandis House a Kambos, Chios",
    "Camera doppia e tripla al piano terra al Voulamandis House",
    "Camera al primo piano con accesso alla terrazza al Voulamandis House",
    "Appartamento familiare con cucina al Voulamandis House a Chios",
  ],
  es: [
    "Habitación doble económica en Voulamandis House, Kambos, Quíos",
    "Habitación doble y triple en planta baja en Voulamandis House",
    "Habitación en primera planta con acceso a terraza en Voulamandis House",
    "Apartamento familiar con cocina en Voulamandis House, Quíos",
  ],
  tr: [
    "Sakız Kambos’taki Voulamandis House ekonomik çift kişilik oda",
    "Voulamandis House zemin kat çift ve üç kişilik oda",
    "Voulamandis House teras erişimli üst kat oda",
    "Sakız Adası Voulamandis House mutfaklı aile dairesi",
  ],
};

function commercialLanguage(path: string): CommercialLanguage {
  const language = getLanguageForPath(path);
  return language in roomAlts ? (language as CommercialLanguage) : "en";
}

export function getCommercialRoomGalleryLabel(path: string): string {
  return galleryLabels[commercialLanguage(path)];
}

export function getCommercialRoomGalleryImages(path: string): CommercialPageImage[] {
  const alts = roomAlts[commercialLanguage(path)];

  return roomSources.map((src, index) => ({
    src,
    alt: alts[index],
    caption: alts[index],
  }));
}

export function uniqueCommercialImages(
  images: readonly CommercialPageImage[],
): CommercialPageImage[] {
  const bySource = new Map<string, CommercialPageImage>();

  images.forEach((image) => {
    if (image.src && !bySource.has(image.src)) {
      bySource.set(image.src, image);
    }
  });

  return Array.from(bySource.values());
}

function commercialImageId(path: string, index: number) {
  return index === 0
    ? primaryImageId(path)
    : schemaId(path, `commercial-image-${index + 1}`);
}

export function buildCommercialImageObjectSchemas(
  path: string,
  images: readonly CommercialPageImage[],
): SchemaObject[] {
  return uniqueCommercialImages(images).map((image, index) => ({
    "@type": "ImageObject",
    "@id": commercialImageId(path, index),
    url: absoluteUrl(image.src),
    contentUrl: absoluteUrl(image.src),
    name: image.alt,
    caption: image.caption || image.alt,
    inLanguage: getLanguageForPath(path),
    representativeOfPage: index === 0,
  }));
}

export function getCommercialImageReferences(
  path: string,
  images: readonly CommercialPageImage[],
): SchemaObject[] {
  return uniqueCommercialImages(images).map((_, index) => ({
    "@id": commercialImageId(path, index),
  }));
}

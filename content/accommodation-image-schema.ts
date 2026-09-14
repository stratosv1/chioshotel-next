import type { ChiosAccommodationPageData } from "@/content/chios-accommodation";
import { absoluteUrl, getLanguageForPath } from "@/lib/seo";
import { primaryImageId, schemaId, type SchemaObject } from "@/lib/structured-data";

type AccommodationSchemaImage = {
  key: string;
  src: string;
  alt: string;
  id: string;
};

function getVisibleAccommodationImages(
  data: ChiosAccommodationPageData,
): AccommodationSchemaImage[] {
  const path = data.seo.canonicalPath;
  const candidates = [
    { key: "primary", src: data.seo.ogImage, alt: data.seo.ogImageAlt },
    ...data.rooms.cards.map((card) => ({
      key: `room-${card.id}`,
      src: card.image,
      alt: card.imageAlt,
    })),
    { key: "location", src: data.location.image, alt: data.location.imageAlt },
  ];
  const seen = new Set<string>();

  return candidates
    .filter((image) => {
      if (seen.has(image.src)) return false;
      seen.add(image.src);
      return true;
    })
    .map((image) => ({
      ...image,
      id:
        image.src === data.seo.ogImage
          ? primaryImageId(path)
          : schemaId(path, `content-image-${image.key}`),
    }));
}

export function getAccommodationImageReferences(
  data: ChiosAccommodationPageData,
): SchemaObject[] {
  return getVisibleAccommodationImages(data).map((image) => ({ "@id": image.id }));
}

export function buildAccommodationImageObjectSchemas(
  data: ChiosAccommodationPageData,
): SchemaObject[] {
  const primaryId = primaryImageId(data.seo.canonicalPath);

  return getVisibleAccommodationImages(data)
    .filter((image) => image.id !== primaryId)
    .map((image) => ({
      "@type": "ImageObject",
      "@id": image.id,
      url: absoluteUrl(image.src),
      contentUrl: absoluteUrl(image.src),
      name: image.alt,
      caption: image.alt,
      inLanguage: getLanguageForPath(data.seo.canonicalPath),
    }));
}

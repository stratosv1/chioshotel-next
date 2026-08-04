import { absoluteUrl, getLanguageForPath } from "./seo";
import { getSeoImageSet, type SeoImageAsset } from "./seo-image-registry";
import { schemaId, type SchemaObject } from "./structured-data";

const VISIBLE_IMAGE_LIMITS = new Map<string, number>([
  ["/el/domatia-xios/", 4],
]);

export function getSeoImagesForPath(path: string): readonly SeoImageAsset[] {
  const images = getSeoImageSet(path)?.images ?? [];
  const limit = VISIBLE_IMAGE_LIMITS.get(path);

  return typeof limit === "number" ? images.slice(0, limit) : images;
}

export function getSeoImageUrls(path: string): string[] {
  return getSeoImagesForPath(path).map((image) => absoluteUrl(image.src));
}

export function buildSeoImageObjectSchemas(path: string): SchemaObject[] {
  return getSeoImagesForPath(path).map((image, index) => ({
    "@type": "ImageObject",
    "@id": schemaId(path, `search-image-${index + 1}`),
    url: absoluteUrl(image.src),
    contentUrl: absoluteUrl(image.src),
    name: image.alt,
    caption: image.caption,
    inLanguage: getLanguageForPath(path),
    representativeOfPage: index === 0,
  }));
}

export function getSeoImageReferences(path: string): SchemaObject[] {
  return getSeoImagesForPath(path).map((_, index) => ({
    "@id": schemaId(path, `search-image-${index + 1}`),
  }));
}

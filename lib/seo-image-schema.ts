import { absoluteUrl, getLanguageForPath } from "./seo";
import { getSeoImageSet } from "./seo-image-registry";
import { schemaId, type SchemaObject } from "./structured-data";

export function getSeoImageUrls(path: string): string[] {
  const set = getSeoImageSet(path);
  return set?.images.map((image) => absoluteUrl(image.src)) || [];
}

export function buildSeoImageObjectSchemas(path: string): SchemaObject[] {
  const set = getSeoImageSet(path);
  if (!set) return [];

  return set.images.map((image, index) => ({
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
  const set = getSeoImageSet(path);
  if (!set) return [];

  return set.images.map((_, index) => ({
    "@id": schemaId(path, `search-image-${index + 1}`),
  }));
}

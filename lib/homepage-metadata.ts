import type { Metadata } from "next";
import type { HomePageData } from "@/content/home";
import { buildPageMetadata } from "@/lib/seo";

export function buildHomepageMetadata(data: HomePageData): Metadata {
  return buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.hero.image,
    imageAlt: data.seo.ogImageAlt,
    imageWidth: data.hero.imageWidth,
    imageHeight: data.hero.imageHeight,
  });
}

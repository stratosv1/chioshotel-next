import type { Metadata } from "next";
import type { HomePageData } from "@/content/home";
import { buildPageMetadata } from "@/lib/seo";
import { siteImageAssets } from "@/lib/site-assets";

export function buildHomepageMetadata(data: HomePageData): Metadata {
  return buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    // og:image uses the JPEG copy of the hero when the page shows the default
    // hero, so Bing/social previews get a JPEG instead of WebP.
    ...(data.hero.image === siteImageAssets.homepageHero.src
      ? {
          image: siteImageAssets.homepageHeroJpeg.src,
          imageWidth: siteImageAssets.homepageHeroJpeg.width,
          imageHeight: siteImageAssets.homepageHeroJpeg.height,
        }
      : {
          image: data.hero.image,
          imageWidth: data.hero.imageWidth,
          imageHeight: data.hero.imageHeight,
        }),
    imageAlt: data.seo.ogImageAlt,
  });
}

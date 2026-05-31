import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { homePageEn } from "@/content/home";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: homePageEn.seo.canonicalPath,
  title: homePageEn.seo.title,
  description: homePageEn.seo.description,
  image: homePageEn.seo.ogImage,
});

export default function Page() {
  return <HomePage data={homePageEn} />;
}
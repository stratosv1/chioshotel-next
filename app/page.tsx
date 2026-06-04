import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { homePageEn } from "@/content/home";
import { homePageSchema } from "@/content/schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/",
  title: homePageEn.seo.title,
  description: homePageEn.seo.description,
  image: homePageEn.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={homePageSchema} />
      <HomePage data={homePageEn} />
    </>
  );
}

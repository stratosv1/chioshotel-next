import type { Metadata } from "next";
import { ChiosMuseumsPage } from "@/components/chios/ChiosMuseumsPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { chiosMuseumsPageEn } from "@/content/chios-museums";
import { buildChiosMuseumsSchema } from "@/content/chios-museums-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: chiosMuseumsPageEn.seo.canonicalPath,
  title: chiosMuseumsPageEn.seo.title,
  description: chiosMuseumsPageEn.seo.description,
  image: chiosMuseumsPageEn.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosMuseumsSchema(chiosMuseumsPageEn)} />
      <ChiosMuseumsPage data={chiosMuseumsPageEn} />
    </>
  );
}
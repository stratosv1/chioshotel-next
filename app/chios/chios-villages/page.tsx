import type { Metadata } from "next";
import { ChiosVillagesPage } from "@/components/chios/ChiosVillagesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { chiosVillagesPageEn } from "@/content/chios-villages";
import { buildChiosVillagesSchema } from "@/content/chios-villages-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: chiosVillagesPageEn.seo.canonicalPath,
  title: chiosVillagesPageEn.seo.title,
  description: chiosVillagesPageEn.seo.description,
  image: chiosVillagesPageEn.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosVillagesSchema(chiosVillagesPageEn)} />
      <ChiosVillagesPage data={chiosVillagesPageEn} />
    </>
  );
}
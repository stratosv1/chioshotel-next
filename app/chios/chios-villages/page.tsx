import type { Metadata } from "next";
import { ChiosVillagesPageTailwind } from "@/components/chios/ChiosVillagesPageTailwind";
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
      <link
        rel="preload"
        as="image"
        href={chiosVillagesPageEn.hero.image}
        fetchPriority="high"
      />
      <JsonLd data={buildChiosVillagesSchema(chiosVillagesPageEn)} />
      <ChiosVillagesPageTailwind data={chiosVillagesPageEn} />
    </>
  );
}

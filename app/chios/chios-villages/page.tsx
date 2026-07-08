import type { Metadata } from "next";
import { ChiosVillagesPageTailwind } from "@/components/chios/ChiosVillagesPageTailwind";
import { AnswerFirstSeoBlock } from "@/components/seo/AnswerFirstSeoBlock";
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
      <AnswerFirstSeoBlock kind="villages" language="en" />
      <ChiosVillagesPageTailwind data={chiosVillagesPageEn} />
    </>
  );
}

import type { Metadata } from "next";
import { BeachesCardComparison } from "@/components/chios/BeachesCardComparison";
import { ChiosBeachesPageTailwind } from "@/components/chios/ChiosBeachesPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { chiosBeachesPageEn } from "@/content/chios-beaches";
import { buildChiosBeachesSchema } from "@/content/chios-beaches-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: chiosBeachesPageEn.seo.canonicalPath,
  title: chiosBeachesPageEn.seo.title,
  description: chiosBeachesPageEn.seo.description,
  image: chiosBeachesPageEn.seo.ogImage,
});

export default function Page() {
  const exampleBeach = chiosBeachesPageEn.beaches[0];

  return (
    <>
      <JsonLd data={buildChiosBeachesSchema(chiosBeachesPageEn)} />
      <ChiosBeachesPageTailwind data={chiosBeachesPageEn} />
      <BeachesCardComparison beach={exampleBeach} />
    </>
  );
}

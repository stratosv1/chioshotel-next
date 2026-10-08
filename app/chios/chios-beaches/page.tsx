import type { Metadata } from "next";
import { ChiosBeachesPageTailwind } from "@/components/chios/ChiosBeachesPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { chiosBeachesPageEn } from "@/content/chios-beaches";
import { buildChiosBeachesSchema } from "@/content/chios-beaches-schema";
import { buildPageMetadata } from "@/lib/seo";

// Sea-condition blocks refresh with the marine forecast cache.
export const revalidate = 900;

export const metadata: Metadata = buildPageMetadata({
  path: chiosBeachesPageEn.seo.canonicalPath,
  title: chiosBeachesPageEn.seo.title,
  description: chiosBeachesPageEn.seo.description,
  image: chiosBeachesPageEn.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosBeachesSchema(chiosBeachesPageEn)} />
      <ChiosBeachesPageTailwind data={chiosBeachesPageEn} />
    </>
  );
}

import type { Metadata } from "next";
import { ChiosIslandPage } from "@/components/chios/ChiosIslandPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { chiosIslandPageEn } from "@/content/chios-island";
import { buildChiosIslandSchema } from "@/content/chios-island-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: chiosIslandPageEn.seo.canonicalPath,
  title: chiosIslandPageEn.seo.title,
  description: chiosIslandPageEn.seo.description,
  image: chiosIslandPageEn.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosIslandSchema(chiosIslandPageEn)} />
      <ChiosIslandPage data={chiosIslandPageEn} />
    </>
  );
}
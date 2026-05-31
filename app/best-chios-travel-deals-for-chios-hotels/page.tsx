import type { Metadata } from "next";
import { DealsPage } from "@/components/deals/DealsPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { dealsPageEn } from "@/content/deals";
import { buildDealsSchema } from "@/content/deals-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: dealsPageEn.seo.canonicalPath,
  title: dealsPageEn.seo.title,
  description: dealsPageEn.seo.description,
  image: dealsPageEn.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildDealsSchema(dealsPageEn)} />
      <DealsPage data={dealsPageEn} />
    </>
  );
}
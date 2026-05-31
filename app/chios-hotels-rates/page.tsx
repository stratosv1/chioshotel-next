import type { Metadata } from "next";
import { RatesPage } from "@/components/rates/RatesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { ratesPageEn } from "@/content/rates";
import { buildRatesSchema } from "@/content/rates-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: ratesPageEn.seo.canonicalPath,
  title: ratesPageEn.seo.title,
  description: ratesPageEn.seo.description,
  image: ratesPageEn.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildRatesSchema(ratesPageEn)} />
      <RatesPage data={ratesPageEn} />
    </>
  );
}
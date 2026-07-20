import type { Metadata } from "next";
import { LocalizedKamposLandingPage } from "@/components/chios/LocalizedKamposLandingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { kamposChiosPageEn } from "@/content/kampos-chios";
import { buildLocalizedKamposChiosSchema } from "@/content/kampos-chios-localized-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageEn.seo.canonicalPath,
  title: kamposChiosPageEn.seo.title,
  description: kamposChiosPageEn.seo.description,
  image: kamposChiosPageEn.seo.ogImage,
  imageAlt: kamposChiosPageEn.hero.imageAlt,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedKamposChiosSchema(kamposChiosPageEn)} />
      <LocalizedKamposLandingPage data={kamposChiosPageEn} />
    </>
  );
}

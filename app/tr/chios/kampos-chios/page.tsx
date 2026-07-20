import type { Metadata } from "next";
import { LocalizedKamposLandingPage } from "@/components/chios/LocalizedKamposLandingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { kamposChiosPageTr } from "@/content/kampos-chios";
import { buildLocalizedKamposChiosSchema } from "@/content/kampos-chios-localized-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageTr.seo.canonicalPath,
  title: kamposChiosPageTr.seo.title,
  description: kamposChiosPageTr.seo.description,
  image: kamposChiosPageTr.seo.ogImage,
  imageAlt: kamposChiosPageTr.hero.imageAlt,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedKamposChiosSchema(kamposChiosPageTr)} />
      <LocalizedKamposLandingPage data={kamposChiosPageTr} />
    </>
  );
}

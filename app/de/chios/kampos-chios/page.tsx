import type { Metadata } from "next";
import { LocalizedKamposLandingPage } from "@/components/chios/LocalizedKamposLandingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { kamposChiosPageDe } from "@/content/kampos-chios";
import { buildLocalizedKamposChiosSchema } from "@/content/kampos-chios-localized-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageDe.seo.canonicalPath,
  title: kamposChiosPageDe.seo.title,
  description: kamposChiosPageDe.seo.description,
  image: kamposChiosPageDe.seo.ogImage,
  imageAlt: kamposChiosPageDe.hero.imageAlt,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedKamposChiosSchema(kamposChiosPageDe)} />
      <LocalizedKamposLandingPage data={kamposChiosPageDe} />
    </>
  );
}

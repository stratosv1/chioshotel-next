import type { Metadata } from "next";
import { LocalizedKamposLandingPage } from "@/components/chios/LocalizedKamposLandingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { kamposChiosPageIt } from "@/content/kampos-chios";
import { buildLocalizedKamposChiosSchema } from "@/content/kampos-chios-localized-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageIt.seo.canonicalPath,
  title: kamposChiosPageIt.seo.title,
  description: kamposChiosPageIt.seo.description,
  image: kamposChiosPageIt.seo.ogImage,
  imageAlt: kamposChiosPageIt.hero.imageAlt,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedKamposChiosSchema(kamposChiosPageIt)} />
      <LocalizedKamposLandingPage data={kamposChiosPageIt} />
    </>
  );
}

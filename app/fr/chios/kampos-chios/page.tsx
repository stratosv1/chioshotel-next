import type { Metadata } from "next";
import { LocalizedKamposLandingPage } from "@/components/chios/LocalizedKamposLandingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { kamposChiosPageFr } from "@/content/kampos-chios";
import { buildLocalizedKamposChiosSchema } from "@/content/kampos-chios-localized-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageFr.seo.canonicalPath,
  title: kamposChiosPageFr.seo.title,
  description: kamposChiosPageFr.seo.description,
  image: kamposChiosPageFr.seo.ogImage,
  imageAlt: kamposChiosPageFr.hero.imageAlt,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedKamposChiosSchema(kamposChiosPageFr)} />
      <LocalizedKamposLandingPage data={kamposChiosPageFr} />
    </>
  );
}

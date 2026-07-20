import type { Metadata } from "next";
import { LocalizedKamposLandingPage } from "@/components/chios/LocalizedKamposLandingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { kamposChiosPageEs } from "@/content/kampos-chios";
import { buildLocalizedKamposChiosSchema } from "@/content/kampos-chios-localized-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageEs.seo.canonicalPath,
  title: kamposChiosPageEs.seo.title,
  description: kamposChiosPageEs.seo.description,
  image: kamposChiosPageEs.seo.ogImage,
  imageAlt: kamposChiosPageEs.hero.imageAlt,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedKamposChiosSchema(kamposChiosPageEs)} />
      <LocalizedKamposLandingPage data={kamposChiosPageEs} />
    </>
  );
}

import type { Metadata } from "next";
import { KarfasBeachPage } from "@/components/chios/KarfasBeachPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { karfasBeachEl } from "@/content/karfas-beach-el";
import { buildKarfasBeachSchema } from "@/content/karfas-beach-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const path = karfasBeachEl.seo.canonicalPath;

export const metadata: Metadata = {
  ...buildPageMetadata({
    path,
    title: karfasBeachEl.seo.title,
    description: karfasBeachEl.seo.description,
    image: karfasBeachEl.seo.ogImage,
    imageAlt: karfasBeachEl.seo.imageAlt,
  }),
  alternates: {
    canonical: absoluteUrl(path),
    languages: {
      el: absoluteUrl(path),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildKarfasBeachSchema()} />
      <KarfasBeachPage data={karfasBeachEl} />
    </>
  );
}

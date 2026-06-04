import type { Metadata } from "next";
import { BeachLoversPage } from "@/components/landing/BeachLoversPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBeachLoversPageByLocale } from "@/content/beach-lovers";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getBeachLoversPageByLocale("en");

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  }),
  alternates: {
    canonical: absoluteUrl(data.seo.canonicalPath),
    languages: {
      en: absoluteUrl("/chios-beach-lovers/"),
      el: absoluteUrl("/el/xios-gia-latreis-paralias/"),
      fr: absoluteUrl("/fr/chios-pour-amoureux-de-plage/"),
      de: absoluteUrl("/de/chios-fuer-strandliebhaber/"),
      it: absoluteUrl("/it/chios-per-amanti-del-mare/"),
      es: absoluteUrl("/es/quios-para-amantes-de-la-playa/"),
      tr: absoluteUrl("/tr/plaj-severler-icin-sakiz-adasi/"),
      "x-default": absoluteUrl("/chios-beach-lovers/"),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildLandingPageSchema(data)} />
      <BeachLoversPage data={data} />
    </>
  );
}

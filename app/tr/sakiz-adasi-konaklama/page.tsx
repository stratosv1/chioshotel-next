import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { SakizAccommodationPage } from "@/components/landing/SakizAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { sakizAdasiKonaklamaPageTr } from "@/content/sakiz-adasi-konaklama";
import { buildSakizAdasiKonaklamaSchema } from "@/content/sakiz-adasi-konaklama-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: sakizAdasiKonaklamaPageTr.seo.canonicalPath,
  title: sakizAdasiKonaklamaPageTr.seo.title,
  description: sakizAdasiKonaklamaPageTr.seo.description,
  image: sakizAdasiKonaklamaPageTr.seo.ogImage,
  imageAlt: sakizAdasiKonaklamaPageTr.seo.ogImageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(sakizAdasiKonaklamaPageTr.seo.canonicalPath),
    languages: {
      en: absoluteUrl("/chios-accommodation/"),
      el: absoluteUrl("/el/diamoni-sti-xio/"),
      fr: absoluteUrl("/fr/hebergement-chios/"),
      de: absoluteUrl("/de/chios-unterkunft/"),
      it: absoluteUrl("/it/alloggio-chios/"),
      tr: absoluteUrl("/tr/sakiz-adasi-konaklama/"),
      "x-default": absoluteUrl("/chios-accommodation/"),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildSakizAdasiKonaklamaSchema(sakizAdasiKonaklamaPageTr)} />
      <SakizAccommodationPage data={sakizAdasiKonaklamaPageTr} />
      <AccommodationLandingAnalytics
        language="tr"
        pathname={sakizAdasiKonaklamaPageTr.seo.canonicalPath}
      />
    </>
  );
}

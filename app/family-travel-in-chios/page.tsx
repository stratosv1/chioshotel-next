import type { Metadata } from "next";
import FamilyTravelPage from "@/components/landing/FamilyTravelPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFamilyTravelPageByLocale } from "@/content/family-travel";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getFamilyTravelPageByLocale("en");

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: data.path,
    title: data.seo.title,
    description: data.seo.description,
    image: data.hero.image.src,
  }),
  alternates: {
    canonical: absoluteUrl(data.path),
    languages: {
      en: absoluteUrl("/family-travel-in-chios/"),
      el: absoluteUrl("/el/oikogeneiakes-diakopes-sti-xio/"),
      fr: absoluteUrl("/fr/vacances-en-famille-a-chios/"),
      de: absoluteUrl("/de/familienurlaub-auf-chios/"),
      it: absoluteUrl("/it/vacanze-in-famiglia-a-chios/"),
      es: absoluteUrl("/es/vacaciones-en-familia-en-quios/"),
      tr: absoluteUrl("/tr/sakiz-adasi-aile-tatili/"),
      "x-default": absoluteUrl("/family-travel-in-chios/"),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildLandingPageSchema(data)} />
      <FamilyTravelPage data={data} />
    </>
  );
}

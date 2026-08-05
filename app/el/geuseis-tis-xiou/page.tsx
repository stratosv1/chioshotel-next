import type { Metadata } from "next";
import TasteLoverPage from "@/components/landing/TasteLoverPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { getTasteLoverPageByLocale } from "@/content/taste-lover";
import { buildPageMetadata } from "@/lib/seo";

const source = getTasteLoverPageByLocale("el");

const data = {
  ...source,
  seo: {
    ...source.seo,
    title: "Γεύσεις της Χίου | Τι αξίζει να δοκιμάσετε",
    description:
      "Ανακαλύψτε μαστίχα, παραδοσιακά γλυκά, θαλασσινά, ταβέρνες και αυθεντικές χιώτικες γεύσεις. Δείτε τι αξίζει πραγματικά να δοκιμάσετε.",
  },
  hero: {
    ...source.hero,
    title: "Γεύσεις της Χίου: τι αξίζει πραγματικά να δοκιμάσετε",
    subtitle:
      "Ανακαλύψτε μαστίχα, σπιτικά γλυκά, χωριά, ταβέρνες και θαλασσινά μέσα από μια αυθεντική γευστική διαδρομή στη Χίο.",
  },
  intro: {
    ...source.intro,
    title: "Οι γεύσεις που κάνουν τη Χίο ξεχωριστή",
    text:
      "Η Χίος είναι γεμάτη αρώματα και τοπικές γεύσεις: μαστίχα, οικογενειακές συνταγές, παραδοσιακά γλυκά, φρέσκα θαλασσινά, ελαιόλαδο και χαλαρά γεύματα δίπλα στη θάλασσα.",
  },
};

export const metadata: Metadata = buildPageMetadata({
  path: data.path,
  title: data.seo.title,
  description: data.seo.description,
  image: data.seo.image,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildLandingPageSchema(data)} />
      <TasteLoverPage data={data} />
    </>
  );
}

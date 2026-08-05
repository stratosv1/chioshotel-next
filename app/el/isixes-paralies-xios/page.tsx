import type { Metadata } from "next";
import { OrganizedBeachesPage } from "@/components/landing/OrganizedBeachesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getQuietBeachesPageByLocale,
  quietBeachAlternates,
} from "@/content/quiet-beaches";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const source = getQuietBeachesPageByLocale("el");

const data = {
  ...source,
  seo: {
    ...source.seo,
    title: "Ήσυχες παραλίες Χίου | Μακριά από την πολυκοσμία",
    description:
      "Ανακαλύψτε ήσυχες παραλίες της Χίου για χαλαρό μπάνιο, καθαρά νερά και λιγότερο κόσμο, με πληροφορίες πρόσβασης και τοπικές συμβουλές.",
  },
  hero: {
    ...source.hero,
    title: "Ήσυχες παραλίες στη Χίο μακριά από την πολυκοσμία",
    subtitle:
      "Βρείτε ήρεμες ακτές με φυσικό τοπίο, καθαρά νερά και λιγότερο κόσμο για μια πιο χαλαρή ημέρα στη θάλασσα.",
  },
  intro: {
    ...source.intro,
    title: "Πότε αξίζει να επιλέξετε μια ήσυχη παραλία",
    text: [
      "Οι ήσυχες παραλίες της Χίου είναι ιδανικές όταν θέλετε χαλαρό μπάνιο, φυσικό τοπίο και λιγότερη κίνηση, μακριά από οργανωμένες ακτές και πολυκοσμία.",
      "Ξεκινήστε με την Ελίντα, τα Βρουλίδια και τον Ναγό και επιλέξτε ανάλογα με τη διαδρομή και τις συνθήκες της ημέρας.",
    ],
  },
};

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  }),
  alternates: {
    canonical: absoluteUrl(data.seo.canonicalPath),
    languages: quietBeachAlternates,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildLandingPageSchema(data)} />
      <OrganizedBeachesPage data={data} />
    </>
  );
}

import type { Metadata } from "next";
import { OrganizedBeachesPage } from "@/components/landing/OrganizedBeachesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getShelteredBeachesPageByLocale,
  shelteredBeachAlternates,
} from "@/content/sheltered-beaches";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const source = getShelteredBeachesPageByLocale("el");

const data = {
  ...source,
  seo: {
    ...source.seo,
    title: "Απάνεμες παραλίες Χίου | Ήρεμη θάλασσα χωρίς πολύ αέρα",
    description:
      "Βρείτε τις καλύτερες απάνεμες παραλίες της Χίου για πιο ήρεμο μπάνιο, με προστατευμένους κόλπους, καθαρά νερά και πρακτικές συμβουλές πρόσβασης.",
  },
  hero: {
    ...source.hero,
    title: "Απάνεμες παραλίες στη Χίο για ήρεμο μπάνιο",
    subtitle:
      "Ανακαλύψτε πιο προστατευμένους κόλπους με λιγότερο αέρα και πιο ήρεμη θάλασσα, μαζί με τοπικές συμβουλές για τη σωστή επιλογή παραλίας.",
  },
  intro: {
    ...source.intro,
    title: "Πότε να επιλέξετε απάνεμη παραλία στη Χίο",
    text: [
      "Οι απάνεμες παραλίες είναι πιο προστατευμένες από τον άνεμο και συχνά προσφέρουν πιο ήρεμη θάλασσα για μπάνιο. Η σωστή επιλογή εξαρτάται πάντα από την κατεύθυνση και την ένταση του αέρα.",
      "Στη λίστα θα βρείτε τη Σαλάγωνα, την Αγία Δύναμη, τα Βρουλίδια, τα Κάτω Φανά και την Ελίντα, με πρακτικές πληροφορίες για να οργανώσετε καλύτερα τη μέρα σας.",
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
    languages: shelteredBeachAlternates,
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

import type { Metadata } from "next";
import { OrganizedBeachesPage } from "@/components/landing/OrganizedBeachesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSandyBeachesPageByLocale, sandyBeachAlternates } from "@/content/sandy-beaches";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const sourceData = getSandyBeachesPageByLocale("el");
const data = {
  ...sourceData,
  highlights: {
    ...sourceData.highlights,
    cards: sourceData.highlights.cards.map((card) =>
      card.name === "Καρφάς"
        ? {
            ...card,
            href: "/el/paralies-xios/paralia-karfas/",
            image: "/images/beaches/karfas-beach-chios.webp",
            tag: "Χρυσαφένια άμμος",
            description: "Μεγάλη αμμώδης ακτή με ρηχά νερά και οργανωμένες επιλογές για άνετη μέρα στη θάλασσα.",
            why: "Καλή για όσους προτιμούν άμμο, εύκολη είσοδο στο νερό και υπηρεσίες κοντά.",
          }
        : card,
    ),
  },
};

export const metadata: Metadata = {
  ...buildPageMetadata({ path: data.seo.canonicalPath, title: data.seo.title, description: data.seo.description, image: data.seo.ogImage }),
  alternates: { canonical: absoluteUrl(data.seo.canonicalPath), languages: sandyBeachAlternates },
};

export default function Page() {
  return <><JsonLd data={buildLandingPageSchema(data)} /><OrganizedBeachesPage data={data} /></>;
}

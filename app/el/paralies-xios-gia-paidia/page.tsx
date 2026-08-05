import type { Metadata } from "next";
import { FamilyBeachesPage } from "@/components/landing/FamilyBeachesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { familyBeachAlternates, getFamilyBeachesPageByLocale } from "@/content/family-beaches";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const sourceData = getFamilyBeachesPageByLocale("el");
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
            tag: "Άμμος + ρηχά νερά",
            description: "Μεγάλη αμμώδης και οργανωμένη παραλία με ρηχά νερά, κοντά στην πόλη και στον Κάμπο.",
            why: "Καλή όταν θέλετε εύκολη πρόσβαση, υπηρεσίες και πρακτικό μπάνιο με παιδιά.",
          }
        : card,
    ),
  },
};

export const metadata: Metadata = {
  ...buildPageMetadata({ path: data.seo.canonicalPath, title: data.seo.title, description: data.seo.description, image: data.seo.ogImage }),
  alternates: { canonical: absoluteUrl(data.seo.canonicalPath), languages: familyBeachAlternates },
};

export default function Page() {
  return <><JsonLd data={buildLandingPageSchema(data)} /><FamilyBeachesPage data={data} /></>;
}

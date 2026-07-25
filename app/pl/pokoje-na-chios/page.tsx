import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/pokoje-na-chios/",
  title: "Pokoje na Chios | Voulamandis House Kambos",
  description:
    "Pokoje na Chios dla par i małych rodzin w spokojnym Kambos. Klimatyzacja, Wi‑Fi, lodówka i łatwy dojazd do miasta, lotniska i plaż.",
});

export default function PolishRoomsPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="POKOJE NA CHIOS"
      title="Pokoje na Chios dla par i małych rodzin"
      intro="W Voulamandis House znajdziesz spokojne pokoje dwu- i trzyosobowe w Kambos, z codzienną dbałością o czystość i wygodnym położeniem na wyspie Chios."
      highlights={["2–3 osoby", "Klimatyzacja", "Wi‑Fi", "Lodówka"]}
      bodyTitle="Wybierz pokój dopasowany do pobytu na Chios"
      paragraphs={[
        "Dostępne są ekonomiczne pokoje dwuosobowe oraz pokoje standardowe dla dwóch lub trzech osób. Poszczególne pokoje różnią się położeniem na parterze lub piętrze, dzięki czemu łatwiej dobrać opcję do potrzeb podróży.",
        "Każdy pokój stanowi bazę do zwiedzania Chios, a po powrocie pozwala odpocząć w spokojnym otoczeniu Kambos. W pobliżu znajdują się miasto Chios, lotnisko oraz plaże południowej części wyspy.",
        "Jeżeli podróżujesz z rodziną i potrzebujesz więcej przestrzeni lub aneksu kuchennego, zobacz także nasze apartamenty rodzinne na Chios.",
      ]}
      primaryHref="/pl/rezerwacja/"
      primaryLabel="Sprawdź dostępność"
      secondaryHref="/pl/apartamenty-na-chios/"
      secondaryLabel="Apartamenty rodzinne"
    />
  );
}

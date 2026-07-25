import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/noclegi-chios/",
  title: "Noclegi Chios | Spokojny pobyt w Kambos",
  description:
    "Noclegi na Chios w Kambos: pokoje i apartamenty Voulamandis House dla par i rodzin. Blisko miasta, lotniska i plaż. Rezerwacja bezpośrednia.",
});

export default function PolishAccommodationPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="NOCLEGI NA CHIOS"
      title="Noclegi na Chios w spokojnym i historycznym Kambos"
      intro="Jeśli szukasz noclegu na Chios, który łączy ciszę, wygodny dojazd i lokalny charakter, Voulamandis House w Kambos jest praktyczną bazą dla par i rodzin."
      highlights={["Kambos", "Blisko miasta Chios", "Blisko lotniska", "Pokoje i apartamenty"]}
      bodyTitle="Gdzie nocować na Chios?"
      paragraphs={[
        "Kambos leży kilka kilometrów od miasta Chios i słynie z kamiennych murów, dawnych rezydencji oraz ogrodów cytrusowych. To miejsce dla osób, które chcą odpocząć spokojniej, a jednocześnie mieć szybki dostęp do portu, lotniska, miasta i południowych plaż.",
        "Voulamandis House oferuje kilka typów pokoi oraz rodzinne apartamenty. Dzięki temu można dopasować pobyt zarówno do krótkiego wyjazdu we dwoje, jak i rodzinnych wakacji na Chios.",
        "Ta strona skupia się na noclegach na Chios. Jeśli porównujesz typowe hotele, zobacz także nasz przewodnik po wyszukiwaniu hoteli na Chios i sprawdź, kiedy kameralny obiekt w Kambos może być lepszą alternatywą.",
      ]}
      primaryHref="/pl/pokoje-na-chios/"
      primaryLabel="Zobacz pokoje"
      secondaryHref="/pl/hotele-chios/"
      secondaryLabel="Hotele na Chios"
    />
  );
}

import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/hotele-chios/",
  title: "Hotele Chios | Spokojna alternatywa w Kambos",
  description:
    "Szukasz hotelu na Chios? Porównaj spokojny pobyt w Voulamandis House w Kambos: pokoje i apartamenty, blisko miasta, lotniska i plaż.",
});

export default function PolishHotelsPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="HOTELE NA CHIOS"
      title="Hotele na Chios — spokojna alternatywa w Kambos"
      intro="Jeśli szukasz hoteli na Chios, warto porównać także mniejsze obiekty noclegowe. Voulamandis House nie jest hotelem — oferuje pokoje i rodzinne apartamenty w historycznym Kambos, z bardziej kameralną atmosferą."
      highlights={["Alternatywa dla hotelu", "Kambos", "Pokoje i apartamenty", "Bezpośredni kontakt"]}
      bodyTitle="Szukasz hotelu na Chios? Sprawdź także kameralne noclegi"
      paragraphs={[
        "Wybór miejsca na Chios zależy od stylu podróży. Hotele mogą być dobrym rozwiązaniem dla osób szukających rozbudowanych usług, natomiast mniejszy obiekt może lepiej odpowiadać gościom, którzy cenią spokój, przestrzeń i bezpośredni kontakt z gospodarzem.",
        "Voulamandis House znajduje się w Kambos, kilka kilometrów od miasta Chios. Oferuje pokoje dla par, pokoje dla małych rodzin oraz apartamenty rodzinne w zielonym, historycznym otoczeniu.",
        "Jeżeli wpisujesz w Google „hotele Chios” lub „hotel Chios”, możesz potraktować tę stronę jako punkt wyjścia do porównania opcji noclegowych i sprawdzenia, czy kameralny pobyt w Kambos odpowiada Twoim planom.",
      ]}
      primaryHref="/pl/noclegi-chios/"
      primaryLabel="Noclegi na Chios"
      secondaryHref="/pl/rezerwacja/"
      secondaryLabel="Sprawdź dostępność"
    />
  );
}

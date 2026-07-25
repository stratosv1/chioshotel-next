import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/",
  title: "Noclegi na Chios | Pokoje i apartamenty w Kambos",
  description:
    "Noclegi na Chios w spokojnym Kambos. Pokoje i apartamenty Voulamandis House blisko miasta, lotniska i plaż. Sprawdź dostępność i rezerwuj bezpośrednio.",
  imageAlt: "Voulamandis House w Kambos na wyspie Chios",
});

export default function PolishHomePage() {
  return (
    <PolishSeoLandingPage
      eyebrow="KAMBOS · CHIOS · VOULAMANDIS HOUSE"
      title="Noclegi na Chios — pokoje i apartamenty w spokojnym Kambos"
      intro="Szukasz noclegu na Chios, pokoju dla dwojga albo rodzinnego apartamentu? Voulamandis House oferuje spokojny pobyt w historycznej dzielnicy Kambos, z łatwym dojazdem do miasta Chios, lotniska, portu i plaż."
      highlights={["Spokojny Kambos", "Pokoje dla par", "Apartamenty rodzinne", "Rezerwacja bezpośrednia"]}
      bodyTitle="Pobyt na Chios z dala od hotelowego zgiełku"
      paragraphs={[
        "Voulamandis House to niewielki obiekt z pokojami i apartamentami położony w zielonym Kambos. To dobra propozycja dla osób, które porównują hotele na Chios, ale wolą spokojniejsze miejsce, bardziej osobisty kontakt i autentyczną atmosferę wyspy.",
        "Na miejscu znajdziesz pokoje dwu- i trzyosobowe oraz apartamenty rodzinne. Kambos pozwala odpocząć wśród cytrusowych ogrodów, a jednocześnie pozostaje blisko najważniejszych punktów wyspy.",
        "Rezerwując bezpośrednio, możesz szybko sprawdzić dostępność, skontaktować się z obiektem i wybrać pokój odpowiedni do liczby gości oraz planu podróży.",
      ]}
      primaryHref="/pl/pokoje-na-chios/"
      primaryLabel="Zobacz pokoje"
      secondaryHref="/pl/rezerwacja/"
      secondaryLabel="Sprawdź dostępność"
    />
  );
}

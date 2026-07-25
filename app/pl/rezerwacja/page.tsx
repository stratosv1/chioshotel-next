import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/rezerwacja/",
  title: "Rezerwacja noclegu na Chios | Voulamandis House",
  description:
    "Sprawdź dostępność pokoi i apartamentów Voulamandis House na Chios. Bezpośredni kontakt, spokojny Kambos i prosty wybór noclegu dla par i rodzin.",
});

export default function PolishBookingPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="REZERWACJA BEZPOŚREDNIA"
      title="Sprawdź dostępność noclegu na Chios"
      intro="Wybierz pokój lub apartament, a następnie skontaktuj się bezpośrednio z Voulamandis House, aby potwierdzić dostępność i najlepszą aktualną ofertę."
      highlights={["Bezpośredni kontakt", "Bez pośredników", "Pokoje i apartamenty", "Kambos"]}
      bodyTitle="Jak zarezerwować pobyt?"
      paragraphs={[
        "Najpierw wybierz rodzaj zakwaterowania: pokój dwuosobowy, pokój dla dwóch lub trzech osób albo apartament rodzinny.",
        "Dostępność i ceny zależą od terminu oraz liczby gości. Jeśli masz konkretne daty podróży, skontaktuj się z nami bezpośrednio, aby otrzymać aktualną propozycję.",
        "Voulamandis House jest kameralnym obiektem noclegowym w Kambos. Nie jest hotelem, dlatego bezpośredni kontakt pomaga szybciej dobrać odpowiedni pokój lub apartament do Twojego pobytu.",
      ]}
      primaryHref="mailto:info@chioshotel.gr?subject=Rezerwacja%20Chios%20-%20zapytanie%20po%20polsku"
      primaryLabel="Wyślij zapytanie"
      secondaryHref="/pl/pokoje-na-chios/"
      secondaryLabel="Zobacz pokoje"
    />
  );
}

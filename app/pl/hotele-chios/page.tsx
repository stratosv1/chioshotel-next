import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/hotele-chios/",
  title: "Hotele Chios | Alternatywa w spokojnym Kambos",
  description:
    "Szukasz hotelu na Chios? Porównaj pokoje i apartamenty Voulamandis House w Kambos — spokojną, kameralną alternatywę z rezerwacją bezpośrednią.",
});

export default function PolishHotelsPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="HOTELE NA CHIOS"
      title="Hotele na Chios — porównaj także spokojny pobyt w Kambos"
      intro="Jeśli szukasz hoteli na Chios, warto porównać również mniejsze obiekty noclegowe. Voulamandis House nie jest hotelem — oferuje pokoje i rodzinne apartamenty w historycznym Kambos, z bardziej kameralną atmosferą."
      highlights={["Alternatywa dla hotelu", "Kambos", "Pokoje i apartamenty", "Rezerwacja bezpośrednia"]}
      bodyTitle="Szukasz hotelu na Chios? Najpierw wybierz styl pobytu"
      paragraphs={[
        "Frazy hotele Chios, hotel Chios i hotele na Chios są naturalnym punktem startowym przy planowaniu wyjazdu. W praktyce warto jednak porównać nie tylko kategorię obiektu, ale też lokalizację, wielkość, atmosferę i rodzaj zakwaterowania. Dla części podróżnych duży hotel będzie najlepszą opcją, inni będą woleli mniejszy obiekt z pokojami lub apartamentami.",
        "Voulamandis House znajduje się w Kambos, historycznej części wyspy Chios. Nie jest hotelem i nie przedstawiamy go jako hotelu. To kameralny obiekt oferujący pokoje oraz rodzinne apartamenty dla gości, którzy preferują spokojniejsze otoczenie i bardziej bezpośredni kontakt z miejscem pobytu.",
        "Kambos może być szczególnie ciekawy dla osób, które chcą mieć dostęp do miasta Chios i jednocześnie wracać wieczorem do spokojniejszej okolicy. Charakterystyczne kamienne mury, ogrody i dawne posiadłości nadają tej części wyspy zupełnie inny klimat niż najbardziej ruchliwe rejony centrum.",
        "Jeżeli podczas wyszukiwania hoteli na Chios najważniejsza jest dla Ciebie cena, przestrzeń, pobyt rodzinny lub rezerwacja bezpośrednia, sprawdź także nasze strony z pokojami, apartamentami i noclegami na Chios. Każda z nich odpowiada innemu sposobowi wyszukiwania zakwaterowania.",
      ]}
      sections={[
        {
          title: "Hotel czy kameralny obiekt?",
          text: "Hotel może oferować rozbudowane usługi i większą infrastrukturę. Kameralny obiekt jest natomiast dobrym wyborem dla osób, które szukają prostszego pobytu, spokojniejszej atmosfery i bezpośredniego kontaktu z gospodarzem.",
        },
        {
          title: "Hotele Chios dla rodzin — co porównać?",
          text: "Rodziny powinny zwrócić uwagę nie tylko na nazwę kategorii obiektu, ale przede wszystkim na liczbę miejsc, przestrzeń i układ zakwaterowania. Rodzinne apartamenty mogą być wygodniejszą opcją niż pojedynczy standardowy pokój.",
        },
        {
          title: "Hotele Chios blisko miasta czy spokojniej?",
          text: "Wybór lokalizacji zależy od planu wyjazdu. Jeśli chcesz być poza najbardziej ruchliwym centrum, ale nadal mieć wygodną bazę do zwiedzania, Kambos jest jednym z miejsc, które warto rozważyć.",
        },
        {
          title: "Bezpośrednia rezerwacja pobytu",
          text: "Jeżeli znajdziesz opcję odpowiadającą Twoim potrzebom, możesz przejść do strony rezerwacji i skontaktować się bezpośrednio z Voulamandis House, aby sprawdzić dostępność oraz odpowiedni typ pokoju lub apartamentu.",
        },
      ]}
      faq={[
        {
          question: "Czy Voulamandis House jest hotelem na Chios?",
          answer: "Nie. Voulamandis House to obiekt noclegowy oferujący pokoje i rodzinne apartamenty w Kambos. Ta strona odpowiada na wyszukiwanie hotele Chios i pokazuje kameralną alternatywę dla klasycznego hotelu.",
        },
        {
          question: "Gdzie szukać pokoi zamiast hotelu na Chios?",
          answer: "Na stronie Pokoje na Chios znajdziesz dostępne kategorie pokoi Voulamandis House, a na stronie Apartamenty na Chios opcje przeznaczone przede wszystkim dla rodzin i małych grup.",
        },
        {
          question: "Czy Kambos jest daleko od miasta Chios?",
          answer: "Kambos znajduje się poza najbardziej ruchliwym centrum, ale jest położony w dogodnej części wyspy dla osób chcących łączyć spokojny pobyt z dojazdem do miasta, portu, lotniska i plaż.",
        },
        {
          question: "Czy można zarezerwować bezpośrednio?",
          answer: "Tak. Strona rezerwacji bezpośredniej prowadzi do sprawdzenia dostępności i kontaktu z obiektem bez konieczności rozpoczynania od platform pośredniczących.",
        },
      ]}
      primaryHref="/pl/pokoje-na-chios/"
      primaryLabel="Zobacz pokoje"
      secondaryHref="/pl/rezerwacja/"
      secondaryLabel="Sprawdź dostępność"
    />
  );
}

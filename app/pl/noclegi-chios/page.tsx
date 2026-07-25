import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/noclegi-chios/",
  title: "Noclegi Chios | Pokoje i apartamenty w Kambos",
  description:
    "Noclegi na Chios w spokojnym Kambos. Pokoje i apartamenty Voulamandis House dla par i rodzin, dogodna lokalizacja i rezerwacja bezpośrednia.",
});

export default function PolishAccommodationPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="NOCLEGI NA CHIOS"
      title="Noclegi na Chios w spokojnym i historycznym Kambos"
      intro="Jeśli szukasz noclegu na Chios, który łączy ciszę, wygodny dojazd i lokalny charakter, Voulamandis House w Kambos jest praktyczną bazą dla par i rodzin."
      highlights={["Kambos", "Pokoje i apartamenty", "Spokojne otoczenie", "Rezerwacja bezpośrednia"]}
      bodyTitle="Gdzie nocować na Chios?"
      paragraphs={[
        "Wybór noclegu na Chios zależy od stylu podróży. Część gości chce być blisko miasta i portu, inni wolą spokojniejszą okolicę z łatwym dojazdem do plaż oraz południowej części wyspy. Kambos pozwala połączyć te potrzeby: to historyczna dzielnica położona poza najbardziej ruchliwym centrum, ale nadal wygodna jako baza do zwiedzania wyspy.",
        "Voulamandis House oferuje pokoje dla par i mniejszych grup oraz rodzinne apartamenty dla osób, które potrzebują więcej przestrzeni. Obiekt znajduje się w otoczeniu charakterystycznym dla Kambos — wśród kamiennych murów, ogrodów i cytrusowego krajobrazu tej części Chios.",
        "Jeżeli wpisujesz w wyszukiwarkę noclegi Chios, pokoje Chios, apartamenty Chios lub hotele Chios, warto porównać nie tylko kategorię obiektu, ale także lokalizację, przestrzeń i sposób rezerwacji. Voulamandis House nie jest hotelem; jest kameralnym obiektem z pokojami i apartamentami, który może być spokojną alternatywą dla klasycznego pobytu hotelowego.",
        "Przy rezerwacji bezpośredniej możesz skontaktować się z obiektem, sprawdzić dostępność i wybrać typ pokoju dopasowany do liczby osób. Na osobnych stronach znajdziesz pokoje na Chios, rodzinne apartamenty, informacje o Kambos oraz stronę rezerwacji bezpośredniej.",
      ]}
      sections={[
        {
          title: "Noclegi na Chios dla par",
          text: "Dla dwóch osób dobrym rozwiązaniem są pokoje dwuosobowe w Kambos. To opcja dla gości, którzy chcą spokojnego miejsca na nocleg, a dzień spędzać na plażach, w mieście Chios lub podczas zwiedzania wiosek wyspy.",
        },
        {
          title: "Noclegi na Chios dla rodzin",
          text: "Rodzinne apartamenty zapewniają więcej przestrzeni niż standardowy pokój i są przeznaczone dla rodzin oraz małych grup. Na stronie apartamentów opisujemy układ, pojemność i najważniejsze udogodnienia dostępnych opcji.",
        },
        {
          title: "Dlaczego Kambos?",
          text: "Kambos jest znany z historycznych posiadłości, wysokich kamiennych murów i ogrodów cytrusowych. Spokojny charakter dzielnicy sprawia, że jest dobrym wyborem dla osób, które po całym dniu chcą wrócić do mniej ruchliwego otoczenia.",
        },
        {
          title: "Rezerwacja bezpośrednia",
          text: "Zamiast przechodzić wyłącznie przez platformy pośredniczące, możesz sprawdzić opcje pobytu i skontaktować się bezpośrednio z Voulamandis House. Dzięki temu łatwiej omówić liczbę osób, typ pokoju oraz szczegóły pobytu.",
        },
      ]}
      faq={[
        {
          question: "Czy Voulamandis House jest hotelem na Chios?",
          answer: "Nie. Voulamandis House oferuje pokoje i rodzinne apartamenty w Kambos. Strona hotele Chios pomaga osobom szukającym hotelu porównać ten typ pobytu z bardziej kameralną alternatywą.",
        },
        {
          question: "Czy Kambos jest dobrym miejscem na nocleg na Chios?",
          answer: "Tak, szczególnie dla osób ceniących ciszę i lokalny charakter, które jednocześnie chcą mieć wygodny dojazd do miasta Chios, portu, lotniska i plaż.",
        },
        {
          question: "Czy są dostępne apartamenty dla rodzin?",
          answer: "Tak. Voulamandis House ma rodzinne apartamenty przeznaczone dla gości potrzebujących większej przestrzeni. Szczegóły znajdują się na stronie apartamentów na Chios.",
        },
        {
          question: "Jak sprawdzić dostępność?",
          answer: "Przejdź do strony rezerwacji bezpośredniej lub wybierz interesujący typ pokoju. Możesz następnie sprawdzić dostępność i skontaktować się bezpośrednio z obiektem.",
        },
      ]}
      primaryHref="/pl/pokoje-na-chios/"
      primaryLabel="Zobacz pokoje"
      secondaryHref="/pl/rezerwacja/"
      secondaryLabel="Sprawdź dostępność"
    />
  );
}

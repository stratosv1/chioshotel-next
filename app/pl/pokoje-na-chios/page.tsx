import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/pokoje-na-chios/",
  title: "Pokoje Chios | Pokoje w Kambos dla par i rodzin",
  description:
    "Pokoje na Chios w spokojnym Kambos: opcje dwu- i trzyosobowe w Voulamandis House, Wi‑Fi, klimatyzacja, lodówka i rezerwacja bezpośrednia.",
});

export default function PolishRoomsPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="POKOJE NA CHIOS"
      title="Pokoje na Chios dla par i małych rodzin"
      intro="Voulamandis House oferuje pokoje dwu- i trzyosobowe w Kambos dla osób, które chcą połączyć spokojny pobyt z wygodną bazą do odkrywania wyspy Chios."
      highlights={["2–3 osoby", "Klimatyzacja", "Wi‑Fi", "Lodówka"]}
      bodyTitle="Jak wybrać pokój na Chios?"
      paragraphs={[
        "Przy wyborze pokoju na Chios warto zacząć od liczby osób, preferowanego poziomu budynku oraz tego, ile czasu planujesz spędzać w samym obiekcie. Dla par dobrym rozwiązaniem są pokoje dwuosobowe, a dla trzech osób dostępne są wybrane pokoje z dodatkowym miejscem do spania.",
        "W Voulamandis House dostępne są ekonomiczne pokoje dwuosobowe oraz standardowe pokoje dwu- i trzyosobowe. Część znajduje się na parterze, co może być wygodne dla osób, które wolą unikać schodów, a część na piętrze dla gości preferujących takie położenie pokoju.",
        "Wszystkie pokoje mają podstawowe udogodnienia potrzebne podczas wakacyjnego pobytu, w tym klimatyzację, Wi‑Fi i lodówkę. Obiekt znajduje się w spokojnym Kambos, dzięki czemu po dniu spędzonym na plaży, w mieście Chios lub podczas zwiedzania wyspy można wrócić do mniej ruchliwego otoczenia.",
        "Jeżeli potrzebujesz więcej przestrzeni dla rodziny lub małej grupy, przejdź do strony apartamentów na Chios. Jeśli natomiast porównujesz różne typy zakwaterowania, strona noclegi Chios pomoże Ci zobaczyć pełniejszy obraz dostępnych opcji pobytu w Voulamandis House.",
      ]}
      sections={[
        {
          title: "Ekonomiczne pokoje dwuosobowe",
          text: "Opcja dla dwóch osób, które szukają prostego i zadbanego pokoju na Chios oraz wolą przeznaczyć większą część dnia na zwiedzanie wyspy. Pokoje ekonomiczne są przeznaczone dla dwóch gości.",
        },
        {
          title: "Standardowe pokoje dwu- i trzyosobowe",
          text: "Dla par lub małych rodzin dostępne są także pokoje standardowe. Wybrane opcje mogą pomieścić do trzech osób i różnią się położeniem na parterze lub piętrze.",
        },
        {
          title: "Pokój na parterze czy na piętrze?",
          text: "Parter może być praktyczny dla osób, które chcą łatwiejszego dostępu bez schodów. Piętro jest alternatywą dla gości preferujących pokoje położone wyżej. Przy wyborze warto sprawdzić konkretną kategorię pokoju.",
        },
        {
          title: "Pokoje na Chios i lokalizacja w Kambos",
          text: "Kambos daje możliwość nocowania poza najbardziej ruchliwym centrum, a jednocześnie pozostaje praktyczną bazą do podróży po Chios. To dobry wybór dla osób ceniących spokój po całym dniu zwiedzania.",
        },
      ]}
      faq={[
        {
          question: "Dla ilu osób są pokoje w Voulamandis House?",
          answer: "Pokoje są przeznaczone głównie dla dwóch osób, a wybrane standardowe pokoje mogą pomieścić do trzech gości. Dla większej rodziny warto sprawdzić rodzinne apartamenty.",
        },
        {
          question: "Czy pokoje mają lodówkę i klimatyzację?",
          answer: "Tak. Pokoje mają lodówkę, klimatyzację oraz Wi‑Fi. Szczegóły konkretnej kategorii warto sprawdzić przed wyborem pokoju.",
        },
        {
          question: "Czy są pokoje na parterze bez schodów?",
          answer: "Tak, dostępne są pokoje na parterze. Przy sprawdzaniu dostępności możesz wybrać opcję odpowiednią do swoich potrzeb.",
        },
        {
          question: "Co wybrać dla czterech osób?",
          answer: "Dla czterech osób lepszym punktem wyjścia są rodzinne apartamenty. Zobacz stronę Apartamenty na Chios, gdzie opisujemy większe opcje zakwaterowania.",
        },
      ]}
      primaryHref="/pl/rezerwacja/"
      primaryLabel="Sprawdź dostępność"
      secondaryHref="/pl/apartamenty-na-chios/"
      secondaryLabel="Apartamenty rodzinne"
    />
  );
}

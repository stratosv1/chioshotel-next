import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/",
  title: "Noclegi Chios | Pokoje i apartamenty w Kambos",
  description:
    "Noclegi na Chios w spokojnym Kambos. Pokoje i rodzinne apartamenty Voulamandis House, praktyczna baza na wyspie i rezerwacja bezpośrednia.",
  imageAlt: "Voulamandis House w Kambos na wyspie Chios",
});

export default function PolishHomePage() {
  return (
    <PolishSeoLandingPage
      eyebrow="KAMBOS · CHIOS · VOULAMANDIS HOUSE"
      title="Noclegi na Chios — pokoje i apartamenty w spokojnym Kambos"
      intro="Szukasz noclegu na Chios, pokoju dla dwojga albo rodzinnego apartamentu? Voulamandis House oferuje spokojny pobyt w historycznym Kambos i bezpośredni kontakt przed rezerwacją."
      highlights={["Spokojny Kambos", "Pokoje dla par", "Apartamenty rodzinne", "Rezerwacja bezpośrednia"]}
      bodyTitle="Pobyt na Chios w kameralnym Voulamandis House"
      paragraphs={[
        "Voulamandis House to kameralny obiekt z pokojami i apartamentami w Kambos na wyspie Chios. Jest przeznaczony dla osób, które szukają spokojnego miejsca na wakacyjny pobyt i chcą mieć wygodną bazę do miasta, plaż, wiosek oraz innych części wyspy.",
        "Do wyboru są pokoje dwuosobowe, wybrane pokoje dla dwóch lub trzech osób oraz rodzinne apartamenty zapewniające więcej przestrzeni. Dzięki temu para, mała rodzina i czteroosobowa rodzina mogą zacząć wyszukiwanie od kategorii dopasowanej do liczby gości.",
        "Jeżeli w Google szukasz hotele Chios lub hotel Chios, możesz również porównać mniejsze obiekty noclegowe. Voulamandis House nie jest hotelem — oferuje pokoje i apartamenty w bardziej kameralnym otoczeniu Kambos.",
        "Na polskiej wersji strony znajdziesz osobne przewodniki dotyczące noclegów, pokoi, rodzinnych apartamentów, Kambos i rezerwacji bezpośredniej. Dzięki temu możesz najpierw poznać opcje, a dopiero potem wysłać zapytanie z konkretnymi datami i liczbą osób.",
      ]}
      sections={[
        {
          title: "Pokoje na Chios",
          text: "Dla par i małych rodzin dostępne są pokoje dwu- i trzyosobowe. Poszczególne opcje różnią się kategorią i położeniem, dlatego warto zacząć od strony Pokoje na Chios.",
        },
        {
          title: "Apartamenty na Chios",
          text: "Rodzinne apartamenty są przeznaczone dla osób potrzebujących większej przestrzeni. Mają aneks kuchenny i są naturalnym wyborem dla rodzin podróżujących w kilka osób.",
        },
        {
          title: "Noclegi w Kambos",
          text: "Kambos wyróżnia się historycznymi posiadłościami, kamiennymi murami i ogrodami cytrusowymi. To spokojniejsza baza niż najbardziej ruchliwe części miasta Chios.",
        },
        {
          title: "Hotele Chios — porównaj alternatywę",
          text: "Jeżeli zaczynasz od wyszukiwania hoteli na Chios, sprawdź także kameralną alternatywę. Na osobnej stronie wyjaśniamy różnicę między klasycznym hotelem a pobytem w Voulamandis House.",
        },
      ]}
      faq={[
        {
          question: "Jakie noclegi oferuje Voulamandis House?",
          answer: "Voulamandis House oferuje pokoje dwuosobowe, wybrane pokoje dla dwóch lub trzech osób oraz rodzinne apartamenty w Kambos na Chios.",
        },
        {
          question: "Czy Voulamandis House jest hotelem?",
          answer: "Nie. To kameralny obiekt noclegowy z pokojami i apartamentami. Osoby szukające hoteli na Chios mogą porównać go jako alternatywę dla klasycznego pobytu hotelowego.",
        },
        {
          question: "Gdzie znajduje się Voulamandis House?",
          answer: "Obiekt znajduje się w Kambos, historycznej części Chios znanej z kamiennych murów, dawnych posiadłości i ogrodów cytrusowych.",
        },
        {
          question: "Jak sprawdzić dostępność?",
          answer: "Przejdź do strony Rezerwacja, przygotuj datę przyjazdu, wyjazdu oraz liczbę osób i wyślij zapytanie e-mail lub WhatsApp.",
        },
      ]}
      primaryHref="/pl/pokoje-na-chios/"
      primaryLabel="Zobacz pokoje"
      secondaryHref="/pl/rezerwacja/"
      secondaryLabel="Sprawdź dostępność"
    />
  );
}

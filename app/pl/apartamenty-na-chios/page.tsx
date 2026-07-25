import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/apartamenty-na-chios/",
  title: "Apartamenty Chios | Rodzinne apartamenty w Kambos",
  description:
    "Rodzinne apartamenty na Chios w spokojnym Kambos. Więcej przestrzeni, aneks kuchenny, opcje dla rodzin i rezerwacja bezpośrednia w Voulamandis House.",
});

export default function PolishApartmentsPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="APARTAMENTY NA CHIOS"
      title="Rodzinne apartamenty na Chios w Kambos"
      intro="Dla rodzin i małych grup, które potrzebują więcej przestrzeni niż w standardowym pokoju, Voulamandis House oferuje rodzinne apartamenty w spokojnym Kambos na wyspie Chios."
      highlights={["Dla rodzin", "Do 4 osób", "Aneks kuchenny", "Kambos"]}
      bodyTitle="Apartament na Chios dla wygodniejszego rodzinnego pobytu"
      paragraphs={[
        "Apartament na Chios może być wygodniejszym rozwiązaniem dla rodziny, gdy ważna jest dodatkowa przestrzeń, oddzielenie części wypoczynkowej od miejsca do spania lub możliwość przygotowania prostego posiłku. W Voulamandis House rodzinne apartamenty są przeznaczone przede wszystkim dla rodzin oraz małych grup.",
        "Apartamenty znajdują się w Kambos, historycznej części wyspy znanej z kamiennych murów, dawnych posiadłości i ogrodów cytrusowych. Taka lokalizacja pozwala odpoczywać w spokojniejszym otoczeniu, a jednocześnie traktować obiekt jako bazę do miasta Chios, plaż i wycieczek po wyspie.",
        "Rodzinne apartamenty mają aneks kuchenny i lodówkę, co może być praktyczne podczas dłuższego pobytu lub wakacji z dziećmi. Standardowe konfiguracje są odpowiednie dla maksymalnie czterech osób; w przypadku szczególnych potrzeb warto skontaktować się bezpośrednio przed rezerwacją.",
        "Jeżeli podróżujesz we dwoje lub w trzy osoby i nie potrzebujesz dodatkowej przestrzeni apartamentu, zobacz również pokoje na Chios. Dzięki osobnym stronom łatwiej porównać typ zakwaterowania przed sprawdzeniem dostępności.",
      ]}
      sections={[
        {
          title: "Apartamenty na Chios dla rodzin",
          text: "Większa przestrzeń jest szczególnie przydatna podczas rodzinnych wakacji. Apartament pozwala lepiej zorganizować pobyt niż pojedynczy standardowy pokój, zwłaszcza gdy podróżujesz z dziećmi.",
        },
        {
          title: "Aneks kuchenny i lodówka",
          text: "Rodzinne apartamenty mają aneks kuchenny oraz lodówkę. To praktyczne rozwiązanie na śniadanie, przekąskę lub prosty posiłek, szczególnie podczas dłuższego pobytu na wyspie.",
        },
        {
          title: "Spokojny pobyt w Kambos",
          text: "Kambos jest odpowiedni dla osób, które nie chcą nocować w najbardziej ruchliwej części miasta. Historyczna okolica i zielone otoczenie tworzą spokojną bazę do rodzinnego wypoczynku.",
        },
        {
          title: "Pokoje czy apartament?",
          text: "Dla dwóch osób często wystarczy pokój dwuosobowy. Dla trzech osób można sprawdzić wybrane pokoje standardowe, a dla czteroosobowej rodziny naturalnym punktem wyjścia są rodzinne apartamenty.",
        },
      ]}
      faq={[
        {
          question: "Dla ilu osób są apartamenty na Chios w Voulamandis House?",
          answer: "Rodzinne apartamenty są standardowo przeznaczone dla maksymalnie czterech osób. Jeśli masz inne potrzeby, skontaktuj się z obiektem przed rezerwacją, aby sprawdzić możliwą konfigurację.",
        },
        {
          question: "Czy apartamenty mają aneks kuchenny?",
          answer: "Tak. Rodzinne apartamenty mają aneks kuchenny oraz lodówkę, co daje większą niezależność podczas pobytu.",
        },
        {
          question: "Czy apartament jest dobry dla rodziny z dziećmi?",
          answer: "Tak, szczególnie jeśli zależy Ci na większej przestrzeni niż w zwykłym pokoju oraz na możliwości przygotowania prostych posiłków lub przekąsek.",
        },
        {
          question: "Czy można zarezerwować apartament bezpośrednio?",
          answer: "Tak. Przejdź do strony rezerwacji, aby sprawdzić dostępność i skontaktować się bezpośrednio z Voulamandis House.",
        },
      ]}
      primaryHref="/pl/rezerwacja/"
      primaryLabel="Sprawdź dostępność"
      secondaryHref="/pl/pokoje-na-chios/"
      secondaryLabel="Zobacz pokoje"
    />
  );
}

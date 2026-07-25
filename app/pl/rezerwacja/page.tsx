import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/rezerwacja/",
  title: "Rezerwacja Chios | Pokoje i apartamenty bezpośrednio",
  description:
    "Sprawdź pobyt w Voulamandis House na Chios. Wybierz pokój lub apartament, podaj daty i liczbę osób, a następnie skontaktuj się bezpośrednio z obiektem.",
});

const whatsappHref =
  "https://wa.me/306944474226?text=Dzie%C5%84%20dobry%2C%20chc%C4%99%20sprawdzi%C4%87%20dost%C4%99pno%C5%9B%C4%87%20pokoju%20lub%20apartamentu%20na%20Chios.";

export default function PolishBookingPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="REZERWACJA BEZPOŚREDNIA"
      title="Sprawdź dostępność pokoju lub apartamentu na Chios"
      intro="Wybierz rodzaj zakwaterowania, przygotuj daty pobytu i liczbę osób, a następnie skontaktuj się bezpośrednio z Voulamandis House, aby sprawdzić aktualną dostępność."
      highlights={["Bezpośredni kontakt", "Pokoje i apartamenty", "Daty + liczba osób", "Kambos"]}
      bodyTitle="Jak zapytać o pobyt w Voulamandis House?"
      paragraphs={[
        "Najpierw wybierz rodzaj zakwaterowania odpowiadający Twojej podróży. Dla dwóch osób możesz zacząć od pokoi dwuosobowych, dla dwóch lub trzech osób sprawdzić pokoje standardowe, a dla rodziny potrzebującej większej przestrzeni przejść do apartamentów rodzinnych.",
        "Przy zapytaniu podaj datę przyjazdu, datę wyjazdu oraz liczbę gości. Dzięki temu można sprawdzić aktualną dostępność dla konkretnego terminu zamiast opierać się na ogólnych informacjach o pokojach.",
        "Voulamandis House jest kameralnym obiektem noclegowym w Kambos, a nie hotelem. Bezpośredni kontakt jest przydatny, gdy chcesz dobrać pokój do liczby osób, zapytać o piętro, apartament rodzinny lub inną praktyczną kwestię przed pobytem.",
        "Możesz wysłać wiadomość e-mail albo skontaktować się przez WhatsApp. Jeśli nie wiesz jeszcze, który typ zakwaterowania wybrać, najpierw zobacz stronę z pokojami i apartamentami, a później wróć tutaj z konkretnymi datami.",
      ]}
      sections={[
        {
          title: "1. Podaj daty",
          text: "Potrzebne są data przyjazdu i data wyjazdu. Dostępność zmienia się w zależności od terminu, dlatego konkretne daty pozwalają przygotować użyteczną odpowiedź.",
        },
        {
          title: "2. Podaj liczbę gości",
          text: "Liczba osób wpływa na wybór pokoju lub apartamentu. Pary mają więcej możliwości, natomiast rodziny mogą od razu skupić się na większych pokojach i apartamentach.",
        },
        {
          title: "3. Wybierz typ zakwaterowania",
          text: "Jeżeli masz już preferencję — pokój ekonomiczny, standardowy lub apartament rodzinny — napisz o tym w wiadomości. Jeśli nie, obiekt może pomóc zawęzić dostępne opcje.",
        },
        {
          title: "4. Skontaktuj się bezpośrednio",
          text: "Wyślij zapytanie e-mail lub WhatsApp. Podanie kompletu informacji w pierwszej wiadomości ułatwia szybsze sprawdzenie odpowiedniej opcji pobytu.",
        },
      ]}
      faq={[
        {
          question: "Jakie informacje podać w zapytaniu o rezerwację?",
          answer: "Najważniejsze są data przyjazdu, data wyjazdu i liczba osób. Możesz też dodać preferowany typ pokoju, informację o dzieciach lub potrzebę apartamentu rodzinnego.",
        },
        {
          question: "Czy mogę napisać po polsku?",
          answer: "Tak, możesz wysłać zapytanie po polsku. Najważniejsze jest podanie dat oraz liczby osób, aby można było sprawdzić odpowiednią opcję pobytu.",
        },
        {
          question: "Czy przez tę stronę rezerwuję hotel na Chios?",
          answer: "Nie. Voulamandis House nie jest hotelem. Oferuje pokoje i rodzinne apartamenty w Kambos, a ta strona służy do bezpośredniego zapytania o dostępność pobytu.",
        },
        {
          question: "Co zrobić, jeśli nie wiem, który pokój wybrać?",
          answer: "Zobacz stronę Pokoje na Chios oraz Apartamenty na Chios. Jeśli nadal nie masz pewności, wyślij daty i liczbę osób — to wystarczy, aby zacząć sprawdzanie dostępnych opcji.",
        },
      ]}
      primaryHref="mailto:info@chioshotel.gr?subject=Rezerwacja%20Chios%20-%20zapytanie%20po%20polsku"
      primaryLabel="Wyślij e-mail"
      secondaryHref={whatsappHref}
      secondaryLabel="Napisz na WhatsApp"
    />
  );
}

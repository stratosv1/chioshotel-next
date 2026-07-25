import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/apartamenty-na-chios/",
  title: "Apartamenty na Chios | Rodzinny pobyt w Kambos",
  description:
    "Rodzinne apartamenty na Chios w spokojnym Kambos. Więcej przestrzeni, aneks kuchenny i wygodna baza blisko miasta, lotniska oraz plaż.",
});

export default function PolishApartmentsPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="APARTAMENTY NA CHIOS"
      title="Rodzinne apartamenty na Chios w Kambos"
      intro="Dla rodzin i małych grup, które potrzebują więcej przestrzeni, Voulamandis House oferuje apartamenty w spokojnej części Kambos na wyspie Chios."
      highlights={["Dla rodzin", "Więcej przestrzeni", "Aneks kuchenny", "Kambos"]}
      bodyTitle="Apartament na Chios dla wygodniejszego rodzinnego pobytu"
      paragraphs={[
        "Apartament rodzinny sprawdza się wtedy, gdy ważna jest dodatkowa przestrzeń, możliwość przygotowania prostego posiłku i spokojne miejsce do odpoczynku po całym dniu na wyspie.",
        "Kambos jest dogodnym punktem dla rodzin: pozostaje blisko miasta Chios i lotniska, a jednocześnie pozwala odpocząć z dala od najbardziej ruchliwych części miasta.",
        "Jeśli nie potrzebujesz apartamentu, sprawdź także pokoje dwu- i trzyosobowe. W przypadku większej rodziny skontaktuj się z nami przed rezerwacją, aby dobrać najlepszą konfigurację.",
      ]}
      primaryHref="/pl/rezerwacja/"
      primaryLabel="Sprawdź dostępność"
      secondaryHref="/pl/pokoje-na-chios/"
      secondaryLabel="Zobacz pokoje"
    />
  );
}

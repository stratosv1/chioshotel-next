import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/kambos-chios/",
  title: "Kambos Chios | Spokojny nocleg w historycznej części wyspy",
  description:
    "Kambos na Chios to historyczna dzielnica z cytrusowymi ogrodami i kamiennymi murami. Poznaj spokojną bazę na pobyt w Voulamandis House.",
});

export default function PolishKambosPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="KAMBOS · CHIOS"
      title="Kambos na Chios — spokojna baza w historycznym otoczeniu"
      intro="Kambos to jedna z najbardziej charakterystycznych części Chios: kamienne mury, dawne rezydencje, ogrody cytrusowe i spokojne uliczki tworzą zupełnie inny rytm pobytu niż w centrum miasta."
      highlights={["Historyczny Kambos", "Ogrody cytrusowe", "Blisko miasta", "Spokojne wieczory"]}
      bodyTitle="Dlaczego warto nocować w Kambos?"
      paragraphs={[
        "Kambos leży na południe od miasta Chios i od wieków jest związany z cytrusowymi ogrodami oraz charakterystyczną architekturą wyspy. Wysokie kamienne mury, stare bramy i zielone posesje nadają tej okolicy wyjątkowy charakter.",
        "To dobre miejsce dla par i rodzin, które chcą mieć blisko do miasta, lotniska i plaż, ale po całym dniu wracać do spokojniejszego otoczenia.",
        "Voulamandis House mieści się właśnie tutaj. Dzięki temu pobyt łączy praktyczną lokalizację z bardziej autentycznym doświadczeniem Chios.",
      ]}
      primaryHref="/pl/noclegi-chios/"
      primaryLabel="Noclegi w Kambos"
      secondaryHref="/pl/rezerwacja/"
      secondaryLabel="Sprawdź dostępność"
    />
  );
}

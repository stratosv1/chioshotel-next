import { PolishSeoLandingPage } from "@/components/landing/PolishSeoLandingPage";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/kambos-chios/",
  title: "Kambos Chios | Noclegi w historycznej części wyspy",
  description:
    "Kambos na Chios: historyczna okolica z kamiennymi murami, dawnymi rezydencjami i ogrodami cytrusowymi. Spokojny pobyt w Voulamandis House.",
});

export default function PolishKambosPage() {
  return (
    <PolishSeoLandingPage
      eyebrow="KAMBOS · CHIOS"
      title="Kambos na Chios — spokojna baza w historycznym otoczeniu"
      intro="Kambos to jedna z najbardziej charakterystycznych części Chios: kamienne mury, dawne rezydencje, ogrody cytrusowe i spokojne uliczki tworzą zupełnie inny rytm pobytu niż w centrum miasta."
      highlights={["Historyczny Kambos", "Ogrody cytrusowe", "Spokojne uliczki", "Praktyczna baza na Chios"]}
      bodyTitle="Dlaczego warto nocować w Kambos na Chios?"
      paragraphs={[
        "Kambos leży na południe od miasta Chios i od wieków jest związany z cytrusowymi ogrodami oraz charakterystyczną architekturą wyspy. Wysokie kamienne mury, stare bramy, dawne rezydencje i zielone posesje sprawiają, że okolica ma własny, rozpoznawalny charakter.",
        "Dla podróżnych Kambos jest interesujący przede wszystkim dlatego, że łączy spokojniejsze otoczenie z praktycznym położeniem. Można spędzać dzień w mieście, na plażach lub podczas zwiedzania południowej części wyspy, a wieczorem wrócić do miejsca oddalonego od największego miejskiego ruchu.",
        "Voulamandis House znajduje się właśnie w Kambos. Pobyt tutaj nie polega wyłącznie na znalezieniu pokoju na noc — okolica jest częścią doświadczenia Chios. Ogrody, cytrusowe zapachy, kamienne ogrodzenia i spokojne wieczory tworzą atmosferę szczególnie cenioną przez pary i rodziny szukające odpoczynku.",
        "Jeżeli zastanawiasz się, gdzie nocować na Chios, warto porównać Kambos z pobytem w samym centrum miasta. Osoby, dla których najważniejsze są nocne życie i miejski ruch tuż za drzwiami, mogą preferować centrum. Jeśli jednak priorytetem jest cisza, charakter miejsca i wygodna baza do zwiedzania, Kambos może pasować znacznie lepiej.",
      ]}
      sections={[
        {
          title: "Kamienne mury i dawne rezydencje",
          text: "Kambos jest znany z wysokich kamiennych murów, ozdobnych bram oraz historycznych posiadłości. To krajobraz odmienny od typowych nadmorskich kurortów i ważna część lokalnej tożsamości Chios.",
        },
        {
          title: "Ogrody cytrusowe",
          text: "Cytrusy są jednym z najbardziej charakterystycznych elementów Kambos. Ogrody i drzewa cytrusowe od pokoleń kształtują wygląd, zapach i codzienny rytm tej części wyspy.",
        },
        {
          title: "Spokojne wieczory po zwiedzaniu",
          text: "Po dniu spędzonym na plaży, w mieście lub w wioskach południowego Chios można wrócić do spokojniejszego otoczenia i odpocząć z dala od największego ruchu turystycznego.",
        },
        {
          title: "Kambos jako baza na wyspie",
          text: "Położenie Kambos sprawdza się dla osób, które planują łączyć miasto Chios, południowe plaże, wioski i lokalne atrakcje podczas jednego pobytu, bez konieczności nocowania w najbardziej zatłoczonym miejscu.",
        },
      ]}
      faq={[
        {
          question: "Czym jest Kambos na Chios?",
          answer: "Kambos to historyczna część Chios znana z dawnych posiadłości, wysokich kamiennych murów i ogrodów cytrusowych. Ma spokojniejszy, bardziej zielony charakter niż centrum miasta.",
        },
        {
          question: "Czy Kambos jest dobry dla rodzin?",
          answer: "Tak, szczególnie dla rodzin, które cenią spokojniejsze otoczenie i chcą mieć bazę do zwiedzania wyspy. Voulamandis House oferuje zarówno pokoje, jak i rodzinne apartamenty.",
        },
        {
          question: "Czy warto nocować w Kambos zamiast w centrum Chios?",
          answer: "To zależy od stylu podróży. Centrum jest odpowiednie dla osób chcących być w samym środku miejskiego ruchu. Kambos lepiej odpowiada gościom szukającym ciszy i historycznego otoczenia.",
        },
        {
          question: "Jak znaleźć nocleg w Kambos?",
          answer: "Przejdź do strony Noclegi na Chios lub Pokoje na Chios, aby zobaczyć opcje Voulamandis House, a następnie sprawdź stronę rezerwacji bezpośredniej.",
        },
      ]}
      primaryHref="/pl/noclegi-chios/"
      primaryLabel="Noclegi w Kambos"
      secondaryHref="/pl/rezerwacja/"
      secondaryLabel="Sprawdź dostępność"
    />
  );
}

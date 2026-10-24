import type { ReactNode } from "react";
import { PracticeClient } from "./PracticeClient";
import { TheoryHero } from "./TheoryHero";
import { Trapeza } from "./Trapeza";

/** Open section: no card, just a numbered heading and a hairline on top. */
function Section({ id, n, kicker, title, intro, children }: { id: string; n: string; kicker: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-14 border-t border-black/10 py-12 sm:py-16">
      <div className="flex items-start gap-4 sm:gap-6">
        <span aria-hidden="true" className="text-4xl font-bold leading-none text-transparent sm:text-7xl" style={{ WebkitTextStroke: "1.5px #c9822f" }}>
          {n}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">{kicker}</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          {intro ? <div className="mt-3 max-w-2xl text-[15px] leading-7 text-[#5c534c]">{intro}</div> : null}
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

const nav: [string, string][] = [
  ["#theoria", "Θεωρία"],
  ["#trapeza", "Τράπεζα Θεμάτων"],
  ["#eksaskisi", "Εξάσκηση"],
];

export function DianismataPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] text-[#2c2825]">
      <TheoryHero />

      <nav className="sticky top-0 z-20 border-b border-black/10 bg-[#f3efe8]/90 backdrop-blur" aria-label="Ενότητες">
        <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-3 py-2 sm:px-6">
          {nav.map(([href, label]) => (
            <a key={href} href={href} className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold text-[#4d4138] hover:bg-black/5">
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Section
          id="trapeza"
          n="2"
          kicker="Τράπεζα Θεμάτων"
          title="Θέματα 2 και 4, λυμένα και εξηγημένα"
          intro={
            <p>
              Κάνε τα <b>αφού δεις τη θεωρία</b>. Είναι σε σειρά: πρώτα όσα θέλουν μόνο συντεταγμένες, στο τέλος όσα έχουν το σήμα «§1.5»
              (εσωτερικό γινόμενο, έρχεται αργότερα). Πάτα ένα θέμα για να ανοίξει. Λύσε στο τετράδιο· αν κολλήσεις, άνοιξε την <b>υπόδειξη</b>.
              Η <b>λύση</b> ανοίγει ένα βήμα τη φορά.
            </p>
          }
        >
          <Trapeza />
        </Section>

        <Section
          id="eksaskisi"
          n="3"
          kicker="Εξάσκηση"
          title="Ασκήσεις με νέους αριθμούς κάθε φορά"
          intro={
            <p>
              Συντεταγμένες, μέτρο, εσωτερικό γινόμενο, παραλληλία, καθετότητα, γωνία. Γράψε την απάντηση και πάτα «Έλεγχος». Κάθε «Νέα άσκηση» βγάζει
              άλλους αριθμούς.
            </p>
          }
        >
          <PracticeClient />
        </Section>

        <p className="border-t border-black/10 py-8 text-center text-xs text-[#857261]">
          Πηγή εκφωνήσεων: Τράπεζα Θεμάτων Διαβαθμισμένης Δυσκολίας (ΙΕΠ), Μαθηματικά Προσανατολισμού Β΄ Λυκείου, Κεφ. 1 Διανύσματα. Τα σχήματα είναι
          ξανασχεδιασμένα.
        </p>
      </div>
    </main>
  );
}

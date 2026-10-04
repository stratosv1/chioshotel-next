"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Practice } from "./Practice";
import { Trapeza } from "./Trapeza";

function Section({ id, kicker, title, intro, children }: { id: string; kicker: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">{kicker}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {intro ? <div className="mt-3 max-w-3xl text-[15px] leading-7 text-[#5c534c]">{intro}</div> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function DianismataPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-3xl bg-[#2c2825] p-6 text-white shadow-sm sm:p-10">
          <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-white/60 hover:text-white">
            ← Αρχική
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#e7b77a]">Μαθηματικά Προσανατολισμού · Β΄ Λυκείου</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Διανύσματα</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/80">
            Θέματα της Τράπεζας Θεμάτων λυμένα βήμα-βήμα, και ασκήσεις εξάσκησης με αυτόματο έλεγχο. Λύσε πρώτα στο τετράδιο. Αν κολλήσεις, άνοιξε
            την <b className="text-white">υπόδειξη</b>. Η <b className="text-white">λύση</b> ανοίγει ένα βήμα τη φορά, ώστε να συνεχίσεις μόνος σου
            μόλις καταλάβεις το κόλπο.
          </p>
        </header>

        <nav className="sticky top-0 z-10 -mx-4 flex gap-2 overflow-x-auto bg-[#f3efe8]/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-2xl sm:px-2">
          {[
            ["#trapeza", "Τράπεζα Θεμάτων"],
            ["#eksaskisi", "Εξάσκηση"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#4d4138] hover:bg-[#fdf3e6]"
            >
              {label}
            </a>
          ))}
        </nav>

        <Section
          id="trapeza"
          kicker="1 · Τράπεζα Θεμάτων"
          title="Θέματα 2 και 4, λυμένα και εξηγημένα"
          intro={
            <p>
              Τα θέματα είναι σε σειρά δυσκολίας: πρώτα τα Θέματα 2, μετά τα Θέματα 4. Μετά από κάθε λύση σημείωσε αν το είχες σωστά ή θέλεις
              επανάληψη· το φίλτρο «Για επανάληψη» σου δείχνει μόνο όσα δεν έχεις ακόμα κατακτήσει.
            </p>
          }
        >
          <Trapeza />
        </Section>

        <Section
          id="eksaskisi"
          kicker="2 · Εξάσκηση"
          title="Ασκήσεις με νέους αριθμούς κάθε φορά"
          intro={
            <p>
              Οι βασικοί υπολογισμοί που χρειάζονται τα θέματα: συντεταγμένες, μέτρο, εσωτερικό γινόμενο, παραλληλία, καθετότητα, γωνία. Γράψε την
              απάντηση και πάτα «Έλεγχος». Κάθε «Νέα άσκηση» βγάζει άλλους αριθμούς.
            </p>
          }
        >
          <Practice />
        </Section>

        <p className="pb-6 text-center text-xs text-[#857261]">
          Πηγή εκφωνήσεων: Τράπεζα Θεμάτων Διαβαθμισμένης Δυσκολίας (ΙΕΠ), Μαθηματικά Προσανατολισμού Β΄ Λυκείου, Κεφ. 1 Διανύσματα. Τα σχήματα είναι
          ξανασχεδιασμένα.
        </p>
      </div>
    </main>
  );
}

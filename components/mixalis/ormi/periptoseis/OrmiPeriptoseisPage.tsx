import Link from "next/link";
import type { ReactNode } from "react";
import { StudyBar } from "@/components/mixalis/study/StudyBar";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { Reveal } from "@/components/mixalis/esoteriko/Reveal";
import { Shell, type CaseSlide } from "@/components/mixalis/esoteriko/Shell";
import { rich } from "@/components/mixalis/esoteriko/rich";
import { BANK_MAP, FIRST_MOVES, FORMULAS, GROUPS, type Case } from "./cases";

/** Τα σημάδια μελέτης μπαίνουν στο μάθημα «Ορμή και κρούσεις», με id p… για να μη μπερδεύονται με τα κουτάκια του poster. */
const LESSON = "ormi";
const PATH = "/mixalis/ormi/periptoseis";

/** Ενότητα μέσα σε λευκή κάρτα (η κάρτα έρχεται από το Shell): αριθμός, τίτλος, εισαγωγή. */
function Section({ id, n, kicker, title, intro, children }: { id: string; n: string; kicker: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 py-8 sm:py-10">
      <div className="flex items-start gap-4 sm:gap-6">
        <span aria-hidden="true" className="text-5xl font-bold leading-none text-transparent sm:text-7xl" style={{ WebkitTextStroke: "1.5px #c9822f" }}>
          {n}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">{kicker}</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          {intro ? <div className="mt-3 max-w-3xl text-[17px] leading-8 text-[#5c534c]">{intro}</div> : null}
        </div>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function CaseBlock({ c }: { c: Case }) {
  return (
    <article id={c.id} data-study-lesson={LESSON} data-study-id={c.id} className="scroll-mt-20">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-lg font-bold text-[#c9822f]">{c.code}</span>
        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{rich(c.title)}</h3>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-6 text-[17px] leading-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#857261]">Μιχάλη, θα σου ζητήσουν</p>
            <p className="mt-1 text-[#2c2825]">{rich(c.ask)}</p>
          </div>
          <div className="border-l-4 border-[#c9822f] pl-4">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#a8651f]">Τότε σκέψου</p>
            <p className="mt-1 text-[19px] font-medium leading-8 text-[#2c2825]">{rich(c.think)}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#857261]">Και κάνε αυτά</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-6 text-[#2c2825] marker:font-bold marker:text-[#c9822f]">
              {c.todo.map((t, i) => (
                <li key={i}>{rich(t)}</li>
              ))}
            </ol>
          </div>
          {c.watch ? (
            <p className="text-[#5c534c]">
              <b className="text-[#8a2f22]">Πρόσεξε: </b>
              {rich(c.watch)}
            </p>
          ) : null}
          <p className="text-sm text-[#857261]">Από: {c.sources}</p>
        </div>

        <div className="lg:border-l lg:border-black/10 lg:pl-14">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0e6e66]">Λυμένο παράδειγμα</p>
          <p className="mt-1 text-[18px] leading-8 text-[#2c2825]">{rich(c.example.q)}</p>
          <Reveal steps={c.example.steps.map((s) => rich(s))} answer={rich(c.example.answer)} />
        </div>
      </div>

      <StudyMark lesson={LESSON} id={c.id} title={`Περιπτώσεις ${c.code} · ${c.title}`} path={PATH} className="mt-8" />
    </article>
  );
}

export function OrmiPeriptoseisPage() {
  const slides: CaseSlide[] = GROUPS.flatMap((g) =>
    g.cases.map((c) => ({
      id: c.id,
      code: c.code,
      title: c.title,
      group: g.letter,
      groupTitle: g.title,
      groupIntro: <p>{rich(g.intro)}</p>,
      node: <CaseBlock c={c} />,
    })),
  );
  const total = slides.length;

  return (
    <main className="min-h-screen bg-[#f3efe8] text-[#2c2825]">
      <div className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-8 sm:pt-8">
      <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-[#857261]">
          <Link href="/mixalis" prefetch={false} className="hover:underline">
            ← Τα μαθήματά μου
          </Link>
          <Link href="/mixalis/ormi" prefetch={false} className="hover:underline">
            Ορμή και κρούσεις: τυπολόγιο, μάθημα, ασκήσεις
          </Link>
        </div>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Προσανατολισμού Β΄ Λυκείου · §2.3–2.7</p>
        <h1 className="mt-2 max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl">Ορμή και κρούσεις: οι περιπτώσεις ασκήσεων</h1>
        <p className="mt-5 max-w-3xl text-[19px] leading-9 text-[#5c534c]">
          Μιχάλη, τα 142 θέματα της Τράπεζας για την ορμή μοιάζουν πολλά, αλλά είναι <b>{total} περιπτώσεις</b> που επαναλαμβάνονται. Για καθεμία θα δεις τι
          θα σου ζητήσουν, τι πρέπει να σκεφτείς και τι κάνεις βήμα-βήμα, με μια λυμένη άσκηση. Διάλεξε περίπτωση από τα κουμπάκια Α1…Δ5 ή προχώρα με
          «Επόμενη». Λύσε πρώτα στο τετράδιο και μετά άνοιξε τη λύση.
        </p>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#857261]">
          Από την Τράπεζα Θεμάτων ΙΕΠ (§2.3–2.7). Τα παραδείγματα έχουν απλούς αριθμούς και ακολουθούν τα θέματα της Τράπεζας.
        </p>
      </header>

      <div className="py-6">
        <StudyBar lesson={LESSON} />
      </div>
      </div>

      <Shell
        boxed
        lesson={LESSON}
        cases={slides}
        panels={[
          {
            id: "protakinisi",
            label: "Τι σου ζητάνε",
            node: (
              <Section id="protakinisi" n="1" kicker="Πριν από κάθε άσκηση" title="Πρώτα ρώτα: τι μου ζητάνε;" intro={<p>Η λέξη της εκφώνησης σού λέει σχεδόν πάντα την πρώτη κίνηση. Και πάντα, πριν από οτιδήποτε άλλο: ποια είναι η θετική φορά;</p>}>
                <table className="w-full max-w-5xl text-left text-[17px]">
                  <thead>
                    <tr className="border-b-2 border-[#2c2825]/70">
                      <th className="py-3 pr-6 font-semibold">Αν η εκφώνηση λέει…</th>
                      <th className="py-3 font-semibold">…τότε σκέψου</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FIRST_MOVES.map(([a, b]) => (
                      <tr key={a} className="border-b border-black/10">
                        <td className="py-3 pr-6 text-[#5c534c]">{rich(a)}</td>
                        <td className="py-3 font-medium">{rich(b)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            ),
          },
          {
            id: "typologio",
            label: "Τυπολόγιο",
            node: (
              <Section id="typologio" n="2" kicker="Τυπολόγιο" title="Όλοι οι τύποι σε μία ματιά">
                <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                  {FORMULAS.map(([label, lines]) => (
                    <div key={label} className="border-t-2 border-[#0e6e66] pt-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0e6e66]">{label}</p>
                      {lines.map((l) => (
                        <p key={l} className="mt-2 text-[20px] leading-9">
                          {rich(l)}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </Section>
            ),
          },
          {
            id: "kanones",
            label: "Φορά και ενέργεια",
            node: (
              <Section
                id="kanones"
                n="3"
                kicker="Τα τρία πράγματα που κρίνουν τις μονάδες"
                title="Φορά, σύστημα, ενέργεια"
                intro={<p>Οι περισσότερες μονάδες χάνονται σε αυτά τα τρία, όχι στις πράξεις.</p>}
              >
                <div className="grid gap-10 sm:grid-cols-3">
                  {[
                    [
                      "1 · Θετική φορά",
                      "Πρόσημο σε κάθε ταχύτητα",
                      "Η ορμή είναι διάνυσμα. Ορίζεις θετική φορά στην αρχή, και ό,τι κινείται αντίθετα μπαίνει με μείον. Αν η άγνωστη ταχύτητα βγει αρνητική, κινείται αντίθετα.",
                    ],
                    [
                      "2 · Μονωμένο σύστημα",
                      "ΑΔΟ μόνο για το σύστημα",
                      "Στην κρούση και στην έκρηξη οι εσωτερικές δυνάμεις είναι τεράστιες και κρατούν ελάχιστο χρόνο, οπότε βάρος και τριβή αγνοούνται. Η ΑΔΟ ισχύει «ακριβώς πριν» και «ακριβώς μετά».",
                    ],
                    [
                      "3 · Ενέργεια",
                      "Η ορμή διατηρείται, η K όχι",
                      "Στην πλαστική κρούση χάνεται κινητική ενέργεια (γίνεται θερμότητα). Στην έκρηξη κερδίζεται. Ποτέ δεν γράφεις K_πριν = K_μετά σε πλαστική κρούση.",
                    ],
                  ].map(([h, big, t]) => (
                    <div key={h} className="border-t-2 border-[#c9822f] pt-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#a8651f]">{h}</p>
                      <p className="mt-2 text-2xl font-semibold">{big}</p>
                      <p className="mt-2 text-[17px] leading-7 text-[#5c534c]">{t}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-12 max-w-3xl border-l-4 border-[#0e6e66] pl-4 text-[19px] leading-8">
                  Πριν και μετά την κρούση ισχύουν τα «κανονικά» εργαλεία: ΑΔΜΕ, ΘΜΚΕ, κινηματική, οριζόντια βολή, κυκλική κίνηση. Η ΑΔΟ καλύπτει{" "}
                  <b>μόνο</b> τη στιγμή της κρούσης.
                </p>
              </Section>
            ),
          },
          {
            id: "trapeza",
            label: "Τράπεζα Θεμάτων",
            node: (
              <Section
                id="trapeza"
                n="4"
                kicker="Τράπεζα Θεμάτων ΙΕΠ"
                title="Τα θέματα της Τράπεζας για τις §2.3–2.7"
                intro={<p>Κάθε θέμα της Τράπεζας ανήκει σε μία από τις περιπτώσεις. Πάτα την περίπτωση για να δεις τη μέθοδο.</p>}
              >
                <table className="w-full max-w-5xl text-left text-[17px]">
                  <thead>
                    <tr className="border-b-2 border-[#2c2825]/70">
                      <th className="py-3 pr-6 font-semibold">Περίπτωση</th>
                      <th className="py-3 pr-6 font-semibold">Θέματα</th>
                      <th className="py-3 font-semibold">Δες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BANK_MAP.map(([label, codes, id, code]) => (
                      <tr key={id} className="border-b border-black/10">
                        <td className="py-3 pr-6">{label}</td>
                        <td className="py-3 pr-6 text-[#5c534c]">{codes}</td>
                        <td className="py-3">
                          <a href={`#${id}`} className="font-semibold text-[#a8651f] underline underline-offset-2">
                            {code}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#857261]">
                  Από τα 142 θέματα της Τράπεζας για τις §2.3–2.7, τα 104 που έχουν κείμενο είναι κατανεμημένα στις περιπτώσεις. Τα υπόλοιπα 38 υπάρχουν
                  μόνο ως εικόνα στην Τράπεζα. Τα Θέματα 2 λυμένα ένα-ένα θα τα βρεις στη{" "}
                  <Link href="/mixalis/ormi#trapeza" prefetch={false} className="font-semibold text-[#a8651f] underline underline-offset-2">
                    σελίδα της ορμής
                  </Link>
                  .
                </p>

                <h3 className="mt-14 text-2xl font-semibold tracking-tight">Με ποια σειρά να τα δουλέψεις</h3>
                <div className="mt-6 grid gap-10 sm:grid-cols-3">
                  {[
                    ["1", "Η βάση", "Α2, Α3 · Β1–Β3 · Γ1", "Πέφτουν σχεδόν σε κάθε Θέμα 2 και ανοίγουν κάθε Θέμα 4."],
                    ["2", "Οι παγίδες", "Α1, Α4–Α6 · Β4 · Γ2, Γ3", "Εδώ χάνονται οι μονάδες: πρόσημα, ποιο σώμα, ποιο ποσοστό."],
                    ["3", "Για το Θέμα 4", "Δ1–Δ5 · Β5, Β6", "Συνδυασμοί με βολή, τριβή, κύκλο και πεδία, όταν τα προηγούμενα είναι σίγουρα."],
                  ].map(([num, h, r, t]) => (
                    <div key={num} className="border-t-2 border-[#2c2825] pt-3">
                      <p className="text-5xl font-bold text-[#c9822f]">{num}</p>
                      <p className="mt-2 text-xl font-semibold">{h}</p>
                      <p className="mt-1 text-lg font-medium text-[#5c534c]">{r}</p>
                      <p className="mt-2 text-[17px] leading-7 text-[#5c534c]">{t}</p>
                    </div>
                  ))}
                </div>
              </Section>
            ),
          },
        ]}
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        <p className="py-8 text-center text-sm text-[#857261]">
          Πηγές: Τράπεζα Θεμάτων Διαβαθμισμένης Δυσκολίας (ΙΕΠ), Φυσική Προσανατολισμού Β΄ Λυκείου, §2.3–2.7. g = 10 m/s² σε όλα τα παραδείγματα.
        </p>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { StudyBar } from "@/components/mixalis/study/StudyBar";
import { OrmiNav } from "@/components/mixalis/ormi/OrmiNav";
import { TrapezaOrmi } from "@/components/mixalis/ormi/trapeza/TrapezaOrmi";
import { BANK } from "@/components/mixalis/ormi/trapeza/data";
import { BANK_MAP, GROUPS } from "@/components/mixalis/ormi/periptoseis/cases";
import { rich } from "@/components/mixalis/esoteriko/rich";

export const metadata: Metadata = {
  title: { absolute: "Ορμή και κρούσεις · Τράπεζα Θεμάτων · Physics Workspace" },
  description:
    "Όλη η Τράπεζα Θεμάτων για την ορμή (§2.3–2.7) σε ένα σημείο: οι 20 περιπτώσεις με τα θέματα που ανήκουν σε καθεμία, και τα Θέματα 2 λυμένα ένα-ένα.",
  robots: { index: false, follow: false },
};

/** Για κάθε κωδικό Τράπεζας, το πρώτο λυμένο Θέμα 2 που έχουμε (anchor του TrapezaOrmi: tq-<code>-<part>). */
const SOLVED = new Map<string, string>();
for (const q of BANK) if (!SOLVED.has(q.code)) SOLVED.set(q.code, `tq-${q.code}-${q.part}`);

/** Περίπτωση → θέματα Τράπεζας (από τον πίνακα BANK_MAP των περιπτώσεων). */
const CODES_BY_CASE = new Map(BANK_MAP.map(([, codes, id]) => [id, codes.split(",").map((c) => c.trim()).filter(Boolean)]));

const ORDER: [string, string, string, string][] = [
  ["1", "Η βάση", "Α2, Α3 · Β1–Β3 · Γ1", "Πέφτουν σχεδόν σε κάθε Θέμα 2 και ανοίγουν κάθε Θέμα 4."],
  ["2", "Οι παγίδες", "Α1, Α4–Α6 · Β4 · Γ2, Γ3", "Εδώ χάνονται οι μονάδες: πρόσημα, ποιο σώμα, ποιο ποσοστό."],
  ["3", "Για το Θέμα 4", "Δ1–Δ5 · Β5, Β6", "Συνδυασμοί με βολή, τριβή, κύκλο και πεδία, όταν τα προηγούμενα είναι σίγουρα."],
];

export default function OrmiTrapezaPage() {
  const solvedCount = SOLVED.size;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <OrmiNav active="trapeza" />

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Προσανατολισμού Β΄ Λυκείου · Βήμα 3 · §2.3–2.7</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Ορμή και κρούσεις: Τράπεζα Θεμάτων</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            Όλη η Τράπεζα της ορμής σε ένα σημείο. Τα 142 θέματα είναι στην ουσία <b>20 περιπτώσεις</b> που επαναλαμβάνονται. Πρώτα μάθε τη μέθοδο κάθε
            περίπτωσης, μετά λύσε τα πραγματικά θέματα που ανήκουν σε αυτή. Οι κωδικοί με <b className="text-[#a8651f]">πορτοκαλί</b> είναι λυμένοι πιο
            κάτω (Θέμα 2): πάτα τον κωδικό και θα σε πάει κατευθείαν εκεί.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            <a href="#periptoseis" className="rounded-full bg-[#2c2825] px-4 py-1.5 text-white hover:bg-black">
              Οι 20 περιπτώσεις ↓
            </a>
            <a href="#thema2" className="rounded-full bg-[#2c2825] px-4 py-1.5 text-white hover:bg-black">
              Θέματα 2 λυμένα ({BANK.length}) ↓
            </a>
            <Link href="/mixalis/ormi/periptoseis" prefetch={false} className="rounded-full border border-black/10 bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Οι περιπτώσεις μία-μία, με λυμένο παράδειγμα →
            </Link>
          </div>
        </header>

        <StudyBar lesson="ormi" />

        <section id="periptoseis" className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Η μέθοδος</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Οι 20 περιπτώσεις και τα θέματά τους</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
            Κάθε θέμα της Τράπεζας ανήκει σε μία περίπτωση. Πάτα το όνομα της περίπτωσης για να δεις <b>τι σου ζητάνε, τι σκέφτεσαι και τι κάνεις</b>,
            με λυμένο παράδειγμα. Οι ομάδες Α–Γ είναι κυρίως Θέμα 2, η ομάδα Δ είναι για το Θέμα 4.
          </p>

          <div className="mt-6 space-y-8">
            {GROUPS.map((g) => (
              <div key={g.id}>
                <h3 className="flex items-baseline gap-3 border-b border-black/10 pb-2 text-lg font-semibold">
                  <span className="text-2xl font-bold text-[#c9822f]">{g.letter}</span>
                  {rich(g.title)}
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {g.cases.map((c) => {
                    const codes = CODES_BY_CASE.get(c.id) ?? [];
                    return (
                      <div key={c.id} className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4">
                        <Link href={`/mixalis/ormi/periptoseis#${c.id}`} prefetch={false} className="group block">
                          <p className="text-xs font-semibold text-[#857261]">Περίπτωση {c.code}</p>
                          <p className="mt-1 font-semibold leading-6 group-hover:underline">{rich(c.title)}</p>
                        </Link>
                        {codes.length ? (
                          <p className="mt-2 text-sm leading-6 text-[#5c534c]">
                            Θέματα:{" "}
                            {codes.map((code, i) => {
                              const anchor = SOLVED.get(code);
                              return (
                                <Fragment key={code}>
                                  {i ? ", " : ""}
                                  {anchor ? (
                                    <a href={`#${anchor}`} className="font-semibold text-[#a8651f] underline underline-offset-2">
                                      {code}
                                    </a>
                                  ) : (
                                    <span>{code}</span>
                                  )}
                                </Fragment>
                              );
                            })}
                          </p>
                        ) : null}
                        <Link
                          href={`/mixalis/ormi/periptoseis#${c.id}`}
                          prefetch={false}
                          className="mt-3 inline-block rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[#4d4138] hover:bg-[#f3efe8]"
                        >
                          Μέθοδος & λυμένο παράδειγμα →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-xl font-semibold tracking-tight">Με ποια σειρά να τα δουλέψεις</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {ORDER.map(([num, h, r, t]) => (
              <div key={num} className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4">
                <p className="text-3xl font-bold text-[#c9822f]">{num}</p>
                <p className="mt-1 font-semibold">{h}</p>
                <p className="mt-1 text-sm font-medium text-[#5c534c]">{r}</p>
                <p className="mt-2 text-sm leading-6 text-[#5c534c]">{t}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-[#857261]">
            Από τα 142 θέματα της Τράπεζας για τις §2.3–2.7, τα 104 που έχουν κείμενο είναι μοιρασμένα στις περιπτώσεις. Τα υπόλοιπα 38 υπάρχουν μόνο ως
            εικόνα στην Τράπεζα. Λυμένα ένα-ένα παρακάτω: {solvedCount} θέματα.
          </p>
        </section>

        <section id="thema2" className="scroll-mt-20 space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Θέμα 2 (Β)</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Τα Θέματα 2 λυμένα, ανά είδος</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
              Όλα τα ερωτήματα ορμής από τα Θέματα 2 της επίσημης Τράπεζας Θεμάτων. Για κάθε ένα: διάβασε την εκφώνηση, <b>διάλεξε απάντηση</b> και γράψε
              στο τετράδιο <b>γιατί</b>, πριν δεις τη λύση. Μετά διάβασε την αιτιολόγηση βήμα-βήμα: αυτά τα βήματα γράφεις στο γραπτό για να πάρεις τις
              μονάδες (η αιτιολόγηση μετράει 8–9 από τις 12–13 μονάδες).
            </p>
          </div>
          <div id="trapeza" className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:p-6">
            <TrapezaOrmi />
          </div>
        </section>

        <OrmiNav active="trapeza" />
      </div>
    </main>
  );
}

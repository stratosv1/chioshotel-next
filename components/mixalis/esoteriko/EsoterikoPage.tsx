import Link from "next/link";
import type { ReactNode } from "react";
import { StudyBar } from "@/components/mixalis/study/StudyBar";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { BANK_MAP, FIRST_MOVES, FORMULAS, GROUPS, type Case } from "./cases";
import { ProjectionFigure, SignFigure, SledFigure } from "./figures";
import { Reveal } from "./Reveal";
import { rich } from "./rich";

const LESSON = "esoteriko";
const PATH = "/mixalis/esoteriko";

/** Ανοιχτή ενότητα: αριθμός, τίτλος και μια λεπτή γραμμή από πάνω, χωρίς κουτί. */
function Section({ id, n, kicker, title, intro, children }: { id: string; n: string; kicker: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-black/10 py-12 sm:py-16">
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
    <article id={c.id} data-study-lesson={LESSON} data-study-id={c.id} className="scroll-mt-20 border-t border-black/10 py-10 first:border-t-0 first:pt-0">
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

      <StudyMark lesson={LESSON} id={c.id} title={`${c.code} · ${c.title}`} path={PATH} className="mt-8" />
    </article>
  );
}

const nav: [string, string][] = [
  ["#protakinisi", "Τι σου ζητάνε"],
  ["#typologio", "Τυπολόγιο"],
  ["#noima", "Τι σημαίνει"],
  ["#fysiki", "Φυσική"],
  ["#syntetagmenes", "Α · Συντεταγμένες"],
  ["#metra", "Β · Μέτρα και γωνίες"],
  ["#thema4", "Γ · Θέμα 4"],
  ["#trapeza", "Τράπεζα Θεμάτων"],
];

export function EsoterikoPage() {
  let n = 4;
  return (
    <main className="min-h-screen bg-[#f3efe8] text-[#2c2825]">
      <header className="mx-auto w-full max-w-[1400px] px-4 pb-10 pt-10 sm:px-8 sm:pt-14">
        <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-[#857261] hover:underline">
          ← Τα μαθήματά μου
        </Link>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Μαθηματικά Β΄ Λυκείου · §1.5</p>
        <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">Εσωτερικό γινόμενο: οι περιπτώσεις ασκήσεων</h1>
        <p className="mt-5 max-w-3xl text-[19px] leading-9 text-[#5c534c]">
          Μιχάλη, οι ασκήσεις του εσωτερικού γινομένου μοιάζουν πολλές, αλλά είναι <b>25 περιπτώσεις</b> που επαναλαμβάνονται. Για καθεμία θα δεις τι
          θα σου ζητήσουν, τι πρέπει να σκεφτείς και τι κάνεις βήμα-βήμα, με μια λυμένη άσκηση. Λύσε την πρώτα στο τετράδιο και μετά άνοιξε τη λύση.
        </p>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#857261]">
          Από την Τράπεζα Θεμάτων, το βοήθημα του Μπάρλα και τις σημειώσεις του φροντιστηρίου.
        </p>
      </header>

      <nav className="sticky top-0 z-20 border-y border-black/10 bg-[#f3efe8]/90 backdrop-blur" aria-label="Ενότητες">
        <div className="mx-auto flex w-full max-w-[1400px] gap-1 overflow-x-auto px-3 py-2 sm:px-8">
          {nav.map(([href, label]) => (
            <a key={href} href={href} className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold text-[#4d4138] hover:bg-black/5">
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8">
        <div className="pt-6">
          <StudyBar lesson={LESSON} />
        </div>

        <Section id="protakinisi" n="1" kicker="Πριν από κάθε άσκηση" title="Πρώτα ρώτα: τι μου ζητάνε;" intro={<p>Η λέξη της εκφώνησης σού λέει σχεδόν πάντα την πρώτη κίνηση.</p>}>
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

        <Section
          id="noima"
          n="3"
          kicker="Το νόημα"
          title="Τι μετράει το εσωτερικό γινόμενο"
          intro={
            <p>
              Πόσο «κοιτάνε προς την ίδια μεριά» δύο διανύσματα. Είναι <b>αριθμός</b>, και το πρόσημό του σου λέει αμέσως τι γωνία σχηματίζουν.
            </p>
          }
        >
          <div className="grid gap-10 sm:grid-cols-3">
            {(
              [
                ["acute", "{α}·{β} > 0", "Οξεία γωνία: κοιτάνε «μαζί»."],
                ["right", "{α}·{β} = 0", "Ορθή γωνία: κανένα δεν «προχωράει» προς το άλλο."],
                ["obtuse", "{α}·{β} < 0", "Αμβλεία γωνία: κοιτάνε σε αντίθετες μεριές."],
              ] as const
            ).map(([kind, big, cap]) => (
              <div key={kind} className="flex flex-col items-center text-center">
                <SignFigure kind={kind} />
                <p className="mt-3 text-3xl font-semibold">{rich(big)}</p>
                <p className="mt-2 text-[17px] leading-7 text-[#5c534c]">{cap}</p>
              </div>
            ))}
          </div>

          <div id="provoli" className="mt-16 grid scroll-mt-20 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <ProjectionFigure />
            <div className="space-y-5 text-[17px] leading-8">
              <h3 className="text-2xl font-semibold tracking-tight">Η προβολή: το εσωτερικό γινόμενο «με το μάτι»</h3>
              <p>
                Ρίξε κάθετη από την άκρη του {rich("{β}")} πάνω στη διεύθυνση του {rich("{α}")}. Το κομμάτι που «πέφτει» πάνω της είναι η{" "}
                <b>προβολή</b> {rich("{β₁}")}. Τότε:
              </p>
              <p className="border-l-4 border-[#0e6e66] pl-4 text-[20px] leading-9">
                {rich("{α}·{β} = {α}·{β₁}")}
                <br />
                {rich("{β₁} = λ{α}, με λ = {α}·{β} / |{α}|²")}
              </p>
              <p className="text-[#5c534c]">
                {rich(
                  "**Παράδειγμα από το φροντιστήριο:** |{α}| = √2, η προβολή του {β} στο {α} είναι 2{α} και η προβολή του {α} στο {β} είναι ¼{β}. Τότε {α}·{β} = {α}·2{α} = 2|{α}|² = 4 και {α}·{β} = ¼|{β}|², άρα |{β}| = 4 και συνθ = 4/(√2·4) = √2/2, δηλαδή θ = π/4.",
                )}
              </p>
              <p className="text-[15px] text-[#857261]">
                Ο Δημήτρης σας είπε να μην επιμείνετε σε ασκήσεις προβολής. Εδώ είναι για να καταλάβεις τι σημαίνει το εσωτερικό γινόμενο, όχι για
                αποστήθιση.
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="fysiki"
          n="4"
          kicker="Σύνδεση με τη Φυσική"
          title="Το έργο μιας δύναμης είναι εσωτερικό γινόμενο"
          intro={
            <p>
              Το σχολικό βιβλίο ξεκινά την §1.5 ακριβώς από εδώ. Ό,τι μαθαίνεις για ομόρροπα, κάθετα και αντίρροπα διανύσματα το χρησιμοποιείς αυτούσιο στη
              Φυσική (δες και το μάθημα{" "}
              <Link href="/mixalis/ergo" prefetch={false} className="font-semibold text-[#a8651f] underline underline-offset-2">
                Έργο, Ενέργεια και Ισχύς
              </Link>
              ).
            </p>
          }
        >
          <p className="text-3xl font-semibold text-[#a8651f] sm:text-4xl">{rich("W = {F}·{Δx} = |{F}|·|{Δx}|·συνφ")}</p>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {[
              ["φ = 0° · ομόρροπα", "W = F·Δx", "Σπρώχνεις το καρότσι προς τα εμπρός: όλη η δύναμη «δουλεύει»."],
              ["φ = 90° · κάθετα", "W = 0", "Το βάρος, όταν το σώμα κινείται οριζόντια, δεν παράγει έργο."],
              ["φ = 180° · αντίρροπα", "W = −T·Δx", "Η τριβή αντιστέκεται στην κίνηση: το έργο της είναι αρνητικό."],
            ].map(([h, f, t]) => (
              <div key={h} className="border-t-2 border-[#c9822f] pt-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#a8651f]">{h}</p>
                <p className="mt-2 text-2xl font-semibold">{f}</p>
                <p className="mt-2 text-[17px] leading-7 text-[#5c534c]">{t}</p>
              </div>
            ))}
          </div>

          <div id="elkithro" className="mt-16 grid scroll-mt-20 items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16" data-study-lesson={LESSON} data-study-id="elkithro">
            <div>
              <SledFigure />
              <p className="mt-3 text-[17px] text-[#5c534c]">F = 50 N υπό γωνία 60°, Δx = 10 m, τριβή T = 20 N.</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0e6e66]">Λυμένη άσκηση Φυσικής</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">Το έργο των δυνάμεων σε ένα έλκηθρο</h3>
              <p className="mt-2 text-[18px] leading-8">
                Ένα παιδί σέρνει έλκηθρο με σχοινί. Η δύναμη F = 50 N σχηματίζει 60° με το έδαφος και το έλκηθρο μετακινείται 10 m. Η τριβή είναι 20 N. Βρες
                το έργο κάθε δύναμης.
              </p>
              <Reveal
                steps={[
                  rich("Έργο της {F} με τον ορισμό: W = |{F}|·|{Δx}|·συν60° = 50·10·½ = 250 J"),
                  rich("Με συντεταγμένες: {F} = (25, 25√3) N και {Δx} = (10, 0) m, άρα {F}·{Δx} = 25·10 + 25√3·0 = 250 J. Ίδιο αποτέλεσμα."),
                  rich("Τριβή: αντίρροπη στη μετατόπιση, άρα W = −20·10 = −200 J"),
                  rich("Βάρος και κάθετη αντίδραση: κάθετες στη μετατόπιση, άρα W = 0"),
                ]}
                answer="Συνολικό έργο: 250 − 200 = 50 J"
              />
              <StudyMark lesson={LESSON} id="elkithro" title="Φυσική · Έργο σε έλκηθρο" path={PATH} className="mt-6" />
            </div>
          </div>

          <div id="synistameni" className="mt-16 grid scroll-mt-20 gap-10 lg:grid-cols-2 lg:gap-14" data-study-lesson={LESSON} data-study-id="synistameni">
            <div className="space-y-4 text-[17px] leading-8">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#857261]">Τράπεζα Θεμάτων 18520 (γ)</p>
              <h3 className="text-2xl font-semibold tracking-tight">Συνισταμένη δύο δυνάμεων</h3>
              <div className="border-l-4 border-[#c9822f] pl-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#a8651f]">Τότε σκέψου</p>
                <p className="mt-1 text-[19px] font-medium">
                  Η συνισταμένη είναι <b>μέτρο αθροίσματος</b>: υψώνεις στο τετράγωνο, όπως στη Β2. Δεν είναι 10 + 10 = 20 N, γιατί οι δυνάμεις δεν έχουν την
                  ίδια κατεύθυνση.
                </p>
              </div>
              <p className="text-[20px]">{rich("|{F₁} + {F₂}|² = |{F₁}|² + 2{F₁}·{F₂} + |{F₂}|²")}</p>
            </div>
            <div className="lg:border-l lg:border-black/10 lg:pl-14">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0e6e66]">Λυμένο παράδειγμα</p>
              <p className="mt-1 text-[18px] leading-8">
                Δύο άνθρωποι σέρνουν ένα σώμα με δυνάμεις {rich("{F₁}, {F₂}")} μέτρου 10 N η καθεμία, που σχηματίζουν γωνία 60°. Βρες το μέτρο της
                συνισταμένης.
              </p>
              <Reveal
                steps={[rich("{F₁}·{F₂} = 10·10·συν60° = 50"), rich("|{F}|² = 100 + 2·50 + 100 = 300"), rich("|{F}| = √300 = 10√3 ≈ 17,3 N")]}
                answer="Συνισταμένη: 10√3 N, περίπου 17,3 N"
              />
              <StudyMark lesson={LESSON} id="synistameni" title="Φυσική · Συνισταμένη δυνάμεων" path={PATH} className="mt-6" />
            </div>
          </div>
        </Section>

        {GROUPS.map((g) => {
          n += 1;
          return (
            <Section key={g.id} id={g.id} n={String(n)} kicker={`Ομάδα ${g.letter}`} title={g.title} intro={<p>{rich(g.intro)}</p>}>
              {g.cases.map((c) => (
                <CaseBlock key={c.id} c={c} />
              ))}
            </Section>
          );
        })}

        <Section
          id="trapeza"
          n={String(n + 1)}
          kicker="Τράπεζα Θεμάτων ΙΕΠ"
          title="Τα 32 θέματα της Τράπεζας για την §1.5"
          intro={<p>Κάθε θέμα της Τράπεζας ανήκει σε μία από τις περιπτώσεις πάνω. Πάτα την περίπτωση για να δεις τη μέθοδο.</p>}
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
              {BANK_MAP.map(([label, codes, id]) => (
                <tr key={label} className="border-b border-black/10">
                  <td className="py-3 pr-6">{label}</td>
                  <td className="py-3 pr-6 text-[#5c534c]">{codes}</td>
                  <td className="py-3">
                    <a href={`#${id}`} className="font-semibold text-[#a8651f] underline underline-offset-2">
                      {id.toUpperCase().replace("A", "Α").replace("B", "Β").replace("C", "Γ")}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="mt-14 text-2xl font-semibold tracking-tight">Με ποια σειρά να τα δουλέψεις</h3>
          <div className="mt-6 grid gap-10 sm:grid-cols-3">
            {[
              ["1", "Η βάση", "Α1–Α5 · Β1–Β4", "Πέφτουν σε κάθε διαγώνισμα και καλύπτουν τα περισσότερα θέματα της Τράπεζας."],
              ["2", "Οι παγίδες", "Α6–Α10 · Β5–Β7", "Εδώ χάνονται οι περισσότερες μονάδες: φορά, κοινή αρχή, αριθμός ή διάνυσμα."],
              ["3", "Για το 19–20", "Γ1–Γ8", "Θέμα 4 και ασκήσεις του φροντιστηρίου, όταν τα προηγούμενα είναι σίγουρα."],
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

        <p className="border-t border-black/10 py-8 text-center text-sm text-[#857261]">
          Πηγές: σχολικό βιβλίο Μαθηματικών Β΄ Λυκείου (§1.5), Τράπεζα Θεμάτων Διαβαθμισμένης Δυσκολίας (ΙΕΠ), βοήθημα Μπάρλα, σημειώσεις φροντιστηρίου.
          Τα διανύσματα γράφονται με βελάκι από πάνω.
        </p>
      </div>
    </main>
  );
}

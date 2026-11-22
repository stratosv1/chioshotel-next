import type { ReactNode } from "react";
import { F } from "../../math/ui";
import { FinalTest, MiniQuiz } from "../interactive";
import {
  BikeTimeline,
  FastClock,
  Flashcards,
  Hourglass,
  Pendulum,
  PhotoFinish,
  PlanTracker,
  Predict,
  ReactionGame,
  SectionDone,
  Stepper,
  Sundial,
  UnitStairs,
} from "../visuals";

// Φυσική Α΄ Γυμνασίου — Κεφάλαιο 2: Μετρήσεις χρόνου – Η ακρίβεια.
// Πρότυπο: docs/lesson-build-prompt-sideris.md. Κορμός: η φωτοτυπία του καθηγητή.
// Συμπλήρωμα: βοήθημα Σαββάλα (σελ. 43–74). Περίοδος/εκκρεμές μόνο σε απλή παρουσίαση.

const f = (n: ReactNode, d: ReactNode) => <F n={n} d={d} />;

// ───────────────────────────── μικρά δομικά κομμάτια ─────────────────────────────
function PSection({ id, code, title, minutes, children }: { id: string; code: string; title: string; minutes?: number; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-12 min-w-[3rem] shrink-0 place-items-center rounded-2xl bg-[#6b3fa0] px-3 text-lg font-black text-white shadow-md">
          {code}
        </span>
        <div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight">{title}</h2>
          {minutes ? <p className="text-sm text-[#857a70]">περίπου {minutes} λεπτά</p> : null}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

/** «Τι κρατάμε»: ο κανόνας όπως τον λέει η φωτοτυπία / το βιβλίο. */
function Keep({ children }: { children: ReactNode }) {
  return (
    <div className="sx-key rounded-3xl p-[3px] shadow-md">
      <div className="rounded-[calc(1.5rem-3px)] bg-white p-5 sm:p-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-[#6b3fa0]">
          <span className="sx-float">📌</span> Τι κρατάμε
        </p>
        <div className="space-y-2 text-[17px] leading-8">{children}</div>
      </div>
    </div>
  );
}

/** «📖 Τι σημαίνει»: εξήγηση νέας λέξης. */
function Means({ word, children }: { word: string; children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-[#1d5a8c]/15 bg-[#eef5fb] px-4 py-3 text-[16px] leading-7">
      <span className="font-bold text-[#1d5a8c]">📖 Τι σημαίνει «{word}»;</span> {children}
    </p>
  );
}

function Trap({ wrong, right, why }: { wrong: ReactNode; right: ReactNode; why: ReactNode }) {
  return (
    <div className="rounded-3xl border-2 border-[#d64545]/35 bg-[repeating-linear-gradient(135deg,#fff8f6_0_14px,#fff1ee_14px_28px)] p-5">
      <p className="mb-2 text-sm font-black uppercase tracking-[0.12em] text-[#b33a3a]">
        <span className="sx-float">⚠️</span> Παγίδα!
      </p>
      <p className="text-[16px] leading-8">
        <span className="mr-2 rounded-md bg-[#fdecec] px-2 py-0.5 text-sm font-bold text-[#b33a3a]">✗</span>
        <span className="text-[#9b2c2c] [text-decoration-line:line-through]">{wrong}</span>
      </p>
      <p className="text-[16px] leading-8">
        <span className="mr-2 rounded-md bg-[#e7f3e4] px-2 py-0.5 text-sm font-bold text-[#24522a]">✓</span>
        <b className="text-[#24522a]">{right}</b>
      </p>
      <p className="mt-1 text-[15px] leading-7 text-[#4d4138]">👉 {why}</p>
    </div>
  );
}

/** Άσκηση με κρυφή λύση. teacher = άσκηση του καθηγητή (μπλε κύκλος, όπως στα Μαθηματικά). */
function Ask({ n, q, teacher, children }: { n: string; q: ReactNode; teacher?: boolean; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start gap-3">
        <span
          className={`grid h-10 min-w-[2.5rem] shrink-0 place-items-center rounded-full px-2 text-sm font-bold ${
            teacher ? "border-[3px] border-[#2f4f9a] text-[#2f4f9a]" : "bg-[#f1eafa] text-[#6b3fa0]"
          }`}
        >
          {n}
        </span>
        <div className="min-w-0 flex-1 pt-1.5">
          {teacher ? (
            <span className="mb-1 mr-2 inline-block rounded-full bg-[#e8edf9] px-2 py-0.5 text-xs font-semibold text-[#2f4f9a]">
              Της φωτοτυπίας του καθηγητή
            </span>
          ) : null}
          <div className="text-[16px] leading-7">{q}</div>
        </div>
      </div>
      <details className="group mt-3">
        <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-1 rounded-xl border border-black/10 bg-[#f7f4ef] px-4 text-sm font-semibold text-[#4d4138] transition hover:bg-[#ece4da]">
          <span className="group-open:hidden">Δείξε τη λύση ▾</span>
          <span className="hidden group-open:inline">Κρύψε τη λύση ▴</span>
        </summary>
        <div className="mt-3 space-y-2 border-l-4 border-[#b79ad6] pl-4 text-[16px] leading-7">{children}</div>
      </details>
    </div>
  );
}

/** Λύση προβλήματος σε 4 βήματα: Τι μου δίνουν → Τι ψάχνω → Ποιος τύπος → Λύνω. */
function Solve({ given, find, rule, work }: { given: ReactNode; find: ReactNode; rule: ReactNode; work: ReactNode }) {
  const rows: [string, string, ReactNode][] = [
    ["🎁", "Τι μου δίνουν", given],
    ["🔎", "Τι ψάχνω", find],
    ["🧰", "Ποιος κανόνας", rule],
    ["✍️", "Λύνω", work],
  ];
  return (
    <div className="space-y-1.5">
      {rows.map(([e, l, v]) => (
        <p key={l}>
          <span className="mr-1">{e}</span>
          <b className="text-[#6b3fa0]">{l}:</b> {v}
        </p>
      ))}
    </div>
  );
}

function L({ items }: { items: ReactNode[] }) {
  const letters = ["α", "β", "γ", "δ", "ε", "στ", "ζ", "η"];
  return (
    <ul className="space-y-1">
      {items.map((x, i) => (
        <li key={i}>
          <span className="mr-1 text-[#857261]">{letters[i]})</span> {x}
        </li>
      ))}
    </ul>
  );
}

const ok = <b className="text-[#24522a]">Σωστό ✓</b>;
const no = <b className="text-[#b33a3a]">Λάθος ✗</b>;
const big = "font-bold text-[#1d5a8c]";

const PLAN = [
  { id: "fotocopia", title: "Η φωτοτυπία του καθηγητή", minutes: 5, important: true },
  { id: "2-1", title: "1 · Μονάδες χρόνου", minutes: 10, important: true },
  { id: "2-2", title: "2 · Στιγμή και διάρκεια", minutes: 8, important: true },
  { id: "2-3", title: "3 · Αναλογικά και ψηφιακά", minutes: 8, important: true },
  { id: "2-4", title: "4 · Ακρίβεια και μέση τιμή", minutes: 10, important: true },
  { id: "2-5", title: "5 · Το εκκρεμές (απλά)", minutes: 5 },
  { id: "askiseis", title: "Ασκήσεις βοηθήματος", minutes: 20 },
  { id: "kartes", title: "Κάρτες αποστήθισης", minutes: 5 },
  { id: "test", title: "Τελικό διαγώνισμα", minutes: 15 },
];

export function Kefalaio2Fysiki() {
  return (
    <div className="space-y-14">
      {/* ───────────────────────────── ΠΛΑΝΟ ───────────────────────────── */}
      <PSection id="plano" code="📋" title="Το πλάνο σου">
        <div className="rounded-3xl bg-gradient-to-br from-[#6b3fa0] to-[#3a2a6b] p-6 text-white shadow-lg">
          <p className="text-2xl font-black">
            Γεια σου Σιδέρη! <span className="sx-float">👋</span>
          </p>
          <p className="mt-2 text-[17px] leading-8">
            Η Φυσική είναι η επιστήμη που ρωτάει «γιατί;» και «πόσο;». Σήμερα ξεκινάμε με κάτι που χρησιμοποιείς κάθε μέρα χωρίς να το
            σκέφτεσαι: <b>τον χρόνο</b>. Πόσο κρατάει το διάλειμμα; Ποιος έτρεξε πιο γρήγορα; Πώς ήξεραν την ώρα πριν υπάρξουν ρολόγια;
          </p>
          <p className="mt-3 text-[15px] leading-7 text-white/85">
            Κάθε ενότητα είναι μικρή: πρώτα <b>μαντεύεις</b>, μετά <b>παίζεις</b> με το σχέδιο, κρατάς τον κανόνα και κάνεις ένα τεστάκι.
            Όταν τελειώσεις μια ενότητα, πάτα «✓ Το έμαθα».
          </p>
        </div>
        <PlanTracker items={PLAN} />
      </PSection>

      {/* ───────────────────────────── ΦΩΤΟΤΥΠΙΑ ───────────────────────────── */}
      <PSection id="fotocopia" code="📄" title="Η φωτοτυπία του καθηγητή" minutes={5}>
        <p className="text-[16px] leading-7 text-[#4d4138]">
          Σιδέρη, αυτά είναι <b>όσα ζητάει ο καθηγητής σου</b>. Τα εξηγούμε ένα-ένα παρακάτω με σχέδια. Στο τέλος ξαναγύρνα εδώ και
          δες αν τα θυμάσαι όλα.
        </p>
        <Keep>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              Η διεθνής <b>μονάδα μέτρησης του χρόνου</b> είναι το <b>δευτερόλεπτο (s)</b>.
            </li>
            <li>
              Μεγαλύτερες μονάδες: <span className={big}>1 min = 60 s</span> και <span className={big}>1 h = 60 min = 3.600 s</span>.
            </li>
            <li>
              <b>Αναλογικά όργανα:</b> χρησιμοποιούν αναλογίες, όπως το ρολόι με δείκτες, το ηλιακό ρολόι και η κλεψύδρα.
            </li>
            <li>
              <b>Ψηφιακά όργανα:</b> έχουν μόνο ψηφία.
            </li>
            <li>
              <b>Ακρίβεια:</b> μεγαλύτερη ακρίβεια έχουμε με τη <b>μικρότερη μονάδα μέτρησης</b>, π.χ. τα χιλιοστά είναι πιο ακριβή από τα
              εκατοστά του δευτερολέπτου.
            </li>
            <li>
              Το ακριβέστερο όργανο στον κόσμο είναι το <b>ατομικό ρολόι</b>.
            </li>
            <li>
              <b>Χρονική στιγμή:</b> η ένδειξη του ρολογιού που δείχνει <b>πότε</b> συμβαίνει κάτι (π.χ. το αυτοκίνητο ξεκινά τη στιγμή
              t = 0 s).
            </li>
            <li>
              <b>Χρονική διάρκεια:</b> ο χρόνος ανάμεσα σε δύο γεγονότα (ή δύο χρονικές στιγμές), από την αρχή μέχρι το τέλος.
            </li>
          </ol>
        </Keep>
        <Ask
          teacher
          n="α"
          q={
            <>
              Μετράμε τον χρόνο δέκα ταλαντώσεων με <b>ψηφιακό</b> ρολόι και βρίσκουμε <b>8,94 s</b>, και με <b>αναλογικό</b> και
              βρίσκουμε <b>9 s</b>. Ποιο όργανο μάς έδωσε μεγαλύτερη ακρίβεια;
            </>
          }
        >
          <Solve
            given="ψηφιακό: 8,94 s (μετράει εκατοστά του s) · αναλογικό: 9 s (μετράει ολόκληρα s)"
            find="ποιο είναι πιο ακριβές"
            rule="μικρότερη μονάδα μέτρησης = μεγαλύτερη ακρίβεια"
            work={
              <>
                Το εκατοστό του δευτερολέπτου είναι πιο μικρό κομμάτι από το δευτερόλεπτο. <b>Μεγαλύτερη ακρίβεια μάς έδωσε το ψηφιακό
                ρολόι.</b>
              </>
            }
          />
        </Ask>
        <Ask
          teacher
          n="β"
          q={
            <>
              Μετράμε τον χρόνο δέκα ταλαντώσεων και παίρνουμε τις τιμές <b>8,4 s, 8,5 s, 8,7 s, 9 s, 9 s</b>. Να υπολογίσετε τη μέση
              τιμή του χρόνου δέκα ταλαντώσεων.
            </>
          }
        >
          <Solve
            given="5 μετρήσεις: 8,4 · 8,5 · 8,7 · 9 · 9 (σε s)"
            find="τη μέση τιμή"
            rule={<>μέση τιμή = {f("άθροισμα", "πλήθος")}</>}
            work={
              <>
                Άθροισμα: 8,4 + 8,5 + 8,7 + 9 + 9 = 43,6 s. Πλήθος: 5. Μέση τιμή = 43,6 : 5 = <b>8,72 s</b>.
              </>
            }
          />
        </Ask>
        <SectionDone id="fotocopia" />
      </PSection>

      {/* ───────────────────────────── 1. ΜΟΝΑΔΕΣ ───────────────────────────── */}
      <PSection id="2-1" code="1" title="Μονάδες χρόνου" minutes={10}>
        <Predict
          q="Μια ώρα μάθημα… πόσα δευτερόλεπτα είναι μία ώρα;"
          choices={["60", "600", "3600"]}
          answer={2}
          reveal={
            <>
              1 ώρα = 60 λεπτά, και κάθε λεπτό = 60 δευτερόλεπτα. Άρα 60 · 60 = <b>3600 s</b>. Πολλά, ε; Δες το στο ρολόι 👇
            </>
          }
        />
        <FastClock />
        <Keep>
          <p>
            Βασική μονάδα: το <b>δευτερόλεπτο (s)</b>.
          </p>
          <p>
            <span className={big}>1 min = 60 s</span> &nbsp;·&nbsp; <span className={big}>1 h = 60 min = 3600 s</span>
          </p>
          <p className="text-[15px] text-[#6b625b]">
            Για τους περίεργους (από το βοήθημα): 1 ημέρα = 24 h, και 1 s = 1000 ms (χιλιοστά του δευτερολέπτου).
          </p>
        </Keep>
        <Means word="πολλαπλάσια">
          Μεγαλύτερες μονάδες που φτιάχνονται από πολλά δευτερόλεπτα μαζί: το λεπτό είναι 60 δευτερόλεπτα, η ώρα 3600.
        </Means>
        <UnitStairs />
        <Stepper
          title="Το διάλειμμα κρατάει 10 min. Πόσα δευτερόλεπτα είναι;"
          steps={[
            { label: "Τι μου δίνουν", body: "10 min" },
            { label: "Τι ψάχνω", body: "πόσα s" },
            { label: "Ποιος κανόνας", body: "από min σε s κατεβαίνω σκαλί, άρα × 60" },
            { label: "Λύνω", body: <b>10 · 60 = 600 s 🎉</b> },
          ]}
        />
        <MiniQuiz id="2-1" />
        <Trap
          wrong="2 h = 120 s"
          right="2 h = 120 min = 7200 s"
          why="Από ώρες σε δευτερόλεπτα είναι ΔΥΟ σκαλιά, άρα × 60 και ξανά × 60 (ή κατευθείαν × 3600)."
        />
        <SectionDone id="2-1" />
      </PSection>

      {/* ───────────────────────────── 2. ΣΤΙΓΜΗ – ΔΙΑΡΚΕΙΑ ───────────────────────────── */}
      <PSection id="2-2" code="2" title="Χρονική στιγμή και χρονική διάρκεια" minutes={8}>
        <Predict
          q="«Ο αγώνας άρχισε στις 6 και κράτησε 2 ώρες». Ποιο από τα δύο απαντά στο «ΠΟΤΕ;»"
          choices={["στις 6", "2 ώρες"]}
          answer={0}
          reveal={
            <>
              Το «στις 6» λέει <b>πότε</b>: είναι <b>χρονική στιγμή</b>. Οι «2 ώρες» λένε <b>πόσο κράτησε</b>: είναι{" "}
              <b>χρονική διάρκεια</b>.
            </>
          }
        />
        <BikeTimeline />
        <Keep>
          <p>
            🕙 <b>Χρονική στιγμή (t):</b> η ένδειξη του ρολογιού. Απαντά στο <b>ΠΟΤΕ</b>.
          </p>
          <p>
            ⏳ <b>Χρονική διάρκεια (Δt):</b> ο χρόνος ανάμεσα σε δύο στιγμές. Απαντά στο <b>ΠΟΣΟ ΚΡΑΤΗΣΕ</b>.
          </p>
          <p className="text-center text-xl font-black text-[#3d6b3a]">Δt = t₂ − t₁ &nbsp;(τέλος − αρχή)</p>
        </Keep>
        <Means word="Δt">
          Το Δ (δέλτα) στη Φυσική σημαίνει «διαφορά». Δt = η διαφορά δύο χρονικών στιγμών, δηλαδή πόσος χρόνος πέρασε.
        </Means>
        <Stepper
          title="Ο σεισμός στη Ζάκυνθο άρχισε 16:12:05 και τελείωσε 16:12:19. Πόσο κράτησε;"
          steps={[
            { label: "Τι μου δίνουν", body: "t₁ = 16:12:05 (αρχή) και t₂ = 16:12:19 (τέλος)" },
            { label: "Τι ψάχνω", body: "τη διάρκεια Δt" },
            { label: "Ποιος κανόνας", body: "Δt = t₂ − t₁" },
            { label: "Λύνω", body: <>Ώρες και λεπτά είναι ίδια, αλλάζουν μόνο τα δευτερόλεπτα: 19 − 5 = <b>14 s</b></> },
          ]}
        />
        <MiniQuiz id="2-2" />
        <Trap
          wrong="Δt = t₁ − t₂ = −14 s"
          right="Δt = t₂ − t₁ = 14 s"
          why="Αφαιρούμε πάντα ΤΕΛΟΣ − ΑΡΧΗ. Αρνητικός χρόνος δεν υπάρχει!"
        />
        <SectionDone id="2-2" />
      </PSection>

      {/* ───────────────────────────── 3. ΟΡΓΑΝΑ ───────────────────────────── */}
      <PSection id="2-3" code="3" title="Αναλογικά και ψηφιακά όργανα" minutes={8}>
        <Predict
          q="Πριν από 3000 χρόνια δεν υπήρχαν ρολόγια. Πώς ήξεραν οι άνθρωποι τι ώρα είναι;"
          choices={["από τη σκιά του ήλιου", "δεν ήξεραν καθόλου", "από το κινητό 😄"]}
          answer={0}
          reveal={<>Από τη <b>σκιά</b> μιας στήλης: το <b>ηλιακό ρολόι</b>. Παίξε μαζί του 👇</>}
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <Sundial />
          <Hourglass />
        </div>
        <Keep>
          <p>
            <b>Αναλογικά όργανα:</b> χρησιμοποιούν αναλογίες, όπως το <b>ρολόι με δείκτες</b>, το <b>ηλιακό ρολόι</b> και η{" "}
            <b>κλεψύδρα</b>.
          </p>
          <p>
            <b>Ψηφιακά όργανα:</b> έχουν <b>μόνο ψηφία</b>, όπως το χρονόμετρο του κινητού (12:28:58).
          </p>
          <p>
            Το ακριβέστερο στον κόσμο: το <b>ατομικό ρολόι</b> ⚛️
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[15px] font-semibold">
            <span className="rounded-full bg-[#fff1e0] px-3 py-1">☀️ ηλιακό</span>→<span className="rounded-full bg-[#fff1e0] px-3 py-1">🕰️ δείκτες</span>→
            <span className="rounded-full bg-[#e6eef6] px-3 py-1">📟 ψηφιακό</span>→<span className="rounded-full bg-[#e7f3e4] px-3 py-1">⚛️ ατομικό</span>
            <span className="text-sm font-normal text-[#6b625b]">(όλο και πιο ακριβή)</span>
          </div>
        </Keep>
        <Means word="αναλογικό">
          Ο χρόνος φαίνεται από κάτι που κινείται ή αλλάζει σιγά-σιγά: ένας δείκτης που γυρίζει, μια σκιά, άμμος που πέφτει. Δεν
          βλέπεις αριθμούς σαν το κινητό.
        </Means>
        <Means word="ατομικό ρολόι">
          Ένα πολύ ειδικό ρολόι σε εργαστήρια, που χάνει μόνο 1 δευτερόλεπτο σε εκατομμύρια χρόνια! Χάρη σε αυτό δουλεύει το GPS
          στο κινητό σου.
        </Means>
        <MiniQuiz id="2-3" />
        <Trap
          wrong="Το πιο ακριβές ρολόι στον κόσμο είναι το ψηφιακό."
          right="Το πιο ακριβές είναι το ατομικό ρολόι."
          why="Το ψηφιακό είναι πιο ακριβές από το αναλογικό, αλλά το ατομικό τα κερδίζει όλα."
        />
        <SectionDone id="2-3" />
      </PSection>

      {/* ───────────────────────────── 4. ΑΚΡΙΒΕΙΑ ───────────────────────────── */}
      <PSection id="2-4" code="4" title="Ακρίβεια και μέση τιμή" minutes={10}>
        <Predict
          q="Δύο αθλητές τερματίζουν σχεδόν μαζί. Ένα ρολόι που δείχνει μόνο δευτερόλεπτα γράφει «10 s» και για τους δύο. Ποιος κέρδισε;"
          choices={["ο Α", "ο Β", "δεν μπορούμε να ξέρουμε"]}
          answer={2}
          reveal={<>Με ακρίβεια δευτερολέπτου <b>δεν ξέρουμε</b>! Χρειαζόμαστε μικρότερη μονάδα. Τρέξε τον αγώνα 👇</>}
        />
        <PhotoFinish />
        <Keep>
          <p>
            Μεγαλύτερη <b>ακρίβεια</b> έχουμε με τη <b>μικρότερη μονάδα μέτρησης</b>: τα εκατοστά του δευτερολέπτου είναι πιο ακριβή
            από τα δευτερόλεπτα, και τα χιλιοστά πιο ακριβή από τα εκατοστά.
          </p>
        </Keep>
        <Means word="ακρίβεια">
          Πόσο κοντά στην αλήθεια είναι η μέτρησή μας. «Περίπου 10 s» είναι λίγη ακρίβεια. «10,52 s» είναι μεγάλη.
        </Means>
        <ReactionGame />
        <Keep>
          <p>Επειδή κάθε μέτρηση βγαίνει λίγο αλλιώς, μετράμε <b>πολλές φορές</b> και βρίσκουμε τη <b>μέση τιμή</b>:</p>
          <p className="text-center text-xl font-black text-[#6b3fa0]">μέση τιμή = {f("άθροισμα", "πλήθος")}</p>
        </Keep>
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.14em] text-[#a2531f]">🧪 Το πείραμα της τάξης</p>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ["1", "Δένουμε πλαστελίνη σε νήμα και κρεμάμε την άλλη άκρη."],
              ["2", "Την εκτρέπουμε (τη μετακινούμε στο πλάι), την αφήνουμε και πατάμε το χρονόμετρο."],
              ["3", "Μετράμε 10 ταλαντώσεις και σταματάμε το χρονόμετρο."],
              ["4", "Το κάνουμε 5 φορές και βρίσκουμε τη μέση τιμή."],
            ].map(([n, t]) => (
              <div key={n} className="rounded-2xl bg-[#fff7ef] p-3 text-[15px] leading-6">
                <span className="mb-1 grid h-7 w-7 place-items-center rounded-full bg-[#c96a2b] text-sm font-bold text-white">{n}</span>
                {t}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[15px] text-[#6b625b]">
            Γιατί 10 ταλαντώσεις και όχι 1; Η μία είναι πολύ γρήγορη και το λάθος του χεριού μας μετράει πολύ. Με 10, το λάθος
            «μοιράζεται».
          </p>
        </div>
        <Stepper
          title="Πέντε παιδιά μέτρησαν: 39 s, 41 s, 42 s, 38 s, 40 s. Ποια είναι η μέση τιμή;"
          steps={[
            { label: "Τι μου δίνουν", body: "5 μετρήσεις" },
            { label: "Τι ψάχνω", body: "τη μέση τιμή" },
            { label: "Ποιος κανόνας", body: <>μέση τιμή = {f("άθροισμα", "πλήθος")}</> },
            { label: "Λύνω", body: <>39 + 41 + 42 + 38 + 40 = 200 · 200 : 5 = <b>40 s</b></> },
          ]}
        />
        <MiniQuiz id="2-4" />
        <Trap
          wrong="Μέση τιμή του 8,4 · 8,5 · 8,7 · 9 · 9 = 43,6 s"
          right="43,6 : 5 = 8,72 s"
          why="Μην ξεχνάς να διαιρέσεις με το πλήθος! Το 43,6 είναι μόνο το άθροισμα."
        />
        <SectionDone id="2-4" />
      </PSection>

      {/* ───────────────────────────── 5. ΕΚΚΡΕΜΕΣ ───────────────────────────── */}
      <PSection id="2-5" code="5" title="Το εκκρεμές (απλά)" minutes={5}>
        <Predict
          q="Κάνεις κούνια στην παιδική χαρά. Κάθε «πήγαινε-έλα» κρατάει περίπου τον ίδιο χρόνο;"
          choices={["ναι, περίπου τον ίδιο", "όχι, κάθε φορά αλλιώς"]}
          answer={0}
          reveal={
            <>
              Ναι! Η κούνια και το εκκρεμές επαναλαμβάνουν την ίδια κίνηση σε <b>ίσους χρόνους</b>. Γι' αυτό τα παλιά ρολόγια τοίχου
              είχαν εκκρεμές.
            </>
          }
        />
        <Pendulum />
        <Keep>
          <p>
            Μία <b>ταλάντωση</b> = η πλαστελίνη ξεκινά από την άκρη και <b>ξαναγυρίζει στην ίδια άκρη</b> (Α → Ο → Γ → Ο → Α).
          </p>
          <p>
            Χρόνος μίας ταλάντωσης = {f("χρόνος", "πλήθος ταλαντώσεων")}, π.χ. 10 ταλαντώσεις σε 20 s → 20 : 10 = <b>2 s</b> η καθεμία.
          </p>
        </Keep>
        <Means word="εκτρέπω">Απομακρύνω κάτι λίγο από τη θέση του. Εδώ: τραβάω την πλαστελίνη στο πλάι.</Means>
        <Means word="θέση ισορροπίας">Η θέση Ο, όπου κρέμεται ήσυχη η πλαστελίνη πριν την κουνήσουμε.</Means>
        <MiniQuiz id="2-5" />
        <SectionDone id="2-5" />
      </PSection>

      {/* ───────────────────────────── ΑΣΚΗΣΕΙΣ ───────────────────────────── */}
      <PSection id="askiseis" code="✏️" title="Ασκήσεις από το βοήθημα" minutes={20}>
        <p className="text-[16px] leading-7 text-[#4d4138]">
          Λύσε τες πρώτα στο τετράδιο και μετά πάτα «Δείξε τη λύση». Οι αριθμοί είναι οι ίδιοι με του βοηθήματος. Η σελίδα δεν μπορεί
          να διορθώσει το τετράδιο: σύγκρινε εσύ τίμια! 😉
        </p>

        <h3 className="pt-2 text-lg font-bold text-[#6b3fa0]">Μετατροπές</h3>
        <Ask n="2.47" q="Σε πόσα δευτερόλεπτα αντιστοιχούν: α) 40 min, β) ¼ h;">
          <L items={["40 · 60 = 2400 s", "1 h = 3600 s, άρα ¼ h = 3600 : 4 = 900 s"]} />
        </Ask>
        <Ask n="2.48" q="Σε πόσα λεπτά αντιστοιχούν: α) 2,1 h, β) 1800 s;">
          <L items={["2,1 · 60 = 126 min", "1800 : 60 = 30 min"]} />
        </Ask>
        <Ask n="2.49" q="Ποιο είναι μεγαλύτερο: α) 5 min ή 320 s; β) 3 h ή 200 min;">
          <p>Κόλπο: κάνε τα πρώτα ίδια μονάδα!</p>
          <L items={["5 min = 300 s, άρα μεγαλύτερο είναι το 320 s", "3 h = 180 min, άρα μεγαλύτερο είναι το 200 min"]} />
        </Ask>
        <Ask n="2.50" q="Ένα διάλειμμα κρατάει 10 min. Πόσα s και πόσες h είναι;">
          <p>
            10 · 60 = <b>600 s</b>. Σε ώρες: 10 : 60 = {f(10, 60)} = <b>{f(1, 6)} h</b>.
          </p>
        </Ask>
        <Ask n="2.51" q="Να εκφράσετε τις 5 h σε min και σε s.">
          <p>
            5 · 60 = <b>300 min</b>, και 5 · 3600 = <b>18.000 s</b>.
          </p>
        </Ask>
        <Ask n="2.53" q="Ο «καθαρός» χρόνος ενός αγώνα μπάσκετ είναι 40 min. Πόσα s είναι;">
          <p>
            40 · 60 = <b>2400 s</b>.
          </p>
        </Ask>
        <Ask n="2.54" q="Γράψε από τον μικρότερο στον μεγαλύτερο: 2 h, 110 min, 7000 s">
          <p>Τα κάνω όλα δευτερόλεπτα: 2 h = 7200 s, 110 min = 6600 s, 7000 s.</p>
          <p>
            <b>110 min &lt; 7000 s &lt; 2 h</b>
          </p>
        </Ask>
        <Ask n="2.56" q="Βάλε >, < ή =: α) 2 h … 120 min, β) 3 min … 180 s, γ) 2 d … 50 h, δ) 300 s … 6 min, ε) 7200 s … 2 h">
          <L items={["= (2 · 60 = 120)", "= (3 · 60 = 180)", "< (2 ημέρες = 48 h)", "< (300 s = 5 min)", "= (2 · 3600 = 7200)"]} />
        </Ask>
        <Ask n="2.75" q="Βάλε τη σωστή μονάδα: ποδοσφαιρικός αγώνας 90 …, διδακτική ώρα 45 …, ασανσέρ από 1ο σε 2ο όροφο 15 …, τρένο Λαμία–Θεσσαλονίκη 3 …">
          <L items={["90 min", "45 min", "15 s", "3 h"]} />
        </Ask>

        <h3 className="pt-2 text-lg font-bold text-[#6b3fa0]">Σωστό ή λάθος;</h3>
        <Ask n="2.34" q={<>α) 1 h = 60 min · β) 1 h = 36.000 s · γ) 1 s = {f(1, 60)} min · δ) 10 min = 6000 s</>}>
          <L items={[ok, <>{no}: 1 h = 3600 s</>, ok, <>{no}: 10 · 60 = 600 s</>]} />
        </Ask>
        <Ask n="2.35" q={<>α) 0,5 min = 30 s · β) {f(1, 4)} h = 15 min · γ) 600 min = 100 h · δ) 300 min = 5 h</>}>
          <L items={[<>{ok}: 0,5 · 60 = 30</>, <>{ok}: 60 : 4 = 15</>, <>{no}: 600 : 60 = 10 h</>, <>{ok}: 300 : 60 = 5</>]} />
        </Ask>
        <Ask n="2.36" q="α) 1 h = 60 s · β) 1800 s = ½ h · γ) 86.400 s = 1 ημέρα · δ) 1 ημέρα = 1440 min">
          <L items={[<>{no}: 1 h = 3600 s</>, <>{ok}: μισή ώρα = 1800 s</>, <>{ok}: 24 · 3600 = 86.400</>, <>{ok}: 24 · 60 = 1440</>]} />
        </Ask>

        <h3 className="pt-2 text-lg font-bold text-[#6b3fa0]">Διάλεξε τη σωστή</h3>
        <Ask n="2.38" q="Το ρολόι με τη μεγαλύτερη ακρίβεια είναι: α) το αναλογικό, β) το ηλιακό, γ) το ψηφιακό, δ) το ρολόι με εκκρεμές.">
          <p>
            <b>γ) το ψηφιακό</b>, από αυτά που δίνει. (Το ατομικό δεν είναι στις επιλογές.)
          </p>
        </Ask>
        <Ask n="2.42" q="Ένα διαστημόπλοιο κάνει τον γύρο της Γης σε 1 ώρα, 20 λεπτά και 40 δευτερόλεπτα. Ο χρόνος είναι: α) μικρότερος από 4000 s, β) μεγαλύτερος από 5000 s, γ) μεγαλύτερος από 4500 s;">
          <Solve
            given="1 h 20 min 40 s"
            find="πόσα s είναι, για να συγκρίνω"
            rule="1 h = 3600 s, 1 min = 60 s"
            work={<>3600 + 20 · 60 + 40 = 3600 + 1200 + 40 = 4840 s. <b>Σωστό το γ</b> (4840 &gt; 4500).</>}
          />
        </Ask>
        <Ask n="2.46" q="Έξι παιδιά μετρούν τον χρόνο ενός γύρου: 89 s, 90 s, 91 s, 93 s, 95 s και x. Η μέση τιμή είναι 92 s. Πόσο είναι το x; α) 92 s, β) 94 s, γ) 96 s">
          <Solve
            given="5 μετρήσεις, η 6η άγνωστη, μέση τιμή 92 s"
            find="το x"
            rule="άθροισμα = μέση τιμή × πλήθος"
            work={<>6 · 92 = 552. Οι 5 γνωστές κάνουν 458. x = 552 − 458 = <b>94 s (β)</b>.</>}
          />
        </Ask>

        <h3 className="pt-2 text-lg font-bold text-[#6b3fa0]">Προβλήματα</h3>
        <Ask n="2.55" q="Η πρώτη ώρα του σχολείου ξεκινά 08:15 και τελειώνει 08:55. Πόσο κρατάει σε min και σε s;">
          <Solve
            given="t₁ = 08:15, t₂ = 08:55"
            find="Δt"
            rule="Δt = t₂ − t₁"
            work={<>55 − 15 = <b>40 min</b> = 40 · 60 = <b>2400 s</b>.</>}
          />
        </Ask>
        <Ask n="2.65" q="Το τρένο φεύγει από τη Θεσσαλονίκη 09:20:40 και φτάνει στην Αθήνα 14:19:35. Πόσο κράτησε το ταξίδι;">
          <Solve
            given="t₁ = 09:20:40, t₂ = 14:19:35"
            find="Δt"
            rule="Δt = t₂ − t₁ (όπως η αφαίρεση με δανεικό)"
            work={
              <>
                Τα δευτερόλεπτα 35 − 40 δεν βγαίνουν, οπότε δανείζομαι 1 λεπτό: 95 − 40 = 55 s. Τα λεπτά τώρα 18 − 20 δεν βγαίνουν,
                οπότε δανείζομαι 1 ώρα: 78 − 20 = 58 min. Οι ώρες: 13 − 9 = 4 h. <b>Δt = 4 h 58 min 55 s</b>.
              </>
            }
          />
        </Ask>
        <Ask n="2.61" q="Οι χρόνοι μιας αθλήτριας στα 200 m: 21,48 · 21,52 · 21,58 · 21,62 · 21,70 s. α) Αναλογικό ή ψηφιακό χρονόμετρο; β) Μέση τιμή;">
          <p>α) <b>Ψηφιακό</b>, γιατί έχουν εκατοστά του δευτερολέπτου.</p>
          <p>
            β) Άθροισμα 107,90 · 107,90 : 5 = <b>21,58 s</b>.
          </p>
        </Ask>
        <Ask n="2.60" q="Πέντε παιδιά μετρούν 10 ταλαντώσεις: Ανδρέας 39 s, Βασίλης 41 s, Γιάννης 42 s, Δήμητρα 38 s, Ελένη 40 s. α) Γιατί βρήκαν διαφορετικά; β) Μέση τιμή; Ποιος μέτρησε καλύτερα;">
          <p>α) Ο καθένας πατάει το κουμπί λίγο νωρίτερα ή αργότερα (<b>υποκειμενικός παράγοντας</b>).</p>
          <p>
            β) 200 : 5 = <b>40 s</b>. Καλύτερα μέτρησε η <b>Ελένη</b>, που βρήκε ακριβώς τη μέση τιμή.
          </p>
        </Ask>
        <Ask n="2.70" q="Χρονόμετρο Α (ακρίβεια λεπτού), Β (δευτερολέπτου), Γ (εκατοστού του s). Ποιο θέλει: α) ο διαιτητής ποδοσφαίρου, β) ο κριτής στα 200 m, γ) η γραμματεία στο μπάσκετ;">
          <L items={["Α (λεπτά)", "Γ (εκατοστά)", "Β (δευτερόλεπτα)"]} />
        </Ask>
        <Ask n="2.71" q="Ο καθηγητής ρώτησε σε πόσες ημέρες θα είναι τα επόμενα γενέθλια του καθενός. Η Μαρία είπε 1400 ημέρες. Γίνεται;">
          <p>
            <b>Όχι!</b> Γενέθλια έχουμε κάθε χρόνο, άρα το πολύ σε 365 ημέρες (366 σε δίσεκτο). Τα 1400 είναι σχεδόν 4 χρόνια! 😄
          </p>
        </Ask>
        <SectionDone id="askiseis" />
      </PSection>

      {/* ───────────────────────────── ΚΑΡΤΕΣ ───────────────────────────── */}
      <PSection id="kartes" code="🃏" title="Κάρτες για αποστήθιση" minutes={5}>
        <p className="text-[16px] leading-7 text-[#4d4138]">
          Διάβασε την ερώτηση, πες την απάντηση δυνατά και μετά γύρνα την κάρτα. Αν τα πεις όλα σωστά, είσαι έτοιμος!
        </p>
        <Flashcards
          cards={[
            { front: "Η διεθνής μονάδα χρόνου;", back: <>Το <b>δευτερόλεπτο (s)</b></> },
            { front: "1 min = ;", back: <b>60 s</b> },
            { front: "1 h = ;", back: <><b>60 min</b> = <b>3600 s</b></> },
            { front: "Αναλογικά όργανα;", back: <>Χρησιμοποιούν αναλογίες: <b>ρολόι με δείκτες, ηλιακό ρολόι, κλεψύδρα</b></> },
            { front: "Ψηφιακά όργανα;", back: <>Έχουν <b>μόνο ψηφία</b></> },
            { front: "Πότε έχουμε μεγαλύτερη ακρίβεια;", back: <>Με τη <b>μικρότερη μονάδα μέτρησης</b> (χιλιοστά &gt; εκατοστά)</> },
            { front: "Το ακριβέστερο όργανο;", back: <>Το <b>ατομικό ρολόι</b></> },
            { front: "Χρονική στιγμή;", back: <>Η ένδειξη του ρολογιού που δείχνει <b>πότε</b> συμβαίνει ένα γεγονός</> },
            { front: "Χρονική διάρκεια;", back: <>Ο χρόνος <b>ανάμεσα σε δύο γεγονότα</b> (δύο στιγμές): Δt = t₂ − t₁</> },
            { front: "Μέση τιμή;", back: <>{f("άθροισμα", "πλήθος")} των μετρήσεων</> },
          ]}
        />
        <a
          href="/sideris/fysiki/kefalaio-2/anakefalaiosi"
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border-2 border-[#6b3fa0]/30 bg-white px-4 py-3 font-bold text-[#6b3fa0] shadow-sm"
        >
          🖨️ Ανακεφαλαίωση σε μία σελίδα A4 (για εκτύπωση)
        </a>
        <SectionDone id="kartes" />
      </PSection>

      {/* ───────────────────────────── ΤΕΣΤ ───────────────────────────── */}
      <PSection id="test" code="🏁" title="Τελικό διαγώνισμα (στα 20)" minutes={15}>
        <p className="text-[16px] leading-7 text-[#4d4138]">
          16 ερωτήσεις σαν του καθηγητή. Απάντησε σε όλες και πάτα «Παράδοση». Στους αριθμούς γράψε μόνο τον αριθμό, π.χ. 300 ή 8,72.
          Αν χάσεις κάποιες, πάτα «Ξαναρώτα μόνο όσα έχασα». Καλή επιτυχία, Σιδέρη! 🍀
        </p>
        <FinalTest />
        <SectionDone id="test" />
      </PSection>
    </div>
  );
}

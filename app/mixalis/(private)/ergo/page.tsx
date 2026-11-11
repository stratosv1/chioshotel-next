import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { StudyBar } from "@/components/mixalis/study/StudyBar";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { Note } from "@/components/mixalis/omali/shared";
import { ErgoAnimationsClient } from "@/components/mixalis/ergo/ErgoAnimationsClient";
import { ErgoLab, ErgoQuiz } from "@/components/mixalis/ergo/ErgoInteractive";

export const metadata: Metadata = {
  title: { absolute: "Έργο, Ενέργεια και Ισχύς · Τυπολόγιο · Physics Workspace" },
  description:
    "20 περιπτώσεις για έργο, ενέργεια και ισχύ (Β΄ Λυκείου): τυπολόγιο σε ένα σχέδιο, κινούμενο σχέδιο για κάθε περίπτωση, εργαστήριο, λυμένες ασκήσεις και τεστ.",
  robots: { index: false, follow: false },
};

/* Must match scripts/mixalis/ergo_poster.py (screen_poster). */
const POSTER_W = 1212;
const POSTER_H = 1218;

const sectionNames = ["Έργο", "Ενέργεια", "ΘΜΚΕ – ΑΔΜΕ", "Ισχύς"];

/** Clickable areas over the poster cells (same grid as the poster SVG). */
const cells = Array.from({ length: 20 }, (_, i) => {
  const section = Math.floor(i / 5);
  const col = i % 5;
  return { n: i + 1, x: 17 + 238 * col, y: 146 + 256 * section, w: 226, h: 212 };
});

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

/** "W_T" → W<sub>T</sub>, "υ_{τελ}" → υ<sub>τελ</sub> */
function rich(s: string): ReactNode {
  const out: ReactNode[] = [];
  const re = /_\{([^}]*)\}|_([\p{L}\p{N}]+)/gu;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(<sub key={i++}>{m[1] ?? m[2]}</sub>);
    last = m.index + m[0].length;
  }
  if (!out.length) return s;
  if (last < s.length) out.push(s.slice(last));
  return out;
}

const groups: { range: string; title: string; text: string }[] = [
  {
    range: "1–5",
    title: "Έργο δύναμης",
    text: "W = F·s·συνθ, θ η γωνία δύναμης και μετατόπισης. θ < 90° θετικό, 90° μηδέν, > 90° αρνητικό. Βάρος: ±m·g·h ανεξάρτητα από τον δρόμο. Τριβή: W_T = −T·s με T = μ·N.",
  },
  {
    range: "6–10",
    title: "Ενέργεια",
    text: "K = ½·m·υ² (πάντα ≥ 0), U = m·g·h (διαλέγεις το U = 0), U_ελ = ½·k·x². Μεταβλητή δύναμη: έργο = εμβαδόν στο F–x. Στο F–t το εμβαδόν είναι ώθηση, όχι έργο.",
  },
  {
    range: "11–15",
    title: "ΘΜΚΕ – ΑΔΜΕ – απώλειες",
    text: "ΘΜΚΕ πάντα: ΣW = K_τελ − K_αρχ. ΑΔΜΕ μόνο με βάρος/ελατήριο: K + U = σταθ. Με τριβή: W_T = E_τελ − E_αρχ και Q = |W_T|.",
  },
  {
    range: "16–20",
    title: "Ισχύς – απόδοση",
    text: "P_μ = W/Δt, στιγμιαία P = F·υ·συνθ. η = E_ωφ/E_εισ = P_ωφ/P_εισ < 1. Γερανός με σταθερή υ: F = m·g, P = m·g·υ. kWh = μονάδα ενέργειας (3,6·10⁶ J).",
  },
];

const examples = [
  { id: "ex1", title: "Έργο πλάγιας δύναμης", level: "Βασική", question: "Δύναμη 20 N σχηματίζει γωνία 60° με μετατόπιση 4 m. Να βρεθεί το έργο της.", steps: ["Δεδομένα: F = 20 N, s = 4 m, θ = 60°.", "W = F·s·συνθ.", "W = 20·4·0,5 = 40 J."], result: "W = +40 J", tip: "δεν είναι F·s = 80 J. Χρειάζεται το συν60°." },
  { id: "ex2", title: "Τριβή και ταχύτητα", level: "Συνδυαστική", question: "Σώμα 5 kg έχει αρχική κινητική ενέργεια 100 J και ολισθαίνει 8 m σε οριζόντιο επίπεδο με μ = 0,2. Να βρεθεί η τελική ταχύτητα (g = 10 m/s²).", steps: ["N = m·g = 5·10 = 50 N.", "T = μ·N = 0,2·50 = 10 N και W_T = −T·s = −80 J.", "ΘΜΚΕ: K_τελ − K_αρχ = −80 ⇒ K_τελ = 20 J.", "½·m·υ² = 20 ⇒ υ = √(40/5) = √8 m/s."], result: "υ_τελ ≈ 2,83 m/s", tip: "το έργο της τριβής είναι αρνητικό. Η μάζα πρέπει να είναι σε kg." },
  { id: "ex3", title: "Ελεύθερη πτώση και ΑΔΜΕ", level: "Βασική", question: "Σώμα αφήνεται από ύψος h = 5 m χωρίς αντίσταση αέρα. Να βρεθεί η ταχύτητα λίγο πριν το έδαφος (g = 10 m/s²).", steps: ["ΑΔΜΕ: K_αρχ + U_αρχ = K_τελ + U_τελ.", "0 + m·g·h = ½·m·υ² + 0.", "Απλοποιείται το m: υ = √(2·g·h) = √(2·10·5)."], result: "υ = 10 m/s", tip: "σε ιδανική ελεύθερη πτώση η τελική ταχύτητα δεν εξαρτάται από τη μάζα." },
  { id: "ex4", title: "Ενέργεια ελατηρίου", level: "Βασική", question: "Ιδανικό ελατήριο k = 200 N/m επιμηκύνεται κατά 10 cm. Πόση ενέργεια αποθηκεύεται;", steps: ["Μετατροπή: x = 10 cm = 0,10 m.", "U_ελ = ½·k·x².", "U_ελ = ½·200·(0,10)² = 100·0,01."], result: "U_ελ = 1 J", tip: "πρώτα μετατρέπουμε τα cm σε m. Το x είναι στο τετράγωνο." },
  { id: "ex5", title: "Γερανός: έργο, ισχύς και απόδοση", level: "Συνδυαστική", question: "Γερανός ανεβάζει φορτίο 100 kg κατά 10 m σε 20 s, με απόδοση 80%. Βρείτε την ωφέλιμη και την εισερχόμενη ισχύ (g = 10 m/s²).", steps: ["Ωφέλιμο έργο: W_ωφ = m·g·h = 100·10·10 = 10.000 J.", "Μέση ωφέλιμη ισχύς: P_ωφ = 10.000/20 = 500 W.", "η = P_ωφ/P_εισ = 0,8 ⇒ P_εισ = 500/0,8."], result: "P_ωφ = 500 W · P_εισ = 625 W", tip: "η ισχύς εισόδου είναι μεγαλύτερη από την ωφέλιμη εξαιτίας των απωλειών." },
  { id: "ex6", title: "Ενέργεια με απώλειες", level: "Συνδυαστική", question: "Σώμα έχει αρχική μηχανική ενέργεια 50 J. Κατά την κίνηση η τριβή κάνει έργο −15 J. Ποια είναι η τελική μηχανική ενέργεια;", steps: ["W_T = ΔE_μηχ = E_τελ − E_αρχ.", "−15 = E_τελ − 50.", "E_τελ = 50 − 15."], result: "E_τελ = 35 J", tip: "δεν χάθηκε συνολική ενέργεια· τα 15 J έγιναν θερμότητα." },
  { id: "ex7", title: "Έργο από διάγραμμα F–x", level: "Μέτρια", question: "Η δύναμη αυξάνεται γραμμικά από 0 N σε 10 N όταν η θέση μεταβάλλεται από 0 m σε 4 m. Πόσο είναι το έργο;", steps: ["Το εμβαδόν κάτω από τη γραμμή F–x είναι τρίγωνο.", "Βάση = 4 m, ύψος = 10 N.", "W = ½·4·10."], result: "W = 20 J", tip: "μην το μπερδεύεις με διάγραμμα F–t, που δίνει ώθηση." },
  { id: "ex8", title: "Λάμπα και κιλοβατώρες", level: "Εφαρμογή", question: "Λάμπα ισχύος 100 W λειτουργεί 5 ώρες. Πόση ηλεκτρική ενέργεια καταναλώνει;", steps: ["P = 100 W = 0,1 kW.", "E = P·t = 0,1 kW · 5 h = 0,5 kWh.", "Σε joule: 0,5·3,6·10⁶ = 1,8·10⁶ J."], result: "E = 0,5 kWh = 1,8 MJ", tip: "η kWh είναι μονάδα ενέργειας, όχι ισχύος." },
];

function Mark({ id, title, className = "mt-4" }: { id: string; title: string; className?: string }) {
  return <StudyMark lesson="ergo" id={id} title={title} path="/mixalis/ergo" className={className} />;
}

function SectionHead({ kicker, title, text }: { kicker: string; title: string; text?: ReactNode }) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">{kicker}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {text ? <p className="mt-1 max-w-3xl text-[15px] leading-7 text-[#5c534c]">{text}</p> : null}
    </>
  );
}

export default function ErgoPage() {
  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 py-6 text-[#2c2825] sm:px-8 sm:py-10 lg:px-[3rem]">
      <div className="w-full space-y-[4rem]">
        <header>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
              ← Τα μαθήματά μου
            </Link>
            <Link href="/mixalis/ormi" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
              Ορμή και κρούσεις →
            </Link>
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική Β΄ Λυκείου</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Έργο, ενέργεια και ισχύς: τυπολόγιο</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            20 περιπτώσεις σε ένα σχέδιο, από τα 20 εκπαιδευτικά διαγράμματα και το σχολικό βιβλίο: έργο δύναμης, κινητική και δυναμική ενέργεια,
            ΘΜΚΕ, ΑΔΜΕ, απώλειες, ισχύς και απόδοση. <b>Πάτα ένα κουτάκι</b> και θα σε πάει στο κινούμενο σχέδιό του, όπου το φαινόμενο εξηγείται βήμα
            βήμα. Στο τέλος υπάρχουν εργαστήριο, λυμένες ασκήσεις και τεστ.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            <a href="/mixalis/ergo-typologio.svg" target="_blank" rel="noopener" className="rounded-full border border-[#ddd5c7] bg-white px-4 py-1.5 hover:bg-[#f3efe8]">
              Poster σε πλήρες μέγεθος
            </a>
            <a href="/mixalis/ergo-typologio-A4.pdf" target="_blank" rel="noopener" className="rounded-full bg-[#2c2825] px-4 py-1.5 text-white hover:bg-black">
              Εκτύπωση σε A4 (PDF, 1 σελίδα)
            </a>
          </div>
        </header>

        <StudyBar lesson="ergo" />

        <section id="typoi" className="scroll-mt-20 border-t border-[#ddd5c7] pt-8">
          <div className="relative mx-auto max-w-[1500px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mixalis/ergo-typologio.svg"
              alt="Τυπολόγιο έργου, ενέργειας και ισχύος: 20 περιπτώσεις με σχήματα και τύπους"
              width={POSTER_W}
              height={POSTER_H}
              decoding="async"
              className="mx-auto h-auto w-full"
            />
            {cells.map((c) => (
              <a
                key={c.n}
                href={`#k${c.n}`}
                aria-label={`Κινούμενο σχέδιο για το κουτάκι ${c.n}`}
                className="absolute rounded-lg outline-none ring-[#c9822f] transition hover:bg-[#c9822f]/10 hover:ring-2 focus-visible:ring-2"
                style={{ left: pct(c.x, POSTER_W), top: pct(c.y, POSTER_H), width: pct(c.w, POSTER_W), height: pct(c.h, POSTER_H) }}
              />
            ))}
          </div>
        </section>

        <nav className="sticky top-0 z-10 -mx-4 border-b border-[#ddd5c7] bg-[rgba(244,241,234,0.92)] px-4 py-2 backdrop-blur sm:-mx-[2rem] sm:px-8 lg:-mx-[3rem] lg:px-[3rem]" aria-label="Ενότητες">
          <div className="flex gap-1.5 overflow-x-auto text-sm font-semibold">
            <a href="#typoi" className="shrink-0 rounded-full px-3 py-1.5 text-[#4d4138] hover:bg-[#f3efe8]">
              Τυπολόγιο
            </a>
            {sectionNames.map((name, i) => (
              <a key={name} href={`#enotita-${i + 1}`} className="shrink-0 rounded-full px-3 py-1.5 text-[#4d4138] hover:bg-[#f3efe8]">
                {i + 1}. {name}
              </a>
            ))}
            {[
              ["#ergastirio", "Εργαστήριο"],
              ["#askiseis", "Λυμένες"],
              ["#test", "Τεστ"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="shrink-0 rounded-full px-3 py-1.5 text-[#857261] hover:bg-[#f3efe8]">
                {label}
              </a>
            ))}
          </div>
        </nav>

        <section className="border-t border-[#ddd5c7] pt-8">
          <SectionHead kicker="Κινούμενα σχέδια" title="Πώς διαβάζεις τα σχέδια" />
          <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-[15px] leading-7 text-[#3d4452]">
            <li>
              Διάβασε το <b>«Τι βλέπεις»</b> και τα <b>Δεδομένα</b>: είναι σαν την εκφώνηση μιας άσκησης.
            </li>
            <li>
              Το σχέδιο παίζει <b>ένα βήμα τη φορά</b> και σταματά. Διάβασε την εξήγηση κάτω από την εικόνα και πάτα <b>«Επόμενο βήμα»</b>. Αν θες να
              το δεις ξανά, πάτα πάνω στο όνομα του βήματος.
            </li>
            <li>
              Πριν ανοίξεις τη λύση, προσπάθησε να τη γράψεις μόνος σου. Μετά πάτα <b>«Δείξε τη λύση»</b> και σύγκρινε.
            </li>
          </ol>
          <div className="mt-6 grid gap-x-[2.5rem] gap-y-[1.5rem] lg:grid-cols-3">
            <div className="border-l-2 border-[#c9822f]/50 pl-4 text-sm leading-6 text-[#3d4452]">
              <p className="font-semibold text-[#1c2433]">Τα χρώματα</p>
              <p className="mt-1">
                <span className="font-semibold text-[#d9342b]">Κόκκινο</span> = δύναμη ·{" "}
                <span className="font-semibold text-[#1f6fd1]">μπλε</span> = ταχύτητα ·{" "}
                <span className="font-semibold text-[#e08a1e]">πορτοκαλί</span> = κινητική ενέργεια ή ισχύς ·{" "}
                <span className="font-semibold text-[#1f9d55]">πράσινο</span> = δυναμική ενέργεια ·{" "}
                <span className="font-semibold text-[#6b3fa0]">μωβ</span> = έργο ή μηχανική ενέργεια ·{" "}
                <span className="font-semibold text-[#b04a3c]">κεραμιδί</span> = τριβή και θερμότητα.
              </p>
            </div>
            <div className="border-l-2 border-[#c9822f]/50 pl-4 text-sm leading-6 text-[#3d4452]">
              <p className="font-semibold text-[#1c2433]">Οι ράβδοι και το κουτάκι δεξιά</p>
              <p className="mt-1">
                Οι ράβδοι δείχνουν έργα, ενέργειες και ισχύ και αλλάζουν μαζί με το σχέδιο· η τιμή γράφεται πάνω τους με τη μονάδα της. Στο λευκό
                κουτάκι γράφονται οι πράξεις του βήματος που βλέπεις.
              </p>
            </div>
            <div className="border-l-2 border-[#c9822f]/50 pl-4 text-sm leading-6 text-[#3d4452]">
              <p className="font-semibold text-[#1c2433]">Σύμβολα</p>
              <ul className="mt-1 grid gap-y-1">
                <li>
                  <b>W</b>: έργο (J) · <b>K</b>: κινητική · <b>U</b>: δυναμική ενέργεια
                </li>
                <li>
                  <b>
                    E<sub>μηχ</sub>
                  </b>{" "}
                  = K + U: μηχανική ενέργεια · <b>Q</b>: θερμότητα
                </li>
                <li>
                  <b>T</b> = μ·N: τριβή · <b>N</b>: κάθετη αντίδραση
                </li>
                <li>
                  <b>P</b>: ισχύς (W = J/s) · <b>η</b>: βαθμός απόδοσης
                </li>
                <li>
                  <b>g</b> = 10 m/s² · 1 kWh = 3,6·10⁶ J
                </li>
              </ul>
            </div>
          </div>
        </section>

        <ErgoAnimationsClient />

        <section className="border-t border-[#ddd5c7] pt-8">
          <SectionHead kicker="Οδηγός" title="Τι προσέχεις σε κάθε ενότητα" />
          <div className="mt-6 grid gap-x-[2.5rem] gap-y-[1.5rem] sm:grid-cols-2 xl:grid-cols-4">
            {groups.map((g) => (
              <div key={g.range} className="border-t border-[#ddd5c7] pt-3">
                <p className="text-xs font-semibold text-[#857261]">Κουτάκια {g.range}</p>
                <p className="mt-1 font-semibold">{g.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#5c534c]">{rich(g.text)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            <Note tone="warn" title="Οι 4 πιο συχνές παγίδες">
              <ul className="mt-1 space-y-1">
                <li>• Το έργο δεν είναι πάντα F·s: χρειάζεται το συνθ. Κάθετη δύναμη ⇒ W = 0.</li>
                <li>• Στο ΘΜΚΕ μπαίνουν τα έργα ΟΛΩΝ των δυνάμεων. ΑΔΜΕ μόνο χωρίς τριβή.</li>
                <li>• Η μηχανική ενέργεια μειώνεται με τριβή, η συνολική ενέργεια όχι.</li>
                <li>• kW = ισχύς, kWh = ενέργεια. Εμβαδόν F–x = έργο, εμβαδόν F–t = ώθηση.</li>
              </ul>
            </Note>
            <Note tone="ok" title="Από πού είναι">
              Τα 20 κουτάκια ακολουθούν τα 20 εκπαιδευτικά διαγράμματα (Work, Energy and Power) και το σχολικό βιβλίο. Οι πράξεις γίνονται με g = 10 m/s²,
              όπως στο σχολείο, γι&apos; αυτό μερικοί αριθμοί διαφέρουν λίγο από τα διαγράμματα που έχουν g = 9,8 m/s².
            </Note>
          </div>
        </section>

        <section id="ergastirio" data-study-lesson="ergo" data-study-id="ergastirio" className="scroll-mt-20 border-t border-[#ddd5c7] pt-8">
          <SectionHead
            kicker="Εργαστήριο"
            title="Παίξε με τις τιμές"
            text="Σύρε τους διακόπτες και προσπάθησε να προβλέψεις τι θα αλλάξει πριν μετακινήσεις έναν διακόπτη."
          />
          <div className="mt-5">
            <ErgoLab />
          </div>
          <Mark id="ergastirio" title="Διαδραστικό εργαστήριο" />
        </section>

        <section id="askiseis" className="scroll-mt-20 border-t border-[#ddd5c7] pt-8">
          <SectionHead kicker="Λυμένα παραδείγματα" title="8 ασκήσεις με πλήρη λύση" text="Διάβασε πρώτα τα δεδομένα, λύσε μόνος σου και μετά άνοιξε τα βήματα." />
          <div className="mt-6 grid gap-x-[2.5rem] gap-y-[1.5rem] lg:grid-cols-2">
            {examples.map((ex, i) => (
              <article key={ex.id} id={ex.id} data-study-lesson="ergo" data-study-id={ex.id} className="scroll-mt-24 border-t border-[#ddd5c7] pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold sm:text-lg">
                    {i + 1}. {ex.title}
                  </h3>
                  <span className="rounded-full bg-[#f2e9de] px-3 py-1 text-xs font-semibold text-[#6a5341]">{ex.level}</span>
                </div>
                <p className="mt-2 text-[15px] leading-7 text-[#4d4138]">{ex.question}</p>
                <details className="mt-3 rounded-xl border border-[#e1d8cc] bg-white p-3 sm:p-4">
                  <summary className="cursor-pointer font-semibold text-[#805522]">Δείξε τη λύση βήμα βήμα</summary>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#4d4138]">
                    {ex.steps.map((step, j) => (
                      <li key={j}>{rich(step)}</li>
                    ))}
                  </ol>
                  <p className="mt-4 rounded-xl bg-[#e9f5ec] p-3 font-semibold text-[#245c3d]">{rich(ex.result)}</p>
                  <p className="mt-3 text-sm leading-6 text-[#885f32]">
                    <b>Πρόσεξε:</b> {ex.tip}
                  </p>
                </details>
                <Mark id={ex.id} title={ex.title} className="mt-3" />
              </article>
            ))}
          </div>
        </section>

        <section id="test" className="scroll-mt-20 border-t border-[#ddd5c7] pt-8">
          <SectionHead kicker="Αυτοαξιολόγηση" title="Τεστ κατανόησης: 7 ερωτήσεις" text="Διάλεξε απάντηση. Βλέπεις αμέσως αν είναι σωστή και την αιτιολόγηση." />
          <div className="mt-5">
            <ErgoQuiz />
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ddd5c7] pt-6 text-sm text-[#5c534c]">
          <p>Υπολογισμοί με g = 10 m/s², εκτός αν αναφέρεται διαφορετικά. Στις ιδανικές περιπτώσεις αμελούμε τις αντιστάσεις.</p>
          <Link href="/mixalis" prefetch={false} className="font-semibold text-[#805522] hover:underline">
            ← Επιστροφή στα μαθήματα
          </Link>
        </footer>
      </div>
    </main>
  );
}

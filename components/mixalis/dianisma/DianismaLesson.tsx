"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow, Formula, Note } from "../omali/shared";
import { ThinkCard, type ThinkQuestion } from "../omali/Think";
import { ComponentsLab } from "./ComponentsLab";
import { AngleArc, C, Sb, Txt, V, VL } from "./figures";
import { IdeaCards } from "./IdeaCards";

function Section({
  id,
  kicker,
  title,
  intro,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">{kicker}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {intro ? <div className="mt-3 max-w-3xl text-[15px] leading-7 text-[#5c534c]">{intro}</div> : null}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2c2825] text-xs font-semibold text-white">{n}</span>
      <div className="text-[15px] leading-7 text-[#3d3530]">{children}</div>
    </li>
  );
}

/* ───────────── Right triangle: definitions of ημ, συν, εφ ───────────── */

function TrigTriangle() {
  // A (θ vertex) at bottom-left, B right angle at bottom-right, Γ top.
  const ax = 40;
  const ay = 170;
  const bx = 250;
  const gy = 50;
  return (
    <svg viewBox="0 0 320 200" className="w-full" role="img" aria-label="Ορθογώνιο τρίγωνο με υποτείνουσα, απέναντι και προσκείμενη πλευρά">
      <polygon points={`${ax},${ay} ${bx},${ay} ${bx},${gy}`} fill="#fbf8f3" stroke="none" />
      <line x1={ax} y1={ay} x2={bx} y2={ay} stroke={C.teal} strokeWidth={4} strokeLinecap="round" />
      <line x1={bx} y1={ay} x2={bx} y2={gy} stroke={C.green} strokeWidth={4} strokeLinecap="round" />
      <line x1={ax} y1={ay} x2={bx} y2={gy} stroke={C.orange} strokeWidth={4} strokeLinecap="round" />
      <path d={`M${bx - 14},${ay} L${bx - 14},${ay - 14} L${bx},${ay - 14}`} fill="none" stroke={C.muted} strokeWidth={1.3} />
      <AngleArc cx={ax} cy={ay} r={36} a1={(Math.atan2(ay - gy, bx - ax) * 180) / Math.PI} label="θ" labelR={50} color={C.ink} />
      <Txt x={145} y={192} color={C.teal} size={13}>προσκείμενη</Txt>
      <Txt x={262} y={115} color={C.green} size={13} anchor="start">απέναντι</Txt>
      <Txt x={120} y={98} color={C.orange} size={13} anchor="end">υποτείνουσα</Txt>
    </svg>
  );
}

const trigRows: { deg: string; sin: string; cos: string; tan: string; sinD: string; cosD: string }[] = [
  { deg: "0°", sin: "0", cos: "1", tan: "0", sinD: "0", cosD: "1" },
  { deg: "30°", sin: "1/2", cos: "√3/2", tan: "√3/3", sinD: "0,5", cosD: "0,866" },
  { deg: "45°", sin: "√2/2", cos: "√2/2", tan: "1", sinD: "0,707", cosD: "0,707" },
  { deg: "60°", sin: "√3/2", cos: "1/2", tan: "√3", sinD: "0,866", cosD: "0,5" },
  { deg: "90°", sin: "1", cos: "0", tan: "δεν ορίζεται", sinD: "1", cosD: "0" },
];

function TrigTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10">
      <table className="w-full min-w-[420px] text-center text-[15px]">
        <thead className="bg-[#2c2825] text-white">
          <tr>
            <th className="px-3 py-2 font-semibold">θ</th>
            <th className="px-3 py-2 font-semibold">ημθ</th>
            <th className="px-3 py-2 font-semibold">συνθ</th>
            <th className="px-3 py-2 font-semibold">εφθ</th>
          </tr>
        </thead>
        <tbody>
          {trigRows.map((r, i) => (
            <tr key={r.deg} className={i % 2 ? "bg-[#fbf8f3]" : "bg-white"}>
              <td className="px-3 py-2 font-semibold text-[#c9822f]">{r.deg}</td>
              <td className="px-3 py-2" style={{ color: C.green }}>
                <b>{r.sin}</b>
                {r.sin !== r.sinD ? <span className="ml-1.5 text-xs text-[#857261]">≈ {r.sinD}</span> : null}
              </td>
              <td className="px-3 py-2" style={{ color: C.teal }}>
                <b>{r.cos}</b>
                {r.cos !== r.cosD ? <span className="ml-1.5 text-xs text-[#857261]">≈ {r.cosD}</span> : null}
              </td>
              <td className="px-3 py-2 text-[#2c2825]">{r.tan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ───────────── Worked examples ───────────── */

function SuitcaseFigure() {
  const hx = 130;
  const hy = 100;
  const L = 120;
  const ex = hx + L * Math.cos(Math.PI / 6);
  const ey = hy - L * Math.sin(Math.PI / 6);
  return (
    <svg viewBox="0 0 300 175" className="w-full" role="img" aria-label="Βαλίτσα που τραβιέται με δύναμη 20 N υπό γωνία 30°">
      <line x1={10} y1={150} x2={290} y2={150} stroke="#b9ab9b" strokeWidth={2} />
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={i} x1={14 + i * 20} y1={150} x2={4 + i * 20} y2={160} stroke="#d6cabd" strokeWidth={1} />
      ))}
      <rect x={60} y={95} width={70} height={52} rx={8} fill="#c9822f" opacity={0.85} />
      <rect x={82} y={88} width={26} height={9} rx={3} fill="none" stroke="#8a5a3c" strokeWidth={2.5} />
      <circle cx={72} cy={148} r={4} fill="#4d4138" />
      <circle cx={118} cy={148} r={4} fill="#4d4138" />
      <line x1={hx} y1={hy} x2={ex} y2={hy} stroke={C.teal} strokeWidth={1} strokeDasharray="3 3" />
      <Arrow x1={hx} y1={hy} x2={ex} y2={hy} color={C.teal} width={3} />
      <Arrow x1={ex} y1={hy} x2={ex} y2={ey} color={C.green} width={3} dashed />
      <Arrow x1={hx} y1={hy} x2={ex} y2={ey} color={C.orange} width={4.5} head={13} />
      <AngleArc cx={hx} cy={hy} r={32} a1={30} label="30°" labelR={50} color={C.ink} />
      <VL x={180} y={58} color={C.orange}>F</VL>
      <Txt x={180} y={118} color={C.teal} italic size={13}>F<Sb>x</Sb></Txt>
      <Txt x={ex + 8} y={78} color={C.green} italic size={13} anchor="start">F<Sb>y</Sb></Txt>
      <Txt x={232} y={30} color={C.orange} size={12}>F = 20 N</Txt>
    </svg>
  );
}

function TwoForcesFigure() {
  const ox = 60;
  const oy = 140;
  const s = 28;
  const x1 = ox + 3 * s;
  const y2 = oy - 4 * s;
  return (
    <svg viewBox="0 0 230 165" className="w-full" role="img" aria-label="Δύο κάθετες δυνάμεις 3 N και 4 N και η συνισταμένη τους">
      <line x1={x1} y1={oy} x2={x1} y2={y2} stroke={C.muted} strokeWidth={1} strokeDasharray="3 4" />
      <line x1={ox} y1={y2} x2={x1} y2={y2} stroke={C.muted} strokeWidth={1} strokeDasharray="3 4" />
      <Arrow x1={ox} y1={oy} x2={x1} y2={oy} color={C.teal} width={4} head={11} />
      <Arrow x1={ox} y1={oy} x2={ox} y2={y2} color={C.orange} width={4} head={11} />
      <Arrow x1={ox} y1={oy} x2={x1} y2={y2} color={C.green} width={4} head={12} />
      <AngleArc cx={ox} cy={oy} r={26} a1={53.13} label="θ" labelR={38} color={C.ink} />
      <Txt x={(ox + x1) / 2} y={oy + 18} color={C.teal} size={13}>F₁ = 3 N</Txt>
      <Txt x={ox - 8} y={(oy + y2) / 2} color={C.orange} size={13} anchor="end">F₂ =</Txt>
      <Txt x={ox - 8} y={(oy + y2) / 2 + 15} color={C.orange} size={13} anchor="end">4 N</Txt>
      <Txt x={x1 + 8} y={y2 + 4} color={C.green} size={13} anchor="start">R = ;</Txt>
    </svg>
  );
}

/* ───────────── Quick check ───────────── */

const quiz: ThinkQuestion[] = [
  {
    prompt: (
      <>
        Δύναμη F = 10 N σχηματίζει γωνία 60° με τον άξονα x. Πόση είναι η F<sub>x</sub>;
      </>
    ),
    choices: ["5 N", "8,66 N", "10 N", "0 N"],
    correct: 0,
    whyWrong: {
      1: (
        <>
          Αυτό είναι το 10·ημ60°, δηλαδή η F<sub>y</sub>. Για τον άξονα x (προσκείμενη) θέλεις συνημίτονο.
        </>
      ),
    },
    explain: (
      <>
        F<sub>x</sub> = F·συνθ = 10·συν60° = 10·0,5 = <b>5 N</b>.
      </>
    ),
    tryIt: "Βάλε στο εργαστήριο F = 10 N και θ = 60°.",
  },
  {
    prompt: "Δύο κάθετες δυνάμεις 6 N και 8 N. Πόση είναι η συνισταμένη;",
    choices: ["14 N", "2 N", "10 N", "48 N"],
    correct: 2,
    whyWrong: {
      0: "Τα 14 N τα παίρνεις μόνο αν είναι παράλληλες (ίδια φορά). Κάθετες ⇒ Πυθαγόρειο.",
      1: "Τα 2 N τα παίρνεις μόνο αν είναι αντίθετες.",
    },
    explain: (
      <>
        R = √(6² + 8²) = √(36 + 64) = √100 = <b>10 N</b>.
      </>
    ),
  },
  {
    prompt: (
      <>
        Σε ποια γωνία οι δύο συνιστώσες F<sub>x</sub> και F<sub>y</sub> είναι ίσες;
      </>
    ),
    choices: ["30°", "45°", "60°", "90°"],
    correct: 1,
    explain: (
      <>
        Στις <b>45°</b> ισχύει ημ45° = συν45° = √2/2 ≈ 0,707, άρα F<sub>x</sub> = F<sub>y</sub>.
      </>
    ),
    tryIt: "Πάτα 45° στο εργαστήριο και κοίτα τα δύο νούμερα.",
  },
  {
    prompt: (
      <>
        Μια δύναμη είναι οριζόντια (θ = 0°). Πόση είναι η F<sub>y</sub>;
      </>
    ),
    choices: ["Ίση με F", "Μηδέν", "F/2", "Δεν ορίζεται"],
    correct: 1,
    explain: (
      <>
        F<sub>y</sub> = F·ημ0° = F·0 = <b>0</b>. Μια οριζόντια δύναμη δεν έχει κατακόρυφο κομμάτι.
      </>
    ),
  },
];

/* ───────────── Page ───────────── */

const nav = [
  { href: "#ideas", label: "12 ιδέες" },
  { href: "#trig", label: "Τριγωνομετρία" },
  { href: "#lab", label: "Εργαστήριο" },
  { href: "#examples", label: "Παραδείγματα" },
  { href: "#quiz", label: "Τεστ" },
  { href: "#summary", label: "Τυπολόγιο" },
];

export function DianismaLesson() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
            ← Physics Workspace
          </Link>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Φυσική · Διανύσματα</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Διάνυσμα: πέρα από το βέλος</h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#5c534c] sm:text-base">
            Το βέλος απλώς <b>ζωγραφίζει</b> ένα διάνυσμα. Το διάνυσμα είναι φυσικό μέγεθος με <b>μέτρο</b> (πόσο), <b>διεύθυνση</b> (σε ποια ευθεία)
            και <b>φορά</b> (προς τα πού). Αν μάθεις να «μιλάς» με διανύσματα, δυνάμεις, κινήσεις, ισορροπία, έργο και ροπή γίνονται στην ουσία
            το ίδιο πρόβλημα.
          </p>
          <nav className="mt-6 flex flex-wrap gap-2">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-full border border-black/10 bg-[#fbf8f3] px-3.5 py-1.5 text-sm font-semibold text-[#4d4138] transition hover:bg-[#ede5da]"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </header>

        <Section
          id="ideas"
          kicker="Μέρος 1"
          title="12 ιδέες που ξεχνάμε"
          intro="Κάθε κάρτα έχει ένα σχήμα, τον κανόνα με δυο λόγια και ένα παράδειγμα από την καθημερινή ζωή."
        >
          <IdeaCards />
        </Section>

        <Section
          id="trig"
          kicker="Μέρος 2"
          title="Τριγωνομετρικοί αριθμοί: το εργαλείο για τις συνιστώσες"
          intro={
            <>
              Όταν σχεδιάζεις ένα διάνυσμα και τις δύο συνιστώσες του, σχηματίζεται <b>ορθογώνιο τρίγωνο</b>. Το διάνυσμα είναι η υποτείνουσα. Οι
              τρεις τριγωνομετρικοί αριθμοί είναι απλώς λόγοι πλευρών:
            </>
          }
        >
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-white p-3">
              <TrigTriangle />
            </div>
            <div className="space-y-3 text-[15px] leading-7">
              <p>
                <span className="font-semibold" style={{ color: C.green }}>ημθ</span> = <span style={{ color: C.green }}>απέναντι</span> /{" "}
                <span style={{ color: C.orange }}>υποτείνουσα</span>
              </p>
              <p>
                <span className="font-semibold" style={{ color: C.teal }}>συνθ</span> = <span style={{ color: C.teal }}>προσκείμενη</span> /{" "}
                <span style={{ color: C.orange }}>υποτείνουσα</span>
              </p>
              <p>
                <span className="font-semibold">εφθ</span> = <span style={{ color: C.green }}>απέναντι</span> /{" "}
                <span style={{ color: C.teal }}>προσκείμενη</span>
              </p>
              <Note tone="ok">
                Λύνοντας ως προς τις πλευρές παίρνεις τους δύο τύπους που θα χρησιμοποιείς συνέχεια:
                <span className="mt-2 flex flex-wrap gap-2">
                  <Formula>F<sub>x</sub> = F·συνθ</Formula>
                  <Formula>F<sub>y</sub> = F·ημθ</Formula>
                </span>
              </Note>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Ο πίνακας που πρέπει να ξέρεις απ' έξω</h3>
            <TrigTable />
            <p className="mt-3 text-[14px] leading-6 text-[#6b625b]">
              <b>Κόλπο:</b> το ημ «ανεβαίνει» 0 → 1/2 → √2/2 → √3/2 → 1, και το συν κάνει την ίδια σειρά <b>ανάποδα</b>. Άρα ημ30° = συν60° και
              ημ60° = συν30°.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Και ανάποδα: από τις συνιστώσες στο διάνυσμα</h3>
            <div className="flex flex-wrap gap-2">
              <Formula>F = √(F<sub>x</sub>² + F<sub>y</sub>²)</Formula>
              <Formula>εφθ = F<sub>y</sub> / F<sub>x</sub></Formula>
            </div>
          </div>
        </Section>

        <Section
          id="lab"
          kicker="Μέρος 3"
          title="Εργαστήριο: σπάσε μια δύναμη σε συνιστώσες"
          intro="Άλλαξε το μέτρο και τη γωνία. Δες πώς μεγαλώνει η μία συνιστώσα όταν μικραίνει η άλλη, και ότι μαζί δίνουν πάντα την αρχική δύναμη."
        >
          <ComponentsLab />
          <Note tone="warn">
            Προσοχή: η γωνία θ μετριέται από τον <b>άξονα x</b>. Αν σου δώσουν τη γωνία με τον άξονα y, τότε αλλάζουν θέση: F<sub>x</sub> = F·ημφ και
            F<sub>y</sub> = F·συνφ.
          </Note>
        </Section>

        <Section id="examples" kicker="Μέρος 4" title="Λυμένα παραδείγματα">
          <div className="grid items-start gap-6 md:grid-cols-[1fr_1.1fr]">
            <div className="rounded-2xl border border-black/10 bg-white p-3">
              <SuitcaseFigure />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Παράδειγμα 1: Η βαλίτσα</h3>
              <p className="mt-2 text-[15px] leading-7 text-[#4d4138]">
                Τραβάς μια βαλίτσα με δύναμη <b>F = 20 N</b> από τη λαβή, που σχηματίζει γωνία <b>30°</b> με το έδαφος. Πόσο από τη δύναμη τη
                σπρώχνει μπροστά και πόσο την ανασηκώνει;
              </p>
              <ol className="mt-4 space-y-3">
                <Step n={1}>
                  Ζωγραφίζω άξονες: x οριζόντια, y κατακόρυφα. Η γωνία 30° είναι με τον x.
                </Step>
                <Step n={2}>
                  <span style={{ color: C.teal }}>F<sub>x</sub></span> = F·συν30° = 20·0,866 ≈ <b>17,3 N</b> (σπρώχνει μπροστά)
                </Step>
                <Step n={3}>
                  <span style={{ color: C.green }}>F<sub>y</sub></span> = F·ημ30° = 20·0,5 = <b>10 N</b> (ανασηκώνει)
                </Step>
                <Step n={4}>
                  Έλεγχος: √(17,3² + 10²) = √(300 + 100) = √400 = 20 N ✔
                </Step>
              </ol>
              <p className="mt-4 rounded-xl bg-[#f3efe8] px-3 py-2 text-[14px] leading-6 text-[#5c534c]">
                <b>Και το έργο;</b> Αν η βαλίτσα μετακινηθεί 5 m, μόνο η F<sub>x</sub> παράγει έργο: W = F·Δx·συν30° = 20·5·0,866 ≈ <b>86,6 J</b>. Αυτό
                είναι το εσωτερικό γινόμενο (ιδέα 10) στην πράξη.
              </p>
            </div>
          </div>

          <hr className="border-black/10" />

          <div className="grid items-start gap-6 md:grid-cols-[1fr_1.1fr]">
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-black/10 bg-white p-3">
              <TwoForcesFigure />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Παράδειγμα 2: Δύο κάθετες δυνάμεις</h3>
              <p className="mt-2 text-[15px] leading-7 text-[#4d4138]">
                Σε ένα σώμα ασκούνται <b>F₁ = 3 N</b> ανατολικά και <b>F₂ = 4 N</b> βόρεια. Βρες τη συνισταμένη <V>R</V> (μέτρο και κατεύθυνση).
              </p>
              <ol className="mt-4 space-y-3">
                <Step n={1}>
                  Είναι κάθετες, άρα σχηματίζουν ορθογώνιο τρίγωνο με υποτείνουσα την R.
                </Step>
                <Step n={2}>
                  Μέτρο (Πυθαγόρειο): R = √(3² + 4²) = √(9 + 16) = √25 = <b>5 N</b>
                </Step>
                <Step n={3}>
                  Κατεύθυνση: εφθ = F₂ / F₁ = 4/3 ≈ 1,33 ⇒ θ ≈ <b>53°</b> πάνω από τον άξονα x.
                </Step>
                <Step n={4}>
                  Παγίδα: <b>όχι</b> 3 + 4 = 7 N. Τα μέτρα προστίθενται απλά μόνο όταν οι δυνάμεις είναι παράλληλες.
                </Step>
              </ol>
            </div>
          </div>
        </Section>

        <Section id="quiz" kicker="Μέρος 5" title="Γρήγορο τεστ" intro="Διάλεξε πρώτα απάντηση, μετά δες την εξήγηση.">
          <div className="grid gap-4 md:grid-cols-2">
            {quiz.map((q, i) => (
              <ThinkCard key={i} question={q} label="Δοκίμασε" index={i + 1} />
            ))}
          </div>
        </Section>

        <Section id="summary" kicker="Τυπολόγιο" title="Όλα σε μία ματιά">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Συνιστώσες", "Fx = F·συνθ,  Fy = F·ημθ"],
              ["Μέτρο από συνιστώσες", "F = √(Fx² + Fy²)"],
              ["Γωνία από συνιστώσες", "εφθ = Fy / Fx"],
              ["Συνισταμένη (κάθετες)", "R = √(F₁² + F₂²)"],
              ["Αφαίρεση", "A − B = A + (−B)"],
              ["Ισορροπία", "ΣF = 0  ⇔  ΣFx = 0 και ΣFy = 0"],
              ["Εσωτερικό γινόμενο (αριθμός)", "A·B = A·B·συνθ"],
              ["Εξωτερικό γινόμενο (διάνυσμα)", "|A×B| = A·B·ημθ"],
            ].map(([label, f]) => (
              <div key={label} className="rounded-2xl border border-black/10 bg-[#fbf8f3] px-4 py-3">
                <p className="text-xs font-semibold text-[#857261]">{label}</p>
                <p className="mt-1 font-mono text-[15px] font-semibold text-[#2c2825]">{f}</p>
              </div>
            ))}
          </div>
          <p className="rounded-2xl bg-[#2c2825] px-5 py-4 text-center text-[15px] font-semibold leading-7 text-white">
            Τα διανύσματα περιγράφουν <span className="text-[#f0b46a]">μέγεθος</span>, <span className="text-[#7fd1d3]">κατεύθυνση</span> και{" "}
            <span className="text-[#8fd6a8]">συνδυασμό</span>, όχι απλώς βέλη.
          </p>
        </Section>
      </div>
    </main>
  );
}

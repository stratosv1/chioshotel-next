"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow, Formula, Note } from "../omali/shared";
import { ThinkCard, type ThinkQuestion } from "../omali/Think";
import { ComponentsLab } from "./ComponentsLab";
import { AngleRule } from "./AngleRule";
import { ComponentsTrainer } from "./ComponentsTrainer";
import { AngleArc, C, Sb, Txt, V, VL } from "./figures";
import { IdeaCards } from "./IdeaCards";
import { ResolveFig } from "./ResolveFig";

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

const trigRows: { deg: string; sin: string; cos: string; tan: string; sinD: string; cosD: string; approx?: boolean }[] = [
  { deg: "0°", sin: "0", cos: "1", tan: "0", sinD: "0", cosD: "1" },
  { deg: "30°", sin: "1/2", cos: "√3/2", tan: "√3/3", sinD: "0,5", cosD: "0,866" },
  { deg: "37°", sin: "0,6", cos: "0,8", tan: "0,75", sinD: "0,6", cosD: "0,8", approx: true },
  { deg: "45°", sin: "√2/2", cos: "√2/2", tan: "1", sinD: "0,707", cosD: "0,707" },
  { deg: "53°", sin: "0,8", cos: "0,6", tan: "4/3", sinD: "0,8", cosD: "0,6", approx: true },
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
              <td className="px-3 py-2 font-semibold text-[#c9822f]">
                {r.deg}
                {r.approx ? <span className="ml-1 align-super text-[10px] text-[#857261]">≈</span> : null}
              </td>
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
  {
    prompt: (
      <>
        Νήμα ασκεί δύναμη T = 20 N και σχηματίζει γωνία 60° με την <b>κατακόρυφο</b>. Πόση είναι η οριζόντια συνιστώσα T<sub>x</sub>;
      </>
    ),
    choices: ["10 N", "17,3 N", "20 N", "0 N"],
    correct: 1,
    whyWrong: {
      0: "Αυτό είναι το T·συν60°. Θα ίσχυε αν η γωνία ήταν με τον οριζόντιο. Εδώ η γωνία ακουμπάει τον y, άρα ο x παίρνει ημ.",
    },
    explain: (
      <>
        Η γωνία ακουμπάει τον κατακόρυφο άξονα ⇒ T<sub>x</sub> = T·<b>ημ</b>60° = 20·0,866 ≈ <b>17,3 N</b> (και T<sub>y</sub> = T·συν60° = 10 N).
      </>
    ),
  },
  {
    prompt: (
      <>
        F = 10 N δείχνει <b>αριστερά και κάτω</b>, με γωνία 37° κάτω από τον οριζόντιο. Ποιες είναι οι (F<sub>x</sub>, F<sub>y</sub>);
      </>
    ),
    choices: ["(8, 6) N", "(−8, −6) N", "(−6, −8) N", "(8, −6) N"],
    correct: 1,
    whyWrong: {
      0: "Τα μέτρα είναι σωστά, αλλά ξέχασες τα πρόσημα: αριστερά και κάτω ⇒ και τα δύο αρνητικά.",
      2: "Μπέρδεψες ημ με συν. Η γωνία ακουμπάει τον x, άρα |Fx| = F·συν37° = 8 N.",
      3: "Αριστερά σημαίνει αρνητική Fx.",
    },
    explain: (
      <>
        Μέτρα με την οξεία γωνία: |F<sub>x</sub>| = 10·0,8 = 8 N, |F<sub>y</sub>| = 10·0,6 = 6 N. Πρόσημα από το σχήμα: <b>(−8, −6) N</b>.
      </>
    ),
  },
  {
    prompt: "Σώμα 4 kg βρίσκεται σε κεκλιμένο επίπεδο 30° (g = 10 m/s²). Πόση είναι η συνιστώσα του βάρους παράλληλα στο επίπεδο;",
    choices: ["20 N", "34,6 N", "40 N", "0 N"],
    correct: 0,
    whyWrong: {
      1: "Αυτή είναι η κάθετη συνιστώσα W·συν30°. Η γωνία ακουμπάει τον κάθετο άξονα, άρα η παράλληλη παίρνει ημ.",
      2: "Αυτό είναι όλο το βάρος. Θέλουμε μόνο το κομμάτι του κατά μήκος του επιπέδου.",
    },
    explain: (
      <>
        W = 40 N, W<sub>x</sub> = W·ημ30° = 40·0,5 = <b>20 N</b>.
      </>
    ),
  },
  {
    prompt: (
      <>
        Μια δύναμη έχει F<sub>x</sub> = 6 N και F<sub>y</sub> = 8 N. Πόσο είναι το μέτρο της και τι γωνία σχηματίζει με τον x;
      </>
    ),
    choices: ["10 N, ≈53°", "14 N, ≈53°", "10 N, ≈37°", "10 N, 45°"],
    correct: 0,
    whyWrong: {
      1: "Τα μέτρα των συνιστωσών δεν προστίθενται απλά: Πυθαγόρειο.",
      2: "εφθ = Fy / Fx = 8/6 = 4/3, που αντιστοιχεί στις ≈53°, όχι στις 37°.",
    },
    explain: (
      <>
        F = √(36 + 64) = <b>10 N</b>, εφθ = 8/6 = 4/3 ⇒ θ ≈ <b>53°</b>.
      </>
    ),
  },
];

/* ───────────── Three forces example ───────────── */

function ThreeForcesFigure() {
  const ox = 120;
  const oy = 120;
  const s = 9;
  return (
    <svg viewBox="0 0 240 175" className="w-full" role="img" aria-label="Τρεις δυνάμεις σε ένα σημείο και η συνισταμένη τους">
      <line x1={20} y1={oy} x2={225} y2={oy} stroke="#cbbfb1" strokeWidth={1.2} />
      <line x1={ox} y1={165} x2={ox} y2={10} stroke="#cbbfb1" strokeWidth={1.2} />
      <Txt x={222} y={oy + 14} color={C.muted} italic>x</Txt>
      <Txt x={ox + 9} y={16} color={C.muted} italic>y</Txt>
      <line x1={ox + 8 * s} y1={oy} x2={ox + 8 * s} y2={oy - 6 * s} stroke={C.muted} strokeDasharray="3 4" />
      <Arrow x1={ox} y1={oy} x2={ox + 8 * s} y2={oy - 6 * s} color={C.orange} width={4} head={11} />
      <Arrow x1={ox} y1={oy} x2={ox - 5 * s} y2={oy} color={C.teal} width={4} head={11} />
      <Arrow x1={ox} y1={oy} x2={ox} y2={oy + 2 * s + 6} color={C.green} width={4} head={9} />
      <Arrow x1={ox} y1={oy} x2={ox + 3 * s} y2={oy - 4 * s} color={C.purple} width={3} head={10} dashed />
      <AngleArc cx={ox} cy={oy} r={30} a1={37} label="37°" labelR={46} color={C.ink} />
      <Txt x={ox + 8 * s - 4} y={oy - 6 * s - 10} color={C.orange} size={13} anchor="middle">F₁ = 10 N</Txt>
      <Txt x={ox - 5 * s - 4} y={oy - 8} color={C.teal} size={13} anchor="end">F₂ = 5 N</Txt>
      <Txt x={ox + 8} y={oy + 2 * s + 14} color={C.green} size={13} anchor="start">F₃ = 2 N</Txt>
      <Txt x={ox + 3 * s - 4} y={oy - 4 * s - 8} color={C.purple} size={13} anchor="end">R</Txt>
    </svg>
  );
}

/* ───────────── Page ───────────── */

const nav = [
  { href: "#ideas", label: "12 ιδέες" },
  { href: "#trig", label: "Τριγωνομετρία" },
  { href: "#lab", label: "Εργαστήριο" },
  { href: "#rule", label: "Πότε ημ, πότε συν" },
  { href: "#examples", label: "Παραδείγματα" },
  { href: "#trainer", label: "Προπόνηση" },
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
          <div className="mt-5 max-w-3xl rounded-2xl border border-[#0f8b8d]/30 bg-[#eef8f8] px-4 py-3 text-[14px] leading-6 text-[#2f4a4a]">
            <b>Στόχος της σελίδας:</b> να βγάζεις τις συνιστώσες F<sub>x</sub> και F<sub>y</sub> σε κάθε άσκηση γρήγορα και χωρίς λάθος. Σειρά: πίνακας
            τριγωνομετρικών → κανόνας της γωνίας → λυμένα παραδείγματα → <a href="#trainer" className="font-semibold underline">προπόνηση</a>.
          </div>
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
              ημ60° = συν30°. Γενικά, όταν δύο γωνίες κάνουν μαζί 90°, το ημ της μίας είναι το συν της άλλης.
            </p>
            <p className="mt-2 text-[14px] leading-6 text-[#6b625b]">
              <b>≈ 37° και 53°:</b> δεν είναι «στρογγυλές» γωνίες, αλλά οι ασκήσεις τις χρησιμοποιούν συνέχεια γιατί δίνουν καθαρά νούμερα (τρίγωνο
              3‑4‑5). Συνήθως η εκφώνηση γράφει «ημφ = 0,6 και συνφ = 0,8». Όταν το δεις, ξέρεις ότι φ ≈ 37°.
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
            Προσοχή: εδώ η γωνία θ μετριέται από τον <b>άξονα x</b>. Αν σου δώσουν τη γωνία με τον άξονα y, τότε αλλάζουν θέση: F<sub>x</sub> = F·ημφ
            και F<sub>y</sub> = F·συνφ. Δες τον κανόνα της γωνίας ακριβώς από κάτω.
          </Note>
        </Section>

        <Section
          id="rule"
          kicker="Μέρος 4"
          title="Ο κανόνας της γωνίας: πότε ημ, πότε συν"
          intro="Οι ασκήσεις δεν δίνουν πάντα τη γωνία «με τον x». Αυτές είναι οι τέσσερις περιπτώσεις που θα συναντήσεις, και όλες λύνονται με τον ίδιο κανόνα."
        >
          <AngleRule />
        </Section>

        <Section id="examples" kicker="Μέρος 5" title="Λυμένα παραδείγματα">
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

          <hr className="border-black/10" />

          <div className="grid items-start gap-6 md:grid-cols-[1fr_1.1fr]">
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-black/10 bg-white p-3">
              <ResolveFig
                phi={270}
                refDeg={300}
                axisRot={30}
                incline
                baseLabel="θ = 30°"
                angleLabel="θ"
                forceLabel="W"
                adjLabel={<>W<Sb>y</Sb></>}
                oppLabel={<>W<Sb>x</Sb></>}
                ariaLabel="Σώμα σε κεκλιμένο 30°: το βάρος αναλύεται σε παράλληλη και κάθετη συνιστώσα"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Παράδειγμα 3: Σώμα σε κεκλιμένο επίπεδο</h3>
              <p className="mt-2 text-[15px] leading-7 text-[#4d4138]">
                Σώμα μάζας <b>m = 2 kg</b> βρίσκεται σε κεκλιμένο επίπεδο γωνίας <b>30°</b> (g = 10 m/s²). Ανάλυσε το βάρος σε συνιστώσες παράλληλα
                και κάθετα στο επίπεδο.
              </p>
              <ol className="mt-4 space-y-3">
                <Step n={1}>W = m·g = 2·10 = <b>20 N</b>, κατακόρυφο προς τα κάτω.</Step>
                <Step n={2}>
                  Στρίβω τους άξονες: x <b>παράλληλα</b> στο επίπεδο, y <b>κάθετα</b> σε αυτό. Έτσι η κάθετη δύναμη N και η τριβή πέφτουν πάνω
                  στους άξονες και αναλύω μόνο το βάρος.
                </Step>
                <Step n={3}>
                  Η γωνία 30° ξαναεμφανίζεται ανάμεσα στο W και στον άξονα y (το W είναι κάθετο στο έδαφος, ο y κάθετος στο επίπεδο: γωνίες με
                  πλευρές κάθετες είναι ίσες). Ακουμπάει τον y ⇒ ο y παίρνει <b>συν</b>.
                </Step>
                <Step n={4}>
                  <span style={{ color: C.green }}>W<sub>x</sub></span> = W·ημ30° = 20·0,5 = <b>10 N</b> (το τραβάει προς τα κάτω στο επίπεδο)
                </Step>
                <Step n={5}>
                  <span style={{ color: C.teal }}>W<sub>y</sub></span> = W·συν30° = 20·0,866 ≈ <b>17,3 N</b> (το πιέζει στο επίπεδο, άρα N = 17,3 N)
                </Step>
              </ol>
            </div>
          </div>

          <hr className="border-black/10" />

          <div className="grid items-start gap-6 md:grid-cols-[1fr_1.1fr]">
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-black/10 bg-white p-3">
              <ThreeForcesFigure />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Παράδειγμα 4: Τρεις δυνάμεις (η πιο συχνή άσκηση)</h3>
              <p className="mt-2 text-[15px] leading-7 text-[#4d4138]">
                Σε ένα σώμα ασκούνται: <b>F₁ = 10 N</b> με γωνία 37° πάνω από τον x, <b>F₂ = 5 N</b> προς τα αριστερά και <b>F₃ = 2 N</b> προς τα
                κάτω. Βρες τη συνισταμένη (ημ37° = 0,6, συν37° = 0,8).
              </p>
              <div className="mt-4 overflow-x-auto rounded-xl border border-black/10">
                <table className="w-full min-w-[300px] text-center text-[14px]">
                  <thead className="bg-[#2c2825] text-white">
                    <tr>
                      <th className="px-2 py-1.5">Δύναμη</th>
                      <th className="px-2 py-1.5">F<sub>x</sub></th>
                      <th className="px-2 py-1.5">F<sub>y</sub></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-2 py-1.5 font-semibold" style={{ color: C.orange }}>F₁</td>
                      <td className="px-2 py-1.5">10·συν37° = 8</td>
                      <td className="px-2 py-1.5">10·ημ37° = 6</td>
                    </tr>
                    <tr className="bg-[#fbf8f3]">
                      <td className="px-2 py-1.5 font-semibold" style={{ color: C.teal }}>F₂</td>
                      <td className="px-2 py-1.5">−5</td>
                      <td className="px-2 py-1.5">0</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-2 py-1.5 font-semibold" style={{ color: C.green }}>F₃</td>
                      <td className="px-2 py-1.5">0</td>
                      <td className="px-2 py-1.5">−2</td>
                    </tr>
                    <tr className="bg-[#efe7dc] font-semibold">
                      <td className="px-2 py-1.5">Σύνολο</td>
                      <td className="px-2 py-1.5">ΣF<sub>x</sub> = 3 N</td>
                      <td className="px-2 py-1.5">ΣF<sub>y</sub> = 4 N</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ol className="mt-4 space-y-3">
                <Step n={1}>Κάθε δύναμη σε δική της γραμμή. Όσες είναι ήδη πάνω σε άξονα δεν θέλουν τριγωνομετρία, μόνο πρόσημο.</Step>
                <Step n={2}>Προσθέτω τις στήλες, με τα πρόσημα: ΣF<sub>x</sub> = 8 − 5 = 3 N, ΣF<sub>y</sub> = 6 − 2 = 4 N.</Step>
                <Step n={3}>
                  <span style={{ color: C.purple }}>R</span> = √(3² + 4²) = <b>5 N</b>, εφθ = 4/3 ⇒ θ ≈ <b>53°</b> πάνω από τον x.
                </Step>
              </ol>
              <p className="mt-4 rounded-xl bg-[#f3efe8] px-3 py-2 text-[14px] leading-6 text-[#5c534c]">
                Αν το σώμα <b>ισορροπεί</b>, γράφεις ΣF<sub>x</sub> = 0 και ΣF<sub>y</sub> = 0 με τον ίδιο πίνακα και λύνεις ως προς τον άγνωστο.
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="trainer"
          kicker="Μέρος 6"
          title="Προπόνηση: Fx και Fy μέχρι να γίνει αυτόματο"
          intro={
            <>
              Κάθε φορά νέα δύναμη, νέα γωνία, νέα κατεύθυνση. Γράψε τις συνιστώσες και πάτα <b>Έλεγχος</b>. Ξεκίνα από το επίπεδο 1 και ανέβαινε
              όταν πετυχαίνεις 10 στη σειρά. Το λάθος σού λέει τι μπέρδεψες: ημ με συν ή πρόσημο.
            </>
          }
        >
          <ComponentsTrainer />
        </Section>

        <Section id="quiz" kicker="Μέρος 7" title="Γρήγορο τεστ" intro="Διάλεξε πρώτα απάντηση, μετά δες την εξήγηση.">
          <div className="grid gap-4 md:grid-cols-2">
            {quiz.map((q, i) => (
              <ThinkCard key={i} question={q} label="Δοκίμασε" index={i + 1} />
            ))}
          </div>
        </Section>

        <Section id="summary" kicker="Τυπολόγιο" title="Όλα σε μία ματιά">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Κανόνας", "Η συνιστώσα που ακουμπάει τη γωνία παίρνει συν"],
              ["Γωνία θ με τον x", "Fx = F·συνθ,  Fy = F·ημθ"],
              ["Γωνία φ με τον y", "Fx = F·ημφ,  Fy = F·συνφ"],
              ["Πρόσημα", "Μέτρα με την οξεία γωνία, πρόσημο από το σχήμα"],
              ["Κεκλιμένο γωνίας θ", "Wx = mg·ημθ,  Wy = mg·συνθ"],
              ["Πολλές δυνάμεις", "ΣFx, ΣFy ⇒ R = √(ΣFx² + ΣFy²)"],
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

"use client";

import { useState, type ReactNode } from "react";
import { fmt, gcd, lcm, reduce, rnd, type Fr } from "./frac";
import { MathText } from "./MathText";

const BLUE = "#2f6fb0";
const ORANGE = "#e08a3c";

function Card({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border-2 border-[#3d6b3a]/25 bg-gradient-to-br from-[#eef6ec] to-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-bold text-[#2c5229]">🎮 {title}</h3>
      <p className="mb-4 text-sm text-[#5d6b58]">{hint}</p>
      {children}
    </div>
  );
}

function Num({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 text-sm font-semibold text-[#4d4138]">{label}</span>
      <button type="button" aria-label="μείον" onClick={() => set(Math.max(min, value - 1))} className="h-9 w-9 rounded-full border border-black/15 bg-white text-lg font-bold transition hover:bg-[#f0ebe3]">
        −
      </button>
      <span className="w-8 text-center text-xl font-black text-[#1d5a8c]">{value}</span>
      <button type="button" aria-label="συν" onClick={() => set(Math.min(max, value + 1))} className="h-9 w-9 rounded-full border border-black/15 bg-white text-lg font-bold transition hover:bg-[#f0ebe3]">
        +
      </button>
    </div>
  );
}

function Big({ text }: { text: string }) {
  return (
    <span className="text-2xl font-bold text-[#1d5a8c]">
      <MathText text={text} />
    </span>
  );
}

function Btn({ onClick, children, tone = "green" }: { onClick: () => void; children: ReactNode; tone?: "green" | "plain" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2 font-semibold transition hover:opacity-90 ${tone === "green" ? "bg-[#3d6b3a] text-white" : "border border-black/15 bg-white"}`}
    >
      {children}
    </button>
  );
}

// ───────────── 2.1 πίτες ─────────────
function Pie({ n, d, color = BLUE, size = 104 }: { n: number; d: number; color?: string; size?: number }) {
  const c = size / 2;
  const r = c - 3;
  if (d === 1) return <svg width={size} height={size} aria-hidden><circle cx={c} cy={c} r={r} fill={n ? color : "#fff"} stroke="#2c2825" strokeWidth={1.5} className="sx-seg" /></svg>;
  return (
    <svg width={size} height={size} aria-hidden>
      {Array.from({ length: d }, (_, i) => {
        const a0 = ((-90 + (360 * i) / d) * Math.PI) / 180;
        const a1 = ((-90 + (360 * (i + 1)) / d) * Math.PI) / 180;
        const large = 360 / d > 180 ? 1 : 0;
        const p = `M${c},${c} L${c + r * Math.cos(a0)},${c + r * Math.sin(a0)} A${r},${r} 0 ${large} 1 ${c + r * Math.cos(a1)},${c + r * Math.sin(a1)} Z`;
        return <path key={i} d={p} fill={i < n ? color : "#fff"} stroke="#2c2825" strokeWidth={1.2} className="sx-seg" />;
      })}
    </svg>
  );
}

export function FractionExplorer() {
  const [n, setN] = useState(3);
  const [d, setD] = useState(8);
  const setDen = (x: number) => {
    setD(x);
    setN((v) => Math.min(v, 3 * x));
  };
  const pies = Math.max(1, Math.ceil(n / d));
  const status = n < d ? ["μικρότερο από 1", "bg-[#e8edf9] text-[#2f4f9a]"] : n === d ? ["ίσο με 1", "bg-[#e7f3e4] text-[#24522a]"] : ["μεγαλύτερο από 1", "bg-[#fff1e3] text-[#a2531f]"];
  return (
    <Card title="Παίξε με το κλάσμα" hint="Άλλαξε αριθμητή και παρονομαστή και δες τι συμβαίνει στην πίτσα.">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Num label="Αριθμητής" value={n} set={setN} min={0} max={3 * d} />
          <Num label="Παρονομαστής" value={d} set={setDen} min={1} max={12} />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: pies }, (_, k) => (
            <Pie key={k} n={Math.min(d, Math.max(0, n - k * d))} d={d} />
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3">
        <Big text={`{${n}/${d}}`} />
        <span className="text-lg">= {n} : {d}</span>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${status[1]}`}>{status[0]}</span>
        {n > d && n % d !== 0 ? (
          <span className="text-lg">
            = <MathText text={`{${Math.floor(n / d)}|${n % d}/${d}}`} /> (μεικτός)
          </span>
        ) : null}
        {n >= d && n % d === 0 && n > 0 ? <span className="text-lg">= {n / d} ολόκληρες πίτσες</span> : null}
      </div>
      <p className="mt-2 text-sm text-[#6b625b]">
        Ο παρονομαστής λέει <b>σε πόσα κομμάτια</b> κόβω κάθε πίτσα. Ο αριθμητής λέει <b>πόσα κομμάτια παίρνω</b>.
      </p>
    </Card>
  );
}

// ───────────── μπάρα ─────────────
function Bar({ n, d, color = BLUE, scale = 1 }: { n: number; d: number; color?: string; scale?: number }) {
  return (
    <div className="flex h-10 overflow-hidden rounded-lg border-2 border-[#2c2825]" style={{ width: `${scale * 100}%` }}>
      {Array.from({ length: d }, (_, i) => (
        <div key={i} className="sx-seg flex-1 border-r border-[#2c2825]/60 last:border-r-0" style={{ background: i < n ? color : "#fff" }} />
      ))}
    </div>
  );
}

// ───────────── 2.2 ισοδύναμα ─────────────
export function EquivalentBars() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [k, setK] = useState(2);
  const setDen = (x: number) => {
    setB(x);
    setA((v) => Math.min(v, x));
  };
  return (
    <Card title="Ίδια ποσότητα, άλλα νούμερα" hint="Πολλαπλασίασε και τους δύο όρους με τον ίδιο αριθμό: το χρωματιστό κομμάτι ΔΕΝ αλλάζει μέγεθος.">
      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <Num label="Αριθμητής" value={a} set={setA} min={1} max={b} />
        <Num label="Παρονομαστής" value={b} set={setDen} min={2} max={8} />
        <Num label="Επί ×" value={k} set={setK} min={1} max={4} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-16 text-right">
            <Big text={`{${a}/${b}}`} />
          </span>
          <div className="flex-1">
            <Bar n={a} d={b} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-16 text-right">
            <Big text={`{${a * k}/${b * k}}`} />
          </span>
          <div className="flex-1">
            <Bar n={a * k} d={b * k} color={ORANGE} />
          </div>
        </div>
      </div>
      <p className="mt-4 rounded-2xl bg-white p-3 text-[16px]">
        <MathText text={`{${a}/${b}} = {${a} · ${k}/${b} · ${k}} = {${a * k}/${b * k}}`} />
        <span className="ml-3 text-sm text-[#6b625b]">
          Έλεγχος χιαστί: {a} · {b * k} = {a * b * k} και {b} · {a * k} = {a * b * k} ✓
        </span>
      </p>
    </Card>
  );
}

export function Simplifier() {
  const pool: Fr[] = [
    { n: 18, d: 24 },
    { n: 30, d: 66 },
    { n: 42, d: 56 },
    { n: 36, d: 48 },
    { n: 45, d: 75 },
    { n: 64, d: 80 },
    { n: 60, d: 84 },
  ];
  const [i, setI] = useState(0);
  const [step, setStep] = useState(0);
  const f = pool[i];
  const g = gcd(f.n, f.d);
  const r = reduce(f);
  return (
    <Card title="Απλοποίηση σε 1 βήμα" hint="Βρες τον ΜΚΔ και διαίρεσε ΚΑΙ τους δύο όρους. Το κλάσμα γίνεται αμέσως ανάγωγο.">
      <div className="flex flex-wrap items-center gap-3 text-[17px]">
        <Big text={`{${f.n}/${f.d}}`} />
        {step >= 1 ? <span className="sx-pop rounded-xl bg-white px-3 py-1">ΜΚΔ({f.n}, {f.d}) = <b>{g}</b></span> : null}
        {step >= 2 ? (
          <span className="sx-pop">
            → <MathText text={`{${f.n} : ${g}/${f.d} : ${g}}`} /> = <Big text={`{${r.n}/${r.d}}`} /> <span className="sx-bounce">✨</span>
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex gap-2">
        {step < 2 ? (
          <Btn onClick={() => setStep(step + 1)}>Επόμενο βήμα ▶</Btn>
        ) : (
          <Btn
            onClick={() => {
              setI((i + 1) % pool.length);
              setStep(0);
            }}
          >
            Άλλο κλάσμα 🎲
          </Btn>
        )}
      </div>
    </Card>
  );
}

// ───────────── 2.3 σύγκριση ─────────────
export function CompareVisual() {
  const [x, setX] = useState<Fr>({ n: 3, d: 4 });
  const [y, setY] = useState<Fr>({ n: 5, d: 6 });
  const L = lcm(x.d, y.d);
  const xn = x.n * (L / x.d);
  const yn = y.n * (L / y.d);
  const sign = xn < yn ? "<" : xn > yn ? ">" : "=";
  const random = () => {
    const d1 = rnd(2, 9);
    const d2 = rnd(2, 9);
    setX({ n: rnd(1, d1 + 2), d: d1 });
    setY({ n: rnd(1, d2 + 2), d: d2 });
  };
  const max = Math.max(1, Math.ceil(Math.max(x.n / x.d, y.n / y.d)));
  return (
    <Card title="Ποιο είναι μεγαλύτερο;" hint="Οι μπάρες δείχνουν το μέγεθος. Από κάτω, ο «επίσημος» τρόπος με ομώνυμα.">
      <div className="space-y-3">
        {[
          [x, BLUE],
          [y, ORANGE],
        ].map(([f, c], i) => {
          const fr = f as Fr;
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="w-14 text-right">
                <Big text={`{${fr.n}/${fr.d}}`} />
              </span>
              <div className="h-8 flex-1 overflow-hidden rounded-lg bg-[#efe9e1]">
                <div className="sx-seg h-full rounded-lg" style={{ width: `${(fr.n / fr.d / max) * 100}%`, background: c as string }} />
              </div>
            </div>
          );
        })}
        <div className="ml-[4.25rem] flex justify-between text-xs text-[#857a70]">
          {Array.from({ length: max + 1 }, (_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 text-[17px]">
        <span>ΕΚΠ({x.d}, {y.d}) = {L}:</span>
        <MathText text={`{${x.n}/${x.d}} = {${xn}/${L}}`} />
        <span>και</span>
        <MathText text={`{${y.n}/${y.d}} = {${yn}/${L}}`} />
        <span>→</span>
        <span key={`${xn}-${yn}`} className="sx-bounce rounded-xl bg-[#2c2825] px-3 py-1 text-xl font-black text-white">
          <MathText text={`{${x.n}/${x.d}} ${sign} {${y.n}/${y.d}}`} />
        </span>
      </div>
      <div className="mt-3">
        <Btn onClick={random}>Τυχαίο ζευγάρι 🎲</Btn>
      </div>
    </Card>
  );
}

// ───────────── 2.4 πρόσθεση βήμα βήμα ─────────────
function newAdd() {
  for (;;) {
    const d1 = rnd(2, 9);
    let d2 = rnd(2, 9);
    if (d2 === d1) d2 = d1 === 9 ? 4 : d1 + 1;
    const a = { n: rnd(1, d1 - 1), d: d1 };
    const b = { n: rnd(1, d2 - 1), d: d2 };
    const op = Math.random() < 0.5 ? "+" : "−";
    if (op === "−" && a.n * b.d <= b.n * a.d) continue;
    return { a, b, op };
  }
}

export function AddStepper() {
  const [p, setP] = useState({ a: { n: 5, d: 6 }, b: { n: 3, d: 4 }, op: "+" });
  const [step, setStep] = useState(0);
  const L = lcm(p.a.d, p.b.d);
  const ka = L / p.a.d;
  const kb = L / p.b.d;
  const an = p.a.n * ka;
  const bn = p.b.n * kb;
  const res = p.op === "+" ? an + bn : an - bn;
  const red = reduce({ n: res, d: L });
  const steps: ReactNode[] = [
    <>
      ① Βρίσκω το <b>ΕΚΠ</b> των παρονομαστών: ΕΚΠ({p.a.d}, {p.b.d}) = <b>{L}</b>
    </>,
    <>
      ② Κάνω ομώνυμα: <MathText text={`{${p.a.n}/${p.a.d}} = {${p.a.n} · ${ka}/${p.a.d} · ${ka}} = {${an}/${L}}`} /> και{" "}
      <MathText text={`{${p.b.n}/${p.b.d}} = {${p.b.n} · ${kb}/${p.b.d} · ${kb}} = {${bn}/${L}}`} />
    </>,
    <>
      ③ {p.op === "+" ? "Προσθέτω" : "Αφαιρώ"} μόνο τους αριθμητές: <MathText text={`{${an}/${L}} ${p.op} {${bn}/${L}} = {${an} ${p.op} ${bn}/${L}} = {${res}/${L}}`} />
    </>,
    <>
      ④ Απλοποιώ:{" "}
      {red.d === L ? (
        <>είναι ήδη ανάγωγο ✓</>
      ) : (
        <>
          <MathText text={`{${res}/${L}} = ${fmt(red)}`} />
        </>
      )}
      {red.n > red.d && red.d !== 1 ? (
        <>
          {" "}
          (μεικτός <MathText text={fmt(red, true)} />)
        </>
      ) : null}
    </>,
  ];
  return (
    <Card title="Πρόσθεση/αφαίρεση βήμα βήμα" hint="Πάτα «Επόμενο βήμα». Λύσε πρώτα στο μυαλό σου και μετά δες αν συμφωνείς.">
      <p className="mb-3">
        <Big text={`{${p.a.n}/${p.a.d}} ${p.op} {${p.b.n}/${p.b.d}} = ;`} />
      </p>
      <ol className="space-y-2 text-[16px] leading-8">
        {steps.slice(0, step).map((s, i) => (
          <li key={i} className="sx-pop rounded-xl bg-white px-3 py-1">
            {s}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex gap-2">
        {step < 4 ? (
          <Btn onClick={() => setStep(step + 1)}>Επόμενο βήμα ▶</Btn>
        ) : (
          <Btn
            onClick={() => {
              setP(newAdd());
              setStep(0);
            }}
          >
            Νέα άσκηση 🎲
          </Btn>
        )}
      </div>
    </Card>
  );
}

// ───────────── 2.5 πολλαπλασιασμός με εμβαδό ─────────────
export function AreaModel() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(3);
  const [d, setD] = useState(4);
  const r = reduce({ n: a * c, d: b * d });
  return (
    <Card title="Τα «από» = «επί»" hint="Τα μπλε είναι τα a/b του τετραγώνου. Τα πορτοκαλί τα c/d. Εκεί που επικαλύπτονται (μωβ) είναι το γινόμενο.">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="space-y-2">
          <Num label="1ο: αριθμ." value={a} set={setA} min={1} max={b} />
          <Num label="1ο: παρον." value={b} set={(x) => (setB(x), setA((v) => Math.min(v, x)))} min={2} max={6} />
          <Num label="2ο: αριθμ." value={c} set={setC} min={1} max={d} />
          <Num label="2ο: παρον." value={d} set={(x) => (setD(x), setC((v) => Math.min(v, x)))} min={2} max={6} />
        </div>
        <div className="grid aspect-square w-full max-w-[220px] border-2 border-[#2c2825]" style={{ gridTemplateColumns: `repeat(${b}, 1fr)`, gridTemplateRows: `repeat(${d}, 1fr)` }}>
          {Array.from({ length: b * d }, (_, i) => {
            const col = i % b;
            const row = Math.floor(i / b);
            const inA = col < a;
            const inC = row < c;
            const bg = inA && inC ? "#7b4bb0" : inA ? "#9cc0e6" : inC ? "#f3c79c" : "#fff";
            return <div key={i} className="sx-seg border border-[#2c2825]/40" style={{ background: bg }} />;
          })}
        </div>
      </div>
      <p className="mt-4 rounded-2xl bg-white p-3 text-[17px]">
        <MathText text={`{${c}/${d}} από τα {${a}/${b}} = {${a}/${b}} · {${c}/${d}} = {${a} · ${c}/${b} · ${d}} = {${a * c}/${b * d}}`} />
        {r.d !== b * d ? (
          <>
            {" "}
            = <MathText text={fmt(r)} />
          </>
        ) : null}
        <span className="ml-2 text-sm text-[#6b625b]">
          ({a * c} μωβ κουτάκια από {b * d})
        </span>
      </p>
    </Card>
  );
}

// ───────────── 2.6 κράτα – άλλαξε – αναποδογύρισε ─────────────
function newDiv() {
  const b = rnd(2, 9);
  const d = rnd(2, 9);
  return { a: rnd(1, 9), b, c: rnd(1, 9), d };
}

export function DivideFlip() {
  const [p, setP] = useState({ a: 3, b: 4, c: 1, d: 2 });
  const [step, setStep] = useState(0);
  const r = reduce({ n: p.a * p.d, d: p.b * p.c });
  const labels = ["", "① ΚΡΑΤΑ το πρώτο όπως είναι", "② ΑΛΛΑΞΕ τη διαίρεση σε πολλαπλασιασμό", "③ ΑΝΑΠΟΔΟΓΥΡΙΣΕ το δεύτερο", "④ Πολλαπλασίασε και απλοποίησε"];
  return (
    <Card title="Κράτα – Άλλαξε – Αναποδογύρισε" hint="Το κόλπο της διαίρεσης σε 3 κινήσεις. Πάτα και δες.">
      <div className="flex min-h-[5rem] flex-wrap items-center gap-3 text-3xl">
        <span className={`rounded-xl px-2 py-1 transition ${step === 1 ? "bg-[#fff1c2] ring-2 ring-[#e2b26a]" : ""}`}>
          <MathText text={`{${p.a}/${p.b}}`} />
        </span>
        <span key={`op${step >= 2}`} className={`font-black ${step >= 2 ? "sx-bounce text-[#3d6b3a]" : "text-[#b33a3a]"}`}>
          {step >= 2 ? "·" : ":"}
        </span>
        <span key={`f${step >= 3}`} className={`rounded-xl px-2 py-1 ${step >= 3 ? "sx-flip bg-[#e7f3e4] ring-2 ring-[#3d6b3a]" : ""}`}>
          <MathText text={step >= 3 ? `{${p.d}/${p.c}}` : `{${p.c}/${p.d}}`} />
        </span>
        {step >= 4 ? (
          <span className="sx-pop">
            = <MathText text={`{${p.a * p.d}/${p.b * p.c}}`} />
            {r.d !== p.b * p.c || r.d === 1 ? (
              <>
                {" "}
                = <MathText text={fmt(r)} />
              </>
            ) : null}
          </span>
        ) : null}
      </div>
      <p className="mt-2 min-h-[1.75rem] font-semibold text-[#2c5229]">{labels[step]}</p>
      <div className="mt-3 flex gap-2">
        {step < 4 ? (
          <Btn onClick={() => setStep(step + 1)}>Επόμενη κίνηση ▶</Btn>
        ) : (
          <Btn
            onClick={() => {
              setP(newDiv());
              setStep(0);
            }}
          >
            Νέα διαίρεση 🎲
          </Btn>
        )}
      </div>
    </Card>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { Pill, fmt } from "../omali/shared";
import { Sb } from "./figures";
import { ResolveFig } from "./ResolveFig";

const ANGLES = [30, 37, 45, 53, 60] as const;
type Angle = (typeof ANGLES)[number];
const SIN: Record<Angle, number> = { 30: 0.5, 37: 0.6, 45: 0.707, 53: 0.8, 60: 0.866 };
const COS: Record<Angle, number> = { 30: 0.866, 37: 0.8, 45: 0.707, 53: 0.6, 60: 0.5 };
const FORCES = [10, 20, 30, 40, 50, 60, 80, 100];
const MASSES = [1, 2, 3, 4, 5, 6, 8, 10];

type Problem =
  | { kind: "plane"; F: number; a: Angle; ref: "h" | "v"; sx: 1 | -1; sy: 1 | -1 }
  | { kind: "incline"; m: number; a: Angle };

const LEVELS = [
  { id: 1, label: "1. Γωνία με τον x" },
  { id: 2, label: "2. Γωνία με x ή y" },
  { id: 3, label: "3. Με πρόσημα" },
  { id: 4, label: "4. Κεκλιμένο" },
  { id: 5, label: "Όλα μαζί" },
];

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const sign = (): 1 | -1 => (Math.random() < 0.5 ? 1 : -1);

function generate(level: number): Problem {
  const incline = level === 4 || (level === 5 && Math.random() < 0.25);
  if (incline) return { kind: "incline", m: pick(MASSES), a: pick(ANGLES) };
  const ref = level === 1 ? "h" : Math.random() < 0.5 ? "h" : "v";
  const signs = level >= 3;
  return { kind: "plane", F: pick(FORCES), a: pick(ANGLES), ref, sx: signs ? sign() : 1, sy: signs ? sign() : 1 };
}

const r2 = (v: number) => Math.round(v * 100) / 100;

function expected(p: Problem) {
  if (p.kind === "incline") {
    const W = p.m * 10;
    return { mag: W, x: r2(W * SIN[p.a]), y: r2(W * COS[p.a]), xOther: r2(W * COS[p.a]), yOther: r2(W * SIN[p.a]) };
  }
  const xt = p.ref === "h" ? COS[p.a] : SIN[p.a];
  const yt = p.ref === "h" ? SIN[p.a] : COS[p.a];
  return {
    mag: p.F,
    x: r2(p.sx * p.F * xt),
    y: r2(p.sy * p.F * yt),
    xOther: r2(p.sx * p.F * yt),
    yOther: r2(p.sy * p.F * xt),
  };
}

function parse(s: string): number | null {
  const t = s.replace(/\s/g, "").replace(/[−–]/g, "-").replace(",", ".");
  if (t === "" || t === "-" || t === "+") return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

type Verdict = "ok" | "sign" | "swap" | "wrong" | "empty";

function judge(input: string, exp: number, other: number, mag: number, ignoreSign: boolean): Verdict {
  const v = parse(input);
  if (v === null) return "empty";
  const tol = 0.015 * mag + 0.06;
  const val = ignoreSign ? Math.abs(v) : v;
  if (Math.abs(val - exp) <= tol) return "ok";
  if (!ignoreSign && Math.abs(Math.abs(v) - Math.abs(exp)) <= tol) return "sign";
  if (Math.abs(Math.abs(val) - Math.abs(other)) <= tol && Math.abs(Math.abs(exp) - Math.abs(other)) > tol) return "swap";
  return "wrong";
}

function dirWords(p: Extract<Problem, { kind: "plane" }>) {
  const lr = p.sx > 0 ? "δεξιά" : "αριστερά";
  const ud = p.sy > 0 ? "πάνω" : "κάτω";
  return `${ud} και ${lr}`;
}

function phiOf(p: Extract<Problem, { kind: "plane" }>) {
  const vx = p.sx * (p.ref === "h" ? COS[p.a] : SIN[p.a]);
  const vy = p.sy * (p.ref === "h" ? SIN[p.a] : COS[p.a]);
  return (Math.atan2(vy, vx) * 180) / Math.PI;
}

export function ComponentsTrainer() {
  const [level, setLevel] = useState(1);
  const [p, setP] = useState<Problem>(() => generate(1));
  const [ix, setIx] = useState("");
  const [iy, setIy] = useState("");
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0, streak: 0, best: 0 });

  const e = expected(p);
  const isIncline = p.kind === "incline";
  const vx = checked ? judge(ix, e.x, e.xOther, e.mag, isIncline) : "empty";
  const vy = checked ? judge(iy, e.y, e.yOther, e.mag, isIncline) : "empty";
  const bothOk = vx === "ok" && vy === "ok";
  const showSolution = revealed || (checked && bothOk);

  function next(lv = level) {
    let n = generate(lv);
    for (let i = 0; i < 5 && JSON.stringify(n) === JSON.stringify(p); i++) n = generate(lv);
    setP(n);
    setIx("");
    setIy("");
    setChecked(false);
    setRevealed(false);
  }

  function check() {
    const okX = judge(ix, e.x, e.xOther, e.mag, isIncline) === "ok";
    const okY = judge(iy, e.y, e.yOther, e.mag, isIncline) === "ok";
    if (!checked && !revealed) {
      setScore((s) => {
        const right = okX && okY;
        const streak = right ? s.streak + 1 : 0;
        return { right: s.right + (right ? 1 : 0), total: s.total + 1, streak, best: Math.max(s.best, streak) };
      });
    }
    setChecked(true);
  }

  const xName = isIncline ? <>W<sub>x</sub></> : <>F<sub>x</sub></>;
  const yName = isIncline ? <>W<sub>y</sub></> : <>F<sub>y</sub></>;

  const feedback = (v: Verdict) => {
    if (!checked) return null;
    const msg: Record<Verdict, string> = {
      ok: "Σωστό ✔",
      sign: "Σωστό μέτρο, λάθος πρόσημο. Κοίτα προς τα πού δείχνει το βέλος.",
      swap: "Μπέρδεψες ημ με συν. Ποιον άξονα ακουμπάει η γωνία;",
      wrong: "Όχι ακόμα. Ξαναδές ποια πλευρά είναι η προσκείμενη.",
      empty: "Συμπλήρωσε και αυτή.",
    };
    const color = v === "ok" ? "text-[#2e8b57]" : "text-[#c0392b]";
    return <p className={`mt-1 text-[13px] font-semibold ${color}`}>{msg[v]}</p>;
  };

  let figure;
  let prompt;
  let steps: ReactNode[] = [];

  if (p.kind === "plane") {
    const refWord = p.ref === "h" ? "τον οριζόντιο άξονα x" : "τον κατακόρυφο άξονα y";
    const refDeg = p.ref === "h" ? (p.sx > 0 ? 0 : 180) : p.sy > 0 ? 90 : 270;
    const xTrig = p.ref === "h" ? "συν" : "ημ";
    const yTrig = p.ref === "h" ? "ημ" : "συν";
    const xVal = p.ref === "h" ? COS[p.a] : SIN[p.a];
    const yVal = p.ref === "h" ? SIN[p.a] : COS[p.a];
    figure = (
      <ResolveFig
        phi={phiOf(p)}
        refDeg={refDeg}
        angleLabel={`${p.a}°`}
        forceLabel={`F = ${p.F} N`}
        adjLabel={p.ref === "h" ? <>F<Sb>x</Sb></> : <>F<Sb>y</Sb></>}
        oppLabel={p.ref === "h" ? <>F<Sb>y</Sb></> : <>F<Sb>x</Sb></>}
        showComponents={showSolution}
        ariaLabel={`Δύναμη ${p.F} N με γωνία ${p.a} μοιρών από ${refWord}`}
      />
    );
    prompt = (
      <>
        Δύναμη <b>F = {p.F} N</b> δείχνει προς τα <b>{dirWords(p)}</b> και σχηματίζει γωνία <b>{p.a}°</b> με <b>{refWord}</b>. Βρες τις F
        <sub>x</sub> και F<sub>y</sub>
        {level >= 3 ? " (με πρόσημο)" : ""}.
      </>
    );
    steps = [
      <>
        Η γωνία ακουμπάει τον <b>{p.ref === "h" ? "x" : "y"}</b> ⇒ η F<sub>{p.ref === "h" ? "x" : "y"}</sub> παίρνει <b>συν</b>, η άλλη <b>ημ</b>.
      </>,
      <>
        |F<sub>x</sub>| = F·{xTrig}
        {p.a}° = {p.F}·{fmt(xVal, 3)} = <b>{fmt(Math.abs(e.x), 2)} N</b>
      </>,
      <>
        |F<sub>y</sub>| = F·{yTrig}
        {p.a}° = {p.F}·{fmt(yVal, 3)} = <b>{fmt(Math.abs(e.y), 2)} N</b>
      </>,
      <>
        Πρόσημα από το σχήμα: {p.sx > 0 ? "δεξιά ⇒ +" : "αριστερά ⇒ −"}, {p.sy > 0 ? "πάνω ⇒ +" : "κάτω ⇒ −"}. Άρα F<sub>x</sub> ={" "}
        <b>{fmt(e.x, 2)} N</b>, F<sub>y</sub> = <b>{fmt(e.y, 2)} N</b>.
      </>,
    ];
  } else {
    figure = (
      <ResolveFig
        phi={270}
        refDeg={300}
        axisRot={30}
        incline
        baseLabel={`θ = ${p.a}°`}
        angleLabel="θ"
        showRefArc={showSolution}
        forceLabel="W"
        adjLabel={<>W<Sb>y</Sb></>}
        oppLabel={<>W<Sb>x</Sb></>}
        showComponents={showSolution}
        ariaLabel={`Σώμα ${p.m} kg σε κεκλιμένο ${p.a} μοιρών`}
      />
    );
    prompt = (
      <>
        Σώμα μάζας <b>m = {p.m} kg</b> βρίσκεται σε κεκλιμένο επίπεδο γωνίας <b>θ = {p.a}°</b> (g = 10 m/s²). Βρες τα μέτρα των συνιστωσών του
        βάρους: W<sub>x</sub> (παράλληλα στο επίπεδο) και W<sub>y</sub> (κάθετα στο επίπεδο).
        <span className="ml-1 text-xs text-[#857261]">(Το σχήμα είναι σχηματικό.)</span>
      </>
    );
    steps = [
      <>
        W = m·g = {p.m}·10 = <b>{e.mag} N</b>
      </>,
      <>
        Η γωνία {p.a}° εμφανίζεται ανάμεσα στο W και στον <b>κάθετο</b> άξονα ⇒ η W<sub>y</sub> παίρνει <b>συν</b>.
      </>,
      <>
        W<sub>x</sub> = W·ημ{p.a}° = {e.mag}·{fmt(SIN[p.a], 3)} = <b>{fmt(e.x, 2)} N</b>
      </>,
      <>
        W<sub>y</sub> = W·συν{p.a}° = {e.mag}·{fmt(COS[p.a], 3)} = <b>{fmt(e.y, 2)} N</b>
      </>,
    ];
  }

  const input = "w-28 rounded-xl border border-black/15 bg-white px-3 py-2 text-right text-[16px] font-semibold outline-none focus:border-[#0f8b8d]";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <Pill
            key={l.id}
            active={level === l.id}
            onClick={() => {
              setLevel(l.id);
              next(l.id);
            }}
          >
            {l.label}
          </Pill>
        ))}
      </div>

      <div className="grid items-start gap-5 md:grid-cols-[1fr_1.1fr]">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-black/10 bg-white p-2">{figure}</div>

        <div className="space-y-4">
          <p className="text-[15px] leading-7 text-[#3d3530]">{prompt}</p>

          <form
            className="flex flex-wrap items-start gap-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              check();
            }}
          >
            <label className="block">
              <span className="text-sm font-semibold text-[#2c2825]">
                {xName} =
              </span>
              <span className="ml-2 inline-flex items-center gap-1">
                <input inputMode="decimal" className={input} value={ix} onChange={(ev) => setIx(ev.target.value)} aria-label="x συνιστώσα" />
                <span className="text-sm text-[#857261]">N</span>
              </span>
              {feedback(vx)}
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[#2c2825]">
                {yName} =
              </span>
              <span className="ml-2 inline-flex items-center gap-1">
                <input inputMode="decimal" className={input} value={iy} onChange={(ev) => setIy(ev.target.value)} aria-label="y συνιστώσα" />
                <span className="text-sm text-[#857261]">N</span>
              </span>
              {feedback(vy)}
            </label>
            <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
          </form>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={check} className="rounded-full bg-[#0f8b8d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b6f71]">
              Έλεγχος
            </button>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-[#4d4138] hover:bg-[#f3efe8]"
            >
              Δείξε τη λύση
            </button>
            <button type="button" onClick={() => next()} className="rounded-full bg-[#2c2825] px-4 py-2 text-sm font-semibold text-white hover:bg-black">
              Νέα άσκηση →
            </button>
          </div>

          <p className="text-[13px] text-[#6b625b]">
            Σωστές: <b>{score.right}</b> / {score.total} · Σερί: <b>{score.streak}</b> · Ρεκόρ: <b>{score.best}</b>
            <span className="ml-2 text-[#857261]">Στόχος: 10 σωστές στη σειρά σε κάθε επίπεδο.</span>
          </p>

          {showSolution ? (
            <ol className="space-y-2 rounded-2xl bg-[#f3efe8] px-4 py-3 text-[14px] leading-6 text-[#3d3530]">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2c2825] text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>
      <p className="text-[13px] leading-6 text-[#857261]">
        Χρησιμοποίησε τις τιμές του πίνακα: ημ30° = 0,5 · συν30° ≈ 0,866 · ημ45° = συν45° ≈ 0,707 · ημ37° ≈ 0,6 · συν37° ≈ 0,8 (και ανάποδα για 60° και
        53°). Δέχεται κόμμα ή τελεία και μικρές διαφορές στη στρογγυλοποίηση.
      </p>
    </div>
  );
}

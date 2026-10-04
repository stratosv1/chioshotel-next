"use client";

import { useState, type ReactNode } from "react";
import { Abs, V, num, pair, sqrtText } from "./math";

type Problem = {
  prompt: ReactNode;
  /** Ένα πεδίο ανά ζητούμενο αριθμό. */
  fields: ReactNode[];
  answers: number[];
  hint: ReactNode;
  steps: ReactNode[];
};

type Generator = { id: string; title: string; make: () => Problem };

const ri = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const nz = (a: number, b: number) => {
  let v = 0;
  while (v === 0) v = ri(a, b);
  return v;
};
const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];
/** Αριθμός σε παρένθεση όταν είναι αρνητικός, για να διαβάζονται οι πράξεις. */
const p = (x: number) => (x < 0 ? `(${num(x)})` : num(x));
const divisors = (n: number) => {
  const m = Math.abs(n);
  const out: number[] = [];
  for (let d = 1; d <= m; d++) if (m % d === 0) out.push(d, -d);
  return out;
};

const α = <V>α</V>;
const β = <V>β</V>;

const GENERATORS: Generator[] = [
  {
    id: "coords",
    title: "Συντεταγμένες AB",
    make: () => {
      const [x1, y1, x2, y2] = [ri(-6, 6), ri(-6, 6), ri(-6, 6), ri(-6, 6)];
      return {
        prompt: (
          <>
            Δίνονται τα σημεία Α{pair(x1, y1)} και Β{pair(x2, y2)}. Βρες τις συντεταγμένες του <V>ΑΒ</V>.
          </>
        ),
        fields: ["x", "y"],
        answers: [x2 - x1, y2 - y1],
        hint: <>Πέρας μείον αρχή: (x<sub>Β</sub> − x<sub>Α</sub>, y<sub>Β</sub> − y<sub>Α</sub>).</>,
        steps: [
          <>
            <V>ΑΒ</V> = ({num(x2)} − {p(x1)}, {num(y2)} − {p(y1)}) = <b>{pair(x2 - x1, y2 - y1)}</b>
          </>,
        ],
      };
    },
  },
  {
    id: "mid",
    title: "Μέσο τμήματος",
    make: () => {
      const [x1, y1, x2, y2] = [ri(-6, 6), ri(-6, 6), ri(-6, 6), ri(-6, 6)];
      return {
        prompt: (
          <>
            Βρες το μέσο Μ του τμήματος με άκρα Α{pair(x1, y1)} και Β{pair(x2, y2)}.
          </>
        ),
        fields: [
          <>
            x<sub>Μ</sub>
          </>,
          <>
            y<sub>Μ</sub>
          </>,
        ],
        answers: [(x1 + x2) / 2, (y1 + y2) / 2],
        hint: <>Ημιάθροισμα: x<sub>Μ</sub> = (x<sub>Α</sub> + x<sub>Β</sub>)/2, το ίδιο για το y. Δεκαδικά γράψ' τα με κόμμα (π.χ. 1,5).</>,
        steps: [
          <>
            x<sub>Μ</sub> = ({num(x1)} + {p(x2)})/2 = {num(x1 + x2)}/2 = <b>{num((x1 + x2) / 2)}</b>
          </>,
          <>
            y<sub>Μ</sub> = ({num(y1)} + {p(y2)})/2 = {num(y1 + y2)}/2 = <b>{num((y1 + y2) / 2)}</b>
          </>,
        ],
      };
    },
  },
  {
    id: "norm",
    title: "Μέτρο",
    make: () => {
      const [a, b, c] = pick([
        [3, 4, 5],
        [6, 8, 10],
        [5, 12, 13],
        [8, 15, 17],
        [9, 12, 15],
        [12, 16, 20],
      ]);
      const swap = Math.random() < 0.5;
      const x = (swap ? b : a) * pick([1, -1]);
      const y = (swap ? a : b) * pick([1, -1]);
      return {
        prompt: (
          <>
            Βρες το μέτρο του {α} = {pair(x, y)}.
          </>
        ),
        fields: [<Abs>{α}</Abs>],
        answers: [c],
        hint: (
          <>
            <Abs>{α}</Abs> = √(x² + y²). Το τετράγωνο αρνητικού είναι θετικό.
          </>
        ),
        steps: [
          <>
            <Abs>{α}</Abs> = √({p(x)}² + {p(y)}²) = √({x * x} + {y * y}) = √{c * c} = <b>{c}</b>
          </>,
        ],
      };
    },
  },
  {
    id: "lincomb",
    title: "Γραμμικός συνδυασμός",
    make: () => {
      const [a1, a2, b1, b2] = [ri(-4, 4), ri(-4, 4), ri(-4, 4), ri(-4, 4)];
      const k = pick([2, 3, -2, -1, 4]);
      const m = pick([1, -1, 2, -3, 3]);
      const term = (c: number, v: ReactNode, first: boolean) => {
        const sign = c < 0 ? "−" : first ? "" : "+";
        const abs = Math.abs(c) === 1 ? "" : String(Math.abs(c));
        return (
          <>
            {first ? sign : ` ${sign} `}
            {abs}
            {v}
          </>
        );
      };
      return {
        prompt: (
          <>
            Αν {α} = {pair(a1, a2)} και {β} = {pair(b1, b2)}, βρες τις συντεταγμένες του {term(k, α, true)}
            {term(m, β, false)}.
          </>
        ),
        fields: ["x", "y"],
        answers: [k * a1 + m * b1, k * a2 + m * b2],
        hint: <>Πολλαπλασίασε κάθε συντεταγμένη με τον αριθμό και πρόσθεσε τα αντίστοιχα.</>,
        steps: [
          <>
            {num(k)}
            {α} = {pair(k * a1, k * a2)} και {num(m)}
            {β} = {pair(m * b1, m * b2)}
          </>,
          <>
            Άθροισμα: ({num(k * a1)} + {p(m * b1)}, {num(k * a2)} + {p(m * b2)}) = <b>{pair(k * a1 + m * b1, k * a2 + m * b2)}</b>
          </>,
        ],
      };
    },
  },
  {
    id: "dot",
    title: "Εσωτερικό (συντεταγμένες)",
    make: () => {
      const [a1, a2, b1, b2] = [ri(-5, 5), ri(-5, 5), ri(-5, 5), ri(-5, 5)];
      return {
        prompt: (
          <>
            Αν {α} = {pair(a1, a2)} και {β} = {pair(b1, b2)}, υπολόγισε το {α}·{β}.
          </>
        ),
        fields: [
          <>
            {α}·{β}
          </>,
        ],
        answers: [a1 * b1 + a2 * b2],
        hint: <>{α}·{β} = x<sub>1</sub>x<sub>2</sub> + y<sub>1</sub>y<sub>2</sub>.</>,
        steps: [
          <>
            {α}·{β} = {p(a1)}·{p(b1)} + {p(a2)}·{p(b2)} = {num(a1 * b1)} + {p(a2 * b2)} = <b>{num(a1 * b1 + a2 * b2)}</b>
          </>,
        ],
      };
    },
  },
  {
    id: "dotpolar",
    title: "Εσωτερικό (μέτρα & γωνία)",
    make: () => {
      const A = pick([2, 4, 6]);
      const B = pick([2, 3, 5]);
      const [deg, cos, cosText] = pick<[number, number, string]>([
        [0, 1, "1"],
        [60, 0.5, "1/2"],
        [90, 0, "0"],
        [120, -0.5, "−1/2"],
        [180, -1, "−1"],
      ]);
      return {
        prompt: (
          <>
            Αν <Abs>{α}</Abs> = {A}, <Abs>{β}</Abs> = {B} και η γωνία τους είναι {deg}°, υπολόγισε το {α}·{β}.
          </>
        ),
        fields: [
          <>
            {α}·{β}
          </>,
        ],
        answers: [A * B * cos],
        hint: (
          <>
            {α}·{β} = <Abs>{α}</Abs>·<Abs>{β}</Abs>·συνθ. Θυμήσου: συν60° = 1/2, συν120° = −1/2.
          </>
        ),
        steps: [
          <>
            {α}·{β} = {A}·{B}·συν{deg}° = {A * B}·({cosText}) = <b>{num(A * B * cos)}</b>
          </>,
        ],
      };
    },
  },
  {
    id: "abssum",
    title: "Μέτρο αθροίσματος",
    make: () => {
      const [A, B, deg, R] = pick<[number, number, number, number]>([
        [3, 5, 60, 7],
        [5, 8, 120, 7],
        [8, 3, 120, 7],
        [6, 10, 60, 14],
        [7, 8, 60, 13],
        [3, 4, 90, 5],
        [6, 8, 90, 10],
      ]);
      const cos = deg === 60 ? 0.5 : deg === 120 ? -0.5 : 0;
      const dot = A * B * cos;
      return {
        prompt: (
          <>
            Αν <Abs>{α}</Abs> = {A}, <Abs>{β}</Abs> = {B} και ({α}, {β}) = {deg}°, βρες το <Abs>{α} + {β}</Abs>.
          </>
        ),
        fields: [
          <Abs>
            {α} + {β}
          </Abs>,
        ],
        answers: [R],
        hint: (
          <>
            Ύψωσε στο τετράγωνο: <Abs>{α} + {β}</Abs>² = <Abs>{α}</Abs>² + 2{α}·{β} + <Abs>{β}</Abs>².
          </>
        ),
        steps: [
          <>
            {α}·{β} = {A}·{B}·συν{deg}° = {num(dot)}
          </>,
          <>
            <Abs>{α} + {β}</Abs>² = {A * A} + 2·{p(dot)} + {B * B} = {R * R}
          </>,
          <>
            <Abs>{α} + {β}</Abs> = √{R * R} = <b>{R}</b>
          </>,
        ],
      };
    },
  },
  {
    id: "perp",
    title: "Βρες λ: κάθετα",
    make: () => {
      const pv = nz(-4, 4);
      const r = nz(-4, 4);
      const q = pick(divisors(pv * r).filter((d) => Math.abs(d) <= 6));
      const lam = (-pv * r) / q;
      return {
        prompt: (
          <>
            Για ποια τιμή του λ τα {α} = (λ, {num(pv)}) και {β} = {pair(q, r)} είναι κάθετα;
          </>
        ),
        fields: ["λ"],
        answers: [lam],
        hint: <>Κάθετα ⇔ {α}·{β} = 0. Γράψε το εσωτερικό γινόμενο με το λ και λύσε την εξίσωση.</>,
        steps: [
          <>
            {α} ⊥ {β} ⇔ {α}·{β} = 0 ⇔ λ·{p(q)} + {p(pv)}·{p(r)} = 0
          </>,
          <>
            ⇔ {num(q)}λ = {num(-pv * r)} ⇔ <b>λ = {num(lam)}</b>
          </>,
        ],
      };
    },
  },
  {
    id: "parallel",
    title: "Βρες λ: παράλληλα",
    make: () => {
      const pv = nz(-4, 4);
      const q = nz(-4, 4);
      const r = pick(divisors(pv * q).filter((d) => Math.abs(d) <= 6));
      const lam = (pv * q) / r;
      return {
        prompt: (
          <>
            Για ποια τιμή του λ τα {α} = (λ, {num(pv)}) και {β} = {pair(q, r)} είναι παράλληλα;
          </>
        ),
        fields: ["λ"],
        answers: [lam],
        hint: (
          <>
            Παράλληλα ⇔ det({α}, {β}) = x<sub>1</sub>y<sub>2</sub> − x<sub>2</sub>y<sub>1</sub> = 0.
          </>
        ),
        steps: [
          <>
            {α} ∥ {β} ⇔ det({α}, {β}) = 0 ⇔ λ·{p(r)} − {p(q)}·{p(pv)} = 0
          </>,
          <>
            ⇔ {num(r)}λ = {num(pv * q)} ⇔ <b>λ = {num(lam)}</b>
          </>,
        ],
      };
    },
  },
  {
    id: "collinear",
    title: "Συνευθειακά σημεία",
    make: () => {
      const [ax, ay] = [ri(-3, 3), ri(-3, 3)];
      const d1 = nz(-3, 3);
      const d2 = nz(-3, 3);
      const s = nz(-2, 2);
      let t = nz(-2, 2);
      if (t === s) t = -s;
      const [bx, by] = [ax + s * d1, ay + s * d2];
      const [gx, gy] = [ax + t * d1, ay + t * d2];
      const ABx = bx - ax;
      const ABy = by - ay;
      const AGx = gx - ax;
      return {
        prompt: (
          <>
            Δίνονται τα σημεία Α{pair(ax, ay)}, Β{pair(bx, by)} και Γ({num(gx)}, y). Βρες το y ώστε τα Α, Β, Γ να είναι συνευθειακά.
          </>
        ),
        fields: ["y"],
        answers: [gy],
        hint: (
          <>
            Α, Β, Γ συνευθειακά ⇔ <V>ΑΒ</V> ∥ <V>ΑΓ</V> ⇔ det(<V>ΑΒ</V>, <V>ΑΓ</V>) = 0.
          </>
        ),
        steps: [
          <>
            <V>ΑΒ</V> = {pair(ABx, ABy)}, <V>ΑΓ</V> = ({num(AGx)}, y − {p(ay)})
          </>,
          <>
            det = {p(ABx)}·(y − {p(ay)}) − {p(AGx)}·{p(ABy)} = 0
          </>,
          <>
            ⇒ y − {p(ay)} = {num((AGx * ABy) / ABx)} ⇒ <b>y = {num(gy)}</b>
          </>,
        ],
      };
    },
  },
  {
    id: "angle",
    title: "Γωνία διανυσμάτων",
    make: () => {
      let u1 = 0;
      let u2 = 0;
      while (u1 === 0 && u2 === 0) {
        u1 = ri(-3, 3);
        u2 = ri(-3, 3);
      }
      const k = pick([1, 2]);
      const [deg, b] = pick<[number, [number, number]]>([
        [45, [k * (u1 - u2), k * (u2 + u1)]],
        [135, [k * (-u1 - u2), k * (-u2 + u1)]],
        [90, [k * -u2, k * u1]],
        [0, [k * u1, k * u2]],
        [180, [-k * u1, -k * u2]],
      ]);
      const dot = u1 * b[0] + u2 * b[1];
      const na = u1 * u1 + u2 * u2;
      const nb = b[0] * b[0] + b[1] * b[1];
      const cosText = { 0: "1", 45: "√2/2", 90: "0", 135: "−√2/2", 180: "−1" }[deg];
      return {
        prompt: (
          <>
            Βρες τη γωνία (σε μοίρες) των {α} = {pair(u1, u2)} και {β} = {pair(b[0], b[1])}.
          </>
        ),
        fields: ["θ (°)"],
        answers: [deg],
        hint: (
          <>
            συνθ = <span className="whitespace-nowrap">{α}·{β} / (<Abs>{α}</Abs>·<Abs>{β}</Abs>)</span>. Μετά θυμήσου ποια γωνία έχει αυτό το συνημίτονο.
          </>
        ),
        steps: [
          <>
            {α}·{β} = {p(u1)}·{p(b[0])} + {p(u2)}·{p(b[1])} = {num(dot)}
          </>,
          <>
            <Abs>{α}</Abs> = {sqrtText(na)}, <Abs>{β}</Abs> = {sqrtText(nb)}
          </>,
          <>
            συνθ = {num(dot)} / ({sqrtText(na)}·{sqrtText(nb)}) = {cosText} ⇒ <b>θ = {deg}°</b>
          </>,
        ],
      };
    },
  },
];

function parseAnswer(raw: string): number | null {
  const s = raw.trim().replace(/−/g, "-").replace(/\s+/g, "").replace(",", ".");
  if (!s) return null;
  if (s.includes("/")) {
    const [a, b] = s.split("/").map(Number);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
    return a / b;
  }
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
}

export function Practice() {
  const [genId, setGenId] = useState<string>("mix");
  const [problem, setProblem] = useState<Problem>(() => GENERATORS[0].make());
  const [values, setValues] = useState<string[]>([]);
  const [result, setResult] = useState<"right" | "wrong" | null>(null);
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const [score, setScore] = useState({ right: 0, tries: 0 });

  const next = (id = genId) => {
    const gen = id === "mix" ? GENERATORS[Math.floor(Math.random() * GENERATORS.length)] : GENERATORS.find((g) => g.id === id) ?? GENERATORS[0];
    setProblem(gen.make());
    setValues([]);
    setResult(null);
    setHint(false);
    setSolution(false);
  };

  const check = () => {
    const parsed = problem.answers.map((_, i) => parseAnswer(values[i] ?? ""));
    if (parsed.some((v) => v === null)) return;
    const ok = parsed.every((v, i) => Math.abs((v as number) - problem.answers[i]) < 0.01);
    setResult(ok ? "right" : "wrong");
    if (result !== "right") setScore((s) => ({ right: s.right + (ok ? 1 : 0), tries: s.tries + 1 }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[{ id: "mix", title: "🎲 Ανάμεικτα" }, ...GENERATORS].map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => {
              setGenId(g.id);
              next(g.id);
            }}
            aria-pressed={genId === g.id}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              genId === g.id ? "bg-[#2c2825] text-white" : "border border-black/10 bg-white text-[#4d4138] hover:bg-[#f3efe8]"
            }`}
          >
            {g.title}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-black/10 bg-[#fffdf9] p-4 sm:p-5">
        <div className="text-[15px] leading-8 text-[#2c2825]">{problem.prompt}</div>

        <form
          className="mt-3 flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            check();
          }}
        >
          {problem.fields.map((label, i) => (
            <label key={i} className="block">
              <span className="block text-xs font-semibold text-[#857261]">{label}</span>
              <input
                inputMode="text"
                autoComplete="off"
                value={values[i] ?? ""}
                onChange={(e) => {
                  const nextValues = [...values];
                  nextValues[i] = e.target.value;
                  setValues(nextValues);
                  if (result === "wrong") setResult(null);
                }}
                className={`mt-1 w-24 rounded-xl border bg-white px-3 py-2 font-mono text-base outline-none focus:border-[#c9822f] ${
                  result === "right" ? "border-[#2e8b57]" : result === "wrong" ? "border-[#c0392b]" : "border-black/15"
                }`}
              />
            </label>
          ))}
          <button type="submit" className="rounded-full bg-[#c9822f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#b37226]">
            Έλεγχος
          </button>
        </form>

        {result === "right" ? <p className="mt-3 text-sm font-semibold text-[#2e8b57]">✓ Σωστά!</p> : null}
        {result === "wrong" ? <p className="mt-3 text-sm font-semibold text-[#c0392b]">✗ Όχι ακόμα. Ξαναδοκίμασε ή δες την υπόδειξη.</p> : null}

        <div className="mt-3 flex flex-wrap gap-2">
          {!hint ? (
            <button
              type="button"
              onClick={() => setHint(true)}
              className="rounded-full border border-[#c9822f]/40 bg-[#fdf3e6] px-3.5 py-1.5 text-sm font-semibold text-[#8a5a22] hover:bg-[#fbe8cf]"
            >
              💡 Υπόδειξη
            </button>
          ) : null}
          {!solution ? (
            <button
              type="button"
              onClick={() => setSolution(true)}
              className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#4d4138] hover:bg-[#f3efe8]"
            >
              Δείξε τη λύση
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => next()}
            className="rounded-full bg-[#2c2825] px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-[#4d4138]"
          >
            Νέα άσκηση →
          </button>
        </div>

        {hint ? (
          <div className="mt-3 rounded-xl bg-[#fdf3e6] px-3 py-2 text-sm leading-7 text-[#5f4630]">
            <b>💡</b> {problem.hint}
          </div>
        ) : null}
        {solution ? (
          <ol className="mt-3 space-y-1.5">
            {problem.steps.map((s, i) => (
              <li key={i} className="flex gap-2 rounded-xl bg-[#fbf8f3] px-3 py-2 text-[14px] leading-8 ring-1 ring-black/5">
                <span className="font-bold text-[#c9822f]">{i + 1}.</span>
                <span className="min-w-0">{s}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      <p className="text-xs text-[#857261]">
        Σε αυτή τη συνεδρία: <b className="text-[#2e8b57]">{score.right}</b> σωστές σε {score.tries} ελέγχους. Αρνητικοί με «-», δεκαδικοί με κόμμα (1,5)
        ή κλάσμα (3/2).
      </p>
    </div>
  );
}

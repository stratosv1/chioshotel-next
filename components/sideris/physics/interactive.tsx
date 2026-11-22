"use client";

import { useEffect, useRef, useState } from "react";
import { FINAL, MINI, type PQ } from "@/lib/sideris/physics-k2-quiz";
import { MathText } from "../math/MathText";

type Ans = number | boolean | string | null;

/** Διαβάζει αριθμό όπως τον γράφει ένα παιδί: 8,72 ή 8.72 ή 86.400 ή 17 935. */
export function parseNum(raw: string): number | null {
  let s = raw.trim().replace(/\s+/g, "");
  if (!s) return null;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function grade(q: PQ, a: Ans): { ok: boolean; note?: string } {
  if (a === null || a === "") return { ok: false, note: "Δεν απάντησες." };
  if (q.kind !== "num") return { ok: a === q.answer };
  const n = parseNum(String(a));
  if (n === null) return { ok: false, note: "Γράψε μόνο τον αριθμό, π.χ. 180 ή 8,72." };
  return { ok: Math.abs(n - q.answer) <= Math.max(1e-9, Math.abs(q.answer) * 1e-3) };
}

const fmt = (n: number) => n.toLocaleString("el-GR", { maximumFractionDigits: 4 });

function rightText(q: PQ) {
  if (q.kind === "mc") return q.choices[q.answer];
  if (q.kind === "tf") return q.answer ? "Σωστό" : "Λάθος";
  return `${fmt(q.answer)} ${q.unit}`;
}

function Input({ q, value, onChange, locked, onEnter }: { q: PQ; value: Ans; onChange: (a: Ans) => void; locked: boolean; onEnter?: () => void }) {
  const btn = (active: boolean) =>
    `rounded-xl border-2 px-3 py-2 text-base font-semibold transition disabled:cursor-default ${
      active ? "border-[#6b3fa0] bg-[#f1eafa] text-[#6b3fa0]" : "border-black/10 bg-white hover:border-[#6b3fa0]/40"
    }`;
  if (q.kind === "mc")
    return (
      <div className="flex flex-wrap gap-2">
        {q.choices.map((c, i) => (
          <button key={i} type="button" disabled={locked} onClick={() => onChange(i)} className={btn(value === i)}>
            <MathText text={c} />
          </button>
        ))}
      </div>
    );
  if (q.kind === "tf")
    return (
      <div className="flex gap-2">
        <button type="button" disabled={locked} onClick={() => onChange(true)} className={btn(value === true)}>
          Σωστό
        </button>
        <button type="button" disabled={locked} onClick={() => onChange(false)} className={btn(value === false)}>
          Λάθος
        </button>
      </div>
    );
  return (
    <span className="inline-flex items-center gap-2">
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        disabled={locked}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        className="w-36 rounded-xl border-2 border-black/15 bg-white px-3 py-2 text-lg font-semibold text-[#1d5a8c] outline-none focus:border-[#6b3fa0]"
      />
      <span className="font-semibold text-[#6b625b]">{q.unit}</span>
    </span>
  );
}

function Feedback({ q, ok, note }: { q: PQ; ok: boolean; note?: string }) {
  return (
    <div className={`sx-pop mt-3 rounded-xl p-3 text-[15px] leading-7 ${ok ? "bg-[#e7f3e4] text-[#24522a]" : "bg-[#fdf1f0] text-[#7a2626]"}`}>
      <p className="font-bold">
        {ok ? (
          <>✅ Σωστά!</>
        ) : (
          <>
            ❌ {note ?? "Όχι ακριβώς."} Σωστή απάντηση: <MathText text={rightText(q)} />
          </>
        )}
      </p>
      <p className="mt-1">
        💡 <MathText text={q.why} />
      </p>
    </div>
  );
}

function PracticeCard({ q, n, onResult }: { q: PQ; n: number; onResult: (ok: boolean) => void }) {
  const [a, setA] = useState<Ans>(null);
  const [v, setV] = useState<{ ok: boolean; note?: string } | null>(null);
  const check = () => {
    const r = grade(q, a);
    setV(r);
    onResult(r.ok);
  };
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <p className="mb-3 text-[17px] font-medium">
        <span className="mr-2 font-bold text-[#6b3fa0]">{n}.</span>
        <MathText text={q.q} />
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Input q={q} value={a} onChange={(x) => (setA(x), setV(null))} locked={!!v?.ok} onEnter={check} />
        {!v?.ok ? (
          <button type="button" onClick={check} className="rounded-xl bg-[#6b3fa0] px-4 py-2 font-semibold text-white transition hover:opacity-90">
            Έλεγχος
          </button>
        ) : null}
      </div>
      {v ? <Feedback q={q} ok={v.ok} note={v.note} /> : null}
    </div>
  );
}

export function MiniQuiz({ id }: { id: string }) {
  const qs = MINI[id] ?? [];
  const [done, setDone] = useState<Record<string, boolean>>({});
  const score = Object.values(done).filter(Boolean).length;
  return (
    <div className="rounded-3xl border-2 border-[#6b3fa0]/20 bg-gradient-to-br from-[#f5effc] to-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-[#6b3fa0]">⚡ Γρήγορο quiz: το κατάλαβες;</h3>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#6b3fa0] shadow-sm">
          {score}/{qs.length} σωστά {score === qs.length && qs.length ? "🎉" : ""}
        </span>
      </div>
      <div className="space-y-3">
        {qs.map((q, i) => (
          <PracticeCard key={q.id} q={q} n={i + 1} onResult={(ok) => setDone((d) => ({ ...d, [q.id]: d[q.id] || ok }))} />
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────── τελικό τεστ ─────────────────────────────
export function FinalTest() {
  const all = FINAL.flatMap((g) => g.questions);
  const [answers, setAnswers] = useState<Record<string, Ans>>({});
  const [submitted, setSubmitted] = useState(false);
  const [round, setRound] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const verdicts = Object.fromEntries(all.map((q) => [q.id, grade(q, answers[q.id] ?? null)]));
  const got = all.filter((q) => verdicts[q.id].ok).length;
  const mark = Math.round((got / all.length) * 200) / 10;
  const answered = all.filter((q) => answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== "").length;

  return (
    <div ref={topRef} key={round} className="scroll-mt-24 space-y-4">
      {submitted ? (
        <div className={`sx-pop rounded-2xl p-5 text-center ${mark >= 14 ? "bg-[#e7f3e4]" : mark >= 10 ? "bg-[#fff4e0]" : "bg-[#fdf1f0]"}`}>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#6b625b]">Βαθμός</p>
          <p className="sx-bounce mt-1 text-5xl font-black">
            {mark}
            <span className="text-2xl font-bold text-[#857a70]">/20</span>
          </p>
          <p className="mt-2 text-lg font-semibold">
            {mark >= 18 ? "Άριστα! 💪" : mark >= 14 ? "Πολύ καλά! Δες μόνο τα λάθη σου 👇" : "Ξαναδιάβασε τη φωτοτυπία και ξαναδοκίμασε!"}
          </p>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
              setRound((r) => r + 1);
            }}
            className="mt-4 rounded-xl border border-black/15 bg-white px-4 py-2 font-semibold transition hover:bg-[#f7f4ef]"
          >
            ↻ Ξανά από την αρχή
          </button>
        </div>
      ) : null}

      {FINAL.map((g) => (
        <div key={g.title} className="space-y-3">
          <h4 className="pt-2 text-base font-bold text-[#6b3fa0]">{g.title}</h4>
          {g.questions.map((q) => {
            const v = verdicts[q.id];
            return (
              <div
                key={q.id}
                className={`rounded-2xl border-2 bg-white p-4 ${submitted ? (v.ok ? "border-[#7fbf7a]" : "border-[#e39a9a]") : "border-black/10"}`}
              >
                <p className="mb-3 text-[17px] font-medium">
                  <span className="mr-2 font-bold text-[#6b3fa0]">{all.indexOf(q) + 1}.</span>
                  <MathText text={q.q} />
                </p>
                <Input q={q} value={answers[q.id] ?? null} onChange={(a) => setAnswers((s) => ({ ...s, [q.id]: a }))} locked={submitted} />
                {submitted ? <Feedback q={q} ok={v.ok} note={v.note} /> : null}
              </div>
            );
          })}
        </div>
      ))}

      {!submitted ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmitted(true);
              topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="rounded-2xl bg-[#6b3fa0] px-6 py-3 font-bold text-white shadow-md transition hover:opacity-90"
          >
            Παράδοση ✓
          </button>
          <span className="text-sm text-[#857a70]">
            Απάντησες {answered}/{all.length}
          </span>
        </div>
      ) : null}
    </div>
  );
}

// ───────────────────────────── μετατροπέας μονάδων ─────────────────────────────
const UNITS = [
  { key: "h", label: "ώρες (h)", s: 3600 },
  { key: "min", label: "λεπτά (min)", s: 60 },
  { key: "s", label: "δευτερόλεπτα (s)", s: 1 },
  { key: "ms", label: "χιλιοστά του s (ms)", s: 0.001 },
];

export function UnitConverter() {
  const [val, setVal] = useState("2");
  const [unit, setUnit] = useState("h");
  const n = parseNum(val);
  const from = UNITS.find((u) => u.key === unit)!;
  const seconds = n === null ? null : n * from.s;
  return (
    <div className="rounded-3xl border-2 border-[#1d5a8c]/20 bg-[#eef5fb] p-5 shadow-sm sm:p-6">
      <h3 className="mb-3 text-lg font-bold text-[#1d5a8c]">🎮 Μετατροπέας: γράψε έναν χρόνο</h3>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          inputMode="decimal"
          className="w-28 rounded-xl border-2 border-black/15 bg-white px-3 py-2 text-lg font-semibold text-[#1d5a8c] outline-none focus:border-[#1d5a8c]"
        />
        <select value={unit} onChange={(e) => setUnit(e.target.value)} className="rounded-xl border-2 border-black/15 bg-white px-3 py-2 font-semibold">
          {UNITS.map((u) => (
            <option key={u.key} value={u.key}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
      {seconds === null ? (
        <p className="mt-3 text-sm text-[#7a2626]">Γράψε έναν αριθμό, π.χ. 2 ή 1,5</p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {UNITS.filter((u) => u.key !== unit).map((u) => {
            const res = seconds / u.s;
            const up = u.s < from.s;
            const factor = up ? from.s / u.s : u.s / from.s;
            return (
              <div key={u.key} className="sx-pop rounded-2xl bg-white p-3 shadow-sm">
                <p className="text-xl font-bold text-[#1d5a8c]">
                  = {fmt(res)} {u.key}
                </p>
                <p className="text-sm text-[#6b625b]">
                  {fmt(n!)} {up ? "×" : ":"} {fmt(factor)} {up ? "(σε μικρότερη μονάδα: πολλαπλασιάζω)" : "(σε μεγαλύτερη μονάδα: διαιρώ)"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────── δοκίμασε τα αντανακλαστικά σου ─────────────────────────────
export function ReactionGame() {
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const [tries, setTries] = useState<number[]>([]);
  const start = useRef(0);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const tick = () => {
    setT((performance.now() - start.current) / 1000);
    raf.current = requestAnimationFrame(tick);
  };
  const toggle = () => {
    if (!running) {
      start.current = performance.now();
      setT(0);
      setRunning(true);
      raf.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(raf.current);
      const final = (performance.now() - start.current) / 1000;
      setT(final);
      setRunning(false);
      setTries((x) => [...x, Math.round(final * 100) / 100].slice(-5));
    }
  };
  const mean = tries.length ? tries.reduce((a, b) => a + b, 0) / tries.length : null;

  return (
    <div className="rounded-3xl border-2 border-[#c96a2b]/30 bg-[#fff7ef] p-5 shadow-sm sm:p-6">
      <h3 className="mb-1 text-lg font-bold text-[#a2531f]">🎮 Πείραμα: σταμάτα το χρονόμετρο ακριβώς στα 5,00 s</h3>
      <p className="mb-4 text-sm text-[#6b625b]">
        Κάνε 5 προσπάθειες. Θα δεις ότι κάθε φορά βγαίνει λίγο διαφορετικό. Αυτός είναι ο <b>υποκειμενικός παράγοντας</b>: το λάθος
        οφείλεται σε εμάς, όχι στο όργανο.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <span className="rounded-2xl bg-[#2c2825] px-5 py-3 font-mono text-4xl font-bold tabular-nums text-[#ffb36b]">
          {running ? t.toFixed(1) : t.toFixed(2)}
        </span>
        <button
          type="button"
          onClick={toggle}
          className={`rounded-2xl px-6 py-3 text-lg font-bold text-white shadow-md transition hover:scale-[1.02] ${running ? "bg-[#b33a3a]" : "bg-[#3d6b3a]"}`}
        >
          {running ? "■ Stop" : "▶ Start"}
        </button>
      </div>
      {tries.length ? (
        <div className="mt-4 space-y-1 text-[15px]">
          <p>
            Οι μετρήσεις σου: <b>{tries.map((x) => x.toFixed(2).replace(".", ",")).join(" s, ")} s</b>
          </p>
          <p>
            Μέση τιμή: <b>{mean!.toFixed(2).replace(".", ",")} s</b>{" "}
            <span className="text-[#6b625b]">(άθροισμα : πλήθος = {tries.reduce((a, b) => a + b, 0).toFixed(2).replace(".", ",")} : {tries.length})</span>
          </p>
          <button type="button" onClick={() => setTries([])} className="text-sm font-semibold text-[#a2531f] hover:underline">
            ↻ Καθάρισε
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ───────────────────────────── εκκρεμές ─────────────────────────────
export function Pendulum() {
  const [count, setCount] = useState(0);
  const [on, setOn] = useState(true);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setCount((c) => c + 1), 2000);
    return () => clearInterval(id);
  }, [on]);
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <svg viewBox="0 0 200 190" className="h-48 w-48 shrink-0" aria-label="Απλό εκκρεμές που ταλαντώνεται">
          <rect x="40" y="6" width="120" height="8" rx="3" fill="#857261" />
          <line x1="40" y1="150" x2="160" y2="150" stroke="#cfc6bc" strokeDasharray="4 4" />
          <text x="30" y="172" fontSize="14" fill="#857261">
            Α
          </text>
          <text x="96" y="180" fontSize="14" fill="#857261">
            Ο
          </text>
          <text x="162" y="172" fontSize="14" fill="#857261">
            Γ
          </text>
          <g className={on ? "sx-swing" : ""} style={{ transformOrigin: "100px 14px" }}>
            <line x1="100" y1="14" x2="100" y2="140" stroke="#2c2825" strokeWidth="2" />
            <circle cx="100" cy="148" r="12" fill="#c2185b" />
          </g>
        </svg>
        <div className="space-y-2 text-[15px] leading-7">
          <p>
            Ένα σφαιρίδιο (ή πλαστελίνη) δεμένο σε νήμα. Το απομακρύνουμε από τη <b>θέση ισορροπίας Ο</b> και το αφήνουμε. Πηγαίνει{" "}
            <b>Α → Ο → Γ → Ο → Α</b> ξανά και ξανά, πάντα με τον ίδιο τρόπο.
          </p>
          <p>
            Μία πήγαινε-έλα (από το Α πάλι πίσω στο Α) λέγεται <b>μία πλήρης ταλάντωση</b>. Εδώ κρατάει <b>2 s</b>.
          </p>
          <p className="rounded-xl bg-[#f1eafa] px-3 py-2 font-semibold text-[#6b3fa0]">Πλήρεις ταλαντώσεις μέχρι τώρα: {Math.floor(count)}</p>
          <button type="button" onClick={() => setOn((x) => !x)} className="rounded-xl border border-black/15 px-3 py-1.5 text-sm font-semibold hover:bg-[#f7f4ef]">
            {on ? "⏸ Σταμάτα" : "▶ Συνέχισε"}
          </button>
        </div>
      </div>
    </div>
  );
}

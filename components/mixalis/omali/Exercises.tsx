"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORY_LABELS, EXERCISES, type Exercise, type ExerciseCategory, type ExercisePart } from "./exercises-data";

const STORAGE_KEY = "mixalis-omali-exercises-v1";
const TOLERANCE = 0.04; // 4%: accepts both π² = 10 and exact π²

/**
 * Evaluates what the student typed: Greek decimal comma, π, √, powers,
 * scientific notation (6,28e6 or 6,28·10^6). Only a strict whitelist of
 * characters is ever evaluated.
 */
export function parseAnswer(raw: string): number | null {
  let s = raw.trim().toLowerCase();
  if (!s) return null;
  s = s
    .replace(/,/g, ".")
    .replace(/[·×x]/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\s+/g, "")
    .replace(/pi/g, "π");
  // strip a trailing unit the student might have typed
  s = s.replace(/(m\/s²|m\/s2|m\/s|rad\/s|rad|hz|kg|km\/h|m|s|n|j)$/u, "");
  if (!/^[0-9.+\-*/()π√^e]+$/u.test(s)) return null;
  // implicit multiplication: 10π, 2(…), π(…), )(
  s = s.replace(/(\d|\)|π)(?=π|\(|√)/gu, "$1*");
  s = s.replace(/π/gu, "(Math.PI)");
  s = s.replace(/√\(/gu, "Math.sqrt(");
  s = s.replace(/√([0-9.]+)/gu, "Math.sqrt($1)");
  s = s.replace(/\^/g, "**");
  if (/[^0-9.+\-*/()eMathPIsqr]/.test(s)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const value = Function(`"use strict"; return (${s});`)();
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function isClose(got: number, want: number) {
  if (want === 0) return Math.abs(got) < 1e-9;
  return Math.abs(got - want) / Math.abs(want) <= TOLERANCE;
}

function loadSolved(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSolved(value: Record<string, boolean>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable: progress just isn't remembered */
  }
}

function PartCheck({ part, onCorrect }: { part: ExercisePart; onCorrect: () => void }) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "wrong" | "bad">("idle");
  const [shown, setShown] = useState(false);

  const check = () => {
    if (!part.check) return;
    const got = parseAnswer(value);
    if (got === null) {
      setState("bad");
      return;
    }
    if (isClose(got, part.check.value)) {
      setState("ok");
      onCorrect();
    } else setState("wrong");
  };

  return (
    <div className="rounded-xl border border-black/10 bg-white px-3 py-2.5">
      <p className="text-sm text-[#4d4138]">
        {part.label ? <b className="mr-1 text-[#c9822f]">{part.label})</b> : null}
        {part.ask}
      </p>
      {part.check ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setState("idle");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") check();
            }}
            inputMode="decimal"
            placeholder="π.χ. 31,8 ή 100/π"
            aria-label={`Απάντηση: ${part.ask}`}
            className={`w-40 rounded-lg border px-2.5 py-1.5 font-mono text-sm outline-none focus:ring-2 focus:ring-[#c9822f]/40 ${
              state === "ok" ? "border-[#2e8b57] bg-[#ecf7f0]" : state === "wrong" ? "border-[#c0392b] bg-[#fdeeec]" : "border-black/15"
            }`}
          />
          {part.check.unit ? <span className="text-sm text-[#857261]">{part.check.unit}</span> : null}
          <button type="button" onClick={check} className="rounded-lg bg-[#2c2825] px-3 py-1.5 text-xs font-semibold text-white">
            Έλεγχος
          </button>
          <button type="button" onClick={() => setShown(!shown)} className="text-xs font-semibold text-[#857261] underline underline-offset-2">
            {shown ? "Κρύψε" : "Δείξε"} απάντηση
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setShown(!shown)} className="mt-1 text-xs font-semibold text-[#857261] underline underline-offset-2">
          {shown ? "Κρύψε" : "Δείξε"} απάντηση
        </button>
      )}
      {state === "ok" ? <p className="mt-1.5 text-sm font-semibold text-[#2e8b57]">Σωστά! ✓</p> : null}
      {state === "wrong" ? <p className="mt-1.5 text-sm text-[#c0392b]">Όχι ακόμα. Έλεγξε μονάδες και πράξεις, ή άνοιξε την υπόδειξη.</p> : null}
      {state === "bad" ? <p className="mt-1.5 text-sm text-[#c0392b]">Γράψε έναν αριθμό (π.χ. 0,25 ή 10π ή 6,28e6).</p> : null}
      {shown ? <p className="mt-1.5 rounded-lg bg-[#ecf7f0] px-2.5 py-1.5 text-sm font-semibold text-[#245c3d]">{part.answer}</p> : null}
    </div>
  );
}

function ExerciseCard({
  ex,
  solved,
  onSolved,
}: {
  ex: Exercise;
  solved: boolean;
  onSolved: (value: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [stepsShown, setStepsShown] = useState(0);
  const [correct, setCorrect] = useState<Set<number>>(new Set());
  const checkable = ex.parts.map((p, i) => (p.check ? i : -1)).filter((i) => i >= 0);

  const markCorrect = (i: number) => {
    const next = new Set(correct).add(i);
    setCorrect(next);
    if (checkable.length > 0 && checkable.every((k) => next.has(k)) && !solved) onSolved(true);
  };

  return (
    <article className={`rounded-2xl border bg-[#fffdf9] transition ${solved ? "border-[#2e8b57]/40" : "border-black/10"}`}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-start gap-3 p-4 text-left sm:p-5">
        <span
          className={`mt-0.5 inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full px-2 text-sm font-bold ${
            solved ? "bg-[#2e8b57] text-white" : "bg-[#2c2825] text-white"
          }`}
        >
          {solved ? "✓" : ex.n}
        </span>
        <span className="flex-1">
          <span className="block text-xs font-semibold text-[#c9822f]">
            Άσκηση {ex.n} · {CATEGORY_LABELS[ex.cat]}
          </span>
          <span className={`mt-1 block text-[15px] leading-6 text-[#2c2825] ${open ? "" : "line-clamp-2"}`}>{ex.text}</span>
        </span>
        <span className="mt-1 text-lg text-[#857261]" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>

      {open ? (
        <div className="space-y-4 px-4 pb-5 sm:px-5">
          {ex.given?.length ? (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs font-semibold text-[#857261]">Δεδομένα:</span>
              {ex.given.map((g) => (
                <span key={g} className="rounded-md bg-[#f1ede7] px-2 py-0.5 font-mono text-xs text-[#4d4138]">
                  {g}
                </span>
              ))}
            </div>
          ) : null}

          <div className="grid gap-2">
            {ex.parts.map((part, i) => (
              <PartCheck key={i} part={part} onCorrect={() => markCorrect(i)} />
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setHint(!hint)}
              className="rounded-full border border-[#c9822f]/40 bg-[#fdf3e6] px-3.5 py-1.5 text-sm font-semibold text-[#5f4630]"
            >
              💡 {hint ? "Κρύψε υπόδειξη" : "Υπόδειξη"}
            </button>
            <button
              type="button"
              onClick={() => setStepsShown((n) => Math.min(ex.steps.length, n + 1))}
              disabled={stepsShown >= ex.steps.length}
              className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#4d4138] disabled:opacity-40"
            >
              {stepsShown === 0 ? "Λύση βήμα-βήμα" : `Επόμενο βήμα (${stepsShown}/${ex.steps.length})`}
            </button>
            {stepsShown > 0 && stepsShown < ex.steps.length ? (
              <button type="button" onClick={() => setStepsShown(ex.steps.length)} className="text-sm font-semibold text-[#857261] underline underline-offset-2">
                Όλη η λύση
              </button>
            ) : null}
            {ex.see ? (
              <a href={ex.see.href} className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#0f8b8d]">
                ↑ Δες το: {ex.see.label}
              </a>
            ) : null}
          </div>

          {hint ? <p className="rounded-xl bg-[#fdf3e6] px-3 py-2 text-sm leading-6 text-[#5f4630]">{ex.hint}</p> : null}

          {stepsShown > 0 ? (
            <ol className="space-y-1.5">
              {ex.steps.slice(0, stepsShown).map((s, i) => (
                <li key={i} className="flex gap-2 rounded-xl bg-white px-3 py-2 font-mono text-[13px] leading-6 text-[#2c2825] ring-1 ring-black/5">
                  <span className="font-sans font-bold text-[#c9822f]">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          ) : null}

          {ex.trap && stepsShown >= ex.steps.length ? (
            <p className="rounded-xl border border-[#c0392b]/20 bg-[#fdeeec] px-3 py-2 text-sm leading-6 text-[#7a2c22]">
              <b>Παγίδα / σκέψη:</b> {ex.trap}
            </p>
          ) : null}

          <label className="flex items-center gap-2 text-sm text-[#4d4138]">
            <input type="checkbox" checked={solved} onChange={(e) => onSolved(e.target.checked)} className="h-4 w-4 accent-[#2e8b57]" />
            Την έλυσα
          </label>
        </div>
      ) : null}
    </article>
  );
}

export function Exercises() {
  const [filter, setFilter] = useState<ExerciseCategory | "all" | "todo">("all");
  const [solved, setSolved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSolved(loadSolved());
  }, []);

  const setOne = (n: string, value: boolean) => {
    setSolved((prev) => {
      const next = { ...prev, [n]: value };
      saveSolved(next);
      return next;
    });
  };

  const list = useMemo(
    () =>
      EXERCISES.filter((ex) => (filter === "all" ? true : filter === "todo" ? !solved[ex.n] : ex.cat === filter)),
    [filter, solved],
  );
  const doneCount = EXERCISES.filter((ex) => solved[ex.n]).length;
  const pct = Math.round((doneCount / EXERCISES.length) * 100);

  const cats = Object.keys(CATEGORY_LABELS) as ExerciseCategory[];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4">
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-semibold text-[#4d4138]">Πρόοδος</span>
          <span className="font-mono font-semibold text-[#2e8b57]">
            {doneCount} / {EXERCISES.length}
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e9e0d5]">
          <div className="h-full rounded-full bg-[#2e8b57] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs leading-5 text-[#857261]">
          Γράψε την απάντηση σε μονάδες S.I. Δέχεται κόμμα, π, √ και δυνάμεις (π.χ. <span className="font-mono">100/π</span>,{" "}
          <span className="font-mono">2√5</span>, <span className="font-mono">6,28e6</span>). Μια άσκηση μετράει λυμένη όταν σωστά όλα τα αριθμητικά
          ερωτήματα. Η πρόοδος κρατιέται σε αυτή τη συσκευή.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", `Όλες (${EXERCISES.length})`],
            ["todo", "Άλυτες"],
            ...cats.map((c) => [c, `${CATEGORY_LABELS[c]} (${EXERCISES.filter((e) => e.cat === c).length})`]),
          ] as [typeof filter, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              filter === key ? "bg-[#2c2825] text-white" : "border border-black/10 bg-white text-[#4d4138] hover:bg-[#f3efe8]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {list.map((ex) => (
          <ExerciseCard key={ex.n} ex={ex} solved={!!solved[ex.n]} onSolved={(v) => setOne(ex.n, v)} />
        ))}
        {list.length === 0 ? <p className="text-sm text-[#857261]">Τις έλυσες όλες σε αυτή την κατηγορία! 🎉</p> : null}
      </div>

      <p className="text-xs leading-5 text-[#857261]">
        Από το φυλλάδιο λείπει μία σελίδα: η άσκηση 15 κόβεται στη μέση και οι 16–20 δεν υπάρχουν. Η «29*» είναι η άσκηση με αριθμό 29 στη σελίδα 2
        (το φυλλάδιο έχει δύο φορές τον αριθμό 29). Οι ασκήσεις 53–56 χρειάζονται και διατήρηση της μηχανικής ενέργειας.
      </p>
    </div>
  );
}

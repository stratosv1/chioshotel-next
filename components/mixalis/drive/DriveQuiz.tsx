"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DriveQuestion } from "@/lib/mixalis/drive/questions";

// Practice statistics live on the device (localStorage), like the other
// Mixalis study pages. One entry per question id.
const STORE_KEY = "mixalis-drive-v1";
const CAT_KEY = "mixalis-drive-cat-v1";
const ROUND_SIZE = 20;
/** Correct answers in a row needed before a missed question leaves the "Λάθη" list. */
const MASTER_STREAK = 2;

type QStat = { seen: number; wrong: number; streak: number; last: number };
type Stats = Record<string, QStat>;

function readStats(): Stats {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? (parsed as Stats) : {};
  } catch {
    return {};
  }
}

function writeStats(stats: Stats) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(stats));
  } catch {
    // storage blocked (private mode): stats just won't persist
  }
}

const needsReview = (s?: QStat) => !!s && s.wrong > 0 && s.streak < MASTER_STREAK;

/** Pick up to n questions without repeats, favouring unseen and often-missed ones. */
function weightedPick(questions: DriveQuestion[], stats: Stats, n: number): DriveQuestion[] {
  const keyed = questions.map((q) => {
    const s = stats[q.id];
    let w: number;
    if (!s || s.seen === 0) w = 3;
    else if (needsReview(s)) w = 3 + 2 * s.wrong;
    else if (s.streak >= MASTER_STREAK) w = 0.6;
    else w = 1.5;
    return { q, k: Math.pow(Math.random(), 1 / w) };
  });
  keyed.sort((a, b) => b.k - a.k);
  return keyed.slice(0, n).map((x) => x.q);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LETTERS = ["Α", "Β", "Γ", "Δ", "Ε", "Ζ"];

type Round = {
  title: string;
  queue: DriveQuestion[];
  index: number;
  missed: DriveQuestion[];
  correctCount: number;
};

export function DriveQuiz({ questions }: { questions: DriveQuestion[] }) {
  const [stats, setStats] = useState<Stats>({});
  const [round, setRound] = useState<Round | null>(null);
  const [chosen, setChosen] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [cat, setCat] = useState<string | null>(null);
  const [showAllHard, setShowAllHard] = useState(false);

  useEffect(() => {
    setStats(readStats());
    try {
      setCat(window.localStorage.getItem(CAT_KEY));
    } catch {
      // ignore
    }
  }, []);

  const categories = useMemo(() => {
    const m = new Map<string, number>();
    for (const q of questions) if (q.category) m.set(q.category, (m.get(q.category) ?? 0) + 1);
    return [...m.entries()];
  }, [questions]);

  const pool = useMemo(() => (cat ? questions.filter((q) => q.category === cat) : questions), [questions, cat]);

  const chooseCat = (c: string | null) => {
    setCat(c);
    try {
      if (c) window.localStorage.setItem(CAT_KEY, c);
      else window.localStorage.removeItem(CAT_KEY);
    } catch {
      // ignore
    }
  };

  const byId = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions]);

  const summary = useMemo(() => {
    let seen = 0;
    let answers = 0;
    let wrong = 0;
    let mastered = 0;
    const review: DriveQuestion[] = [];
    for (const q of pool) {
      const s = stats[q.id];
      if (!s || s.seen === 0) continue;
      seen++;
      answers += s.seen;
      wrong += s.wrong;
      if (needsReview(s)) review.push(q);
      else if (s.streak >= MASTER_STREAK) mastered++;
    }
    const accuracy = answers ? Math.round(((answers - wrong) / answers) * 100) : null;
    const hardest = pool
      .filter((q) => (stats[q.id]?.wrong ?? 0) > 0)
      .sort((a, b) => stats[b.id].wrong - stats[a.id].wrong || stats[b.id].seen - stats[a.id].seen);
    return { seen, answers, accuracy, mastered, review, hardest };
  }, [pool, stats]);

  const start = useCallback((title: string, queue: DriveQuestion[]) => {
    if (!queue.length) return;
    setRound({ title, queue, index: 0, missed: [], correctCount: 0 });
    setChosen([]);
    setRevealed(false);
    window.scrollTo({ top: 0 });
  }, []);

  const current = round && round.index < round.queue.length ? round.queue[round.index] : null;
  const multi = !!current && current.correct.length > 1;

  const check = (picked: number[]) => {
    if (!current || !round) return;
    const ok = picked.length === current.correct.length && picked.every((i) => current.correct.includes(i));
    const next = { ...stats };
    const prev = next[current.id] ?? { seen: 0, wrong: 0, streak: 0, last: 0 };
    next[current.id] = {
      seen: prev.seen + 1,
      wrong: prev.wrong + (ok ? 0 : 1),
      streak: ok ? prev.streak + 1 : 0,
      last: Date.now(),
    };
    setStats(next);
    writeStats(next);
    setChosen(picked);
    setRevealed(true);
    setRound({
      ...round,
      missed: ok ? round.missed : [...round.missed, current],
      correctCount: round.correctCount + (ok ? 1 : 0),
    });
  };

  const tap = (i: number) => {
    if (revealed) return;
    if (!multi) return check([i]);
    setChosen((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
  };

  const nextQuestion = () => {
    if (!round) return;
    setRound({ ...round, index: round.index + 1 });
    setChosen([]);
    setRevealed(false);
    window.scrollTo({ top: 0 });
  };

  const resetStats = () => {
    if (!window.confirm("Σίγουρα; Θα σβηστούν όλα τα στατιστικά και η λίστα με τα λάθη.")) return;
    setStats({});
    writeStats({});
  };

  // ───────────── Empty bank ─────────────
  if (!questions.length) {
    return (
      <section className="py-16 text-center">
        <p className="text-6xl">🏍️</p>
        <h2 className="mt-6 text-2xl font-semibold">Δεν έχουν μπει ακόμα ερωτήσεις</h2>
        <p className="mx-auto mt-3 max-w-md text-lg leading-8 text-[#6b625b]">
          Μόλις ανέβουν οι φωτογραφίες από το βιβλίο, οι ερωτήσεις θα εμφανιστούν εδώ.
        </p>
      </section>
    );
  }

  // ───────────── Question ─────────────
  if (round && current) {
    const progress = (round.index / round.queue.length) * 100;
    const ok = revealed && chosen.length === current.correct.length && chosen.every((i) => current.correct.includes(i));
    const s = stats[current.id];
    const priorWrong = Math.max(0, (s?.wrong ?? 0) - (revealed && !ok ? 1 : 0));
    return (
      <section className="pb-28">
        <div className="sticky top-0 z-10 -mx-4 bg-[#f3efe8]/95 px-4 pb-3 pt-3 backdrop-blur sm:-mx-8 sm:px-8">
          <div className="flex items-center justify-between text-sm font-semibold text-[#857261]">
            <button type="button" onClick={() => setRound(null)} className="py-2 pr-3 hover:text-[#2c2825]">
              ✕ Τέλος
            </button>
            <span>{round.title}</span>
            <span className="tabular-nums">
              {round.index + 1} / {round.queue.length}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
            <div className="h-full rounded-full bg-[#c9822f] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold">
          {current.category ? <span className="rounded-full bg-[#e9e2d8] px-3 py-1 text-[#6b5a4a]">{current.category}</span> : null}
          {current.ref ? <span className="text-[#857261]">Ερώτηση {current.ref}</span> : null}
          {priorWrong > 0 ? (
            <span className="rounded-full bg-[#fbe6e3] px-3 py-1 text-[#a33a2c]">
              Λάθος {priorWrong} {priorWrong === 1 ? "φορά" : "φορές"} πριν
            </span>
          ) : null}
        </div>

        <h2 className="mt-4 text-[22px] font-semibold leading-snug sm:text-3xl">{current.text}</h2>
        {multi ? <p className="mt-2 text-base font-semibold text-[#c9822f]">Υπάρχουν {current.correct.length} σωστές απαντήσεις — διάλεξέ τες όλες.</p> : null}

        {current.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.image} alt="" className="mt-5 max-h-[45vh] w-auto max-w-full rounded-2xl" />
        ) : null}

        <ul className="mt-6 space-y-3">
          {current.options.map((opt, i) => {
            const isCorrect = current.correct.includes(i);
            const isChosen = chosen.includes(i);
            let cls = "border-black/15 bg-white active:bg-[#f7f4ef]";
            if (!revealed && isChosen) cls = "border-[#c9822f] bg-[#fdf3e6]";
            if (revealed && isCorrect) cls = "border-[#2e8b57] bg-[#e7f5ec]";
            else if (revealed && isChosen) cls = "border-[#c0392b] bg-[#fbe6e3]";
            else if (revealed) cls = "border-black/10 bg-white opacity-60";
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => tap(i)}
                  disabled={revealed}
                  className={`flex w-full items-start gap-4 rounded-2xl border-2 px-4 py-4 text-left text-lg leading-7 transition ${cls}`}
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black/5 text-base font-bold">
                    {revealed && isCorrect ? "✓" : revealed && isChosen ? "✕" : LETTERS[i]}
                  </span>
                  {current.optionImages?.[i] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={current.optionImages[i]} alt={opt} className="max-h-32 w-auto max-w-[70%] rounded-lg" />
                  ) : (
                    <span>{opt}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {revealed ? (
          <div className="mt-6">
            <p className={`text-2xl font-bold ${ok ? "text-[#2e8b57]" : "text-[#c0392b]"}`}>{ok ? "Σωστό! 👍" : "Λάθος — μπαίνει στα λάθη"}</p>
            {current.explanation ? <p className="mt-3 text-lg leading-8 text-[#4f4741]">{current.explanation}</p> : null}
          </div>
        ) : null}

        <div className="fixed inset-x-0 bottom-0 z-10 bg-[#f3efe8]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-8">
          {revealed ? (
            <button type="button" onClick={nextQuestion} className="w-full rounded-2xl bg-[#2c2825] py-4 text-lg font-semibold text-white active:bg-black">
              {round.index + 1 < round.queue.length ? "Επόμενη →" : "Δες το αποτέλεσμα"}
            </button>
          ) : multi ? (
            <button
              type="button"
              onClick={() => check(chosen)}
              disabled={!chosen.length}
              className="w-full rounded-2xl bg-[#c9822f] py-4 text-lg font-semibold text-white disabled:opacity-40"
            >
              Έλεγχος
            </button>
          ) : (
            <p className="py-4 text-center text-base text-[#857261]">Πάτα την απάντηση που πιστεύεις σωστή</p>
          )}
        </div>
      </section>
    );
  }

  // ───────────── End of round ─────────────
  if (round && !current) {
    const total = round.queue.length;
    const pct = Math.round((round.correctCount / total) * 100);
    return (
      <section className="py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">{round.title} · τέλος</p>
        <p className="mt-3 text-6xl font-bold tabular-nums">
          {round.correctCount}
          <span className="text-3xl text-[#857261]"> / {total}</span>
        </p>
        <p className="mt-2 text-xl text-[#5c534c]">
          {round.missed.length === 0 ? "Όλα σωστά! 🎉" : `${pct}% σωστά · ${round.missed.length} λάθη`}
        </p>

        {round.missed.length ? (
          <>
            <h3 className="mt-10 text-xl font-semibold">Αυτές έκανες λάθος</h3>
            <ol className="mt-3 divide-y divide-black/10">
              {round.missed.map((q) => (
                <li key={q.id} className="py-4">
                  <p className="text-lg leading-7">{q.text}</p>
                  <p className="mt-1 text-base font-semibold text-[#2e8b57]">
                    ✓ {q.correct.map((i) => q.options[i]).join(" · ")}
                  </p>
                  {q.optionImages
                    ? q.correct.map((i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={q.optionImages![i]} alt="" className="mt-2 h-20 w-auto rounded-lg" />
                      ))
                    : null}
                </li>
              ))}
            </ol>
          </>
        ) : null}

        <div className="mt-8 space-y-3">
          {round.missed.length ? (
            <button
              type="button"
              onClick={() => start("Ξανά τα λάθη", shuffle(round.missed))}
              className="w-full rounded-2xl bg-[#c0392b] py-4 text-lg font-semibold text-white active:bg-[#a33a2c]"
            >
              Ξαναρώτα μου τα {round.missed.length} λάθη
            </button>
          ) : null}
          <button type="button" onClick={() => setRound(null)} className="w-full rounded-2xl border-2 border-black/15 bg-white py-4 text-lg font-semibold">
            Πίσω στην αρχή
          </button>
        </div>
      </section>
    );
  }

  // ───────────── Home ─────────────
  const roundSize = Math.min(ROUND_SIZE, pool.length);
  const hardShown = showAllHard ? summary.hardest : summary.hardest.slice(0, 25);
  return (
    <section>
      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          <Chip active={!cat} onClick={() => chooseCat(null)}>
            Όλες · {questions.length}
          </Chip>
          {categories.map(([c, n]) => (
            <Chip key={c} active={cat === c} onClick={() => chooseCat(c)}>
              {c} · {n}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-black/10 py-6 sm:grid-cols-4">
        <Stat label="Ερωτήσεις" value={`${pool.length}`} />
        <Stat label="Έχει δει" value={`${summary.seen}`} />
        <Stat label="Επιτυχία" value={summary.accuracy === null ? "—" : `${summary.accuracy}%`} />
        <Stat label="Για επανάληψη" value={`${summary.review.length}`} accent={summary.review.length > 0} />
      </div>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={() => start(cat ?? "Εξάσκηση", weightedPick(pool, stats, roundSize))}
          className="w-full rounded-2xl bg-[#2c2825] px-5 py-5 text-left text-white active:bg-black"
        >
          <span className="block text-xl font-semibold">Εξάσκηση · {roundSize} ερωτήσεις</span>
          <span className="mt-1 block text-base text-white/70">Πρώτα όσες δεν έχεις δει και όσες κάνεις συχνά λάθος</span>
        </button>
        <button
          type="button"
          onClick={() => start("Επανάληψη λαθών", shuffle(summary.review))}
          disabled={!summary.review.length}
          className="w-full rounded-2xl bg-[#c0392b] px-5 py-5 text-left text-white active:bg-[#a33a2c] disabled:bg-black/10 disabled:text-[#857261]"
        >
          <span className="block text-xl font-semibold">Επανάληψη λαθών · {summary.review.length}</span>
          <span className="mt-1 block text-base opacity-80">
            {summary.review.length
              ? `Φεύγουν από τη λίστα όταν τις απαντήσεις σωστά ${MASTER_STREAK} φορές στη σειρά`
              : "Δεν υπάρχουν λάθη για επανάληψη"}
          </span>
        </button>
        {cat ? (
          <button
            type="button"
            onClick={() => start(cat, shuffle(pool))}
            className="w-full rounded-2xl border-2 border-black/15 bg-white px-5 py-5 text-left"
          >
            <span className="block text-xl font-semibold">Όλη η ενότητα · {pool.length}</span>
            <span className="mt-1 block text-base text-[#6b625b]">{cat}, με τυχαία σειρά</span>
          </button>
        ) : null}
      </div>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">Πού κάνει λάθη</h2>
      {summary.hardest.length ? (
        <ol className="mt-3 divide-y divide-black/10">
          {hardShown.map((q) => {
            const s = stats[q.id];
            const mastered = !needsReview(s);
            return (
              <li key={q.id} className="flex items-start gap-4 py-4">
                <span
                  className={`mt-1 shrink-0 rounded-full px-3 py-1 text-sm font-bold tabular-nums ${
                    mastered ? "bg-[#e7f5ec] text-[#2e6b47]" : "bg-[#fbe6e3] text-[#a33a2c]"
                  }`}
                >
                  {s.wrong}/{s.seen}
                </span>
                <div>
                  <p className="text-lg leading-7">{q.text}</p>
                  <p className="mt-1 text-sm text-[#857261]">
                    {mastered ? "✓ Την έμαθε" : `Θέλει ακόμα ${MASTER_STREAK - s.streak} ${MASTER_STREAK - s.streak === 1 ? "σωστή" : "σωστές"} στη σειρά`}
                    {q.category ? ` · ${q.category}` : ""}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-3 text-lg text-[#6b625b]">Ακόμα κανένα λάθος{cat ? " σε αυτή την ενότητα" : ""}. Τα στατιστικά γεμίζουν καθώς απαντάει.</p>
      )}

      {!showAllHard && summary.hardest.length > hardShown.length ? (
        <button type="button" onClick={() => setShowAllHard(true)} className="mt-2 text-base font-semibold text-[#c9822f]">
          Δείξε και τις υπόλοιπες {summary.hardest.length - hardShown.length}
        </button>
      ) : null}

      {summary.answers > 0 ? (
        <button type="button" onClick={resetStats} className="mt-12 text-sm font-semibold text-[#857261] underline underline-offset-4">
          Μηδενισμός στατιστικών
        </button>
      ) : null}
      {byId.size !== questions.length ? <p className="mt-4 text-sm text-[#c0392b]">Προσοχή: διπλά ids στις ερωτήσεις.</p> : null}
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-[#2c2825] text-white" : "bg-[#e9e2d8] text-[#4a3f36] active:bg-[#ddd3c6]"
      }`}
    >
      {children}
    </button>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className={`text-4xl font-bold tabular-nums ${accent ? "text-[#c0392b]" : ""}`}>{value}</p>
      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#857261]">{label}</p>
    </div>
  );
}

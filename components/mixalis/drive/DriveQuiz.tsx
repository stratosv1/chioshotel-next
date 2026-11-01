"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DriveQuestion } from "@/lib/mixalis/drive/questions";
import {
  mergeDocs,
  needsWork,
  recheckDue,
  recordAnswer,
  sanitizeDoc,
  statusOf,
  type ProgressDoc,
  type QStat,
  type Stats,
} from "@/lib/mixalis/drive/progress";

// The practice record is kept on the device (localStorage) and synced to the
// server, so it survives a cleared browser and can be seen from another phone.
const STORE_KEY = "mixalis-drive-v1";
const RESET_KEY = "mixalis-drive-reset-v1";
const API = "/mixalis/api/drive/progress";
/** Wait this long after an answer before syncing, so a burst of answers is one write. */
const SYNC_DELAY_MS = 20_000;
const SET_KEY = "mixalis-drive-set-v1";
/** Questions are studied in packs of 50, in book order. */
const SET_SIZE = 50;
/** The round in progress, so a reload or a locked phone doesn't lose it. */
const ROUND_KEY = "mixalis-drive-round-v1";

type SavedRound = { title: string; ids: string[]; index: number; missed: string[]; correctCount: number };
const ROUND_SIZE = 20;

function readLocal(): ProgressDoc {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    const resetAt = Number(window.localStorage.getItem(RESET_KEY)) || 0;
    return sanitizeDoc({ stats: raw ? JSON.parse(raw) : {}, resetAt }) ?? { stats: {}, resetAt: 0 };
  } catch {
    return { stats: {}, resetAt: 0 };
  }
}

function writeLocal(doc: ProgressDoc) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(doc.stats));
    window.localStorage.setItem(RESET_KEY, String(doc.resetAt || 0));
  } catch {
    // storage blocked (private mode): the server copy still keeps it
  }
}

function fmtDay(t?: number) {
  if (!t) return "";
  const d = new Date(t);
  const today = new Date();
  const y = new Date(today);
  y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "σήμερα";
  if (d.toDateString() === y.toDateString()) return "χθες";
  return d.toLocaleDateString("el-GR", { day: "numeric", month: "short" });
}

/** Pick up to n questions without repeats, favouring unseen and often-missed ones. */
function weightedPick(questions: DriveQuestion[], stats: Stats, n: number): DriveQuestion[] {
  const keyed = questions.map((q) => {
    const s = stats[q.id];
    let w: number;
    if (!s || s.seen === 0) w = 3;
    else if (needsWork(s)) w = (recheckDue(s) || s.streak === 0 ? 4 : 2) + 2 * s.wrong;
    else if (s.learnedAt) w = 1;
    else w = 0.6;
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
  const [sync, setSync] = useState<"idle" | "saving" | "saved" | "offline">("idle");
  const docRef = useRef<ProgressDoc>({ stats: {}, resetAt: 0 });
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [round, setRound] = useState<Round | null>(null);
  const [chosen, setChosen] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [setNo, setSetNo] = useState<number | null>(null);
  const [showAllHard, setShowAllHard] = useState(false);

  const byId = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions]);
  const answering = useRef(false);
  const restored = useRef(false);

  const push = useCallback(async (opts: { reset?: boolean; keepalive?: boolean } = {}) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (!dirty.current && !opts.reset) return;
    dirty.current = false;
    setSync("saving");
    try {
      const res = await fetch(opts.reset ? `${API}?reset=1` : API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docRef.current),
        keepalive: opts.keepalive,
      });
      if (!res.ok) throw new Error(String(res.status));
      setSync("saved");
    } catch {
      dirty.current = true;
      setSync("offline");
    }
  }, []);

  const schedulePush = useCallback(() => {
    dirty.current = true;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void push(), SYNC_DELAY_MS);
  }, [push]);

  const commit = useCallback(
    (doc: ProgressDoc) => {
      docRef.current = doc;
      setStats(doc.stats);
      writeLocal(doc);
    },
    [],
  );

  // Load: device copy first (instant), then merge with the server copy.
  useEffect(() => {
    const local = readLocal();
    commit(local);
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(API, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const server = sanitizeDoc(await res.json()) ?? { stats: {}, resetAt: 0 };
        if (cancelled) return;
        const merged = mergeDocs(docRef.current, server);
        commit(merged);
        const serverBehind = Object.entries(merged.stats).some(([id, st]) => server.stats[id]?.last !== st.last);
        if (serverBehind) {
          dirty.current = true;
          void push();
        } else setSync("saved");
      } catch {
        if (!cancelled) setSync("offline");
      }
    })();
    const onHide = () => {
      if (document.visibilityState === "hidden" && dirty.current) void push({ keepalive: true });
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, [commit, push]);

  useEffect(() => {
    try {
      const savedSet = Number(window.localStorage.getItem(SET_KEY));
      if (savedSet > 0) setSetNo(savedSet);
      const raw = window.localStorage.getItem(ROUND_KEY);
      const saved = raw ? (JSON.parse(raw) as SavedRound) : null;
      if (saved && Array.isArray(saved.ids)) {
        const queue = saved.ids.map((id) => byId.get(id)).filter(Boolean) as DriveQuestion[];
        if (queue.length && saved.index < queue.length) {
          setRound({
            title: saved.title,
            queue,
            index: Math.max(0, saved.index),
            missed: (saved.missed ?? []).map((id) => byId.get(id)).filter(Boolean) as DriveQuestion[],
            correctCount: saved.correctCount ?? 0,
          });
        }
      }
    } catch {
      // ignore
    }
    restored.current = true;
  }, [byId]);

  // Packs of 50 in book order; a short remainder joins the last pack.
  const packs = useMemo(() => {
    const out: { n: number; items: DriveQuestion[]; cats: string[] }[] = [];
    for (let i = 0; i < questions.length; i += SET_SIZE) {
      const items = questions.slice(i, i + SET_SIZE);
      if (out.length && items.length < SET_SIZE / 2) out[out.length - 1].items.push(...items);
      else out.push({ n: out.length + 1, items, cats: [] });
    }
    for (const p of out) p.cats = [...new Set(p.items.map((q) => q.category).filter(Boolean) as string[])];
    return out;
  }, [questions]);

  const packOf = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of packs) for (const q of p.items) m.set(q.id, p.n);
    return m;
  }, [packs]);

  const pack = setNo ? packs.find((p) => p.n === setNo) ?? null : null;
  const pool = pack ? pack.items : questions;

  const choosePack = (n: number | null) => {
    setSetNo(n);
    setShowAllHard(false);
    try {
      if (n) window.localStorage.setItem(SET_KEY, String(n));
      else window.localStorage.removeItem(SET_KEY);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0 });
  };

  const packProgress = (items: DriveQuestion[]) => {
    let seen = 0;
    let good = 0;
    let review = 0;
    for (const q of items) {
      const st = stats[q.id];
      if (!st || st.seen === 0) continue;
      seen++;
      if (needsWork(st)) review++;
      else good++;
    }
    return { seen, good, review };
  };

  const summary = useMemo(() => {
    let seen = 0;
    let answers = 0;
    let wrong = 0;
    const review: DriveQuestion[] = [];
    const learned: DriveQuestion[] = [];
    for (const q of pool) {
      const s = stats[q.id];
      if (!s || s.seen === 0) continue;
      seen++;
      answers += s.seen;
      wrong += s.wrong;
      if (needsWork(s)) review.push(q);
      else if (s.learnedAt) learned.push(q);
    }
    const accuracy = answers ? Math.round(((answers - wrong) / answers) * 100) : null;
    // Still wrong first, then the ones due for their re-check, then the ones waiting for tomorrow.
    const rank = (q: DriveQuestion) => {
      const s = stats[q.id];
      return s.streak === 0 ? 0 : recheckDue(s) ? 1 : 2;
    };
    review.sort((a, b) => rank(a) - rank(b) || stats[b.id].wrong - stats[a.id].wrong);
    learned.sort((a, b) => (stats[b.id].learnedAt ?? 0) - (stats[a.id].learnedAt ?? 0));
    const dueNow = review.filter((q) => rank(q) < 2).length;
    return { seen, answers, accuracy, review, learned, dueNow };
  }, [pool, stats]);

  const start = useCallback((title: string, queue: DriveQuestion[]) => {
    if (!queue.length) return;
    answering.current = false;
    setRound({ title, queue, index: 0, missed: [], correctCount: 0 });
    setChosen([]);
    setRevealed(false);
    window.scrollTo({ top: 0 });
  }, []);

  const current = round && round.index < round.queue.length ? round.queue[round.index] : null;
  const multi = !!current && current.correct.length > 1;
  // Answers are shown in a fresh random order every time, so the position can't be memorised.
  const order = useMemo(
    () => (current ? shuffle(current.options.map((_, i) => i)) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current?.id, round?.index, round?.queue],
  );

  // Keep the round in progress on the device; clear it once it is finished or closed.
  useEffect(() => {
    if (!restored.current) return;
    try {
      if (round && round.index < round.queue.length) {
        const saved: SavedRound = {
          title: round.title,
          ids: round.queue.map((q) => q.id),
          index: round.index + (revealed ? 1 : 0),
          missed: round.missed.map((q) => q.id),
          correctCount: round.correctCount,
        };
        window.localStorage.setItem(ROUND_KEY, JSON.stringify(saved));
      } else {
        window.localStorage.removeItem(ROUND_KEY);
      }
    } catch {
      // ignore
    }
  }, [round, revealed]);

  // Warm up the next question's pictures so they appear instantly.
  useEffect(() => {
    if (!round) return;
    const next = round.queue[round.index + 1];
    for (const src of [next?.image, ...(next?.optionImages ?? [])]) {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    }
  }, [round]);

  const check = (picked: number[]) => {
    if (!current || !round || revealed || answering.current) return;
    answering.current = true;
    const ok = picked.length === current.correct.length && picked.every((i) => current.correct.includes(i));
    const doc = docRef.current;
    commit({ ...doc, stats: { ...doc.stats, [current.id]: recordAnswer(doc.stats[current.id], ok) } });
    schedulePush();
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
    answering.current = false;
    setRound({ ...round, index: round.index + 1 });
    setChosen([]);
    setRevealed(false);
    window.scrollTo({ top: 0 });
  };

  /** "Τέλος" in the middle of a round: show the results of what was answered so far. */
  const finishEarly = () => {
    if (!round) return;
    const answered = round.index + (revealed ? 1 : 0);
    answering.current = false;
    setChosen([]);
    setRevealed(false);
    if (answered === 0) {
      setRound(null);
      return;
    }
    setRound({ ...round, queue: round.queue.slice(0, answered), index: answered });
    window.scrollTo({ top: 0 });
  };

  const resetStats = () => {
    if (!window.confirm("Σίγουρα; Θα σβηστούν όλα τα στατιστικά και η λίστα «Θέλουν δουλειά», και σε όλες τις συσκευές.")) return;
    commit({ stats: {}, resetAt: Date.now() });
    void push({ reset: true });
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
            <button type="button" onClick={finishEarly} className="py-2 pr-3 hover:text-[#2c2825]">
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
          {order.map((i, pos) => {
            const opt = current.options[i];
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
                    {revealed && isCorrect ? "✓" : revealed && isChosen ? "✕" : LETTERS[pos]}
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
            <p className={`text-2xl font-bold ${ok ? "text-[#2e8b57]" : "text-[#c0392b]"}`}>{ok ? "Σωστό! 👍" : "Λάθος"}</p>
            <p className="mt-1 text-base font-semibold text-[#6b625b]">
              {!ok
                ? "Μπαίνει στις «Θέλουν δουλειά» και θα ξαναρωτηθεί."
                : s?.learnedAt && s.last === s.learnedAt
                  ? "✓ Την έμαθε! Βγαίνει από τις «Θέλουν δουλειά»."
                  : s && s.wrong > 0 && !s.learnedAt
                    ? `Μένει στις «Θέλουν δουλειά»: θα ξαναρωτηθεί ${s.fixAt && Date.now() - s.fixAt < 60_000 ? "αύριο" : "σε άλλη μέρα"} για να φανεί αν την έμαθε.`
                    : null}
            </p>
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
            <p className="mt-1 text-base text-[#6b625b]">Γράφτηκαν στις «Θέλουν δουλειά» του πακέτου τους.</p>
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
          <button
            type="button"
            onClick={() => {
              setRound(null);
              void push();
            }}
            className="w-full rounded-2xl border-2 border-black/15 bg-white py-4 text-lg font-semibold"
          >
            Πίσω στην αρχή
          </button>
        </div>
      </section>
    );
  }

  // ───────────── Home ─────────────
  const roundSize = Math.min(ROUND_SIZE, pool.length);
  const workShown = showAllHard ? summary.review : summary.review.slice(0, 30);
  return (
    <section>
      {pack ? (
        <div className="pb-4">
          <button type="button" onClick={() => choosePack(null)} className="py-1 text-sm font-semibold text-[#857261]">
            ← Όλα τα πακέτα
          </button>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Πακέτο {pack.n} <span className="text-[#857261]">από {packs.length}</span>
          </h2>
          <p className="mt-1 text-base text-[#6b625b]">{pack.cats.join(" · ")}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-black/10 py-6 sm:grid-cols-4">
        <Stat label={pack ? "Στο πακέτο" : "Ερωτήσεις"} value={`${pool.length}`} />
        <Stat label="Έχει δει" value={`${summary.seen}`} />
        <Stat label="Επιτυχία" value={summary.accuracy === null ? "—" : `${summary.accuracy}%`} />
        <Stat label="Θέλουν δουλειά" value={`${summary.review.length}`} accent={summary.review.length > 0} />
      </div>

      <div className="mt-8 space-y-3">
        {pack ? (
          <button
            type="button"
            onClick={() => start(`Πακέτο ${pack.n}`, shuffle(pack.items))}
            className="w-full rounded-2xl bg-[#2c2825] px-5 py-5 text-left text-white active:bg-black"
          >
            <span className="block text-xl font-semibold">Ξεκίνα το πακέτο · {pack.items.length} ερωτήσεις</span>
            <span className="mt-1 block text-base text-white/70">Όλες με τυχαία σειρά, και στο τέλος ξανά όσες έκανες λάθος</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => start("Εξάσκηση", weightedPick(pool, stats, roundSize))}
            className="w-full rounded-2xl bg-[#2c2825] px-5 py-5 text-left text-white active:bg-black"
          >
            <span className="block text-xl font-semibold">Γρήγορη εξάσκηση · {roundSize} ερωτήσεις</span>
            <span className="mt-1 block text-base text-white/70">Από όλα τα πακέτα, πρώτα όσες κάνεις συχνά λάθος</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => start(pack ? `Θέλουν δουλειά · πακέτο ${pack.n}` : "Θέλουν δουλειά", summary.review)}
          disabled={!summary.review.length}
          className="w-full rounded-2xl bg-[#c0392b] px-5 py-5 text-left text-white active:bg-[#a33a2c] disabled:bg-black/10 disabled:text-[#857261]"
        >
          <span className="block text-xl font-semibold">
            Θέλουν δουλειά{pack ? " · πακέτο" : ""} · {summary.review.length}
          </span>
          <span className="mt-1 block text-base opacity-80">
            {summary.review.length
              ? "Όσες έκανε λάθος. Φεύγουν μόνο όταν τις απαντήσει σωστά και ξανά σωστά σε άλλη μέρα"
              : "Καμία ερώτηση δεν θέλει δουλειά"}
          </span>
        </button>
      </div>

      {!pack ? (
        <>
          <h2 className="mt-12 text-2xl font-semibold tracking-tight">Πακέτα των {SET_SIZE}</h2>
          <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {packs.map((p) => {
              const pr = packProgress(p.items);
              const total = p.items.length;
              const done = pr.good === total;
              return (
                <li key={p.n}>
                  <button
                    type="button"
                    onClick={() => choosePack(p.n)}
                    className={`flex h-full w-full flex-col rounded-2xl px-4 py-4 text-left active:opacity-80 ${
                      done ? "bg-[#e7f5ec]" : "bg-white"
                    }`}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-lg font-semibold">Πακέτο {p.n}</span>
                      {done ? <span className="text-lg">✓</span> : null}
                    </span>
                    <span className="mt-1 line-clamp-2 text-sm leading-5 text-[#857261]">{p.cats.join(" · ")}</span>
                    <span className="mt-auto block pt-3">
                      <span className="flex h-1.5 overflow-hidden rounded-full bg-black/10">
                        <span className="bg-[#2e8b57]" style={{ width: `${(pr.good / total) * 100}%` }} />
                        <span className="bg-[#c0392b]" style={{ width: `${(pr.review / total) * 100}%` }} />
                      </span>
                      <span className="mt-1.5 block text-sm tabular-nums text-[#6b625b]">
                        {pr.seen === 0 ? `${total} ερωτήσεις` : `${pr.good}/${total} εντάξει`}
                        {pr.review ? <span className="font-semibold text-[#c0392b]"> · {pr.review} θέλουν δουλειά</span> : null}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </>
      ) : null}

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">
        Θέλουν δουλειά{pack ? ` · πακέτο ${pack.n}` : ""} <span className="text-[#c0392b]">{summary.review.length || ""}</span>
      </h2>
      {summary.review.length ? (
        <ol className="mt-3 divide-y divide-black/10">
          {workShown.map((q) => (
            <WorkItem key={q.id} q={q} s={stats[q.id]} showPack={!pack ? packOf.get(q.id) : undefined} />
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-lg text-[#6b625b]">
          {summary.seen ? "Καμία. Όσες κάνει λάθος θα γράφονται εδώ." : "Ακόμα τίποτα. Όσες κάνει λάθος θα γράφονται εδώ."}
        </p>
      )}
      {!showAllHard && summary.review.length > workShown.length ? (
        <button type="button" onClick={() => setShowAllHard(true)} className="mt-2 text-base font-semibold text-[#c9822f]">
          Δείξε και τις υπόλοιπες {summary.review.length - workShown.length}
        </button>
      ) : null}

      {summary.learned.length ? (
        <details className="mt-10">
          <summary className="cursor-pointer text-xl font-semibold text-[#2e6b47]">
            Τις έμαθε · {summary.learned.length} <span className="text-base font-normal text-[#857261]">(ήταν λάθος, τώρα σωστές)</span>
          </summary>
          <ol className="mt-2 divide-y divide-black/10">
            {summary.learned.map((q) => (
              <WorkItem key={q.id} q={q} s={stats[q.id]} showPack={!pack ? packOf.get(q.id) : undefined} />
            ))}
          </ol>
        </details>
      ) : null}

      <p className="mt-10 text-sm text-[#857261]">
        {sync === "saving"
          ? "Αποθήκευση…"
          : sync === "saved"
            ? "✓ Αποθηκευμένα και στον server"
            : sync === "offline"
              ? "Χωρίς σύνδεση: κρατιούνται στο κινητό και θα ανέβουν μόλις υπάρξει ίντερνετ"
              : ""}
      </p>

      {summary.answers > 0 ? (
        <button type="button" onClick={resetStats} className="mt-12 text-sm font-semibold text-[#857261] underline underline-offset-4">
          Μηδενισμός στατιστικών
        </button>
      ) : null}
      {byId.size !== questions.length ? <p className="mt-4 text-sm text-[#c0392b]">Προσοχή: διπλά ids στις ερωτήσεις.</p> : null}
    </section>
  );
}

function WorkItem({ q, s, showPack }: { q: DriveQuestion; s: QStat; showPack?: number }) {
  const st = statusOf(s);
  const due = recheckDue(s);
  const badge =
    st === "learned"
      ? { cls: "bg-[#e7f5ec] text-[#2e6b47]", text: `✓ Την έμαθε ${fmtDay(s.learnedAt)}` }
      : st === "recheck"
        ? due
          ? { cls: "bg-[#fdf3e6] text-[#8a5a22]", text: "Ώρα για επανέλεγχο" }
          : { cls: "bg-[#fdf3e6] text-[#8a5a22]", text: `Σωστή ${fmtDay(s.fixAt)} · επανέλεγχος άλλη μέρα` }
        : { cls: "bg-[#fbe6e3] text-[#a33a2c]", text: `Λάθος ${fmtDay(s.wrongAt)}` };
  return (
    <li className="py-4">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        <span className={`rounded-full px-3 py-1 ${badge.cls}`}>{badge.text}</span>
        <span className="tabular-nums text-[#857261]">
          λάθος {s.wrong} από {s.seen}
          {showPack ? ` · πακέτο ${showPack}` : ""}
        </span>
      </div>
      <p className="mt-2 text-lg leading-7">{q.text}</p>
      <p className="mt-1 text-base font-semibold text-[#2e8b57]">✓ {q.correct.map((i) => q.options[i]).join(" · ")}</p>
      {q.optionImages
        ? q.correct.map((i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={q.optionImages![i]} alt="" className="mt-2 h-16 w-auto rounded-lg" />
          ))
        : null}
    </li>
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

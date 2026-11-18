"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FINAL, K2_SECTIONS, MINI, TESTS, TRAPS, type Q } from "@/lib/sideris/math-k2-quiz";
import { isReduced, parseFrac, same } from "./frac";
import { MathText } from "./MathText";

type Ans = number | boolean | string | null;
type Verdict = { ok: boolean; note?: string };

function grade(q: Q, a: Ans): Verdict {
  if (a === null || a === "") return { ok: false, note: "Δεν απάντησες." };
  if (q.kind === "mc" || q.kind === "tf") return { ok: a === q.answer };
  const got = parseFrac(String(a));
  if (!got) return { ok: false, note: "Γράψε την απάντηση σαν 3/4, 2 1/3 ή 5." };
  const want = parseFrac(q.answer)!;
  if (!same(got, want)) return { ok: false };
  if (!isReduced(got)) return { ok: false, note: "Σωστή τιμή, αλλά δεν το απλοποίησες! Στο διαγώνισμα χάνεις μονάδες." };
  return { ok: true };
}

// ───────────────────────────── αποθήκευση προόδου ─────────────────────────────
const KEY = (id: string) => `sideris:math:k2:${id}`;
const EVT = "sideris-math-progress";
function saveScore(id: string, pct: number) {
  try {
    const prev = JSON.parse(localStorage.getItem(KEY(id)) || "null") as { best: number } | null;
    localStorage.setItem(KEY(id), JSON.stringify({ best: Math.max(pct, prev?.best ?? 0), last: pct }));
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* χωρίς αποθήκευση, δεν πειράζει */
  }
}
function readScore(id: string): number | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY(id)) || "null") as { best: number } | null;
    return v ? v.best : null;
  } catch {
    return null;
  }
}

// ───────────────────────────── εμφάνιση στο scroll ─────────────────────────────
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return setIn(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`sx-reveal ${inView ? "is-in" : ""}`}>
      {children}
    </div>
  );
}

// ───────────────────────────── μία ερώτηση ─────────────────────────────
function AnswerInput({ q, value, onChange, locked, onEnter }: { q: Q; value: Ans; onChange: (a: Ans) => void; locked: boolean; onEnter?: () => void }) {
  if (q.kind === "mc") {
    return (
      <div className="flex flex-wrap gap-2">
        {q.choices.map((c, i) => (
          <button
            key={i}
            type="button"
            disabled={locked}
            onClick={() => onChange(i)}
            className={`min-w-[3rem] rounded-xl border-2 px-3 py-2 text-base font-semibold transition ${
              value === i ? "border-[#2f4f9a] bg-[#e8edf9] text-[#2f4f9a]" : "border-black/10 bg-white hover:border-[#2f4f9a]/40"
            } disabled:cursor-default`}
          >
            <MathText text={c} />
          </button>
        ))}
      </div>
    );
  }
  if (q.kind === "tf") {
    return (
      <div className="flex gap-2">
        {[
          [true, "Σωστό"],
          [false, "Λάθος"],
        ].map(([v, label]) => (
          <button
            key={String(v)}
            type="button"
            disabled={locked}
            onClick={() => onChange(v as boolean)}
            className={`rounded-xl border-2 px-4 py-2 font-semibold transition ${
              value === v ? "border-[#2f4f9a] bg-[#e8edf9] text-[#2f4f9a]" : "border-black/10 bg-white hover:border-[#2f4f9a]/40"
            }`}
          >
            {label as string}
          </button>
        ))}
      </div>
    );
  }
  return (
    <input
      type="text"
      inputMode="text"
      autoComplete="off"
      disabled={locked}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
      placeholder="π.χ. 3/4 ή 2 1/3"
      className="w-40 rounded-xl border-2 border-black/15 bg-white px-3 py-2 text-lg font-semibold text-[#1d5a8c] outline-none focus:border-[#2f4f9a]"
    />
  );
}

function Feedback({ q, v }: { q: Q; v: Verdict }) {
  const right = q.kind === "mc" ? q.choices[q.answer] : q.kind === "tf" ? (q.answer ? "Σωστό" : "Λάθος") : q.answer;
  return (
    <div className={`sx-pop mt-3 rounded-xl p-3 text-[15px] leading-7 ${v.ok ? "bg-[#e7f3e4] text-[#24522a]" : "bg-[#fdf1f0] text-[#7a2626]"}`}>
      <p className="font-bold">
        {v.ok ? (
          <>
            <span className="sx-bounce">✅</span> Σωστά!
          </>
        ) : (
          <>
            ❌ {v.note ?? "Όχι ακριβώς."} Σωστή απάντηση: <MathText text={right.includes("{") ? right : right.replace(/^(\d+)\/(\d+)$/, "{$1/$2}")} />
          </>
        )}
      </p>
      <p className="mt-1">
        💡 <MathText text={q.why} />
      </p>
    </div>
  );
}

function PracticeCard({ q, n, onResult }: { q: Q; n: number; onResult: (ok: boolean) => void }) {
  const [a, setA] = useState<Ans>(null);
  const [v, setV] = useState<Verdict | null>(null);
  const [shake, setShake] = useState(0);
  const check = () => {
    const r = grade(q, a);
    setV(r);
    if (!r.ok) setShake((s) => s + 1);
    onResult(r.ok);
  };
  return (
    <div key={shake} className={`rounded-2xl border border-black/10 bg-white p-4 ${shake && v && !v.ok ? "sx-shake" : ""}`}>
      <p className="mb-3 text-[17px] font-medium">
        <span className="mr-2 font-bold text-[#2f4f9a]">{n}.</span>
        <MathText text={q.q} />
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <AnswerInput q={q} value={a} onChange={(x) => (setA(x), setV(null))} locked={!!v?.ok} onEnter={check} />
        {!v?.ok ? (
          <button type="button" onClick={check} className="rounded-xl bg-[#2f4f9a] px-4 py-2 font-semibold text-white transition hover:opacity-90">
            Έλεγχος
          </button>
        ) : null}
      </div>
      {v ? <Feedback q={q} v={v} /> : null}
    </div>
  );
}

export function MiniQuiz({ id }: { id: string }) {
  const qs = MINI[id] ?? [];
  const [done, setDone] = useState<Record<string, boolean>>({});
  const score = Object.values(done).filter(Boolean).length;
  return (
    <div className="rounded-3xl border-2 border-[#2f4f9a]/20 bg-gradient-to-br from-[#eef2fb] to-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-[#2f4f9a]">
          <span className="sx-float">⚡</span> Γρήγορο quiz: το κατάλαβες;
        </h3>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#2f4f9a] shadow-sm">
          {score}/{qs.length} σωστά {score === qs.length ? "🎉" : ""}
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

// ───────────────────────────── τεστ με βαθμό ─────────────────────────────
function message(pct: number) {
  if (pct >= 90) return "Άριστα! Είσαι έτοιμος γι' αυτό 💪";
  if (pct >= 70) return "Πολύ καλά! Ξαναδές μόνο τα λάθη σου 👇";
  if (pct >= 50) return "Καλή βάση. Ξαναδιάβασε τη θεωρία και τις παγίδες και ξαναδοκίμασε.";
  return "Ξαναδιάβασε την ενότητα, κάνε τα quiz και ξαναπροσπάθησε. Θα τα καταφέρεις!";
}

function TestRunner({ id, groups, outOf, timed }: { id: string; groups: { title?: string; questions: Q[] }[]; outOf: number; timed?: boolean }) {
  const all = groups.flatMap((g) => g.questions);
  const [answers, setAnswers] = useState<Record<string, Ans>>({});
  const [submitted, setSubmitted] = useState(false);
  const [round, setRound] = useState(0);
  const [start, setStart] = useState<number | null>(timed ? null : 0);
  const [now, setNow] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => setBest(readScore(id)), [id, submitted]);
  useEffect(() => {
    if (!timed || !start || submitted) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [timed, start, submitted]);

  const totalPts = all.reduce((s, q) => s + (q.pts ?? 1), 0);
  const verdicts = Object.fromEntries(all.map((q) => [q.id, grade(q, answers[q.id] ?? null)]));
  const gotPts = all.reduce((s, q) => s + (verdicts[q.id].ok ? (q.pts ?? 1) : 0), 0);
  const mark = Math.round((gotPts / totalPts) * outOf * 10) / 10;
  const pct = Math.round((gotPts / totalPts) * 100);
  const answered = all.filter((q) => answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== "").length;
  const elapsed = start ? Math.floor(((submitted ? now : now || Date.now()) - start) / 1000) : 0;

  const submit = () => {
    setNow(Date.now());
    setSubmitted(true);
    saveScore(id, pct);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setRound((r) => r + 1);
    if (timed) setStart(null);
  };

  if (timed && start === null) {
    return (
      <div className="rounded-2xl bg-white p-5 text-center">
        <p className="text-[15px] leading-7 text-[#4d4138]">
          {all.length} ερωτήσεις, βαθμός στα {outOf}. Προτείνω: λύσε στο τετράδιο σαν να είσαι στην τάξη (45′) και μετά γράψε τις
          απαντήσεις εδώ.
        </p>
        {best !== null ? <p className="mt-2 text-sm text-[#857a70]">Καλύτερη προσπάθεια μέχρι τώρα: {Math.round((best / 100) * outOf * 10) / 10}/{outOf}</p> : null}
        <button
          type="button"
          onClick={() => {
            setStart(Date.now());
            setNow(Date.now());
          }}
          className="mt-4 rounded-2xl bg-[#b33a3a] px-6 py-3 text-lg font-bold text-white shadow-md transition hover:scale-[1.02]"
        >
          ▶ Ξεκίνα το διαγώνισμα
        </button>
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-24 space-y-4" key={round}>
      {submitted ? (
        <div className={`sx-pop rounded-2xl p-5 text-center ${pct >= 70 ? "bg-[#e7f3e4]" : pct >= 50 ? "bg-[#fff4e0]" : "bg-[#fdf1f0]"}`}>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#6b625b]">Αποτέλεσμα</p>
          <p className="sx-bounce mt-1 text-5xl font-black text-[#2c2825]">
            {outOf === 20 ? mark : gotPts}
            <span className="text-2xl font-bold text-[#857a70]">/{outOf === 20 ? 20 : totalPts}</span>
          </p>
          <p className="mt-2 text-lg font-semibold">{message(pct)}</p>
          {timed ? <p className="mt-1 text-sm text-[#6b625b]">Χρόνος: {Math.floor(elapsed / 60)}′ {elapsed % 60}″</p> : null}
          {groups.length > 1 ? (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {groups.map((g) => {
                const p = g.questions.reduce((s, q) => s + (verdicts[q.id].ok ? (q.pts ?? 1) : 0), 0);
                const t = g.questions.reduce((s, q) => s + (q.pts ?? 1), 0);
                return (
                  <span key={g.title} className="rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-sm">
                    {g.title}: {p}/{t}
                  </span>
                );
              })}
            </div>
          ) : null}
          <button type="button" onClick={reset} className="mt-4 rounded-xl border border-black/15 bg-white px-4 py-2 font-semibold transition hover:bg-[#f7f4ef]">
            ↻ Ξανά από την αρχή
          </button>
        </div>
      ) : timed ? (
        <div className="sticky top-14 z-10 flex items-center justify-between rounded-2xl bg-[#2c2825] px-4 py-2 text-white shadow-md">
          <span className="font-semibold">⏱ {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")} / 45:00</span>
          <span className="text-sm">
            {answered}/{all.length} απαντήθηκαν
          </span>
        </div>
      ) : null}

      {groups.map((g, gi) => (
        <div key={gi} className="space-y-3">
          {g.title ? <h4 className="pt-2 text-base font-bold text-[#7a2626]">{g.title}</h4> : null}
          {g.questions.map((q) => {
            const n = all.indexOf(q) + 1;
            const v = verdicts[q.id];
            return (
              <div
                key={q.id}
                className={`rounded-2xl border-2 bg-white p-4 transition ${
                  submitted ? (v.ok ? "border-[#7fbf7a]" : "border-[#e39a9a]") : "border-black/10"
                }`}
              >
                <p className="mb-3 text-[17px] font-medium">
                  <span className="mr-2 font-bold text-[#7a2626]">{n}.</span>
                  <MathText text={q.q} />
                  {q.pts ? <span className="ml-2 text-xs font-semibold text-[#857a70]">({q.pts} μον.)</span> : null}
                </p>
                <AnswerInput q={q} value={answers[q.id] ?? null} onChange={(a) => setAnswers((s) => ({ ...s, [q.id]: a }))} locked={submitted} />
                {submitted ? <Feedback q={q} v={v} /> : null}
              </div>
            );
          })}
        </div>
      ))}

      {!submitted ? (
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={submit} className="rounded-2xl bg-[#7a2626] px-6 py-3 font-bold text-white shadow-md transition hover:opacity-90">
            Παράδοση γραπτού ✓
          </button>
          <span className="text-sm text-[#857a70]">
            Απάντησες {answered}/{all.length}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export function SectionTest({ id }: { id: string }) {
  const sec = K2_SECTIONS.find((s) => s.id === id);
  return (
    <div className="rounded-3xl border-2 border-[#7a2626]/25 bg-gradient-to-br from-[#fdf3ee] to-white p-5 shadow-sm sm:p-6">
      <h3 className="mb-1 text-xl font-bold text-[#7a2626]">📝 Τεστάκι {id.replace("-", ".")}: {sec?.title}</h3>
      <p className="mb-4 text-sm text-[#6b625b]">8 ερωτήσεις. Απάντησε σε όλες και πάτα «Παράδοση». Στόχος: 7/8 και πάνω.</p>
      <TestRunner id={id} groups={[{ questions: TESTS[id] ?? [] }]} outOf={(TESTS[id] ?? []).length} />
    </div>
  );
}

export function FinalTest() {
  return <TestRunner id="final" groups={FINAL} outOf={20} timed />;
}

// ───────────────────────────── παγίδες ─────────────────────────────
function TrapCard({ t }: { t: (typeof TRAPS)[string][number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border-2 border-[#d64545]/30 bg-white p-4">
      <p className="text-[16px] leading-8">
        <span className="mr-2 rounded-md bg-[#fdecec] px-2 py-0.5 text-sm font-bold text-[#b33a3a]">✗ ΛΑΘΟΣ</span>
        <span className="text-[#9b2c2c] decoration-[#d64545] decoration-2 [text-decoration-line:line-through]">
          <MathText text={t.wrong} />
        </span>
      </p>
      {open ? (
        <div className="sx-pop mt-2 space-y-1">
          <p className="text-[16px] leading-8">
            <span className="mr-2 rounded-md bg-[#e7f3e4] px-2 py-0.5 text-sm font-bold text-[#24522a]">✓ ΣΩΣΤΟ</span>
            <span className="font-semibold text-[#24522a]">
              <MathText text={t.right} />
            </span>
          </p>
          <p className="text-[15px] text-[#4d4138]">
            👉 <MathText text={t.why} />
          </p>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="mt-2 rounded-xl bg-[#b33a3a] px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90">
          Πού είναι το λάθος;
        </button>
      )}
    </div>
  );
}

export function Traps({ id }: { id: string }) {
  return (
    <div className="rounded-3xl border-2 border-[#d64545]/40 bg-[repeating-linear-gradient(135deg,#fff8f6_0_14px,#fff1ee_14px_28px)] p-5 shadow-sm sm:p-6">
      <h3 className="mb-3 text-lg font-black uppercase tracking-[0.08em] text-[#b33a3a]">
        <span className="sx-float">⚠️</span> Προσοχή παγίδα!
      </h3>
      <div className="space-y-3">
        {(TRAPS[id] ?? []).map((t, i) => (
          <TrapCard key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────── πρόοδος ─────────────────────────────
export function PrepTracker() {
  const [scores, setScores] = useState<Record<string, number | null>>({});
  useEffect(() => {
    const load = () => setScores(Object.fromEntries([...K2_SECTIONS.map((s) => s.id), "final"].map((id) => [id, readScore(id)])));
    load();
    window.addEventListener(EVT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(EVT, load);
      window.removeEventListener("storage", load);
    };
  }, []);
  const items = [...K2_SECTIONS.map((s) => ({ id: s.id, label: `${s.id.replace("-", ".")} ${s.title}`, href: `#${s.id}` })), { id: "final", label: "🏁 Τελικό διαγώνισμα", href: "#diagonisma" }];
  const ready = items.filter((i) => (scores[i.id] ?? 0) >= 80).length;
  const pct = Math.round((ready / items.length) * 100);
  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-bold">Η ετοιμότητά σου</p>
        <p className="text-sm font-semibold text-[#3d6b3a]">
          {ready}/{items.length} τεστ με 80%+
        </p>
      </div>
      <div className="mb-4 h-3 overflow-hidden rounded-full bg-[#ece4da]">
        <div className="sx-seg h-full rounded-full bg-gradient-to-r from-[#e2b26a] to-[#3d6b3a]" style={{ width: `${pct}%` }} />
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((i) => {
          const s = scores[i.id];
          return (
            <li key={i.id}>
              <a href={i.href} className="flex items-center justify-between rounded-xl border border-black/10 px-3 py-2 text-sm transition hover:bg-[#f7f4ef]">
                <span className="font-medium">{i.label}</span>
                <span className={`font-bold ${s === null || s === undefined ? "text-[#b8aea4]" : s >= 80 ? "text-[#3d6b3a]" : "text-[#c96a2b]"}`}>
                  {s === null || s === undefined ? "—" : `${s}%`} {s !== null && s !== undefined && s >= 80 ? "✓" : ""}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

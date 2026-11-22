"use client";

import { useRef, useState } from "react";
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
  if (a === null || a === "") return { ok: false, note: "Δεν απάντησες ακόμα." };
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
          <>✅ Μπράβο, σωστά!</>
        ) : (
          <>
            🙂 Σχεδόν! {note ?? ""} Η σωστή απάντηση είναι: <MathText text={rightText(q)} />
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
        <h3 className="text-lg font-bold text-[#6b3fa0]">⚡ Τεστάκι: το κατάλαβες;</h3>
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
  const [only, setOnly] = useState<string[] | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const verdicts = Object.fromEntries(all.map((q) => [q.id, grade(q, answers[q.id] ?? null)]));
  const missed = all.filter((q) => !verdicts[q.id].ok).map((q) => q.id);
  const shown = (q: PQ) => !only || only.includes(q.id);
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
            {mark >= 18 ? "Άριστα, Σιδέρη! 💪" : mark >= 14 ? "Πολύ καλά! Δες τι έχασες 👇" : "Καλή αρχή! Ξαναδές τη φωτοτυπία και ξαναπροσπάθησε."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {missed.length ? (
              <button
                type="button"
                onClick={() => {
                  setOnly(missed);
                  setAnswers((a) => Object.fromEntries(Object.entries(a).filter(([k]) => !missed.includes(k))));
                  setSubmitted(false);
                  setRound((r) => r + 1);
                }}
                className="min-h-[44px] rounded-xl bg-[#6b3fa0] px-4 py-2 font-semibold text-white transition hover:opacity-90"
              >
                🔁 Ξαναρώτα μόνο όσα έχασα ({missed.length})
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setOnly(null);
                setSubmitted(false);
                setRound((r) => r + 1);
              }}
              className="min-h-[44px] rounded-xl border border-black/15 bg-white px-4 py-2 font-semibold transition hover:bg-[#f7f4ef]"
            >
              ↻ Όλο από την αρχή
            </button>
          </div>
        </div>
      ) : null}

      {only && !submitted ? (
        <p className="rounded-2xl bg-[#f1eafa] px-4 py-3 font-semibold text-[#55307f]">Ξαναδοκιμάζεις μόνο τις {only.length} που έχασες. Τα σωστά σου μένουν!</p>
      ) : null}
      {FINAL.filter((g) => g.questions.some(shown)).map((g) => (
        <div key={g.title} className="space-y-3">
          <h4 className="pt-2 text-base font-bold text-[#6b3fa0]">{g.title}</h4>
          {g.questions.filter(shown).map((q) => {
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


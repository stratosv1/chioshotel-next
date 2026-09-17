"use client";

import { useState } from "react";
import type { SavvalasExerciseSolution } from "@/lib/mixalis/savvalas-exercise-solver";

type SolverState = {
  busy: boolean;
  error: string;
  solution: SavvalasExerciseSolution | null;
};

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2 pl-5 text-[15px] leading-7 text-slate-700 marker:text-[#7c684f] sm:text-base">
      {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
    </ul>
  );
}

export default function SavvalasExerciseSolver({
  subchapterId,
  savvalasFrom,
  savvalasTo,
  disabled,
}: {
  subchapterId: string;
  savvalasFrom: string;
  savvalasTo: string;
  disabled: boolean;
}) {
  const [exerciseIdentifier, setExerciseIdentifier] = useState("");
  const [state, setState] = useState<SolverState>({ busy: false, error: "", solution: null });

  async function solveExercise() {
    const normalized = exerciseIdentifier.trim();
    if (!normalized) {
      setState({ busy: false, error: "Γράψε πρώτα τον αριθμό της άσκησης.", solution: null });
      return;
    }

    setState({ busy: true, error: "", solution: null });
    try {
      const response = await fetch(`/mixalis/api/exercises/${subchapterId}/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseIdentifier: normalized,
          savvalasFrom: Number(savvalasFrom),
          savvalasTo: Number(savvalasTo),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Η επίλυση της άσκησης απέτυχε.");
      setState({ busy: false, error: "", solution: payload.solution as SavvalasExerciseSolution });
    } catch (error) {
      setState({
        busy: false,
        error: error instanceof Error ? error.message : "Η επίλυση της άσκησης απέτυχε.",
        solution: null,
      });
    }
  }

  const solution = state.solution;

  return (
    <section className="rounded-2xl border border-[#dac9b2] bg-[#fffaf3] p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#856d51]">Συγκεκριμένη άσκηση Σαββάλα</p>
          <h4 className="mt-1 text-lg font-bold text-[#352e28]">Λύση και εξήγηση για μαθητή Β΄ Λυκείου</h4>
          <p className="mt-1 text-sm leading-6 text-[#6d6257]">
            Γράψε το αναγνωριστικό ακριβώς όπως φαίνεται στο βιβλίο. Θα σταλεί στο OpenAI API μόνο μαζί με τις σελίδες αυτού του υποκεφαλαίου.
          </p>
        </div>
        <div className="grid shrink-0 gap-2 sm:grid-cols-[minmax(0,12rem)_auto]">
          <label className="text-sm font-semibold text-[#5f5348]">
            Αριθμός άσκησης
            <input
              type="text"
              autoComplete="off"
              placeholder="π.χ. 3.14"
              value={exerciseIdentifier}
              onChange={(event) => setExerciseIdentifier(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !disabled && !state.busy) void solveExercise();
              }}
              className="mt-1 min-h-12 w-full rounded-xl border border-[#bda98f] bg-white px-4 text-lg font-bold text-[#2c2825] outline-none transition focus:border-[#6f5a42] focus:ring-2 focus:ring-[#d9c5aa]"
            />
          </label>
          <button
            type="button"
            disabled={disabled || state.busy || !exerciseIdentifier.trim()}
            onClick={() => void solveExercise()}
            className="min-h-12 self-end rounded-xl bg-[#6b533b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#59432f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b533b] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {state.busy ? "Διαβάζω και λύνω…" : "Λύσε την άσκηση"}
          </button>
        </div>
      </div>

      {disabled ? (
        <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm text-[#776b5f]">
          Συμπλήρωσε πρώτα τις ORIGINAL PDF σελίδες του Σαββάλα. Θα αποθηκευτούν πριν αρχίσει η επίλυση.
        </p>
      ) : null}
      {state.busy ? (
        <p className="mt-4 rounded-xl border border-[#dac9b2] bg-white px-4 py-3 text-sm font-semibold text-[#6b533b]" role="status">
          Εντοπίζω την ακριβή άσκηση και το OpenAI API ετοιμάζει τη λύση βήμα προς βήμα…
        </p>
      ) : null}
      {state.error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert">
          {state.error}
        </p>
      ) : null}

      {solution && !solution.found ? (
        <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-bold">Η άσκηση δεν ταυτοποιήθηκε με ασφάλεια.</p>
          <p className="mt-1">{solution.matchExplanation}</p>
        </div>
      ) : null}

      {solution?.found ? (
        <article className="mt-6 border-t border-[#d8c6ae] pt-6">
          <header>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#7a654b]">
              <span>Άσκηση {solution.exerciseLabel || exerciseIdentifier.trim()}</span>
              <span aria-hidden="true">·</span>
              <span>PDF σελ. {solution.sourcePdfPages.join(", ")}</span>
            </div>
            <h5 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{solution.title || "Αναλυτική λύση"}</h5>
            <p className="mt-3 text-base leading-8 text-slate-700">{solution.problemSummary}</p>
            {solution.matchExplanation ? <p className="mt-2 text-sm leading-6 text-slate-500">{solution.matchExplanation}</p> : null}
          </header>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h6 className="font-black text-slate-950">Δεδομένα</h6>
              <div className="mt-3 space-y-3">
                {solution.givenData.map((item, index) => (
                  <div key={`${item.symbol}-${index}`} className="grid grid-cols-[auto_1fr] gap-x-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <span className="font-black text-[#6b533b]">{item.symbol || "•"}</span>
                    <div>
                      <p className="font-bold text-slate-900">{item.value}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.meaning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h6 className="font-black text-slate-950">Ζητούμενα</h6>
              <BulletList items={solution.asked} />
            </section>
          </div>

          <section className="mt-5 rounded-xl bg-[#f1ece4] p-4 sm:p-5">
            <h6 className="text-lg font-black text-slate-950">Η φυσική ιδέα πριν από τους τύπους</h6>
            <BulletList items={solution.physicsIdeas} />
          </section>

          <section className="mt-6">
            <h6 className="text-xl font-black text-slate-950">Σχέδιο λύσης</h6>
            <ol className="mt-3 space-y-2 pl-6 text-base leading-7 text-slate-700 marker:font-black marker:text-[#6b533b]">
              {solution.plan.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
            </ol>
          </section>

          <section className="mt-7">
            <h6 className="text-xl font-black text-slate-950">Λύση βήμα προς βήμα</h6>
            <div className="mt-4 space-y-4">
              {solution.steps.map((step, index) => (
                <article key={`${step.title}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <p className="text-sm font-black uppercase tracking-[0.08em] text-[#7a654b]">Βήμα {index + 1}</p>
                  <h6 className="mt-1 text-lg font-black text-slate-950">{step.title}</h6>
                  <p className="mt-2 whitespace-pre-line text-base leading-8 text-slate-700">{step.explanation}</p>
                  {step.calculation ? (
                    <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-950 px-4 py-3 font-mono text-sm leading-7 text-white">
                      {step.calculation}
                    </pre>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-xl border-2 border-[#6b533b] bg-white p-4 sm:p-5">
            <h6 className="font-black text-[#6b533b]">Τελικό αποτέλεσμα</h6>
            <p className="mt-2 whitespace-pre-line text-lg font-bold leading-8 text-slate-950">{solution.finalAnswer}</p>
          </section>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h6 className="font-black text-emerald-950">Έλεγχος της λύσης</h6>
              <BulletList items={solution.checks} />
            </section>
            <section className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <h6 className="font-black text-rose-950">Συνηθισμένη παγίδα</h6>
              <BulletList items={solution.commonTraps} />
            </section>
          </div>

          {solution.takeaway ? (
            <section className="mt-5 rounded-xl bg-slate-950 p-4 text-white sm:p-5">
              <h6 className="font-black text-[#f0d7b6]">Τι να θυμάσαι</h6>
              <p className="mt-2 text-base leading-8 text-slate-100">{solution.takeaway}</p>
            </section>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}

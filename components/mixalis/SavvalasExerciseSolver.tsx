"use client";

import Link from "next/link";
import { useState } from "react";
import SavvalasExerciseSolutionView from "@/components/mixalis/SavvalasExerciseSolutionView";
import type { SavvalasExerciseSolution } from "@/lib/mixalis/savvalas-exercise-solver";

type SolverState = {
  busy: boolean;
  error: string;
  solution: SavvalasExerciseSolution | null;
  savedSolutionId: string | null;
};

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
  const [state, setState] = useState<SolverState>({
    busy: false,
    error: "",
    solution: null,
    savedSolutionId: null,
  });

  async function solveExercise() {
    const normalized = exerciseIdentifier.trim();
    if (!normalized) {
      setState({
        busy: false,
        error: "Γράψε πρώτα τον αριθμό της άσκησης.",
        solution: null,
        savedSolutionId: null,
      });
      return;
    }

    setState({ busy: true, error: "", solution: null, savedSolutionId: null });
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
      setState({
        busy: false,
        error: "",
        solution: payload.solution as SavvalasExerciseSolution,
        savedSolutionId: payload.savedSolution?.id ? String(payload.savedSolution.id) : null,
      });
    } catch (error) {
      setState({
        busy: false,
        error: error instanceof Error ? error.message : "Η επίλυση της άσκησης απέτυχε.",
        solution: null,
        savedSolutionId: null,
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
            Γράψε το αναγνωριστικό ακριβώς όπως φαίνεται στο βιβλίο. Η επιτυχής λύση αποθηκεύεται αυτόματα.
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

      {state.savedSolutionId ? (
        <Link
          href={`/mixalis/exercises/${state.savedSolutionId}`}
          className="mt-5 flex min-h-12 items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold !text-emerald-900 transition hover:bg-emerald-100"
        >
          <span>✓ Η άσκηση αποθηκεύτηκε ως λυμένη</span>
          <span aria-hidden="true">Άνοιγμα →</span>
        </Link>
      ) : null}

      {solution?.found ? (
        <div className="mt-6">
          <SavvalasExerciseSolutionView
            solution={solution}
            exerciseFallback={exerciseIdentifier.trim()}
          />
        </div>
      ) : null}
    </section>
  );
}

"use client";

import { useState, type ReactNode } from "react";

export type ThinkQuestion = {
  prompt: ReactNode;
  choices: ReactNode[];
  correct: number;
  /** Shown after answering, whatever the choice. */
  explain: ReactNode;
  /** Optional nudge per wrong choice (index → text). */
  whyWrong?: Record<number, ReactNode>;
  /** Suggest how to verify on the graph above. */
  tryIt?: ReactNode;
};

/**
 * "Πρόβλεψε πρώτα" card: the student commits to an answer before seeing
 * the explanation, then is sent back to the interactive graph to check.
 */
export function ThinkCard({
  question,
  label = "Πρόβλεψε πρώτα",
  index,
}: {
  question: ThinkQuestion;
  label?: string;
  index?: number;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const right = picked === question.correct;

  return (
    <div className="rounded-2xl border border-[#2c2825]/15 bg-[#fffdf9] p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9822f]">
        🤔 {label}
        {index !== undefined ? ` · ${index}` : ""}
      </p>
      <div className="mt-2 text-[15px] font-semibold leading-6 text-[#2c2825]">{question.prompt}</div>

      <div className="mt-3 grid gap-2">
        {question.choices.map((choice, i) => {
          const isPicked = picked === i;
          const isCorrect = i === question.correct;
          let style = "border-black/10 bg-white hover:bg-[#f3efe8]";
          if (answered && isCorrect) style = "border-[#2e8b57]/50 bg-[#ecf7f0]";
          else if (answered && isPicked) style = "border-[#c0392b]/40 bg-[#fdeeec]";
          else if (answered) style = "border-black/5 bg-white opacity-60";
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm leading-6 transition ${style}`}
            >
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2c2825]/10 text-xs font-bold">
                {answered && isCorrect ? "✓" : answered && isPicked ? "✗" : String.fromCharCode(945 + i)}
              </span>
              <span>{choice}</span>
            </button>
          );
        })}
      </div>

      {answered ? (
        <div className="mt-3 space-y-2 text-sm leading-6">
          <p className={`font-semibold ${right ? "text-[#2e8b57]" : "text-[#c0392b]"}`}>
            {right ? "Σωστά! 👏" : "Όχι ακριβώς — και είναι από τα πιο συνηθισμένα λάθη."}
          </p>
          {!right && question.whyWrong?.[picked!] ? (
            <p className="text-[#7a2c22]">{question.whyWrong[picked!]}</p>
          ) : null}
          <div className="text-[#4d4138]">{question.explain}</div>
          {question.tryIt ? (
            <p className="rounded-xl bg-[#fdf3e6] px-3 py-2 text-[#5f4630]">
              <span className="font-semibold">Δοκίμασέ το:</span> {question.tryIt}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setPicked(null)}
            className="text-xs font-semibold text-[#857261] underline underline-offset-2"
          >
            Ξαναδοκίμασε
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Final self-test with a running score. */
export function Quiz({ questions }: { questions: ThinkQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [step, setStep] = useState(0);
  const done = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === questions[i].correct).length;
  const q = questions[step];
  const picked = answers[step];

  const pick = (i: number) => {
    if (picked !== null) return;
    setAnswers((prev) => prev.map((a, k) => (k === step ? i : a)));
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {questions.map((_, i) => {
            const a = answers[i];
            const color =
              a === null ? "bg-[#e9e0d5] text-[#6b625b]" : a === questions[i].correct ? "bg-[#2e8b57] text-white" : "bg-[#c0392b] text-white";
            return (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className={`h-8 w-8 rounded-full text-sm font-bold transition ${color} ${i === step ? "ring-2 ring-[#2c2825] ring-offset-2" : ""}`}
                aria-label={`Ερώτηση ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <p className="text-sm font-semibold text-[#4d4138]">
          Σκορ: <span className="font-mono">{score}</span> / {questions.length}
        </p>
      </div>

      <div className="rounded-2xl border border-black/10 bg-[#fffdf9] p-4 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9822f]">
          Ερώτηση {step + 1} από {questions.length}
        </p>
        <div className="mt-2 text-base font-semibold leading-7">{q.prompt}</div>
        <div className="mt-4 grid gap-2">
          {q.choices.map((choice, i) => {
            const answered = picked !== null;
            const isCorrect = i === q.correct;
            let style = "border-black/10 bg-white hover:bg-[#f3efe8]";
            if (answered && isCorrect) style = "border-[#2e8b57]/50 bg-[#ecf7f0]";
            else if (answered && picked === i) style = "border-[#c0392b]/40 bg-[#fdeeec]";
            else if (answered) style = "border-black/5 bg-white opacity-60";
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => pick(i)}
                className={`rounded-xl border px-4 py-2.5 text-left text-sm leading-6 transition ${style}`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {picked !== null ? (
          <div className="mt-4 space-y-2 text-sm leading-6">
            <p className={`font-semibold ${picked === q.correct ? "text-[#2e8b57]" : "text-[#c0392b]"}`}>
              {picked === q.correct ? "Σωστά!" : "Λάθος."}
            </p>
            {picked !== q.correct && q.whyWrong?.[picked] ? <p className="text-[#7a2c22]">{q.whyWrong[picked]}</p> : null}
            <div className="text-[#4d4138]">{q.explain}</div>
          </div>
        ) : null}

        <div className="mt-5 flex justify-between">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-semibold disabled:opacity-40"
          >
            ← Πίσω
          </button>
          {step < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="rounded-full bg-[#2c2825] px-4 py-1.5 text-sm font-semibold text-white"
            >
              Επόμενη →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAnswers(questions.map(() => null));
                setStep(0);
              }}
              className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-semibold"
            >
              ↺ Από την αρχή
            </button>
          )}
        </div>
      </div>

      {done ? (
        <div className="mt-4 rounded-2xl bg-[#2c2825] p-5 text-white">
          <p className="text-lg font-semibold">
            Τελικό σκορ: {score} / {questions.length}
          </p>
          <p className="mt-1 text-sm text-white/80">
            {score === questions.length
              ? "Τέλειο! Έχεις καταλάβει την ομαλή κυκλική κίνηση σε βάθος."
              : score >= questions.length - 2
                ? "Πολύ καλά! Ξαναδές τις κόκκινες — εκεί κρύβονται οι παγίδες των διαγωνισμάτων."
                : "Ξαναπέρνα από τα γραφήματα πάνω και δοκίμασε ξανά. Οι κόκκινες ερωτήσεις δείχνουν τι να ξαναδείς."}
          </p>
        </div>
      ) : null}
    </div>
  );
}

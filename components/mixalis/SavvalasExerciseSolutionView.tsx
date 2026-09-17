import type { SavvalasExerciseSolution } from "@/lib/mixalis/savvalas-exercise-solver";

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2 pl-5 text-[15px] leading-7 text-slate-700 marker:text-[#7c684f] sm:text-base">
      {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
    </ul>
  );
}

export default function SavvalasExerciseSolutionView({
  solution,
  exerciseFallback,
}: {
  solution: SavvalasExerciseSolution;
  exerciseFallback: string;
}) {
  return (
    <article className="border-t border-[#d8c6ae] pt-6">
      <header>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#7a654b]">
          <span>Άσκηση {solution.exerciseLabel || exerciseFallback}</span>
          <span aria-hidden="true">·</span>
          <span>PDF σελ. {solution.sourcePdfPages.join(", ")}</span>
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          {solution.title || "Αναλυτική λύση"}
        </h2>
        <p className="mt-3 text-base leading-8 text-slate-700">{solution.problemSummary}</p>
        {solution.matchExplanation ? (
          <p className="mt-2 text-sm leading-6 text-slate-500">{solution.matchExplanation}</p>
        ) : null}
      </header>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-black text-slate-950">Δεδομένα</h3>
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
          <h3 className="font-black text-slate-950">Ζητούμενα</h3>
          <BulletList items={solution.asked} />
        </section>
      </div>

      <section className="mt-5 rounded-xl bg-[#f1ece4] p-4 sm:p-5">
        <h3 className="text-lg font-black text-slate-950">Η φυσική ιδέα πριν από τους τύπους</h3>
        <BulletList items={solution.physicsIdeas} />
      </section>

      <section className="mt-6">
        <h3 className="text-xl font-black text-slate-950">Σχέδιο λύσης</h3>
        <ol className="mt-3 space-y-2 pl-6 text-base leading-7 text-slate-700 marker:font-black marker:text-[#6b533b]">
          {solution.plan.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
        </ol>
      </section>

      <section className="mt-7">
        <h3 className="text-xl font-black text-slate-950">Λύση βήμα προς βήμα</h3>
        <div className="mt-4 space-y-4">
          {solution.steps.map((step, index) => (
            <article key={`${step.title}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-sm font-black uppercase tracking-[0.08em] text-[#7a654b]">Βήμα {index + 1}</p>
              <h4 className="mt-1 text-lg font-black text-slate-950">{step.title}</h4>
              <p className="mt-2 whitespace-pre-line text-base leading-8 text-slate-700">{step.explanation}</p>
              {step.calculation ? (
                <div className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-950 px-4 py-3 font-sans text-[15px] font-semibold leading-7 text-white sm:text-base">
                  {step.calculation}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-xl border-2 border-[#6b533b] bg-white p-4 sm:p-5">
        <h3 className="font-black text-[#6b533b]">Τελικό αποτέλεσμα</h3>
        <p className="mt-2 whitespace-pre-line text-lg font-bold leading-8 text-slate-950">{solution.finalAnswer}</p>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="font-black text-emerald-950">Έλεγχος της λύσης</h3>
          <BulletList items={solution.checks} />
        </section>
        <section className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <h3 className="font-black text-rose-950">Συνηθισμένη παγίδα</h3>
          <BulletList items={solution.commonTraps} />
        </section>
      </div>

      {solution.takeaway ? (
        <section className="mt-5 rounded-xl bg-slate-950 p-4 text-white sm:p-5">
          <h3 className="font-black text-[#f0d7b6]">Τι να θυμάσαι</h3>
          <p className="mt-2 text-base leading-8 text-slate-100">{solution.takeaway}</p>
        </section>
      ) : null}
    </article>
  );
}

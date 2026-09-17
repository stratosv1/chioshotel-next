import Link from "next/link";
import { notFound } from "next/navigation";
import SavvalasExerciseSolutionView from "@/components/mixalis/SavvalasExerciseSolutionView";
import { getSavedExerciseSolution } from "@/lib/mixalis/exercise-solutions";

export const dynamic = "force-dynamic";

export default async function SavedExerciseSolutionPage({
  params,
}: {
  params: Promise<{ solutionId: string }>;
}) {
  const { solutionId } = await params;
  const saved = await getSavedExerciseSolution(solutionId);
  if (!saved) notFound();

  const updatedLabel = new Intl.DateTimeFormat("el-GR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Athens",
  }).format(new Date(saved.updatedAt));

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/mixalis/chapters/${saved.chapterId}`}
          className="mb-5 inline-flex min-h-11 items-center text-sm font-bold text-[#6e5d50] hover:underline"
        >
          ← Πίσω στο κεφάλαιο
        </Link>

        <header className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white">✓ Λυμένη άσκηση</span>
            <span className="text-sm font-semibold text-[#756b63]">Αποθηκεύτηκε {updatedLabel}</span>
          </div>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-[#806b52]">
            {saved.courseTitle} · Κεφάλαιο {saved.chapterNumberLabel || ""}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Άσκηση {saved.exerciseIdentifier}
          </h1>
          <p className="mt-3 text-base font-semibold text-slate-600">
            {saved.subchapterNumberLabel} · {saved.subchapterTitle}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Σαββάλας · ORIGINAL PDF σελίδες {saved.sourcePageFrom}–{saved.sourcePageTo}
          </p>
        </header>

        <section className="mt-5 rounded-3xl border border-[#dac9b2] bg-[#fffaf3] p-5 shadow-sm sm:p-8">
          <SavvalasExerciseSolutionView
            solution={saved.solution}
            exerciseFallback={saved.exerciseIdentifier}
          />
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPhysicsCourse,
  listPhysicsChaptersByCourse,
} from "@/lib/mixalis/db";

export default async function MixalisCoursePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const [course, chapters] = await Promise.all([
    getPhysicsCourse(code),
    listPhysicsChaptersByCourse(code),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/mixalis"
          prefetch={false}
          className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
        >
          ← Οι δύο Φυσικές
        </Link>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
            Μάθημα
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {course.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5 text-[#675b52]">
              {course.chapterCount} κεφάλαια
            </span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5 text-[#675b52]">
              {course.subchapterCount} υποκεφάλαια
            </span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5 text-[#675b52]">
              {course.materialBatchCount} προσθήκες υλικού
            </span>
          </div>
        </header>

        <section className="mt-7">
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
              Σχολική ύλη
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Κεφάλαια</h2>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/mixalis/chapters/${chapter.id}`}
                prefetch={false}
                className="group grid gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <div className="flex h-12 min-w-12 items-center justify-center rounded-2xl bg-[#ded4c7] px-4 text-lg font-semibold text-[#554940]">
                  {chapter.numberLabel ?? "—"}
                </div>

                <div>
                  <h3 className="text-lg font-semibold transition group-hover:text-[#6d5848] sm:text-xl">
                    {chapter.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#81766e] sm:text-sm">
                    <span>{chapter.subchapterCount} υποκεφάλαια</span>
                    <span>{chapter.materialBatchCount} προσθήκες υλικού</span>
                    <span>{chapter.sourceFileCount} αρχεία</span>
                  </div>
                </div>

                <span className="text-sm font-semibold text-[#5f5045]">
                  Άνοιγμα →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

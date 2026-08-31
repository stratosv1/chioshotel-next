import Link from "next/link";
import { notFound } from "next/navigation";
import PhysicsPipeline from "@/components/mixalis/PhysicsPipeline";
import { getPhysicsChapter, listPhysicsSubchapters } from "@/lib/mixalis/db";
import { listPhysicsPipelineByChapter } from "@/lib/mixalis/lesson-navigation";
import { listSingleSmartLabStatesByChapterCompat as listSingleSmartLabStatesByChapter } from "@/lib/mixalis/smartlab-single-compat";

async function safeSmartLabStates(chapterId: string) {
  try {
    return await listSingleSmartLabStatesByChapter(chapterId);
  } catch (error) {
    console.error("Mixalis per-lesson LAB states failed", error);
    return [];
  }
}

export default async function MixalisChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [chapter, subchapters, pipelines, labStates] = await Promise.all([
    getPhysicsChapter(id),
    listPhysicsSubchapters(id),
    listPhysicsPipelineByChapter(id),
    safeSmartLabStates(id),
  ]);

  if (!chapter) notFound();

  const backHref = chapter.courseCode ? `/mixalis/courses/${chapter.courseCode}` : "/mixalis";
  const completedLessons = pipelines.filter((pipeline) => pipeline.lesson.upToDate).length;
  const manualMappings = pipelines.filter((pipeline) => Boolean(pipeline.savvalas.rangeId && pipeline.official.rangeId)).length;
  const labBySubchapter = new Map(labStates.map((lab) => [lab.subchapterId, lab]));
  const completedLabs = pipelines.filter((pipeline) => {
    const lab = labBySubchapter.get(pipeline.subchapterId);
    return Boolean(
      pipeline.lesson.upToDate &&
        pipeline.lesson.revisionId &&
        lab?.upToDate &&
        lab.currentLessonRevisionId === pipeline.lesson.revisionId,
    );
  }).length;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link href={backHref} className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline">
          ← Πίσω στα κεφάλαια
        </Link>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
                {chapter.numberLabel ? `Κεφάλαιο ${chapter.numberLabel}` : "Κεφάλαιο"}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{chapter.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6b625b] sm:text-base">
                {chapter.note || `${subchapters.length} υποκεφάλαια οργανωμένα σύμφωνα με το σχολικό βιβλίο.`}
              </p>
            </div>

            <div className="grid min-w-72 grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-[#f1ede7] p-4">
                <p className="text-2xl font-semibold">{manualMappings}/{subchapters.length}</p>
                <p className="mt-1 text-xs text-[#736a63]">manual ranges</p>
              </div>
              <div className="rounded-2xl bg-[#f1ede7] p-4">
                <p className="text-2xl font-semibold">{completedLessons}/{subchapters.length}</p>
                <p className="mt-1 text-xs text-[#736a63]">μαθήματα</p>
              </div>
              <div className="rounded-2xl bg-[#eef5ed] p-4">
                <p className="text-2xl font-semibold text-[#40583d]">{completedLabs}/{completedLessons}</p>
                <p className="mt-1 text-xs text-[#60715d]">LAB</p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-3xl border border-[#c6d3c1] bg-[#f1f6ef] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#65755f]">Νέα απλή ροή</p>
              <h2 className="mt-1 text-xl font-semibold">Σελίδες → Δημιουργία μαθήματος → LAB</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#596653]">
                Δίνεις εσύ μία φορά τις ORIGINAL PDF σελίδες του Σαββάλα και του σχολικού βιβλίου. Δεν γίνεται AI αναζήτηση σελίδων. Με ένα πάτημα «Δημιουργία μαθήματος» το σύστημα ολοκληρώνει μόνο του τις αναλύσεις, τη canonical γνώση και το START. Το LAB παραμένει χειροκίνητο.
              </p>
            </div>
            <Link href="/mixalis/sources" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#554a43]">
              Βιβλιοθήκη Πηγών
            </Link>
          </div>
        </section>

        {subchapters.length > 0 ? (
          <PhysicsPipeline chapterId={chapter.id} subchapters={subchapters} pipelines={pipelines} labStates={labStates} />
        ) : (
          <section className="mt-6 rounded-3xl border border-dashed border-black/15 bg-white/70 p-6 text-sm text-[#6f665f]">
            Δεν υπάρχουν ενεργά υποκεφάλαια σε αυτό το κεφάλαιο.
          </section>
        )}
      </div>
    </main>
  );
}

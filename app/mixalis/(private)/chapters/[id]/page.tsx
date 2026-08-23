import Link from "next/link";
import { notFound } from "next/navigation";
import BatchPhotoUploader from "@/components/mixalis/BatchPhotoUploader";
import PhysicsPipeline from "@/components/mixalis/PhysicsPipeline";
import {
  getPhysicsChapter,
  listMaterialBatches,
  listPhysicsSubchapters,
  type MaterialSourceType,
} from "@/lib/mixalis/db";
import {
  listCurrentLessonsByChapter,
  listPhysicsPipelineByChapter,
} from "@/lib/mixalis/lesson-navigation";

const sourceLabels: Record<MaterialSourceType, string> = {
  school_theory: "Σχολικό βιβλίο — Θεωρία",
  school_exercises: "Σχολικό βιβλίο — Ασκήσεις",
  savvalas: "Βοήθημα Σαββάλας",
  tripolitis: "Φωτοτυπίες Τριπολίτη",
  school_teacher: "Φωτοτυπίες καθηγητή σχολείου",
  other: "Άλλο υλικό",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default async function MixalisChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const [chapter, batches, subchapters, currentLessons, pipelines] = await Promise.all([
    getPhysicsChapter(id),
    listMaterialBatches(id),
    listPhysicsSubchapters(id),
    listCurrentLessonsByChapter(id),
    listPhysicsPipelineByChapter(id),
  ]);

  if (!chapter) notFound();

  const currentLessonBySubchapter = new Map(
    currentLessons.map((lesson) => [lesson.subchapterId, lesson]),
  );

  const backHref = chapter.courseCode
    ? `/mixalis/courses/${chapter.courseCode}`
    : "/mixalis";

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={backHref}
          className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
        >
          ← Πίσω στα κεφάλαια
        </Link>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
                {chapter.numberLabel ? `Κεφάλαιο ${chapter.numberLabel}` : "Ζωντανό κεφάλαιο"}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {chapter.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6b625b] sm:text-base">
                {chapter.note ||
                  `${subchapters.length} υποκεφάλαια οργανωμένα σύμφωνα με το σχολικό βιβλίο.`}
              </p>
            </div>
            <div className="grid min-w-60 grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-[#f1ede7] p-4">
                <p className="text-2xl font-semibold">{subchapters.length}</p>
                <p className="mt-1 text-xs text-[#736a63]">υποκεφάλαια</p>
              </div>
              <div className="rounded-2xl bg-[#f1ede7] p-4">
                <p className="text-2xl font-semibold">{chapter.materialBatchCount}</p>
                <p className="mt-1 text-xs text-[#736a63]">προσθήκες</p>
              </div>
              <div className="rounded-2xl bg-[#f1ede7] p-4">
                <p className="text-2xl font-semibold">{chapter.sourceFileCount}</p>
                <p className="mt-1 text-xs text-[#736a63]">αρχεία</p>
              </div>
            </div>
          </div>
        </header>

        {subchapters.length > 0 ? (
          <PhysicsPipeline subchapters={subchapters} pipelines={pipelines} />
        ) : null}

        {subchapters.length > 0 ? (
          <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
              Δομή κεφαλαίου
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Υποκεφάλαια</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {subchapters.map((subchapter) => {
                const currentLesson = currentLessonBySubchapter.get(subchapter.id);

                return (
                  <div
                    key={subchapter.id}
                    className="rounded-2xl border border-black/10 bg-[#fbfaf8] p-4"
                  >
                    <div className="flex items-start gap-4">
                      <span className="inline-flex min-w-14 justify-center rounded-xl bg-[#e8dfd3] px-3 py-2 text-sm font-semibold text-[#5c5047]">
                        {subchapter.numberLabel}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">{subchapter.title}</h3>
                        {subchapter.note ? (
                          <p className="mt-1 text-sm leading-5 text-[#756c65]">
                            {subchapter.note}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {currentLesson ? (
                      <div className="mt-4 rounded-2xl border border-[#b8cab5] bg-[#eef5ed] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#587153]">
                            Μάθημα έτοιμο
                          </span>
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-[#5f6f5b]">
                            Revision {currentLesson.revisionNumber}
                          </span>
                        </div>
                        <Link
                          href={`/mixalis/lessons/${currentLesson.revisionId}`}
                          className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#52674d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#465a42]"
                        >
                          Άνοιγμα μαθήματος
                        </Link>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <div id="chapter-material" className="mt-6 grid scroll-mt-6 gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
                Υλικό κεφαλαίου
              </p>
              <h2 className="mt-1 text-2xl font-semibold">Προσθήκες υλικού</h2>
            </div>

            {query.created === "batch" ? (
              <div className="mt-5 rounded-2xl border border-[#b8ccb7] bg-[#f0f6ef] px-4 py-3 text-sm text-[#496047]">
                Η νέα προσθήκη υλικού δημιουργήθηκε. Αν αφορά ολόκληρο το κεφάλαιο, ανέβασε όλες τις φωτογραφίες με τη σωστή σειρά και μετά ξεκίνησε τον αυτόματο διαχωρισμό.
              </div>
            ) : null}

            {query.error === "segmentation" ? (
              <div className="mt-5 rounded-2xl border border-[#d9b4a6] bg-[#fbf1ed] px-4 py-3 text-sm text-[#7a4938]">
                Δεν μπόρεσε να ξεκινήσει ο αυτόματος διαχωρισμός. Έλεγξε ότι έχουν ανέβει οι φωτογραφίες του κεφαλαίου και δοκίμασε ξανά.
              </div>
            ) : null}

            {batches.length > 0 ? (
              <div className="mt-6 space-y-3">
                {batches.map((batch, index) => (
                  <article
                    key={batch.id}
                    className="rounded-2xl border border-black/10 bg-[#fbfaf8] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7665]">
                          Προσθήκη #{batches.length - index}
                        </p>
                        <h3 className="mt-1 font-semibold">{sourceLabels[batch.sourceType]}</h3>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs text-[#786e66]">
                        {batch.lessonDate
                          ? formatDate(batch.lessonDate)
                          : formatDate(batch.createdAt)}
                      </span>
                    </div>

                    {batch.subchapterId ? (
                      <div className="mt-3 inline-flex rounded-full bg-[#eee7de] px-3 py-1.5 text-xs font-semibold text-[#66574c]">
                        {batch.subchapterNumberLabel} · {batch.subchapterTitle}
                      </div>
                    ) : (
                      <div className="mt-3 inline-flex rounded-full bg-[#f1ede7] px-3 py-1.5 text-xs text-[#786e66]">
                        Όλο το κεφάλαιο — αυτόματος διαχωρισμός
                      </div>
                    )}

                    {batch.label ? (
                      <p className="mt-3 text-sm font-medium text-[#504741]">{batch.label}</p>
                    ) : null}
                    {batch.notes ? (
                      <p className="mt-2 text-sm leading-6 text-[#756c65]">{batch.notes}</p>
                    ) : null}
                    <div className="mt-4 flex items-center gap-3 text-xs text-[#8a817a]">
                      <span>{batch.sourceFileCount} αρχεία</span>
                      <span>•</span>
                      <span>
                        {batch.sourceFileCount > 0
                          ? "Αποθηκευμένα ιδιωτικά"
                          : "Χωρίς φωτογραφίες ακόμη"}
                      </span>
                    </div>

                    <BatchPhotoUploader
                      chapterId={chapter.id}
                      batchId={batch.id}
                      existingFileCount={batch.sourceFileCount}
                      enableAutoSegmentation={!batch.subchapterId && subchapters.length > 0}
                    />
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-[#fbfaf8] p-7 text-center">
                <h3 className="font-semibold">Δεν έχει προστεθεί υλικό ακόμη</h3>
                <p className="mt-2 text-sm leading-6 text-[#756c65]">
                  Για ένα φωτογραφημένο βοήθημα ή σετ φωτοτυπιών, δημιούργησε μία προσθήκη για όλο το κεφάλαιο. Η AI θα προτείνει αργότερα τον διαχωρισμό στα επίσημα υποκεφάλαια.
                </p>
              </div>
            )}
          </section>

          <aside className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
              + Νέο υλικό
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Προσθήκη υλικού</h2>
            <p className="mt-2 text-sm leading-6 text-[#6f665f]">
              Για φωτογραφημένο βοήθημα ή φωτοτυπίες προτίμησε «Όλο το κεφάλαιο». Μετά το upload η AI θα προτείνει τον διαχωρισμό στα επίσημα υποκεφάλαια. Επίλεξε συγκεκριμένο υποκεφάλαιο μόνο όταν το υλικό αφορά πράγματι αποκλειστικά εκείνο.
            </p>

            {query.error && query.error !== "segmentation" ? (
              <div className="mt-4 rounded-2xl border border-[#d9b4a6] bg-[#fbf1ed] px-4 py-3 text-sm text-[#7a4938]">
                Έλεγξε τα στοιχεία της προσθήκης και δοκίμασε ξανά.
              </div>
            ) : null}

            <form
              action={`/mixalis/api/chapters/${chapter.id}/batches`}
              method="post"
              className="mt-6 space-y-4"
            >
              {subchapters.length > 0 ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Περιοχή ύλης</span>
                  <select
                    name="subchapterId"
                    defaultValue=""
                    className="w-full rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-sm outline-none"
                  >
                    <option value="">Όλο το κεφάλαιο — αυτόματος διαχωρισμός (προτείνεται)</option>
                    {subchapters.map((subchapter) => (
                      <option key={subchapter.id} value={subchapter.id}>
                        {subchapter.numberLabel} — {subchapter.title}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Πηγή</span>
                <select
                  name="sourceType"
                  required
                  defaultValue="school_theory"
                  className="w-full rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-sm outline-none"
                >
                  {Object.entries(sourceLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Ημερομηνία μαθήματος</span>
                <input
                  name="lessonDate"
                  type="date"
                  className="w-full rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-sm outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Τίτλος / περιγραφή</span>
                <input
                  name="label"
                  type="text"
                  maxLength={160}
                  placeholder="π.χ. Σαββάλας — Κεφάλαιο 1"
                  className="w-full rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-sm outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Σημείωση</span>
                <textarea
                  name="notes"
                  rows={3}
                  maxLength={1000}
                  placeholder="π.χ. Θεωρία και ασκήσεις του κεφαλαίου"
                  className="w-full resize-none rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-sm outline-none"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#403630] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2f2824]"
              >
                Δημιουργία προσθήκης
              </button>
            </form>

            <div className="mt-5 rounded-2xl bg-[#f5f1eb] p-4 text-xs leading-5 text-[#756a61]">
              Για πηγές ολόκληρου κεφαλαίου, ανέβασε όλες τις φωτογραφίες με τη σωστή σειρά και μετά πάτησε «Έναρξη αυτόματου διαχωρισμού». Τα επίσημα βιβλία PDF παραμένουν χωριστά στη Source Library.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

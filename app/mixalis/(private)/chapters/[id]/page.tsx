import Link from "next/link";
import { notFound } from "next/navigation";
import BatchPhotoUploader from "@/components/mixalis/BatchPhotoUploader";
import PhysicsPipeline from "@/components/mixalis/PhysicsPipeline";
import {
  getPhysicsChapter,
  isMaterialSourceType,
  listMaterialBatches,
  listPhysicsSubchapters,
  type MaterialSourceType,
} from "@/lib/mixalis/db";
import { listPhysicsPipelineByChapter } from "@/lib/mixalis/lesson-navigation";

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
  searchParams: Promise<{
    created?: string;
    error?: string;
    source?: string;
    subchapterId?: string;
    batchId?: string;
  }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const [chapter, batches, subchapters, pipelines] = await Promise.all([
    getPhysicsChapter(id),
    listMaterialBatches(id),
    listPhysicsSubchapters(id),
    listPhysicsPipelineByChapter(id),
  ]);

  if (!chapter) notFound();

  const backHref = chapter.courseCode
    ? `/mixalis/courses/${chapter.courseCode}`
    : "/mixalis";

  const requestedSubchapter =
    subchapters.find((subchapter) => subchapter.id === query.subchapterId) ?? null;
  const requestedSource: MaterialSourceType =
    query.source && isMaterialSourceType(query.source) ? query.source : "savvalas";
  const createdBatch =
    query.created === "batch" && query.batchId
      ? batches.find((batch) => batch.id === query.batchId) ?? null
      : null;
  const historyBatches = createdBatch
    ? batches.filter((batch) => batch.id !== createdBatch.id)
    : batches;

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
          <PhysicsPipeline chapterId={chapter.id} subchapters={subchapters} pipelines={pipelines} />
        ) : null}

        <section
          id="chapter-material"
          className="mt-6 scroll-mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
                Νέο υλικό
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                {requestedSubchapter
                  ? `Σαββάλας · ${requestedSubchapter.numberLabel} ${requestedSubchapter.title}`
                  : "Πρόσθεσε φωτογραφίες"}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6f665f]">
                {requestedSubchapter
                  ? "Το Physics Pipeline έχει ήδη επιλέξει το σωστό υποκεφάλαιο. Δημιούργησε την προσθήκη και μετά ανέβασε τις φωτογραφίες."
                  : "Για την καθημερινή ροή επίλεξε το υποκεφάλαιο και την πηγή. Για υλικό ολόκληρου κεφαλαίου μπορείς να αφήσεις την περιοχή σε αυτόματο διαχωρισμό."}
              </p>
            </div>
            {requestedSubchapter ? (
              <span className="inline-flex w-fit rounded-full bg-[#eef5ed] px-3 py-1.5 text-xs font-semibold text-[#4d6549]">
                Προρυθμισμένο από το Pipeline
              </span>
            ) : null}
          </div>

          {query.error === "segmentation" ? (
            <div className="mt-5 rounded-2xl border border-[#d9b4a6] bg-[#fbf1ed] px-4 py-3 text-sm text-[#7a4938]">
              Δεν μπόρεσε να ξεκινήσει ο αυτόματος διαχωρισμός. Έλεγξε ότι έχουν ανέβει οι φωτογραφίες του κεφαλαίου και δοκίμασε ξανά.
            </div>
          ) : null}

          {query.error && query.error !== "segmentation" ? (
            <div className="mt-5 rounded-2xl border border-[#d9b4a6] bg-[#fbf1ed] px-4 py-3 text-sm text-[#7a4938]">
              Έλεγξε τα στοιχεία της προσθήκης και δοκίμασε ξανά.
            </div>
          ) : null}

          {createdBatch ? (
            <div className="mt-6 rounded-2xl border border-[#b8cab5] bg-[#eef5ed] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#587153]">
                    Επόμενο βήμα
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    Ανέβασε τώρα τις φωτογραφίες
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#60715d]">
                    {sourceLabels[createdBatch.sourceType]}
                    {createdBatch.subchapterId
                      ? ` · ${createdBatch.subchapterNumberLabel} ${createdBatch.subchapterTitle}`
                      : " · Όλο το κεφάλαιο"}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs text-[#667363]">
                  Νέα προσθήκη
                </span>
              </div>

              <BatchPhotoUploader
                chapterId={chapter.id}
                batchId={createdBatch.id}
                existingFileCount={createdBatch.sourceFileCount}
                enableAutoSegmentation={!createdBatch.subchapterId && subchapters.length > 0}
              />
            </div>
          ) : (
            <form
              action={`/mixalis/api/chapters/${chapter.id}/batches`}
              method="post"
              className="mt-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {subchapters.length > 0 ? (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Υποκεφάλαιο</span>
                    <select
                      name="subchapterId"
                      defaultValue={requestedSubchapter?.id ?? ""}
                      className="w-full rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-sm outline-none"
                    >
                      <option value="">Όλο το κεφάλαιο — αυτόματος διαχωρισμός</option>
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
                    defaultValue={requestedSource}
                    className="w-full rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-sm outline-none"
                  >
                    {Object.entries(sourceLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <details className="mt-4 rounded-2xl border border-black/10 bg-[#fbfaf8]">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-[#675d56]">
                  + Προαιρετικά στοιχεία
                </summary>
                <div className="grid gap-4 border-t border-black/10 p-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Ημερομηνία μαθήματος</span>
                    <input
                      name="lessonDate"
                      type="date"
                      className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Τίτλος / περιγραφή</span>
                    <input
                      name="label"
                      type="text"
                      maxLength={160}
                      placeholder="π.χ. Σαββάλας — Κεφάλαιο 1"
                      className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-medium">Σημείωση</span>
                    <textarea
                      name="notes"
                      rows={3}
                      maxLength={1000}
                      placeholder="π.χ. Θεωρία και ασκήσεις του κεφαλαίου"
                      className="w-full resize-none rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none"
                    />
                  </label>
                </div>
              </details>

              <button
                type="submit"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#304b35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#263d2b]"
              >
                Δημιουργία & ανέβασμα φωτογραφιών
              </button>
            </form>
          )}

          {historyBatches.length > 0 ? (
            <details className="mt-6 rounded-2xl border border-black/10 bg-[#f8f5f0]">
              <summary className="cursor-pointer list-none px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">Ιστορικό / Προχωρημένα</p>
                    <p className="mt-1 text-xs text-[#7b7169]">
                      {historyBatches.length} αποθηκευμένες προσθήκες υλικού
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-[#786e66]">
                    Άνοιγμα
                  </span>
                </div>
              </summary>

              <div className="space-y-3 border-t border-black/10 p-4 sm:p-5">
                {historyBatches.map((batch) => (
                  <article
                    key={batch.id}
                    className="rounded-2xl border border-black/10 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{sourceLabels[batch.sourceType]}</h3>
                        <p className="mt-1 text-sm text-[#756c65]">
                          {batch.subchapterId
                            ? `${batch.subchapterNumberLabel} · ${batch.subchapterTitle}`
                            : "Όλο το κεφάλαιο — αυτόματος διαχωρισμός"}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#f5f1eb] px-3 py-1 text-xs text-[#786e66]">
                        {batch.lessonDate
                          ? formatDate(batch.lessonDate)
                          : formatDate(batch.createdAt)}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#8a817a]">
                      <span>{batch.sourceFileCount} αρχεία</span>
                      {batch.label ? <span>· {batch.label}</span> : null}
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
            </details>
          ) : null}
        </section>
      </div>
    </main>
  );
}

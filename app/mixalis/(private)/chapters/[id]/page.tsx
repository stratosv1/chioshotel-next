import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPhysicsChapter,
  listMaterialBatches,
  type MaterialSourceType,
} from "@/lib/mixalis/db";

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
  const [chapter, batches] = await Promise.all([
    getPhysicsChapter(id),
    listMaterialBatches(id),
  ]);

  if (!chapter) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/mixalis"
          className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
        >
          ← Όλα τα κεφάλαια
        </Link>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
                Ζωντανό κεφάλαιο
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {chapter.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6b625b] sm:text-base">
                {chapter.note || "Δεν έχει προστεθεί σημείωση ακόμη."}
              </p>
            </div>
            <div className="grid min-w-52 grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-[#f1ede7] p-4">
                <p className="text-2xl font-semibold">{chapter.materialBatchCount}</p>
                <p className="mt-1 text-xs text-[#736a63]">προσθήκες υλικού</p>
              </div>
              <div className="rounded-2xl bg-[#f1ede7] p-4">
                <p className="text-2xl font-semibold">{chapter.sourceFileCount}</p>
                <p className="mt-1 text-xs text-[#736a63]">αρχεία</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
                  Υλικό κεφαλαίου
                </p>
                <h2 className="mt-1 text-2xl font-semibold">Προσθήκες ανά μάθημα</h2>
              </div>
            </div>

            {query.created === "batch" ? (
              <div className="mt-5 rounded-2xl border border-[#b8ccb7] bg-[#f0f6ef] px-4 py-3 text-sm text-[#496047]">
                Η νέα προσθήκη υλικού δημιουργήθηκε.
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
                        <h3 className="mt-1 font-semibold">
                          {sourceLabels[batch.sourceType]}
                        </h3>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs text-[#786e66]">
                        {batch.lessonDate ? formatDate(batch.lessonDate) : formatDate(batch.createdAt)}
                      </span>
                    </div>
                    {batch.label ? (
                      <p className="mt-3 text-sm font-medium text-[#504741]">{batch.label}</p>
                    ) : null}
                    {batch.notes ? (
                      <p className="mt-2 text-sm leading-6 text-[#756c65]">{batch.notes}</p>
                    ) : null}
                    <div className="mt-4 flex items-center gap-3 text-xs text-[#8a817a]">
                      <span>{batch.sourceFileCount} αρχεία</span>
                      <span>•</span>
                      <span>Αναμονή για upload</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-[#fbfaf8] p-7 text-center">
                <h3 className="font-semibold">Δεν έχει προστεθεί υλικό ακόμη</h3>
                <p className="mt-2 text-sm leading-6 text-[#756c65]">
                  Δημιούργησε την πρώτη προσθήκη και μετά θα συνδέσουμε τις φωτογραφίες που θα ανεβαίνουν από το κινητό.
                </p>
              </div>
            )}
          </section>

          <aside className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
              + Νέο υλικό
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Προσθήκη μαθήματος</h2>
            <p className="mt-2 text-sm leading-6 text-[#6f665f]">
              Κάθε ομάδα φωτογραφιών θα ανήκει σε μία τέτοια προσθήκη.
            </p>

            {query.error ? (
              <div className="mt-4 rounded-2xl border border-[#d9b4a6] bg-[#fbf1ed] px-4 py-3 text-sm text-[#7a4938]">
                Έλεγξε τα στοιχεία της προσθήκης και δοκίμασε ξανά.
              </div>
            ) : null}

            <form
              action={`/mixalis/api/chapters/${chapter.id}/batches`}
              method="post"
              className="mt-6 space-y-4"
            >
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
                  placeholder="π.χ. Μάθημα 2 — ταχύτητα"
                  className="w-full rounded-2xl border border-black/15 bg-[#fbfaf8] px-4 py-3 text-sm outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Σημείωση</span>
                <textarea
                  name="notes"
                  rows={3}
                  maxLength={1000}
                  placeholder="π.χ. Νέες ασκήσεις που έδωσε ο καθηγητής"
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
              Επόμενο βήμα: μέσα σε κάθε προσθήκη θα ενεργοποιηθεί πολλαπλό upload φωτογραφιών με private storage.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

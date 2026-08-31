import Link from "next/link";
import { listSavvalasAuditBooks } from "@/lib/mixalis/savvalas-book-audit";
import type { PhysicsCourseCode } from "@/lib/mixalis/source-documents";

const COURSE_ORDER: Array<{
  code: PhysicsCourseCode;
  label: string;
  shortLabel: string;
}> = [
  {
    code: "orientation",
    label: "Φυσική Β΄ Λυκείου Προσανατολισμού",
    shortLabel: "Προσανατολισμού",
  },
  {
    code: "general_education",
    label: "Φυσική Β΄ Λυκείου Γενικής Παιδείας",
    shortLabel: "Γενικής Παιδείας",
  },
];

function formatBytes(bytes: number | null) {
  if (bytes == null) return null;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function statusText(status: string | null) {
  if (status === "ready") return "Audit έτοιμο";
  if (status === "processing") return "Audit σε εξέλιξη";
  if (status === "error") return "Audit χρειάζεται επανάληψη";
  if (status === "superseded") return "Range άλλαξε — νέο audit";
  return "Mapped — δεν έχει γίνει audit";
}

export default async function SavvalasAuditPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    subchapterId?: string;
    error?: string;
    message?: string;
  }>;
}) {
  const query = await searchParams;
  const books = await listSavvalasAuditBooks();

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/mixalis/sources"
            className="inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
          >
            ← Πίσω στη Βιβλιοθήκη Πηγών
          </Link>
          <Link
            href="/mixalis"
            className="inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
          >
            Dashboard
          </Link>
        </div>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
            PHASE3 · Depth Source
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Audit βιβλίων Σαββάλα
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[#6b625b] sm:text-base">
            Κάθε πλήρες PDF αποθηκεύεται μία φορά. Εδώ χαρτογραφούμε τις πραγματικές PDF σελίδες στα επίσημα υποκεφάλαια και αναλύουμε μόνο το σωστό range. Ο Σαββάλας προσθέτει βάθος, παγίδες, στρατηγικές και διδακτικές ανάγκες· δεν αλλάζει την επίσημη ύλη του σχολικού βιβλίου.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f4f0ea] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[#807268]">1</p>
              <p className="mt-1 text-sm font-semibold">Upload μία φορά</p>
              <p className="mt-1 text-xs leading-5 text-[#776d65]">Ιδιωτικό πλήρες PDF στο Source Library.</p>
            </div>
            <div className="rounded-2xl bg-[#f4f0ea] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[#807268]">2</p>
              <p className="mt-1 text-sm font-semibold">Mapping σελίδων</p>
              <p className="mt-1 text-xs leading-5 text-[#776d65]">PDF page range ανά επίσημο υποκεφάλαιο.</p>
            </div>
            <div className="rounded-2xl bg-[#f4f0ea] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[#807268]">3</p>
              <p className="mt-1 text-sm font-semibold">Depth audit</p>
              <p className="mt-1 text-xs leading-5 text-[#776d65]">Structured findings με provenance ανά σελίδα.</p>
            </div>
          </div>
        </header>

        {query.saved ? (
          <div className="mt-5 rounded-2xl border border-[#b8cab5] bg-[#eef5ed] px-4 py-3 text-sm text-[#4f684a]">
            Το page range αποθηκεύτηκε. Αν άλλαξε υπάρχον range, το παλιό depth audit διατηρείται στο ιστορικό και χρειάζεται νέο audit.
          </div>
        ) : null}

        {query.error || query.message ? (
          <div className="mt-5 rounded-2xl border border-[#d9b4a6] bg-[#fbf1ed] px-4 py-3 text-sm text-[#7a4938]">
            {query.message || "Έλεγξε το page range και δοκίμασε ξανά."}
          </div>
        ) : null}

        <div className="mt-7 space-y-8">
          {COURSE_ORDER.map((course) => {
            const book = books.find((item) => item.courseCode === course.code);

            if (!book) {
              return (
                <section
                  key={course.code}
                  className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-6 sm:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#857261]">
                        {course.shortLabel}
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold">{course.label}</h2>
                      <p className="mt-2 text-sm text-[#716860]">
                        Δεν έχει ανέβει ακόμη το πλήρες βιβλίο Σαββάλα.
                      </p>
                    </div>
                    <Link
                      href="/mixalis/sources"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#403630] px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Ανέβασμα PDF
                    </Link>
                  </div>
                </section>
              );
            }

            const totalSubchapters = book.chapters.reduce(
              (sum, chapter) => sum + chapter.subchapters.length,
              0,
            );
            const mapped = book.chapters.reduce(
              (sum, chapter) => sum + chapter.subchapters.filter((item) => item.range).length,
              0,
            );
            const audited = book.chapters.reduce(
              (sum, chapter) =>
                sum + chapter.subchapters.filter((item) => item.range?.analysisStatus === "ready").length,
              0,
            );

            return (
              <section key={course.code} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#eee8f5] px-3 py-1 text-xs font-semibold text-[#65557a]">
                        Depth source
                      </span>
                      <span className="rounded-full bg-[#eef5ed] px-3 py-1 text-xs font-semibold text-[#4f684a]">
                        PDF έτοιμο
                      </span>
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold">{course.label}</h2>
                    <p className="mt-2 max-w-3xl break-all text-sm leading-6 text-[#726960]">
                      {book.originalName || book.title}
                      {book.pageCount ? ` · ${book.pageCount} PDF σελίδες` : ""}
                      {formatBytes(book.sizeBytes) ? ` · ${formatBytes(book.sizeBytes)}` : ""}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs sm:min-w-72">
                    <div className="rounded-2xl bg-[#f4f0ea] p-3">
                      <p className="text-lg font-semibold">{totalSubchapters}</p>
                      <p className="mt-1 text-[#786e66]">σύνολο</p>
                    </div>
                    <div className="rounded-2xl bg-[#f4f0ea] p-3">
                      <p className="text-lg font-semibold">{mapped}</p>
                      <p className="mt-1 text-[#786e66]">mapped</p>
                    </div>
                    <div className="rounded-2xl bg-[#f4f0ea] p-3">
                      <p className="text-lg font-semibold">{audited}</p>
                      <p className="mt-1 text-[#786e66]">audited</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {book.chapters.map((chapter, chapterIndex) => {
                    const chapterMapped = chapter.subchapters.filter((item) => item.range).length;
                    const chapterAudited = chapter.subchapters.filter(
                      (item) => item.range?.analysisStatus === "ready",
                    ).length;

                    return (
                      <details
                        key={chapter.id}
                        open={chapterIndex === 0}
                        className="rounded-2xl border border-black/10 bg-[#fbfaf8]"
                      >
                        <summary className="cursor-pointer list-none px-4 py-4 sm:px-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#87786b]">
                                Κεφάλαιο {chapter.numberLabel || chapterIndex + 1}
                              </p>
                              <h3 className="mt-1 text-lg font-semibold">{chapter.title}</h3>
                            </div>
                            <span className="rounded-full bg-white px-3 py-1.5 text-xs text-[#72675f]">
                              {chapterMapped}/{chapter.subchapters.length} mapped · {chapterAudited} audited
                            </span>
                          </div>
                        </summary>

                        <div className="space-y-3 border-t border-black/10 p-3 sm:p-4">
                          {chapter.subchapters.map((subchapter) => {
                            const range = subchapter.range;
                            const isReady = range?.analysisStatus === "ready";
                            return (
                              <article
                                key={subchapter.id}
                                id={`subchapter-${subchapter.id}`}
                                className={`rounded-2xl border p-4 ${
                                  query.subchapterId === subchapter.id
                                    ? "border-[#9e8a78] bg-[#f8f2e9]"
                                    : "border-black/10 bg-white"
                                }`}
                              >
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                  <div>
                                    <p className="text-xs font-semibold text-[#7f7166]">
                                      {subchapter.numberLabel}
                                    </p>
                                    <h4 className="mt-1 font-semibold">{subchapter.title}</h4>
                                    <p className="mt-1 text-xs text-[#7b7169]">
                                      {range
                                        ? `PDF ${range.filePageFrom}–${range.filePageTo} · ${statusText(range.analysisStatus)}`
                                        : "Δεν έχει χαρτογραφηθεί ακόμη."}
                                    </p>
                                  </div>

                                  {range && isReady && range.analysisId ? (
                                    <Link
                                      href={`/mixalis/source-intelligence/${range.analysisId}`}
                                      className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-[#b7c7b2] bg-[#eef5ed] px-3 py-2 text-xs font-semibold text-[#4f684a]"
                                    >
                                      Δες {range.itemCount} findings →
                                    </Link>
                                  ) : range ? (
                                    <form
                                      action={`/mixalis/api/savvalas-audit/ranges/${range.id}/run`}
                                      method="post"
                                    >
                                      <button
                                        type="submit"
                                        className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-[#4b3d35] px-4 py-2 text-xs font-semibold text-white lg:w-auto"
                                      >
                                        {range.analysisStatus === "error" || range.analysisStatus === "superseded"
                                          ? "Νέο audit"
                                          : "Audit range"}
                                      </button>
                                    </form>
                                  ) : null}
                                </div>

                                <form
                                  action="/mixalis/api/savvalas-audit/ranges"
                                  method="post"
                                  className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                                >
                                  <input type="hidden" name="documentId" value={book.documentId} />
                                  <input type="hidden" name="subchapterId" value={subchapter.id} />

                                  <label className="block">
                                    <span className="mb-1.5 block text-xs font-medium text-[#6d625a]">
                                      PDF σελίδα από
                                    </span>
                                    <input
                                      name="filePageFrom"
                                      type="number"
                                      min={1}
                                      max={book.pageCount ?? undefined}
                                      required
                                      defaultValue={range?.filePageFrom ?? ""}
                                      className="w-full rounded-xl border border-black/15 bg-[#fbfaf8] px-3 py-2.5 text-sm outline-none focus:border-[#847263]"
                                    />
                                  </label>

                                  <label className="block">
                                    <span className="mb-1.5 block text-xs font-medium text-[#6d625a]">
                                      PDF σελίδα έως
                                    </span>
                                    <input
                                      name="filePageTo"
                                      type="number"
                                      min={1}
                                      max={book.pageCount ?? undefined}
                                      required
                                      defaultValue={range?.filePageTo ?? ""}
                                      className="w-full rounded-xl border border-black/15 bg-[#fbfaf8] px-3 py-2.5 text-sm outline-none focus:border-[#847263]"
                                    />
                                  </label>

                                  <button
                                    type="submit"
                                    className="min-h-10 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-xs font-semibold transition hover:bg-[#eee9e2]"
                                  >
                                    {range ? "Ενημέρωση mapping" : "Αποθήκευση mapping"}
                                  </button>
                                </form>
                              </article>
                            );
                          })}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-7 rounded-3xl border border-[#d9ccb9] bg-[#faf5ec] p-5 text-sm leading-6 text-[#695d50] sm:p-6">
          <strong>Γιατί το mapping γίνεται πριν το audit:</strong> δεν στέλνουμε ολόκληρο το βιβλίο στο μοντέλο σε κάθε ανάλυση. Κάθε subchapter χρησιμοποιεί μόνο τις σχετικές PDF σελίδες. Αυτό κρατά χαμηλότερο κόστος, καθαρότερο context και ακριβές provenance για κάθε finding.
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import { listSavvalasAuditBooks } from "@/lib/mixalis/savvalas-book-audit";

export default async function SavvalasAutoMapPage({
  searchParams,
}: {
  searchParams: Promise<{
    autoMapped?: string;
    autoUnresolved?: string;
    autoSkipped?: string;
    autoPages?: string;
    message?: string;
  }>;
}) {
  const query = await searchParams;
  const books = await listSavvalasAuditBooks();

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/mixalis/savvalas-audit" className="text-sm font-medium text-[#6e5d50] hover:underline">
            ← Πίσω στο Audit Σαββάλα
          </Link>
          <Link href="/mixalis" className="text-sm font-medium text-[#6e5d50] hover:underline">
            Dashboard
          </Link>
        </div>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
            PHASE3 · Automatic Mapping
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Αυτόματο mapping βιβλίου Σαββάλα
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[#6b625b] sm:text-base">
            Το AI διαβάζει το πλήρες PDF σε μικρά επικαλυπτόμενα τμήματα, εντοπίζει πού βρίσκεται κάθε επίσημο υποκεφάλαιο και αποθηκεύει ranges μόνο για υποκεφάλαια που δεν έχουν ήδη χειροκίνητο mapping.
          </p>
          <div className="mt-4 rounded-2xl bg-[#f4f0ea] p-4 text-xs leading-5 text-[#70665e] sm:text-sm">
            Ασφάλεια: υπάρχον mapping δεν αντικαθίσταται. Αυτόματη αποθήκευση γίνεται μόνο όταν η συνολική confidence είναι τουλάχιστον 70%. Όσα δεν αναγνωρίζονται με αρκετή βεβαιότητα παραμένουν κενά για ανθρώπινο έλεγχο.
          </div>
        </header>

        {query.autoMapped != null ? (
          <div className="mt-5 rounded-2xl border border-[#b8cab5] bg-[#eef5ed] px-4 py-3 text-sm text-[#4f684a]">
            Έλεγχος {query.autoPages || "–"} PDF σελίδων ολοκληρώθηκε · {query.autoMapped} νέα mappings · {query.autoSkipped || "0"} υπάρχοντα διατηρήθηκαν · {query.autoUnresolved || "0"} χρειάζονται έλεγχο.
          </div>
        ) : null}

        {query.message ? (
          <div className="mt-5 rounded-2xl border border-[#d9b4a6] bg-[#fbf1ed] px-4 py-3 text-sm text-[#7a4938]">
            {query.message}
          </div>
        ) : null}

        <div className="mt-7 space-y-5">
          {books.map((book) => {
            const totalSubchapters = book.chapters.reduce((sum, chapter) => sum + chapter.subchapters.length, 0);
            const mapped = book.chapters.reduce(
              (sum, chapter) => sum + chapter.subchapters.filter((subchapter) => subchapter.range).length,
              0,
            );
            const missing = totalSubchapters - mapped;

            return (
              <section key={book.documentId} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#eef5ed] px-3 py-1 text-xs font-semibold text-[#4f684a]">
                        PDF έτοιμο
                      </span>
                      <span className="rounded-full bg-[#eee8f5] px-3 py-1 text-xs font-semibold text-[#65557a]">
                        {book.pageCount ?? "?"} σελίδες
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold sm:text-2xl">{book.courseTitle}</h2>
                    <p className="mt-1 break-all text-sm text-[#726960]">{book.originalName || book.title}</p>
                    <p className="mt-3 text-sm text-[#6c625a]">
                      {mapped}/{totalSubchapters} mapped · {missing} χωρίς mapping
                    </p>
                  </div>

                  <form action="/mixalis/api/savvalas-audit/auto-map" method="post" className="shrink-0">
                    <input type="hidden" name="documentId" value={book.documentId} />
                    <button
                      type="submit"
                      disabled={missing === 0}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#403630] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                    >
                      {missing === 0 ? "Mapping ολοκληρωμένο" : `AI mapping ${missing} κενών`}
                    </button>
                  </form>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

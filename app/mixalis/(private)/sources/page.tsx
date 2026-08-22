import Link from "next/link";
import SchoolBookPdfUploader from "@/components/mixalis/SchoolBookPdfUploader";
import {
  listSchoolBookDocuments,
  type PhysicsCourseCode,
} from "@/lib/mixalis/source-documents";

const SCHOOL_BOOKS: Array<{
  courseCode: PhysicsCourseCode;
  courseTitle: string;
  bookTitle: string;
  pageCount: number;
}> = [
  {
    courseCode: "general_education",
    courseTitle: "Φυσική Γενικής Παιδείας",
    bookTitle: "Φυσική Β΄ Λυκείου — Γενικής Παιδείας — Βιβλίο Μαθητή",
    pageCount: 210,
  },
  {
    courseCode: "orientation",
    courseTitle: "Φυσική Προσανατολισμού",
    bookTitle:
      "Φυσική Β΄ Λυκείου — Προσανατολισμού Θετικών Σπουδών — Βιβλίο Μαθητή",
    pageCount: 226,
  },
];

function formatBytes(bytes: number | null) {
  if (bytes == null) return null;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function MixalisSourcesPage() {
  const documents = await listSchoolBookDocuments();

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/mixalis"
          className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
        >
          ← Πίσω στις δύο Φυσικές
        </Link>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
            Source Library
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Βιβλιοθήκη Πηγών
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6b625b] sm:text-base">
            Τα επίσημα σχολικά βιβλία αποθηκεύονται μία φορά ως ιδιωτικά PDF. Μετά θα
            συνδέσουμε τις σελίδες τους με τα σωστά κεφάλαια και υποκεφάλαια.
          </p>
        </header>

        <section className="mt-6 grid gap-5">
          {SCHOOL_BOOKS.map((book) => {
            const document = documents.find(
              (item) => item.courseCode === book.courseCode,
            );
            const storedSize = formatBytes(document?.sizeBytes ?? null);

            return (
              <article
                key={book.courseCode}
                className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#f1ede7] px-3 py-1 text-xs font-semibold text-[#74665b]">
                        {book.courseTitle}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          document
                            ? "bg-[#edf4eb] text-[#4f684a]"
                            : "bg-[#f6eee8] text-[#805f50]"
                        }`}
                      >
                        {document ? "PDF αποθηκευμένο" : "Δεν έχει ανέβει"}
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-semibold sm:text-2xl">
                      {book.bookTitle}
                    </h2>
                    <p className="mt-2 text-sm text-[#756c65]">
                      {book.pageCount} PDF σελίδες
                      {storedSize ? ` · ${storedSize}` : ""}
                    </p>

                    {document?.originalName ? (
                      <div className="mt-4 rounded-2xl bg-[#f7f4ef] px-4 py-3 text-sm text-[#655b53]">
                        <span className="font-medium">Αποθηκευμένο αρχείο:</span>{" "}
                        <span className="break-all">{document.originalName}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <SchoolBookPdfUploader
                  courseCode={book.courseCode}
                  pageCount={book.pageCount}
                  uploaded={Boolean(document)}
                  uploadedName={document?.originalName}
                />
              </article>
            );
          })}
        </section>

        <div className="mt-6 rounded-2xl border border-black/10 bg-[#e7ded3] p-5 text-sm leading-6 text-[#65594f]">
          Τα PDF παραμένουν ιδιωτικά. Η εφαρμογή δεν εμφανίζει δημόσιο Blob URL. Η
          προβολή σελίδων θα γίνει αργότερα μόνο μέσα από authenticated route του
          /mixalis.
        </div>
      </div>
    </main>
  );
}

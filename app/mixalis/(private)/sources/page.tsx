import Link from "next/link";
import SchoolBookPdfUploader from "@/components/mixalis/SchoolBookPdfUploader";
import {
  listSavvalasBookDocuments,
  listSchoolBookDocuments,
  type PhysicsCourseCode,
  type PhysicsSourceDocument,
  type PhysicsSourceDocumentKind,
} from "@/lib/mixalis/source-documents";

type BookSlot = {
  courseCode: PhysicsCourseCode;
  courseTitle: string;
  bookTitle: string;
  pageCount?: number | null;
  sourceKind: PhysicsSourceDocumentKind;
};

const SCHOOL_BOOKS: BookSlot[] = [
  {
    courseCode: "general_education",
    courseTitle: "Φυσική Γενικής Παιδείας",
    bookTitle: "Φυσική Β΄ Λυκείου — Γενικής Παιδείας — Βιβλίο Μαθητή",
    pageCount: 210,
    sourceKind: "school_book",
  },
  {
    courseCode: "orientation",
    courseTitle: "Φυσική Προσανατολισμού",
    bookTitle:
      "Φυσική Β΄ Λυκείου — Προσανατολισμού Θετικών Σπουδών — Βιβλίο Μαθητή",
    pageCount: 226,
    sourceKind: "school_book",
  },
];

const SAVVALAS_BOOKS: BookSlot[] = [
  {
    courseCode: "general_education",
    courseTitle: "Φυσική Γενικής Παιδείας",
    bookTitle: "Σαββάλας — Φυσική Β΄ Λυκείου Γενικής Παιδείας",
    pageCount: null,
    sourceKind: "savvalas_book",
  },
  {
    courseCode: "orientation",
    courseTitle: "Φυσική Προσανατολισμού",
    bookTitle: "Σαββάλας — Φυσική Β΄ Λυκείου Προσανατολισμού",
    pageCount: null,
    sourceKind: "savvalas_book",
  },
];

function formatBytes(bytes: number | null) {
  if (bytes == null) return null;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function BookCard({
  book,
  document,
}: {
  book: BookSlot;
  document?: PhysicsSourceDocument;
}) {
  const storedSize = formatBytes(document?.sizeBytes ?? null);
  const isSavvalas = book.sourceKind === "savvalas_book";

  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
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
            {isSavvalas ? (
              <span className="rounded-full bg-[#eee8f5] px-3 py-1 text-xs font-semibold text-[#65557a]">
                Depth source
              </span>
            ) : (
              <span className="rounded-full bg-[#e8edf5] px-3 py-1 text-xs font-semibold text-[#4f6075]">
                Curriculum source
              </span>
            )}
          </div>

          <h2 className="mt-4 text-xl font-semibold sm:text-2xl">{book.bookTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-[#756c65]">
            {isSavvalas
              ? "Πλήρες βοήθημα · θα χαρτογραφηθεί ανά κεφάλαιο και υποκεφάλαιο"
              : `${book.pageCount} PDF σελίδες`}
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
        sourceKind={book.sourceKind}
        pageCount={book.pageCount}
        uploaded={Boolean(document)}
        uploadedName={document?.originalName}
      />
    </article>
  );
}

export default async function MixalisSourcesPage() {
  const [schoolDocuments, savvalasDocuments] = await Promise.all([
    listSchoolBookDocuments(),
    listSavvalasBookDocuments(),
  ]);

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
            Τα βιβλία αποθηκεύονται μία φορά ως ιδιωτικά PDF. Το επίσημο σχολικό βιβλίο ορίζει την ύλη. Ο Σαββάλας χρησιμοποιείται ξεχωριστά για βάθος κατανόησης, ασκήσεις, παγίδες και μεθοδολογία.
          </p>
        </header>

        <section className="mt-6">
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
              Επίσημη ύλη
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Σχολικά βιβλία</h2>
            <p className="mt-2 text-sm leading-6 text-[#736a63]">
              Η επίσημη πηγή για έννοιες, ορισμούς, νόμους, τύπους και όρια της διδακτέας ύλης.
            </p>
          </div>
          <div className="grid gap-5">
            {SCHOOL_BOOKS.map((book) => (
              <BookCard
                key={`${book.sourceKind}-${book.courseCode}`}
                book={book}
                document={schoolDocuments.find(
                  (item) => item.courseCode === book.courseCode,
                )}
              />
            ))}
          </div>
        </section>

        <section className="mt-9">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
                Βάθος & ασκήσεις
              </p>
              <h2 className="mt-1 text-2xl font-semibold">Βιβλία Σαββάλα</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#736a63]">
                Ανέβασε ολόκληρο το βιβλίο μία φορά. Η επόμενη φάση είναι αυτόματη χαρτογράφηση και audit κεφάλαιο-κεφάλαιο, χωρίς ξανά φωτογραφίες ανά σελίδα.
              </p>
            </div>
            <Link
              href="/mixalis/savvalas-audit"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-xl border border-black/15 bg-[#403630] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f2824]"
            >
              Audit Σαββάλα →
            </Link>
          </div>

          <div className="grid gap-5">
            {SAVVALAS_BOOKS.map((book) => (
              <BookCard
                key={`${book.sourceKind}-${book.courseCode}`}
                book={book}
                document={savvalasDocuments.find(
                  (item) => item.courseCode === book.courseCode,
                )}
              />
            ))}
          </div>
        </section>

        <div className="mt-6 rounded-2xl border border-black/10 bg-[#e7ded3] p-5 text-sm leading-6 text-[#65594f]">
          Τα PDF παραμένουν ιδιωτικά. Η εφαρμογή δεν εμφανίζει δημόσιο Blob URL. Η ανάγνωση και το audit γίνονται server-side μέσα από authenticated routes του /mixalis.
        </div>
      </div>
    </main>
  );
}

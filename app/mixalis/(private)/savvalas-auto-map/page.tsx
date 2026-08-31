import Link from "next/link";
import { cookies } from "next/headers";
import { listSavvalasAuditBooks } from "@/lib/mixalis/savvalas-book-audit";
import {
  SAVVALAS_MAPPING_PROPOSAL_COOKIE,
  decodeSavvalasMappingProposal,
} from "@/lib/mixalis/savvalas-mapping-proposal-cookie";

type PageQuery = {
  documentId?: string;
  proposalSubchapterId?: string;
  proposalFrom?: string;
  proposalTo?: string;
  proposalConfidence?: string;
  proposalComplete?: string;
  tocFound?: string;
  tocPrintedFrom?: string;
  tocPrintedTo?: string;
  tocPages?: string;
  verifyFrom?: string;
  verifyTo?: string;
  evidence?: string;
  message?: string;
};

function positiveInt(value: string | undefined) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default async function SavvalasAutoMapPage({
  searchParams,
}: {
  searchParams: Promise<PageQuery>;
}) {
  const queryFromUrl = await searchParams;
  const cookieStore = await cookies();
  const persisted = decodeSavvalasMappingProposal(
    cookieStore.get(SAVVALAS_MAPPING_PROPOSAL_COOKIE)?.value,
  );
  const query: PageQuery = {
    documentId: queryFromUrl.documentId ?? persisted?.documentId,
    proposalSubchapterId:
      queryFromUrl.proposalSubchapterId ?? persisted?.proposalSubchapterId,
    proposalFrom: queryFromUrl.proposalFrom ?? persisted?.proposalFrom,
    proposalTo: queryFromUrl.proposalTo ?? persisted?.proposalTo,
    proposalConfidence:
      queryFromUrl.proposalConfidence ?? persisted?.proposalConfidence,
    proposalComplete: queryFromUrl.proposalComplete ?? persisted?.proposalComplete,
    tocFound: queryFromUrl.tocFound ?? persisted?.tocFound,
    tocPrintedFrom: queryFromUrl.tocPrintedFrom ?? persisted?.tocPrintedFrom,
    tocPrintedTo: queryFromUrl.tocPrintedTo ?? persisted?.tocPrintedTo,
    tocPages: queryFromUrl.tocPages ?? persisted?.tocPages,
    verifyFrom: queryFromUrl.verifyFrom ?? persisted?.verifyFrom,
    verifyTo: queryFromUrl.verifyTo ?? persisted?.verifyTo,
    evidence: queryFromUrl.evidence ?? persisted?.evidence,
    message: queryFromUrl.message,
  };

  const books = await listSavvalasAuditBooks();
  const proposalFrom = positiveInt(query.proposalFrom);
  const proposalTo = positiveInt(query.proposalTo);
  const proposalConfidence = Math.max(
    0,
    Math.min(100, Number(query.proposalConfidence) || 0),
  );
  const proposalComplete = query.proposalComplete === "1";
  const safeProposal =
    proposalFrom != null &&
    proposalTo != null &&
    proposalTo >= proposalFrom &&
    proposalComplete &&
    proposalConfidence >= 70;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
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
            PHASE3 · TOC-first Mapping
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Χαρτογράφηση βιβλίου Σαββάλα
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[#6b625b] sm:text-base">
            Πρώτα διαβάζονται οι αρχικές σελίδες με τη δομή/τα περιεχόμενα του βιβλίου. Μετά γίνεται στοχευμένος έλεγχος στις πραγματικές PDF σελίδες του συγκεκριμένου υποκεφαλαίου.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f4f0ea] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#807268]">1 · TOC</p>
              <p className="mt-1 text-sm font-semibold">Βρίσκουμε τη δομή</p>
              <p className="mt-1 text-xs leading-5 text-[#776d65]">Οι πρώτες έως 28 PDF σελίδες λειτουργούν ως χάρτης πλοήγησης.</p>
            </div>
            <div className="rounded-2xl bg-[#f4f0ea] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#807268]">2 · VERIFY</p>
              <p className="mt-1 text-sm font-semibold">Ελέγχουμε το πραγματικό υλικό</p>
              <p className="mt-1 text-xs leading-5 text-[#776d65]">Γίνεται μόνο ένας περιορισμένος, στοχευμένος έλεγχος — όχι scan ολόκληρου του βιβλίου.</p>
            </div>
            <div className="rounded-2xl bg-[#f4f0ea] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#807268]">3 · REVIEW</p>
              <p className="mt-1 text-sm font-semibold">Επιβεβαιώνουμε πριν σωθεί</p>
              <p className="mt-1 text-xs leading-5 text-[#776d65]">Το AI προτείνει range. Δεν γράφεται τίποτα στη βάση χωρίς ρητή επιβεβαίωση.</p>
            </div>
          </div>
        </header>

        {query.message ? (
          <div className="mt-5 rounded-2xl border border-[#d9b4a6] bg-[#fbf1ed] px-4 py-3 text-sm leading-6 text-[#7a4938]">
            {query.message}
          </div>
        ) : null}

        <div className="mt-7 space-y-7">
          {books.map((book) => {
            const totalSubchapters = book.chapters.reduce((sum, chapter) => sum + chapter.subchapters.length, 0);
            const mapped = book.chapters.reduce(
              (sum, chapter) => sum + chapter.subchapters.filter((subchapter) => subchapter.range).length,
              0,
            );
            const missing = totalSubchapters - mapped;

            return (
              <section key={book.documentId} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#eef5ed] px-3 py-1 text-xs font-semibold text-[#4f684a]">PDF έτοιμο</span>
                      <span className="rounded-full bg-[#eee8f5] px-3 py-1 text-xs font-semibold text-[#65557a]">{book.pageCount ?? "?"} PDF σελίδες</span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold sm:text-2xl">{book.courseTitle}</h2>
                    <p className="mt-1 break-all text-sm text-[#726960]">{book.originalName || book.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs sm:min-w-48">
                    <div className="rounded-2xl bg-[#f4f0ea] p-3">
                      <p className="text-lg font-semibold">{mapped}</p>
                      <p className="mt-1 text-[#786e66]">mapped</p>
                    </div>
                    <div className="rounded-2xl bg-[#f4f0ea] p-3">
                      <p className="text-lg font-semibold">{missing}</p>
                      <p className="mt-1 text-[#786e66]">μένουν</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {book.chapters.map((chapter, chapterIndex) => {
                    const chapterMapped = chapter.subchapters.filter((item) => item.range).length;
                    return (
                      <details
                        key={chapter.id}
                        open={chapterIndex === 0}
                        className="rounded-2xl border border-black/10 bg-[#fbfaf8]"
                      >
                        <summary className="cursor-pointer list-none px-4 py-4 sm:px-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#87786b]">Κεφάλαιο {chapter.numberLabel || chapterIndex + 1}</p>
                              <h3 className="mt-1 text-lg font-semibold">{chapter.title}</h3>
                            </div>
                            <span className="rounded-full bg-white px-3 py-1.5 text-xs text-[#72675f]">{chapterMapped}/{chapter.subchapters.length} mapped</span>
                          </div>
                        </summary>

                        <div className="space-y-3 border-t border-black/10 p-3 sm:p-4">
                          {chapter.subchapters.map((subchapter) => {
                            const isProposal =
                              query.documentId === book.documentId &&
                              query.proposalSubchapterId === subchapter.id &&
                              proposalFrom != null &&
                              proposalTo != null;
                            const tocPrintedFrom = positiveInt(query.tocPrintedFrom);
                            const tocPrintedTo = positiveInt(query.tocPrintedTo);
                            const verifyFrom = positiveInt(query.verifyFrom);
                            const verifyTo = positiveInt(query.verifyTo);

                            return (
                              <article
                                key={subchapter.id}
                                className={`rounded-2xl border p-4 ${isProposal ? "border-[#9d886f] bg-[#fffaf2]" : "border-black/10 bg-white"}`}
                              >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="text-xs font-semibold text-[#7f7166]">{subchapter.numberLabel}</p>
                                    <h4 className="mt-1 font-semibold">{subchapter.title}</h4>
                                    <p className="mt-1 text-xs text-[#7b7169]">
                                      {subchapter.range
                                        ? `PDF ${subchapter.range.filePageFrom}–${subchapter.range.filePageTo} · mapping υπάρχει`
                                        : "Δεν έχει επιβεβαιωμένο mapping."}
                                    </p>
                                  </div>

                                  {!subchapter.range ? (
                                    <form action="/mixalis/api/savvalas-audit/auto-map" method="post" className="shrink-0">
                                      <input type="hidden" name="documentId" value={book.documentId} />
                                      <input type="hidden" name="subchapterId" value={subchapter.id} />
                                      <button
                                        type="submit"
                                        className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-[#403630] px-4 py-2 text-xs font-semibold text-white sm:w-auto"
                                      >
                                        Πρότεινε mapping
                                      </button>
                                    </form>
                                  ) : (
                                    <Link
                                      href={`/mixalis/savvalas-audit#subchapter-${subchapter.id}`}
                                      className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-[#66584d]"
                                    >
                                      Δες στο audit →
                                    </Link>
                                  )}
                                </div>

                                {isProposal ? (
                                  <div className="mt-4 rounded-2xl border border-[#d7c7b3] bg-white p-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                      <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#806f60]">Πρόταση AI — αναμένει επιβεβαίωση</p>
                                        <p className="mt-2 text-xl font-semibold">PDF {proposalFrom}–{proposalTo}</p>
                                        <p className="mt-1 text-sm text-[#6f6258]">Confidence {proposalConfidence}% · {proposalComplete ? "βρέθηκαν και τα δύο όρια" : "δεν επιβεβαιώθηκαν πλήρως τα όρια"}</p>
                                      </div>
                                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${safeProposal ? "bg-[#eef5ed] text-[#4f684a]" : "bg-[#fbf1ed] text-[#7a4938]"}`}>
                                        {safeProposal ? "Έτοιμο για ανθρώπινη επιβεβαίωση" : "Χρειάζεται έλεγχο"}
                                      </span>
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                      <div className="rounded-xl bg-[#f7f3ed] p-3 text-xs leading-5 text-[#6e6258]">
                                        <strong>TOC pass:</strong> {query.tocFound === "1" ? `βρέθηκε${tocPrintedFrom ? ` · τυπωμένη σελίδα ${tocPrintedFrom}${tocPrintedTo ? `–${tocPrintedTo}` : ""}` : ""}` : "δεν έδωσε ασφαλές page hint"}. Ελέγχθηκαν οι πρώτες {positiveInt(query.tocPages) ?? "–"} PDF σελίδες.
                                      </div>
                                      <div className="rounded-xl bg-[#f7f3ed] p-3 text-xs leading-5 text-[#6e6258]">
                                        <strong>Verification pass:</strong> ελέγχθηκαν μόνο οι PDF σελίδες {verifyFrom ?? "–"}–{verifyTo ?? "–"} για το πραγματικό σώμα της ενότητας.
                                      </div>
                                    </div>

                                    {query.evidence ? (
                                      <p className="mt-3 text-xs leading-5 text-[#756960]"><strong>Evidence:</strong> {query.evidence}</p>
                                    ) : null}

                                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                      {safeProposal ? (
                                        <form action="/mixalis/api/savvalas-audit/ranges" method="post" className="sm:flex-1">
                                          <input type="hidden" name="documentId" value={book.documentId} />
                                          <input type="hidden" name="subchapterId" value={subchapter.id} />
                                          <input type="hidden" name="filePageFrom" value={proposalFrom} />
                                          <input type="hidden" name="filePageTo" value={proposalTo} />
                                          <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#4b3d35] px-4 py-2.5 text-sm font-semibold text-white">
                                            Επιβεβαίωση και αποθήκευση mapping
                                          </button>
                                        </form>
                                      ) : (
                                        <p className="rounded-xl bg-[#fbf1ed] px-4 py-3 text-xs leading-5 text-[#7a4938] sm:flex-1">
                                          Δεν επιτρέπεται αυτόματη αποθήκευση: απαιτείται complete range και confidence ≥70%. Μπορείς να ξανατρέξεις την πρόταση ή να ορίσεις χειροκίνητα το range στο Audit Σαββάλα.
                                        </p>
                                      )}
                                      <form action="/mixalis/api/savvalas-audit/auto-map/discard" method="post">
                                        <button
                                          type="submit"
                                          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium sm:w-auto"
                                        >
                                          Απόρριψη
                                        </button>
                                      </form>
                                    </div>
                                  </div>
                                ) : null}
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
      </div>
    </main>
  );
}

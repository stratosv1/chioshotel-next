import Link from "next/link";
import { getOfficialMappingPageData } from "@/lib/mixalis/official-auto-mapping";

type PageQuery = {
  subchapterId?: string;
  documentId?: string;
  chapterId?: string;
  proposalFrom?: string;
  proposalTo?: string;
  confidence?: string;
  complete?: string;
  verifyFrom?: string;
  verifyTo?: string;
  evidence?: string;
  message?: string;
};

function positiveInt(value: string | undefined) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default async function OfficialAutoMapPage({
  searchParams,
}: {
  searchParams: Promise<PageQuery>;
}) {
  const query = await searchParams;
  const subchapterId = String(query.subchapterId || "");

  if (!subchapterId) {
    return (
      <main className="min-h-screen bg-[#f3efe8] px-4 py-6 text-[#2c2825] sm:px-8 sm:py-9">
        <div className="mx-auto max-w-4xl rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#857261]">PHASE3 · Official Mapping</p>
          <h1 className="mt-2 text-3xl font-semibold">Δεν επιλέχθηκε υποκεφάλαιο</h1>
          <p className="mt-3 text-sm leading-6 text-[#6b625b]">Άνοιξε το υποκεφάλαιο από το Physics Pipeline και επίλεξε «Έλεγχος σχολικού range».</p>
          <Link href="/mixalis" className="mt-5 inline-flex rounded-xl bg-[#403630] px-4 py-2.5 text-sm font-semibold text-white">Επιστροφή στο Physics Workspace</Link>
        </div>
      </main>
    );
  }

  let data;
  try {
    data = await getOfficialMappingPageData(subchapterId);
  } catch (error) {
    return (
      <main className="min-h-screen bg-[#f3efe8] px-4 py-6 text-[#2c2825] sm:px-8 sm:py-9">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#d9b4a6] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#857261]">PHASE3 · Official Mapping</p>
          <h1 className="mt-2 text-2xl font-semibold">Το school-book mapping δεν μπορεί να ανοίξει</h1>
          <p className="mt-3 text-sm leading-6 text-[#7a4938]">{error instanceof Error ? error.message : "Άγνωστο σφάλμα."}</p>
          <Link href="/mixalis" className="mt-5 inline-flex rounded-xl border border-black/15 px-4 py-2.5 text-sm font-semibold">Επιστροφή</Link>
        </div>
      </main>
    );
  }

  const proposalFrom = positiveInt(query.proposalFrom);
  const proposalTo = positiveInt(query.proposalTo);
  const confidence = Math.max(0, Math.min(100, Number(query.confidence) || 0));
  const complete = query.complete === "1";
  const verifyFrom = positiveInt(query.verifyFrom);
  const verifyTo = positiveInt(query.verifyTo);
  const proposalMatches =
    query.documentId === data.documentId &&
    query.chapterId === data.chapterId &&
    proposalFrom != null &&
    proposalTo != null &&
    proposalTo >= proposalFrom;
  const safeProposal = proposalMatches && complete && confidence >= 70;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/mixalis/chapters/${data.chapterId}`} className="text-sm font-medium text-[#6e5d50] hover:underline">← Πίσω στο κεφάλαιο</Link>
          <Link href="/mixalis" className="text-sm font-medium text-[#6e5d50] hover:underline">Dashboard</Link>
        </div>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">PHASE3 · Official School Book Mapping</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{data.numberLabel} · {data.title}</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[#6b625b] sm:text-base">
            Το AI εντοπίζει μόνο τις επίσημες PDF σελίδες του σχολικού βιβλίου. Η πρόταση δεν αποθηκεύεται χωρίς ανθρώπινη επιβεβαίωση.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f4f0ea] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#807268]">Επίσημη πηγή</p>
              <p className="mt-1 text-sm font-semibold">{data.documentName}</p>
              <p className="mt-1 text-xs text-[#776d65]">{data.pageCount} PDF σελίδες</p>
            </div>
            <div className="rounded-2xl bg-[#f4f0ea] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#807268]">Προηγούμενο anchor</p>
              <p className="mt-1 text-sm font-semibold">{data.previousMappedLabel || "—"}</p>
              <p className="mt-1 text-xs text-[#776d65]">{data.previousMappedFrom ? `PDF ${data.previousMappedFrom}–${data.previousMappedTo}` : "Δεν υπάρχει"}</p>
            </div>
            <div className="rounded-2xl bg-[#f4f0ea] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#807268]">Επόμενο anchor</p>
              <p className="mt-1 text-sm font-semibold">{data.nextMappedLabel || "—"}</p>
              <p className="mt-1 text-xs text-[#776d65]">{data.nextMappedFrom ? `PDF ${data.nextMappedFrom}–${data.nextMappedTo}` : "Δεν υπάρχει"}</p>
            </div>
          </div>
        </header>

        {query.message ? (
          <div className="mt-5 rounded-2xl border border-[#d9b4a6] bg-[#fbf1ed] px-4 py-3 text-sm leading-6 text-[#7a4938]">{query.message}</div>
        ) : null}

        {data.existingFrom != null && data.existingTo != null ? (
          <section className="mt-6 rounded-3xl border border-[#bfd2b9] bg-white p-6 shadow-sm sm:p-7">
            <span className="rounded-full bg-[#eef5ed] px-3 py-1 text-xs font-semibold text-[#4f684a]">Official mapping επιβεβαιωμένο</span>
            <h2 className="mt-3 text-2xl font-semibold">PDF {data.existingFrom}–{data.existingTo}</h2>
            <p className="mt-2 text-sm leading-6 text-[#6d645d]">Το school-book range υπάρχει ήδη. Επέστρεψε στο κεφάλαιο για να συνεχίσεις με Official Intelligence.</p>
            <Link href={`/mixalis/chapters/${data.chapterId}`} className="mt-5 inline-flex rounded-xl bg-[#403630] px-4 py-2.5 text-sm font-semibold text-white">Συνέχεια στο Physics Pipeline</Link>
          </section>
        ) : (
          <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#857261]">Βήμα 1</p>
                <h2 className="mt-1 text-xl font-semibold">Εντοπισμός official PDF range</h2>
                <p className="mt-2 text-sm leading-6 text-[#6d645d]">Χρησιμοποιούνται πρώτα τα ήδη επιβεβαιωμένα γειτονικά ranges και μετά γίνεται στοχευμένο verification στο PDF.</p>
              </div>
              <form action="/mixalis/api/official-auto-map/propose" method="post">
                <input type="hidden" name="subchapterId" value={data.subchapterId} />
                <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#403630] px-5 py-2.5 text-sm font-semibold text-white sm:w-auto">Πρότεινε official mapping</button>
              </form>
            </div>
          </section>
        )}

        {proposalMatches && data.existingFrom == null ? (
          <section className="mt-6 rounded-3xl border border-[#cdbb9e] bg-[#fffaf2] p-6 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#806f60]">Πρόταση AI · αναμένει επιβεβαίωση</p>
                <h2 className="mt-2 text-3xl font-semibold">PDF {proposalFrom}–{proposalTo}</h2>
                <p className="mt-1 text-sm text-[#6f6258]">Confidence {confidence}% · {complete ? "βρέθηκαν και τα δύο όρια" : "δεν επιβεβαιώθηκαν πλήρως τα όρια"}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${safeProposal ? "bg-[#eef5ed] text-[#4f684a]" : "bg-[#fbf1ed] text-[#7a4938]"}`}>
                {safeProposal ? "Έτοιμο για επιβεβαίωση" : "Χρειάζεται νέο έλεγχο"}
              </span>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-[#675d55]">
              <p><strong>Verification window:</strong> {verifyFrom && verifyTo ? `PDF ${verifyFrom}–${verifyTo}` : "—"}</p>
              {query.evidence ? <p className="mt-2"><strong>Evidence:</strong> {query.evidence}</p> : null}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {safeProposal ? (
                <form action="/mixalis/api/official-auto-map/confirm" method="post" className="sm:flex-1">
                  <input type="hidden" name="subchapterId" value={data.subchapterId} />
                  <input type="hidden" name="documentId" value={data.documentId} />
                  <input type="hidden" name="chapterId" value={data.chapterId} />
                  <input type="hidden" name="filePageFrom" value={proposalFrom ?? ""} />
                  <input type="hidden" name="filePageTo" value={proposalTo ?? ""} />
                  <input type="hidden" name="confidence" value={confidence} />
                  <input type="hidden" name="complete" value={complete ? "1" : "0"} />
                  <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#4f684a] px-5 py-2.5 text-sm font-semibold text-white">Επιβεβαίωση και αποθήκευση mapping</button>
                </form>
              ) : null}
              <Link href={`/mixalis/official-auto-map?subchapterId=${data.subchapterId}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#66584d]">Απόρριψη / νέα πρόταση</Link>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

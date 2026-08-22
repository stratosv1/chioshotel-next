import Link from "next/link";
import { notFound } from "next/navigation";
import SourceIntelligenceRunner from "@/components/mixalis/SourceIntelligenceRunner";
import { getOfficialRangeForSubchapter } from "@/lib/mixalis/official-source-intelligence";
import { getSourceAnalysisView } from "@/lib/mixalis/source-intelligence";

const itemTypeLabels: Record<string, string> = {
  reasoning_requirement: "Απαίτηση συλλογισμού",
  quantity_dependency: "Σχέση φυσικών μεγεθών",
  hidden_information: "Κρυμμένη πληροφορία",
  misconception: "Παρανόηση",
  trap: "Παγίδα",
  combined_concepts: "Συνδυασμός εννοιών",
  unusual_context: "Κρυμμένο / ασυνήθιστο πλαίσιο",
  difficult_case: "Δύσκολη περίπτωση",
  solution_strategy: "Στρατηγική επίλυσης",
  understanding_depth: "Απαιτούμενο βάθος",
  teaching_implication: "Διδακτική ανάγκη για τη θεωρία",
  teacher_emphasis: "Έμφαση καθηγητή",
};

function sourceRoleLabel(value: string) {
  if (value === "depth") return "Πηγή βάθους κατανόησης";
  if (value === "teacher") return "Υλικό καθηγητή";
  if (value === "official") return "Επίσημη πηγή";
  return "Συμπληρωματική πηγή";
}

export default async function MixalisSourceIntelligencePage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = await params;
  const view = await getSourceAnalysisView(analysisId);
  if (!view) notFound();

  const { context } = view;
  const officialRangeId = view.schoolBookMapped
    ? await getOfficialRangeForSubchapter(context.subchapterId)
    : null;
  const understanding = view.items.filter((item) => item.layer === "understanding");
  const teaching = view.items.filter((item) => item.layer === "teaching");

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/mixalis/chapters/${context.chapterId}`}
          className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
        >
          ← Πίσω στο κεφάλαιο
        </Link>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
            PHASE3 · Source Intelligence
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {context.subchapterNumberLabel} · {context.subchapterTitle}
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[#6b625b] sm:text-base">
            Αυτή η σελίδα δεν δημιουργεί μάθημα. Μετατρέπει την πηγή σε δομημένη γνώση για το απαιτούμενο βάθος κατανόησης. Το START θα χρησιμοποιηθεί αργότερα, μόνο αφού συντεθεί και η επίσημη γνώση του σχολικού βιβλίου.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#746a62]">
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">
              {context.courseTitle}
            </span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">
              {context.sourceLabel || context.sourceType || "Πηγή"}
            </span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">
              {sourceRoleLabel(context.sourceRole)}
            </span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">
              {context.totalUnits} φωτογραφίες
            </span>
          </div>
        </header>

        <SourceIntelligenceRunner
          analysisId={context.id}
          initialStatus={context.status}
          initialProcessedUnits={context.processedUnits}
          totalUnits={context.totalUnits}
          initialFindingsCount={view.items.length}
          schoolBookMapped={view.schoolBookMapped}
        />

        {!view.schoolBookMapped ? (
          <section className="mt-6 rounded-3xl border border-[#ddc8aa] bg-[#fbf5e9] p-5 text-sm leading-6 text-[#6e5a3d]">
            <strong>Σημαντικό:</strong> η ανάλυση του Σαββάλα μπορεί να ολοκληρωθεί τώρα, αλλά δεν θα δημιουργηθεί ακόμη canonical Subchapter Intelligence ούτε μάθημα. Πρώτα πρέπει να χαρτογραφηθεί το αντίστοιχο range του επίσημου σχολικού βιβλίου, επειδή μόνο αυτό καθορίζει την επίσημη ύλη.
          </section>
        ) : null}

        {context.status === "ready" && officialRangeId ? (
          <section className="mt-6 rounded-3xl border border-[#bfcab8] bg-[#f2f6ef] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#66735f]">
              Επόμενο στάδιο · START / PHASE3
            </p>
            <h2 className="mt-2 text-xl font-semibold">Το σχολικό range είναι πλέον χαρτογραφημένο</h2>
            <p className="mt-2 text-sm leading-6 text-[#596553]">
              Ο Σαββάλας έχει δώσει το depth intelligence. Τώρα αναλύουμε μόνο τις επίσημες σελίδες του σχολικού βιβλίου για έννοιες, ορισμούς, φυσικά μεγέθη, αρχές, σχέσεις και όρια της ύλης. Δεν δημιουργείται ακόμη μάθημα.
            </p>
            <Link
              href={`/mixalis/api/source-intelligence/from-source-range/${officialRangeId}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[#493d35] px-4 py-3.5 text-sm font-semibold text-white sm:w-auto"
            >
              Άνοιγμα Official School Book Intelligence
            </Link>
          </section>
        ) : null}

        {context.errorMessage && context.status !== "ready" ? (
          <section className="mt-4 rounded-2xl border border-[#e0c4b8] bg-[#fbf1ed] p-4 text-sm leading-6 text-[#794c3d]">
            <strong>Τελευταίο σφάλμα:</strong> {context.errorMessage}
          </section>
        ) : null}

        {context.status === "ready" ? (
          <div className="mt-6 space-y-6">
            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
                Understanding Intelligence
              </p>
              <h2 className="mt-1 text-2xl font-semibold">Τι απαιτούν πραγματικά οι ασκήσεις</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6e655e]">
                Σχέσεις, συλλογισμοί, παγίδες και βάθος κατανόησης που πρέπει αργότερα να επηρεάσουν τη διδασκαλία της θεωρίας.
              </p>

              <div className="mt-6 space-y-3">
                {understanding.length > 0 ? (
                  understanding.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-black/10 bg-[#fbfaf8] p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#756a62]">
                        <span className="rounded-full bg-[#eee7de] px-2.5 py-1 font-medium">
                          {itemTypeLabels[item.itemType] || item.itemType}
                        </span>
                        <span>{item.importance}</span>
                        <span>·</span>
                        <span>{Math.round(item.confidence * 100)}% confidence</span>
                        <span>·</span>
                        <span>{item.evidenceCount} evidence</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#625a54]">{item.content}</p>
                    </article>
                  ))
                ) : (
                  <p className="rounded-2xl bg-[#f7f4ef] p-4 text-sm text-[#756c65]">
                    Δεν προέκυψαν structured understanding findings.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
                Teaching Intelligence
              </p>
              <h2 className="mt-1 text-2xl font-semibold">Τι πρέπει να αλλάξει στη διδασκαλία της θεωρίας</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6e655e]">
                Αυτά δεν είναι το μάθημα. Είναι απαιτήσεις προς το START για το πού η θεωρία πρέπει να γίνει βαθύτερη, σαφέστερη ή να προετοιμάσει καλύτερα τη μεταφορά γνώσης.
              </p>

              <div className="mt-6 space-y-3">
                {teaching.length > 0 ? (
                  teaching.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-[#d8cbbb] bg-[#faf6f0] p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#756a62]">
                        <span className="rounded-full bg-white px-2.5 py-1 font-medium">
                          {itemTypeLabels[item.itemType] || item.itemType}
                        </span>
                        <span>{item.importance}</span>
                        <span>·</span>
                        <span>{item.evidenceCount} evidence</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#625a54]">{item.content}</p>
                    </article>
                  ))
                ) : (
                  <p className="rounded-2xl bg-[#f7f4ef] p-4 text-sm text-[#756c65]">
                    Δεν προέκυψαν ακόμη teaching implications.
                  </p>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}

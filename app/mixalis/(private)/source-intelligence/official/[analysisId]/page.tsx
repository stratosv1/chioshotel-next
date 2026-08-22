import Link from "next/link";
import { notFound } from "next/navigation";
import OfficialSourceIntelligenceRunner from "@/components/mixalis/OfficialSourceIntelligenceRunner";
import { getOfficialAnalysisView } from "@/lib/mixalis/official-source-intelligence";

const itemTypeLabels: Record<string, string> = {
  concept: "Έννοια",
  definition: "Ορισμός",
  physical_quantity: "Φυσικό μέγεθος",
  law: "Νόμος / αρχή",
  formula: "Τύπος / σχέση",
  assumption: "Προϋπόθεση / παραδοχή",
  prerequisite: "Προαπαιτούμενο",
  curriculum_boundary: "Όριο επίσημης ύλης",
  worked_example: "Παράδειγμα σχολικού βιβλίου",
};

export default async function MixalisOfficialSourceIntelligencePage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = await params;
  const view = await getOfficialAnalysisView(analysisId);
  if (!view) notFound();

  const range = view.range;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/mixalis/chapters/${range.chapterId}`}
          className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
        >
          ← Πίσω στο κεφάλαιο
        </Link>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
            PHASE3 · Official School Book Intelligence
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {range.subchapterNumberLabel} · {range.subchapterTitle}
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[#6b625b] sm:text-base">
            Αυτό το στάδιο διαβάζει μόνο το χαρτογραφημένο range του επίσημου σχολικού βιβλίου και ορίζει το curriculum layer. Δεν γράφει μάθημα και δεν προσθέτει βάθος από βοηθήματα.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#746a62]">
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">{range.courseTitle}</span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">Επίσημη πηγή</span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">
              PDF {range.filePageFrom}–{range.filePageTo}
            </span>
            {range.printedPageFrom != null && range.printedPageTo != null ? (
              <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">
                Έντυπο {range.printedPageFrom}–{range.printedPageTo}
              </span>
            ) : null}
          </div>
        </header>

        <section className="mt-6 rounded-3xl border border-[#bfcab8] bg-[#f2f6ef] p-5 text-sm leading-6 text-[#53604d]">
          <strong>Κανόνας START:</strong> το σχολικό βιβλίο καθορίζει την επίσημη ύλη. Τα 40 findings του Σαββάλα παραμένουν ξεχωριστό depth intelligence και θα ενωθούν αργότερα στο Subchapter Intelligence.
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.14em] text-[#847466]">Κατάσταση</p>
            <p className="mt-2 text-xl font-semibold">
              {view.status === "ready"
                ? "Ολοκληρωμένη"
                : view.status === "processing"
                  ? "Σε ανάλυση"
                  : view.status === "error"
                    ? "Χρειάζεται επανάληψη"
                    : "Έτοιμη"}
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.14em] text-[#847466]">Επίσημο range</p>
            <p className="mt-2 text-xl font-semibold">
              {range.filePageFrom}–{range.filePageTo}
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.14em] text-[#847466]">Curriculum findings</p>
            <p className="mt-2 text-xl font-semibold">{view.items.length}</p>
          </div>
        </section>

        <section className="mt-6">
          <OfficialSourceIntelligenceRunner
            analysisId={view.analysisId}
            initialStatus={view.status}
            initialProcessedUnits={view.processedUnits}
            totalUnits={view.totalUnits}
            initialFindingsCount={view.items.length}
          />
        </section>

        {view.errorMessage && view.status !== "ready" ? (
          <section className="mt-4 rounded-2xl border border-[#e0c4b8] bg-[#fbf1ed] p-4 text-sm leading-6 text-[#794c3d]">
            <strong>Τελευταίο σφάλμα:</strong> {view.errorMessage}
          </section>
        ) : null}

        {view.status === "ready" ? (
          <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
              Curriculum Intelligence
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Τι ορίζει επίσημα το σχολικό βιβλίο</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6e655e]">
              Έννοιες, ορισμοί, φυσικά μεγέθη, αρχές, σχέσεις, προϋποθέσεις και όρια που υποστηρίζονται από τις χαρτογραφημένες σελίδες.
            </p>

            <div className="mt-6 space-y-3">
              {view.items.map((item) => (
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
              ))}
            </div>
          </section>
        ) : null}

        {view.status === "ready" ? (
          <section className="mt-6 rounded-3xl border border-[#d8cbbb] bg-[#faf6f0] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#857261]">
              Επόμενο στάδιο
            </p>
            <h2 className="mt-2 text-xl font-semibold">Subchapter Intelligence v1</h2>
            <p className="mt-2 text-sm leading-6 text-[#6e655e]">
              Όταν ολοκληρωθεί αυτό το official layer, το επόμενο build θα συνθέσει το School Book Intelligence με το ήδη ολοκληρωμένο Savvalas Intelligence. Μόνο μετά θα μπει το START για Lesson Revision 1.
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}

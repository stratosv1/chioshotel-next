import Link from "next/link";
import { notFound } from "next/navigation";
import SubchapterIntelligenceRunner from "@/components/mixalis/SubchapterIntelligenceRunner";
import { getCurrentLessonBySubchapter } from "@/lib/mixalis/lesson-navigation";
import {
  getSubchapterIntelligenceView,
  type SubchapterIntelligenceContent,
} from "@/lib/mixalis/subchapter-intelligence";

function roleLabel(role: string) {
  if (role === "official") return "Επίσημη ύλη";
  if (role === "depth") return "Βάθος κατανόησης";
  if (role === "teacher") return "Υλικό καθηγητή";
  if (role === "assessment") return "Αξιολόγηση";
  return "Συμπληρωματική πηγή";
}

function Entries({
  items,
}: {
  items: Array<{
    title: string;
    content: string;
    importance: string;
    sourceItemIds: string[];
  }>;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-[#786f68]">Δεν προέκυψαν στοιχεία σε αυτή την κατηγορία.</p>;
  }
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <article key={`${item.title}-${index}`} className="rounded-2xl border border-black/10 bg-[#fbfaf8] p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#7a7068]">
            <span className="rounded-full bg-[#eee7de] px-2.5 py-1">{item.importance}</span>
            <span>{item.sourceItemIds.length} source findings</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#625a54]">{item.content}</p>
        </article>
      ))}
    </div>
  );
}

export default async function MixalisSubchapterIntelligencePage({
  params,
}: {
  params: Promise<{ versionId: string }>;
}) {
  const { versionId } = await params;
  const view = await getSubchapterIntelligenceView(versionId);
  if (!view) notFound();

  const currentLesson = await getCurrentLessonBySubchapter(view.subchapterId);
  const findingCount = view.sources.reduce((sum, source) => sum + source.itemCount, 0);
  const ready = view.status === "current" || view.status === "superseded";
  const content = ready ? (view.content as SubchapterIntelligenceContent) : null;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/mixalis/chapters/${view.chapterId}`}
          className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
        >
          ← Πίσω στο κεφάλαιο
        </Link>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
            PHASE3 · Canonical Subchapter Intelligence
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {view.subchapterNumberLabel} · {view.subchapterTitle}
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[#6b625b] sm:text-base">
            Εδώ ενώνονται η επίσημη ύλη του σχολικού βιβλίου και το απαιτούμενο βάθος των ασκήσεων. Αυτό είναι το ενιαίο knowledge brief που καταναλώνει το START.
            {currentLesson ? ` Το Lesson Revision ${currentLesson.revisionNumber} έχει ήδη δημιουργηθεί και είναι το current μάθημα.` : " Δεν έχει δημιουργηθεί ακόμη μάθημα."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#746a62]">
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">{view.courseTitle}</span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">Version {view.versionNumber}</span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">
              {ready ? "Current" : "Draft"}
            </span>
            {currentLesson ? (
              <span className="rounded-full bg-[#eaf2e7] px-3 py-1.5 text-[#53694e]">
                Lesson Revision {currentLesson.revisionNumber} · current
              </span>
            ) : null}
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8a7d72]">ΠΗΓΕΣ</p>
            <p className="mt-2 text-3xl font-semibold">{view.sources.length}</p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8a7d72]">SOURCE FINDINGS</p>
            <p className="mt-2 text-3xl font-semibold">{findingCount}</p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8a7d72]">ΚΑΤΑΣΤΑΣΗ</p>
            <p className="mt-2 text-2xl font-semibold">{ready ? "Έτοιμη" : "Προς σύνθεση"}</p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#857261]">Sources</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {view.sources.map((source) => (
              <article key={source.analysisId} className="rounded-2xl bg-[#f7f4ef] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#857261]">
                  {roleLabel(source.sourceRole)}
                </p>
                <p className="mt-2 font-semibold">{source.sourceLabel || "Πηγή"}</p>
                <p className="mt-1 text-sm text-[#716861]">{source.itemCount} structured findings</p>
              </article>
            ))}
          </div>
        </section>

        <SubchapterIntelligenceRunner
          versionId={view.id}
          initialStatus={view.status}
          initialErrorMessage={view.errorMessage}
          versionNumber={view.versionNumber}
          sourceCount={view.sources.length}
          findingCount={findingCount}
          currentLesson={currentLesson ? {
            revisionId: currentLesson.revisionId,
            revisionNumber: currentLesson.revisionNumber,
          } : null}
        />

        {content ? (
          <div className="mt-6 space-y-6">
            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#857261]">Canonical Summary</p>
              <h2 className="mt-2 text-2xl font-semibold">
                Τι πρέπει να γνωρίζει το σύστημα για το {view.subchapterNumberLabel}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#625a54] sm:text-base">{content.summary}</p>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#857261]">Curriculum</p>
              <h2 className="mt-2 text-2xl font-semibold">Επίσημη γνώση και όρια</h2>
              <div className="mt-6 space-y-7">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Έννοιες · ορισμοί · φυσικά μεγέθη</h3>
                  <Entries items={content.curriculum.conceptsDefinitionsQuantities} />
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Νόμοι · τύποι · προϋποθέσεις</h3>
                  <Entries items={content.curriculum.lawsFormulasAssumptions} />
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Προαπαιτούμενα · όρια ύλης</h3>
                  <Entries items={content.curriculum.prerequisitesAndBoundaries} />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#857261]">Understanding Depth</p>
              <h2 className="mt-2 text-2xl font-semibold">Πόσο βαθιά πρέπει να κατανοηθεί</h2>
              <div className="mt-6 space-y-7">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Σχέσεις και συλλογισμοί</h3>
                  <Entries items={content.depth.dependenciesAndReasoning} />
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Παρανοήσεις και παγίδες</h3>
                  <Entries items={content.depth.misconceptionsAndTraps} />
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Συνδυασμοί · πλαίσια · στρατηγικές</h3>
                  <Entries items={content.depth.combinationsContextsAndStrategies} />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#d9ccbb] bg-[#faf6f0] p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#857261]">Teaching Intelligence</p>
              <h2 className="mt-2 text-2xl font-semibold">Απαιτήσεις προς το START</h2>
              <div className="mt-6 space-y-7">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Σειρά και προετοιμασία</h3>
                  <Entries items={content.teaching.sequenceRequirements} />
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Τι πρέπει να εξηγηθεί βαθύτερα</h3>
                  <Entries items={content.teaching.explanationRequirements} />
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Μεταφορά και έλεγχος κατανόησης</h3>
                  <Entries items={content.teaching.transferAndAssessmentRequirements} />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#d7c5a8] bg-[#fbf5e9] p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#826d4f]">Scope Guardrails</p>
              <h2 className="mt-2 text-2xl font-semibold">Τι δεν πρέπει να ξεφύγει από την επίσημη ύλη</h2>
              <div className="mt-5"><Entries items={content.scopeGuardrails} /></div>
            </section>

            <section className="rounded-3xl border border-[#b8cab5] bg-[#eef5ed] p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#587153]">START Brief</p>
              <h2 className="mt-2 text-2xl font-semibold">
                {currentLesson ? `Χρησιμοποιήθηκε στο Lesson Revision ${currentLesson.revisionNumber}` : "Έτοιμο για Lesson Revision"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#5d6c59]">
                {currentLesson
                  ? "Αυτό το structured brief έχει ήδη χρησιμοποιηθεί από το START για το current μάθημα. Παραμένει αποθηκευμένο ως η γνωστική βάση της συγκεκριμένης revision."
                  : "Αυτό είναι το τελικό structured brief που θα δοθεί στο START. Η δημιουργία ή ενημέρωση μαθήματος γίνεται σε ξεχωριστό, χειροκίνητο στάδιο."}
              </p>
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-semibold">Πριν από τους τύπους</h3>
                  <Entries items={content.startBrief.mustEstablishBeforeFormulas} />
                </div>
                <div>
                  <h3 className="mb-3 font-semibold">Βαθιά εξήγηση</h3>
                  <Entries items={content.startBrief.mustExplainDeeply} />
                </div>
                <div>
                  <h3 className="mb-3 font-semibold">Παρανοήσεις που πρέπει να προληφθούν</h3>
                  <Entries items={content.startBrief.mustPrevent} />
                </div>
                <div>
                  <h3 className="mb-3 font-semibold">Transfer tests</h3>
                  <Entries items={content.startBrief.mustTestForTransfer} />
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}

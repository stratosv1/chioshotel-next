import Link from "next/link";
import { notFound } from "next/navigation";
import StartLessonRunner from "@/components/mixalis/StartLessonRunner";
import {
  getLessonRevisionView,
  type LessonTextBlock,
  type StartLessonContent,
} from "@/lib/mixalis/start-lesson";

function TextBlocks({ items }: { items: LessonTextBlock[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <article key={`${item.title}-${index}`} className="rounded-2xl bg-[#fbfaf8] p-5">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#615a54] sm:text-base">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function SingleBlock({ block }: { block: LessonTextBlock }) {
  return (
    <article className="rounded-2xl bg-[#fbfaf8] p-5">
      <h3 className="text-lg font-semibold">{block.title}</h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#615a54] sm:text-base">{block.body}</p>
    </article>
  );
}

function checkLabel(level: string) {
  if (level === "easy") return "Βασική κατανόηση";
  if (level === "advanced") return "Προχωρημένη κατανόηση";
  if (level === "hidden_context") return "Κρυμμένο πλαίσιο";
  return "Παγίδα";
}

export default async function MixalisLessonRevisionPage({
  params,
}: {
  params: Promise<{ revisionId: string }>;
}) {
  const { revisionId } = await params;
  const view = await getLessonRevisionView(revisionId);
  if (!view) notFound();

  const ready = view.status === "current" || view.status === "superseded";
  const lesson = ready ? (view.content as StartLessonContent) : null;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/mixalis/subchapter-intelligence/${view.intelligenceVersionId}`}
          className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
        >
          ← Πίσω στο Subchapter Intelligence
        </Link>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
            START · Lesson Revision {view.revisionNumber}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {view.subchapterNumberLabel} · {view.subchapterTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6b625b] sm:text-base">
            Μάθημα δημιουργημένο από το current Subchapter Intelligence με το START {view.promptVersion}.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#746a62]">
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">{view.courseTitle}</span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">Intelligence v{view.intelligenceVersionNumber}</span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">
              {ready ? "Current lesson" : view.status === "processing" ? "Generating" : "Draft"}
            </span>
          </div>
        </header>

        <StartLessonRunner
          revisionId={view.id}
          revisionNumber={view.revisionNumber}
          initialStatus={view.status}
          initialErrorMessage={view.errorMessage}
          autoStart={view.status === "draft"}
        />

        {lesson ? (
          <div className="mt-6 space-y-6">
            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#857261]">Το μάθημα</p>
              <h2 className="mt-2 text-3xl font-semibold">{lesson.title}</h2>
              <p className="mt-3 text-base leading-7 text-[#6b625b]">{lesson.subtitle}</p>
            </section>

            <section className="rounded-3xl border border-[#d9ccbb] bg-[#faf6f0] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#857261]">1 · Πρώτα το φαινόμενο</p>
              <div className="mt-4"><SingleBlock block={lesson.openingPhenomenon} /></div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#857261]">2 · Τι συμβαίνει πραγματικά</p>
              <h2 className="mt-2 text-2xl font-semibold">Κατανόηση πριν από τους τύπους</h2>
              <div className="mt-5"><TextBlocks items={lesson.intuitiveMeaning} /></div>
            </section>

            <section className="rounded-3xl border border-[#c5d0bf] bg-[#f1f6ef] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5d7357]">3 · Κρυμμένο παράδειγμα</p>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <SingleBlock block={lesson.hiddenRealWorldExample} />
                <SingleBlock block={lesson.physicsReveal} />
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#857261]">4 · Φυσικά μεγέθη</p>
              <h2 className="mt-2 text-2xl font-semibold">Τι μετράμε και γιατί μας νοιάζει</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {lesson.quantities.map((quantity, index) => (
                  <article key={`${quantity.symbol}-${index}`} className="rounded-2xl bg-[#fbfaf8] p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-xl font-semibold">{quantity.symbol}</h3>
                      <span className="text-xs text-[#81766d]">{quantity.unit}</span>
                    </div>
                    <p className="mt-1 font-medium">{quantity.name}</p>
                    <p className="mt-3 text-sm leading-6 text-[#625a54]">{quantity.meaning}</p>
                    <p className="mt-3 text-sm leading-6 text-[#625a54]"><strong>Γιατί έχει σημασία:</strong> {quantity.whyItMatters}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#857261]">5 · Σχέσεις και εξαρτήσεις</p>
              <h2 className="mt-2 text-2xl font-semibold">Αν αλλάξει κάτι, τι περιμένουμε να συμβεί;</h2>
              <div className="mt-5"><TextBlocks items={lesson.dependencies} /></div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#857261]">6 · Τώρα μπαίνει η γλώσσα της Φυσικής</p>
              <div className="mt-5"><TextBlocks items={lesson.formalTerminology} /></div>
            </section>

            <section className="rounded-3xl border border-[#d6c7b3] bg-[#fbf6ed] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#806d52]">7 · Οι τύποι ως συμπύκνωση της ιδέας</p>
              <div className="mt-5 space-y-3">
                {lesson.formulas.map((formula, index) => (
                  <article key={`${formula.expression}-${index}`} className="rounded-2xl bg-white p-5">
                    <div className="rounded-xl bg-[#f3efe8] px-4 py-3 text-center text-xl font-semibold">{formula.expression}</div>
                    <p className="mt-3 text-sm leading-6"><strong>Διαβάζεται:</strong> {formula.readAs}</p>
                    <p className="mt-2 text-sm leading-6 text-[#625a54]">{formula.physicalMeaning}</p>
                    <p className="mt-2 text-sm leading-6 text-[#625a54]"><strong>Ισχύει όταν:</strong> {formula.conditions}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#857261]">8 · Εφαρμογές</p>
              <div className="mt-5"><TextBlocks items={lesson.guidedApplications} /></div>
            </section>

            <section className="rounded-3xl border border-[#e0c6b9] bg-[#fbf1ed] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#855b4a]">9 · Εκεί που συνήθως γίνεται το λάθος</p>
              <div className="mt-5"><TextBlocks items={lesson.misconceptionRepairs} /></div>
            </section>

            {lesson.engineeringBridge.body ? (
              <section className="rounded-3xl border border-[#bdc9d0] bg-[#f0f5f7] p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#566b76]">10 · Engineering bridge</p>
                <div className="mt-4"><SingleBlock block={lesson.engineeringBridge} /></div>
              </section>
            ) : null}

            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#857261]">Έλεγχος κατανόησης</p>
              <h2 className="mt-2 text-2xl font-semibold">Μπορείς να χρησιμοποιήσεις την ιδέα χωρίς να βλέπεις τον τύπο;</h2>
              <div className="mt-5 space-y-4">
                {lesson.comprehensionChecks.map((check, index) => (
                  <article key={`${check.level}-${index}`} className="rounded-2xl border border-black/10 bg-[#fbfaf8] p-5">
                    <span className="rounded-full bg-[#eee7de] px-3 py-1 text-xs font-medium">{checkLabel(check.level)}</span>
                    <p className="mt-4 text-base font-semibold leading-7">{check.question}</p>
                    <details className="mt-4 rounded-xl bg-white p-4 text-sm">
                      <summary className="cursor-pointer font-medium">1η βοήθεια</summary>
                      <p className="mt-2 leading-6 text-[#625a54]">{check.hint1}</p>
                    </details>
                    <details className="mt-2 rounded-xl bg-white p-4 text-sm">
                      <summary className="cursor-pointer font-medium">2η βοήθεια</summary>
                      <p className="mt-2 leading-6 text-[#625a54]">{check.hint2}</p>
                    </details>
                    <details className="mt-2 rounded-xl bg-white p-4 text-sm">
                      <summary className="cursor-pointer font-medium">Έλεγχος απάντησης</summary>
                      <p className="mt-2 leading-6 text-[#625a54]">{check.teacherAnswer}</p>
                    </details>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#b8cab5] bg-[#eef5ed] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#587153]">Κράτα αυτό στο μυαλό σου</p>
              <div className="mt-4"><SingleBlock block={lesson.closingMentalModel} /></div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}

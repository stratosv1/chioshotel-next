import Link from "next/link";
import { notFound } from "next/navigation";
import StartLessonRunner from "@/components/mixalis/StartLessonRunner";
import {
  getLessonRevisionView,
  type LessonTextBlock,
  type StartLessonContent,
} from "@/lib/mixalis/start-lesson";

const bodyText = "whitespace-pre-line text-[17px] leading-8 text-slate-700 sm:text-[18px] sm:leading-9";

function TextBlocks({ items }: { items: LessonTextBlock[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <article
          key={`${item.title}-${index}`}
          className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-6"
        >
          <h3 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{item.title}</h3>
          <p className={`mt-3 ${bodyText}`}>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function SingleBlock({ block }: { block: LessonTextBlock }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur sm:p-6">
      <h3 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{block.title}</h3>
      <p className={`mt-3 ${bodyText}`}>{block.body}</p>
    </article>
  );
}

function SectionLabel({ number, children, tone = "blue" }: { number?: string; children: React.ReactNode; tone?: "blue" | "violet" | "green" | "amber" | "rose" | "cyan" }) {
  const tones = {
    blue: "bg-blue-100 text-blue-800",
    violet: "bg-violet-100 text-violet-800",
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-900",
    rose: "bg-rose-100 text-rose-800",
    cyan: "bg-cyan-100 text-cyan-800",
  };

  return (
    <div className="flex items-center gap-3">
      {number ? (
        <span className={`inline-flex h-9 min-w-9 items-center justify-center rounded-2xl px-2 text-sm font-black ${tones[tone]}`}>
          {number}
        </span>
      ) : null}
      <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-slate-600 sm:text-base">{children}</p>
    </div>
  );
}

function checkLabel(level: string) {
  if (level === "easy") return "Βασική κατανόηση";
  if (level === "advanced") return "Προχωρημένη κατανόηση";
  if (level === "hidden_context") return "Μεταφορά σε νέο πλαίσιο";
  return "Παγίδα";
}

function checkTone(level: string) {
  if (level === "easy") return "bg-emerald-100 text-emerald-800";
  if (level === "advanced") return "bg-blue-100 text-blue-800";
  if (level === "hidden_context") return "bg-violet-100 text-violet-800";
  return "bg-rose-100 text-rose-800";
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#f8fafc_22%,#ffffff_55%,#f8fafc_100%)] px-4 py-5 text-slate-950 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/mixalis/subchapter-intelligence/${view.intelligenceVersionId}`}
          className="mb-5 inline-flex min-h-11 items-center rounded-2xl bg-white px-4 text-base font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          ← Πίσω στο Subchapter Intelligence
        </Link>

        <header className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-[0_18px_60px_rgba(37,99,235,0.10)]">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" />
          <div className="p-6 sm:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-extrabold text-blue-800">START</span>
              <span className="rounded-full bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-800">Revision {view.revisionNumber}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-800">
                {ready ? "Έτοιμο μάθημα" : view.status === "processing" ? "Δημιουργείται" : "Πρόχειρο"}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.035em] text-slate-950 sm:text-6xl">
              {view.subchapterNumberLabel} · {view.subchapterTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-slate-600 sm:text-xl sm:leading-9">
              Μάθημα Φυσικής σχεδιασμένο ώστε πρώτα να καταλαβαίνεις την ιδέα και μετά να περνάς στους τύπους.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
              <span className="rounded-full bg-slate-100 px-3 py-2">{view.courseTitle}</span>
              <span className="rounded-full bg-slate-100 px-3 py-2">Intelligence v{view.intelligenceVersionNumber}</span>
              <span className="rounded-full bg-slate-100 px-3 py-2">START {view.promptVersion}</span>
            </div>
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
          <div className="mt-7 space-y-7 sm:space-y-9">
            <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white shadow-xl sm:p-9">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-blue-200">Η κεντρική ιδέα</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{lesson.title}</h2>
              <p className="mt-4 max-w-3xl text-lg font-medium leading-8 text-blue-50 sm:text-xl sm:leading-9">{lesson.subtitle}</p>
            </section>

            <section className="rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-5 sm:p-8">
              <SectionLabel number="01" tone="blue">Πρώτα το φαινόμενο</SectionLabel>
              <div className="mt-5"><SingleBlock block={lesson.openingPhenomenon} /></div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <SectionLabel number="02" tone="violet">Τι συμβαίνει πραγματικά</SectionLabel>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Κατανόηση πριν από τους τύπους</h2>
              <div className="mt-6"><TextBlocks items={lesson.intuitiveMeaning} /></div>
            </section>

            <section className="rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 sm:p-8">
              <SectionLabel number="03" tone="green">Κρυμμένο παράδειγμα</SectionLabel>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <SingleBlock block={lesson.hiddenRealWorldExample} />
                <SingleBlock block={lesson.physicsReveal} />
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <SectionLabel number="04" tone="cyan">Φυσικά μεγέθη</SectionLabel>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Τι μετράμε και γιατί μας νοιάζει</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {lesson.quantities.map((quantity, index) => (
                  <article key={`${quantity.symbol}-${index}`} className="rounded-3xl border border-cyan-100 bg-cyan-50/70 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-3xl font-black tracking-tight text-cyan-950">{quantity.symbol}</h3>
                        <p className="mt-1 text-lg font-bold text-slate-950">{quantity.name}</p>
                      </div>
                      <span className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm">{quantity.unit}</span>
                    </div>
                    <p className={`mt-4 ${bodyText}`}>{quantity.meaning}</p>
                    <div className="mt-4 rounded-2xl bg-white p-4 text-[16px] leading-7 text-slate-700">
                      <strong className="text-slate-950">Γιατί έχει σημασία:</strong> {quantity.whyItMatters}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-5 sm:p-8">
              <SectionLabel number="05" tone="violet">Σχέσεις και εξαρτήσεις</SectionLabel>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Αν αλλάξει κάτι, τι περιμένουμε να συμβεί;</h2>
              <div className="mt-6"><TextBlocks items={lesson.dependencies} /></div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <SectionLabel number="06" tone="blue">Η γλώσσα της Φυσικής</SectionLabel>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Τώρα δίνουμε ακριβή ονόματα σε όσα ήδη κατάλαβες</h2>
              <div className="mt-6"><TextBlocks items={lesson.formalTerminology} /></div>
            </section>

            <section className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 sm:p-8">
              <SectionLabel number="07" tone="amber">Οι τύποι ως συμπύκνωση της ιδέας</SectionLabel>
              <div className="mt-6 space-y-4">
                {lesson.formulas.map((formula, index) => (
                  <article key={`${formula.expression}-${index}`} className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="overflow-x-auto rounded-2xl bg-slate-950 px-4 py-5 text-center text-2xl font-black text-white sm:text-3xl">
                      {formula.expression}
                    </div>
                    <p className={`mt-4 ${bodyText}`}><strong className="text-slate-950">Διαβάζεται:</strong> {formula.readAs}</p>
                    <p className={`mt-3 ${bodyText}`}>{formula.physicalMeaning}</p>
                    <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-[16px] leading-7 text-amber-950">
                      <strong>Ισχύει όταν:</strong> {formula.conditions}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <SectionLabel number="08" tone="green">Εφαρμογές</SectionLabel>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Πρώτα προβλέπουμε, μετά υπολογίζουμε</h2>
              <div className="mt-6"><TextBlocks items={lesson.guidedApplications} /></div>
            </section>

            <section className="rounded-[2rem] border border-rose-200 bg-gradient-to-br from-rose-50 to-red-50 p-5 sm:p-8">
              <SectionLabel number="09" tone="rose">Συνηθισμένες παγίδες</SectionLabel>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Εκεί που συνήθως γίνεται το λάθος</h2>
              <div className="mt-6"><TextBlocks items={lesson.misconceptionRepairs} /></div>
            </section>

            {lesson.engineeringBridge.body ? (
              <section className="rounded-[2rem] border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-5 sm:p-8">
                <SectionLabel number="10" tone="cyan">Engineering bridge</SectionLabel>
                <div className="mt-5"><SingleBlock block={lesson.engineeringBridge} /></div>
              </section>
            ) : null}

            <section className="rounded-[2rem] border border-blue-200 bg-white p-5 shadow-[0_18px_60px_rgba(37,99,235,0.08)] sm:p-8">
              <SectionLabel tone="blue">Έλεγχος κατανόησης</SectionLabel>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Μπορείς να χρησιμοποιήσεις την ιδέα χωρίς να κοιτάξεις τον τύπο;</h2>
              <div className="mt-6 space-y-5">
                {lesson.comprehensionChecks.map((check, index) => (
                  <article key={`${check.level}-${index}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-3 py-1.5 text-sm font-extrabold ${checkTone(check.level)}`}>{checkLabel(check.level)}</span>
                      <span className="text-sm font-bold text-slate-400">Ερώτηση {index + 1}</span>
                    </div>
                    <p className="mt-4 text-xl font-bold leading-8 text-slate-950 sm:text-2xl sm:leading-9">{check.question}</p>
                    <details className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-base">
                      <summary className="cursor-pointer text-lg font-bold text-blue-800">1η βοήθεια</summary>
                      <p className="mt-3 text-[16px] leading-7 text-slate-700">{check.hint1}</p>
                    </details>
                    <details className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-base">
                      <summary className="cursor-pointer text-lg font-bold text-violet-800">2η βοήθεια</summary>
                      <p className="mt-3 text-[16px] leading-7 text-slate-700">{check.hint2}</p>
                    </details>
                    <details className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-base">
                      <summary className="cursor-pointer text-lg font-bold text-emerald-800">Έλεγχος απάντησης</summary>
                      <p className="mt-3 text-[16px] leading-7 text-slate-700">{check.teacherAnswer}</p>
                    </details>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-emerald-300 bg-gradient-to-br from-emerald-100 via-green-50 to-cyan-50 p-5 shadow-sm sm:p-8">
              <SectionLabel tone="green">Κράτα αυτό στο μυαλό σου</SectionLabel>
              <div className="mt-5"><SingleBlock block={lesson.closingMentalModel} /></div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}

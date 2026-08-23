import Link from "next/link";
import { notFound } from "next/navigation";
import StartLessonRunner from "@/components/mixalis/StartLessonRunner";
import LessonClarificationEnhancer from "@/components/mixalis/LessonClarificationEnhancer";
import {
  getLessonRevisionView,
  type LessonTextBlock,
  type StartLessonContent,
} from "@/lib/mixalis/start-lesson";

const bodyText = "whitespace-pre-line text-[19px] leading-9 text-slate-700 sm:text-[21px] sm:leading-10";

function TextBlocks({ items, blockPrefix }: { items: LessonTextBlock[]; blockPrefix: string }) {
  return (
    <div className="divide-y divide-slate-200">
      {items.map((item, index) => (
        <article key={`${item.title}-${index}`} className="py-6 first:pt-0 last:pb-0 sm:py-8">
          <div className="border-l-4 border-slate-200 pl-4 sm:pl-6">
            <h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{item.title}</h3>
            <p
              className={`mt-3 ${bodyText}`}
              data-clarifiable="true"
              data-clarification-key={`${blockPrefix}.${index}.body`}
            >
              {item.body}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function SingleBlock({ block, blockKey }: { block: LessonTextBlock; blockKey: string }) {
  return (
    <article className="border-l-4 border-slate-200 pl-4 sm:pl-6">
      <h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{block.title}</h3>
      <p
        className={`mt-3 ${bodyText}`}
        data-clarifiable="true"
        data-clarification-key={blockKey}
      >
        {block.body}
      </p>
    </article>
  );
}

function SectionLabel({
  number,
  children,
  tone = "blue",
}: {
  number?: string;
  children: React.ReactNode;
  tone?: "blue" | "violet" | "green" | "amber" | "rose" | "cyan";
}) {
  const tones = {
    blue: "text-blue-700 border-blue-500",
    violet: "text-violet-700 border-violet-500",
    green: "text-emerald-700 border-emerald-500",
    amber: "text-amber-800 border-amber-500",
    rose: "text-rose-700 border-rose-500",
    cyan: "text-cyan-700 border-cyan-500",
  };

  return (
    <div className={`flex items-center gap-3 border-l-4 pl-3 ${tones[tone]}`}>
      {number ? <span className="text-sm font-black tracking-[0.12em] sm:text-base">{number}</span> : null}
      <p className="text-sm font-extrabold uppercase tracking-[0.12em] sm:text-base">{children}</p>
    </div>
  );
}

function LessonSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`border-t border-slate-200 py-10 sm:py-14 ${className}`}>{children}</section>;
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
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-10 sm:py-10 lg:px-14">
        <Link
          href={`/mixalis/subchapter-intelligence/${view.intelligenceVersionId}`}
          className="mb-8 inline-flex min-h-11 items-center text-lg font-bold text-slate-600 transition hover:text-slate-950"
        >
          ← Πίσω στο Subchapter Intelligence
        </Link>

        <header className="border-t-4 border-blue-500 py-8 sm:py-12">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold sm:text-base">
            <span className="text-blue-700">START</span>
            <span className="text-slate-400">/</span>
            <span className="text-violet-700">Revision {view.revisionNumber}</span>
            <span className="text-slate-400">/</span>
            <span className="text-emerald-700">
              {ready ? "Έτοιμο μάθημα" : view.status === "processing" ? "Δημιουργείται" : "Πρόχειρο"}
            </span>
          </div>

          <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-[-0.035em] text-slate-950 sm:text-6xl">
            {view.subchapterNumberLabel} · {view.subchapterTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-xl font-medium leading-9 text-slate-600 sm:text-2xl sm:leading-10">
            Μάθημα Φυσικής σχεδιασμένο ώστε πρώτα να καταλαβαίνεις την ιδέα και μετά να περνάς στους τύπους.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-500 sm:text-base">
            <span>{view.courseTitle}</span>
            <span>Intelligence v{view.intelligenceVersionNumber}</span>
            <span>START {view.promptVersion}</span>
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
          <div className="mt-4" data-lesson-clarification-root={view.id}>
            <LessonClarificationEnhancer revisionId={view.id} />

            <section className="border-y border-slate-900 bg-slate-950 py-10 text-white sm:py-14">
              <div className="px-5 sm:px-8">
                <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-blue-300 sm:text-base">Η κεντρική ιδέα</p>
                <h2 className="mt-3 max-w-5xl text-4xl font-black tracking-tight sm:text-5xl">{lesson.title}</h2>
                <p
                  className="mt-4 max-w-4xl text-xl font-medium leading-9 text-slate-200 sm:text-2xl sm:leading-10"
                  data-clarifiable="true"
                  data-clarification-key="subtitle"
                >
                  {lesson.subtitle}
                </p>
              </div>
            </section>

            <LessonSection>
              <SectionLabel number="01" tone="blue">Πρώτα το φαινόμενο</SectionLabel>
              <div className="mt-7 max-w-4xl">
                <SingleBlock block={lesson.openingPhenomenon} blockKey="openingPhenomenon.body" />
              </div>
            </LessonSection>

            <LessonSection>
              <SectionLabel number="02" tone="violet">Τι συμβαίνει πραγματικά</SectionLabel>
              <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">Κατανόηση πριν από τους τύπους</h2>
              <div className="mt-7 max-w-4xl">
                <TextBlocks items={lesson.intuitiveMeaning} blockPrefix="intuitiveMeaning" />
              </div>
            </LessonSection>

            <LessonSection>
              <SectionLabel number="03" tone="green">Κρυμμένο παράδειγμα</SectionLabel>
              <div className="mt-7 grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
                <SingleBlock block={lesson.hiddenRealWorldExample} blockKey="hiddenRealWorldExample.body" />
                <SingleBlock block={lesson.physicsReveal} blockKey="physicsReveal.body" />
              </div>
            </LessonSection>

            <LessonSection>
              <SectionLabel number="04" tone="cyan">Φυσικά μεγέθη</SectionLabel>
              <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">Τι μετράμε και γιατί μας νοιάζει</h2>
              <div className="mt-8 grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {lesson.quantities.map((quantity, index) => (
                  <article key={`${quantity.symbol}-${index}`} className="border-t-2 border-cyan-300 pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-4xl font-black tracking-tight text-cyan-950">{quantity.symbol}</h3>
                        <p className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">{quantity.name}</p>
                      </div>
                      <span className="text-base font-bold text-slate-500">{quantity.unit}</span>
                    </div>
                    <p
                      className={`mt-4 ${bodyText}`}
                      data-clarifiable="true"
                      data-clarification-key={`quantities.${index}.meaning`}
                    >
                      {quantity.meaning}
                    </p>
                    <p
                      className="mt-4 border-l-4 border-cyan-200 pl-4 text-[18px] leading-8 text-slate-700 sm:text-[19px] sm:leading-9"
                      data-clarifiable="true"
                      data-clarification-key={`quantities.${index}.whyItMatters`}
                    >
                      <strong className="text-slate-950">Γιατί έχει σημασία:</strong> {quantity.whyItMatters}
                    </p>
                  </article>
                ))}
              </div>
            </LessonSection>

            <LessonSection>
              <SectionLabel number="05" tone="violet">Σχέσεις και εξαρτήσεις</SectionLabel>
              <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">Αν αλλάξει κάτι, τι περιμένουμε να συμβεί;</h2>
              <div className="mt-7 max-w-4xl">
                <TextBlocks items={lesson.dependencies} blockPrefix="dependencies" />
              </div>
            </LessonSection>

            <LessonSection>
              <SectionLabel number="06" tone="blue">Η γλώσσα της Φυσικής</SectionLabel>
              <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">Τώρα δίνουμε ακριβή ονόματα σε όσα ήδη κατάλαβες</h2>
              <div className="mt-7 max-w-4xl">
                <TextBlocks items={lesson.formalTerminology} blockPrefix="formalTerminology" />
              </div>
            </LessonSection>

            <LessonSection>
              <SectionLabel number="07" tone="amber">Οι τύποι ως συμπύκνωση της ιδέας</SectionLabel>
              <div className="mt-8 max-w-5xl divide-y divide-amber-200 border-b border-amber-200">
                {lesson.formulas.map((formula, index) => (
                  <article key={`${formula.expression}-${index}`} className="py-8 first:pt-0 sm:py-10">
                    <div className="overflow-x-auto border-y border-slate-800 bg-slate-950 px-5 py-5 text-center text-3xl font-black text-white sm:px-8 sm:text-4xl">
                      {formula.expression}
                    </div>
                    <p
                      className={`mt-5 ${bodyText}`}
                      data-clarifiable="true"
                      data-clarification-key={`formulas.${index}.readAs`}
                    >
                      <strong className="text-slate-950">Διαβάζεται:</strong> {formula.readAs}
                    </p>
                    <p
                      className={`mt-3 ${bodyText}`}
                      data-clarifiable="true"
                      data-clarification-key={`formulas.${index}.physicalMeaning`}
                    >
                      {formula.physicalMeaning}
                    </p>
                    <p
                      className="mt-5 border-l-4 border-amber-300 pl-4 text-[18px] leading-8 text-amber-950 sm:text-[19px] sm:leading-9"
                      data-clarifiable="true"
                      data-clarification-key={`formulas.${index}.conditions`}
                    >
                      <strong>Ισχύει όταν:</strong> {formula.conditions}
                    </p>
                  </article>
                ))}
              </div>
            </LessonSection>

            <LessonSection>
              <SectionLabel number="08" tone="green">Εφαρμογές</SectionLabel>
              <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">Πρώτα προβλέπουμε, μετά υπολογίζουμε</h2>
              <div className="mt-7 max-w-4xl">
                <TextBlocks items={lesson.guidedApplications} blockPrefix="guidedApplications" />
              </div>
            </LessonSection>

            <LessonSection>
              <SectionLabel number="09" tone="rose">Συνηθισμένες παγίδες</SectionLabel>
              <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">Εκεί που συνήθως γίνεται το λάθος</h2>
              <div className="mt-7 max-w-4xl">
                <TextBlocks items={lesson.misconceptionRepairs} blockPrefix="misconceptionRepairs" />
              </div>
            </LessonSection>

            {lesson.engineeringBridge.body ? (
              <LessonSection>
                <SectionLabel number="10" tone="cyan">Engineering bridge</SectionLabel>
                <div className="mt-7 max-w-4xl">
                  <SingleBlock block={lesson.engineeringBridge} blockKey="engineeringBridge.body" />
                </div>
              </LessonSection>
            ) : null}

            <LessonSection>
              <SectionLabel tone="blue">Έλεγχος κατανόησης</SectionLabel>
              <h2 className="mt-4 max-w-5xl text-3xl font-black tracking-tight sm:text-4xl">Μπορείς να χρησιμοποιήσεις την ιδέα χωρίς να κοιτάξεις τον τύπο;</h2>
              <div className="mt-8 max-w-5xl divide-y divide-slate-200 border-y border-slate-200">
                {lesson.comprehensionChecks.map((check, index) => (
                  <article key={`${check.level}-${index}`} className="py-8 sm:py-10">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-3 py-1.5 text-base font-extrabold ${checkTone(check.level)}`}>{checkLabel(check.level)}</span>
                      <span className="text-base font-bold text-slate-400">Ερώτηση {index + 1}</span>
                    </div>
                    <p className="mt-4 max-w-4xl text-2xl font-bold leading-9 text-slate-950 sm:text-3xl sm:leading-10">{check.question}</p>

                    <div className="mt-6 max-w-4xl border-t border-slate-200">
                      <details className="border-b border-slate-200 py-4 text-lg">
                        <summary className="cursor-pointer text-xl font-bold text-blue-800">1η βοήθεια</summary>
                        <p className="mt-3 text-[18px] leading-8 text-slate-700 sm:text-[19px] sm:leading-9">{check.hint1}</p>
                      </details>
                      <details className="border-b border-slate-200 py-4 text-lg">
                        <summary className="cursor-pointer text-xl font-bold text-violet-800">2η βοήθεια</summary>
                        <p className="mt-3 text-[18px] leading-8 text-slate-700 sm:text-[19px] sm:leading-9">{check.hint2}</p>
                      </details>
                      <details className="border-b border-emerald-200 py-4 text-lg">
                        <summary className="cursor-pointer text-xl font-bold text-emerald-800">Έλεγχος απάντησης</summary>
                        <p className="mt-3 text-[18px] leading-8 text-slate-700 sm:text-[19px] sm:leading-9">{check.teacherAnswer}</p>
                      </details>
                    </div>
                  </article>
                ))}
              </div>
            </LessonSection>

            <section className="border-y border-emerald-300 bg-emerald-50/70 py-10 sm:py-14">
              <div className="px-1 sm:px-4">
                <SectionLabel tone="green">Κράτα αυτό στο μυαλό σου</SectionLabel>
                <div className="mt-7 max-w-4xl">
                  <SingleBlock block={lesson.closingMentalModel} blockKey="closingMentalModel.body" />
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}

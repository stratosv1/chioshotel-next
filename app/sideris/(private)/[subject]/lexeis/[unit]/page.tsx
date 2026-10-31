import Link from "next/link";
import { notFound } from "next/navigation";
import { Flashcards } from "@/components/sideris/vocab/Flashcards";
import { UnitEditor } from "@/components/sideris/vocab/UnitEditor";
import { getVocabSubject, getVocabUnitByNumber } from "@/lib/sideris/vocab";

export const dynamic = "force-dynamic";

export default async function UnitPage({ params }: { params: Promise<{ subject: string; unit: string }> }) {
  const { subject: slug, unit } = await params;
  const subject = getVocabSubject(slug);
  const number = Number(unit);
  if (!subject || !Number.isInteger(number) || number < 1) notFound();

  const data = await getVocabUnitByNumber(subject.language, number);
  if (!data) notFound();

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <Link href={`/sideris/${subject.slug}/lexeis`} prefetch={false} className="text-sm font-semibold text-[#5f5045] hover:underline">
          ← {subject.name} · Λέξεις
        </Link>
        <header className="mt-3 mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
            {subject.name} · Κεφάλαιο {data.unit.number}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{data.unit.title || `Κεφάλαιο ${data.unit.number}`}</h1>
          <p className="mt-1 text-sm text-[#857a70]">{data.words.length} λέξεις</p>
        </header>

        <Flashcards
          words={data.words}
          storageKey={`sideris:vocab:${subject.language}:${data.unit.number}`}
          speechLang={subject.speechLang}
          termLabel={subject.termLabel}
          accent={subject.accent}
        />

        <details className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <summary className="cursor-pointer text-sm font-semibold">✎ Διόρθωση ή προσθήκη λέξεων</summary>
          <div className="mt-5">
            <UnitEditor
              existing
              language={subject.language}
              subjectSlug={subject.slug}
              termLabel={subject.termLabel}
              initialNumber={data.unit.number}
              initialTitle={data.unit.title}
              initialWords={data.words.map(({ term, meaning, note, example }) => ({ term, meaning, note, example }))}
              accent={subject.accent}
            />
          </div>
        </details>
      </div>
    </main>
  );
}

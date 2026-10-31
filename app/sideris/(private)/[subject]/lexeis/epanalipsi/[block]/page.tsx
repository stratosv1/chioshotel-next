import Link from "next/link";
import { notFound } from "next/navigation";
import { Revision } from "@/components/sideris/vocab/Revision";
import { REVISION_BLOCK, getVocabSubject, listVocabUnits, listVocabWordsInRange } from "@/lib/sideris/vocab";

export const dynamic = "force-dynamic";

export default async function RevisionPage({ params }: { params: Promise<{ subject: string; block: string }> }) {
  const { subject: slug, block } = await params;
  const subject = getVocabSubject(slug);
  if (!subject) notFound();

  const units = await listVocabUnits(subject.language);
  let chosen = units;
  let heading = "Μεγάλο επαναληπτικό";
  if (block !== "oles") {
    const k = Number(block);
    if (!Number.isInteger(k) || k < 1) notFound();
    chosen = units.slice((k - 1) * REVISION_BLOCK, k * REVISION_BLOCK);
    if (chosen.length < REVISION_BLOCK) notFound();
    heading = `Επαναληπτικό ${k}`;
  }
  if (chosen.length === 0) notFound();

  const from = chosen[0].number;
  const to = chosen[chosen.length - 1].number;
  const words = await listVocabWordsInRange(subject.language, from, to);

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <Link href={`/sideris/${subject.slug}/lexeis`} prefetch={false} className="text-sm font-semibold text-[#5f5045] hover:underline">
          ← {subject.name} · Λέξεις
        </Link>
        <header className="mt-3 mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a5a22]">
            {subject.name} · Κεφάλαια {from}–{to}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">★ {heading}</h1>
          <p className="mt-1 text-sm text-[#857a70]">
            {words.length} λέξεις: διάλεξε τη σωστή σημασία, βρες τη λέξη και γράψε την.
          </p>
        </header>
        <Revision
          words={words}
          storageKey={`sideris:revision:${subject.language}:${block}`}
          speechLang={subject.speechLang}
          termLabel={subject.termLabel}
          accent={subject.accent}
        />
      </div>
    </main>
  );
}

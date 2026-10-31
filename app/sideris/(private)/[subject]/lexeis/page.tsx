import Link from "next/link";
import { notFound } from "next/navigation";
import { UnitEditor } from "@/components/sideris/vocab/UnitEditor";
import { REVISION_BLOCK, getVocabSubject, listVocabUnits } from "@/lib/sideris/vocab";

export const dynamic = "force-dynamic";

export default async function LexeisPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: slug } = await params;
  const subject = getVocabSubject(slug);
  if (!subject) notFound();

  const units = await listVocabUnits(subject.language);
  const nextNumber = units.length ? Math.max(...units.map((u) => u.number)) + 1 : 1;
  const totalWords = units.reduce((n, u) => n + u.wordCount, 0);
  const blocks = Math.floor(units.length / REVISION_BLOCK);
  const remaining = REVISION_BLOCK - (units.length % REVISION_BLOCK);

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/sideris" prefetch={false} className="text-sm font-semibold text-[#5f5045] hover:underline">
          ← Τα μαθήματά μου
        </Link>

        <header className="mt-3 mb-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className={`h-1.5 ${subject.accent}`} />
          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">{subject.name}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Λέξεις</h1>
            <p className="mt-3 text-sm leading-6 text-[#6b625b] sm:text-base">
              {units.length} κεφάλαια · {totalWords} λέξεις. Ανέβασε τις λέξεις κάθε κεφαλαίου με μια φωτογραφία και μάθε
              τες με flashcards. Κάθε {REVISION_BLOCK} κεφάλαια ανοίγει ένα επαναληπτικό.
            </p>
          </div>
        </header>

        {units.length > 0 ? (
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold tracking-tight">Κεφάλαια</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {units.map((u) => (
                <li key={u.id}>
                  <Link
                    href={`/sideris/${subject.slug}/lexeis/${u.number}`}
                    prefetch={false}
                    className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-bold ${subject.accent}`}>{u.number}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{u.title || `Κεφάλαιο ${u.number}`}</span>
                      <span className="text-sm text-[#857a70]">{u.wordCount} λέξεις · flashcards →</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Επαναληπτικά</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: blocks }, (_, i) => {
              const from = units[i * REVISION_BLOCK].number;
              const to = units[i * REVISION_BLOCK + REVISION_BLOCK - 1].number;
              return (
                <Link
                  key={i}
                  href={`/sideris/${subject.slug}/lexeis/epanalipsi/${i + 1}`}
                  prefetch={false}
                  className="rounded-2xl border border-[#c9822f]/30 bg-[#fffaf2] p-4 shadow-sm transition hover:shadow-md"
                >
                  <span className="block font-semibold">★ Επαναληπτικό {i + 1}</span>
                  <span className="text-sm text-[#8a5a22]">
                    Κεφάλαια {from}–{to} →
                  </span>
                </Link>
              );
            })}
            {blocks >= 2 ? (
              <Link
                href={`/sideris/${subject.slug}/lexeis/epanalipsi/oles`}
                prefetch={false}
                className="rounded-2xl border border-[#c9822f]/30 bg-[#fffaf2] p-4 shadow-sm transition hover:shadow-md"
              >
                <span className="block font-semibold">★★ Μεγάλο επαναληπτικό</span>
                <span className="text-sm text-[#8a5a22]">Όλες οι λέξεις ({totalWords}) →</span>
              </Link>
            ) : null}
            <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 p-4 text-sm text-[#6f665f]">
              🔒 Το επαναληπτικό {blocks + 1} ανοίγει σε {remaining} {remaining === 1 ? "κεφάλαιο" : "κεφάλαια"} ακόμη.
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Νέο κεφάλαιο</h2>
          <UnitEditor
            language={subject.language}
            subjectSlug={subject.slug}
            termLabel={subject.termLabel}
            initialNumber={nextNumber}
            accent={subject.accent}
          />
        </section>
      </div>
    </main>
  );
}

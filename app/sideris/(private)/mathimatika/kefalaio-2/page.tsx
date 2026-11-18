import Link from "next/link";
import { notFound } from "next/navigation";
import { Kefalaio2 } from "@/components/sideris/math/chapters/Kefalaio2";
import { getMathChapter } from "@/lib/sideris/math";

export default function Kefalaio2Page() {
  const chapter = getMathChapter("kefalaio-2");
  if (!chapter) notFound();

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/sideris/mathimatika" prefetch={false} className="text-sm font-semibold text-[#5f5045] hover:underline">
          ← Μαθηματικά · Κεφάλαια
        </Link>

        <header className="mt-3 mb-4 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="h-1.5 bg-[#3d6b3a]" />
          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">Μαθηματικά · Κεφάλαιο {chapter.number}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{chapter.title}</h1>
            <p className="mt-3 text-sm leading-6 text-[#6b625b] sm:text-base">
              Διάβασε πρώτα τη θεωρία και τα λυμένα παραδείγματα. Μετά λύσε τις ασκήσεις στο τετράδιο και πάτα «Δείξε τη λύση» για να
              ελέγξεις. Οι ασκήσεις με μπλε κύκλο είναι αυτές που είναι κυκλωμένες στο βιβλίο σου.
            </p>
          </div>
        </header>

        <nav
          aria-label="Ενότητες"
          className="sticky top-0 z-10 -mx-4 mb-8 flex gap-2 overflow-x-auto bg-[#f3efe8]/95 px-4 py-3 backdrop-blur sm:mx-0 sm:flex-wrap sm:rounded-2xl sm:px-0"
        >
          {chapter.sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold text-[#3d6b3a] shadow-sm transition hover:bg-[#eef3ec]"
            >
              {s.code} {s.title}
            </a>
          ))}
        </nav>

        <Kefalaio2 />

        <p className="mt-12 text-center text-sm text-[#857a70]">
          <a href="#" className="font-semibold hover:underline">
            ↑ Πάνω
          </a>
        </p>
      </div>
    </main>
  );
}

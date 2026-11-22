import Link from "next/link";
import { notFound } from "next/navigation";
import { Kefalaio2Fysiki } from "@/components/sideris/physics/chapters/Kefalaio2";
import { getPhysicsChapter } from "@/lib/sideris/physics";

export default function FysikiKefalaio2Page() {
  const chapter = getPhysicsChapter("kefalaio-2");
  if (!chapter) notFound();

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/sideris/fysiki" prefetch={false} className="text-sm font-semibold text-[#5f5045] hover:underline">
          ← Φυσική · Κεφάλαια
        </Link>

        <header className="mt-3 mb-4 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="h-1.5 bg-[#6b3fa0]" />
          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">Φυσική · Κεφάλαιο {chapter.number}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{chapter.title}</h1>
            <p className="mt-3 text-sm leading-6 text-[#6b625b] sm:text-base">
              Ξεκίνα από τη φωτοτυπία του καθηγητή: αυτά πρέπει να τα ξέρεις σίγουρα. Μετά διάβασε τις ενότητες, κάνε τα quiz, λύσε τις
              ασκήσεις του βοηθήματος στο τετράδιο και στο τέλος γράψε το τεστ.
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
              className="shrink-0 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold text-[#6b3fa0] shadow-sm transition hover:bg-[#f5effc]"
            >
              {s.code} {s.title}
            </a>
          ))}
        </nav>

        <Kefalaio2Fysiki />

        <p className="mt-12 text-center text-sm text-[#857a70]">
          <a href="#" className="font-semibold hover:underline">
            ↑ Πάνω
          </a>
        </p>
      </div>
    </main>
  );
}

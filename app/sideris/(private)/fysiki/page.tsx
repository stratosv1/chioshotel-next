import Link from "next/link";
import { PHYSICS_CHAPTERS } from "@/lib/sideris/physics";

export default function FysikiPage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/sideris" prefetch={false} className="text-sm font-semibold text-[#5f5045] hover:underline">
          ← Τα μαθήματά μου
        </Link>

        <header className="mt-3 mb-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="h-1.5 bg-[#6b3fa0]" />
          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">Φυσική · Α΄ Γυμνασίου</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Κεφάλαια</h1>
            <p className="mt-3 text-sm leading-6 text-[#6b625b] sm:text-base">
              Κάθε κεφάλαιο έχει τα βασικά της φωτοτυπίας του καθηγητή, απλή θεωρία, λυμένα παραδείγματα, ασκήσεις από το βοήθημα με
              κρυφή λύση και τελικό τεστ.
            </p>
          </div>
        </header>

        <ul className="space-y-4">
          {PHYSICS_CHAPTERS.map((c) => (
            <li key={c.slug} className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
              <Link href={`/sideris/fysiki/${c.slug}`} prefetch={false} className="flex items-center gap-4 p-5 transition hover:bg-[#fbfaf7]">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#6b3fa0] text-2xl font-bold text-white">{c.number}</span>
                <span className="min-w-0">
                  <span className="block text-xl font-semibold tracking-tight">
                    Κεφάλαιο {c.number}: {c.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[#6f665f]">{c.summary}</span>
                </span>
              </Link>
              <ul className="flex flex-wrap gap-2 border-t border-black/10 px-5 py-3">
                {c.sections.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/sideris/fysiki/${c.slug}#${s.id}`}
                      prefetch={false}
                      className="inline-block rounded-full border border-black/10 bg-[#f7f4ef] px-3 py-1 text-sm font-medium text-[#4d4138] transition hover:bg-[#ece4da]"
                    >
                      {s.code} {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

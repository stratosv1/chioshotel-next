import Link from "next/link";
import { listPhysicsChapters } from "@/lib/mixalis/db";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default async function MixalisDashboardPage() {
  const chapters = await listPhysicsChapters();
  const materialBatchCount = chapters.reduce(
    (total, chapter) => total + chapter.materialBatchCount,
    0,
  );
  const latestUpdate = chapters[0]?.updatedAt ?? null;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
              Physics Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Καλημέρα, Μιχάλη
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b625b] sm:text-base">
              Κάθε κεφάλαιο μεγαλώνει μαζί με τα μαθήματά σου. Πρόσθεσε νέο υλικό χωρίς να χάνεται ό,τι έχει ήδη οργανωθεί.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/mixalis/chapters/new"
              className="rounded-xl bg-[#403630] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f2824]"
            >
              + Νέο κεφάλαιο
            </Link>
            <form action="/mixalis/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-[#f7f4ef]"
              >
                Αποσύνδεση
              </button>
            </form>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-[#ded4c7] p-5">
            <p className="text-sm text-[#64584e]">Κεφάλαια</p>
            <p className="mt-2 text-3xl font-semibold">{chapters.length}</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-sm text-[#736a63]">Προσθήκες υλικού</p>
            <p className="mt-2 text-3xl font-semibold">{materialBatchCount}</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-sm text-[#736a63]">Τελευταία ενημέρωση</p>
            <p className="mt-2 text-lg font-semibold">
              {latestUpdate ? formatDate(latestUpdate) : "Δεν υπάρχει ακόμη"}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
                Κεφάλαια
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                {chapters.length > 0 ? "Η ύλη σου" : "Ξεκίνα από ένα κεφάλαιο"}
              </h2>
            </div>
          </div>

          {chapters.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/mixalis/chapters/${chapter.id}`}
                  className="group flex min-h-56 flex-col rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-[#f1ede7] px-3 py-1 text-xs font-semibold text-[#74665b]">
                      {chapter.materialBatchCount} προσθήκες
                    </span>
                    <span className="text-xs text-[#8a817a]">
                      {formatDate(chapter.updatedAt)}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold transition group-hover:text-[#6d5848]">
                    {chapter.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#6f665f]">
                    {chapter.note || "Δεν έχει προστεθεί σημείωση ακόμη."}
                  </p>
                  <span className="mt-6 text-sm font-semibold text-[#5f5045]">
                    Άνοιγμα κεφαλαίου →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-8 text-center">
              <h3 className="text-xl font-semibold">Δεν υπάρχει κεφάλαιο ακόμη</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#6f665f]">
                Δημιούργησε το πρώτο κεφάλαιο. Μετά θα μπορείς να προσθέτεις υλικό από κάθε μάθημα ξεχωριστά.
              </p>
              <Link
                href="/mixalis/chapters/new"
                className="mt-5 inline-flex rounded-xl bg-[#403630] px-4 py-2.5 text-sm font-semibold text-white"
              >
                + Δημιουργία κεφαλαίου
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

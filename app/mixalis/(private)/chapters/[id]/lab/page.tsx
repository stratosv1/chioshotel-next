import Link from "next/link";
import { notFound } from "next/navigation";
import { Beaker, BrainCircuit, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SmartLabRunner from "@/components/mixalis/SmartLabRunner";
import { getPhysicsChapter } from "@/lib/mixalis/db";
import { getSmartLabRevisionView } from "@/lib/mixalis/smartlab";
import {
  getSingleSmartLabStateCompat as getSingleSmartLabState,
  listSingleSmartLabStatesByChapterCompat as listSingleSmartLabStatesByChapter,
} from "@/lib/mixalis/smartlab-single-compat";
import { SMARTLAB_PROMPT_VERSION } from "@/lib/mixalis/smartlab-prompt";

export const dynamic = "force-dynamic";

export default async function MixalisChapterLabPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ revision?: string; subchapter?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const [chapter, states] = await Promise.all([
    getPhysicsChapter(id),
    listSingleSmartLabStatesByChapter(id),
  ]);
  if (!chapter) notFound();

  const selected = query.subchapter
    ? await getSingleSmartLabState(query.subchapter)
    : null;
  if (query.subchapter && (!selected || !states.some((state) => state.subchapterId === selected.subchapterId))) notFound();

  const requestedRevision = query.revision ? await getSmartLabRevisionView(query.revision) : null;
  const requestedMatches = Boolean(
    requestedRevision &&
      requestedRevision.chapterId === id &&
      (!selected || (
        requestedRevision.lessonVersions.length === 1 &&
        requestedRevision.lessonVersions[0]?.subchapterId === selected.subchapterId
      )),
  );
  const currentRevision = selected?.currentRevisionId
    ? await getSmartLabRevisionView(selected.currentRevisionId)
    : null;
  const activeRevision = requestedMatches ? requestedRevision : currentRevision;

  const readyCount = states.filter((state) => state.upToDate && state.currentRevisionId).length;
  const lessonCount = states.filter((state) => state.lessonRevisionId && state.quantityCount > 0).length;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/mixalis/chapters/${id}`} className="text-sm font-medium text-[#6e5d50] hover:underline">
            ← Πίσω στο κεφάλαιο
          </Link>
          <Badge variant="outline" className="bg-white">SMARTLAB · {SMARTLAB_PROMPT_VERSION} · per lesson</Badge>
        </div>

        <header className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.35fr_.65fr]">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#65745f]">
                <Beaker className="h-4 w-4" /> LAB
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {chapter.numberLabel ? `${chapter.numberLabel} · ` : ""}{chapter.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[#6c635c] sm:text-base">
                Κάθε LAB είναι ανεξάρτητο. Δημιουργείται χειροκίνητα μόνο από το current START του συγκεκριμένου μαθήματος και δεν ξανατρέχει κανένα άλλο υποκεφάλαιο.
              </p>
            </div>
            <div className="border-t border-black/10 bg-[#eef2e9] p-6 lg:border-l lg:border-t-0 sm:p-8">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4d644f]"><BrainCircuit className="h-4 w-4" /> Per-lesson LAB status</div>
              <p className="mt-3 text-3xl font-semibold text-[#40583d]">{readyCount}/{lessonCount}</p>
              <p className="mt-1 text-xs leading-5 text-[#657365]">έτοιμα LAB για τα current START μαθήματα</p>
            </div>
          </div>
        </header>

        {selected ? (
          <section className="mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d6e62]">Επιλεγμένο μάθημα</p>
                <h2 className="mt-1 text-2xl font-semibold">{selected.subchapterLabel} · {selected.subchapterTitle}</h2>
                {selected.lessonRevisionId ? (
                  <p className="mt-1 text-sm text-[#6f665f]">START Revision {selected.lessonRevisionNumber} · {selected.quantityCount} φυσικά μεγέθη</p>
                ) : null}
              </div>
              <Link href={`/mixalis/chapters/${id}/lab`} className="text-sm font-semibold text-[#53654f] hover:underline">
                Όλα τα LAB
              </Link>
            </div>

            {activeRevision ? (
              <>
                {selected.lessonRevisionId && !selected.upToDate && activeRevision.status === "current" ? (
                  <Card className="mb-5 rounded-2xl border-[#d8c8ad] bg-[#fffaf1]">
                    <CardHeader className="pb-3"><CardTitle className="text-lg">Το LAB αυτού του μαθήματος χρειάζεται ανανέωση</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-sm leading-6 text-[#766753]">
                        Το current START αυτού του υποκεφαλαίου άλλαξε. Δημιούργησε νέο LAB μόνο για το {selected.subchapterLabel}. Το υπάρχον παραμένει ασφαλές μέχρι να ολοκληρωθεί το νέο.
                      </p>
                      <form action={`/mixalis/api/smartlab/subchapters/${selected.subchapterId}`} method="post">
                        <button className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#334f39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#29412f]" type="submit">
                          <RefreshCw className="h-4 w-4" /> Νέο LAB μόνο για {selected.subchapterLabel}
                        </button>
                      </form>
                    </CardContent>
                  </Card>
                ) : null}
                <SmartLabRunner initialView={activeRevision} />
              </>
            ) : selected.lessonRevisionId && selected.quantityCount > 0 ? (
              <Card className="rounded-3xl border-stone-200">
                <CardHeader><CardTitle>Δημιούργησε το LAB του {selected.subchapterLabel}</CardTitle></CardHeader>
                <CardContent>
                  <p className="max-w-2xl text-sm leading-6 text-stone-600">
                    Θα χρησιμοποιηθεί μόνο το current START Revision {selected.lessonRevisionNumber} του «{selected.subchapterTitle}». Κανένα άλλο μάθημα του κεφαλαίου δεν θα σταλεί στο AI και κανένα υπάρχον LAB δεν θα ξαναδημιουργηθεί.
                  </p>
                  <form action={`/mixalis/api/smartlab/subchapters/${selected.subchapterId}`} method="post">
                    <button className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#334f39] px-5 py-3 text-sm font-bold text-white hover:bg-[#29412f]" type="submit">
                      <Beaker className="h-4 w-4" /> Δημιουργία LAB {selected.subchapterLabel}
                    </button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-3xl border-stone-200">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-semibold">Πρώτα χρειάζεται current START</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">Το LAB ενεργοποιείται μόνο όταν το συγκεκριμένο υποκεφάλαιο έχει ολοκληρωμένο current μάθημα με φυσικά μεγέθη.</p>
                </CardContent>
              </Card>
            )}
          </section>
        ) : (
          <section className="mt-6 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d6e62]">LAB ανά μάθημα</p>
              <h2 className="mt-1 text-2xl font-semibold">Επίλεξε ποιο μάθημα θέλεις να δημιουργήσεις</h2>
              <p className="mt-2 text-sm leading-6 text-[#6f665f]">Κάθε κουμπί αφορά αποκλειστικά ένα υποκεφάλαιο.</p>
            </div>

            {states.map((state) => {
              const hasLesson = Boolean(state.lessonRevisionId && state.quantityCount > 0);
              const ready = Boolean(state.upToDate && state.currentRevisionId);
              return (
                <Card key={state.subchapterId} className="rounded-2xl border-stone-200">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <strong>{state.subchapterLabel} · {state.subchapterTitle}</strong>
                        <Badge variant="outline" className={ready ? "border-[#b8cab5] bg-[#eef5ed] text-[#40583d]" : "bg-white"}>
                          {ready ? "LAB έτοιμο" : hasLesson ? "Έτοιμο για LAB" : "Περιμένει START"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-stone-500">
                        {hasLesson ? `START Revision ${state.lessonRevisionNumber} · ${state.quantityCount} μεγέθη` : "Δεν υπάρχει ακόμη current START με φυσικά μεγέθη."}
                      </p>
                    </div>

                    {ready && state.currentRevisionId ? (
                      <Link
                        href={`/mixalis/chapters/${id}/lab?subchapter=${state.subchapterId}&revision=${state.currentRevisionId}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#334f39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#29412f]"
                      >
                        Άνοιγμα LAB
                      </Link>
                    ) : hasLesson ? (
                      <form action={`/mixalis/api/smartlab/subchapters/${state.subchapterId}`} method="post">
                        <button className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#334f39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#29412f]" type="submit">
                          Δημιουργία LAB
                        </button>
                      </form>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

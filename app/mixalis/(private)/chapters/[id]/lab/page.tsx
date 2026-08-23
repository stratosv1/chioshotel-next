import Link from "next/link";
import { notFound } from "next/navigation";
import { Beaker, BrainCircuit, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SmartLabRunner from "@/components/mixalis/SmartLabRunner";
import {
  getSmartLabChapterState,
  getSmartLabRevisionView,
  SMARTLAB_PROMPT_VERSION,
} from "@/lib/mixalis/smartlab";

export const dynamic = "force-dynamic";

export default async function MixalisChapterLabPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ revision?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const state = await getSmartLabChapterState(id);
  if (!state) notFound();

  const requestedRevision = query.revision ? await getSmartLabRevisionView(query.revision) : null;
  const activeRevision = requestedRevision?.chapterId === id ? requestedRevision : state.current;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/mixalis/chapters/${id}`} className="text-sm font-medium text-[#6e5d50] hover:underline">
            ← Πίσω στο κεφάλαιο
          </Link>
          <Badge variant="outline" className="bg-white">SMARTLAB · {SMARTLAB_PROMPT_VERSION}</Badge>
        </div>

        <header className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.35fr_.65fr]">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#65745f]">
                <Beaker className="h-4 w-4" /> LAB
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {state.chapter.label ? `${state.chapter.label} · ` : ""}{state.chapter.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[#6c635c] sm:text-base">
                Εδώ το SMARTLAB μετατρέπει τις έννοιες του SMART σε πραγματικά interactive πειράματα. Πρώτα προβλέπεις, μετά αλλάζεις τις φυσικές μεταβλητές και βλέπεις άμεσα τι αλλάζει στο φαινόμενο.
              </p>
            </div>
            <div className="border-t border-black/10 bg-[#eef2e9] p-6 lg:border-l lg:border-t-0 sm:p-8">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4d644f]"><BrainCircuit className="h-4 w-4" /> Current SMART inputs</div>
              <div className="mt-4 space-y-2">
                {state.smartVersions.map((smart) => (
                  <div key={smart.subchapterId} className="rounded-xl bg-white/80 px-3 py-2 text-xs leading-5 text-[#556356]">
                    <strong>{smart.subchapterLabel}</strong> · {smart.subchapterTitle}
                    <span className="ml-2 text-[#7a887b]">SMART v{smart.versionNumber}</span>
                  </div>
                ))}
                {state.smartVersions.length === 0 ? <p className="text-sm text-[#657365]">Δεν υπάρχει ακόμη current SMART σε αυτό το κεφάλαιο.</p> : null}
              </div>
            </div>
          </div>
        </header>

        <section className="mt-6">
          {activeRevision ? (
            <>
              {!state.upToDate && activeRevision.status === "current" ? (
                <Card className="mb-5 rounded-2xl border-[#d8c8ad] bg-[#fffaf1]">
                  <CardHeader className="pb-3"><CardTitle className="text-lg">Το LAB χρειάζεται ανανέωση</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-[#766753]">Έχει αλλάξει κάποιο current SMART ή η έκδοση του SMARTLAB. Δημιούργησε νέο Lab Revision χωρίς να χαθεί το υπάρχον.</p>
                    <form action={`/mixalis/api/smartlab/chapters/${id}`} method="post">
                      <button className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#334f39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#29412f]" type="submit">
                        <RefreshCw className="h-4 w-4" /> Νέο SMARTLAB
                      </button>
                    </form>
                  </CardContent>
                </Card>
              ) : null}
              <SmartLabRunner initialView={activeRevision} />
            </>
          ) : state.smartVersions.length > 0 ? (
            <Card className="rounded-3xl border-stone-200">
              <CardHeader>
                <CardTitle>Δημιούργησε το LAB του κεφαλαίου</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="max-w-2xl text-sm leading-6 text-stone-600">
                  Το SMARTLAB θα χρησιμοποιήσει μόνο τα current SMART που φαίνονται επάνω και θα δημιουργήσει ξεχωριστό, versioned Lab. Δεν αλλάζει τα μαθήματα START.
                </p>
                <form action={`/mixalis/api/smartlab/chapters/${id}`} method="post">
                  <button className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#334f39] px-5 py-3 text-sm font-bold text-white hover:bg-[#29412f]" type="submit">
                    <Beaker className="h-4 w-4" /> Δημιουργία SMARTLAB
                  </button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-3xl border-stone-200">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold">Πρώτα χρειάζεται SMART</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">Μόλις ένα υποκεφάλαιο αποκτήσει current SMART, θα μπορεί να συμμετέχει στο LAB του κεφαλαίου.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import SourceSegmentationReview from "@/components/mixalis/SourceSegmentationReview";
import { getPhysicsChapter, listPhysicsSubchapters } from "@/lib/mixalis/db";
import { getSegmentationReview } from "@/lib/mixalis/source-segmentation";

export default async function MixalisSegmentationReviewPage({
  params,
}: {
  params: Promise<{ id: string; runId: string }>;
}) {
  const { id, runId } = await params;
  const [chapter, review, subchapters] = await Promise.all([
    getPhysicsChapter(id),
    getSegmentationReview(runId, id),
    listPhysicsSubchapters(id),
  ]);

  if (!chapter || !review) notFound();

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/mixalis/chapters/${id}`}
          className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
        >
          ← Πίσω στο κεφάλαιο
        </Link>

        <header className="mb-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
            PHASE3 · Αυτόματος διαχωρισμός πηγής
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Έλεγχος αντιστοίχισης φωτογραφιών
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[#6b625b] sm:text-base">
            {chapter.numberLabel ? `Κεφάλαιο ${chapter.numberLabel} · ` : ""}
            {chapter.title}. Η AI πρότεινε σε ποιο επίσημο υποκεφάλαιο ανήκει κάθε φωτογραφία. Διόρθωσε μόνο ό,τι χρειάζεται και μετά επιβεβαίωσε τον διαχωρισμό.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#746a62]">
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">
              {review.run.label || review.run.sourceType}
            </span>
            <span className="rounded-full bg-[#f1ede7] px-3 py-1.5">
              {review.run.status === "confirmed"
                ? "Επιβεβαιωμένο"
                : review.run.status === "ready"
                  ? "Έτοιμο για επιβεβαίωση"
                  : review.run.status === "needs_review"
                    ? "Χρειάζεται έλεγχο"
                    : review.run.status === "error"
                      ? "Σφάλμα ανάλυσης"
                      : "Ανάλυση"}
            </span>
          </div>
        </header>

        <SourceSegmentationReview review={review} subchapters={subchapters} />

        {review.run.status === "confirmed" ? (
          <section className="mt-6 rounded-3xl border border-[#cfc1b2] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
              Επόμενο στάδιο · Source Intelligence
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Μετατροπή της πηγής σε δομημένη γνώση</h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[#6e655e]">
              Ο διαχωρισμός έχει κλειδώσει. Το επόμενο στάδιο δεν γράφει μάθημα. Αναλύει μόνο το επιβεβαιωμένο υλικό και εξάγει απαιτήσεις συλλογισμού, σχέσεις μεγεθών, παγίδες, παρανοήσεις, δύσκολες περιπτώσεις και διδακτικές ανάγκες. Το START θα χρησιμοποιηθεί αργότερα, μετά τη σύνθεση με το επίσημο σχολικό βιβλίο.
            </p>
            <form
              action={`/mixalis/api/source-intelligence/from-segmentation/${runId}`}
              method="post"
              className="mt-5"
            >
              <button
                type="submit"
                className="w-full rounded-xl bg-[#493d35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#342c27] sm:w-auto"
              >
                Άνοιγμα Source Intelligence
              </button>
            </form>
          </section>
        ) : null}
      </div>
    </main>
  );
}

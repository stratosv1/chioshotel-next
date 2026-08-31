import Link from "next/link";
import { notFound } from "next/navigation";
import PhysicsPipeline from "@/components/mixalis/PhysicsPipeline";
import { getPhysicsChapter, listPhysicsSubchapters } from "@/lib/mixalis/db";
import { listPhysicsPipelineByChapter } from "@/lib/mixalis/lesson-navigation";

export default async function MixalisChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [chapter, subchapters, pipelines] = await Promise.all([
    getPhysicsChapter(id),
    listPhysicsSubchapters(id),
    listPhysicsPipelineByChapter(id),
  ]);

  if (!chapter) notFound();

  const backHref = chapter.courseCode
    ? `/mixalis/courses/${chapter.courseCode}`
    : "/mixalis";

  const completedLessons = pipelines.filter((pipeline) => pipeline.lesson.upToDate).length;
  const mappedSavvalas = pipelines.filter((pipeline) => Boolean(pipeline.savvalas.rangeId)).length;
  const auditedSavvalas = pipelines.filter((pipeline) => pipeline.savvalas.status === "ready").length;

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={backHref}
          className="mb-5 inline-flex text-sm font-medium text-[#6e5d50] hover:underline"
        >
          ← Πίσω στα κεφάλαια
        </Link>

        <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
                {chapter.numberLabel ? `Κεφάλαιο ${chapter.numberLabel}` : "Κεφάλαιο"}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {chapter.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6b625b] sm:text-base">
                {chapter.note ||
                  `${subchapters.length} υποκεφάλαια οργανωμένα σύμφωνα με το σχολικό βιβλίο.`}
              </p>
            </div>

            <div className="grid min-w-72 grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-[#f1ede7] p-4">
                <p className="text-2xl font-semibold">{mappedSavvalas}/{subchapters.length}</p>
                <p className="mt-1 text-xs text-[#736a63]">mapped</p>
              </div>
              <div className="rounded-2xl bg-[#f1ede7] p-4">
                <p className="text-2xl font-semibold">{auditedSavvalas}/{subchapters.length}</p>
                <p className="mt-1 text-xs text-[#736a63]">depth audited</p>
              </div>
              <div className="rounded-2xl bg-[#f1ede7] p-4">
                <p className="text-2xl font-semibold">{completedLessons}/{subchapters.length}</p>
                <p className="mt-1 text-xs text-[#736a63]">START ready</p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-3xl border border-[#c6d3c1] bg-[#f1f6ef] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#65755f]">
                Νέα σταθερή ροή · PDF only
              </p>
              <h2 className="mt-1 text-xl font-semibold">Δεν ανεβάζεις πλέον φωτογραφίες</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#596653]">
                Το σχολικό βιβλίο και ο Σαββάλας αποθηκεύονται μία φορά ως πλήρη ιδιωτικά PDF.
                Από εδώ και πέρα κάθε υποκεφάλαιο ολοκληρώνεται μόνο από το Physics Pipeline παρακάτω.
                Τα παλιά photo batches παραμένουν μόνο ως ιστορικό και δεν συμμετέχουν σε νέα canonical γνώση ή νέο START μάθημα.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Link
                href="/mixalis/sources"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#554a43]"
              >
                Βιβλιοθήκη Πηγών
              </Link>
              <Link
                href="/mixalis/savvalas-auto-map"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#403630] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Mapping Σαββάλα
              </Link>
            </div>
          </div>
        </section>

        {subchapters.length > 0 ? (
          <PhysicsPipeline chapterId={chapter.id} subchapters={subchapters} pipelines={pipelines} />
        ) : (
          <section className="mt-6 rounded-3xl border border-dashed border-black/15 bg-white/70 p-6 text-sm text-[#6f665f]">
            Δεν υπάρχουν ενεργά υποκεφάλαια σε αυτό το κεφάλαιο.
          </section>
        )}

        <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#857261]">
            Κανόνας εργασίας
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Η ίδια σειρά σε κάθε μάθημα</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["1", "Mapping", "Επιβεβαιώνεις το PDF range του Σαββάλα."],
              ["2", "Depth Audit", "Αναλύεται μόνο αυτό το range του Σαββάλα."],
              ["3", "Official", "Αναλύεται μόνο το mapped σχολικό range."],
              ["4", "Intelligence", "Ενώνονται ακριβώς οι δύο canonical PDF πηγές."],
              ["5", "START", "Δημιουργείται η current lesson revision."],
            ].map(([number, title, detail]) => (
              <article key={number} className="rounded-2xl bg-[#f7f4ef] p-4">
                <p className="text-xs font-semibold text-[#88786b]">{number}</p>
                <h3 className="mt-1 font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#736a63]">{detail}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-[#6a615a]">
            Δεν χρειάζεται να θυμάσαι ποια σελίδα ή route ακολουθεί. Στο υποκεφάλαιο που δουλεύεις πατάς μόνο το πράσινο κουμπί του Pipeline και το σύστημα σε στέλνει στο σωστό επόμενο στάδιο.
          </p>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import type { PhysicsSubchapter } from "@/lib/mixalis/db";
import type { PhysicsPipelineNavigation } from "@/lib/mixalis/lesson-navigation";

type Checkpoint = {
  label: string;
  state: "ready" | "active" | "waiting" | "stale";
  detail: string;
};

function checkpointClass(state: Checkpoint["state"]) {
  if (state === "ready") return "border-[#b8cab5] bg-[#eef5ed] text-[#40583d]";
  if (state === "active") return "border-[#cdbd9d] bg-[#fbf5e9] text-[#725f3e]";
  if (state === "stale") return "border-[#d8c1ad] bg-[#faf1e9] text-[#795943]";
  return "border-black/10 bg-[#f7f4ef] text-[#7d736b]";
}

function checkpointMark(state: Checkpoint["state"]) {
  if (state === "ready") return "✓";
  if (state === "active" || state === "stale") return "→";
  return "·";
}

function buildCheckpoints(pipeline: PhysicsPipelineNavigation): Checkpoint[] {
  const savvalasReady = pipeline.savvalas.status === "ready";
  const officialReady = pipeline.official.status === "ready";
  const intelligenceCurrent = pipeline.intelligence.status === "current";
  const intelligenceReady = pipeline.intelligence.upToDate;
  const lessonReady = pipeline.lesson.upToDate;

  return [
    {
      label: "Σαββάλας",
      state: savvalasReady
        ? "ready"
        : pipeline.savvalas.status === "missing"
          ? "waiting"
          : "active",
      detail: savvalasReady
        ? "Depth έτοιμο"
        : pipeline.savvalas.status === "missing"
          ? "Δεν έχει αναλυθεί"
          : pipeline.savvalas.status === "error"
            ? "Χρειάζεται συνέχιση"
            : "Σε εξέλιξη",
    },
    {
      label: "Σχολικό",
      state: officialReady
        ? "ready"
        : savvalasReady && pipeline.official.rangeId
          ? "active"
          : "waiting",
      detail: officialReady
        ? "Official έτοιμο"
        : !pipeline.official.rangeId
          ? "Δεν έχει συνδεθεί range"
          : pipeline.official.status === "error"
            ? "Χρειάζεται επανάληψη"
            : pipeline.official.status === "missing"
              ? "Έτοιμο για ανάλυση"
              : "Σε εξέλιξη",
    },
    {
      label: "SMART",
      state: intelligenceReady
        ? "ready"
        : intelligenceCurrent
          ? "stale"
          : officialReady
            ? "active"
            : "waiting",
      detail: intelligenceReady
        ? `Current v${pipeline.intelligence.versionNumber ?? ""}`.trim()
        : intelligenceCurrent
          ? "Χρειάζεται SMART v2"
          : pipeline.intelligence.status === "draft"
            ? "Χρειάζεται σύνθεση"
            : "Αναμένει τις πηγές",
    },
    {
      label: "Μάθημα",
      state: lessonReady
        ? "ready"
        : intelligenceReady && pipeline.lesson.status === "current"
          ? "stale"
          : intelligenceReady
            ? "active"
            : "waiting",
      detail: lessonReady
        ? `Revision ${pipeline.lesson.revisionNumber ?? ""} · current`.trim()
        : intelligenceReady && pipeline.lesson.status === "current"
          ? "Χρειάζεται νέα revision"
          : intelligenceCurrent && !intelligenceReady
            ? "Περιμένει νέο SMART"
            : pipeline.lesson.status === "processing"
              ? "Δημιουργείται"
              : pipeline.lesson.status === "error"
                ? "Χρειάζεται επανάληψη"
                : "Δεν έχει δημιουργηθεί",
    },
  ];
}

function PipelineCta({
  pipeline,
  chapterId,
}: {
  pipeline: PhysicsPipelineNavigation;
  chapterId: string;
}) {
  const className =
    "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#304b35] px-5 py-3 text-center text-sm font-bold !text-white transition hover:bg-[#263d2b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#b7c8b4]";

  const needsSavvalasUpload =
    pipeline.savvalas.status !== "ready" && !pipeline.savvalas.analysisId;
  const href = needsSavvalasUpload
    ? `/mixalis/chapters/${chapterId}?source=savvalas&subchapterId=${pipeline.subchapterId}#chapter-material`
    : pipeline.next.href;

  if (pipeline.next.method === "post" && !needsSavvalasUpload) {
    return (
      <form action={pipeline.next.href} method="post" className="w-full">
        <button type="submit" className={className}>
          {pipeline.next.label}
        </button>
      </form>
    );
  }

  return (
    <Link href={href} prefetch={false} className={className}>
      {pipeline.next.label}
    </Link>
  );
}

export default function PhysicsPipeline({
  chapterId,
  subchapters,
  pipelines,
}: {
  chapterId: string;
  subchapters: PhysicsSubchapter[];
  pipelines: PhysicsPipelineNavigation[];
}) {
  const bySubchapter = new Map(pipelines.map((pipeline) => [pipeline.subchapterId, pipeline]));

  return (
    <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
            Physics Pipeline
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Ακολούθησε μόνο το επόμενο βήμα</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6d645d]">
            Κάθε υποκεφάλαιο περνά με τη σειρά από Σαββάλα, επίσημο σχολικό βιβλίο, SMART και START. Το κουμπί «Συνέχεια» ανοίγει πάντα το σωστό επόμενο στάδιο.
          </p>
        </div>
        <Link
          href={`/mixalis/chapters/${chapterId}/lab`}
          prefetch={false}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-[#9eb09a] bg-[#eef5ed] px-5 py-2.5 text-sm font-bold text-[#3f5a43] transition hover:bg-[#e4eee2]"
        >
          LAB · Εικονικά Εργαστήρια
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {subchapters.map((subchapter) => {
          const pipeline = bySubchapter.get(subchapter.id);
          if (!pipeline) return null;
          const checkpoints = buildCheckpoints(pipeline);

          return (
            <article
              key={subchapter.id}
              className="rounded-2xl border border-black/10 bg-[#fbfaf8] p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex min-w-14 justify-center rounded-xl bg-[#e8dfd3] px-3 py-2 text-sm font-bold text-[#5c5047]">
                      {subchapter.numberLabel}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold sm:text-lg">{subchapter.title}</h3>
                      <p className="mt-1 text-sm font-medium text-[#51644d]">
                        {pipeline.next.detail}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {checkpoints.map((checkpoint) => (
                      <div
                        key={checkpoint.label}
                        className={`rounded-xl border px-3 py-2.5 ${checkpointClass(checkpoint.state)}`}
                      >
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em]">
                          <span aria-hidden="true">{checkpointMark(checkpoint.state)}</span>
                          <span>{checkpoint.label}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 opacity-80">{checkpoint.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full shrink-0 lg:w-44">
                  <PipelineCta pipeline={pipeline} chapterId={chapterId} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

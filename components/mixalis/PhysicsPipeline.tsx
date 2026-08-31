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
  const savvalasMapped = Boolean(pipeline.savvalas.rangeId);
  const savvalasReady = pipeline.savvalas.status === "ready";
  const officialReady = pipeline.official.status === "ready";
  const intelligenceReady = pipeline.intelligence.upToDate;
  const lessonReady = pipeline.lesson.upToDate;

  return [
    {
      label: "1 · Mapping",
      state: savvalasMapped ? "ready" : "active",
      detail: savvalasMapped ? "PDF range επιβεβαιωμένο" : "Χρειάζεται mapping Σαββάλα",
    },
    {
      label: "2 · Depth",
      state: savvalasReady
        ? "ready"
        : savvalasMapped
          ? pipeline.savvalas.status === "error"
            ? "stale"
            : "active"
          : "waiting",
      detail: savvalasReady
        ? "Σαββάλας PDF έτοιμος"
        : !savvalasMapped
          ? "Περιμένει mapping"
          : pipeline.savvalas.status === "error"
            ? "Χρειάζεται επανάληψη"
            : "Χρειάζεται Depth Audit",
    },
    {
      label: "3 · Official",
      state: officialReady
        ? "ready"
        : savvalasReady && pipeline.official.rangeId
          ? pipeline.official.status === "error"
            ? "stale"
            : "active"
          : "waiting",
      detail: officialReady
        ? "School Book PDF έτοιμο"
        : !pipeline.official.rangeId
          ? "Λείπει official range"
          : !savvalasReady
            ? "Περιμένει Depth"
            : pipeline.official.status === "error"
              ? "Χρειάζεται επανάληψη"
              : "Χρειάζεται Official Intelligence",
    },
    {
      label: "4 · Intelligence",
      state: intelligenceReady
        ? "ready"
        : officialReady
          ? pipeline.intelligence.status === "current"
            ? "stale"
            : "active"
          : "waiting",
      detail: intelligenceReady
        ? `Canonical v${pipeline.intelligence.versionNumber ?? ""}`.trim()
        : !officialReady
          ? "Περιμένει τις 2 PDF πηγές"
          : pipeline.intelligence.status === "current"
            ? "Χρειάζεται νέα canonical version"
            : "Έτοιμο για σύνθεση",
    },
    {
      label: "5 · START",
      state: lessonReady
        ? "ready"
        : intelligenceReady
          ? pipeline.lesson.status === "current"
            ? "stale"
            : "active"
          : "waiting",
      detail: lessonReady
        ? `Revision ${pipeline.lesson.revisionNumber ?? ""} · current`.trim()
        : !intelligenceReady
          ? "Περιμένει canonical Intelligence"
          : pipeline.lesson.status === "processing"
            ? "Δημιουργείται"
            : pipeline.lesson.status === "error"
              ? "Χρειάζεται επανάληψη"
              : pipeline.lesson.status === "current"
                ? "Χρειάζεται νέα revision"
                : "Έτοιμο για δημιουργία",
    },
  ];
}

function PipelineCta({ pipeline }: { pipeline: PhysicsPipelineNavigation }) {
  const className =
    "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#304b35] px-5 py-3 text-center text-sm font-bold !text-white transition hover:bg-[#263d2b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#b7c8b4]";

  if (pipeline.next.method === "post") {
    return (
      <form action={pipeline.next.href} method="post" className="w-full">
        <button type="submit" className={className}>
          {pipeline.next.label}
        </button>
      </form>
    );
  }

  return (
    <Link href={pipeline.next.href} prefetch={false} className={className}>
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
            Physics Pipeline · PDF only
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Ένα κουμπί · πάντα το σωστό επόμενο βήμα</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6d645d]">
            Δεν ανεβάζεις πλέον φωτογραφίες. Για κάθε υποκεφάλαιο ακολουθείς πάντα την ίδια σειρά:
            Mapping Σαββάλα → Depth Audit → Official School Book → Canonical Intelligence → START.
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

      <div className="mt-5 rounded-2xl border border-[#c5d3c0] bg-[#f1f6ef] px-4 py-3 text-sm leading-6 text-[#53654f]">
        <strong>Σταθερός κανόνας:</strong> πάτησε μόνο το πράσινο κουμπί «επόμενο βήμα» στο υποκεφάλαιο που δουλεύεις. Το σύστημα δεν χρησιμοποιεί legacy φωτογραφίες για νέο μάθημα.
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
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
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

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {checkpoints.map((checkpoint) => (
                      <div
                        key={checkpoint.label}
                        className={`rounded-xl border px-3 py-2.5 ${checkpointClass(checkpoint.state)}`}
                      >
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.06em]">
                          <span aria-hidden="true">{checkpointMark(checkpoint.state)}</span>
                          <span>{checkpoint.label}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 opacity-80">{checkpoint.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full shrink-0 xl:w-52">
                  <PipelineCta pipeline={pipeline} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

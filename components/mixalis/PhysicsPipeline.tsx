"use client";

import Link from "next/link";
import { useState } from "react";
import type { PhysicsSubchapter } from "@/lib/mixalis/db";
import type { PhysicsPipelineNavigation } from "@/lib/mixalis/lesson-navigation";
import type { SingleSmartLabPipelineState } from "@/lib/mixalis/smartlab-single";

type ManualRanges = {
  savvalasFrom: string;
  savvalasTo: string;
  officialFrom: string;
  officialTo: string;
};

type ActionState = {
  busy: boolean;
  message: string;
  error: string;
};

function lessonLabReady(
  pipeline: PhysicsPipelineNavigation,
  lab: SingleSmartLabPipelineState | undefined,
) {
  return Boolean(
    pipeline.lesson.upToDate &&
      pipeline.lesson.revisionId &&
      lab?.upToDate &&
      lab.currentRevisionId &&
      lab.currentLessonRevisionId === pipeline.lesson.revisionId,
  );
}

function rangesMatchPipeline(value: ManualRanges, pipeline: PhysicsPipelineNavigation) {
  return (
    value.savvalasFrom === (pipeline.savvalas.pageFrom?.toString() || "") &&
    value.savvalasTo === (pipeline.savvalas.pageTo?.toString() || "") &&
    value.officialFrom === (pipeline.official.pageFrom?.toString() || "") &&
    value.officialTo === (pipeline.official.pageTo?.toString() || "")
  );
}

function internalProgress(pipeline: PhysicsPipelineNavigation) {
  return [
    ["Σαββάλας", pipeline.savvalas.status === "ready"],
    ["Επίσημη ύλη", pipeline.official.status === "ready"],
    ["Γνώση", pipeline.intelligence.upToDate],
    ["START", pipeline.lesson.upToDate],
  ] as const;
}

function LabCta({
  chapterId,
  subchapterId,
  pipeline,
  lab,
}: {
  chapterId: string;
  subchapterId: string;
  pipeline: PhysicsPipelineNavigation;
  lab: SingleSmartLabPipelineState | undefined;
}) {
  if (!pipeline.lesson.upToDate || !pipeline.lesson.revisionId) return null;

  const className =
    "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#9eb09a] bg-[#eef5ed] px-4 py-2.5 text-center text-sm font-bold text-[#3f5a43] transition hover:bg-[#e4eee2]";
  const labReady = lessonLabReady(pipeline, lab);

  if (labReady && lab?.currentRevisionId) {
    return (
      <Link
        href={`/mixalis/chapters/${chapterId}/lab?subchapter=${subchapterId}&revision=${lab.currentRevisionId}`}
        prefetch={false}
        className={className}
      >
        Άνοιγμα LAB
      </Link>
    );
  }

  return (
    <form action={`/mixalis/api/smartlab/subchapters/${subchapterId}`} method="post" className="w-full">
      <button type="submit" className={className}>
        {lab?.currentRevisionId ? "Νέο LAB" : "Δημιουργία LAB"}
      </button>
    </form>
  );
}

export default function PhysicsPipeline({
  chapterId,
  subchapters,
  pipelines,
  labStates,
}: {
  chapterId: string;
  subchapters: PhysicsSubchapter[];
  pipelines: PhysicsPipelineNavigation[];
  labStates: SingleSmartLabPipelineState[];
}) {
  const bySubchapter = new Map(pipelines.map((pipeline) => [pipeline.subchapterId, pipeline]));
  const labsBySubchapter = new Map(labStates.map((lab) => [lab.subchapterId, lab]));
  const completedLessons = pipelines.filter((pipeline) => pipeline.lesson.upToDate).length;
  const labReadyLessons = pipelines.filter((pipeline) =>
    lessonLabReady(pipeline, labsBySubchapter.get(pipeline.subchapterId)),
  ).length;

  const [ranges, setRanges] = useState<Record<string, ManualRanges>>(() =>
    Object.fromEntries(
      pipelines.map((pipeline) => [
        pipeline.subchapterId,
        {
          savvalasFrom: pipeline.savvalas.pageFrom?.toString() || "",
          savvalasTo: pipeline.savvalas.pageTo?.toString() || "",
          officialFrom: pipeline.official.pageFrom?.toString() || "",
          officialTo: pipeline.official.pageTo?.toString() || "",
        },
      ]),
    ),
  );
  const [actions, setActions] = useState<Record<string, ActionState>>({});

  function setAction(subchapterId: string, patch: Partial<ActionState>) {
    setActions((current) => ({
      ...current,
      [subchapterId]: {
        busy: current[subchapterId]?.busy ?? false,
        message: current[subchapterId]?.message ?? "",
        error: current[subchapterId]?.error ?? "",
        ...patch,
      },
    }));
  }

  function updateRange(subchapterId: string, field: keyof ManualRanges, value: string) {
    setRanges((current) => ({
      ...current,
      [subchapterId]: { ...current[subchapterId], [field]: value },
    }));
  }

  async function persistManualRanges(subchapterId: string) {
    const value = ranges[subchapterId];
    const response = await fetch(`/mixalis/api/manual-mapping/${subchapterId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        savvalasFrom: Number(value.savvalasFrom),
        savvalasTo: Number(value.savvalasTo),
        officialFrom: Number(value.officialFrom),
        officialTo: Number(value.officialTo),
      }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error || "Δεν αποθηκεύτηκαν οι PDF σελίδες.");
  }

  async function continueLessonBuild(subchapterId: string) {
    const response = await fetch(`/mixalis/api/lesson-build/${subchapterId}`, { method: "POST" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error || "Η δημιουργία του μαθήματος απέτυχε.");

    if (payload?.done) {
      setAction(subchapterId, { busy: false, message: "Το μάθημα είναι έτοιμο.", error: "" });
      window.location.reload();
      return;
    }

    setAction(subchapterId, {
      busy: true,
      message: String(payload?.message || "Η δημιουργία συνεχίζεται…"),
      error: "",
    });
    window.setTimeout(() => void continueLessonBuild(subchapterId), 6500);
  }

  async function createLesson(subchapterId: string) {
    setAction(subchapterId, { busy: true, error: "", message: "Αποθηκεύονται οι PDF σελίδες…" });
    try {
      await persistManualRanges(subchapterId);
      setAction(subchapterId, { busy: true, error: "", message: "Ξεκινά η δημιουργία του μαθήματος…" });
      await continueLessonBuild(subchapterId);
    } catch (error) {
      setAction(subchapterId, {
        busy: false,
        message: "",
        error: error instanceof Error ? error.message : "Η δημιουργία του μαθήματος απέτυχε.",
      });
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
            Physics Workspace · Manual PDF
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Βάζεις 4 αριθμούς · πατάς Δημιουργία μαθήματος</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6d645d]">
            Δεν γίνεται πλέον AI εντοπισμός σελίδων. Δίνεις εσύ τα ακριβή ORIGINAL PDF ranges για Σαββάλα και σχολικό βιβλίο. Το ίδιο κουμπί αποθηκεύει τα ranges και ολοκληρώνει αυτόματα Depth → Official → Canonical → START.
          </p>
        </div>
        <Link
          href={`/mixalis/chapters/${chapterId}/lab`}
          prefetch={false}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-[#9eb09a] bg-[#eef5ed] px-5 py-2.5 text-sm font-bold text-[#3f5a43] transition hover:bg-[#e4eee2]"
        >
          LAB · {labReadyLessons}/{completedLessons} έτοιμα
        </Link>
      </div>

      <div className="mt-5 rounded-2xl border border-[#c5d3c0] bg-[#f1f6ef] px-4 py-3 text-sm leading-6 text-[#53654f]">
        <strong>Μόνη προετοιμασία:</strong> γράφεις ORIGINAL PDF σελίδες, όχι την τυπωμένη αρίθμηση του βιβλίου. Μετά πατάς μόνο «Δημιουργία μαθήματος». Το LAB παραμένει ξεχωριστό και χειροκίνητο.
      </div>

      <div className="mt-6 space-y-4">
        {subchapters.map((subchapter) => {
          const pipeline = bySubchapter.get(subchapter.id);
          if (!pipeline) return null;
          const lab = labsBySubchapter.get(subchapter.id);
          const value = ranges[subchapter.id] || {
            savvalasFrom: "",
            savvalasTo: "",
            officialFrom: "",
            officialTo: "",
          };
          const action = actions[subchapter.id] || { busy: false, message: "", error: "" };
          const completeRanges = Boolean(
            value.savvalasFrom && value.savvalasTo && value.officialFrom && value.officialTo,
          );
          const rangesChanged = !rangesMatchPipeline(value, pipeline);
          const progress = internalProgress(pipeline);
          const lessonCurrentForTheseRanges = pipeline.lesson.upToDate && !rangesChanged;

          return (
            <article key={subchapter.id} className="rounded-2xl border border-black/10 bg-[#fbfaf8] p-4 sm:p-5">
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex min-w-14 justify-center rounded-xl bg-[#e8dfd3] px-3 py-2 text-sm font-bold text-[#5c5047]">
                    {subchapter.numberLabel}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold sm:text-lg">{subchapter.title}</h3>
                    <p className="mt-1 text-xs text-[#776d65]">
                      {lessonCurrentForTheseRanges
                        ? `Μάθημα έτοιμο · START Revision ${pipeline.lesson.revisionNumber ?? ""}`
                        : completeRanges
                          ? "Οι σελίδες είναι συμπληρωμένες · πάτησε Δημιουργία μαθήματος"
                          : "Συμπλήρωσε τις σελίδες των δύο PDF"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <div className="rounded-xl border border-black/10 bg-white p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#75675c]">Σαββάλας · ORIGINAL PDF</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <label className="text-xs text-[#746b64]">Από
                        <input type="number" min="1" inputMode="numeric" value={value.savvalasFrom} onChange={(event) => updateRange(subchapter.id, "savvalasFrom", event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-base font-semibold text-[#2c2825]" />
                      </label>
                      <label className="text-xs text-[#746b64]">Έως
                        <input type="number" min="1" inputMode="numeric" value={value.savvalasTo} onChange={(event) => updateRange(subchapter.id, "savvalasTo", event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-base font-semibold text-[#2c2825]" />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-xl border border-black/10 bg-white p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#75675c]">Σχολικό βιβλίο · ORIGINAL PDF</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <label className="text-xs text-[#746b64]">Από
                        <input type="number" min="1" inputMode="numeric" value={value.officialFrom} onChange={(event) => updateRange(subchapter.id, "officialFrom", event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-base font-semibold text-[#2c2825]" />
                      </label>
                      <label className="text-xs text-[#746b64]">Έως
                        <input type="number" min="1" inputMode="numeric" value={value.officialTo} onChange={(event) => updateRange(subchapter.id, "officialTo", event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-base font-semibold text-[#2c2825]" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {progress.map(([label, ready]) => (
                    <span key={label} className={`rounded-full border px-3 py-1 text-xs font-semibold ${ready ? "border-[#bdd0ba] bg-[#eef5ed] text-[#496149]" : "border-black/10 bg-[#f3efe9] text-[#81776f]"}`}>
                      {ready ? "✓ " : "· "}{label}
                    </span>
                  ))}
                </div>

                {action.message ? <p className="rounded-xl bg-[#eef5ed] px-3 py-2 text-sm font-medium text-[#4d644c]">{action.message}</p> : null}
                {action.error ? <p className="rounded-xl bg-[#fbefea] px-3 py-2 text-sm font-medium text-[#875342]">{action.error}</p> : null}

                <div className="grid gap-2 sm:grid-cols-2">
                  {lessonCurrentForTheseRanges && pipeline.lesson.revisionId ? (
                    <Link href={`/mixalis/lessons/${pipeline.lesson.revisionId}`} prefetch={false} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#304b35] px-5 py-3 text-center text-sm font-bold !text-white transition hover:bg-[#263d2b]">
                      Άνοιγμα μαθήματος
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled={!completeRanges || action.busy}
                      onClick={() => void createLesson(subchapter.id)}
                      className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#304b35] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#263d2b] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {action.busy ? "Δημιουργείται…" : pipeline.lesson.upToDate ? "Επαναδημιουργία μαθήματος" : "Δημιουργία μαθήματος"}
                    </button>
                  )}

                  <LabCta chapterId={chapterId} subchapterId={subchapter.id} pipeline={pipeline} lab={lab} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

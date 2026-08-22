"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { PhysicsSubchapter } from "@/lib/mixalis/db";
import type { SourceSegmentationReviewData } from "@/lib/mixalis/source-segmentation";

type Draft = {
  primarySubchapterId: string;
  secondarySubchapterId: string;
  boundary: boolean;
};

function buildDrafts(files: SourceSegmentationReviewData["files"]): Record<string, Draft> {
  return Object.fromEntries(
    files.map((file) => {
      const primary =
        file.mappings.find((mapping) => mapping.relation === "primary") ||
        file.mappings.find((mapping) => mapping.relation === "boundary") ||
        file.mappings[0];
      const secondary = file.mappings.find(
        (mapping) => mapping.subchapterId !== primary?.subchapterId,
      );
      return [
        file.id,
        {
          primarySubchapterId: primary?.subchapterId || "",
          secondarySubchapterId: secondary?.subchapterId || "",
          boundary: file.mappings.some((mapping) => mapping.relation === "boundary"),
        },
      ];
    }),
  );
}

function confidenceLabel(value: number | null) {
  if (value == null) return "Χωρίς αντιστοίχιση";
  if (value >= 0.9) return `Υψηλή βεβαιότητα ${Math.round(value * 100)}%`;
  if (value >= 0.75) return `Καλή βεβαιότητα ${Math.round(value * 100)}%`;
  return `Θέλει έλεγχο ${Math.round(value * 100)}%`;
}

export default function SourceSegmentationReview({
  review,
  subchapters,
}: {
  review: SourceSegmentationReviewData;
  subchapters: PhysicsSubchapter[];
}) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() => buildDrafts(review.files));
  const [busyFileId, setBusyFileId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(buildDrafts(review.files));
  }, [review.files]);

  const summary = useMemo(() => {
    const unclassified = review.files.filter((file) => file.mappings.length === 0).length;
    const lowConfidence = review.files.filter((file) =>
      file.mappings.some((mapping) => mapping.confidence < 0.75),
    ).length;
    const boundary = review.files.filter((file) =>
      file.mappings.some((mapping) => mapping.relation === "boundary"),
    ).length;
    return {
      total: review.files.length,
      mapped: review.files.length - unclassified,
      unclassified,
      lowConfidence,
      boundary,
    };
  }, [review.files]);

  const countsBySubchapter = useMemo(
    () =>
      subchapters.map((subchapter) => ({
        ...subchapter,
        count: review.files.filter((file) =>
          file.mappings.some((mapping) => mapping.subchapterId === subchapter.id),
        ).length,
      })),
    [review.files, subchapters],
  );

  async function saveFile(fileId: string) {
    const draft = drafts[fileId];
    if (!draft?.primarySubchapterId) {
      setError("Επίλεξε κύριο υποκεφάλαιο πριν αποθηκεύσεις.");
      return;
    }

    setBusyFileId(fileId);
    setError(null);

    const secondary =
      draft.secondarySubchapterId &&
      draft.secondarySubchapterId !== draft.primarySubchapterId
        ? draft.secondarySubchapterId
        : "";
    const mappings = [
      {
        subchapterId: draft.primarySubchapterId,
        relation: draft.boundary && secondary ? "boundary" : "primary",
      },
      ...(secondary
        ? [
            {
              subchapterId: secondary,
              relation: draft.boundary ? "boundary" : "related",
            },
          ]
        : []),
    ];

    try {
      const response = await fetch(
        `/mixalis/api/segmentation/runs/${review.run.id}/files/${fileId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mappings }),
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || "Η διόρθωση απέτυχε.");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Η διόρθωση απέτυχε.");
    } finally {
      setBusyFileId(null);
    }
  }

  async function confirm() {
    if (summary.unclassified > 0 || confirming) return;
    setConfirming(true);
    setError(null);

    try {
      const response = await fetch(
        `/mixalis/api/segmentation/runs/${review.run.id}/confirm`,
        { method: "POST" },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || "Η επιβεβαίωση απέτυχε.");
      router.refresh();
    } catch (confirmError) {
      setError(
        confirmError instanceof Error ? confirmError.message : "Η επιβεβαίωση απέτυχε.",
      );
    } finally {
      setConfirming(false);
    }
  }

  const locked = review.run.status === "confirmed";

  return (
    <div className="space-y-6">
      {review.run.errorMessage ? (
        <div className="rounded-2xl border border-[#e0c4b8] bg-[#fbf1ed] p-4 text-sm leading-6 text-[#794c3d]">
          <strong>Σημείωση ανάλυσης:</strong> {review.run.errorMessage}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-[#e0c4b8] bg-[#fbf1ed] p-4 text-sm text-[#794c3d]">
          {error}
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Φωτογραφίες", summary.total],
          ["Αντιστοιχισμένες", summary.mapped],
          ["Χωρίς αντιστοίχιση", summary.unclassified],
          ["Θέλουν έλεγχο", summary.lowConfidence],
          ["Σελίδες μετάβασης", summary.boundary],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-[#756b63]">{label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#857261]">
          Σύνοψη ανά υποκεφάλαιο
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {countsBySubchapter.map((subchapter) => (
            <div key={subchapter.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f3ed] px-4 py-3 text-sm">
              <span className="min-w-0 truncate">
                <strong>{subchapter.numberLabel}</strong> · {subchapter.title}
              </span>
              <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold">
                {subchapter.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {review.files.map((file) => {
          const draft = drafts[file.id] || {
            primarySubchapterId: "",
            secondarySubchapterId: "",
            boundary: false,
          };
          const confidence = file.mappings.length
            ? Math.min(...file.mappings.map((mapping) => mapping.confidence))
            : null;
          const needsAttention = confidence == null || confidence < 0.75;

          return (
            <article
              key={file.id}
              className={`overflow-hidden rounded-3xl border bg-white shadow-sm ${
                needsAttention ? "border-[#d7b6a7]" : "border-black/10"
              }`}
            >
              <div className="grid md:grid-cols-[280px_1fr]">
                <div className="bg-[#eee9e2] p-3">
                  <img
                    src={`/mixalis/api/segmentation/files/${file.id}`}
                    alt={`Σελίδα ${file.position}`}
                    loading="lazy"
                    className="h-72 w-full rounded-2xl bg-white object-contain md:h-full md:min-h-72"
                  />
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7665]">
                        Φωτογραφία {file.position}
                      </p>
                      <h3 className="mt-1 break-all font-semibold">{file.originalName}</h3>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        needsAttention
                          ? "bg-[#fbf1ed] text-[#7a4938]"
                          : "bg-[#eef4ec] text-[#4f684d]"
                      }`}
                    >
                      {confidenceLabel(confidence)}
                    </span>
                  </div>

                  {file.mappings.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {file.mappings.map((mapping) => (
                        <span
                          key={`${file.id}-${mapping.subchapterId}`}
                          className="rounded-full bg-[#f1ede7] px-3 py-1.5 text-xs text-[#665c54]"
                          title={mapping.reason}
                        >
                          {mapping.subchapterNumberLabel} · {mapping.relation}
                          {mapping.assignmentSource === "manual" ? " · χειροκίνητο" : ""}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-xl bg-[#fbf1ed] px-3 py-2 text-sm text-[#7a4938]">
                      Η AI δεν έκανε ασφαλή αντιστοίχιση. Επίλεξε το σωστό υποκεφάλαιο.
                    </p>
                  )}

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-[#6e6259]">
                        Κύριο υποκεφάλαιο
                      </span>
                      <select
                        value={draft.primarySubchapterId}
                        disabled={locked}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [file.id]: {
                              ...draft,
                              primarySubchapterId: event.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-xl border border-black/15 bg-[#fbfaf8] px-3 py-2.5 text-sm"
                      >
                        <option value="">— Επίλεξε —</option>
                        {subchapters.map((subchapter) => (
                          <option key={subchapter.id} value={subchapter.id}>
                            {subchapter.numberLabel} — {subchapter.title}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-[#6e6259]">
                        Δεύτερο υποκεφάλαιο (αν χρειάζεται)
                      </span>
                      <select
                        value={draft.secondarySubchapterId}
                        disabled={locked}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [file.id]: {
                              ...draft,
                              secondarySubchapterId: event.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-xl border border-black/15 bg-[#fbfaf8] px-3 py-2.5 text-sm"
                      >
                        <option value="">Κανένα</option>
                        {subchapters.map((subchapter) => (
                          <option key={subchapter.id} value={subchapter.id}>
                            {subchapter.numberLabel} — {subchapter.title}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <label className="inline-flex items-center gap-2 text-sm text-[#61574f]">
                      <input
                        type="checkbox"
                        checked={draft.boundary}
                        disabled={locked || !draft.secondarySubchapterId}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [file.id]: { ...draft, boundary: event.target.checked },
                          }))
                        }
                      />
                      Η ίδια σελίδα είναι μετάβαση μεταξύ δύο υποκεφαλαίων
                    </label>

                    {!locked ? (
                      <button
                        type="button"
                        disabled={busyFileId === file.id}
                        onClick={() => saveFile(file.id)}
                        className="rounded-xl border border-black/15 bg-[#f3eee7] px-4 py-2.5 text-sm font-semibold hover:bg-[#e9e1d7] disabled:opacity-50"
                      >
                        {busyFileId === file.id ? "Αποθήκευση…" : "Αποθήκευση διόρθωσης"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        {locked ? (
          <div className="rounded-2xl bg-[#eef4ec] p-4 text-sm font-medium text-[#4f684d]">
            Ο διαχωρισμός έχει επιβεβαιωθεί. Αυτές οι αντιστοιχίσεις είναι πλέον η έμπιστη βάση για το επόμενο στάδιο Source Intelligence.
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Τελικός έλεγχος</h2>
            <p className="mt-2 text-sm leading-6 text-[#70665f]">
              Η επιβεβαίωση δεν επιτρέπεται αν έχει μείνει φωτογραφία χωρίς κύρια αντιστοίχιση.
            </p>
            <button
              type="button"
              disabled={summary.unclassified > 0 || confirming || review.run.status === "error"}
              onClick={confirm}
              className="mt-5 w-full rounded-xl bg-[#403630] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2f2824] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {confirming ? "Επιβεβαίωση…" : "Επιβεβαίωση διαχωρισμού"}
            </button>
            {summary.unclassified > 0 ? (
              <p className="mt-3 text-xs text-[#8a5542]">
                Απομένουν {summary.unclassified} φωτογραφίες χωρίς αντιστοίχιση.
              </p>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

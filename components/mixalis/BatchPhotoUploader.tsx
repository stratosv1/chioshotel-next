"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const MAX_FILES = 30;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

type UploadItem = {
  name: string;
  progress: number;
  status: "waiting" | "uploading" | "done" | "error";
  message?: string;
};

type SegmentationStatus =
  | "processing"
  | "needs_review"
  | "ready"
  | "confirmed"
  | "error";

type SegmentationRun = {
  id: string;
  status: SegmentationStatus;
};

function safeFileName(value: string) {
  const dotIndex = value.lastIndexOf(".");
  const ext = dotIndex >= 0 ? value.slice(dotIndex).toLowerCase() : "";
  const base = dotIndex >= 0 ? value.slice(0, dotIndex) : value;
  const safeBase = base
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "photo";
  return `${safeBase}${ext.slice(0, 10)}`;
}

export default function BatchPhotoUploader({
  chapterId,
  batchId,
  existingFileCount = 0,
  enableAutoSegmentation = false,
}: {
  chapterId: string;
  batchId: string;
  existingFileCount?: number;
  enableAutoSegmentation?: boolean;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [segmentBusy, setSegmentBusy] = useState(false);
  const [sourceBusy, setSourceBusy] = useState(false);
  const [segmentationRun, setSegmentationRun] = useState<SegmentationRun | null>(null);
  const [statusLoading, setStatusLoading] = useState(enableAutoSegmentation);
  const [statusError, setStatusError] = useState<string | null>(null);

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  );

  useEffect(() => {
    if (!enableAutoSegmentation) {
      setStatusLoading(false);
      return;
    }

    let cancelled = false;
    setStatusLoading(true);
    setStatusError(null);

    fetch(`/mixalis/api/chapters/${chapterId}/batches/${batchId}/segment`, {
      method: "GET",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("status failed");
        return response.json();
      })
      .then((payload) => {
        if (cancelled) return;
        const run = payload?.run;
        if (
          run &&
          typeof run.id === "string" &&
          ["processing", "needs_review", "ready", "confirmed", "error"].includes(
            String(run.status),
          )
        ) {
          setSegmentationRun({
            id: run.id,
            status: run.status as SegmentationStatus,
          });
        } else {
          setSegmentationRun(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatusError("Δεν μπόρεσε να ελεγχθεί η κατάσταση του διαχωρισμού.");
        }
      })
      .finally(() => {
        if (!cancelled) setStatusLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [batchId, chapterId, enableAutoSegmentation]);

  function chooseFiles(nextFiles: File[]) {
    setError(null);

    if (nextFiles.length > MAX_FILES) {
      setFiles([]);
      setItems([]);
      setError(`Μπορείς να ανεβάσεις έως ${MAX_FILES} φωτογραφίες κάθε φορά.`);
      return;
    }

    const invalidType = nextFiles.find(
      (file) => file.type && !ALLOWED_TYPES.has(file.type),
    );
    if (invalidType) {
      setFiles([]);
      setItems([]);
      setError(`Το αρχείο «${invalidType.name}» δεν είναι υποστηριζόμενη εικόνα.`);
      return;
    }

    const tooLarge = nextFiles.find((file) => file.size > MAX_FILE_SIZE);
    if (tooLarge) {
      setFiles([]);
      setItems([]);
      setError(`Η φωτογραφία «${tooLarge.name}» ξεπερνά τα 20 MB.`);
      return;
    }

    setFiles(nextFiles);
    setItems(
      nextFiles.map((file) => ({
        name: file.name,
        progress: 0,
        status: "waiting",
      })),
    );
  }

  async function startUpload() {
    if (files.length === 0 || busy || segmentBusy || sourceBusy) return;
    setBusy(true);
    setError(null);

    let hadError = false;

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const absoluteIndex = existingFileCount + index;

      setItems((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index
            ? { ...item, status: "uploading", progress: 0 }
            : item,
        ),
      );

      try {
        const pathname = `mixalis/chapters/${chapterId}/batches/${batchId}/${String(absoluteIndex + 1).padStart(3, "0")}-${safeFileName(file.name)}`;

        await upload(pathname, file, {
          access: "private",
          handleUploadUrl: "/mixalis/api/uploads",
          clientPayload: JSON.stringify({
            chapterId,
            batchId,
            originalName: file.name,
            sortOrder: absoluteIndex,
            sizeBytes: file.size,
          }),
          onUploadProgress: ({ percentage }) => {
            setItems((current) =>
              current.map((item, itemIndex) =>
                itemIndex === index
                  ? { ...item, progress: Math.round(percentage) }
                  : item,
              ),
            );
          },
        });

        setItems((current) =>
          current.map((item, itemIndex) =>
            itemIndex === index
              ? { ...item, status: "done", progress: 100 }
              : item,
          ),
        );
      } catch (uploadError) {
        hadError = true;
        setItems((current) =>
          current.map((item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  status: "error",
                  message:
                    uploadError instanceof Error
                      ? uploadError.message
                      : "Αποτυχία upload",
                }
              : item,
          ),
        );
      }
    }

    setBusy(false);

    if (!hadError) {
      setTimeout(() => {
        setFiles([]);
        setItems([]);
        router.refresh();
      }, 1200);
    }
  }

  async function followRedirect(response: Response) {
    const target = new URL(response.url);
    if (target.origin === window.location.origin) {
      router.push(`${target.pathname}${target.search}`);
      router.refresh();
    } else {
      window.location.assign(response.url);
    }
  }

  async function startSegmentation() {
    if (segmentBusy || sourceBusy || busy || files.length > 0) return;
    setSegmentBusy(true);
    setError(null);

    try {
      const response = await fetch(
        `/mixalis/api/chapters/${chapterId}/batches/${batchId}/segment`,
        { method: "POST", redirect: "follow" },
      );

      if (!response.ok) {
        throw new Error("Ο αυτόματος διαχωρισμός δεν ολοκληρώθηκε.");
      }

      await followRedirect(response);
    } catch (segmentationError) {
      setError(
        segmentationError instanceof Error
          ? segmentationError.message
          : "Ο αυτόματος διαχωρισμός δεν ολοκληρώθηκε.",
      );
      setSegmentBusy(false);
    }
  }

  async function openSegmentedSourceIntelligence() {
    if (!segmentationRun || segmentationRun.status !== "confirmed" || sourceBusy) return;
    setSourceBusy(true);
    setError(null);

    try {
      const response = await fetch(
        `/mixalis/api/source-intelligence/from-segmentation/${segmentationRun.id}`,
        { method: "POST", redirect: "follow" },
      );

      if (!response.ok) {
        throw new Error("Δεν μπόρεσε να ανοίξει το Source Intelligence.");
      }

      await followRedirect(response);
    } catch (sourceError) {
      setError(
        sourceError instanceof Error
          ? sourceError.message
          : "Δεν μπόρεσε να ανοίξει το Source Intelligence.",
      );
      setSourceBusy(false);
    }
  }

  async function openDirectSourceIntelligence() {
    if (enableAutoSegmentation || existingFileCount <= 0 || sourceBusy) return;
    setSourceBusy(true);
    setError(null);

    try {
      const response = await fetch(
        `/mixalis/api/source-intelligence/from-batch/${batchId}`,
        { method: "POST", redirect: "follow" },
      );

      if (!response.ok) {
        throw new Error("Δεν μπόρεσε να ανοίξει το Source Intelligence.");
      }

      await followRedirect(response);
    } catch (sourceError) {
      setError(
        sourceError instanceof Error
          ? sourceError.message
          : "Δεν μπόρεσε να ανοίξει το Source Intelligence.",
      );
      setSourceBusy(false);
    }
  }

  if (enableAutoSegmentation && statusLoading) {
    return (
      <div className="mt-4 rounded-2xl border border-black/10 bg-[#f6f1ea] p-4 text-sm text-[#665b53]">
        Έλεγχος κατάστασης του αυτόματου διαχωρισμού…
      </div>
    );
  }

  if (enableAutoSegmentation && segmentationRun) {
    const reviewHref = `/mixalis/chapters/${chapterId}/segmentation/${segmentationRun.id}`;

    if (segmentationRun.status === "confirmed") {
      return (
        <div className="mt-4 rounded-2xl border border-[#b8ccb7] bg-[#f0f6ef] p-4">
          <p className="text-sm font-semibold text-[#3f573f]">Διαχωρισμός επιβεβαιωμένος</p>
          <p className="mt-1 text-xs leading-5 text-[#5d715d]">
            Οι {existingFileCount} φωτογραφίες έχουν κλειδώσει στις επιβεβαιωμένες αντιστοιχίσεις. Το επόμενο στάδιο είναι η μετατροπή της πηγής σε δομημένο Source Intelligence.
          </p>
          {error ? (
            <div className="mt-3 rounded-xl bg-white/80 px-3 py-2 text-xs text-[#7a4938]">
              {error}
            </div>
          ) : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={sourceBusy}
              onClick={openSegmentedSourceIntelligence}
              className="rounded-xl bg-[#493d35] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#342c27] disabled:cursor-wait disabled:opacity-60"
            >
              {sourceBusy ? "Άνοιγμα…" : "Άνοιγμα Source Intelligence"}
            </button>
            <button
              type="button"
              onClick={() => router.push(reviewHref)}
              className="rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-[#4f443d] transition hover:bg-[#f7f3ed]"
            >
              Δες αντιστοιχίσεις
            </button>
          </div>
        </div>
      );
    }

    if (segmentationRun.status === "processing") {
      return (
        <div className="mt-4 rounded-2xl border border-[#cfc1b2] bg-[#f6f1ea] p-4">
          <p className="text-sm font-semibold">Ανάλυση σε εξέλιξη</p>
          <p className="mt-1 text-xs leading-5 text-[#746a62]">
            Ο αυτόματος διαχωρισμός έχει ήδη ξεκινήσει. Δεν χρειάζεται δεύτερο run.
          </p>
          <button
            type="button"
            onClick={() => router.push(reviewHref)}
            className="mt-3 w-full rounded-xl bg-[#5a493e] px-4 py-3 text-sm font-semibold text-white"
          >
            Άνοιγμα ανάλυσης
          </button>
        </div>
      );
    }

    if (segmentationRun.status === "ready" || segmentationRun.status === "needs_review") {
      return (
        <div className="mt-4 rounded-2xl border border-[#d5c7a7] bg-[#faf6ea] p-4">
          <p className="text-sm font-semibold">Έτοιμο για έλεγχο αντιστοιχίσεων</p>
          <p className="mt-1 text-xs leading-5 text-[#746a62]">
            Η AI έχει ολοκληρώσει την πρόταση διαχωρισμού. Έλεγξέ την και επιβεβαίωσέ την πριν προχωρήσεις στο Source Intelligence.
          </p>
          <button
            type="button"
            onClick={() => router.push(reviewHref)}
            className="mt-3 w-full rounded-xl bg-[#5a493e] px-4 py-3 text-sm font-semibold text-white"
          >
            Έλεγχος αντιστοιχίσεων
          </button>
        </div>
      );
    }

    return (
      <div className="mt-4 rounded-2xl border border-[#d9b4a6] bg-[#fbf1ed] p-4">
        <p className="text-sm font-semibold text-[#754535]">Ο προηγούμενος διαχωρισμός απέτυχε</p>
        <p className="mt-1 text-xs leading-5 text-[#7a574b]">
          Οι φωτογραφίες παραμένουν αποθηκευμένες. Μπορείς να ξανατρέξεις μόνο τον διαχωρισμό χωρίς νέο upload.
        </p>
        {error ? <p className="mt-2 text-xs text-[#7a4938]">{error}</p> : null}
        <button
          type="button"
          disabled={segmentBusy}
          onClick={startSegmentation}
          className="mt-3 w-full rounded-xl bg-[#5a493e] px-4 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
        >
          {segmentBusy ? "Ξεκινά ξανά…" : "Δοκίμασε ξανά τον διαχωρισμό"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-2xl border border-dashed border-black/15 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Φωτογραφίες αυτής της προσθήκης</p>
            <p className="mt-1 text-xs leading-5 text-[#7d736b]">
              Έως 30 εικόνες κάθε φορά · έως 20 MB η καθεμία.
              {existingFileCount > 0 ? ` Έχουν ήδη αποθηκευτεί ${existingFileCount}.` : ""}
            </p>
            {enableAutoSegmentation ? (
              <p className="mt-1 text-xs leading-5 text-[#7d736b]">
                Αν το κεφάλαιο έχει πάνω από 30 φωτογραφίες, ανέβασε και δεύτερη ομάδα. Η σειρά συνεχίζεται αυτόματα.
              </p>
            ) : null}
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-black/15 bg-[#f7f3ed] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#eee7de]">
            Επιλογή φωτογραφιών
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              className="sr-only"
              disabled={busy || segmentBusy || sourceBusy}
              onChange={(event) =>
                chooseFiles(Array.from(event.currentTarget.files || []))
              }
            />
          </label>
        </div>

        {statusError ? (
          <div className="mt-3 rounded-xl bg-[#fbf1ed] px-3 py-2 text-xs text-[#7a4938]">
            {statusError}
          </div>
        ) : null}

        {error ? (
          <div className="mt-3 rounded-xl bg-[#fbf1ed] px-3 py-2 text-xs text-[#7a4938]">
            {error}
          </div>
        ) : null}

        {files.length > 0 ? (
          <div className="mt-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#746a62]">
              <span>{files.length} φωτογραφίες επιλεγμένες</span>
              <span>{(totalSize / 1024 / 1024).toFixed(1)} MB συνολικά</span>
            </div>

            <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <div key={`${item.name}-${index}`} className="rounded-xl bg-[#f7f4ef] px-3 py-2">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="min-w-0 truncate">
                      {existingFileCount + index + 1}. {item.name}
                    </span>
                    <span className="shrink-0 text-[#7d736b]">
                      {item.status === "waiting" ? "αναμονή" : null}
                      {item.status === "uploading" ? `${item.progress}%` : null}
                      {item.status === "done" ? "ανέβηκε" : null}
                      {item.status === "error" ? "σφάλμα" : null}
                    </span>
                  </div>
                  {item.status === "uploading" ? (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full bg-[#5c4b3f] transition-[width]"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  ) : null}
                  {item.message ? (
                    <p className="mt-1 text-xs text-[#8b4f3b]">{item.message}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={busy || segmentBusy || sourceBusy}
              onClick={startUpload}
              className="mt-4 w-full rounded-xl bg-[#403630] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2f2824] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Ανεβαίνουν οι φωτογραφίες…" : `Ανέβασμα ${files.length} φωτογραφιών`}
            </button>
          </div>
        ) : null}
      </div>

      {enableAutoSegmentation && existingFileCount > 0 && !busy && files.length === 0 ? (
        <div className="rounded-2xl border border-[#cfc1b2] bg-[#f6f1ea] p-4">
          <p className="text-sm font-semibold">Έτοιμο για αυτόματο διαχωρισμό</p>
          <p className="mt-1 text-xs leading-5 text-[#746a62]">
            Ξεκίνα μόνο όταν έχεις ανεβάσει όλο το κεφάλαιο με τη σωστή σειρά. Η AI θα προτείνει την αντιστοίχιση στα επίσημα υποκεφάλαια και θα την ελέγξεις πριν επιβεβαιωθεί.
          </p>
          <button
            type="button"
            disabled={segmentBusy}
            onClick={startSegmentation}
            className="mt-3 w-full rounded-xl bg-[#5a493e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#45382f] disabled:cursor-wait disabled:opacity-60"
          >
            {segmentBusy
              ? `Αναλύονται ${existingFileCount} φωτογραφίες…`
              : "Έναρξη αυτόματου διαχωρισμού"}
          </button>
          {segmentBusy ? (
            <div className="mt-3 rounded-xl bg-white/70 px-3 py-3 text-xs leading-5 text-[#665b53]">
              Η ανάλυση έχει ξεκινήσει. Για ολόκληρο κεφάλαιο μπορεί να χρειαστούν περίπου 2–4 λεπτά. Μην πατήσεις ξανά το κουμπί και μην κλείσεις αυτή τη σελίδα· μόλις ολοκληρωθεί θα ανοίξει αυτόματα ο έλεγχος του διαχωρισμού.
            </div>
          ) : null}
        </div>
      ) : null}

      {!enableAutoSegmentation && existingFileCount > 0 && !busy && files.length === 0 ? (
        <div className="rounded-2xl border border-[#b8ccb7] bg-[#f0f6ef] p-4">
          <p className="text-sm font-semibold text-[#3f573f]">Έτοιμο για Source Intelligence</p>
          <p className="mt-1 text-xs leading-5 text-[#5d715d]">
            Οι {existingFileCount} φωτογραφίες έχουν ανέβει απευθείας σε συγκεκριμένο υποκεφάλαιο. Δεν χρειάζεται αυτόματος διαχωρισμός· η αντιστοίχιση είναι ήδη γνωστή.
          </p>
          <button
            type="button"
            disabled={sourceBusy}
            onClick={openDirectSourceIntelligence}
            className="mt-3 w-full rounded-xl bg-[#493d35] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#342c27] disabled:cursor-wait disabled:opacity-60"
          >
            {sourceBusy ? "Άνοιγμα…" : "Άνοιγμα Source Intelligence"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

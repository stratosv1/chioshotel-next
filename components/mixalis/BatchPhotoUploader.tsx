"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
}: {
  chapterId: string;
  batchId: string;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  );

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
    if (files.length === 0 || busy) return;
    setBusy(true);
    setError(null);

    let hadError = false;

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      setItems((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index
            ? { ...item, status: "uploading", progress: 0 }
            : item,
        ),
      );

      try {
        const pathname = `mixalis/chapters/${chapterId}/batches/${batchId}/${String(index + 1).padStart(3, "0")}-${safeFileName(file.name)}`;

        await upload(pathname, file, {
          access: "private",
          handleUploadUrl: "/mixalis/api/uploads",
          clientPayload: JSON.stringify({
            chapterId,
            batchId,
            originalName: file.name,
            sortOrder: index,
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
      setTimeout(() => router.refresh(), 1200);
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-dashed border-black/15 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Φωτογραφίες αυτής της προσθήκης</p>
          <p className="mt-1 text-xs leading-5 text-[#7d736b]">
            Έως 30 εικόνες κάθε φορά · έως 20 MB η καθεμία.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-black/15 bg-[#f7f3ed] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#eee7de]">
          Επιλογή φωτογραφιών
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
            className="sr-only"
            disabled={busy}
            onChange={(event) =>
              chooseFiles(Array.from(event.currentTarget.files || []))
            }
          />
        </label>
      </div>

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
                  <span className="min-w-0 truncate">{index + 1}. {item.name}</span>
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
            disabled={busy}
            onClick={startUpload}
            className="mt-4 w-full rounded-xl bg-[#403630] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2f2824] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Ανεβαίνουν οι φωτογραφίες…" : `Ανέβασμα ${files.length} φωτογραφιών`}
          </button>
        </div>
      ) : null}
    </div>
  );
}

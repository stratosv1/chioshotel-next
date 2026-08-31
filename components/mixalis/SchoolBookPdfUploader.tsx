"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  PhysicsCourseCode,
  PhysicsSourceDocumentKind,
} from "@/lib/mixalis/source-documents";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

function safeFileName(value: string) {
  const base = value.replace(/\.pdf$/i, "");
  const safeBase = base
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "physics-book";
  return `${safeBase}.pdf`;
}

export default function SchoolBookPdfUploader({
  courseCode,
  sourceKind = "school_book",
  pageCount,
  uploaded,
  uploadedName,
}: {
  courseCode: PhysicsCourseCode;
  sourceKind?: PhysicsSourceDocumentKind;
  pageCount?: number | null;
  uploaded: boolean;
  uploadedName?: string | null;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSavvalas = sourceKind === "savvalas_book";

  function chooseFile(nextFile: File | null) {
    setFile(null);
    setDone(false);
    setProgress(0);
    setError(null);

    if (!nextFile) return;
    const isPdf =
      nextFile.type === "application/pdf" || nextFile.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("Επίλεξε αρχείο PDF.");
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setError("Το PDF ξεπερνά το όριο των 100 MB.");
      return;
    }
    setFile(nextFile);
  }

  async function startUpload() {
    if (!file || busy) return;
    setBusy(true);
    setError(null);
    setDone(false);
    setProgress(0);

    try {
      const pathname = `mixalis/source-documents/${courseCode}/${sourceKind}/${safeFileName(file.name)}`;
      await upload(pathname, file, {
        access: "private",
        handleUploadUrl: "/mixalis/api/source-documents/upload",
        clientPayload: JSON.stringify({
          courseCode,
          sourceKind,
          originalName: file.name,
          sizeBytes: file.size,
        }),
        onUploadProgress: ({ percentage }) => {
          setProgress(Math.round(percentage));
        },
      });

      setDone(true);
      setProgress(100);
      setTimeout(() => {
        setFile(null);
        setDone(false);
        router.refresh();
      }, 1600);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Αποτυχία upload του PDF.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-dashed border-black/15 bg-[#fbfaf8] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">
            {uploaded ? "Αντικατάσταση PDF" : "Ανέβασμα PDF"}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#7d736b]">
            Ιδιωτικό αρχείο · {pageCount ? `${pageCount} σελίδες · ` : "πλήρες βιβλίο · "}
            έως 100 MB.
          </p>
          {isSavvalas ? (
            <p className="mt-1 text-xs leading-5 text-[#7d736b]">
              Θα χρησιμοποιείται ως πηγή βάθους, ασκήσεων, παγίδων και μεθοδολογίας — όχι ως επίσημη ύλη.
            </p>
          ) : null}
          {uploaded && uploadedName ? (
            <p className="mt-1 max-w-md truncate text-xs text-[#6a5b50]">
              Τρέχον: {uploadedName}
            </p>
          ) : null}
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-[#f1ece5]">
          Επιλογή PDF
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={busy}
            onChange={(event) => chooseFile(event.currentTarget.files?.[0] ?? null)}
          />
        </label>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl bg-white p-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="max-w-[75%] truncate font-medium">{file.name}</span>
            <span className="text-[#7d736b]">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
          </div>

          {busy || done ? (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[#746a62]">
                <span>{done ? "Ολοκληρώθηκε" : "Ανέβασμα…"}</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[#5c4b3f] transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}

          {!done ? (
            <button
              type="button"
              onClick={startUpload}
              disabled={busy}
              className="mt-3 w-full rounded-xl bg-[#403630] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f2824] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Ανεβαίνει…" : uploaded ? "Αντικατάσταση βιβλίου" : "Ανέβασμα βιβλίου"}
            </button>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <div className="mt-3 rounded-xl bg-[#fbf1ed] px-3 py-2 text-xs text-[#7a4938]">
          {error}
        </div>
      ) : null}
    </div>
  );
}

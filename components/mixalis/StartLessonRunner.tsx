"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "draft" | "processing" | "current" | "superseded" | "error";

export default function StartLessonRunner({
  revisionId,
  revisionNumber,
  initialStatus,
  initialErrorMessage,
  autoStart = false,
}: {
  revisionId: string;
  revisionNumber: number;
  initialStatus: Status;
  initialErrorMessage: string | null;
  autoStart?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage);
  const [busy, setBusy] = useState(false);
  const startedRef = useRef(false);

  const readStatus = useCallback(async () => {
    const response = await fetch(`/mixalis/api/lesson-revisions/${revisionId}`, {
      cache: "no-store",
    });
    if (!response.ok) return;
    const data = await response.json();
    const nextStatus = String(data?.status || "") as Status;
    if (nextStatus) setStatus(nextStatus);
    setErrorMessage(data?.view?.errorMessage || null);
    if (nextStatus === "current" || nextStatus === "superseded") router.refresh();
  }, [revisionId, router]);

  const run = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setErrorMessage(null);
    setStatus("processing");
    try {
      const response = await fetch(`/mixalis/api/lesson-revisions/${revisionId}`, {
        method: "POST",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Η δημιουργία του μαθήματος απέτυχε.");
      const nextStatus = String(data?.status || "processing") as Status;
      setStatus(nextStatus);
      setErrorMessage(data?.view?.errorMessage || null);
      if (nextStatus === "current" || nextStatus === "superseded") router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Η δημιουργία του μαθήματος απέτυχε.");
      await readStatus().catch(() => undefined);
    } finally {
      setBusy(false);
    }
  }, [busy, readStatus, revisionId, router]);

  useEffect(() => {
    if (status !== "processing") return;
    const timer = window.setInterval(() => {
      void readStatus();
    }, 2000);
    return () => window.clearInterval(timer);
  }, [readStatus, status]);

  useEffect(() => {
    if (!autoStart || initialStatus !== "draft" || startedRef.current) return;
    startedRef.current = true;
    const timer = window.setTimeout(() => void run(), 500);
    return () => window.clearTimeout(timer);
  }, [autoStart, initialStatus, run]);

  if (status === "current" || status === "superseded") {
    return (
      <section className="mt-6 rounded-3xl border border-[#b8cab5] bg-[#eef5ed] p-6 text-[#52644e]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">START · Lesson Revision {revisionNumber}</p>
        <h2 className="mt-2 text-xl font-semibold">Το μάθημα είναι έτοιμο</h2>
        <p className="mt-2 text-sm leading-6">Η revision έχει αποθηκευτεί και παραμένει συνδεδεμένη με το intelligence version από το οποίο δημιουργήθηκε.</p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-[#d8cbbb] bg-[#faf6f0] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#857261]">START · Lesson Revision {revisionNumber}</p>
      <h2 className="mt-2 text-xl font-semibold">
        {status === "processing" ? "Το START χτίζει το μάθημα…" : status === "error" ? "Η δημιουργία χρειάζεται επανάληψη" : "Έτοιμο για δημιουργία"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#6e655e]">
        Το START χρησιμοποιεί το current Subchapter Intelligence. Δεν ξαναδιαβάζει τις φωτογραφίες ή το σχολικό PDF.
      </p>

      {status === "processing" ? (
        <div className="mt-5">
          <div className="h-2 overflow-hidden rounded-full bg-[#e3ddd5]">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-[#8e8176]" />
          </div>
          <p className="mt-3 text-sm text-[#746a62]">Η κατάσταση ελέγχεται αυτόματα κάθε 2 δευτερόλεπτα. Δεν χρειάζεται refresh.</p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-[#e0c4b8] bg-[#fbf1ed] p-4 text-sm leading-6 text-[#794c3d]">
          {errorMessage}
        </div>
      ) : null}

      {status !== "processing" ? (
        <button
          type="button"
          onClick={() => void run()}
          disabled={busy}
          className="mt-5 w-full rounded-2xl bg-[#8f8379] px-5 py-4 text-base font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Ξεκινά…" : status === "error" ? "Επανάληψη δημιουργίας" : `Δημιουργία Lesson Revision ${revisionNumber}`}
        </button>
      ) : null}
    </section>
  );
}

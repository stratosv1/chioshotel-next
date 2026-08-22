"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  versionId: string;
  initialStatus: "draft" | "current" | "superseded";
  initialErrorMessage?: string | null;
  versionNumber: number;
  sourceCount: number;
  findingCount: number;
};

type StatusPayload = {
  status?: "draft" | "current" | "superseded";
  view?: {
    status?: "draft" | "current" | "superseded";
    errorMessage?: string | null;
  };
  error?: string;
};

export default function SubchapterIntelligenceRunner({
  versionId,
  initialStatus,
  initialErrorMessage,
  versionNumber,
  sourceCount,
  findingCount,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(initialErrorMessage ?? null);
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
    };
  }, []);

  const readStatus = useCallback(async () => {
    const response = await fetch(`/mixalis/api/subchapter-intelligence/${versionId}`, {
      method: "GET",
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as StatusPayload | null;
    if (!response.ok) throw new Error(payload?.error || "Δεν ήταν δυνατός ο έλεγχος προόδου.");
    const nextStatus = payload?.view?.status || payload?.status;
    if (nextStatus && activeRef.current) setStatus(nextStatus);
    if (activeRef.current) setError(payload?.view?.errorMessage || null);
    return { status: nextStatus, errorMessage: payload?.view?.errorMessage || null };
  }, [versionId]);

  useEffect(() => {
    if (status !== "draft") return;
    const timer = window.setInterval(() => {
      void readStatus()
        .then((next) => {
          if (next.status === "current" || next.status === "superseded") {
            window.clearInterval(timer);
            setRunning(false);
            router.refresh();
          }
        })
        .catch(() => undefined);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [readStatus, router, status]);

  const run = useCallback(async () => {
    if (running || status !== "draft") return;
    setRunning(true);
    setError(null);

    void fetch(`/mixalis/api/subchapter-intelligence/${versionId}`, {
      method: "POST",
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as StatusPayload | null;
        if (!response.ok) throw new Error(payload?.error || "Η σύνθεση απέτυχε.");
        const nextStatus = payload?.view?.status || payload?.status;
        if (!activeRef.current) return;
        if (nextStatus) setStatus(nextStatus);
        setError(payload?.view?.errorMessage || null);
        if (nextStatus === "current" || nextStatus === "superseded") {
          setRunning(false);
          router.refresh();
        }
      })
      .catch((reason) => {
        if (!activeRef.current) return;
        setError(reason instanceof Error ? reason.message : "Η σύνθεση διακόπηκε.");
        setRunning(false);
      });
  }, [router, running, status, versionId]);

  const completed = status === "current" || status === "superseded";

  return (
    <section className="mt-6 rounded-3xl border border-[#d6cabb] bg-[#faf7f2] p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#857261]">
        Subchapter Intelligence v{versionNumber}
      </p>
      <h2 className="mt-2 text-2xl font-semibold">
        {completed ? "Η canonical γνώση του υποκεφαλαίου είναι έτοιμη" : "Σύνθεση των πηγών"}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6e655e] sm:text-base">
        Το σύστημα συνθέτει {findingCount} structured findings από {sourceCount} πηγές. Δεν ξαναδιαβάζει τις φωτογραφίες ή το PDF και δεν δημιουργεί ακόμη μάθημα.
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#6f655d]">
        <span className="rounded-full bg-white px-3 py-1.5">{sourceCount} πηγές</span>
        <span className="rounded-full bg-white px-3 py-1.5">{findingCount} findings</span>
        <span className="rounded-full bg-white px-3 py-1.5">
          {completed ? "Canonical · ready" : running ? "Συντίθεται…" : "Έτοιμο για σύνθεση"}
        </span>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-[#dfc4b8] bg-[#fbf0eb] p-4 text-sm leading-6 text-[#7a4f40]">
          <strong>Τελευταίο μήνυμα:</strong> {error}
        </div>
      ) : null}

      {!completed ? (
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="mt-6 w-full rounded-2xl bg-[#665748] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#584b3f] disabled:cursor-wait disabled:opacity-60"
        >
          {running ? "Συντίθεται το Subchapter Intelligence…" : `Δημιουργία Subchapter Intelligence v${versionNumber}`}
        </button>
      ) : (
        <div className="mt-6 rounded-2xl border border-[#b7ccb5] bg-[#eef5ed] p-4 text-sm leading-6 text-[#4f684a]">
          Η τρέχουσα canonical version έχει αποθηκευτεί. Το επόμενο στάδιο είναι το START → Lesson Revision.
        </div>
      )}
    </section>
  );
}

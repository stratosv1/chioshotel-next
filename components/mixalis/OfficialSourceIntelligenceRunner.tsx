"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ViewPayload = {
  status?: string;
  error?: string;
  view?: {
    status?: string;
    processedUnits?: number;
    totalUnits?: number;
    items?: unknown[];
  };
};

const STATUS_POLL_MS = 5_000;

function statusLabel(status: string) {
  if (status === "ready") return "Ολοκληρωμένη";
  if (status === "processing") return "Αναλύεται το επίσημο range";
  if (status === "error") return "Χρειάζεται επανάληψη";
  return "Έτοιμη να ξεκινήσει";
}

export default function OfficialSourceIntelligenceRunner({
  analysisId,
  initialStatus,
  initialProcessedUnits,
  totalUnits,
  initialFindingsCount,
}: {
  analysisId: string;
  initialStatus: string;
  initialProcessedUnits: number;
  totalUnits: number;
  initialFindingsCount: number;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [processedUnits, setProcessedUnits] = useState(initialProcessedUnits);
  const [findingsCount, setFindingsCount] = useState(initialFindingsCount);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const refreshed = useRef(false);
  const endpoint = `/mixalis/api/source-intelligence/official/${analysisId}/next`;

  async function readStatus() {
    const response = await fetch(endpoint, { method: "GET", cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as ViewPayload | null;
    if (!response.ok || !payload) {
      throw new Error(payload?.error || "Δεν μπόρεσε να διαβαστεί η πρόοδος.");
    }
    return payload;
  }

  function apply(payload: ViewPayload) {
    const nextStatus = String(payload.view?.status ?? payload.status ?? status);
    const nextProcessed = Number(payload.view?.processedUnits ?? processedUnits);
    const nextItems = Array.isArray(payload.view?.items)
      ? payload.view.items.length
      : findingsCount;
    setStatus(nextStatus);
    if (Number.isFinite(nextProcessed)) setProcessedUnits(nextProcessed);
    setFindingsCount(nextItems);
    return nextStatus;
  }

  useEffect(() => {
    if (status !== "processing") return;

    let cancelled = false;
    let timer: number | null = null;

    const schedule = () => {
      if (cancelled) return;
      timer = window.setTimeout(async () => {
        if (document.visibilityState === "visible") {
          try {
            const payload = await readStatus();
            if (cancelled) return;
            const nextStatus = apply(payload);
            if (nextStatus === "ready" && !refreshed.current) {
              refreshed.current = true;
              setMessage("Το Official School Book Intelligence ολοκληρώθηκε.");
              router.refresh();
              return;
            }
          } catch {
            // Keep the last persisted state and retry while processing.
          }
        }
        schedule();
      }, STATUS_POLL_MS);
    };

    schedule();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId, status]);

  async function run() {
    if (running || status === "ready") return;
    setRunning(true);
    setStatus("processing");
    setMessage(
      "Αναλύονται μόνο οι χαρτογραφημένες σελίδες του επίσημου βιβλίου. Δεν χρησιμοποιείται εξωτερική γνώση.",
    );

    void fetch(endpoint, { method: "POST" })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as ViewPayload | null;
        if (!response.ok || !payload) {
          throw new Error(payload?.error || "Η official ανάλυση απέτυχε.");
        }
        const nextStatus = apply(payload);
        if (nextStatus === "ready") {
          setMessage("Το Official School Book Intelligence ολοκληρώθηκε.");
          router.refresh();
        } else if (nextStatus === "error") {
          setMessage("Η προσπάθεια διακόπηκε. Το range παραμένει αποθηκευμένο και μπορεί να ξανατρέξει.");
        }
      })
      .catch((error) => {
        setMessage(
          error instanceof Error
            ? `${error.message} Η αποθηκευμένη χαρτογράφηση δεν χάνεται.`
            : "Η σύνδεση διακόπηκε. Η χαρτογράφηση δεν χάνεται.",
        );
      })
      .finally(() => {
        setRunning(false);
      });
  }

  const percent = totalUnits > 0
    ? Math.min(100, Math.round((processedUnits / totalUnits) * 100))
    : 0;

  return (
    <section className="rounded-3xl border border-[#d5c8ba] bg-[#faf7f2] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#857261]">
            Official Source Analysis
          </p>
          <h2 className="mt-1 text-xl font-semibold">{statusLabel(status)}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f665f]">
            Το σχολικό βιβλίο καθορίζει μόνο την επίσημη ύλη και το scope. Ο Σαββάλας παραμένει ξεχωριστή πηγή βάθους.
          </p>
        </div>
        <div className="rounded-full bg-white px-3 py-1.5 text-xs text-[#756b63]">
          {processedUnits}/{totalUnits} σελίδες · {findingsCount} findings
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-[#5b4a3e] transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {message ? (
        <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-[#655d57]">
          {message}
        </div>
      ) : null}

      {status !== "ready" ? (
        <button
          type="button"
          disabled={running || status === "processing"}
          onClick={run}
          className="mt-4 w-full rounded-2xl bg-[#493d35] px-4 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running || status === "processing"
            ? "Αναλύεται το επίσημο range…"
            : status === "error"
              ? "Επανάληψη Official Intelligence"
              : "Έναρξη Official School Book Intelligence"}
        </button>
      ) : (
        <div className="mt-4 rounded-2xl border border-[#b8ccb7] bg-[#f0f6ef] p-4 text-sm font-medium text-[#496047]">
          Το official curriculum intelligence έχει αποθηκευτεί με provenance στο σχολικό range.
        </div>
      )}
    </section>
  );
}

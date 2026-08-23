"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type StatusPayload = {
  status?: string;
  error?: string;
  message?: string;
  step?: string;
  view?: {
    context?: {
      status?: string;
      processedUnits?: number;
    };
    chunks?: {
      processing?: number;
    };
    items?: unknown[];
    schoolBookMapped?: boolean;
  };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function statusLabel(value: string) {
  if (value === "ready") return "Ολοκληρωμένη";
  if (value === "processing") return "Σε ανάλυση";
  if (value === "error") return "Χρειάζεται συνέχιση";
  return "Έτοιμη να ξεκινήσει";
}

export default function SourceIntelligenceRunner({
  analysisId,
  initialStatus,
  initialProcessedUnits,
  totalUnits,
  initialFindingsCount,
  schoolBookMapped,
  subchapterNumberLabel,
}: {
  analysisId: string;
  initialStatus: string;
  initialProcessedUnits: number;
  totalUnits: number;
  initialFindingsCount: number;
  schoolBookMapped: boolean;
  subchapterNumberLabel: string;
}) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [processedUnits, setProcessedUnits] = useState(initialProcessedUnits);
  const [findingsCount, setFindingsCount] = useState(initialFindingsCount);
  const [message, setMessage] = useState<string | null>(null);
  const readyRefreshDone = useRef(false);
  const autoFinalizeAttempted = useRef(false);

  const endpoint = `/mixalis/api/source-intelligence/analyses/${analysisId}/next`;

  function applyPayload(payload: StatusPayload) {
    const nextStatus = String(payload?.view?.context?.status ?? payload?.status ?? "processing");
    const nextProcessed = Number(payload?.view?.context?.processedUnits ?? processedUnits);
    const nextFindings = Array.isArray(payload?.view?.items)
      ? payload.view.items.length
      : findingsCount;

    setStatus(nextStatus);
    if (Number.isFinite(nextProcessed)) setProcessedUnits(nextProcessed);
    if (Number.isFinite(nextFindings)) setFindingsCount(nextFindings);

    return { nextStatus, nextProcessed, nextFindings };
  }

  async function readStatus() {
    const response = await fetch(endpoint, {
      method: "GET",
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as StatusPayload | null;
    if (!response.ok || !payload) {
      throw new Error(payload?.error || "Δεν μπόρεσε να διαβαστεί η πρόοδος της ανάλυσης.");
    }
    return payload;
  }

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function syncLiveProgress() {
      if (cancelled) return;
      try {
        const payload = await readStatus();
        if (cancelled) return;
        const current = applyPayload(payload);

        if (current.nextStatus === "ready" && !readyRefreshDone.current) {
          readyRefreshDone.current = true;
          setMessage("Η Source Intelligence ολοκληρώθηκε.");
          router.refresh();
          return;
        }

        if (
          current.nextProcessed >= totalUnits &&
          current.nextStatus === "error" &&
          !autoFinalizeAttempted.current
        ) {
          autoFinalizeAttempted.current = true;
          setMessage(`${totalUnits} φωτογραφίες έχουν ολοκληρωθεί. Επαναλαμβάνεται αυτόματα μόνο η τελική σύνθεση…`);
          void run();
        }
      } catch {
        // Keep showing the last persisted snapshot; retry automatically.
      }

      if (!cancelled) {
        timer = setTimeout(syncLiveProgress, 2000);
      }
    }

    void syncLiveProgress();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId]);

  async function run() {
    if (running || status === "ready") return;

    setRunning(true);
    setMessage("Η ανάλυση ξεκίνησε. Θα συνεχίσει αυτόματα μέχρι να ολοκληρωθεί.");

    let knownProcessed = processedUnits;

    try {
      for (let cycle = 0; cycle < 40; cycle += 1) {
        const before = await readStatus();
        const beforeState = applyPayload(before);
        knownProcessed = Math.max(knownProcessed, beforeState.nextProcessed);

        if (beforeState.nextStatus === "ready") {
          setMessage("Η Source Intelligence ολοκληρώθηκε.");
          router.refresh();
          return;
        }

        if (knownProcessed >= totalUnits) {
          setMessage("Οι φωτογραφίες αναλύθηκαν. Γίνεται η τελική σύνθεση των findings…");
        } else {
          setMessage(
            `Αναλύεται η επόμενη ομάδα φωτογραφιών… ${knownProcessed}/${totalUnits}. Δεν χρειάζεται άλλο πάτημα.`,
          );
        }

        let triggerSettled = false;
        let triggerPayload: StatusPayload | null = null;
        let triggerError: Error | null = null;

        void fetch(endpoint, { method: "POST" })
          .then(async (response) => {
            const payload = (await response.json().catch(() => null)) as StatusPayload | null;
            if (!response.ok || !payload) {
              throw new Error(payload?.error || "Ένα βήμα της ανάλυσης απέτυχε.");
            }
            triggerPayload = payload;
          })
          .catch((error) => {
            triggerError = error instanceof Error ? error : new Error("Το mobile request διακόπηκε.");
          })
          .finally(() => {
            triggerSettled = true;
          });

        let advanced = false;

        for (let poll = 0; poll < 100; poll += 1) {
          await sleep(poll === 0 ? 1000 : 2000);

          let snapshot: StatusPayload;
          try {
            snapshot = await readStatus();
          } catch {
            continue;
          }

          const current = applyPayload(snapshot);
          const processingChunks = Number(snapshot?.view?.chunks?.processing ?? 0);

          if (current.nextStatus === "ready") {
            setMessage("Η Source Intelligence ολοκληρώθηκε.");
            router.refresh();
            return;
          }

          if (current.nextProcessed > knownProcessed) {
            knownProcessed = current.nextProcessed;
            advanced = true;
            setMessage(
              knownProcessed >= totalUnits
                ? "Οι φωτογραφίες αναλύθηκαν. Προχωρά αυτόματα στην τελική σύνθεση…"
                : `Ολοκληρώθηκαν ${knownProcessed}/${totalUnits}. Συνεχίζει αυτόματα στην επόμενη ομάδα…`,
            );
            break;
          }

          if (triggerSettled && triggerPayload?.status === "error") {
            throw new Error(triggerPayload?.error || triggerPayload?.message || "Ένα βήμα της ανάλυσης απέτυχε.");
          }

          if (triggerSettled && triggerError && processingChunks === 0 && poll >= 2) {
            break;
          }

          if (
            triggerSettled &&
            triggerPayload?.step === "busy" &&
            processingChunks === 0 &&
            poll >= 2
          ) {
            break;
          }

          if (knownProcessed >= totalUnits) {
            setMessage("Γίνεται η τελική σύνθεση των structured findings…");
          }
        }

        if (!advanced && knownProcessed < totalUnits) {
          setMessage(
            `Η πρόοδος έχει αποθηκευτεί (${knownProcessed}/${totalUnits}). Γίνεται αυτόματη επανασύνδεση…`,
          );
          await sleep(1500);
        }
      }

      setMessage(
        "Η πρόοδος έχει αποθηκευτεί. Αν η σύνδεση διακόπηκε για πολλή ώρα, μπορείς να πατήσεις «Συνέχιση» ως fallback.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? `${error.message} Η ολοκληρωμένη πρόοδος έχει αποθηκευτεί.`
          : "Η ανάλυση σταμάτησε. Η ολοκληρωμένη πρόοδος έχει αποθηκευτεί.",
      );
    } finally {
      setRunning(false);
    }
  }

  const percent = totalUnits > 0
    ? Math.min(100, Math.round((processedUnits / totalUnits) * 100))
    : 0;

  return (
    <>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-[#847466]">Κατάσταση</p>
          <p className="mt-2 text-xl font-semibold">{statusLabel(status)}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-[#847466]">Πρόοδος</p>
          <p className="mt-2 text-xl font-semibold">{processedUnits}/{totalUnits}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-[#847466]">Structured findings</p>
          <p className="mt-2 text-xl font-semibold">{findingsCount}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-[#847466]">Σχολικό βιβλίο {subchapterNumberLabel}</p>
          <p className="mt-2 text-xl font-semibold">{schoolBookMapped ? "Συνδεδεμένο" : "Εκκρεμεί"}</p>
        </div>
      </section>

      {status === "ready" ? (
        <section className="mt-6 rounded-2xl border border-[#b8ccb7] bg-[#f0f6ef] p-4 text-sm text-[#496047]">
          Η source-level ανάλυση έχει ολοκληρωθεί και έχει αποθηκευτεί ως structured intelligence.
        </section>
      ) : (
        <section className="mt-6 rounded-3xl border border-[#d5c8ba] bg-[#faf7f2] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold">Ανάλυση πηγής</h2>
              <p className="mt-1 text-sm leading-6 text-[#6f665f]">
                Πάτησε μία φορά. Η πρόοδος ενημερώνεται αυτόματα από τη βάση περίπου κάθε 2 δευτερόλεπτα και το σύστημα συνεχίζει μέχρι το τέλος.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs text-[#756b63]">
              {processedUnits}/{totalUnits}
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full rounded-full bg-[#5b4a3e] transition-[width] duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[#7b7169]">{percent}% των φωτογραφιών έχει εξαχθεί σε structured findings.</p>

          {message ? (
            <div className="mt-4 rounded-xl bg-white px-3 py-2 text-xs leading-5 text-[#6d625a]">
              {message}
            </div>
          ) : null}

          <button
            type="button"
            disabled={running}
            onClick={run}
            className="mt-4 w-full rounded-xl bg-[#493d35] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#342c27] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running
              ? `Αναλύεται αυτόματα… ${processedUnits}/${totalUnits}`
              : processedUnits > 0
                ? "Συνέχιση Source Intelligence"
                : "Έναρξη Source Intelligence"}
          </button>
        </section>
      )}
    </>
  );
}

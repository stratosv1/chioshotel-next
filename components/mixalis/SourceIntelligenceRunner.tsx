"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SourceIntelligenceRunner({
  analysisId,
  initialStatus,
  initialProcessedUnits,
  totalUnits,
}: {
  analysisId: string;
  initialStatus: string;
  initialProcessedUnits: number;
  totalUnits: number;
}) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [processedUnits, setProcessedUnits] = useState(initialProcessedUnits);
  const [message, setMessage] = useState<string | null>(null);

  async function run() {
    if (running || status === "ready") return;
    setRunning(true);
    setMessage(null);

    try {
      for (let step = 0; step < 80; step += 1) {
        const response = await fetch(
          `/mixalis/api/source-intelligence/analyses/${analysisId}/next`,
          { method: "POST" },
        );
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(payload?.error || "Η ανάλυση Source Intelligence απέτυχε.");
        }

        const nextStatus = String(payload?.status || "processing");
        const nextProcessed = Number(
          payload?.view?.context?.processedUnits ?? processedUnits,
        );
        setStatus(nextStatus);
        setProcessedUnits(nextProcessed);

        if (nextStatus === "ready") {
          setMessage("Η Source Intelligence ολοκληρώθηκε.");
          router.refresh();
          return;
        }

        if (nextStatus === "error") {
          throw new Error(payload?.message || "Ένα βήμα της ανάλυσης απέτυχε.");
        }

        if (payload?.step === "busy") {
          await new Promise((resolve) => setTimeout(resolve, 1800));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 450));
        }
      }

      setMessage(
        "Η ανάλυση έχει αποθηκεύσει την πρόοδό της. Πάτησε «Συνέχιση» για τα επόμενα βήματα.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Η ανάλυση σταμάτησε. Η πρόοδος που ολοκληρώθηκε έχει αποθηκευτεί.",
      );
    } finally {
      setRunning(false);
      router.refresh();
    }
  }

  const percent = totalUnits > 0
    ? Math.min(100, Math.round((processedUnits / totalUnits) * 100))
    : 0;

  if (status === "ready") {
    return (
      <div className="rounded-2xl border border-[#b8ccb7] bg-[#f0f6ef] p-4 text-sm text-[#496047]">
        Η source-level ανάλυση έχει ολοκληρωθεί και έχει αποθηκευτεί ως structured intelligence.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#d5c8ba] bg-[#faf7f2] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Ανάλυση πηγής</h2>
          <p className="mt-1 text-sm leading-6 text-[#6f665f]">
            Οι φωτογραφίες αναλύονται σε μικρά resumable βήματα. Αν κλείσεις τη σελίδα, η ολοκληρωμένη πρόοδος δεν χάνεται.
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
          ? `Αναλύεται… ${processedUnits}/${totalUnits}`
          : processedUnits > 0
            ? "Συνέχιση Source Intelligence"
            : "Έναρξη Source Intelligence"}
      </button>
    </div>
  );
}

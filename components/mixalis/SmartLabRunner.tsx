"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SmartLabContent, SmartLabRevisionView } from "@/lib/mixalis/smartlab-types";
import { SmartLabExperience } from "@/components/mixalis/SmartLabWidget";

const STATUS_POLL_MS = 5_000;

export default function SmartLabRunner({ initialView }: { initialView: SmartLabRevisionView }) {
  const [view, setView] = useState(initialView);
  const [requesting, setRequesting] = useState(false);
  const started = useRef(false);

  async function refresh() {
    const response = await fetch(`/mixalis/api/smartlab/revisions/${view.id}`, { cache: "no-store" });
    const payload = await response.json();
    if (response.ok && payload?.view) setView(payload.view);
  }

  async function run() {
    if (requesting) return;
    setRequesting(true);
    try {
      const response = await fetch(`/mixalis/api/smartlab/revisions/${view.id}`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Δεν ξεκίνησε το SMARTLAB.");
      if (payload?.view) setView(payload.view);
    } catch (error) {
      setView((current) => ({
        ...current,
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Δεν ξεκίνησε το SMARTLAB.",
      }));
    } finally {
      setRequesting(false);
    }
  }

  useEffect(() => {
    if (view.status === "draft" && !started.current) {
      started.current = true;
      void run();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.status]);

  useEffect(() => {
    if (view.status !== "processing") return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      if (cancelled) return;
      timer = window.setTimeout(async () => {
        if (document.visibilityState === "visible") {
          await refresh().catch(() => undefined);
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
  }, [view.id, view.status]);

  if (view.status === "current" || view.status === "superseded") {
    const content = view.content as SmartLabContent;
    return <SmartLabExperience content={content} />;
  }

  if (view.status === "error") {
    return (
      <div className="rounded-3xl border border-[#dfbcb0] bg-[#fbf1ed] p-6">
        <h2 className="text-xl font-semibold text-[#714638]">Το SMARTLAB δεν ολοκληρώθηκε</h2>
        <p className="mt-2 text-sm leading-6 text-[#80584b]">{view.errorMessage || "Παρουσιάστηκε προσωρινό σφάλμα κατά τη δημιουργία."}</p>
        <Button type="button" onClick={run} disabled={requesting} className="mt-4 bg-[#334f39] hover:bg-[#29412f]">
          <RefreshCw className="h-4 w-4" /> Επανάληψη δημιουργίας
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-7 text-center shadow-sm sm:p-10">
      <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-[#526b55]" />
      <h2 className="mt-4 text-xl font-semibold">Το SMARTLAB σχεδιάζει τα διαδραστικά πειράματα</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">
        Ο καθηγητής AI παίρνει ξεχωριστά κάθε φυσική έννοια μαζί με τα φυσικά μεγέθη του current μαθήματος και σχεδιάζει ένα ενιαίο widget.
      </p>
      <p className="mt-3 text-xs text-stone-400">Μπορείς να κλείσεις τη σελίδα. Η δημιουργία συνεχίζεται στον server.</p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  versionId: string;
  initialStatus: "draft" | "current" | "superseded";
  initialErrorMessage?: string | null;
  versionNumber: number;
  sourceCount: number;
  findingCount: number;
  currentLesson?: {
    revisionId: string;
    revisionNumber: number;
  } | null;
};

type RunState = "idle" | "running" | "error" | "ready";

type StatusPayload = {
  accepted?: boolean;
  status?: "draft" | "current" | "superseded";
  view?: {
    status?: "draft" | "current" | "superseded";
    errorMessage?: string | null;
    content?: {
      state?: string;
      startedAt?: string;
    };
  };
  error?: string;
};

const STALE_RUN_MS = 8 * 60_000;
const STATUS_POLL_MS = 5_000;

const primaryCtaClass =
  "inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#304b35] px-5 py-4 text-center text-base font-bold !text-white shadow-sm transition hover:bg-[#263d2b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9fb49d] disabled:cursor-wait disabled:opacity-60";

const secondaryCtaClass =
  "inline-flex min-h-14 w-full items-center justify-center rounded-2xl border-2 border-[#304b35] bg-white px-5 py-4 text-center text-base font-bold !text-[#304b35] shadow-sm transition hover:bg-[#f6faf5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c4d3c2]";

function friendlyError(value: string | null) {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized.includes("fetch failed") || normalized.includes("network")) {
    return "Η σύνθεση δεν μπόρεσε να επικοινωνήσει με το OpenAI μετά τις αυτόματες επαναλήψεις. Τα source findings παραμένουν αποθηκευμένα και μπορείς να επαναλάβεις μόνο τη σύνθεση.";
  }
  if (normalized.includes("aborted") || normalized.includes("timeout") || normalized.includes("timed out")) {
    return "Η σύνθεση ξεπέρασε το χρονικό όριο μετά τις αυτόματες επαναλήψεις. Τα source findings παραμένουν αποθηκευμένα και μπορείς να επαναλάβεις μόνο τη σύνθεση.";
  }
  return value;
}

function isStaleRunningPayload(payload: StatusPayload | null) {
  if (String(payload?.view?.content?.state || "") !== "running") return false;
  const startedAt = payload?.view?.content?.startedAt;
  if (!startedAt) return false;
  const startedMs = Date.parse(startedAt);
  return Number.isFinite(startedMs) && Date.now() - startedMs > STALE_RUN_MS;
}

function deriveRunState(payload: StatusPayload | null): RunState {
  const nextStatus = payload?.view?.status || payload?.status;
  if (nextStatus === "current" || nextStatus === "superseded") return "ready";
  const state = String(payload?.view?.content?.state || "");
  if (state === "running") return isStaleRunningPayload(payload) ? "error" : "running";
  if (state === "error") return "error";
  return "idle";
}

export default function SubchapterIntelligenceRunner({
  versionId,
  initialStatus,
  initialErrorMessage,
  versionNumber,
  sourceCount,
  findingCount,
  currentLesson = null,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [runState, setRunState] = useState<RunState>(
    initialStatus === "current" || initialStatus === "superseded"
      ? "ready"
      : initialErrorMessage
        ? "error"
        : "idle",
  );
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(friendlyError(initialErrorMessage ?? null));
  const activeRef = useRef(true);
  const running = runState === "running";

  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
    };
  }, []);

  const applyPayload = useCallback((payload: StatusPayload | null) => {
    const nextStatus = payload?.view?.status || payload?.status;
    const nextRunState = deriveRunState(payload);
    const stale = isStaleRunningPayload(payload);
    const nextError = stale
      ? "Η προηγούμενη server-side σύνθεση δεν ολοκληρώθηκε μέσα στο ασφαλές χρονικό όριο. Μπορείς να την επαναλάβεις χωρίς να χαθούν ή να ξαναδιαβαστούν οι πηγές."
      : friendlyError(payload?.view?.errorMessage || null);

    if (!activeRef.current) return { status: nextStatus, runState: nextRunState, errorMessage: nextError };
    if (nextStatus) setStatus(nextStatus);
    setRunState(nextRunState);
    setError(nextRunState === "error" ? nextError : null);
    return { status: nextStatus, runState: nextRunState, errorMessage: nextError };
  }, []);

  const readStatus = useCallback(async () => {
    const response = await fetch(`/mixalis/api/subchapter-intelligence/${versionId}`, {
      method: "GET",
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as StatusPayload | null;
    if (!response.ok) throw new Error(payload?.error || "Δεν ήταν δυνατός ο έλεγχος προόδου.");
    return applyPayload(payload);
  }, [applyPayload, versionId]);

  useEffect(() => {
    if (status !== "draft") return;
    void readStatus().catch(() => undefined);
  }, [readStatus, status]);

  useEffect(() => {
    if (status !== "draft" || runState !== "running") return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      if (cancelled) return;
      timer = window.setTimeout(async () => {
        if (document.visibilityState === "visible") {
          const next = await readStatus().catch(() => null);
          if (next?.status === "current" || next?.status === "superseded") {
            router.refresh();
            return;
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
  }, [readStatus, router, runState, status]);

  const run = useCallback(async () => {
    if (requesting || running || status !== "draft") return;
    setRequesting(true);
    setError(null);

    try {
      const response = await fetch(`/mixalis/api/subchapter-intelligence/${versionId}`, {
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as StatusPayload | null;
      if (!response.ok) throw new Error(payload?.error || "Η σύνθεση απέτυχε να ξεκινήσει.");

      const next = applyPayload(payload);
      if (next.status === "current" || next.status === "superseded") {
        router.refresh();
        return;
      }

      if (next.runState !== "running") {
        const refreshed = await readStatus();
        if (refreshed.status === "current" || refreshed.status === "superseded") {
          router.refresh();
        }
      }
    } catch (reason) {
      if (!activeRef.current) return;
      setRunState("error");
      setError(
        friendlyError(reason instanceof Error ? reason.message : "Η σύνθεση δεν ξεκίνησε."),
      );
    } finally {
      if (activeRef.current) setRequesting(false);
    }
  }, [applyPayload, readStatus, requesting, router, running, status, versionId]);

  const completed = status === "current" || status === "superseded";

  return (
    <section className="mt-6 rounded-3xl border border-[#d6cabb] bg-[#faf7f2] p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6c5b4d]">
        Subchapter Intelligence v{versionNumber}
      </p>
      <h2 className="mt-2 text-2xl font-semibold">
        {completed ? "Η canonical γνώση του υποκεφαλαίου είναι έτοιμη" : "Σύνθεση των πηγών"}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5d554f] sm:text-base">
        Το σύστημα συνθέτει {findingCount} structured findings από {sourceCount} πηγές. Δεν ξαναδιαβάζει τις φωτογραφίες ή το PDF.
        {currentLesson ? ` Το Lesson Revision ${currentLesson.revisionNumber} έχει ήδη δημιουργηθεί από αυτή τη γνώση.` : " Το μάθημα δημιουργείται μόνο στο επόμενο χειροκίνητο στάδιο START."}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-sm font-medium text-[#514a44]">
        <span className="rounded-full border border-black/10 bg-white px-3 py-1.5">{sourceCount} πηγές</span>
        <span className="rounded-full border border-black/10 bg-white px-3 py-1.5">{findingCount} findings</span>
        <span className="rounded-full border border-black/10 bg-white px-3 py-1.5">
          {completed
            ? "Canonical · ready"
            : requesting
              ? "Εκκινείται…"
              : running
                ? "Συντίθεται…"
                : runState === "error"
                  ? "Χρειάζεται επανάληψη"
                  : "Έτοιμο για σύνθεση"}
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
          disabled={requesting || running}
          className={`mt-6 ${primaryCtaClass}`}
        >
          {requesting
            ? "Εκκίνηση σύνθεσης…"
            : running
              ? "Συντίθεται το Subchapter Intelligence…"
              : runState === "error"
                ? `Επανάληψη σύνθεσης Subchapter Intelligence v${versionNumber}`
                : `Δημιουργία Subchapter Intelligence v${versionNumber}`}
        </button>
      ) : currentLesson ? (
        <div className="mt-6 rounded-2xl border border-[#a9c1a5] bg-[#eef5ed] p-5 text-[#33492f]">
          <p className="text-base font-bold">Lesson Revision {currentLesson.revisionNumber} · current</p>
          <p className="mt-2 text-sm leading-6 text-[#40563c]">
            Το τρέχον μάθημα παραμένει ασφαλές. Μπορείς να το ανοίξεις ή να δημιουργήσεις νέο revision με το τρέχον START. Το παλιό revision δεν αντικαθίσταται μέχρι να ολοκληρωθεί επιτυχώς το νέο.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link href={`/mixalis/lessons/${currentLesson.revisionId}`} prefetch={false} className={secondaryCtaClass}>
              Άνοιγμα current μαθήματος
            </Link>

            <form action={`/mixalis/api/lesson-revisions/from-intelligence/${versionId}`} method="post">
              <button type="submit" className={primaryCtaClass}>
                Δημιουργία νέου Lesson Revision
              </button>
            </form>
          </div>

          <p className="mt-3 text-xs font-semibold leading-5 text-[#52644e]">
            Το νέο revision θα χρησιμοποιήσει το τρέχον START και τις τρέχουσες ρυθμίσεις generation.
          </p>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-[#a9c1a5] bg-[#eef5ed] p-5 text-[#33492f]">
          <p className="text-sm leading-6 text-[#40563c]">
            Η τρέχουσα canonical version έχει αποθηκευτεί. Το START μπορεί τώρα να τη μετατρέψει σε πραγματικό μάθημα χωρίς να ξαναδιαβάσει τις αρχικές πηγές.
          </p>
          <form action={`/mixalis/api/lesson-revisions/from-intelligence/${versionId}`} method="post" className="mt-4">
            <button type="submit" className={primaryCtaClass}>
              Δημιουργία μαθήματος με START
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

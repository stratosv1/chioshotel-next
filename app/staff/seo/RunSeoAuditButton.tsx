"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RunSeoAuditButton() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function runFullAudit() {
    if (running) return;

    setRunning(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/staff/seo/health/run/", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.error || `Audit failed with HTTP ${response.status}`);
      }

      setMessage("Το Full Technical SEO Audit ολοκληρώθηκε. Τα αποτελέσματα ανανεώθηκαν.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Το Full Audit απέτυχε.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="w-full lg:w-auto lg:min-w-[280px]">
      <button
        type="button"
        onClick={runFullAudit}
        disabled={running}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#342c26] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4a3d33] disabled:cursor-wait disabled:opacity-65 lg:w-auto"
      >
        {running ? "Τρέχει Full Audit…" : "Run Full Technical SEO Audit"}
      </button>
      <p className="mt-2 text-xs leading-5 text-[#77695e]">
        Ελέγχει όλο το διαθέσιμο URL inventory με GSC URL Inspection, live HTTP, redirects και canonicals. Μπορεί να χρειαστούν μερικά λεπτά.
      </p>
      {message ? <p className="mt-2 text-xs font-semibold text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-2 text-xs font-semibold text-red-800">{error}</p> : null}
    </div>
  );
}

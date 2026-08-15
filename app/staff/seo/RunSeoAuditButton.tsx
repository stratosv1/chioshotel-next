"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function pct(done: number, total: number) {
  if (!total) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

export default function RunSeoAuditButton() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [progressLabel, setProgressLabel] = useState("");

  async function runFullAudit() {
    if (running) return;

    setRunning(true);
    setMessage("");
    setError("");
    setProgressLabel("Προετοιμασία URL inventory…");

    let sessionId = "";

    try {
      for (;;) {
        const response = await fetch("/api/staff/seo/health/run/", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionId ? { sessionId } : {}),
          cache: "no-store",
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok || payload?.ok === false) {
          throw new Error(payload?.error || `Audit failed with HTTP ${response.status}`);
        }

        sessionId = String(payload?.sessionId || sessionId || "");
        const session = payload?.session || {};
        const completed = Number(session?.batchesCompleted || 0);
        const target = Number(session?.batchesTarget || 0);
        const inspected = Number(session?.inspected || 0);
        const totalUrls = Number(session?.totalUrls || 0);
        const percent = pct(completed, target);

        setProgressLabel(
          payload?.done
            ? `100% · ${inspected.toLocaleString("el-GR")} URLs ελέγχθηκαν`
            : `${percent}% · batch ${completed}/${target} · ${Math.min(inspected, totalUrls).toLocaleString("el-GR")}/${totalUrls.toLocaleString("el-GR")} URLs`,
        );

        if (payload?.done) {
          setMessage("Το Full Technical SEO Audit ολοκληρώθηκε. Τα συγκεντρωτικά αποτελέσματα αποθηκεύτηκαν και ανανεώθηκαν.");
          router.refresh();
          break;
        }

        await new Promise((resolve) => window.setTimeout(resolve, 750));
      }
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : "Το Full Audit διακόπηκε.";
      setError(`${detail} Η πρόοδος έχει αποθηκευτεί· πάτησε ξανά το κουμπί για να συνεχίσει από το ενεργό Full Audit session.`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="w-full lg:w-auto lg:min-w-[300px]">
      <button
        type="button"
        onClick={runFullAudit}
        disabled={running}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#342c26] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4a3d33] disabled:cursor-wait disabled:opacity-65 lg:w-auto"
      >
        {running ? "Τρέχει Full Audit…" : "Run Full Technical SEO Audit"}
      </button>
      <p className="mt-2 text-xs leading-5 text-[#77695e]">
        Τρέχει σε ασφαλή batches ώστε να μην κόβεται από το Vercel timeout. Ελέγχει όλο το URL inventory με GSC URL Inspection, live HTTP, redirects και canonicals.
      </p>
      {progressLabel ? <p className="mt-2 text-xs font-semibold text-[#51463e]">{progressLabel}</p> : null}
      {message ? <p className="mt-2 text-xs font-semibold text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-2 text-xs font-semibold leading-5 text-red-800">{error}</p> : null}
    </div>
  );
}

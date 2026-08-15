"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const FALLBACK_ISSUES = [
  "Not found (404)",
  "Server error (5xx)",
  "Redirect error",
  "Page with redirect",
  "Soft 404",
  "Crawled – currently not indexed",
  "Discovered – currently not indexed",
  "Duplicate without user-selected canonical",
  "Duplicate, Google chose different canonical than user",
  "Alternate page with proper canonical",
  "Excluded by noindex tag",
  "Blocked by robots.txt",
];

export default function GscPagesCsvUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fallbackIssue, setFallbackIssue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function upload() {
    if (!file || uploading) return;
    setUploading(true);
    setMessage("");
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("fallbackIssue", fallbackIssue);

      const response = await fetch("/api/staff/seo/gsc-pages/import/", {
        method: "POST",
        body: form,
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.error || `Upload failed with HTTP ${response.status}`);
      }

      const imported = Number(payload?.importedUrls || 0);
      const skipped = Number(payload?.skippedRows || 0);
      const detectedIssue = String(payload?.detectedIssue || "");
      const formatLabel = payload?.importFormat === "zip" ? "Google ZIP" : "CSV";
      setMessage(
        `${formatLabel}: εισήχθησαν ${imported.toLocaleString("el-GR")} URLs${detectedIssue ? ` · κατηγορία: ${detectedIssue}` : ""}${skipped ? ` · ${skipped.toLocaleString("el-GR")} γραμμές αγνοήθηκαν` : ""}. Τώρα πάτησε Run Full Technical SEO Audit.`,
      );
      setFile(null);
      setFallbackIssue("");
      const input = document.getElementById("gsc-pages-export-file") as HTMLInputElement | null;
      if (input) input.value = "";
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Το GSC Pages upload απέτυχε.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-[#d8cec2] bg-white/55 p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7768]">GSC Pages import</div>
      <h2 className="mt-1 text-lg font-semibold text-[#342c26]">Upload Google Pages ZIP</h2>
      <p className="mt-1 text-xs leading-5 text-[#77695e]">
        Ανέβασε <strong>αυτούσιο το ZIP</strong> που κατεβάζει το Google Search Console από το Pages report.
        Το σύστημα διαβάζει αυτόματα το <strong>Metadata.csv</strong> για την κατηγορία και το <strong>Table.csv</strong> για τα URLs. Δέχεται και απλό CSV για συμβατότητα.
      </p>

      <label className="mt-4 block text-xs font-semibold text-[#51463e]" htmlFor="gsc-pages-export-file">
        Google Search Console export
      </label>
      <input
        id="gsc-pages-export-file"
        type="file"
        accept=".zip,.csv,application/zip,text/csv"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
        className="mt-1 block w-full rounded-xl border border-[#d8cec2] bg-white px-3 py-2 text-sm text-[#342c26] file:mr-3 file:rounded-lg file:border-0 file:bg-[#eee9e1] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#51463e]"
      />

      <details className="mt-3 rounded-xl border border-[#ded5ca] bg-white/60 px-3 py-2">
        <summary className="cursor-pointer text-xs font-semibold text-[#51463e]">Χειροκίνητη κατηγορία μόνο αν λείπει το Metadata.csv</summary>
        <select
          id="gsc-pages-fallback-issue"
          value={fallbackIssue}
          onChange={(event) => setFallbackIssue(event.target.value)}
          className="mt-3 min-h-11 w-full rounded-xl border border-[#d8cec2] bg-white px-3 text-sm text-[#342c26]"
        >
          <option value="">Αυτόματα από το Google export</option>
          {FALLBACK_ISSUES.map((issue) => (
            <option key={issue} value={issue}>{issue}</option>
          ))}
        </select>
      </details>

      <button
        type="button"
        onClick={upload}
        disabled={!file || uploading}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#342c26] bg-transparent px-4 text-sm font-semibold text-[#342c26] transition hover:bg-[#eee9e1] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Ανεβαίνει το GSC export…" : "Upload GSC Pages Export"}
      </button>

      {message ? <p className="mt-3 text-xs font-semibold leading-5 text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-3 text-xs font-semibold leading-5 text-red-800">{error}</p> : null}
    </div>
  );
}

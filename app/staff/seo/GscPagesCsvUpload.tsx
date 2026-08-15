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
      setMessage(
        `Εισήχθησαν ${imported.toLocaleString("el-GR")} URLs στο SEO Autopilot${skipped ? ` · ${skipped.toLocaleString("el-GR")} γραμμές αγνοήθηκαν` : ""}. Τώρα πάτησε Run Full Technical SEO Audit.`,
      );
      setFile(null);
      const input = document.getElementById("gsc-pages-csv-file") as HTMLInputElement | null;
      if (input) input.value = "";
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Το CSV upload απέτυχε.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-[#d8cec2] bg-white/55 p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7768]">GSC Pages import</div>
      <h2 className="mt-1 text-lg font-semibold text-[#342c26]">Upload Google Pages CSV</h2>
      <p className="mt-1 text-xs leading-5 text-[#77695e]">
        Δέχεται CSV με στήλες <strong>URL</strong>, <strong>Issue</strong> και προαιρετικά <strong>Last crawled</strong>.
        Αν το export έχει μόνο URL/Last crawled, διάλεξε παρακάτω την κατηγορία του Search Console.
      </p>

      <label className="mt-4 block text-xs font-semibold text-[#51463e]" htmlFor="gsc-pages-csv-file">
        CSV αρχείο
      </label>
      <input
        id="gsc-pages-csv-file"
        type="file"
        accept=".csv,text/csv"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
        className="mt-1 block w-full rounded-xl border border-[#d8cec2] bg-white px-3 py-2 text-sm text-[#342c26] file:mr-3 file:rounded-lg file:border-0 file:bg-[#eee9e1] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#51463e]"
      />

      <label className="mt-3 block text-xs font-semibold text-[#51463e]" htmlFor="gsc-pages-fallback-issue">
        Κατηγορία, μόνο αν λείπει η στήλη Issue
      </label>
      <select
        id="gsc-pages-fallback-issue"
        value={fallbackIssue}
        onChange={(event) => setFallbackIssue(event.target.value)}
        className="mt-1 min-h-11 w-full rounded-xl border border-[#d8cec2] bg-white px-3 text-sm text-[#342c26]"
      >
        <option value="">Αυτόματα από τη στήλη Issue/Reason</option>
        {FALLBACK_ISSUES.map((issue) => (
          <option key={issue} value={issue}>{issue}</option>
        ))}
      </select>

      <button
        type="button"
        onClick={upload}
        disabled={!file || uploading}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#342c26] bg-transparent px-4 text-sm font-semibold text-[#342c26] transition hover:bg-[#eee9e1] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Ανεβαίνει το CSV…" : "Upload CSV to SEO Autopilot"}
      </button>

      {message ? <p className="mt-3 text-xs font-semibold leading-5 text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-3 text-xs font-semibold leading-5 text-red-800">{error}</p> : null}
    </div>
  );
}

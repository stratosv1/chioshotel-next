"use client";

import { useCallback, useEffect, useState } from "react";
import { GREETING_LABELS, GREETING_TYPES, type GreetingType } from "@/lib/crm/greeting-templates";
import type { EmailLanguage } from "@/lib/crm/email-design";
import { useBulkSend, type BulkBatchResult } from "./useBulkSend";

type Counts = { total: number; sent: number; failed: number; waiting: number };
type Status = { type: GreetingType; year: number; byLanguage: Record<EmailLanguage, Counts>; sentToday: number; dailyLimit: number };

const API = "/api/staff/crm/greetings/";
const LANGUAGES: { key: EmailLanguage; label: string }[] = [
  { key: "el", label: "Ελληνικά" },
  { key: "en", label: "Αγγλικά" },
  { key: "tr", label: "Τουρκικά" },
];
const panelClass = "rounded-2xl bg-white p-4 shadow-sm";
const inputClass = "w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";
const secondaryButton = "rounded-full border border-amber-800/30 bg-white px-4 py-2 text-sm font-black text-amber-900 disabled:opacity-50";
const primaryButton = "rounded-full bg-amber-800 px-4 py-2 text-sm font-black text-white disabled:opacity-50";

async function request(url: string, body?: Record<string, unknown>) {
  const response = await fetch(url, body ? {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  } : { cache: "no-store" });
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.error || "Κάτι πήγε στραβά.");
  return payload;
}

export default function GreetingsPanel() {
  const [type, setType] = useState<GreetingType>("christmas");
  const [status, setStatus] = useState<Status | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [selected, setSelected] = useState<EmailLanguage[]>(["el", "en", "tr"]);
  const [previewLanguage, setPreviewLanguage] = useState<EmailLanguage>("el");
  const [preview, setPreview] = useState<{ subject: string; html: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const { sending, progress, run, stop } = useBulkSend();

  const load = useCallback(async () => {
    const payload = await request(`${API}?type=${type}`);
    setStatus(payload.status);
    setTestEmail(payload.testEmail);
  }, [type]);

  useEffect(() => {
    setStatus(null);
    load().catch((reason) => setError(reason.message));
  }, [load]);

  useEffect(() => {
    setPreview(null);
    request(`${API}?type=${type}&lang=${previewLanguage}`)
      .then((payload) => setPreview({ subject: payload.subject, html: payload.html }))
      .catch((reason) => setError(reason.message));
  }, [type, previewLanguage]);

  const waitingSelected = status ? selected.reduce((sum, language) => sum + status.byLanguage[language].waiting, 0) : 0;
  const failedSelected = status ? selected.reduce((sum, language) => sum + status.byLanguage[language].failed, 0) : 0;

  const sendTest = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const payload = await request(API, { action: "send_test", type, language: previewLanguage });
      setNotice(`Η δοκιμή στάλθηκε στο ${payload.to}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Κάτι πήγε στραβά.");
    } finally {
      setBusy(false);
    }
  };

  const sendAll = async (retryFailed: boolean) => {
    const count = retryFailed ? failedSelected : waitingSelected;
    const names = LANGUAGES.filter((language) => selected.includes(language.key)).map((language) => language.label).join(", ");
    if (!window.confirm(`Να σταλούν οι ευχές «${GREETING_LABELS[type]}» σε ${count} πελάτες (${names});`)) return;
    setError("");
    setNotice("");
    try {
      setNotice(await run(async () => (await request(API, { action: "send_batch", type, languages: selected, retryFailed })).result as BulkBatchResult));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Κάτι πήγε στραβά.");
    } finally {
      await load().catch(() => undefined);
    }
  };

  return (
    <div className="grid gap-4">
      {notice ? <div role="status" className="rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900">{notice}</div> : null}
      {error ? <div role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">{error}</div> : null}

      <section className={panelClass}>
        <h2 className="text-lg font-black">Ευχές σε πελάτες</h2>
        <p className="mt-1 text-sm text-stone-600">
          Πηγαίνουν σε όλη τη λίστα του Newsletter (πελάτες του Beds24, εγγραφές από το site και όσα email έχεις προσθέσει), στη γλώσσα του καθενός: ελληνικά για Ελλάδα και Κύπρο, τουρκικά για Τουρκία, αγγλικά για όλους τους άλλους.
          Όσοι έχουν κάνει διαγραφή και οι εξαιρέσεις δεν παίρνουν τίποτα. Κάθε πελάτης παίρνει τις ευχές μία φορά τον χρόνο.
        </p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Είδος ευχών">
          {GREETING_TYPES.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={type === key}
              disabled={sending}
              onClick={() => { setType(key); setNotice(""); }}
              className={`min-h-11 rounded-full px-4 text-sm font-black disabled:opacity-50 ${type === key ? "bg-stone-900 text-white" : "border border-stone-300 bg-white text-stone-700"}`}
            >
              {GREETING_LABELS[key]}
            </button>
          ))}
        </div>
      </section>

      <section className={panelClass}>
        <h2 className="mb-3 text-lg font-black">Αποστολή {status ? status.year : ""}</h2>
        {!status ? <p className="text-sm text-stone-600">Φόρτωση…</p> : (
          <>
            <ul className="grid gap-1">
              {LANGUAGES.map(({ key, label }) => {
                const counts = status.byLanguage[key];
                return (
                  <li key={key} className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 py-2">
                    <label className="flex items-center gap-2 font-black">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={selected.includes(key)}
                        disabled={sending}
                        onChange={(event) => setSelected(event.target.checked ? [...selected, key] : selected.filter((item) => item !== key))}
                      />
                      {label}
                    </label>
                    <span className="text-sm text-stone-600">
                      {counts.total} πελάτες · {counts.sent} στάλθηκαν · {counts.waiting} περιμένουν{counts.failed ? ` · ${counts.failed} απέτυχαν` : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-xs text-stone-500">Σήμερα στάλθηκαν {status.sentToday} από {status.dailyLimit} ευχές (όριο για να μη μπλοκάρει το Gmail).</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className={primaryButton} disabled={sending || busy || !waitingSelected} onClick={() => sendAll(false)}>
                {sending ? "Αποστολή…" : `Αποστολή σε ${waitingSelected}`}
              </button>
              {sending ? (
                <button type="button" className={secondaryButton} onClick={stop}>Διακοπή</button>
              ) : null}
              {!sending && failedSelected ? (
                <button type="button" className={secondaryButton} disabled={busy} onClick={() => sendAll(true)}>
                  Ξαναδοκίμασε {failedSelected} αποτυχημένα
                </button>
              ) : null}
            </div>
            {progress ? <p role="status" className="mt-3 text-sm font-bold text-stone-700">{progress}</p> : null}
          </>
        )}
      </section>

      <section className={panelClass}>
        <h2 className="mb-3 text-lg font-black">Προεπισκόπηση</h2>
        <div className="mb-3 grid gap-3 md:grid-cols-[180px_auto] md:items-end">
          <div>
            <label htmlFor="crm-greeting-language" className="mb-1 block text-sm font-bold">Γλώσσα</label>
            <select id="crm-greeting-language" className={inputClass} value={previewLanguage} onChange={(event) => setPreviewLanguage(event.target.value as EmailLanguage)}>
              {LANGUAGES.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
          <div>
            <button type="button" className={secondaryButton} disabled={busy || sending || !testEmail} onClick={sendTest}>
              Στείλε μου δοκιμή{testEmail ? ` στο ${testEmail}` : ""}
            </button>
          </div>
        </div>
        {preview ? (
          <>
            <p className="mb-2 text-sm font-bold">Θέμα: {preview.subject}</p>
            <iframe title="Προεπισκόπηση ευχών" sandbox="" srcDoc={preview.html} className="h-[620px] w-full rounded-xl border border-stone-200 bg-white" />
          </>
        ) : <p className="text-sm text-stone-600">Φόρτωση…</p>}
      </section>
    </div>
  );
}

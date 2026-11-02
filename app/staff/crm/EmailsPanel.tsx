"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EMAIL_LANGUAGES,
  EMAIL_TYPE_LABELS,
  EMAIL_TYPES,
  type EmailLanguage,
  type EmailType,
} from "@/lib/crm/guest-email-templates";

type Settings = { testMode: boolean; testEmail: string; enabledTypes: EmailType[] };
type Due = { type: EmailType; language: string; guestEmail: string; name: string; checkin: string };
type LogRow = { type: EmailType; language: string; recipient: string; guestEmail: string | null; mode: string; status: string; error: string | null; sentAt: string };

const API = "/api/staff/crm/emails/";
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

export default function EmailsPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [due, setDue] = useState<Due[]>([]);
  const [log, setLog] = useState<LogRow[]>([]);
  const [testEmail, setTestEmail] = useState("");
  const [previewType, setPreviewType] = useState<EmailType>("daily");
  const [previewLanguage, setPreviewLanguage] = useState<EmailLanguage>("el");
  const [preview, setPreview] = useState<{ subject: string; html: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const payload = await request(API);
    setSettings(payload.settings);
    setTestEmail(payload.settings.testEmail);
    setDue(payload.due);
    setLog(payload.log);
  }, []);

  useEffect(() => {
    load().catch((reason) => setError(reason.message));
  }, [load]);

  useEffect(() => {
    setPreview(null);
    request(`${API}?preview=${previewType}&lang=${previewLanguage}`)
      .then((payload) => setPreview({ subject: payload.subject, html: payload.html }))
      .catch((reason) => setError(reason.message));
  }, [previewType, previewLanguage]);

  const act = async (body: Record<string, unknown>, message: string) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const payload = await request(API, body);
      await load();
      const result = payload.result;
      setNotice(result ? `Έλεγχος: ${result.due} προς αποστολή, ${result.sent} στάλθηκαν, ${result.failed} απέτυχαν.` : message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Κάτι πήγε στραβά.");
    } finally {
      setBusy(false);
    }
  };

  if (!settings) return <div>{error ? <p role="alert" className="text-sm font-bold text-red-900">{error}</p> : <p className="text-sm text-stone-600">Φόρτωση…</p>}</div>;

  return (
    <div className="grid gap-4">
      {notice ? <div role="status" className="rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900">{notice}</div> : null}
      {error ? <div role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">{error}</div> : null}

      <section className={`rounded-2xl p-4 shadow-sm ${settings.testMode ? "bg-amber-100" : "bg-emerald-100"}`}>
        <h2 className="text-lg font-black">{settings.testMode ? "Λειτουργία δοκιμής" : "Ζωντανή λειτουργία"}</h2>
        <p className="mt-1 text-sm">
          {settings.testMode
            ? `Όλα τα email πηγαίνουν στο ${settings.testEmail}. Κανένας πελάτης δεν παίρνει τίποτα.`
            : "Τα ενεργά email φεύγουν κανονικά στους πελάτες, κάθε πρωί."}
        </p>
        <form
          className="mt-3 flex flex-wrap items-end gap-2"
          onSubmit={(event) => { event.preventDefault(); void act({ action: "set_test_email", email: testEmail }, "Το δοκιμαστικό email αποθηκεύτηκε."); }}
        >
          <div className="min-w-[240px] flex-1">
            <label htmlFor="crm-test-email" className="mb-1 block text-sm font-bold">Δοκιμαστικό email</label>
            <input id="crm-test-email" type="email" required className={inputClass} value={testEmail} onChange={(event) => setTestEmail(event.target.value)} />
          </div>
          <button type="submit" disabled={busy} className={secondaryButton}>Αποθήκευση</button>
          <button
            type="button"
            disabled={busy}
            className={settings.testMode ? primaryButton : secondaryButton}
            onClick={() => {
              if (settings.testMode && !window.confirm("Τα ενεργά email θα φεύγουν στους πραγματικούς πελάτες. Έχεις κλείσει τα αντίστοιχα auto actions στο Beds24;")) return;
              void act({ action: "set_test_mode", testMode: !settings.testMode }, settings.testMode ? "Η ζωντανή λειτουργία άνοιξε." : "Επιστροφή σε δοκιμή.");
            }}
          >
            {settings.testMode ? "Πέρασμα σε ζωντανή λειτουργία" : "Επιστροφή σε δοκιμή"}
          </button>
        </form>
      </section>

      <section className={panelClass}>
        <h2 className="mb-1 text-lg font-black">Αυτόματα email</h2>
        <p className="mb-3 text-sm text-stone-600">Άνοιξε ή κλείσε κάθε email ξεχωριστά. Ο έλεγχος τρέχει κάθε πρωί γύρω στις 9.</p>
        <ul className="grid gap-1">
          {EMAIL_TYPES.map((type) => {
            const enabled = settings.enabledTypes.includes(type);
            return (
              <li key={type} className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 py-2">
                <div>
                  <p className="font-black">{EMAIL_TYPE_LABELS[type].label}</p>
                  <p className="text-sm text-stone-600">{EMAIL_TYPE_LABELS[type].when}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={EMAIL_TYPE_LABELS[type].label}
                  disabled={busy}
                  onClick={() => act({ action: "toggle_type", type, enabled: !enabled }, enabled ? "Έκλεισε." : "Άνοιξε.")}
                  className={`min-w-[76px] rounded-full px-4 py-2 text-sm font-black disabled:opacity-50 ${enabled ? "bg-emerald-700 text-white" : "bg-stone-200 text-stone-700"}`}
                >
                  {enabled ? "ON" : "OFF"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={panelClass}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-black">Σημερινός έλεγχος ({due.length})</h2>
          <button type="button" disabled={busy || !settings.enabledTypes.length} className={secondaryButton} onClick={() => act({ action: "run_now" }, "")}>
            Τρέξε τον έλεγχο τώρα
          </button>
        </div>
        {due.length ? (
          <ul className="grid gap-1 text-sm">
            {due.map((item) => (
              <li key={`${item.type}-${item.guestEmail}`} className="break-all border-b border-stone-100 py-1.5">
                <strong>{EMAIL_TYPE_LABELS[item.type].label}</strong> · {item.name || "Πελάτης"} · {item.guestEmail} · {item.language.toUpperCase()} · άφιξη {item.checkin}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-stone-600">Σήμερα δεν είναι προγραμματισμένο κανένα email.</p>}
      </section>

      <section className={panelClass}>
        <h2 className="mb-3 text-lg font-black">Προεπισκόπηση</h2>
        <div className="mb-3 grid gap-3 md:grid-cols-[1fr_140px_auto] md:items-end">
          <div>
            <label htmlFor="crm-preview-type" className="mb-1 block text-sm font-bold">Email</label>
            <select id="crm-preview-type" className={inputClass} value={previewType} onChange={(event) => setPreviewType(event.target.value as EmailType)}>
              {EMAIL_TYPES.map((type) => <option key={type} value={type}>{EMAIL_TYPE_LABELS[type].label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="crm-preview-language" className="mb-1 block text-sm font-bold">Γλώσσα</label>
            <select id="crm-preview-language" className={inputClass} value={previewLanguage} onChange={(event) => setPreviewLanguage(event.target.value as EmailLanguage)}>
              {EMAIL_LANGUAGES.map((language) => <option key={language} value={language}>{language.toUpperCase()}</option>)}
            </select>
          </div>
          <button type="button" disabled={busy} className={primaryButton} onClick={() => act({ action: "send_test", type: previewType, language: previewLanguage }, `Στάλθηκε στο ${settings.testEmail}.`)}>
            Στείλε μου δοκιμή
          </button>
        </div>
        {preview ? (
          <>
            <p className="mb-2 text-sm font-bold">Θέμα: {preview.subject}</p>
            <iframe title="Προεπισκόπηση email" sandbox="" srcDoc={preview.html} className="h-[560px] w-full rounded-xl border border-stone-200 bg-white" />
          </>
        ) : <p className="text-sm text-stone-600">Φόρτωση…</p>}
      </section>

      <section className={panelClass}>
        <h2 className="mb-3 text-lg font-black">Ιστορικό αποστολών</h2>
        {log.length ? (
          <ul className="grid gap-1 text-sm">
            {log.map((row, index) => (
              <li key={`${row.sentAt}-${index}`} className="break-all border-b border-stone-100 py-1.5">
                {row.sentAt} · <strong>{EMAIL_TYPE_LABELS[row.type]?.label ?? row.type}</strong> · {row.recipient} · {row.mode === "test" ? "δοκιμή" : "ζωντανά"} · {row.status === "sent" ? "στάλθηκε" : row.status === "failed" ? `απέτυχε: ${row.error ?? ""}` : row.status}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-stone-600">Δεν έχει σταλεί τίποτα ακόμα.</p>}
      </section>
    </div>
  );
}

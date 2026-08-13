"use client";

import { ChangeEvent, useMemo, useState } from "react";

type Row = {
  phone: string;
  normalized: string;
  status: "ready" | "sending" | "sent" | "failed";
  error?: string;
};

const MAX_TEST_RECIPIENTS = 20;
const TEMPLATE_NAME = "summer_chios_direct_offer_en";
const LANGUAGE_CODE = "en";

function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith("69")) digits = `30${digits}`;
  if (digits.length < 8 || digits.length > 15) return "";
  return digits;
}

function parseCsv(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [] as Row[];

  const delimiter = lines[0].includes(";") ? ";" : ",";
  const firstCells = lines[0].split(delimiter).map((cell) => cell.trim().toLowerCase());
  const phoneIndex = firstCells.findIndex((cell) => ["phone", "mobile", "whatsapp", "telephone", "tel"].includes(cell));
  const start = phoneIndex >= 0 ? 1 : 0;
  const index = phoneIndex >= 0 ? phoneIndex : 0;
  const seen = new Set<string>();
  const rows: Row[] = [];

  for (let i = start; i < lines.length && rows.length < MAX_TEST_RECIPIENTS; i += 1) {
    const cells = lines[i].split(delimiter).map((cell) => cell.trim().replace(/^"|"$/g, ""));
    const phone = cells[index] ?? "";
    const normalized = normalizePhone(phone);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    rows.push({ phone, normalized, status: "ready" });
  }

  return rows;
}

export default function WhatsAppTestPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);

  const summary = useMemo(() => ({
    ready: rows.filter((row) => row.status === "ready").length,
    sent: rows.filter((row) => row.status === "sent").length,
    failed: rows.filter((row) => row.status === "failed").length,
  }), [rows]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRows(parseCsv(text));
    setConfirmed(false);
  }

  async function sendOne(index: number) {
    const row = rows[index];
    if (!row || !confirmed) return;

    setRows((current) => current.map((item, i) => i === index ? { ...item, status: "sending", error: undefined } : item));

    try {
      const response = await fetch("/api/staff/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: row.normalized,
          templateName: TEMPLATE_NAME,
          languageCode: LANGUAGE_CODE,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(data?.providerResponse?.error || data?.message || `HTTP ${response.status}`);
      }
      setRows((current) => current.map((item, i) => i === index ? { ...item, status: "sent" } : item));
    } catch (error) {
      setRows((current) => current.map((item, i) => i === index ? {
        ...item,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      } : item));
    }
  }

  async function sendAll() {
    if (!confirmed || !rows.length || sending) return;
    const approved = window.confirm(`Send the approved WhatsApp template to ${rows.length} TEST recipients?`);
    if (!approved) return;
    setSending(true);
    for (let i = 0; i < rows.length; i += 1) {
      if (rows[i]?.status === "sent") continue;
      await sendOne(i);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }
    setSending(false);
  }

  return (
    <main className="min-h-screen bg-[#f7f3eb] px-4 py-10 text-stone-900">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">Voulamandis House</p>
        <h1 className="mt-2 text-3xl font-bold">WhatsApp Campaign Test</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          Test-only sender for the approved template. Upload a CSV with up to 20 opted-in test numbers. Nothing is stored in a database.
        </p>

        <div className="mt-8 rounded-2xl border border-stone-200 p-5">
          <label className="block text-sm font-bold">1. Upload CSV</label>
          <p className="mt-1 text-xs text-stone-500">Accepted first-column format: phone, or a header named phone/mobile/whatsapp/tel. Greek 69XXXXXXXX numbers are automatically converted to +30.</p>
          <input className="mt-4 block w-full text-sm" type="file" accept=".csv,text/csv" onChange={handleFile} />
        </div>

        {rows.length > 0 && (
          <>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-stone-100 p-4"><div className="text-2xl font-bold">{summary.ready}</div><div className="text-xs">Ready</div></div>
              <div className="rounded-2xl bg-emerald-50 p-4"><div className="text-2xl font-bold">{summary.sent}</div><div className="text-xs">Sent</div></div>
              <div className="rounded-2xl bg-red-50 p-4"><div className="text-2xl font-bold">{summary.failed}</div><div className="text-xs">Failed</div></div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-stone-50 text-xs uppercase text-stone-500"><tr><th className="p-3">#</th><th className="p-3">Original</th><th className="p-3">WhatsApp number</th><th className="p-3">Status</th></tr></thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.normalized} className="border-t border-stone-100">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{row.phone}</td>
                      <td className="p-3 font-mono">+{row.normalized}</td>
                      <td className="p-3"><span className="font-semibold">{row.status}</span>{row.error ? <div className="mt-1 max-w-md text-xs text-red-700">{row.error}</div> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <label className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
              <input className="mt-1" type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
              <span><strong>I confirm these are consented test recipients.</strong> Do not use purchased, scraped or non-opt-in lists.</span>
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <button disabled={!confirmed || sending} onClick={() => sendOne(0)} className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-bold disabled:opacity-40">Send only first number</button>
              <button disabled={!confirmed || sending} onClick={sendAll} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{sending ? "Sending…" : `Send to ${rows.length} test numbers`}</button>
            </div>

            <div className="mt-5 rounded-2xl bg-stone-50 p-4 text-xs leading-5 text-stone-600">
              Template: <strong>{TEMPLATE_NAME}</strong> · Language: <strong>{LANGUAGE_CODE}</strong> · Hard limit: <strong>{MAX_TEST_RECIPIENTS}</strong>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

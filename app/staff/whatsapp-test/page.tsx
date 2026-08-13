"use client";

import { ChangeEvent, useMemo, useState } from "react";

type RowStatus = "ready" | "sending" | "sent" | "failed";

type Row = {
  phone: string;
  normalized: string;
  sourceRow: number;
  selected: boolean;
  status: RowStatus;
  error?: string;
};

type ImportInfo = {
  fileName: string;
  sheetName: string;
  detectedColumn: string;
  scannedRows: number;
  rawPhones: number;
  duplicatesRemoved: number;
};

const MAX_TEST_RECIPIENTS = 20;
const MAX_IMPORTED_RECIPIENTS = 500;
const TEMPLATE_NAME = "summer_chios_direct_offer_en";
const LANGUAGE_CODE = "en";

function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);

  // Greek local mobile number -> international format.
  if (digits.length === 10 && digits.startsWith("69")) digits = `30${digits}`;

  if (digits.length < 8 || digits.length > 15) return "";
  return digits;
}

function splitPhoneCell(value: unknown) {
  const text = String(value ?? "").trim();
  if (!text) return [] as string[];

  return text
    .split(/[\r\n;,|]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !/[A-Za-zΑ-Ωα-ωΆ-ώÇĞİÖŞÜçğıöşü]/.test(part))
    .filter((part) => /^[+\d\s()./-]+$/.test(part))
    .filter((part) => Boolean(normalizePhone(part)));
}

function columnLabel(index: number) {
  let value = index + 1;
  let label = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }
  return label;
}

function findPhoneColumn(grid: unknown[][]) {
  const maxColumns = grid.reduce((max, row) => Math.max(max, row.length), 0);
  let bestColumn = -1;
  let bestScore = 0;

  for (let column = 0; column < maxColumns; column += 1) {
    let score = 0;
    for (const row of grid) {
      if (splitPhoneCell(row[column]).length > 0) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestColumn = column;
    }
  }

  return { column: bestColumn, score: bestScore };
}

async function parseSpreadsheet(file: File) {
  const XLSX = await import("xlsx");
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array", raw: false });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) throw new Error("Το αρχείο δεν περιέχει φύλλο εργασίας.");

  const sheet = workbook.Sheets[sheetName];
  const grid = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
  }) as unknown[][];

  if (!grid.length) throw new Error("Το αρχείο είναι κενό.");

  const detected = findPhoneColumn(grid);
  if (detected.column < 0 || detected.score === 0) {
    throw new Error("Δεν βρέθηκε στήλη με έγκυρους αριθμούς τηλεφώνου.");
  }

  const seen = new Set<string>();
  const rows: Row[] = [];
  let rawPhones = 0;
  let duplicatesRemoved = 0;

  for (let rowIndex = 0; rowIndex < grid.length; rowIndex += 1) {
    const parts = splitPhoneCell(grid[rowIndex]?.[detected.column]);
    for (const part of parts) {
      rawPhones += 1;
      const normalized = normalizePhone(part);
      if (!normalized) continue;
      if (seen.has(normalized)) {
        duplicatesRemoved += 1;
        continue;
      }
      seen.add(normalized);
      if (rows.length < MAX_IMPORTED_RECIPIENTS) {
        rows.push({
          phone: part,
          normalized,
          sourceRow: rowIndex + 1,
          selected: rows.length < MAX_TEST_RECIPIENTS,
          status: "ready",
        });
      }
    }
  }

  if (!rows.length) throw new Error("Δεν βρέθηκαν έγκυροι μοναδικοί αριθμοί.");

  return {
    rows,
    info: {
      fileName: file.name,
      sheetName,
      detectedColumn: columnLabel(detected.column),
      scannedRows: grid.length,
      rawPhones,
      duplicatesRemoved,
    } satisfies ImportInfo,
  };
}

export default function WhatsAppTestPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [info, setInfo] = useState<ImportInfo | null>(null);
  const [importError, setImportError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);

  const summary = useMemo(() => {
    const selected = rows.filter((row) => row.selected);
    return {
      detected: rows.length,
      selected: selected.length,
      ready: selected.filter((row) => row.status === "ready").length,
      sent: selected.filter((row) => row.status === "sent").length,
      failed: selected.filter((row) => row.status === "failed").length,
    };
  }, [rows]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError("");
    setRows([]);
    setInfo(null);
    setConfirmed(false);

    try {
      const parsed = await parseSpreadsheet(file);
      setRows(parsed.rows);
      setInfo(parsed.info);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Δεν ήταν δυνατή η ανάγνωση του αρχείου.");
    }
  }

  function toggleRow(index: number) {
    if (sending) return;
    setRows((current) => {
      const selectedCount = current.filter((row) => row.selected).length;
      return current.map((row, i) => {
        if (i !== index || row.status === "sent") return row;
        if (!row.selected && selectedCount >= MAX_TEST_RECIPIENTS) return row;
        return { ...row, selected: !row.selected };
      });
    });
  }

  function selectFirstTwenty() {
    if (sending) return;
    setRows((current) => current.map((row, index) => ({
      ...row,
      selected: index < MAX_TEST_RECIPIENTS || row.status === "sent",
    })));
  }

  function clearSelection() {
    if (sending) return;
    setRows((current) => current.map((row) => ({ ...row, selected: row.status === "sent" })));
  }

  async function sendOne(index: number) {
    const row = rows[index];
    if (!row || !row.selected || !confirmed || row.status === "sent") return;

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

  async function sendFirstSelected() {
    const index = rows.findIndex((row) => row.selected && row.status !== "sent");
    if (index >= 0) await sendOne(index);
  }

  async function sendAll() {
    if (!confirmed || summary.selected === 0 || sending) return;
    const pending = rows.filter((row) => row.selected && row.status !== "sent").length;
    if (!pending) return;

    const approved = window.confirm(`Send the approved WhatsApp template to ${pending} selected TEST recipients?`);
    if (!approved) return;

    setSending(true);
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      if (!row?.selected || row.status === "sent") continue;
      await sendOne(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setSending(false);
  }

  return (
    <main className="min-h-screen bg-[#f7f3eb] px-4 py-10 text-stone-900">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">Voulamandis House</p>
        <h1 className="mt-2 text-3xl font-bold">WhatsApp Campaign Test</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          Ανέβασε το αρχείο επισκεπτών όπως το εξάγεις. Δέχεται Excel ή CSV, εντοπίζει αυτόματα τη στήλη τηλεφώνων, χωρίζει πολλαπλούς αριθμούς μέσα στο ίδιο κελί και αφαιρεί διπλότυπα.
        </p>

        <div className="mt-8 rounded-2xl border border-stone-200 p-5">
          <label className="block text-sm font-bold">1. Ανέβασε Excel ή CSV</label>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Υποστηρίζονται .xlsx, .xls και .csv. Δεν χρειάζεται να αλλάξεις τη διάταξη του αρχείου ή να καθαρίσεις τους αριθμούς πριν το ανεβάσεις.
          </p>
          <input
            className="mt-4 block w-full text-sm"
            type="file"
            accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
            onChange={handleFile}
          />
          {importError ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{importError}</p> : null}
        </div>

        {info && rows.length > 0 && (
          <>
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6">
              <strong>{info.fileName}</strong> · φύλλο <strong>{info.sheetName}</strong> · εντοπίστηκε στήλη τηλεφώνων <strong>{info.detectedColumn}</strong>.
              <br />
              Διαβάστηκαν {info.scannedRows} γραμμές, βρέθηκαν {info.rawPhones} εμφανίσεις αριθμών και αφαιρέθηκαν {info.duplicatesRemoved} διπλότυπα.
            </div>

            {rows.length > MAX_TEST_RECIPIENTS ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                Βρέθηκαν <strong>{rows.length} μοναδικοί αριθμοί</strong>. Για το πρώτο test επιτρέπονται μέχρι <strong>{MAX_TEST_RECIPIENTS}</strong>. Έχω επιλέξει αυτόματα τους πρώτους 20· μπορείς να αλλάξεις την επιλογή από τα checkbox.
              </div>
            ) : null}

            <div className="mt-6 grid grid-cols-2 gap-3 text-center md:grid-cols-5">
              <div className="rounded-2xl bg-stone-100 p-4"><div className="text-2xl font-bold">{summary.detected}</div><div className="text-xs">Unique found</div></div>
              <div className="rounded-2xl bg-amber-50 p-4"><div className="text-2xl font-bold">{summary.selected}</div><div className="text-xs">Selected</div></div>
              <div className="rounded-2xl bg-stone-100 p-4"><div className="text-2xl font-bold">{summary.ready}</div><div className="text-xs">Ready</div></div>
              <div className="rounded-2xl bg-emerald-50 p-4"><div className="text-2xl font-bold">{summary.sent}</div><div className="text-xs">Sent</div></div>
              <div className="rounded-2xl bg-red-50 p-4"><div className="text-2xl font-bold">{summary.failed}</div><div className="text-xs">Failed</div></div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={selectFirstTwenty} disabled={sending} className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold disabled:opacity-40">Επίλεξε πρώτους 20</button>
              <button type="button" onClick={clearSelection} disabled={sending} className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold disabled:opacity-40">Καθάρισε επιλογή</button>
              <span className="self-center text-xs text-stone-500">Μέχρι {MAX_TEST_RECIPIENTS} επιλεγμένοι αριθμοί.</span>
            </div>

            <div className="mt-4 max-h-[520px] overflow-auto rounded-2xl border border-stone-200">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="sticky top-0 bg-stone-50 text-xs uppercase text-stone-500">
                  <tr><th className="p-3">Send</th><th className="p-3">#</th><th className="p-3">Excel row</th><th className="p-3">Original</th><th className="p-3">WhatsApp number</th><th className="p-3">Status</th></tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.normalized} className="border-t border-stone-100">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={row.selected}
                          disabled={sending || row.status === "sent" || (!row.selected && summary.selected >= MAX_TEST_RECIPIENTS)}
                          onChange={() => toggleRow(index)}
                          aria-label={`Select +${row.normalized}`}
                        />
                      </td>
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{row.sourceRow}</td>
                      <td className="p-3">{row.phone}</td>
                      <td className="p-3 font-mono">+{row.normalized}</td>
                      <td className="p-3">
                        <span className="font-semibold">{row.status}</span>
                        {row.error ? <div className="mt-1 max-w-md text-xs text-red-700">{row.error}</div> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <label className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
              <input className="mt-1" type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
              <span><strong>Επιβεβαιώνω ότι οι επιλεγμένοι παραλήπτες έχουν δώσει συγκατάθεση για WhatsApp marketing/test.</strong> Δεν χρησιμοποιούμε αγορασμένες, scraped ή μη opt-in λίστες.</span>
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <button disabled={!confirmed || sending || summary.selected === 0} onClick={sendFirstSelected} className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-bold disabled:opacity-40">Στείλε μόνο στον πρώτο επιλεγμένο</button>
              <button disabled={!confirmed || sending || summary.selected === 0} onClick={sendAll} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{sending ? "Sending…" : `Στείλε στους ${summary.selected} επιλεγμένους`}</button>
            </div>

            <div className="mt-5 rounded-2xl bg-stone-50 p-4 text-xs leading-5 text-stone-600">
              Template: <strong>{TEMPLATE_NAME}</strong> · Language: <strong>{LANGUAGE_CODE}</strong> · Test send limit: <strong>{MAX_TEST_RECIPIENTS}</strong> · Δεν αποθηκεύεται η λίστα στη βάση σε αυτή τη δοκιμαστική έκδοση.
            </div>
          </>
        )}
      </div>
    </main>
  );
}

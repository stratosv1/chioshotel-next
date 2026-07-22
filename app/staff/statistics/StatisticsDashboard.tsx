"use client";

import { useEffect, useMemo, useState } from "react";

type MonthlyMetric = {
  month: number;
  occupiedNights: number;
  capacityNights: number;
  bookings: number;
  charges: number;
};

type Snapshot = {
  year: number;
  label: string;
  importedAt: string;
  sourceFilename: string | null;
  monthly: MonthlyMetric[];
};

const MONTH_LABELS: Record<number, string> = {
  4: "Απρίλιος",
  5: "Μάιος",
  6: "Ιούνιος",
  7: "Ιούλιος",
  8: "Αύγουστος",
  9: "Σεπτέμβριος",
  10: "Οκτώβριος",
};

const euro = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const decimalEuro = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
const integer = new Intl.NumberFormat("el-GR");

function totals(snapshot?: Snapshot) {
  const monthly = snapshot?.monthly ?? [];
  const occupied = monthly.reduce((sum, item) => sum + item.occupiedNights, 0);
  const capacity = monthly.reduce((sum, item) => sum + item.capacityNights, 0);
  const bookings = monthly.reduce((sum, item) => sum + item.bookings, 0);
  const charges = monthly.reduce((sum, item) => sum + item.charges, 0);
  return {
    occupied,
    capacity,
    bookings,
    charges,
    occupancy: capacity ? occupied / capacity : 0,
    averageCharge: occupied ? charges / occupied : 0,
  };
}

function pct(value: number) {
  return `${(value * 100).toFixed(1).replace(".", ",")}%`;
}

function delta(value: number, suffix = "") {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1).replace(".", ",")}${suffix}`;
}

export default function StatisticsDashboard() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [year, setYear] = useState(2026);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/staff/statistics", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Αποτυχία φόρτωσης στατιστικών.");
      setSnapshots(payload.snapshots);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Αποτυχία φόρτωσης στατιστικών.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const current = useMemo(() => snapshots.find((item) => item.year === 2026), [snapshots]);
  const previous = useMemo(() => snapshots.find((item) => item.year === 2025), [snapshots]);
  const currentTotals = totals(current);
  const previousTotals = totals(previous);
  const occupancyDelta = (currentTotals.occupancy - previousTotals.occupancy) * 100;
  const chargeDelta = currentTotals.charges - previousTotals.charges;

  async function uploadReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("report") as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("year", String(year));
      const response = await fetch("/api/staff/statistics/import", { method: "POST", body });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Αποτυχία εισαγωγής report.");
      form.reset();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Αποτυχία εισαγωγής report.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f2e9] text-[#2f3226]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="rounded-[28px] border border-[#ded6c6] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <a href="/staff" className="text-sm font-semibold text-[#6f7754] hover:underline">← Staff Area</a>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-[#8b806b]">Voulamandis House</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Στατιστικά σεζόν</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6c665a] sm:text-base">
                Απλή σύγκριση 2026 με 2025 για την περίοδο 1 Απριλίου έως 31 Οκτωβρίου και 10 δωμάτια.
              </p>
            </div>

            <form onSubmit={uploadReport} className="rounded-2xl border border-[#ddd4c3] bg-[#fbf9f4] p-4 lg:min-w-[390px]">
              <p className="font-semibold">Καταχώρηση νέου report</p>
              <p className="mt-1 text-xs leading-5 text-[#746d60]">Το αρχείο αποθηκεύεται στη Neon ως νέο snapshot και το προηγούμενο παραμένει στο ιστορικό.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-[90px_1fr_auto]">
                <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded-xl border border-[#d7cebd] bg-white px-3 py-2 text-sm">
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                </select>
                <input name="report" type="file" accept=".xls,.xlsx" required className="min-w-0 rounded-xl border border-[#d7cebd] bg-white px-3 py-2 text-xs" />
                <button disabled={uploading} className="rounded-xl bg-[#6f7754] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                  {uploading ? "Αποθήκευση…" : "Αποθήκευση"}
                </button>
              </div>
            </form>
          </div>
        </header>

        {error ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}

        {loading ? (
          <div className="mt-6 rounded-3xl border border-[#ded6c6] bg-white p-10 text-center text-[#746d60]">Φόρτωση στατιστικών…</div>
        ) : (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {[
                ["Πληρότητα 2026", pct(currentTotals.occupancy), `${delta(occupancyDelta, " μον.")} vs 2025`],
                ["Κρατημένες νύχτες", integer.format(currentTotals.occupied), `${currentTotals.occupied - previousTotals.occupied >= 0 ? "+" : ""}${integer.format(currentTotals.occupied - previousTotals.occupied)} vs 2025`],
                ["Κρατήσεις", integer.format(currentTotals.bookings), `${currentTotals.bookings - previousTotals.bookings >= 0 ? "+" : ""}${integer.format(currentTotals.bookings - previousTotals.bookings)} vs 2025`],
                ["Σύνολο charges", euro.format(currentTotals.charges), `${chargeDelta >= 0 ? "+" : ""}${euro.format(chargeDelta)} vs 2025`],
                ["Charges / νύχτα", decimalEuro.format(currentTotals.averageCharge), `${decimalEuro.format(currentTotals.averageCharge - previousTotals.averageCharge)} vs 2025`],
              ].map(([label, value, note]) => (
                <article key={label} className="rounded-3xl border border-[#ded6c6] bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b806b]">{label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
                  <p className="mt-2 text-xs text-[#746d60]">{note}</p>
                </article>
              ))}
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
              <div className="rounded-3xl border border-[#ded6c6] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Πληρότητα ανά μήνα</h2>
                    <p className="mt-1 text-sm text-[#746d60]">2026 σε σύγκριση με το 2025</p>
                  </div>
                  <div className="flex gap-3 text-xs text-[#746d60]"><span>● 2025</span><span className="text-[#6f7754]">● 2026</span></div>
                </div>
                <div className="mt-6 space-y-5">
                  {(current?.monthly ?? []).map((item) => {
                    const old = previous?.monthly.find((row) => row.month === item.month);
                    const currentPct = item.capacityNights ? item.occupiedNights / item.capacityNights : 0;
                    const oldPct = old?.capacityNights ? old.occupiedNights / old.capacityNights : 0;
                    return (
                      <div key={item.month}>
                        <div className="mb-2 flex items-center justify-between text-sm"><span className="font-medium">{MONTH_LABELS[item.month]}</span><span>{pct(currentPct)} <span className="text-[#9a9182]">/ {pct(oldPct)}</span></span></div>
                        <div className="relative h-5 overflow-hidden rounded-full bg-[#ece6da]">
                          <div className="absolute inset-y-0 left-0 rounded-full bg-[#cfc6b5]" style={{ width: `${Math.min(100, oldPct * 100)}%` }} />
                          <div className="absolute inset-y-1 left-0 rounded-full bg-[#6f7754]" style={{ width: `${Math.min(100, currentPct * 100)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside className="rounded-3xl border border-[#ded6c6] bg-[#6f7754] p-6 text-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Εικόνα 2026</p>
                <h2 className="mt-3 text-2xl font-semibold">{occupancyDelta >= 0 ? "Μπροστά σε πληρότητα" : "Πίσω σε πληρότητα"}</h2>
                <p className="mt-4 text-sm leading-6 text-white/85">
                  Η πληρότητα είναι {Math.abs(occupancyDelta).toFixed(1).replace(".", ",")} ποσοστιαίες μονάδες {occupancyDelta >= 0 ? "υψηλότερη" : "χαμηλότερη"} από το 2025.
                  Οι συνολικές χρεώσεις είναι {euro.format(Math.abs(chargeDelta))} {chargeDelta >= 0 ? "υψηλότερες" : "χαμηλότερες"}.
                </p>
                <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm">
                  <p className="font-semibold">Τελευταίο αποθηκευμένο report</p>
                  <p className="mt-2 text-white/75">{current?.sourceFilename || "—"}</p>
                  <p className="mt-1 text-xs text-white/60">{current ? new Date(current.importedAt).toLocaleString("el-GR") : ""}</p>
                </div>
              </aside>
            </section>

            <section className="mt-6 overflow-hidden rounded-3xl border border-[#ded6c6] bg-white shadow-sm">
              <div className="border-b border-[#e5ded1] px-5 py-5 sm:px-6"><h2 className="text-xl font-semibold">Αναλυτική σύγκριση</h2></div>
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm">
                  <thead className="bg-[#f3efe7] text-left text-xs uppercase tracking-[0.1em] text-[#746d60]">
                    <tr><th className="px-5 py-4">Μήνας</th><th className="px-4 py-4">Πληρότητα 2025</th><th className="px-4 py-4">Πληρότητα 2026</th><th className="px-4 py-4">Νύχτες 2025</th><th className="px-4 py-4">Νύχτες 2026</th><th className="px-4 py-4">Charges 2025</th><th className="px-4 py-4">Charges 2026</th></tr>
                  </thead>
                  <tbody className="divide-y divide-[#ece6da]">
                    {(current?.monthly ?? []).map((item) => {
                      const old = previous?.monthly.find((row) => row.month === item.month);
                      return <tr key={item.month} className="hover:bg-[#fbf9f4]"><td className="px-5 py-4 font-semibold">{MONTH_LABELS[item.month]}</td><td className="px-4 py-4">{pct((old?.occupiedNights ?? 0) / (old?.capacityNights || 1))}</td><td className="px-4 py-4 font-semibold text-[#56603d]">{pct(item.occupiedNights / item.capacityNights)}</td><td className="px-4 py-4">{integer.format(old?.occupiedNights ?? 0)}</td><td className="px-4 py-4">{integer.format(item.occupiedNights)}</td><td className="px-4 py-4">{decimalEuro.format(old?.charges ?? 0)}</td><td className="px-4 py-4 font-semibold">{decimalEuro.format(item.charges)}</td></tr>;
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="mt-5 text-xs leading-5 text-[#746d60]">
              Τα charges περιλαμβάνουν όλες τις γραμμές του Beds24 report, όπως διαμονή, φόρους, extras και εκπτώσεις. Δεν εμφανίζονται ως καθαρός τζίρος.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

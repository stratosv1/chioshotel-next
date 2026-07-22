"use client";

import { useEffect, useMemo, useState } from "react";

type MonthlyMetric = { month: number; occupiedNights: number; capacityNights: number; bookings: number; charges: number };
type RoomMetric = { room: number; occupiedNights: number; capacityNights: number; bookings: number; charges: number };
type ChannelMetric = { channel: string; occupiedNights: number; bookings: number; charges: number };
type Snapshot = { year: number; label: string; importedAt: string; sourceFilename: string | null; monthly: MonthlyMetric[]; rooms: RoomMetric[]; channels: ChannelMetric[] };

const MONTH_LABELS: Record<number, string> = { 4: "Απρίλιος", 5: "Μάιος", 6: "Ιούνιος", 7: "Ιούλιος", 8: "Αύγουστος", 9: "Σεπτέμβριος", 10: "Οκτώβριος" };
const euro = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const integer = new Intl.NumberFormat("el-GR");

function totals(snapshot?: Snapshot) {
  const monthly = snapshot?.monthly ?? [];
  const occupied = monthly.reduce((sum, item) => sum + item.occupiedNights, 0);
  const capacity = monthly.reduce((sum, item) => sum + item.capacityNights, 0);
  const bookings = monthly.reduce((sum, item) => sum + item.bookings, 0);
  const charges = monthly.reduce((sum, item) => sum + item.charges, 0);
  return { occupied, capacity, bookings, charges, occupancy: capacity ? occupied / capacity : 0, averageCharge: occupied ? charges / occupied : 0 };
}

function pct(value: number) { return `${(value * 100).toFixed(1).replace(".", ",")}%`; }
function signed(value: number, suffix = "") { return `${value > 0 ? "+" : ""}${value.toFixed(1).replace(".", ",")}${suffix}`; }

function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div aria-label={label} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
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

  useEffect(() => { void load(); }, []);

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
      setYear(2026);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Αποτυχία εισαγωγής report.");
    } finally {
      setUploading(false);
    }
  }

  const kpis = [
    ["Πληρότητα", pct(currentTotals.occupancy), `${signed(occupancyDelta, " μον.")} από 2025`],
    ["Κρατημένες νύχτες", integer.format(currentTotals.occupied), `${currentTotals.occupied - previousTotals.occupied >= 0 ? "+" : ""}${integer.format(currentTotals.occupied - previousTotals.occupied)} από 2025`],
    ["Κρατήσεις", integer.format(currentTotals.bookings), `${currentTotals.bookings - previousTotals.bookings >= 0 ? "+" : ""}${integer.format(currentTotals.bookings - previousTotals.bookings)} από 2025`],
    ["Σύνολο charges", euro.format(currentTotals.charges), `${chargeDelta >= 0 ? "+" : ""}${euro.format(chargeDelta)} από 2025`],
  ];

  return (
    <main className="min-h-screen bg-[#f6f2e9] text-[#2f3226]">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6">
        <header className="border-b border-[#d8d0c1] pb-5">
          <a href="/staff" className="text-sm font-semibold text-[#66704d]">← Staff Area</a>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#8b806b]">Voulamandis House</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Στατιστικά σεζόν</h1>
              <p className="mt-2 text-sm text-[#746d60]">1 Απριλίου–31 Οκτωβρίου · 10 δωμάτια · 2026 έναντι 2025</p>
            </div>
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-[#66704d]">Swipe →</span>
          </div>
        </header>

        {error ? <p className="border-b border-red-200 py-4 text-sm text-red-700">{error}</p> : null}
        {loading ? <p className="py-10 text-center text-sm text-[#746d60]">Φόρτωση στατιστικών…</p> : (
          <>
            <section className="border-b border-[#d8d0c1] py-5">
              <Carousel label="Βασικά στατιστικά">
                {kpis.map(([label, value, note]) => (
                  <article key={label} className="min-w-[72%] snap-start border-l-4 border-[#7b855d] bg-white/55 px-4 py-4 sm:min-w-[260px]">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8b806b]">{label}</p>
                    <p className="mt-2 text-3xl font-semibold">{value}</p>
                    <p className="mt-1 text-xs text-[#746d60]">{note}</p>
                  </article>
                ))}
              </Carousel>
            </section>

            <section className="border-b border-[#d8d0c1] py-5">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div><h2 className="text-xl font-semibold">Πληρότητα ανά μήνα</h2><p className="mt-1 text-sm text-[#746d60]">Μία κάρτα ανά μήνα</p></div>
                <span className="text-xs text-[#8b806b]">2026 / 2025</span>
              </div>
              <Carousel label="Πληρότητα ανά μήνα">
                {(current?.monthly ?? []).map((item) => {
                  const old = previous?.monthly.find((row) => row.month === item.month);
                  const nowPct = item.capacityNights ? item.occupiedNights / item.capacityNights : 0;
                  const oldPct = old?.capacityNights ? old.occupiedNights / old.capacityNights : 0;
                  return (
                    <article key={item.month} className="min-w-[78%] snap-start bg-white/50 px-4 py-4 sm:min-w-[280px]">
                      <div className="flex items-baseline justify-between"><h3 className="font-semibold">{MONTH_LABELS[item.month]}</h3><span className="text-2xl font-semibold">{pct(nowPct)}</span></div>
                      <p className="mt-1 text-xs text-[#746d60]">2025: {pct(oldPct)} · {item.occupiedNights} νύχτες</p>
                      <div className="mt-4 h-2 bg-[#e5dece]"><div className="h-2 bg-[#748057]" style={{ width: `${Math.min(100, nowPct * 100)}%` }} /></div>
                    </article>
                  );
                })}
              </Carousel>
            </section>

            <section className="border-b border-[#d8d0c1] py-5">
              <div className="mb-4"><h2 className="text-xl font-semibold">Πληρότητα ανά δωμάτιο</h2><p className="mt-1 text-sm text-[#746d60]">Swipe στα δωμάτια 1–10</p></div>
              <Carousel label="Πληρότητα ανά δωμάτιο">
                {(current?.rooms ?? []).map((room) => {
                  const old = previous?.rooms?.find((item) => item.room === room.room);
                  const occupancy = room.capacityNights ? room.occupiedNights / room.capacityNights : 0;
                  const oldOccupancy = old?.capacityNights ? old.occupiedNights / old.capacityNights : 0;
                  return (
                    <article key={room.room} className="min-w-[62%] snap-start border-t-2 border-[#7b855d] bg-white/45 px-4 py-4 sm:min-w-[220px]">
                      <p className="text-xs uppercase tracking-wider text-[#8b806b]">Δωμάτιο {room.room}</p>
                      <p className="mt-2 text-3xl font-semibold">{pct(occupancy)}</p>
                      <p className="mt-1 text-xs text-[#746d60]">2025: {pct(oldOccupancy)}</p>
                      <p className="mt-3 text-sm">{room.occupiedNights} / {room.capacityNights} νύχτες</p>
                    </article>
                  );
                })}
              </Carousel>
            </section>

            <section className="border-b border-[#d8d0c1] py-5">
              <div className="mb-4"><h2 className="text-xl font-semibold">Έσοδα ανά δωμάτιο</h2><p className="mt-1 text-sm text-[#746d60]">Σύνολο charges του report</p></div>
              <Carousel label="Έσοδα ανά δωμάτιο">
                {[...(current?.rooms ?? [])].sort((a, b) => b.charges - a.charges).map((room) => {
                  const old = previous?.rooms?.find((item) => item.room === room.room);
                  const difference = room.charges - (old?.charges ?? 0);
                  return (
                    <article key={room.room} className="min-w-[68%] snap-start bg-[#707a54] px-4 py-4 text-white sm:min-w-[240px]">
                      <p className="text-xs uppercase tracking-wider text-white/70">Δωμάτιο {room.room}</p>
                      <p className="mt-2 text-3xl font-semibold">{euro.format(room.charges)}</p>
                      <p className="mt-1 text-xs text-white/75">{difference >= 0 ? "+" : ""}{euro.format(difference)} από 2025</p>
                      <p className="mt-3 text-sm text-white/85">{room.bookings} κρατήσεις</p>
                    </article>
                  );
                })}
              </Carousel>
            </section>

            <section className="border-b border-[#d8d0c1] py-5">
              <div className="mb-4"><h2 className="text-xl font-semibold">Booking channels</h2><p className="mt-1 text-sm text-[#746d60]">Κρατήσεις, νύχτες και charges ανά κανάλι</p></div>
              <Carousel label="Booking channels">
                {(current?.channels ?? []).map((channel) => {
                  const totalCharges = currentTotals.charges || 1;
                  return (
                    <article key={channel.channel} className="min-w-[76%] snap-start border-l border-[#b9b09f] px-4 py-3 sm:min-w-[270px]">
                      <p className="font-semibold">{channel.channel}</p>
                      <p className="mt-2 text-2xl font-semibold">{euro.format(channel.charges)}</p>
                      <p className="mt-1 text-xs text-[#746d60]">{channel.bookings} κρατήσεις · {channel.occupiedNights} νύχτες</p>
                      <p className="mt-3 text-sm font-semibold text-[#66704d]">{pct(channel.charges / totalCharges)} των charges</p>
                    </article>
                  );
                })}
              </Carousel>
            </section>

            <section className="py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Νέο report</h2>
                  <p className="mt-1 text-sm text-[#746d60]">Αποθηκεύεται στη Neon και το προηγούμενο μένει στο ιστορικό.</p>
                  <p className="mt-2 text-xs text-[#8b806b]">Τελευταίο: {current?.sourceFilename || "—"} · {current ? new Date(current.importedAt).toLocaleString("el-GR") : ""}</p>
                </div>
                <form onSubmit={uploadReport} className="grid gap-2 sm:grid-cols-[90px_1fr_auto]">
                  <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border border-[#cfc5b4] bg-transparent px-3 py-2 text-sm">
                    <option value={2026}>2026</option><option value={2025}>2025</option>
                  </select>
                  <input name="report" type="file" accept=".xls,.xlsx" required className="min-w-0 border border-[#cfc5b4] bg-transparent px-3 py-2 text-xs" />
                  <button disabled={uploading} className="bg-[#707a54] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">{uploading ? "Αποθήκευση…" : "Αποθήκευση"}</button>
                </form>
              </div>
            </section>

            <p className="border-t border-[#d8d0c1] pt-4 text-xs leading-5 text-[#746d60]">Τα charges περιλαμβάνουν διαμονή, φόρους, extras και εκπτώσεις. Δεν εμφανίζονται ως καθαρός τζίρος. Το 2026 είναι τρέχον snapshot και όχι ολοκληρωμένη σεζόν.</p>
          </>
        )}
      </div>
    </main>
  );
}

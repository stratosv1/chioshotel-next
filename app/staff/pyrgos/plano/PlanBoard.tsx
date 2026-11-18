"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PlanBooking, PlanCell } from "@/lib/pyrgos/plan";
import { PYRGOS_ROOMS, isCategoryChange, roomByNumber } from "@/lib/pyrgos/rooms";

// ---------- helpers ----------

const athensToday = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Athens" }).format(new Date());
const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T12:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const diffDays = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000);
const WD = ["Κυρ", "Δευ", "Τρί", "Τετ", "Πέμ", "Παρ", "Σάβ"];
const wd = (iso: string) => WD[new Date(`${iso}T12:00:00Z`).getUTCDay()];
const dm = (iso: string) => `${Number(iso.slice(8, 10))}/${Number(iso.slice(5, 7))}`;
const euro = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);
const roomLabel = (n: number | null) => roomByNumber(n)?.label ?? "χωρίς δωμάτιο";
const OTA = new Set(["Booking", "Expedia"]);

const CHANNEL: Record<string, { bar: string; chip: string; label: string }> = {
  Booking: { bar: "bg-[#d6eefc] text-[#0c4a6e] border-[#a9dbf7]", chip: "bg-[#a9dbf7] text-[#0c4a6e]", label: "Booking" },
  Expedia: { bar: "bg-[#ffe7bd] text-[#5a3a00] border-[#ffd48a]", chip: "bg-[#ffd48a] text-[#5a3a00]", label: "Expedia" },
  Airbnb: { bar: "bg-[#fde2e4] text-[#7a2330] border-[#f8c4ca]", chip: "bg-[#f8c4ca] text-[#7a2330]", label: "Airbnb" },
  Alexandria: { bar: "bg-[#e9e4fe] text-[#3b2f8a] border-[#c9bffb]", chip: "bg-[#c9bffb] text-[#3b2f8a]", label: "Alexandria" },
  Απευθείας: { bar: "bg-[#d2f3f6] text-[#0b4d55] border-[#9fe3ea]", chip: "bg-[#9fe3ea] text-[#0b4d55]", label: "Απευθείας" },
};
const BLOCK = { bar: "bg-[#eceae7] text-[#57534e] border-[#d6d3d1]", chip: "bg-[#d6d3d1] text-[#44403c]", label: "Μπλοκ" };
const channelStyle = (b: PlanBooking) => (b.status === "black" ? BLOCK : CHANNEL[b.channel] ?? CHANNEL["Απευθείας"]);

const BED_OPTIONS = [
  { value: "double", label: "Διπλό" },
  { value: "twin", label: "2 μονά χωριστά" },
  { value: "double_single", label: "Διπλό + 1 μονό" },
  { value: "double_two_singles", label: "Διπλό + 2 μονά" },
];

const RANGES = [
  { days: 7, label: "1 εβδ.", width: 120 },
  { days: 14, label: "2 εβδ.", width: 72 },
  { days: 28, label: "4 εβδ.", width: 44 },
];
const ROOM_COL = 150;
const ROW_H = 66;

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, { cache: "no-store", ...init });
  const json = await res.json().catch(() => ({ ok: false, error: "Σφάλμα σύνδεσης." }));
  return json as any;
}
const post = (body: Record<string, unknown>) =>
  api("/api/staff/pyrgos/booking/", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

function people(b: Pick<PlanBooking, "adults" | "children">) {
  if (b.adults === null) return "άτομα;";
  return b.children ? `${b.adults}+${b.children}` : `${b.adults}`;
}

// ---------- confirm dialog ----------

type ConfirmState = {
  title: string;
  lines: string[];
  warning?: string;
  requireCheck?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => Promise<void> | void;
} | null;

function ConfirmDialog({ state, onClose }: { state: ConfirmState; onClose: () => void }) {
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => setChecked(false), [state]);
  if (!state) return null;
  const blocked = Boolean(state.requireCheck) && !checked;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1f2a3c]/40 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 id="confirm-title" className="text-lg font-black">{state.title}</h2>
        <ul className="mt-2 space-y-1 text-sm text-[#3d4b5e]">
          {state.lines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        {state.warning && (
          <div className="mt-3 rounded-xl border-2 border-[#f87171] bg-[#fef2f2] p-3 text-sm font-semibold text-[#991b1b]">⚠️ {state.warning}</div>
        )}
        {state.requireCheck && (
          <label className="mt-3 flex min-h-11 items-center gap-2 text-sm font-bold text-[#991b1b]">
            <input type="checkbox" className="h-5 w-5" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            {state.requireCheck}
          </label>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={busy} className="min-h-11 rounded-full px-4 text-sm font-bold text-[#4b5b70]">Άκυρο</button>
          <button
            type="button"
            disabled={blocked || busy}
            onClick={async () => {
              setBusy(true);
              try {
                await state.onConfirm();
              } finally {
                setBusy(false);
                onClose();
              }
            }}
            className={`min-h-11 rounded-full px-5 text-sm font-bold disabled:opacity-50 ${state.danger ? "bg-[#fee2e2] text-[#991b1b]" : "bg-[#e9e4fe] text-[#3b2f8a]"}`}
          >
            {busy ? "Περιμένε…" : state.confirmLabel ?? "Επιβεβαίωση"}
          </button>
        </div>
      </div>
    </div>
  );
}

function categoryWarning(booking: Pick<PlanBooking, "channel" | "room">, to: number) {
  const from = roomByNumber(booking.room);
  const target = roomByNumber(to);
  if (!from || !target || !isCategoryChange(booking.room, to)) return undefined;
  const base = `Αλλάζεις ΚΑΤΗΓΟΡΙΑ δωματίου: ${from.categoryLabel} → ${target.categoryLabel}.`;
  return OTA.has(booking.channel)
    ? `${base} Η κράτηση είναι από ${booking.channel}: το κανάλι θα έχει διαφορετικό τύπο δωματίου από αυτόν που πούλησε.`
    : base;
}

// ---------- main board ----------

export default function PlanBoard() {
  const [start, setStart] = useState(() => addDays(athensToday(), -1));
  const [rangeIndex, setRangeIndex] = useState(1);
  const range = RANGES[rangeIndex];
  const end = addDays(start, range.days);
  const days = useMemo(() => Array.from({ length: range.days }, (_, i) => addDays(start, i)), [start, range.days]);
  const W = range.width;

  const [bookings, setBookings] = useState<PlanBooking[]>([]);
  const [cells, setCells] = useState<PlanCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [newBooking, setNewBooking] = useState<{ room: number; checkin: string } | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragged = useRef<PlanBooking | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const json = await api(`/api/staff/pyrgos/plan/?from=${start}&to=${end}`);
    if (json.ok) {
      setBookings(json.bookings);
      setCells(json.cells);
    } else setError(json.error || "Δεν φόρτωσε το πλάνο.");
    setLoading(false);
  }, [start, end]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.undo ? 12000 : 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const cellMap = useMemo(() => new Map(cells.map((c) => [`${c.room}:${c.day}`, c])), [cells]);
  const byRoom = useMemo(() => {
    const map = new Map<number, PlanBooking[]>();
    for (const b of bookings) if (b.room) map.set(b.room, [...(map.get(b.room) ?? []), b]);
    return map;
  }, [bookings]);
  const unassigned = bookings.filter((b) => !b.room && b.status !== "black");

  const occupied = useCallback(
    (room: number, day: string) => (byRoom.get(room) ?? []).some((b) => b.checkin <= day && b.checkout > day),
    [byRoom],
  );

  // 1–2 night gaps: free nights (not booked, not closed) with something on both sides.
  const gaps = useMemo(() => {
    const set = new Set<string>();
    for (const room of PYRGOS_ROOMS) {
      const blocked = (day: string) => occupied(room.number, day) || Boolean(cellMap.get(`${room.number}:${day}`)?.closed);
      let i = 0;
      while (i < days.length) {
        if (blocked(days[i])) {
          i++;
          continue;
        }
        let j = i;
        while (j < days.length && !blocked(days[j])) j++;
        const len = j - i;
        const before = blocked(addDays(days[i], -1));
        const after = j < days.length ? blocked(days[j]) : false;
        if (len <= 2 && before && after) for (let k = i; k < j; k++) set.add(`${room.number}:${days[k]}`);
        i = j;
      }
    }
    return set;
  }, [days, occupied, cellMap]);

  function moveRoom(b: PlanBooking, to: number, isUndo = false) {
    if (to === b.room) return;
    const warning = categoryWarning(b, to);
    setConfirm({
      title: isUndo ? "Αναίρεση μετακίνησης" : "Μετακίνηση κράτησης",
      lines: [`${b.firstName} ${b.lastName}`.trim() || "Χωρίς όνομα", `${roomLabel(b.room)} → ${roomLabel(to)}`, `${dm(b.checkin)} – ${dm(b.checkout)} · ${b.nights} νύχτες`],
      warning,
      requireCheck: warning ? "Ναι, θέλω αλλαγή κατηγορίας" : undefined,
      confirmLabel: "Μετακίνηση",
      onConfirm: async () => {
        const json = await post({ action: "update", id: b.id, room: to, confirmCategory: Boolean(warning) });
        if (!json.ok) {
          setToast({ text: json.error || "Η μετακίνηση απέτυχε." });
          return;
        }
        await load();
        const moved = { ...b, room: to };
        setToast(
          isUndo
            ? { text: "Η μετακίνηση αναιρέθηκε" }
            : { text: `Μετακινήθηκε στο ${roomLabel(to)} · Beds24 ✓`, undo: () => moveRoom(moved, b.room as number, true) },
        );
      },
    });
  }

  const today = athensToday();
  const gridWidth = ROOM_COL + days.length * W;

  return (
    <div className="min-h-screen bg-[#eef3f7] text-[#1f2a3c]">
      <div className="flex flex-wrap">
        <nav aria-label="Μενού πύργου ελέγχου" className="flex w-full flex-wrap gap-1 border-b border-[#e3e9f0] bg-white p-3 xl:min-h-screen xl:w-52 xl:flex-col xl:flex-nowrap xl:border-b-0 xl:border-r xl:p-4">
          <div className="hidden px-3 pb-4 xl:block">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5443c9]">Voulamandis House</div>
            <div className="text-lg font-black">Πύργος ελέγχου</div>
          </div>
          <a href="/staff/pyrgos" className="rounded-xl px-3 py-2.5 text-sm text-[#4b5b70] hover:bg-[#f4f7fa]">Σήμερα</a>
          <a href="/staff/pyrgos/plano" aria-current="page" className="rounded-xl bg-[#e9e4fe] px-3 py-2.5 text-sm font-bold text-[#3b2f8a]">Πλάνο</a>
          <a href="/staff/crm" className="rounded-xl px-3 py-2.5 text-sm text-[#4b5b70] hover:bg-[#f4f7fa]">Πελάτες (CRM)</a>
          <a href="/staff/pyrgos#katharismos" className="rounded-xl px-3 py-2.5 text-sm text-[#4b5b70] hover:bg-[#f4f7fa]">Καθαριότητα</a>
          <a href="/staff/statistics" className="rounded-xl px-3 py-2.5 text-sm text-[#4b5b70] hover:bg-[#f4f7fa]">Στατιστικά</a>
          <a href="/staff/expenses" className="rounded-xl px-3 py-2.5 text-sm text-[#4b5b70] hover:bg-[#f4f7fa]">Έξοδα</a>
          <a href="/staff" className="rounded-xl px-3 py-2.5 text-sm text-[#4b5b70] hover:bg-[#f4f7fa] xl:mt-auto">← Παλιό staff</a>
        </nav>

        <main className="min-w-0 flex-1 space-y-4 p-4 lg:p-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="mr-2 text-2xl font-black tracking-tight">Πλάνο κρατήσεων</h1>
              <button type="button" aria-label="Πίσω" onClick={() => setStart(addDays(start, -range.days))} className="h-10 w-10 rounded-full border border-[#dbe3ec] bg-white">‹</button>
              <button type="button" onClick={() => setStart(addDays(today, -1))} className="h-10 rounded-full border border-[#dbe3ec] bg-white px-4 text-sm font-bold">Σήμερα</button>
              <button type="button" aria-label="Μπροστά" onClick={() => setStart(addDays(start, range.days))} className="h-10 w-10 rounded-full border border-[#dbe3ec] bg-white">›</button>
              <input type="date" aria-label="Από ημερομηνία" value={start} onChange={(e) => e.target.value && setStart(e.target.value)} className="h-10 rounded-full border border-[#dbe3ec] bg-white px-3 text-sm" />
              <span className="inline-flex overflow-hidden rounded-full border border-[#dbe3ec] bg-white" role="group" aria-label="Εύρος">
                {RANGES.map((r, i) => (
                  <button key={r.days} type="button" aria-pressed={i === rangeIndex} onClick={() => setRangeIndex(i)} className={`h-10 px-3 text-sm font-bold ${i === rangeIndex ? "bg-[#e9e4fe] text-[#3b2f8a]" : ""}`}>
                    {r.label}
                  </button>
                ))}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SearchBox
                onPick={(b) => {
                  setStart(addDays(b.checkin, -1));
                  setOpenId(b.id);
                }}
              />
              <button type="button" onClick={() => setNewBooking({ room: 0, checkin: today })} className="h-10 rounded-full bg-[#e9e4fe] px-4 text-sm font-bold text-[#3b2f8a]">+ Νέα κράτηση</button>
            </div>
          </header>

          <div className="flex flex-wrap gap-3 text-xs font-semibold text-[#3d4b5e]">
            {Object.values(CHANNEL).map((c) => (
              <span key={c.label} className="flex items-center gap-1.5"><span className={`h-3 w-3 rounded ${c.chip}`} />{c.label}</span>
            ))}
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_3px,#f3f4f6_3px,#f3f4f6_6px)]" />Κλειστό</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-dashed border-[#f59e0b] bg-[#fffbeb]" />Κενό 1–2 νυχτών</span>
            <span className="text-[#5b6b80]">Σύρε μια κράτηση σε άλλη γραμμή για μετακίνηση · πάτα κενό κελί για νέα κράτηση</span>
          </div>

          {error && <p className="rounded-xl bg-[#fff4dc] px-4 py-3 text-sm font-semibold text-[#92400e]">{error}</p>}

          <section aria-label="Πλάνο" className="overflow-x-auto rounded-2xl border border-[#e3e9f0] bg-white">
            <div style={{ width: gridWidth }} className={loading ? "opacity-60" : ""}>
              <div className="sticky top-0 z-20 flex border-b border-[#e3e9f0] bg-white">
                <div style={{ width: ROOM_COL }} className="sticky left-0 z-30 flex items-end bg-white px-3 pb-2 text-xs font-bold text-[#5b6b80]">Δωμάτιο</div>
                {days.map((d) => (
                  <div key={d} style={{ width: W }} className={`border-l border-[#eef2f6] py-1.5 text-center ${d === today ? "bg-[#ece9fd]" : ""} ${["Σάβ", "Κυρ"].includes(wd(d)) ? "text-[#5443c9]" : ""}`}>
                    <div className="text-[10px] font-bold uppercase text-[#5b6b80]">{wd(d)}</div>
                    <div className="text-sm font-black">{range.days === 28 ? Number(d.slice(8, 10)) : dm(d)}</div>
                  </div>
                ))}
              </div>

              {PYRGOS_ROOMS.map((room) => {
                const economy = room.category === "economy";
                return (
                  <div
                    key={room.number}
                    style={{ height: ROW_H }}
                    className={`relative flex border-b border-[#eef2f6] ${economy ? "bg-[#eef7fd]" : ""} ${dragOver === room.number ? "outline outline-2 -outline-offset-2 outline-[#8b7cf0]" : ""}`}
                    onDragOver={(e) => {
                      if (!dragged.current) return;
                      e.preventDefault();
                      setDragOver(room.number);
                    }}
                    onDragLeave={() => setDragOver((v) => (v === room.number ? null : v))}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(null);
                      const b = dragged.current;
                      dragged.current = null;
                      if (b) moveRoom(b, room.number);
                    }}
                  >
                    <div style={{ width: ROOM_COL }} className={`sticky left-0 z-10 flex flex-col justify-center border-r border-[#e3e9f0] px-3 ${economy ? "bg-[#dff0fb]" : "bg-white"}`}>
                      <span className="text-sm font-black leading-tight">{room.label}</span>
                      <span className={`text-[11px] ${economy ? "font-bold uppercase tracking-wide text-[#0c4a6e]" : "text-[#5b6b80]"}`}>{room.categoryLabel}</span>
                    </div>
                    {days.map((d) => {
                      const cell = cellMap.get(`${room.number}:${d}`);
                      const busy = occupied(room.number, d);
                      const gap = gaps.has(`${room.number}:${d}`);
                      return (
                        <button
                          key={d}
                          type="button"
                          style={{ width: W }}
                          disabled={busy || cell?.closed}
                          onClick={() => setNewBooking({ room: room.number, checkin: d })}
                          aria-label={`${room.label} ${dm(d)}${cell?.closed ? " κλειστό" : ""}`}
                          className={`flex items-end justify-center border-l border-[#eef2f6] pb-1 text-[10px] text-[#8a97a8] ${
                            cell?.closed ? "bg-[repeating-linear-gradient(45deg,#eceef1,#eceef1_4px,#f6f7f9_4px,#f6f7f9_8px)]" : gap ? "bg-[#fffbeb] outline outline-2 -outline-offset-4 outline-dashed outline-[#f59e0b]" : d === today ? "bg-[#f6f4fe]" : ""
                          } ${!busy && !cell?.closed ? "hover:bg-[#ece9fd]" : ""}`}
                        >
                          {!busy && !cell?.closed && cell?.price && range.days <= 14 ? `€${Math.round(cell.price)}` : ""}
                        </button>
                      );
                    })}
                    {(byRoom.get(room.number) ?? []).map((b) => {
                      const startIdx = diffDays(start, b.checkin);
                      const endIdx = diffDays(start, b.checkout);
                      const left = startIdx < 0 ? 0 : startIdx + 0.5;
                      const right = endIdx >= days.length ? days.length : endIdx + 0.5;
                      const width = Math.max((right - left) * W - 4, 18);
                      const style = channelStyle(b);
                      return (
                        <button
                          key={b.id}
                          type="button"
                          draggable={b.status !== "black"}
                          onDragStart={(e) => {
                            dragged.current = b;
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          onDragEnd={() => {
                            dragged.current = null;
                            setDragOver(null);
                          }}
                          onClick={() => b.status !== "black" && setOpenId(b.id)}
                          title={`${b.firstName} ${b.lastName} · ${dm(b.checkin)}–${dm(b.checkout)} · ${b.channel}${b.notes ? ` · 📝 ${b.notes}` : ""}`}
                          style={{ left: ROOM_COL + left * W + 2, width, top: 6, height: ROW_H - 12 }}
                          className={`absolute z-[5] flex flex-col justify-center overflow-hidden rounded-lg border px-2 text-left shadow-sm hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5443c9] ${style.bar} ${openId === b.id ? "ring-2 ring-[#1f2a3c]" : ""}`}
                        >
                          <span className="flex items-center gap-1 truncate text-xs font-black leading-tight">
                            {b.masterId ? <span aria-label="μέρος group">🔗</span> : null}
                            {b.notes ? <span aria-label="έχει σημείωση">📝</span> : null}
                            <span className="truncate">{b.status === "black" ? "Μπλοκ" : `${b.firstName} ${b.lastName}`.trim() || "Χωρίς όνομα"}</span>
                          </span>
                          {b.status !== "black" && (
                            <span className="truncate text-[10px] font-semibold opacity-90">
                              {people(b)} άτ.{b.beds ? ` · ${b.beds}` : ""} · {style.label}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </section>

          {unassigned.length > 0 && (
            <section className="rounded-2xl border border-[#fde3a7] bg-[#fff8e8] p-4 text-sm">
              <strong>Κρατήσεις χωρίς δωμάτιο ({unassigned.length}):</strong>{" "}
              {unassigned.map((b) => (
                <button key={b.id} type="button" onClick={() => setOpenId(b.id)} className="mr-2 underline">
                  {b.firstName} {b.lastName} ({dm(b.checkin)})
                </button>
              ))}
            </section>
          )}
        </main>
      </div>

      {openId && (
        <BookingPanel
          id={openId}
          onClose={() => setOpenId(null)}
          onChanged={(text) => {
            setToast({ text });
            load();
          }}
          onMove={(b, to) => moveRoom(b, to)}
          setConfirm={setConfirm}
        />
      )}

      {newBooking && (
        <NewBookingDialog
          initial={newBooking}
          onClose={() => setNewBooking(null)}
          setConfirm={setConfirm}
          onCreated={(text) => {
            setNewBooking(null);
            setToast({ text });
            load();
          }}
        />
      )}

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />

      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#1f2a3c] px-5 py-2.5 text-sm font-bold text-white shadow-lg">
          {toast.text}
          {toast.undo && (
            <button
              type="button"
              onClick={() => {
                const undo = toast.undo;
                setToast(null);
                undo?.();
              }}
              className="rounded-full bg-white/20 px-3 py-1"
            >
              Αναίρεση
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- search ----------

function SearchBox({ onPick }: { onPick: (b: PlanBooking) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<PlanBooking[]>([]);
  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const json = await api(`/api/staff/pyrgos/plan/?q=${encodeURIComponent(q)}`);
      if (json.ok) setResults(json.results);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);
  return (
    <div className="relative">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Αναζήτηση πελάτη, τηλ., αρ. κράτησης"
        aria-label="Αναζήτηση πελάτη"
        className="h-10 w-72 rounded-full border border-[#dbe3ec] bg-white px-4 text-sm"
      />
      {results.length > 0 && (
        <ul className="absolute right-0 z-50 mt-1 max-h-80 w-96 overflow-y-auto rounded-xl border border-[#e3e9f0] bg-white shadow-lg">
          {results.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => {
                  onPick(b);
                  setQ("");
                  setResults([]);
                }}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#f4f7fa]"
              >
                <strong>{b.firstName} {b.lastName}</strong> · {roomLabel(b.room)}
                <br />
                <span className="text-xs text-[#5b6b80]">{dm(b.checkin)}/{b.checkin.slice(0, 4)} – {dm(b.checkout)} · {b.channel} · #{b.id}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------- price fields (night ↔ total) ----------

function PriceFields({
  nights,
  mode,
  night,
  total,
  onChange,
  disabled,
}: {
  nights: number;
  mode: "night" | "total" | null;
  night: string;
  total: string;
  onChange: (v: { mode: "night" | "total"; night: string; total: string }) => void;
  disabled?: boolean;
}) {
  const fmt = (n: number) => String(Math.round(n * 100) / 100);
  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="text-xs font-bold">
        Τιμή / βραδιά {mode === "night" ? "•" : ""}
        <input
          inputMode="decimal"
          disabled={disabled}
          value={night}
          onChange={(e) => {
            const v = e.target.value.replace(",", ".");
            const n = Number(v);
            onChange({ mode: "night", night: v, total: v && Number.isFinite(n) && nights > 0 ? fmt(n * nights) : "" });
          }}
          className="mt-1 w-full rounded-lg border border-[#cfd9e4] px-3 py-2.5 text-base font-normal disabled:bg-[#f4f7fa]"
        />
      </label>
      <label className="text-xs font-bold">
        Σύνολο διαμονής {mode === "total" ? "•" : ""}
        <input
          inputMode="decimal"
          disabled={disabled}
          value={total}
          onChange={(e) => {
            const v = e.target.value.replace(",", ".");
            const n = Number(v);
            onChange({ mode: "total", total: v, night: v && Number.isFinite(n) && nights > 0 ? fmt(n / nights) : "" });
          }}
          className="mt-1 w-full rounded-lg border border-[#cfd9e4] px-3 py-2.5 text-base font-normal disabled:bg-[#f4f7fa]"
        />
      </label>
      <p className="col-span-2 text-[11px] text-[#5b6b80]">
        {nights} νύχτες · όποιο γράψεις τελευταίο κρατιέται {mode === "total" ? "(σύνολο για όλη τη διαμονή)" : mode === "night" ? "(τιμή ανά βραδιά)" : ""}
      </p>
    </div>
  );
}

const input = "mt-1 w-full rounded-lg border border-[#cfd9e4] px-3 py-2.5 text-base font-normal disabled:bg-[#f4f7fa]";

// ---------- booking panel ----------

function BookingPanel({
  id,
  onClose,
  onChanged,
  onMove,
  setConfirm,
}: {
  id: string;
  onClose: () => void;
  onChanged: (text: string) => void;
  onMove: (b: PlanBooking, to: number) => void;
  setConfirm: (c: ConfirmState) => void;
}) {
  const [data, setData] = useState<{ booking: PlanBooking; history: any[]; group: { id: string; room: number }[] } | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<any>(null);

  const reload = useCallback(async () => {
    const json = await api(`/api/staff/pyrgos/plan/?id=${encodeURIComponent(id)}`);
    if (!json.ok) {
      setError(json.error || "Δεν φόρτωσε η κράτηση.");
      return;
    }
    setData(json);
    const b: PlanBooking = json.booking;
    setForm({
      room: b.room ?? 0,
      checkin: b.checkin,
      checkout: b.checkout,
      adults: b.adults ?? 2,
      children: b.children ?? 0,
      firstName: b.firstName,
      lastName: b.lastName,
      email: b.email,
      phone: b.phone,
      priceMode: b.priceMode,
      night: b.nightPrice !== null ? String(b.nightPrice) : "",
      total: b.totalPrice !== null ? String(b.totalPrice) : b.beds24Price !== null ? String(b.beds24Price) : "",
      deposit: b.deposit !== null ? String(b.deposit) : "",
      paid: b.paid,
      bedSetup: b.bedSetup ?? "",
      cot: b.cot,
      rollaway: b.rollaway,
      bedOther: b.bedOther,
      note: "",
    });
  }, [id]);

  useEffect(() => {
    setData(null);
    reload();
  }, [reload]);

  if (!data || !form) {
    return (
      <aside className="fixed inset-y-0 right-0 z-[60] w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl">
        <button type="button" onClick={onClose} className="float-right text-2xl" aria-label="Κλείσιμο">×</button>
        <p className="text-sm text-[#5b6b80]">{error || "Φόρτωση…"}</p>
      </aside>
    );
  }

  const b = data.booking;
  const ota = OTA.has(b.channel);
  const nights = diffDays(form.checkin, form.checkout);
  const totalNum = Number(form.total) || 0;
  const depositNum = Number(form.deposit) || 0;
  const balance = form.total ? Math.round((totalNum - depositNum) * 100) / 100 : null;
  const style = channelStyle(b);
  const digits = (b.phone || "").replace(/\D/g, "");
  const set = (patch: Record<string, unknown>) => setForm({ ...form, ...patch });

  async function run(body: Record<string, unknown>, okText: string) {
    const json = await post(body);
    if (!json.ok) {
      if (json.code === "category") return;
      setError(json.error || "Η αλλαγή απέτυχε.");
      return;
    }
    setError("");
    onChanged(okText);
    await reload();
  }

  function saveStay() {
    const changes: string[] = [];
    if (Number(form.room) !== b.room) changes.push(`Δωμάτιο: ${roomLabel(b.room)} → ${roomLabel(Number(form.room))}`);
    if (form.checkin !== b.checkin || form.checkout !== b.checkout) changes.push(`Ημερομηνίες: ${dm(b.checkin)}–${dm(b.checkout)} → ${dm(form.checkin)}–${dm(form.checkout)}`);
    if (Number(form.adults) !== b.adults || Number(form.children) !== (b.children ?? 0)) changes.push(`Άτομα: ${people(b)} → ${form.children ? `${form.adults}+${form.children}` : form.adults}`);
    if (form.firstName !== b.firstName || form.lastName !== b.lastName) changes.push(`Όνομα: ${form.firstName} ${form.lastName}`);
    if (form.email !== b.email) changes.push(`Email: ${form.email || "—"}`);
    if (form.phone !== b.phone) changes.push(`Τηλέφωνο: ${form.phone || "—"}`);
    if (!changes.length) {
      setError("Δεν άλλαξε τίποτα.");
      return;
    }
    const warning = Number(form.room) !== b.room ? categoryWarning(b, Number(form.room)) : undefined;
    setConfirm({
      title: "Αποθήκευση αλλαγών",
      lines: [...changes, "Θα γραφτεί και στο Beds24."],
      warning,
      requireCheck: warning ? "Ναι, θέλω αλλαγή κατηγορίας" : undefined,
      onConfirm: () =>
        run(
          {
            action: "update",
            id: b.id,
            room: Number(form.room),
            checkin: form.checkin,
            checkout: form.checkout,
            adults: Number(form.adults),
            children: Number(form.children),
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            confirmCategory: Boolean(warning),
          },
          "Αποθηκεύτηκε · Beds24 ✓",
        ),
    });
  }

  function saveMoneyClick() {
    setConfirm({
      title: "Αποθήκευση πληρωμής",
      lines: [
        `Σύνολο: ${form.total ? euro(Number(form.total)) : "—"}${form.night ? ` (${euro(Number(form.night))}/βραδιά)` : ""}`,
        `Προκαταβολή: ${form.deposit ? euro(Number(form.deposit)) : "—"}`,
        form.paid ? "Πληρωμένη ✓" : `Υπόλοιπο: ${euro(balance)}`,
      ],
      onConfirm: () =>
        run(
          { action: "money", id: b.id, priceMode: form.priceMode, nightPrice: form.night, totalPrice: form.total, deposit: form.deposit, paid: form.paid },
          "Η πληρωμή αποθηκεύτηκε",
        ),
    });
  }

  return (
    <aside className="fixed inset-y-0 right-0 z-[60] w-full max-w-md overflow-y-auto bg-white shadow-2xl" aria-labelledby="bk-title">
      <div className="sticky top-0 z-10 border-b border-[#eef2f6] bg-white p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${style.chip}`}>{style.label} · #{b.id}</span>
            <h2 id="bk-title" className="mt-1 text-xl font-black">{`${b.firstName} ${b.lastName}`.trim() || "Χωρίς όνομα"}</h2>
            <p className="text-sm text-[#5b6b80]">{roomLabel(b.room)} · {dm(b.checkin)} → {dm(b.checkout)} · {b.nights} νύχτες · {people(b)} άτομα</p>
            {data.group.length > 1 && (
              <p className="text-xs font-semibold text-[#3b2f8a]">🔗 Group: {data.group.map((g) => roomLabel(g.room)).join(", ")}{b.masterId ? " · η τιμή είναι στην κύρια κράτηση" : ""}</p>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label="Κλείσιμο" className="h-10 w-10 rounded-full bg-[#f4f7fa] text-xl">×</button>
        </div>
      </div>

      <div className="space-y-5 p-4">
        {error && <p className="rounded-xl bg-[#fff4dc] px-3 py-2 text-sm font-semibold text-[#92400e]">{error}</p>}
        {ota && (
          <p className="rounded-xl bg-[#fff8e8] px-3 py-2 text-xs font-semibold text-[#92400e]">
            Κράτηση {b.channel}: ημερομηνίες, τιμή και ακύρωση αλλάζουν μόνο από το {b.channel}. Εδώ μπορείς να αλλάξεις δωμάτιο, άτομα και στοιχεία.
          </p>
        )}

        <section className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#5b6b80]">Διαμονή</h3>
          <label className="block text-xs font-bold">
            Δωμάτιο
            <select value={form.room} onChange={(e) => set({ room: Number(e.target.value) })} className={input}>
              {PYRGOS_ROOMS.map((r) => (
                <option key={r.number} value={r.number}>{r.label} — {r.categoryLabel}</option>
              ))}
            </select>
          </label>
          {Number(form.room) !== b.room && categoryWarning(b, Number(form.room)) && (
            <p className="rounded-lg border-2 border-[#f87171] bg-[#fef2f2] px-3 py-2 text-xs font-bold text-[#991b1b]">⚠️ {categoryWarning(b, Number(form.room))}</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Check-in<input type="date" disabled={ota} value={form.checkin} onChange={(e) => set({ checkin: e.target.value })} className={input} /></label>
            <label className="text-xs font-bold">Check-out<input type="date" disabled={ota} value={form.checkout} onChange={(e) => set({ checkout: e.target.value })} className={input} /></label>
            <label className="text-xs font-bold">Ενήλικες<input type="number" min={1} max={8} value={form.adults} onChange={(e) => set({ adults: e.target.value })} className={input} /></label>
            <label className="text-xs font-bold">Παιδιά<input type="number" min={0} max={6} value={form.children} onChange={(e) => set({ children: e.target.value })} className={input} /></label>
          </div>
          <h3 className="pt-2 text-sm font-black uppercase tracking-wide text-[#5b6b80]">Πελάτης</h3>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Όνομα<input value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} className={input} /></label>
            <label className="text-xs font-bold">Επώνυμο<input value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} className={input} /></label>
            <label className="col-span-2 text-xs font-bold">Email<input type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} className={input} /></label>
            <label className="col-span-2 text-xs font-bold">Τηλέφωνο<input type="tel" value={form.phone} onChange={(e) => set({ phone: e.target.value })} className={input} /></label>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={saveStay} className="min-h-11 rounded-full bg-[#e9e4fe] px-4 text-sm font-bold text-[#3b2f8a]">Αποθήκευση αλλαγών</button>
            <select
              aria-label="Γρήγορη μετακίνηση"
              value=""
              onChange={(e) => e.target.value && onMove(b, Number(e.target.value))}
              className="min-h-11 rounded-full border border-[#cfd9e4] bg-white px-3 text-sm font-bold"
            >
              <option value="">Μετακίνηση σε…</option>
              {PYRGOS_ROOMS.filter((r) => r.number !== b.room).map((r) => (
                <option key={r.number} value={r.number}>{r.label} — {r.categoryLabel}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-2 rounded-xl bg-[#f4f7fa] p-3">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#5b6b80]">Τιμή & πληρωμή</h3>
          {b.masterId ? (
            <p className="text-sm text-[#5b6b80]">Μέρος group: η τιμή και η πληρωμή είναι στην κύρια κράτηση #{b.masterId}.</p>
          ) : (
            <>
              <PriceFields
                nights={nights}
                mode={form.priceMode}
                night={form.night}
                total={form.total}
                disabled={ota}
                onChange={(v) => set({ priceMode: v.mode, night: v.night, total: v.total })}
              />
              <div className="grid grid-cols-2 items-end gap-2">
                <label className="text-xs font-bold">Προκαταβολή<input inputMode="decimal" value={form.deposit} onChange={(e) => set({ deposit: e.target.value.replace(",", ".") })} className={input} /></label>
                <div className="rounded-lg bg-white px-3 py-2.5 text-sm">
                  <div className="text-xs font-bold text-[#5b6b80]">Υπόλοιπο</div>
                  <div className={`text-lg font-black ${form.paid ? "text-[#14532d]" : ""}`}>{form.paid ? "Πληρωμένη ✓" : euro(balance)}</div>
                </div>
              </div>
              <label className="flex min-h-11 items-center gap-2 text-sm font-bold">
                <input type="checkbox" className="h-5 w-5" checked={form.paid} onChange={(e) => set({ paid: e.target.checked })} /> Πληρωμένη
                {b.paidAt ? <span className="text-xs font-normal text-[#5b6b80]">({b.paidAt})</span> : null}
              </label>
              <button type="button" onClick={saveMoneyClick} className="min-h-11 rounded-full bg-[#d2f3f6] px-4 text-sm font-bold text-[#0b4d55]">Αποθήκευση πληρωμής</button>
            </>
          )}
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#5b6b80]">Κρεβάτια & εξοπλισμός</h3>
          <select value={form.bedSetup} onChange={(e) => set({ bedSetup: e.target.value })} className={input} aria-label="Κρεβάτι">
            <option value="">—</option>
            {BED_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="flex gap-4">
            <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-5 w-5" checked={form.cot} onChange={(e) => set({ cot: e.target.checked })} /> Κούνια</label>
            <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-5 w-5" checked={form.rollaway} onChange={(e) => set({ rollaway: e.target.checked })} /> Ράντζο</label>
          </div>
          <input value={form.bedOther} onChange={(e) => set({ bedOther: e.target.value })} placeholder="Άλλο (π.χ. επιπλέον μαξιλάρια)" aria-label="Άλλο εξοπλισμός" className={input} />
          <button
            type="button"
            onClick={() =>
              setConfirm({
                title: "Αποθήκευση κρεβατιών",
                lines: ["Θα γραφτεί και στις σημειώσεις του Beds24."],
                onConfirm: () => run({ action: "beds", id: b.id, bedSetup: form.bedSetup, cot: form.cot, rollaway: form.rollaway, bedOther: form.bedOther }, "Τα κρεβάτια αποθηκεύτηκαν"),
              })
            }
            className="min-h-11 rounded-full border border-[#cfd9e4] px-4 text-sm font-bold"
          >
            Αποθήκευση κρεβατιών
          </button>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#5b6b80]">Μηνύματα</h3>
          <div className="flex flex-wrap gap-2">
            {digits ? <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#d3f2dc] px-4 py-2 text-sm font-bold text-[#14532d]">WhatsApp</a> : null}
            {digits ? <a href={`sms:+${digits}`} className="rounded-full bg-[#d6eefc] px-4 py-2 text-sm font-bold text-[#0c4a6e]">SMS</a> : null}
            {b.email && !/guest\.booking\.com|expediapartnercentral|m\.expediapartner/i.test(b.email) ? (
              <a href={`mailto:${b.email}`} className="rounded-full bg-[#e9e4fe] px-4 py-2 text-sm font-bold text-[#3b2f8a]">Email</a>
            ) : null}
            {!digits && !b.email ? <span className="text-sm text-[#5b6b80]">Δεν υπάρχει τηλέφωνο ή email.</span> : null}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#5b6b80]">Σημειώσεις</h3>
          {b.notes ? <p className="whitespace-pre-line rounded-lg bg-[#fff8e8] p-3 text-sm">{b.notes}</p> : <p className="text-sm text-[#5b6b80]">Καμία σημείωση.</p>}
          <div className="flex gap-2">
            <input value={form.note} onChange={(e) => set({ note: e.target.value })} placeholder="Νέα σημείωση" aria-label="Νέα σημείωση" className={`${input} mt-0`} />
            <button
              type="button"
              disabled={!form.note.trim()}
              onClick={() => run({ action: "note", id: b.id, note: form.note }, "Η σημείωση μπήκε και στο Beds24")}
              className="min-h-11 shrink-0 rounded-full border border-[#cfd9e4] px-4 text-sm font-bold disabled:opacity-50"
            >
              Προσθήκη
            </button>
          </div>
        </section>

        <section className="space-y-1">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#5b6b80]">Ιστορικό</h3>
          {data.history.length === 0 && <p className="text-sm text-[#5b6b80]">Καμία αλλαγή από τον πύργο ελέγχου ακόμα.</p>}
          <ul className="divide-y divide-[#eef2f6] text-sm">
            {data.history.map((h, i) => (
              <li key={i} className="py-2">
                <span className="text-xs text-[#5b6b80]">{h.time}</span> · <strong>{h.action}</strong>
                {h.beds24 === "failed" ? <span className="text-xs font-bold text-[#b45309]"> · ⚠️ όχι στο Beds24</span> : null}
                {h.detail ? <div className="text-xs text-[#3d4b5e]">{h.detail}</div> : null}
              </li>
            ))}
          </ul>
        </section>

        {!ota && (
          <button
            type="button"
            onClick={() =>
              setConfirm({
                title: "Ακύρωση κράτησης",
                lines: [`${b.firstName} ${b.lastName}`, `${roomLabel(b.room)} · ${dm(b.checkin)}–${dm(b.checkout)}`, "Θα ακυρωθεί και στο Beds24."],
                danger: true,
                confirmLabel: "Ακύρωση κράτησης",
                onConfirm: async () => {
                  const json = await post({ action: "cancel", id: b.id });
                  if (!json.ok) {
                    setError(json.error || "Η ακύρωση απέτυχε.");
                    return;
                  }
                  onChanged("Η κράτηση ακυρώθηκε");
                  onClose();
                },
              })
            }
            className="min-h-11 w-full rounded-full border border-[#cfd9e4] text-sm font-bold text-[#4b5b70]"
          >
            Ακύρωση κράτησης
          </button>
        )}
      </div>
    </aside>
  );
}

// ---------- new booking ----------

function NewBookingDialog({
  initial,
  onClose,
  onCreated,
  setConfirm,
}: {
  initial: { room: number; checkin: string };
  onClose: () => void;
  onCreated: (text: string) => void;
  setConfirm: (c: ConfirmState) => void;
}) {
  const [f, setF] = useState<any>({
    room: initial.room,
    checkin: initial.checkin,
    checkout: addDays(initial.checkin, 1),
    adults: 2,
    children: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    priceMode: null,
    night: "",
    total: "",
    deposit: "",
    paid: false,
    bedSetup: "",
    cot: false,
    rollaway: false,
    bedOther: "",
    notes: "",
    sendConfirmation: true,
  });
  const [free, setFree] = useState<number[] | null>(null);
  const [error, setError] = useState("");
  const set = (patch: Record<string, unknown>) => setF((cur: any) => ({ ...cur, ...patch }));
  const nights = diffDays(f.checkin, f.checkout);

  useEffect(() => {
    if (!f.checkin || !f.checkout || nights <= 0) return;
    let alive = true;
    (async () => {
      const json = await api(`/api/staff/pyrgos/plan/?free&from=${f.checkin}&to=${f.checkout}${f.room ? `&room=${f.room}` : ""}`);
      if (!alive || !json.ok) return;
      setFree(json.free);
      // Beds24 rate as a suggestion, only while no price was typed.
      if (json.suggestion && !f.night && !f.total) {
        setF((cur: any) =>
          cur.night || cur.total ? cur : { ...cur, priceMode: "night", night: String(json.suggestion), total: String(Math.round(json.suggestion * nights * 100) / 100) },
        );
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.checkin, f.checkout, f.room, nights]);

  // Night price keeps the total in step when the dates change; a typed total stays.
  useEffect(() => {
    if (f.priceMode === "night" && f.night && nights > 0) set({ total: String(Math.round(Number(f.night) * nights * 100) / 100) });
    if (f.priceMode === "total" && f.total && nights > 0) set({ night: String(Math.round((Number(f.total) / nights) * 100) / 100) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nights]);

  function submit() {
    if (!f.room) return setError("Διάλεξε δωμάτιο.");
    if (nights <= 0) return setError("Έλεγξε τις ημερομηνίες.");
    if (!f.firstName.trim() || !f.lastName.trim()) return setError("Συμπλήρωσε όνομα και επώνυμο.");
    if (free && !free.includes(Number(f.room))) return setError("Το δωμάτιο δεν είναι ελεύθερο αυτές τις μέρες.");
    setError("");
    setConfirm({
      title: "Νέα κράτηση",
      lines: [
        `${f.firstName} ${f.lastName} · ${f.children ? `${f.adults}+${f.children}` : f.adults} άτομα`,
        `${roomLabel(Number(f.room))} · ${dm(f.checkin)} → ${dm(f.checkout)} · ${nights} νύχτες`,
        `Σύνολο ${f.total ? euro(Number(f.total)) : "χωρίς τιμή"}${f.deposit ? ` · προκαταβολή ${euro(Number(f.deposit))}` : ""}`,
        f.sendConfirmation && f.email ? `Email επιβεβαίωσης στο ${f.email}` : "Χωρίς email επιβεβαίωσης",
        "Θα καταχωρηθεί στο Beds24.",
      ],
      confirmLabel: "Καταχώρηση",
      onConfirm: async () => {
        const json = await post({
          action: "create",
          room: Number(f.room),
          checkin: f.checkin,
          checkout: f.checkout,
          adults: Number(f.adults),
          children: Number(f.children),
          firstName: f.firstName,
          lastName: f.lastName,
          email: f.email,
          phone: f.phone,
          country: f.country,
          priceMode: f.priceMode,
          nightPrice: f.night,
          totalPrice: f.total,
          deposit: f.deposit,
          paid: f.paid,
          bedSetup: f.bedSetup,
          cot: f.cot,
          rollaway: f.rollaway,
          bedOther: f.bedOther,
          notes: f.notes,
          sendConfirmation: f.sendConfirmation,
        });
        if (!json.ok) {
          setError(json.error || "Η καταχώρηση απέτυχε.");
          return;
        }
        const email = json.result?.email;
        onCreated(`Νέα κράτηση #${json.result.id} · Beds24 ✓${email === "sent" ? " · email ✓" : email === "failed" ? " · ⚠️ email δεν στάλθηκε" : ""}`);
      },
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#1f2a3c]/40 p-4" role="dialog" aria-modal="true" aria-labelledby="nb-title">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="nb-title" className="text-xl font-black">Νέα κράτηση</h2>
          <button type="button" onClick={onClose} aria-label="Κλείσιμο" className="h-10 w-10 rounded-full bg-[#f4f7fa] text-xl">×</button>
        </div>
        {error && <p className="mb-3 rounded-xl bg-[#fff4dc] px-3 py-2 text-sm font-semibold text-[#92400e]">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold">Check-in<input type="date" value={f.checkin} onChange={(e) => set({ checkin: e.target.value, checkout: e.target.value >= f.checkout ? addDays(e.target.value, 1) : f.checkout })} className={input} /></label>
              <label className="text-xs font-bold">Check-out<input type="date" value={f.checkout} min={addDays(f.checkin, 1)} onChange={(e) => set({ checkout: e.target.value })} className={input} /></label>
              <label className="text-xs font-bold">Ενήλικες<input type="number" min={1} max={8} value={f.adults} onChange={(e) => set({ adults: e.target.value })} className={input} /></label>
              <label className="text-xs font-bold">Παιδιά<input type="number" min={0} max={6} value={f.children} onChange={(e) => set({ children: e.target.value })} className={input} /></label>
            </div>
            <div>
              <div className="text-xs font-bold">Δωμάτιο {free ? <span className="font-normal text-[#5b6b80]">· ελεύθερα: {free.length}</span> : null}</div>
              <div className="mt-1 grid grid-cols-3 gap-1.5">
                {PYRGOS_ROOMS.map((r) => {
                  const isFree = !free || free.includes(r.number);
                  return (
                    <button
                      key={r.number}
                      type="button"
                      disabled={!isFree}
                      aria-pressed={Number(f.room) === r.number}
                      onClick={() => set({ room: r.number, night: "", total: "", priceMode: null })}
                      className={`rounded-lg border px-2 py-2 text-left text-xs ${Number(f.room) === r.number ? "border-[#5443c9] bg-[#e9e4fe] font-black text-[#3b2f8a]" : isFree ? "border-[#cfd9e4] bg-white" : "border-[#eef2f6] bg-[#f4f7fa] text-[#a3aebd] line-through"}`}
                    >
                      <span className="block font-bold">{r.label}</span>
                      <span className="block text-[10px]">{r.categoryLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <PriceFields nights={nights} mode={f.priceMode} night={f.night} total={f.total} onChange={(v) => set({ priceMode: v.mode, night: v.night, total: v.total })} />
            <div className="grid grid-cols-2 items-end gap-2">
              <label className="text-xs font-bold">Προκαταβολή<input inputMode="decimal" value={f.deposit} onChange={(e) => set({ deposit: e.target.value.replace(",", ".") })} className={input} /></label>
              <label className="flex min-h-11 items-center gap-2 text-sm font-bold"><input type="checkbox" className="h-5 w-5" checked={f.paid} onChange={(e) => set({ paid: e.target.checked })} /> Πληρωμένη</label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold">Όνομα<input value={f.firstName} onChange={(e) => set({ firstName: e.target.value })} className={input} /></label>
              <label className="text-xs font-bold">Επώνυμο<input value={f.lastName} onChange={(e) => set({ lastName: e.target.value })} className={input} /></label>
            </div>
            <label className="block text-xs font-bold">Email<input type="email" value={f.email} onChange={(e) => set({ email: e.target.value })} className={input} /></label>
            <div className="grid grid-cols-[1fr_6rem] gap-2">
              <label className="text-xs font-bold">Κινητό<input type="tel" value={f.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+30 69…" className={input} /></label>
              <label className="text-xs font-bold">Χώρα<input value={f.country} maxLength={2} onChange={(e) => set({ country: e.target.value.toUpperCase() })} placeholder="GR" className={input} /></label>
            </div>
            <label className="block text-xs font-bold">
              Κρεβάτια
              <select value={f.bedSetup} onChange={(e) => set({ bedSetup: e.target.value })} className={input}>
                <option value="">—</option>
                {BED_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <div className="flex gap-4">
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-5 w-5" checked={f.cot} onChange={(e) => set({ cot: e.target.checked })} /> Κούνια</label>
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-5 w-5" checked={f.rollaway} onChange={(e) => set({ rollaway: e.target.checked })} /> Ράντζο</label>
            </div>
            <label className="block text-xs font-bold">Σημειώσεις<textarea rows={2} value={f.notes} onChange={(e) => set({ notes: e.target.value })} className={input} /></label>
            <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
              <input type="checkbox" className="h-5 w-5" checked={f.sendConfirmation} onChange={(e) => set({ sendConfirmation: e.target.checked })} />
              Αποστολή email επιβεβαίωσης {f.email ? "" : <span className="text-xs font-normal text-[#5b6b80]">(χρειάζεται email)</span>}
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="min-h-11 rounded-full px-4 text-sm font-bold text-[#4b5b70]">Άκυρο</button>
          <button type="button" onClick={submit} className="min-h-11 rounded-full bg-[#e9e4fe] px-6 text-sm font-bold text-[#3b2f8a]">Συνέχεια</button>
        </div>
      </div>
    </div>
  );
}

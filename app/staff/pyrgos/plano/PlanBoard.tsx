"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { PlanBooking, PlanCell } from "@/lib/pyrgos/plan";
import { useBeds24Sync } from "../useBeds24Sync";
import { CLIMATE_FEE_LABEL, CLIMATE_FEE_PER_NIGHT, PYRGOS_ROOMS, isCategoryChange, roomByNumber } from "@/lib/pyrgos/rooms";
import PyrgosNav from "../PyrgosNav";
import { foreignTextInEmail, type ConfirmationData } from "@/lib/crm/booking-confirmation-email";

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
  // Deep link from Σήμερα / reminder email: ?open=<id>&from=<checkin>
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const from = q.get("from");
    if (from && /^\d{4}-\d{2}-\d{2}$/.test(from)) setStart(addDays(from, -1));
    if (q.get("open")) setOpenId(q.get("open"));
  }, []);
  const [newBooking, setNewBooking] = useState<{ room: number; checkin: string } | null>(null);
  // Open faults / jobs per room (Βλάβες & εργασίες) for a 🔧 badge next to the room name.
  const [roomTasks, setRoomTasks] = useState<Map<number, { count: number; urgent: boolean; titles: string[] }>>(new Map());
  useEffect(() => {
    fetch("/api/staff/pyrgos/tasks", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!json.ok) return;
        const map = new Map<number, { count: number; urgent: boolean; titles: string[] }>();
        for (const t of json.tasks as { room: number | null; status: string; priority: string; title: string }[]) {
          if (t.status !== "open" || t.room === null) continue;
          const entry = map.get(t.room) ?? { count: 0, urgent: false, titles: [] };
          entry.count += 1;
          entry.urgent = entry.urgent || t.priority === "urgent";
          entry.titles.push(t.title);
          map.set(t.room, entry);
        }
        setRoomTasks(map);
      })
      .catch(() => undefined);
  }, []);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragged = useRef<PlanBooking | null>(null);
  const [resize, setResize] = useState<{ b: PlanBooking; edge: "start" | "end"; x: number; delta: number } | null>(null);

  // Only the newest request may update the board (fast ‹ › clicks used to let an older, slower
  // answer overwrite the week you are looking at).
  const loadSeq = useRef(0);
  const load = useCallback(async () => {
    const seq = ++loadSeq.current;
    setLoading(true);
    setError("");
    const json = await api(`/api/staff/pyrgos/plan/?from=${start}&to=${end}`);
    if (seq !== loadSeq.current) return;
    if (json.ok) {
      setBookings(json.bookings);
      setCells(json.cells);
    } else setError(json.error || "Δεν φόρτωσε το πλάνο.");
    setLoading(false);
  }, [start, end]);

  useEffect(() => {
    load();
  }, [load]);

  // Safety net for bookings typed straight into Beds24 (see useBeds24Sync).
  const loadRef = useRef(load);
  loadRef.current = load;
  const { info: syncInfo, syncNow } = useBeds24Sync(() => loadRef.current());

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

  function swapWith(a: PlanBooking, b: PlanBooking) {
    const warning = a.room && b.room ? categoryWarning(a, b.room) : undefined;
    setConfirm({
      title: "Αντιμετάθεση κρατήσεων",
      lines: [
        `${a.firstName} ${a.lastName}: ${roomLabel(a.room)} → ${roomLabel(b.room)}`,
        `${b.firstName} ${b.lastName}: ${roomLabel(b.room)} → ${roomLabel(a.room)}`,
        "Θα γραφτεί και στο Beds24.",
      ],
      warning,
      requireCheck: warning ? "Ναι, θέλω αλλαγή κατηγορίας" : undefined,
      confirmLabel: "Αντιμετάθεση",
      onConfirm: async () => {
        const json = await post({ action: "swap", idA: a.id, idB: b.id, confirmCategory: Boolean(warning) });
        if (!json.ok) {
          setToast({ text: json.error || "Η αντιμετάθεση απέτυχε." });
          return;
        }
        await load();
        setToast({ text: "Έγινε αντιμετάθεση · Beds24 ✓", undo: () => swapWith({ ...a, room: b.room }, { ...b, room: a.room }) });
      },
    });
  }

  function dropOnRoom(b: PlanBooking, room: number) {
    if (room === b.room) return;
    // Dropped on a room that is taken by exactly one booking those days → offer a swap.
    const blocking = (byRoom.get(room) ?? []).filter((o) => o.id !== b.id && o.checkin < b.checkout && o.checkout > b.checkin);
    if (blocking.length === 1 && blocking[0].status !== "black") return swapWith(b, blocking[0]);
    if (blocking.length > 1) {
      setToast({ text: `Το ${roomLabel(room)} έχει ${blocking.length} κρατήσεις εκείνες τις μέρες · δεν χωράει.` });
      return;
    }
    moveRoom(b, room);
  }

  // Resize a booking by dragging its left/right edge (direct bookings only).
  useEffect(() => {
    if (!resize) return;
    let latest = resize;
    const onMove = (e: PointerEvent) => {
      const delta = Math.round((e.clientX - latest.x) / W);
      if (delta === latest.delta) return; // re-render only when the edge crosses a day
      latest = { ...latest, delta };
      setResize(latest);
    };
    const onUp = () => {
      const r = latest;
      setResize(null);
      if (!r || !r.delta) return;
      const checkin = r.edge === "start" ? addDays(r.b.checkin, r.delta) : r.b.checkin;
      const checkout = r.edge === "end" ? addDays(r.b.checkout, r.delta) : r.b.checkout;
      if (diffDays(checkin, checkout) < 1) {
        setToast({ text: "Χρειάζεται τουλάχιστον 1 νύχτα." });
        return;
      }
      setConfirm({
        title: "Αλλαγή ημερομηνιών",
        lines: [
          `${r.b.firstName} ${r.b.lastName} · ${roomLabel(r.b.room)}`,
          `${dm(r.b.checkin)}–${dm(r.b.checkout)} (${r.b.nights} ν.) → ${dm(checkin)}–${dm(checkout)} (${diffDays(checkin, checkout)} ν.)`,
          "Αν η τιμή είναι ανά βραδιά, το σύνολο ξαναϋπολογίζεται· αν είναι σύνολο, μένει ίδιο.",
        ],
        onConfirm: async () => {
          const json = await post({ action: "update", id: r.b.id, checkin, checkout });
          if (!json.ok) {
            setToast({ text: json.error || "Η αλλαγή απέτυχε." });
            return;
          }
          await load();
          setToast({ text: "Οι ημερομηνίες άλλαξαν · Beds24 ✓" });
        },
      });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resize?.b.id, resize?.edge, W]);

  const today = athensToday();
  const gridWidth = ROOM_COL + days.length * W;

  return (
    <div className="min-h-screen bg-[#eef3f7] text-[#1f2a3c]">
      <div className="flex flex-wrap">
        <PyrgosNav wide="xl" />

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
              <button
                type="button"
                onClick={syncNow}
                title="Φέρνει από το Beds24 ό,τι άλλαξε το τελευταίο 24ωρο"
                className="h-10 rounded-full border border-[#dbe3ec] bg-white px-3 text-sm font-bold"
              >
                ⟳ Συγχρονισμός
              </button>
              {syncInfo && <span className="text-xs font-semibold text-[#5b6b80]">{syncInfo}</span>}
              <button type="button" onClick={() => setNewBooking({ room: 0, checkin: today })} className="h-10 rounded-full bg-[#e9e4fe] px-4 text-sm font-bold text-[#3b2f8a]">+ Νέα κράτηση</button>
            </div>
          </header>

          <div className="flex flex-wrap gap-3 text-xs font-semibold text-[#3d4b5e]">
            {Object.values(CHANNEL).map((c) => (
              <span key={c.label} className="flex items-center gap-1.5"><span className={`h-3 w-3 rounded ${c.chip}`} />{c.label}</span>
            ))}
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_3px,#f3f4f6_3px,#f3f4f6_6px)]" />Κλειστό</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-dashed border-[#f59e0b] bg-[#fffbeb]" />Κενό 1–2 νυχτών</span>
            <span className="text-[#5b6b80]">Σύρε κράτηση σε άλλη γραμμή = μετακίνηση (πάνω σε άλλη κράτηση = αντιμετάθεση) · σύρε την άκρη = ημερομηνίες · κενό κελί = νέα κράτηση</span>
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
                      if (b) dropOnRoom(b, room.number);
                    }}
                  >
                    <div style={{ width: ROOM_COL }} className={`sticky left-0 z-10 flex flex-col justify-center border-r border-[#e3e9f0] px-3 ${economy ? "bg-[#dff0fb]" : "bg-white"}`}>
                      <span className="flex items-center gap-1 text-sm font-black leading-tight">
                        {room.label}
                        {roomTasks.get(room.number) && (
                          <a
                            href={`/staff/pyrgos/ergasies?room=${room.number}`}
                            title={roomTasks.get(room.number)!.titles.join("\n")}
                            aria-label={`${roomTasks.get(room.number)!.count} ανοιχτές εργασίες στο ${room.label}`}
                            className={`rounded-full px-1.5 text-[11px] font-bold ${roomTasks.get(room.number)!.urgent ? "bg-[#fee2e2] text-[#991b1b]" : "bg-[#fef3c7] text-[#92400e]"}`}
                          >
                            🔧{roomTasks.get(room.number)!.count}
                          </a>
                        )}
                      </span>
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
                      const preview = resize && resize.b.id === b.id ? resize : null;
                      const startIdx = diffDays(start, b.checkin) + (preview?.edge === "start" ? preview.delta : 0);
                      const endIdx = diffDays(start, b.checkout) + (preview?.edge === "end" ? preview.delta : 0);
                      const resizable = b.status !== "black" && !OTA.has(b.channel);
                      // Full check-in day cell, nothing of the check-out day (owner, 2026-11-19).
                      const left = Math.max(startIdx, 0);
                      const right = Math.min(endIdx, days.length);
                      const width = Math.max((right - left) * W - 4, 18);
                      const style = channelStyle(b);
                      return (
                        <button
                          key={b.id}
                          type="button"
                          draggable={b.status !== "black" && !resize}
                          onDragStart={(e) => {
                            if ((e.target as HTMLElement).dataset?.handle) {
                              e.preventDefault();
                              return;
                            }
                            dragged.current = b;
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          onDragEnd={() => {
                            dragged.current = null;
                            setDragOver(null);
                          }}
                          onClick={() => !resize && b.status !== "black" && setOpenId(b.id)}
                          title={`${b.firstName} ${b.lastName} · ${dm(b.checkin)}–${dm(b.checkout)} · ${b.channel}${b.notes ? ` · 📝 ${b.notes}` : ""}`}
                          style={{ left: ROOM_COL + left * W + 2, width, top: 6, height: ROW_H - 12 }}
                          className={`absolute z-[5] flex flex-col justify-center overflow-hidden rounded-lg border px-2 text-left shadow-sm hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5443c9] ${style.bar} ${b.hold ? "border-2 border-dashed border-[#b45309]" : ""} ${openId === b.id ? "ring-2 ring-[#1f2a3c]" : ""}`}
                        >
                          <span className="flex items-center gap-1 truncate text-xs font-black leading-tight">
                            {b.hold ? <span aria-label="σε αναμονή" title={`Σε αναμονή · υπενθύμιση ${dm(b.hold.remindOn)}`}>⏳</span> : null}
                            {b.masterId ? <span aria-label="μέρος group">🔗</span> : null}
                            {b.notes ? <span aria-label="έχει σημείωση">📝</span> : null}
                            <span className="truncate">{b.status === "black" ? "Μπλοκ" : `${b.firstName} ${b.lastName}`.trim() || "Χωρίς όνομα"}</span>
                          </span>
                          {b.status !== "black" && (
                            <span className="truncate text-[10px] font-semibold opacity-90">
                              {people(b)} άτ.{b.beds ? ` · ${b.beds}` : ""} · {style.label}
                            </span>
                          )}
                          {resizable && startIdx >= 0 && (
                            <span
                              data-handle="start"
                              aria-hidden="true"
                              title="Σύρε για αλλαγή άφιξης"
                              onClick={(e) => e.stopPropagation()}
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setResize({ b, edge: "start", x: e.clientX, delta: 0 });
                              }}
                              className="absolute inset-y-0 left-0 w-2.5 cursor-ew-resize rounded-l-lg bg-black/0 hover:bg-black/15"
                            />
                          )}
                          {resizable && endIdx <= days.length && (
                            <span
                              data-handle="end"
                              aria-hidden="true"
                              title="Σύρε για αλλαγή αναχώρησης"
                              onClick={(e) => e.stopPropagation()}
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setResize({ b, edge: "end", x: e.clientX, delta: 0 });
                              }}
                              className="absolute inset-y-0 right-0 w-2.5 cursor-ew-resize rounded-r-lg bg-black/0 hover:bg-black/15"
                            />
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
          onSwap={(a, b) => swapWith(a, b)}
          planBookings={bookings}
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

const input = "mt-1 w-full rounded-lg border border-[#cfd9e4] bg-white px-3 py-2.5 text-base font-normal disabled:bg-[#f4f7fa]";

// ---------- booking panel ----------

function BookingPanel({
  id,
  onClose,
  onChanged,
  onMove,
  onSwap,
  planBookings,
  setConfirm,
}: {
  id: string;
  onClose: () => void;
  onChanged: (text: string) => void;
  onMove: (b: PlanBooking, to: number) => void;
  onSwap: (a: PlanBooking, b: PlanBooking) => void;
  planBookings: PlanBooking[];
  setConfirm: (c: ConfirmState) => void;
}) {
  const [data, setData] = useState<{ booking: PlanBooking; history: any[]; group: { id: string; room: number }[]; initial: any } | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<any>(null);
  // Must stay above the early return below — hooks after it crash the panel (React #310).
  const [sendingConfirmation, setSendingConfirmation] = useState(false);

  const reload = useCallback(async () => {
    const json = await api(`/api/staff/pyrgos/plan/?id=${encodeURIComponent(id)}`);
    if (!json.ok) {
      setError(json.error || "Δεν φόρτωσε η κράτηση.");
      return;
    }
    const b: PlanBooking = json.booking;
    const next = {
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
      breakfast: b.breakfast,
      guestNote: b.guestNote,
      note: "",
    };
    setData({ ...json, initial: next });
    setForm(next);
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
  const climateFee = nights > 0 ? nights * CLIMATE_FEE_PER_NIGHT : 0;
  const grandTotal = form.total || b.chargesTotal ? Math.round((totalNum + climateFee + b.chargesTotal) * 100) / 100 : null;
  const balance = grandTotal !== null ? Math.round((grandTotal - depositNum) * 100) / 100 : null;
  const style = channelStyle(b);
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

  // Manual send of the booking confirmation from the panel (owner, 2026-11-23).
  // Same path as the CRM "Αποστολή στον πελάτη": loads the email data, warns, asks, then sends.
  async function openSendConfirmation() {
    if (dirty) return setError("Αποθήκευσε πρώτα τις αλλαγές — η επιβεβαίωση παίρνει τα αποθηκευμένα στοιχεία.");
    setSendingConfirmation(true);
    setError("");
    try {
      const res = await fetch(`/api/staff/crm/confirmation/?bookingId=${encodeURIComponent(b.id)}`, { cache: "no-store" });
      const json = await res.json();
      if (!json.ok) return setError(json.error || "Δεν φορτώθηκε η επιβεβαίωση.");
      const conf = json.data as ConfirmationData;
      const to = String(conf.email || "").trim();
      if (!to || /@([a-z0-9-]+\.)*(booking\.com|expedia\.com|expediapartnercentral\.com)$/i.test(to)) {
        return setError("Η κράτηση δεν έχει πραγματικό email πελάτη — συμπλήρωσέ το στο «Πελάτης» και αποθήκευσε.");
      }
      const leftovers = foreignTextInEmail(conf);
      const warnings: string[] = Array.isArray(json.warnings) ? json.warnings : [];
      setConfirm({
        title: "Αποστολή επιβεβαίωσης",
        lines: [
          `Προς: ${to}`,
          `Γλώσσα: ${String(conf.language || "").toUpperCase()}`,
          ...warnings.map((w) => `⚠ ${w}`),
          ...(leftovers.length ? ["⚠ Δεν είναι όλο στη γλώσσα του πελάτη:", ...leftovers] : []),
          "Δες πρώτα το «Preview επιβεβαίωσης» αν δεν το έχεις δει.",
        ],
        confirmLabel: "Αποστολή",
        onConfirm: async () => {
          const r = await fetch("/api/staff/crm/confirmation/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "send", data: conf }),
          });
          const out = await r.json();
          if (!out.ok) {
            setError(out.error || "Η αποστολή απέτυχε.");
            return;
          }
          onChanged(`Στάλθηκε η επιβεβαίωση στο ${out.sentTo}`);
          await reload();
        },
      });
    } catch {
      setError("Δεν φορτώθηκε η επιβεβαίωση.");
    } finally {
      setSendingConfirmation(false);
    }
  }

  // ---- one form, one save (owner, 2026-11-20): every change is collected and saved together ----
  const initial = data.initial;
  const changed = (keys: string[]) => keys.some((k) => String(form[k] ?? "") !== String(initial[k] ?? ""));
  const STAY_KEYS = ["room", "checkin", "checkout", "adults", "children", "firstName", "lastName", "email", "phone"];
  const MONEY_KEYS = ["priceMode", "night", "total", "deposit", "paid"];
  const BEDS_KEYS = ["bedSetup", "cot", "rollaway", "bedOther", "breakfast", "guestNote"];
  const stayDirty = changed(STAY_KEYS);
  const moneyDirty = !b.masterId && changed(MONEY_KEYS);
  const bedsDirty = changed(BEDS_KEYS);
  const dirty = stayDirty || moneyDirty || bedsDirty;
  const roomWarning = Number(form.room) !== b.room ? categoryWarning(b, Number(form.room)) : undefined;

  function changeLines() {
    const lines: string[] = [];
    if (Number(form.room) !== b.room) lines.push(`Δωμάτιο: ${roomLabel(b.room)} → ${roomLabel(Number(form.room))}`);
    if (form.checkin !== b.checkin || form.checkout !== b.checkout) lines.push(`Ημερομηνίες: ${dm(b.checkin)}–${dm(b.checkout)} → ${dm(form.checkin)}–${dm(form.checkout)}`);
    if (Number(form.adults) !== Number(initial.adults) || Number(form.children) !== Number(initial.children)) lines.push(`Άτομα: ${people(b)} → ${Number(form.children) ? `${form.adults}+${form.children}` : form.adults}`);
    if (form.firstName !== initial.firstName || form.lastName !== initial.lastName) lines.push(`Όνομα: ${form.firstName} ${form.lastName}`);
    if (form.email !== initial.email) lines.push(`Email: ${form.email || "—"}`);
    if (form.phone !== initial.phone) lines.push(`Τηλέφωνο: ${form.phone || "—"}`);
    if (moneyDirty) {
      lines.push(`Τιμή: ${form.total ? euro(Number(form.total)) : "—"}${form.priceMode === "night" && form.night ? ` (${euro(Number(form.night))}/βραδιά)` : ""} · προκαταβολή ${form.deposit ? euro(Number(form.deposit)) : "—"} · ${form.paid ? "πληρωμένη ✓" : `υπόλοιπο ${euro(balance)}`}`);
    }
    if (bedsDirty) {
      const bed = BED_OPTIONS.find((o) => o.value === form.bedSetup)?.label;
      lines.push(`Κρεβάτια/πρωινό: ${[bed, form.breakfast ? "Πρωινό" : "", form.cot ? "Κούνια" : "", form.rollaway ? "Ράντζο" : "", form.bedOther].filter(Boolean).join(" · ") || "—"}`);
      if (form.guestNote !== initial.guestNote) lines.push(form.guestNote.trim() ? `Σημείωση επιβεβαίωσης: «${form.guestNote.trim().slice(0, 120)}»` : "Σημείωση επιβεβαίωσης: —");
    }
    return lines;
  }

  function saveAll() {
    if (!dirty) return;
    setConfirm({
      title: "Αποθήκευση αλλαγών",
      lines: [...changeLines(), "Θα γραφτούν και στο Beds24."],
      warning: roomWarning,
      requireCheck: roomWarning ? "Ναι, θέλω αλλαγή κατηγορίας" : undefined,
      onConfirm: async () => {
        const failed: string[] = [];
        const steps: Record<string, unknown>[] = [];
        if (stayDirty)
          steps.push({
            action: "update", id: b.id, room: Number(form.room), checkin: form.checkin, checkout: form.checkout,
            adults: Number(form.adults), children: Number(form.children), firstName: form.firstName, lastName: form.lastName,
            email: form.email, phone: form.phone, confirmCategory: Boolean(roomWarning),
          });
        if (moneyDirty) steps.push({ action: "money", id: b.id, priceMode: form.priceMode, nightPrice: form.night, totalPrice: form.total, deposit: form.deposit, paid: form.paid });
        if (bedsDirty) steps.push({ action: "beds", id: b.id, bedSetup: form.bedSetup, cot: form.cot, rollaway: form.rollaway, bedOther: form.bedOther, breakfast: form.breakfast, guestNote: form.guestNote });
        for (const step of steps) {
          const json = await post(step);
          if (!json.ok && json.code !== "category") failed.push(json.error || `Απέτυχε: ${step.action}`);
        }
        if (failed.length) setError(failed.join(" · "));
        else setError("");
        onChanged(failed.length ? "Κάποιες αλλαγές δεν αποθηκεύτηκαν" : "Αποθηκεύτηκε · Beds24 ✓");
        await reload();
      },
    });
  }

  const section = "space-y-2 rounded-2xl border border-[#e3e9f0] p-3";
  const h3 = "text-sm font-black uppercase tracking-wide text-[#5b6b80]";
  const actionBtn = "min-h-11 rounded-full border border-[#cfd9e4] bg-white px-4 text-sm font-bold text-[#334155] disabled:opacity-50";
  const otherOverlapping = planBookings.filter(
    (o) => o.id !== b.id && o.room && o.room !== b.room && o.status !== "black" && o.checkin < b.checkout && o.checkout > b.checkin,
  );

  return (
    <aside className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-white shadow-2xl" aria-labelledby="bk-title">
      {/* 1. Header */}
      <div className="border-b border-[#eef2f6] bg-white p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${style.chip}`}>{style.label} · #{b.id}</span>
            <h2 id="bk-title" className="mt-1 text-xl font-black">{`${b.firstName} ${b.lastName}`.trim() || "Χωρίς όνομα"}</h2>
            <p className="text-sm text-[#5b6b80]">{roomLabel(b.room)} · {dm(b.checkin)} → {dm(b.checkout)} · {b.nights} νύχτες · {people(b)} άτομα</p>
            {!b.masterId && (
              <p className="text-sm font-bold">
                {b.totalPrice !== null || b.beds24Price !== null ? euro(b.totalPrice ?? b.beds24Price) : "Χωρίς τιμή"}
                <span className={`ml-2 font-semibold ${b.paid ? "text-[#14532d]" : "text-[#92400e]"}`}>{b.paid ? "Πληρωμένη ✓" : balance !== null ? `υπόλοιπο ${euro(balance)}` : ""}</span>
              </p>
            )}
            {data.group.length > 1 && (
              <p className="text-xs font-semibold text-[#3b2f8a]">🔗 Group: {data.group.map((g) => roomLabel(g.room)).join(", ")}{b.masterId ? " · η τιμή είναι στην κύρια κράτηση" : ""}</p>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label="Κλείσιμο" className="h-10 w-10 shrink-0 rounded-full bg-[#f4f7fa] text-xl">×</button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {error && <p className="rounded-xl bg-[#fff4dc] px-3 py-2 text-sm font-semibold text-[#92400e]">{error}</p>}
        {b.hold && <HoldSection b={b} onDone={async (text) => { await reload(); onChanged(text); }} setError={setError} />}
        {ota && (
          <p className="rounded-xl bg-[#fff8e8] px-3 py-2 text-xs font-semibold text-[#92400e]">
            Κράτηση {b.channel}: ημερομηνίες, τιμή και ακύρωση αλλάζουν μόνο από το {b.channel}. Εδώ μπορείς να αλλάξεις δωμάτιο, άτομα και στοιχεία.
          </p>
        )}

        {/* 2. Stay */}
        <section className={section}>
          <h3 className={h3}>Διαμονή</h3>
          <label className="block text-xs font-bold">
            Δωμάτιο
            <select value={form.room} onChange={(e) => set({ room: Number(e.target.value) })} className={input}>
              {PYRGOS_ROOMS.map((r) => (
                <option key={r.number} value={r.number}>{r.label} — {r.categoryLabel}</option>
              ))}
            </select>
          </label>
          {roomWarning && <p className="rounded-lg border-2 border-[#f87171] bg-[#fef2f2] px-3 py-2 text-xs font-bold text-[#991b1b]">⚠️ {roomWarning}</p>}
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Check-in<input type="date" disabled={ota} value={form.checkin} onChange={(e) => set({ checkin: e.target.value })} className={input} /></label>
            <label className="text-xs font-bold">Check-out<input type="date" disabled={ota} value={form.checkout} onChange={(e) => set({ checkout: e.target.value })} className={input} /></label>
            <label className="text-xs font-bold">Ενήλικες<input type="number" min={1} max={8} value={form.adults} onChange={(e) => set({ adults: e.target.value })} className={input} /></label>
            <label className="text-xs font-bold">Παιδιά<input type="number" min={0} max={6} value={form.children} onChange={(e) => set({ children: e.target.value })} className={input} /></label>
          </div>
          <p className="text-xs text-[#5b6b80]">{nights > 0 ? `${nights} νύχτες` : "Έλεγξε τις ημερομηνίες"}</p>
        </section>

        {/* 3. Guest */}
        <section className={section}>
          <h3 className={h3}>Πελάτης</h3>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold">Όνομα<input value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} className={input} /></label>
            <label className="text-xs font-bold">Επώνυμο<input value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} className={input} /></label>
            <label className="col-span-2 text-xs font-bold">Email<input type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} className={input} /></label>
            <label className="col-span-2 text-xs font-bold">Τηλέφωνο<input type="tel" value={form.phone} onChange={(e) => set({ phone: e.target.value })} className={input} /></label>
          </div>
        </section>

        {/* 4. Room setup */}
        <section className={section}>
          <h3 className={h3}>Κρεβάτια & πρωινό</h3>
          <select value={form.bedSetup} onChange={(e) => set({ bedSetup: e.target.value })} className={input} aria-label="Κρεβάτι">
            <option value="">Κρεβάτι: —</option>
            {BED_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-x-4">
            <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-5 w-5" checked={form.breakfast} onChange={(e) => set({ breakfast: e.target.checked })} /> Πρωινό περιλαμβάνεται</label>
            <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-5 w-5" checked={form.cot} onChange={(e) => set({ cot: e.target.checked })} /> Κούνια</label>
            <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-5 w-5" checked={form.rollaway} onChange={(e) => set({ rollaway: e.target.checked })} /> Ράντζο</label>
          </div>
          <input value={form.bedOther} onChange={(e) => set({ bedOther: e.target.value })} placeholder="Άλλο (π.χ. επιπλέον μαξιλάρια)" aria-label="Άλλο εξοπλισμός" className={input} />
        </section>

        {/* 5. Price & payment */}
        <section className={`${section} bg-[#f8fafc]`}>
          <h3 className={h3}>Τιμή & πληρωμή</h3>
          {b.masterId ? (
            <>
              <p className="text-sm text-[#5b6b80]">Μέρος group: η τιμή και η πληρωμή είναι στην κύρια κράτηση #{b.masterId}. Οι χρεώσεις που προσθέτεις εδώ πάνε εκεί.</p>
              <Charges booking={b} setConfirm={setConfirm} run={run} grandTotal={null} nights={b.nights} stayTotal={null} />
            </>
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
              <Charges booking={b} setConfirm={setConfirm} run={run} grandTotal={grandTotal} nights={nights} stayTotal={form.total ? totalNum : null} nightPrice={form.priceMode === "night" && form.night ? Number(form.night) : null} />
            </>
          )}
        </section>

        {/* 6. Confirmation note */}
        <section className={section}>
          <h3 className={h3}>Επιβεβαίωση προς τον πελάτη</h3>
          <label className="block text-xs font-bold">
            Σημείωση για τον πελάτη <span className="font-normal text-[#5443c9]">· φαίνεται στο email επιβεβαίωσης</span>
            <textarea rows={2} value={form.guestNote} onChange={(e) => set({ guestNote: e.target.value })} placeholder="π.χ. Συμφωνήσαμε late check-out στις 13:00" className={input} />
          </label>
        </section>

        {/* 7. Internal notes */}
        <section className={section}>
          <h3 className={h3}>Εσωτερικές σημειώσεις</h3>
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

        {/* 8. Communication */}
        <GuestCrm booking={b} setConfirm={setConfirm} onToast={onChanged} />

        {/* 9. All actions in one place */}
        <section className={`${section} border-[#cfc6fb] bg-[#f7f5ff]`}>
          <h3 className={h3}>Ενέργειες</h3>
          <div className="flex flex-wrap gap-2">
            <a
              href={`/staff/crm/?tab=confirmation&booking=${encodeURIComponent(b.id)}`}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center rounded-full bg-[#e9e4fe] px-4 text-sm font-bold text-[#3b2f8a]"
            >
              Preview επιβεβαίωσης ↗
            </a>
            <button
              type="button"
              disabled={sendingConfirmation}
              title={dirty ? "Αποθήκευσε πρώτα τις αλλαγές" : ""}
              onClick={() => void openSendConfirmation()}
              className={actionBtn}
            >
              {sendingConfirmation ? "Φόρτωση…" : "Αποστολή επιβεβαίωσης"}
            </button>
            {!b.masterId && (
              <button
                type="button"
                disabled={!b.deposit}
                title={b.deposit ? "" : "Αποθήκευσε πρώτα την προκαταβολή"}
                onClick={() => {
                  const to = (b.email && !/guest\.booking\.com|expedia/i.test(b.email) ? b.email : "").trim();
                  if (!to) return setError("Η κράτηση δεν έχει πραγματικό email πελάτη — συμπλήρωσέ το στο «Πελάτης» και αποθήκευσε.");
                  const remaining = b.totalPrice !== null || b.beds24Price !== null ? Math.max((b.totalPrice ?? b.beds24Price ?? 0) + b.nights * CLIMATE_FEE_PER_NIGHT + b.chargesTotal - (b.deposit ?? 0), 0) : null;
                  setConfirm({
                    title: "Email για την προκαταβολή",
                    lines: [`Προς: ${to}`, `Λάβαμε προκαταβολή ${euro(b.deposit)}`, remaining !== null ? `Υπόλοιπο ${euro(remaining)}` : "Χωρίς σύνολο τιμής"],
                    confirmLabel: "Αποστολή",
                    onConfirm: () => run({ action: "deposit_email", id: b.id, to }, `Στάλθηκε email προκαταβολής στο ${to}`),
                  });
                }}
                className={actionBtn}
              >
                Email προκαταβολής
              </button>
            )}
            <select
              aria-label="Μετακίνηση σε άλλο δωμάτιο"
              value=""
              onChange={(e) => e.target.value && onMove(b, Number(e.target.value))}
              className={actionBtn}
            >
              <option value="">Μετακίνηση σε…</option>
              {PYRGOS_ROOMS.filter((r) => r.number !== b.room).map((r) => (
                <option key={r.number} value={r.number}>{r.label} — {r.categoryLabel}</option>
              ))}
            </select>
            {otherOverlapping.length > 0 && (
              <select
                aria-label="Αντιμετάθεση με άλλη κράτηση"
                value=""
                onChange={(e) => {
                  const other = otherOverlapping.find((o) => o.id === e.target.value);
                  if (other) onSwap(b, other);
                }}
                className={actionBtn}
              >
                <option value="">Αντιμετάθεση με…</option>
                {otherOverlapping.map((o) => (
                  <option key={o.id} value={o.id}>{roomLabel(o.room)} · {o.firstName} {o.lastName} ({dm(o.checkin)}–{dm(o.checkout)})</option>
                ))}
              </select>
            )}
          </div>
          {!b.hold && <HoldSection b={b} onDone={async (text) => { await reload(); onChanged(text); }} setError={setError} />}
          {b.nights >= 2 && b.status !== "black" && (
            <details className="rounded-xl border border-[#eef2f6] bg-white px-3 py-2 text-sm">
              <summary className="cursor-pointer font-semibold text-[#5b6b80]">↔ Split stay (αλλαγή δωματίου στη μέση)</summary>
              <div className="mt-2"><SplitStay booking={b} setConfirm={setConfirm} onDone={(text) => { onChanged(text); reload(); }} /></div>
            </details>
          )}
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
              className="min-h-11 w-full rounded-full border border-[#f3c4c4] bg-white text-sm font-bold text-[#b42318]"
            >
              Ακύρωση κράτησης
            </button>
          )}
        </section>

        {/* 10. History */}
        <details className={section}>
          <summary className={`${h3} cursor-pointer`}>Ιστορικό ({data.history.length})</summary>
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
        </details>
      </div>

      {/* Save bar: always there, active when something changed */}
      <div className="border-t border-[#eef2f6] bg-white p-3">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 text-xs font-semibold text-[#5b6b80]">
            {dirty ? <span className="text-[#92400e]">Έχεις αλλαγές που δεν αποθηκεύτηκαν</span> : "Κάνε αλλαγές και πάτα Αποθήκευση"}
          </p>
          {dirty && (
            <button type="button" onClick={() => setForm({ ...initial })} className="min-h-11 rounded-full border border-[#cfd9e4] px-4 text-sm font-bold text-[#4b5b70]">
              Αναίρεση
            </button>
          )}
          <button
            type="button"
            disabled={!dirty}
            onClick={saveAll}
            className="min-h-11 rounded-full bg-[#3b2f8a] px-5 text-sm font-bold text-white disabled:bg-[#cbd5e1]"
          >
            Αποθήκευση
          </button>
        </div>
      </div>
    </aside>
  );
}

// ---------- guest CRM & messages ----------

type GuestProfile = {
  language: "el" | "en" | "tr";
  realEmail: string | null;
  phone: string;
  arrivalTime: string | null;
  arrivalDetails: string | null;
  missing: string[];
  canOtaMessage: boolean;
  outreachSent: boolean;
  previous: { id: string; room: number | null; checkin: string; nights: number; channel: string }[];
  timeline: { at: string; channel: string; direction: "in" | "out"; title: string; body: string; status: string }[];
};

const MAPS = "https://www.google.com/maps/place/Voulamandis+House";

function templates(lang: "el" | "en" | "tr", name: string, checkin: string) {
  const first = (name || "").split(" ")[0];
  if (lang === "el") {
    return [
      { label: "Ώρα άφιξης", text: `Γεια σας ${first}, ευχαριστούμε για την κράτηση στο Voulamandis House! Τι ώρα περίπου θα φτάσετε στις ${dm(checkin)}; Το check-in είναι από τις 14:00.` },
      { label: "Προσωπικό email", text: `Γεια σας ${first}, μπορείτε να μας στείλετε το προσωπικό σας email για να σας στείλουμε την επιβεβαίωση και πληροφορίες για τη διαμονή σας;` },
      { label: "Οδηγίες", text: `Γεια σας ${first}, η τοποθεσία μας στον χάρτη: ${MAPS} . Για οτιδήποτε χρειαστείτε είμαστε εδώ. Voulamandis House` },
      { label: "Ευχαριστώ", text: `Ευχαριστούμε πολύ ${first}! Σας περιμένουμε. Voulamandis House` },
    ];
  }
  return [
    { label: "Ώρα άφιξης", text: `Hello ${first}, thank you for booking Voulamandis House! Around what time will you arrive on ${dm(checkin)}? Check-in is from 14:00.` },
    { label: "Προσωπικό email", text: `Hello ${first}, could you send us your personal email so we can send you the confirmation and information about your stay?` },
    { label: "Οδηγίες", text: `Hello ${first}, here is our location: ${MAPS} . We are here for anything you need. Voulamandis House` },
    { label: "Ευχαριστώ", text: `Thank you ${first}! We look forward to welcoming you. Voulamandis House` },
  ];
}

function GuestCrm({ booking: b, setConfirm, onToast }: { booking: PlanBooking; setConfirm: (c: ConfirmState) => void; onToast: (text: string) => void }) {
  const [p, setP] = useState<GuestProfile | null>(null);
  const [error, setError] = useState("");
  const [channel, setChannel] = useState<"sms" | "email" | "whatsapp" | "ota">("sms");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [arrival, setArrival] = useState({ time: "", details: "" });

  const load = useCallback(async () => {
    const json = await api(`/api/staff/pyrgos/guest/?id=${encodeURIComponent(b.id)}`);
    if (!json.ok) return setError(json.error || "Δεν φόρτωσαν τα στοιχεία πελάτη.");
    setP(json.profile);
    setArrival({ time: json.profile.arrivalTime ?? "", details: json.profile.arrivalDetails ?? "" });
    setChannel(json.profile.phone ? "sms" : json.profile.realEmail ? "email" : json.profile.canOtaMessage ? "ota" : "sms");
  }, [b.id]);

  useEffect(() => {
    load();
  }, [load]);

  const guestPost = (body: Record<string, unknown>) =>
    api("/api/staff/pyrgos/guest/", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: b.id, ...body }) });

  if (!p) return <section className="text-sm text-[#5b6b80]">{error || "Φόρτωση πελάτη…"}</section>;

  const digits = (p.phone || "").replace(/\D/g, "").replace(/^00/, "");
  const waDigits = /^69\d{8}$/.test(digits) ? `30${digits}` : digits;
  const name = `${b.firstName} ${b.lastName}`.trim();
  const CH = [
    { key: "sms", label: "SMS", ok: Boolean(p.phone), why: "δεν υπάρχει κινητό" },
    { key: "email", label: "Email", ok: Boolean(p.realEmail), why: "δεν υπάρχει προσωπικό email" },
    { key: "whatsapp", label: "WhatsApp", ok: Boolean(waDigits), why: "δεν υπάρχει κινητό" },
    { key: "ota", label: b.channel === "Expedia" ? "Μήνυμα Expedia" : "Μήνυμα Booking", ok: p.canOtaMessage, why: "μόνο για Booking/Expedia" },
  ] as const;
  const current = CH.find((c) => c.key === channel)!;

  function send() {
    if (!current.ok) return setError(`Δεν γίνεται ${current.label}: ${current.why}.`);
    if (!message.trim()) return setError("Γράψε το μήνυμα.");
    setError("");
    const to = channel === "sms" || channel === "whatsapp" ? `+${waDigits}` : channel === "email" ? p!.realEmail : b.channel;
    setConfirm({
      title: `Αποστολή ${current.label}`,
      lines: [`Προς: ${name} (${to})`, ...(channel === "email" ? [`Θέμα: ${subject || "Voulamandis House"}`] : []), message.length > 220 ? `${message.slice(0, 220)}…` : message],
      confirmLabel: channel === "whatsapp" ? "Άνοιγμα WhatsApp" : "Αποστολή",
      onConfirm: async () => {
        if (channel === "whatsapp") {
          window.open(`https://wa.me/${waDigits}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
        }
        const json = await guestPost({ action: "send", channel, message, subject });
        if (!json.ok) {
          setError(json.error || "Η αποστολή απέτυχε.");
          return;
        }
        setMessage("");
        setSubject("");
        onToast(channel === "whatsapp" ? "Άνοιξε το WhatsApp · πάτα αποστολή εκεί" : `${current.label} στάλθηκε ✓`);
        load();
      },
    });
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-black uppercase tracking-wide text-[#5b6b80]">Πελάτης & μηνύματα</h3>
      {error && <p className="rounded-lg bg-[#fff4dc] px-3 py-2 text-xs font-semibold text-[#92400e]">{error}</p>}

      <div className="flex flex-wrap gap-1.5 text-xs font-bold">
        {p.previous.length > 0 ? (
          <span className="rounded-full bg-[#ece9fd] px-2.5 py-1 text-[#3b2f8a]" title={p.previous.map((x) => `${x.checkin} · ${roomLabel(x.room)} · ${x.nights} ν.`).join("\n")}>
            ★ Έχει ξανάρθει {p.previous.length}× · τελευταία {dm(p.previous[0].checkin)}/{p.previous[0].checkin.slice(2, 4)}
          </span>
        ) : (
          <span className="rounded-full bg-[#f4f7fa] px-2.5 py-1 text-[#5b6b80]">Πρώτη φορά</span>
        )}
        <span className="rounded-full bg-[#f4f7fa] px-2.5 py-1">{p.realEmail ? `✉ ${p.realEmail}` : "✉ —"}</span>
        <span className="rounded-full bg-[#f4f7fa] px-2.5 py-1">{p.phone ? `☎ ${p.phone}` : "☎ —"}</span>
      </div>

      {p.missing.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#fff8e8] px-3 py-2 text-xs">
          <span className="font-bold text-[#92400e]">Λείπει: {p.missing.join(", ")}</span>
          {p.canOtaMessage && (p.missing.includes("email") || p.missing.includes("ώρα άφιξης")) && (
            <button
              type="button"
              onClick={() =>
                setConfirm({
                  title: "Αίτημα στοιχείων",
                  lines: [`Μήνυμα μέσω ${b.channel} στον/στην ${name}: ζητάμε προσωπικό email και ώρα άφιξης.`, p.outreachSent ? "Έχει ήδη σταλεί μία φορά · θα πάει υπενθύμιση." : ""].filter(Boolean),
                  onConfirm: async () => {
                    const json = await guestPost({ action: "request" });
                    if (!json.ok) return setError(json.error || "Το αίτημα απέτυχε.");
                    onToast("Το αίτημα στάλθηκε ✓");
                    load();
                  },
                })
              }
              className="rounded-full bg-white px-3 py-1.5 font-bold text-[#92400e] ring-1 ring-[#fde3a7]"
            >
              Ζήτησέ τα μέσω {b.channel}
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-[6.5rem_1fr_auto] items-end gap-2">
        <label className="text-xs font-bold">Ώρα άφιξης<input type="time" value={arrival.time} onChange={(e) => setArrival({ ...arrival, time: e.target.value })} className={input} /></label>
        <label className="text-xs font-bold">Πώς έρχεται<input value={arrival.details} onChange={(e) => setArrival({ ...arrival, details: e.target.value })} placeholder="π.χ. Aegean A3 284" className={input} /></label>
        <button
          type="button"
          onClick={async () => {
            const json = await guestPost({ action: "arrival", time: arrival.time, details: arrival.details });
            if (!json.ok) return setError(json.error || "Δεν αποθηκεύτηκε.");
            onToast("Η ώρα άφιξης αποθηκεύτηκε");
            load();
          }}
          className="min-h-11 rounded-full border border-[#cfd9e4] px-3 text-xs font-bold"
        >
          Αποθήκευση
        </button>
      </div>

      <div className="rounded-xl border border-[#e3e9f0] p-3">
        <div className="mb-2 flex flex-wrap gap-1" role="tablist" aria-label="Κανάλι μηνύματος">
          {CH.map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={channel === c.key}
              onClick={() => setChannel(c.key)}
              title={c.ok ? "" : c.why}
              className={`min-h-9 rounded-full px-3 text-xs font-bold ${channel === c.key ? "bg-[#e9e4fe] text-[#3b2f8a]" : c.ok ? "bg-[#f4f7fa]" : "bg-[#f4f7fa] text-[#a3aebd] line-through"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="mb-2 flex flex-wrap gap-1">
          {templates(p.language, name, b.checkin).map((t) => (
            <button key={t.label} type="button" onClick={() => setMessage(t.text)} className="rounded-full border border-[#dbe3ec] px-2.5 py-1 text-[11px] font-semibold">
              {t.label}
            </button>
          ))}
        </div>
        {channel === "email" && <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Θέμα" aria-label="Θέμα email" className={`${input} mt-0 mb-2`} />}
        <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Γράψε το μήνυμα…" aria-label="Μήνυμα" className={`${input} mt-0`} />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-[#5b6b80]">
            {channel === "sms" ? `${message.length}/918 · ${Math.max(1, Math.ceil(message.length / 70))} SMS` : channel === "whatsapp" ? "Ανοίγει το WhatsApp σου με έτοιμο το κείμενο" : channel === "ota" ? `Πηγαίνει μέσα από το ${b.channel}` : p.realEmail ?? ""}
          </span>
          <button type="button" onClick={send} disabled={!current.ok} className="min-h-11 rounded-full bg-[#d2f3f6] px-5 text-sm font-bold text-[#0b4d55] disabled:opacity-50">
            {channel === "whatsapp" ? "Άνοιγμα WhatsApp" : `Αποστολή ${current.label}`}
          </button>
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs font-black uppercase tracking-wide text-[#5b6b80]">Επικοινωνία</div>
        {p.timeline.length === 0 && <p className="text-xs text-[#5b6b80]">Δεν έχει γίνει επικοινωνία ακόμα.</p>}
        <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
          {p.timeline.map((t, i) => (
            <li key={i} className={`rounded-lg px-3 py-2 text-xs ${t.direction === "in" ? "bg-[#e9f9ee]" : "bg-[#f4f7fa]"}`}>
              <div className="flex justify-between gap-2">
                <strong>{t.direction === "in" ? "← " : "→ "}{t.title}</strong>
                <span className="shrink-0 text-[#5b6b80]">{t.at}</span>
              </div>
              {t.body ? <div className="mt-0.5 whitespace-pre-line text-[#3d4b5e]">{t.body}</div> : null}
              {t.status ? <div className={`mt-0.5 font-semibold ${/fail|undeliver|reject/.test(t.status) ? "text-[#b45309]" : "text-[#5b6b80]"}`}>{t.status}</div> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------- extra charges ----------

const CHARGE_PRESETS = ["Πρωινό", "Ράντζο", "Κούνια", "Μεταφορά", "Late check-out", "Μίνι μπαρ", "Πλυντήριο"];

function AutoLines({ nights, stayTotal, nightPrice }: { nights: number; stayTotal: number | null; nightPrice?: number | null }) {
  if (nights <= 0) return null;
  const night = nightPrice ? nightPrice : stayTotal !== null ? Math.round((stayTotal / nights) * 100) / 100 : null;
  return (
    <ul className="divide-y divide-[#eef2f6] border-b border-[#eef2f6] text-sm">
      <li className="flex items-center justify-between gap-2 py-1.5">
        <span>
          <span className="font-semibold">Διαμονή</span>
          <span className="text-xs text-[#5b6b80]"> · {nights} {nights === 1 ? "βράδυ" : "βράδια"} × {night !== null ? euro(night) : "—"}</span>
        </span>
        <strong className="pr-10">{stayTotal !== null ? euro(stayTotal) : "—"}</strong>
      </li>
      <li className="flex items-center justify-between gap-2 py-1.5">
        <span>
          <span className="font-semibold">{CLIMATE_FEE_LABEL}</span>
          <span className="text-xs text-[#5b6b80]"> · {nights} × {euro(CLIMATE_FEE_PER_NIGHT)}</span>
        </span>
        <strong className="pr-10">{euro(nights * CLIMATE_FEE_PER_NIGHT)}</strong>
      </li>
    </ul>
  );
}

function Charges({
  booking: b,
  setConfirm,
  run,
  grandTotal,
  nights,
  stayTotal,
  nightPrice,
}: {
  booking: PlanBooking;
  setConfirm: (c: ConfirmState) => void;
  run: (body: Record<string, unknown>, okText: string) => Promise<void>;
  grandTotal: number | null;
  nights: number;
  stayTotal: number | null;
  nightPrice?: number | null;
}) {
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");
  const amount = Math.round((Number(qty.replace(",", ".")) || 0) * (Number(price.replace(",", ".")) || 0) * 100) / 100;

  return (
    <div className="space-y-2 rounded-lg bg-white p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wide text-[#5b6b80]">Χρεώσεις διαμονής</span>
        {grandTotal !== null && <span className="text-xs font-bold">{euro(grandTotal)}</span>}
      </div>
      {!b.masterId && <AutoLines nights={nights} stayTotal={stayTotal} nightPrice={nightPrice} />}
      {b.charges.length === 0 && <p className="text-xs text-[#5b6b80]">Καμία επιπλέον χρέωση.</p>}
      <ul className="divide-y divide-[#eef2f6] text-sm">
        {b.charges.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-2 py-1.5">
            <span className="min-w-0">
              <span className="font-semibold">{c.description}</span>
              <span className="text-xs text-[#5b6b80]"> · {c.qty} × {euro(c.unitPrice)} · {c.at}{c.beds24 === "failed" ? " · ⚠️ σημείωση στο Beds24" : ""}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <strong>{euro(c.amount)}</strong>
              <button
                type="button"
                aria-label={`Διαγραφή χρέωσης ${c.description}`}
                onClick={() =>
                  setConfirm({
                    title: "Διαγραφή χρέωσης",
                    lines: [`${c.description} · ${euro(c.amount)}`, "Στο Beds24 μπαίνει αντίστροφη γραμμή «Ακύρωση»."],
                    danger: true,
                    confirmLabel: "Διαγραφή",
                    onConfirm: () => run({ action: "charge_remove", id: b.id, chargeId: c.id }, "Η χρέωση διαγράφηκε"),
                  })
                }
                className="h-8 w-8 rounded-full text-[#5b6b80] hover:bg-[#f4f7fa]"
              >
                ×
              </button>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1">
        {CHARGE_PRESETS.map((preset) => (
          <button key={preset} type="button" onClick={() => setDesc(preset)} className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${desc === preset ? "border-[#5443c9] bg-[#ece9fd]" : "border-[#dbe3ec]"}`}>
            {preset}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_4rem_5.5rem] gap-2">
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Περιγραφή" aria-label="Περιγραφή χρέωσης" className={`${input} mt-0`} />
        <input inputMode="decimal" value={qty} onChange={(e) => setQty(e.target.value)} aria-label="Ποσότητα" className={`${input} mt-0`} />
        <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="€" aria-label="Τιμή μονάδας" className={`${input} mt-0`} />
      </div>
      <button
        type="button"
        disabled={!desc.trim() || amount <= 0}
        onClick={() =>
          setConfirm({
            title: "Νέα χρέωση",
            lines: [`${desc} · ${qty} × ${euro(Number(price.replace(",", ".")))} = ${euro(amount)}`, b.masterId ? "Μπαίνει στην κύρια κράτηση του group." : "", "Μπαίνει και στο τιμολόγιο του Beds24."].filter(Boolean),
            confirmLabel: "Προσθήκη",
            onConfirm: async () => {
              await run({ action: "charge_add", id: b.id, description: desc, qty, unitPrice: price }, `Χρέωση ${euro(amount)} προστέθηκε`);
              setDesc("");
              setQty("1");
              setPrice("");
            },
          })
        }
        className="min-h-11 w-full rounded-full border border-[#cfd9e4] text-sm font-bold disabled:opacity-50"
      >
        + Προσθήκη χρέωσης{amount > 0 ? ` (${euro(amount)})` : ""}
      </button>
      {grandTotal !== null && (
        <p className="text-xs text-[#3d4b5e]">Γενικό σύνολο (διαμονή + φόρος + χρεώσεις): <strong>{euro(grandTotal)}</strong></p>
      )}
    </div>
  );
}

const SECTION_TONES = {
  blue: { box: "border-[#cfe0fb] bg-[#f1f6ff]", title: "text-[#1e4fa3]" },
  purple: { box: "border-[#ddd5fb] bg-[#f6f3ff]", title: "text-[#3b2f8a]" },
  green: { box: "border-[#c5ecd6] bg-[#effbf4]", title: "text-[#17663f]" },
  teal: { box: "border-[#bfe6e6] bg-[#eefafa]", title: "text-[#14636a]" },
  pink: { box: "border-[#f4cfe0] bg-[#fdf2f7]", title: "text-[#9b2c5e]" },
  slate: { box: "border-[#dbe2ea] bg-[#f6f8fb]", title: "text-[#3e4c5e]" },
} as const;

function FormSection({ tone, title, children }: { tone: keyof typeof SECTION_TONES; title: string; children: ReactNode }) {
  const t = SECTION_TONES[tone];
  return (
    <section className={`space-y-2 rounded-xl border p-3 ${t.box}`}>
      <div className={`text-[11px] font-black uppercase tracking-wide ${t.title}`}>{title}</div>
      {children}
    </section>
  );
}

function NewCharges({
  charges,
  onChange,
  nights,
  rooms,
  stayTotal,
}: {
  charges: { description: string; qty: number; unitPrice: number }[];
  onChange: (c: { description: string; qty: number; unitPrice: number }[]) => void;
  nights: number;
  rooms: number;
  stayTotal: number | null;
}) {
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");
  const q = Number(qty.replace(",", ".")) || 0;
  const pr = Number(price.replace(",", ".")) || 0;
  return (
    <div className="space-y-2 rounded-xl border border-[#f6d6b8] bg-[#fff5ec] p-3">
      <div className="text-[11px] font-black uppercase tracking-wide text-[#9a4b12]">Χρεώσεις διαμονής</div>
      <AutoLines nights={nights * rooms} stayTotal={stayTotal} />
      {charges.map((c, i) => (
        <div key={i} className="flex items-center justify-between text-sm">
          <span>{c.description} · {c.qty} × {euro(c.unitPrice)}</span>
          <span className="flex items-center gap-2">
            <strong>{euro(c.qty * c.unitPrice)}</strong>
            <button type="button" aria-label={`Αφαίρεση ${c.description}`} onClick={() => onChange(charges.filter((_, j) => j !== i))} className="h-8 w-8 rounded-full hover:bg-[#f4f7fa]">×</button>
          </span>
        </div>
      ))}
      <div className="flex flex-wrap gap-1">
        {CHARGE_PRESETS.map((preset) => (
          <button key={preset} type="button" onClick={() => setDesc(preset)} className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${desc === preset ? "border-[#5443c9] bg-[#ece9fd]" : "border-[#dbe3ec]"}`}>
            {preset}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_4rem_5.5rem] gap-2">
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Περιγραφή" aria-label="Περιγραφή χρέωσης" className={`${input} mt-0`} />
        <input inputMode="decimal" value={qty} onChange={(e) => setQty(e.target.value)} aria-label="Ποσότητα" className={`${input} mt-0`} />
        <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="€" aria-label="Τιμή μονάδας" className={`${input} mt-0`} />
      </div>
      <button
        type="button"
        disabled={!desc.trim() || q <= 0 || pr <= 0}
        onClick={() => {
          onChange([...charges, { description: desc.trim(), qty: q, unitPrice: pr }]);
          setDesc("");
          setQty("1");
          setPrice("");
        }}
        className="min-h-11 w-full rounded-full border border-[#cfd9e4] text-sm font-bold disabled:opacity-50"
      >
        + Προσθήκη χρέωσης{q * pr > 0 ? ` (${euro(q * pr)})` : ""}
      </button>
      {nights > 0 && (
        <p className="text-xs text-[#3d4b5e]">
          Γενικό σύνολο (διαμονή + φόρος + χρεώσεις):{" "}
          <strong>{euro((stayTotal ?? 0) + nights * rooms * CLIMATE_FEE_PER_NIGHT + charges.reduce((sum, c) => sum + c.qty * c.unitPrice, 0))}</strong>
        </p>
      )}
    </div>
  );
}

// ---------- split stay ----------

function SplitStay({ booking: b, setConfirm, onDone }: { booking: PlanBooking; setConfirm: (c: ConfirmState) => void; onDone: (text: string) => void }) {
  const [day, setDay] = useState(addDays(b.checkin, 1));
  const [room, setRoom] = useState(0);
  const [free, setFree] = useState<number[] | null>(null);
  const [error, setError] = useState("");
  const options = Array.from({ length: Math.max(b.nights - 1, 0) }, (_, i) => addDays(b.checkin, i + 1));

  useEffect(() => {
    let alive = true;
    setFree(null);
    api(`/api/staff/pyrgos/plan/?free&from=${day}&to=${b.checkout}`).then((json) => alive && json.ok && setFree(json.free));
    return () => {
      alive = false;
    };
  }, [day, b.checkout]);

  function submit() {
    if (!room) return setError("Διάλεξε δωμάτιο.");
    setError("");
    const warning = categoryWarning(b, room);
    setConfirm({
      title: "Split stay",
      lines: [
        `${b.firstName} ${b.lastName}`,
        `${roomLabel(b.room)}: ${dm(b.checkin)} → ${dm(day)} (${diffDays(b.checkin, day)} ν.)`,
        `${roomLabel(room)}: ${dm(day)} → ${dm(b.checkout)} (${diffDays(day, b.checkout)} ν.)`,
        "Στο Beds24 γίνονται δύο κρατήσεις μαζί (group). Η τιμή μένει στην πρώτη.",
        ...(OTA.has(b.channel) ? [`Στο ${b.channel} η κράτηση μένει όπως είναι.`] : []),
      ],
      warning,
      requireCheck: warning ? "Ναι, θέλω αλλαγή κατηγορίας" : undefined,
      confirmLabel: "Split stay",
      onConfirm: async () => {
        const json = await post({ action: "split", id: b.id, splitDate: day, room, confirmCategory: Boolean(warning) });
        if (!json.ok) {
          setError(json.error || "Το split stay απέτυχε.");
          return;
        }
        onDone(`Split stay · ${roomLabel(b.room)} → ${roomLabel(room)} στις ${dm(day)} · Beds24 ✓`);
      },
    });
  }

  return (
    <section className="space-y-2 rounded-xl border border-[#e3e9f0] p-3">
      <h3 className="text-sm font-black uppercase tracking-wide text-[#5b6b80]">Split stay (αλλαγή δωματίου στη μέση)</h3>
      {error && <p className="rounded-lg bg-[#fff4dc] px-3 py-2 text-xs font-semibold text-[#92400e]">{error}</p>}
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs font-bold">
          Αλλάζει δωμάτιο στις
          <select value={day} onChange={(e) => setDay(e.target.value)} className={input}>
            {options.map((o) => (
              <option key={o} value={o}>{wd(o)} {dm(o)}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-bold">
          Νέο δωμάτιο
          <select value={room} onChange={(e) => setRoom(Number(e.target.value))} className={input}>
            <option value={0}>{free ? "Διάλεξε…" : "Φόρτωση…"}</option>
            {PYRGOS_ROOMS.filter((r) => r.number !== b.room && (!free || free.includes(r.number))).map((r) => (
              <option key={r.number} value={r.number}>{r.label} — {r.categoryLabel}</option>
            ))}
          </select>
        </label>
      </div>
      {room && categoryWarning(b, room) ? (
        <p className="rounded-lg border-2 border-[#f87171] bg-[#fef2f2] px-3 py-2 text-xs font-bold text-[#991b1b]">⚠️ {categoryWarning(b, room)}</p>
      ) : null}
      <button type="button" onClick={submit} className="min-h-11 rounded-full border border-[#cfd9e4] px-4 text-sm font-bold">Split stay</button>
    </section>
  );
}

// ---------- new booking ----------

const STEPS = ["Διαμονή", "Τιμή", "Πελάτης"];

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
    group: false,
    rooms: initial.room ? [initial.room] : [],
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
    breakfast: false,
    guestNote: "",
    charges: [] as { description: string; qty: number; unitPrice: number }[],
    notes: "",
    sendConfirmation: false,
    hold: false,
    holdRemindOn: addDays(athensToday(), 2),
    holdNote: "",
  });
  const [free, setFree] = useState<number[] | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const set = (patch: Record<string, unknown>) => setF((cur: any) => ({ ...cur, ...patch }));
  const nights = diffDays(f.checkin, f.checkout);
  const selectedRooms: number[] = f.group ? f.rooms : f.room ? [Number(f.room)] : [];

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
    const rooms: number[] = f.group ? f.rooms : f.room ? [Number(f.room)] : [];
    if (!rooms.length) return setError("Διάλεξε δωμάτιο.");
    if (free && rooms.some((r) => !free.includes(r))) return setError("Κάποιο δωμάτιο δεν είναι ελεύθερο αυτές τις μέρες.");
    if (nights <= 0) return setError("Έλεγξε τις ημερομηνίες.");
    if (!f.firstName.trim() || !f.lastName.trim()) return setError("Συμπλήρωσε όνομα και επώνυμο.");
    setError("");
    setConfirm({
      title: "Νέα κράτηση",
      lines: [
        `${f.firstName} ${f.lastName} · ${f.children ? `${f.adults}+${f.children}` : f.adults} άτομα`,
        `${rooms.map((r) => roomLabel(r)).join(", ")} · ${dm(f.checkin)} → ${dm(f.checkout)} · ${nights} νύχτες`,
        `Σύνολο ${f.total ? euro(Number(f.total)) : "χωρίς τιμή"}${rooms.length > 1 ? " για όλο το group" : ""}${f.deposit ? ` · προκαταβολή ${euro(Number(f.deposit))}` : ""}`,
        ...(rooms.length > 1 ? [`Group: ${rooms.length} κρατήσεις στο Beds24, η τιμή στην πρώτη (${roomLabel(rooms[0])}).`, "Τα άτομα ισχύουν για κάθε δωμάτιο."] : []),
        `${CLIMATE_FEE_LABEL}: ${nights * rooms.length} × ${euro(CLIMATE_FEE_PER_NIGHT)} = ${euro(nights * rooms.length * CLIMATE_FEE_PER_NIGHT)} (μπαίνει στο τιμολόγιο Beds24)`,
        [f.breakfast ? "Πρωινό" : "", f.cot ? "Κούνια" : "", f.rollaway ? "Ράντζο" : ""].filter(Boolean).join(" · ") || "Χωρίς πρωινό / κούνια / ράντζο",
        ...(f.guestNote.trim() ? [`Σημείωση στην επιβεβαίωση: «${f.guestNote.trim().slice(0, 120)}»`] : []),
        ...(f.charges.length
          ? [`Χρεώσεις: ${f.charges.map((c: any) => `${c.description} ${euro(c.qty * c.unitPrice)}`).join(", ")}`]
          : []),
        "Email επιβεβαίωσης: δεν φεύγει αυτόματα — preview και αποστολή από το CRM.",
        ...(f.hold ? [`⏳ Σε αναμονή · υπενθύμιση με email στις ${dm(f.holdRemindOn)}${f.holdNote.trim() ? ` · ${f.holdNote.trim()}` : ""}`] : []),
        "Θα καταχωρηθεί στο Beds24 ως κανονική κράτηση (κλείνει διαθεσιμότητα).",
      ],
      confirmLabel: "Καταχώρηση",
      onConfirm: async () => {
        const json = await post({
          action: "create",
          room: rooms[0],
          rooms,
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
          breakfast: f.breakfast,
          guestNote: f.guestNote,
          charges: f.charges,
          notes: f.notes,
          hold: f.hold ? { remindOn: f.holdRemindOn, note: f.holdNote } : null,
        });
        if (!json.ok) {
          setError(json.error || "Η καταχώρηση απέτυχε.");
          return;
        }
        const email = json.result?.email;
        onCreated(`${rooms.length > 1 ? `Group ${rooms.length} δωματίων` : "Νέα κράτηση"} #${json.result.id} · Beds24 ✓${email === "sent" ? " · email ✓" : email === "failed" ? " · ⚠️ email δεν στάλθηκε" : ""}`);
      },
    });
  }

  const stepValid = [step0Error() === "", true, true];
  function step0Error() {
    if (nights <= 0) return "Έλεγξε τις ημερομηνίες.";
    if (!selectedRooms.length) return "Διάλεξε δωμάτιο.";
    if (free && selectedRooms.some((r) => !free.includes(r))) return "Κάποιο δωμάτιο δεν είναι ελεύθερο αυτές τις μέρες.";
    return "";
  }
  function goTo(target: number) {
    if (target > step) {
      const msg = step0Error();
      if (msg) return setError(msg);
    }
    setError("");
    setStep(target);
  }
  function next() {
    if (step < STEPS.length - 1) goTo(step + 1);
    else submit();
  }
  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== "Enter" || e.shiftKey) return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "TEXTAREA" || tag === "BUTTON" || tag === "SELECT") return;
    e.preventDefault();
    next();
  }
  const people = Number(f.children) ? `${f.adults}+${f.children} άτ.` : `${f.adults} άτ.`;
  const summary = [
    nights > 0 ? `${dm(f.checkin)}–${dm(f.checkout)} · ${nights} ${nights === 1 ? "νύχτα" : "νύχτες"}` : "",
    selectedRooms.length ? selectedRooms.map((r) => roomLabel(r)).join(", ") : "χωρίς δωμάτιο",
    people,
    f.total ? euro(Number(f.total)) : "",
    [f.firstName, f.lastName].filter(Boolean).join(" "),
  ].filter(Boolean);
  const visibleRooms = PYRGOS_ROOMS.filter((r) => !free || free.includes(r.number) || selectedRooms.includes(r.number));

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#1f2a3c]/40 p-4" role="dialog" aria-modal="true" aria-labelledby="nb-title">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl" onKeyDown={onKeyDown}>
        <div className="mb-3 flex items-center justify-between">
          <h2 id="nb-title" className="text-xl font-black">Νέα κράτηση</h2>
          <button type="button" onClick={onClose} aria-label="Κλείσιμο" className="h-10 w-10 rounded-full bg-[#f4f7fa] text-xl">×</button>
        </div>
        <ol className="mb-3 grid grid-cols-3 gap-1.5" aria-label="Βήματα">
          {STEPS.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={step === i ? "step" : undefined}
                className={`flex min-h-11 w-full items-center gap-2 rounded-xl border px-3 text-left text-sm font-bold ${step === i ? "border-[#5443c9] bg-[#e9e4fe] text-[#3b2f8a]" : i < step ? "border-[#c5ecd6] bg-[#effbf4] text-[#17663f]" : "border-[#e3e9f0] bg-white text-[#5b6b80]"}`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${step === i ? "bg-[#5443c9] text-white" : i < step ? "bg-[#17663f] text-white" : "bg-[#eef2f6]"}`}>{i < step ? "✓" : i + 1}</span>
                {label}
              </button>
            </li>
          ))}
        </ol>
        <div className="mb-3 rounded-xl bg-[#f4f7fa] px-3 py-2 text-sm font-semibold text-[#1f2a3c]" aria-live="polite">{summary.join(" · ")}</div>
        {error && <p className="mb-3 rounded-xl bg-[#fff4dc] px-3 py-2 text-sm font-semibold text-[#92400e]">{error}</p>}
        {step === 0 && (
          <div className="space-y-3">
            <FormSection tone="blue" title="📅 Ημερομηνίες & άτομα">
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold">Check-in<input type="date" value={f.checkin} onChange={(e) => set({ checkin: e.target.value, checkout: e.target.value >= f.checkout ? addDays(e.target.value, 1) : f.checkout })} className={input} /></label>
              <label className="text-xs font-bold">Check-out<input type="date" value={f.checkout} min={addDays(f.checkin, 1)} onChange={(e) => set({ checkout: e.target.value })} className={input} /></label>
              <label className="text-xs font-bold">Ενήλικες<input type="number" min={1} max={8} value={f.adults} onChange={(e) => set({ adults: e.target.value })} className={input} /></label>
              <label className="text-xs font-bold">Παιδιά<input type="number" min={0} max={6} value={f.children} onChange={(e) => set({ children: e.target.value })} className={input} /></label>
            </div>
            </FormSection>
            <FormSection tone="purple" title="🛏️ Δωμάτιο">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold">{f.group ? `Δωμάτια (${f.rooms.length})` : "Δωμάτιο"} {free ? <span className="font-normal text-[#5b6b80]">· ελεύθερα: {free.length}</span> : null}</div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#3b2f8a]">
                  <input type="checkbox" className="h-4 w-4" checked={f.group} onChange={(e) => set({ group: e.target.checked, rooms: f.room ? [Number(f.room)] : [] })} />
                  Group (πολλά δωμάτια)
                </label>
              </div>
              {free && !visibleRooms.length ? (
                <p className="rounded-lg bg-white px-3 py-3 text-sm font-semibold text-[#92400e]">Κανένα ελεύθερο δωμάτιο αυτές τις μέρες.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {visibleRooms.map((r) => {
                    const selected = f.group ? f.rooms.includes(r.number) : Number(f.room) === r.number;
                    const isFree = !free || free.includes(r.number);
                    return (
                      <button
                        key={r.number}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          f.group
                            ? set({
                                rooms: f.rooms.includes(r.number) ? f.rooms.filter((x: number) => x !== r.number) : [...f.rooms, r.number],
                                room: f.rooms.includes(r.number) ? f.rooms.filter((x: number) => x !== r.number)[0] ?? 0 : f.room || r.number,
                              })
                            : set({ room: r.number, rooms: [r.number], night: "", total: "", priceMode: null })
                        }
                        className={`min-h-14 rounded-xl border px-3 py-2 text-left ${selected ? "border-[#5443c9] bg-[#e9e4fe] text-[#3b2f8a] ring-2 ring-[#5443c9]" : "border-[#cfd9e4] bg-white hover:border-[#5443c9]"}`}
                      >
                        <span className="block text-sm font-black">{r.label}</span>
                        <span className={`block text-xs ${isFree ? "text-[#5b6b80]" : "font-bold text-[#b45309]"}`}>{isFree ? r.categoryLabel : "δεν είναι ελεύθερο"}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </FormSection>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <FormSection tone="green" title="💶 Τιμή & πληρωμή">
            <PriceFields nights={nights} mode={f.priceMode} night={f.night} total={f.total} onChange={(v) => set({ priceMode: v.mode, night: v.night, total: v.total })} />
            <div className="grid grid-cols-2 items-end gap-2">
              <label className="text-xs font-bold">Προκαταβολή<input inputMode="decimal" value={f.deposit} onChange={(e) => set({ deposit: e.target.value.replace(",", ".") })} className={input} /></label>
              <label className="flex min-h-11 items-center gap-2 text-sm font-bold"><input type="checkbox" className="h-5 w-5" checked={f.paid} onChange={(e) => set({ paid: e.target.checked })} /> Πληρωμένη</label>
            </div>
            </FormSection>
            <NewCharges
              charges={f.charges}
              onChange={(charges) => set({ charges })}
              nights={nights}
              rooms={f.group ? Math.max(f.rooms.length, 1) : 1}
              stayTotal={f.total ? Number(f.total) : null}
            />
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-3">
            <FormSection tone="teal" title="👤 Στοιχεία πελάτη">
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold">Όνομα<input value={f.firstName} onChange={(e) => set({ firstName: e.target.value })} className={input} /></label>
              <label className="text-xs font-bold">Επώνυμο<input value={f.lastName} onChange={(e) => set({ lastName: e.target.value })} className={input} /></label>
            </div>
            <label className="block text-xs font-bold">Email<input type="email" value={f.email} onChange={(e) => set({ email: e.target.value })} className={input} /></label>
            <div className="grid grid-cols-[1fr_6rem] gap-2">
              <label className="text-xs font-bold">Κινητό<input type="tel" value={f.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+30 69…" className={input} /></label>
              <label className="text-xs font-bold">Χώρα<input value={f.country} maxLength={2} onChange={(e) => set({ country: e.target.value.toUpperCase() })} placeholder="GR" title="Κωδικός χώρας με λατινικά, π.χ. GR, DE, IT" className={input} /></label>
            </div>
            </FormSection>
            </div>
            <div className="space-y-3">
            <FormSection tone="pink" title="🧺 Κρεβάτια & πρωινό">
            <label className="block text-xs font-bold">
              Κρεβάτια
              <select value={f.bedSetup} onChange={(e) => set({ bedSetup: e.target.value })} className={input}>
                <option value="">—</option>
                {BED_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-x-4">
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-5 w-5" checked={f.breakfast} onChange={(e) => set({ breakfast: e.target.checked })} /> Πρωινό περιλαμβάνεται</label>
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-5 w-5" checked={f.cot} onChange={(e) => set({ cot: e.target.checked })} /> Κούνια</label>
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-5 w-5" checked={f.rollaway} onChange={(e) => set({ rollaway: e.target.checked })} /> Ράντζο</label>
            </div>
            </FormSection>
            <FormSection tone="slate" title="📝 Σημειώσεις">
            <label className="block text-xs font-bold">
              Σημείωση για τον πελάτη <span className="font-normal text-[#5443c9]">· φαίνεται στην επιβεβαίωση</span>
              <textarea rows={2} value={f.guestNote} onChange={(e) => set({ guestNote: e.target.value })} placeholder="π.χ. Συμφωνήσαμε δωρεάν μεταφορά από το αεροδρόμιο" className={input} />
            </label>
            <label className="block text-xs font-bold">
              Εσωτερικές σημειώσεις <span className="font-normal text-[#5b6b80]">· μόνο για εμάς</span>
              <textarea rows={2} value={f.notes} onChange={(e) => set({ notes: e.target.value })} className={input} />
            </label>
            </FormSection>
            <div className="rounded-xl border border-[#fde3a7] bg-[#fff8e8] p-3">
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={f.hold}
                  onChange={(e) => set({ hold: e.target.checked, sendConfirmation: e.target.checked ? false : f.sendConfirmation })}
                />
                <span>⏳ Σε αναμονή <span className="text-xs font-normal text-[#5b6b80]">· δεν έχει επιβεβαιωθεί ακόμα</span></span>
              </label>
              {f.hold && (
                <div className="mt-1 grid gap-2 sm:grid-cols-2">
                  <label className="block text-xs font-bold">
                    Υπενθύμιση στις
                    <input type="date" value={f.holdRemindOn} min={athensToday()} onChange={(e) => set({ holdRemindOn: e.target.value })} className={input} />
                  </label>
                  <label className="block text-xs font-bold">
                    Σημείωση
                    <input value={f.holdNote} onChange={(e) => set({ holdNote: e.target.value })} placeholder="π.χ. περιμένουμε προκαταβολή" className={input} />
                  </label>
                </div>
              )}
            </div>
            </div>
          </div>
        )}
        <div className="mt-4 flex items-center justify-between gap-2">
          <button type="button" onClick={step === 0 ? onClose : () => goTo(step - 1)} className="min-h-11 rounded-full px-4 text-sm font-bold text-[#4b5b70]">
            {step === 0 ? "Άκυρο" : "← Πίσω"}
          </button>
          <button
            type="button"
            onClick={next}
            className={`min-h-11 rounded-full px-6 text-sm font-bold ${stepValid[step] ? "bg-[#5443c9] text-white" : "bg-[#e9e4fe] text-[#3b2f8a] opacity-70"}`}
          >
            {step < STEPS.length - 1 ? "Επόμενο →" : "Συνέχεια"}
          </button>
        </div>
      </div>
    </div>
  );
}

function HoldSection({ b, onDone, setError }: { b: PlanBooking; onDone: (text: string) => Promise<void>; setError: (e: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(b.hold?.remindOn ?? addDays(athensToday(), 2));
  const [note, setNote] = useState(b.hold?.note ?? "");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setDate(b.hold?.remindOn ?? addDays(athensToday(), 2));
    setNote(b.hold?.note ?? "");
    setEditing(false);
  }, [b.id, b.hold?.remindOn, b.hold?.note]);
  if (b.status === "black") return null;
  const run = async (body: Record<string, unknown>, text: string) => {
    setBusy(true);
    const json = await post(body);
    setBusy(false);
    if (!json.ok) {
      setError(json.error || "Δεν αποθηκεύτηκε.");
      return;
    }
    await onDone(text);
  };
  const form = (
    <div className="mt-2 grid gap-2 sm:grid-cols-2">
      <label className="block text-xs font-bold">
        Υπενθύμιση στις
        <input type="date" value={date} min={athensToday()} onChange={(e) => setDate(e.target.value)} className={input} />
      </label>
      <label className="block text-xs font-bold">
        Σημείωση
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="π.χ. περιμένουμε προκαταβολή" className={input} />
      </label>
      <button
        type="button"
        disabled={busy}
        onClick={() => run({ action: "hold_set", id: b.id, remindOn: date, note }, b.hold ? "Άλλαξε η υπενθύμιση" : "Σε αναμονή")}
        className="min-h-11 rounded-full bg-[#fde3a7] px-4 text-sm font-bold text-[#7c4a03] sm:col-span-2"
      >
        {b.hold ? "Αποθήκευση υπενθύμισης" : "Βάλε σε αναμονή"}
      </button>
    </div>
  );
  if (!b.hold) {
    return (
      <details className="rounded-xl border border-[#eef2f6] px-3 py-2 text-sm">
        <summary className="cursor-pointer font-semibold text-[#5b6b80]">⏳ Βάλε σε αναμονή (δεν έχει επιβεβαιωθεί)</summary>
        {form}
      </details>
    );
  }
  return (
    <section className={`rounded-2xl border-2 border-dashed p-3 text-sm ${b.hold.due ? "border-[#e8a0a0] bg-[#fff1f1]" : "border-[#f2c66d] bg-[#fff8e8]"}`}>
      <p className="font-black">⏳ Σε αναμονή · δεν έχει επιβεβαιωθεί</p>
      <p className="text-[#3d4b5e]">
        Υπενθύμιση: <strong>{dm(b.hold.remindOn)}</strong>
        {b.hold.due ? <span className="font-bold text-[#b42318]"> · ήρθε η ώρα: ισχύει ή διαγραφή;</span> : null}
      </p>
      {b.hold.note ? <p className="text-xs text-[#5b6b80]">{b.hold.note}</p> : null}
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => run({ action: "hold_confirm", id: b.id }, "Η κράτηση επιβεβαιώθηκε")}
          className="min-h-11 rounded-full bg-[#dff5e8] px-4 text-sm font-bold text-[#17603a]"
        >
          ✓ Επιβεβαιώθηκε
        </button>
        <button type="button" onClick={() => setEditing((v) => !v)} className="min-h-11 rounded-full border border-[#cfd9e4] px-4 text-sm font-bold text-[#4b5b70]">
          Αλλαγή ημερομηνίας υπενθύμισης
        </button>
      </div>
      {editing && form}
      <p className="mt-2 text-xs text-[#5b6b80]">Για διαγραφή: «Ακύρωση κράτησης» στο τέλος.</p>
    </section>
  );
}

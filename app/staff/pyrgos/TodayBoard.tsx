"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { HousekeepingTask, TodayData, TodayStay } from "@/lib/pyrgos/today";

type BedSetup = "double" | "twin" | "double_single" | "double_two_singles";
type Status = HousekeepingTask["status"];

const BED_OPTIONS: { value: BedSetup; label: string }[] = [
  { value: "double", label: "Διπλό" },
  { value: "twin", label: "2 μονά χωριστά" },
  { value: "double_single", label: "Διπλό + 1 μονό" },
  { value: "double_two_singles", label: "Διπλό + 2 μονά" },
];

const athensToday = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Athens" }).format(new Date());
const shiftDay = (day: string, delta: number) =>
  new Date(Date.parse(`${day}T12:00:00Z`) + delta * 86_400_000).toISOString().slice(0, 10);
const dayLabel = (day: string) =>
  new Intl.DateTimeFormat("el-GR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${day}T12:00:00Z`),
  );
const shortDate = (day: string) =>
  new Intl.DateTimeFormat("el-GR", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${day}T12:00:00Z`));
const euro = (n: number) => new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const roomName = (room: number) => (room >= 8 ? `Διαμ. ${room}` : `Δωμ. ${room}`);

const CHANNEL_STYLE: Record<string, string> = {
  Booking: "bg-[#d6eefc] text-[#0c4a6e]",
  Expedia: "bg-[#ffe7bd] text-[#5a3a00]",
  Απευθείας: "bg-[#d2f3f6] text-[#0b4d55]",
};

const TASK_LABEL: Record<HousekeepingTask["kind"], string> = {
  turnover: "Φεύγει & έρχεται",
  prepare: "Ετοιμασία για άφιξη",
  checkout: "Αναχώρηση · πλήρες καθάρισμα",
  stay: "Παραμονή · ανανέωση",
};

const STATUS_NEXT: Record<Status, Status> = { pending: "cleaning", cleaning: "done", done: "pending" };
const STATUS_UI: Record<Status, { label: string; className: string }> = {
  pending: { label: "Θέλει καθάρισμα", className: "bg-[#ffe7bd] text-[#5a3a00]" },
  cleaning: { label: "Καθαρίζεται", className: "bg-[#d6eefc] text-[#0c4a6e]" },
  done: { label: "Καθαρό ✓", className: "bg-[#d3f2dc] text-[#14532d]" },
};

function peopleText(stay: TodayStay) {
  if (stay.adults === null) return "άτομα;";
  const adults = `${stay.adults} ${stay.adults === 1 ? "ενήλικας" : "ενήλικες"}`;
  return stay.children ? `${adults} + ${stay.children} ${stay.children === 1 ? "παιδί" : "παιδιά"}` : adults;
}

function emiMessage(day: string, tasks: HousekeepingTask[]) {
  const open = tasks.filter((task) => task.status !== "done");
  const lines = open.map((task, index) => {
    const parts = [
      `${index + 1}. ${roomName(task.room)}`,
      TASK_LABEL[task.kind],
      task.arrivalTime ? `άφιξη ${task.arrivalTime}` : "",
      task.people !== null && task.kind !== "checkout" ? `${task.people} άτομα` : "",
      task.kind !== "checkout" && task.kind !== "stay" ? task.bedsText : "",
    ].filter(Boolean);
    return parts.join(" · ");
  });
  return [`Καθαριότητα ${shortDate(day)}`, "", ...lines].join("\n");
}

const card = "rounded-2xl border border-[#e3e9f0] bg-white p-5";

export default function TodayBoard() {
  const [day, setDay] = useState(athensToday);
  const [data, setData] = useState<TodayData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const load = useCallback(async (target: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/staff/pyrgos/?day=${target}`, { cache: "no-store" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setData(json.data);
    } catch {
      setError("Δεν φόρτωσε η εικόνα της ημέρας. Δοκίμασε ξανά.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(day);
  }, [day, load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function post(body: Record<string, unknown>) {
    const res = await fetch("/api/staff/pyrgos/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async function cycleStatus(task: HousekeepingTask) {
    if (!data) return;
    const status = STATUS_NEXT[task.status];
    setData({ ...data, housekeeping: data.housekeeping.map((t) => (t.room === task.room ? { ...t, status } : t)) });
    const json = await post({ action: "housekeeping", day, room: task.room, status }).catch(() => null);
    if (!json?.ok) {
      setToast("Δεν αποθηκεύτηκε η καθαριότητα");
      load(day);
    }
  }

  const occupiedTonight = data ? 10 - data.free.length : 0;
  const noTime = data ? data.arriving.filter((stay) => !stay.arrivalTime).length : 0;
  const message = useMemo(() => (data ? emiMessage(day, data.housekeeping) : ""), [data, day]);
  const today = athensToday();

  return (
    <div className="min-h-screen bg-[#eef3f7] text-[#1f2a3c]">
      <div className="flex flex-wrap">
        <nav aria-label="Μενού πύργου ελέγχου" className="flex w-full flex-wrap gap-1 border-b border-[#e3e9f0] bg-white p-3 lg:min-h-screen lg:w-56 lg:flex-col lg:flex-nowrap lg:border-b-0 lg:border-r lg:p-4">
          <div className="hidden px-3 pb-4 lg:block">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5443c9]">Voulamandis House</div>
            <div className="text-lg font-black">Πύργος ελέγχου</div>
          </div>
          <a href="/staff/pyrgos" aria-current="page" className="rounded-xl bg-[#e9e4fe] px-3 py-2.5 text-sm font-bold text-[#3b2f8a]">Σήμερα</a>
          <span className="rounded-xl px-3 py-2.5 text-sm text-[#8a97a8]" title="Έρχεται στο βήμα 2">Πλάνο (σύντομα)</span>
          <a href="/staff/crm" className="rounded-xl px-3 py-2.5 text-sm text-[#4b5b70] hover:bg-[#f4f7fa]">Πελάτες (CRM)</a>
          <a href="#katharismos" className="rounded-xl px-3 py-2.5 text-sm text-[#4b5b70] hover:bg-[#f4f7fa]">Καθαριότητα</a>
          <a href="/staff/statistics" className="rounded-xl px-3 py-2.5 text-sm text-[#4b5b70] hover:bg-[#f4f7fa]">Στατιστικά</a>
          <a href="/staff/expenses" className="rounded-xl px-3 py-2.5 text-sm text-[#4b5b70] hover:bg-[#f4f7fa]">Έξοδα</a>
          <a href="/staff" className="rounded-xl px-3 py-2.5 text-sm text-[#4b5b70] hover:bg-[#f4f7fa] lg:mt-auto">← Παλιό staff</a>
        </nav>

        <main className="min-w-0 flex-1 space-y-5 p-4 sm:p-6 lg:p-8">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold capitalize text-[#5b6b80]">{dayLabel(day)}</p>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{day === today ? "Σήμερα" : "Ημέρα"}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setDay(shiftDay(day, -1))} aria-label="Προηγούμενη μέρα" className="h-11 w-11 rounded-full border border-[#dbe3ec] bg-white text-lg">‹</button>
              <button type="button" onClick={() => setDay(today)} className="h-11 rounded-full border border-[#dbe3ec] bg-white px-4 text-sm font-bold">Σήμερα</button>
              <button type="button" onClick={() => setDay(shiftDay(day, 1))} aria-label="Επόμενη μέρα" className="h-11 w-11 rounded-full border border-[#dbe3ec] bg-white text-lg">›</button>
              <input
                type="date"
                value={day}
                onChange={(e) => e.target.value && setDay(e.target.value)}
                aria-label="Επιλογή ημέρας"
                className="h-11 rounded-full border border-[#dbe3ec] bg-white px-4 text-sm"
              />
            </div>
          </header>

          {error && <p className="rounded-xl bg-[#fff4dc] px-4 py-3 text-sm font-semibold text-[#92400e]">{error}</p>}
          {loading && !data && <p className="text-sm text-[#5b6b80]">Φόρτωση…</p>}

          {data && (
            <>
              <section aria-label="Σύνοψη ημέρας" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div className="rounded-2xl bg-[#ffe7bd] p-4 text-[#5a3a00]">
                  <div className="text-sm font-semibold opacity-85">Αφίξεις</div>
                  <div className="mt-1 text-3xl font-black">{data.arriving.length}</div>
                  <div className="text-xs opacity-85">{noTime ? `${noTime} χωρίς ώρα άφιξης` : "όλες με ώρα"}</div>
                </div>
                <div className="rounded-2xl bg-[#d6eefc] p-4 text-[#0c4a6e]">
                  <div className="text-sm font-semibold opacity-85">Αναχωρήσεις</div>
                  <div className="mt-1 text-3xl font-black">{data.leaving.length}</div>
                  <div className="text-xs opacity-85">check-out έως 11:00</div>
                </div>
                <div className="rounded-2xl bg-[#e9e4fe] p-4 text-[#3b2f8a]">
                  <div className="text-sm font-semibold opacity-85">Μένουν απόψε</div>
                  <div className="mt-1 text-3xl font-black">{occupiedTonight} / 10</div>
                  <div className="text-xs opacity-85">Πληρότητα {occupiedTonight * 10}%</div>
                </div>
                <div className="rounded-2xl bg-[#d2f3f6] p-4 text-[#0b4d55]">
                  <div className="text-sm font-semibold capitalize opacity-85">Έσοδα {data.month.label}</div>
                  <div className="mt-1 text-3xl font-black">{euro(data.month.net)}</div>
                  <div className="text-xs opacity-85">καθαρά μετά προμήθειες · μικτά {euro(data.month.gross)}</div>
                </div>
              </section>

              <div className="grid gap-5 xl:grid-cols-3">
                <section aria-labelledby="arr" className={`${card} space-y-3 xl:col-span-2`}>
                  <h2 id="arr" className="text-lg font-black">Αφίξεις & αναχωρήσεις</h2>
                  {data.arriving.length === 0 && data.leaving.length === 0 && (
                    <p className="text-sm text-[#5b6b80]">Καμία άφιξη ή αναχώρηση αυτή τη μέρα.</p>
                  )}
                  <ul className="space-y-2">
                    {data.arriving.map((stay) => (
                      <li key={`a-${stay.room}-${stay.bookingId}`} className="rounded-xl bg-[#f4f7fa] p-3">
                        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto]">
                          <span className="self-start rounded-full bg-[#d3f2dc] px-2 py-1 text-center text-[11px] font-black text-[#14532d]">ΑΦΙΞΗ</span>
                          <div className="min-w-0">
                            <div className="font-black">{stay.name || "Χωρίς όνομα"}</div>
                            <div className="text-xs text-[#5b6b80]">
                              {roomName(stay.room)} · {peopleText(stay)}
                              {stay.checkout ? ` · έως ${shortDate(stay.checkout)}` : ""}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-semibold">🛏 {stay.bedsText || "κρεβάτια;"}</span>
                              {stay.bedSuggested && <span className="text-[#5b6b80]">(πρόταση)</span>}
                              <button
                                type="button"
                                onClick={() => setEditing(editing === stay.bookingId ? null : stay.bookingId)}
                                className="rounded-full border border-[#cfd9e4] bg-white px-3 py-1 font-bold text-[#3b2f8a]"
                              >
                                Κρεβάτια & εξοπλισμός
                              </button>
                            </div>
                          </div>
                          <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1 sm:flex-col sm:items-end">
                            {stay.channel && <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${CHANNEL_STYLE[stay.channel]}`}>{stay.channel}</span>}
                            {stay.arrivalTime ? (
                              <span className="text-sm font-black">{stay.arrivalTime}{stay.arrivalDetails ? ` · ${stay.arrivalDetails}` : ""}</span>
                            ) : (
                              <span className="rounded-full bg-[#fff4dc] px-2 py-0.5 text-xs font-bold text-[#92400e]">Λείπει ώρα</span>
                            )}
                          </div>
                        </div>
                        {editing === stay.bookingId && (
                          <ExtrasEditor
                            stay={stay}
                            onClose={() => setEditing(null)}
                            onSaved={(beds24ok) => {
                              setEditing(null);
                              setToast(beds24ok ? "Αποθηκεύτηκε και στο Beds24" : "Αποθηκεύτηκε · ⚠️ όχι στο Beds24");
                              load(day);
                            }}
                          />
                        )}
                      </li>
                    ))}
                    {data.leaving.map((stay) => (
                      <li key={`d-${stay.room}-${stay.bookingId}`} className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-[#f4f7fa] p-3">
                        <span className="rounded-full bg-[#fff1d6] px-2 py-1 text-center text-[11px] font-black text-[#92400e]">ΦΕΥΓΕΙ</span>
                        <div className="min-w-0">
                          <div className="font-black">{stay.name || "Χωρίς όνομα"}</div>
                          <div className="text-xs text-[#5b6b80]">{roomName(stay.room)} · {peopleText(stay)}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {stay.channel && <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${CHANNEL_STYLE[stay.channel]}`}>{stay.channel}</span>}
                          <span className="text-xs font-bold">έως 11:00</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section id="katharismos" aria-labelledby="hk" className={`${card} space-y-3`}>
                  <div className="flex items-center justify-between gap-2">
                    <h2 id="hk" className="text-lg font-black">Καθαριότητα</h2>
                    {data.housekeeping.some((t) => t.status !== "done") && (
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-[#d2f3f6] px-3 py-2 text-xs font-bold text-[#0b4d55]"
                      >
                        Αποστολή στην Έμη
                      </a>
                    )}
                  </div>
                  {data.housekeeping.length === 0 && <p className="text-sm text-[#5b6b80]">Δεν υπάρχει καθάρισμα αυτή τη μέρα.</p>}
                  <ul className="space-y-2">
                    {data.housekeeping.map((task, index) => (
                      <li key={task.room} className="flex items-center justify-between gap-3 rounded-xl border border-[#eef2f6] p-3">
                        <div className="min-w-0">
                          <div className="text-sm font-black">
                            {index === 0 && task.kind === "turnover" && task.status !== "done" ? "① " : ""}
                            {roomName(task.room)}
                          </div>
                          <div className="text-xs text-[#5b6b80]">
                            {TASK_LABEL[task.kind]}
                            {task.arrivalTime ? ` · άφιξη ${task.arrivalTime}` : ""}
                          </div>
                          {(task.kind === "turnover" || task.kind === "prepare") && (
                            <div className="text-xs font-semibold">
                              {task.people !== null ? `${task.people} άτομα · ` : ""}
                              {task.bedsText || "κρεβάτια;"}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => cycleStatus(task)}
                          className={`min-h-11 shrink-0 rounded-full px-3 text-xs font-bold ${STATUS_UI[task.status].className}`}
                          aria-label={`${roomName(task.room)}: ${STATUS_UI[task.status].label}. Πάτα για αλλαγή.`}
                        >
                          {STATUS_UI[task.status].label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <section aria-labelledby="miss" className={`${card} space-y-2`}>
                  <h2 id="miss" className="text-lg font-black">
                    Λείπουν στοιχεία <span className="text-sm font-semibold text-[#5b6b80]">· επόμενες 14 μέρες</span>
                  </h2>
                  {data.missing.length === 0 && <p className="text-sm text-[#5b6b80]">Δεν λείπει τίποτα. 👍</p>}
                  <ul className="divide-y divide-[#eef2f6]">
                    {data.missing.map((item) => (
                      <li key={item.bookingIds.join("-")} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                        <span className="text-sm">
                          <strong>{item.name}</strong> · {item.channel} · {shortDate(item.checkin)}
                          <br />
                          <span className="text-xs text-[#92400e]">{item.missing.join(", ")}</span>
                        </span>
                        <a href="/staff/crm" className="rounded-full border border-[#cfd9e4] px-3 py-1.5 text-xs font-bold">Ζήτησέ το</a>
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="feed" className={`${card} space-y-1`}>
                  <h2 id="feed" className="text-lg font-black">Τι έγινε <span className="text-sm font-semibold text-[#5b6b80]">· 3 τελευταίες μέρες</span></h2>
                  {data.feed.length === 0 && <p className="text-sm text-[#5b6b80]">Καμία αλλαγή.</p>}
                  <ul className="divide-y divide-[#eef2f6]">
                    {data.feed.map((item, i) => (
                      <li key={i} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-2.5 text-sm">
                        <span className="text-xs font-semibold text-[#5b6b80]">{item.time}</span>
                        <span>
                          <strong className={item.tone === "cancel" ? "text-[#92400e]" : ""}>{item.title}</strong>
                          <br />
                          <span className="text-xs text-[#4b5b70]">{item.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </>
          )}
        </main>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#1f2a3c] px-5 py-2.5 text-sm font-bold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function ExtrasEditor({ stay, onClose, onSaved }: { stay: TodayStay; onClose: () => void; onSaved: (beds24ok: boolean) => void }) {
  const [bedSetup, setBedSetup] = useState<BedSetup | "">(stay.bedSetup ?? "");
  const [cot, setCot] = useState(stay.cot);
  const [rollaway, setRollaway] = useState(stay.rollaway);
  const [other, setOther] = useState(stay.other);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/staff/pyrgos/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "extras", bookingId: stay.bookingId, bedSetup: bedSetup || null, cot, rollaway, other }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      onSaved(json.beds24 === "ok");
    } catch {
      setError("Η αποθήκευση απέτυχε. Δοκίμασε ξανά.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 grid gap-3 rounded-xl border border-[#e3e9f0] bg-white p-3 sm:grid-cols-2">
      <label className="text-xs font-bold sm:col-span-2">
        Κρεβάτι
        <select value={bedSetup} onChange={(e) => setBedSetup(e.target.value as BedSetup | "")} className="mt-1 w-full rounded-lg border border-[#cfd9e4] px-3 py-2.5 text-base font-normal">
          <option value="">—</option>
          {BED_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={cot} onChange={(e) => setCot(e.target.checked)} className="h-5 w-5" /> Κούνια
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={rollaway} onChange={(e) => setRollaway(e.target.checked)} className="h-5 w-5" /> Ράντζο
      </label>
      <label className="text-xs font-bold sm:col-span-2">
        Άλλο <span className="font-normal text-[#5b6b80]">(π.χ. επιπλέον μαξιλάρια)</span>
        <input value={other} onChange={(e) => setOther(e.target.value)} maxLength={120} className="mt-1 w-full rounded-lg border border-[#cfd9e4] px-3 py-2.5 text-base font-normal" />
      </label>
      {error && <p className="text-sm font-semibold text-[#92400e] sm:col-span-2">{error}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={onClose} className="min-h-11 rounded-full px-4 text-sm font-bold text-[#4b5b70]">Άκυρο</button>
        <button type="button" disabled={saving} onClick={save} className="min-h-11 rounded-full bg-[#e9e4fe] px-5 text-sm font-bold text-[#3b2f8a] disabled:opacity-60">
          {saving ? "Αποθήκευση…" : "Αποθήκευση"}
        </button>
      </div>
    </div>
  );
}

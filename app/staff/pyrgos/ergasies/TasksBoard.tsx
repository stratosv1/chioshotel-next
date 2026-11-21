"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PyrgosNav from "../PyrgosNav";
import { PYRGOS_ROOMS, roomByNumber } from "@/lib/pyrgos/rooms";
import {
  KIND_ICONS,
  KIND_LABELS,
  PRIORITY_LABELS,
  TASK_KINDS,
  TASK_PRIORITIES,
  type PyrgosTask,
  type TaskKind,
  type TaskPriority,
} from "@/lib/pyrgos/task-types";

const API = "/api/staff/pyrgos/tasks";
const card = "rounded-2xl border border-[#e3e9f0] bg-white p-4 sm:p-5";
const chip = "min-h-10 rounded-full border px-3.5 text-sm font-semibold transition";
const chipOn = `${chip} border-[#5443c9] bg-[#5443c9] text-white`;
const chipOff = `${chip} border-[#cfd9e4] bg-white text-[#334155] hover:bg-[#f4f7fa]`;

type Draft = {
  id: number | null;
  room: number | null;
  kind: TaskKind;
  title: string;
  notes: string;
  priority: TaskPriority;
  due: string;
};

const emptyDraft = (room: number | null = null): Draft => ({
  id: null,
  room,
  kind: "fault",
  title: "",
  notes: "",
  priority: "normal",
  due: "",
});

function athensToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens" }).format(new Date());
}

function roomName(room: number | null) {
  return room === null ? "Όλο το σπίτι" : roomByNumber(room)?.label ?? `Δωμ. ${room}`;
}

function shortDate(value: string | null) {
  if (!value) return "";
  const [y, m, d] = value.slice(0, 10).split("-");
  return `${Number(d)}/${Number(m)}${y !== athensToday().slice(0, 4) ? `/${y.slice(2)}` : ""}`;
}

function shareText(tasks: PyrgosTask[]) {
  const open = tasks.filter((t) => t.status === "open");
  const lines = open.map((t) => {
    const extra = [t.priority === "urgent" ? "ΕΠΕΙΓΟΝ" : "", t.due ? `έως ${shortDate(t.due)}` : ""].filter(Boolean).join(", ");
    return `• ${roomName(t.room)}: ${t.title}${extra ? ` (${extra})` : ""}`;
  });
  return `Voulamandis House · εργασίες\n${lines.join("\n")}`;
}

export default function TasksBoard() {
  const [tasks, setTasks] = useState<PyrgosTask[] | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [view, setView] = useState<"open" | "done">("open");
  const [roomFilter, setRoomFilter] = useState<number | "all" | "house">("all");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(API, { cache: "no-store" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setTasks(json.tasks);
      setError("");
    } catch {
      setError("Δεν φόρτωσαν οι εργασίες. Δοκίμασε ξανά.");
    }
  }, []);

  useEffect(() => {
    load();
    const params = new URLSearchParams(window.location.search);
    const room = Number(params.get("room"));
    const validRoom = Number.isInteger(room) && room >= 1 && room <= 11 ? room : null;
    if (params.get("new") === "1") setDraft(emptyDraft(validRoom));
    else if (validRoom) setRoomFilter(validRoom);
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function post(body: Record<string, unknown>) {
    const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return res.json().catch(() => ({ ok: false }));
  }

  async function save() {
    if (!draft) return;
    if (!draft.title.trim()) {
      setToast("Γράψε τι χρειάζεται");
      return;
    }
    setSaving(true);
    const json = await post({
      action: draft.id ? "update" : "add",
      id: draft.id,
      room: draft.room,
      kind: draft.kind,
      title: draft.title,
      notes: draft.notes,
      priority: draft.priority,
      due: draft.due || null,
    });
    setSaving(false);
    if (!json.ok) {
      setToast(json.error || "Δεν αποθηκεύτηκε");
      return;
    }
    setToast(draft.id ? "Αποθηκεύτηκε" : "Προστέθηκε");
    setDraft(null);
    setView("open");
    load();
  }

  async function act(id: number, action: "done" | "reopen" | "delete") {
    setConfirmDelete(null);
    setTasks((list) =>
      list
        ? action === "delete"
          ? list.filter((t) => t.id !== id)
          : list.map((t) => (t.id === id ? { ...t, status: action === "done" ? "done" : "open" } : t))
        : list,
    );
    const json = await post({ action, id });
    setToast(json.ok ? (action === "done" ? "Έγινε ✓" : action === "reopen" ? "Ξανανοίχτηκε" : "Διαγράφηκε") : "Δεν αποθηκεύτηκε");
    load();
  }

  const today = athensToday();
  const openTasks = useMemo(() => (tasks ?? []).filter((t) => t.status === "open"), [tasks]);
  const openByRoom = useMemo(() => {
    const map = new Map<number | "house", number>();
    for (const t of openTasks) {
      const key = t.room ?? "house";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [openTasks]);

  const shown = useMemo(
    () =>
      (tasks ?? []).filter(
        (t) =>
          t.status === view &&
          (roomFilter === "all" || (roomFilter === "house" ? t.room === null : t.room === roomFilter)),
      ),
    [tasks, view, roomFilter],
  );

  const urgent = openTasks.filter((t) => t.priority === "urgent").length;
  const overdue = openTasks.filter((t) => t.due && t.due < today).length;

  return (
    <div className="min-h-screen bg-[#eef3f7] text-[#1f2a3c]">
      <div className="flex flex-wrap lg:flex-nowrap">
        <PyrgosNav wide="lg" />

        <main className="min-w-0 flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Βλάβες & εργασίες</h1>
              <p className="text-sm text-[#5b6b80]">
                {tasks
                  ? `${openTasks.length} ανοιχτές${urgent ? ` · ${urgent} επείγουσες` : ""}${overdue ? ` · ${overdue} εκπρόθεσμες` : ""}`
                  : "Φόρτωση…"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {openTasks.length > 0 && (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText(tasks ?? []))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-[#cfd9e4] bg-white px-4 text-sm font-bold text-[#1f6b3a]"
                >
                  WhatsApp λίστα
                </a>
              )}
              <button
                type="button"
                onClick={() => setDraft(emptyDraft(typeof roomFilter === "number" ? roomFilter : null))}
                className="min-h-11 rounded-full bg-[#5443c9] px-5 text-sm font-bold text-white shadow-sm"
              >
                + Νέα
              </button>
            </div>
          </header>

          {draft && (
            <section aria-labelledby="draft-title" className={`${card} space-y-4 border-[#c7bff7]`}>
              <h2 id="draft-title" className="text-lg font-black">
                {draft.id ? "Επεξεργασία" : "Νέα βλάβη ή εργασία"}
              </h2>

              <fieldset className="space-y-2">
                <legend className="text-sm font-bold text-[#4b5b70]">Πού</legend>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setDraft({ ...draft, room: null })} className={draft.room === null ? chipOn : chipOff}>
                    Όλο το σπίτι
                  </button>
                  {PYRGOS_ROOMS.map((room) => (
                    <button
                      key={room.number}
                      type="button"
                      onClick={() => setDraft({ ...draft, room: room.number })}
                      className={draft.room === room.number ? chipOn : chipOff}
                    >
                      {room.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="text-sm font-bold text-[#4b5b70]">Είδος</legend>
                <div className="flex flex-wrap gap-2">
                  {TASK_KINDS.map((kind) => (
                    <button key={kind} type="button" onClick={() => setDraft({ ...draft, kind })} className={draft.kind === kind ? chipOn : chipOff}>
                      {KIND_ICONS[kind]} {KIND_LABELS[kind]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block space-y-1.5">
                <span className="text-sm font-bold text-[#4b5b70]">Τι χρειάζεται</span>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  maxLength={140}
                  placeholder="π.χ. Στάζει η βρύση του μπάνιου"
                  className="min-h-11 w-full rounded-xl border border-[#cfd9e4] px-3 text-base"
                  autoFocus
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm font-bold text-[#4b5b70]">Σημείωση <span className="font-normal">(προαιρετικά)</span></span>
                <textarea
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  maxLength={1000}
                  rows={2}
                  placeholder="Τεχνικός, ανταλλακτικό, κόστος…"
                  className="w-full rounded-xl border border-[#cfd9e4] px-3 py-2 text-base"
                />
              </label>

              <div className="flex flex-wrap items-end gap-4">
                <fieldset className="space-y-2">
                  <legend className="text-sm font-bold text-[#4b5b70]">Προτεραιότητα</legend>
                  <div className="flex flex-wrap gap-2">
                    {TASK_PRIORITIES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setDraft({ ...draft, priority: p })}
                        className={
                          draft.priority === p
                            ? p === "urgent"
                              ? `${chip} border-[#b91c1c] bg-[#b91c1c] text-white`
                              : chipOn
                            : chipOff
                        }
                      >
                        {PRIORITY_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="space-y-1.5">
                  <span className="block text-sm font-bold text-[#4b5b70]">Μέχρι <span className="font-normal">(προαιρετικά)</span></span>
                  <input
                    type="date"
                    value={draft.due}
                    onChange={(e) => setDraft({ ...draft, due: e.target.value })}
                    className="min-h-10 rounded-xl border border-[#cfd9e4] px-3 text-base"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  disabled={saving}
                  onClick={save}
                  className="min-h-11 rounded-full bg-[#5443c9] px-6 text-sm font-bold text-white disabled:opacity-60"
                >
                  {saving ? "Αποθήκευση…" : draft.id ? "Αποθήκευση" : "Προσθήκη"}
                </button>
                <button type="button" onClick={() => setDraft(null)} className="min-h-11 rounded-full px-5 text-sm font-bold text-[#4b5b70]">
                  Άκυρο
                </button>
              </div>
            </section>
          )}

          <section aria-label="Φίλτρα" className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setView("open")} className={view === "open" ? chipOn : chipOff}>
                Ανοιχτές ({openTasks.length})
              </button>
              <button type="button" onClick={() => setView("done")} className={view === "done" ? chipOn : chipOff}>
                Έγιναν
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button type="button" onClick={() => setRoomFilter("all")} className={`${roomFilter === "all" ? chipOn : chipOff} shrink-0`}>
                Όλα
              </button>
              <button type="button" onClick={() => setRoomFilter("house")} className={`${roomFilter === "house" ? chipOn : chipOff} shrink-0`}>
                Σπίτι{openByRoom.get("house") ? ` · ${openByRoom.get("house")}` : ""}
              </button>
              {PYRGOS_ROOMS.map((room) => {
                const count = openByRoom.get(room.number);
                return (
                  <button
                    key={room.number}
                    type="button"
                    onClick={() => setRoomFilter(room.number)}
                    className={`${roomFilter === room.number ? chipOn : chipOff} shrink-0`}
                  >
                    {room.label}
                    {count ? ` · ${count}` : ""}
                  </button>
                );
              })}
            </div>
          </section>

          {error && <p className="rounded-xl bg-[#fef2f2] p-3 text-sm font-bold text-[#991b1b]">{error}</p>}

          {tasks && shown.length === 0 && (
            <p className={`${card} text-sm text-[#5b6b80]`}>
              {view === "open" ? "Καμία ανοιχτή εργασία εδώ. 👌" : "Τίποτα ολοκληρωμένο τις τελευταίες 60 μέρες."}
            </p>
          )}

          <ul className="space-y-2">
            {shown.map((t) => {
              const late = t.status === "open" && t.due && t.due < today;
              return (
                <li
                  key={t.id}
                  className={`${card} flex flex-wrap items-start gap-3 ${t.priority === "urgent" && t.status === "open" ? "border-l-4 border-l-[#b91c1c]" : ""}`}
                >
                  <span aria-hidden="true" className="text-xl leading-7">
                    {KIND_ICONS[t.kind]}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                      <span className="rounded-full bg-[#eef3f7] px-2.5 py-1 text-[#1f2a3c]">{roomName(t.room)}</span>
                      <span className="text-[#5b6b80]">{KIND_LABELS[t.kind]}</span>
                      {t.priority !== "normal" && (
                        <span className={`rounded-full px-2.5 py-1 ${t.priority === "urgent" ? "bg-[#fee2e2] text-[#991b1b]" : "bg-[#f1f5f9] text-[#475569]"}`}>
                          {PRIORITY_LABELS[t.priority]}
                        </span>
                      )}
                      {t.due && t.status === "open" && (
                        <span className={late ? "text-[#b91c1c]" : "text-[#5b6b80]"}>
                          {late ? "Εκπρόθεσμο · " : "Έως "}
                          {shortDate(t.due)}
                        </span>
                      )}
                    </div>
                    <p className={`text-base font-bold ${t.status === "done" ? "text-[#5b6b80] line-through" : ""}`}>{t.title}</p>
                    {t.notes && <p className="whitespace-pre-line text-sm text-[#4b5b70]">{t.notes}</p>}
                    <p className="text-xs text-[#8a97a8]">
                      Καταχωρήθηκε {shortDate(t.createdAt)}
                      {t.doneAt ? ` · έγινε ${shortDate(t.doneAt)}` : ""}
                    </p>
                  </div>
                  <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                    {t.status === "open" ? (
                      <button type="button" onClick={() => act(t.id, "done")} className="min-h-10 rounded-full bg-[#1f6b3a] px-4 text-sm font-bold text-white">
                        ✓ Έγινε
                      </button>
                    ) : (
                      <button type="button" onClick={() => act(t.id, "reopen")} className="min-h-10 rounded-full border border-[#cfd9e4] px-4 text-sm font-bold">
                        Ξανάνοιξε
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setDraft({ id: t.id, room: t.room, kind: t.kind, title: t.title, notes: t.notes, priority: t.priority, due: t.due ?? "" });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="min-h-10 rounded-full border border-[#cfd9e4] px-4 text-sm font-bold"
                    >
                      Αλλαγή
                    </button>
                    {confirmDelete === t.id ? (
                      <button type="button" onClick={() => act(t.id, "delete")} className="min-h-10 rounded-full bg-[#b91c1c] px-4 text-sm font-bold text-white">
                        Σίγουρα διαγραφή;
                      </button>
                    ) : (
                      <button type="button" onClick={() => setConfirmDelete(t.id)} className="min-h-10 rounded-full px-3 text-sm font-bold text-[#991b1b]">
                        Διαγραφή
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
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

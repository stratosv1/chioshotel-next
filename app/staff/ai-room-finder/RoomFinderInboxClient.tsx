"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  RoomFinderInboxConversation,
  RoomFinderInboxData,
} from "@/lib/ai-assistant/conversation-store";

function dateTime(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function relativeTime(value: string) {
  const time = new Date(value).getTime();
  if (!Number.isFinite(time)) return "";
  const seconds = Math.round((time - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("el", { numeric: "auto" });
  if (Math.abs(seconds) < 60) return rtf.format(seconds, "second");
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(Math.round(hours / 24), "day");
}

function statusLabel(conversation: RoomFinderInboxConversation) {
  if (conversation.active) return { label: "LIVE", className: "bg-emerald-100 text-emerald-800" };
  if (conversation.enquirySentAt) return { label: "Αίτημα στάλθηκε", className: "bg-amber-100 text-amber-900" };
  if (conversation.currentStep === "complete") return { label: "Ολοκλήρωσε", className: "bg-sky-100 text-sky-800" };
  return { label: "Ανενεργή", className: "bg-stone-100 text-stone-600" };
}

function fullName(conversation: RoomFinderInboxConversation) {
  return [conversation.firstName, conversation.lastName].filter(Boolean).join(" ");
}

function phoneForWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("00") ? digits.slice(2) : digits;
}

export default function RoomFinderInboxClient({ initialData }: { initialData: RoomFinderInboxData }) {
  const [data, setData] = useState(initialData);
  const [selectedSessionId, setSelectedSessionId] = useState(initialData.selected.conversation?.sessionId || "");
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const markedRead = useRef(new Set<string>());

  const selected = data.selected.conversation;
  const messages = data.selected.messages;

  function syncInbox(next: RoomFinderInboxData) {
    const nextSessionId = next.selected.conversation?.sessionId || "";
    setData(next);
    setSelectedSessionId(nextSessionId);
    setLastRefresh(new Date());

    const url = new URL(window.location.href);
    if (nextSessionId) url.searchParams.set("session", nextSessionId);
    else url.searchParams.delete("session");
    history.replaceState(history.state, "", url);
  }

  async function load(sessionId = selectedSessionId) {
    setRefreshing(true);
    try {
      const query = sessionId ? `?session=${encodeURIComponent(sessionId)}` : "";
      const response = await fetch(`/api/staff/ai-room-finder${query}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Inbox refresh failed");
      const next = await response.json() as RoomFinderInboxData;
      setData(next);
      const nextSelected = next.selected.conversation?.sessionId || "";
      if (!sessionId || nextSelected !== sessionId) setSelectedSessionId(nextSelected);
      setLastRefresh(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }

  async function markRead(sessionId: string) {
    if (!sessionId || markedRead.current.has(sessionId)) return;
    markedRead.current.add(sessionId);
    try {
      await fetch("/api/staff/ai-room-finder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      setData((current) => ({
        ...current,
        stats: { ...current.stats, unread: Math.max(0, current.stats.unread - 1) },
        conversations: current.conversations.map((conversation) => (
          conversation.sessionId === sessionId ? { ...conversation, unread: false } : conversation
        )),
        selected: current.selected.conversation?.sessionId === sessionId
          ? { ...current.selected, conversation: { ...current.selected.conversation, unread: false } }
          : current.selected,
      }));
    } catch (error) {
      markedRead.current.delete(sessionId);
      console.error(error);
    }
  }

  async function openConversation(sessionId: string) {
    setSelectedSessionId(sessionId);
    const url = new URL(window.location.href);
    url.searchParams.set("session", sessionId);
    history.replaceState(history.state, "", url);
    await load(sessionId);
    markedRead.current.delete(sessionId);
    await markRead(sessionId);
  }

  async function deleteConversation(conversation: RoomFinderInboxConversation) {
    const name = fullName(conversation) || "αυτή τη συνομιλία";
    const liveWarning = conversation.active
      ? "\n\nΗ συνομιλία είναι ακόμη LIVE. Αν ο επισκέπτης συνεχίσει να γράφει, μπορεί να εμφανιστεί ξανά."
      : "";
    if (!window.confirm(`Να διαγραφεί οριστικά ${name}; Τα μηνύματα της συνομιλίας θα διαγραφούν επίσης.${liveWarning}`)) return;

    setDeleting(conversation.sessionId);
    try {
      const response = await fetch("/api/staff/ai-room-finder", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: conversation.sessionId }),
      });
      if (!response.ok) throw new Error("Conversation delete failed");
      markedRead.current.delete(conversation.sessionId);
      syncInbox(await response.json() as RoomFinderInboxData);
    } catch (error) {
      console.error(error);
      window.alert("Η συνομιλία δεν διαγράφηκε. Δοκίμασε ξανά.");
    } finally {
      setDeleting(null);
    }
  }

  async function deleteAllConversations() {
    if (!data.conversations.length) return;
    const liveCount = data.conversations.filter((conversation) => conversation.active).length;
    const liveWarning = liveCount
      ? `\n\n${liveCount} συνομιλία${liveCount === 1 ? " είναι" : "ες είναι"} ακόμη LIVE και μπορεί να εμφανιστεί ξανά αν συνεχιστεί.`
      : "";
    if (!window.confirm(`Να διαγραφούν ΟΛΕΣ οι αποθηκευμένες συνομιλίες του AI Room Finder και όλα τα μηνύματά τους; Η ενέργεια δεν αναιρείται.${liveWarning}`)) return;

    setDeleting("all");
    try {
      const response = await fetch("/api/staff/ai-room-finder", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (!response.ok) throw new Error("Inbox clear failed");
      markedRead.current.clear();
      syncInbox(await response.json() as RoomFinderInboxData);
    } catch (error) {
      console.error(error);
      window.alert("Οι συνομιλίες δεν διαγράφηκαν. Δοκίμασε ξανά.");
    } finally {
      setDeleting(null);
    }
  }

  useEffect(() => {
    if (selectedSessionId && selected?.unread) void markRead(selectedSessionId);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => void load(selectedSessionId), 15_000);
    return () => window.clearInterval(timer);
  }, [selectedSessionId]);

  const selectedStatus = selected ? statusLabel(selected) : null;
  const selectedName = selected ? fullName(selected) : "";
  const selectedRooms = useMemo(
    () => selected?.selectedRooms?.map((room) => String(room.name || room.roomNumber || "")).filter(Boolean) || [],
    [selected],
  );

  return (
    <main className="min-h-screen bg-[#f7f3eb] px-3 py-5 text-stone-900 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-stone-300 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <a href="/staff" className="text-sm font-semibold text-stone-600 hover:text-stone-950">← Staff Area</a>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Voulamandis House</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">AI Room Finder Inbox</h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-600">
              Πραγματικές συνομιλίες πελατών, χρήση του Room Finder και αιτήματα ενδιαφέροντος.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Live refresh 15s</span>
            <button
              type="button"
              onClick={() => void load()}
              disabled={refreshing || Boolean(deleting)}
              className="rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold text-stone-700 disabled:opacity-50"
            >
              {refreshing ? "Ανανέωση…" : "Ανανέωση"}
            </button>
          </div>
        </header>

        <section className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[
            ["Σήμερα", data.stats.today],
            ["7 ημέρες", data.stats.last7Days],
            ["Live τώρα", data.stats.active],
            ["Μη αναγνωσμένες", data.stats.unread],
            ["Αιτήματα 30ημ.", data.stats.enquiries],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-stone-200 bg-white p-3 sm:p-4">
              <div className="text-2xl font-black tabular-nums">{value}</div>
              <div className="mt-1 text-xs font-semibold text-stone-500">{label}</div>
            </div>
          ))}
        </section>

        <div className="mt-5 grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 px-4 py-3">
              <div>
                <h2 className="font-black">Συνομιλίες</h2>
                <span className="text-xs text-stone-500">{data.conversations.length} πρόσφατες</span>
              </div>
              <button
                type="button"
                onClick={() => void deleteAllConversations()}
                disabled={!data.conversations.length || Boolean(deleting)}
                className="rounded-xl border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting === "all" ? "Διαγραφή…" : "Καθαρισμός όλων"}
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {data.conversations.length ? data.conversations.map((conversation) => {
                const status = statusLabel(conversation);
                const name = fullName(conversation);
                const active = conversation.sessionId === selectedSessionId;
                return (
                  <button
                    type="button"
                    key={conversation.sessionId}
                    onClick={() => void openConversation(conversation.sessionId)}
                    disabled={Boolean(deleting)}
                    className={`block w-full border-b border-stone-100 px-4 py-4 text-left transition last:border-0 disabled:opacity-60 ${active ? "bg-[#f4eee4]" : "hover:bg-stone-50"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {conversation.unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" aria-label="Μη αναγνωσμένη" />}
                          <strong className="truncate text-sm">{name || `Επισκέπτης · ${conversation.language.toUpperCase()}`}</strong>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-stone-600">{conversation.lastUserMessage || "Ξεκίνησε τη συνομιλία"}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${status.className}`}>{status.label}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
                      <span>{conversation.userMessageCount} μηνύματα πελάτη · {conversation.language.toUpperCase()}</span>
                      <span>{relativeTime(conversation.lastActivityAt)}</span>
                    </div>
                  </button>
                );
              }) : (
                <div className="p-8 text-center text-sm text-stone-500">
                  Δεν υπάρχει ακόμη πραγματική χρήση του AI Room Finder.
                </div>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
            {selected ? (
              <>
                <div className="border-b border-stone-200 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black">{selectedName || "Επισκέπτης AI Room Finder"}</h2>
                        {selected.unread && <span className="h-2.5 w-2.5 rounded-full bg-red-500" />}
                      </div>
                      <p className="mt-1 text-xs text-stone-500">Ξεκίνησε {dateTime(selected.createdAt)} · τελευταία δραστηριότητα {dateTime(selected.lastActivityAt)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedStatus && <span className={`rounded-full px-3 py-1.5 text-xs font-black ${selectedStatus.className}`}>{selectedStatus.label}</span>}
                      <button
                        type="button"
                        onClick={() => void deleteConversation(selected)}
                        disabled={Boolean(deleting)}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deleting === selected.sessionId ? "Διαγραφή…" : "Διαγραφή"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-stone-50 p-3">
                      <div className="text-[11px] font-bold uppercase text-stone-500">Γλώσσα</div>
                      <div className="mt-1 font-bold">{selected.language.toUpperCase()}</div>
                    </div>
                    <div className="rounded-2xl bg-stone-50 p-3">
                      <div className="text-[11px] font-bold uppercase text-stone-500">Μηνύματα</div>
                      <div className="mt-1 font-bold">{selected.messageCount}</div>
                    </div>
                    <div className="rounded-2xl bg-stone-50 p-3">
                      <div className="text-[11px] font-bold uppercase text-stone-500">Διαμονή</div>
                      <div className="mt-1 font-bold">{selected.checkin && selected.checkout ? `${selected.checkin} → ${selected.checkout}` : "Μέσα στη συνομιλία"}</div>
                    </div>
                    <div className="rounded-2xl bg-stone-50 p-3">
                      <div className="text-[11px] font-bold uppercase text-stone-500">Αίτημα</div>
                      <div className="mt-1 font-bold">{selected.enquirySentAt ? dateTime(selected.enquirySentAt) : "Δεν στάλθηκε"}</div>
                    </div>
                  </div>

                  {(selectedName || selected.phone || selected.email) && (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                      <div className="text-xs font-black uppercase tracking-wide text-amber-900">Στοιχεία πελάτη</div>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                        {selectedName && <span><strong>Όνομα:</strong> {selectedName}</span>}
                        {selected.phone && <a className="font-semibold underline" href={`tel:${selected.phone}`}><strong>Τηλ:</strong> {selected.phone}</a>}
                        {selected.email && <a className="font-semibold underline" href={`mailto:${selected.email}`}><strong>Email:</strong> {selected.email}</a>}
                        {selected.phone && <a className="font-semibold text-emerald-800 underline" href={`https://wa.me/${phoneForWhatsApp(selected.phone)}`} target="_blank" rel="noreferrer">WhatsApp</a>}
                      </div>
                      {selected.privacyAcceptedAt && <p className="mt-2 text-[11px] text-stone-500">Ενημέρωση προσωπικών δεδομένων: {dateTime(selected.privacyAcceptedAt)}</p>}
                    </div>
                  )}

                  {selectedRooms.length > 0 && (
                    <p className="mt-3 text-sm text-stone-600"><strong>Επιλεγμένα δωμάτια:</strong> {selectedRooms.join(", ")}</p>
                  )}
                </div>

                <div className="space-y-3 bg-[#faf8f4] p-4 sm:p-6">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${message.role === "user" ? "rounded-br-md bg-[#6b604f] text-white" : "rounded-bl-md border border-stone-200 bg-white text-stone-800"}`}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`mt-1 text-[10px] ${message.role === "user" ? "text-white/70" : "text-stone-400"}`}>{message.role === "user" ? "Πελάτης" : "AI Room Finder"}{message.reaction ? ` · ${message.reaction}` : ""}</div>
                      </div>
                    </div>
                  ))}
                  {!messages.length && <p className="py-8 text-center text-sm text-stone-500">Δεν υπάρχουν μηνύματα.</p>}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-stone-500">Δεν υπάρχουν αποθηκευμένες συνομιλίες.</div>
            )}
          </section>
        </div>

        <p className="mt-4 text-right text-[11px] text-stone-400">Τελευταία ανανέωση: {dateTime(lastRefresh.toISOString())}</p>
      </div>
    </main>
  );
}

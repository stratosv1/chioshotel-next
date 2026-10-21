"use client";

import { ArrowLeft, Mail, MessageCircle, Phone, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  RoomFinderInboxConversation,
  RoomFinderInboxData,
} from "@/lib/ai-assistant/conversation-store";
import { decodeRoomFinderOfferSnapshot } from "@/lib/ai-assistant/room-finder-offer-tracking";

const ACCENT = "#c9822f";

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

function shortTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return new Intl.DateTimeFormat("el-GR", { hour: "2-digit", minute: "2-digit" }).format(date);
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Χθες";
  return new Intl.DateTimeFormat("el-GR", { day: "numeric", month: "short" }).format(date);
}

function stayRange(checkin: string, checkout: string) {
  const parse = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
  };
  const from = parse(checkin);
  const to = parse(checkout);
  if (!from || !to) return "";
  const day = (date: Date) => date.getDate();
  const month = (date: Date) => new Intl.DateTimeFormat("el-GR", { month: "short" }).format(date);
  const nights = Math.round((to.getTime() - from.getTime()) / 86_400_000);
  const range = from.getMonth() === to.getMonth()
    ? `${day(from)}–${day(to)} ${month(to)}`
    : `${day(from)} ${month(from)} – ${day(to)} ${month(to)}`;
  return nights > 0 ? `${range} · ${nights} ${nights === 1 ? "νύχτα" : "νύχτες"}` : range;
}

function shortStayDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}/${match[2]}` : value;
}

function stayLine(conversation: RoomFinderInboxConversation) {
  const parts: string[] = [];
  const range = stayRange(conversation.checkin, conversation.checkout);
  if (range) parts.push(range);
  if (conversation.guestTotal) parts.push(`${conversation.guestTotal} άτ.`);
  if (conversation.roomCount && conversation.roomCount > 1) parts.push(`${conversation.roomCount} δωμ.`);
  return parts.join(" · ");
}

type Status = { label: string; tone: "live" | "lead" | "done" | "none" | "idle" };

function statusOf(conversation: RoomFinderInboxConversation): Status {
  if (conversation.active) return { label: "Live", tone: "live" };
  if (conversation.enquirySentAt) return { label: "Αίτημα", tone: "lead" };
  if (conversation.currentStep === "complete") return { label: "Ολοκλήρωσε", tone: "done" };
  if (conversation.currentStep === "unavailable") return { label: "Χωρίς διαθεσιμότητα", tone: "none" };
  return { label: "Σταμάτησε", tone: "idle" };
}

const toneClass: Record<Status["tone"], string> = {
  live: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  lead: "bg-amber-50 text-amber-800 ring-amber-200",
  done: "bg-sky-50 text-sky-700 ring-sky-200",
  none: "bg-rose-50 text-rose-700 ring-rose-200",
  idle: "bg-stone-50 text-stone-500 ring-stone-200",
};

function fullName(conversation: RoomFinderInboxConversation) {
  return [conversation.firstName, conversation.lastName].filter(Boolean).join(" ");
}

function phoneForWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("00") ? digits.slice(2) : digits;
}

function money(value: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function sessionFromUrl() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("session") || "";
}

export default function RoomFinderInboxClient({ initialData }: { initialData: RoomFinderInboxData }) {
  const [data, setData] = useState(initialData);
  const [selectedSessionId, setSelectedSessionId] = useState(initialData.selected.conversation?.sessionId || "");
  // On phones only one pane is shown: the list, or the conversation opened from it / from a link.
  const [mobileDetail, setMobileDetail] = useState(() => Boolean(sessionFromUrl()));
  const [refreshing, setRefreshing] = useState(false);
  const markedRead = useRef(new Set<string>());

  const selected = data.selected.conversation;
  const messages = data.selected.messages;

  async function load(sessionId = selectedSessionId) {
    setRefreshing(true);
    try {
      const query = sessionId ? `?session=${encodeURIComponent(sessionId)}` : "";
      const response = await fetch(`/api/staff/ai-room-finder${query}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Inbox refresh failed");
      const next = await response.json() as RoomFinderInboxData;
      setData(next);
      if (!sessionId && next.selected.conversation?.sessionId) {
        setSelectedSessionId(next.selected.conversation.sessionId);
      }
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
    setMobileDetail(true);
    const url = new URL(window.location.href);
    const alreadyOpen = url.searchParams.get("session") === sessionId;
    url.searchParams.set("session", sessionId);
    // Push so the phone's back button returns to the list.
    if (!alreadyOpen) history.pushState({ session: sessionId }, "", url);
    window.scrollTo({ top: 0 });
    await load(sessionId);
    await markRead(sessionId);
  }

  function backToList() {
    if (history.state?.session) {
      history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("session");
    history.replaceState(null, "", url);
    setMobileDetail(false);
  }

  useEffect(() => {
    function onPop() {
      const sessionId = sessionFromUrl();
      setMobileDetail(Boolean(sessionId));
      if (sessionId && sessionId !== selectedSessionId) {
        setSelectedSessionId(sessionId);
        void load(sessionId);
      }
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [selectedSessionId]);

  useEffect(() => {
    if (selectedSessionId && selected?.unread && sessionFromUrl()) void markRead(selectedSessionId);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => void load(selectedSessionId), 15_000);
    return () => window.clearInterval(timer);
  }, [selectedSessionId]);

  const selectedRooms = useMemo(
    () => selected?.selectedRooms?.map((room) => String(room.name || room.roomNumber || "")).filter(Boolean) || [],
    [selected],
  );

  const listPane = (
    <section className={`${mobileDetail ? "hidden lg:flex" : "flex"} min-h-0 flex-col bg-white lg:rounded-2xl lg:border lg:border-stone-200`}>
      <div className="flex items-center justify-between px-4 pb-2 pt-1 text-xs text-stone-500 lg:border-b lg:border-stone-100 lg:py-3">
        <span>Σήμερα {data.stats.today} · 7 ημέρες {data.stats.last7Days}</span>
        {data.stats.active > 0 && (
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {data.stats.active} live
          </span>
        )}
      </div>
      <ul className="min-h-0 flex-1 divide-y divide-stone-100 lg:overflow-y-auto">
        {data.conversations.map((conversation) => {
          const status = statusOf(conversation);
          const name = fullName(conversation);
          const isSelected = conversation.sessionId === selectedSessionId;
          const line = stayLine(conversation);
          return (
            <li key={conversation.sessionId}>
              <button
                type="button"
                onClick={() => void openConversation(conversation.sessionId)}
                className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors ${isSelected ? "lg:bg-stone-100" : "hover:bg-stone-50 active:bg-stone-100"}`}
              >
                <span
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: conversation.unread ? ACCENT : "#a8a29e" }}
                >
                  {conversation.language.toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className={`truncate text-[15px] ${conversation.unread ? "font-semibold text-stone-900" : "font-medium text-stone-700"}`}>
                      {name || "Επισκέπτης"}
                    </span>
                    <span className={`shrink-0 text-xs ${conversation.unread ? "font-semibold" : "text-stone-400"}`} style={conversation.unread ? { color: ACCENT } : undefined}>
                      {shortTime(conversation.lastActivityAt)}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-stone-500">
                    {line || conversation.lastUserMessage || "Άνοιξε τον Room Finder"}
                  </span>
                  <span className="mt-1.5 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${toneClass[status.tone]}`}>
                      {status.label}
                    </span>
                    {conversation.phone && <Phone className="h-3.5 w-3.5 text-stone-400" aria-label="Άφησε τηλέφωνο" />}
                    {conversation.unread && <span className="ml-auto h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} aria-label="Μη αναγνωσμένη" />}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
        {!data.conversations.length && (
          <li className="p-10 text-center text-sm text-stone-500">Δεν υπάρχουν ακόμη συνομιλίες.</li>
        )}
      </ul>
    </section>
  );

  const detailPane = (
    <section className={`${mobileDetail ? "flex" : "hidden lg:flex"} min-h-0 flex-col bg-[#f7f5f1] lg:rounded-2xl lg:border lg:border-stone-200`}>
      {selected ? (
        <>
          <div className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 px-3 py-2.5 backdrop-blur lg:static lg:rounded-t-2xl lg:px-5 lg:py-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={backToList}
                className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 lg:hidden"
                aria-label="Πίσω στη λίστα"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-semibold text-stone-900">
                  {fullName(selected) || "Επισκέπτης"}
                  <span className="ml-2 text-xs font-normal text-stone-400">{selected.language.toUpperCase()}</span>
                </h2>
                <p className="truncate text-xs text-stone-500">
                  {stayLine(selected) || "Χωρίς ημερομηνίες"} · {dateTime(selected.createdAt)}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${toneClass[statusOf(selected).tone]}`}>
                {statusOf(selected).label}
              </span>
            </div>

            {(selected.phone || selected.email) && (
              <div className="mt-2.5 flex gap-2">
                {selected.phone && (
                  <a href={`tel:${selected.phone}`} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-stone-900 px-3 text-sm font-medium text-white">
                    <Phone className="h-4 w-4" /> Κλήση
                  </a>
                )}
                {selected.phone && (
                  <a href={`https://wa.me/${phoneForWhatsApp(selected.phone)}`} target="_blank" rel="noreferrer" className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#287d4f] px-3 text-sm font-medium text-white">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                )}
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 text-sm font-medium text-stone-800">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                )}
              </div>
            )}
            {(selected.phone || selected.email || selectedRooms.length > 0 || selected.breakfast) && (
              <p className="mt-2 text-xs leading-5 text-stone-500">
                {[selected.phone, selected.email, selectedRooms.length ? `Δωμάτια: ${selectedRooms.join(", ")}` : "", selected.breakfast ? "Με πρωινό" : ""]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>

          <div className="flex-1 space-y-2 px-3 py-4 lg:overflow-y-auto lg:px-6">
            {messages.map((message) => {
              const tracked = decodeRoomFinderOfferSnapshot(message.content);
              const snapshot = tracked.snapshot;
              const isUser = message.role === "user";
              return (
                <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[15px] leading-6 ${isUser ? "rounded-br-sm text-white" : "rounded-bl-sm bg-white text-stone-800 shadow-[0_1px_1px_rgba(0,0,0,0.04)]"}`}
                    style={isUser ? { backgroundColor: ACCENT } : undefined}
                  >
                    <div className="whitespace-pre-wrap">{tracked.content}</div>
                    {snapshot && (
                      <div className="mt-2 space-y-1.5 border-t border-stone-100 pt-2">
                        {snapshot.groups.map((group) => (
                          <div key={`${message.id}-${group.groupNumber}`} className="space-y-1.5">
                            {snapshot.groups.length > 1 && (
                              <p className="text-xs text-stone-500">Δωμάτιο {group.groupNumber} · {group.guests} άτομα</p>
                            )}
                            {group.offers.map((offer, offerIndex) => (
                              <div key={`${offer.roomNumber}-${offer.checkin}-${offerIndex}`} className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-3 py-2 text-sm">
                                <span className="min-w-0">
                                  <span className="block truncate font-medium">{offer.name}</span>
                                  <span className="block text-xs text-stone-500">
                                    Δωμ. {offer.roomNumber} · {shortStayDate(offer.checkin)}–{shortStayDate(offer.checkout)}
                                  </span>
                                </span>
                                <span className="shrink-0 text-right">
                                  {offer.originalTotal > offer.directTotal && (
                                    <span className="block text-[11px] text-stone-400 line-through">{money(offer.originalTotal)}</span>
                                  )}
                                  <span className="block font-semibold text-emerald-700">{money(offer.directTotal)}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={`mt-0.5 text-right text-[10px] ${isUser ? "text-white/75" : "text-stone-400"}`}>
                      {shortTime(message.createdAt)}{message.reaction ? ` · ${message.reaction}` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
            {!messages.length && <p className="py-10 text-center text-sm text-stone-500">Δεν υπάρχουν μηνύματα.</p>}
          </div>
        </>
      ) : (
        <div className="m-auto p-12 text-center text-sm text-stone-500">Επίλεξε μια συνομιλία.</div>
      )}
    </section>
  );

  return (
    <main className="min-h-[100dvh] bg-white font-sans text-stone-900 lg:bg-[#f7f5f1] lg:px-6 lg:py-6">
      <div className="mx-auto flex max-w-6xl flex-col lg:h-[calc(100dvh-3rem)]">
        <header className={`${mobileDetail ? "hidden lg:flex" : "flex"} items-center gap-2 px-3 py-2.5 lg:px-0 lg:pb-4 lg:pt-0`}>
          <a href="/staff" className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100" aria-label="Staff Area">
            <ArrowLeft className="h-5 w-5" />
          </a>
          <h1 className="flex-1 text-lg font-semibold">
            Room Finder
            {data.stats.unread > 0 && (
              <span className="ml-2 rounded-full px-2 py-0.5 align-middle text-xs font-medium text-white" style={{ backgroundColor: ACCENT }}>
                {data.stats.unread}
              </span>
            )}
          </h1>
          <button
            type="button"
            onClick={() => void load()}
            disabled={refreshing}
            className="flex h-10 w-10 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 disabled:opacity-50"
            aria-label="Ανανέωση"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-4">
          {listPane}
          {detailPane}
        </div>
      </div>
    </main>
  );
}

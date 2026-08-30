"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, History, LoaderCircle, MessageSquareText, Search, Send, Users } from "lucide-react";

type RoomOffer = { roomNumber: number; name: string; category: string; floor: string; maxGuests: number; systemTotal: number; originalTotal: number };
type SplitOffer = { changeDate: string; firstRoomNumber: number; firstName: string; firstCategory: string; secondRoomNumber: number; secondName: string; secondCategory: string; systemTotal: number };
type Selection = { type: "room"; roomNumber: number } | { type: "split"; firstRoomNumber: number; secondRoomNumber: number; changeDate: string };
type Agreement = {
  id: string; customer_phone: string; arrival: string; departure: string; guests: number; selection: Selection;
  agreed_total: string | number; message: string; customer_sms_status: string; owner_sms_status: string;
  booking_status: "pending" | "completed" | "declined"; completed_at: string | null; closed_at: string | null; created_at: string;
};

const API = "/api/staff/room-agreements/";
const statusLabels = { pending: "Αναμονή", completed: "Ολοκληρώθηκε", declined: "Δεν προχώρησε" } as const;
const smsStatusLabels: Record<string, string> = { sent: "στάλθηκε", failed: "απέτυχε" };
const roomCategoryLabels: Record<string, string> = {
  apartment: "Διαμέρισμα",
  economy: "Οικονομικό",
  family_apartment: "Οικογενειακό διαμέρισμα",
  first_floor: "1ος όροφος",
  ground_floor: "Ισόγειο",
};

function athensToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + days); return date.toISOString().slice(0, 10);
}
function monthStart(iso: string, offset = 0) {
  const date = new Date(`${iso}T12:00:00Z`); date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + offset); return date.toISOString().slice(0, 10);
}
function shortDate(iso: string) { return new Intl.DateTimeFormat("el-GR", { day: "2-digit", month: "2-digit", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`)); }
function longDate(iso: string) { return new Intl.DateTimeFormat("el-GR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`)); }
function dateTime(value: string) { return new Intl.DateTimeFormat("el-GR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Athens" }).format(new Date(value)); }
function nightsBetween(arrival: string, departure: string) {
  if (!arrival || !departure) return 0;
  return Math.round((new Date(`${departure}T12:00:00Z`).getTime() - new Date(`${arrival}T12:00:00Z`).getTime()) / 86_400_000);
}
function roomCategoryLabel(category: string) { return roomCategoryLabels[category] || category.replaceAll("_", " "); }
function roomTitle(room: RoomOffer) { return `${room.category.includes("apartment") ? "Διαμέρισμα" : "Δωμάτιο"} ${room.roomNumber}`; }
function displaySmsStatus(status: string) { return smsStatusLabels[status] || status; }
function parseMoneyInput(value: string) {
  const parsed = Number(value.trim().replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : 0;
}

export default function RoomAgreementsApp() {
  const today = useMemo(athensToday, []);
  const months = useMemo(() => Array.from({ length: 13 }, (_, index) => monthStart(today, index)), [today]);
  const [activeMonth, setActiveMonth] = useState(() => monthStart(today));
  const dates = useMemo(() => {
    const nextMonth = monthStart(activeMonth, 1);
    const result: string[] = [];
    for (let date = activeMonth; date < nextMonth; date = addDays(date, 1)) result.push(date);
    return result;
  }, [activeMonth]);
  const activeMonthIndex = months.indexOf(activeMonth);
  const leadingCalendarCells = (new Date(`${activeMonth}T12:00:00Z`).getUTCDay() + 6) % 7;
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState<RoomOffer[]>([]);
  const [splits, setSplits] = useState<SplitOffer[]>([]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [customerPhone, setCustomerPhone] = useState("+30");
  const [agreedTotal, setAgreedTotal] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [history, setHistory] = useState<Agreement[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyStatus, setHistoryStatus] = useState("all");
  const [historyPhone, setHistoryPhone] = useState("");
  const [debouncedHistoryPhone, setDebouncedHistoryPhone] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [confirmingSend, setConfirmingSend] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const availabilityRequestRef = useRef(0);
  const historyRequestRef = useRef(0);
  const sendLockRef = useRef(false);
  const agreementRef = useRef<HTMLDivElement>(null);
  const nights = nightsBetween(arrival, departure);
  const agreedAmount = parseMoneyInput(agreedTotal);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedHistoryPhone(historyPhone), 300);
    return () => window.clearTimeout(timeout);
  }, [historyPhone]);

  const loadHistory = useCallback(async () => {
    const requestId = ++historyRequestRef.current;
    setHistoryLoading(true);
    setHistoryError("");
    const params = new URLSearchParams();
    if (historyStatus !== "all") params.set("status", historyStatus);
    const phoneDigits = debouncedHistoryPhone.replace(/\D/g, "");
    if (phoneDigits.length >= 3) params.set("phone", phoneDigits);
    try {
      const response = await fetch(`${API}?${params}`, { cache: "no-store" });
      const data = await response.json();
      if (requestId === historyRequestRef.current && data.ok) setHistory(data.agreements || []);
      else if (requestId === historyRequestRef.current) setHistoryError(data.error || "Το ιστορικό δεν φορτώθηκε.");
    } catch {
      if (requestId === historyRequestRef.current) setHistoryError("Το ιστορικό δεν φορτώθηκε.");
    } finally {
      if (requestId === historyRequestRef.current) setHistoryLoading(false);
    }
  }, [debouncedHistoryPhone, historyStatus]);

  useEffect(() => { if (historyOpen) void loadHistory(); }, [historyOpen, loadHistory]);

  useEffect(() => {
    setSelection(null); setAgreedTotal(""); setRooms([]); setSplits([]); setFeedback(null);
    const requestId = ++availabilityRequestRef.current;
    if (!arrival || !departure || departure <= arrival) { setLoading(false); return; }
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ mode: "availability", arrival, departure, guests: String(guests) });
        const response = await fetch(`${API}?${params}`, { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || "Ο έλεγχος απέτυχε.");
        if (requestId === availabilityRequestRef.current) {
          setRooms(data.rooms || []); setSplits(data.splits || []);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError" && requestId === availabilityRequestRef.current) {
          setFeedback({ kind: "error", text: (error as Error).message });
        }
      } finally {
        if (!controller.signal.aborted && requestId === availabilityRequestRef.current) setLoading(false);
      }
    };
    void run(); return () => controller.abort();
  }, [arrival, departure, guests]);

  function chooseDate(date: string) {
    if (!arrival || departure || date <= arrival) { setArrival(date); setDeparture(""); }
    else setDeparture(date);
  }

  function selectRoom(room: RoomOffer) {
    setSelection({ type: "room", roomNumber: room.roomNumber }); setAgreedTotal(String(room.systemTotal || ""));
    window.setTimeout(() => agreementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }
  function selectSplit(split: SplitOffer) {
    setSelection({ type: "split", firstRoomNumber: split.firstRoomNumber, secondRoomNumber: split.secondRoomNumber, changeDate: split.changeDate });
    setAgreedTotal(String(split.systemTotal || ""));
    window.setTimeout(() => agreementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  async function sendAgreement() {
    if (sendLockRef.current || !selection || !customerPhone.trim() || !agreedAmount) return;
    sendLockRef.current = true;
    setConfirmingSend(false);
    setSending(true); setFeedback(null);
    try {
      const response = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ arrival, departure, guests, selection, agreedTotal: agreedAmount, customerPhone }) });
      const data = await response.json();
      if (!data.saved) throw new Error(data.error || "Η αποστολή απέτυχε.");
      const ownerSent = data.results?.find((item: { to: string }) => item.to === "306944474226")?.status === "sent";
      const enteredDigits = customerPhone.replace(/\D/g, "").replace(/^00/, "");
      const customerSent = enteredDigits === "306944474226"
        ? ownerSent
        : data.results?.find((item: { to: string }) => item.to !== "306944474226")?.status === "sent";
      setFeedback(data.ok
        ? { kind: "ok", text: "Τα SMS στάλθηκαν στον πελάτη και στο δικό σου κινητό." }
        : { kind: "error", text: `Η συμφωνία αποθηκεύτηκε. SMS πελάτη: ${customerSent ? "στάλθηκε" : "απέτυχε"} · δικό σου: ${ownerSent ? "στάλθηκε" : "απέτυχε"}.` });
      if (customerSent) setCustomerPhone("+30");
      if (historyOpen) await loadHistory();
    } catch (error) { setFeedback({ kind: "error", text: (error as Error).message }); }
    finally { sendLockRef.current = false; setSending(false); }
  }

  async function updateStatus(id: string, status: Agreement["booking_status"]) {
    if (updatingId) return;
    setUpdatingId(id);
    try {
      const response = await fetch(API, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      const data = await response.json();
      if (!response.ok || !data.ok) { setFeedback({ kind: "error", text: data.error || "Η αλλαγή απέτυχε." }); return; }
      await loadHistory();
    } catch {
      setFeedback({ kind: "error", text: "Η αλλαγή κατάστασης δεν ολοκληρώθηκε." });
    } finally { setUpdatingId(""); }
  }

  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#f7f3ec] pb-24 text-[#352f29]">
      <header className="sticky top-0 z-30 border-b border-[#e7ddcf] bg-[#f7f3ec]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link href="/staff" aria-label="Πίσω στο Staff" className="flex size-11 items-center justify-center rounded-full bg-white shadow-sm"><ChevronLeft /></Link>
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9b6b36]">Staff only</p><h1 className="text-lg font-black">Αναζήτηση & Συμφωνία</h1></div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 px-2 py-3 sm:px-4 sm:py-4 lg:grid-cols-[1.1fr_.9fr]">
        <section className="min-w-0 space-y-4">
          <div className="rounded-3xl border border-[#e5dacb] bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center gap-2"><CalendarDays className="size-5 text-[#9b6b36]"/><h2 className="font-black">1. Ημερομηνίες</h2></div>
            <p className="mb-3 text-sm text-[#71675e]">Πάτησε check-in και μετά check-out.</p>
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-[#f7f3ec] p-1.5">
              <button type="button" aria-label="Προηγούμενος μήνας" disabled={activeMonthIndex <= 0} onClick={() => setActiveMonth(months[activeMonthIndex - 1])} className="flex size-10 items-center justify-center rounded-xl bg-white text-[#6f573f] shadow-sm disabled:opacity-25"><ChevronLeft className="size-5"/></button>
              <strong className="capitalize">{new Intl.DateTimeFormat("el-GR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${activeMonth}T12:00:00Z`))}</strong>
              <button type="button" aria-label="Επόμενος μήνας" disabled={activeMonthIndex >= months.length - 1} onClick={() => setActiveMonth(months[activeMonthIndex + 1])} className="flex size-10 items-center justify-center rounded-xl bg-white text-[#6f573f] shadow-sm disabled:opacity-25"><ChevronRight className="size-5"/></button>
            </div>
            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-[#8b8075]" style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
              {['Δε','Τρ','Τε','Πε','Πα','Σα','Κυ'].map((day) => <span key={day} className="py-1">{day}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1" style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
              {Array.from({ length: leadingCalendarCells }, (_, index) => <span key={`empty-${index}`} aria-hidden="true" />)}
              {dates.map((date) => {
                const selected = date === arrival || date === departure; const between = Boolean(arrival && departure && date > arrival && date < departure);
                const disabled = date < today;
                return <button key={date} type="button" disabled={disabled} aria-label={longDate(date)} aria-pressed={selected} onClick={() => chooseDate(date)} className={`aspect-square min-w-0 rounded-xl border text-center text-sm font-black transition active:scale-95 ${selected ? "border-[#855b2c] bg-[#855b2c] text-white shadow" : between ? "border-[#e7d5bf] bg-[#f3e8d9] text-[#6d5237]" : disabled ? "border-transparent bg-transparent text-[#c4bbb1]" : "border-[#ece3d8] bg-[#fcfaf7] text-[#4c443d]"}`}>{Number(date.slice(-2))}</button>;
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm"><div className="rounded-xl bg-[#f7f3ec] p-3"><span className="block text-xs text-[#80756b]">Check-in</span><strong>{arrival ? shortDate(arrival) : "—"}</strong></div><div className="rounded-xl bg-[#f7f3ec] p-3"><span className="block text-xs text-[#80756b]">Check-out</span><strong>{departure ? shortDate(departure) : "—"}</strong></div></div>
          </div>

          <div className="rounded-3xl border border-[#e5dacb] bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center gap-2"><Users className="size-5 text-[#9b6b36]"/><h2 className="font-black">2. Επισκέπτες</h2></div>
            <div className="grid grid-cols-5 gap-1.5" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>{[1,2,3,4,5].map((count) => <button key={count} type="button" aria-label={`${count} ${count === 1 ? "επισκέπτης" : "επισκέπτες"}`} aria-pressed={guests === count} onClick={() => setGuests(count)} className={`h-12 min-w-0 rounded-xl border text-base font-black transition active:scale-95 ${guests === count ? "border-[#855b2c] bg-[#855b2c] text-white" : "border-[#e3d8ca] bg-[#fcfaf7]"}`}>{count}</button>)}</div>
          </div>

          {(loading || (arrival && departure)) && <div className="rounded-3xl border border-[#e5dacb] bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-black">3. Διαθέσιμα δωμάτια</h2>{nights > 0 && <span className="shrink-0 rounded-full bg-[#f3eee6] px-2.5 py-1 text-[11px] font-bold text-[#71675e]">{nights} {nights === 1 ? "βράδυ" : "βράδια"} · {guests} άτ.</span>}</div>
            {loading ? <div className="flex items-center gap-2 py-7 text-sm text-[#71675e]"><LoaderCircle className="size-5 animate-spin"/> Έλεγχος Booking Core…</div> : <>
              {rooms.length > 0 && <div className="mb-2"><p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#657556]">Χωρίς αλλαγή δωματίου</p><div className="grid grid-cols-2 gap-2">{rooms.map((room) => { const active = selection?.type === "room" && selection.roomNumber === room.roomNumber; return <button key={room.roomNumber} type="button" aria-pressed={active} onClick={() => selectRoom(room)} className={`flex min-h-28 min-w-0 flex-col rounded-2xl border p-3 text-left transition active:scale-[.98] ${active ? "border-[#657556] bg-[#e6efdf] ring-2 ring-[#657556]/25" : "border-[#e2d8ca] bg-[#fcfaf7]"}`}><span className="flex items-center gap-1 text-sm font-black">{active && <Check className="size-4 shrink-0"/>}{roomTitle(room)}</span><span className="mt-1 block text-[11px] leading-4 text-[#71675e]">{roomCategoryLabel(room.category)}</span><span className="mt-auto block pt-2 text-sm font-black text-[#657556]">{room.systemTotal}€</span></button>; })}</div></div>}
              {rooms.length === 0 && splits.length > 0 && <div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9b6b36]">Μόνο split stay · 1 αλλαγή</p><p className="mb-2 text-xs text-[#71675e]">Δεν υπάρχει ένα δωμάτιο για όλη τη διαμονή.</p><div className="space-y-2">{splits.map((split, index) => { const active = selection?.type === "split" && selection.firstRoomNumber === split.firstRoomNumber && selection.secondRoomNumber === split.secondRoomNumber && selection.changeDate === split.changeDate; return <button key={`${split.changeDate}-${split.firstRoomNumber}-${split.secondRoomNumber}-${index}`} type="button" aria-pressed={active} onClick={() => selectSplit(split)} className={`w-full rounded-2xl border p-3 text-left transition active:scale-[.99] ${active ? "border-[#9b6b36] bg-[#fff4e4] ring-2 ring-[#9b6b36]/20" : "border-[#e2d8ca] bg-[#fcfaf7]"}`}><span className="block font-black">{split.firstName} → {split.secondName}</span><span className="mt-1 block text-sm text-[#71675e]">{shortDate(arrival)}–{shortDate(split.changeDate)} · Δωμάτιο {split.firstRoomNumber}</span><span className="block text-sm text-[#71675e]">{shortDate(split.changeDate)}–{shortDate(departure)} · Δωμάτιο {split.secondRoomNumber}</span><span className="mt-2 block text-sm font-bold text-[#9b6b36]">Τιμή συστήματος: {split.systemTotal}€</span></button>; })}</div></div>}
              {!rooms.length && !splits.length && <p className="rounded-2xl bg-[#fff1ef] p-4 text-sm font-semibold text-[#8c3f35]">Δεν βρέθηκε διαθέσιμη λύση.</p>}
            </>}
          </div>}

          {selection && <div ref={agreementRef} className="scroll-mt-20 rounded-3xl border border-[#d9c8b3] bg-white p-3 shadow-md sm:p-4">
            <div className="mb-3 flex items-center gap-2"><MessageSquareText className="size-5 text-[#9b6b36]"/><h2 className="font-black">4. Συμφωνία & SMS</h2></div>
            <label className="mb-3 block"><span className="mb-1.5 block text-sm font-bold">Κινητό πελάτη</span><input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} inputMode="tel" placeholder="+30 69XXXXXXXX" className="h-13 w-full rounded-2xl border border-[#d8ccbd] bg-[#fcfaf7] px-3 text-lg font-bold outline-none focus:ring-2 focus:ring-[#9b6b36]/25"/><span className="mt-1 block text-xs text-[#71675e]">Το +30 είναι έτοιμο· μπορείς να το αλλάξεις για ξένο αριθμό.</span></label>
            <label className="mb-3 block"><span className="mb-1.5 block text-sm font-bold">Συμφωνημένη συνολική τιμή</span><div className="flex rounded-2xl border border-[#d8ccbd] bg-[#fcfaf7] focus-within:ring-2 focus-within:ring-[#9b6b36]/25"><input value={agreedTotal} onChange={(event) => setAgreedTotal(event.target.value)} inputMode="decimal" className="h-13 min-w-0 flex-1 bg-transparent px-3 text-lg font-black outline-none"/><span className="flex items-center px-4 text-lg font-black">€</span></div><span className="mt-1 block text-xs text-[#71675e]">Μπορείς να αλλάξεις την τιμή του συστήματος.</span></label>
            <button type="button" onClick={() => setConfirmingSend(true)} disabled={sending || customerPhone.replace(/\D/g, "").length < 10 || !agreedAmount} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#657556] px-4 text-base font-black text-white shadow-lg transition active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-45">{sending ? <LoaderCircle className="animate-spin"/> : <Send/>}{sending ? "Αποστολή…" : "Έλεγχος & αποστολή SMS"}</button>
          </div>}
          {feedback && <div className={`rounded-2xl p-4 text-sm font-bold ${feedback.kind === "ok" ? "bg-[#e9f4e3] text-[#46613b]" : "bg-[#fff0ed] text-[#8c3f35]"}`}>{feedback.text}</div>}
        </section>

        <section className="min-w-0 overflow-hidden rounded-3xl border border-[#e5dacb] bg-white p-3 shadow-sm sm:p-4 lg:sticky lg:top-20 lg:self-start">
          <button type="button" aria-expanded={historyOpen} aria-controls="room-agreements-history" onClick={() => setHistoryOpen((open) => !open)} className={`flex w-full items-center gap-2 text-left ${historyOpen ? "mb-3" : ""}`}><History className="size-5 shrink-0 text-[#9b6b36]"/><h2 className="font-black">Ιστορικό συμφωνιών</h2>{historyLoading && historyOpen && <LoaderCircle className="ml-auto size-4 animate-spin"/>}<ChevronDown className={`ml-auto size-5 shrink-0 text-[#8b6a46] transition-transform ${historyOpen ? "rotate-180" : ""}`}/></button>
          {historyOpen && <div id="room-agreements-history">
            <div className="mb-3 grid grid-cols-2 gap-2">{(["all","pending","completed","declined"] as const).map((status) => <button key={status} type="button" onClick={() => setHistoryStatus(status)} className={`min-w-0 rounded-xl border px-2 py-2 text-xs font-bold ${historyStatus === status ? "border-[#855b2c] bg-[#855b2c] text-white" : "border-[#e1d6c8] bg-[#fcfaf7]"}`}>{status === "all" ? "Όλα" : statusLabels[status]}</button>)}</div>
            <div className="relative mb-4"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#887e74]"/><input value={historyPhone} onChange={(event) => setHistoryPhone(event.target.value)} inputMode="tel" aria-label="Αναζήτηση ιστορικού με κινητό" placeholder="Αναζήτηση με κινητό" className="h-11 w-full rounded-xl border border-[#ddd1c2] bg-[#fcfaf7] pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#9b6b36]/25"/></div>
            <div className="space-y-3 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-1">
            {historyError && <p className="rounded-2xl bg-[#fff0ed] p-3 text-sm font-semibold text-[#8c3f35]">{historyError}</p>}
            {history.map((item) => <article key={item.id} className="min-w-0 overflow-hidden rounded-2xl border border-[#e4dacd] bg-[#fcfaf7] p-3">
              <div className="flex min-w-0 items-start justify-between gap-2"><div className="min-w-0"><strong className="block break-all text-base">+{item.customer_phone}</strong><span className="flex items-center gap-1 text-xs text-[#71675e]"><Clock3 className="size-3 shrink-0"/>{dateTime(item.created_at)}</span></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${item.booking_status === "completed" ? "bg-[#e3efdc] text-[#4d693e]" : item.booking_status === "declined" ? "bg-[#f3e7e4] text-[#8b4b43]" : "bg-[#fff0d9] text-[#8c632c]"}`}>{statusLabels[item.booking_status]}</span></div>
              <div className="my-3 border-y border-[#e8dfd4] py-2 text-sm"><strong>{shortDate(item.arrival)}–{shortDate(item.departure)}</strong> · {item.guests} άτομα<br/>{item.selection.type === "room" ? `Δωμάτιο ${item.selection.roomNumber}` : `Νο${item.selection.firstRoomNumber} → Νο${item.selection.secondRoomNumber} (${shortDate(item.selection.changeDate)})`} · <strong>{Number(item.agreed_total)}€</strong></div>
              <p className="mb-3 text-[11px] text-[#71675e]">SMS πελάτη: {displaySmsStatus(item.customer_sms_status)} · δικό σου: {displaySmsStatus(item.owner_sms_status)}</p>
              <details className="mb-3 rounded-xl bg-white px-3 py-2 text-xs text-[#71675e]"><summary className="cursor-pointer font-bold text-[#5c534b]">Προβολή SMS</summary><p className="mt-2 whitespace-pre-wrap leading-5">{item.message}</p></details>
              {item.booking_status === "pending" && <div className="grid grid-cols-2 gap-2"><button type="button" disabled={Boolean(updatingId)} onClick={() => updateStatus(item.id, "completed")} className="flex h-10 items-center justify-center gap-1 rounded-xl bg-[#657556] text-xs font-black text-white disabled:opacity-50">{updatingId === item.id ? <LoaderCircle className="size-4 animate-spin"/> : <Check className="size-4"/>}Ολοκληρώθηκε</button><button type="button" disabled={Boolean(updatingId)} onClick={() => updateStatus(item.id, "declined")} className="h-10 rounded-xl border border-[#d9c7c0] text-xs font-bold text-[#81534d] disabled:opacity-50">Δεν προχώρησε</button></div>}
            </article>)}
            {!historyLoading && history.length === 0 && <p className="py-8 text-center text-sm text-[#80756b]">Δεν υπάρχουν εγγραφές.</p>}
            </div>
          </div>}
        </section>
      </div>

      {confirmingSend && <div role="dialog" aria-modal="true" aria-labelledby="send-confirmation-title" className="fixed inset-0 z-50 flex items-end bg-black/45 p-2 sm:items-center sm:justify-center" onClick={() => setConfirmingSend(false)}>
        <div className="w-full rounded-3xl bg-white p-4 shadow-2xl sm:max-w-sm" onClick={(event) => event.stopPropagation()}>
          <h2 id="send-confirmation-title" className="text-lg font-black">Τελικός έλεγχος</h2>
          <div className="my-4 rounded-2xl bg-[#f7f3ec] p-3 text-sm leading-7">
            <span className="block"><strong>Πελάτης:</strong> {customerPhone}</span>
            <span className="block"><strong>Ποσό:</strong> {agreedAmount}€</span>
            <span className="block"><strong>Διαμονή:</strong> {shortDate(arrival)}–{shortDate(departure)}</span>
          </div>
          <p className="mb-4 text-sm text-[#71675e]">Θα σταλεί το ίδιο SMS στον πελάτη και στο κινητό σου.</p>
          <div className="grid grid-cols-[.8fr_1.2fr] gap-2">
            <button type="button" onClick={() => setConfirmingSend(false)} className="h-12 rounded-2xl border border-[#d8ccbd] font-bold">Ακύρωση</button>
            <button type="button" autoFocus onClick={sendAgreement} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#657556] font-black text-white"><Send className="size-4"/>Αποστολή SMS</button>
          </div>
        </div>
      </div>}
    </main>
  );
}

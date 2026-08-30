"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronLeft, Clock3, History, LoaderCircle, MessageSquareText, Search, Send, Users } from "lucide-react";

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

export default function RoomAgreementsApp() {
  const today = useMemo(athensToday, []);
  const months = useMemo(() => Array.from({ length: 13 }, (_, index) => monthStart(today, index)), [today]);
  const [activeMonth, setActiveMonth] = useState(() => monthStart(today));
  const dates = useMemo(() => {
    const nextMonth = monthStart(activeMonth, 1);
    const result: string[] = [];
    for (let date = activeMonth; date < nextMonth; date = addDays(date, 1)) if (date >= today) result.push(date);
    return result;
  }, [activeMonth, today]);
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
  const [historyStatus, setHistoryStatus] = useState("all");
  const [historyPhone, setHistoryPhone] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    const params = new URLSearchParams();
    if (historyStatus !== "all") params.set("status", historyStatus);
    if (historyPhone.trim()) params.set("phone", historyPhone.trim());
    try {
      const response = await fetch(`${API}?${params}`, { cache: "no-store" });
      const data = await response.json();
      if (data.ok) setHistory(data.agreements || []);
    } finally { setHistoryLoading(false); }
  }, [historyPhone, historyStatus]);

  useEffect(() => { void loadHistory(); }, [loadHistory]);

  useEffect(() => {
    setSelection(null); setAgreedTotal(""); setRooms([]); setSplits([]); setFeedback(null);
    if (!arrival || !departure || departure <= arrival) return;
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ mode: "availability", arrival, departure, guests: String(guests) });
        const response = await fetch(`${API}?${params}`, { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || "Ο έλεγχος απέτυχε.");
        setRooms(data.rooms || []); setSplits(data.splits || []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setFeedback({ kind: "error", text: (error as Error).message });
      } finally { setLoading(false); }
    };
    void run(); return () => controller.abort();
  }, [arrival, departure, guests]);

  function chooseDate(date: string) {
    if (!arrival || departure || date <= arrival) { setArrival(date); setDeparture(""); }
    else setDeparture(date);
  }

  function selectRoom(room: RoomOffer) {
    setSelection({ type: "room", roomNumber: room.roomNumber }); setAgreedTotal(String(room.systemTotal || ""));
  }
  function selectSplit(split: SplitOffer) {
    setSelection({ type: "split", firstRoomNumber: split.firstRoomNumber, secondRoomNumber: split.secondRoomNumber, changeDate: split.changeDate });
    setAgreedTotal(String(split.systemTotal || ""));
  }

  const preview = useMemo(() => {
    if (!arrival || !departure || !selection || !agreedTotal) return "";
    const stay = selection.type === "room" ? `στο Δωμάτιο ${selection.roomNumber}` : `${shortDate(arrival)}–${shortDate(selection.changeDate)} στο Δωμάτιο ${selection.firstRoomNumber} και ${shortDate(selection.changeDate)}–${shortDate(departure)} στο Δωμάτιο ${selection.secondRoomNumber}`;
    return `Η συμφωνία μας αφορά διαμονή από ${shortDate(arrival)} έως ${shortDate(departure)}, για ${guests} ${guests === 1 ? "επισκέπτη" : "επισκέπτες"}, ${stay}, με συνολική τιμή ${agreedTotal}€. Παρακαλούμε στείλτε μας email στο chioshotel@gmail.com, ώστε να σας αποστείλουμε την επιβεβαίωση της κράτησης. Voulamandis House`;
  }, [agreedTotal, arrival, departure, guests, selection]);

  async function sendAgreement() {
    if (!selection || !customerPhone.trim() || !Number(agreedTotal)) return;
    if (!window.confirm(`Να σταλεί το SMS στον πελάτη ${customerPhone} και στο +30 694 447 4226;`)) return;
    setSending(true); setFeedback(null);
    try {
      const response = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ arrival, departure, guests, selection, agreedTotal: Number(agreedTotal), customerPhone }) });
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
      await loadHistory();
    } catch (error) { setFeedback({ kind: "error", text: (error as Error).message }); }
    finally { setSending(false); }
  }

  async function updateStatus(id: string, status: Agreement["booking_status"]) {
    const response = await fetch(API, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    const data = await response.json();
    if (!response.ok || !data.ok) { setFeedback({ kind: "error", text: data.error || "Η αλλαγή απέτυχε." }); return; }
    await loadHistory();
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] pb-24 text-[#352f29]">
      <header className="sticky top-0 z-30 border-b border-[#e7ddcf] bg-[#f7f3ec]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link href="/staff" aria-label="Πίσω στο Staff" className="flex size-11 items-center justify-center rounded-full bg-white shadow-sm"><ChevronLeft /></Link>
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9b6b36]">Staff only</p><h1 className="text-lg font-black">Αναζήτηση & Συμφωνία</h1></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-5 px-3 py-4 lg:grid-cols-[1.1fr_.9fr] lg:px-4">
        <section className="space-y-4">
          <div className="rounded-3xl border border-[#e5dacb] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2"><CalendarDays className="size-5 text-[#9b6b36]"/><h2 className="font-black">1. Ημερομηνίες</h2></div>
            <p className="mb-3 text-sm text-[#71675e]">Πάτησε check-in και μετά check-out.</p>
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {months.map((month) => <button key={month} type="button" onClick={() => setActiveMonth(month)} className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold capitalize ${activeMonth === month ? "border-[#855b2c] bg-[#855b2c] text-white" : "border-[#e1d6c8] bg-[#fcfaf7]"}`}>{new Intl.DateTimeFormat("el-GR", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}T12:00:00Z`))}</button>)}
            </div>
            <div className="flex snap-x gap-2 overflow-x-auto pb-2">
              {dates.map((date) => {
                const selected = date === arrival || date === departure; const between = Boolean(arrival && departure && date > arrival && date < departure);
                return <button key={date} type="button" onClick={() => chooseDate(date)} className={`min-w-[74px] snap-start rounded-2xl border px-2 py-3 text-center transition ${selected ? "border-[#855b2c] bg-[#855b2c] text-white shadow" : between ? "border-[#d9c3a8] bg-[#f3e8d9]" : "border-[#e6ddd2] bg-[#fcfaf7]"}`}><span className="block text-[11px] font-bold uppercase">{longDate(date).split(" ")[0]}</span><span className="mt-1 block text-sm font-black">{shortDate(date)}</span></button>;
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm"><div className="rounded-xl bg-[#f7f3ec] p-3"><span className="block text-xs text-[#80756b]">Check-in</span><strong>{arrival ? shortDate(arrival) : "—"}</strong></div><div className="rounded-xl bg-[#f7f3ec] p-3"><span className="block text-xs text-[#80756b]">Check-out</span><strong>{departure ? shortDate(departure) : "—"}</strong></div></div>
          </div>

          <div className="rounded-3xl border border-[#e5dacb] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2"><Users className="size-5 text-[#9b6b36]"/><h2 className="font-black">2. Επισκέπτες</h2></div>
            <div className="grid grid-cols-5 gap-2">{[1,2,3,4,5].map((count) => <button key={count} onClick={() => setGuests(count)} className={`h-12 rounded-xl border text-base font-black ${guests === count ? "border-[#855b2c] bg-[#855b2c] text-white" : "border-[#e3d8ca] bg-[#fcfaf7]"}`}>{count}</button>)}</div>
          </div>

          {(loading || (arrival && departure)) && <div className="rounded-3xl border border-[#e5dacb] bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-black">3. Διαθέσιμα δωμάτια</h2>
            {loading ? <div className="flex items-center gap-2 py-7 text-sm text-[#71675e]"><LoaderCircle className="size-5 animate-spin"/> Έλεγχος Booking Core…</div> : <>
              {rooms.length > 0 && <div className="mb-4"><p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#657556]">Χωρίς αλλαγή</p><div className="grid grid-cols-2 gap-2">{rooms.map((room) => { const active = selection?.type === "room" && selection.roomNumber === room.roomNumber; return <button key={room.roomNumber} onClick={() => selectRoom(room)} className={`rounded-2xl border p-3 text-left ${active ? "border-[#657556] bg-[#eef3e9] ring-2 ring-[#657556]/20" : "border-[#e2d8ca] bg-[#fcfaf7]"}`}><span className="block text-base font-black">Δωμάτιο {room.roomNumber}</span><span className="mt-1 block text-xs text-[#71675e]">{room.category}</span><span className="mt-2 block text-sm font-bold text-[#657556]">Σύστημα: {room.systemTotal}€</span></button>; })}</div></div>}
              {splits.length > 0 && <div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9b6b36]">Split stay · 1 αλλαγή</p><div className="space-y-2">{splits.map((split, index) => { const active = selection?.type === "split" && selection.firstRoomNumber === split.firstRoomNumber && selection.secondRoomNumber === split.secondRoomNumber && selection.changeDate === split.changeDate; return <button key={`${split.changeDate}-${split.firstRoomNumber}-${split.secondRoomNumber}-${index}`} onClick={() => selectSplit(split)} className={`w-full rounded-2xl border p-3 text-left ${active ? "border-[#9b6b36] bg-[#fff4e4] ring-2 ring-[#9b6b36]/20" : "border-[#e2d8ca] bg-[#fcfaf7]"}`}><span className="block font-black">Δωμάτιο {split.firstRoomNumber} → Δωμάτιο {split.secondRoomNumber}</span><span className="mt-1 block text-sm text-[#71675e]">{shortDate(arrival)}–{shortDate(split.changeDate)} · Νο{split.firstRoomNumber}</span><span className="block text-sm text-[#71675e]">{shortDate(split.changeDate)}–{shortDate(departure)} · Νο{split.secondRoomNumber}</span><span className="mt-2 block text-sm font-bold text-[#9b6b36]">Σύστημα: {split.systemTotal}€</span></button>; })}</div></div>}
              {!rooms.length && !splits.length && <p className="rounded-2xl bg-[#fff1ef] p-4 text-sm font-semibold text-[#8c3f35]">Δεν βρέθηκε διαθέσιμη λύση.</p>}
            </>}
          </div>}

          {selection && <div className="rounded-3xl border border-[#d9c8b3] bg-white p-4 shadow-md">
            <div className="mb-3 flex items-center gap-2"><MessageSquareText className="size-5 text-[#9b6b36]"/><h2 className="font-black">4. Συμφωνία & SMS</h2></div>
            <label className="mb-3 block"><span className="mb-1.5 block text-sm font-bold">Κινητό πελάτη</span><input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} inputMode="tel" placeholder="+30 69XXXXXXXX" className="h-13 w-full rounded-2xl border border-[#d8ccbd] bg-[#fcfaf7] px-3 text-lg font-bold outline-none focus:ring-2 focus:ring-[#9b6b36]/25"/><span className="mt-1 block text-xs text-[#71675e]">Το +30 είναι έτοιμο· μπορείς να το αλλάξεις για ξένο αριθμό.</span></label>
            <label className="mb-3 block"><span className="mb-1.5 block text-sm font-bold">Συμφωνημένη συνολική τιμή</span><div className="flex rounded-2xl border border-[#d8ccbd] bg-[#fcfaf7] focus-within:ring-2 focus-within:ring-[#9b6b36]/25"><input value={agreedTotal} onChange={(event) => setAgreedTotal(event.target.value)} inputMode="decimal" className="h-13 min-w-0 flex-1 bg-transparent px-3 text-lg font-black outline-none"/><span className="flex items-center px-4 text-lg font-black">€</span></div><span className="mt-1 block text-xs text-[#71675e]">Μπορείς να αλλάξεις την τιμή του συστήματος.</span></label>
            {preview && <div className="mb-3 rounded-2xl bg-[#f3eee6] p-3 text-sm leading-6"><span className="mb-1 block text-xs font-black uppercase tracking-wider text-[#9b6b36]">Προεπισκόπηση SMS</span>{preview}</div>}
            <div className="mb-3 rounded-xl border border-[#d8e4cf] bg-[#f2f7ee] p-3 text-xs font-semibold text-[#536548]">Θα σταλεί στον πελάτη και στο +30 694 447 4226.</div>
            <button onClick={sendAgreement} disabled={sending || customerPhone.replace(/\D/g, "").length < 10 || !Number(agreedTotal)} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#657556] px-4 text-base font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-45">{sending ? <LoaderCircle className="animate-spin"/> : <Send/>}{sending ? "Αποστολή…" : "Επιβεβαίωση & αποστολή SMS"}</button>
          </div>}
          {feedback && <div className={`rounded-2xl p-4 text-sm font-bold ${feedback.kind === "ok" ? "bg-[#e9f4e3] text-[#46613b]" : "bg-[#fff0ed] text-[#8c3f35]"}`}>{feedback.text}</div>}
        </section>

        <section className="rounded-3xl border border-[#e5dacb] bg-white p-4 shadow-sm lg:self-start lg:sticky lg:top-20">
          <div className="mb-3 flex items-center gap-2"><History className="size-5 text-[#9b6b36]"/><h2 className="font-black">Ιστορικό συμφωνιών</h2>{historyLoading && <LoaderCircle className="ml-auto size-4 animate-spin"/>}</div>
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">{(["all","pending","completed","declined"] as const).map((status) => <button key={status} onClick={() => setHistoryStatus(status)} className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold ${historyStatus === status ? "border-[#855b2c] bg-[#855b2c] text-white" : "border-[#e1d6c8] bg-[#fcfaf7]"}`}>{status === "all" ? "Όλα" : statusLabels[status]}</button>)}</div>
          <div className="relative mb-4"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#887e74]"/><input value={historyPhone} onChange={(event) => setHistoryPhone(event.target.value)} inputMode="tel" placeholder="Αναζήτηση με κινητό" className="h-11 w-full rounded-xl border border-[#ddd1c2] bg-[#fcfaf7] pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#9b6b36]/25"/></div>
          <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
            {history.map((item) => <article key={item.id} className="rounded-2xl border border-[#e4dacd] bg-[#fcfaf7] p-3">
              <div className="flex items-start justify-between gap-2"><div><strong className="block text-base">+{item.customer_phone}</strong><span className="flex items-center gap-1 text-xs text-[#71675e]"><Clock3 className="size-3"/>{dateTime(item.created_at)}</span></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${item.booking_status === "completed" ? "bg-[#e3efdc] text-[#4d693e]" : item.booking_status === "declined" ? "bg-[#f3e7e4] text-[#8b4b43]" : "bg-[#fff0d9] text-[#8c632c]"}`}>{statusLabels[item.booking_status]}</span></div>
              <div className="my-3 border-y border-[#e8dfd4] py-2 text-sm"><strong>{shortDate(item.arrival)}–{shortDate(item.departure)}</strong> · {item.guests} άτομα<br/>{item.selection.type === "room" ? `Δωμάτιο ${item.selection.roomNumber}` : `Νο${item.selection.firstRoomNumber} → Νο${item.selection.secondRoomNumber} (${shortDate(item.selection.changeDate)})`} · <strong>{Number(item.agreed_total)}€</strong></div>
              <p className="mb-3 text-[11px] text-[#71675e]">SMS πελάτη: {item.customer_sms_status} · δικό σου: {item.owner_sms_status}</p>
              <details className="mb-3 rounded-xl bg-white px-3 py-2 text-xs text-[#71675e]"><summary className="cursor-pointer font-bold text-[#5c534b]">Προβολή SMS</summary><p className="mt-2 whitespace-pre-wrap leading-5">{item.message}</p></details>
              {item.booking_status === "pending" && <div className="grid grid-cols-2 gap-2"><button onClick={() => updateStatus(item.id, "completed")} className="flex h-10 items-center justify-center gap-1 rounded-xl bg-[#657556] text-xs font-black text-white"><Check className="size-4"/>Ολοκληρώθηκε</button><button onClick={() => updateStatus(item.id, "declined")} className="h-10 rounded-xl border border-[#d9c7c0] text-xs font-bold text-[#81534d]">Δεν προχώρησε</button></div>}
            </article>)}
            {!historyLoading && history.length === 0 && <p className="py-8 text-center text-sm text-[#80756b]">Δεν υπάρχουν εγγραφές.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import RoomDayPanel from "../rooms/RoomDayPanel";

type BoardEvent = { time: string; channel: "guest" | "staff" | "email" | "sms" | "whatsapp" | "ota"; title: string; body: string | null; summary: string | null; status: string | null };
type Booking = {
  bookingIds: string[]; name: string; firstName: string; rooms: string[]; checkin: string; checkout: string; status: string;
  channel: string; email: string | null; emailState: "real" | "virtual" | "none"; phone: string | null; arrivalTime: string | null; arrivalDetails: string | null; arrivalClosed: boolean; smsTemplate: string; deliveryProblem: string | null; emailSyncError: string | null; events: BoardEvent[];
};
type Filter = "all" | "no_email" | "no_arrival" | "messages";
type Tier = "arriving" | "action" | "later";

const API = "/api/staff/crm/bookings/";
// The same window the server uses for a missing arrival time.
const ACTION_DAYS = 14;
const TIERS: { key: Tier; title: string; hint: string }[] = [
  { key: "arriving", title: "Έρχονται σήμερα και αύριο", hint: "Οι πιο κοντινές αφίξεις." },
  { key: "action", title: "Θέλουν ενέργεια", hint: "Προβλήματα αποστολής και ό,τι λείπει για αφίξεις μέσα σε 14 μέρες." },
  { key: "later", title: "Αργότερα", hint: "Δεν βιάζει. Ή περιμένουμε απάντηση ή είναι ακόμα μακριά." },
];
const TIER_BAR: Record<Tier, string> = { arriving: "border-amber-600", action: "border-red-600", later: "border-stone-200" };
const inputClass = "w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";
const secondaryButton = "rounded-full border border-amber-800/30 bg-white px-4 py-2 text-sm font-black text-amber-900 disabled:opacity-50";
const primaryButton = "rounded-full bg-amber-800 px-4 py-2 text-sm font-black text-white disabled:opacity-50";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Όλες" },
  { key: "no_email", label: "Χωρίς email" },
  { key: "no_arrival", label: "Χωρίς ώρα άφιξης" },
  { key: "messages", label: "Με μηνύματα" },
];
const SMS_STATUS: Record<string, { label: string; tone: string }> = {
  DELIVERED: { label: "✓ Παραδόθηκε", tone: "text-emerald-800" },
  SENT: { label: "Στάλθηκε, περιμένει παράδοση", tone: "text-amber-800" },
  QUEUE: { label: "Σε αναμονή", tone: "text-amber-800" },
  ACCEPTED: { label: "Έγινε δεκτό από το δίκτυο", tone: "text-amber-800" },
  UNDELIVERED: { label: "✕ Δεν παραδόθηκε", tone: "text-red-800" },
  FAILED: { label: "✕ Απέτυχε", tone: "text-red-800" },
  EXPIRED: { label: "✕ Έληξε", tone: "text-red-800" },
  REJECTED: { label: "✕ Απορρίφθηκε", tone: "text-red-800" },
};
const CHANNEL_DOT: Record<BoardEvent["channel"], string> = {
  guest: "bg-stone-100", staff: "bg-emerald-50", email: "bg-sky-50", sms: "bg-violet-50", whatsapp: "bg-emerald-50", ota: "bg-amber-50",
};

const thisMonth = () => new Date().toISOString().slice(0, 7);
function shiftMonth(month: string, delta: number) {
  const [year, mon] = month.split("-").map(Number);
  return new Date(Date.UTC(year, mon - 1 + delta, 1)).toISOString().slice(0, 7);
}
const monthLabel = (month: string) => new Intl.DateTimeFormat("el-GR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-01T00:00:00Z`));
const shortDate = (iso: string) => new Intl.DateTimeFormat("el-GR", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

function Chip({ tone, children }: { tone: "ok" | "bad" | "quiet"; children: React.ReactNode }) {
  const color = tone === "ok" ? "bg-emerald-100 text-emerald-900" : tone === "bad" ? "bg-red-100 text-red-900" : "bg-stone-100 text-stone-700";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${color}`}>{children}</span>;
}

const athensToday = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Athens" }).format(new Date());
const daysFrom = (iso: string, from: string) => Math.round((Date.parse(iso) - Date.parse(from)) / 86_400_000);
const monthShort = (iso: string) => new Intl.DateTimeFormat("el-GR", { month: "short", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

function relativeDay(booking: Booking, today: string) {
  const days = daysFrom(booking.checkin, today);
  if (days < 0) return booking.checkout > today ? "Μένει τώρα" : "";
  if (days === 0) return "Σήμερα";
  if (days === 1) return "Αύριο";
  if (days < 14) return `σε ${days} μέρες`;
  if (days < 60) return `σε ${Math.round(days / 7)} εβδομάδες`;
  const months = Math.round(days / 30);
  return months === 1 ? "σε 1 μήνα" : `σε ${months} μήνες`;
}

/** Rooms booked together show once with a count, in place of a repeated list. */
function roomSummary(rooms: string[]) {
  const counts = new Map<string, number>();
  for (const room of rooms) counts.set(room, (counts.get(room) ?? 0) + 1);
  return [...counts.entries()].map(([room, count]) => (count > 1 ? `${count} × ${room}` : room)).join(", ") || "Χωρίς δωμάτιο";
}

function tierOf(booking: Booking, today: string): Tier {
  const days = daysFrom(booking.checkin, today);
  if (days <= 1) return "arriving";
  const missing = booking.emailState !== "real" || (!booking.arrivalTime && !booking.arrivalClosed);
  return booking.deliveryProblem || booking.emailSyncError || (missing && days <= ACTION_DAYS) ? "action" : "later";
}

/** One sentence with what happens next, so the card does not have to be opened. */
function nextStep(booking: Booking, days: number) {
  if (booking.deliveryProblem) return `${booking.deliveryProblem}. Δοκίμασε άλλο κανάλι.`;
  if (booking.emailSyncError) return "Το email δεν γράφτηκε στο Beds24. Δοκίμασε ξανά.";
  if (days < 0) return null;
  if (booking.emailState !== "real") {
    const asked = [...booking.events].reverse().find((event) => event.channel === "ota");
    if (asked) return `Ζητήθηκε email στις ${shortDate(asked.time.slice(0, 10))}, περιμένουμε απάντηση.`;
    return booking.emailState === "virtual" ? `Δεν έχει ζητηθεί email μέσω ${booking.channel}.` : "Δεν υπάρχει email για επικοινωνία.";
  }
  if (!booking.arrivalTime && !booking.arrivalClosed && days <= ACTION_DAYS) return "Ζήτα την ώρα άφιξης.";
  return days <= 1 ? "Όλα έτοιμα." : null;
}

export default function BookingsPanel({ attention = false }: { attention?: boolean }) {
  const [month, setMonth] = useState(thisMonth);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null | undefined>(undefined);
  const [sms, setSms] = useState({ phone: "", message: "" });
  const [realEmail, setRealEmail] = useState("");
  const [arrivalForm, setArrivalForm] = useState({ time: "", details: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const response = await fetch(attention ? `${API}?attention=1` : `${API}?month=${month}`, { cache: "no-store" });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error);
    setBookings(payload.bookings);
  }, [attention, month]);

  useEffect(() => {
    setBookings(null);
    setOpenId(null);
    load().catch((reason) => setError(reason.message));
  }, [load]);

  const visible = useMemo(() => (bookings ?? []).filter((booking) => {
    if (filter === "no_email") return booking.emailState !== "real";
    if (filter === "no_arrival") return !booking.arrivalTime && !booking.arrivalClosed;
    if (filter === "messages") return booking.events.some((event) => event.channel === "guest");
    return true;
  }), [bookings, filter]);

  const toggle = async (booking: Booking) => {
    const id = booking.bookingIds[0];
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    setNotes(undefined);
    setSms({ phone: booking.phone ?? "", message: "" });
    setRealEmail("");
    setArrivalForm({ time: booking.arrivalTime ?? "", details: booking.arrivalDetails ?? "" });
    setNotice("");
    await loadNotes(id);
  };

  const loadNotes = async (bookingId: string) => {
    const response = await fetch(`${API}?notes=${bookingId}`, { cache: "no-store" });
    const payload = await response.json().catch(() => null);
    setNotes(payload?.ok ? payload.notes : null);
  };

  const runCheck = async (booking: Booking) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check", bookingIds: booking.bookingIds, email: booking.email }),
      });
      const payload = await response.json();
      if (!payload.ok) throw new Error(payload.error);
      const found = payload.beds24 + payload.gmail;
      const gmailNote = payload.gmailReady ? "" : " Το Gmail δεν έχει συνδεθεί ακόμα, ελέγχθηκαν μόνο τα μηνύματα Booking/Expedia.";
      setNotice(`${found ? `Βρέθηκαν ${found} νέα: ${payload.gmail} email, ${payload.beds24} μηνύματα.` : "Δεν βρέθηκε κάτι νέο."}${gmailNote}`);
      await load();
      await loadNotes(booking.bookingIds[0]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Ο έλεγχος απέτυχε.");
    } finally {
      setBusy(false);
    }
  };

  const askOnChannel = async (booking: Booking) => {
    if (!window.confirm("Να σταλεί τώρα μήνυμα στον πελάτη μέσω Booking/Expedia;")) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/staff/crm/emails/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "outreach_one", bookingId: booking.bookingIds[0] }),
      });
      const payload = await response.json();
      if (!payload.ok) throw new Error(payload.error);
      setNotice("Το Beds24 δέχτηκε το μήνυμα.");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Η αποστολή απέτυχε.");
      await load().catch(() => undefined);
    } finally {
      setBusy(false);
    }
  };

  const sendSms = async (booking: Booking) => {
    if (!window.confirm(`Να σταλεί SMS στο ${sms.phone};`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.bookingIds[0], guestName: booking.name, phone: sms.phone, message: sms.message }),
      });
      const payload = await response.json();
      if (!payload.ok) throw new Error(payload.error);
      setSms({ ...sms, message: "" });
      setNotice("Το SMS στάλθηκε. Η παράδοση θα φανεί στο ιστορικό.");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Το SMS απέτυχε.");
      await load().catch(() => undefined);
    } finally {
      setBusy(false);
    }
  };

  const saveEmail = async (booking: Booking, email: string) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/staff/crm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_real_email", bookingId: booking.bookingIds[0], email }),
      });
      const payload = await response.json();
      if (!payload.ok) throw new Error(payload.error);
      setNotice("Το email αποθηκεύτηκε.");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Δεν αποθηκεύτηκε.");
    } finally {
      setBusy(false);
    }
  };

  const saveArrival = async (booking: Booking, time: string, details: string) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "arrival", bookingIds: booking.bookingIds, time, details }),
      });
      const payload = await response.json();
      if (!payload.ok) throw new Error(payload.error);
      setOpenId(null);
      setNotice(!time && !details ? "Η εκκρεμότητα άνοιξε ξανά." : payload.noted ? "Η άφιξη καταχωρήθηκε και γράφτηκε στα Notes του Beds24." : "Η άφιξη αποθηκεύτηκε στο CRM, αλλά όχι στα Notes του Beds24.");
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Δεν αποθηκεύτηκε.");
    } finally {
      setBusy(false);
    }
  };

  const total = bookings?.length ?? 0;
  const withEmail = (bookings ?? []).filter((booking) => booking.emailState === "real").length;
  const withArrival = (bookings ?? []).filter((booking) => booking.arrivalTime || booking.arrivalClosed).length;
  const today = athensToday();
  const groups = TIERS.map((item) => ({ ...item, bookings: visible.filter((booking) => tierOf(booking, today) === item.key) })).filter((group) => group.bookings.length);
  const actionCount = (bookings ?? []).filter((booking) => tierOf(booking, today) === "action").length;

  const renderCard = (booking: Booking) => {
    const open = openId === booking.bookingIds[0];
    const days = daysFrom(booking.checkin, today);
    const tier = tierOf(booking, today);
    const nights = daysFrom(booking.checkout, booking.checkin);
    const guestMessages = booking.events.filter((event) => event.channel === "guest").length;
    const lastSms = [...booking.events].reverse().find((event) => event.channel === "sms");
    const step = nextStep(booking, days);
    const soon = days >= 0 && days <= ACTION_DAYS;
    const missingArrival = !booking.arrivalTime && !booking.arrivalClosed;
    const when = relativeDay(booking, today);
    return (
      <li key={booking.bookingIds[0]} className={`overflow-hidden rounded-2xl border-l-4 bg-white shadow-sm ${attention ? TIER_BAR[tier] : "border-transparent"}`}>
        <button type="button" aria-expanded={open} onClick={() => toggle(booking)} className="grid w-full grid-cols-[3.25rem_minmax(0,1fr)] gap-3 p-4 text-left">
          <span className="grid justify-items-center self-start rounded-xl bg-[#f6efe5] py-2 text-stone-800">
            <span className="text-xl font-black leading-none">{Number(booking.checkin.slice(8))}</span>
            <span className="mt-1 text-xs font-bold">{monthShort(booking.checkin)}</span>
          </span>
          <span className="grid min-w-0 gap-1.5">
            <span className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="min-w-0 break-words text-base font-black">{booking.name || "Χωρίς όνομα"}</span>
              {when ? <span className={`text-sm font-bold ${days >= 0 && days <= 1 ? "text-amber-800" : "text-stone-500"}`}>{when}</span> : null}
            </span>
            <span className="text-sm text-stone-600">{roomSummary(booking.rooms)} · {nights} {nights === 1 ? "νύχτα" : "νύχτες"} · {booking.channel}</span>
            {step ? <span className={`text-sm font-bold ${tier === "later" ? "text-stone-600" : tier === "arriving" && !booking.deliveryProblem && booking.emailState === "real" && !missingArrival ? "text-emerald-800" : "text-red-900"}`}>{step}</span> : null}
            <span className="flex flex-wrap gap-1.5">
              {booking.emailState === "real" ? (attention ? null : <Chip tone="ok">✓ Email</Chip>) : days >= 0 ? <Chip tone={soon ? "bad" : "quiet"}>Χωρίς email</Chip> : null}
              {booking.arrivalTime ? <Chip tone="ok">Άφιξη {booking.arrivalTime}</Chip> : booking.arrivalClosed ? <Chip tone="ok">✓ Άφιξη</Chip> : soon ? <Chip tone="bad">Χωρίς ώρα άφιξης</Chip> : days >= 0 && !attention ? <Chip tone="quiet">Ώρα άφιξης αργότερα</Chip> : null}
              {booking.deliveryProblem ? <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-black text-white">⚠ {booking.deliveryProblem}</span> : null}
              {booking.emailSyncError ? <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-black text-white">⚠ Το email δεν γράφτηκε στο Beds24</span> : null}
              {guestMessages ? <Chip tone="quiet">💬 {guestMessages}</Chip> : null}
              {lastSms ? <span className={`rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-black ${SMS_STATUS[lastSms.status ?? ""]?.tone ?? ""}`}>SMS: {SMS_STATUS[lastSms.status ?? ""]?.label ?? lastSms.status}</span> : null}
            </span>
          </span>
        </button>

        {open ? (
          <div className="grid gap-5 border-t border-stone-100 p-4 lg:grid-cols-2">
            <section className="grid content-start gap-3">
              {notice ? <p role="status" className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-900">{notice}</p> : null}
              <h3 className="font-black">Στοιχεία</h3>
              <div className="grid gap-1 text-sm">
                <p className="break-all">{booking.email ? (booking.emailState === "real" ? <a className="font-bold text-amber-900 underline" href={`mailto:${booking.email}`}>{booking.email}</a> : `${booking.email} (εικονικό)`) : "Χωρίς email"}</p>
                <p>{booking.phone ? <a className="font-bold text-amber-900 underline" href={`tel:${booking.phone}`}>{booking.phone}</a> : "Χωρίς κινητό"}</p>
                <p className="text-stone-600">#{booking.bookingIds.join(", ")} · {booking.rooms.join(", ")}</p>
              </div>
              {booking.emailSyncError ? (
                <div className="grid gap-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-900">
                  <p>⚠ {booking.emailSyncError}. Το CRM το έχει, αλλά τα μηνύματα του Beds24 πάνε ακόμα στο παλιό email. Ξαναδοκιμάζει μόνο του κάθε πρωί.</p>
                  <button type="button" disabled={busy} className={secondaryButton} onClick={() => saveEmail(booking, booking.email ?? "")}>Δοκίμασε ξανά τώρα</button>
                </div>
              ) : null}
              {booking.emailState !== "real" ? (
                <form className="flex flex-wrap items-end gap-2" onSubmit={(event) => { event.preventDefault(); void saveEmail(booking, realEmail); }}>
                  <div className="min-w-[200px] flex-1">
                    <label htmlFor={`crm-board-email-${booking.bookingIds[0]}`} className="mb-1 block text-sm font-bold">Πραγματικό email</label>
                    <input id={`crm-board-email-${booking.bookingIds[0]}`} type="email" required className={inputClass} value={realEmail} onChange={(event) => setRealEmail(event.target.value)} />
                  </div>
                  <button type="submit" disabled={busy} className={secondaryButton}>Αποθήκευση</button>
                </form>
              ) : null}

              {booking.emailState === "virtual" ? (
                <button type="button" disabled={busy} className={`${primaryButton} justify-self-start`} onClick={() => askOnChannel(booking)}>
                  Ζήτα email μέσω {booking.channel}
                </button>
              ) : null}

              <form className="grid gap-2 rounded-xl bg-stone-50 p-3" onSubmit={(event) => { event.preventDefault(); void saveArrival(booking, arrivalForm.time, arrivalForm.details); }}>
                <h3 className="font-black">Άφιξη</h3>
                <div className="flex flex-wrap items-end gap-2">
                  <div>
                    <label htmlFor={`crm-board-arrival-${booking.bookingIds[0]}`} className="mb-1 block text-sm font-bold">Ώρα</label>
                    <input id={`crm-board-arrival-${booking.bookingIds[0]}`} type="time" className={inputClass} value={arrivalForm.time} onChange={(event) => setArrivalForm({ ...arrivalForm, time: event.target.value })} />
                  </div>
                  <div className="min-w-[200px] flex-1">
                    <label htmlFor={`crm-board-arrival-details-${booking.bookingIds[0]}`} className="mb-1 block text-sm font-bold">Λεπτομέρειες</label>
                    <input id={`crm-board-arrival-details-${booking.bookingIds[0]}`} type="text" maxLength={300} placeholder="π.χ. πλοίο, ταξί, αυτοκίνητο" className={inputClass} value={arrivalForm.details} onChange={(event) => setArrivalForm({ ...arrivalForm, details: event.target.value })} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="submit" disabled={busy || (!arrivalForm.time && !arrivalForm.details.trim())} className={primaryButton}>Αποθήκευση και κλείσιμο</button>
                  {booking.arrivalClosed ? <button type="button" disabled={busy} className={secondaryButton} onClick={() => saveArrival(booking, "", "")}>Άνοιγμα ξανά</button> : null}
                </div>
              </form>

              <details className="rounded-xl bg-stone-50 p-3">
                <summary className="cursor-pointer font-black">Αποστολή SMS</summary>
                <div className="mt-3 grid gap-2">
                  {!booking.phone ? <p className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900">Δεν υπάρχει κινητό σε αυτή την κράτηση.</p> : null}
                  <button type="button" className={`${secondaryButton} justify-self-start`} onClick={() => setSms({ ...sms, message: booking.smsTemplate })}>Έτοιμο κείμενο</button>
                  <form className="grid gap-2" onSubmit={(event) => { event.preventDefault(); void sendSms(booking); }}>
                    <div>
                      <label htmlFor={`crm-sms-phone-${booking.bookingIds[0]}`} className="mb-1 block text-sm font-bold">Κινητό</label>
                      <input id={`crm-sms-phone-${booking.bookingIds[0]}`} required className={inputClass} value={sms.phone} onChange={(event) => setSms({ ...sms, phone: event.target.value })} />
                    </div>
                    <div>
                      <label htmlFor={`crm-sms-text-${booking.bookingIds[0]}`} className="mb-1 block text-sm font-bold">Μήνυμα ({sms.message.length})</label>
                      <textarea id={`crm-sms-text-${booking.bookingIds[0]}`} required rows={4} maxLength={918} className={inputClass} value={sms.message} onChange={(event) => setSms({ ...sms, message: event.target.value })} />
                    </div>
                    <button type="submit" disabled={busy} className={`${primaryButton} justify-self-start`}>Αποστολή SMS</button>
                  </form>
                </div>
              </details>
            </section>

            <section className="grid content-start gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black">Ιστορικό</h3>
                <button type="button" disabled={busy} className={secondaryButton} onClick={() => runCheck(booking)}>
                  {busy ? "Έλεγχος…" : "Έλεγχος email & μηνυμάτων"}
                </button>
              </div>
              {!booking.events.length ? <p className="text-sm text-stone-600">Δεν υπάρχει επικοινωνία ακόμα.</p> : null}
              {[...booking.events].reverse().map((event, index) => (
                <article key={`${event.time}-${index}`} className={`rounded-xl p-3 text-sm ${CHANNEL_DOT[event.channel]}`}>
                  <p className="font-bold">{event.title} · {event.time}</p>
                  {event.summary ? <p className="mt-1 font-bold text-amber-900">{event.summary}</p> : null}
                  {event.body ? <p className="mt-1 whitespace-pre-wrap break-words">{event.body}</p> : null}
                  {event.status ? <p className={`mt-1 font-black ${SMS_STATUS[event.status]?.tone ?? "text-stone-600"}`}>{SMS_STATUS[event.status]?.label ?? event.status}</p> : null}
                </article>
              ))}
              <h3 className="mt-2 font-black">Notes Beds24</h3>
              {notes === undefined ? <p className="text-sm text-stone-600">Φόρτωση…</p> : null}
              {notes === null ? <p className="text-sm text-stone-600">Δεν φορτώθηκαν.</p> : null}
              {notes ? <p className="whitespace-pre-wrap break-words rounded-xl bg-stone-100 p-3 text-sm">{notes}</p> : null}
              {notes === "" ? <p className="text-sm text-stone-600">Χωρίς σημειώσεις.</p> : null}
            </section>
          </div>
        ) : null}
      </li>
    );
  };

  return (
    <div className="grid gap-4">
      {attention ? (
        <>
          <RoomDayPanel />
          {bookings ? <p className="text-base font-black">{actionCount ? `${actionCount} ${actionCount === 1 ? "κράτηση θέλει" : "κρατήσεις θέλουν"} εσένα τώρα` : "Τίποτα επείγον τώρα"}</p> : null}
        </>
      ) : (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Προηγούμενος μήνας" className={secondaryButton} onClick={() => setMonth(shiftMonth(month, -1))}>←</button>
          <h2 className="min-w-[180px] text-center text-xl font-black capitalize">{monthLabel(month)}</h2>
          <button type="button" aria-label="Επόμενος μήνας" className={secondaryButton} onClick={() => setMonth(shiftMonth(month, 1))}>→</button>
        </div>
        <p className="text-sm font-bold text-stone-600">{total} κρατήσεις · {withEmail} με email · {withArrival} με ώρα άφιξης</p>
      </div>
      )}

      {!attention || total > 5 ? (
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button key={item.key} type="button" aria-pressed={filter === item.key} onClick={() => setFilter(item.key)} className={`rounded-full px-4 py-1.5 text-sm font-black ${filter === item.key ? "bg-stone-900 text-white" : "bg-white text-stone-700"}`}>
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      {error ? <div role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">{error}</div> : null}
      {!bookings ? <p className="text-sm text-stone-600">Φόρτωση…</p> : null}
      {notice && !openId ? <p role="status" className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-900">{notice}</p> : null}
      {bookings && !visible.length ? <p className="rounded-2xl bg-white p-4 text-sm text-stone-600 shadow-sm">{attention ? "Όλες οι κρατήσεις έχουν email και ώρα άφιξης." : "Δεν υπάρχουν κρατήσεις."}</p> : null}

      {attention ? groups.map((group) => (
        <section key={group.key} className="grid gap-2" aria-label={group.title}>
          <div>
            <h2 className="text-sm font-black text-stone-700">{group.title} · {group.bookings.length}</h2>
            <p className="text-xs text-stone-500">{group.hint}</p>
          </div>
          <ul className="grid gap-2">{group.bookings.map(renderCard)}</ul>
        </section>
      )) : <ul className="grid gap-2">{visible.map(renderCard)}</ul>}
    </div>
  );
}

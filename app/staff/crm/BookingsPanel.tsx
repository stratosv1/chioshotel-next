"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type BoardEvent = { time: string; channel: "guest" | "staff" | "email" | "sms" | "whatsapp" | "ota"; title: string; body: string | null; summary: string | null; status: string | null };
type Booking = {
  bookingIds: string[]; name: string; firstName: string; rooms: string[]; checkin: string; checkout: string; status: string;
  channel: string; email: string | null; emailState: "real" | "virtual" | "none"; phone: string | null; arrivalTime: string | null; smsTemplate: string; deliveryProblem: string | null; events: BoardEvent[];
};
type Filter = "all" | "no_email" | "no_arrival" | "messages";

const API = "/api/staff/crm/bookings/";
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

function Chip({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${ok ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>{children}</span>;
}

export default function BookingsPanel({ attention = false }: { attention?: boolean }) {
  const [month, setMonth] = useState(thisMonth);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null | undefined>(undefined);
  const [sms, setSms] = useState({ phone: "", message: "" });
  const [realEmail, setRealEmail] = useState("");
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
    if (filter === "no_arrival") return !booking.arrivalTime;
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

  const saveEmail = async (booking: Booking) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/staff/crm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_real_email", bookingId: booking.bookingIds[0], email: realEmail }),
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

  const total = bookings?.length ?? 0;
  const withEmail = (bookings ?? []).filter((booking) => booking.emailState === "real").length;
  const withArrival = (bookings ?? []).filter((booking) => booking.arrivalTime).length;

  return (
    <div className="grid gap-4">
      {attention ? (
        <p className="text-sm font-bold text-stone-600">{total} κρατήσεις θέλουν έλεγχο: χωρίς email, ή χωρίς ώρα άφιξης αν έρχονται μέσα σε 14 μέρες.</p>
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

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button key={item.key} type="button" aria-pressed={filter === item.key} onClick={() => setFilter(item.key)} className={`rounded-full px-4 py-1.5 text-sm font-black ${filter === item.key ? "bg-stone-900 text-white" : "bg-white text-stone-700"}`}>
            {item.label}
          </button>
        ))}
      </div>

      {error ? <div role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">{error}</div> : null}
      {!bookings ? <p className="text-sm text-stone-600">Φόρτωση…</p> : null}
      {notice && !openId ? <p role="status" className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-900">{notice}</p> : null}
      {bookings && !visible.length ? <p className="rounded-2xl bg-white p-4 text-sm text-stone-600 shadow-sm">{attention ? "Όλες οι κρατήσεις έχουν email και ώρα άφιξης." : "Δεν υπάρχουν κρατήσεις."}</p> : null}

      <ul className="grid gap-2">
        {visible.map((booking) => {
          const open = openId === booking.bookingIds[0];
          const guestMessages = booking.events.filter((event) => event.channel === "guest").length;
          const lastSms = [...booking.events].reverse().find((event) => event.channel === "sms");
          return (
            <li key={booking.bookingIds[0]} className="rounded-2xl bg-white shadow-sm">
              <button type="button" aria-expanded={open} onClick={() => toggle(booking)} className="grid w-full gap-2 p-4 text-left">
                <span className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-black">{booking.name || "Χωρίς όνομα"}</span>
                  <span className="text-sm text-stone-600">{shortDate(booking.checkin)} → {shortDate(booking.checkout)} · {booking.channel}</span>
                </span>
                <span className="text-sm text-stone-600">{booking.rooms.join(", ")} · #{booking.bookingIds.join(", ")}</span>
                <span className="flex flex-wrap gap-2">
                  <Chip ok={booking.emailState === "real"}>{booking.emailState === "real" ? "✓ Email" : "✕ Χωρίς email"}</Chip>
                  <Chip ok={Boolean(booking.arrivalTime)}>{booking.arrivalTime ? `✓ Άφιξη ${booking.arrivalTime}` : "✕ Χωρίς ώρα άφιξης"}</Chip>
                  {booking.deliveryProblem ? <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">⚠ {booking.deliveryProblem}</span> : null}
                  {guestMessages ? <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black">💬 {guestMessages}</span> : null}
                  {lastSms ? <span className={`rounded-full bg-violet-50 px-3 py-1 text-xs font-black ${SMS_STATUS[lastSms.status ?? ""]?.tone ?? ""}`}>SMS: {SMS_STATUS[lastSms.status ?? ""]?.label ?? lastSms.status}</span> : null}
                </span>
              </button>

              {open ? (
                <div className="grid gap-4 border-t border-stone-100 p-4 lg:grid-cols-2">
                  <section className="grid content-start gap-2">
                    <h3 className="font-black">Επικοινωνία</h3>
                    {!booking.events.length ? <p className="text-sm text-stone-600">Δεν υπάρχει επικοινωνία ακόμα.</p> : null}
                    {booking.events.map((event, index) => (
                      <article key={`${event.time}-${index}`} className={`rounded-xl p-3 text-sm ${CHANNEL_DOT[event.channel]}`}>
                        <p className="font-bold">{event.title} · {event.time}</p>
                        {event.summary ? <p className="mt-1 font-bold text-amber-900">{event.summary}</p> : null}
                        {event.body ? <p className="mt-1 whitespace-pre-wrap break-words">{event.body}</p> : null}
                        {event.status ? <p className={`mt-1 font-black ${SMS_STATUS[event.status]?.tone ?? "text-stone-600"}`}>{SMS_STATUS[event.status]?.label ?? event.status}</p> : null}
                      </article>
                    ))}
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-black">Notes Beds24</h3>
                      <button type="button" disabled={busy} className={primaryButton} onClick={() => runCheck(booking)}>
                        {busy ? "Έλεγχος…" : "Έλεγχος email & μηνυμάτων"}
                      </button>
                    </div>
                    {notes === undefined ? <p className="text-sm text-stone-600">Φόρτωση…</p> : null}
                    {notes === null ? <p className="text-sm text-stone-600">Δεν φορτώθηκαν.</p> : null}
                    {notes ? <p className="whitespace-pre-wrap break-words rounded-xl bg-stone-100 p-3 text-sm">{notes}</p> : null}
                    {notes === "" ? <p className="text-sm text-stone-600">Χωρίς σημειώσεις.</p> : null}
                  </section>

                  <section className="grid content-start gap-3">
                    <h3 className="font-black">Στοιχεία</h3>
                    <p className="break-all text-sm">{booking.email ?? "Χωρίς email"}{booking.emailState === "virtual" ? " (εικονικό)" : ""}</p>
                    {booking.emailState !== "real" ? (
                      <form className="flex flex-wrap items-end gap-2" onSubmit={(event) => { event.preventDefault(); void saveEmail(booking); }}>
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

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-black">Αποστολή SMS</h3>
                      <button type="button" className={secondaryButton} onClick={() => setSms({ ...sms, message: booking.smsTemplate })}>Έτοιμο κείμενο</button>
                    </div>
                    {!booking.phone ? <p className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900">Δεν υπάρχει κινητό σε αυτή την κράτηση.</p> : null}
                    {notice ? <p role="status" className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-900">{notice}</p> : null}
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
                  </section>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

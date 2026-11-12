"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildConfirmationEmail,
  DEFAULT_BREAKFAST,
  type BankDetails,
  type ConfirmationData,
} from "@/lib/crm/booking-confirmation-email";

type RecentBooking = { bookingId: string; name: string; email: string | null; room: string | null; status: string; checkin: string; checkout: string; sentAt: string | null };

const API = "/api/staff/crm/confirmation/";
const panelClass = "rounded-2xl bg-white p-4 shadow-sm";
const inputClass = "w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";
const labelClass = "mb-1 block text-sm font-bold";
const secondaryButton = "rounded-full border border-amber-800/30 bg-white px-4 py-2 text-sm font-black text-amber-900 disabled:opacity-50";
const primaryButton = "rounded-full bg-amber-800 px-4 py-2 text-sm font-black text-white disabled:opacity-50";

function Field({ id, label, value, onChange, type = "text" }: { id: string; label: string; value: string | number; onChange: (value: string) => void; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input id={id} type={type} className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

export default function ConfirmationPanel() {
  const [bookings, setBookings] = useState<RecentBooking[] | null>(null);
  const [bank, setBank] = useState<BankDetails | null>(null);
  const [data, setData] = useState<ConfirmationData | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [manualId, setManualId] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadList = async () => {
    const response = await fetch(API, { cache: "no-store" });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error);
    setBookings(payload.bookings);
    setBank(payload.bank);
  };

  useEffect(() => {
    loadList().catch((reason) => setError(reason.message));
  }, []);

  const open = async (bookingId: string) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API}?bookingId=${encodeURIComponent(bookingId)}`, { cache: "no-store" });
      const payload = await response.json();
      if (!payload.ok) throw new Error(payload.error);
      setData(payload.data);
      setWarnings(payload.warnings);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Δεν φορτώθηκε η κράτηση.");
    } finally {
      setBusy(false);
    }
  };

  const send = async (action: "send" | "test") => {
    if (!data) return;
    if (action === "send" && !window.confirm(`Να σταλεί η επιβεβαίωση στο ${data.email};`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data }),
      });
      const payload = await response.json();
      if (!payload.ok) throw new Error(payload.error);
      setNotice(`Στάλθηκε στο ${payload.sentTo}.`);
      await loadList();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Η αποστολή απέτυχε.");
    } finally {
      setBusy(false);
    }
  };

  const email = useMemo(() => (data ? buildConfirmationEmail(data, bank) : null), [data, bank]);
  const set = (patch: Partial<ConfirmationData>) => setData((current) => (current ? { ...current, ...patch } : current));
  const alreadySent = data ? bookings?.find((item) => data.bookingIds.includes(item.bookingId) && item.sentAt)?.sentAt : null;
  const relayEmail = data && /@([a-z0-9-]+\.)*(booking\.com|expedia\.com|expediapartnercentral\.com)$/i.test(data.email);

  return (
    <div className="grid gap-4">
      {notice ? <div role="status" className="rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900">{notice}</div> : null}
      {error ? <div role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">{error}</div> : null}
      {!bank ? <div role="alert" className="rounded-xl bg-amber-100 px-4 py-3 text-sm font-bold text-amber-900">Δεν έχουν οριστεί τραπεζικά στοιχεία.</div> : null}

      {!data ? (
        <section className={panelClass}>
          <h2 className="mb-1 text-lg font-black">Επιβεβαίωση κράτησης</h2>
          <p className="mb-3 text-sm text-stone-600">Διάλεξε κράτηση, έλεγξε ή διόρθωσε τα στοιχεία και δες το email πριν το στείλεις.</p>
          <form
            className="mb-4 flex flex-wrap items-end gap-2"
            onSubmit={(event) => { event.preventDefault(); if (manualId.trim()) void open(manualId.trim()); }}
          >
            <div className="min-w-[200px] flex-1">
              <label htmlFor="crm-booking-id" className={labelClass}>Αριθμός κράτησης</label>
              <input id="crm-booking-id" inputMode="numeric" className={inputClass} value={manualId} onChange={(event) => setManualId(event.target.value)} />
            </div>
            <button type="submit" disabled={busy} className={primaryButton}>Άνοιγμα</button>
          </form>
          {!bookings ? <p className="text-sm text-stone-600">Φόρτωση…</p> : null}
          <ul className="grid gap-1">
            {(bookings ?? []).map((booking) => (
              <li key={booking.bookingId} className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 py-2">
                <div className="min-w-0 text-sm">
                  <p className="font-black">{booking.name || "Χωρίς όνομα"} <span className="font-normal text-stone-500">#{booking.bookingId}</span></p>
                  <p className="text-stone-600">{booking.checkin} → {booking.checkout}{booking.room ? ` · ${booking.room}` : ""} · {booking.status}</p>
                  {booking.sentAt ? <p className="font-bold text-emerald-800">Στάλθηκε {booking.sentAt}</p> : null}
                </div>
                <button type="button" disabled={busy} className={secondaryButton} onClick={() => open(booking.bookingId)}>Άνοιγμα</button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className={`${panelClass} grid content-start gap-3`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-black">Στοιχεία #{data.bookingIds.join(", ")}</h2>
              <button type="button" className={secondaryButton} onClick={() => { setData(null); setNotice(""); }}>← Κρατήσεις</button>
            </div>
            {warnings.map((warning) => <p key={warning} className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900">{warning}</p>)}
            {alreadySent ? <p className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900">Έχει ήδη σταλεί επιβεβαίωση στις {alreadySent}.</p> : null}
            {relayEmail ? <p className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900">Αυτό είναι email Booking/Expedia, όχι το πραγματικό του πελάτη.</p> : null}

            <div>
              <label htmlFor="crm-conf-language" className={labelClass}>Γλώσσα email</label>
              <select
                id="crm-conf-language"
                className={inputClass}
                value={data.language}
                onChange={(event) => {
                  const language = event.target.value as ConfirmationData["language"];
                  set({ language, breakfast: data.breakfast === DEFAULT_BREAKFAST[data.language] ? DEFAULT_BREAKFAST[language] : data.breakfast });
                }}
              >
                <option value="el">Ελληνικά</option>
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field id="crm-conf-title" label="Τίτλος" value={data.title} onChange={(title) => set({ title })} />
              <Field id="crm-conf-first" label="Όνομα" value={data.firstName} onChange={(firstName) => set({ firstName })} />
              <Field id="crm-conf-last" label="Επώνυμο" value={data.lastName} onChange={(lastName) => set({ lastName })} />
            </div>
            <Field id="crm-conf-names" label="Ονόματα επισκεπτών" value={data.guestsNames} onChange={(guestsNames) => set({ guestsNames })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="crm-conf-email" label="Email πελάτη" type="email" value={data.email} onChange={(value) => set({ email: value })} />
              <Field id="crm-conf-phone" label="Τηλέφωνο" value={data.phone} onChange={(phone) => set({ phone })} />
              <Field id="crm-conf-date" label="Ημερομηνία κράτησης" type="date" value={data.bookingDate} onChange={(bookingDate) => set({ bookingDate })} />
              <Field id="crm-conf-login" label="Guest login (προαιρετικό)" value={data.guestLogin} onChange={(guestLogin) => set({ guestLogin })} />
              <Field id="crm-conf-adults" label="Ενήλικες" type="number" value={data.adults} onChange={(value) => set({ adults: Number(value) })} />
              <Field id="crm-conf-children" label="Παιδιά" type="number" value={data.children} onChange={(value) => set({ children: Number(value) })} />
            </div>

            <h3 className="mt-2 font-black">Δωμάτια</h3>
            {data.rooms.map((room, index) => {
              const update = (patch: Partial<typeof room>) => set({ rooms: data.rooms.map((item, position) => (position === index ? { ...item, ...patch } : item)) });
              return (
                <div key={index} className="grid gap-2 sm:grid-cols-3">
                  <Field id={`crm-room-${index}`} label="Δωμάτιο" value={room.room} onChange={(value) => update({ room: value })} />
                  <Field id={`crm-in-${index}`} label="Άφιξη" type="date" value={room.checkin} onChange={(checkin) => update({ checkin })} />
                  <Field id={`crm-out-${index}`} label="Αναχώρηση" type="date" value={room.checkout} onChange={(checkout) => update({ checkout })} />
                </div>
              );
            })}

            <h3 className="mt-2 font-black">Χρεώσεις</h3>
            {data.charges.map((charge, index) => {
              const update = (patch: Partial<typeof charge>) => set({ charges: data.charges.map((item, position) => (position === index ? { ...item, ...patch } : item)) });
              return (
                <div key={index} className="grid grid-cols-[1fr_70px_100px_auto] items-end gap-2">
                  <Field id={`crm-charge-${index}`} label="Περιγραφή" value={charge.description} onChange={(description) => update({ description })} />
                  <Field id={`crm-qty-${index}`} label="Τεμ." type="number" value={charge.qty} onChange={(value) => update({ qty: Number(value) })} />
                  <Field id={`crm-amount-${index}`} label="Τιμή €" type="number" value={charge.amount} onChange={(value) => update({ amount: Number(value) })} />
                  <button type="button" aria-label="Αφαίρεση χρέωσης" className={secondaryButton} onClick={() => set({ charges: data.charges.filter((_, position) => position !== index) })}>✕</button>
                </div>
              );
            })}
            <button type="button" className={`${secondaryButton} justify-self-start`} onClick={() => set({ charges: [...data.charges, { description: "", qty: 1, amount: 0 }] })}>+ Χρέωση</button>

            <h3 className="mt-2 font-black">Πληρωμές</h3>
            {data.payments.map((payment, index) => {
              const update = (patch: Partial<typeof payment>) => set({ payments: data.payments.map((item, position) => (position === index ? { ...item, ...patch } : item)) });
              return (
                <div key={index} className="grid grid-cols-[1fr_100px_auto] items-end gap-2">
                  <Field id={`crm-pay-${index}`} label="Περιγραφή" value={payment.description} onChange={(description) => update({ description })} />
                  <Field id={`crm-pay-amount-${index}`} label="Ποσό €" type="number" value={payment.amount} onChange={(value) => update({ amount: Number(value) })} />
                  <button type="button" aria-label="Αφαίρεση πληρωμής" className={secondaryButton} onClick={() => set({ payments: data.payments.filter((_, position) => position !== index) })}>✕</button>
                </div>
              );
            })}
            <button type="button" className={`${secondaryButton} justify-self-start`} onClick={() => set({ payments: [...data.payments, { description: "", amount: 0 }] })}>+ Πληρωμή</button>

            <Field id="crm-conf-prepaid" label="Προπληρωμένη μέσω (κενό = πληρώνει σε εμάς)" value={data.prepaidVia ?? ""} onChange={(prepaidVia) => set({ prepaidVia })} />
            <Field id="crm-conf-breakfast" label="Πρωινό" value={data.breakfast} onChange={(breakfast) => set({ breakfast })} />
            <div>
              <label htmlFor="crm-conf-comments" className={labelClass}>Σχόλια πελάτη</label>
              <textarea id="crm-conf-comments" rows={4} className={inputClass} value={data.comments} onChange={(event) => set({ comments: event.target.value })} />
            </div>
          </section>

          <section className={`${panelClass} grid content-start gap-3 lg:sticky lg:top-4 lg:self-start`}>
            <h2 className="text-lg font-black">Προεπισκόπηση</h2>
            <p className="break-all text-sm font-bold">Θέμα: {email?.subject}</p>
            <p className="break-all text-sm text-stone-600">Προς: {data.email || "-"}</p>
            <iframe title="Προεπισκόπηση επιβεβαίωσης" sandbox="" srcDoc={email?.html} className="h-[70vh] w-full rounded-xl border border-stone-200 bg-white" />
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={busy} className={secondaryButton} onClick={() => send("test")}>Στείλε μου δοκιμή</button>
              <button type="button" disabled={busy || !data.email} className={primaryButton} onClick={() => send("send")}>Αποστολή στον πελάτη</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

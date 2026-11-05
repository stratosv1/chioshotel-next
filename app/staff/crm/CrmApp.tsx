"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BookingsPanel from "./BookingsPanel";
import ConfirmationPanel from "./ConfirmationPanel";
import EmailsPanel from "./EmailsPanel";

type Tab = "attention" | "bookings" | "summary" | "guests" | "pending" | "confirmation" | "emails" | "exclusions";
type Bucket = { key: string; count: number };
type Summary = {
  bookings: number;
  bookingsWithCountry: number;
  arrivals7d: number;
  inHouse: number;
  lastBookingAt: string | null;
  guests: number;
  guestsWithCountry: number;
  pendingUpcoming: number;
  excluded: number;
  countries: Bucket[];
  languages: Bucket[];
};
type Guest = {
  email: string;
  name: string;
  country: string | null;
  language: string | null;
  phone: string | null;
  stays: number;
  lastCheckin: string | null;
  lastCheckout: string | null;
  lastRoom: string | null;
  unsubscribed: boolean;
};
type PendingBooking = {
  bookingId: string;
  name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  room: string | null;
  checkin: string | null;
  checkout: string | null;
};
type Exclusion = { email: string; note: string };
type GuestMessage = { direction: "guest" | "staff"; subject: string | null; body: string; summary: string | null; bookingIds: string[]; sentAt: string };

const TABS: { key: Tab; label: string }[] = [
  { key: "attention", label: "Σήμερα" },
  { key: "bookings", label: "Κρατήσεις" },
  { key: "guests", label: "Πελάτες" },
];
const MORE_TABS: { key: Tab; label: string }[] = [
  { key: "summary", label: "Στατιστικά" },
  { key: "confirmation", label: "Επιβεβαίωση κράτησης" },
  { key: "emails", label: "Αυτόματα email" },
  { key: "exclusions", label: "Εξαιρέσεις" },
];
const LANGUAGES = ["el", "en", "de", "fr", "it", "es", "tr"];
const API = "/api/staff/crm/";
const BACKFILL_FIRST_MONTH = "2022-01";
const BACKFILL_LAST_MONTH = "2027-12";
const BACKFILL_MONTH_KEY = "vh-crm-backfill-month";

const inputClass = "w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";
const panelClass = "rounded-2xl bg-white p-4 shadow-sm";
const secondaryButton = "rounded-full border border-amber-800/30 bg-white px-4 py-2 text-sm font-black text-amber-900 disabled:opacity-50";
const primaryButton = "rounded-full bg-amber-800 px-4 py-2 text-sm font-black text-white disabled:opacity-50";

function countryName(code: string | null) {
  if (!code || code === "?") return "Άγνωστη";
  if (!/^[A-Z]{2}$/.test(code)) return code;
  try {
    return new Intl.DisplayNames(["el"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function nextMonth(month: string) {
  const [year, mon] = month.split("-").map(Number);
  return mon === 12 ? `${year + 1}-01` : `${year}-${String(mon + 1).padStart(2, "0")}`;
}

function readSavedMonth() {
  try {
    return window.localStorage.getItem(BACKFILL_MONTH_KEY);
  } catch {
    return null;
  }
}

function saveMonth(month: string | null) {
  try {
    if (month) window.localStorage.setItem(BACKFILL_MONTH_KEY, month);
    else window.localStorage.removeItem(BACKFILL_MONTH_KEY);
  } catch {
    // The backfill can always restart: it only fills empty values.
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.error || "Κάτι πήγε στραβά.");
  return payload;
}

async function postAction(body: Record<string, unknown>) {
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.error || "Δεν αποθηκεύτηκε.");
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className={panelClass}>
      <p className="text-sm font-bold text-stone-500">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
      {hint ? <p className="mt-1 text-xs text-stone-500">{hint}</p> : null}
    </div>
  );
}

function BucketList({ title, buckets, format }: { title: string; buckets: Bucket[]; format: (key: string) => string }) {
  return (
    <section className={panelClass}>
      <h2 className="mb-3 text-lg font-black">{title}</h2>
      {buckets.length ? (
        <ul className="grid gap-1 text-sm">
          {buckets.map((bucket) => (
            <li key={bucket.key} className="flex justify-between gap-4 border-b border-stone-100 py-1.5">
              <span>{format(bucket.key)}</span>
              <span className="font-black">{bucket.count}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone-500">Δεν υπάρχουν δεδομένα.</p>
      )}
    </section>
  );
}

export default function CrmApp() {
  const [tab, setTab] = useState<Tab>("attention");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [pending, setPending] = useState<PendingBooking[] | null>(null);
  const [pendingScope, setPendingScope] = useState<"upcoming" | "all">("upcoming");
  const [exclusions, setExclusions] = useState<Exclusion[] | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [editing, setEditing] = useState<{ email: string; country: string; language: string } | null>(null);
  const [emailDrafts, setEmailDrafts] = useState<Record<string, string>>({});
  const [newExclusion, setNewExclusion] = useState("");
  const [conversation, setConversation] = useState<{ email: string; messages: GuestMessage[] | null } | null>(null);
  const [backfill, setBackfill] = useState<{ running: boolean; text: string; fields: string[] }>({ running: false, text: "", fields: [] });
  const stopBackfill = useRef(false);

  const fail = (reason: unknown) => setError(reason instanceof Error ? reason.message : "Κάτι πήγε στραβά.");

  const loadSummary = useCallback(async () => {
    setSummary((await getJson(API)).summary);
  }, []);
  const loadGuests = useCallback(async () => {
    setGuests((await getJson(`${API}?view=guests`)).guests);
  }, []);
  const loadPending = useCallback(async (scope: "upcoming" | "all") => {
    setPending((await getJson(`${API}?view=pending&scope=${scope}`)).bookings);
  }, []);
  const loadExclusions = useCallback(async () => {
    setExclusions((await getJson(`${API}?view=exclusions`)).exclusions);
  }, []);

  useEffect(() => {
    setError("");
    if (tab === "emails" || tab === "confirmation" || tab === "bookings" || tab === "attention") return;
    const load =
      tab === "summary" ? loadSummary() :
      tab === "guests" ? loadGuests() :
      tab === "pending" ? loadPending(pendingScope) :
      loadExclusions();
    load.catch(fail);
  }, [tab, pendingScope, loadSummary, loadGuests, loadPending, loadExclusions]);

  const run = async (action: () => Promise<void>, message: string) => {
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(message);
    } catch (reason) {
      fail(reason);
    }
  };

  const countries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const guest of guests ?? []) {
      const key = guest.country || "?";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [guests]);

  const visibleGuests = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (guests ?? []).filter((guest) => {
      if (countryFilter !== "all" && (guest.country || "?") !== countryFilter) return false;
      return !query || guest.email.includes(query) || guest.name.toLowerCase().includes(query);
    });
  }, [guests, search, countryFilter]);

  const toggleConversation = async (email: string) => {
    if (conversation?.email === email) {
      setConversation(null);
      return;
    }
    setConversation({ email, messages: null });
    try {
      const payload = await getJson(`${API}?view=messages&email=${encodeURIComponent(email)}`);
      setConversation({ email, messages: payload.messages });
    } catch (reason) {
      setConversation(null);
      fail(reason);
    }
  };

  const startBackfill = async () => {
    stopBackfill.current = false;
    let month = readSavedMonth() || BACKFILL_FIRST_MONTH;
    let scanned = 0;
    let updated = 0;
    const fields = new Set<string>();
    setError("");
    setBackfill({ running: true, text: `Ξεκινά από ${month}…`, fields: [] });
    try {
      while (month <= BACKFILL_LAST_MONTH && !stopBackfill.current) {
        const response = await fetch(`${API}backfill/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ month }),
        });
        if (response.status === 429) {
          setBackfill({ running: true, text: `Όριο Beds24 στον μήνα ${month}. Περιμένω 2 λεπτά…`, fields: [...fields] });
          await wait(120_000);
          continue;
        }
        const payload = await response.json();
        if (!payload.ok) throw new Error(payload.error || "Η άντληση απέτυχε.");
        scanned += payload.scanned;
        updated += payload.updated;
        for (const field of payload.contactFields) fields.add(field);
        month = nextMonth(month);
        saveMonth(month);
        setBackfill({ running: true, text: `Έως ${month}: ${scanned} κρατήσεις, ${updated} ενημερώθηκαν`, fields: [...fields] });
        await wait(1_500);
      }
      const finished = month > BACKFILL_LAST_MONTH;
      if (finished) saveMonth(null);
      setBackfill({
        running: false,
        text: `${finished ? "Ολοκληρώθηκε" : "Σταμάτησε, συνεχίζει από εκεί"}: ${scanned} κρατήσεις, ${updated} ενημερώθηκαν.`,
        fields: [...fields],
      });
      await loadSummary();
    } catch (reason) {
      setBackfill((current) => ({ ...current, running: false }));
      fail(reason);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6efe5] px-4 py-6 text-stone-900 md:px-8">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-4">
          <a href="/staff" className="text-sm font-bold text-amber-800">← Staff</a>
          <h1 className="mt-1 text-2xl font-black tracking-tight">Πελάτες & CRM</h1>
        </header>

        <nav className="mb-2 grid grid-cols-3 gap-1 rounded-2xl bg-white p-1 shadow-sm md:max-w-md" aria-label="Κύριες ενότητες CRM">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={tab === key}
              onClick={() => { setTab(key); setNotice(""); }}
              className={`min-h-11 rounded-xl px-2 text-sm font-black ${tab === key ? "bg-stone-900 text-white" : "text-stone-700"}`}
            >
              {label}
            </button>
          ))}
        </nav>
        <nav className="mb-5 flex flex-wrap gap-x-4 gap-y-1 px-1" aria-label="Ρυθμίσεις και στατιστικά CRM">
          {MORE_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={tab === key}
              onClick={() => { setTab(key); setNotice(""); }}
              className={`min-h-8 text-xs font-bold ${tab === key ? "text-stone-900 underline underline-offset-4" : "text-stone-500"}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {notice ? <div role="status" className="mb-4 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900">{notice}</div> : null}
        {error ? <div role="alert" className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">{error}</div> : null}

        {tab === "attention" ? <BookingsPanel key="attention" attention /> : null}

        {tab === "bookings" ? <BookingsPanel key="bookings" /> : null}

        {tab === "summary" ? (
          summary ? (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat label="Πελάτες" value={summary.guests} hint={`${summary.excluded} εξαιρέσεις εκτός`} />
                <Stat label="Μένουν τώρα" value={summary.inHouse} />
                <Stat label="Αφίξεις 7 ημερών" value={summary.arrivals7d} />
                <Stat label="Χωρίς email" value={summary.pendingUpcoming} hint="Τρέχουσες και επόμενες διαμονές" />
              </div>

              <section className={panelClass}>
                <h2 className="text-lg font-black">Χώρα, γλώσσα και κινητό από το Beds24</h2>
                <p className="mt-1 text-sm text-stone-600">
                  {summary.bookingsWithCountry} από {summary.bookings} κρατήσεις έχουν χώρα
                  {" · "}{summary.guestsWithCountry} από {summary.guests} πελάτες.
                  Η άντληση συμπληρώνει μόνο κενά πεδία και μπορεί να ξανατρέξει.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className={primaryButton} disabled={backfill.running} onClick={startBackfill}>
                    {backfill.running ? "Τρέχει…" : "Συμπλήρωση από το Beds24"}
                  </button>
                  {backfill.running ? (
                    <button type="button" className={secondaryButton} onClick={() => { stopBackfill.current = true; }}>
                      Διακοπή
                    </button>
                  ) : null}
                </div>
                {backfill.text ? <p role="status" className="mt-3 text-sm font-bold text-stone-700">{backfill.text}</p> : null}
                {backfill.fields.length ? <p className="mt-1 text-xs text-stone-500">Πεδία που βρέθηκαν: {backfill.fields.join(", ")}</p> : null}
              </section>

              <div className="grid gap-4 md:grid-cols-2">
                <BucketList title="Πελάτες ανά χώρα" buckets={summary.countries} format={countryName} />
                <BucketList title="Πελάτες ανά γλώσσα" buckets={summary.languages} format={(key) => (key === "?" ? "Άγνωστη" : key.toUpperCase())} />
              </div>
              <p className="text-xs text-stone-500">Τελευταία κράτηση από το Beds24: {summary.lastBookingAt ?? "-"}</p>
            </div>
          ) : <p className="text-sm text-stone-600">Φόρτωση…</p>
        ) : null}

        {tab === "guests" ? (
          <section>
            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_240px]">
              <div>
                <label htmlFor="crm-search" className="mb-1 block text-sm font-bold">Αναζήτηση</label>
                <input id="crm-search" className={inputClass} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Όνομα ή email" />
              </div>
              <div>
                <label htmlFor="crm-country" className="mb-1 block text-sm font-bold">Χώρα</label>
                <select id="crm-country" className={inputClass} value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)}>
                  <option value="all">Όλες</option>
                  {countries.map(([key, count]) => (
                    <option key={key} value={key}>{countryName(key)} ({count})</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mb-3 text-sm font-bold text-stone-600">{guests ? `${visibleGuests.length} πελάτες` : "Φόρτωση…"}</p>
            <ul className="grid gap-2">
              {visibleGuests.slice(0, 200).map((guest) => (
                <li key={guest.email} className={panelClass}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-black">{guest.name || "Χωρίς όνομα"}</p>
                      <p className="break-all text-sm text-stone-600">{guest.email}{guest.phone ? ` · ${guest.phone}` : ""}</p>
                      <p className="mt-1 text-sm">
                        {countryName(guest.country)} · {guest.language?.toUpperCase() || "Χωρίς γλώσσα"} · {guest.stays} {guest.stays === 1 ? "διαμονή" : "διαμονές"}
                        {guest.lastCheckin ? ` · τελευταία ${guest.lastCheckin}` : ""}
                        {guest.lastRoom ? ` · ${guest.lastRoom}` : ""}
                      </p>
                      {guest.unsubscribed ? <p className="mt-1 text-sm font-bold text-red-800">Έχει διαγραφεί από το newsletter</p> : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className={secondaryButton} aria-expanded={conversation?.email === guest.email} onClick={() => toggleConversation(guest.email)}>
                        Συζήτηση
                      </button>
                      <button
                        type="button"
                        className={secondaryButton}
                        onClick={() => setEditing({ email: guest.email, country: guest.country ?? "", language: guest.language ?? "" })}
                      >
                        Διόρθωση
                      </button>
                    </div>
                  </div>
                  {conversation?.email === guest.email ? (
                    <div className="mt-3 grid gap-2 border-t border-stone-100 pt-3">
                      {!conversation.messages ? <p className="text-sm text-stone-600">Φόρτωση…</p> : null}
                      {conversation.messages && !conversation.messages.length ? <p className="text-sm text-stone-600">Δεν υπάρχουν μηνύματα.</p> : null}
                      {(conversation.messages ?? []).map((message, index) => (
                        <article key={`${message.sentAt}-${index}`} className={`rounded-xl p-3 text-sm ${message.direction === "guest" ? "bg-stone-100" : "bg-emerald-50"}`}>
                          <p className="font-bold">{message.direction === "guest" ? "Πελάτης" : "Εμείς"} · {message.sentAt} · #{message.bookingIds.join(", ")}</p>
                          {message.summary ? <p className="mt-1 font-bold text-amber-900">{message.summary}</p> : null}
                          <p className="mt-1 whitespace-pre-wrap break-words">{message.body}</p>
                        </article>
                      ))}
                    </div>
                  ) : null}
                  {editing?.email === guest.email ? (
                    <form
                      className="mt-3 grid gap-3 border-t border-stone-100 pt-3 md:grid-cols-[1fr_1fr_auto]"
                      onSubmit={(event) => {
                        event.preventDefault();
                        void run(async () => {
                          await postAction({ action: "save_guest", ...editing });
                          setEditing(null);
                          await loadGuests();
                        }, "Αποθηκεύτηκε.");
                      }}
                    >
                      <div>
                        <label htmlFor="crm-edit-country" className="mb-1 block text-sm font-bold">Χώρα</label>
                        <input
                          id="crm-edit-country"
                          className={inputClass}
                          value={editing.country}
                          onChange={(event) => setEditing({ ...editing, country: event.target.value })}
                          placeholder="π.χ. DE ή TR"
                        />
                      </div>
                      <div>
                        <label htmlFor="crm-edit-language" className="mb-1 block text-sm font-bold">Γλώσσα</label>
                        <select
                          id="crm-edit-language"
                          className={inputClass}
                          value={editing.language}
                          onChange={(event) => setEditing({ ...editing, language: event.target.value })}
                        >
                          <option value="">Καμία</option>
                          {LANGUAGES.map((language) => <option key={language} value={language}>{language.toUpperCase()}</option>)}
                        </select>
                      </div>
                      <div className="flex items-end gap-2">
                        <button type="submit" className={primaryButton}>Αποθήκευση</button>
                        <button type="button" className={secondaryButton} onClick={() => setEditing(null)}>Άκυρο</button>
                      </div>
                    </form>
                  ) : null}
                </li>
              ))}
            </ul>
            {visibleGuests.length > 200 ? <p className="mt-3 text-sm text-stone-600">Εμφανίζονται οι 200 πιο πρόσφατοι. Χρησιμοποίησε αναζήτηση ή χώρα.</p> : null}
          </section>
        ) : null}

        {tab === "pending" ? (
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-stone-600">Κρατήσεις Booking/Expedia χωρίς πραγματικό email. Δεν μπαίνουν στους πελάτες μέχρι να το συμπληρώσεις.</p>
              <button
                type="button"
                className={secondaryButton}
                onClick={() => setPendingScope(pendingScope === "upcoming" ? "all" : "upcoming")}
              >
                {pendingScope === "upcoming" ? "Δείξε και τις παλιές" : "Μόνο τρέχουσες και επόμενες"}
              </button>
            </div>
            {!pending ? <p className="text-sm text-stone-600">Φόρτωση…</p> : null}
            {pending && !pending.length ? <p className={panelClass}>Δεν υπάρχουν εκκρεμότητες.</p> : null}
            <ul className="grid gap-2">
              {(pending ?? []).map((booking) => (
                <li key={booking.bookingId} className={panelClass}>
                  <p className="font-black">{booking.name || "Χωρίς όνομα"}</p>
                  <p className="text-sm text-stone-600">
                    {booking.checkin} → {booking.checkout}{booking.room ? ` · ${booking.room}` : ""} · #{booking.bookingId}
                    {booking.country ? ` · ${countryName(booking.country)}` : ""}{booking.phone ? ` · ${booking.phone}` : ""}
                  </p>
                  <form
                    className="mt-3 flex flex-wrap items-end gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void run(async () => {
                        await postAction({ action: "set_real_email", bookingId: booking.bookingId, email: emailDrafts[booking.bookingId] });
                        await loadPending(pendingScope);
                      }, "Το email αποθηκεύτηκε.");
                    }}
                  >
                    <div className="min-w-[240px] flex-1">
                      <label htmlFor={`crm-email-${booking.bookingId}`} className="mb-1 block text-sm font-bold">Πραγματικό email</label>
                      <input
                        id={`crm-email-${booking.bookingId}`}
                        type="email"
                        required
                        className={inputClass}
                        value={emailDrafts[booking.bookingId] ?? ""}
                        onChange={(event) => setEmailDrafts({ ...emailDrafts, [booking.bookingId]: event.target.value })}
                      />
                    </div>
                    <button type="submit" className={primaryButton}>Αποθήκευση</button>
                    <button
                      type="button"
                      className={secondaryButton}
                      onClick={() => run(async () => {
                        await postAction({ action: "ignore_booking", bookingId: booking.bookingId });
                        await loadPending(pendingScope);
                      }, "Η κράτηση αγνοήθηκε.")}
                    >
                      Αγνόηση
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tab === "confirmation" ? <ConfirmationPanel /> : null}

        {tab === "emails" ? <EmailsPanel /> : null}

        {tab === "exclusions" ? (
          <section className="grid gap-4">
            <form
              className={`${panelClass} flex flex-wrap items-end gap-2`}
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  await postAction({ action: "add_exclusion", email: newExclusion });
                  setNewExclusion("");
                  await loadExclusions();
                }, "Προστέθηκε στις εξαιρέσεις.");
              }}
            >
              <div className="min-w-[240px] flex-1">
                <label htmlFor="crm-exclude" className="mb-1 block text-sm font-bold">Email που δεν είναι πελάτης</label>
                <input id="crm-exclude" type="email" required className={inputClass} value={newExclusion} onChange={(event) => setNewExclusion(event.target.value)} />
              </div>
              <button type="submit" className={primaryButton}>Προσθήκη</button>
            </form>
            {!exclusions ? <p className="text-sm text-stone-600">Φόρτωση…</p> : null}
            <ul className="grid gap-2">
              {(exclusions ?? []).map((item) => (
                <li key={item.email} className={`${panelClass} flex flex-wrap items-center justify-between gap-3`}>
                  <span className="break-all font-bold">{item.email}{item.note ? <span className="font-normal text-stone-500"> · {item.note}</span> : null}</span>
                  <button
                    type="button"
                    className={secondaryButton}
                    onClick={() => run(async () => {
                      await postAction({ action: "remove_exclusion", email: item.email });
                      await loadExclusions();
                    }, "Αφαιρέθηκε από τις εξαιρέσεις.")}
                  >
                    Αφαίρεση
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}

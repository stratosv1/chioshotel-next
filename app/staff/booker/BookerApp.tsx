"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type RoomMapping = {
  roomId: number;
  unitId: number;
  label: string;
  categoryLabel: string;
};

type BookerConfig = {
  rooms: RoomMapping[];
  hasPropertyId: boolean;
  hasRefreshToken: boolean;
  hasInviteCode: boolean;
  viberLink: string;
};

type BookingResult = {
  message?: string;
  bookingId?: string | number;
  reference?: string | null;
  roomLabel?: string;
  categoryLabel?: string;
  whatsappUrl?: string;
  viberMessage?: string;
  viberLink?: string;
  customerPhone?: string;
};

type StaffOffer = {
  roomId: string;
  unitId: string;
  roomNumber: number;
  name: string;
  category: string;
  floor: string;
  maxGuests: number;
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
  features?: string[];
};

type AvailabilityResponse = {
  success: boolean;
  message?: string;
  code?: string;
  offers?: StaffOffer[];
};

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function isoTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function nightsBetween(arrival: string, departure: string) {
  const start = new Date(`${arrival}T00:00:00Z`).getTime();
  const end = new Date(`${departure}T00:00:00Z`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.round((end - start) / 86400000);
}

function money(value: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

const inputClass =
  "w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-800 shadow-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100";
const labelClass = "text-[11px] font-black uppercase tracking-[0.16em] text-amber-800";

export default function BookerApp() {
  const [config, setConfig] = useState<BookerConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [offers, setOffers] = useState<StaffOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<StaffOffer | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  const [arrival, setArrival] = useState(isoToday());
  const [departure, setDeparture] = useState(isoTomorrow());
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");

  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("en");
  const [price, setPrice] = useState("");
  const [referrer, setReferrer] = useState("Staff Direct");
  const [comments, setComments] = useState("");
  const [notes, setNotes] = useState("");

  const nights = useMemo(() => nightsBetween(arrival, departure), [arrival, departure]);
  const totalGuests = Math.max(1, Number(adults || 1) + Number(children || 0));

  const selectedRoom = useMemo(() => {
    if (!config || !selectedOffer) return null;
    const roomId = Number(selectedOffer.roomId);
    const unitId = Number(selectedOffer.unitId);
    return config.rooms.find((room) => room.roomId === roomId && room.unitId === unitId) ?? null;
  }, [config, selectedOffer]);

  async function loadConfig() {
    setLoadingConfig(true);
    const response = await fetch("/api/staff/booker/", {
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!response.ok) {
      setNotice("Δεν φορτώθηκαν οι ρυθμίσεις του Beds24.");
      setLoadingConfig(false);
      return;
    }

    setConfig((await response.json()) as BookerConfig);
    setLoadingConfig(false);
  }

  useEffect(() => {
    void loadConfig();
  }, []);

  async function searchAvailability(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setNotice("");
    setResult(null);
    setSelectedOffer(null);
    setOffers([]);

    if (nights <= 0) {
      setNotice("Το check-out πρέπει να είναι μετά το check-in.");
      return;
    }

    if (totalGuests < 1 || totalGuests > 5) {
      setNotice("Η αναζήτηση υποστηρίζει από 1 έως 5 άτομα.");
      return;
    }

    setSearching(true);
    const query = new URLSearchParams({
      checkin: arrival,
      checkout: departure,
      guests: String(totalGuests),
      lang: "el",
      allowSplit: "0",
    });

    const response = await fetch(`/api/ai-room-finder/availability/?${query.toString()}`, {
      cache: "no-store",
      credentials: "same-origin",
    });
    const data = (await response.json().catch(() => null)) as AvailabilityResponse | null;
    setSearching(false);

    if (!response.ok || !data?.success) {
      setNotice(data?.message || "Δεν μπόρεσα να ελέγξω τη διαθεσιμότητα.");
      return;
    }

    const nextOffers = data.offers || [];
    setOffers(nextOffers);
    if (nextOffers.length === 0) {
      setNotice("Δεν υπάρχει ένα διαθέσιμο δωμάτιο για όλη τη διαμονή.");
    }
  }

  function chooseOffer(offer: StaffOffer) {
    setSelectedOffer(offer);
    setPrice(String(offer.directTotal));
    setNotice(`Επιλέχθηκε ${offer.name}. Συμπλήρωσε τα στοιχεία του πελάτη και έλεγξε την τελική τιμή.`);
    setResult(null);
  }

  async function createBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setResult(null);

    if (!selectedOffer || !selectedRoom) {
      setNotice("Πρώτα κάνε έλεγχο διαθεσιμότητας και επίλεξε δωμάτιο.");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setNotice("Συμπλήρωσε όνομα και επώνυμο πελάτη.");
      return;
    }

    if (nights <= 0) {
      setNotice("Οι ημερομηνίες δεν είναι έγκυρες.");
      return;
    }

    setSaving(true);
    const response = await fetch("/api/staff/booker/", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: selectedRoom.roomId,
        unitId: selectedRoom.unitId,
        arrival,
        departure,
        title,
        firstName,
        lastName,
        email,
        mobile,
        phone,
        language,
        adults: Number(adults || 1),
        children: Number(children || 0),
        price: price.trim() === "" ? null : Number(price),
        comments,
        notes,
        referrer,
      }),
    });

    const data = (await response.json().catch(() => null)) as BookingResult | null;
    setSaving(false);

    if (!response.ok) {
      setNotice(data?.message || "Η κράτηση δεν δημιουργήθηκε.");
      return;
    }

    setResult(data);
    setNotice("Η κράτηση δημιουργήθηκε επιτυχώς στο Beds24.");
  }

  return (
    <main className="min-h-screen bg-[#f6f0e7] px-3 py-5 text-stone-900 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-col gap-4 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-stone-200 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <Link href="/staff" className="text-sm font-black text-amber-800 hover:underline">
              ← Staff Area
            </Link>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.24em] text-amber-700">Voulamandis Staff</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight md:text-5xl">Τιμές, Διαθεσιμότητα & Κράτηση</h1>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-stone-600">
              Staff Room Finder: έλεγχος από Booking Core και τελική καταχώρηση απευθείας στο Beds24.
            </p>
          </div>
          <div className="flex gap-2 text-xs font-black">
            <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700 ring-1 ring-emerald-200">
              Booking Core
            </span>
            <span className={`rounded-full px-3 py-2 ring-1 ${config?.hasPropertyId && (config?.hasRefreshToken || config?.hasInviteCode) ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200"}`}>
              Beds24 API
            </span>
          </div>
        </header>

        {notice ? (
          <div className="mb-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950 ring-1 ring-amber-200">
            {notice}
          </div>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <form onSubmit={searchAvailability} className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-stone-200 md:p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-100 text-lg">⌕</div>
                <div>
                  <h2 className="text-xl font-black">1. Τι ζητά ο πελάτης;</h2>
                  <p className="mt-1 text-sm font-medium text-stone-500">Βάζεις ημερομηνίες και άτομα όπως στο AI Room Finder.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className={labelClass}>Check-in</span>
                  <input type="date" value={arrival} onChange={(event) => setArrival(event.target.value)} className={inputClass} />
                </label>
                <label className="space-y-2">
                  <span className={labelClass}>Check-out</span>
                  <input type="date" value={departure} onChange={(event) => setDeparture(event.target.value)} className={inputClass} />
                </label>
                <label className="space-y-2">
                  <span className={labelClass}>Ενήλικες</span>
                  <input type="number" min="1" max="5" value={adults} onChange={(event) => setAdults(event.target.value)} className={inputClass} />
                </label>
                <label className="space-y-2">
                  <span className={labelClass}>Παιδιά</span>
                  <input type="number" min="0" max="4" value={children} onChange={(event) => setChildren(event.target.value)} className={inputClass} />
                </label>
              </div>

              <button type="submit" disabled={searching || loadingConfig} className="mt-5 w-full rounded-2xl bg-stone-900 px-5 py-3.5 text-sm font-black text-white hover:bg-stone-800 disabled:opacity-50">
                {searching ? "Ελέγχω διαθεσιμότητα..." : "Έλεγχος διαθεσιμότητας"}
              </button>
            </form>

            <div className="rounded-[1.75rem] bg-[#efe4d4] p-5 ring-1 ring-amber-200 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Σύνοψη</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/80 p-3"><span className="text-stone-500">Νύχτες</span><strong className="mt-1 block text-lg">{nights > 0 ? nights : "-"}</strong></div>
                <div className="rounded-2xl bg-white/80 p-3"><span className="text-stone-500">Άτομα</span><strong className="mt-1 block text-lg">{totalGuests}</strong></div>
                <div className="col-span-2 rounded-2xl bg-white/80 p-3"><span className="text-stone-500">Επιλογή</span><strong className="mt-1 block">{selectedOffer?.name || "Δεν έχει επιλεγεί δωμάτιο"}</strong></div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-stone-200 md:p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-stone-100 text-lg">💬</div>
              <div>
                <h2 className="text-xl font-black">2. Διαθέσιμες επιλογές</h2>
                <p className="mt-1 text-sm font-medium text-stone-500">Οι τιμές έρχονται από το ίδιο Booking Core που χρησιμοποιεί ο AI Room Finder.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {offers.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm font-semibold text-stone-500">
                  Κάνε αναζήτηση για να εμφανιστούν διαθέσιμα δωμάτια.
                </div>
              ) : offers.map((offer) => {
                const active = selectedOffer?.roomId === offer.roomId && selectedOffer?.unitId === offer.unitId;
                const nightly = offer.nights > 0 ? offer.directTotal / offer.nights : offer.directTotal;
                return (
                  <button
                    type="button"
                    key={`${offer.roomId}:${offer.unitId}`}
                    onClick={() => chooseOffer(offer)}
                    className={`w-full rounded-3xl p-4 text-left transition ring-1 ${active ? "bg-amber-50 ring-amber-400 shadow-md" : "bg-white ring-stone-200 hover:bg-stone-50"}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-black">{offer.name}</p>
                        <p className="mt-1 text-xs font-bold text-stone-500">{offer.category} · {offer.floor} · έως {offer.maxGuests} άτομα</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-2xl font-black text-stone-900">{money(offer.directTotal)}</p>
                        <p className="text-xs font-bold text-stone-500">{money(nightly)} / νύχτα</p>
                      </div>
                    </div>
                    {offer.saving > 0 ? <p className="mt-3 text-xs font-black text-emerald-700">Εξοικονόμηση direct: {money(offer.saving)}</p> : null}
                    <p className="mt-3 text-xs font-black text-amber-800">{active ? "✓ Επιλεγμένο" : "Επίλεξε για κράτηση"}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <form onSubmit={createBooking} className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-stone-200 md:p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-stone-100 text-lg">👤</div>
              <div>
                <h2 className="text-xl font-black">3. Στοιχεία πελάτη</h2>
                <p className="mt-1 text-sm font-medium text-stone-500">Τα στοιχεία που θα γραφτούν στην κράτηση του Beds24.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className={labelClass}>Title</span>
                <select value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass}>
                  <option value="Mr">Mr</option><option value="Mrs">Mrs</option><option value="Ms">Ms</option><option value="Dr">Dr</option>
                </select>
              </label>
              <label className="space-y-2"><span className={labelClass}>Όνομα</span><input value={firstName} onChange={(event) => setFirstName(event.target.value)} className={inputClass} /></label>
              <label className="space-y-2"><span className={labelClass}>Επώνυμο</span><input value={lastName} onChange={(event) => setLastName(event.target.value)} className={inputClass} /></label>
              <label className="space-y-2 sm:col-span-2"><span className={labelClass}>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} /></label>
              <label className="space-y-2"><span className={labelClass}>Mobile</span><input value={mobile} onChange={(event) => setMobile(event.target.value)} className={inputClass} placeholder="π.χ. +30 69..." /></label>
              <label className="space-y-2"><span className={labelClass}>Phone</span><input value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} /></label>
              <label className="space-y-2"><span className={labelClass}>Γλώσσα</span><select value={language} onChange={(event) => setLanguage(event.target.value)} className={inputClass}><option value="en">English</option><option value="el">Greek</option><option value="fr">French</option><option value="de">German</option><option value="it">Italian</option><option value="es">Spanish</option><option value="tr">Turkish</option></select></label>
              <label className="space-y-2"><span className={labelClass}>Πηγή</span><input value={referrer} onChange={(event) => setReferrer(event.target.value)} className={inputClass} /></label>
              <label className="space-y-2 sm:col-span-2"><span className={labelClass}>Guest message</span><textarea value={comments} onChange={(event) => setComments(event.target.value)} className={`${inputClass} min-h-24`} /></label>
              <label className="space-y-2 sm:col-span-2"><span className={labelClass}>Internal notes</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} className={`${inputClass} min-h-24`} /></label>
            </div>
          </section>

          <section className="rounded-[1.75rem] bg-stone-900 p-5 text-white shadow-sm md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Τελικός έλεγχος</p>
            <h2 className="mt-2 text-2xl font-black">4. Καταχώρηση στο Beds24</h2>

            <div className="mt-5 space-y-3 rounded-3xl bg-white/10 p-4 text-sm">
              <div className="flex justify-between gap-4"><span className="text-white/60">Δωμάτιο</span><strong className="text-right">{selectedOffer?.name || "-"}</strong></div>
              <div className="flex justify-between gap-4"><span className="text-white/60">Διαμονή</span><strong className="text-right">{arrival} → {departure}</strong></div>
              <div className="flex justify-between gap-4"><span className="text-white/60">Άτομα</span><strong>{totalGuests}</strong></div>
              <div className="border-t border-white/10 pt-3">
                <label className="space-y-2"><span className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Τελική συνολική τιμή</span><input type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} className="w-full rounded-2xl border border-white/20 bg-white px-4 py-3 text-xl font-black text-stone-900 outline-none" placeholder="0.00" /></label>
                {selectedOffer ? <p className="mt-2 text-xs font-semibold text-white/60">Προτεινόμενη direct τιμή: {money(selectedOffer.directTotal)}</p> : null}
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-amber-300/10 p-3 text-xs font-semibold leading-5 text-amber-100 ring-1 ring-amber-300/20">
              Πριν δημιουργηθεί η κράτηση, ο server ελέγχει ξανά ότι το επιλεγμένο δωμάτιο παραμένει διαθέσιμο στο Booking Core.
            </div>

            <button type="submit" disabled={saving || !selectedOffer || loadingConfig} className="mt-5 w-full rounded-2xl bg-amber-400 px-5 py-4 text-sm font-black text-stone-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40">
              {saving ? "Καταχωρώ στο Beds24..." : "Επιβεβαίωση & Δημιουργία κράτησης"}
            </button>

            {result?.bookingId ? (
              <div className="mt-5 rounded-3xl bg-white p-4 text-stone-900">
                <p className="text-xs font-black uppercase text-emerald-700">Η κράτηση δημιουργήθηκε</p>
                <p className="mt-2 text-2xl font-black">#{result.bookingId}</p>
                <p className="mt-1 text-sm font-bold">{result.roomLabel} · {result.categoryLabel}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.whatsappUrl ? <a href={result.whatsappUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white">WhatsApp</a> : null}
                  {result.viberLink ? <a href={result.viberLink} target="_blank" rel="noreferrer" className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-black text-white">Viber</a> : null}
                </div>
              </div>
            ) : null}
          </section>
        </form>
      </div>
    </main>
  );
}

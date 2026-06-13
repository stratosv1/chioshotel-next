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

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowIso() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function nightsBetween(arrival: string, departure: string) {
  const start = new Date(`${arrival}T00:00:00Z`).getTime();
  const end = new Date(`${departure}T00:00:00Z`).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return 0;
  }

  return Math.round((end - start) / 86400000);
}

const inputClass =
  "w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-800 shadow-sm outline-none ring-0 transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100";

const labelClass = "text-xs font-black uppercase tracking-[0.18em] text-amber-800";

export default function BookerApp() {
  const [config, setConfig] = useState<BookerConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [result, setResult] = useState<BookingResult | null>(null);

  const [roomKey, setRoomKey] = useState("");
  const [arrival, setArrival] = useState(todayIso());
  const [departure, setDeparture] = useState(tomorrowIso());
  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("en");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [price, setPrice] = useState("");
  const [referrer, setReferrer] = useState("Staff Direct");
  const [comments, setComments] = useState("");
  const [notes, setNotes] = useState("");

  const nights = useMemo(() => nightsBetween(arrival, departure), [arrival, departure]);

  const selectedRoom = useMemo(() => {
    if (!config || !roomKey) {
      return null;
    }

    const [roomId, unitId] = roomKey.split(":").map(Number);
    return config.rooms.find((room) => room.roomId === roomId && room.unitId === unitId) ?? null;
  }, [config, roomKey]);

  async function loadConfig() {
    setLoadingConfig(true);

    const response = await fetch("/api/staff/booker/", {
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!response.ok) {
      setToast("Δεν φορτώθηκαν οι ρυθμίσεις Beds24.");
      setLoadingConfig(false);
      return;
    }

    const data = (await response.json()) as BookerConfig;
    setConfig(data);

    if (data.rooms[0] && !roomKey) {
      setRoomKey(`${data.rooms[0].roomId}:${data.rooms[0].unitId}`);
    }

    setLoadingConfig(false);
  }

  useEffect(() => {
    void loadConfig();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setToast("");
    setResult(null);

    if (!selectedRoom) {
      setToast("Διάλεξε δωμάτιο.");
      return;
    }

    if (nights <= 0) {
      setToast("Το check-out πρέπει να είναι μετά το check-in.");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setToast("Συμπλήρωσε όνομα και επώνυμο.");
      return;
    }

    setSaving(true);

    const response = await fetch("/api/staff/booker/", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
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
      setToast(data?.message || "Η κράτηση δεν δημιουργήθηκε.");
      return;
    }

    setResult(data);
    setToast("Η κράτηση δημιουργήθηκε στο Beds24.");
  }

  return (
    <main className="min-h-screen bg-[#f8f1e8] px-4 py-8 text-stone-900 md:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] bg-gradient-to-br from-amber-50 via-white to-stone-100 p-5 shadow-xl ring-1 ring-amber-100 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <Link
                href="/staff"
                className="mb-4 inline-flex items-center rounded-2xl bg-white px-4 py-2 text-sm font-black text-amber-800 shadow-sm ring-1 ring-amber-200 hover:bg-amber-50"
              >
                ← Επιστροφή στην κεντρική πλατφόρμα Staff
              </Link>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-700">
                Voulamandis Staff
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-800 md:text-6xl">
                Κάνε Κράτηση
              </h1>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-stone-600 md:text-base">
                Δημιουργία επιβεβαιωμένης κράτησης απευθείας στο Beds24, χωρίς WordPress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadConfig()}
              className="rounded-2xl bg-stone-950 px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-stone-800"
            >
              Ανανέωση
            </button>
          </div>

          {toast ? (
            <div className="mt-6 rounded-2xl bg-amber-100 px-4 py-3 text-sm font-black text-amber-900">
              {toast}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-stone-200">
              <p className="text-xs font-black uppercase text-stone-500">Beds24 Property</p>
              <p className="mt-2 text-2xl font-black">{config?.hasPropertyId ? "OK" : "Missing"}</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-stone-200">
              <p className="text-xs font-black uppercase text-stone-500">Token</p>
              <p className="mt-2 text-2xl font-black">
                {config?.hasRefreshToken || config?.hasInviteCode ? "OK" : "Missing"}
              </p>
            </div>
            <div className="rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-stone-200">
              <p className="text-xs font-black uppercase text-stone-500">Νύχτες</p>
              <p className="mt-2 text-2xl font-black">{nights > 0 ? nights : "-"}</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-stone-200">
              <p className="text-xs font-black uppercase text-stone-500">Δωμάτιο</p>
              <p className="mt-2 text-lg font-black">{selectedRoom?.label || "-"}</p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-stone-200 md:p-7">
            <h2 className="text-2xl font-black text-stone-800">Στοιχεία κράτησης</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className={labelClass}>Δωμάτιο / Unit</span>
                <select
                  value={roomKey}
                  onChange={(event) => setRoomKey(event.target.value)}
                  className={inputClass}
                  disabled={loadingConfig}
                >
                  {config?.rooms.map((room) => (
                    <option key={`${room.roomId}:${room.unitId}`} value={`${room.roomId}:${room.unitId}`}>
                      {room.label} - {room.categoryLabel}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className={labelClass}>Referrer</span>
                <input value={referrer} onChange={(event) => setReferrer(event.target.value)} className={inputClass} />
              </label>

              <label className="space-y-2">
                <span className={labelClass}>Check-in</span>
                <input type="date" value={arrival} onChange={(event) => setArrival(event.target.value)} className={inputClass} />
              </label>

              <label className="space-y-2">
                <span className={labelClass}>Check-out</span>
                <input type="date" value={departure} onChange={(event) => setDeparture(event.target.value)} className={inputClass} />
              </label>

              <label className="space-y-2">
                <span className={labelClass}>Adults</span>
                <input type="number" min="1" value={adults} onChange={(event) => setAdults(event.target.value)} className={inputClass} />
              </label>

              <label className="space-y-2">
                <span className={labelClass}>Children</span>
                <input type="number" min="0" value={children} onChange={(event) => setChildren(event.target.value)} className={inputClass} />
              </label>

              <label className="space-y-2">
                <span className={labelClass}>Total price</span>
                <input type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} className={inputClass} placeholder="π.χ. 350" />
              </label>

              <label className="space-y-2">
                <span className={labelClass}>Language</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value)} className={inputClass}>
                  <option value="en">English</option>
                  <option value="el">Greek</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="es">Spanish</option>
                  <option value="tr">Turkish</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-stone-200 md:p-7">
            <h2 className="text-2xl font-black text-stone-800">Στοιχεία πελάτη</h2>

            <div className="mt-6 grid gap-4">
              <label className="space-y-2">
                <span className={labelClass}>Title</span>
                <select value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass}>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className={labelClass}>First name</span>
                  <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className={inputClass} />
                </label>

                <label className="space-y-2">
                  <span className={labelClass}>Last name</span>
                  <input value={lastName} onChange={(event) => setLastName(event.target.value)} className={inputClass} />
                </label>
              </div>

              <label className="space-y-2">
                <span className={labelClass}>Email</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className={labelClass}>Mobile</span>
                  <input value={mobile} onChange={(event) => setMobile(event.target.value)} className={inputClass} placeholder="π.χ. 3069..." />
                </label>

                <label className="space-y-2">
                  <span className={labelClass}>Phone</span>
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} />
                </label>
              </div>

              <label className="space-y-2">
                <span className={labelClass}>Guest message</span>
                <textarea value={comments} onChange={(event) => setComments(event.target.value)} className={`${inputClass} min-h-24`} />
              </label>

              <label className="space-y-2">
                <span className={labelClass}>Internal notes</span>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className={`${inputClass} min-h-24`} />
              </label>
            </div>
          </section>

          <section className="rounded-[2rem] bg-stone-950 p-5 text-white shadow-xl lg:col-span-2 md:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                  Final action
                </p>
                <h2 className="mt-2 text-3xl font-black">Δημιουργία κράτησης στο Beds24</h2>
                <p className="mt-2 text-sm font-medium text-white/70">
                  Η κράτηση θα σταλεί ως confirmed. Έλεγξε καλά ημερομηνίες, δωμάτιο και στοιχεία πελάτη.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving || loadingConfig}
                className="rounded-2xl bg-amber-400 px-6 py-4 text-sm font-black text-stone-950 shadow-lg hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Δημιουργία..." : "Κάνε κράτηση"}
              </button>
            </div>

            {result?.bookingId ? (
              <div className="mt-6 rounded-3xl bg-white p-5 text-stone-900">
                <p className="text-xs font-black uppercase text-green-700">Success</p>
                <h3 className="mt-2 text-2xl font-black">Booking ID: {result.bookingId}</h3>
                {result.reference ? <p className="mt-1 font-bold">Reference: {result.reference}</p> : null}
                <p className="mt-1 font-bold">
                  {result.roomLabel} - {result.categoryLabel}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {result.whatsappUrl ? (
                    <a
                      href={result.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-green-600 px-4 py-3 text-sm font-black text-white hover:bg-green-700"
                    >
                      Άνοιγμα WhatsApp
                    </a>
                  ) : null}

                  {result.viberLink ? (
                    <a
                      href={result.viberLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-purple-600 px-4 py-3 text-sm font-black text-white hover:bg-purple-700"
                    >
                      Άνοιγμα Viber
                    </a>
                  ) : null}
                </div>

                {result.viberMessage ? (
                  <textarea
                    readOnly
                    value={result.viberMessage}
                    className="mt-5 min-h-48 w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-700"
                  />
                ) : null}
              </div>
            ) : null}
          </section>
        </form>
      </div>
    </main>
  );
}

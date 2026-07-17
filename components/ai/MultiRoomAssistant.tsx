"use client";

import { FormEvent, useMemo, useState } from "react";

type Offer = {
  roomId: string;
  unitId: string;
  name: string;
  category: string;
  directTotal: number;
  originalTotal: number;
  maxGuests: number;
};

type GroupResult = {
  guests: number;
  offer?: Offer;
};

const MAX_ROOMS = 3;

function roomKey(offer: Offer) {
  return `${offer.roomId}:${offer.unitId}`;
}

export function MultiRoomAssistant() {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [roomGuests, setRoomGuests] = useState<number[]>([2]);
  const [results, setResults] = useState<GroupResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(
    () => results.reduce((sum, item) => sum + Number(item.offer?.directTotal || 0), 0),
    [results],
  );

  function setRoomCount(count: number) {
    setRoomGuests((current) => {
      const next = current.slice(0, count);
      while (next.length < count) next.push(2);
      return next;
    });
    setResults([]);
  }

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResults([]);

    if (!checkin || !checkout || new Date(checkout) <= new Date(checkin)) {
      setError("Ελέγξτε τις ημερομηνίες άφιξης και αναχώρησης.");
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all(
        roomGuests.map(async (guests) => {
          const response = await fetch("/api/ai-assistant/smart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            body: JSON.stringify({
              messages: [
                {
                  role: "user",
                  content: `Check live availability from ${checkin} to ${checkout} for ${guests} guests.`,
                },
              ],
              search: { checkin, checkout, guests },
              language: "el",
            }),
          });
          const data = await response.json().catch(() => null);
          if (!response.ok) throw new Error(data?.error || "Η αναζήτηση απέτυχε.");
          return (Array.isArray(data?.offers) ? data.offers : []) as Offer[];
        }),
      );

      const used = new Set<string>();
      const selected = responses.map((offers, index) => {
        const sorted = [...offers].sort((a, b) => Number(a.directTotal) - Number(b.directTotal));
        const offer = sorted.find((candidate) => !used.has(roomKey(candidate)));
        if (offer) used.add(roomKey(offer));
        return { guests: roomGuests[index], offer };
      });

      setResults(selected);
      if (selected.some((item) => !item.offer)) {
        setError("Δεν βρέθηκε διαφορετικό διαθέσιμο δωμάτιο για κάθε ομάδα. Δοκιμάστε άλλες ημερομηνίες ή κατανομή επισκεπτών.");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Η αναζήτηση απέτυχε.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border-b border-stone-200 bg-[#f6f3ec]">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Νέα δυνατότητα</p>
              <h2 className="mt-1 text-xl font-bold text-stone-950">Αναζήτηση για πολλά δωμάτια</h2>
              <p className="mt-1 text-sm text-stone-600">Έως 3 διαφορετικά δωμάτια, με ξεχωριστό αριθμό επισκεπτών.</p>
            </div>
            <div className="flex rounded-xl border border-stone-200 bg-stone-50 p-1">
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setRoomCount(count)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${roomGuests.length === count ? "bg-stone-950 text-white" : "text-stone-600"}`}
                >
                  {count} {count === 1 ? "δωμάτιο" : "δωμάτια"}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={search} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-medium text-stone-700">
              Check-in
              <input type="date" required value={checkin} onChange={(e) => setCheckin(e.target.value)} className="mt-1.5 w-full rounded-xl border border-stone-300 px-3 py-2.5" />
            </label>
            <label className="text-sm font-medium text-stone-700">
              Check-out
              <input type="date" required value={checkout} min={checkin || undefined} onChange={(e) => setCheckout(e.target.value)} className="mt-1.5 w-full rounded-xl border border-stone-300 px-3 py-2.5" />
            </label>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-stone-700">Επισκέπτες ανά δωμάτιο</p>
              <div className="mt-1.5 grid gap-2" style={{ gridTemplateColumns: `repeat(${roomGuests.length}, minmax(0, 1fr))` }}>
                {roomGuests.map((guests, index) => (
                  <label key={index} className="text-xs text-stone-500">
                    Δωμάτιο {index + 1}
                    <select
                      value={guests}
                      onChange={(e) => setRoomGuests((current) => current.map((value, i) => (i === index ? Number(e.target.value) : value)))}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900"
                    >
                      {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} άτομα</option>)}
                    </select>
                  </label>
                ))}
              </div>
            </div>
            <button disabled={loading} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50 sm:col-span-2 lg:col-span-4">
              {loading ? "Ελέγχω διαφορετικά δωμάτια…" : "Έλεγχος πολλών δωματίων"}
            </button>
          </form>

          {error ? <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p> : null}

          {results.length ? (
            <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="space-y-3">
                {results.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold text-stone-500">Δωμάτιο {index + 1} · {item.guests} άτομα</p>
                      <p className="font-bold text-stone-950">{item.offer?.name || "Δεν βρέθηκε διαθέσιμο"}</p>
                      {item.offer ? <p className="text-xs text-stone-500">{item.offer.category}</p> : null}
                    </div>
                    {item.offer ? <p className="text-lg font-black text-emerald-800">{new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(item.offer.directTotal)}</p> : null}
                  </div>
                ))}
              </div>
              {results.every((item) => item.offer) ? (
                <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
                  <span className="font-semibold text-stone-700">Συνολική απευθείας τιμή</span>
                  <strong className="text-2xl text-emerald-800">{new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(total)}</strong>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

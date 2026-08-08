"use client";

import { useState } from "react";

export type TripPlannerEmailStop = {
  name: string;
  kind: string;
  distanceKm: number;
  driveMin: number;
  duration?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  days: TripPlannerEmailStop[][];
  totalDriveMin: number;
};

const PROPERTY_IMAGE = "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp";
const AI_ROOM_FINDER_HREF = "/ai-assistant/?lang=el";
const DIRECT_BOOKING_HREF = "/el/amesi-kratisi-voulamandis-house/";

export function TripPlannerFinishModal({ open, onClose, days, totalDriveMin }: Props) {
  const [email, setEmail] = useState("");
  const [wantsStayOffer, setWantsStayOffer] = useState(true);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  if (!open) return null;

  const totalStops = days.reduce((sum, day) => sum + day.length, 0);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || totalStops === 0) return;
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, wantsStayOffer, days, totalDriveMin, website }),
      });
      const result = await response.json();
      if (!response.ok || !result?.ok) throw new Error(result?.error || "Δεν ήταν δυνατή η αποστολή.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Δεν ήταν δυνατή η αποστολή.");
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2b2118]/50 p-0 backdrop-blur-[3px] sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Ολοκλήρωση Trip Planner">
      <button type="button" aria-label="Κλείσιμο" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div className={`relative z-10 w-full border border-[#e5d8c8] bg-[#fffdf9] shadow-2xl ${status === "success" ? "max-w-3xl rounded-t-[28px] sm:rounded-[30px]" : "max-w-xl rounded-t-[28px] sm:rounded-[28px]"}`}>
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a48565]">Ολοκλήρωση</p>
              <h2 className="mt-1 font-serif text-3xl text-[#35291f]">{status === "success" ? "Το ταξίδι σου στη Χίο ξεκινά εδώ" : "Πάρε το πρόγραμμά σου στο email"}</h2>
            </div>
            <button type="button" onClick={onClose} className="rounded-full border border-[#e7dbcc] bg-white px-3 py-2 text-sm text-[#776758]">✕</button>
          </div>

          {status === "success" ? (
            <div className="mt-5">
              <div className="rounded-2xl border border-[#cedcc8] bg-[#f3f8f0] px-4 py-3 text-[#4f6749]">
                <p className="text-sm font-semibold">✓ Το προσωπικό σου πρόγραμμα στάλθηκε στο {email}</p>
              </div>

              <div className="mt-4 overflow-hidden rounded-[24px] border border-[#dfcfbb] bg-[#f8efe4] shadow-[0_12px_30px_rgba(77,54,34,.09)]">
                <div className="grid md:grid-cols-[1.02fr_.98fr]">
                  <div className="relative min-h-[230px] overflow-hidden md:min-h-[360px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={PROPERTY_IMAGE} alt="Voulamandis House στον Κάμπο της Χίου" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#281b12]/75 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">Κάμπος Χίου</p>
                      <p className="mt-1 font-serif text-3xl">Voulamandis House</p>
                      <p className="mt-1 text-sm text-white/90">Μια ήρεμη βάση για να ζήσεις το πρόγραμμα που μόλις έφτιαξες.</p>
                    </div>
                  </div>

                  <div className="flex flex-col p-5 sm:p-6">
                    <span className="w-fit rounded-full bg-[#e9d5ba] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#76522f]">Direct booking benefit</span>
                    <h3 className="mt-3 font-serif text-[27px] leading-tight text-[#3f2e20]">Βρες τώρα το δωμάτιο που ταιριάζει στο ταξίδι σου</h3>
                    <p className="mt-2 text-sm leading-6 text-[#766351]">Έχεις ήδη οργανώσει παραλίες και χωριά. Κάνε το επόμενο βήμα και άφησε το AI Room Finder του Voulamandis House να σου δείξει τις επιλογές διαμονής που ταιριάζουν στις ημερομηνίες και την παρέα σου.</p>

                    <div className="mt-4 grid gap-2 text-sm text-[#554536] sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                      <div className="rounded-xl bg-white/75 px-3 py-2.5">🌿 Κήπος & ήρεμος Κάμπος</div>
                      <div className="rounded-xl bg-white/75 px-3 py-2.5">🥐 Πρωινό στον κήπο</div>
                      <div className="rounded-xl bg-white/75 px-3 py-2.5">📍 Κοντά σε πόλη, αεροδρόμιο & παραλίες</div>
                      <div className="rounded-xl bg-white/75 px-3 py-2.5">🎁 -10% direct booking</div>
                    </div>

                    <a href={AI_ROOM_FINDER_HREF} className="mt-5 flex min-h-13 items-center justify-center rounded-xl bg-[#7f5d3c] px-5 py-3.5 text-center text-sm font-bold text-white shadow-[0_10px_22px_rgba(83,57,34,.22)] transition hover:bg-[#68492f]">
                      ✨ Βρες το δωμάτιό σου με το AI Room Finder
                    </a>
                    <a href={DIRECT_BOOKING_HREF} className="mt-2 flex min-h-11 items-center justify-center rounded-xl border border-[#cfb79a] bg-white/85 px-4 py-2.5 text-center text-sm font-semibold text-[#725235] transition hover:bg-white">
                      Δες άμεσα διαθεσιμότητα
                    </a>

                    {wantsStayOffer ? (
                      <div className="mt-4 rounded-xl border border-[#d9c2a5] bg-white/65 p-3 text-xs leading-5 text-[#705b47]">
                        <strong className="block text-[#4b3828]">✓ Ζήτησες και προσωπική πρόταση διαμονής</strong>
                        Η reception έχει λάβει το ενδιαφέρον σου και μπορεί να επικοινωνήσει στο {email}.
                      </div>
                    ) : (
                      <p className="mt-4 text-xs leading-5 text-[#8a7764]">Δεν έχει ζητηθεί επικοινωνία από τη reception. Μπορείς όμως να χρησιμοποιήσεις τώρα το AI Room Finder χωρίς να περιμένεις απάντηση.</p>
                    )}
                  </div>
                </div>
              </div>

              <button type="button" onClick={onClose} className="mt-4 w-full rounded-xl border border-[#dacbb9] bg-white py-3 text-sm font-semibold text-[#695641]">Επιστροφή στο πρόγραμμά μου</button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6">
              <div className="rounded-2xl border border-[#e8ddcf] bg-white p-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#746659]">Το πρόγραμμά σου</span>
                  <strong className="text-[#44362a]">{totalStops} στάσεις · 3 ημέρες</strong>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#988777]">Θα σου στείλουμε τις στάσεις σου οργανωμένες ανά ημέρα. PDF attachment θα προστεθεί στο επόμενο στάδιο· το email περιέχει ήδη όλο το itinerary.</p>
              </div>

              <label className="mt-5 block text-sm font-semibold text-[#4a3c31]" htmlFor="trip-planner-email">Email</label>
              <input id="trip-planner-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className="mt-2 min-h-12 w-full rounded-xl border border-[#d9c9b7] bg-white px-4 text-base outline-none transition focus:border-[#9f7d59] focus:ring-2 focus:ring-[#d8c4ab]/50" />

              <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} className="hidden" aria-hidden="true" />

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#d9c4a8] bg-[#f8eee1] p-4 shadow-sm">
                <input type="checkbox" checked={wantsStayOffer} onChange={(event) => setWantsStayOffer(event.target.checked)} className="mt-1 h-4 w-4 accent-[#8f6f4f]" />
                <span>
                  <strong className="block text-sm text-[#4b392a]">Θέλω προσωπική πρόταση διαμονής από το Voulamandis House</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#806d5b]">Η reception μπορεί να επικοινωνήσει μαζί μου στο παραπάνω email με διαθεσιμότητα και επιλογές για απευθείας κράτηση.</span>
                </span>
              </label>

              {status === "error" && <p className="mt-3 text-sm text-[#a44e43]">{error}</p>}

              <button type="submit" disabled={status === "sending" || totalStops === 0} className="mt-5 flex min-h-13 w-full items-center justify-center rounded-xl bg-[#8f6f4f] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(88,61,36,.16)] transition hover:bg-[#76583c] disabled:cursor-not-allowed disabled:opacity-50">
                {status === "sending" ? "Αποστολή…" : "Στείλε μου το πρόγραμμα & συνέχισε"}
              </button>
              <p className="mt-3 text-center text-[11px] leading-5 text-[#9b8b7c]">Χρησιμοποιούμε το email σου για να σου στείλουμε το itinerary. Επικοινωνία για διαμονή γίνεται μόνο αν κρατήσεις ενεργή την παραπάνω επιλογή.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

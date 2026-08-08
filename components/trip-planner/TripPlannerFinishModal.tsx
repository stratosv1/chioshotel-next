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

const ROOM_PREVIEWS = [
  {
    number: 1,
    label: "Έως 4 άτομα",
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
  },
  {
    number: 3,
    label: "Έως 3 άτομα",
    image: "/images/rooms/DSC07867-1.webp",
  },
  {
    number: 7,
    label: "Ισόγειο · έως 3",
    image: "/images/rooms/double-triple-room.jpg",
  },
] as const;

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
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2b2118]/55 p-0 backdrop-blur-[4px] sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Ολοκλήρωση Trip Planner">
      <button type="button" aria-label="Κλείσιμο" onClick={onClose} className="absolute inset-0 cursor-default" />

      <div className="relative z-10 max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] border border-[#e5d8c8] bg-[#fffdf9] shadow-2xl sm:rounded-[30px]">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-20 rounded-full border border-[#e7dbcc] bg-white/95 px-3 py-2 text-sm text-[#776758] shadow-sm">✕</button>

        {status === "success" ? (
          <div className="p-5 sm:p-7">
            <div className="pr-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a48565]">Το πρόγραμμά σου στάλθηκε</p>
              <h2 className="mt-1 font-serif text-3xl text-[#35291f] sm:text-4xl">Τώρα βρες και τη σωστή βάση για το ταξίδι σου</h2>
            </div>

            <div className="mt-4 rounded-2xl border border-[#cedcc8] bg-[#f3f8f0] px-4 py-3 text-[#4f6749]">
              <p className="text-sm font-semibold">✓ Το προσωπικό σου πρόγραμμα στάλθηκε στο {email}</p>
            </div>

            <div className="mt-4 overflow-hidden rounded-[24px] border border-[#dfcfbb] bg-[#f8efe4] shadow-[0_12px_30px_rgba(77,54,34,.09)]">
              <div className="grid md:grid-cols-[1.05fr_.95fr]">
                <div className="relative min-h-[220px] overflow-hidden md:min-h-[390px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PROPERTY_IMAGE} alt="Voulamandis House στον Κάμπο της Χίου" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#281b12]/78 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">Κάμπος Χίου</p>
                    <p className="mt-1 font-serif text-3xl">Voulamandis House</p>
                    <p className="mt-1 text-sm text-white/90">Μια ήρεμη βάση για παραλίες, χωριά και τις διαδρομές που μόλις επέλεξες.</p>
                  </div>
                </div>

                <div className="flex flex-col p-5 sm:p-6">
                  <span className="w-fit rounded-full bg-[#e9d5ba] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#76522f]">Direct booking benefit</span>
                  <h3 className="mt-3 font-serif text-[27px] leading-tight text-[#3f2e20]">Βρες τώρα το δωμάτιο που ταιριάζει στο ταξίδι σου</h3>
                  <p className="mt-2 text-sm leading-6 text-[#766351]">Το AI Room Finder του Voulamandis House μπορεί να σου δείξει επιλογές ανά ημερομηνίες, αριθμό επισκεπτών και τύπο δωματίου.</p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#554536]">
                    <div className="rounded-xl bg-white/75 px-3 py-2.5">🌿 Κήπος & ήρεμος Κάμπος</div>
                    <div className="rounded-xl bg-white/75 px-3 py-2.5">🥐 Πρωινό στον κήπο</div>
                    <div className="rounded-xl bg-white/75 px-3 py-2.5">📍 Κοντά σε πόλη & παραλίες</div>
                    <div className="rounded-xl bg-white/75 px-3 py-2.5">🎁 -10% direct booking</div>
                  </div>

                  <RoomPreviewStrip className="mt-4" />

                  <a href={AI_ROOM_FINDER_HREF} className="mt-5 flex min-h-13 items-center justify-center rounded-xl bg-[#7f5d3c] px-5 py-3.5 text-center text-sm font-bold text-white shadow-[0_10px_22px_rgba(83,57,34,.22)] transition hover:bg-[#68492f]">✨ Βρες το δωμάτιό σου με το AI Room Finder</a>
                  <a href={DIRECT_BOOKING_HREF} className="mt-2 flex min-h-11 items-center justify-center rounded-xl border border-[#cfb79a] bg-white/85 px-4 py-2.5 text-center text-sm font-semibold text-[#725235] transition hover:bg-white">Δες άμεσα διαθεσιμότητα</a>

                  {wantsStayOffer ? (
                    <div className="mt-4 rounded-xl border border-[#d9c2a5] bg-white/65 p-3 text-xs leading-5 text-[#705b47]">
                      <strong className="block text-[#4b3828]">✓ Ζήτησες προσωπική πρόταση διαμονής</strong>
                      Η reception έχει λάβει το ενδιαφέρον σου και μπορεί να επικοινωνήσει στο {email}.
                    </div>
                  ) : (
                    <p className="mt-4 text-xs leading-5 text-[#8a7764]">Δεν έχει ζητηθεί επικοινωνία από τη reception. Μπορείς όμως να χρησιμοποιήσεις τώρα το AI Room Finder.</p>
                  )}
                </div>
              </div>
            </div>

            <button type="button" onClick={onClose} className="mt-4 w-full rounded-xl border border-[#dacbb9] bg-white py-3 text-sm font-semibold text-[#695641]">Επιστροφή στο πρόγραμμά μου</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1.02fr_.98fr]">
            <div className="relative min-h-[215px] overflow-hidden sm:min-h-[245px] md:min-h-[620px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PROPERTY_IMAGE} alt="Voulamandis House στον Κάμπο της Χίου" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24170e]/88 via-[#3b2818]/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/75 sm:text-[10px]">Voulamandis House · Κάμπος Χίου</p>
                <h2 className="mt-1.5 max-w-xl font-serif text-[25px] leading-[1.08] sm:mt-2 sm:text-[34px] md:text-[36px]">Το πρόγραμμά σου είναι έτοιμο. Κάνε και τη διαμονή μέρος του ταξιδιού.</h2>
                <p className="mt-2 hidden max-w-md text-sm leading-6 text-white/88 sm:block">Στείλε το itinerary στο email σου και, αν θέλεις, ζήτησε από τη reception μια προσωπική πρόταση διαμονής που να ταιριάζει στις ημέρες και τις διαδρομές σου.</p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-semibold sm:mt-4 sm:gap-2 sm:text-xs">
                  <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur sm:px-3 sm:py-1.5">🌿 Ήρεμος Κάμπος</span>
                  <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur sm:px-3 sm:py-1.5">🥐 Πρωινό στον κήπο</span>
                  <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur sm:px-3 sm:py-1.5">🎁 -10% direct</span>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="p-5 sm:p-7 md:flex md:flex-col md:justify-center">
              <div className="pr-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a48565]">Ολοκλήρωση</p>
                <h3 className="mt-1 font-serif text-[27px] leading-tight text-[#35291f] sm:text-3xl">Πάρε το προσωπικό σου Chios Trip Plan</h3>
                <p className="mt-2 text-sm leading-6 text-[#7b6a59]">Οι επιλογές σου οργανωμένες ανά ημέρα, έτοιμες για το ταξίδι.</p>
              </div>

              <div className="mt-4 rounded-2xl border border-[#e8ddcf] bg-[#fbf7f1] p-3.5 sm:mt-5 sm:p-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#746659]">Το πρόγραμμά σου</span>
                  <strong className="text-[#44362a]">{totalStops} στάσεις · 3 ημέρες</strong>
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-[11px] text-[#7e6b59] sm:mt-3 sm:text-xs">
                  {days.map((day, index) => (
                    <div key={index} className="rounded-xl bg-white px-2 py-2">
                      <strong className="block text-sm text-[#49392c]">{day.length}</strong>
                      Ημέρα {index + 1}
                    </div>
                  ))}
                </div>
              </div>

              <RoomPreviewStrip className="mt-4" />

              <label className="mt-4 block text-sm font-semibold text-[#4a3c31] sm:mt-5" htmlFor="trip-planner-email">Πού να σου στείλουμε το πρόγραμμα;</label>
              <input id="trip-planner-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className="mt-2 min-h-12 w-full rounded-xl border border-[#d9c9b7] bg-white px-4 text-base outline-none transition focus:border-[#9f7d59] focus:ring-2 focus:ring-[#d8c4ab]/50" />

              <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} className="hidden" aria-hidden="true" />

              <label className="mt-3.5 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#d5bea0] bg-[#f7ecdd] p-3.5 shadow-sm transition hover:border-[#b8956d] sm:mt-4 sm:p-4">
                <input type="checkbox" checked={wantsStayOffer} onChange={(event) => setWantsStayOffer(event.target.checked)} className="mt-1 h-4 w-4 accent-[#8f6f4f]" />
                <span>
                  <strong className="block text-sm text-[#4b392a]">Ναι, θέλω προσωπική πρόταση διαμονής από το Voulamandis House</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#806d5b]">Η reception μπορεί να μου στείλει διαθεσιμότητα και επιλογές που ταιριάζουν στο ταξίδι μου.</span>
                </span>
              </label>

              <div className="mt-3 rounded-xl border border-[#eadfce] bg-white px-3 py-2.5 text-xs leading-5 text-[#7d6a58]">
                <strong className="text-[#5c4632]">Μετά την αποστολή:</strong> συνέχισε στο <strong>AI Room Finder</strong> για να βρεις δωμάτιο με βάση ημερομηνίες και άτομα.
              </div>

              {status === "error" && <p className="mt-3 text-sm text-[#a44e43]">{error}</p>}

              <button type="submit" disabled={status === "sending" || totalStops === 0} className="mt-4 flex min-h-13 w-full items-center justify-center rounded-xl bg-[#7f5d3c] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(83,57,34,.2)] transition hover:bg-[#68492f] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-5">
                {status === "sending" ? "Αποστολή…" : "Στείλε το πρόγραμμά μου & συνέχισε →"}
              </button>

              <p className="mt-2.5 text-center text-[10px] leading-4 text-[#9b8b7c] sm:mt-3 sm:text-[11px] sm:leading-5">Το email χρησιμοποιείται για την αποστολή του itinerary. Η reception επικοινωνεί μόνο αν αφήσεις ενεργή την επιλογή διαμονής.</p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function RoomPreviewStrip({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9b8167]">Μερικές επιλογές διαμονής</p>
        <span className="text-[10px] text-[#9b8a79]">Room 1 · 3 · 7</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {ROOM_PREVIEWS.map((room) => (
          <div key={room.number} className="group overflow-hidden rounded-xl border border-[#e2d5c5] bg-white shadow-[0_4px_10px_rgba(79,57,38,.05)]">
            <div className="relative aspect-[1.35/1] overflow-hidden bg-[#eee7de]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={room.image} alt={`Δωμάτιο ${room.number} στο Voulamandis House`} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
              <span className="absolute left-1.5 top-1.5 rounded-md bg-[#2f241c]/72 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">Room {room.number}</span>
            </div>
            <div className="px-2 py-1.5 text-center text-[9px] font-medium leading-3 text-[#756351] sm:text-[10px]">{room.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

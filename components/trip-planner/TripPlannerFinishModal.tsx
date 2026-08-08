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

const AI_ROOM_FINDER_HREF = "/ai-assistant/?lang=el";
const DIRECT_BOOKING_HREF = "/el/amesi-kratisi-voulamandis-house/";

const GALLERY_ITEMS = [
  {
    id: "property",
    title: "Voulamandis House",
    meta: "Κάμπος Χίου",
    image: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
    objectPosition: "50% 52%",
  },
  {
    id: "room-1",
    title: "Room 1",
    meta: "έως 4 άτομα",
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
    objectPosition: "50% 62%",
  },
  {
    id: "room-3",
    title: "Room 3",
    meta: "έως 3 άτομα",
    image: "/images/rooms/DSC07867-1.webp",
    objectPosition: "50% 60%",
  },
  {
    id: "room-7",
    title: "Room 7",
    meta: "ισόγειο · έως 3",
    image: "/images/rooms/double-triple-room.jpg",
    objectPosition: "50% 72%",
  },
] as const;

function GalleryPanel({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (index: number) => void;
}) {
  const active = GALLERY_ITEMS[selected] ?? GALLERY_ITEMS[0];

  return (
    <div className="flex flex-none flex-col bg-[#554638] text-white md:h-full md:min-h-0">
      <div className="relative h-[104px] shrink-0 overflow-hidden sm:h-[140px] md:h-[355px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.image}
          alt={active.title}
          style={{ objectPosition: active.objectPosition }}
          className="h-full w-full object-cover transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#23170f]/65 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-3 sm:left-4 sm:right-4 md:bottom-3">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-[9px]">
              {active.id === "property" ? "Voulamandis House" : "Επιλογή διαμονής"}
            </p>
            <p className="mt-0.5 font-serif text-[18px] leading-none sm:text-xl md:text-2xl">{active.title}</p>
          </div>
          <span className="rounded-full bg-black/28 px-2.5 py-1 text-[9px] font-semibold backdrop-blur sm:text-[10px]">
            {active.meta}
          </span>
        </div>
      </div>

      <div className="shrink-0 border-b border-white/10 bg-[#47392f] px-3 py-1.5 sm:px-4 sm:py-2 md:py-2.5">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2" aria-label="Gallery Voulamandis House">
          {GALLERY_ITEMS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={selected === index}
              className={`group relative min-h-11 overflow-hidden rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-white/60 md:min-h-12 ${
                selected === index
                  ? "border-white shadow-[0_0_0_1px_rgba(255,255,255,.20)]"
                  : "border-white/15 opacity-75 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-1 left-1.5 right-1.5 truncate text-left text-[9px] font-bold text-white sm:text-[10px]">
                {item.id === "property" ? "House" : item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col px-4 py-2 sm:px-5 sm:py-2.5 md:min-h-0 md:flex-1 md:justify-center md:px-6 md:py-4">
        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/65 sm:text-[9px]">Κάμπος Χίου</p>
        <h2 className="mt-1 font-serif text-[19px] leading-[1.02] sm:text-[23px] md:text-[31px] md:leading-[1.06]">
          Voulamandis House, η ήρεμη βάση για το ταξίδι σου.
        </h2>
        <div className="mt-1.5 flex flex-wrap gap-1 text-[9px] font-semibold sm:text-[10px] md:mt-2.5 md:gap-1.5 md:text-[11px]">
          <span className="rounded-full bg-white/10 px-2 py-0.5 md:px-2.5 md:py-1">🌿 Ήρεμος Κάμπος</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 md:px-2.5 md:py-1">🥐 Πρωινό στον κήπο</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 md:px-2.5 md:py-1">🎁 -10% direct</span>
        </div>
      </div>
    </div>
  );
}

export function TripPlannerFinishModal({ open, onClose, days, totalDriveMin }: Props) {
  const [email, setEmail] = useState("");
  const [wantsStayOffer, setWantsStayOffer] = useState(true);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [selectedGallery, setSelectedGallery] = useState(0);

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
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "Δεν ήταν δυνατή η αποστολή.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Δεν ήταν δυνατή η αποστολή.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#2b2118]/55 p-0 backdrop-blur-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:items-center sm:p-4 md:overflow-visible"
      role="dialog"
      aria-modal="true"
      aria-label="Ολοκλήρωση Trip Planner"
    >
      <button type="button" aria-label="Κλείσιμο" onClick={onClose} className="fixed inset-0 cursor-default" />

      <div className="relative z-10 w-full overflow-hidden border border-[#e5d8c8] bg-[#fffdf9] shadow-2xl sm:max-w-5xl sm:rounded-[28px] md:h-[min(680px,calc(100vh-32px))]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Κλείσιμο"
          className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[#e7dbcc] bg-white/95 text-sm text-[#776758] shadow-sm transition hover:bg-white"
        >
          ✕
        </button>

        {status === "success" ? (
          <div className="flex flex-col md:grid md:h-full md:grid-cols-[46%_54%]">
            <GalleryPanel selected={selectedGallery} onSelect={setSelectedGallery} />

            <div className="flex flex-col bg-[#fffdf9] px-4 py-2.5 sm:px-6 sm:py-4 md:min-h-0 md:justify-center md:px-7 md:py-5">
              <div className="pr-11">
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#a48565] sm:text-[9px]">Το πρόγραμμά σου στάλθηκε</p>
                <h2 className="mt-1 font-serif text-[21px] leading-[1.04] text-[#35291f] sm:text-[26px] md:text-3xl md:leading-[1.08]">
                  Τώρα βρες το δωμάτιο που ταιριάζει στο ταξίδι σου
                </h2>
              </div>

              <div className="mt-2 rounded-xl border border-[#cedcc8] bg-[#f3f8f0] px-3 py-1.5 text-xs text-[#4f6749] sm:mt-3 sm:py-2.5 sm:text-sm">
                <strong>✓ Στάλθηκε στο {email}</strong>
              </div>

              <p className="mt-2 text-[12px] leading-[18px] text-[#766351] sm:mt-3 sm:text-sm sm:leading-5">
                Το AI Room Finder του Voulamandis House μπορεί να σου δείξει επιλογές ανά ημερομηνίες, άτομα και τύπο δωματίου.
              </p>

              <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] text-[#554536] sm:mt-3 sm:gap-2 sm:text-xs">
                <div className="rounded-xl bg-[#f7efe5] px-2.5 py-1.5 sm:px-3 sm:py-2">🌿 Κήπος & ήρεμος Κάμπος</div>
                <div className="rounded-xl bg-[#f7efe5] px-2.5 py-1.5 sm:px-3 sm:py-2">🥐 Πρωινό στον κήπο</div>
                <div className="rounded-xl bg-[#f7efe5] px-2.5 py-1.5 sm:px-3 sm:py-2">📍 Κοντά σε πόλη & παραλίες</div>
                <div className="rounded-xl bg-[#f7efe5] px-2.5 py-1.5 sm:px-3 sm:py-2">🎁 -10% direct booking</div>
              </div>

              <a
                href={AI_ROOM_FINDER_HREF}
                className="mt-2.5 flex min-h-11 items-center justify-center rounded-xl border border-[#c7a57f] bg-[#d8b98f] px-4 py-2.5 text-center text-sm font-bold text-[#3f3024] shadow-[0_7px_16px_rgba(116,83,49,.14)] transition hover:bg-[#cfab7d] sm:mt-4 sm:min-h-12 sm:px-5 sm:py-3"
              >
                ✨ Βρες το δωμάτιό σου με το AI Room Finder
              </a>
              <a
                href={DIRECT_BOOKING_HREF}
                className="mt-1.5 flex min-h-11 items-center justify-center rounded-xl border border-[#cfb79a] bg-white px-4 py-2 text-center text-sm font-semibold text-[#725235] transition hover:bg-[#fffaf4] sm:mt-2 sm:py-2.5"
              >
                Δες άμεσα διαθεσιμότητα
              </a>

              {wantsStayOffer ? (
                <div className="mt-2 rounded-xl border border-[#e0d1bf] bg-[#fbf6ef] px-3 py-1.5 text-[10px] leading-4 text-[#705b47] sm:mt-3 sm:py-2.5 sm:text-xs">
                  <strong className="text-[#4b3828]">✓ Ζήτησες προσωπική πρόταση διαμονής.</strong>{" "}
                  Η reception μπορεί να επικοινωνήσει στο {email}.
                </div>
              ) : (
                <p className="mt-2 text-[10px] leading-4 text-[#8a7764] sm:mt-3 sm:text-xs">
                  Δεν έχει ζητηθεί επικοινωνία από τη reception. Μπορείς να χρησιμοποιήσεις κανονικά το AI Room Finder.
                </p>
              )}

              <button
                type="button"
                onClick={onClose}
                className="mt-1.5 min-h-9 rounded-xl text-[11px] font-semibold text-[#7a6652] underline decoration-[#cbb79f] underline-offset-4 sm:mt-3 sm:min-h-10 sm:text-xs"
              >
                Επιστροφή στο πρόγραμμά μου
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:grid md:h-full md:grid-cols-[46%_54%]">
            <GalleryPanel selected={selectedGallery} onSelect={setSelectedGallery} />

            <form onSubmit={submit} className="flex flex-col bg-[#fffdf9] px-4 py-2.5 sm:px-6 sm:py-4 md:min-h-0 md:justify-center md:px-7 md:py-5">
              <div className="pr-11">
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#a48565] sm:text-[9px]">Ολοκλήρωση</p>
                <h3 className="mt-1 font-serif text-[21px] leading-[1.04] text-[#35291f] sm:text-[25px] md:text-[28px] md:leading-[1.08]">
                  Πάρε το προσωπικό σου Chios Trip Plan
                </h3>
                <p className="mt-1 text-[10px] leading-[15px] text-[#7b6a59] sm:mt-1.5 sm:text-xs sm:leading-5 md:text-sm">
                  Οι επιλογές σου οργανωμένες ανά ημέρα, έτοιμες για το ταξίδι.
                </p>
              </div>

              <div className="mt-2 rounded-xl border border-[#e8ddcf] bg-[#fbf7f1] px-3 py-1.5 sm:mt-3 sm:py-2.5">
                <div className="flex items-center justify-between gap-3 text-[11px] sm:text-xs md:text-sm">
                  <span className="text-[#746659]">Το πρόγραμμά σου</span>
                  <strong className="text-[#44362a]">{totalStops} στάσεις · 3 ημέρες</strong>
                </div>
                <div className="mt-1 grid grid-cols-3 gap-1 text-center text-[9px] text-[#7e6b59] sm:mt-2 sm:gap-1.5 sm:text-[10px] md:text-[11px]">
                  {days.map((day, index) => (
                    <div key={index} className="rounded-lg bg-white px-2 py-1 sm:py-1.5">
                      <strong className="block text-[11px] text-[#49392c] sm:text-xs md:text-sm">{day.length}</strong>
                      Ημέρα {index + 1}
                    </div>
                  ))}
                </div>
              </div>

              <label className="mt-2 block text-[11px] font-semibold text-[#4a3c31] sm:mt-3 sm:text-xs md:text-sm" htmlFor="trip-planner-email">
                Πού να σου στείλουμε το πρόγραμμα;
              </label>
              <input
                id="trip-planner-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="mt-1 min-h-11 w-full rounded-xl border border-[#d9c9b7] bg-white px-3.5 text-sm outline-none transition focus:border-[#9f7d59] focus:ring-2 focus:ring-[#d8c4ab]/50 sm:mt-1.5 sm:min-h-12 sm:text-base"
              />

              <input
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              <label className="mt-2 flex cursor-pointer items-start gap-2.5 rounded-xl border border-[#d5bea0] bg-[#f7ecdd] px-3 py-1.5 shadow-sm transition hover:border-[#b8956d] sm:mt-3 sm:py-2.5">
                <input
                  type="checkbox"
                  checked={wantsStayOffer}
                  onChange={(event) => setWantsStayOffer(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#8f6f4f]"
                />
                <span>
                  <strong className="block text-[11px] text-[#4b392a] sm:text-xs md:text-sm">Θέλω προσωπική πρόταση διαμονής</strong>
                  <span className="mt-0.5 block text-[9px] leading-3.5 text-[#806d5b] sm:text-[10px] sm:leading-4 md:text-[11px]">
                    Η reception μπορεί να μου στείλει διαθεσιμότητα και επιλογές που ταιριάζουν στο ταξίδι μου.
                  </span>
                </span>
              </label>

              <p className="mt-1 text-[9px] leading-3.5 text-[#7d6a58] sm:mt-2 sm:text-[10px] sm:leading-4 md:text-[11px]">
                Μετά την αποστολή συνεχίζεις, αν θέλεις, στο <strong>AI Room Finder</strong>.
              </p>

              {status === "error" && <p className="mt-1 text-[11px] text-[#a44e43] sm:mt-2 sm:text-xs">{error}</p>}

              <button
                type="submit"
                disabled={status === "sending" || totalStops === 0}
                className="mt-2 flex min-h-11 w-full items-center justify-center rounded-xl border border-[#c7a57f] bg-[#d8b98f] px-4 py-2.5 text-sm font-bold text-[#3f3024] shadow-[0_7px_16px_rgba(116,83,49,.14)] transition hover:bg-[#cfab7d] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-3 sm:min-h-12 sm:px-5 sm:py-3"
              >
                {status === "sending" ? "Αποστολή…" : "Στείλε το πρόγραμμά μου & συνέχισε →"}
              </button>

              <p className="mt-1 text-center text-[8px] leading-3 text-[#9b8b7c] sm:mt-2 sm:text-[9px] sm:leading-3.5 md:text-[10px]">
                Το email χρησιμοποιείται για την αποστολή του itinerary. Η reception επικοινωνεί μόνο αν αφήσεις ενεργή την επιλογή διαμονής.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

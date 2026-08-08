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
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2b2118]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Ολοκλήρωση Trip Planner">
      <button type="button" aria-label="Κλείσιμο" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div className="relative z-10 w-full max-w-xl rounded-t-[28px] border border-[#e5d8c8] bg-[#fffdf9] p-5 shadow-2xl sm:rounded-[28px] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a48565]">Ολοκλήρωση</p>
            <h2 className="mt-1 font-serif text-3xl text-[#35291f]">Πάρε το πρόγραμμά σου στο email</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-[#e7dbcc] bg-white px-3 py-2 text-sm text-[#776758]">✕</button>
        </div>

        {status === "success" ? (
          <div className="mt-6">
            <div className="rounded-2xl border border-[#cedcc8] bg-[#f3f8f0] p-5 text-[#4f6749]">
              <p className="font-semibold">✓ Το πρόγραμμα στάλθηκε στο {email}</p>
              <p className="mt-2 text-sm leading-6">Θα βρεις μέσα τις επιλογές σου ανά ημέρα και link για να δεις τη διαμονή στο Voulamandis House.</p>
            </div>
            {wantsStayOffer && (
              <div className="mt-4 rounded-2xl border border-[#e5d6c3] bg-[#f8efe4] p-5">
                <p className="font-serif text-xl text-[#493729]">Θα σε βοηθήσουμε και με τη διαμονή</p>
                <p className="mt-1 text-sm leading-6 text-[#776452]">Το ενδιαφέρον σου στάλθηκε στη reception ώστε να μπορεί να σου προτείνει διαμονή που ταιριάζει στο ταξίδι σου.</p>
                <a href="/el/amesi-kratisi-voulamandis-house/" className="mt-4 inline-flex rounded-xl bg-[#8f6f4f] px-4 py-2.5 text-sm font-semibold text-white">Δες άμεσα διαθεσιμότητα</a>
              </div>
            )}
            <button type="button" onClick={onClose} className="mt-5 w-full rounded-xl border border-[#dacbb9] bg-white py-3 text-sm font-semibold text-[#695641]">Επιστροφή στο πρόγραμμα</button>
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

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#e4d5c3] bg-[#faf3ea] p-4">
              <input type="checkbox" checked={wantsStayOffer} onChange={(event) => setWantsStayOffer(event.target.checked)} className="mt-1 h-4 w-4 accent-[#8f6f4f]" />
              <span>
                <strong className="block text-sm text-[#4b392a]">Θέλω πρόταση διαμονής στο Voulamandis House</strong>
                <span className="mt-1 block text-xs leading-5 text-[#806d5b]">Η reception μπορεί να επικοινωνήσει μαζί μου στο παραπάνω email για διαθεσιμότητα και απευθείας κράτηση.</span>
              </span>
            </label>

            {status === "error" && <p className="mt-3 text-sm text-[#a44e43]">{error}</p>}

            <button type="submit" disabled={status === "sending" || totalStops === 0} className="mt-5 flex min-h-13 w-full items-center justify-center rounded-xl bg-[#8f6f4f] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(88,61,36,.16)] transition hover:bg-[#76583c] disabled:cursor-not-allowed disabled:opacity-50">
              {status === "sending" ? "Αποστολή…" : "Στείλε μου το πρόγραμμά μου"}
            </button>
            <p className="mt-3 text-center text-[11px] leading-5 text-[#9b8b7c]">Χρησιμοποιούμε το email σου για να σου στείλουμε το itinerary. Επικοινωνία για διαμονή γίνεται μόνο αν κρατήσεις ενεργή την παραπάνω επιλογή.</p>
          </form>
        )}
      </div>
    </div>
  );
}

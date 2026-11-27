"use client";

import { useState } from "react";
import { OFFER_ROOMS, defaultOfferCode } from "@/lib/pyrgos/offer-types";
import { roomByNumber } from "@/lib/pyrgos/rooms";

// Προσφορά δωματίου από το πλάνο (owner, 2026-11-27): shows on the deals pages with a WhatsApp button.

export type OfferDraft = {
  id?: number;
  room: number;
  from: string;
  to: string;
  discount: number;
  code: string;
  active: boolean;
};

const DISCOUNTS = [10, 15, 20, 25];
const input = "mt-1 w-full rounded-lg border border-[#cfd9e4] bg-white px-3 py-2.5 text-base font-normal";
const nightsBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000);

export default function OfferDialog({
  initial,
  onClose,
  onSaved,
  isBusy,
}: {
  initial: OfferDraft;
  onClose: () => void;
  onSaved: (text: string) => void;
  /** True when the room already has a booking on some of these nights (from the loaded plan). */
  isBusy: (room: number, from: string, to: string) => boolean;
}) {
  const [f, setF] = useState<OfferDraft>(initial);
  // The code follows the discount (DEAL10, DEAL15…) until the owner types his own.
  const [ownCode, setOwnCode] = useState(Boolean(initial.id) && initial.code !== defaultOfferCode(initial.discount));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const editing = Boolean(f.id);
  const nights = f.from && f.to ? nightsBetween(f.from, f.to) : 0;
  const conflict = nights > 0 && isBusy(f.room, f.from, f.to);

  async function send(body: Record<string, unknown>, done: string) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/staff/pyrgos/offers/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    const json = res ? await res.json().catch(() => ({ ok: false })) : { ok: false, error: "Σφάλμα σύνδεσης." };
    setBusy(false);
    if (!json.ok) {
      setError(json.error || "Η αποθήκευση απέτυχε.");
      return;
    }
    onSaved(done);
  }

  const setDiscount = (discount: number) =>
    setF((v) => ({ ...v, discount, code: ownCode ? v.code : defaultOfferCode(discount) }));

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="offer-dialog-title">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#b45309]">Σελίδα προσφορών · WhatsApp</p>
            <h2 id="offer-dialog-title" className="text-xl font-black">{editing ? "Προσφορά δωματίου" : "Νέα προσφορά δωματίου"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Κλείσιμο" className="h-10 w-10 shrink-0 rounded-full bg-[#f4f7fa] text-xl">×</button>
        </div>

        <div className="mt-4 space-y-4 text-sm font-semibold">
          <label className="block">
            Δωμάτιο
            <select className={input} value={f.room} onChange={(e) => setF((v) => ({ ...v, room: Number(e.target.value) }))}>
              {OFFER_ROOMS.map((n) => (
                <option key={n} value={n}>
                  {roomByNumber(n)?.label} · {roomByNumber(n)?.categoryLabel}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              Άφιξη
              <input type="date" className={input} value={f.from} onChange={(e) => setF((v) => ({ ...v, from: e.target.value }))} />
            </label>
            <label className="block">
              Αναχώρηση
              <input type="date" className={input} value={f.to} min={f.from} onChange={(e) => setF((v) => ({ ...v, to: e.target.value }))} />
            </label>
          </div>
          {nights > 0 && <p className="-mt-2 text-xs text-[#5b6b80]">{nights} {nights === 1 ? "νύχτα" : "νύχτες"}</p>}

          <fieldset>
            <legend>Έκπτωση</legend>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {DISCOUNTS.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={f.discount === d}
                  onClick={() => setDiscount(d)}
                  className={`h-10 rounded-full border px-4 font-bold ${f.discount === d ? "border-[#5443c9] bg-[#ece9fd] text-[#3b2f8a]" : "border-[#dbe3ec]"}`}
                >
                  {d}%
                </button>
              ))}
              <label className="flex items-center gap-1">
                <span className="sr-only">Άλλο ποσοστό</span>
                <input
                  type="number"
                  min={1}
                  max={70}
                  value={f.discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="h-10 w-20 rounded-lg border border-[#cfd9e4] px-2 text-base font-normal"
                />
                %
              </label>
            </div>
          </fieldset>

          <label className="block">
            Κωδικός
            <input
              className={`${input} uppercase tracking-wider`}
              value={f.code}
              onChange={(e) => {
                setOwnCode(true);
                setF((v) => ({ ...v, code: e.target.value.toUpperCase() }));
              }}
            />
          </label>

          {editing && (
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={f.active} onChange={(e) => setF((v) => ({ ...v, active: e.target.checked }))} className="h-5 w-5" />
              Φαίνεται στο site
            </label>
          )}

          <p className="rounded-xl bg-[#f4f7fa] px-3 py-2 text-xs font-normal leading-5 text-[#3d4b5e]">
            Βγαίνει στη σελίδα Προσφορών (σε όλες τις γλώσσες) με κουμπί WhatsApp. Φεύγει μόνη της όταν κλειστεί κάποια νύχτα του δωματίου ή όταν περάσουν οι μέρες.
          </p>
          {conflict && (
            <p className="rounded-xl bg-[#fff4dc] px-3 py-2 text-xs text-[#92400e]">
              Το δωμάτιο έχει ήδη κράτηση κάποια από αυτές τις νύχτες, οπότε η προσφορά δεν θα φαίνεται στο site.
            </p>
          )}
          {error && <p className="rounded-xl bg-[#fee2e2] px-3 py-2 text-xs text-[#991b1b]">{error}</p>}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          {editing ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => send({ action: "delete", id: f.id }, "Η προσφορά διαγράφηκε")}
              className="min-h-11 rounded-full px-4 text-sm font-bold text-[#991b1b] hover:bg-[#fee2e2]"
            >
              Διαγραφή
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} disabled={busy} className="min-h-11 rounded-full px-4 text-sm font-bold text-[#4b5b70]">Άκυρο</button>
            <button
              type="button"
              disabled={busy || nights < 1}
              onClick={() => send({ action: editing ? "update" : "add", ...f }, editing ? "Η προσφορά άλλαξε · site ✓" : "Η προσφορά μπήκε στο site ✓")}
              className="min-h-11 rounded-full bg-[#5443c9] px-5 text-sm font-bold text-white disabled:opacity-50"
            >
              {busy ? "Αποθήκευση…" : editing ? "Αποθήκευση" : "Βάλε την στο site"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

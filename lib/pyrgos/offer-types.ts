// Room offers declared from the booking plan (Πλάνο κρατήσεων), owner 2026-11-27.
// Shared by the staff plan (client) and the server; no server-only imports here.

export type PlanOffer = {
  id: number;
  room: number;
  /** First night (YYYY-MM-DD). */
  from: string;
  /** Check-out day (YYYY-MM-DD), the night before is the last one on offer. */
  to: string;
  /** Discount in percent (e.g. 10). */
  discount: number;
  code: string;
  active: boolean;
  /** Some night of the offer is now booked: it no longer shows on the website. */
  booked: boolean;
};

/** Rooms that may carry a public offer: 1–10 (Apt 11 is never sold online). */
export const OFFER_ROOMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const defaultOfferCode = (discount: number) => `DEAL${discount}`;

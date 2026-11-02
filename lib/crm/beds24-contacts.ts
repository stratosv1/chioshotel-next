import "server-only";
import type { BookingContactUpdate } from "@/lib/crm/store";

// One-off staff backfill. Kept apart from lib/beds24/api-v2-booking.ts, which
// must stay a per-booking lookup with no date-range scanning.

const text = (value: unknown) => String(value ?? "").trim();

export function guestCountry(booking: Record<string, unknown> | null | undefined) {
  const code = text(booking?.country2);
  if (/^[a-z]{2}$/i.test(code)) return code.toUpperCase();
  const country = text(booking?.country);
  if (!country) return null;
  return /^[a-z]{2}$/i.test(country) ? country.toUpperCase() : country;
}

export function guestPhone(booking: Record<string, unknown> | null | undefined) {
  return text(booking?.mobile) || text(booking?.phone) || null;
}

export function guestLanguage(booking: Record<string, unknown> | null | undefined) {
  const value = text(booking?.lang) || text(booking?.guestLanguage) || text(booking?.language);
  return value ? value.slice(0, 2).toLowerCase() : null;
}

export class Beds24RateLimitError extends Error {}

function lastDayOfMonth(month: string) {
  const [year, mon] = month.split("-").map(Number);
  return new Date(Date.UTC(year, mon, 0)).toISOString().slice(0, 10);
}

export async function fetchMonthContacts(month: string) {
  const token = process.env.BEDS24_API_TOKEN?.trim();
  if (!token) throw new Error("BEDS24_API_TOKEN is not configured.");

  const first = new URL("https://api.beds24.com/v2/bookings");
  first.searchParams.set("arrivalFrom", `${month}-01`);
  first.searchParams.set("arrivalTo", lastDayOfMonth(month));

  const updates: BookingContactUpdate[] = [];
  const contactFields = new Set<string>();
  let url: string | null = first.toString();
  let pages = 0;

  while (url && pages < 10) {
    const response: Response = await fetch(url, {
      headers: { accept: "application/json", token },
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    if (response.status === 429) throw new Beds24RateLimitError("rate_limited");
    if (!response.ok) throw new Error(`Beds24 HTTP ${response.status}`);
    const payload = (await response.json()) as any;
    for (const booking of Array.isArray(payload?.data) ? payload.data : []) {
      // Field names only, never values: shows what Beds24 really returns.
      for (const key of Object.keys(booking)) {
        if (/countr|lang|phone|mobile/i.test(key) && text(booking[key])) contactFields.add(key);
      }
      updates.push({
        id: text(booking.id),
        country: guestCountry(booking),
        phone: guestPhone(booking),
        language: guestLanguage(booking),
      });
    }
    const next = text(payload?.pages?.nextPageLink);
    url = payload?.pages?.nextPageExists && next.startsWith("https://api.beds24.com/") ? next : null;
    pages += 1;
  }
  return { updates, contactFields: [...contactFields] };
}

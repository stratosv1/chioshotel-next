import "server-only";

export type Beds24ApiV2Booking = {
  id?: string | number;
  status?: string | number;
  arrival?: string;
  departure?: string;
  checkIn?: string;
  checkOut?: string;
  roomId?: string | number;
  unitId?: string | number;
  propertyId?: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  guestEmail?: string;
  numAdult?: string | number;
  numChild?: string | number;
  price?: string | number;
  totalPrice?: string | number;
  apiSourceId?: string | number;
  [key: string]: unknown;
};

export type Beds24ApiV2BookingLookup = {
  attempted: boolean;
  ok: boolean;
  reason: string | null;
  booking: Beds24ApiV2Booking | null;
};

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function getBookingArray(payload: unknown): Beds24ApiV2Booking[] {
  if (Array.isArray(payload)) return payload as Beds24ApiV2Booking[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.data)) return record.data as Beds24ApiV2Booking[];
  if (Array.isArray(record.bookings)) return record.bookings as Beds24ApiV2Booking[];
  return [];
}

export async function fetchBeds24BookingById(
  bookingIdInput: string,
): Promise<Beds24ApiV2BookingLookup> {
  const bookingId = clean(bookingIdInput);
  if (!bookingId) {
    return { attempted: false, ok: false, reason: "missing_booking_id", booking: null };
  }

  const token = process.env.BEDS24_API_TOKEN?.trim();
  if (!token) {
    return { attempted: false, ok: false, reason: "missing_api_token", booking: null };
  }

  const url = new URL("https://api.beds24.com/v2/bookings");
  url.searchParams.set("id", bookingId);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        token,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      return {
        attempted: true,
        ok: false,
        reason: `beds24_http_${response.status}`,
        booking: null,
      };
    }

    const payload = (await response.json()) as unknown;
    const bookings = getBookingArray(payload);
    const booking =
      bookings.find((item) => clean(item?.id) === bookingId) ?? bookings[0] ?? null;

    if (!booking) {
      return { attempted: true, ok: false, reason: "booking_not_found", booking: null };
    }

    return { attempted: true, ok: true, reason: null, booking };
  } catch (error) {
    const message = error instanceof Error ? error.name : "lookup_failed";
    return {
      attempted: true,
      ok: false,
      reason: `beds24_${clean(message).toLowerCase() || "lookup_failed"}`,
      booking: null,
    };
  }
}

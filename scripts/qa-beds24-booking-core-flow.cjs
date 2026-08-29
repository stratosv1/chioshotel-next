const fs = require('fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function requireText(source, text, message) {
  if (!source.includes(text)) throw new Error(message || `Missing required text: ${text}`);
}

function forbidText(source, text, message) {
  if (source.includes(text)) throw new Error(message || `Forbidden text found: ${text}`);
}

const webhook = read('app/api/beds24/booking/route.ts');
const apiV2 = read('lib/beds24/api-v2-booking.ts');
const reconcile = read('lib/booking-core/reconcile-booking-event.ts');

forbidText(
  webhook,
  'CREATE TABLE IF NOT EXISTS beds24_bookings',
  'Beds24 webhook must not run schema DDL on every event.',
);
requireText(webhook, 'room_id?: string;', 'Webhook payload must keep exact Beds24 room_id fallback support.');
requireText(webhook, 'unit_id?: string;', 'Webhook payload must keep exact Beds24 unit_id fallback support.');
requireText(webhook, 'fetchBeds24BookingById(bookingId)', 'Webhook must enrich each event from Beds24 API v2 by booking ID.');
requireText(webhook, 'resolveBookingPayload(body, apiLookup)', 'Webhook must reconcile from authoritative API-enriched fields.');
requireText(webhook, 'reconcileBookingCoreBookingEvent', 'Webhook must call targeted Booking Core reconciliation.');
requireText(webhook, 'COALESCE(EXCLUDED.status, public.beds24_bookings.status)', 'Webhook must preserve existing fields when incoming values are empty.');
requireText(webhook, 'IS DISTINCT FROM ROW', 'Webhook UPSERT must avoid needless updates when data is unchanged.');
requireText(webhook, 'BOOKING_CORE_DEALS_CACHE_TAG', 'Booking Core cache must be invalidated after targeted writes.');
requireText(webhook, 'isBeds24CancellationStatus(webhookStatus)', 'Webhook cancellation status must win over a potentially lagging API lookup.');

requireText(apiV2, 'process.env.BEDS24_API_TOKEN', 'Beds24 API v2 lookup must use a server-only environment token.');
requireText(apiV2, 'https://api.beds24.com/v2/bookings', 'Beds24 API v2 lookup must use the bookings endpoint.');
requireText(apiV2, 'url.searchParams.set("id", bookingId)', 'Beds24 API lookup must request only the changed booking ID.');
requireText(apiV2, 'cache: "no-store"', 'Beds24 booking lookup must not cache event data.');
requireText(apiV2, 'AbortSignal.timeout(8_000)', 'Beds24 booking lookup must be bounded by a timeout.');
forbidText(apiV2, 'arrivalFrom', 'Per-event Beds24 API lookup must not scan a date range.');
forbidText(apiV2, 'arrivalTo', 'Per-event Beds24 API lookup must not scan a date range.');

requireText(reconcile, 'where booking_id = ${bookingId}', 'Cancellation must target rows by booking_id.');
requireText(reconcile, "then 'PRICE_OK'", 'Cancellation must restore priced nights to PRICE_OK.');
requireText(reconcile, "else 'CLOSED'", 'Cancellation must keep nights without a base price CLOSED.');
requireText(reconcile, 'inventory.booking_id = ${bookingId}', 'Room/date changes must release only rows owned by the same booking.');
requireText(reconcile, 'booking_id <> ${bookingId}', 'Target rows owned by another booking must be treated as conflicts.');
requireText(reconcile, "upper(coalesce(reason, '')) = 'BOOKED'", 'Ambiguous BOOKED rows without booking_id must be blocked.');
requireText(reconcile, 'coverageRows === expectedNights', 'Target date range must be complete before applying an event.');
requireText(reconcile, "'bookingId', ${bookingId}::text", 'JSONB bookingId parameter must be explicitly typed for PostgreSQL polymorphic functions.');
forbidText(reconcile, 'insert into booking_core.inventory', 'Incremental booking events must never create inventory rows outside the canonical snapshot.');

console.log('Beds24 → Booking Core incremental flow QA passed.');

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
const reconcile = read('lib/booking-core/reconcile-booking-event.ts');

forbidText(
  webhook,
  'CREATE TABLE IF NOT EXISTS beds24_bookings',
  'Beds24 webhook must not run schema DDL on every event.',
);
requireText(webhook, 'room_id?: string;', 'Webhook payload must accept exact Beds24 room_id.');
requireText(webhook, 'unit_id?: string;', 'Webhook payload must accept exact Beds24 unit_id.');
requireText(webhook, 'reconcileBookingCoreBookingEvent', 'Webhook must call targeted Booking Core reconciliation.');
requireText(webhook, 'COALESCE(EXCLUDED.status, public.beds24_bookings.status)', 'Webhook must preserve existing fields when Beds24 macros are empty.');
requireText(webhook, 'IS DISTINCT FROM ROW', 'Webhook UPSERT must avoid needless updates when data is unchanged.');
requireText(webhook, 'BOOKING_CORE_DEALS_CACHE_TAG', 'Booking Core cache must be invalidated after targeted writes.');

requireText(reconcile, 'where booking_id = ${bookingId}', 'Cancellation must target rows by booking_id.');
requireText(reconcile, "then 'PRICE_OK'", 'Cancellation must restore priced nights to PRICE_OK.');
requireText(reconcile, "else 'CLOSED'", 'Cancellation must keep nights without a base price CLOSED.');
requireText(reconcile, 'inventory.booking_id = ${bookingId}', 'Room/date changes must release only rows owned by the same booking.');
requireText(reconcile, 'booking_id <> ${bookingId}', 'Target rows owned by another booking must be treated as conflicts.');
requireText(reconcile, "upper(coalesce(reason, '')) = 'BOOKED'", 'Ambiguous BOOKED rows without booking_id must be blocked.');
requireText(reconcile, 'coverageRows === expectedNights', 'Target date range must be complete before applying an event.');
forbidText(reconcile, 'insert into booking_core.inventory', 'Incremental booking events must never create inventory rows outside the canonical snapshot.');

console.log('Beds24 → Booking Core incremental flow QA passed.');

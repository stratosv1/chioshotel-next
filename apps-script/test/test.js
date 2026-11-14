// Τοπικό test του Apps Script με ψεύτικες υπηρεσίες Google: node apps-script/test/test.js [path/to/Code.js]
const assert = require('assert');
const H = require('./harness.js');
const { ctx, props, sheets, pushes, T } = H;
const get = q => ctx.doGet({ parameter: q }).json();
const post = b => ctx.doPost({ parameter: {}, postData: { contents: JSON.stringify(b) } }).json();

// Neon replace_inventory_snapshot + route parser rules
function neonValidate(p) {
  assert.strictEqual(p.ok, true); assert.strictEqual(p.success, true); assert.strictEqual(p.type, 'booking_core_snapshot');
  assert.strictEqual(p.schemaVersion, 1); assert.strictEqual(p.source, 'google_sheet_availability'); assert.strictEqual(p.refreshState, 'READY');
  assert.strictEqual(p.count, p.rows.length);
  const active = ['267788|1','268803|1','267788|2','267788|3','626129|1','268803|2','626129|2','265595|1','265595|2','265595|3','345347|1'];
  const rows = p.rows.filter(r => active.includes(r.roomId + '|' + r.unitId));
  const dates = [...new Set(rows.map(r => r.date))].sort();
  const span = (new Date(dates[dates.length - 1]) - new Date(dates[0])) / 864e5 + 1;
  assert.strictEqual(dates.length, span, 'gaps'); assert.strictEqual(rows.length, 11 * dates.length, 'not rectangular');
  for (const r of p.rows) {
    assert(['PRICE_OK', 'BOOKED', 'CLOSED'].includes(r.reason), r.reason);
    assert.strictEqual(typeof r.available, 'boolean');
    if (r.available) { assert.strictEqual(r.reason, 'PRICE_OK'); assert(r.price > 0); } else assert.notStrictEqual(r.reason, 'PRICE_OK');
    if (r.reason !== 'BOOKED') assert(!r.bookingId);
  }
  return { rows, dates };
}

// 1. first refresh: writes sheets, pushes
assert.strictEqual(ctx.refreshSystem(), true);
assert.strictEqual(props.BOOKING_CORE_REFRESH_STATE, 'READY');
assert.strictEqual(pushes.length, 1);
const { rows, dates } = neonValidate(pushes[0]);
assert.strictEqual(dates[0], T(-70), 'CSV dates extend the window');  // csv starts at -70
assert.strictEqual(dates[dates.length - 1], T(540));
const at = (d, room, unit) => rows.find(r => r.date === d && r.roomId === room && r.unitId === unit);
assert.strictEqual(at(T(0), '267788', '1').reason, 'BOOKED');
assert.strictEqual(at(T(0), '267788', '1').bookingId, '1');
assert.strictEqual(at(T(2), '267788', '1').reason, 'PRICE_OK');          // departure day free
assert.strictEqual(at(T(2), '267788', '1').price, 80);                    // API price
assert.strictEqual(at(T(-5), '267788', '2').price, 70);                   // past = CSV
assert.strictEqual(at(T(2), '626129', '1').price, 65);                    // derived 80-15
assert.strictEqual(at(T(20), '626129', '1').price, 70);                   // derived 85-15
assert.strictEqual(at(T(3), '268803', '2').reason, 'PRICE_OK');           // cancelled ignored
assert.strictEqual(at(T(3), '265595', '3').reason, 'PRICE_OK');           // inquiry ignored
assert.strictEqual(at(T(10), '268803', '1').reason, 'CLOSED');            // numAvail 0
assert.strictEqual(at(T(10), '268803', '1').price, 60);                   // reference price kept
assert.strictEqual(at(T(2), '345347', '1').reason, 'BOOKED');
assert.strictEqual(at(T(300), '345347', '1').price, 90);                  // fixed
const avail = sheets.Availability.getDataRange().getValues();
const evil = avail.find(r => r[15] === 1 || r[15] === '1');
assert.strictEqual(evil[17], '=EVIL Guest'.replace(/^/, '') , 'sheets strip the leading quote');
assert.strictEqual(evil[21], 'a@b.gr'); assert.strictEqual(evil[22], '+30 6900000000');
const writes1 = sheets.Availability.writes;

// 2. second refresh: nothing changed → no sheet writes, no push
assert.strictEqual(ctx.refreshSystem(), true);
assert.strictEqual(sheets.Availability.writes, writes1, 'sheets rewritten although unchanged');
assert.strictEqual(pushes.length, 1, 'pushed although unchanged');

// 3. pull snapshot == pushed rows (same fingerprint path from the sheet)
const snap = get({ action: 'booking_core_snapshot' });
neonValidate(snap);
assert.strictEqual(ctx.computeBookingCoreFingerprint_(snap.rows), ctx.computeBookingCoreFingerprint_(pushes[0].rows), 'pull vs push differ');
assert.strictEqual(snap.dataUpdatedAt, pushes[0].dataUpdatedAt);

// 4. snapshot secret
props.BOOKING_CORE_SNAPSHOT_SECRET = 's3';
assert.strictEqual(get({ action: 'booking_core_snapshot' }).code, 'UNAUTHORIZED');
assert.strictEqual(get({ action: 'booking_core_snapshot', secret: 's3' }).ok, true);
delete props.BOOKING_CORE_SNAPSHOT_SECRET;

// 5. lock busy
H.setLock(true); assert.strictEqual(get({ action: 'booking_core_snapshot' }).code, 'SOURCE_BUSY'); assert.strictEqual(ctx.refreshSystem(), false); H.setLock(false);

// 6. stuck UPDATING → self-heal
props.BOOKING_CORE_REFRESH_STATE = 'UPDATING';
const healed = get({ action: 'booking_core_snapshot' });
assert.strictEqual(healed.code, 'SOURCE_REFRESH_ERROR'); assert.strictEqual(healed.selfHealRefreshScheduled, true);
assert(H.triggers.some(t => t.h === 'runBeds24WebhookRefresh'));
assert.strictEqual(get({ action: 'booking_core_snapshot' }).selfHealRefreshScheduled, false, 'throttled');
ctx.runBeds24WebhookRefresh();
assert.strictEqual(props.BOOKING_CORE_REFRESH_STATE, 'READY');
assert(!H.triggers.some(t => t.h === 'runBeds24WebhookRefresh'));

// 7. API failure → CSV fallback (prices only to +30) → still valid
H.calendarApiFails = true;
assert.strictEqual(ctx.refreshSystem(), true);
assert.strictEqual(pushes.length, 2);
const fb = neonValidate(pushes[1]);
const fbAt = (d, room, unit) => fb.rows.find(r => r.date === d && r.roomId === room && r.unitId === unit);
assert.strictEqual(fbAt(T(5), '267788', '2').price, 70);
assert.strictEqual(fbAt(T(100), '267788', '2').reason, 'CLOSED');
assert.strictEqual(fbAt(T(100), '345347', '1').reason, 'CLOSED', 'apt11 only within priced dates');
H.calendarApiFails = false;
ctx.refreshSystem();

// 8. no prices at all → ERROR, sheets untouched (the old guard never fired)
const savedFolder = ctx.DriveApp.getFoldersByName;
ctx.DriveApp.getFoldersByName = () => ({ hasNext: () => false });
H.calendarApiFails = true;
const pushesBefore = pushes.length, w = sheets.Availability.writes;
assert.throws(() => ctx.refreshSystem(), /Δεν βρέθηκαν τιμές/);
assert.strictEqual(props.BOOKING_CORE_REFRESH_STATE, 'ERROR');
assert.strictEqual(sheets.Availability.writes, w); assert.strictEqual(pushes.length, pushesBefore);
ctx.DriveApp.getFoldersByName = savedFolder; H.calendarApiFails = false;
ctx.refreshSystem(); assert.strictEqual(props.BOOKING_CORE_REFRESH_STATE, 'READY');

// 9. deals family (lazy + cached)
const deals = get({ action: 'deals' });
assert.strictEqual(deals.ok, true); assert.strictEqual(deals.source, 'LIVE'); assert.strictEqual(deals.days.length, 7);
assert.strictEqual(deals.rooms.length, 11); assert.strictEqual(deals.rooms[0].roomId, 267788);
assert.deepStrictEqual(deals.days[0].results['267788_1'], { available: false, totalPrice: 0 });   // T1 booked
assert.deepStrictEqual(deals.days[1].results['267788_1'], { available: true, totalPrice: 80 });   // T2 free
assert.strictEqual(get({ action: 'cachedDeals' }).source, 'CACHE');
const lm = post({ action: 'get_last_minute_cache', people: 3 });
assert.strictEqual(lm.rooms.length, 9); assert.strictEqual(lm.rooms[0].name, 'Δωμάτιο 1');
const d2 = lm.rooms[0].days[1]; assert.strictEqual(d2.originalPrice, 80); assert.strictEqual(d2.dealPrice, 68);
assert.strictEqual(post({ action: 'refresh_last_minute_cache', people: 3 }).success, true);
const tk = get({ action: 'turkish_deals', people: '2' });
assert.strictEqual(tk.ok, true); assert.ok(tk.data.weekends.length > 40); assert.strictEqual(tk.data.holidays['29-ekim'].days.length, 4);
assert.strictEqual(get({ action: 'turkish_deals', people: '2', holiday: '23-nisan' }).days.length, 4);
assert.strictEqual(get({ action: 'turkish_deals', people: '2' }).source, 'CACHE');
const av = post({ action: 'availability', checkin: T(2), checkout: T(4), units: [{ roomId: '267788', unitId: '1' }, { roomId: '345347', unitId: '1' }, { roomId: '1', unitId: '1' }] });
assert.strictEqual(av.results['267788_1'].totalPrice, 160); assert.strictEqual(av.results['345347_1'].reason, 'BOOKED'); assert.strictEqual(av.results['1_1'].reason, 'UNIT_NOT_FOUND');

// 10. bookings endpoint: no PII without key
const pub = get({ action: 'bookings' });
assert(pub.count > 0); assert.strictEqual(pub.data[0].guest, undefined); assert.strictEqual(pub.data[0].email, undefined); assert.strictEqual(pub.guestDetails, false);
const priv = get({ action: 'bookings', key: 'STAFFKEY' });
assert.strictEqual(priv.guestDetails, true); assert.ok(priv.data.some(r => r.email === 'a@b.gr'));

// 11. occupancy endpoints
const os = get({ action: 'occupancy_snapshot' }); assert.strictEqual(os.count, os.rows.length); assert.ok(os.data);
assert.ok(get({ action: 'occupancy_prices' }).count > 0);

// 12. housekeeping (dates become Date objects in the sheet)
const stay = post({ action: 'hk_add_stay', room: '5', checkIn: T(1), checkOut: T(3) });
assert.strictEqual(stay.success, true);
const task = post({ action: 'hk_add_task', stayId: stay.stayId, room: 5, date: T(2), taskType: 'TOWELS' });
assert.strictEqual(post({ action: 'hk_add_task', stayId: stay.stayId, room: 5, date: T(2), taskType: 'TOWELS' }).duplicate, true);
const cal = post({ action: 'hk_calendar', room: 'all' });
assert.deepStrictEqual(cal.rooms[0].dates.map(d => d.date), [T(1), T(2), T(3)]);
assert.strictEqual(post({ action: 'hk_delete_task', taskId: task.taskId }).success, true);

// 13. webhook + health + triggers
assert.strictEqual(ctx.doPost({ parameter: { key: 'x' }, postData: { contents: '{"action":"SYNC_ROOM"}' } }).json().error, 'Unauthorized');
ctx.setupBeds24Webhook();
assert.strictEqual(ctx.doPost({ parameter: { key: props.BEDS24_WEBHOOK_KEY }, postData: { contents: '{"action":"SYNC_ROOM","roomId":1}' } }).json().scheduled, true);
ctx.runBeds24WebhookRefresh();
ctx.setupTriggers();
assert.deepStrictEqual(H.triggers.map(t => t.h), ['refreshSystem']);
const h = get({ action: 'booking_core_health' });
assert.strictEqual(h.ok, true); assert.strictEqual(h.refreshTriggerInstalled, true); assert.strictEqual(h.pushPending, false); assert.strictEqual(h.turkishConfigExpired, false);
assert.strictEqual(get({ action: 'chargeDebug', bookingId: '1' }).message, 'Web app is alive. Use POST actions or valid GET actions.');
console.log('ALL TESTS PASSED; pushes=' + pushes.length + ', rows/push=' + pushes[0].rows.length + ', payload KB=' + Math.round(JSON.stringify(pushes[0]).length / 1024));

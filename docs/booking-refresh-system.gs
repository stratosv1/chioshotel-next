/******************************************************************
 * Voulamandis House — Beds24 / availability / deals Apps Script.
 *
 * Source copy of the Google Apps Script bound to the booking
 * spreadsheet (SPREADSHEET_ID below). refreshSystem runs every 15
 * minutes and on Beds24 webhooks, rebuilds the Availability /
 * occupancy_calendar sheets and pushes Booking Core changes to
 * https://chioshotel.gr/api/booking-core/sync/.
 *
 * Secrets live only in Script Properties (beds24,
 * BOOKING_CORE_PUSH_SECRET, BEDS24_WEBHOOK_KEY), never in this file.
 ******************************************************************/

/******************************************************************
 * ΚΕΝΤΡΙΚΕΣ ΡΥΘΜΙΣΕΙΣ (GLOBALS) & CONSTANTS
 ******************************************************************/

// --- APP 1: HOMEPAGE DEALS GLOBALS ---
const SHEET_ID = '1Q4FRcDGWGbEeLJ7OBKGjuUFbGibj0989QzpwZs-MKCM';
const SHEET_NAME = 'occupancy_calendar';
const DISCOUNT = 0.15;
const ADULTS = 2;
const CACHE_KEY = 'LATEST_DEALS_JSON';
const DEALS_CACHE_TTL_MS = 15 * 60 * 1000;

// --- APP 2: BEDS24 / AVAILABILITY GLOBALS ---
const BOOKINGS_FETCH_DAYS_BACK = 60;
const BOOKINGS_FETCH_DAYS_AHEAD = 540;
const BOOKINGS_FETCH_CHUNK_DAYS = 30;
const FOLDER_NAME = 'Beds24_Prices_Uploads';
const PROPERTY_ID = '117813';
const SPREADSHEET_ID = '1Q4FRcDGWGbEeLJ7OBKGjuUFbGibj0989QzpwZs-MKCM';

// --- ΚΥΛΙΟΜΕΝΟ ΠΑΡΑΘΥΡΟ ΗΜΕΡΟΛΟΓΙΟΥ (Availability / occupancy_calendar / Neon) ---
// Οι ημερομηνίες δεν εξαρτώνται πλέον μόνο από το αρχείο τιμών:
// κάθε refresh βγάζει από σήμερα - DAYS_BACK έως σήμερα + DAYS_AHEAD.
// Μετά το τέλος του αρχείου τιμών οι μέρες είναι BOOKED (αν έχουν κράτηση) ή CLOSED.
const CALENDAR_ROLLING_DAYS_BACK = BOOKINGS_FETCH_DAYS_BACK;
const CALENDAR_ROLLING_DAYS_AHEAD = BOOKINGS_FETCH_DAYS_AHEAD;
const PRICE_CSV_WARNING_DAYS = 120;
const PRICE_CSV_LAST_DATE_PROPERTY = 'PRICE_CSV_LAST_DATE';

// --- LOCK / TRIGGER SAFETY ---
// Μικρό wait ώστε οι διπλές εκτελέσεις να κάνουν skip και όχι failure notification.
const LOCK_WAIT_MS = 1000;

// --- BOOKING CORE SOURCE CONTRACT ---
const BOOKING_CORE_SCHEMA_VERSION = 1;
const BOOKING_CORE_DATA_UPDATED_AT_PROPERTY = 'BOOKING_CORE_DATA_UPDATED_AT';
const BOOKING_CORE_REFRESH_STATE_PROPERTY = 'BOOKING_CORE_REFRESH_STATE';
const BOOKING_CORE_REFRESH_STARTED_AT_PROPERTY = 'BOOKING_CORE_REFRESH_STARTED_AT';
const BOOKING_CORE_REFRESH_ERROR_PROPERTY = 'BOOKING_CORE_REFRESH_ERROR';
const BOOKING_CORE_SNAPSHOT_LOCK_WAIT_MS = 3000;
const BOOKING_CORE_LAST_REFRESH_COMPLETED_AT_PROPERTY = 'BOOKING_CORE_LAST_REFRESH_COMPLETED_AT';
const BOOKING_CORE_LAST_OBSERVED_FINGERPRINT_PROPERTY = 'BOOKING_CORE_LAST_OBSERVED_FINGERPRINT';
const BOOKING_CORE_LAST_PUSHED_FINGERPRINT_PROPERTY = 'BOOKING_CORE_LAST_PUSHED_FINGERPRINT';
const BOOKING_CORE_PUSH_ERROR_PROPERTY = 'BOOKING_CORE_PUSH_ERROR';
const BOOKING_CORE_PUSH_URL_PROPERTY = 'BOOKING_CORE_PUSH_URL';
const BOOKING_CORE_PUSH_SECRET_PROPERTY = 'BOOKING_CORE_PUSH_SECRET';

// --- ΤΙΜΕΣ ΑΠΟ BEDS24 API (αντί για CSV) ---
// true  = οι τιμές από σήμερα και μετά έρχονται απευθείας από το Beds24 (price1).
// false = όπως παλιά, μόνο από το CSV.
// Αν το API αποτύχει, το script χρησιμοποιεί αυτόματα το CSV.
const USE_BEDS24_API_PRICES = true;
// Δωμάτια χωρίς δική τους ημερήσια τιμή στο Beds24 (Daily Price Rules).
// Ισόγειο (626129) = Πρώτος Όροφος (267788) - 15€. Αν αλλάξεις τον κανόνα στο Beds24, άλλαξέ τον και εδώ.
const DERIVED_PRICE_RULES = {
  '626129': { fromRoomId: '267788', offset: -15 }
};
// --- BEDS24 INVENTORY WEBHOOK ---
// Το Beds24 ειδοποιεί (SYNC_ROOM) όταν αλλάζει τιμή/διαθεσιμότητα/κράτηση.
// Τότε τρέχει ένα refreshSystem ~1 λεπτό μετά (πολλές ειδοποιήσεις μαζί = μία εκτέλεση).
const BEDS24_WEBHOOK_KEY_PROPERTY = 'BEDS24_WEBHOOK_KEY';
const BEDS24_WEBHOOK_LAST_AT_PROPERTY = 'BEDS24_WEBHOOK_LAST_AT';
const BEDS24_WEBHOOK_PENDING_CACHE_KEY = 'BEDS24_WEBHOOK_REFRESH_PENDING';
const BEDS24_WEBHOOK_DELAY_MS = 60 * 1000;
const BEDS24_WEBHOOK_RETRY_MS = 2 * 60 * 1000;
// Μέρες όπου το Beds24 λέει 0 διαθέσιμα: οι ελεύθερες μονάδες γράφονται CLOSED.
let _beds24NoAvailability = {};

// --- APP 4: HOUSEKEEPING GLOBALS ---
const HK_STAYS_SHEET = 'hk_stays';
const HK_TASKS_SHEET = 'hk_tasks';

const HK_TASK_TYPES = {
  CHECK_IN: 'CHECK_IN',
  CHECK_OUT: 'CHECK_OUT',
  TOWELS: 'TOWELS',
  LINENS: 'LINENS',
  TOWELS_LINENS: 'TOWELS_LINENS',
  GENERAL: 'GENERAL'
};

const ROOMS = [
  { roomId:267788, unitId:1, name:'Room 1', location:'First floor', maxGuests:4 },
  { roomId:268803, unitId:1, name:'Room 2', location:'First floor', maxGuests:2 },
  { roomId:267788, unitId:2, name:'Room 3', location:'First floor', maxGuests:3 },
  { roomId:267788, unitId:3, name:'Room 4', location:'First floor', maxGuests:3 },
  { roomId:626129, unitId:1, name:'Room 5', location:'Ground floor', maxGuests:3 },
  { roomId:268803, unitId:2, name:'Room 6', location:'Ground floor', maxGuests:2 },
  { roomId:626129, unitId:2, name:'Room 7', location:'Ground floor', maxGuests:3 },
  { roomId:265595, unitId:1, name:'Apartment 8', location:'Independent', maxGuests:4 },
  { roomId:265595, unitId:2, name:'Apartment 9', location:'Independent', maxGuests:4 },
  { roomId:265595, unitId:3, name:'Apartment 10', location:'Independent', maxGuests:4 },
  { roomId:345347, unitId:1, name:'Apt 11', location:'Independent', maxGuests:4 }
];

const ROOM_NAME_TO_ID = {
  'Apartmentbooking.com': '265595',
  'First Floor Double RoomBooking.com': '267788',
  'Economy Double RoomBooking.com': '268803',
  'Ground Floor RoomGround Floor Rate': '626129'
};

/******************************************************************
 * IN-MEMORY EXECUTION CACHE
 ******************************************************************/
let _occupancyDataCache = null;
let _availabilityMemoCache = null;

/******************************************************************
 * SAFE LOCK HELPERS
 ******************************************************************/

function acquireScriptLockOrSkip_(label, waitMs) {
  const lock = LockService.getScriptLock();
  const ms = typeof waitMs === 'number' ? waitMs : LOCK_WAIT_MS;

  if (!lock.tryLock(ms)) {
    console.log(label + ' skipped: another script execution is already running.');
    return null;
  }

  return lock;
}

function logRuntime_(label, startedMs) {
  console.log(label + ' runtime: ' + Math.round((Date.now() - startedMs) / 1000) + 's');
}

/******************************************************************
 * ROUTER - DOGET / DOPOST
 ******************************************************************/

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action).trim() : '';

    if (action === 'ping') return jsonOutput_({ ok: true, pong: true, ts: new Date().toISOString(), source: 'PING' });
    if (action === 'cachedDeals' || action === 'deals') return getDealsResponse_();
    if (action === 'debugDeals') return jsonOutput_(debugDeals());
    if (action === 'occupancy_prices') return getOccupancyPrices_();
    if (action === 'occupancy_snapshot') return getOccupancySnapshot_();
    if (action === 'booking_core_snapshot') return getBookingCoreSnapshot_();
    if (action === 'booking_core_health') return getBookingCoreHealth_();
    if (action === 'turkish_deals') return getTurkishDeals_({ people: e.parameter.people, holiday: e.parameter.holiday });
    if (action === 'hk_calendar') return hkGetCalendar_(e.parameter || {});

    // HOTEL CALENDAR BOOKINGS
    if (action === 'bookings' || action === 'booking') return getCalendarBookings_();

    // TEMP DEBUG: Beds24 charges / invoice fields
    if (action === 'chargeDebug') {
      return chargeDebug_(e.parameter.bookingId || e.parameter.id || e.parameter.bookId);
    }

    return jsonOutput_({ success: true, message: 'Web app is alive. Use POST actions or valid GET actions.' });
  } catch (err) {
    return jsonOutput_({ ok: false, error: err && err.message ? err.message : String(err) });
  }
}
function forceBookingCoreBookingIdBackfill() {
  const props = PropertiesService.getScriptProperties();

  const built = buildBookingCoreRowsFromAvailability_();
  const rows = built.rows;

  const now = new Date().toISOString();

  const dataUpdatedAt = String(
    props.getProperty(BOOKING_CORE_DATA_UPDATED_AT_PROPERTY) || now
  );

  const payload = buildBookingCoreSnapshotPayloadFromRows_(
    rows,
    dataUpdatedAt,
    now
  );

  const result = pushBookingCoreSnapshotToVercel_(payload);

  if (!result.ok) {
    throw new Error(result.error || 'Booking Core force push failed');
  }

  const fingerprint = computeBookingCoreFingerprint_(rows);

  props.setProperty(
    BOOKING_CORE_LAST_OBSERVED_FINGERPRINT_PROPERTY,
    fingerprint
  );

  props.setProperty(
    BOOKING_CORE_LAST_PUSHED_FINGERPRINT_PROPERTY,
    fingerprint
  );

  Logger.log(JSON.stringify(result.response));
}
function getCalendarBookings_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName('Availability');

  if (!sh) {
    return jsonOutput_({
      success: false,
      type: 'availability',
      count: 0,
      error: 'Sheet Availability not found',
      data: []
    });
  }

  const values = sh.getDataRange().getValues();

  if (!values || values.length < 2) {
    return jsonOutput_({
      success: true,
      type: 'availability',
      count: 0,
      data: []
    });
  }

  const headers = values[0].map(function(h) {
    return String(h || '').trim();
  });

  const data = values.slice(1)
    .filter(function(row) {
      return row.some(function(cell) {
        return cell !== '' && cell !== null && cell !== undefined;
      });
    })
    .map(function(row) {
      const item = {};

      headers.forEach(function(header, index) {
        let value = row[index];

        if (Object.prototype.toString.call(value) === '[object Date]') {
          value = Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        }

        item[header] = value;
      });

      return item;
    })
    .filter(function(item) {
      return String(item.available || '').toUpperCase() === 'NO' &&
             String(item.reason || '').toUpperCase() === 'BOOKED' &&
             item.date &&
             item.roomId &&
             item.unitId;
    });

  return jsonOutput_({
    success: true,
    type: 'availability',
    count: data.length,
    data: data
  });
}
function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const payload = JSON.parse(raw);
    const action = String(payload.action || '').trim();

    if (action === 'SYNC_ROOM') return handleBeds24InventoryWebhook_(e, payload);
    if (action === 'ping') return jsonOutput_({ ok: true, pong: true, ts: new Date().toISOString(), source: 'PING' });
    if (action === 'cachedDeals' || action === 'deals') return getDealsResponse_();
    if (action === 'debugDeals') return jsonOutput_(debugDeals());
    if (action === 'availability') return handleAvailability_(payload);
    if (action === 'occupancy_snapshot') return getOccupancySnapshot_();
    if (action === 'get_last_minute_cache') return getLastMinuteCache_(payload);
    if (action === 'refresh_last_minute_cache') return refreshLastMinuteCache_(payload);
    if (action === 'turkish_deals') return getTurkishDeals_(payload);
    if (action === 'hk_add_stay') return hkAddStay_(payload);
    if (action === 'hk_add_task') return hkAddTask_(payload);
    if (action === 'hk_delete_task') return hkDeleteTask_(payload);
    if (action === 'hk_calendar') return hkGetCalendar_(payload);

    return jsonOutput_({ success: false, message: 'Unknown action' });
  } catch (err) {
    return jsonOutput_({ success: false, message: err && err.message ? err.message : String(err) });
  }
}

/******************************************************************
 * OCCUPANCY DATA CACHE
 ******************************************************************/

function getOccupancyData_() {
  if (_occupancyDataCache) return _occupancyDataCache;

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName('occupancy_calendar');
  if (!sh) throw new Error('Sheet "occupancy_calendar" not found');

  const values = sh.getDataRange().getValues();
  if (!values || values.length < 2) throw new Error('Sheet "occupancy_calendar" is empty');

  const dateToCol = buildDateColumnMap_(values[0]);
  const unitRowMap = {};

  for (let r = 1; r < values.length; r++) {
    const roomId = String(Number(values[r][0]));
    const unitId = String(Number(values[r][2]));
    if (roomId && unitId) unitRowMap[roomId + '_' + unitId] = values[r];
  }

  _occupancyDataCache = { values: values, dateToCol: dateToCol, unitRowMap: unitRowMap };
  return _occupancyDataCache;
}

function resetExecutionCaches_() {
  _occupancyDataCache = null;
  _availabilityMemoCache = null;
}

/******************************************************************
 * APP 1: HOMEPAGE DEALS LOGIC & HELPERS
 ******************************************************************/

function getDealsResponse_() {
  const startedAt = new Date();
  const props = PropertiesService.getScriptProperties();
  const cached = props.getProperty(CACHE_KEY);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const generatedAtMs = parsed && parsed.generatedAt ? new Date(parsed.generatedAt).getTime() : 0;
      const isFresh = generatedAtMs && (Date.now() - generatedAtMs <= DEALS_CACHE_TTL_MS);

      if (isFresh) {
        parsed.source = 'CACHE';
        parsed.servedAt = new Date().toISOString();
        parsed.responseMs = new Date().getTime() - startedAt.getTime();
        parsed.cacheAgeMs = Date.now() - generatedAtMs;
        return jsonOutput_(parsed);
      }
    } catch (e) {}
  }

  const fresh = buildDeals();
  fresh.source = 'LIVE';
  fresh.servedAt = new Date().toISOString();
  fresh.responseMs = new Date().getTime() - startedAt.getTime();
  fresh.cacheAgeMs = 0;

  if (fresh.ok) props.setProperty(CACHE_KEY, JSON.stringify(fresh));
  return jsonOutput_(fresh);
}

function updateDealsCache() {
  const data = buildDeals();
  if (data.ok) {
    data.cacheUpdatedAt = new Date().toISOString();
    PropertiesService.getScriptProperties().setProperty(CACHE_KEY, JSON.stringify(data));
    console.log('Deals Cache updated at ' + new Date());
  }
}

function buildDeals() {
  const data = getOccupancyData_();
  const values = data.values;
  const rows = values.slice(1);
  const dateCols = data.dateToCol;
  const today = new Date();
  const days = [];

  for (let i = 1; i <= 7; i++) {
    const checkinDate = addDays(today, i);
    const checkoutDate = addDays(today, i + 1);
    const checkin = formatDate(checkinDate);
    const checkout = formatDate(checkoutDate);
    const col = dateCols[checkin];
    const results = {};

    rows.forEach(function(row) {
      const roomId = Number(row[0]);
      const unitId = Number(row[2]);
      const key = roomId + '_' + unitId;

      if (col == null) {
        results[key] = { available: false, totalPrice: 0 };
        return;
      }

      const value = row[col];
      const normalized = normalizeCellValue(value);
      const normalizedText = String(normalized).toUpperCase();

      if (normalized == null || normalized === '' || normalizedText === 'CLOSED' || normalizedText === 'BOOKED') {
        results[key] = { available: false, totalPrice: 0 };
        return;
      }

      const price = Number(normalized);
      results[key] = { available: !isNaN(price) && price > 0, totalPrice: !isNaN(price) ? price : 0 };
    });

    days.push({ checkin: checkin, checkout: checkout, results: results });
  }

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    adults: ADULTS,
    discount: DISCOUNT,
    rooms: ROOMS.filter(function(r) { return r.maxGuests >= ADULTS; }),
    days: days
  };
}

function debugDeals() {
  const data = getOccupancyData_();
  const headers = data.values[0];
  const dateCols = data.dateToCol;
  const today = new Date();
  const next7 = [];

  for (let i = 1; i <= 7; i++) next7.push(formatDate(addDays(today, i)));

  return {
    ok: true,
    timezone: Session.getScriptTimeZone(),
    sheetName: SHEET_NAME,
    headerCount: headers.length,
    recognizedDateHeaders: Object.keys(dateCols),
    next7: next7,
    matchedColumnsForNext7: next7.map(function(d) {
      return { date: d, columnIndex: Object.prototype.hasOwnProperty.call(dateCols, d) ? dateCols[d] : null };
    })
  };
}

function normalizeHeaderDate(value) {
  if (value == null || value === '') return null;
  if (Object.prototype.toString.call(value) === '[object Date]') {
    if (isNaN(value.getTime())) return null;
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  const str = String(value).trim();
  if (!str) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(str)) return str.replace(/\//g, '-');
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return Utilities.formatDate(parsed, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return null;
}

function normalizeCellValue(value) {
  if (value == null) return null;
  if (typeof value === 'string') return value.trim();
  return value;
}

function addDays(date, days) {
  const d = new Date(date);
  if (isNaN(d.getTime())) throw new Error('Invalid date passed to addDays');
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) throw new Error('Invalid date passed to formatDate');
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

/******************************************************************
 * APP 2: BEDS24 / AVAILABILITY LOGIC & HELPERS
 ******************************************************************/

function handleAvailability_(payload) {
  const checkin = String(payload.checkin || '').trim();
  const checkout = String(payload.checkout || '').trim();
  const units = Array.isArray(payload.units) ? payload.units : [];

  if (!checkin || !checkout || !units.length) return jsonOutput_({ success: false, message: 'Missing required fields' });

  const start = parseIsoDate_(checkin);
  const end = parseIsoDate_(checkout);
  if (!start || !end || end <= start) return jsonOutput_({ success: false, message: 'Invalid checkin/checkout dates' });

  const results = computeAvailabilityResults_(checkin, checkout, units);
  return jsonOutput_({ success: true, results: results });
}

function computeAvailabilityResults_(checkin, checkout, units) {
  const data = getOccupancyData_();
  const dateToCol = data.dateToCol;
  const wantedDates = getDateRangeExclusive_(checkin, checkout);
  const results = {};

  if (!_availabilityMemoCache) _availabilityMemoCache = {};

  units.forEach(function(unit) {
    const roomId = String(unit.roomId || '').trim();
    const unitId = String(unit.unitId || '').trim();
    const resultKey = roomId + '_' + unitId;
    const memoKey = checkin + '|' + checkout + '|' + resultKey;

    if (Object.prototype.hasOwnProperty.call(_availabilityMemoCache, memoKey)) {
      results[resultKey] = _availabilityMemoCache[memoKey];
      return;
    }

    const row = findUnitRowFast_(data, roomId, unitId);
    if (!row) {
      const notFoundResult = { available: false, price: null, avgPrice: null, totalPrice: null, currency: 'EUR', reason: 'UNIT_NOT_FOUND' };
      _availabilityMemoCache[memoKey] = notFoundResult;
      results[resultKey] = notFoundResult;
      return;
    }

    let available = true;
    let nightlyPrice = null;
    let totalPrice = 0;
    let nightsCount = 0;
    let reason = 'OK';

    for (var i = 0; i < wantedDates.length; i++) {
      const dateStr = wantedDates[i];
      const colIndex = dateToCol[dateStr];

      if (typeof colIndex === 'undefined') {
        available = false;
        reason = 'DATE_NOT_FOUND';
        break;
      }

      const cellValue = row[colIndex];
      const cellText = String(cellValue === null || cellValue === undefined ? '' : cellValue).trim().toUpperCase();

      if (cellText === 'BOOKED') {
        available = false;
        reason = 'BOOKED';
        break;
      }

      if (cellText === 'CLOSED' || cellText === '') {
        available = false;
        reason = 'CLOSED';
        break;
      }

      const price = Number(cellValue);
      if (!Number.isFinite(price) || price <= 0) {
        available = false;
        reason = 'INVALID_PRICE';
        break;
      }

      if (nightlyPrice === null) nightlyPrice = price;
      totalPrice += price;
      nightsCount++;
    }

    const computed = {
      available: available,
      price: available ? nightlyPrice : null,
      avgPrice: available && nightsCount > 0 ? round2_(totalPrice / nightsCount) : null,
      totalPrice: available ? round2_(totalPrice) : null,
      currency: 'EUR',
      reason: reason
    };

    _availabilityMemoCache[memoKey] = computed;
    results[resultKey] = computed;
  });

  return results;
}

function getLastMinuteCache_(payload) {
  const people = normalizePeople_(payload && payload.people);
  const cacheKey = getLastMinuteCacheKey_(people);
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty(cacheKey);

  if (raw) {
    try { return jsonOutput_(JSON.parse(raw)); } catch (e) {}
  }

  const fresh = buildLastMinuteCacheData_(people);
  props.setProperty(cacheKey, JSON.stringify(fresh));
  return jsonOutput_(fresh);
}

function refreshLastMinuteCache_(payload) {
  const people = normalizePeople_(payload && payload.people);
  const fresh = buildLastMinuteCacheData_(people);
  PropertiesService.getScriptProperties().setProperty(getLastMinuteCacheKey_(people), JSON.stringify(fresh));
  return jsonOutput_({ success: true, message: 'Cache refreshed', people: people, updatedAt: fresh.updatedAt });
}

function buildLastMinuteCacheData_(people) {
  const rooms = getLastMinuteRooms_().filter(function(room) { return Number(room.max) >= Number(people); });
  const units = rooms.map(function(room) { return { roomId: room.roomId, unitId: room.unitId }; });
  const base = new Date();
  base.setHours(12, 0, 0, 0);

  const dayBuckets = [];
  for (var i = 1; i <= 7; i++) {
    const checkinDate = addDays_(base, i);
    const checkoutDate = addDays_(base, i + 1);
    const checkin = formatDate_(checkinDate);
    const checkout = formatDate_(checkoutDate);
    dayBuckets.push({ checkin: checkin, checkout: checkout, results: computeAvailabilityResults_(checkin, checkout, units) });
  }

  const roomPayload = rooms.map(function(room) {
    const key = room.roomId + '_' + room.unitId;
    return {
      roomId: room.roomId,
      unitId: room.unitId,
      name: room.name,
      loc: room.loc,
      max: room.max,
      days: dayBuckets.map(function(day) {
        const item = day.results[key] || null;
        const available = !!(item && item.available);
        const originalPrice = available ? Number(item.totalPrice || 0) : null;
        return {
          checkin: day.checkin,
          checkout: day.checkout,
          available: available,
          originalPrice: originalPrice,
          dealPrice: available ? round2_(originalPrice * 0.85) : null,
          currency: 'EUR',
          reason: item ? item.reason : 'NO_RESULT'
        };
      })
    };
  });

  return {
    success: true,
    people: people,
    updatedAt: new Date().toISOString(),
    startDate: dayBuckets.length ? dayBuckets[0].checkin : '',
    endDate: dayBuckets.length ? dayBuckets[dayBuckets.length - 1].checkout : '',
    rooms: roomPayload
  };
}

function getLastMinuteCacheKey_(people) { return 'LAST_MINUTE_CACHE_' + String(people); }

function normalizePeople_(value) {
  const n = Number(value || 2);
  if (!Number.isFinite(n)) return 2;
  if (n < 1) return 1;
  if (n > 4) return 4;
  return Math.round(n);
}

function addDays_(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getLastMinuteRooms_() {
  return [
    { roomId: '267788', unitId: '1', name: 'Δωμάτιο 1', loc: 'Πρώτος όροφος', max: 4 },
    { roomId: '268803', unitId: '1', name: 'Δωμάτιο 2', loc: 'Πρώτος όροφος', max: 2 },
    { roomId: '267788', unitId: '2', name: 'Δωμάτιο 3', loc: 'Πρώτος όροφος', max: 3 },
    { roomId: '267788', unitId: '3', name: 'Δωμάτιο 4', loc: 'Πρώτος όροφος', max: 3 },
    { roomId: '626129', unitId: '1', name: 'Δωμάτιο 5', loc: 'Ισόγειο', max: 3 },
    { roomId: '268803', unitId: '2', name: 'Δωμάτιο 6', loc: 'Ισόγειο', max: 2 },
    { roomId: '626129', unitId: '2', name: 'Δωμάτιο 7', loc: 'Ισόγειο', max: 3 },
    { roomId: '265595', unitId: '1', name: 'Διαμέρισμα 8', loc: 'Αυτόνομο', max: 4 },
    { roomId: '265595', unitId: '2', name: 'Διαμέρισμα 9', loc: 'Αυτόνομο', max: 4 },
    { roomId: '265595', unitId: '3', name: 'Διαμέρισμα 10', loc: 'Αυτόνομο', max: 4 },
    { roomId: '345347', unitId: '1', name: 'Διαμέρισμα 11', loc: 'Αυτόνομο', max: 4 }
  ];
}


/******************************************************************
 * FIXED APT 11 PRICE
 * Δωμάτιο 11: θεωρείται σταθερή τιμή 90€ για όλες τις ημερομηνίες
 * που υπάρχουν στο price CSV / occupancy calendar.
 ******************************************************************/

function addFixedApt11Prices_(prices) {
  if (!prices || typeof prices !== 'object') return prices;

  const apt11RoomId = '345347';
  const apt11Price = 90;
  const dates = getAllPriceDates_(prices);

  if (!prices[apt11RoomId]) {
    prices[apt11RoomId] = {};
  }

  dates.forEach(function(dateStr) {
    prices[apt11RoomId][dateStr] = apt11Price;
  });

  return prices;
}


/******************************************************************
 * BOOKING REFERRER / CHANNEL HELPERS
 * Προσπαθεί να βρει την πηγή της κράτησης από τα πεδία που μπορεί
 * να στέλνει το Beds24: referrer, originalReferrer, channel, source κτλ.
 ******************************************************************/

function getBookingReferrer_(b) {
  if (!b || typeof b !== 'object') return '';

  const directFields = [
    b.originalReferrer,
    b.referrer,
    b.referer,
    b.referredBy,
    b.channel,
    b.source,
    b.sourceName,
    b.bookingChannel,
    b.channelName,
    b.apiSource,
    b.origin,
    b.agent,
    b.ota,
    b.partner,
    b.portal,
    b.site
  ];

  for (var i = 0; i < directFields.length; i++) {
    const value = directFields[i];
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      return normalizeBookingReferrer_(value);
    }
  }

  // Μερικές φορές το Beds24 βάζει πληροφορίες μέσα σε nested objects.
  const nestedObjects = [b.referrerInfo, b.channelInfo, b.sourceInfo, b.bookingSource, b.invoicee, b.apiReference];
  const nestedKeys = ['name', 'title', 'type', 'source', 'channel', 'referrer', 'originalReferrer', 'referer'];

  for (var n = 0; n < nestedObjects.length; n++) {
    const obj = nestedObjects[n];
    if (!obj || typeof obj !== 'object') continue;

    for (var k = 0; k < nestedKeys.length; k++) {
      const nestedValue = obj[nestedKeys[k]];
      if (nestedValue !== null && nestedValue !== undefined && String(nestedValue).trim() !== '') {
        return normalizeBookingReferrer_(nestedValue);
      }
    }
  }

  return '';
}

function normalizeBookingReferrer_(value) {
  const raw = String(value == null ? '' : value).trim();
  if (!raw) return '';

  const low = raw.toLowerCase();

  if (low.indexOf('booking') !== -1 || low.indexOf('b.com') !== -1 || low.indexOf('booking.com') !== -1) {
    return 'Booking.com';
  }

  if (low.indexOf('expedia') !== -1 || low.indexOf('hotels.com') !== -1 || low.indexOf('vrbo') !== -1) {
    return 'Expedia';
  }

  if (low.indexOf('airbnb') !== -1) {
    return 'Airbnb';
  }

  if (low.indexOf('direct') !== -1 || low.indexOf('manual') !== -1 || low.indexOf('website') !== -1) {
    return 'Direct';
  }

  return raw;
}


/******************************************************************
 * MAIN REFRESH SYSTEM
 ******************************************************************/

function refreshSystem() {
  const startedMs = Date.now();
  const lock = acquireScriptLockOrSkip_('refreshSystem', LOCK_WAIT_MS);
  if (!lock) return false;

  const bookingCoreProps = PropertiesService.getScriptProperties();
  let bookingCoreReady = false;
  bookingCoreProps.setProperty(BOOKING_CORE_REFRESH_STATE_PROPERTY, 'UPDATING');
  bookingCoreProps.setProperty(BOOKING_CORE_REFRESH_STARTED_AT_PROPERTY, new Date().toISOString());
  bookingCoreProps.deleteProperty(BOOKING_CORE_REFRESH_ERROR_PROPERTY);

  try {
    resetExecutionCaches_();

    const token = PropertiesService.getScriptProperties().getProperty('beds24');
    if (!token) throw new Error('Δεν βρέθηκε Script Property "beds24"');

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const rateCacheSheet = getOrCreateSheet_(ss, 'rate_cache');
    const calendarSheet = getOrCreateSheet_(ss, 'occupancy_calendar');
    const availabilitySheet = getOrCreateSheet_(ss, 'Availability');
    const mappingSheet = getOrCreateSheet_(ss, 'mapping');
    const debugPricesSheet = getOrCreateSheet_(ss, 'debug_prices');
    const debugBookingsSheet = getOrCreateSheet_(ss, 'debug_bookings');

    clearSheet_(debugPricesSheet);
    clearSheet_(debugBookingsSheet);
    // Τα occupancy_calendar / Availability δεν αδειάζουν εδώ: καθαρίζονται ακριβώς πριν
    // ξαναγραφτούν, ώστε άλλα triggers (updateDealsCache) να μη τα βρίσκουν άδεια.

    const csvImport = importPricesFromCSV_();
    writeJsonToSheet_(debugPricesSheet, csvImport.debug, 'CSV DEBUG');

    let prices = csvImport.prices;
    if (USE_BEDS24_API_PRICES) prices = applyBeds24ApiPrices_(prices, token);

    // Πόσο μακριά φτάνουν οι πραγματικές τιμές (> 0) του αρχείου, πριν μπει η σταθερή
    // τιμή του Apt 11. Μετά από αυτή την ημερομηνία το κυλιόμενο ημερολόγιο δείχνει
    // μόνο BOOKED / CLOSED μέχρι να ανέβει νέο αρχείο.
    const lastPriceDate = getLastPricedDate_(prices);
    bookingCoreProps.setProperty(PRICE_CSV_LAST_DATE_PROPERTY, lastPriceDate);

    addFixedApt11Prices_(prices);

    if (lastPriceDate && lastPriceDate < formatDate_(addDays_(new Date(), PRICE_CSV_WARNING_DAYS))) {
      console.warn('Το αρχείο τιμών τελειώνει στις ' + lastPriceDate + '. Ανέβασε νεότερο αρχείο τιμών στο Drive.');
    }

    if (!prices || Object.keys(prices).length === 0) {
      throw new Error(
        'Δεν βρέθηκαν prices από το CSV. Πιθανό πρόβλημα delimiter ή room names. Latest CSV: ' +
        (csvImport.debug && csvImport.debug.fileName ? csvImport.debug.fileName : 'unknown') +
        '. Δες το sheet debug_prices για unmatchedNames.'
      );
    }

    writeRateCache_(rateCacheSheet, prices);

    const bookingsResp = getBookings_(token);
    writeJsonToSheet_(debugBookingsSheet, bookingsResp, 'BOOKINGS DEBUG');

    const bookings = normalizeBookings_(bookingsResp);
    Logger.log('Fetched bookings for occupancy calendar: ' + bookings.length);
    let stepMs = Date.now();
    const logStep_ = function(label) {
      console.log('[refreshSystem] ' + label + ': ' + Math.round((Date.now() - stepMs) / 1000) + 's');
      stepMs = Date.now();
    };

    const occupiedMap = buildOccupiedMap_(bookings);
    const unitsMap = buildUnitsMapFromFixedMappingAndBookings_(bookings);

    logStep_('build maps');
    writeMappingSheet_(mappingSheet, unitsMap);
    logStep_('write mapping');
    const availabilityValues = writeAvailabilitySheet_(availabilitySheet, unitsMap, occupiedMap, prices);
    logStep_('write Availability');
    buildCalendar_(calendarSheet, unitsMap, prices, occupiedMap);
    logStep_('write occupancy_calendar');

    SpreadsheetApp.flush();
    logStep_('flush');

    // Event-driven Booking Core sync: only push to Vercel when the canonical
    // availability/pricing snapshot actually changes. If a previous push failed,
    // the same fingerprint remains pending and is retried on the next refresh.
    const bookingCoreRows = buildBookingCoreRowsFromAvailability_(availabilityValues);
    const bookingCoreFingerprint = computeBookingCoreFingerprint_(bookingCoreRows.rows);
    logStep_('build Booking Core rows');
    const previousObservedFingerprint = String(
      bookingCoreProps.getProperty(BOOKING_CORE_LAST_OBSERVED_FINGERPRINT_PROPERTY) || ''
    );
    const previousPushedFingerprint = String(
      bookingCoreProps.getProperty(BOOKING_CORE_LAST_PUSHED_FINGERPRINT_PROPERTY) || ''
    );
    const refreshCompletedAt = new Date().toISOString();

    let bookingCoreDataUpdatedAt = String(
      bookingCoreProps.getProperty(BOOKING_CORE_DATA_UPDATED_AT_PROPERTY) || ''
    );

    if (!bookingCoreDataUpdatedAt || bookingCoreFingerprint !== previousObservedFingerprint) {
      bookingCoreDataUpdatedAt = refreshCompletedAt;
      bookingCoreProps.setProperty(BOOKING_CORE_DATA_UPDATED_AT_PROPERTY, bookingCoreDataUpdatedAt);
      bookingCoreProps.setProperty(BOOKING_CORE_LAST_OBSERVED_FINGERPRINT_PROPERTY, bookingCoreFingerprint);
    }

    bookingCoreProps.setProperty(BOOKING_CORE_LAST_REFRESH_COMPLETED_AT_PROPERTY, refreshCompletedAt);
    bookingCoreProps.setProperty(BOOKING_CORE_REFRESH_STATE_PROPERTY, 'READY');
    bookingCoreProps.deleteProperty(BOOKING_CORE_REFRESH_ERROR_PROPERTY);
    bookingCoreReady = true;

    if (bookingCoreFingerprint !== previousPushedFingerprint) {
      const pushPayload = buildBookingCoreSnapshotPayloadFromRows_(
        bookingCoreRows.rows,
        bookingCoreDataUpdatedAt,
        refreshCompletedAt
      );
      const pushResult = pushBookingCoreSnapshotToVercel_(pushPayload);

      if (pushResult.ok) {
        bookingCoreProps.setProperty(BOOKING_CORE_LAST_PUSHED_FINGERPRINT_PROPERTY, bookingCoreFingerprint);
        bookingCoreProps.deleteProperty(BOOKING_CORE_PUSH_ERROR_PROPERTY);
        console.log('Booking Core change pushed to Vercel. Rows: ' + bookingCoreRows.rows.length);
      } else {
        bookingCoreProps.setProperty(BOOKING_CORE_PUSH_ERROR_PROPERTY, String(pushResult.error || 'Unknown push error').slice(0, 500));
        console.error('Booking Core push failed; it will retry on the next refresh: ' + pushResult.error);
      }
    } else {
      console.log('Booking Core unchanged; Neon/Vercel sync skipped.');
    }

    logStep_('Booking Core sync');
    resetExecutionCaches_();
    updateDealsCache();
    logStep_('updateDealsCache');
    refreshLastMinuteDefaultCacheNoLock_();
    logStep_('last-minute cache');
    refreshTurkishCacheNoLock_();
    logStep_('Turkish cache');

    console.log('refreshSystem completed successfully.');
    return true;
  } catch (err) {
    if (!bookingCoreReady) {
      bookingCoreProps.setProperty(BOOKING_CORE_REFRESH_STATE_PROPERTY, 'ERROR');
      bookingCoreProps.setProperty(
        BOOKING_CORE_REFRESH_ERROR_PROPERTY,
        String(err && err.message ? err.message : err).slice(0, 500)
      );
    }
    throw err;
  } finally {
    logRuntime_('refreshSystem', startedMs);
    lock.releaseLock();
  }
}

/******************************************************************
 * BEDS24 INVENTORY WEBHOOK
 * Ρύθμιση μία φορά: τρέξε setupBeds24Webhook και βάλε στο Beds24
 * (Settings > Marketplace > Webhooks) το URL που γράφει στο log.
 ******************************************************************/

function handleBeds24InventoryWebhook_(e, payload) {
  const props = PropertiesService.getScriptProperties();
  const expectedKey = String(props.getProperty(BEDS24_WEBHOOK_KEY_PROPERTY) || '').trim();
  const suppliedKey = String((e && e.parameter && e.parameter.key) || '').trim();

  if (!expectedKey || suppliedKey !== expectedKey) {
    return jsonOutput_({ ok: false, error: 'Unauthorized' });
  }

  props.setProperty(BEDS24_WEBHOOK_LAST_AT_PROPERTY, new Date().toISOString());
  console.log('Beds24 webhook SYNC_ROOM για room ' + String(payload.roomId || '?'));

  const scheduled = scheduleWebhookRefresh_(BEDS24_WEBHOOK_DELAY_MS);
  return jsonOutput_({ ok: true, scheduled: scheduled });
}

// Μία εκκρεμής εκτέλεση τη φορά: οι επόμενες ειδοποιήσεις μέσα στο ίδιο διάστημα αγνοούνται.
function scheduleWebhookRefresh_(delayMs) {
  const cache = CacheService.getScriptCache();
  if (cache.get(BEDS24_WEBHOOK_PENDING_CACHE_KEY)) return false;

  const pending = ScriptApp.getProjectTriggers().some(function(t) {
    return t.getHandlerFunction() === 'runBeds24WebhookRefresh';
  });
  cache.put(BEDS24_WEBHOOK_PENDING_CACHE_KEY, '1', 600);
  if (pending) return false;

  ScriptApp.newTrigger('runBeds24WebhookRefresh').timeBased().after(delayMs).create();
  return true;
}

function runBeds24WebhookRefresh() {
  // Καθαρίζει πρώτα, ώστε ειδοποίηση που έρχεται όσο τρέχει να προγραμματίσει νέα εκτέλεση.
  deleteExistingTriggers_(['runBeds24WebhookRefresh']);
  CacheService.getScriptCache().remove(BEDS24_WEBHOOK_PENDING_CACHE_KEY);

  const ran = refreshSystem();
  if (ran === false) {
    // Έτρεχε ήδη άλλο refresh (πιθανώς πριν την αλλαγή): ξαναδοκίμασε σε λίγο.
    console.log('Webhook refresh: άλλο refresh σε εξέλιξη, νέα προσπάθεια σε 2 λεπτά.');
    scheduleWebhookRefresh_(BEDS24_WEBHOOK_RETRY_MS);
  }
}

function setupBeds24Webhook() {
  const props = PropertiesService.getScriptProperties();
  let key = String(props.getProperty(BEDS24_WEBHOOK_KEY_PROPERTY) || '').trim();
  if (!key) {
    key = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty(BEDS24_WEBHOOK_KEY_PROPERTY, key);
  }
  const baseUrl = ScriptApp.getService().getUrl();
  if (!baseUrl) {
    console.log('Δεν βρέθηκε URL web app. Κάνε πρώτα Deploy ως Web app και ξανατρέξε.');
    return;
  }
  console.log('Βάλε αυτό το URL στο Beds24 (Settings > Marketplace > Webhooks):\n' + baseUrl + '?key=' + key);
}

/******************************************************************
 * ΤΙΜΕΣ ΑΠΟ BEDS24 API
 * Από σήμερα και μετά: τιμή = price1 του Beds24 (ή κανόνας DERIVED_PRICE_RULES).
 * Πριν από σήμερα: μένουν οι τιμές του CSV (ιστορικό).
 * Αποτυχία API ή λείπει δωμάτιο => επιστρέφει το CSV όπως είναι (παλιά συμπεριφορά).
 ******************************************************************/

function applyBeds24ApiPrices_(csvPrices, token) {
  _beds24NoAvailability = {};

  const roomIds = {};
  Object.keys(ROOM_NAME_TO_ID).forEach(function(name) { roomIds[String(ROOM_NAME_TO_ID[name])] = true; });
  Object.keys(DERIVED_PRICE_RULES).forEach(function(id) {
    roomIds[String(id)] = true;
    roomIds[String(DERIVED_PRICE_RULES[id].fromRoomId)] = true;
  });
  const ids = Object.keys(roomIds);

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const startDate = formatDate_(today);
  const endDate = formatDate_(addDays_(today, CALENDAR_ROLLING_DAYS_AHEAD));

  let api;
  try {
    api = fetchBeds24Calendar_(token, ids, startDate, endDate);
  } catch (err) {
    console.error('Beds24 API τιμές απέτυχαν, χρησιμοποιείται το CSV: ' + (err && err.message ? err.message : err));
    return csvPrices;
  }

  const missing = ids.filter(function(id) { return !api[id] || Object.keys(api[id]).length === 0; });
  if (missing.length) {
    console.error('Beds24 API χωρίς δεδομένα για δωμάτια ' + missing.join(', ') + ', χρησιμοποιείται το CSV.');
    return csvPrices;
  }

  const prices = JSON.parse(JSON.stringify(csvPrices || {}));
  const noAvail = {};
  let apiPriced = 0;
  let derivedPriced = 0;
  let closedByAvail = 0;

  ids.forEach(function(roomId) {
    if (!prices[roomId]) prices[roomId] = {};
    Object.keys(prices[roomId]).forEach(function(d) {
      if (d >= startDate) delete prices[roomId][d];
    });

    const days = api[roomId];
    Object.keys(days).forEach(function(date) {
      const day = days[date];
      let price = Number(day.price1) || 0;

      const rule = DERIVED_PRICE_RULES[roomId];
      if (!(price > 0) && rule) {
        const src = api[String(rule.fromRoomId)] && api[String(rule.fromRoomId)][date];
        const srcPrice = src ? (Number(src.price1) || 0) : 0;
        if (srcPrice > 0) {
          price = round2_(srcPrice + Number(rule.offset || 0));
          derivedPriced++;
        }
      } else if (price > 0) {
        apiPriced++;
      }

      prices[roomId][date] = price > 0 ? price : 0;

      if (day.numAvail !== undefined && day.numAvail !== null && Number(day.numAvail) <= 0) {
        noAvail[roomId + '|' + date] = true;
        closedByAvail++;
      }
    });
  });

  _beds24NoAvailability = noAvail;
  console.log('Beds24 API τιμές: ' + apiPriced + ' price1, ' + derivedPriced + ' από κανόνα, ' +
    closedByAvail + ' μέρες με 0 διαθέσιμα (' + startDate + ' έως ' + endDate + ').');
  return prices;
}

function isClosedByBeds24_(roomId, date) {
  return !!_beds24NoAvailability[String(roomId) + '|' + date];
}

function fetchBeds24Calendar_(token, roomIds, startDate, endDate) {
  let url = 'https://api.beds24.com/v2/inventory/rooms/calendar?' +
    roomIds.map(function(id) { return 'roomId=' + encodeURIComponent(id); }).join('&') +
    '&startDate=' + startDate + '&endDate=' + endDate +
    '&includePrices=true&includeNumAvail=true';

  const result = {};
  let pages = 0;

  while (url) {
    if (++pages > 30) throw new Error('Πάρα πολλές σελίδες από το Beds24 calendar API');

    const resp = UrlFetchApp.fetch(url, {
      method: 'get',
      muteHttpExceptions: true,
      headers: { accept: 'application/json', token: token }
    });
    const code = resp.getResponseCode();
    if (code >= 300) throw new Error('Beds24 calendar API ' + code + ': ' + resp.getContentText().slice(0, 300));

    const parsed = JSON.parse(resp.getContentText());
    if (parsed && parsed.success === false) throw new Error('Beds24 calendar API: ' + JSON.stringify(parsed).slice(0, 300));
    const items = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.data) ? parsed.data : []);

    items.forEach(function(item) {
      const roomId = String(item.roomId || '');
      if (!roomId) return;
      if (!result[roomId]) result[roomId] = {};
      const ranges = Array.isArray(item.calendar) ? item.calendar : [];
      ranges.forEach(function(range) {
        const from = parseIsoDate_(range.from || range.date);
        const to = parseIsoDate_(range.to || range.date);
        if (!from || !to) return;
        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
          result[roomId][formatDate_(d)] = range;
        }
      });
    });

    url = (parsed && parsed.pages && parsed.pages.nextPageExists && parsed.pages.nextPageLink) ? parsed.pages.nextPageLink : null;
    if (url) Utilities.sleep(500);
  }

  return result;
}

/******************************************************************
 * TRIGGERS
 ******************************************************************/

function setupAutoRefreshTriggers() {
  // ΣΗΜΑΝΤΙΚΟ: Σβήνει και παλιά standalone triggers που προκαλούσαν overlaps.
  deleteExistingTriggers_(['refreshSystem', 'refreshTurkishCache', 'refreshLastMinuteDefaultCache']);
  ScriptApp.newTrigger('refreshSystem').timeBased().everyMinutes(15).create();
  console.log('Safe auto refresh trigger created: refreshSystem every 15 minutes.');
}

function setupSafeTriggersNow() {
  setupAutoRefreshTriggers();
}

function cleanupDuplicateTriggersNow() {
  setupAutoRefreshTriggers();
}

function deleteExistingTriggers_(handlerNames) {
  const names = Array.isArray(handlerNames) && handlerNames.length ? handlerNames : ['refreshSystem'];
  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach(function(t) {
    if (names.indexOf(t.getHandlerFunction()) !== -1) {
      ScriptApp.deleteTrigger(t);
    }
  });
}

function getPricesFolder_() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (!folders.hasNext()) throw new Error('Δεν βρέθηκε folder: ' + FOLDER_NAME);
  return folders.next();
}

function importPricesFromCSV_() {
  const folder = getPricesFolder_();
  const files = folder.getFiles();
  let latestFile = null;
  let latestTime = 0;

  while (files.hasNext()) {
    const file = files.next();
    const name = String(file.getName() || '');
    if (!/\.csv$/i.test(name)) continue;

    const modified = file.getLastUpdated().getTime();
    if (modified > latestTime) {
      latestTime = modified;
      latestFile = file;
    }
  }

  if (!latestFile) throw new Error('Δεν βρέθηκε CSV');

  const text = latestFile.getBlob().getDataAsString('UTF-8');
  const parsedCsv = parsePriceCsv_(text);
  const rows = parsedCsv.rows;

  if (!rows || rows.length < 2) throw new Error('Το CSV είναι άδειο');

  const headers = rows[0];
  const prices = {};
  const unmatchedNames = {};
  const matchedNames = {};
  let parsedDateHeaders = 0;

  for (var r = 1; r < rows.length; r++) {
    const row = rows[r];
    const rawName = String(row[0] || '').trim();
    if (!rawName) continue;

    const roomId = ROOM_NAME_TO_ID[rawName];
    if (!roomId) {
      unmatchedNames[rawName] = true;
      continue;
    }

    matchedNames[rawName] = true;
    if (!prices[roomId]) prices[roomId] = {};

    for (var c = 1; c < headers.length; c++) {
      const dateStr = parseBedsDate_(headers[c]);
      if (!dateStr) continue;
      parsedDateHeaders++;
      prices[roomId][dateStr] = normalizePriceValue_(row[c]);
    }
  }

  return {
    prices: prices,
    debug: {
      folderName: FOLDER_NAME,
      fileName: latestFile.getName(),
      fileUpdatedAt: latestFile.getLastUpdated().toISOString(),
      totalRows: rows.length,
      totalColumns: headers.length,
      delimiter: parsedCsv.delimiter,
      firstHeader: headers[0] || '',
      firstDataName: rows[1] && rows[1][0] ? String(rows[1][0]).trim() : '',
      matchedRoomIds: Object.keys(prices),
      matchedNames: Object.keys(matchedNames),
      unmatchedNames: Object.keys(unmatchedNames),
      parsedDateHeaders: parsedDateHeaders,
      firstTenHeaders: headers.slice(0, 10)
    }
  };
}

/******************************************************************
 * PRICE CSV PARSER
 * Υποστηρίζει CSV με κόμμα ή ελληνικό/ευρωπαϊκό CSV με semicolon.
 ******************************************************************/

function parsePriceCsv_(text) {
  const cleaned = String(text || '')
    .replace(/^﻿/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  if (!cleaned) return { rows: [], delimiter: '' };

  const firstLine = cleaned.split('\n')[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const delimiter = commaCount >= semicolonCount ? ',' : ';';

  const rows = Utilities.parseCsv(cleaned, delimiter).filter(function(row) {
    return row.some(function(cell) {
      return String(cell || '').trim() !== '';
    });
  });

  return { rows: rows, delimiter: delimiter };
}

// Κρατάμε αυτό το όνομα για backwards compatibility, αν το καλεί κάπου αλλού.
function parseSemicolonCsv_(text) {
  return parsePriceCsv_(text).rows;
}

function parseBedsDate_(value) {
  const s = String(value || '').trim().replace(/\s+/g, ' ');
  if (!s) return '';

  let m = s.match(/^(?:[A-Za-z]{3}\s+)?(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (m) {
    const mon = { Jan:'01', Feb:'02', Mar:'03', Apr:'04', May:'05', Jun:'06', Jul:'07', Aug:'08', Sep:'09', Oct:'10', Nov:'11', Dec:'12' }[m[2]];
    return mon ? m[3] + '-' + mon + '-' + String(Number(m[1])).padStart(2, '0') : '';
  }

  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return s;

  return '';
}

function normalizePriceValue_(value) {
  if (value === '' || value == null) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const s = String(value).replace(/[^\d.,-]/g, '').replace(',', '.').trim();
  const n = Number(s);
  return isNaN(n) ? 0 : n;
}

function getBookings_(token) {
  /****************************************************************
   * BOOKING FETCH STRATEGY
   * --------------------------------------------------------------
   * Τραβάμε κρατήσεις:
   * - από σήμερα - BOOKINGS_FETCH_DAYS_BACK
   * - έως σήμερα + BOOKINGS_FETCH_DAYS_AHEAD
   *
   * Αυτό είναι σημαντικό γιατί μια κράτηση μπορεί να έχει arrival
   * πριν από σήμερα αλλά να μένει ακόμα μέσα στο ξενοδοχείο.
   ****************************************************************/
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const fetchStartDate = new Date(today);
  fetchStartDate.setDate(fetchStartDate.getDate() - BOOKINGS_FETCH_DAYS_BACK);

  const finalEndDate = new Date(today);
  finalEndDate.setDate(finalEndDate.getDate() + BOOKINGS_FETCH_DAYS_AHEAD);

  let chunkStart = new Date(fetchStartDate);
  let allBookings = [];
  let chunkIndex = 0;

  while (chunkStart < finalEndDate) {
    const chunkEnd = new Date(chunkStart);
    chunkEnd.setDate(chunkEnd.getDate() + BOOKINGS_FETCH_CHUNK_DAYS);
    if (chunkEnd > finalEndDate) chunkEnd.setTime(finalEndDate.getTime());

    const fromDate = formatDate_(chunkStart);
    const toDate = formatDate_(chunkEnd);

    let url = 'https://api.beds24.com/v2/bookings?propertyId=' + PROPERTY_ID +
      '&arrivalFrom=' + encodeURIComponent(fromDate) +
      '&arrivalTo=' + encodeURIComponent(toDate);

    Logger.log('Fetching booking chunk #' + (chunkIndex + 1) + ' from ' + fromDate + ' to ' + toDate);

    while (url) {
      const response = UrlFetchApp.fetch(url, {
        method: 'get',
        muteHttpExceptions: true,
        headers: {
          accept: 'application/json',
          token: token
        }
      });

      if (response.getResponseCode() >= 300) {
        throw new Error(
          'Beds24 API Error: ' + response.getResponseCode() +
          ' for range ' + fromDate + ' to ' + toDate +
          ' - ' + response.getContentText()
        );
      }

      const parsed = JSON.parse(response.getContentText());
      const pageData = Array.isArray(parsed)
        ? parsed
        : (parsed && Array.isArray(parsed.data) ? parsed.data : []);

      allBookings = allBookings.concat(pageData);

      if (parsed && parsed.pages && parsed.pages.nextPageExists && parsed.pages.nextPageLink) {
        url = parsed.pages.nextPageLink;
        Utilities.sleep(500);
      } else {
        url = null;
      }
    }

    chunkStart = new Date(chunkEnd);
    chunkStart.setDate(chunkStart.getDate() + 1);
    chunkIndex++;
    Utilities.sleep(500);
  }

  Logger.log('Total bookings fetched before dedupe: ' + allBookings.length);

  const seen = {};
  const deduped = [];

  allBookings.forEach(function(b) {
    const id = String(b && (b.id || b.bookId) ? (b.id || b.bookId) : '');
    if (!id) return;
    if (seen[id]) return;
    seen[id] = true;
    deduped.push(b);
  });

  Logger.log('Total bookings fetched after dedupe: ' + deduped.length);

  return {
    success: true,
    type: 'booking',
    count: deduped.length,
    fetchWindow: {
      fromDate: formatDate_(fetchStartDate),
      toDate: formatDate_(finalEndDate),
      daysBack: BOOKINGS_FETCH_DAYS_BACK,
      daysAhead: BOOKINGS_FETCH_DAYS_AHEAD,
      chunkDays: BOOKINGS_FETCH_CHUNK_DAYS
    },
    data: deduped
  };
}

function normalizeBookings_(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  if (resp && Array.isArray(resp.bookings)) return resp.bookings;
  return [];
}



/******************************************************************
 * BOOKING CONTACT HELPERS
 * Βρίσκει email / τηλέφωνο μέσα στο raw booking object του Beds24.
 * Τα στοιχεία μπορεί να έρχονται είτε στο root είτε σε nested objects
 * όπως invoicee, guest, guests, customer, contact κτλ.
 ******************************************************************/
function findFirstBookingValue_(obj, keyMatchers, valueMatcher, maxDepth) {
  maxDepth = typeof maxDepth === 'number' ? maxDepth : 4;
  const seen = [];

  function walk(value, depth) {
    if (value === null || value === undefined || depth > maxDepth) return '';

    if (typeof value === 'string' || typeof value === 'number') {
      const text = String(value).trim();
      if (text && valueMatcher && valueMatcher(text)) return text;
      return '';
    }

    if (typeof value !== 'object') return '';
    if (seen.indexOf(value) !== -1) return '';
    seen.push(value);

    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        const fromArray = walk(value[i], depth + 1);
        if (fromArray) return fromArray;
      }
      return '';
    }

    const keys = Object.keys(value);

    // Πρώτα ψάχνουμε με βάση το όνομα του πεδίου.
    for (var k = 0; k < keys.length; k++) {
      const key = keys[k];
      const lowKey = String(key || '').toLowerCase();
      if (!keyMatchers.some(function(matcher) { return matcher(lowKey); })) continue;

      const direct = value[key];
      if (direct !== null && direct !== undefined) {
        const text = String(direct).trim();
        if (text && (!valueMatcher || valueMatcher(text))) return text;
      }
    }

    // Μετά ψάχνουμε recursive, γιατί το Beds24 μπορεί να τα βάζει nested.
    for (var n = 0; n < keys.length; n++) {
      const nested = walk(value[keys[n]], depth + 1);
      if (nested) return nested;
    }

    return '';
  }

  return walk(obj, 0);
}

function getBookingEmail_(b) {
  return findFirstBookingValue_(
    b,
    [
      function(k) { return k === 'email'; },
      function(k) { return k.indexOf('email') !== -1; },
      function(k) { return k === 'mail'; }
    ],
    function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()); },
    5
  );
}

function getBookingPhone_(b) {
  return findFirstBookingValue_(
    b,
    [
      function(k) { return k === 'phone'; },
      function(k) { return k === 'mobile'; },
      function(k) { return k === 'telephone'; },
      function(k) { return k.indexOf('phone') !== -1; },
      function(k) { return k.indexOf('mobile') !== -1; },
      function(k) { return k.indexOf('telephone') !== -1; },
      function(k) { return k.indexOf('tel') !== -1; }
    ],
    function(v) {
      const digits = String(v).replace(/\D/g, '');
      return digits.length >= 6;
    },
    5
  );
}

function buildOccupiedMap_(bookings) {
  const map = {};

  bookings.forEach(function(b) {
    if (!b.roomId || !b.unitId || !b.arrival || !b.departure || String(b.status).toLowerCase() === 'cancelled') return;

    const arr = parseIsoDate_(b.arrival);
    const dep = parseIsoDate_(b.departure);

    const numAdult = Number(b.numAdult || 0);
    const numChild = Number(b.numChild || 0);
    const totalGuests = numAdult + numChild;
    const referrer = getBookingReferrer_(b);

    const guestFromFirstLast = (
      safeSheetCell_(b.firstName || '', 200) + ' ' +
      safeSheetCell_(b.lastName || '', 200)
    ).trim();

    const guestName = guestFromFirstLast || safeSheetCell_(b.guestName || '', 300);
    const guestEmail = getBookingEmail_(b);
    const guestPhone = getBookingPhone_(b);
    const charges = buildBookingChargeSummary_(b);

    if (arr && dep) {
      for (let d = new Date(arr); d < dep; d.setDate(d.getDate() + 1)) {
        map[formatDate_(d) + '|' + b.roomId + '|' + b.unitId] = {
          bookingId: safeSheetCell_(b.id || b.bookId, 100),
          status: safeSheetCell_(b.status, 100),
          guest: safeSheetCell_(guestName, 300),
          numAdult: Number.isFinite(numAdult) ? numAdult : 0,
          numChild: Number.isFinite(numChild) ? numChild : 0,
          totalGuests: Number.isFinite(totalGuests) ? totalGuests : 0,
          email: safeSheetCell_(guestEmail, 300),
          phone: safeSheetCell_(guestPhone, 100),
          mobile: safeSheetCell_(guestPhone, 100),
          guestEmail: safeSheetCell_(guestEmail, 300),
          guestPhone: safeSheetCell_(guestPhone, 100),
          referrer: safeSheetCell_(referrer, 200),
          channel: safeSheetCell_(referrer, 200),
          source: safeSheetCell_(referrer, 200),

          bookingTotal: charges.bookingTotal,
          roomChargeTotal: charges.roomChargeTotal,
          taxTotal: charges.taxTotal,
          deposit: charges.deposit,
          commission: charges.commission,
          rateDescription: safeSheetCell_(charges.rateDescription, 300),
          bookingChargeLines: safeSheetCell_(JSON.stringify(charges.bookingChargeLines), 1000)
        };
      }
    }
  });

  return map;
}
function buildUnitsMapFromFixedMappingAndBookings_(bookings) {
  const unitsMap = getFixedMapping_();
  bookings.forEach(function(b) {
    if (b.roomId && b.unitId && !unitsMap[b.roomId + '|' + b.unitId]) {
      unitsMap[b.roomId + '|' + b.unitId] = { roomId: b.roomId, roomName: getRoomNameById_(b.roomId), unitId: b.unitId, unitName: b.unitId };
    }
  });
  return unitsMap;
}

function writeMappingSheet_(sheet, unitsMap) {
  const rows = [['roomId', 'roomName', 'unitId', 'unitName']];
  Object.keys(unitsMap).sort(sortUnitKeys_(unitsMap)).forEach(function(key) {
    const u = unitsMap[key];
    rows.push([safeSheetCell_(u.roomId, 100), safeSheetCell_(u.roomName, 200), safeSheetCell_(u.unitId, 100), safeSheetCell_(u.unitName, 200)]);
  });
  clearSheet_(sheet);
  sheet.getRange(1, 1, rows.length, 4).setValues(rows);
}

function writeAvailabilitySheet_(sheet, unitsMap, occupiedMap, prices) {
  const roomIds = Object.keys(prices || {});
  if (roomIds.length === 0) {
    clearSheet_(sheet);
    sheet.getRange(1, 1).setValue('No prices found');
    return;
  }

  const dates = getRollingCalendarDates_(prices);
  const rows = [[
    'date',
    'roomId',
    'roomName',
    'unitId',
    'unitName',
    'price',
    'bookingTotal',
    'roomChargeTotal',
    'taxTotal',
    'deposit',
    'commission',
    'rateDescription',
    'bookingChargeLines',
    'available',
    'reason',
    'bookingId',
    'status',
    'guest',
    'numAdult',
    'numChild',
    'totalGuests',
    'email',
    'phone',
    'mobile',
    'guestEmail',
    'guestPhone',
    'referrer',
    'channel',
    'source'
  ]];

  Object.keys(unitsMap).sort(sortUnitKeys_(unitsMap)).forEach(function(k) {
    const u = unitsMap[k];

    dates.forEach(function(d) {
      const occ = occupiedMap[d + '|' + u.roomId + '|' + u.unitId];
      const price = getRoomPrice_(prices, u.roomId, d);

      let avail = 'YES';
      let reason = 'PRICE_OK';

      if (occ) {
        avail = 'NO';
        reason = 'BOOKED';
      } else if (!price || isClosedByBeds24_(u.roomId, d)) {
        avail = 'NO';
        reason = 'CLOSED';
      }

      rows.push([
        d,
        safeSheetCell_(u.roomId, 100),
        safeSheetCell_(u.roomName, 200),
        safeSheetCell_(u.unitId, 100),
        safeSheetCell_(u.unitName, 200),
        price,

        occ ? occ.bookingTotal : '',
        occ ? occ.roomChargeTotal : '',
        occ ? occ.taxTotal : '',
        occ ? occ.deposit : '',
        occ ? occ.commission : '',
        occ ? safeSheetCell_(occ.rateDescription, 300) : '',
        occ ? safeSheetCell_(occ.bookingChargeLines, 1000) : '',

        avail,
        reason,
        occ ? safeSheetCell_(occ.bookingId, 100) : '',
        occ ? safeSheetCell_(occ.status, 100) : '',
        occ ? safeSheetCell_(occ.guest, 300) : '',
        occ ? Number(occ.numAdult || 0) : '',
        occ ? Number(occ.numChild || 0) : '',
        occ ? Number(occ.totalGuests || 0) : '',
        occ ? safeSheetCell_(occ.email, 300) : '',
        occ ? safeSheetCell_(occ.phone, 100) : '',
        occ ? safeSheetCell_(occ.mobile, 100) : '',
        occ ? safeSheetCell_(occ.guestEmail, 300) : '',
        occ ? safeSheetCell_(occ.guestPhone, 100) : '',
        occ ? safeSheetCell_(occ.referrer, 200) : '',
        occ ? safeSheetCell_(occ.channel, 200) : '',
        occ ? safeSheetCell_(occ.source, 200) : ''
      ]);
    });
  });

  clearSheet_(sheet);
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  return rows;
}
function buildCalendar_(sheet, unitsMap, prices, occupiedMap) {
  const roomIds = Object.keys(prices || {});
  if (roomIds.length === 0) {
    clearSheet_(sheet);
    sheet.getRange(1, 1).setValue('No prices found');
    return;
  }

  const dates = getRollingCalendarDates_(prices);
  const rows = [['roomId', 'roomName', 'unitId', 'unitName', 'label'].concat(dates)];

  Object.keys(unitsMap).sort(sortUnitKeys_(unitsMap)).forEach(function(k) {
    const u = unitsMap[k];
    const row = [u.roomId, u.roomName, u.unitId, u.unitName, u.roomName + ' / ' + u.unitName];
    dates.forEach(function(d) {
      const occ = occupiedMap[d + '|' + u.roomId + '|' + u.unitId];
      const price = getRoomPrice_(prices, u.roomId, d);
      row.push(occ ? 'BOOKED' : ((!price || isClosedByBeds24_(u.roomId, d)) ? 'CLOSED' : Number(price)));
    });
    rows.push(row.map(function(v) { return typeof v === 'string' ? safeSheetCell_(v, 1000) : v; }));
  });

  clearSheet_(sheet);
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  applyCalendarFormatting_(sheet, rows.length, rows[0].length);
}

function getAllPriceDates_(prices) {
  const dateSet = {};
  Object.keys(prices || {}).forEach(function(roomId) {
    Object.keys(prices[roomId] || {}).forEach(function(dateStr) {
      dateSet[dateStr] = true;
    });
  });
  return Object.keys(dateSet).sort();
}

/******************************************************************
 * ΚΥΛΙΟΜΕΝΕΣ ΗΜΕΡΟΜΗΝΙΕΣ ΗΜΕΡΟΛΟΓΙΟΥ
 * Ένωση: όλες οι ημερομηνίες του αρχείου τιμών + σήμερα - DAYS_BACK
 * έως σήμερα + DAYS_AHEAD. Έτσι δεν χάνεται καμία ημερομηνία που
 * υπάρχει ήδη, και το ημερολόγιο μετακινείται μόνο του κάθε μέρα.
 ******************************************************************/

function getRollingCalendarDates_(prices) {
  const dateSet = {};

  getAllPriceDates_(prices).forEach(function(dateStr) {
    dateSet[dateStr] = true;
  });

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  for (var i = -CALENDAR_ROLLING_DAYS_BACK; i <= CALENDAR_ROLLING_DAYS_AHEAD; i++) {
    dateSet[formatDate_(addDays_(today, i))] = true;
  }

  return Object.keys(dateSet).sort();
}

function getLastPricedDate_(prices) {
  let last = '';
  Object.keys(prices || {}).forEach(function(roomId) {
    Object.keys(prices[roomId] || {}).forEach(function(dateStr) {
      if (Number(prices[roomId][dateStr]) > 0 && dateStr > last) last = dateStr;
    });
  });
  return last;
}

function getRoomPrice_(prices, rId, dStr) {
  return (prices[rId] && prices[rId][dStr]) ? Number(prices[rId][dStr]) : 0;
}

function writeRateCache_(sh, prices) {
  clearSheet_(sh);

  const roomIds = Object.keys(prices || {}).sort();
  if (roomIds.length === 0) {
    sh.getRange(1, 1).setValue('No rate cache data');
    return;
  }

  const dates = getAllPriceDates_(prices);
  const rows = [['roomId'].concat(dates)];

  roomIds.forEach(function(roomId) {
    const row = [roomId];
    dates.forEach(function(dateStr) {
      row.push(prices[roomId] && Object.prototype.hasOwnProperty.call(prices[roomId], dateStr) ? prices[roomId][dateStr] : '');
    });
    rows.push(row);
  });

  sh.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
}

function getRoomNameById_(roomId) {
  return {
    '265595': 'Apartment',
    '267788': 'First Floor Double Room',
    '268803': 'Economy Double Room',
    '626129': 'Ground Floor Room',
    '345347': 'Apt 11'
  }[String(roomId)] || '';
}

function getFixedMapping_() {
  const rows = [
    ['268803', 'Economy Double Room', '1', '2'],
    ['268803', 'Economy Double Room', '2', '6'],
    ['626129', 'Ground Floor Room', '1', '5'],
    ['626129', 'Ground Floor Room', '2', '7'],
    ['267788', 'First Floor Double Room', '1', '1'],
    ['267788', 'First Floor Double Room', '2', '3'],
    ['267788', 'First Floor Double Room', '3', '4'],
    ['265595', 'Apartment', '1', '8'],
    ['265595', 'Apartment', '2', '9'],
    ['265595', 'Apartment', '3', '10'],
    ['345347', 'Apt 11', '1', '11']
  ];

  const map = {};
  rows.forEach(function(r) {
    map[r[0] + '|' + r[2]] = { roomId: r[0], roomName: r[1], unitId: r[2], unitName: r[3] };
  });
  return map;
}

function sortUnitKeys_(uMap) {
  return function(a, b) {
    return Number(uMap[a].roomId) !== Number(uMap[b].roomId)
      ? Number(uMap[a].roomId) - Number(uMap[b].roomId)
      : Number(uMap[a].unitId) - Number(uMap[b].unitId);
  };
}

function applyCalendarFormatting_(sheet, numRows, numCols) {
  if (!sheet || numRows < 2 || numCols < 6) return;

  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(5);
  sheet.getRange(1, 1, 1, numCols).setFontWeight('bold');
  sheet.autoResizeColumns(1, Math.min(numCols, 10));
}

function buildDateColumnMap_(headers) {
  const map = {};
  for (var c = 5; c < headers.length; c++) {
    const normalized = normalizeHeaderDate(headers[c]);
    if (normalized) map[normalized] = c;
  }
  return map;
}

function findUnitRowFast_(data, roomId, unitId) {
  const key = String(Number(roomId)) + '_' + String(Number(unitId));
  return data && data.unitRowMap ? (data.unitRowMap[key] || null) : null;
}

function findUnitRow_(values, roomId, unitId) {
  for (var r = 1; r < values.length; r++) {
    if (String(Number(values[r][0])) === String(Number(roomId)) && String(Number(values[r][2])) === String(Number(unitId))) return values[r];
  }
  return null;
}

function getDateRangeExclusive_(checkin, checkout) {
  const out = [];
  const start = parseIsoDate_(checkin);
  const end = parseIsoDate_(checkout);
  if (!start || !end) return out;

  for (var d = new Date(start); d < end; d.setDate(d.getDate() + 1)) out.push(formatDate_(d));
  return out;
}

function parseIsoDate_(value) {
  if (!value) return null;
  const m = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return (d.getFullYear() === Number(m[1]) && d.getMonth() === Number(m[2]) - 1 && d.getDate() === Number(m[3])) ? d : null;
}

function formatDate_(d) { return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function round2_(n) { return Math.round(n * 100) / 100; }
function jsonOutput_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function jsonOutput(obj) { return jsonOutput_(obj); }
function getOrCreateSheet_(ss, name) { let sh = ss.getSheetByName(name); if (!sh) sh = ss.insertSheet(name); return sh; }
function clearSheet_(sh) { sh.clearContents(); sh.clearFormats(); }

function safeSheetCell_(value, maxLen) {
  maxLen = maxLen || 1000;
  if (value === null || value === undefined) return '';

  let text;
  if (typeof value === 'object') {
    try { text = JSON.stringify(value); } catch (e) { text = String(value); }
  } else {
    text = String(value);
  }

  // Προστασία από spreadsheet formula injection σε external data όπως guest names.
  if (/^[=+\-@]/.test(text)) text = "'" + text;

  if (text.length > maxLen) return text.substring(0, maxLen) + '... [TRUNCATED]';
  return text;
}

function writeJsonToSheet_(sheet, obj, title) {
  clearSheet_(sheet);

  sheet.getRange(1, 1).setValue(title);

  if (obj && typeof obj === 'object') {
    sheet.getRange(2, 1).setValue('success');
    sheet.getRange(2, 2).setValue(obj.success === true);

    sheet.getRange(3, 1).setValue('type');
    sheet.getRange(3, 2).setValue(safeSheetCell_(obj.type || '', 200));

    sheet.getRange(4, 1).setValue('count');
    sheet.getRange(4, 2).setValue(obj.count || 0);

    if (obj.fetchWindow) {
      sheet.getRange(5, 1).setValue('fromDate');
      sheet.getRange(5, 2).setValue(obj.fetchWindow.fromDate || '');
      sheet.getRange(6, 1).setValue('toDate');
      sheet.getRange(6, 2).setValue(obj.fetchWindow.toDate || '');
      sheet.getRange(7, 1).setValue('daysAhead');
      sheet.getRange(7, 2).setValue(obj.fetchWindow.daysAhead || '');
      sheet.getRange(8, 1).setValue('chunkDays');
      sheet.getRange(8, 2).setValue(obj.fetchWindow.chunkDays || '');
    }

    sheet.getRange(10, 1).setValue('FULL JSON TRUNCATED');
    sheet.getRange(11, 1).setValue(safeSheetCell_(obj, 49000));
    sheet.getRange(11, 1).setWrap(true);
    sheet.setColumnWidth(1, 900);
    sheet.setColumnWidth(2, 180);
  } else {
    sheet.getRange(2, 1).setValue(safeSheetCell_(obj, 49000));
  }
}

function refreshLastMinuteDefaultCacheNoLock_() {
  const peopleList = [2];
  peopleList.forEach(function(people) {
    PropertiesService.getScriptProperties().setProperty(getLastMinuteCacheKey_(people), JSON.stringify(buildLastMinuteCacheData_(people)));
  });
  console.log('Last Minute default cache refreshed successfully.');
}

function refreshLastMinuteDefaultCache() {
  const startedMs = Date.now();
  const lock = acquireScriptLockOrSkip_('refreshLastMinuteDefaultCache', LOCK_WAIT_MS);
  if (!lock) return;

  try {
    resetExecutionCaches_();
    refreshLastMinuteDefaultCacheNoLock_();
  } finally {
    logRuntime_('refreshLastMinuteDefaultCache', startedMs);
    lock.releaseLock();
  }
}

function setupLastMinuteTrigger() {
  // Προαιρετικό. Συνήθως ΔΕΝ χρειάζεται, γιατί το refreshSystem ήδη ανανεώνει το cache.
  deleteExistingTriggers_(['refreshLastMinuteDefaultCache']);
  ScriptApp.newTrigger('refreshLastMinuteDefaultCache').timeBased().everyMinutes(15).create();
  console.log('Last Minute trigger created.');
}

/******************************************************************
 * APP 3: TURKISH MARKET DEALS (HOLIDAYS & WEEKENDS)
 ******************************************************************/

const TURKISH_CONFIG = {
  periods: {
    '23-nisan': { start: '2026-04-22', end: '2026-04-27' },
    '1-mayis': { start: '2026-04-30', end: '2026-05-04' },
    '19-mayis': { start: '2026-05-15', end: '2026-05-20' },
    'kurban-bayrami': { start: '2026-05-22', end: '2026-06-01' },
    '15-temmuz': { start: '2026-07-10', end: '2026-07-20' },
    '30-agustos': { start: '2026-08-27', end: '2026-08-31' },
    '29-ekim': { start: '2026-10-28', end: '2026-11-02' }
  },
  weekendsEndDate: '2026-10-30',
  weekendsOffsetDays: 8
};

function getTurkishCacheKey_(people) { return 'TURKISH_DEALS_CACHE_' + String(people); }

function clearTurkishCache() {
  const props = PropertiesService.getScriptProperties();
  [2, 3, 4].forEach(function(people) { props.deleteProperty(getTurkishCacheKey_(people)); });
  console.log('Turkish cache cleared successfully.');
}

function getTurkishDeals_(payload) {
  const people = normalizePeople_(payload && payload.people);
  const holiday = String(payload && payload.holiday || '').trim();
  const cacheKey = getTurkishCacheKey_(people);
  const raw = PropertiesService.getScriptProperties().getProperty(cacheKey);

  let data;
  if (raw) {
    try { data = JSON.parse(raw); } catch (e) {}
  }

  if (!data) {
    data = buildTurkishCacheData_(people);
    PropertiesService.getScriptProperties().setProperty(cacheKey, JSON.stringify(data));
  }

  if (holiday && data.holidays && data.holidays[holiday]) {
    return jsonOutput_({ ok: true, success: true, source: raw ? 'CACHE' : 'LIVE', updatedAt: data.updatedAt, days: data.holidays[holiday].days, rooms: data.holidays[holiday].rooms });
  }

  return jsonOutput_({ ok: true, success: true, source: raw ? 'CACHE' : 'LIVE', data: data });
}

function buildTurkishCacheData_(people) {
  const rooms = getLastMinuteRooms_().filter(function(r) { return Number(r.max) >= Number(people); });
  const units = rooms.map(function(r) { return { roomId: r.roomId, unitId: r.unitId }; });
  const oneNightResultsMemo = {};

  function getOneNightResults_(checkin, checkout) {
    const key = checkin + '|' + checkout;
    if (!Object.prototype.hasOwnProperty.call(oneNightResultsMemo, key)) oneNightResultsMemo[key] = computeAvailabilityResults_(checkin, checkout, units);
    return oneNightResultsMemo[key];
  }

  const allData = { updatedAt: new Date().toISOString(), people: people, holidays: {}, weekends: [] };

  Object.keys(TURKISH_CONFIG.periods).forEach(function(key) {
    const p = TURKISH_CONFIG.periods[key];
    allData.holidays[key] = { days: buildDaysArrayForPeriod_(p.start, p.end, getOneNightResults_), rooms: rooms };
  });

  const weekends = buildTurkishFridayStarts_(TURKISH_CONFIG.weekendsEndDate, TURKISH_CONFIG.weekendsOffsetDays);
  weekends.forEach(function(fridayStr) {
    const fridayDate = parseIsoDate_(fridayStr);
    if (!fridayDate) return;

    const saturdayDate = addDays_(fridayDate, 1);
    const sundayDate = addDays_(fridayDate, 2);
    const saturdayStr = formatDate_(saturdayDate);
    const sundayStr = formatDate_(sundayDate);

    allData.weekends.push({
      weekendStart: fridayStr,
      days: [
        { checkin: fridayStr, checkout: saturdayStr, results: getOneNightResults_(fridayStr, saturdayStr) },
        { checkin: saturdayStr, checkout: sundayStr, results: getOneNightResults_(saturdayStr, sundayStr) }
      ],
      rooms: rooms
    });
  });

  return allData;
}

function buildDaysArrayForPeriod_(startStr, endStr, getResultsFn) {
  const days = [];
  const startDate = parseIsoDate_(startStr);
  const endDate = parseIsoDate_(endStr);
  if (!startDate || !endDate) return days;

  for (var d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
    const checkin = formatDate_(d);
    const checkout = formatDate_(addDays_(d, 1));
    const results = getResultsFn(checkin, checkout);
    days.push({ checkin: checkin, checkout: checkout, results: results });
  }

  return days;
}

function buildTurkishFridayStarts_(endDateStr, offsetDays) {
  const out = [];
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const startDate = addDays_(today, Number(offsetDays || 8));
  const endDate = parseIsoDate_(endDateStr);
  if (!endDate) throw new Error('Invalid endDateStr in buildTurkishFridayStarts_');

  const d = new Date(startDate);
  d.setHours(12, 0, 0, 0);

  while (d <= endDate) {
    if (d.getDay() === 5) out.push(formatDate_(d));
    d.setDate(d.getDate() + 1);
  }

  return out;
}

function refreshTurkishCacheNoLock_() {
  const peopleList = [2, 3, 4];
  resetExecutionCaches_();

  peopleList.forEach(function(people) {
    const fresh = buildTurkishCacheData_(people);
    PropertiesService.getScriptProperties().setProperty(getTurkishCacheKey_(people), JSON.stringify(fresh));
  });

  console.log('Turkish Cache refreshed successfully.');
}

function refreshTurkishCache() {
  const startedMs = Date.now();
  const lock = acquireScriptLockOrSkip_('refreshTurkishCache', LOCK_WAIT_MS);
  if (!lock) return;

  try {
    refreshTurkishCacheNoLock_();
  } finally {
    logRuntime_('refreshTurkishCache', startedMs);
    lock.releaseLock();
  }
}

function rebuildTurkishCache() {
  const startedMs = Date.now();
  const lock = acquireScriptLockOrSkip_('rebuildTurkishCache', LOCK_WAIT_MS);
  if (!lock) return;

  try {
    clearTurkishCache();
    refreshTurkishCacheNoLock_();
    console.log('Turkish cache rebuilt successfully.');
  } finally {
    logRuntime_('rebuildTurkishCache', startedMs);
    lock.releaseLock();
  }
}

/******************************************************************
 * APP 4: HOUSEKEEPING
 ******************************************************************/

function hkSetupSheets_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const staysSh = getOrCreateSheet_(ss, HK_STAYS_SHEET);
  const tasksSh = getOrCreateSheet_(ss, HK_TASKS_SHEET);

  if (staysSh.getLastRow() === 0) staysSh.getRange(1, 1, 1, 5).setValues([['stayId', 'room', 'checkIn', 'checkOut', 'createdAt']]);
  if (tasksSh.getLastRow() === 0) tasksSh.getRange(1, 1, 1, 6).setValues([['taskId', 'stayId', 'room', 'date', 'taskType', 'createdAt']]);
}

function hkNormalizeRoom_(value) {
  const room = String(value == null ? '' : value).trim();
  if (!room) return '';
  const n = Number(room);
  if (!Number.isFinite(n)) return '';
  return String(Math.round(n));
}

function hkAddStay_(payload) {
  hkSetupSheets_();

  const room = hkNormalizeRoom_(payload.room);
  const checkIn = String(payload.checkIn || '').trim();
  const checkOut = String(payload.checkOut || '').trim();

  if (!room || !checkIn || !checkOut) return jsonOutput_({ success: false, message: 'Missing fields' });

  const inDate = parseIsoDate_(checkIn);
  const outDate = parseIsoDate_(checkOut);
  if (!inDate || !outDate || outDate <= inDate) return jsonOutput_({ success: false, message: 'Invalid dates' });

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(HK_STAYS_SHEET);
  const stayId = String(new Date().getTime());
  const createdAt = new Date().toISOString();

  sh.appendRow([stayId, room, checkIn, checkOut, createdAt]);
  return jsonOutput_({ success: true, stayId: stayId, room: room, checkIn: checkIn, checkOut: checkOut });
}

function hkAddTask_(payload) {
  hkSetupSheets_();

  const stayId = String(payload.stayId || '').trim();
  const room = hkNormalizeRoom_(payload.room);
  const date = String(payload.date || '').trim();
  const taskType = String(payload.taskType || '').trim();

  if (!stayId || !room || !date || !taskType) return jsonOutput_({ success: false, message: 'Missing fields' });
  if (!parseIsoDate_(date)) return jsonOutput_({ success: false, message: 'Invalid date' });
  if (!Object.prototype.hasOwnProperty.call(HK_TASK_TYPES, taskType)) return jsonOutput_({ success: false, message: 'Invalid task type' });

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(HK_TASKS_SHEET);
  const values = sh.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][1]) === stayId && String(values[i][2]) === room && String(values[i][3]) === date && String(values[i][4]) === taskType) {
      return jsonOutput_({ success: true, duplicate: true });
    }
  }

  const taskId = String(new Date().getTime()) + '_' + Math.floor(Math.random() * 1000);
  const createdAt = new Date().toISOString();
  sh.appendRow([taskId, stayId, room, date, taskType, createdAt]);

  return jsonOutput_({ success: true, taskId: taskId });
}

function hkDeleteTask_(payload) {
  hkSetupSheets_();

  const taskId = String(payload.taskId || '').trim();
  if (!taskId) return jsonOutput_({ success: false, message: 'Missing taskId' });

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(HK_TASKS_SHEET);
  const values = sh.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === taskId) {
      sh.deleteRow(i + 1);
      return jsonOutput_({ success: true });
    }
  }

  return jsonOutput_({ success: false, message: 'Task not found' });
}

function hkGetCalendar_(params) {
  hkSetupSheets_();

  const roomFilterRaw = String((params && params.room) || 'all').trim().toLowerCase();
  const roomFilter = roomFilterRaw === 'all' ? 'all' : hkNormalizeRoom_(roomFilterRaw);

  const daysBackRaw = Number((params && params.daysBack) || 7);
  const daysForwardRaw = Number((params && params.daysForward) || 7);
  const daysBack = Number.isFinite(daysBackRaw) ? Math.max(0, Math.min(60, Math.round(daysBackRaw))) : 7;
  const daysForward = Number.isFinite(daysForwardRaw) ? Math.max(0, Math.min(60, Math.round(daysForwardRaw))) : 7;

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const staysSh = ss.getSheetByName(HK_STAYS_SHEET);
  const tasksSh = ss.getSheetByName(HK_TASKS_SHEET);

  const stays = staysSh.getDataRange().getValues().slice(1);
  const tasks = tasksSh.getDataRange().getValues().slice(1);

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const start = addDays_(today, -daysBack);
  const end = addDays_(today, daysForward);
  const startStr = formatDate_(start);
  const endStr = formatDate_(end);
  const roomMap = {};

  function ensureRoomMap_(room) {
    if (!roomMap[room]) roomMap[room] = {};
    return roomMap[room];
  }

  function pushItem_(room, date, item) {
    const rm = ensureRoomMap_(room);
    if (!rm[date]) rm[date] = [];
    rm[date].push(item);
  }

  stays.forEach(function(row) {
    const stayId = String(row[0] || '');
    const room = hkNormalizeRoom_(row[1]);
    const checkIn = String(row[2] || '').trim();
    const checkOut = String(row[3] || '').trim();

    if (!room) return;
    if (roomFilter !== 'all' && room !== roomFilter) return;

    if (checkIn && checkIn >= startStr && checkIn <= endStr) pushItem_(room, checkIn, { type: 'CHECK_IN', stayId: stayId });
    if (checkOut && checkOut >= startStr && checkOut <= endStr) pushItem_(room, checkOut, { type: 'CHECK_OUT', stayId: stayId });
  });

  tasks.forEach(function(row) {
    const taskId = String(row[0] || '');
    const stayId = String(row[1] || '');
    const room = hkNormalizeRoom_(row[2]);
    const date = String(row[3] || '').trim();
    const taskType = String(row[4] || '').trim();

    if (!room || !date || !taskType) return;
    if (roomFilter !== 'all' && room !== roomFilter) return;
    if (date < startStr || date > endStr) return;

    pushItem_(room, date, { taskId: taskId, stayId: stayId, type: taskType });
  });

  const rooms = Object.keys(roomMap).sort(function(a, b) { return Number(a) - Number(b); }).map(function(room) {
    const dates = Object.keys(roomMap[room]).sort().map(function(date) {
      return { date: date, items: roomMap[room][date] };
    });
    return { room: room, dates: dates };
  });

  return jsonOutput_({ success: true, filter: roomFilter === 'all' ? 'all' : roomFilter, startDate: startStr, endDate: endStr, rooms: rooms });
}

function rebuildOccupancyCalendarNow() {
  refreshSystem();
}


/******************************************************************
 * BOOKING CORE: CANONICAL SOURCE SNAPSHOT
 *
 * Μοναδικό read contract για τη Neon booking_core.
 * Διαβάζει το worksheet "Availability", το οποίο έχει ήδη:
 * - μία γραμμή ανά date / roomId / unitId
 * - reference price ακόμη και όταν reason = BOOKED
 * - available / reason
 *
 * Ασφάλεια συνέπειας:
 * - διαβάζει μόνο όταν το τελευταίο core refresh είναι READY
 * - παίρνει ScriptLock, άρα δεν μπορεί να διαβάσει ενώ το refreshSystem γράφει
 * - αν το προηγούμενο refresh απέτυχε ή εκτελείται τώρα, αποτυγχάνει κλειστά
 *
 * URL:
 *   ?action=booking_core_snapshot
 ******************************************************************/

function buildBookingCoreRowsFromAvailability_(preloadedValues) {
  // Αν το refreshSystem δίνει τα rows που μόλις έγραψε, δεν ξαναδιαβάζουμε όλο το sheet.
  let values;
  if (preloadedValues && preloadedValues.length) {
    values = preloadedValues.map(function(row) {
      return row.map(function(v) {
        // Το Sheets αφαιρεί το αρχικό ' του safeSheetCell_ — κάνουμε το ίδιο.
        return (typeof v === 'string' && v.charAt(0) === "'") ? v.substring(1) : v;
      });
    });
  } else {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = ss.getSheetByName('Availability');
    if (!sh) throw new Error('Sheet Availability not found');
    values = sh.getDataRange().getValues();
  }
  if (!values || values.length < 2) throw new Error('Sheet Availability is empty');

  const headers = values[0].map(function(header) {
    return String(header == null ? '' : header).trim();
  });
  const index = {};
  headers.forEach(function(header, i) {
    if (header) index[header] = i;
  });

  const required = ['date', 'roomId', 'roomName', 'unitId', 'unitName', 'price', 'available', 'reason'];
  const missing = required.filter(function(name) { return index[name] === undefined; });
  if (missing.length) throw new Error('Availability sheet is missing required columns: ' + missing.join(', '));

  const rows = [];
  const invalidRows = [];

  for (var r = 1; r < values.length; r++) {
    const sourceRow = values[r];
    const date = normalizeOccupancySnapshotDate_(sourceRow[index.date]);
    const roomId = String(sourceRow[index.roomId] == null ? '' : sourceRow[index.roomId]).trim();
    const roomName = String(sourceRow[index.roomName] == null ? '' : sourceRow[index.roomName]).trim();
    const unitId = String(sourceRow[index.unitId] == null ? '' : sourceRow[index.unitId]).trim();
    const unitName = String(sourceRow[index.unitName] == null ? '' : sourceRow[index.unitName]).trim();

    if (!date || !roomId || !unitId) continue;

    const rawPrice = sourceRow[index.price];
    const parsedPrice = Number(String(rawPrice == null ? '' : rawPrice).replace(',', '.'));
    const price = Number.isFinite(parsedPrice) && parsedPrice > 0 ? Math.round(parsedPrice * 100) / 100 : null;
    const availableText = String(sourceRow[index.available] == null ? '' : sourceRow[index.available]).trim().toUpperCase();
    const reason = String(sourceRow[index.reason] == null ? '' : sourceRow[index.reason]).trim().toUpperCase();
    const bookingId = index.bookingId === undefined
      ? ''
      : String(sourceRow[index.bookingId] == null ? '' : sourceRow[index.bookingId]).trim();
    const available = availableText === 'YES' || availableText === 'TRUE' || availableText === '1';

    if (available && price === null) {
      invalidRows.push(date + '|' + roomId + '|' + unitId);
      continue;
    }

    rows.push({
      date: date,
      roomId: roomId,
      roomName: roomName,
      unitId: unitId,
      unitName: unitName,
      label: roomName + ' / ' + unitName,
      price: price,
      available: available,
      status: available ? String(price) : (reason || 'CLOSED'),
      reason: reason || (available ? 'PRICE_OK' : 'CLOSED'),
      bookingId: reason === 'BOOKED' ? bookingId : ''
    });
  }

  if (invalidRows.length) {
    throw new Error('Availability contains sellable rows without required reference prices: ' + invalidRows.length);
  }
  if (!rows.length) throw new Error('No canonical booking rows found');

  rows.sort(function(a, b) {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    if (Number(a.roomId) !== Number(b.roomId)) return Number(a.roomId) - Number(b.roomId);
    return Number(a.unitId) - Number(b.unitId);
  });

  return { rows: rows };
}

function computeBookingCoreFingerprint_(rows) {
  const canonical = JSON.stringify((rows || []).map(function(row) {
    return [
      row.date,
      row.roomId,
      row.roomName,
      row.unitId,
      row.unitName,
      row.label,
      row.price,
      row.available === true,
      row.status,
      row.reason,
      row.bookingId || ''
    ];
  }));

  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    canonical,
    Utilities.Charset.UTF_8
  );

  return digest.map(function(byte) {
    const value = byte < 0 ? byte + 256 : byte;
    return ('0' + value.toString(16)).slice(-2);
  }).join('');
}

function buildBookingCoreSnapshotPayloadFromRows_(rows, dataUpdatedAt, sourceRefreshedAt) {
  var minDate = rows[0].date;
  var maxDate = rows[0].date;
  rows.forEach(function(row) {
    if (row.date < minDate) minDate = row.date;
    if (row.date > maxDate) maxDate = row.date;
  });

  return {
    success: true,
    ok: true,
    type: 'booking_core_snapshot',
    schemaVersion: BOOKING_CORE_SCHEMA_VERSION,
    source: 'google_sheet_availability',
    spreadsheetId: SPREADSHEET_ID,
    sheetName: 'Availability',
    refreshState: 'READY',
    generatedAt: new Date().toISOString(),
    sourceRefreshedAt: sourceRefreshedAt || null,
    dataUpdatedAt: dataUpdatedAt,
    range: { minDate: minDate, maxDate: maxDate },
    count: rows.length,
    rows: rows,
    data: rows
  };
}

function pushBookingCoreSnapshotToVercel_(payload) {
  const props = PropertiesService.getScriptProperties();
  const url = String(props.getProperty(BOOKING_CORE_PUSH_URL_PROPERTY) || 'https://chioshotel.gr/api/booking-core/sync/').trim();
  const secret = String(props.getProperty(BOOKING_CORE_PUSH_SECRET_PROPERTY) || '').trim();

  if (!secret) {
    return { ok: false, error: 'Missing Script Property ' + BOOKING_CORE_PUSH_SECRET_PROPERTY };
  }

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + secret
      }
    });

    const status = response.getResponseCode();
    const body = response.getContentText();
    let parsed = null;
    try { parsed = JSON.parse(body); } catch (e) {}

    if (status < 200 || status >= 300 || !parsed || parsed.ok !== true) {
      return { ok: false, error: 'Vercel HTTP ' + status + ': ' + String(body || '').slice(0, 300) };
    }

    return { ok: true, response: parsed };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
}

function getBookingCoreHealth_() {
  const props = PropertiesService.getScriptProperties();
  const refreshState = String(props.getProperty(BOOKING_CORE_REFRESH_STATE_PROPERTY) || '').trim().toUpperCase();
  const lastRefreshCompletedAt = String(props.getProperty(BOOKING_CORE_LAST_REFRESH_COMPLETED_AT_PROPERTY) || '').trim();
  const refreshStartedAt = String(props.getProperty(BOOKING_CORE_REFRESH_STARTED_AT_PROPERTY) || '').trim();
  const lastPushError = String(props.getProperty(BOOKING_CORE_PUSH_ERROR_PROPERTY) || '').trim();
  const priceCsvLastDate = String(props.getProperty(PRICE_CSV_LAST_DATE_PROPERTY) || '').trim();

  return jsonOutput_({
    success: refreshState === 'READY' && !!lastRefreshCompletedAt,
    ok: refreshState === 'READY' && !!lastRefreshCompletedAt,
    type: 'booking_core_health',
    schemaVersion: BOOKING_CORE_SCHEMA_VERSION,
    refreshState: refreshState || 'UNKNOWN',
    refreshStartedAt: refreshStartedAt || null,
    lastRefreshCompletedAt: lastRefreshCompletedAt || null,
    lastPushError: lastPushError || null,
    priceCsvLastDate: priceCsvLastDate || null,
    lastBeds24WebhookAt: String(props.getProperty(BEDS24_WEBHOOK_LAST_AT_PROPERTY) || '') || null,
    calendarDaysAhead: CALENDAR_ROLLING_DAYS_AHEAD,
    generatedAt: new Date().toISOString()
  });
}

function getBookingCoreSnapshot_() {
  const startedMs = Date.now();
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(BOOKING_CORE_SNAPSHOT_LOCK_WAIT_MS)) {
    return jsonOutput_({
      success: false,
      ok: false,
      type: 'booking_core_snapshot',
      schemaVersion: BOOKING_CORE_SCHEMA_VERSION,
      code: 'SOURCE_BUSY',
      error: 'Booking source refresh is currently running',
      generatedAt: new Date().toISOString(),
      rows: [],
      data: []
    });
  }

  try {
    const props = PropertiesService.getScriptProperties();
    const refreshState = String(props.getProperty(BOOKING_CORE_REFRESH_STATE_PROPERTY) || '').trim().toUpperCase();
    const dataUpdatedAt = String(props.getProperty(BOOKING_CORE_DATA_UPDATED_AT_PROPERTY) || '').trim();
    const sourceRefreshedAt = String(props.getProperty(BOOKING_CORE_LAST_REFRESH_COMPLETED_AT_PROPERTY) || '').trim();

    if (refreshState !== 'READY' || !dataUpdatedAt || isNaN(new Date(dataUpdatedAt).getTime())) {
      return jsonOutput_({
        success: false,
        ok: false,
        type: 'booking_core_snapshot',
        schemaVersion: BOOKING_CORE_SCHEMA_VERSION,
        code: refreshState === 'ERROR' ? 'SOURCE_REFRESH_ERROR' : 'SOURCE_NOT_READY',
        error: refreshState === 'ERROR'
          ? String(props.getProperty(BOOKING_CORE_REFRESH_ERROR_PROPERTY) || 'Last source refresh failed')
          : 'Booking source has not completed a successful refresh yet',
        refreshState: refreshState || 'UNKNOWN',
        generatedAt: new Date().toISOString(),
        sourceRefreshedAt: sourceRefreshedAt || null,
        dataUpdatedAt: dataUpdatedAt || null,
        rows: [],
        data: []
      });
    }

    const result = buildBookingCoreRowsFromAvailability_();
    const payload = buildBookingCoreSnapshotPayloadFromRows_(result.rows, dataUpdatedAt, sourceRefreshedAt);
    payload.durationMs = Date.now() - startedMs;
    return jsonOutput_(payload);
  } catch (err) {
    return jsonOutput_({
      success: false,
      ok: false,
      type: 'booking_core_snapshot',
      schemaVersion: BOOKING_CORE_SCHEMA_VERSION,
      code: 'SOURCE_EXCEPTION',
      error: err && err.message ? err.message : String(err),
      generatedAt: new Date().toISOString(),
      rows: [],
      data: []
    });
  } finally {
    lock.releaseLock();
  }
}

/******************************************************************
 * APP 5A: FULL OCCUPANCY SNAPSHOT ENDPOINT
 *
 * Διαβάζει ΟΛΟ το worksheet "occupancy_calendar".
 *
 * Κανόνες:
 * - Αριθμητική τιμή > 0  => available = true, reason = PRICE_OK
 * - BOOKED               => available = false, reason = BOOKED
 * - CLOSED ή κενό        => available = false, reason = CLOSED
 *
 * URL:
 *   ?action=occupancy_snapshot
 *
 * Το endpoint είναι read-only και δεν χρειάζεται secret.
 ******************************************************************/

function getOccupancySnapshot_() {
  const startedMs = Date.now();
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName('occupancy_calendar');

  if (!sh) {
    return jsonOutput_({
      success: false,
      ok: false,
      type: 'occupancy_snapshot',
      count: 0,
      error: 'Sheet occupancy_calendar not found',
      rows: [],
      data: []
    });
  }

  const values = sh.getDataRange().getValues();

  if (!values || values.length < 2) {
    return jsonOutput_({
      success: true,
      ok: true,
      type: 'occupancy_snapshot',
      count: 0,
      generatedAt: new Date().toISOString(),
      rows: [],
      data: []
    });
  }

  const headers = values[0].map(function(header) {
    return normalizeOccupancySnapshotDate_(header);
  });

  const rows = [];

  for (var r = 1; r < values.length; r++) {
    const sourceRow = values[r];

    const roomId = String(sourceRow[0] == null ? '' : sourceRow[0]).trim();
    const roomName = String(sourceRow[1] == null ? '' : sourceRow[1]).trim();
    const unitId = String(sourceRow[2] == null ? '' : sourceRow[2]).trim();
    const unitName = String(sourceRow[3] == null ? '' : sourceRow[3]).trim();
    const label = String(sourceRow[4] == null ? '' : sourceRow[4]).trim();

    if (!roomId || !unitId) continue;

    for (var c = 5; c < headers.length; c++) {
      const date = headers[c];
      if (!date) continue;

      const rawValue = sourceRow[c];
      const normalizedText = String(
        rawValue === null || rawValue === undefined ? '' : rawValue
      ).trim().toUpperCase();

      var price = null;
      var available = false;
      var reason = 'CLOSED';
      var status = normalizedText || 'CLOSED';

      if (normalizedText === 'BOOKED') {
        available = false;
        reason = 'BOOKED';
        price = null;
      } else if (normalizedText === 'CLOSED' || normalizedText === '') {
        available = false;
        reason = 'CLOSED';
        price = null;
      } else {
        const parsedPrice = Number(
          String(rawValue).replace(',', '.').replace(/[^\d.\-]/g, '')
        );

        if (Number.isFinite(parsedPrice) && parsedPrice > 0) {
          available = true;
          reason = 'PRICE_OK';
          price = Math.round(parsedPrice * 100) / 100;
          status = String(price);
        } else {
          available = false;
          reason = 'CLOSED';
          price = null;
        }
      }

      rows.push({
        date: date,
        roomId: roomId,
        roomName: roomName,
        unitId: unitId,
        unitName: unitName,
        label: label,
        value: status,
        status: status,
        price: price,
        available: available,
        reason: reason
      });
    }
  }

  return jsonOutput_({
    success: true,
    ok: true,
    type: 'occupancy_snapshot',
    source: 'google_sheet_occupancy_calendar',
    spreadsheetId: SPREADSHEET_ID,
    sheetName: 'occupancy_calendar',
    generatedAt: new Date().toISOString(),
    count: rows.length,
    durationMs: Date.now() - startedMs,
    rows: rows,
    data: rows
  });
}

function normalizeOccupancySnapshotDate_(value) {
  if (value === null || value === undefined || value === '') return '';

  if (Object.prototype.toString.call(value) === '[object Date]') {
    if (isNaN(value.getTime())) return '';
    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      'yyyy-MM-dd'
    );
  }

  const raw = String(value).trim();
  if (!raw) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  if (/^\d{4}\/\d{2}\/\d{2}$/.test(raw)) {
    return raw.replace(/\//g, '-');
  }

  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) return '';

  return Utilities.formatDate(
    parsed,
    Session.getScriptTimeZone(),
    'yyyy-MM-dd'
  );
}

/******************************************************************
 * APP 5: OCCUPANCY PRICES ENDPOINT
 * Επιστρέφει ΜΟΝΟ τις αριθμητικές τιμές από το occupancy_calendar.
 * Δεν επιστρέφει BOOKED, CLOSED, κενά ή 0.
 * URL:
 *   ?action=occupancy_prices
 ******************************************************************/

function getOccupancyPrices_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName('occupancy_calendar');

  if (!sh) {
    return jsonOutput_({
      success: false,
      type: 'occupancy_prices',
      count: 0,
      error: 'Sheet occupancy_calendar not found',
      data: []
    });
  }

  const values = sh.getDataRange().getValues();

  if (!values || values.length < 2) {
    return jsonOutput_({
      success: true,
      type: 'occupancy_prices',
      count: 0,
      data: []
    });
  }

  const headers = values[0].map(function(h) {
    if (Object.prototype.toString.call(h) === '[object Date]') {
      return Utilities.formatDate(h, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }

    const text = String(h || '').trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      return text;
    }

    const parsed = new Date(text);
    if (!isNaN(parsed.getTime())) {
      return Utilities.formatDate(parsed, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }

    return text;
  });

  const data = [];

  for (var r = 1; r < values.length; r++) {
    const row = values[r];

    const roomId = String(row[0] || '').trim();
    const roomName = String(row[1] || '').trim();
    const unitId = String(row[2] || '').trim();
    const unitName = String(row[3] || '').trim();
    const label = String(row[4] || '').trim();

    if (!roomId || !unitId) continue;

    for (var c = 5; c < headers.length; c++) {
      const date = headers[c];
      const value = row[c];

      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

      const price = Number(value);

      if (Number.isFinite(price) && price > 0) {
        data.push({
          date: date,
          roomId: roomId,
          roomName: roomName,
          unitId: unitId,
          unitName: unitName,
          label: label,
          price: price,
          available: 'YES',
          reason: 'PRICE_OK'
        });
      }
    }
  }

  return jsonOutput_({
    success: true,
    type: 'occupancy_prices',
    count: data.length,
    data: data
  });
}
/******************************************************************
 * TEMP DEBUG: BEDS24 BOOKING CHARGES / INVOICE FINDER
 * Χρήση:
 * ?action=chargeDebug&bookingId=89165262
 ******************************************************************/

function chargeDebug_(bookingId) {
  const token = PropertiesService.getScriptProperties().getProperty('beds24');

  if (!token) {
    return jsonOutput_({
      ok: false,
      error: 'Δεν βρέθηκε Script Property "beds24"'
    });
  }

  bookingId = String(bookingId || '').trim();

  if (!bookingId) {
    return jsonOutput_({
      ok: false,
      error: 'Missing bookingId'
    });
  }

  const url =
    'https://api.beds24.com/v2/bookings?id=' + encodeURIComponent(bookingId) +
    '&includeInvoice=true';

  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: {
      accept: 'application/json',
      token: token
    },
    muteHttpExceptions: true
  });

  const body = response.getContentText();
  let parsed;

  try {
    parsed = JSON.parse(body);
  } catch (e) {
    return jsonOutput_({
      ok: false,
      status: response.getResponseCode(),
      error: 'Non JSON response from Beds24',
      body: body.slice(0, 2000)
    });
  }

  const bookings = Array.isArray(parsed)
    ? parsed
    : (parsed && Array.isArray(parsed.data) ? parsed.data : []);

  const booking = bookings.find(function(b) {
    return String(b.id || b.bookId || b.bookingId || '') === bookingId;
  }) || bookings[0] || null;

  const flattenedCharges = booking ? findChargeLikeObjects_(booking) : [];
  const totals = calculateChargeTotals_(flattenedCharges);

  return jsonOutput_({
    ok: true,
    status: response.getResponseCode(),
    bookingId: bookingId,
    urlUsed: url,
    bookingFound: !!booking,
    bookingKeys: booking ? Object.keys(booking) : [],
    likelyInvoiceKeys: booking ? findLikelyInvoiceKeys_(booking) : [],
    totals: totals,
    flattenedCharges: flattenedCharges.slice(0, 50),
    rawBooking: booking
  });
}

function findLikelyInvoiceKeys_(obj) {
  const out = [];

  function walk(value, path, depth) {
    if (!value || typeof value !== 'object' || depth > 4) return;

    if (Array.isArray(value)) {
      value.forEach(function(item, index) {
        walk(item, path + '[' + index + ']', depth + 1);
      });
      return;
    }

    Object.keys(value).forEach(function(key) {
      const low = String(key).toLowerCase();
      const newPath = path ? path + '.' + key : key;

      if (
        low.indexOf('invoice') !== -1 ||
        low.indexOf('charge') !== -1 ||
        low.indexOf('amount') !== -1 ||
        low.indexOf('total') !== -1 ||
        low.indexOf('price') !== -1 ||
        low.indexOf('payment') !== -1
      ) {
        out.push({
          path: newPath,
          type: Array.isArray(value[key]) ? 'array' : typeof value[key],
          preview: previewValue_(value[key])
        });
      }

      walk(value[key], newPath, depth + 1);
    });
  }

  walk(obj, '', 0);
  return out.slice(0, 100);
}

function findChargeLikeObjects_(obj) {
  const out = [];

  function walk(value, path, depth) {
    if (!value || typeof value !== 'object' || depth > 6) return;

    if (Array.isArray(value)) {
      value.forEach(function(item, index) {
        walk(item, path + '[' + index + ']', depth + 1);
      });
      return;
    }

    const keys = Object.keys(value);

    const hasAmount = keys.some(function(k) {
      const low = String(k).toLowerCase();

      return low === 'amount' ||
             low.indexOf('amount') !== -1 ||
             low.indexOf('price') !== -1 ||
             low.indexOf('total') !== -1;
    });

    const hasDescription = keys.some(function(k) {
      const low = String(k).toLowerCase();

      return low.indexOf('description') !== -1 ||
             low.indexOf('desc') !== -1 ||
             low.indexOf('text') !== -1 ||
             low.indexOf('name') !== -1;
    });

    if (hasAmount || hasDescription) {
      out.push({
        path: path,
        keys: keys,
        object: value
      });
    }

    keys.forEach(function(key) {
      walk(value[key], path ? path + '.' + key : key, depth + 1);
    });
  }

  walk(obj, '', 0);
  return out;
}

function calculateChargeTotals_(chargeObjects) {
  let bookingTotal = 0;
  let roomChargeTotal = 0;
  let taxTotal = 0;
  const foundAmounts = [];

  chargeObjects.forEach(function(item) {
    const obj = item.object || {};
    const amount = extractAmountFromObject_(obj);

    if (amount === null) return;

    const description = extractDescriptionFromObject_(obj);
    const lowDescription = String(description || '').toLowerCase();

    foundAmounts.push({
      path: item.path,
      amount: amount,
      description: description
    });

    bookingTotal += amount;

    if (
      lowDescription.indexOf('tax') !== -1 ||
      lowDescription.indexOf('municipality') !== -1 ||
      lowDescription.indexOf('φόρος') !== -1
    ) {
      taxTotal += amount;
    } else {
      roomChargeTotal += amount;
    }
  });

  return {
    bookingTotal: round2ForChargeDebug_(bookingTotal),
    roomChargeTotal: round2ForChargeDebug_(roomChargeTotal),
    taxTotal: round2ForChargeDebug_(taxTotal),
    foundAmounts: foundAmounts
  };
}

function extractAmountFromObject_(obj) {
  const amountKeys = [
    'amount',
    'amountEur',
    'amountEUR',
    'Amount EUR',
    'price',
    'total',
    'value',
    'charge',
    'lineTotal'
  ];

  for (var i = 0; i < amountKeys.length; i++) {
    const key = amountKeys[i];

    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const n = normalizeChargeAmount_(obj[key]);
      if (n !== null) return n;
    }
  }

  const keys = Object.keys(obj || {});

  for (var k = 0; k < keys.length; k++) {
    const low = String(keys[k]).toLowerCase();

    if (
      low.indexOf('amount') !== -1 ||
      low.indexOf('price') !== -1 ||
      low.indexOf('total') !== -1
    ) {
      const n = normalizeChargeAmount_(obj[keys[k]]);
      if (n !== null) return n;
    }
  }

  return null;
}

function extractDescriptionFromObject_(obj) {
  const descriptionKeys = [
    'description',
    'desc',
    'text',
    'name',
    'title',
    'item',
    'label'
  ];

  for (var i = 0; i < descriptionKeys.length; i++) {
    const key = descriptionKeys[i];

    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = String(obj[key] || '').trim();
      if (value) return value;
    }
  }

  return '';
}

function normalizeChargeAmount_(value) {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const cleaned = String(value)
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.')
    .trim();

  if (!cleaned) return null;

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function previewValue_(value) {
  if (value === null || value === undefined) return value;

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value).slice(0, 500);
    } catch (e) {
      return String(value).slice(0, 500);
    }
  }

  return String(value).slice(0, 500);
}

function round2ForChargeDebug_(n) {
  return Math.round(Number(n || 0) * 100) / 100;
}
function normalizeMoneyForBooking_(value) {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const cleaned = String(value)
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.')
    .trim();

  if (!cleaned) return null;

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}
// updateBookingCorePushSecret() removed from this copy: it hardcoded the
// push secret. Set BOOKING_CORE_PUSH_SECRET in Project Settings > Script
// properties instead.
function buildBookingChargeSummary_(b) {
  const bookingTotal = normalizeMoneyForBooking_(b && b.price);
  const taxRaw = normalizeMoneyForBooking_(b && b.tax);
  const taxTotal = taxRaw === null ? 0 : taxRaw;
  const deposit = normalizeMoneyForBooking_(b && b.deposit);
  const commission = normalizeMoneyForBooking_(b && b.commission);
  const rateDescription = safeSheetCell_((b && b.rateDescription) || '', 300);

  const roomChargeTotal =
    bookingTotal === null ? null : round2_(bookingTotal - taxTotal);

  const bookingChargeLines = [];

  if (roomChargeTotal !== null) {
    bookingChargeLines.push({
      type: 'room',
      description: rateDescription || 'Room / accommodation charge',
      amount: roomChargeTotal,
      currency: 'EUR'
    });
  }

  if (taxTotal) {
    bookingChargeLines.push({
      type: 'tax',
      description: 'Municipality Tax',
      amount: taxTotal,
      currency: 'EUR'
    });
  }

  return {
    bookingTotal: bookingTotal,
    roomChargeTotal: roomChargeTotal,
    taxTotal: taxTotal,
    deposit: deposit,
    commission: commission,
    rateDescription: rateDescription,
    bookingChargeLines: bookingChargeLines
  };
}

/******************************************************************
 * VOULAMANDIS HOUSE — BOOKING SOURCE (Beds24 → Google Sheet → Neon)
 *
 * Ροή:
 *   refreshSystem (Beds24 webhook ~1 λεπτό μετά από κάθε αλλαγή + δίχτυ ασφαλείας κάθε REFRESH_EVERY_HOURS)
 *     → τιμές (Beds24 API, fallback CSV) + κρατήσεις (Beds24 API)
 *     → φύλλα Availability / occupancy_calendar (μόνο όταν άλλαξε κάτι)
 *     → push στο https://chioshotel.gr/api/booking-core/sync/ (μόνο όταν άλλαξε κάτι)
 *
 * Τι διαβάζει το site (chioshotel-next):
 *   GET  ?action=booking_core_snapshot   (pull fallback του /api/booking-core/sync)
 *   POST /api/booking-core/sync/         (push από εδώ)
 * Όλα τα υπόλοιπα endpoints (deals, last-minute, turkish, housekeeping,
 * occupancy_*) υπάρχουν για παλιές σελίδες (Elementor) και υπολογίζονται
 * μόνο όταν ζητηθούν, με cache — δεν επιβαρύνουν πια το refresh.
 *
 * Μία φορά μετά το deploy: τρέξε setupTriggers().
 ******************************************************************/

/******************************************************************
 * ΡΥΘΜΙΣΕΙΣ
 ******************************************************************/

const SPREADSHEET_ID = '1Q4FRcDGWGbEeLJ7OBKGjuUFbGibj0989QzpwZs-MKCM';
const PROPERTY_ID = '117813';
const PRICE_CSV_FOLDER_NAME = 'Beds24_Prices_Uploads';

const SHEET = {
  AVAILABILITY: 'Availability',
  CALENDAR: 'occupancy_calendar',
  RATE_CACHE: 'rate_cache',
  MAPPING: 'mapping',
  DEBUG_PRICES: 'debug_prices',
  DEBUG_BOOKINGS: 'debug_bookings',
  HK_STAYS: 'hk_stays',
  HK_TASKS: 'hk_tasks'
};

// Κυλιόμενο παράθυρο ημερολογίου: σήμερα - DAYS_BACK έως σήμερα + DAYS_AHEAD.
const CALENDAR_DAYS_BACK = 60;
const CALENDAR_DAYS_AHEAD = 540;
const PRICE_CSV_WARNING_DAYS = 120;

// Περιοδικό refresh = μόνο δίχτυ ασφαλείας: κάθε αλλαγή στο Beds24 (κράτηση,
// ακύρωση, τιμή, κλείσιμο) φέρνει ήδη refresh σε ~1 λεπτό μέσω webhook.
// Πιάνει επίσης την αλλαγή ημέρας (το ημερολόγιο προχωράει μία μέρα).
// Επιτρεπτές τιμές: 1, 2, 4, 6, 8, 12.
const REFRESH_EVERY_HOURS = 2;

const LOCK_WAIT_MS = 1000;
const SNAPSHOT_LOCK_WAIT_MS = 3000;

// Τιμές από Beds24 API (price1) από σήμερα και μετά. Αν το API αποτύχει → CSV.
const USE_BEDS24_API_PRICES = true;
// Δωμάτια χωρίς δική τους ημερήσια τιμή στο Beds24.
// Ισόγειο (626129) = Πρώτος Όροφος (267788) - 15€.
const DERIVED_PRICE_RULES = {
  '626129': { fromRoomId: '267788', offset: -15 }
};
// Σταθερή τιμή για όλες τις ημερομηνίες (Apt 11).
const FIXED_PRICES = {
  '345347': 90
};
// Κρατήσεις με αυτά τα status δεν πιάνουν το δωμάτιο.
const IGNORED_BOOKING_STATUSES = ['cancelled', 'inquiry'];

// Όνομα δωματίου στο CSV του Beds24 → roomId.
const ROOM_NAME_TO_ID = {
  'Apartmentbooking.com': '265595',
  'First Floor Double RoomBooking.com': '267788',
  'Economy Double RoomBooking.com': '268803',
  'Ground Floor RoomGround Floor Rate': '626129'
};

const ROOM_TYPE_NAMES = {
  '265595': 'Apartment',
  '267788': 'First Floor Double Room',
  '268803': 'Economy Double Room',
  '626129': 'Ground Floor Room',
  '345347': 'Apt 11'
};

// Η ΜΟΝΑΔΙΚΗ λίστα μονάδων. number = αριθμός δωματίου (= unitName στα φύλλα).
const UNITS = [
  { number: 1,  roomId: '267788', unitId: '1', en: 'Room 1',       el: 'Δωμάτιο 1',     locEn: 'First floor',  locEl: 'Πρώτος όροφος', max: 4 },
  { number: 2,  roomId: '268803', unitId: '1', en: 'Room 2',       el: 'Δωμάτιο 2',     locEn: 'First floor',  locEl: 'Πρώτος όροφος', max: 2 },
  { number: 3,  roomId: '267788', unitId: '2', en: 'Room 3',       el: 'Δωμάτιο 3',     locEn: 'First floor',  locEl: 'Πρώτος όροφος', max: 3 },
  { number: 4,  roomId: '267788', unitId: '3', en: 'Room 4',       el: 'Δωμάτιο 4',     locEn: 'First floor',  locEl: 'Πρώτος όροφος', max: 3 },
  { number: 5,  roomId: '626129', unitId: '1', en: 'Room 5',       el: 'Δωμάτιο 5',     locEn: 'Ground floor', locEl: 'Ισόγειο',       max: 3 },
  { number: 6,  roomId: '268803', unitId: '2', en: 'Room 6',       el: 'Δωμάτιο 6',     locEn: 'Ground floor', locEl: 'Ισόγειο',       max: 2 },
  { number: 7,  roomId: '626129', unitId: '2', en: 'Room 7',       el: 'Δωμάτιο 7',     locEn: 'Ground floor', locEl: 'Ισόγειο',       max: 3 },
  { number: 8,  roomId: '265595', unitId: '1', en: 'Apartment 8',  el: 'Διαμέρισμα 8',  locEn: 'Independent',  locEl: 'Αυτόνομο',      max: 4 },
  { number: 9,  roomId: '265595', unitId: '2', en: 'Apartment 9',  el: 'Διαμέρισμα 9',  locEn: 'Independent',  locEl: 'Αυτόνομο',      max: 4 },
  { number: 10, roomId: '265595', unitId: '3', en: 'Apartment 10', el: 'Διαμέρισμα 10', locEn: 'Independent',  locEl: 'Αυτόνομο',      max: 4 },
  { number: 11, roomId: '345347', unitId: '1', en: 'Apt 11',       el: 'Διαμέρισμα 11', locEn: 'Independent',  locEl: 'Αυτόνομο',      max: 4 }
];

// --- Deals (homepage / last-minute / Turkish) ---
const DEALS_DISCOUNT = 0.15;
const DEALS_ADULTS = 2;
const DEALS_DAYS = 7;
const DEALS_CACHE_SECONDS = 15 * 60;
const TURKISH_CACHE_SECONDS = 30 * 60;

// Ημερομηνίες 2027. Το Kurban Bayramı αλλάζει κάθε χρόνο (σεληνιακό ημερολόγιο):
// επιβεβαίωσέ το από το επίσημο Diyanet πριν τη σεζόν. Το 19 Mayıs 2027 πέφτει
// μέσα στο Kurban Bayramı, γι' αυτό έχουν το ίδιο διάστημα.
const TURKISH_CONFIG = {
  periods: {
    '23-nisan':       { start: '2027-04-22', end: '2027-04-26' },
    '1-mayis':        { start: '2027-04-30', end: '2027-05-03' },
    '19-mayis':       { start: '2027-05-14', end: '2027-05-24' },
    'kurban-bayrami': { start: '2027-05-14', end: '2027-05-24' },
    '15-temmuz':      { start: '2027-07-15', end: '2027-07-19' },
    '30-agustos':     { start: '2027-08-27', end: '2027-08-31' },
    '29-ekim':        { start: '2027-10-28', end: '2027-11-01' }
  },
  weekendsEndDate: '2027-10-31',
  weekendsOffsetDays: 8
};

// --- Script Properties (ονόματα) ---
const PROP = {
  BEDS24_TOKEN: 'beds24',
  PUSH_URL: 'BOOKING_CORE_PUSH_URL',
  PUSH_SECRET: 'BOOKING_CORE_PUSH_SECRET',
  // Προαιρετικό: αν οριστεί, το booking_core_snapshot θέλει ?secret=… (ίδιο με OCCUPANCY_SCRIPT_SECRET στο Vercel).
  SNAPSHOT_SECRET: 'BOOKING_CORE_SNAPSHOT_SECRET',
  // Προαιρετικό: με ?key=… το action=bookings επιστρέφει και στοιχεία επισκεπτών.
  STAFF_API_KEY: 'STAFF_API_KEY',
  WEBHOOK_KEY: 'BEDS24_WEBHOOK_KEY',
  WEBHOOK_LAST_AT: 'BEDS24_WEBHOOK_LAST_AT',
  STATE: 'BOOKING_CORE_REFRESH_STATE',
  STARTED_AT: 'BOOKING_CORE_REFRESH_STARTED_AT',
  ERROR: 'BOOKING_CORE_REFRESH_ERROR',
  DATA_UPDATED_AT: 'BOOKING_CORE_DATA_UPDATED_AT',
  COMPLETED_AT: 'BOOKING_CORE_LAST_REFRESH_COMPLETED_AT',
  OBSERVED_FP: 'BOOKING_CORE_LAST_OBSERVED_FINGERPRINT',
  PUSHED_FP: 'BOOKING_CORE_LAST_PUSHED_FINGERPRINT',
  PUSH_ERROR: 'BOOKING_CORE_PUSH_ERROR',
  SHEETS_HASH: 'SOURCE_SHEETS_HASH',
  PRICE_LAST_DATE: 'PRICE_CSV_LAST_DATE'
};

const BOOKING_CORE_SCHEMA_VERSION = 1;
const DEFAULT_PUSH_URL = 'https://chioshotel.gr/api/booking-core/sync/';

const CACHE = {
  WEBHOOK_PENDING: 'BEDS24_WEBHOOK_REFRESH_PENDING',
  SELF_HEAL: 'BOOKING_CORE_SELF_HEAL_REQUESTED',
  DEALS: 'DEALS_V2',
  LAST_MINUTE: 'LAST_MINUTE_V2_',
  TURKISH: 'TURKISH_V2_'
};

const WEBHOOK_DELAY_MS = 60 * 1000;
const WEBHOOK_RETRY_MS = 2 * 60 * 1000;

const HK_TASK_TYPES = ['CHECK_IN', 'CHECK_OUT', 'TOWELS', 'LINENS', 'TOWELS_LINENS', 'GENERAL'];

/******************************************************************
 * ROUTER
 ******************************************************************/

function doGet(e) {
  const p = (e && e.parameter) || {};
  const action = String(p.action || '').trim();
  try {
    switch (action) {
      case 'ping': return jsonOutput_({ ok: true, pong: true, ts: nowIso_(), source: 'PING' });
      case 'booking_core_snapshot': return getBookingCoreSnapshot_(p);
      case 'booking_core_health': return getBookingCoreHealth_();
      case 'deals':
      case 'cachedDeals': return getDealsResponse_();
      case 'turkish_deals': return getTurkishDeals_(p);
      case 'occupancy_snapshot': return getOccupancySnapshot_();
      case 'occupancy_prices': return getOccupancyPrices_();
      case 'bookings':
      case 'booking': return getCalendarBookings_(p);
      case 'hk_calendar': return hkGetCalendar_(p);
      default: return jsonOutput_({ success: true, message: 'Web app is alive. Use POST actions or valid GET actions.' });
    }
  } catch (err) {
    return jsonOutput_({ ok: false, success: false, error: errorText_(err) });
  }
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const payload = JSON.parse(raw);
    const action = String(payload.action || '').trim();

    switch (action) {
      case 'SYNC_ROOM': return handleBeds24InventoryWebhook_(e, payload);
      case 'ping': return jsonOutput_({ ok: true, pong: true, ts: nowIso_(), source: 'PING' });
      case 'deals':
      case 'cachedDeals': return getDealsResponse_();
      case 'availability': return handleAvailability_(payload);
      case 'occupancy_snapshot': return getOccupancySnapshot_();
      case 'get_last_minute_cache': return getLastMinuteCache_(payload);
      case 'refresh_last_minute_cache': return refreshLastMinuteCache_(payload);
      case 'turkish_deals': return getTurkishDeals_(payload);
      case 'hk_add_stay': return hkAddStay_(payload);
      case 'hk_add_task': return hkAddTask_(payload);
      case 'hk_delete_task': return hkDeleteTask_(payload);
      case 'hk_calendar': return hkGetCalendar_(payload);
      default: return jsonOutput_({ success: false, message: 'Unknown action' });
    }
  } catch (err) {
    return jsonOutput_({ success: false, message: errorText_(err) });
  }
}

/******************************************************************
 * MAIN REFRESH
 ******************************************************************/

function refreshSystem() {
  const startedMs = Date.now();
  const lock = tryScriptLock_('refreshSystem', LOCK_WAIT_MS);
  if (!lock) return false;

  const props = PropertiesService.getScriptProperties();
  let coreReady = false;
  props.setProperty(PROP.STATE, 'UPDATING');
  props.setProperty(PROP.STARTED_AT, nowIso_());
  props.deleteProperty(PROP.ERROR);

  let stepMs = Date.now();
  const step = function(label) {
    console.log('[refreshSystem] ' + label + ': ' + Math.round((Date.now() - stepMs) / 1000) + 's');
    stepMs = Date.now();
  };

  try {
    resetExecutionCaches_();

    const token = props.getProperty(PROP.BEDS24_TOKEN);
    if (!token) throw new Error('Δεν βρέθηκε Script Property "' + PROP.BEDS24_TOKEN + '"');

    // 1. Τιμές
    const csvImport = importPricesFromCsvSafe_();
    let prices = csvImport.prices;
    if (USE_BEDS24_API_PRICES) prices = applyBeds24ApiPrices_(prices, token);

    // Έλεγχος ΠΡΙΝ μπουν οι σταθερές τιμές, αλλιώς δεν αποτυγχάνει ποτέ.
    const lastPriceDate = getLastPricedDate_(prices);
    if (!lastPriceDate) {
      throw new Error('Δεν βρέθηκαν τιμές ούτε από Beds24 API ούτε από CSV (' +
        (csvImport.debug.fileName || csvImport.debug.error || 'χωρίς CSV') + '). Δες το sheet debug_prices.');
    }
    props.setProperty(PROP.PRICE_LAST_DATE, lastPriceDate);
    if (lastPriceDate < formatDate_(addDays_(todayNoon_(), PRICE_CSV_WARNING_DAYS))) {
      console.warn('Οι τιμές τελειώνουν στις ' + lastPriceDate + '. Ανέβασε νεότερες τιμές.');
    }
    applyFixedPrices_(prices);
    step('prices');

    // 2. Κρατήσεις
    const bookingsResp = getBookings_(token);
    step('bookings (' + bookingsResp.count + ')');

    // 3. Γραμμές φύλλων (στη μνήμη)
    const occupiedMap = buildOccupiedMap_(bookingsResp.data);
    const unitsList = buildUnitsList_(bookingsResp.data);
    const dates = getRollingCalendarDates_(prices);
    const availabilityRows = buildAvailabilityRows_(unitsList, dates, occupiedMap, prices);
    step('build rows');

    // 4. Γράψιμο φύλλων μόνο όταν άλλαξε κάτι (η πιο ακριβή δουλειά του refresh).
    const sheetsHash = sha256Hex_(JSON.stringify(availabilityRows));
    const sheetsChanged = sheetsHash !== String(props.getProperty(PROP.SHEETS_HASH) || '');
    if (sheetsChanged) {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      writeJsonToSheet_(getOrCreateSheet_(ss, SHEET.DEBUG_PRICES), csvImport.debug, 'CSV DEBUG');
      writeJsonToSheet_(getOrCreateSheet_(ss, SHEET.DEBUG_BOOKINGS), bookingsResp, 'BOOKINGS DEBUG');
      writeRateCache_(getOrCreateSheet_(ss, SHEET.RATE_CACHE), prices);
      writeMappingSheet_(getOrCreateSheet_(ss, SHEET.MAPPING), unitsList);
      writeRows_(getOrCreateSheet_(ss, SHEET.AVAILABILITY), availabilityRows);
      const calendarSheet = getOrCreateSheet_(ss, SHEET.CALENDAR);
      writeRows_(calendarSheet, buildCalendarRows_(unitsList, dates, occupiedMap, prices));
      formatCalendarSheet_(calendarSheet);
      SpreadsheetApp.flush();
      props.setProperty(PROP.SHEETS_HASH, sheetsHash);
      invalidateDealCaches_();
      step('write sheets');
    } else {
      step('sheets unchanged, write skipped');
    }

    // 5. Booking Core: push στο Vercel μόνο όταν αλλάζει το canonical snapshot.
    const coreRows = buildBookingCoreRowsFromAvailability_(availabilityRows).rows;
    const fingerprint = computeBookingCoreFingerprint_(coreRows);
    const completedAt = nowIso_();
    let dataUpdatedAt = String(props.getProperty(PROP.DATA_UPDATED_AT) || '');

    if (!dataUpdatedAt || fingerprint !== String(props.getProperty(PROP.OBSERVED_FP) || '')) {
      dataUpdatedAt = completedAt;
      props.setProperty(PROP.DATA_UPDATED_AT, dataUpdatedAt);
      props.setProperty(PROP.OBSERVED_FP, fingerprint);
    }

    props.setProperty(PROP.COMPLETED_AT, completedAt);
    props.setProperty(PROP.STATE, 'READY');
    props.deleteProperty(PROP.ERROR);
    coreReady = true;

    if (fingerprint !== String(props.getProperty(PROP.PUSHED_FP) || '')) {
      const pushResult = pushBookingCoreSnapshotToVercel_(
        buildBookingCoreSnapshotPayload_(coreRows, dataUpdatedAt, completedAt)
      );
      if (pushResult.ok) {
        props.setProperty(PROP.PUSHED_FP, fingerprint);
        props.deleteProperty(PROP.PUSH_ERROR);
        console.log('Booking Core pushed to Vercel. Rows: ' + coreRows.length);
      } else {
        props.setProperty(PROP.PUSH_ERROR, String(pushResult.error || 'Unknown push error').slice(0, 500));
        console.error('Booking Core push failed; retry on next refresh: ' + pushResult.error);
      }
    } else {
      console.log('Booking Core unchanged; push skipped.');
    }
    step('Booking Core sync');

    console.log('refreshSystem completed successfully.');
    return true;
  } catch (err) {
    if (!coreReady) {
      props.setProperty(PROP.STATE, 'ERROR');
      props.setProperty(PROP.ERROR, errorText_(err).slice(0, 500));
    }
    throw err;
  } finally {
    console.log('refreshSystem runtime: ' + Math.round((Date.now() - startedMs) / 1000) + 's');
    lock.releaseLock();
  }
}

// Χειροκίνητο: ξαναστέλνει το τρέχον snapshot στο Vercel, ακόμη κι αν δεν άλλαξε.
function forcePushBookingCore() {
  const lock = tryScriptLock_('forcePushBookingCore', 30000);
  if (!lock) throw new Error('Τρέχει refresh αυτή τη στιγμή, δοκίμασε σε λίγο.');
  try {
    const props = PropertiesService.getScriptProperties();
    const rows = buildBookingCoreRowsFromAvailability_().rows;
    const now = nowIso_();
    const result = pushBookingCoreSnapshotToVercel_(buildBookingCoreSnapshotPayload_(
      rows,
      String(props.getProperty(PROP.DATA_UPDATED_AT) || now),
      String(props.getProperty(PROP.COMPLETED_AT) || now)
    ));
    if (!result.ok) throw new Error(result.error || 'Booking Core force push failed');
    const fingerprint = computeBookingCoreFingerprint_(rows);
    props.setProperty(PROP.OBSERVED_FP, fingerprint);
    props.setProperty(PROP.PUSHED_FP, fingerprint);
    console.log(JSON.stringify(result.response));
  } finally {
    lock.releaseLock();
  }
}

/******************************************************************
 * TRIGGERS
 ******************************************************************/

// Τρέξ' το μία φορά μετά το deploy. Σβήνει παλιά/διπλά triggers και φτιάχνει ένα.
function setupTriggers() {
  deleteTriggers_([
    'refreshSystem',
    'runRefreshNow',
    'refreshTurkishCache',
    'refreshLastMinuteDefaultCache',
    'updateDealsCache',
    'rebuildOccupancyCalendarNow'
  ]);
  ScriptApp.newTrigger('refreshSystem').timeBased().everyHours(REFRESH_EVERY_HOURS).create();
  cleanupLegacyProperties_();
  console.log('Trigger: refreshSystem κάθε ' + REFRESH_EVERY_HOURS + ' ώρες. Triggers τώρα: ' +
    ScriptApp.getProjectTriggers().map(function(t) { return t.getHandlerFunction(); }).join(', '));
}

function deleteTriggers_(handlerNames) {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (handlerNames.indexOf(t.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(t);
  });
}

// Τα παλιά caches ήταν σε Script Properties (όριο 9KB/τιμή) — πλέον σε CacheService.
function cleanupLegacyProperties_() {
  const props = PropertiesService.getScriptProperties();
  ['LATEST_DEALS_JSON'].concat(
    [1, 2, 3, 4].map(function(n) { return 'LAST_MINUTE_CACHE_' + n; }),
    [1, 2, 3, 4].map(function(n) { return 'TURKISH_DEALS_CACHE_' + n; })
  ).forEach(function(key) { props.deleteProperty(key); });
}

/******************************************************************
 * BEDS24 INVENTORY WEBHOOK
 * Ρύθμιση μία φορά: τρέξε setupBeds24Webhook και βάλε στο Beds24
 * (Settings > Marketplace > Webhooks) το URL που γράφει στο log.
 ******************************************************************/

function handleBeds24InventoryWebhook_(e, payload) {
  const props = PropertiesService.getScriptProperties();
  const expectedKey = String(props.getProperty(PROP.WEBHOOK_KEY) || '').trim();
  const suppliedKey = String((e && e.parameter && e.parameter.key) || '').trim();
  if (!expectedKey || suppliedKey !== expectedKey) return jsonOutput_({ ok: false, error: 'Unauthorized' });

  props.setProperty(PROP.WEBHOOK_LAST_AT, nowIso_());
  console.log('Beds24 webhook SYNC_ROOM για room ' + String(payload.roomId || '?'));
  return jsonOutput_({ ok: true, scheduled: scheduleRefresh_(WEBHOOK_DELAY_MS) });
}

// Μία εκκρεμής εκτέλεση τη φορά: πολλές ειδοποιήσεις μαζί = ένα refresh.
function scheduleRefresh_(delayMs) {
  const cache = CacheService.getScriptCache();
  if (cache.get(CACHE.WEBHOOK_PENDING)) return false;

  const pending = ScriptApp.getProjectTriggers().some(function(t) {
    return t.getHandlerFunction() === 'runBeds24WebhookRefresh';
  });
  cache.put(CACHE.WEBHOOK_PENDING, '1', 600);
  if (pending) return false;

  ScriptApp.newTrigger('runBeds24WebhookRefresh').timeBased().after(delayMs).create();
  return true;
}

function runBeds24WebhookRefresh() {
  // Καθαρίζει πρώτα, ώστε ειδοποίηση που έρχεται όσο τρέχει να προγραμματίσει νέα εκτέλεση.
  deleteTriggers_(['runBeds24WebhookRefresh']);
  CacheService.getScriptCache().remove(CACHE.WEBHOOK_PENDING);

  if (refreshSystem() === false) {
    console.log('Webhook refresh: άλλο refresh σε εξέλιξη, νέα προσπάθεια σε 2 λεπτά.');
    scheduleRefresh_(WEBHOOK_RETRY_MS);
  }
}

function setupBeds24Webhook() {
  const props = PropertiesService.getScriptProperties();
  let key = String(props.getProperty(PROP.WEBHOOK_KEY) || '').trim();
  if (!key) {
    key = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty(PROP.WEBHOOK_KEY, key);
  }
  const baseUrl = ScriptApp.getService().getUrl();
  if (!baseUrl) {
    console.log('Δεν βρέθηκε URL web app. Κάνε πρώτα Deploy ως Web app και ξανατρέξε.');
    return;
  }
  console.log('Βάλε αυτό το URL στο Beds24 (Settings > Marketplace > Webhooks):\n' + baseUrl + '?key=' + key);
}

/******************************************************************
 * ΤΙΜΕΣ
 ******************************************************************/

// Το CSV είναι πλέον μόνο ιστορικό/fallback: αν λείπει, συνεχίζουμε με το API.
function importPricesFromCsvSafe_() {
  try {
    return importPricesFromCSV_();
  } catch (err) {
    if (!USE_BEDS24_API_PRICES) throw err;
    console.warn('CSV τιμών μη διαθέσιμο, συνέχεια μόνο με Beds24 API: ' + errorText_(err));
    return { prices: {}, debug: { folderName: PRICE_CSV_FOLDER_NAME, error: errorText_(err) } };
  }
}

function importPricesFromCSV_() {
  const folders = DriveApp.getFoldersByName(PRICE_CSV_FOLDER_NAME);
  if (!folders.hasNext()) throw new Error('Δεν βρέθηκε folder: ' + PRICE_CSV_FOLDER_NAME);
  const files = folders.next().getFiles();

  let latestFile = null;
  let latestTime = 0;
  while (files.hasNext()) {
    const file = files.next();
    if (!/\.csv$/i.test(String(file.getName() || ''))) continue;
    const modified = file.getLastUpdated().getTime();
    if (modified > latestTime) {
      latestTime = modified;
      latestFile = file;
    }
  }
  if (!latestFile) throw new Error('Δεν βρέθηκε CSV');

  const parsedCsv = parsePriceCsv_(latestFile.getBlob().getDataAsString('UTF-8'));
  const rows = parsedCsv.rows;
  if (!rows || rows.length < 2) throw new Error('Το CSV είναι άδειο');

  const headers = rows[0];
  const headerDates = headers.map(parseBedsDate_);
  const prices = {};
  const unmatchedNames = {};
  const matchedNames = {};
  let parsedDateHeaders = 0;

  for (let r = 1; r < rows.length; r++) {
    const rawName = String(rows[r][0] || '').trim();
    if (!rawName) continue;
    const roomId = ROOM_NAME_TO_ID[rawName];
    if (!roomId) {
      unmatchedNames[rawName] = true;
      continue;
    }
    matchedNames[rawName] = true;
    if (!prices[roomId]) prices[roomId] = {};
    for (let c = 1; c < headers.length; c++) {
      if (!headerDates[c]) continue;
      parsedDateHeaders++;
      prices[roomId][headerDates[c]] = normalizePriceValue_(rows[r][c]);
    }
  }

  return {
    prices: prices,
    debug: {
      folderName: PRICE_CSV_FOLDER_NAME,
      fileName: latestFile.getName(),
      fileUpdatedAt: latestFile.getLastUpdated().toISOString(),
      totalRows: rows.length,
      totalColumns: headers.length,
      delimiter: parsedCsv.delimiter,
      matchedRoomIds: Object.keys(prices),
      matchedNames: Object.keys(matchedNames),
      unmatchedNames: Object.keys(unmatchedNames),
      parsedDateHeaders: parsedDateHeaders,
      firstTenHeaders: headers.slice(0, 10)
    }
  };
}

// CSV με κόμμα ή ευρωπαϊκό CSV με semicolon.
function parsePriceCsv_(text) {
  const cleaned = String(text || '')
    .replace(/^﻿/, '')
    .replace(/\r\n?/g, '\n')
    .trim();
  if (!cleaned) return { rows: [], delimiter: '' };

  const firstLine = cleaned.split('\n')[0] || '';
  const delimiter = (firstLine.match(/,/g) || []).length >= (firstLine.match(/;/g) || []).length ? ',' : ';';
  const rows = Utilities.parseCsv(cleaned, delimiter).filter(function(row) {
    return row.some(function(cell) { return String(cell || '').trim() !== ''; });
  });
  return { rows: rows, delimiter: delimiter };
}

function parseBedsDate_(value) {
  const s = String(value || '').trim().replace(/\s+/g, ' ');
  if (!s) return '';
  let m = s.match(/^(?:[A-Za-z]{3}\s+)?(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (m) {
    const mon = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }[m[2]];
    return mon ? m[3] + '-' + mon + '-' + String(Number(m[1])).padStart(2, '0') : '';
  }
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? s : '';
}

function normalizePriceValue_(value) {
  if (value === '' || value == null) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const n = Number(String(value).replace(/[^\d.,-]/g, '').replace(',', '.').trim());
  return isNaN(n) ? 0 : n;
}

// Από σήμερα και μετά: τιμή = price1 του Beds24 (ή DERIVED_PRICE_RULES).
// Πριν από σήμερα: μένουν οι τιμές του CSV. Αποτυχία API → CSV όπως είναι.
// Επιστρέφει { prices, noAvailability } όπου noAvailability['roomId|date'] = true
// για μέρες με 0 διαθέσιμα στο Beds24 (οι ελεύθερες μονάδες γράφονται CLOSED).
function applyBeds24ApiPrices_(csvPrices, token) {
  _beds24NoAvailability = {};

  const roomIds = {};
  Object.keys(ROOM_NAME_TO_ID).forEach(function(name) { roomIds[ROOM_NAME_TO_ID[name]] = true; });
  Object.keys(DERIVED_PRICE_RULES).forEach(function(id) {
    roomIds[id] = true;
    roomIds[DERIVED_PRICE_RULES[id].fromRoomId] = true;
  });
  const ids = Object.keys(roomIds);

  const startDate = formatDate_(todayNoon_());
  const endDate = formatDate_(addDays_(todayNoon_(), CALENDAR_DAYS_AHEAD));

  let api;
  try {
    api = fetchBeds24Calendar_(token, ids, startDate, endDate);
  } catch (err) {
    console.error('Beds24 API τιμές απέτυχαν, χρησιμοποιείται το CSV: ' + errorText_(err));
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

  ids.forEach(function(roomId) {
    if (!prices[roomId]) prices[roomId] = {};
    Object.keys(prices[roomId]).forEach(function(d) {
      if (d >= startDate) delete prices[roomId][d];
    });

    const rule = DERIVED_PRICE_RULES[roomId];
    const days = api[roomId];
    Object.keys(days).forEach(function(date) {
      const day = days[date];
      let price = Number(day.price1) || 0;

      if (price > 0) {
        apiPriced++;
      } else if (rule) {
        const src = api[rule.fromRoomId] && api[rule.fromRoomId][date];
        const srcPrice = src ? (Number(src.price1) || 0) : 0;
        if (srcPrice > 0) {
          price = round2_(srcPrice + Number(rule.offset || 0));
          derivedPriced++;
        }
      }

      prices[roomId][date] = price > 0 ? price : 0;
      if (day.numAvail !== undefined && day.numAvail !== null && Number(day.numAvail) <= 0) {
        noAvail[roomId + '|' + date] = true;
      }
    });
  });

  _beds24NoAvailability = noAvail;
  console.log('Beds24 API τιμές: ' + apiPriced + ' price1, ' + derivedPriced + ' από κανόνα, ' +
    Object.keys(noAvail).length + ' μέρες με 0 διαθέσιμα (' + startDate + ' έως ' + endDate + ').');
  return prices;
}

// Συμπληρώνεται από το applyBeds24ApiPrices_ σε κάθε refresh.
let _beds24NoAvailability = {};

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
    const parsed = beds24Get_(url, token, 'calendar');
    if (parsed && parsed.success === false) throw new Error('Beds24 calendar API: ' + JSON.stringify(parsed).slice(0, 300));

    beds24Items_(parsed).forEach(function(item) {
      const roomId = String(item.roomId || '');
      if (!roomId) return;
      if (!result[roomId]) result[roomId] = {};
      (Array.isArray(item.calendar) ? item.calendar : []).forEach(function(range) {
        const from = parseIsoDate_(range.from || range.date);
        const to = parseIsoDate_(range.to || range.date);
        if (!from || !to) return;
        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
          result[roomId][formatDate_(d)] = range;
        }
      });
    });

    url = nextPageUrl_(parsed);
  }
  return result;
}

function applyFixedPrices_(prices) {
  const dates = getAllPriceDates_(prices);
  Object.keys(FIXED_PRICES).forEach(function(roomId) {
    if (!prices[roomId]) prices[roomId] = {};
    dates.forEach(function(date) { prices[roomId][date] = FIXED_PRICES[roomId]; });
  });
  return prices;
}

function getAllPriceDates_(prices) {
  const set = {};
  Object.keys(prices || {}).forEach(function(roomId) {
    Object.keys(prices[roomId] || {}).forEach(function(date) { set[date] = true; });
  });
  return Object.keys(set).sort();
}

function getLastPricedDate_(prices) {
  let last = '';
  Object.keys(prices || {}).forEach(function(roomId) {
    Object.keys(prices[roomId] || {}).forEach(function(date) {
      if (Number(prices[roomId][date]) > 0 && date > last) last = date;
    });
  });
  return last;
}

function getRoomPrice_(prices, roomId, date) {
  return (prices[roomId] && prices[roomId][date]) ? Number(prices[roomId][date]) : 0;
}

// Όλες οι ημερομηνίες του αρχείου τιμών ∪ σήμερα - DAYS_BACK … σήμερα + DAYS_AHEAD.
function getRollingCalendarDates_(prices) {
  const set = {};
  getAllPriceDates_(prices).forEach(function(date) { set[date] = true; });
  const today = todayNoon_();
  for (let i = -CALENDAR_DAYS_BACK; i <= CALENDAR_DAYS_AHEAD; i++) set[formatDate_(addDays_(today, i))] = true;
  return Object.keys(set).sort();
}

/******************************************************************
 * ΚΡΑΤΗΣΕΙΣ
 ******************************************************************/

// Όλες οι κρατήσεις που επικαλύπτουν το παράθυρο (μία κλήση + σελιδοποίηση):
// αναχώρηση μετά την αρχή του παραθύρου και άφιξη πριν το τέλος του.
function getBookings_(token) {
  const fromDate = formatDate_(addDays_(todayNoon_(), -CALENDAR_DAYS_BACK));
  const toDate = formatDate_(addDays_(todayNoon_(), CALENDAR_DAYS_AHEAD));

  let url = 'https://api.beds24.com/v2/bookings?propertyId=' + PROPERTY_ID +
    '&departureFrom=' + fromDate + '&arrivalTo=' + toDate;

  const all = [];
  let pages = 0;
  while (url) {
    if (++pages > 100) throw new Error('Πάρα πολλές σελίδες από το Beds24 bookings API');
    const parsed = beds24Get_(url, token, 'bookings ' + fromDate + '..' + toDate);
    beds24Items_(parsed).forEach(function(b) { all.push(b); });
    url = nextPageUrl_(parsed);
  }

  const seen = {};
  const deduped = all.filter(function(b) {
    const id = String(b && (b.id || b.bookId) ? (b.id || b.bookId) : '');
    if (!id || seen[id]) return false;
    seen[id] = true;
    return true;
  });

  return {
    success: true,
    type: 'booking',
    count: deduped.length,
    fetchWindow: { fromDate: fromDate, toDate: toDate, daysBack: CALENDAR_DAYS_BACK, daysAhead: CALENDAR_DAYS_AHEAD },
    data: deduped
  };
}

function beds24Get_(url, token, label) {
  const resp = UrlFetchApp.fetch(url, {
    method: 'get',
    muteHttpExceptions: true,
    headers: { accept: 'application/json', token: token }
  });
  const code = resp.getResponseCode();
  const body = resp.getContentText();
  if (code >= 300) throw new Error('Beds24 API ' + code + ' (' + label + '): ' + body.slice(0, 300));
  return JSON.parse(body);
}

function beds24Items_(parsed) {
  return Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.data) ? parsed.data : []);
}

function nextPageUrl_(parsed) {
  return (parsed && parsed.pages && parsed.pages.nextPageExists && parsed.pages.nextPageLink)
    ? parsed.pages.nextPageLink
    : null;
}

function isIgnoredBooking_(b) {
  return IGNORED_BOOKING_STATUSES.indexOf(String(b && b.status || '').toLowerCase()) !== -1;
}

function buildOccupiedMap_(bookings) {
  const map = {};

  bookings.forEach(function(b) {
    if (!b.roomId || !b.unitId || !b.arrival || !b.departure || isIgnoredBooking_(b)) return;
    const arr = parseIsoDate_(b.arrival);
    const dep = parseIsoDate_(b.departure);
    if (!arr || !dep) return;

    const numAdult = Number(b.numAdult || 0) || 0;
    const numChild = Number(b.numChild || 0) || 0;
    const referrer = getBookingReferrer_(b);
    const email = getBookingEmail_(b);
    const phone = getBookingPhone_(b);
    const charges = buildBookingChargeSummary_(b);
    const guest = (String(b.firstName || '') + ' ' + String(b.lastName || '')).trim() || String(b.guestName || '');

    // Ένα αντικείμενο ανά κράτηση, κοινό για όλες τις νύχτες της.
    const occ = {
      bookingId: safeSheetCell_(b.id || b.bookId, 100),
      status: safeSheetCell_(b.status, 100),
      guest: safeSheetCell_(guest, 300),
      numAdult: numAdult,
      numChild: numChild,
      totalGuests: numAdult + numChild,
      email: safeSheetCell_(email, 300),
      phone: safeSheetCell_(phone, 100),
      referrer: safeSheetCell_(referrer, 200),
      bookingTotal: charges.bookingTotal,
      roomChargeTotal: charges.roomChargeTotal,
      taxTotal: charges.taxTotal,
      deposit: charges.deposit,
      commission: charges.commission,
      rateDescription: safeSheetCell_(charges.rateDescription, 300),
      bookingChargeLines: safeSheetCell_(JSON.stringify(charges.bookingChargeLines), 1000)
    };

    for (let d = new Date(arr); d < dep; d.setDate(d.getDate() + 1)) {
      map[formatDate_(d) + '|' + b.roomId + '|' + b.unitId] = occ;
    }
  });

  return map;
}

function buildBookingChargeSummary_(b) {
  const bookingTotal = parseMoney_(b && b.price);
  const taxRaw = parseMoney_(b && b.tax);
  const taxTotal = taxRaw === null ? 0 : taxRaw;
  const rateDescription = String((b && b.rateDescription) || '');
  const roomChargeTotal = bookingTotal === null ? null : round2_(bookingTotal - taxTotal);

  const lines = [];
  if (roomChargeTotal !== null) {
    lines.push({ type: 'room', description: rateDescription || 'Room / accommodation charge', amount: roomChargeTotal, currency: 'EUR' });
  }
  if (taxTotal) lines.push({ type: 'tax', description: 'Municipality Tax', amount: taxTotal, currency: 'EUR' });

  return {
    bookingTotal: bookingTotal,
    roomChargeTotal: roomChargeTotal,
    taxTotal: taxTotal,
    deposit: parseMoney_(b && b.deposit),
    commission: parseMoney_(b && b.commission),
    rateDescription: rateDescription,
    bookingChargeLines: lines
  };
}

function parseMoney_(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const cleaned = String(value).replace(/[^\d,.-]/g, '').replace(',', '.').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

// Πηγή κράτησης από τα πεδία που μπορεί να στέλνει το Beds24.
function getBookingReferrer_(b) {
  if (!b || typeof b !== 'object') return '';
  const direct = [b.originalReferrer, b.referrer, b.referer, b.referredBy, b.channel, b.source, b.sourceName,
    b.bookingChannel, b.channelName, b.apiSource, b.origin, b.agent, b.ota, b.partner, b.portal, b.site];
  for (let i = 0; i < direct.length; i++) {
    if (direct[i] !== null && direct[i] !== undefined && String(direct[i]).trim() !== '') return normalizeBookingReferrer_(direct[i]);
  }

  const nestedObjects = [b.referrerInfo, b.channelInfo, b.sourceInfo, b.bookingSource, b.invoicee, b.apiReference];
  const nestedKeys = ['name', 'title', 'type', 'source', 'channel', 'referrer', 'originalReferrer', 'referer'];
  for (let n = 0; n < nestedObjects.length; n++) {
    const obj = nestedObjects[n];
    if (!obj || typeof obj !== 'object') continue;
    for (let k = 0; k < nestedKeys.length; k++) {
      const v = obj[nestedKeys[k]];
      if (v !== null && v !== undefined && String(v).trim() !== '') return normalizeBookingReferrer_(v);
    }
  }
  return '';
}

function normalizeBookingReferrer_(value) {
  const raw = String(value == null ? '' : value).trim();
  const low = raw.toLowerCase();
  if (!raw) return '';
  if (low.indexOf('booking') !== -1 || low.indexOf('b.com') !== -1) return 'Booking.com';
  if (low.indexOf('expedia') !== -1 || low.indexOf('hotels.com') !== -1 || low.indexOf('vrbo') !== -1) return 'Expedia';
  if (low.indexOf('airbnb') !== -1) return 'Airbnb';
  if (low.indexOf('direct') !== -1 || low.indexOf('manual') !== -1 || low.indexOf('website') !== -1) return 'Direct';
  return raw;
}

// Πρώτη τιμή που ταιριάζει, ψάχνοντας πρώτα με όνομα πεδίου και μετά nested.
// Μόνο τιμές πεδίων με κατάλληλο όνομα: αλλιώς π.χ. το roomId (6 ψηφία)
// περνιόταν για τηλέφωνο.
function findFirstBookingValue_(obj, keyMatchers, valueMatcher, maxDepth) {
  const seen = [];
  function walk(value, depth) {
    if (value === null || value === undefined || depth > maxDepth) return '';
    if (typeof value !== 'object' || seen.indexOf(value) !== -1) return '';
    seen.push(value);

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const found = walk(value[i], depth + 1);
        if (found) return found;
      }
      return '';
    }

    const keys = Object.keys(value);
    for (let k = 0; k < keys.length; k++) {
      const lowKey = keys[k].toLowerCase();
      if (!keyMatchers.some(function(m) { return m(lowKey); })) continue;
      const direct = value[keys[k]];
      if (direct === null || direct === undefined || typeof direct === 'object') continue;
      const text = String(direct).trim();
      if (text && valueMatcher(text)) return text;
    }
    for (let n = 0; n < keys.length; n++) {
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
    [function(k) { return k.indexOf('email') !== -1 || k === 'mail'; }],
    function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
    5
  );
}

function getBookingPhone_(b) {
  return findFirstBookingValue_(
    b,
    [function(k) { return k.indexOf('phone') !== -1 || k.indexOf('mobile') !== -1 || k.indexOf('tel') !== -1; }],
    function(v) { return String(v).replace(/\D/g, '').length >= 6; },
    5
  );
}

/******************************************************************
 * ΓΡΑΜΜΕΣ ΦΥΛΛΩΝ
 ******************************************************************/

// Σταθερές μονάδες + όποια επιπλέον μονάδα εμφανιστεί σε κράτηση.
function buildUnitsList_(bookings) {
  const map = {};
  UNITS.forEach(function(u) {
    map[u.roomId + '|' + u.unitId] = { roomId: u.roomId, roomName: ROOM_TYPE_NAMES[u.roomId] || '', unitId: u.unitId, unitName: String(u.number) };
  });
  bookings.forEach(function(b) {
    if (!b.roomId || !b.unitId) return;
    const key = b.roomId + '|' + b.unitId;
    if (!map[key]) {
      map[key] = { roomId: String(b.roomId), roomName: ROOM_TYPE_NAMES[String(b.roomId)] || '', unitId: String(b.unitId), unitName: String(b.unitId) };
    }
  });
  return Object.keys(map).map(function(k) { return map[k]; }).sort(function(a, b) {
    return Number(a.roomId) !== Number(b.roomId) ? Number(a.roomId) - Number(b.roomId) : Number(a.unitId) - Number(b.unitId);
  });
}

function nightStatus_(unit, date, occupiedMap, prices) {
  const occ = occupiedMap[date + '|' + unit.roomId + '|' + unit.unitId];
  const price = getRoomPrice_(prices, unit.roomId, date);
  if (occ) return { occ: occ, price: price, reason: 'BOOKED' };
  if (!price || isClosedByBeds24_(unit.roomId, date)) return { occ: null, price: price, reason: 'CLOSED' };
  return { occ: null, price: price, reason: 'PRICE_OK' };
}

const AVAILABILITY_HEADERS = [
  'date', 'roomId', 'roomName', 'unitId', 'unitName', 'price',
  'bookingTotal', 'roomChargeTotal', 'taxTotal', 'deposit', 'commission', 'rateDescription', 'bookingChargeLines',
  'available', 'reason', 'bookingId', 'status', 'guest', 'numAdult', 'numChild', 'totalGuests',
  'email', 'phone', 'mobile', 'guestEmail', 'guestPhone', 'referrer', 'channel', 'source'
];

function buildAvailabilityRows_(unitsList, dates, occupiedMap, prices) {
  const rows = [AVAILABILITY_HEADERS.slice()];
  unitsList.forEach(function(u) {
    const roomId = safeSheetCell_(u.roomId, 100);
    const roomName = safeSheetCell_(u.roomName, 200);
    const unitId = safeSheetCell_(u.unitId, 100);
    const unitName = safeSheetCell_(u.unitName, 200);

    dates.forEach(function(d) {
      const s = nightStatus_(u, d, occupiedMap, prices);
      const o = s.occ;
      rows.push([
        d, roomId, roomName, unitId, unitName, s.price,
        o ? o.bookingTotal : '', o ? o.roomChargeTotal : '', o ? o.taxTotal : '',
        o ? o.deposit : '', o ? o.commission : '', o ? o.rateDescription : '', o ? o.bookingChargeLines : '',
        s.reason === 'PRICE_OK' ? 'YES' : 'NO', s.reason,
        o ? o.bookingId : '', o ? o.status : '', o ? o.guest : '',
        o ? o.numAdult : '', o ? o.numChild : '', o ? o.totalGuests : '',
        o ? o.email : '', o ? o.phone : '', o ? o.phone : '', o ? o.email : '', o ? o.phone : '',
        o ? o.referrer : '', o ? o.referrer : '', o ? o.referrer : ''
      ]);
    });
  });
  return rows;
}

function buildCalendarRows_(unitsList, dates, occupiedMap, prices) {
  const rows = [['roomId', 'roomName', 'unitId', 'unitName', 'label'].concat(dates)];
  unitsList.forEach(function(u) {
    const row = [u.roomId, u.roomName, u.unitId, u.unitName, u.roomName + ' / ' + u.unitName];
    dates.forEach(function(d) {
      const s = nightStatus_(u, d, occupiedMap, prices);
      row.push(s.reason === 'PRICE_OK' ? Number(s.price) : s.reason);
    });
    rows.push(row);
  });
  return rows;
}

function writeRows_(sheet, rows) {
  sheet.clearContents();
  if (!rows.length) return;
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
}

function writeMappingSheet_(sheet, unitsList) {
  writeRows_(sheet, [['roomId', 'roomName', 'unitId', 'unitName']].concat(unitsList.map(function(u) {
    return [u.roomId, u.roomName, u.unitId, u.unitName];
  })));
}

function writeRateCache_(sheet, prices) {
  const roomIds = Object.keys(prices || {}).sort();
  if (!roomIds.length) {
    writeRows_(sheet, [['No rate cache data']]);
    return;
  }
  const dates = getAllPriceDates_(prices);
  writeRows_(sheet, [['roomId'].concat(dates)].concat(roomIds.map(function(roomId) {
    return [roomId].concat(dates.map(function(d) {
      return Object.prototype.hasOwnProperty.call(prices[roomId], d) ? prices[roomId][d] : '';
    }));
  })));
}

function formatCalendarSheet_(sheet) {
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(5);
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
}

function writeJsonToSheet_(sheet, obj, title) {
  const rows = [[title, ''], ['success', !!(obj && obj.success === true)], ['type', String((obj && obj.type) || '')], ['count', (obj && obj.count) || 0]];
  if (obj && obj.fetchWindow) {
    rows.push(['fromDate', obj.fetchWindow.fromDate], ['toDate', obj.fetchWindow.toDate], ['daysAhead', obj.fetchWindow.daysAhead]);
  }
  rows.push(['FULL JSON TRUNCATED', ''], [safeSheetCell_(obj, 49000), '']);
  writeRows_(sheet, rows);
}

/******************************************************************
 * BOOKING CORE: CANONICAL SNAPSHOT
 * Μοναδικό read contract για τη Neon booking_core (βλ. chioshotel-next
 * app/api/booking-core/sync/route.ts). Διαβάζει το φύλλο Availability.
 ******************************************************************/

function buildBookingCoreRowsFromAvailability_(preloadedValues) {
  let values;
  if (preloadedValues && preloadedValues.length) {
    // Ίδια μορφή με το διάβασμα από το φύλλο: το Sheets αφαιρεί το αρχικό ' του safeSheetCell_.
    values = preloadedValues.map(function(row) {
      return row.map(function(v) { return (typeof v === 'string' && v.charAt(0) === "'") ? v.substring(1) : v; });
    });
  } else {
    const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET.AVAILABILITY);
    if (!sh) throw new Error('Sheet Availability not found');
    values = sh.getDataRange().getValues();
  }
  if (!values || values.length < 2) throw new Error('Sheet Availability is empty');

  const index = {};
  values[0].forEach(function(h, i) {
    const name = String(h == null ? '' : h).trim();
    if (name) index[name] = i;
  });
  const missing = ['date', 'roomId', 'roomName', 'unitId', 'unitName', 'price', 'available', 'reason']
    .filter(function(name) { return index[name] === undefined; });
  if (missing.length) throw new Error('Availability sheet is missing required columns: ' + missing.join(', '));

  const str = function(v) { return String(v == null ? '' : v).trim(); };
  const rows = [];
  let invalid = 0;

  for (let r = 1; r < values.length; r++) {
    const src = values[r];
    const date = normalizeDate_(src[index.date]);
    const roomId = str(src[index.roomId]);
    const unitId = str(src[index.unitId]);
    if (!date || !roomId || !unitId) continue;

    const roomName = str(src[index.roomName]);
    const unitName = str(src[index.unitName]);
    const parsedPrice = Number(str(src[index.price]).replace(',', '.'));
    const price = Number.isFinite(parsedPrice) && parsedPrice > 0 ? round2_(parsedPrice) : null;
    const availableText = str(src[index.available]).toUpperCase();
    const available = availableText === 'YES' || availableText === 'TRUE' || availableText === '1';
    const reason = str(src[index.reason]).toUpperCase();
    const bookingId = index.bookingId === undefined ? '' : str(src[index.bookingId]);

    if (available && price === null) {
      invalid++;
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

  if (invalid) throw new Error('Availability contains sellable rows without required reference prices: ' + invalid);
  if (!rows.length) throw new Error('No canonical booking rows found');

  rows.sort(function(a, b) {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    if (Number(a.roomId) !== Number(b.roomId)) return Number(a.roomId) - Number(b.roomId);
    return Number(a.unitId) - Number(b.unitId);
  });
  return { rows: rows };
}

function computeBookingCoreFingerprint_(rows) {
  return sha256Hex_(JSON.stringify((rows || []).map(function(row) {
    return [row.date, row.roomId, row.roomName, row.unitId, row.unitName, row.label,
      row.price, row.available === true, row.status, row.reason, row.bookingId || ''];
  })));
}

function buildBookingCoreSnapshotPayload_(rows, dataUpdatedAt, sourceRefreshedAt) {
  let minDate = rows[0].date;
  let maxDate = rows[0].date;
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
    sheetName: SHEET.AVAILABILITY,
    refreshState: 'READY',
    generatedAt: nowIso_(),
    sourceRefreshedAt: sourceRefreshedAt || null,
    dataUpdatedAt: dataUpdatedAt,
    range: { minDate: minDate, maxDate: maxDate },
    count: rows.length,
    rows: rows
  };
}

function pushBookingCoreSnapshotToVercel_(payload) {
  const props = PropertiesService.getScriptProperties();
  const url = String(props.getProperty(PROP.PUSH_URL) || DEFAULT_PUSH_URL).trim();
  const secret = String(props.getProperty(PROP.PUSH_SECRET) || '').trim();
  if (!secret) return { ok: false, error: 'Missing Script Property ' + PROP.PUSH_SECRET };

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + secret }
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
    return { ok: false, error: errorText_(err) };
  }
}

function snapshotError_(code, error, extra) {
  const out = {
    success: false,
    ok: false,
    type: 'booking_core_snapshot',
    schemaVersion: BOOKING_CORE_SCHEMA_VERSION,
    code: code,
    error: error,
    generatedAt: nowIso_(),
    rows: []
  };
  Object.keys(extra || {}).forEach(function(k) { out[k] = extra[k]; });
  return jsonOutput_(out);
}

function getBookingCoreSnapshot_(params) {
  const props = PropertiesService.getScriptProperties();
  const expectedSecret = String(props.getProperty(PROP.SNAPSHOT_SECRET) || '').trim();
  if (expectedSecret && String((params && params.secret) || '').trim() !== expectedSecret) {
    return snapshotError_('UNAUTHORIZED', 'Unauthorized');
  }

  const startedMs = Date.now();
  // since = dataUpdatedAt που έχει ήδη η Neon. Αν δεν άλλαξε τίποτα, απαντάμε
  // χωρίς γραμμές και χωρίς να διαβάσουμε το φύλλο.
  const since = String((params && params.since) || '').trim();
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(since ? 0 : SNAPSHOT_LOCK_WAIT_MS)) {
    // Τρέχει refresh: ό,τι αλλάξει θα έρθει με push, τα τρέχοντα δεδομένα ισχύουν.
    const running = notModifiedSnapshot_(props, since);
    return running || snapshotError_('SOURCE_BUSY', 'Booking source refresh is currently running');
  }

  try {
    let state = String(props.getProperty(PROP.STATE) || '').trim().toUpperCase();
    const dataUpdatedAt = String(props.getProperty(PROP.DATA_UPDATED_AT) || '').trim();
    const sourceRefreshedAt = String(props.getProperty(PROP.COMPLETED_AT) || '').trim();

    // Self-healing: κρατάμε το lock, άρα δεν τρέχει refresh. Αν η κατάσταση είναι
    // ακόμα UPDATING, το προηγούμενο refresh σκοτώθηκε (π.χ. όριο 6 λεπτών).
    if (state === 'UPDATING') {
      state = 'ERROR';
      props.setProperty(PROP.STATE, state);
      props.setProperty(PROP.ERROR, 'Previous refresh was interrupted (started ' + (props.getProperty(PROP.STARTED_AT) || '?') + ')');
    }

    if (state !== 'READY' || !dataUpdatedAt || isNaN(new Date(dataUpdatedAt).getTime())) {
      const healScheduled = requestSelfHealRefresh_();
      return snapshotError_(
        state === 'ERROR' ? 'SOURCE_REFRESH_ERROR' : 'SOURCE_NOT_READY',
        state === 'ERROR'
          ? String(props.getProperty(PROP.ERROR) || 'Last source refresh failed')
          : 'Booking source has not completed a successful refresh yet',
        {
          refreshState: state || 'UNKNOWN',
          sourceRefreshedAt: sourceRefreshedAt || null,
          dataUpdatedAt: dataUpdatedAt || null,
          selfHealRefreshScheduled: healScheduled
        }
      );
    }

    const unchanged = notModifiedSnapshot_(props, since);
    if (unchanged) return unchanged;

    const payload = buildBookingCoreSnapshotPayload_(buildBookingCoreRowsFromAvailability_().rows, dataUpdatedAt, sourceRefreshedAt);
    payload.durationMs = Date.now() - startedMs;
    return jsonOutput_(payload);
  } catch (err) {
    return snapshotError_('SOURCE_EXCEPTION', errorText_(err));
  } finally {
    lock.releaseLock();
  }
}

// Απάντηση «δεν άλλαξε τίποτα» όταν ο καλών έχει ήδη τα τρέχοντα δεδομένα (null αλλιώς).
function notModifiedSnapshot_(props, since) {
  const dataUpdatedAt = String(props.getProperty(PROP.DATA_UPDATED_AT) || '').trim();
  const sourceRefreshedAt = String(props.getProperty(PROP.COMPLETED_AT) || '').trim();
  if (!since || since !== dataUpdatedAt || !sourceRefreshedAt) return null;
  return jsonOutput_({
    success: true,
    ok: true,
    type: 'booking_core_snapshot',
    schemaVersion: BOOKING_CORE_SCHEMA_VERSION,
    source: 'google_sheet_availability',
    refreshState: 'READY',
    notModified: true,
    generatedAt: nowIso_(),
    sourceRefreshedAt: sourceRefreshedAt,
    dataUpdatedAt: dataUpdatedAt,
    count: 0,
    rows: []
  });
}

// Το πολύ ένα αυτόματο refresh ανά 15 λεπτά από αποτυχημένα snapshots.
function requestSelfHealRefresh_() {
  const cache = CacheService.getScriptCache();
  if (cache.get(CACHE.SELF_HEAL)) return false;
  cache.put(CACHE.SELF_HEAL, '1', 15 * 60);
  return scheduleRefresh_(WEBHOOK_DELAY_MS);
}

function getBookingCoreHealth_() {
  const props = PropertiesService.getScriptProperties().getProperties();
  const state = String(props[PROP.STATE] || '').trim().toUpperCase();
  const completedAt = String(props[PROP.COMPLETED_AT] || '').trim();
  const triggers = ScriptApp.getProjectTriggers().map(function(t) { return t.getHandlerFunction(); });
  const ok = state === 'READY' && !!completedAt;

  return jsonOutput_({
    success: ok,
    ok: ok,
    type: 'booking_core_health',
    schemaVersion: BOOKING_CORE_SCHEMA_VERSION,
    refreshState: state || 'UNKNOWN',
    refreshStartedAt: props[PROP.STARTED_AT] || null,
    lastRefreshCompletedAt: completedAt || null,
    lastRefreshAgeMinutes: completedAt ? Math.round((Date.now() - new Date(completedAt).getTime()) / 60000) : null,
    lastRefreshError: props[PROP.ERROR] || null,
    dataUpdatedAt: props[PROP.DATA_UPDATED_AT] || null,
    lastPushError: props[PROP.PUSH_ERROR] || null,
    pushPending: (props[PROP.OBSERVED_FP] || '') !== (props[PROP.PUSHED_FP] || ''),
    priceLastDate: props[PROP.PRICE_LAST_DATE] || null,
    lastBeds24WebhookAt: props[PROP.WEBHOOK_LAST_AT] || null,
    refreshTriggerInstalled: triggers.indexOf('refreshSystem') !== -1,
    triggers: triggers,
    turkishConfigExpired: TURKISH_CONFIG.weekendsEndDate < formatDate_(todayNoon_()),
    calendarDaysAhead: CALENDAR_DAYS_AHEAD,
    generatedAt: nowIso_()
  });
}

/******************************************************************
 * OCCUPANCY CALENDAR READER (για deals / availability / occupancy_*)
 ******************************************************************/

let _occupancyDataCache = null;
let _availabilityMemo = null;

function resetExecutionCaches_() {
  _occupancyDataCache = null;
  _availabilityMemo = null;
}

function getOccupancyData_() {
  if (_occupancyDataCache) return _occupancyDataCache;

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET.CALENDAR);
  if (!sh) throw new Error('Sheet "' + SHEET.CALENDAR + '" not found');
  const values = sh.getDataRange().getValues();
  if (!values || values.length < 2) throw new Error('Sheet "' + SHEET.CALENDAR + '" is empty');

  const dates = values[0].map(function(h, c) { return c < 5 ? '' : normalizeDate_(h); });
  const dateToCol = {};
  dates.forEach(function(d, c) { if (d) dateToCol[d] = c; });

  const unitRowMap = {};
  for (let r = 1; r < values.length; r++) {
    const key = unitKey_(values[r][0], values[r][2]);
    if (key) unitRowMap[key] = values[r];
  }

  _occupancyDataCache = { values: values, dates: dates, dateToCol: dateToCol, unitRowMap: unitRowMap };
  return _occupancyDataCache;
}

function unitKey_(roomId, unitId) {
  const r = Number(roomId);
  const u = Number(unitId);
  return Number.isFinite(r) && Number.isFinite(u) && r && u ? r + '_' + u : '';
}

// Τιμή ή κατάσταση ενός κελιού του occupancy_calendar.
function parseCalendarCell_(value) {
  const text = String(value == null ? '' : value).trim().toUpperCase();
  if (text === 'BOOKED') return { reason: 'BOOKED', price: null };
  if (text === 'CLOSED' || text === '') return { reason: 'CLOSED', price: null };
  const price = Number(String(value).replace(',', '.').replace(/[^\d.\-]/g, ''));
  return Number.isFinite(price) && price > 0
    ? { reason: 'PRICE_OK', price: round2_(price) }
    : { reason: 'INVALID_PRICE', price: null };
}

// Διαθεσιμότητα/τιμή μίας μονάδας για checkin…checkout (checkout εξαιρείται).
function evaluateStay_(data, roomId, unitId, nights) {
  const row = data.unitRowMap[unitKey_(roomId, unitId)];
  if (!row) return { available: false, price: null, avgPrice: null, totalPrice: null, currency: 'EUR', reason: 'UNIT_NOT_FOUND' };

  let reason = 'OK';
  let first = null;
  let total = 0;
  for (let i = 0; i < nights.length; i++) {
    const col = data.dateToCol[nights[i]];
    if (col === undefined) { reason = 'DATE_NOT_FOUND'; break; }
    const cell = parseCalendarCell_(row[col]);
    if (cell.reason !== 'PRICE_OK') { reason = cell.reason; break; }
    if (first === null) first = cell.price;
    total += cell.price;
  }

  const ok = reason === 'OK';
  return {
    available: ok,
    price: ok ? first : null,
    avgPrice: ok && nights.length ? round2_(total / nights.length) : null,
    totalPrice: ok ? round2_(total) : null,
    currency: 'EUR',
    reason: reason
  };
}

function computeAvailabilityResults_(checkin, checkout, units) {
  const data = getOccupancyData_();
  const nights = getNights_(checkin, checkout);
  if (!_availabilityMemo) _availabilityMemo = {};

  const results = {};
  units.forEach(function(unit) {
    const key = String(unit.roomId || '').trim() + '_' + String(unit.unitId || '').trim();
    const memoKey = checkin + '|' + checkout + '|' + key;
    if (!_availabilityMemo[memoKey]) _availabilityMemo[memoKey] = evaluateStay_(data, unit.roomId, unit.unitId, nights);
    results[key] = _availabilityMemo[memoKey];
  });
  return results;
}

function handleAvailability_(payload) {
  const checkin = String(payload.checkin || '').trim();
  const checkout = String(payload.checkout || '').trim();
  const units = Array.isArray(payload.units) ? payload.units : [];
  if (!checkin || !checkout || !units.length) return jsonOutput_({ success: false, message: 'Missing required fields' });

  const start = parseIsoDate_(checkin);
  const end = parseIsoDate_(checkout);
  if (!start || !end || end <= start) return jsonOutput_({ success: false, message: 'Invalid checkin/checkout dates' });

  return jsonOutput_({ success: true, results: computeAvailabilityResults_(checkin, checkout, units) });
}

/******************************************************************
 * DEALS (υπολογίζονται μόνο όταν ζητηθούν, με cache)
 ******************************************************************/

function invalidateDealCaches_() {
  const keys = [CACHE.DEALS];
  [1, 2, 3, 4].forEach(function(n) { keys.push(CACHE.LAST_MINUTE + n, CACHE.TURKISH + n); });
  CacheService.getScriptCache().removeAll(keys);
}

function getDealsResponse_() {
  const startedMs = Date.now();
  let data = cacheGetJson_(CACHE.DEALS);
  let source = 'CACHE';
  if (!data) {
    data = buildDeals_();
    source = 'LIVE';
    cachePutJson_(CACHE.DEALS, data, DEALS_CACHE_SECONDS);
  }
  data.source = source;
  data.servedAt = nowIso_();
  data.responseMs = Date.now() - startedMs;
  data.cacheAgeMs = Date.now() - new Date(data.generatedAt).getTime();
  return jsonOutput_(data);
}

function buildDeals_() {
  const data = getOccupancyData_();
  const today = todayNoon_();
  const days = [];

  for (let i = 1; i <= DEALS_DAYS; i++) {
    const checkin = formatDate_(addDays_(today, i));
    const checkout = formatDate_(addDays_(today, i + 1));
    const results = {};
    UNITS.forEach(function(u) {
      const stay = evaluateStay_(data, u.roomId, u.unitId, [checkin]);
      results[u.roomId + '_' + u.unitId] = { available: stay.available, totalPrice: stay.available ? stay.totalPrice : 0 };
    });
    days.push({ checkin: checkin, checkout: checkout, results: results });
  }

  return {
    ok: true,
    generatedAt: nowIso_(),
    adults: DEALS_ADULTS,
    discount: DEALS_DISCOUNT,
    rooms: UNITS.filter(function(u) { return u.max >= DEALS_ADULTS; }).map(function(u) {
      return { roomId: Number(u.roomId), unitId: Number(u.unitId), name: u.en, location: u.locEn, maxGuests: u.max };
    }),
    days: days
  };
}

function normalizePeople_(value) {
  const n = Number(value || 2);
  if (!Number.isFinite(n)) return 2;
  return Math.min(4, Math.max(1, Math.round(n)));
}

// Μορφή μονάδων για last-minute / Turkish (ελληνικά ονόματα, όπως πριν).
function dealUnitsFor_(people) {
  return UNITS.filter(function(u) { return u.max >= people; }).map(function(u) {
    return { roomId: u.roomId, unitId: u.unitId, name: u.el, loc: u.locEl, max: u.max };
  });
}

function getLastMinuteCache_(payload) {
  const people = normalizePeople_(payload && payload.people);
  let data = cacheGetJson_(CACHE.LAST_MINUTE + people);
  if (!data) {
    data = buildLastMinuteData_(people);
    cachePutJson_(CACHE.LAST_MINUTE + people, data, DEALS_CACHE_SECONDS);
  }
  return jsonOutput_(data);
}

function refreshLastMinuteCache_(payload) {
  const people = normalizePeople_(payload && payload.people);
  const data = buildLastMinuteData_(people);
  cachePutJson_(CACHE.LAST_MINUTE + people, data, DEALS_CACHE_SECONDS);
  return jsonOutput_({ success: true, message: 'Cache refreshed', people: people, updatedAt: data.updatedAt });
}

function buildLastMinuteData_(people) {
  const rooms = dealUnitsFor_(people);
  const today = todayNoon_();
  const buckets = [];
  for (let i = 1; i <= DEALS_DAYS; i++) {
    const checkin = formatDate_(addDays_(today, i));
    const checkout = formatDate_(addDays_(today, i + 1));
    buckets.push({ checkin: checkin, checkout: checkout, results: computeAvailabilityResults_(checkin, checkout, rooms) });
  }

  return {
    success: true,
    people: people,
    updatedAt: nowIso_(),
    startDate: buckets[0].checkin,
    endDate: buckets[buckets.length - 1].checkout,
    rooms: rooms.map(function(room) {
      const key = room.roomId + '_' + room.unitId;
      return {
        roomId: room.roomId,
        unitId: room.unitId,
        name: room.name,
        loc: room.loc,
        max: room.max,
        days: buckets.map(function(day) {
          const item = day.results[key] || null;
          const available = !!(item && item.available);
          const original = available ? Number(item.totalPrice || 0) : null;
          return {
            checkin: day.checkin,
            checkout: day.checkout,
            available: available,
            originalPrice: original,
            dealPrice: available ? round2_(original * (1 - DEALS_DISCOUNT)) : null,
            currency: 'EUR',
            reason: item ? item.reason : 'NO_RESULT'
          };
        })
      };
    })
  };
}

function getTurkishDeals_(payload) {
  const people = normalizePeople_(payload && payload.people);
  const holiday = String((payload && payload.holiday) || '').trim();
  let data = cacheGetJson_(CACHE.TURKISH + people);
  let source = 'CACHE';
  if (!data) {
    data = buildTurkishData_(people);
    source = 'LIVE';
    cachePutJson_(CACHE.TURKISH + people, data, TURKISH_CACHE_SECONDS);
  }

  if (holiday && data.holidays[holiday]) {
    return jsonOutput_({ ok: true, success: true, source: source, updatedAt: data.updatedAt, days: data.holidays[holiday].days, rooms: data.holidays[holiday].rooms });
  }
  return jsonOutput_({ ok: true, success: true, source: source, data: data });
}

function buildTurkishData_(people) {
  const rooms = dealUnitsFor_(people);
  const oneNight = function(checkin, checkout) { return computeAvailabilityResults_(checkin, checkout, rooms); };
  const out = { updatedAt: nowIso_(), people: people, holidays: {}, weekends: [] };

  Object.keys(TURKISH_CONFIG.periods).forEach(function(key) {
    const p = TURKISH_CONFIG.periods[key];
    const days = [];
    const start = parseIsoDate_(p.start);
    const end = parseIsoDate_(p.end);
    if (start && end) {
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const checkin = formatDate_(d);
        const checkout = formatDate_(addDays_(d, 1));
        days.push({ checkin: checkin, checkout: checkout, results: oneNight(checkin, checkout) });
      }
    }
    out.holidays[key] = { days: days, rooms: rooms };
  });

  const endDate = parseIsoDate_(TURKISH_CONFIG.weekendsEndDate);
  for (let d = addDays_(todayNoon_(), TURKISH_CONFIG.weekendsOffsetDays); endDate && d <= endDate; d = addDays_(d, 1)) {
    if (d.getDay() !== 5) continue;
    const fri = formatDate_(d);
    const sat = formatDate_(addDays_(d, 1));
    const sun = formatDate_(addDays_(d, 2));
    out.weekends.push({
      weekendStart: fri,
      days: [
        { checkin: fri, checkout: sat, results: oneNight(fri, sat) },
        { checkin: sat, checkout: sun, results: oneNight(sat, sun) }
      ],
      rooms: rooms
    });
  }
  return out;
}

// Χειροκίνητο: καθαρίζει τα caches των deals.
function clearDealCaches() {
  invalidateDealCaches_();
  console.log('Deal caches cleared.');
}

/******************************************************************
 * READ-ONLY ENDPOINTS ΑΠΟ ΤΟ occupancy_calendar
 ******************************************************************/

function getOccupancySnapshot_() {
  const startedMs = Date.now();
  const data = getOccupancyData_();
  const rows = [];

  for (let r = 1; r < data.values.length; r++) {
    const src = data.values[r];
    const roomId = String(src[0] == null ? '' : src[0]).trim();
    const unitId = String(src[2] == null ? '' : src[2]).trim();
    if (!roomId || !unitId) continue;

    for (let c = 5; c < data.dates.length; c++) {
      if (!data.dates[c]) continue;
      const cell = parseCalendarCell_(src[c]);
      const available = cell.reason === 'PRICE_OK';
      const status = available ? String(cell.price) : (cell.reason === 'BOOKED' ? 'BOOKED' : 'CLOSED');
      rows.push({
        date: data.dates[c],
        roomId: roomId,
        roomName: String(src[1] == null ? '' : src[1]).trim(),
        unitId: unitId,
        unitName: String(src[3] == null ? '' : src[3]).trim(),
        label: String(src[4] == null ? '' : src[4]).trim(),
        value: status,
        status: status,
        price: cell.price,
        available: available,
        reason: available ? 'PRICE_OK' : (cell.reason === 'BOOKED' ? 'BOOKED' : 'CLOSED')
      });
    }
  }

  return jsonOutput_({
    success: true,
    ok: true,
    type: 'occupancy_snapshot',
    source: 'google_sheet_occupancy_calendar',
    sheetName: SHEET.CALENDAR,
    generatedAt: nowIso_(),
    count: rows.length,
    durationMs: Date.now() - startedMs,
    rows: rows,
    data: rows
  });
}

function getOccupancyPrices_() {
  const data = getOccupancyData_();
  const out = [];
  for (let r = 1; r < data.values.length; r++) {
    const src = data.values[r];
    const roomId = String(src[0] || '').trim();
    const unitId = String(src[2] || '').trim();
    if (!roomId || !unitId) continue;
    for (let c = 5; c < data.dates.length; c++) {
      const price = Number(src[c]);
      if (!data.dates[c] || !Number.isFinite(price) || price <= 0) continue;
      out.push({
        date: data.dates[c], roomId: roomId, roomName: String(src[1] || '').trim(), unitId: unitId,
        unitName: String(src[3] || '').trim(), label: String(src[4] || '').trim(),
        price: price, available: 'YES', reason: 'PRICE_OK'
      });
    }
  }
  return jsonOutput_({ success: true, type: 'occupancy_prices', count: out.length, data: out });
}

// Νύχτες με κράτηση. Τα στοιχεία επισκεπτών (όνομα, email, τηλέφωνο, ποσά)
// επιστρέφονται ΜΟΝΟ με ?key=<Script Property STAFF_API_KEY>.
const BOOKING_PUBLIC_FIELDS = ['date', 'roomId', 'roomName', 'unitId', 'unitName', 'available', 'reason', 'bookingId', 'status'];

function getCalendarBookings_(params) {
  const staffKey = String(PropertiesService.getScriptProperties().getProperty(PROP.STAFF_API_KEY) || '').trim();
  const full = !!staffKey && String((params && params.key) || '').trim() === staffKey;

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET.AVAILABILITY);
  if (!sh) return jsonOutput_({ success: false, type: 'availability', count: 0, error: 'Sheet Availability not found', data: [] });

  const values = sh.getDataRange().getValues();
  if (values.length < 2) return jsonOutput_({ success: true, type: 'availability', count: 0, data: [] });

  const headers = values[0].map(function(h) { return String(h || '').trim(); });
  const col = function(name) { return headers.indexOf(name); };
  const iAvail = col('available');
  const iReason = col('reason');
  const tz = Session.getScriptTimeZone();

  const data = [];
  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    if (String(row[iAvail] || '').toUpperCase() !== 'NO' || String(row[iReason] || '').toUpperCase() !== 'BOOKED') continue;
    const item = {};
    headers.forEach(function(h, i) {
      if (!h || (!full && BOOKING_PUBLIC_FIELDS.indexOf(h) === -1)) return;
      const v = row[i];
      item[h] = Object.prototype.toString.call(v) === '[object Date]' ? Utilities.formatDate(v, tz, 'yyyy-MM-dd') : v;
    });
    if (item.date && item.roomId && item.unitId) data.push(item);
  }

  return jsonOutput_({ success: true, type: 'availability', guestDetails: full, count: data.length, data: data });
}

/******************************************************************
 * HOUSEKEEPING (σελίδα Elementor /housekeeping/)
 ******************************************************************/

function hkSheets_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const stays = getOrCreateSheet_(ss, SHEET.HK_STAYS);
  const tasks = getOrCreateSheet_(ss, SHEET.HK_TASKS);
  if (stays.getLastRow() === 0) stays.getRange(1, 1, 1, 5).setValues([['stayId', 'room', 'checkIn', 'checkOut', 'createdAt']]);
  if (tasks.getLastRow() === 0) tasks.getRange(1, 1, 1, 6).setValues([['taskId', 'stayId', 'room', 'date', 'taskType', 'createdAt']]);
  return { stays: stays, tasks: tasks };
}

function hkNormalizeRoom_(value) {
  const room = String(value == null ? '' : value).trim();
  if (!room) return '';
  const n = Number(room);
  return Number.isFinite(n) ? String(Math.round(n)) : '';
}

// Τιμή κελιού ως yyyy-MM-dd (το Sheets μετατρέπει τις ημερομηνίες σε Date).
function hkDate_(value) {
  return normalizeDate_(value) || String(value == null ? '' : value).trim();
}

function hkAddStay_(payload) {
  const room = hkNormalizeRoom_(payload.room);
  const checkIn = String(payload.checkIn || '').trim();
  const checkOut = String(payload.checkOut || '').trim();
  if (!room || !checkIn || !checkOut) return jsonOutput_({ success: false, message: 'Missing fields' });

  const inDate = parseIsoDate_(checkIn);
  const outDate = parseIsoDate_(checkOut);
  if (!inDate || !outDate || outDate <= inDate) return jsonOutput_({ success: false, message: 'Invalid dates' });

  const stayId = String(Date.now());
  hkSheets_().stays.appendRow([stayId, room, checkIn, checkOut, nowIso_()]);
  return jsonOutput_({ success: true, stayId: stayId, room: room, checkIn: checkIn, checkOut: checkOut });
}

function hkAddTask_(payload) {
  const stayId = String(payload.stayId || '').trim();
  const room = hkNormalizeRoom_(payload.room);
  const date = String(payload.date || '').trim();
  const taskType = String(payload.taskType || '').trim();

  if (!stayId || !room || !date || !taskType) return jsonOutput_({ success: false, message: 'Missing fields' });
  if (!parseIsoDate_(date)) return jsonOutput_({ success: false, message: 'Invalid date' });
  if (HK_TASK_TYPES.indexOf(taskType) === -1) return jsonOutput_({ success: false, message: 'Invalid task type' });

  const sh = hkSheets_().tasks;
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][1]) === stayId && hkNormalizeRoom_(values[i][2]) === room &&
        hkDate_(values[i][3]) === date && String(values[i][4]) === taskType) {
      return jsonOutput_({ success: true, duplicate: true });
    }
  }

  const taskId = String(Date.now()) + '_' + Math.floor(Math.random() * 1000);
  sh.appendRow([taskId, stayId, room, date, taskType, nowIso_()]);
  return jsonOutput_({ success: true, taskId: taskId });
}

function hkDeleteTask_(payload) {
  const taskId = String(payload.taskId || '').trim();
  if (!taskId) return jsonOutput_({ success: false, message: 'Missing taskId' });

  const sh = hkSheets_().tasks;
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === taskId) {
      sh.deleteRow(i + 1);
      return jsonOutput_({ success: true });
    }
  }
  return jsonOutput_({ success: false, message: 'Task not found' });
}

function hkGetCalendar_(params) {
  const sheets = hkSheets_();
  const roomFilterRaw = String((params && params.room) || 'all').trim().toLowerCase();
  const roomFilter = roomFilterRaw === 'all' ? 'all' : hkNormalizeRoom_(roomFilterRaw);
  const clampDays = function(v) {
    const n = Number(v || 7);
    return Number.isFinite(n) ? Math.max(0, Math.min(60, Math.round(n))) : 7;
  };

  const today = todayNoon_();
  const startStr = formatDate_(addDays_(today, -clampDays(params && params.daysBack)));
  const endStr = formatDate_(addDays_(today, clampDays(params && params.daysForward)));
  const inRange = function(d) { return d && d >= startStr && d <= endStr; };
  const roomMap = {};
  const push = function(room, date, item) {
    if (!roomMap[room]) roomMap[room] = {};
    if (!roomMap[room][date]) roomMap[room][date] = [];
    roomMap[room][date].push(item);
  };

  sheets.stays.getDataRange().getValues().slice(1).forEach(function(row) {
    const room = hkNormalizeRoom_(row[1]);
    if (!room || (roomFilter !== 'all' && room !== roomFilter)) return;
    const stayId = String(row[0] || '');
    const checkIn = hkDate_(row[2]);
    const checkOut = hkDate_(row[3]);
    if (inRange(checkIn)) push(room, checkIn, { type: 'CHECK_IN', stayId: stayId });
    if (inRange(checkOut)) push(room, checkOut, { type: 'CHECK_OUT', stayId: stayId });
  });

  sheets.tasks.getDataRange().getValues().slice(1).forEach(function(row) {
    const room = hkNormalizeRoom_(row[2]);
    const date = hkDate_(row[3]);
    const taskType = String(row[4] || '').trim();
    if (!room || !taskType || !inRange(date)) return;
    if (roomFilter !== 'all' && room !== roomFilter) return;
    push(room, date, { taskId: String(row[0] || ''), stayId: String(row[1] || ''), type: taskType });
  });

  const rooms = Object.keys(roomMap).sort(function(a, b) { return Number(a) - Number(b); }).map(function(room) {
    return {
      room: room,
      dates: Object.keys(roomMap[room]).sort().map(function(date) { return { date: date, items: roomMap[room][date] }; })
    };
  });

  return jsonOutput_({ success: true, filter: roomFilter, startDate: startStr, endDate: endStr, rooms: rooms });
}

/******************************************************************
 * CACHE ΓΙΑ ΜΕΓΑΛΑ JSON (CacheService: 100KB/τιμή → σπάσιμο σε κομμάτια)
 ******************************************************************/

const CACHE_CHUNK_CHARS = 40000; // ελληνικοί χαρακτήρες = 2 bytes στο UTF-8

function cachePutJson_(key, value, seconds) {
  try {
    const text = JSON.stringify(value);
    const entries = {};
    let n = 0;
    for (let i = 0; i < text.length; i += CACHE_CHUNK_CHARS) entries[key + '#' + (n++)] = text.substring(i, i + CACHE_CHUNK_CHARS);
    entries[key] = JSON.stringify({ chunks: n });
    CacheService.getScriptCache().putAll(entries, Math.min(seconds, 21600));
  } catch (err) {
    console.warn('Cache put failed for ' + key + ': ' + errorText_(err));
  }
}

function cacheGetJson_(key) {
  try {
    const cache = CacheService.getScriptCache();
    const head = cache.get(key);
    if (!head) return null;
    const meta = JSON.parse(head);
    const keys = [];
    for (let i = 0; i < meta.chunks; i++) keys.push(key + '#' + i);
    const parts = cache.getAll(keys);
    let text = '';
    for (let i = 0; i < keys.length; i++) {
      if (parts[keys[i]] == null) return null;
      text += parts[keys[i]];
    }
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

/******************************************************************
 * ΒΟΗΘΗΤΙΚΑ
 ******************************************************************/

function tryScriptLock_(label, waitMs) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(waitMs)) {
    console.log(label + ' skipped: another script execution is already running.');
    return null;
  }
  return lock;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function errorText_(err) {
  return err && err.message ? err.message : String(err);
}

function nowIso_() {
  return new Date().toISOString();
}

function todayNoon_() {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d;
}

function addDays_(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate_(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function parseIsoDate_(value) {
  const m = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.getFullYear() === Number(m[1]) && d.getMonth() === Number(m[2]) - 1 && d.getDate() === Number(m[3]) ? d : null;
}

// Date ή κείμενο → yyyy-MM-dd ('' αν δεν είναι ημερομηνία).
function normalizeDate_(value) {
  if (value === null || value === undefined || value === '') return '';
  if (Object.prototype.toString.call(value) === '[object Date]') return isNaN(value.getTime()) ? '' : formatDate_(value);
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(raw)) return raw.replace(/\//g, '-');
  if (!/\d{4}/.test(raw)) return '';
  const parsed = new Date(raw);
  return isNaN(parsed.getTime()) ? '' : formatDate_(parsed);
}

function getNights_(checkin, checkout) {
  const out = [];
  const start = parseIsoDate_(checkin);
  const end = parseIsoDate_(checkout);
  if (!start || !end) return out;
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) out.push(formatDate_(d));
  return out;
}

function round2_(n) {
  return Math.round(n * 100) / 100;
}

function sha256Hex_(text) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8)
    .map(function(b) { return ('0' + (b < 0 ? b + 256 : b).toString(16)).slice(-2); })
    .join('');
}

function getOrCreateSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function safeSheetCell_(value, maxLen) {
  maxLen = maxLen || 1000;
  if (value === null || value === undefined) return '';
  let text;
  if (typeof value === 'object') {
    try { text = JSON.stringify(value); } catch (e) { text = String(value); }
  } else {
    text = String(value);
  }
  // Προστασία από spreadsheet formula injection (π.χ. ονόματα επισκεπτών).
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text.length > maxLen ? text.substring(0, maxLen) + '... [TRUNCATED]' : text;
}

/******************************************************************
 * Voulamandis House — Beds24 / availability Apps Script.
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

// --- BEDS24 / AVAILABILITY GLOBALS ---
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

// --- ΧΡΟΝΙΚΟ ΟΡΙΟ ΕΚΤΕΛΕΣΗΣ (Apps Script: 6 λεπτά) ---
// Όταν το Apps Script σταματά την εκτέλεση στα 6 λεπτά, δεν τρέχει ούτε το finally
// και τα sheets μπορεί να μείνουν μισογραμμένα. Γι' αυτό, αν μετά τα fetch από Beds24
// έχει περάσει αυτό το όριο, δεν ξεκινάμε εγγραφές: μένουν τα προηγούμενα σωστά
// δεδομένα και ξαναδοκιμάζει το επόμενο refresh.
const REFRESH_WRITE_DEADLINE_MS = 3.5 * 60 * 1000;
// Fingerprint όσων γράφτηκαν τελευταία φορά στα sheets. Ίδιο fingerprint = δεν ξαναγράφουμε
// ~190.000 κελιά του Availability κάθε 15 λεπτά χωρίς λόγο.
const SHEETS_WRITE_FINGERPRINT_PROPERTY = 'SHEETS_WRITE_FINGERPRINT';

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

const ROOM_NAME_TO_ID = {
  'Apartmentbooking.com': '265595',
  'First Floor Double RoomBooking.com': '267788',
  'Economy Double RoomBooking.com': '268803',
  'Ground Floor RoomGround Floor Rate': '626129'
};

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
    if (action === 'booking_core_snapshot') return getBookingCoreSnapshot_();
    if (action === 'booking_core_health') return getBookingCoreHealth_();

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
function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const payload = JSON.parse(raw);
    const action = String(payload.action || '').trim();

    if (action === 'SYNC_ROOM') return handleBeds24InventoryWebhook_(e, payload);
    if (action === 'ping') return jsonOutput_({ ok: true, pong: true, ts: new Date().toISOString(), source: 'PING' });

    return jsonOutput_({ success: false, message: 'Unknown action' });
  } catch (err) {
    return jsonOutput_({ success: false, message: err && err.message ? err.message : String(err) });
  }
}

/******************************************************************
 * BEDS24 / AVAILABILITY HELPERS
 ******************************************************************/

function addDays_(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
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
 * MAIN REFRESH SYSTEM
 ******************************************************************/

function refreshSystem() {
  const startedMs = Date.now();
  const lock = acquireScriptLockOrSkip_('refreshSystem', LOCK_WAIT_MS);
  if (!lock) return false;

  const bookingCoreProps = PropertiesService.getScriptProperties();
  let bookingCoreReady = false;
  const previousRefreshState = String(bookingCoreProps.getProperty(BOOKING_CORE_REFRESH_STATE_PROPERTY) || '');
  bookingCoreProps.setProperty(BOOKING_CORE_REFRESH_STATE_PROPERTY, 'UPDATING');
  bookingCoreProps.setProperty(BOOKING_CORE_REFRESH_STARTED_AT_PROPERTY, new Date().toISOString());
  bookingCoreProps.deleteProperty(BOOKING_CORE_REFRESH_ERROR_PROPERTY);

  try {
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

    const bookingsResp = getBookings_(token);
    // Μόνο σύνοψη: το raw JSON του Beds24 έχει ονόματα, email και τηλέφωνα επισκεπτών.
    writeJsonToSheet_(debugBookingsSheet, {
      success: bookingsResp.success,
      type: bookingsResp.type,
      count: bookingsResp.count,
      fetchWindow: bookingsResp.fetchWindow
    }, 'BOOKINGS DEBUG');

    const bookings = normalizeBookings_(bookingsResp);
    Logger.log('Fetched bookings for occupancy calendar: ' + bookings.length);
    let stepMs = Date.now();
    const logStep_ = function(label) {
      console.log('[refreshSystem] ' + label + ': ' + Math.round((Date.now() - stepMs) / 1000) + 's');
      stepMs = Date.now();
    };

    const occupiedMap = buildOccupiedMap_(bookings);
    const unitsMap = buildUnitsMapFromFixedMappingAndBookings_(bookings);

    const calendarDates = getRollingCalendarDates_(prices);
    const mappingRows = buildMappingRows_(unitsMap);
    const availabilityValues = buildAvailabilityRows_(unitsMap, occupiedMap, prices, calendarDates);
    const calendarRows = buildCalendarRows_(unitsMap, occupiedMap, prices, calendarDates);
    const rateCacheRows = buildRateCacheRows_(prices);
    logStep_('build maps / rows');

    // Γράφουμε στα sheets μόνο όταν άλλαξε κάτι (κράτηση, τιμή, διαθεσιμότητα ή νέα μέρα).
    const sheetsFingerprint = sha256Hex_(JSON.stringify([mappingRows, availabilityValues, calendarRows, rateCacheRows]));
    const sheetsUnchanged =
      sheetsFingerprint === String(bookingCoreProps.getProperty(SHEETS_WRITE_FINGERPRINT_PROPERTY) || '') &&
      availabilitySheet.getLastRow() === availabilityValues.length &&
      calendarSheet.getLastRow() === calendarRows.length;

    if (sheetsUnchanged) {
      console.log('Sheets unchanged; Availability / occupancy_calendar writes skipped.');
    } else {
      if (Date.now() - startedMs > REFRESH_WRITE_DEADLINE_MS) {
        // Πολύ αργά για ασφαλή εγγραφή: κρατάμε τα παλιά (συνεπή) sheets και την προηγούμενη κατάσταση.
        bookingCoreProps.setProperty(BOOKING_CORE_REFRESH_STATE_PROPERTY, previousRefreshState || 'ERROR');
        if (previousRefreshState !== 'READY') {
          bookingCoreProps.setProperty(BOOKING_CORE_REFRESH_ERROR_PROPERTY, 'Refresh stopped before sheet writes (time budget)');
        }
        console.warn('refreshSystem: ' + Math.round((Date.now() - startedMs) / 1000) +
          's μετά τα fetch, δεν γίνονται εγγραφές σε αυτό το refresh (θα ξαναδοκιμάσει).');
        return false;
      }

      writeRowsReplacing_(mappingSheet, mappingRows);
      logStep_('write mapping');
      writeRowsReplacing_(availabilitySheet, availabilityValues);
      logStep_('write Availability');
      writeRowsReplacing_(calendarSheet, calendarRows);
      applyCalendarFormatting_(calendarSheet, calendarRows.length, calendarRows[0].length);
      logStep_('write occupancy_calendar');
      writeRowsReplacing_(rateCacheSheet, rateCacheRows);
      logStep_('write rate_cache');

      SpreadsheetApp.flush();
      bookingCoreProps.setProperty(SHEETS_WRITE_FINGERPRINT_PROPERTY, sheetsFingerprint);
      logStep_('flush');
    }

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



// Το νέο site χρειάζεται μόνο ποια μέρα είναι κλεισμένη και με ποια κράτηση.
// Στοιχεία επισκεπτών (όνομα, email, τηλέφωνο, χρεώσεις) δεν γράφονται πια στο sheet.
function buildOccupiedMap_(bookings) {
  const map = {};

  bookings.forEach(function(b) {
    if (!b.roomId || !b.unitId || !b.arrival || !b.departure || String(b.status).toLowerCase() === 'cancelled') return;

    const arr = parseIsoDate_(b.arrival);
    const dep = parseIsoDate_(b.departure);
    if (!arr || !dep) return;

    const bookingId = safeSheetCell_(b.id || b.bookId, 100);
    for (let d = new Date(arr); d < dep; d.setDate(d.getDate() + 1)) {
      map[formatDate_(d) + '|' + b.roomId + '|' + b.unitId] = { bookingId: bookingId };
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

function buildMappingRows_(unitsMap) {
  const rows = [['roomId', 'roomName', 'unitId', 'unitName']];
  Object.keys(unitsMap).sort(sortUnitKeys_(unitsMap)).forEach(function(key) {
    const u = unitsMap[key];
    rows.push([safeSheetCell_(u.roomId, 100), safeSheetCell_(u.roomName, 200), safeSheetCell_(u.unitId, 100), safeSheetCell_(u.unitName, 200)]);
  });
  return rows;
}

function buildAvailabilityRows_(unitsMap, occupiedMap, prices, dates) {
  const rows = [['date', 'roomId', 'roomName', 'unitId', 'unitName', 'price', 'available', 'reason', 'bookingId']];

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
        avail,
        reason,
        occ ? occ.bookingId : ''
      ]);
    });
  });

  return rows;
}
function buildCalendarRows_(unitsMap, occupiedMap, prices, dates) {
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

  return rows;
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

function buildRateCacheRows_(prices) {
  const roomIds = Object.keys(prices || {}).sort();
  if (roomIds.length === 0) return [['No rate cache data']];

  const dates = getAllPriceDates_(prices);
  const rows = [['roomId'].concat(dates)];

  roomIds.forEach(function(roomId) {
    const row = [roomId];
    dates.forEach(function(dateStr) {
      row.push(prices[roomId] && Object.prototype.hasOwnProperty.call(prices[roomId], dateStr) ? prices[roomId][dateStr] : '');
    });
    rows.push(row);
  });

  return rows;
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
function getOrCreateSheet_(ss, name) { let sh = ss.getSheetByName(name); if (!sh) sh = ss.insertSheet(name); return sh; }
function clearSheet_(sh) { sh.clearContents(); sh.clearFormats(); }

// Γράφει τα νέα rows πάνω στα παλιά και μετά καθαρίζει μόνο ό,τι περισσεύει.
// Σε αντίθεση με clearSheet_ + setValues, το sheet δεν μένει ποτέ άδειο αν η
// εκτέλεση κοπεί, και δεν καθαρίζονται formats σε όλο το grid σε κάθε refresh.
function writeRowsReplacing_(sheet, rows) {
  const numRows = rows.length;
  const numCols = rows[0].length;
  const oldRows = sheet.getLastRow();
  const oldCols = sheet.getLastColumn();

  sheet.getRange(1, 1, numRows, numCols).setValues(rows);

  if (oldRows > numRows) sheet.getRange(numRows + 1, 1, oldRows - numRows, Math.max(oldCols, numCols)).clear();
  if (oldCols > numCols) sheet.getRange(1, numCols + 1, Math.min(oldRows, numRows), oldCols - numCols).clear();
}

function sha256Hex_(text) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
  return digest.map(function(byte) {
    const value = byte < 0 ? byte + 256 : byte;
    return ('0' + value.toString(16)).slice(-2);
  }).join('');
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

  return sha256Hex_(canonical);
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


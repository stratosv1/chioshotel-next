// Ψεύτικες υπηρεσίες Google (Sheets, Cache, Properties, UrlFetch, ...) για το apps-script/test/test.js.
process.env.TZ = 'Europe/Athens';
const fs = require('fs'), vm = require('vm'), crypto = require('crypto');
const pad = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

// ---------- Sheets mock (converts like Google Sheets on write) ----------
function toCell(v) {
  if (typeof v === 'string') {
    if (v.startsWith("'")) return v.slice(1);
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) { const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d); }
    if (v.trim() !== '' && /^-?\d+(\.\d+)?$/.test(v.trim())) return Number(v);
  }
  return v === null || v === undefined ? '' : v;
}
class Sheet {
  constructor(name) { this.name = name; this.data = []; this.writes = 0; }
  clearContents() { this.data = []; }
  getLastRow() { return this.data.length; }
  getLastColumn() { return this.data.reduce((m, r) => Math.max(m, r.length), 0); }
  setFrozenRows() {} setFrozenColumns() {}
  getRange(r, c, nr, nc) {
    const sh = this;
    return {
      setValues(vals) { sh.writes++; vals.forEach((row, i) => { const R = r - 1 + i; sh.data[R] = sh.data[R] || []; row.forEach((v, j) => { sh.data[R][c - 1 + j] = toCell(v); }); }); },
      setFontWeight() {}, setWrap() {}
    };
  }
  getDataRange() { const w = this.getLastColumn(); const d = this.data.map(r => { const o = r.slice(); while (o.length < w) o.push(''); return o; }); return { getValues: () => d }; }
  appendRow(row) { this.data.push(row.map(toCell)); }
  deleteRow(i) { this.data.splice(i - 1, 1); }
}
const sheets = {};
const ss = { getSheetByName: n => sheets[n] || null, insertSheet: n => (sheets[n] = new Sheet(n)) };

// ---------- other services ----------
const props = { beds24: 'TOKEN', BOOKING_CORE_PUSH_SECRET: 'PUSHSECRET', STAFF_API_KEY: 'STAFFKEY' };
const PropertiesService = { getScriptProperties: () => ({
  getProperty: k => (k in props ? props[k] : null), setProperty: (k, v) => { props[k] = String(v); },
  deleteProperty: k => { delete props[k]; }, getProperties: () => ({ ...props }) }) };
const cacheStore = {};
const CacheService = { getScriptCache: () => ({
  get: k => (k in cacheStore ? cacheStore[k] : null), put: (k, v) => { if (v.length > 100000) throw new Error('too large'); cacheStore[k] = v; },
  putAll: (o) => { for (const k in o) { if (Buffer.byteLength(o[k]) > 100000) throw new Error('too large ' + k); cacheStore[k] = o[k]; } },
  getAll: ks => { const o = {}; ks.forEach(k => { if (k in cacheStore) o[k] = cacheStore[k]; }); return o; },
  remove: k => { delete cacheStore[k]; }, removeAll: ks => ks.forEach(k => delete cacheStore[k]) }) };
let lockHeld = false;
const LockService = { getScriptLock: () => ({ tryLock: () => (lockHeld ? false : (lockHeld = true)), releaseLock: () => { lockHeld = false; } }) };
let triggers = [{ h: 'runRefreshNow' }, { h: 'refreshSystem' }, { h: 'refreshTurkishCache' }];
const ScriptApp = {
  getProjectTriggers: () => triggers.map(t => ({ getHandlerFunction: () => t.h, _t: t })),
  deleteTrigger: x => { triggers = triggers.filter(t => t !== x._t); },
  newTrigger: h => { const chain = { timeBased: () => chain, everyMinutes: () => chain, after: () => chain, create: () => triggers.push({ h }) }; return chain; },
  getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/X/exec' })
};
const Utilities = {
  formatDate: (d) => ymd(d),
  parseCsv: (t, delim) => t.split('\n').map(l => l.split(delim)),
  computeDigest: (_a, text) => Array.from(crypto.createHash('sha256').update(text, 'utf8').digest()).map(b => (b > 127 ? b - 256 : b)),
  DigestAlgorithm: { SHA_256: 1 }, Charset: { UTF_8: 1 },
  getUuid: () => crypto.randomUUID(), sleep: () => {}
};

// ---------- fake Beds24 / Vercel ----------
const today = new Date(); today.setHours(12, 0, 0, 0);
const T = n => ymd(addDays(today, n));
const csvDates = []; for (let i = -70; i <= 30; i++) csvDates.push(addDays(today, i));
const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const csvHeader = ['Room'].concat(csvDates.map(d => d.getDate() + ' ' + mon[d.getMonth()] + ' ' + d.getFullYear()));
const csvRows = Object.entries({ 'Apartmentbooking.com': 100, 'First Floor Double RoomBooking.com': 70, 'Economy Double RoomBooking.com': 50, 'Ground Floor RoomGround Floor Rate': 55 })
  .map(([n, p]) => [n].concat(csvDates.map(() => p)));
const csvText = '﻿' + [csvHeader].concat(csvRows).map(r => r.join(',')).join('\n');
const DriveApp = { getFoldersByName: () => { let done = false; return { hasNext: () => !done, next: () => { done = true; let f = false; return { getFiles: () => ({ hasNext: () => !f, next: () => { f = true; return {
  getName: () => 'prices.csv', getLastUpdated: () => new Date(), getBlob: () => ({ getDataAsString: () => csvText }) }; } }) }; } }; } };

let bookings = [
  { id: 1, roomId: 267788, unitId: 1, arrival: T(-70), departure: T(2), status: 'confirmed', firstName: '=EVIL', lastName: 'Guest', invoicee: { email: 'a@b.gr', phone: '+30 6900000000' }, price: 500, tax: 10, numAdult: 2 },
  { id: 2, roomId: 268803, unitId: 2, arrival: T(3), departure: T(5), status: 'cancelled' },
  { id: 3, roomId: 265595, unitId: 3, arrival: T(3), departure: T(5), status: 'inquiry' },
  { id: 4, roomId: 345347, unitId: 1, arrival: T(1), departure: T(4), status: 'new', guestName: 'Γιώργος', referer: 'Booking.com' },
  { id: 4, roomId: 345347, unitId: 1, arrival: T(1), departure: T(4), status: 'new' } // duplicate
];
let calendarApiFails = false, pushes = [], fetchLog = [];
function calendarResponse(url) {
  if (calendarApiFails) return { code: 500, body: 'boom' };
  const ids = [...url.matchAll(/roomId=(\d+)/g)].map(m => m[1]);
  const start = url.match(/startDate=([\d-]+)/)[1], end = url.match(/endDate=([\d-]+)/)[1];
  const base = { '267788': 80, '268803': 60, '265595': 120, '626129': 0 };
  return { code: 200, body: JSON.stringify({ success: true, data: ids.map(id => ({ roomId: Number(id), calendar: [
    { from: start, to: T(9), price1: base[id], numAvail: 2 },
    { from: T(10), to: T(10), price1: base[id], numAvail: id === '268803' ? 0 : 1 },
    { from: T(11), to: end, price1: base[id] ? base[id] + 5 : 0, numAvail: 1 }
  ] })), pages: { nextPageExists: false } }) };
}
const UrlFetchApp = { fetch: (url, opts) => {
  fetchLog.push(url.split('?')[0]);
  let r;
  if (url.includes('/inventory/rooms/calendar')) r = calendarResponse(url);
  else if (url.includes('/v2/bookings')) {
    if (!/departureFrom=\d{4}-\d{2}-\d{2}&arrivalTo=/.test(url)) throw new Error('bad bookings url ' + url);
    const page = url.includes('page=2') ? 2 : 1;
    r = { code: 200, body: JSON.stringify({ success: true, data: page === 1 ? bookings.slice(0, 3) : bookings.slice(3), pages: { nextPageExists: page === 1, nextPageLink: page === 1 ? url + '&page=2' : null } }) };
  } else if (url.includes('/api/booking-core/sync')) {
    if (opts.headers.Authorization !== 'Bearer PUSHSECRET') r = { code: 401, body: '{"ok":false}' };
    else { pushes.push(JSON.parse(opts.payload)); r = { code: 200, body: '{"ok":true}' }; }
  } else throw new Error('unexpected url ' + url);
  return { getResponseCode: () => r.code, getContentText: () => r.body };
} };

const outputs = [];
const ContentService = { MimeType: { JSON: 'json' }, createTextOutput: t => ({ setMimeType: () => ({ text: t, json: () => JSON.parse(t) }) }) };
const ctx = { console: { log() {}, warn() {}, error: (...a) => outputs.push(a.join(' ')) }, Logger: { log() {} },
  PropertiesService, CacheService, LockService, ScriptApp, Utilities, DriveApp, UrlFetchApp, ContentService,
  Session: { getScriptTimeZone: () => 'Europe/Athens' }, SpreadsheetApp: { openById: () => ss, flush() {} }, JSON, Date, Math, Number, String, Object, Array, Buffer };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.argv[2] || require('path').join(__dirname, '../proposed/Code.js'), 'utf8'), ctx);
module.exports = { ctx, props, sheets, pushes, cacheStore, fetchLog, outputs, get triggers() { return triggers; }, set calendarApiFails(v) { calendarApiFails = v; }, T, setLock: v => { lockHeld = v; } };

import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const BASE_URL = process.env.AI_QA_BASE_URL || 'http://127.0.0.1:3000';
const ROOM_IMAGE = '/images/rooms/double-triple-room.jpg';

function offer(roomNumber, overrides = {}) {
  const isApartment = roomNumber >= 8;
  const isGround = [5, 6, 7].includes(roomNumber);
  const maxGuests = roomNumber === 10 ? 5 : roomNumber === 1 || isApartment ? 4 : [3, 4, 5, 7].includes(roomNumber) ? 3 : 2;
  return {
    roomId: `room-${roomNumber}`,
    unitId: `unit-${roomNumber}`,
    roomNumber,
    name: isApartment ? `Διαμέρισμα ${roomNumber}` : `Δωμάτιο ${roomNumber}`,
    category: isApartment ? 'Οικογενειακό διαμέρισμα' : roomNumber === 2 || roomNumber === 6 ? 'Οικονομικό δίκλινο' : maxGuests === 4 ? 'Τετράκλινο δωμάτιο' : 'Τρίκλινο δωμάτιο',
    floor: isApartment ? 'Ανεξάρτητο διαμέρισμα' : isGround ? 'Ισόγειο · Χωρίς σκάλες' : 'Πρώτος όροφος · Με σκάλες',
    maxGuests,
    features: isApartment ? ['Πλήρης κουζίνα', 'Περισσότερος χώρος', 'Κλιματισμός'] : ['Ψυγείο', 'Κλιματισμός', roomNumber === 1 || roomNumber === 4 ? 'Ιδιωτικό μπαλκόνι' : 'Wi‑Fi'],
    image: ROOM_IMAGE,
    gallery: [ROOM_IMAGE],
    nights: 2,
    originalTotal: 120 + roomNumber * 5,
    directTotal: 100 + roomNumber * 5,
    saving: 20,
    ...overrides,
  };
}

const DEFAULT_OFFERS = [8, 4, 2, 6, 5, 7, 1, 3, 9, 10].map((roomNumber) => offer(roomNumber, {
  directTotal: roomNumber === 2 ? 90 : roomNumber === 6 ? 95 : 100 + roomNumber * 5,
  originalTotal: roomNumber === 2 ? 100 : roomNumber === 6 ? 106 : 115 + roomNumber * 5,
}));

function splitOffer() {
  return {
    roomId: 'split:room-2:unit-2:room-6:unit-6',
    unitId: '1',
    name: 'Split Stay: Δωμάτιο 2 → Δωμάτιο 6',
    category: 'Δωμάτιο 2: 2030-10-10 → 2030-10-11 · Δωμάτιο 6: 2030-10-11 → 2030-10-12',
    floor: 'Επιπλέον έκπτωση συνδυαστικής διαμονής',
    maxGuests: 2,
    features: ['1 βραδιά · Δωμάτιο 2', '1 βραδιά · Δωμάτιο 6', 'Αλλαγή: 2030-10-11'],
    image: ROOM_IMAGE,
    gallery: [ROOM_IMAGE],
    nights: 2,
    originalTotal: 200,
    directTotal: 170,
    saving: 30,
    splitStay: true,
  };
}

function offersFor(mode, guests) {
  if (mode === 'split') return [splitOffer()];
  if (mode === 'multi') {
    return [offer(10, { maxGuests: 5, directTotal: 120 }), offer(2, { maxGuests: 2, directTotal: 90 })];
  }
  if (mode === 'three') return [offer(2, { maxGuests: 2 }), offer(1, { maxGuests: 4 }), offer(5, { maxGuests: 3, directTotal: 110 })];
  if (mode === 'four') return [offer(8, { maxGuests: 4, directTotal: 130 }), offer(1, { maxGuests: 4, directTotal: 120 })];
  if (mode === 'five') return [offer(10, { maxGuests: 5, directTotal: 150 })];
  return DEFAULT_OFFERS.filter((item) => item.maxGuests >= guests);
}

async function installRoutes(page, mode, emailCapture) {
  await page.route('**/api/ai-assistant/smart', async (route) => {
    const request = route.request();
    const body = request.postDataJSON();
    const guests = Number(body?.search?.guests || 0);
    if (!guests) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ action: 'respond', answer: '', language: body?.language || 'el', search: body?.search || {}, offers: [] }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        action: 'search_rooms',
        answer: 'Βρέθηκαν επιλογές.',
        language: body?.language || 'el',
        search: body.search,
        offers: offersFor(mode, guests),
        bookingConfirmed: false,
      }),
    });
  });

  await page.route('**/api/ai-assistant/summary-email', async (route) => {
    emailCapture.payload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, emailSent: true }) });
  });
}

async function submitInput(page, value) {
  const input = page.locator('form input');
  await input.waitFor({ state: 'visible' });
  await input.fill(value);
  await input.press('Enter');
}

async function openGreek(page) {
  await page.goto(`${BASE_URL}/ai-assistant/?lang=el`, { waitUntil: 'networkidle' });
  await page.getByText('Καλώς ήρθατε στο Voulamandis House', { exact: false }).waitFor();
}

async function reachPreferences(page, roomCount = 1, guestGroups = [2], dates = ['10/10/2030', '12/10/2030']) {
  await openGreek(page);
  await submitInput(page, dates[0]);
  await page.getByText('Ποια ημέρα θα γίνει το check-out;', { exact: false }).waitFor();
  await submitInput(page, dates[1]);
  const roomLabel = roomCount === 1 ? '1 δωμάτιο' : `${roomCount} δωμάτια`;
  await page.getByRole('button', { name: roomLabel, exact: true }).click();
  for (const guests of guestGroups) {
    const guestLabel = guests === 1 ? '1 άτομο' : `${guests} άτομα`;
    await page.getByRole('button', { name: guestLabel, exact: true }).click();
  }
  await page.getByRole('button', { name: 'Προβολή δωματίων', exact: true }).waitFor();
}

async function showRooms(page, filters = []) {
  for (const filter of filters) await page.getByRole('button', { name: filter, exact: true }).click();
  const button = filters.length ? 'Προβολή δωματίων' : 'Χωρίς προτίμηση';
  await page.getByRole('button', { name: button, exact: true }).click();
  await page.locator('[data-ai-room-carousel="true"]').waitFor();
}

async function firstCardTitle(page) {
  return (await page.locator('article').first().getByRole('heading').innerText()).trim();
}

async function runScenario(context, name, mode, fn) {
  const page = await context.newPage();
  const emailCapture = { payload: null };
  await installRoutes(page, mode, emailCapture);
  try {
    await fn(page, emailCapture);
    console.log(`PASS ${name}`);
    return { name, passed: true };
  } catch (error) {
    console.error(`FAIL ${name}:`, error);
    await page.screenshot({ path: `qa-results/${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`, fullPage: true }).catch(() => {});
    return { name, passed: false, error: String(error?.stack || error) };
  } finally {
    await page.close();
  }
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'el-GR' });
const results = [];

results.push(await runScenario(context, 'seven-language-initialization', 'default', async (page) => {
  const expected = {
    el: 'Καλώς ήρθατε', en: 'Welcome to', de: 'Willkommen', fr: 'Bienvenue', it: 'Benvenuti', es: 'Bienvenido', tr: 'hoş geldiniz',
  };
  for (const [language, text] of Object.entries(expected)) {
    await page.goto(`${BASE_URL}/ai-assistant/?lang=${language}`, { waitUntil: 'networkidle' });
    await page.getByText(text, { exact: false }).waitFor();
    assert.equal(await page.locator('select').inputValue(), language);
    assert.equal(await page.locator('html').getAttribute('lang'), language);
  }
}));

results.push(await runScenario(context, 'language-selector-persists-url', 'default', async (page) => {
  await openGreek(page);
  await page.locator('select').selectOption('en');
  await page.waitForURL(/lang=en/);
  await page.getByText('Welcome to Voulamandis House', { exact: false }).waitFor();
}));

results.push(await runScenario(context, 'invalid-checkout-remains-on-step', 'default', async (page) => {
  await openGreek(page);
  await submitInput(page, '10/10/2030');
  await submitInput(page, '09/10/2030');
  await page.getByText('Το check-out πρέπει να είναι μετά το check-in.', { exact: true }).waitFor();
  assert.equal(await page.locator('main').getAttribute('data-ai-step'), 'checkout');
  assert.equal(await page.locator('form input').isEnabled(), true);
}));

results.push(await runScenario(context, 'past-checkin-is-rejected', 'default', async (page) => {
  await openGreek(page);
  await submitInput(page, '01/01/2020');
  await page.getByText('Το check-in δεν μπορεί να είναι σε παρελθοντική ημερομηνία.', { exact: true }).waitFor();
  assert.equal(await page.locator('main').getAttribute('data-ai-step'), 'checkin');
}));

results.push(await runScenario(context, 'cross-year-numeric-checkout', 'default', async (page) => {
  await openGreek(page);
  await submitInput(page, '30/09/2030');
  await submitInput(page, '01/03');
  await page.getByRole('button', { name: '1 δωμάτιο', exact: true }).waitFor();
  await page.getByText('2030-09-30 → 2031-03-01', { exact: false }).waitFor();
}));

results.push(await runScenario(context, 'two-guests-business-order-and-badges', 'default', async (page) => {
  await reachPreferences(page, 1, [2]);
  await showRooms(page);
  assert.equal(await firstCardTitle(page), 'Δωμάτιο 2');
  assert.equal(await page.locator('article').count(), 10);
  await page.locator('article').first().getByText('Καλύτερη επιλογή για 2 άτομα', { exact: true }).waitFor();
  await page.locator('article').first().getByText('Χαμηλότερη τιμή', { exact: true }).waitFor();
  await page.locator('article').first().getByText('Οικονομικό δίκλινο · Πρώτος όροφος', { exact: true }).waitFor();
}));

results.push(await runScenario(context, 'three-guests-filters-capacity', 'three', async (page) => {
  await reachPreferences(page, 1, [3]);
  await showRooms(page);
  assert.equal(await firstCardTitle(page), 'Δωμάτιο 5');
  assert.equal(await page.getByRole('heading', { name: 'Δωμάτιο 2', exact: true }).count(), 0);
}));

results.push(await runScenario(context, 'four-guests-room-one-first', 'four', async (page) => {
  await reachPreferences(page, 1, [4]);
  await showRooms(page);
  assert.equal(await firstCardTitle(page), 'Δωμάτιο 1');
}));

results.push(await runScenario(context, 'five-guests-only-apartment-ten', 'five', async (page) => {
  await reachPreferences(page, 1, [5]);
  await showRooms(page);
  assert.equal(await firstCardTitle(page), 'Διαμέρισμα 10');
  assert.equal(await page.locator('article').count(), 1);
}));

results.push(await runScenario(context, 'kitchen-preference-promotes-apartments', 'default', async (page) => {
  await reachPreferences(page, 1, [2]);
  await showRooms(page, ['Κουζίνα']);
  assert.equal(await firstCardTitle(page), 'Διαμέρισμα 8');
  await page.locator('article').first().getByText('Ταιριάζει στις προτιμήσεις σας', { exact: true }).waitFor();
}));

results.push(await runScenario(context, 'multi-room-no-capacity-fallback', 'multi', async (page) => {
  await reachPreferences(page, 2, [2, 5]);
  await showRooms(page);
  const roomTen = page.locator('article').filter({ hasText: 'Δωμάτιο 10' });
  await roomTen.getByRole('button', { name: 'Επιλογή', exact: true }).click();
  await page.getByText('Δεν βρήκα διαφορετικό διαθέσιμο δωμάτιο', { exact: false }).waitFor();
  assert.equal(await page.locator('main').getAttribute('data-ai-step'), 'unavailable');
}));

results.push(await runScenario(context, 'split-stay-presentation', 'split', async (page) => {
  await reachPreferences(page, 1, [2]);
  await showRooms(page);
  assert.match(await firstCardTitle(page), /^Συνδυαστική διαμονή:/);
  await page.getByText('1 αλλαγή δωματίου', { exact: true }).waitFor();
  assert.equal(await page.getByText('Καλύτερη επιλογή για 2 άτομα', { exact: true }).count(), 0);
  assert.equal(await page.getByText('Χαμηλότερη τιμή', { exact: true }).count(), 0);
}));

results.push(await runScenario(context, 'carousel-modal-breakfast-and-contact', 'default', async (page, emailCapture) => {
  await reachPreferences(page, 1, [2]);
  await showRooms(page);
  const first = page.locator('article').first();
  await first.getByRole('button', { name: 'Λεπτομέρειες', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('heading', { name: 'Δωμάτιο 2', exact: true }).waitFor();
  await dialog.getByText('2 ×', { exact: false }).waitFor();
  await dialog.getByText('×', { exact: true }).click();
  await first.getByRole('button', { name: 'Επιλογή', exact: true }).click();
  await page.getByAltText('Σπιτικό πρωινό στο Voulamandis House').waitFor();
  await page.getByRole('button', { name: 'Ναι, προσθήκη', exact: true }).click();
  await page.getByText('Πρωινό', { exact: true }).waitFor();
  await page.getByPlaceholder('Όνομα').fill('QA Guest');
  await page.getByPlaceholder('Τηλέφωνο').fill('6900000000');
  await page.getByRole('button', { name: 'Αποστολή αιτήματος', exact: true }).click();
  await page.getByText('Το αίτημά σας στάλθηκε.', { exact: false }).waitFor();
  assert(emailCapture.payload);
  assert.match(emailCapture.payload.subject, /AI Room Finder — QA Guest/);
  assert.match(emailCapture.payload.message, /Δωμάτιο 2/);
  assert.match(emailCapture.payload.message, /Πρωινό/);
  assert.match(emailCapture.payload.message, /148/);
}));

await browser.close();

const failed = results.filter((result) => !result.passed);
const report = { total: results.length, passed: results.length - failed.length, failed: failed.length, results };
await import('node:fs').then(({ mkdirSync, writeFileSync }) => {
  mkdirSync('qa-results', { recursive: true });
  writeFileSync('qa-results/ai-room-chat-final-report.json', JSON.stringify(report, null, 2));
});
console.log(JSON.stringify(report, null, 2));
if (failed.length) process.exit(1);

#!/usr/bin/env node

import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const BASE_URL = String(process.env.AI_QA_BASE_URL || "https://chioshotel.gr").replace(/\/$/, "");
const REPORT_DIR = "qa-results";
const REPORT_PATH = `${REPORT_DIR}/ai-room-cards-ui-report.json`;
const LANGUAGES = ["el", "en", "de", "fr", "it", "es", "tr"];

const UI = {
  el: { checkout: "Ποια ημέρα θα γίνει το check-out;", details: "Προβολή λεπτομερειών", select: "Επιλογή", close: "Κλείσιμο", amenities: "Παροχές δωματίου", noPreference: "Χωρίς προτίμηση" },
  en: { checkout: "What date would you like to check out?", details: "View details", select: "Select", close: "Close", amenities: "Room amenities", noPreference: "No preference" },
  de: { checkout: "Wann möchten Sie abreisen?", details: "Details ansehen", select: "Auswählen", close: "Schließen", amenities: "Zimmerausstattung", noPreference: "Keine Präferenz" },
  fr: { checkout: "Quelle est votre date de départ ?", details: "Voir les détails", select: "Sélectionner", close: "Fermer", amenities: "Équipements de la chambre", noPreference: "Sans préférence" },
  it: { checkout: "Qual è la data di check-out?", details: "Vedi dettagli", select: "Seleziona", close: "Chiudi", amenities: "Servizi della camera", noPreference: "Nessuna preferenza" },
  es: { checkout: "¿Cuál es la fecha de salida?", details: "Ver detalles", select: "Seleccionar", close: "Cerrar", amenities: "Servicios de la habitación", noPreference: "Sin preferencia" },
  tr: { checkout: "Çıkış tarihiniz nedir?", details: "Detayları gör", select: "Seç", close: "Kapat", amenities: "Oda olanakları", noPreference: "Tercihim yok" },
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    const payload = await response.json().catch(() => null);
    assert(response.ok, `HTTP ${response.status} for ${url}`);
    return payload;
  } finally {
    clearTimeout(timer);
  }
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, { redirect: "follow", signal: controller.signal });
    return { url, status: response.status, finalUrl: response.url, ok: response.ok };
  } catch (error) {
    return { url, status: 0, finalUrl: "", ok: false, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

async function submitInput(page, value) {
  const input = page.locator("form input");
  await input.waitFor({ state: "visible", timeout: 15000 });
  await input.fill(value);
  await input.press("Enter");
}

async function loadCatalog(language) {
  const payload = await fetchJson(`${BASE_URL}/api/ai-assistant/room-catalog?language=${language}`);
  assert(payload?.ok === true, `${language}: room catalog did not return ok:true`);
  assert(payload?.language === language, `${language}: room catalog returned ${payload?.language}`);
  assert(Array.isArray(payload?.rooms), `${language}: room catalog has no rooms array`);
  assert(payload.rooms.length === 10, `${language}: expected 10 room cards, got ${payload.rooms.length}`);
  const numbers = payload.rooms.map((room) => Number(room.roomNumber)).sort((a, b) => a - b);
  assert(JSON.stringify(numbers) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), `${language}: room numbers are incomplete`);
  return payload.rooms;
}

async function runLanguage(browser, language, rooms) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: language });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.route("**/api/ai-assistant/smart", async (route) => {
    let body = {};
    try { body = route.request().postDataJSON() || {}; } catch {}
    const current = body?.search && typeof body.search === "object" ? body.search : {};

    if (Number(current.guests)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          answer: "QA room cards ready",
          action: "search_rooms",
          language,
          search: current,
          offers: rooms,
          discountPercent: 10,
        }),
      });
      return;
    }

    if (!current.checkin) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          answer: UI[language].checkout,
          action: "ask_user",
          language,
          search: { checkin: "2026-09-15" },
          offers: [],
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer: "Dates recorded",
        action: "ask_user",
        language,
        search: { checkin: current.checkin, checkout: "2026-09-18" },
        offers: [],
      }),
    });
  });

  const result = { language, status: "pass", cardsChecked: 0, detailsOpened: 0, rooms: [], consoleErrors };

  try {
    await page.goto(`${BASE_URL}/ai-assistant/?lang=${language}&qa=room-cards`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await submitInput(page, "15 September 2026");
    await page.waitForTimeout(150);
    await submitInput(page, "18 September 2026");
    await page.waitForTimeout(150);
    await submitInput(page, "1");
    await page.waitForTimeout(100);
    await submitInput(page, "2");

    const noPreference = page.getByRole("button", { name: UI[language].noPreference, exact: true });
    await noPreference.waitFor({ state: "visible", timeout: 15000 });
    await noPreference.click();

    const card = page.locator("article").first();
    await card.waitFor({ state: "visible", timeout: 15000 });

    for (let index = 0; index < rooms.length; index += 1) {
      const expected = rooms[index];
      const heading = card.getByRole("heading", { name: expected.name, exact: true });
      await heading.waitFor({ state: "visible", timeout: 10000 });

      const cardText = await card.innerText();
      assert(cardText.includes(expected.category), `${language} room ${expected.roomNumber}: category is not localized`);
      assert(cardText.includes(expected.floor), `${language} room ${expected.roomNumber}: floor is not localized`);
      assert(/€/.test(cardText), `${language} room ${expected.roomNumber}: price is missing`);
      const cardImage = card.locator("img").first();
      await cardImage.waitFor({ state: "visible", timeout: 10000 });
      const imageLoaded = await cardImage.evaluate((image) => image.complete && image.naturalWidth > 0);
      assert(imageLoaded, `${language} room ${expected.roomNumber}: card image did not load`);

      await card.getByRole("button", { name: UI[language].details, exact: true }).click();
      const dialog = page.getByRole("dialog").last();
      await dialog.waitFor({ state: "visible", timeout: 10000 });
      await dialog.getByRole("heading", { name: expected.name, exact: true }).waitFor({ state: "visible" });
      const dialogText = await dialog.innerText();
      assert(dialogText.includes(expected.category), `${language} room ${expected.roomNumber}: detail category is not localized`);
      assert(dialogText.includes(UI[language].amenities), `${language} room ${expected.roomNumber}: localized amenities heading is missing`);
      await dialog.getByRole("button", { name: UI[language].select, exact: true }).waitFor({ state: "visible" });
      const detailImage = dialog.locator("img").first();
      const detailImageLoaded = await detailImage.evaluate((image) => image.complete && image.naturalWidth > 0);
      assert(detailImageLoaded, `${language} room ${expected.roomNumber}: detail image did not load`);

      result.cardsChecked += 1;
      result.detailsOpened += 1;
      result.rooms.push({ roomNumber: expected.roomNumber, name: expected.name, detailsUrl: expected.detailsUrl, status: "pass" });

      await dialog.getByRole("button", { name: UI[language].close, exact: true }).click();
      await dialog.waitFor({ state: "hidden", timeout: 10000 });

      if (index < rooms.length - 1) {
        await page.getByRole("button", { name: "Next room", exact: true }).click();
      }
    }

    assert(result.cardsChecked === 10, `${language}: only ${result.cardsChecked}/10 cards were checked`);
    assert(result.detailsOpened === 10, `${language}: only ${result.detailsOpened}/10 detail cards opened`);
  } catch (error) {
    result.status = "fail";
    result.error = error instanceof Error ? error.message : String(error);
    await page.screenshot({ path: `${REPORT_DIR}/ai-room-cards-${language}-failure.png`, fullPage: true }).catch(() => undefined);
  } finally {
    await context.close();
  }

  return result;
}

async function main() {
  await mkdir(REPORT_DIR, { recursive: true });
  const startedAt = new Date().toISOString();
  const catalogs = {};
  const catalogErrors = [];

  for (const language of LANGUAGES) {
    try {
      catalogs[language] = await loadCatalog(language);
    } catch (error) {
      catalogErrors.push({ language, error: error instanceof Error ? error.message : String(error) });
      catalogs[language] = [];
    }
  }

  const uniqueDetails = new Set();
  const uniqueImages = new Set();
  for (const rooms of Object.values(catalogs)) {
    for (const room of rooms) {
      uniqueDetails.add(new URL(room.detailsUrl, BASE_URL).toString());
      uniqueImages.add(new URL(room.image, BASE_URL).toString());
    }
  }

  const detailUrlChecks = [];
  for (const url of uniqueDetails) detailUrlChecks.push(await checkUrl(url));
  const imageUrlChecks = [];
  for (const url of uniqueImages) imageUrlChecks.push(await checkUrl(url));

  let browser = null;
  const results = [];
  try {
    browser = await chromium.launch({ headless: true });
    for (const language of LANGUAGES) {
      if (catalogs[language].length !== 10) {
        results.push({ language, status: "fail", cardsChecked: 0, detailsOpened: 0, error: "Catalog unavailable or incomplete" });
        continue;
      }
      const result = await runLanguage(browser, language, catalogs[language]);
      results.push(result);
      console.log(`${result.status === "pass" ? "✓" : "✗"} ${language}: ${result.cardsChecked}/10 cards, ${result.detailsOpened}/10 details`);
    }
  } finally {
    await browser?.close();
  }

  const failedLanguages = results.filter((result) => result.status !== "pass").length;
  const failedDetailUrls = detailUrlChecks.filter((item) => !item.ok);
  const failedImages = imageUrlChecks.filter((item) => !item.ok);
  const report = {
    version: 1,
    purpose: "Browser QA for every live room card and detail modal in all seven languages",
    target: BASE_URL,
    startedAt,
    finishedAt: new Date().toISOString(),
    languages: LANGUAGES.length,
    expectedCardsPerLanguage: 10,
    totalExpectedCardChecks: 70,
    totalCardsChecked: results.reduce((sum, result) => sum + Number(result.cardsChecked || 0), 0),
    totalDetailsOpened: results.reduce((sum, result) => sum + Number(result.detailsOpened || 0), 0),
    passedLanguages: results.filter((result) => result.status === "pass").length,
    failedLanguages,
    catalogErrors,
    detailUrlChecks,
    imageUrlChecks,
    failedDetailUrls: failedDetailUrls.length,
    failedImages: failedImages.length,
    status: failedLanguages || catalogErrors.length || failedDetailUrls.length || failedImages.length ? "completed_with_findings" : "all_passed",
    results,
  };

  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`UI result: ${report.totalCardsChecked}/70 cards checked, ${report.totalDetailsOpened}/70 detail modals opened`);
  console.log(`Report: ${REPORT_PATH}`);
  if (report.status !== "all_passed") process.exitCode = 1;
}

main().catch(async (error) => {
  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(REPORT_PATH, `${JSON.stringify({ version: 1, status: "runner_failed", error: error instanceof Error ? error.message : String(error) }, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 1;
});

#!/usr/bin/env node

import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const BASE_URL = String(process.env.AI_QA_BASE_URL || "https://chioshotel.gr").replace(/\/$/, "");
const REPORT_DIR = "qa-results";
const REPORT_PATH = `${REPORT_DIR}/ai-presentation-regressions-report.json`;

const UI = {
  el: { checkout: "Ποια ημέρα θα γίνει το check-out;", noPreference: "Χωρίς προτίμηση", details: "Προβολή λεπτομερειών", close: "Κλείσιμο", select: "Επιλογή", noBreakfast: "Χωρίς πρωινό", total: "Τελικό σύνολο" },
  en: { checkout: "What date would you like to check out?", noPreference: "No preference", details: "View details", close: "Close", select: "Select", noBreakfast: "No breakfast", total: "Grand total" },
  de: { checkout: "Wann möchten Sie abreisen?", noPreference: "Keine Präferenz", details: "Details ansehen", close: "Schließen", select: "Auswählen", noBreakfast: "Ohne Frühstück", total: "Gesamtsumme" },
  fr: { checkout: "Quelle est votre date de départ ?", noPreference: "Sans préférence", details: "Voir les détails", close: "Fermer", select: "Sélectionner", noBreakfast: "Sans petit-déjeuner", total: "Total général" },
  it: { checkout: "Qual è la data di check-out?", noPreference: "Nessuna preferenza", details: "Vedi dettagli", close: "Chiudi", select: "Seleziona", noBreakfast: "Senza colazione", total: "Totale finale" },
  es: { checkout: "¿Cuál es la fecha de salida?", noPreference: "Sin preferencia", details: "Ver detalles", close: "Cerrar", select: "Seleccionar", noBreakfast: "Sin desayuno", total: "Importe total" },
  tr: { checkout: "Çıkış tarihiniz nedir?", noPreference: "Tercihim yok", details: "Detayları gör", close: "Kapat", select: "Seç", noBreakfast: "Kahvaltısız", total: "Genel toplam" },
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function submitInput(page, value) {
  const input = page.locator("form input");
  await input.waitFor({ state: "visible", timeout: 15000 });
  await input.fill(value);
  await input.press("Enter");
}

async function loadRooms(language) {
  const response = await fetch(`${BASE_URL}/api/ai-assistant/room-catalog?language=${language}`, { cache: "no-store" });
  const payload = await response.json();
  assert(response.ok && payload?.ok === true, `${language}: room catalog unavailable`);
  assert(Array.isArray(payload.rooms) && payload.rooms.length === 10, `${language}: expected 10 rooms, got ${payload?.rooms?.length || 0}`);
  return payload.rooms;
}

async function visibleDetailModal(page) {
  const modal = page.locator('[role="dialog"][aria-modal="true"], main > div.fixed.inset-0.z-50').filter({ visible: true }).last();
  await modal.waitFor({ state: "visible", timeout: 10000 });
  return modal;
}

async function runLanguage(browser, language) {
  const rooms = await loadRooms(language);
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: language });
  const page = await context.newPage();
  const result = {
    language,
    status: "pass",
    roomsChecked: 0,
    roomFits: [],
    totalLabel: "",
    timeoutPopupAbsent: true,
  };

  await page.route("**/api/ai-assistant/smart", async (route) => {
    let body = {};
    try { body = route.request().postDataJSON() || {}; } catch {}
    const current = body?.search && typeof body.search === "object" ? body.search : {};

    if (Number(current.guests)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          answer: "QA rooms ready",
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
        body: JSON.stringify({ answer: UI[language].checkout, action: "ask_user", language, search: { checkin: "2026-09-15" }, offers: [] }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ answer: "Dates recorded", action: "ask_user", language, search: { checkin: current.checkin, checkout: "2026-09-18" }, offers: [] }),
    });
  });

  try {
    await page.goto(`${BASE_URL}/ai-assistant/?lang=${language}&qa=presentation`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await submitInput(page, "15 September 2026");
    await submitInput(page, "18 September 2026");
    await submitInput(page, "1");
    await submitInput(page, "2");

    const noPreference = page.getByRole("button", { name: UI[language].noPreference, exact: true });
    await noPreference.waitFor({ state: "visible", timeout: 15000 });
    await noPreference.click();

    const card = page.locator("article").first();
    await card.waitFor({ state: "visible", timeout: 15000 });

    for (let index = 0; index < rooms.length; index += 1) {
      const expected = rooms[index];
      await card.getByRole("heading", { name: expected.name, exact: true }).waitFor({ state: "visible", timeout: 10000 });
      await card.getByRole("button", { name: UI[language].details, exact: true }).click();

      const modal = await visibleDetailModal(page);
      const heroImage = modal.locator("img").first();
      await heroImage.waitFor({ state: "visible", timeout: 10000 });
      await page.waitForTimeout(100);

      const objectFit = await heroImage.evaluate((image) => getComputedStyle(image).objectFit);
      assert(objectFit === "contain", `${language} room ${expected.roomNumber}: detail hero uses ${objectFit}, expected contain`);
      result.roomFits.push({ roomNumber: expected.roomNumber, name: expected.name, objectFit });
      result.roomsChecked += 1;

      if (language === "el" && index === 0) {
        await page.waitForTimeout(19000);
        const timeoutPopup = page.getByText("Χρειάζεστε βοήθεια;", { exact: true });
        result.timeoutPopupAbsent = (await timeoutPopup.count()) === 0;
        assert(result.timeoutPopupAbsent, "18-second help popup still appeared");
      }

      await modal.getByRole("button", { name: UI[language].close, exact: true }).click();
      await modal.waitFor({ state: "hidden", timeout: 10000 });

      if (index < rooms.length - 1) {
        await page.getByRole("button", { name: "Next room", exact: true }).click();
      }
    }

    assert(result.roomsChecked === 10, `${language}: only ${result.roomsChecked}/10 room photos checked`);
    await card.getByRole("button", { name: UI[language].select, exact: true }).click();

    const noBreakfast = page.getByRole("button", { name: UI[language].noBreakfast, exact: true });
    await noBreakfast.waitFor({ state: "visible", timeout: 10000 });
    await noBreakfast.click();

    const total = page.getByText(UI[language].total, { exact: true });
    await total.waitFor({ state: "visible", timeout: 10000 });
    result.totalLabel = (await total.innerText()).trim();
    assert(result.totalLabel === UI[language].total, `${language}: wrong total label ${result.totalLabel}`);
  } catch (error) {
    result.status = "fail";
    result.error = error instanceof Error ? error.message : String(error);
    await page.screenshot({ path: `${REPORT_DIR}/ai-presentation-${language}-failure.png`, fullPage: true }).catch(() => undefined);
  } finally {
    await context.close();
  }

  return result;
}

async function main() {
  await mkdir(REPORT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const language of Object.keys(UI)) {
      const result = await runLanguage(browser, language);
      results.push(result);
      console.log(`${result.status === "pass" ? "✓" : "✗"} ${language}: ${result.roomsChecked}/10 full-photo details, total=${result.totalLabel || "n/a"}`);
    }
  } finally {
    await browser.close();
  }

  const passed = results.filter((result) => result.status === "pass").length;
  const totalRoomPhotosChecked = results.reduce((sum, result) => sum + Number(result.roomsChecked || 0), 0);
  const report = {
    version: 2,
    purpose: "Regression QA for all 70 uncropped room-detail photos, localized final totals, and complete removal of the 18-second popup",
    target: BASE_URL,
    totalLanguages: results.length,
    passedLanguages: passed,
    failedLanguages: results.length - passed,
    expectedRoomPhotoChecks: 70,
    totalRoomPhotosChecked,
    status: passed === results.length && totalRoomPhotosChecked === 70 ? "all_passed" : "completed_with_findings",
    results,
  };
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Presentation result: ${report.passedLanguages}/${report.totalLanguages} languages, ${report.totalRoomPhotosChecked}/70 room photos checked`);
  console.log(`Report: ${REPORT_PATH}`);
  if (report.status !== "all_passed") process.exitCode = 1;
}

main().catch(async (error) => {
  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(REPORT_PATH, `${JSON.stringify({ version: 2, status: "runner_failed", error: error instanceof Error ? error.message : String(error) }, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 1;
});

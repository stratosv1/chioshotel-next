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

async function loadRoom(language) {
  const response = await fetch(`${BASE_URL}/api/ai-assistant/room-catalog?language=${language}`, { cache: "no-store" });
  const payload = await response.json();
  assert(response.ok && payload?.ok === true, `${language}: room catalog unavailable`);
  assert(Array.isArray(payload.rooms) && payload.rooms.length > 0, `${language}: no room in catalog`);
  return payload.rooms[0];
}

async function runLanguage(browser, language) {
  const room = await loadRoom(language);
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: language });
  const page = await context.newPage();
  const result = { language, status: "pass", objectFit: "", totalLabel: "", timeoutPopupAbsent: true };

  await page.route("**/api/ai-assistant/smart", async (route) => {
    let body = {};
    try { body = route.request().postDataJSON() || {}; } catch {}
    const current = body?.search && typeof body.search === "object" ? body.search : {};

    if (Number(current.guests)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          answer: "QA room ready",
          action: "search_rooms",
          language,
          search: current,
          offers: [room],
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
    await card.getByRole("button", { name: UI[language].details, exact: true }).click();

    const dialog = page.getByRole("dialog").last();
    await dialog.waitFor({ state: "visible", timeout: 10000 });
    const heroImage = dialog.locator("img").first();
    await heroImage.waitFor({ state: "visible", timeout: 10000 });
    result.objectFit = await heroImage.evaluate((image) => getComputedStyle(image).objectFit);
    assert(result.objectFit === "contain", `${language}: detail hero uses ${result.objectFit}, expected contain`);

    if (language === "el") {
      await page.waitForTimeout(19000);
      const alerts = await page.locator('[role="alert"]').count();
      result.timeoutPopupAbsent = alerts === 0;
      assert(result.timeoutPopupAbsent, "18-second help popup still appeared");
    }

    await dialog.getByRole("button", { name: UI[language].close, exact: true }).click();
    await dialog.waitFor({ state: "hidden", timeout: 10000 });
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
      console.log(`${result.status === "pass" ? "✓" : "✗"} ${language}: object-fit=${result.objectFit || "n/a"}, total=${result.totalLabel || "n/a"}`);
    }
  } finally {
    await browser.close();
  }

  const passed = results.filter((result) => result.status === "pass").length;
  const report = {
    version: 1,
    purpose: "Regression QA for full room photos, localized final totals, and complete removal of the 18-second popup",
    target: BASE_URL,
    total: results.length,
    passed,
    failed: results.length - passed,
    status: passed === results.length ? "all_passed" : "completed_with_findings",
    results,
  };
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Presentation result: ${report.passed}/${report.total} languages passed`);
  console.log(`Report: ${REPORT_PATH}`);
  if (report.failed) process.exitCode = 1;
}

main().catch(async (error) => {
  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(REPORT_PATH, `${JSON.stringify({ version: 1, status: "runner_failed", error: error instanceof Error ? error.message : String(error) }, null, 2)}\n`, "utf8");
  console.error(error);
  process.exitCode = 1;
});

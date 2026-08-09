import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.TRIP_PLANNER_BASE_URL || "http://127.0.0.1:3000";
const outputRoot = process.env.TRIP_PLANNER_VISUAL_OUTPUT || "artifacts/trip-planner-visual";

const devices = [
  { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true },
  { name: "desktop", viewport: { width: 1440, height: 1000 }, isMobile: false },
];

const browser = await chromium.launch({ headless: true });

async function screenshot(page, deviceName, fileName, fullPage = true) {
  const directory = path.join(outputRoot, deviceName);
  await mkdir(directory, { recursive: true });
  await page.screenshot({
    path: path.join(directory, fileName),
    fullPage,
    animations: "disabled",
  });
}

async function clickCategory(page, label) {
  const button = page.getByRole("button", { name: label, exact: true });
  if (await button.count()) await button.click();
}

async function captureDevice(device) {
  const context = await browser.newContext({
    viewport: device.viewport,
    deviceScaleFactor: 1,
    isMobile: device.isMobile,
    hasTouch: device.isMobile,
    locale: "el-GR",
    timezoneId: "Europe/Athens",
  });
  const page = await context.newPage();

  page.on("console", (message) => {
    if (message.type() === "error") {
      console.error(`[${device.name}] browser console:`, message.text());
    }
  });

  await page.goto(`${baseUrl}/trip-planner/`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.getByRole("heading", { name: "Τι θέλεις να κάνεις σήμερα;" }).waitFor();
  await screenshot(page, device.name, "01-activities.png");

  // Beach starts selected. Add Village + Food to exercise the intended flow.
  await clickCategory(page, "Χωριό");
  await clickCategory(page, "Φαγητό");
  await screenshot(page, device.name, "02-activities-selected.png");

  await page.getByRole("button", { name: /Συνέχεια/ }).click();
  await page.getByRole("heading", { name: "Προς τα πού θέλεις να κινηθείς;" }).waitFor();

  // Give the Open-Meteo request enough time to populate the recommendation card.
  await page.waitForTimeout(5_000);
  await screenshot(page, device.name, "03-region-weather-tip.png");

  const recommendButton = page.getByRole("button", { name: /Πρότεινέ μου/ });
  await recommendButton.click();
  await page.getByRole("heading", { name: /Διάλεξε παραλίες/ }).waitFor();
  await page.waitForTimeout(1_500);
  await screenshot(page, device.name, "04-beaches-weather.png");

  const placeCards = page.locator('button[aria-pressed="false"]');
  const cardCount = await placeCards.count();
  if (cardCount > 0) await placeCards.nth(0).click();
  if (cardCount > 1) await page.locator('button[aria-pressed="false"]').nth(0).click();
  await screenshot(page, device.name, "05-beaches-selected.png");

  const continuePlaces = page.getByRole("button", { name: /Συνέχεια με|Συνέχεια →/ });
  if (await continuePlaces.count()) {
    await continuePlaces.last().click();
    await page.getByRole("heading", { name: /Διάλεξε χωριά/ }).waitFor();
    await screenshot(page, device.name, "06-villages-selection-strip.png");
  }

  await context.close();
}

try {
  for (const device of devices) {
    await captureDevice(device);
  }
} finally {
  await browser.close();
}

import { DEFAULT_GA4_PROPERTY_ID, runOrganicSearchLandingPageReport } from "@/lib/ga4/client";
import {
  ensureGa4Tables,
  finishGa4SyncRun,
  replaceGa4OrganicRows,
  startGa4SyncRun,
  type StoredGa4OrganicRow,
} from "@/lib/ga4/store";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function subtractDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() - days);
  return copy;
}

function normalizeGaDate(value: string) {
  if (/^\d{8}$/.test(value)) return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  return value;
}

function metric(metrics: Record<string, number>, name: string) {
  const value = Number(metrics[name] || 0);
  return Number.isFinite(value) ? value : 0;
}

export type Ga4SyncOptions = {
  startDate?: string;
  endDate?: string;
};

export async function syncGa4OrganicSearch(request: Request, options: Ga4SyncOptions = {}) {
  await ensureGa4Tables();

  const today = new Date();
  const endDate = options.endDate || isoDate(subtractDays(today, 1));
  // Keep enough overlap for current and previous 28-day decision windows.
  const startDate = options.startDate || isoDate(subtractDays(new Date(`${endDate}T00:00:00Z`), 69));
  const configuredPropertyId = process.env.GA4_PROPERTY_ID?.trim() || DEFAULT_GA4_PROPERTY_ID;
  const runId = await startGa4SyncRun(configuredPropertyId, startDate, endDate);
  let rowsWritten = 0;

  try {
    const report = await runOrganicSearchLandingPageReport(request, { startDate, endDate });
    const rows: StoredGa4OrganicRow[] = report.rows.map((row) => ({
      propertyId: report.propertyId,
      date: normalizeGaDate(row.dimensions.date || "1970-01-01"),
      landingPage: row.dimensions.landingPage || "(not set)",
      sessions: metric(row.metrics, "sessions"),
      activeUsers: metric(row.metrics, "activeUsers"),
      newUsers: metric(row.metrics, "newUsers"),
      engagedSessions: metric(row.metrics, "engagedSessions"),
      engagementRate: metric(row.metrics, "engagementRate"),
      keyEvents: metric(row.metrics, "keyEvents"),
      sessionKeyEventRate: metric(row.metrics, "sessionKeyEventRate"),
    }));

    await replaceGa4OrganicRows(report.propertyId, startDate, endDate, rows);
    rowsWritten = rows.length;
    await finishGa4SyncRun(runId, "success", rowsWritten);

    return {
      ok: true,
      propertyId: report.propertyId,
      channel: "Organic Search",
      startDate,
      endDate,
      rowsWritten,
      reportRowCount: report.rowCount,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await finishGa4SyncRun(runId, "failed", rowsWritten, message);
    throw error;
  }
}

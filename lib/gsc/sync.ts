import {
  GSC_SEARCH_TYPES,
  listSearchConsoleSites,
  listSearchConsoleSitemaps,
  queryAllSearchAnalytics,
  type GscSearchType,
} from "@/lib/gsc/client";
import {
  ensureGscTables,
  finishGscSyncRun,
  replaceGscDataset,
  savePropertiesSnapshot,
  saveSitemapsSnapshot,
  startGscSyncRun,
  type StoredGscRow,
} from "@/lib/gsc/store";

const PRIMARY_SITE = "sc-domain:chioshotel.gr";

const STANDARD_DATASETS = [
  { grain: "daily", dimensions: ["date"] },
  { grain: "query", dimensions: ["date", "query"] },
  { grain: "page", dimensions: ["date", "page"] },
  { grain: "query_page", dimensions: ["date", "query", "page"] },
  { grain: "country", dimensions: ["date", "country"] },
  { grain: "device", dimensions: ["date", "device"] },
  { grain: "search_appearance", dimensions: ["date", "searchAppearance"] },
] as const;

const FEED_DATASETS = [
  { grain: "daily", dimensions: ["date"] },
  { grain: "page", dimensions: ["date", "page"] },
  { grain: "country", dimensions: ["date", "country"] },
  { grain: "device", dimensions: ["date", "device"] },
  { grain: "search_appearance", dimensions: ["date", "searchAppearance"] },
] as const;

function datasetsForType(type: GscSearchType) {
  return type === "discover" || type === "googleNews" ? FEED_DATASETS : STANDARD_DATASETS;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function subtractDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() - days);
  return copy;
}

function normalizeRows(
  siteUrl: string,
  searchType: string,
  grain: string,
  dimensions: readonly string[],
  rows: Array<{ keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }>,
  dataState: string,
  firstIncompleteDate?: string,
): StoredGscRow[] {
  return rows.map((row) => {
    const values = new Map<string, string>();
    dimensions.forEach((dimension, index) => values.set(dimension, row.keys?.[index] || ""));
    const date = values.get("date") || "1970-01-01";
    return {
      siteUrl,
      searchType,
      grain,
      date,
      query: values.get("query") || "",
      page: values.get("page") || "",
      country: values.get("country") || "",
      device: values.get("device") || "",
      searchAppearance: values.get("searchAppearance") || "",
      clicks: Number(row.clicks || 0),
      impressions: Number(row.impressions || 0),
      ctr: Number(row.ctr || 0),
      position: Number(row.position || 0),
      dataState,
      isIncomplete: Boolean(firstIncompleteDate && date >= firstIncompleteDate),
    };
  });
}

export type GscSyncOptions = {
  siteUrl?: string;
  startDate?: string;
  endDate?: string;
  searchTypes?: GscSearchType[];
};

export async function syncSearchConsole(request: Request, options: GscSyncOptions = {}) {
  await ensureGscTables();

  const siteUrl = options.siteUrl || PRIMARY_SITE;
  const today = new Date();
  const endDate = options.endDate || isoDate(subtractDays(today, 1));
  const startDate = options.startDate || isoDate(subtractDays(new Date(`${endDate}T00:00:00Z`), 34));
  const searchTypes = options.searchTypes?.length ? options.searchTypes : [...GSC_SEARCH_TYPES];

  const runId = await startGscSyncRun(siteUrl, startDate, endDate);
  let rowsWritten = 0;
  let datasets = 0;

  try {
    const sites = await listSearchConsoleSites(request);
    await savePropertiesSnapshot(sites.siteEntry || []);

    const sitemaps = await listSearchConsoleSitemaps(request, siteUrl);
    await saveSitemapsSnapshot(siteUrl, sitemaps.sitemap || []);

    for (const searchType of searchTypes) {
      for (const dataset of datasetsForType(searchType)) {
        const result = await queryAllSearchAnalytics(request, {
          siteUrl,
          startDate,
          endDate,
          dimensions: [...dataset.dimensions],
          type: searchType,
          dataState: "all",
        });

        const normalized = normalizeRows(
          siteUrl,
          searchType,
          dataset.grain,
          dataset.dimensions,
          result.rows,
          "all",
          result.metadata?.first_incomplete_date,
        );

        await replaceGscDataset(siteUrl, searchType, dataset.grain, startDate, endDate, normalized);
        rowsWritten += normalized.length;
        datasets += 1;
      }
    }

    await finishGscSyncRun(runId, "success", rowsWritten, datasets);
    return { ok: true, siteUrl, startDate, endDate, rowsWritten, datasets, searchTypes };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await finishGscSyncRun(runId, "failed", rowsWritten, datasets, message);
    throw error;
  }
}

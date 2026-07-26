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
] as const;

const GOOGLE_NEWS_DATASETS = [
  { grain: "daily", dimensions: ["date"] },
  { grain: "page", dimensions: ["date", "page"] },
  { grain: "country", dimensions: ["date", "country"] },
  { grain: "device", dimensions: ["date", "device"] },
] as const;

// Discover does not support grouping by device or query.
const DISCOVER_DATASETS = [
  { grain: "daily", dimensions: ["date"] },
  { grain: "page", dimensions: ["date", "page"] },
  { grain: "country", dimensions: ["date", "country"] },
] as const;

function datasetsForType(type: GscSearchType) {
  if (type === "discover") return DISCOVER_DATASETS;
  if (type === "googleNews") return GOOGLE_NEWS_DATASETS;
  return STANDARD_DATASETS;
}

function isUnsupportedDimensionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (!message.includes("Search Console API failed (400)")) return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes("cannot be grouped") ||
    normalized.includes("cannot group") ||
    normalized.includes("cannot be grouped by") ||
    normalized.includes("not supported") ||
    normalized.includes("invalid_argument")
  );
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function subtractDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() - days);
  return copy;
}

function datesBetween(startDate: string, endDate: string) {
  const dates: string[] = [];
  const cursor = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  while (cursor <= end) {
    dates.push(isoDate(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
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

function normalizeAppearanceRows(
  siteUrl: string,
  searchType: string,
  date: string,
  rows: Array<{ keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }>,
): StoredGscRow[] {
  return rows
    .map((row) => ({
      siteUrl,
      searchType,
      grain: "search_appearance",
      date,
      query: "",
      page: "",
      country: "",
      device: "",
      searchAppearance: row.keys?.[0] || "",
      clicks: Number(row.clicks || 0),
      impressions: Number(row.impressions || 0),
      ctr: Number(row.ctr || 0),
      position: Number(row.position || 0),
      dataState: "all",
      isIncomplete: false,
    }))
    .filter((row) => row.searchAppearance);
}

async function collectSearchAppearanceDaily(
  request: Request,
  siteUrl: string,
  searchType: GscSearchType,
  startDate: string,
  endDate: string,
) {
  const rows: StoredGscRow[] = [];
  for (const date of datesBetween(startDate, endDate)) {
    const result = await queryAllSearchAnalytics(request, {
      siteUrl,
      startDate: date,
      endDate: date,
      dimensions: ["searchAppearance"],
      type: searchType,
      dataState: "all",
    });
    rows.push(...normalizeAppearanceRows(siteUrl, searchType, date, result.rows));
  }
  return rows;
}

export type GscSyncOptions = {
  siteUrl?: string;
  startDate?: string;
  endDate?: string;
  searchTypes?: GscSearchType[];
};

export async function syncSearchConsole(request: Request, options: GscSyncOptions = {}) {
  let stage = "database:init";
  await ensureGscTables();

  const siteUrl = options.siteUrl || PRIMARY_SITE;
  const today = new Date();
  const endDate = options.endDate || isoDate(subtractDays(today, 1));
  const startDate = options.startDate || isoDate(subtractDays(new Date(`${endDate}T00:00:00Z`), 34));
  const searchTypes = options.searchTypes?.length ? options.searchTypes : [...GSC_SEARCH_TYPES];

  stage = "database:start-run";
  const runId = await startGscSyncRun(siteUrl, startDate, endDate);
  let rowsWritten = 0;
  let datasets = 0;
  const warnings: string[] = [];

  try {
    stage = "search-console:list-sites";
    console.info(`[gsc-sync] stage ${stage}`);
    const sites = await listSearchConsoleSites(request);

    stage = "database:save-properties";
    await savePropertiesSnapshot(sites.siteEntry || []);

    stage = "search-console:list-sitemaps";
    console.info(`[gsc-sync] stage ${stage}`);
    const sitemaps = await listSearchConsoleSitemaps(request, siteUrl);

    stage = "database:save-sitemaps";
    await saveSitemapsSnapshot(siteUrl, sitemaps.sitemap || []);

    for (const searchType of searchTypes) {
      for (const dataset of datasetsForType(searchType)) {
        stage = `search-console:${searchType}:${dataset.grain}`;
        console.info(`[gsc-sync] stage ${stage}`);

        try {
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

          stage = `database:${searchType}:${dataset.grain}`;
          await replaceGscDataset(siteUrl, searchType, dataset.grain, startDate, endDate, normalized);
          rowsWritten += normalized.length;
          datasets += 1;
        } catch (error) {
          if (!isUnsupportedDimensionError(error) || dataset.grain === "daily") throw error;
          const detail = error instanceof Error ? error.message : String(error);
          const warning = `[${searchType}:${dataset.grain}] unsupported by Search Console API; skipped. ${detail}`;
          warnings.push(warning);
          console.warn(`[gsc-sync] optional dataset skipped ${warning}`);
        }
      }

      // Search appearance must be queried separately from other dimensions.
      // Query one day at a time so the stored rows retain their actual date.
      stage = `search-console:${searchType}:search_appearance`;
      console.info(`[gsc-sync] stage ${stage}`);
      try {
        const appearanceRows = await collectSearchAppearanceDaily(
          request,
          siteUrl,
          searchType,
          startDate,
          endDate,
        );
        stage = `database:${searchType}:search_appearance`;
        await replaceGscDataset(siteUrl, searchType, "search_appearance", startDate, endDate, appearanceRows);
        rowsWritten += appearanceRows.length;
        datasets += 1;
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        const warning = `[${searchType}:search_appearance] ${detail}`;
        warnings.push(warning);
        console.warn(`[gsc-sync] optional dataset skipped ${warning}`);
      }
    }

    stage = "database:finish-run";
    await finishGscSyncRun(runId, "success", rowsWritten, datasets, warnings.join("\n"));
    return { ok: true, siteUrl, startDate, endDate, rowsWritten, datasets, searchTypes, warnings };
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : String(error);
    const message = `[${stage}] ${rawMessage}`;
    console.error(`[gsc-sync] stage failed ${message}`);
    await finishGscSyncRun(runId, "failed", rowsWritten, datasets, message);
    throw new Error(message, { cause: error });
  }
}

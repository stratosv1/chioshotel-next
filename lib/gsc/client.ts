import { getSearchConsoleAccessToken } from "@/lib/gsc/auth";

export const GSC_SEARCH_TYPES = ["web", "image", "video", "news", "discover", "googleNews"] as const;
export type GscSearchType = (typeof GSC_SEARCH_TYPES)[number];

export type GscRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

export type GscQueryResponse = {
  rows?: GscRow[];
  responseAggregationType?: string;
  metadata?: {
    first_incomplete_date?: string;
    first_incomplete_hour?: string;
  };
};

async function googleFetch<T>(request: Request, url: string, init?: RequestInit): Promise<T> {
  const accessToken = await getSearchConsoleAccessToken(request);
  const response = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Search Console API failed (${response.status}): ${body.slice(0, 1500)}`);
  }
  return (await response.json()) as T;
}

export async function listSearchConsoleSites(request: Request) {
  return googleFetch<{ siteEntry?: Array<{ siteUrl: string; permissionLevel: string }> }>(
    request,
    "https://www.googleapis.com/webmasters/v3/sites",
  );
}

export async function listSearchConsoleSitemaps(request: Request, siteUrl: string) {
  return googleFetch<{ sitemap?: Array<Record<string, unknown>> }>(
    request,
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
  );
}

export type QuerySearchAnalyticsOptions = {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions: string[];
  type?: GscSearchType;
  dataState?: "final" | "all" | "hourly_all";
};

/**
 * Paginates through every row Search Console makes available for this query.
 * Google can still omit anonymised/low-volume rows due to Search Console's
 * internal limits, so "all" here means all rows exposed by the API.
 */
export async function queryAllSearchAnalytics(
  request: Request,
  options: QuerySearchAnalyticsOptions,
): Promise<{ rows: GscRow[]; metadata?: GscQueryResponse["metadata"] }> {
  const rowLimit = 25_000;
  let startRow = 0;
  const rows: GscRow[] = [];
  let metadata: GscQueryResponse["metadata"];

  for (let page = 0; page < 100; page += 1) {
    const body = {
      startDate: options.startDate,
      endDate: options.endDate,
      dimensions: options.dimensions,
      type: options.type || "web",
      dataState: options.dataState || "all",
      aggregationType: "auto",
      rowLimit,
      startRow,
    };

    const result = await googleFetch<GscQueryResponse>(
      request,
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(options.siteUrl)}/searchAnalytics/query`,
      { method: "POST", body: JSON.stringify(body) },
    );

    const batch = result.rows || [];
    rows.push(...batch);
    metadata = result.metadata || metadata;
    if (batch.length < rowLimit) break;
    startRow += batch.length;
  }

  return { rows, metadata };
}

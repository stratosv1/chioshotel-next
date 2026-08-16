import { getAnalyticsAccessToken } from "@/lib/ga4/auth";

export const DEFAULT_GA4_PROPERTY_ID = "347655801";

export const GA4_ORGANIC_METRICS = [
  "sessions",
  "activeUsers",
  "newUsers",
  "engagedSessions",
  "engagementRate",
  "keyEvents",
  "sessionKeyEventRate",
] as const;

export type Ga4OrganicMetric = (typeof GA4_ORGANIC_METRICS)[number];

export type Ga4ReportRow = {
  dimensions: Record<string, string>;
  metrics: Record<string, number>;
};

type RunReportResponse = {
  dimensionHeaders?: Array<{ name?: string }>;
  metricHeaders?: Array<{ name?: string }>;
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
  rowCount?: number;
};

function propertyId() {
  return process.env.GA4_PROPERTY_ID?.trim() || DEFAULT_GA4_PROPERTY_ID;
}

async function readError(response: Response) {
  const text = await response.text();
  try {
    const parsed = JSON.parse(text);
    return parsed?.error?.message || text;
  } catch {
    return text;
  }
}

export async function runOrganicSearchLandingPageReport(
  request: Request,
  input: { startDate: string; endDate: string },
): Promise<{ propertyId: string; rowCount: number; rows: Ga4ReportRow[] }> {
  const id = propertyId();
  const accessToken = await getAnalyticsAccessToken(request);
  const dimensions = ["date", "landingPage", "sessionDefaultChannelGroup"];
  const metrics = [...GA4_ORGANIC_METRICS];

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(id)}:runReport`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: input.startDate, endDate: input.endDate }],
        dimensions: dimensions.map((name) => ({ name })),
        metrics: metrics.map((name) => ({ name })),
        dimensionFilter: {
          filter: {
            fieldName: "sessionDefaultChannelGroup",
            stringFilter: { matchType: "EXACT", value: "Organic Search", caseSensitive: true },
          },
        },
        orderBys: [
          { dimension: { dimensionName: "date" } },
          { metric: { metricName: "sessions" }, desc: true },
        ],
        limit: "100000",
        keepEmptyRows: false,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Google Analytics Data API failed (${response.status}): ${await readError(response)}`);
  }

  const payload = (await response.json()) as RunReportResponse;
  const dimensionHeaders = (payload.dimensionHeaders || []).map((header) => header.name || "");
  const metricHeaders = (payload.metricHeaders || []).map((header) => header.name || "");
  const rows = (payload.rows || []).map((row) => {
    const dimensionsByName: Record<string, string> = {};
    const metricsByName: Record<string, number> = {};
    dimensionHeaders.forEach((name, index) => {
      if (name) dimensionsByName[name] = row.dimensionValues?.[index]?.value || "";
    });
    metricHeaders.forEach((name, index) => {
      if (!name) return;
      const parsed = Number(row.metricValues?.[index]?.value || 0);
      metricsByName[name] = Number.isFinite(parsed) ? parsed : 0;
    });
    return { dimensions: dimensionsByName, metrics: metricsByName };
  });

  return { propertyId: id, rowCount: Number(payload.rowCount || rows.length), rows };
}

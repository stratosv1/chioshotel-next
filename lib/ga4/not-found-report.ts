import { getAnalyticsAccessToken } from "@/lib/ga4/auth";
import { DEFAULT_GA4_PROPERTY_ID } from "@/lib/ga4/client";

type RunReportResponse = {
  dimensionHeaders?: Array<{ name?: string }>;
  metricHeaders?: Array<{ name?: string }>;
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
  rowCount?: number;
};

export type Ga4404Row = {
  path: string;
  title: string;
  hostName: string;
  views: number;
  activeUsers: number;
};

async function readError(response: Response) {
  const text = await response.text();
  try {
    const parsed = JSON.parse(text);
    return parsed?.error?.message || text;
  } catch {
    return text;
  }
}

export async function runGa4404Report(
  request: Request,
  input: { startDate?: string; endDate?: string; hostName?: string } = {},
) {
  const propertyId = process.env.GA4_PROPERTY_ID?.trim() || DEFAULT_GA4_PROPERTY_ID;
  const accessToken = await getAnalyticsAccessToken(request);
  const hostName = input.hostName || "chioshotel.gr";
  const startDate = input.startDate || "28daysAgo";
  const endDate = input.endDate || "today";

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        dimensions: [
          { name: "pagePathPlusQueryString" },
          { name: "pageTitle" },
          { name: "hostName" },
        ],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        dimensionFilter: {
          andGroup: {
            expressions: [
              {
                filter: {
                  fieldName: "pageTitle",
                  stringFilter: {
                    matchType: "EXACT",
                    value: "404: This page could not be found.",
                    caseSensitive: true,
                  },
                },
              },
              {
                filter: {
                  fieldName: "hostName",
                  stringFilter: {
                    matchType: "EXACT",
                    value: hostName,
                    caseSensitive: false,
                  },
                },
              },
            ],
          },
        },
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: "100000",
        keepEmptyRows: false,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Google Analytics 404 report failed (${response.status}): ${await readError(response)}`);
  }

  const payload = (await response.json()) as RunReportResponse;
  const dimensions = (payload.dimensionHeaders || []).map((header) => header.name || "");
  const metrics = (payload.metricHeaders || []).map((header) => header.name || "");

  const rows: Ga4404Row[] = (payload.rows || []).map((row) => {
    const dimensionValues: Record<string, string> = {};
    const metricValues: Record<string, number> = {};

    dimensions.forEach((name, index) => {
      if (name) dimensionValues[name] = row.dimensionValues?.[index]?.value || "";
    });
    metrics.forEach((name, index) => {
      if (!name) return;
      const value = Number(row.metricValues?.[index]?.value || 0);
      metricValues[name] = Number.isFinite(value) ? value : 0;
    });

    return {
      path: dimensionValues.pagePathPlusQueryString || "(not set)",
      title: dimensionValues.pageTitle || "",
      hostName: dimensionValues.hostName || "",
      views: metricValues.screenPageViews || 0,
      activeUsers: metricValues.activeUsers || 0,
    };
  });

  return {
    ok: true,
    propertyId,
    startDate,
    endDate,
    hostName,
    rowCount: Number(payload.rowCount || rows.length),
    totals: {
      views: rows.reduce((sum, row) => sum + row.views, 0),
      activeUsersAcrossRows: rows.reduce((sum, row) => sum + row.activeUsers, 0),
    },
    rows,
  };
}

import { getSearchConsoleAccessToken } from "@/lib/gsc/auth";

export type GscIndexStatus = {
  verdict?: string;
  coverageState?: string;
  robotsTxtState?: string;
  indexingState?: string;
  lastCrawlTime?: string;
  pageFetchState?: string;
  googleCanonical?: string;
  userCanonical?: string;
  crawledAs?: string;
  sitemap?: string[];
  referringUrls?: string[];
};

export type GscUrlInspectionResponse = {
  inspectionResult?: {
    inspectionResultLink?: string;
    indexStatusResult?: GscIndexStatus;
    richResultsResult?: {
      verdict?: string;
      detectedItems?: Array<{
        richResultType?: string;
        items?: Array<{
          name?: string;
          issues?: Array<{ issueMessage?: string; severity?: string }>;
        }>;
      }>;
    };
  };
};

export async function inspectGoogleIndexUrl(
  request: Request,
  input: {
    siteUrl: string;
    inspectionUrl: string;
    languageCode?: string;
  },
): Promise<GscUrlInspectionResponse> {
  const accessToken = await getSearchConsoleAccessToken(request);
  const response = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      inspectionUrl: input.inspectionUrl,
      siteUrl: input.siteUrl,
      languageCode: input.languageCode || "en-US",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`URL Inspection API failed (${response.status}): ${body.slice(0, 1200)}`);
  }

  return (await response.json()) as GscUrlInspectionResponse;
}

export type LiveSeoCheck = {
  requestedUrl: string;
  status: number | null;
  finalUrl: string;
  redirectChain: Array<{ url: string; status: number; location: string }>;
  canonical: string;
  noindex: boolean;
  xRobotsTag: string;
  contentType: string;
  error: string;
};

const MAX_REDIRECTS = 8;
const TIMEOUT_MS = 10_000;

function absoluteLocation(location: string, base: string) {
  try {
    return new URL(location, base).toString();
  } catch {
    return "";
  }
}

function extractCanonical(html: string, baseUrl: string) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const rel = tag.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] || "";
    if (!rel.toLowerCase().split(/\s+/).includes("canonical")) continue;
    const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1] || "";
    if (!href) continue;
    try {
      return new URL(href, baseUrl).toString();
    } catch {
      return href;
    }
  }
  return "";
}

function extractMetaNoindex(html: string) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const name = tag.match(/\bname\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase() || "";
    if (name !== "robots" && name !== "googlebot") continue;
    const content = tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase() || "";
    if (content.split(/[\s,]+/).includes("noindex")) return true;
  }
  return false;
}

function isRedirect(status: number) {
  return status >= 300 && status < 400;
}

export async function inspectLiveSeoUrl(requestedUrl: string): Promise<LiveSeoCheck> {
  const chain: LiveSeoCheck["redirectChain"] = [];
  let currentUrl = requestedUrl;

  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
      const response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        headers: {
          "user-agent": "VoulamandisSEOHealth/1.0 (+https://chioshotel.gr)",
          accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      const location = response.headers.get("location") || "";
      if (isRedirect(response.status) && location) {
        const nextUrl = absoluteLocation(location, currentUrl);
        chain.push({ url: currentUrl, status: response.status, location: nextUrl || location });
        if (!nextUrl) {
          return {
            requestedUrl,
            status: response.status,
            finalUrl: currentUrl,
            redirectChain: chain,
            canonical: "",
            noindex: false,
            xRobotsTag: response.headers.get("x-robots-tag") || "",
            contentType: response.headers.get("content-type") || "",
            error: "Invalid redirect Location header",
          };
        }
        if (chain.some((item) => item.url === nextUrl)) {
          return {
            requestedUrl,
            status: response.status,
            finalUrl: nextUrl,
            redirectChain: chain,
            canonical: "",
            noindex: false,
            xRobotsTag: response.headers.get("x-robots-tag") || "",
            contentType: response.headers.get("content-type") || "",
            error: "Redirect loop detected",
          };
        }
        currentUrl = nextUrl;
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      const xRobotsTag = response.headers.get("x-robots-tag") || "";
      let html = "";
      if (contentType.toLowerCase().includes("text/html")) {
        html = await response.text();
      }
      const canonical = html ? extractCanonical(html.slice(0, 600_000), currentUrl) : "";
      const noindex = /(^|[\s,])noindex([\s,]|$)/i.test(xRobotsTag) || (html ? extractMetaNoindex(html.slice(0, 600_000)) : false);

      return {
        requestedUrl,
        status: response.status,
        finalUrl: currentUrl,
        redirectChain: chain,
        canonical,
        noindex,
        xRobotsTag,
        contentType,
        error: "",
      };
    }

    return {
      requestedUrl,
      status: null,
      finalUrl: currentUrl,
      redirectChain: chain,
      canonical: "",
      noindex: false,
      xRobotsTag: "",
      contentType: "",
      error: `More than ${MAX_REDIRECTS} redirects`,
    };
  } catch (error) {
    return {
      requestedUrl,
      status: null,
      finalUrl: currentUrl,
      redirectChain: chain,
      canonical: "",
      noindex: false,
      xRobotsTag: "",
      contentType: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

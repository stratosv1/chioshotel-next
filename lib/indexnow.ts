// IndexNow (https://www.indexnow.org) lets the site tell Bing, Yandex, Seznam,
// Naver and other participating search engines that URLs have changed, so
// they recrawl them quickly. Bing's index also feeds ChatGPT search and
// Copilot, which makes this the cheapest way to keep AI answers current.
//
// The key is public by design: search engines verify ownership by fetching
// https://chioshotel.gr/<key>.txt (served from /public).

export const INDEXNOW_KEY = "6b7c3d61ade59d1e9570c5a76510c7c5";
export const INDEXNOW_HOST = "chioshotel.gr";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// IndexNow accepts at most 10,000 URLs per request.
const MAX_URLS_PER_REQUEST = 10_000;

export type IndexNowBatchResult = {
  urls: number;
  httpStatus: number;
  ok: boolean;
  meaning: string;
};

function describeStatus(status: number) {
  switch (status) {
    case 200:
      return "URLs submitted";
    case 202:
      return "URLs received; key validation pending";
    case 400:
      return "Bad request";
    case 403:
      return "Key not valid (key file missing or does not match)";
    case 422:
      return "URLs do not belong to the host or key mismatch";
    case 429:
      return "Too many requests";
    default:
      return "Unexpected response";
  }
}

export function filterIndexNowUrls(urls: string[]) {
  const unique = new Set<string>();
  for (const raw of urls) {
    try {
      const url = new URL(raw);
      if (url.protocol !== "https:" || url.hostname !== INDEXNOW_HOST) continue;
      unique.add(url.toString());
    } catch {
      // Ignore malformed entries.
    }
  }
  return [...unique];
}

export async function submitToIndexNow(urls: string[]): Promise<IndexNowBatchResult[]> {
  const results: IndexNowBatchResult[] = [];

  for (let start = 0; start < urls.length; start += MAX_URLS_PER_REQUEST) {
    const batch = urls.slice(start, start + MAX_URLS_PER_REQUEST);
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: batch,
      }),
      cache: "no-store",
    });

    results.push({
      urls: batch.length,
      httpStatus: response.status,
      ok: response.status === 200 || response.status === 202,
      meaning: describeStatus(response.status),
    });
  }

  return results;
}

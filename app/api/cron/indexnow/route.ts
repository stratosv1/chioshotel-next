import { NextRequest, NextResponse } from "next/server";
import sitemap from "@/app/sitemap";
import { filterIndexNowUrls, submitToIndexNow } from "@/lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

// Submits every public sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver…).
// Runs weekly from vercel.json; can also be run on demand from the Vercel
// dashboard (Settings → Cron Jobs → Run). Add ?dry=1 to list the URLs without
// submitting them.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) {
    console.error("[indexnow] CRON_SECRET is not configured.");
    return json({ ok: false, error: "Cron security is not configured." }, 503);
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return json({ ok: false, error: "Unauthorized." }, 401);
  }

  const urls = filterIndexNowUrls(sitemap().map((entry) => entry.url));
  const dryRun = request.nextUrl.searchParams.get("dry") === "1";

  if (dryRun) {
    return json({ ok: true, dryRun: true, urls: urls.length, sample: urls.slice(0, 20) });
  }

  // Only production may announce URLs; previews would point engines at the
  // live domain for code that is not live yet.
  if (process.env.VERCEL_ENV !== "production") {
    return json({ ok: false, skipped: true, reason: "Not a production deployment.", urls: urls.length });
  }

  try {
    const batches = await submitToIndexNow(urls);
    const ok = batches.every((batch) => batch.ok);
    if (!ok) console.error("[indexnow] Submission rejected.", batches);
    return json({ ok, urls: urls.length, batches }, ok ? 200 : 502);
  } catch (error) {
    console.error("[indexnow] Submission failed.", error);
    return json({ ok: false, error: "IndexNow request failed." }, 502);
  }
}

import { NextRequest } from "next/server";
import {
  cancelWatchByToken,
  describeStay,
  getWatchByToken,
  watchCopy,
} from "@/lib/ai-assistant/availability-watch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The email link opens a confirmation page and only the button cancels:
// mail scanners that pre-open links must not cancel guests' alerts.

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function page(language: string, title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="${escapeHtml(language)}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>${escapeHtml(title)} · Voulamandis House</title>
<style>
  body { margin: 0; background: #f6f2eb; color: #29251f; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  main { max-width: 480px; margin: 12vh auto 0; padding: 0 16px; }
  .card { background: #fff; border: 1px solid #e1d8cc; border-radius: 22px; padding: 24px; box-shadow: 0 8px 24px rgba(70,55,35,.08); }
  h1 { font-size: 20px; margin: 0 0 10px; }
  p { line-height: 1.55; margin: 0 0 14px; }
  button { min-height: 48px; width: 100%; border: 0; border-radius: 999px; background: #c66a34; color: #fff; font-weight: 700; font-size: 15px; cursor: pointer; }
  a { color: #8a6a4e; }
</style>
</head>
<body><main><div class="card"><h1>${escapeHtml(title)}</h1>${body}</div><p style="margin-top:16px;text-align:center"><a href="/">Voulamandis House</a></p></main></body>
</html>`;
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  const watch = await getWatchByToken(token).catch(() => null);
  const copy = watchCopy(watch?.language || "en");
  if (!watch) return page("en", copy.cancelPageTitle, `<p>${escapeHtml(copy.inactivePageText)}</p>`, 404);
  if (!["active", "notifying"].includes(watch.status)) {
    return page(watch.language, copy.cancelPageTitle, `<p>${escapeHtml(copy.inactivePageText)}</p>`);
  }
  const stay = describeStay({ checkin: watch.checkin, checkout: watch.checkout, groups: watch.groups, language: watch.language });
  return page(
    watch.language,
    copy.cancelPageTitle,
    `<p>${escapeHtml(copy.cancelPageText)}</p><p><strong>${escapeHtml(stay)}</strong></p>
     <form method="post" action="/api/ai-room-finder/availability-watch/cancel/">
       <input type="hidden" name="token" value="${escapeHtml(token)}" />
       <button type="submit">${escapeHtml(copy.cancelButton)}</button>
     </form>`,
  );
}

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const token = String(form?.get("token") || "");
  const watch = await getWatchByToken(token).catch(() => null);
  const language = watch?.language || "en";
  const copy = watchCopy(language);
  const cancelled = watch ? await cancelWatchByToken(token).catch(() => false) : false;
  return page(language, copy.cancelPageTitle, `<p>${escapeHtml(cancelled ? copy.cancelledPageText : copy.inactivePageText)}</p>`);
}

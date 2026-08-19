const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const proxyPath = path.join(root, "proxy.ts");

function replaceRequired(source, before, after, label) {
  if (source.includes(after)) return { source, changed: false };
  if (!source.includes(before)) throw new Error(`SEO redirect-chain patch anchor not found: ${label}`);
  return { source: source.replace(before, after), changed: true };
}

function patchProxy() {
  let source = fs.readFileSync(proxyPath, "utf8");

  const before = `export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const host = request.headers.get("host");

  if (host === "www.chioshotel.gr") {
    const url = request.nextUrl.clone();
    url.hostname = "chioshotel.gr";
    return NextResponse.redirect(url, 308);
  }
  const { pathname } = request.nextUrl;

  const legacyRedirectTarget = getLegacyRedirectTarget(pathname);

  if (legacyRedirectTarget) {
    const url = request.nextUrl.clone();
    url.pathname = legacyRedirectTarget;
    url.search = "";
    return NextResponse.redirect(url, 301);
  }
`;

  const after = `export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const host = request.headers.get("host");
  const { pathname } = request.nextUrl;
  const normalizedPathname = normalizeLegacyPathname(pathname);

  // These historical URLs have exact, verified final destinations. Resolve them
  // before route handlers so Google never has to traverse an intermediate alias.
  const directLegacyTarget: Record<string, string> = {
    "/gr": "/el/",
    "/tr/chios-odalari/armolia-koyu-chios":
      "/tr/sakiz-adasi-koyleri/armolia-koyu/",
    "/tr/chios-odalari/kambos-sakiz-adasi": "/tr/sakiz-adasi/",
    "/tr/chios-odalari/lagada-koyu-chios":
      "/tr/sakiz-adasi-koyleri/lagada-koyu/",
    "/tr/chios-odalari/mesta-koyu-chios":
      "/tr/sakiz-adasi-koyleri/mesta-koyu/",
    "/tr/chios-odalari/olympoi-koyu-chios":
      "/tr/sakiz-adasi-koyleri/olympoi-koyu/",
    "/tr/chios-odalari/pyrgi-sakiz-adasi-koyu":
      "/tr/sakiz-adasi-koyleri/pyrgi-koyu/",
    "/tr/chios-odalari/vessa-koyu-chios":
      "/tr/sakiz-adasi-koyleri/vessa-koyu/",
  };

  const directTarget = directLegacyTarget[normalizedPathname];
  if (directTarget) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "chioshotel.gr";
    url.pathname = directTarget;
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  if (
    normalizedPathname === "/best-room-selection-wizard" ||
    normalizedPathname === "/reservations"
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "chioshotel.gr";
    url.pathname = "/ai-assistant/";
    url.search = "?lang=en";
    return NextResponse.redirect(url, 301);
  }

  // This encoded historical GSC URL used to traverse /find-your-room/ first.
  // Keep the downstream patch anchor above stable, but flatten this source
  // directly to the final AI Room Finder destination.
  if (normalizedPathname === "/book the room you like") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "chioshotel.gr";
    url.pathname = "/ai-assistant/";
    url.search = "?lang=en";
    return NextResponse.redirect(url, 301);
  }

  const legacyRedirectTarget = getLegacyRedirectTarget(pathname);

  if (legacyRedirectTarget) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    if (host === "www.chioshotel.gr") url.hostname = "chioshotel.gr";
    url.pathname = legacyRedirectTarget;
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  if (host === "www.chioshotel.gr") {
    const url = request.nextUrl.clone();
    url.hostname = "chioshotel.gr";
    return NextResponse.redirect(url, 308);
  }
`;

  const result = replaceRequired(source, before, after, "proxy redirect ordering");
  source = result.source;
  if (result.changed) fs.writeFileSync(proxyPath, source, "utf8");
  return result.changed;
}

const proxyChanged = patchProxy();
console.log(`SEO redirect-chain hardening: proxy=${proxyChanged ? "patched" : "already"}`);

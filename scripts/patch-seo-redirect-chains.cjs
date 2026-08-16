const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const proxyPath = path.join(root, "proxy.ts");
const enginePath = path.join(root, "lib", "seo-health", "engine.ts");

function replaceRequired(source, before, after, label) {
  if (source.includes(after)) return { source, changed: false };
  if (!source.includes(before)) {
    throw new Error(`SEO redirect-chain patch anchor not found: ${label}`);
  }
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
    normalizedPathname === "/book the room you like" ||
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

function patchEngine() {
  let source = fs.readFileSync(enginePath, "utf8");
  let changed = false;

  const helperBefore = `function isGscQuotaError(message: string) {
  return /\\b429\\b|quota exceeded|RESOURCE_EXHAUSTED/i.test(message);
}
`;

  const helperAfter = `function isGscQuotaError(message: string) {
  return /\\b429\\b|quota exceeded|RESOURCE_EXHAUSTED/i.test(message);
}

function sameRequestExceptHttps(sourceUrl: string, destinationUrl: string) {
  try {
    const source = new URL(sourceUrl);
    const destination = new URL(destinationUrl);
    return (
      source.protocol === "http:" &&
      destination.protocol === "https:" &&
      source.hostname.toLowerCase() === destination.hostname.toLowerCase() &&
      source.port === destination.port &&
      source.pathname === destination.pathname &&
      source.search === destination.search
    );
  } catch {
    return false;
  }
}

function sameRequestExceptTrailingSlash(sourceUrl: string, destinationUrl: string) {
  try {
    const source = new URL(sourceUrl);
    const destination = new URL(destinationUrl);
    const trim = (value: string) => value.replace(/\\/+$/, "") || "/";
    return (
      source.protocol === destination.protocol &&
      source.hostname.toLowerCase() === destination.hostname.toLowerCase() &&
      source.port === destination.port &&
      trim(source.pathname) === trim(destination.pathname) &&
      source.pathname !== destination.pathname &&
      source.search === destination.search
    );
  } catch {
    return false;
  }
}

function getNonActionableRedirectNormalization(candidateUrl: string, live: LiveSeoCheck) {
  // Vercel's CDN always performs HTTP -> HTTPS before the Next.js application.
  // A two-hop chain made of that mandatory 308 plus one application redirect
  // cannot be flattened by Next.js itself and should not be raised as a warning.
  if (live.redirectChain.length !== 2) return null;
  const firstHop = live.redirectChain[0];
  if (!firstHop?.location) return null;

  if (
    firstHop.status === 308 &&
    sameRequestExceptHttps(candidateUrl, firstHop.location)
  ) {
    return {
      category: "platform_https_normalization",
      decision: "Vercel performed its mandatory HTTP-to-HTTPS 308 before one final application redirect.",
      action: "No Next.js change. Keep all canonical and internal links on the final HTTPS URL.",
    };
  }

  if (
    firstHop.status === 308 &&
    sameRequestExceptTrailingSlash(candidateUrl, firstHop.location)
  ) {
    return {
      category: "trailing_slash_normalization",
      decision: "Next.js normalized the historical URL to the configured trailing-slash form before its final legacy redirect.",
      action: "No routing change required. Keep current internal links and sitemap URLs canonical.",
    };
  }

  return null;
}
`;

  let result = replaceRequired(source, helperBefore, helperAfter, "engine normalization helpers");
  source = result.source;
  changed ||= result.changed;

  const canonicalBefore = `    if (live.redirectChain.length > 1) {
      return {
        category: "redirect_chain",
        severity: "warning",
        decision: "A current route passes through multiple redirects.",
        action: \`Flatten to one hop ending at \${live.finalUrl}.\`,
        autoExecuted: false,
      };
    }
`;

  const canonicalAfter = `    if (live.redirectChain.length > 1) {
      const normalization = getNonActionableRedirectNormalization(candidate.url, live);
      if (normalization) {
        return {
          category: normalization.category,
          severity: "info",
          decision: normalization.decision,
          action: normalization.action,
          autoExecuted: false,
        };
      }

      return {
        category: "redirect_chain",
        severity: "warning",
        decision: "A current route passes through multiple redirects.",
        action: \`Flatten to one hop ending at \${live.finalUrl}.\`,
        autoExecuted: false,
      };
    }
`;

  result = replaceRequired(source, canonicalBefore, canonicalAfter, "canonical redirect-chain classification");
  source = result.source;
  changed ||= result.changed;

  const legacyBefore = `  if (live.redirectChain.length > 1) {
    return {
      category: "redirect_chain",
      severity: "warning",
      decision: "Legacy URL redirects through more than one hop.",
      action: \`Flatten the source directly to \${live.finalUrl}.\`,
      autoExecuted: false,
    };
  }
`;

  const legacyAfter = `  if (live.redirectChain.length > 1) {
    const normalization = getNonActionableRedirectNormalization(candidate.url, live);
    if (normalization) {
      return {
        category: normalization.category,
        severity: "info",
        decision: normalization.decision,
        action: normalization.action,
        autoExecuted: false,
      };
    }

    return {
      category: "redirect_chain",
      severity: "warning",
      decision: "Legacy URL redirects through more than one hop.",
      action: \`Flatten the source directly to \${live.finalUrl}.\`,
      autoExecuted: false,
    };
  }
`;

  result = replaceRequired(source, legacyBefore, legacyAfter, "legacy redirect-chain classification");
  source = result.source;
  changed ||= result.changed;

  if (changed) fs.writeFileSync(enginePath, source, "utf8");
  return changed;
}

const proxyChanged = patchProxy();
const engineChanged = patchEngine();
console.log(
  `SEO redirect-chain hardening: proxy=${proxyChanged ? "patched" : "already"}, engine=${engineChanged ? "patched" : "already"}`,
);

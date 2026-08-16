function n(value: unknown) {
  return new Intl.NumberFormat("el-GR").format(Number(value || 0));
}

function dateTime(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("el-GR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Athens",
  }).format(date);
}

function severityClasses(severity: string) {
  if (severity === "critical") return "bg-red-100 text-red-900";
  if (severity === "warning") return "bg-amber-100 text-amber-900";
  if (severity === "healthy") return "bg-emerald-100 text-emerald-900";
  return "bg-stone-200 text-stone-700";
}

function categoryLabel(value: string) {
  const labels: Record<string, string> = {
    healthy: "Υγιείς σελίδες",
    server_error: "Server error (5xx)",
    redirect_error: "Redirect error",
    redirect_chain: "Redirect chain",
    unexpected_redirect: "Redirect που θέλει ταξινόμηση",
    canonical_not_found: "Canonical 404/410",
    not_found: "Not found (404)",
    obsolete_technical_url: "Παλιό technical URL",
    legacy_redirect_autofix: "Auto 301",
    page_with_redirect: "Αναμενόμενο redirect",
    gone: "410 Gone",
    soft_404: "Soft 404",
    unexpected_noindex: "Unexpected noindex",
    robots_blocked: "Blocked by robots.txt",
    crawled_not_indexed: "Crawled – not indexed",
    discovered_not_indexed: "Discovered – not indexed",
    google_canonical_mismatch: "Google canonical mismatch",
    declared_canonical_mismatch: "Declared canonical mismatch",
    google_stale_404: "Google stale 404",
    unmanaged_live_url: "Unmanaged live URL",
    live_fetch_error: "Live fetch error",
    platform_https_normalization: "HTTP → HTTPS normalization",
    trailing_slash_normalization: "Trailing slash normalization",
    intentional_noindex: "Intentional noindex",
    technical_resource: "Technical resource",
  };
  return labels[value] || value;
}

function comparableUrl(value: unknown) {
  try {
    const url = new URL(String(value || ""));
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const path = url.pathname.replace(/\/+$/, "") || "/";
    return `${host}${path}${url.search}`;
  } catch {
    return String(value || "").replace(/\/+$/, "");
  }
}

function isPureNormalization(item: any) {
  if (Number(item?.redirectHops || 0) !== 1) return false;
  if (!item?.url || !item?.finalUrl) return false;
  return comparableUrl(item.url) === comparableUrl(item.finalUrl);
}

export default function SeoHealthPanel({ health }: { health: any }) {
  const run = health?.latestRun || null;
  const categories = Array.isArray(health?.categories) ? health.categories : [];
  const issues = Array.isArray(health?.issues) ? health.issues : [];
  const runtimeRules = Array.isArray(health?.runtimeRules) ? health.runtimeRules : [];

  const criticalCount = categories
    .filter((item: any) => item.severity === "critical")
    .reduce((sum: number, item: any) => sum + Number(item.count || 0), 0);
  const infoCount = categories
    .filter((item: any) => item.severity === "info")
    .reduce((sum: number, item: any) => sum + Number(item.count || 0), 0);
  const actionableIssues = issues.filter(
    (item: any) =>
      (item.severity === "critical" || item.severity === "warning") &&
      !isPureNormalization(item),
  );

  return (
    <section className="bg-[#eee9e1] text-[#3e342d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-5 border-b border-[#cfc4b6] pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a755f]">Technical SEO diagnostics</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#2f2823]">Τεχνικός έλεγχος — μόνο όταν ψάχνουμε συγκεκριμένο πρόβλημα</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6e6156]">
              Αυτό το section δεν είναι καθημερινό dashboard. Τα απλά redirects από HTTP→HTTPS ή από URL χωρίς τελικό / προς το canonical URL κρύβονται από τη λίστα review ώστε να μην εμφανίζονται ως ψεύτικα alarms.
            </p>
          </div>
          <div className="text-sm text-[#77695e] lg:text-right">
            <p><strong className="text-[#332b25]">Τελευταίο run:</strong> {dateTime(run?.completedAt || run?.startedAt)}</p>
            <p className="mt-1"><strong className="text-[#332b25]">Status:</strong> {run?.status || "Δεν έχει τρέξει ακόμη"}</p>
          </div>
        </div>

        <div className="grid border-b border-[#cfc4b6] sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-[#cfc4b6]">
          {[
            ["Ελέγχθηκαν", run?.inspectedCount],
            ["Critical", criticalCount],
            ["Review που εμφανίζεται", actionableIssues.length],
            ["Informational", infoCount],
            ["Auto-fixed", run?.autoFixedCount],
          ].map(([label, value]) => (
            <div key={String(label)} className="py-5 lg:px-5 first:pl-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#332b25]">{n(value)}</p>
            </div>
          ))}
        </div>

        <div className="py-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">Μόνο actionable technical findings</p>
              <h3 className="mt-1 text-xl font-semibold text-[#332b25]">Τι αξίζει ανθρώπινο review</h3>
            </div>
            <p className="text-xs text-[#8a755f]">{actionableIssues.length} εμφανίζονται</p>
          </div>
          <div className="mt-4 max-h-[480px] overflow-auto border-y border-[#cfc4b6]">
            {actionableIssues.length ? actionableIssues.slice(0, 40).map((item: any) => (
              <article key={`${item.url}-${item.inspectedAt}`} className="border-b border-[#d8d0c5] py-4 last:border-b-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${severityClasses(item.severity)}`}>{categoryLabel(item.category)}</span>
                  {item.autoExecuted && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-900">AUTO EXECUTED</span>}
                  {item.liveStatus != null && <span className="text-xs text-[#8a755f]">HTTP {item.liveStatus}</span>}
                </div>
                <p className="mt-2 break-all text-sm font-semibold text-[#40362f]">{item.url}</p>
                <p className="mt-2 text-sm leading-6 text-[#62574e]">{item.decision}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#40362f]">Ενέργεια: {item.action}</p>
                {item.coverageState && <p className="mt-1 text-xs text-[#8a755f]">Google: {item.coverageState}{item.pageFetchState ? ` · ${item.pageFetchState}` : ""}</p>}
              </article>
            )) : <p className="py-5 text-sm text-[#77695e]">Δεν υπάρχει technical finding που να απαιτεί ανθρώπινο review.</p>}
          </div>
        </div>

        <details className="border-t border-[#cfc4b6] py-5">
          <summary className="cursor-pointer text-sm font-semibold text-[#51463e]">Raw κατηγορίες τελευταίου run ({categories.length})</summary>
          <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
            {categories.length ? categories.map((item: any) => (
              <div key={`${item.category}-${item.severity}`} className="flex items-center justify-between gap-4 border-b border-[#d8d0c5] py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#40362f]">{categoryLabel(item.category)}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${severityClasses(item.severity)}`}>{item.severity}</span>
                </div>
                <strong className="text-lg text-[#332b25]">{n(item.count)}</strong>
              </div>
            )) : <p className="text-sm text-[#77695e]">Δεν υπάρχει ακόμη weekly inspection.</p>}
          </div>
        </details>

        <details className="border-t border-[#cfc4b6] pt-5">
          <summary className="cursor-pointer text-sm font-semibold text-[#51463e]">Auto-remediation rules ({runtimeRules.length})</summary>
          <div className="mt-4 space-y-3">
            {runtimeRules.map((rule: any) => (
              <div key={rule.path} className="grid gap-1 border-b border-[#d8d0c5] pb-3 text-xs sm:grid-cols-[220px_90px_minmax(0,1fr)] sm:gap-4">
                <code className="break-all text-[#40362f]">{rule.path}</code>
                <span className="font-semibold text-[#6f6051]">{rule.statusCode} {rule.ruleType}</span>
                <span className="break-all text-[#77695e]">{rule.destination || rule.reason}</span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}

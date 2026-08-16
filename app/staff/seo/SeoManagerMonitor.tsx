import type { SeoManagerMonitor as SeoManagerMonitorData } from "@/lib/seo-manager/monitor";

function n(value: unknown, digits = 0) {
  return new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(Number(value || 0));
}

function pct(value: unknown) {
  const number = Number(value || 0);
  return `${number > 0 ? "+" : ""}${n(number, 1)}%`;
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

function dateOnly(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("el-GR", {
    dateStyle: "medium",
    timeZone: "Europe/Athens",
  }).format(date);
}

function severityClasses(value: string) {
  if (value === "critical") return "border-red-200 bg-red-50 text-red-900";
  if (value === "warning") return "border-amber-200 bg-amber-50 text-amber-950";
  if (value === "watch") return "border-sky-200 bg-sky-50 text-sky-950";
  return "border-emerald-200 bg-emerald-50 text-emerald-950";
}

function severityLabel(value: string) {
  if (value === "critical") return "Άμεσο";
  if (value === "warning") return "Review";
  if (value === "watch") return "Παρακολούθηση";
  return "OK";
}

function deltaText(value: number | null) {
  if (value == null) return "—";
  if (value === 0) return "0";
  return `${value > 0 ? "+" : ""}${n(value)}`;
}

export default function SeoManagerMonitor({ monitor }: { monitor: SeoManagerMonitorData }) {
  const critical = monitor.watchlist.filter((item) => item.severity === "critical").length;
  const warnings = monitor.watchlist.filter((item) => item.severity === "warning").length;
  const watches = monitor.watchlist.filter((item) => item.severity === "watch").length;
  const technical = monitor.freshness.technical;
  const advisor = monitor.freshness.advisor;
  const sync = monitor.freshness.sync;
  const pageIndexing = monitor.freshness.pageIndexing;
  const primarySitemap = monitor.sitemap.primary;

  return (
    <section className="bg-[#f7f5f0] text-[#3e342d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="grid gap-6 border-b border-[#d8d0c5] pb-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a755f]">Senior SEO Manager Control Room</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#2f2823] sm:text-4xl">Τι παρακολουθούμε πραγματικά</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6e6156] sm:text-base">
              Performance, Google indexing evidence, live technical health, sitemap hygiene, redirect safety και data freshness σε μία εικόνα. Τα historical GSC exports εμφανίζονται ως snapshot και δεν βαφτίζονται live errors.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${critical ? "border-red-200 bg-red-50 text-red-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}>{critical} άμεσα</span>
            <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${warnings ? "border-amber-200 bg-amber-50 text-amber-900" : "border-stone-200 bg-white text-stone-600"}`}>{warnings} review</span>
            <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-900">{watches} watch</span>
          </div>
        </header>

        <div className="grid border-b border-[#d8d0c5] sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-[#d8d0c5]">
          <div className="py-5 lg:pr-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a755f]">GSC Performance data</p>
            <p className="mt-2 text-lg font-semibold text-[#332b25]">{dateOnly(monitor.freshness.latestGscDataDate)}</p>
            <p className="mt-1 text-xs leading-5 text-[#77695e]">Sync {sync?.status || "—"} · {n(sync?.rowsWritten)} rows · {n(sync?.datasets)} datasets</p>
          </div>
          <div className="py-5 lg:px-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a755f]">SEO Advisor</p>
            <p className="mt-2 text-lg font-semibold text-[#332b25]">{dateTime(advisor?.analyzedAt)}</p>
            <p className="mt-1 text-xs leading-5 text-[#77695e]">Κάθε {advisor?.cadenceDays || 3} ημέρες · επόμενο due {dateOnly(advisor?.nextDueDate)}</p>
          </div>
          <div className="py-5 lg:px-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a755f]">Live Technical audit</p>
            <p className="mt-2 text-lg font-semibold text-[#332b25]">Run #{technical?.runId || "—"}</p>
            <p className="mt-1 text-xs leading-5 text-[#77695e]">{dateTime(technical?.completedAt)} · {n(technical?.inspected)} URLs</p>
          </div>
          <div className="py-5 lg:pl-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a755f]">Google Page Indexing export</p>
            <p className="mt-2 text-lg font-semibold text-[#332b25]">{dateTime(pageIndexing?.importedAt)}</p>
            <p className="mt-1 text-xs leading-5 text-[#77695e]">{n(pageIndexing?.totalReportedPages)} reported pages · {n(pageIndexing?.issueCount)} categories</p>
          </div>
        </div>

        <section className="grid gap-8 border-b border-[#d8d0c5] py-8 xl:grid-cols-[0.9fr_1.5fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Manager watchlist</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Τι θέλει προσοχή τώρα</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#77695e]">Deterministic alerts από τα δεδομένα. Πρώτα critical/warnings, μετά Google recrawl/watch items, τέλος όσα είναι επιβεβαιωμένα ΟΚ.</p>
          </div>
          <div className="space-y-3">
            {monitor.watchlist.map((item, index) => (
              <article key={`${item.title}-${index}`} className={`rounded-2xl border p-4 ${severityClasses(item.severity)}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold">{item.title}</h4>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]">{severityLabel(item.severity)}</span>
                </div>
                <p className="mt-2 text-sm leading-6 opacity-85">{item.detail}</p>
                <p className="mt-1 text-sm font-semibold leading-6">Ενέργεια: {item.action}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-b border-[#d8d0c5] py-8 xl:grid-cols-[1.45fr_0.8fr]">
          <div className="min-w-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Google indexing watch</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Τελευταίο GSC Pages snapshot</h3>
              </div>
              <p className="text-xs text-[#8a755f]">Snapshot: {dateTime(pageIndexing?.importedAt)}</p>
            </div>
            <div className="mt-5 overflow-x-auto border-y border-[#d8d0c5]">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-[10px] uppercase tracking-[0.12em] text-[#8a755f]">
                  <tr>
                    <th className="py-3 pr-4 font-semibold">Κατηγορία</th>
                    <th className="px-3 py-3 text-right font-semibold">Pages</th>
                    <th className="px-3 py-3 text-right font-semibold">Δ</th>
                    <th className="px-3 py-3 font-semibold">Validation</th>
                    <th className="py-3 pl-3 font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {monitor.pageIndexingIssues.map((item) => (
                    <tr key={item.reason} className="border-t border-[#e2dbd1]">
                      <td className="py-3 pr-4 font-semibold text-[#40362f]">{item.reason}</td>
                      <td className="px-3 py-3 text-right font-semibold text-[#332b25]">{n(item.pages)}</td>
                      <td className={`px-3 py-3 text-right font-semibold ${item.delta != null && item.delta > 0 ? "text-red-700" : item.delta != null && item.delta < 0 ? "text-emerald-700" : "text-[#8a755f]"}`}>{deltaText(item.delta)}</td>
                      <td className="px-3 py-3 text-[#6e6156]">{item.validation}</td>
                      <td className="py-3 pl-3 text-[#6e6156]">{item.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#8a755f]">Οι αριθμοί εδώ είναι ό,τι ανέφερε το Google Search Console όταν έγινε το export. Για πραγματική σημερινή κατάσταση χρησιμοποιούμε το live technical audit από κάτω.</p>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-[#d8d0c5] bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">Live technical</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div><p className="text-2xl font-semibold text-[#332b25]">{n(technical?.healthy)}</p><p className="text-xs text-[#77695e]">healthy</p></div>
                <div><p className="text-2xl font-semibold text-amber-800">{n(technical?.warning)}</p><p className="text-xs text-[#77695e]">warnings</p></div>
                <div><p className="text-2xl font-semibold text-red-800">{n(technical?.critical)}</p><p className="text-xs text-[#77695e]">critical</p></div>
                <div><p className="text-2xl font-semibold text-sky-800">{n(technical?.info)}</p><p className="text-xs text-[#77695e]">info</p></div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#d8d0c5] bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">Google verification</p>
              <p className="mt-3 text-2xl font-semibold text-[#332b25]">{n(technical?.googleInspectionRows)} fresh rows</p>
              <p className="mt-2 text-sm leading-6 text-[#77695e]">Quota-limited: {n(technical?.googleQuotaRows)}. Αυτό δεν ακυρώνει το live HTTP/canonical check· σημαίνει ότι δεν ισχυριζόμαστε fresh Google reprocessing.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 border-b border-[#d8d0c5] py-8 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Sitemap hygiene</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Current sitemap vs legacy submissions</h3>
            <div className="mt-5 rounded-2xl border border-[#d8d0c5] bg-white p-5">
              <p className="break-all text-sm font-semibold text-[#40362f]">{primarySitemap?.path || "Primary sitemap unavailable"}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div><p className="text-2xl font-semibold">{n(primarySitemap?.submitted)}</p><p className="text-xs text-[#77695e]">submitted</p></div>
                <div><p className="text-2xl font-semibold">{n(primarySitemap?.errors)}</p><p className="text-xs text-[#77695e]">errors</p></div>
                <div><p className="text-2xl font-semibold">{n(primarySitemap?.warnings)}</p><p className="text-xs text-[#77695e]">warnings</p></div>
                <div><p className="text-sm font-semibold">{dateTime(primarySitemap?.lastDownloaded)}</p><p className="text-xs text-[#77695e]">last downloaded</p></div>
              </div>
            </div>
            {monitor.sitemap.legacyProblemCount > 0 && (
              <details className="mt-4 border-t border-[#d8d0c5] pt-4">
                <summary className="cursor-pointer text-sm font-semibold text-[#51463e]">Legacy GSC sitemap submissions με issues ({n(monitor.sitemap.legacyProblemCount)})</summary>
                <div className="mt-3 space-y-2">
                  {monitor.sitemap.legacyProblemSamples.map((item) => (
                    <div key={item.path} className="rounded-xl bg-[#eee9e1] p-3 text-xs">
                      <p className="break-all font-semibold text-[#40362f]">{item.path}</p>
                      <p className="mt-1 text-[#77695e]">{item.errors} errors · {item.warnings} warnings{item.isPending ? " · pending" : ""}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Redirect safety</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Runtime SEO rules</h3>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Enabled", monitor.runtimeRules.enabled],
                ["Verified", monitor.runtimeRules.verified],
                ["Unverified", monitor.runtimeRules.unverified],
                ["Stale >14d", monitor.runtimeRules.stale],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-[#d8d0c5] bg-white p-4">
                  <p className="text-2xl font-semibold text-[#332b25]">{n(value)}</p>
                  <p className="mt-1 text-xs text-[#77695e]">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-[#77695e]">Στόχος: κάθε enabled dynamic 301/410 rule να έχει πρόσφατο verification και να απενεργοποιείται αν ο destination πάψει να είναι ασφαλής.</p>
          </div>
        </section>

        <section className="py-8">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Search demand quality</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Brand vs non-brand</h3>
              <p className="mt-3 text-sm leading-6 text-[#77695e]">Query-visible GSC data, τελευταίες 28 ημέρες vs προηγούμενες 28. Το non-brand είναι το βασικό growth signal για generic SEO visibility.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {monitor.queryDemand.map((item) => (
                <article key={item.segment} className="rounded-2xl border border-[#d8d0c5] bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">{item.segment === "brand" ? "Brand queries" : "Non-brand queries"}</p>
                  <div className="mt-4 flex items-baseline gap-3">
                    <p className="text-3xl font-semibold text-[#332b25]">{n(item.currentClicks)}</p>
                    <span className={`text-sm font-semibold ${item.clicksChangePct >= 0 ? "text-emerald-700" : "text-red-700"}`}>{pct(item.clicksChangePct)}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#77695e]">clicks · προηγούμενα {n(item.previousClicks)}</p>
                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#e2dbd1] pt-4 text-xs">
                    <div><p className="font-semibold text-[#40362f]">{n(item.currentImpressions)}</p><p className="text-[#8a755f]">impressions</p></div>
                    <div><p className="font-semibold text-[#40362f]">{n(item.currentCtr * 100, 2)}%</p><p className="text-[#8a755f]">CTR</p></div>
                    <div><p className="font-semibold text-[#40362f]">{n(item.currentPosition, 1)}</p><p className="text-[#8a755f]">avg position</p></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

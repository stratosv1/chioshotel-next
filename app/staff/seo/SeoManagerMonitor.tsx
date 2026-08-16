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
  return "border-sky-200 bg-sky-50 text-sky-950";
}

function severityLabel(value: string) {
  if (value === "critical") return "Άμεσο";
  if (value === "warning") return "Review";
  return "Παρακολούθηση";
}

function deltaText(value: number | null) {
  if (value == null) return "—";
  if (value === 0) return "0";
  return `${value > 0 ? "+" : ""}${n(value)}`;
}

export default function SeoManagerMonitor({ monitor }: { monitor: SeoManagerMonitorData }) {
  const actionable = monitor.watchlist.filter((item) => item.severity !== "healthy");
  const critical = actionable.filter((item) => item.severity === "critical").length;
  const warnings = actionable.filter((item) => item.severity === "warning").length;
  const watches = actionable.filter((item) => item.severity === "watch").length;
  const pageIndexing = monitor.freshness.pageIndexing;
  const nonBrand = monitor.queryDemand.find((item) => item.segment === "non_brand");

  return (
    <section className="bg-[#f7f5f0] text-[#3e342d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="grid gap-5 border-b border-[#d8d0c5] pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a755f]">SEO Manager Overview</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#2f2823]">Τι χρειάζεται την προσοχή σου</h2>
            <p className="mt-3 text-sm leading-7 text-[#6e6156]">
              Μόνο τα signals που αλλάζουν απόφαση. Οι τεχνικές λεπτομέρειες, τα redirect rules και το πλήρες performance analysis παραμένουν στα εξειδικευμένα sections πιο κάτω.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {actionable.length === 0 ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900">0 ενεργά θέματα</span>
            ) : (
              <>
                {critical > 0 && <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-900">{critical} άμεσα</span>}
                {warnings > 0 && <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">{warnings} review</span>}
                {watches > 0 && <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-900">{watches} watch</span>}
              </>
            )}
          </div>
        </header>

        <div className="grid border-b border-[#d8d0c5] sm:grid-cols-2 sm:divide-x sm:divide-[#d8d0c5]">
          <div className="py-5 sm:pr-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a755f]">GSC performance data έως</p>
            <p className="mt-2 text-xl font-semibold text-[#332b25]">{dateOnly(monitor.freshness.latestGscDataDate)}</p>
          </div>
          <div className="py-5 sm:pl-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a755f]">Τελευταίο Page Indexing export</p>
            <p className="mt-2 text-xl font-semibold text-[#332b25]">{dateTime(pageIndexing?.importedAt)}</p>
          </div>
        </div>

        <section className="grid gap-7 border-b border-[#d8d0c5] py-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Action watchlist</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Τι κάνουμε τώρα</h3>
            <p className="mt-3 text-sm leading-6 text-[#77695e]">Δεν εμφανίζονται πλέον πράσινα “OK” cards. Αν κάτι είναι σωστό, δεν καταλαμβάνει χώρο.</p>
          </div>
          <div className="space-y-3">
            {actionable.length ? actionable.map((item, index) => (
              <article key={`${item.title}-${index}`} className={`rounded-2xl border p-4 ${severityClasses(item.severity)}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold">{item.title}</h4>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]">{severityLabel(item.severity)}</span>
                </div>
                <p className="mt-2 text-sm leading-6 opacity-85">{item.detail}</p>
                <p className="mt-1 text-sm font-semibold leading-6">Ενέργεια: {item.action}</p>
              </article>
            )) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
                Δεν υπάρχει ενεργό SEO θέμα που να απαιτεί ενέργεια αυτή τη στιγμή.
              </div>
            )}
          </div>
        </section>

        <section className="border-b border-[#d8d0c5] py-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Google indexing</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Τελευταίο GSC Pages snapshot</h3>
            </div>
            <p className="text-xs text-[#8a755f]">{dateTime(pageIndexing?.importedAt)}</p>
          </div>
          <div className="mt-5 overflow-x-auto border-y border-[#d8d0c5]">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.12em] text-[#8a755f]">
                <tr>
                  <th className="py-3 pr-4 font-semibold">Κατηγορία</th>
                  <th className="px-3 py-3 text-right font-semibold">Pages</th>
                  <th className="px-3 py-3 text-right font-semibold">Μεταβολή</th>
                  <th className="py-3 pl-3 font-semibold">Validation</th>
                </tr>
              </thead>
              <tbody>
                {monitor.pageIndexingIssues.map((item) => (
                  <tr key={item.reason} className="border-t border-[#e2dbd1]">
                    <td className="py-3 pr-4 font-semibold text-[#40362f]">{item.reason}</td>
                    <td className="px-3 py-3 text-right font-semibold text-[#332b25]">{n(item.pages)}</td>
                    <td className={`px-3 py-3 text-right font-semibold ${item.delta != null && item.delta > 0 ? "text-red-700" : item.delta != null && item.delta < 0 ? "text-emerald-700" : "text-[#8a755f]"}`}>{deltaText(item.delta)}</td>
                    <td className="py-3 pl-3 text-[#6e6156]">{item.validation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#8a755f]">Snapshot της Google από την ημερομηνία export — όχι live production verdict.</p>
        </section>

        <section className="py-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Organic growth signal</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Non-brand visibility</h3>
              <p className="mt-3 text-sm leading-6 text-[#77695e]">Το πιο χρήσιμο growth signal: αν βρίσκουν το site από generic αναζητήσεις και όχι μόνο από το όνομα Voulamandis.</p>
            </div>
            {nonBrand ? (
              <div className="rounded-2xl border border-[#d8d0c5] bg-white p-5">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <p className="text-3xl font-semibold text-[#332b25]">{n(nonBrand.currentClicks)} clicks</p>
                  <span className={`text-sm font-semibold ${nonBrand.clicksChangePct >= 0 ? "text-emerald-700" : "text-red-700"}`}>{pct(nonBrand.clicksChangePct)}</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 border-t border-[#e2dbd1] pt-4 text-xs">
                  <div><p className="font-semibold text-[#40362f]">{pct(nonBrand.impressionsChangePct)}</p><p className="text-[#8a755f]">impressions</p></div>
                  <div><p className="font-semibold text-[#40362f]">{n(nonBrand.currentCtr * 100, 2)}%</p><p className="text-[#8a755f]">CTR</p></div>
                  <div><p className="font-semibold text-[#40362f]">{n(nonBrand.currentPosition, 1)}</p><p className="text-[#8a755f]">avg position</p></div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#8a755f]">Δεν υπάρχει αρκετό query-level GSC data.</p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

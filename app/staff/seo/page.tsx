import type { Metadata } from "next";
import { getGscDashboardData } from "@/lib/gsc/dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SEO Dashboard | Voulamandis House",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

function n(value: unknown, digits = 0) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(number);
}

function pct(value: unknown) {
  return `${n(Number(value || 0) * 100, 2)}%`;
}

function dateTime(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat("el-GR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Athens" }).format(date);
}

function compactUrl(value: unknown) {
  const text = String(value || "");
  return text.replace(/^https?:\/\/[^/]+/, "") || "/";
}

export default async function SeoDashboardPage() {
  const data = await getGscDashboardData();
  const coverage = data.coverage || {};
  const run = data.latestRun || {};
  const report = data.report || {};
  const totals = report.totals || {};
  const warnings = String(run.error_message || "").split("\n").filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#44372d]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-3xl border border-[#ddcfba] bg-white/90 p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a755f]">Voulamandis House · Staff</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">SEO Control Center</h1>
              <p className="mt-2 max-w-3xl text-sm text-[#746454]">
                Πραγματικά δεδομένα Google Search Console από Neon. Τελευταία ανανέωση dashboard: {dateTime(data.generatedAt)}.
              </p>
            </div>
            <a href="/staff" className="inline-flex w-fit items-center rounded-full border border-[#cdbda7] px-4 py-2 text-sm font-medium hover:bg-[#f4ede3]">← Staff Area</a>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Αποθηκευμένες γραμμές" value={n(coverage.row_count)} sub={`${coverage.earliest_date || "—"} → ${coverage.latest_date || "—"}`} />
          <Stat label="Search types" value={n(coverage.search_types)} sub={`${n(coverage.grains)} διαφορετικά datasets`} />
          <Stat label="Web clicks · 28 ημέρες" value={n(totals.clicks)} sub={`${n(totals.impressions)} impressions`} />
          <Stat label="Web CTR / θέση" value={`${pct(totals.ctr)} · ${n(totals.position, 1)}`} sub="Σταθμισμένος μέσος όρος" />
        </section>

        <section className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Τελευταίο sync</h2>
              <p className="text-sm text-[#746454]">{dateTime(run.started_at)} · {run.start_date || "—"} → {run.end_date || "—"}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${run.status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
              {run.status || "unknown"}
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Mini label="Rows written" value={n(run.rows_written)} />
            <Mini label="Datasets" value={n(run.datasets)} />
            <Mini label="Incomplete rows" value={n(coverage.incomplete_rows)} />
          </div>
          {warnings.length > 0 && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-900">Warnings ({warnings.length})</p>
              <div className="mt-2 space-y-1 text-sm text-amber-900/90">
                {warnings.map((warning, index) => <p key={`${warning}-${index}`}>{warning}</p>)}
              </div>
            </div>
          )}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <TableCard title="Search types" headers={["Type", "Ημέρες", "Clicks", "Impr.", "CTR", "Θέση"]}>
            {data.searchTypes.map((row: any) => (
              <tr key={row.search_type} className="border-t border-[#eee4d6]">
                <td className="px-3 py-2 font-medium">{row.search_type}</td><td className="px-3 py-2">{n(row.days)}</td><td className="px-3 py-2">{n(row.clicks)}</td><td className="px-3 py-2">{n(row.impressions)}</td><td className="px-3 py-2">{pct(row.ctr)}</td><td className="px-3 py-2">{n(row.position, 1)}</td>
              </tr>
            ))}
          </TableCard>

          <TableCard title="Dataset inventory" headers={["Type", "Dataset", "Rows", "Από", "Έως"]}>
            {data.datasets.map((row: any) => (
              <tr key={`${row.search_type}-${row.grain}`} className="border-t border-[#eee4d6]">
                <td className="px-3 py-2 font-medium">{row.search_type}</td><td className="px-3 py-2">{row.grain}</td><td className="px-3 py-2">{n(row.row_count)}</td><td className="px-3 py-2">{row.earliest_date}</td><td className="px-3 py-2">{row.latest_date}</td>
              </tr>
            ))}
          </TableCard>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <TableCard title="Top queries · Web · 28 ημέρες" headers={["Query", "Clicks", "Impr.", "CTR", "Θέση"]}>
            {(report.topQueries || []).slice(0, 25).map((row: any) => (
              <tr key={row.query} className="border-t border-[#eee4d6]">
                <td className="max-w-[260px] px-3 py-2 font-medium">{row.query || "(κρυφό query)"}</td><td className="px-3 py-2">{n(row.clicks)}</td><td className="px-3 py-2">{n(row.impressions)}</td><td className="px-3 py-2">{pct(row.ctr)}</td><td className="px-3 py-2">{n(row.position, 1)}</td>
              </tr>
            ))}
          </TableCard>

          <TableCard title="Top pages · Web · 28 ημέρες" headers={["Page", "Clicks", "Impr.", "CTR", "Θέση"]}>
            {(report.topPages || []).slice(0, 25).map((row: any) => (
              <tr key={row.page} className="border-t border-[#eee4d6]">
                <td className="max-w-[290px] break-all px-3 py-2 font-medium" title={row.page}>{compactUrl(row.page)}</td><td className="px-3 py-2">{n(row.clicks)}</td><td className="px-3 py-2">{n(row.impressions)}</td><td className="px-3 py-2">{pct(row.ctr)}</td><td className="px-3 py-2">{n(row.position, 1)}</td>
              </tr>
            ))}
          </TableCard>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <TableCard title="Χώρες · Web" headers={["Χώρα", "Clicks", "Impr.", "Θέση"]}>
            {data.countries.map((row: any) => <tr key={row.country} className="border-t border-[#eee4d6]"><td className="px-3 py-2 font-medium">{row.country}</td><td className="px-3 py-2">{n(row.clicks)}</td><td className="px-3 py-2">{n(row.impressions)}</td><td className="px-3 py-2">{n(row.position, 1)}</td></tr>)}
          </TableCard>
          <TableCard title="Συσκευές · Web" headers={["Device", "Clicks", "Impr.", "CTR"]}>
            {data.devices.map((row: any) => <tr key={row.device} className="border-t border-[#eee4d6]"><td className="px-3 py-2 font-medium">{row.device}</td><td className="px-3 py-2">{n(row.clicks)}</td><td className="px-3 py-2">{n(row.impressions)}</td><td className="px-3 py-2">{pct(row.ctr)}</td></tr>)}
          </TableCard>
          <TableCard title="Search appearance · Web" headers={["Appearance", "Clicks", "Impr.", "CTR"]}>
            {data.appearances.map((row: any) => <tr key={row.search_appearance} className="border-t border-[#eee4d6]"><td className="px-3 py-2 font-medium">{row.search_appearance}</td><td className="px-3 py-2">{n(row.clicks)}</td><td className="px-3 py-2">{n(row.impressions)}</td><td className="px-3 py-2">{pct(row.ctr)}</td></tr>)}
          </TableCard>
        </div>

        <section className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">SEO opportunities · 28 ημέρες</h2>
          <p className="mt-1 text-sm text-[#746454]">Queries με ≥20 impressions και μέση θέση 4–20.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-[#8a755f]"><tr><th className="px-3 py-2">Query</th><th className="px-3 py-2">Page</th><th className="px-3 py-2">Clicks</th><th className="px-3 py-2">Impr.</th><th className="px-3 py-2">CTR</th><th className="px-3 py-2">Θέση</th></tr></thead>
              <tbody>{(report.opportunities || []).slice(0, 40).map((row: any, index: number) => <tr key={`${row.query}-${row.page}-${index}`} className="border-t border-[#eee4d6]"><td className="px-3 py-2 font-medium">{row.query}</td><td className="max-w-[320px] break-all px-3 py-2">{compactUrl(row.page)}</td><td className="px-3 py-2">{n(row.clicks)}</td><td className="px-3 py-2">{n(row.impressions)}</td><td className="px-3 py-2">{pct(row.ctr)}</td><td className="px-3 py-2">{n(row.position, 1)}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Search Console properties</h2>
            <div className="mt-3 space-y-2 text-sm">{data.properties.map((row: any) => <div key={row.site_url} className="rounded-2xl bg-[#faf7f1] p-3"><div className="font-medium">{row.site_url}</div><div className="text-[#746454]">Permission: {row.permission_level || "—"} · {dateTime(row.updated_at)}</div></div>)}</div>
          </div>
          <div className="rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Sitemaps</h2>
            <div className="mt-3 space-y-2 text-sm">{data.sitemaps.map((row: any) => <div key={row.sitemap_path} className="rounded-2xl bg-[#faf7f1] p-3"><div className="break-all font-medium">{row.sitemap_path}</div><div className="text-[#746454]">Snapshot: {dateTime(row.updated_at)}</div></div>)}</div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a755f]">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p><p className="mt-1 text-sm text-[#746454]">{sub}</p></div>;
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-[#faf7f1] p-3"><p className="text-xs uppercase tracking-wide text-[#8a755f]">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p></div>;
}

function TableCard({ title, headers, children }: { title: string; headers: string[]; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">{title}</h2><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="text-xs uppercase tracking-wide text-[#8a755f]"><tr>{headers.map((header) => <th key={header} className="px-3 py-2">{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div></section>;
}

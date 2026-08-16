function n(value: unknown, digits = 0) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(number);
}

function pct(value: unknown) {
  const number = Number(value || 0);
  return `${number > 0 ? "+" : ""}${n(number, 1)}%`;
}

function dateTime(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat("el-GR", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Athens",
      }).format(date);
}

function Stat({ label, value, change }: { label: string; value: string; change?: number }) {
  return (
    <div className="min-w-0 py-4 sm:px-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">{label}</p>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        <p className="text-2xl font-semibold tracking-tight text-[#332b25]">{value}</p>
        {change != null && (
          <span className={`text-xs font-semibold ${change >= 0 ? "text-emerald-700" : "text-red-700"}`}>
            {pct(change)}
          </span>
        )}
      </div>
      {change != null && <p className="mt-1 text-xs text-[#8a755f]">28ημ. vs προηγούμενες 28</p>}
    </div>
  );
}

export default function Ga4SeoPanel({ analytics, sync }: { analytics: any; sync: any }) {
  const site = analytics?.site || null;
  const lowEngagement = Array.isArray(analytics?.lowEngagementPages)
    ? analytics.lowEngagementPages.slice(0, 4)
    : [];
  const declines = Array.isArray(analytics?.sessionDeclines)
    ? analytics.sessionDeclines.slice(0, 4)
    : [];

  return (
    <section className="bg-[#f7f5f0] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl border-b border-[#d8d0c5] py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a755f]">Google Analytics 4 · Organic Search</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#332b25]">Τι κάνουν οι επισκέπτες μετά το Google click</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#77695e]">
              Post-click signal για το SEO: sessions, engagement και key events. Τα GA4 sessions δεν συγκρίνονται 1:1 με τα GSC clicks.
            </p>
          </div>
          <div className="text-xs leading-5 text-[#8a755f] sm:text-right">
            <p>Property {analytics?.propertyId || "347655801"}</p>
            <p>Δεδομένα έως {analytics?.latestDate || "—"}</p>
            <p>Sync: {sync?.status || "αναμονή"} · {dateTime(sync?.completedAt)}</p>
          </div>
        </div>

        {site ? (
          <>
            <div className="mt-6 grid border-y border-[#d8d0c5] sm:grid-cols-2 sm:divide-x sm:divide-[#d8d0c5] lg:grid-cols-4">
              <Stat label="Organic sessions" value={n(site.current.sessions)} change={site.changes.sessions} />
              <Stat label="Engaged sessions" value={n(site.current.engagedSessions)} change={site.changes.engagedSessions} />
              <Stat label="Engagement rate" value={`${n(site.current.engagementRate * 100, 1)}%`} change={site.changes.engagementRate} />
              <Stat label="Key events" value={n(site.current.keyEvents, 1)} change={site.changes.keyEvents} />
            </div>

            <div className="mt-7 grid gap-7 lg:grid-cols-2 lg:divide-x lg:divide-[#d8d0c5]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">Landing pages με πτώση sessions</p>
                <div className="mt-3 space-y-3">
                  {declines.length ? declines.map((item: any) => (
                    <div key={item.page}>
                      <p className="break-all text-sm font-semibold text-[#332b25]">{item.page}</p>
                      <p className="text-xs text-[#77695e]">{n(item.current.sessions)} sessions · {pct(item.changes.sessions)}</p>
                    </div>
                  )) : <p className="text-sm text-[#8a755f]">Δεν υπάρχει ισχυρή πτώση στο διαθέσιμο GA4 window.</p>}
                </div>
              </div>
              <div className="lg:pl-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">Landing pages με χαμηλό engagement</p>
                <div className="mt-3 space-y-3">
                  {lowEngagement.length ? lowEngagement.map((item: any) => (
                    <div key={item.page}>
                      <p className="break-all text-sm font-semibold text-[#332b25]">{item.page}</p>
                      <p className="text-xs text-[#77695e]">{n(item.current.sessions)} sessions · engagement {n(item.current.engagementRate * 100, 1)}%</p>
                    </div>
                  )) : <p className="text-sm text-[#8a755f]">Δεν υπάρχει ισχυρό χαμηλό-engagement signal.</p>}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-6 border-y border-[#d8d0c5] py-5 text-sm leading-6 text-[#77695e]">
            Η σύνδεση GA4 έχει ρυθμιστεί, αλλά δεν έχει ολοκληρωθεί ακόμη επιτυχής συγχρονισμός δεδομένων.
            {sync?.errorMessage ? <span className="mt-1 block text-red-700">{sync.errorMessage}</span> : null}
          </div>
        )}
      </div>
    </section>
  );
}

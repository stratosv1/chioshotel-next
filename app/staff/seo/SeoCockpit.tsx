import CopySeoAdviceButton from "./CopySeoAdviceButton";

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

function path(value?: string) {
  if (!value) return "";
  return value.replace(/^https?:\/\/[^/]+/, "") || "/";
}

function verdictLabel(value?: string) {
  if (value === "healthy") return "Υγιής εικόνα";
  if (value === "action") return "Χρειάζεται ενέργεια";
  return "Παρακολούθηση";
}

function verdictClasses(value?: string) {
  if (value === "healthy") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (value === "action") return "border-red-200 bg-red-50 text-red-800";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

function classificationLabel(value?: string) {
  if (value === "problem") return "SEO πρόβλημα";
  if (value === "opportunity") return "Ευκαιρία";
  if (value === "seasonality") return "Εποχικότητα";
  if (value === "cannibalization") return "Cannibalisation";
  return "Noise / αναμονή";
}

function lifecycleLabel(value?: string) {
  if (value === "new") return "Νέο";
  if (value === "persistent") return "Επιμένει";
  return "Παρακολούθηση";
}

function confidenceLabel(value?: string) {
  if (value === "high") return "Υψηλή βεβαιότητα";
  if (value === "medium") return "Μέτρια βεβαιότητα";
  return "Χαμηλή βεβαιότητα";
}

function moverScore(row: any) {
  return Math.abs(Number(row?.changes?.clicks || 0)) + Math.abs(Number(row?.changes?.position || 0)) * 12;
}

function topMovers(rows: any[], limit = 3) {
  return [...(rows || [])].sort((a, b) => moverScore(b) - moverScore(a)).slice(0, limit);
}

function MetricCard({ label, value, change, yoy, inverse = false }: { label: string; value: string; change: number; yoy?: number | null; inverse?: boolean }) {
  const good = inverse ? change <= 0 : change >= 0;
  return (
    <article className="rounded-2xl border border-[#ddcfba] bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a755f]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#44372d]">{value}</p>
      <p className={`mt-1 text-sm font-semibold ${good ? "text-emerald-700" : "text-red-700"}`}>{inverse && change !== 0 ? `${change > 0 ? "+" : ""}${n(change, 1)} θέσεις` : pct(change)}</p>
      <p className="mt-1 text-xs text-[#8a755f]">vs προηγ. 28ημ.{yoy == null ? "" : ` · YoY ${pct(yoy)}`}</p>
    </article>
  );
}

function MiniRadar({ title, items, renderItem }: { title: string; items: any[]; renderItem: (item: any) => React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-[#e4d7c4] bg-[#fcfaf6] p-4">
      <h3 className="text-sm font-semibold text-[#44372d]">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.length ? items.map((item, index) => <div key={`${title}-${item?.key || item?.query || index}`} className="rounded-xl bg-white p-3">{renderItem(item)}</div>) : <p className="text-sm text-[#8a755f]">Δεν υπάρχει ισχυρό signal.</p>}
      </div>
    </article>
  );
}

export default function SeoCockpit({ snapshot, history, sync, fallbackData }: { snapshot: any; history: any[]; sync: any; fallbackData: any }) {
  const data = snapshot?.payload || fallbackData || {};
  const interpretation = data?.aiInterpretation || null;
  const context = data?.analysisContext || null;
  const site = context?.site || null;
  const comparison = data?.snapshotComparison || {};
  const countries = topMovers(context?.countries || []);
  const devices = topMovers(context?.devices || [], 4);
  const appearances = topMovers(context?.searchAppearances || []);
  const cannibalization = (context?.cannibalization || []).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#44372d]">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        <header className="rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a755f]">Voulamandis House · Staff</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">SEO Cockpit</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#746454]">Μία καθαρή απάντηση στο «τι άλλαξε, γιατί και τι κάνουμε τώρα» — με GSC, YoY, χώρες, συσκευές, queries, pages, SERP appearance, intent ownership και προηγούμενες αποφάσεις.</p>
            </div>
            <a href="/staff" className="inline-flex w-fit items-center rounded-full border border-[#cdbda7] px-4 py-2 text-sm font-medium hover:bg-[#f4ede3]">← Staff Area</a>
          </div>
        </header>

        <section className="mt-5 overflow-hidden rounded-3xl border border-[#cdbda7] bg-white shadow-sm">
          <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${verdictClasses(interpretation?.verdict)}`}>{verdictLabel(interpretation?.verdict)}</span>
                <span className="rounded-full bg-[#f4ede3] px-3 py-1 text-xs font-semibold text-[#6f6051]">Δεδομένα έως {context?.latestCompleteDate || data?.latestDate || "—"}</span>
              </div>
              <h2 className="mt-4 max-w-4xl text-2xl font-semibold sm:text-3xl">{interpretation?.headline || data?.status || "Περιμένουμε ολοκληρωμένη ανάλυση"}</h2>
              <p className="mt-3 max-w-4xl text-base leading-7 text-[#625446]">{interpretation?.executiveSummary || data?.summary || "Δεν υπάρχει ακόμη αποθηκευμένη ερμηνεία."}</p>
            </div>
            <div className="min-w-32 rounded-2xl border border-[#e4d7c4] bg-[#faf7f1] p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8a755f]">SEO health</p>
              <p className="mt-1 text-4xl font-semibold">{Number.isFinite(Number(interpretation?.healthScore)) ? `${n(interpretation.healthScore)}/100` : "—"}</p>
              <p className="mt-1 text-xs text-[#8a755f]">AI decision score</p>
            </div>
          </div>

          <div className="border-t border-[#eadfce] bg-[#fcfaf6] p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">Τι άλλαξε από την προηγούμενη ανάλυση</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold">Νέα {n(snapshot?.newFindings || comparison?.newFindings)}</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold">Επιμένουν {n(snapshot?.persistentFindings || comparison?.persistentFindings)}</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold">Λύθηκαν {n(snapshot?.resolvedFindings || comparison?.resolvedFindings)}</span>
            </div>
            {interpretation?.whatChanged && <p className="mt-3 max-w-5xl text-sm leading-6 text-[#625446]">{interpretation.whatChanged}</p>}
          </div>
        </section>

        {site && (
          <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Organic clicks" value={n(site.current.clicks)} change={site.changes.clicks} yoy={site.yoy?.clicks} />
            <MetricCard label="Impressions" value={n(site.current.impressions)} change={site.changes.impressions} yoy={site.yoy?.impressions} />
            <MetricCard label="CTR" value={`${n(site.current.ctr * 100, 2)}%`} change={site.changes.ctr} yoy={site.yoy?.ctr} />
            <MetricCard label="Μέση θέση" value={n(site.current.position, 1)} change={site.changes.position} yoy={site.yoy?.position} inverse />
          </section>
        )}

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-[#d8c8b1] bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">Τι κάνουμε τώρα</p>
            <p className="mt-3 text-lg font-semibold leading-7">{interpretation?.primaryAction || "Περιμένουμε την επόμενη ολοκληρωμένη ερμηνεία."}</p>
            {interpretation?.nextReviewFocus && <p className="mt-3 text-sm leading-6 text-[#746454]">Επόμενος έλεγχος: {interpretation.nextReviewFocus}</p>}
          </article>
          <article className="rounded-3xl border border-[#e8dccb] bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">Τι δεν κάνουμε</p>
            <p className="mt-3 text-sm leading-7 text-[#625446]">{interpretation?.doNotDo || "Δεν κάνουμε μαζικές SEO αλλαγές χωρίς επιβεβαιωμένο signal."}</p>
          </article>
        </section>

        <section className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">Προτεραιότητες</p>
              <h2 className="mt-2 text-2xl font-semibold">Μόνο ό,τι αξίζει απόφαση</h2>
            </div>
            <span className="text-sm text-[#8a755f]">έως 5 findings</span>
          </div>

          <div className="mt-5 space-y-4">
            {Array.isArray(interpretation?.findings) && interpretation.findings.length ? interpretation.findings.map((finding: any, index: number) => (
              <article key={`${finding.title}-${index}`} className="rounded-2xl border border-[#e4d7c4] bg-[#fcfaf6] p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#d8c8b1] bg-white px-2.5 py-1 text-xs font-semibold">{classificationLabel(finding.classification)}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold">Impact {finding.impact || "—"}</span>
                  <span className="text-xs font-semibold text-[#8a755f]">{lifecycleLabel(finding.lifecycle)} · {confidenceLabel(finding.confidence)}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{finding.title}</h3>
                {finding.scopeLabel && <p className="mt-1 break-words text-xs text-[#8a755f]">Scope: {finding.scopeLabel}</p>}

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8a755f]">Τι σημαίνει</p>
                    <p className="mt-1 text-sm leading-6">{finding.meaning}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8a755f]">Πιθανότερη αιτία</p>
                    <p className="mt-1 text-sm leading-6">{finding.likelyCause}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-[#d8c8b1] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8a755f]">Απόφαση</p>
                  <p className="mt-1 text-sm font-semibold leading-6">{finding.action}</p>
                  {finding.doNotDo && <p className="mt-2 text-xs leading-5 text-[#8a755f]">Όχι τώρα: {finding.doNotDo}</p>}
                </div>

                <div className="mt-3 flex flex-col gap-1 text-xs leading-5 text-[#746454] sm:flex-row sm:flex-wrap sm:gap-x-5">
                  <span>Μετράμε: {finding.trackingMetric || "—"}</span>
                  <span>Επανέλεγχος: {n(finding.reviewInDays)} ημέρες</span>
                </div>
                {finding.evidence && <p className="mt-2 text-xs leading-5 text-[#8a755f]">Evidence: {finding.evidence}</p>}
              </article>
            )) : <p className="rounded-2xl bg-[#faf7f1] p-4 text-sm text-[#746454]">Δεν υπάρχει αυτή τη στιγμή finding που να απαιτεί απόφαση.</p>}
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">Radar</p>
          <h2 className="mt-2 text-2xl font-semibold">Πού αλλάζει η εικόνα</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MiniRadar title="Χώρες" items={countries} renderItem={(item) => <><p className="text-sm font-semibold">{item.label}</p><p className="mt-1 text-xs text-[#746454]">Clicks {pct(item.changes.clicks)} · θέση {item.changes.position > 0 ? "+" : ""}{n(item.changes.position, 1)}</p></>} />
            <MiniRadar title="Συσκευές" items={devices} renderItem={(item) => <><p className="text-sm font-semibold capitalize">{item.label}</p><p className="mt-1 text-xs text-[#746454]">Clicks {pct(item.changes.clicks)} · impressions {pct(item.changes.impressions)}</p></>} />
            <MiniRadar title="SERP appearance" items={appearances} renderItem={(item) => <><p className="break-words text-sm font-semibold">{item.label}</p><p className="mt-1 text-xs text-[#746454]">Impressions {pct(item.changes.impressions)} · CTR {pct(item.changes.ctr)}</p></>} />
            <MiniRadar title="Cannibalisation" items={cannibalization} renderItem={(item) => <><p className="break-words text-sm font-semibold">{item.query}</p><p className="mt-1 text-xs text-[#746454]">{n(item.pageCount)} URLs · {n(item.totalImpressions)} impressions</p></>} />
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a755f]">Μνήμη αποφάσεων</p>
          <h2 className="mt-2 text-2xl font-semibold">Τι λέγαμε στις προηγούμενες αναλύσεις</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {(history || []).slice(0, 4).map((item: any) => (
              <article key={item.analysisDate} className="rounded-2xl border border-[#e4d7c4] bg-[#fcfaf6] p-4">
                <p className="text-xs font-semibold text-[#8a755f]">{item.analysisDate}</p>
                <p className="mt-2 text-sm font-semibold leading-6">{item.payload?.aiInterpretation?.headline || "Χωρίς ερμηνεία"}</p>
                <p className="mt-2 text-xs text-[#746454]">Score {n(item.payload?.aiInterpretation?.healthScore)} · νέα {n(item.newFindings)} · λύθηκαν {n(item.resolvedFindings)}</p>
              </article>
            ))}
          </div>
        </section>

        <details className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm sm:p-7">
          <summary className="cursor-pointer list-none text-sm font-semibold">Τεχνικές λεπτομέρειες και rule-based findings</summary>
          <p className="mt-3 text-sm leading-6 text-[#746454]">{data?.architectureNote || ""}</p>
          <div className="mt-4 space-y-3">
            {(data?.priorities || []).map((item: any, index: number) => (
              <article key={`${item.title}-${index}`} className="rounded-2xl bg-[#faf7f1] p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6">{item.diagnosis || item.explanation}</p>
                <p className="mt-2 text-sm font-medium leading-6">{item.action}</p>
                {(item.page || item.query) && <p className="mt-2 text-xs text-[#8a755f]">{item.query ? `Query: ${item.query}` : ""}{item.query && item.page ? " · " : ""}{item.page ? `Σελίδα: ${path(item.page)}` : ""}</p>}
                <div className="mt-3 flex justify-end">
                  <CopySeoAdviceButton title={item.title} explanation={item.explanation} diagnosis={item.diagnosis} action={item.action} evidence={item.evidence} page={item.page} query={item.query} queryBreakdown={item.queryBreakdown} queryBreakdownTitle={item.queryBreakdownTitle} queryBreakdownNote={item.queryBreakdownNote} />
                </div>
              </article>
            ))}
          </div>
        </details>

        <section className="mt-5 rounded-3xl border border-[#ddcfba] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Αξιοπιστία δεδομένων</p>
              <p className="mt-1 text-sm text-[#746454]">Τελευταίο GSC sync: {dateTime(sync?.completedAt || sync?.startedAt)} · {sync?.status || "—"}</p>
              <p className="mt-1 text-sm text-[#746454]">Τελευταία απόφαση AI: {snapshot ? dateTime(snapshot.analyzedAt) : "δεν έχει εκτελεστεί ακόμη"}</p>
              <p className="mt-1 text-xs text-[#8a755f]">Αυτόματη πλήρης ανάλυση κάθε 3 ημέρες. Το cockpit χρησιμοποιεί την τελευταία πλήρη GSC ημέρα.</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${sync?.status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>{sync?.status === "success" ? "Δεδομένα ενημερωμένα" : "Χρειάζεται έλεγχος sync"}</span>
          </div>
        </section>
      </div>
    </main>
  );
}

import { neon } from "@neondatabase/serverless";

const SITE_URL = "sc-domain:chioshotel.gr";
const PRIMARY_SITEMAP = "https://chioshotel.gr/sitemap.xml";
const ANALYSIS_ANCHOR = "2026-07-30";
const ANALYSIS_INTERVAL_DAYS = 3;

type WatchSeverity = "critical" | "warning" | "watch" | "healthy";

export type SeoManagerWatchItem = {
  severity: WatchSeverity;
  title: string;
  detail: string;
  action: string;
};

export type SeoManagerMonitor = {
  generatedAt: string;
  freshness: {
    latestGscDataDate: string | null;
    sync: {
      status: string;
      completedAt: string | null;
      rowsWritten: number;
      datasets: number;
    } | null;
    advisor: {
      analyzedAt: string | null;
      latestDataDate: string | null;
      nextDueDate: string | null;
      cadenceDays: number;
    } | null;
    technical: {
      runId: string;
      status: string;
      completedAt: string | null;
      inspected: number;
      healthy: number;
      warning: number;
      info: number;
      critical: number;
      googleInspectionRows: number;
      googleQuotaRows: number;
    } | null;
    pageIndexing: {
      importedAt: string | null;
      totalReportedPages: number;
      issueCount: number;
    } | null;
  };
  pageIndexingIssues: Array<{
    reason: string;
    pages: number;
    previousPages: number | null;
    delta: number | null;
    validation: string;
    source: string;
  }>;
  runtimeRules: {
    enabled: number;
    verified: number;
    unverified: number;
    stale: number;
  };
  sitemap: {
    primary: {
      path: string;
      errors: number;
      warnings: number;
      submitted: number;
      indexed: number;
      lastDownloaded: string | null;
      isPending: boolean;
    } | null;
    legacyProblemCount: number;
    legacyProblemSamples: Array<{
      path: string;
      errors: number;
      warnings: number;
      isPending: boolean;
    }>;
  };
  queryDemand: Array<{
    segment: "brand" | "non_brand";
    currentClicks: number;
    previousClicks: number;
    clicksChangePct: number;
    currentImpressions: number;
    previousImpressions: number;
    impressionsChangePct: number;
    currentCtr: number;
    previousCtr: number;
    currentPosition: number;
    previousPosition: number;
  }>;
  watchlist: SeoManagerWatchItem[];
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

function num(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function text(value: unknown) {
  return value == null ? "" : String(value);
}

function pctChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function ageHours(value: string | null | undefined) {
  if (!value) return Number.POSITIVE_INFINITY;
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return Number.POSITIVE_INFINITY;
  return (Date.now() - timestamp) / 3_600_000;
}

function utcDayNumber(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function nextAnalysisDate(now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const anchor = utcDayNumber(ANALYSIS_ANCHOR);
  let day = utcDayNumber(today);
  if (day < anchor) day = anchor;
  while ((day - anchor) % ANALYSIS_INTERVAL_DAYS !== 0) day += 1;
  if (day === utcDayNumber(today)) day += ANALYSIS_INTERVAL_DAYS;
  return new Date(day * 86_400_000).toISOString().slice(0, 10);
}

function normalizeIssueReason(value: unknown) {
  return text(value)
    .replace(/â|â/g, "'")
    .replace(/â|â/g, "-")
    .trim();
}

function toIssueMap(value: unknown) {
  const map = new Map<string, number>();
  if (!Array.isArray(value)) return map;
  for (const item of value) {
    const reason = normalizeIssueReason((item as any)?.reason);
    if (!reason) continue;
    map.set(reason, num((item as any)?.pages));
  }
  return map;
}

function isPriorityIndexingIssue(reason: string) {
  const normalized = reason.toLowerCase();
  return (
    normalized.includes("server error") ||
    normalized.includes("redirect error") ||
    normalized.includes("not found") ||
    normalized.includes("noindex") ||
    normalized.includes("crawled") ||
    normalized.includes("discovered") ||
    normalized.includes("robots") ||
    normalized.includes("canonical") ||
    normalized.includes("other 4xx")
  );
}

export async function getSeoManagerMonitor(siteUrl = SITE_URL): Promise<SeoManagerMonitor> {
  const sql = getSql();

  const [syncRows, latestDataRows, advisorRows, healthRows, healthSeverityRows, healthGoogleRows, overviewRows, runtimeRows, sitemapRows, queryRows] = await Promise.all([
    sql`
      select status, completed_at as "completedAt", rows_written as "rowsWritten", datasets
      from gsc_sync_runs
      where site_url = ${siteUrl}
      order by started_at desc
      limit 1
    `,
    sql`
      select max(date)::text as "latestDataDate"
      from gsc_search_analytics
      where site_url = ${siteUrl}
        and search_type = 'web'
        and grain = 'daily'
        and is_incomplete = false
    `,
    sql`
      select analyzed_at as "analyzedAt", latest_data_date::text as "latestDataDate"
      from gsc_advisor_analysis_runs
      where site_url = ${siteUrl}
      order by analyzed_at desc
      limit 1
    `,
    sql`
      select id::text as "runId", status, completed_at as "completedAt", inspected_count as inspected,
        healthy_count as healthy, critical_count as critical
      from seo_health_runs
      where site_url = ${siteUrl}
      order by started_at desc
      limit 1
    `,
    sql`
      with latest as (
        select id from seo_health_runs where site_url = ${siteUrl} order by started_at desc limit 1
      )
      select severity, count(*)::integer as count
      from seo_url_inspections
      where run_id = (select id from latest)
      group by severity
    `,
    sql`
      with latest as (
        select id from seo_health_runs where site_url = ${siteUrl} order by started_at desc limit 1
      )
      select
        count(*) filter (where gsc_verdict <> '' or coverage_state <> '' or google_canonical <> '')::integer as "googleRows",
        count(*) filter (
          where coalesce(detail->>'gscQuotaExhausted','false') = 'true'
             or coalesce(detail->>'gscError','') ilike '%quota%'
             or coalesce(detail->>'gscError','') ilike '%429%'
        )::integer as "quotaRows"
      from seo_url_inspections
      where run_id = (select id from latest)
    `,
    sql`
      select id::text, imported_at as "importedAt", total_reported_pages as "totalReportedPages",
        issue_count as "issueCount", issues
      from seo_gsc_pages_overview_imports
      order by imported_at desc
      limit 2
    `,
    sql`
      select
        count(*) filter (where enabled)::integer as enabled,
        count(*) filter (where enabled and last_verified_at is not null)::integer as verified,
        count(*) filter (where enabled and last_verified_at is null)::integer as unverified,
        count(*) filter (where enabled and last_verified_at is not null and last_verified_at < now() - interval '14 days')::integer as stale
      from seo_runtime_rules
    `,
    sql`
      select sitemap_path as path, payload, updated_at as "updatedAt"
      from gsc_sitemaps_snapshot
      where site_url = ${siteUrl}
      order by updated_at desc, sitemap_path asc
    `,
    sql`
      with latest as (
        select max(date) as latest
        from gsc_search_analytics
        where site_url = ${siteUrl}
          and search_type = 'web'
          and grain = 'query'
          and is_incomplete = false
      ), source as (
        select date, clicks, impressions, position,
          case
            when lower(query) ~ '(voulamandis|chioshotel)' then 'brand'
            else 'non_brand'
          end as segment
        from gsc_search_analytics, latest
        where site_url = ${siteUrl}
          and search_type = 'web'
          and grain = 'query'
          and is_incomplete = false
          and query <> ''
          and date between latest - 55 and latest
      )
      select segment,
        sum(clicks) filter (where date between (select latest from latest) - 27 and (select latest from latest))::double precision as "currentClicks",
        sum(clicks) filter (where date between (select latest from latest) - 55 and (select latest from latest) - 28)::double precision as "previousClicks",
        sum(impressions) filter (where date between (select latest from latest) - 27 and (select latest from latest))::double precision as "currentImpressions",
        sum(impressions) filter (where date between (select latest from latest) - 55 and (select latest from latest) - 28)::double precision as "previousImpressions",
        sum(position * impressions) filter (where date between (select latest from latest) - 27 and (select latest from latest))::double precision as "currentPositionWeight",
        sum(position * impressions) filter (where date between (select latest from latest) - 55 and (select latest from latest) - 28)::double precision as "previousPositionWeight"
      from source
      group by segment
      order by segment
    `,
  ]);

  const sync = (syncRows as any[])[0] || null;
  const latestGscDataDate = text((latestDataRows as any[])[0]?.latestDataDate) || null;
  const advisorRaw = (advisorRows as any[])[0] || null;
  const advisor = advisorRaw
    ? {
        analyzedAt: advisorRaw.analyzedAt ? String(advisorRaw.analyzedAt) : null,
        latestDataDate: text(advisorRaw.latestDataDate) || null,
        nextDueDate: nextAnalysisDate(),
        cadenceDays: ANALYSIS_INTERVAL_DAYS,
      }
    : null;

  const severityCounts = new Map<string, number>(
    (healthSeverityRows as any[]).map((row) => [text(row.severity), num(row.count)]),
  );
  const healthRaw = (healthRows as any[])[0] || null;
  const googleRaw = (healthGoogleRows as any[])[0] || {};
  const technical = healthRaw
    ? {
        runId: text(healthRaw.runId),
        status: text(healthRaw.status),
        completedAt: healthRaw.completedAt ? String(healthRaw.completedAt) : null,
        inspected: num(healthRaw.inspected),
        healthy: num(healthRaw.healthy),
        warning: severityCounts.get("warning") || 0,
        info: severityCounts.get("info") || 0,
        critical: num(healthRaw.critical),
        googleInspectionRows: num(googleRaw.googleRows),
        googleQuotaRows: num(googleRaw.quotaRows),
      }
    : null;

  const overview = (overviewRows as any[])[0] || null;
  const previousOverview = (overviewRows as any[])[1] || null;
  const previousIssueMap = toIssueMap(previousOverview?.issues);
  const pageIndexingIssues = (Array.isArray(overview?.issues) ? overview.issues : [])
    .map((item: any) => {
      const reason = normalizeIssueReason(item?.reason);
      const pages = num(item?.pages);
      const previousPages = previousIssueMap.has(reason) ? previousIssueMap.get(reason)! : null;
      return {
        reason,
        pages,
        previousPages,
        delta: previousPages == null ? null : pages - previousPages,
        validation: text(item?.validation) || "—",
        source: text(item?.source) || "—",
      };
    })
    .filter((item: any) => item.reason && isPriorityIndexingIssue(item.reason))
    .sort((a: any, b: any) => {
      const priority = (reason: string) => {
        const value = reason.toLowerCase();
        if (value.includes("server error")) return 0;
        if (value.includes("redirect error")) return 1;
        if (value.includes("crawled")) return 2;
        if (value.includes("discovered")) return 3;
        if (value.includes("not found")) return 4;
        if (value.includes("noindex")) return 5;
        if (value.includes("robots")) return 6;
        return 7;
      };
      return priority(a.reason) - priority(b.reason) || b.pages - a.pages;
    });

  const runtimeRaw = (runtimeRows as any[])[0] || {};
  const runtimeRules = {
    enabled: num(runtimeRaw.enabled),
    verified: num(runtimeRaw.verified),
    unverified: num(runtimeRaw.unverified),
    stale: num(runtimeRaw.stale),
  };

  let primarySitemap: SeoManagerMonitor["sitemap"]["primary"] = null;
  const legacyProblemSamples: SeoManagerMonitor["sitemap"]["legacyProblemSamples"] = [];
  let legacyProblemCount = 0;
  for (const row of sitemapRows as any[]) {
    const payload = row?.payload || {};
    const errors = num(payload?.errors);
    const warnings = num(payload?.warnings);
    const submitted = Array.isArray(payload?.contents)
      ? payload.contents.reduce((total: number, item: any) => total + num(item?.submitted), 0)
      : 0;
    const indexed = Array.isArray(payload?.contents)
      ? payload.contents.reduce((total: number, item: any) => total + num(item?.indexed), 0)
      : 0;
    const item = {
      path: text(row?.path),
      errors,
      warnings,
      submitted,
      indexed,
      lastDownloaded: payload?.lastDownloaded ? String(payload.lastDownloaded) : null,
      isPending: Boolean(payload?.isPending),
    };
    if (item.path === PRIMARY_SITEMAP) {
      primarySitemap = item;
      continue;
    }
    if (errors > 0 || warnings > 0 || item.isPending) {
      legacyProblemCount += 1;
      if (legacyProblemSamples.length < 5) {
        legacyProblemSamples.push({ path: item.path, errors, warnings, isPending: item.isPending });
      }
    }
  }

  const queryDemand = (queryRows as any[]).map((row) => {
    const currentClicks = num(row.currentClicks);
    const previousClicks = num(row.previousClicks);
    const currentImpressions = num(row.currentImpressions);
    const previousImpressions = num(row.previousImpressions);
    return {
      segment: text(row.segment) === "brand" ? ("brand" as const) : ("non_brand" as const),
      currentClicks,
      previousClicks,
      clicksChangePct: pctChange(currentClicks, previousClicks),
      currentImpressions,
      previousImpressions,
      impressionsChangePct: pctChange(currentImpressions, previousImpressions),
      currentCtr: currentImpressions > 0 ? currentClicks / currentImpressions : 0,
      previousCtr: previousImpressions > 0 ? previousClicks / previousImpressions : 0,
      currentPosition: currentImpressions > 0 ? num(row.currentPositionWeight) / currentImpressions : 0,
      previousPosition: previousImpressions > 0 ? num(row.previousPositionWeight) / previousImpressions : 0,
    };
  });

  const watchlist: SeoManagerWatchItem[] = [];

  if (!sync || sync.status !== "success" || ageHours(sync.completedAt ? String(sync.completedAt) : null) > 36) {
    watchlist.push({
      severity: "critical",
      title: "GSC data pipeline χρειάζεται έλεγχο",
      detail: sync ? `Τελευταίο sync: ${text(sync.status)}.` : "Δεν υπάρχει αποθηκευμένο GSC sync.",
      action: "Έλεγξε το daily GSC sync πριν πάρεις αποφάσεις από performance δεδομένα.",
    });
  } else {
    watchlist.push({
      severity: "healthy",
      title: "GSC sync ενημερωμένο",
      detail: `Τελευταία πλήρη δεδομένα: ${latestGscDataDate || "—"}.`,
      action: "Καμία ενέργεια.",
    });
  }

  if (!technical || technical.status !== "success" || technical.critical > 0) {
    watchlist.push({
      severity: "critical",
      title: "Live technical SEO χρειάζεται άμεσο review",
      detail: technical ? `${technical.critical} critical · ${technical.warning} warnings.` : "Δεν υπάρχει technical audit.",
      action: "Έλεγξε 5xx, canonical, robots/noindex και redirects πριν από content αλλαγές.",
    });
  } else if (technical.warning > 0) {
    watchlist.push({
      severity: "warning",
      title: "Υπάρχουν live technical findings για review",
      detail: `${technical.warning} warnings στο τελευταίο run #${technical.runId}.`,
      action: "Δες μόνο τα warnings που παραμένουν live· μην διορθώνεις historical GSC rows χωρίς live επιβεβαίωση.",
    });
  } else {
    watchlist.push({
      severity: "healthy",
      title: "Live technical layer καθαρό",
      detail: `${technical.inspected} URLs ελέγχθηκαν χωρίς critical/warning finding.`,
      action: "Καμία ενέργεια.",
    });
  }

  if (technical && technical.googleInspectionRows === 0 && technical.googleQuotaRows > 0) {
    watchlist.push({
      severity: "watch",
      title: "Google URL Inspection quota εξαντλημένο",
      detail: `${technical.googleQuotaRows}/${technical.inspected} URLs δεν είχαν fresh Google inspection στο τελευταίο run.`,
      action: "Θεώρησε έγκυρο το live HTTP/canonical audit, αλλά περίμενε fresh Google verification πριν πεις ότι η Google επανεπεξεργάστηκε τα URLs.",
    });
  }

  if (!overview || ageHours(overview.importedAt ? String(overview.importedAt) : null) > 24 * 8) {
    watchlist.push({
      severity: "warning",
      title: "Page Indexing snapshot χρειάζεται νέο export",
      detail: overview ? `Τελευταίο GSC Pages export: ${String(overview.importedAt)}.` : "Δεν υπάρχει GSC Pages overview export.",
      action: "Ανέβασε νέο Google Pages ZIP στο /staff/seo για εβδομαδιαία σύγκριση coverage.",
    });
  }

  const reported5xx = pageIndexingIssues.find((item) => item.reason.toLowerCase().includes("server error"));
  const reportedRedirectErrors = pageIndexingIssues.find((item) => item.reason.toLowerCase().includes("redirect error"));
  if ((reported5xx?.pages || 0) > 0 || (reportedRedirectErrors?.pages || 0) > 0) {
    watchlist.push({
      severity: "watch",
      title: "Google εξακολουθεί να αναφέρει παλιά critical indexing rows",
      detail: `GSC snapshot: ${reported5xx?.pages || 0} 5xx · ${reportedRedirectErrors?.pages || 0} redirect errors.`,
      action: "Παρακολούθησε το Validate Fix/recrawl. Το snapshot είναι evidence από την ημερομηνία import, όχι live verdict.",
    });
  }

  if (primarySitemap && primarySitemap.errors === 0 && primarySitemap.warnings === 0 && !primarySitemap.isPending) {
    watchlist.push({
      severity: "healthy",
      title: "Primary sitemap καθαρό",
      detail: `${primarySitemap.submitted} submitted · 0 errors · 0 warnings.`,
      action: "Καμία ενέργεια στο current sitemap.",
    });
  } else {
    watchlist.push({
      severity: "warning",
      title: "Primary sitemap χρειάζεται έλεγχο",
      detail: primarySitemap ? `${primarySitemap.errors} errors · ${primarySitemap.warnings} warnings.` : "Το current sitemap δεν βρέθηκε στο GSC snapshot.",
      action: "Έλεγξε sitemap fetch, submitted URLs και current canonical inventory.",
    });
  }

  if (legacyProblemCount > 0) {
    watchlist.push({
      severity: "watch",
      title: "Legacy sitemap hygiene",
      detail: `${legacyProblemCount} παλιές sitemap submissions έχουν error/warning/pending state στο GSC.`,
      action: "Κράτησέ τες χωριστά από το current sitemap και αφαίρεσέ τες από το GSC όταν επιβεβαιωθεί ότι δεν χρειάζονται πλέον.",
    });
  }

  if (runtimeRules.unverified > 0 || runtimeRules.stale > 0) {
    watchlist.push({
      severity: "warning",
      title: "Redirect runtime rules χρειάζονται revalidation",
      detail: `${runtimeRules.unverified} unverified · ${runtimeRules.stale} stale.`,
      action: "Άφησε το SEO health lifecycle να τα επανελέγξει πριν προστεθούν νέοι dynamic redirect κανόνες.",
    });
  } else if (runtimeRules.enabled > 0) {
    watchlist.push({
      severity: "healthy",
      title: "Runtime redirect rules verified",
      detail: `${runtimeRules.verified}/${runtimeRules.enabled} enabled rules έχουν verification timestamp.`,
      action: "Καμία ενέργεια.",
    });
  }

  if (!advisor || ageHours(advisor.analyzedAt) > 24 * (ANALYSIS_INTERVAL_DAYS + 1)) {
    watchlist.push({
      severity: "warning",
      title: "SEO Advisor analysis είναι stale",
      detail: advisor ? `Τελευταία analysis: ${advisor.analyzedAt}.` : "Δεν υπάρχει Advisor analysis.",
      action: "Έλεγξε το scheduled analysis job ή τρέξε force analysis μόνο αν είναι απαραίτητο.",
    });
  }

  const nonBrand = queryDemand.find((item) => item.segment === "non_brand");
  if (nonBrand && nonBrand.previousClicks >= 20 && nonBrand.clicksChangePct <= -15) {
    watchlist.push({
      severity: "warning",
      title: "Non-brand organic clicks υποχωρούν",
      detail: `${nonBrand.clicksChangePct.toFixed(1)}% στις τελευταίες 28 ημέρες έναντι των προηγούμενων 28.`,
      action: "Έλεγξε landing pages, query losses, CTR και position πριν αλλάξεις content μαζικά.",
    });
  } else if (nonBrand) {
    watchlist.push({
      severity: "healthy",
      title: "Non-brand demand χωρίς ισχυρό αρνητικό signal",
      detail: `${nonBrand.clicksChangePct >= 0 ? "+" : ""}${nonBrand.clicksChangePct.toFixed(1)}% query-visible clicks σε 28ημ. σύγκριση.`,
      action: "Παρακολούθησε μαζί με query/page movers στο SEO Cockpit.",
    });
  }

  const severityRank: Record<WatchSeverity, number> = { critical: 0, warning: 1, watch: 2, healthy: 3 };
  watchlist.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return {
    generatedAt: new Date().toISOString(),
    freshness: {
      latestGscDataDate,
      sync: sync
        ? {
            status: text(sync.status),
            completedAt: sync.completedAt ? String(sync.completedAt) : null,
            rowsWritten: num(sync.rowsWritten),
            datasets: num(sync.datasets),
          }
        : null,
      advisor,
      technical,
      pageIndexing: overview
        ? {
            importedAt: overview.importedAt ? String(overview.importedAt) : null,
            totalReportedPages: num(overview.totalReportedPages),
            issueCount: num(overview.issueCount),
          }
        : null,
    },
    pageIndexingIssues,
    runtimeRules,
    sitemap: {
      primary: primarySitemap,
      legacyProblemCount,
      legacyProblemSamples,
    },
    queryDemand,
    watchlist,
  };
}

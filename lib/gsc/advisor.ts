import { neon } from "@neondatabase/serverless";
import { ensureGscTables } from "@/lib/gsc/store";

const DEFAULT_SITE = "sc-domain:chioshotel.gr";

export type SeoQueryChange = {
  query: string;
  currentClicks: number;
  previousClicks: number;
  currentImpressions: number;
  previousImpressions: number;
  currentCtr: number;
  previousCtr: number;
  currentPosition: number;
  previousPosition: number;
  clickChange: number;
  impressionChange: number;
  positionDelta: number;
};

export type SeoPriority = {
  severity: "high" | "medium" | "low";
  title: string;
  explanation: string;
  diagnosis?: string;
  action: string;
  evidence: string;
  page?: string;
  query?: string;
  queryBreakdown?: SeoQueryChange[];
  queryBreakdownTitle?: string;
  queryBreakdownNote?: string;
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

function pctChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function fmtPct(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function shortPath(url: string) {
  return url.replace(/^https?:\/\/[^/]+/, "") || "/";
}

function toQueryChanges(rows: any[]): SeoQueryChange[] {
  return rows.map((row) => {
    const currentClicks = num(row.current_clicks);
    const previousClicks = num(row.previous_clicks);
    const currentImpressions = num(row.current_impressions);
    const previousImpressions = num(row.previous_impressions);
    const currentPosition = num(row.current_position);
    const previousPosition = num(row.previous_position);

    return {
      query: String(row.query || ""),
      currentClicks,
      previousClicks,
      currentImpressions,
      previousImpressions,
      currentCtr: num(row.current_ctr),
      previousCtr: num(row.previous_ctr),
      currentPosition,
      previousPosition,
      clickChange: pctChange(currentClicks, previousClicks),
      impressionChange: pctChange(currentImpressions, previousImpressions),
      positionDelta:
        previousPosition > 0 && currentPosition > 0
          ? currentPosition - previousPosition
          : 0,
    };
  });
}

function diagnoseDecline(row: any) {
  const currentImpressions = num(row.impressions);
  const previousImpressions = num(row.previous_impressions);
  const currentCtr = num(row.ctr);
  const previousCtr =
    previousImpressions > 0 ? num(row.previous_clicks) / previousImpressions : 0;
  const currentPosition = num(row.position);
  const previousPosition = num(row.previous_position);

  const impressionChange = pctChange(currentImpressions, previousImpressions);
  const ctrChange = pctChange(currentCtr, previousCtr);
  const positionDelta =
    previousPosition > 0 && currentPosition > 0
      ? currentPosition - previousPosition
      : 0;

  if (positionDelta >= 2) {
    return `Το ισχυρότερο σήμα είναι η πτώση κατά ${positionDelta.toFixed(1)} θέσεις (${previousPosition.toFixed(1)} → ${currentPosition.toFixed(1)}). Πριν πειράξουμε snippet ή περιεχόμενο, πρέπει να δούμε ποιες queries έχασαν ranking και αν η ζήτηση παρέμεινε ίδια.`;
  }

  if (impressionChange <= -25) {
    return `Το ισχυρότερο σήμα είναι η μείωση εμφανίσεων κατά ${Math.abs(impressionChange).toFixed(1)}%, χωρίς αντίστοιχη μεγάλη πτώση θέσης. Αυτό μπορεί να σημαίνει χαμηλότερη ζήτηση ή ότι η σελίδα εμφανίζεται για λιγότερες queries.`;
  }

  if (ctrChange <= -20) {
    return `Η θέση δεν έχει μεταβληθεί αρκετά για να εξηγεί μόνη της την πτώση, αλλά το CTR μειώθηκε ${Math.abs(ctrChange).toFixed(1)}%. Εδώ εξετάζουμε πρώτα τις queries και το snippet που βλέπουν οι χρήστες.`;
  }

  return "Η πτώση δεν εξηγείται από έναν μόνο δείκτη. Χρειάζεται σύγκριση query προς query ώστε να ξεχωρίσουμε ranking, ζήτηση και CTR πριν κάνουμε αλλαγή.";
}

function diagnoseLowCtr(rows: SeoQueryChange[]) {
  const meaningful = rows.filter(
    (row) =>
      row.currentImpressions >= 20 &&
      row.currentPosition > 0 &&
      row.currentPosition <= 10,
  );
  const lowCtr = meaningful.filter((row) => row.currentCtr < 0.02);

  if (!meaningful.length) {
    return "Η σελίδα έχει χαμηλό συνολικό CTR, αλλά οι κορυφαίες queries δεν έχουν ακόμη αρκετό επιμέρους όγκο για ασφαλή διάγνωση. Δεν αλλάζουμε snippet μόνο από τον συνολικό μέσο όρο.";
  }

  if (lowCtr.length >= Math.ceil(meaningful.length / 2)) {
    return `Στις κορυφαίες queries, ${lowCtr.length} από ${meaningful.length} με τουλάχιστον 20 impressions και θέση 1–10 έχουν CTR κάτω από 2%. Αυτό ενισχύει την πιθανότητα ότι το snippet δεν κερδίζει αρκετά clicks, παρότι η ορατότητα είναι καλή.`;
  }

  return `Στις κορυφαίες queries μόνο ${lowCtr.length} από ${meaningful.length} με τουλάχιστον 20 impressions και θέση 1–10 έχουν CTR κάτω από 2%. Άρα το χαμηλό συνολικό CTR μπορεί να προέρχεται περισσότερο από το mix των queries και όχι από ένα γενικό πρόβλημα του snippet.`;
}

async function getPageQueryChanges(
  sql: ReturnType<typeof neon>,
  siteUrl: string,
  latestDate: string,
  page: string,
): Promise<SeoQueryChange[]> {
  const rows = await sql`
    with bounds as (select ${latestDate}::date as latest),
    current_q as (
      select query,
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
        (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
      from gsc_search_analytics, bounds
      where site_url = ${siteUrl} and search_type = 'web' and grain = 'query_page'
        and page = ${page}
        and date between latest - 27 and latest
        and query <> ''
      group by query
    ),
    previous_q as (
      select query,
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
        (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
      from gsc_search_analytics, bounds
      where site_url = ${siteUrl} and search_type = 'web' and grain = 'query_page'
        and page = ${page}
        and date between latest - 55 and latest - 28
        and query <> ''
      group by query
    )
    select
      coalesce(c.query, p.query) as query,
      coalesce(c.clicks, 0)::double precision as current_clicks,
      coalesce(p.clicks, 0)::double precision as previous_clicks,
      coalesce(c.impressions, 0)::double precision as current_impressions,
      coalesce(p.impressions, 0)::double precision as previous_impressions,
      coalesce(c.ctr, 0)::double precision as current_ctr,
      coalesce(p.ctr, 0)::double precision as previous_ctr,
      coalesce(c.position, 0)::double precision as current_position,
      coalesce(p.position, 0)::double precision as previous_position
    from current_q c
    full outer join previous_q p using (query)
    where coalesce(c.impressions, 0) + coalesce(p.impressions, 0) > 0
    order by
      (coalesce(p.clicks, 0) - coalesce(c.clicks, 0)) desc,
      greatest(coalesce(p.impressions, 0), coalesce(c.impressions, 0)) desc
    limit 12
  `;

  return toQueryChanges(rows as any[]);
}

async function getPageTopQueries(
  sql: ReturnType<typeof neon>,
  siteUrl: string,
  latestDate: string,
  page: string,
): Promise<SeoQueryChange[]> {
  const rows = await sql`
    with bounds as (select ${latestDate}::date as latest),
    current_q as (
      select query,
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
        (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
      from gsc_search_analytics, bounds
      where site_url = ${siteUrl} and search_type = 'web' and grain = 'query_page'
        and page = ${page}
        and date between latest - 27 and latest
        and query <> ''
      group by query
    ),
    previous_q as (
      select query,
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
        (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
      from gsc_search_analytics, bounds
      where site_url = ${siteUrl} and search_type = 'web' and grain = 'query_page'
        and page = ${page}
        and date between latest - 55 and latest - 28
        and query <> ''
      group by query
    )
    select
      c.query,
      c.clicks::double precision as current_clicks,
      coalesce(p.clicks, 0)::double precision as previous_clicks,
      c.impressions::double precision as current_impressions,
      coalesce(p.impressions, 0)::double precision as previous_impressions,
      c.ctr::double precision as current_ctr,
      coalesce(p.ctr, 0)::double precision as previous_ctr,
      c.position::double precision as current_position,
      coalesce(p.position, 0)::double precision as previous_position
    from current_q c
    left join previous_q p using (query)
    order by c.impressions desc, c.clicks desc, c.query
    limit 12
  `;

  return toQueryChanges(rows as any[]);
}

export async function getSeoAdvisorData(siteUrl = DEFAULT_SITE) {
  await ensureGscTables();
  const sql = getSql();

  const latestRows = await sql`
    select max(date)::text as latest_date
    from gsc_search_analytics
    where site_url = ${siteUrl} and search_type = 'web' and grain = 'daily'
  `;
  const latestDate = String((latestRows as any[])?.[0]?.latest_date || "");

  if (!latestDate) {
    return {
      siteUrl,
      latestDate: null,
      status: "Δεν υπάρχουν ακόμη δεδομένα",
      statusTone: "attention" as const,
      summary:
        "Η σύνδεση υπάρχει, αλλά δεν έχουμε ακόμη αρκετά αποθηκευμένα δεδομένα Search Console για αξιολόγηση.",
      priorities: [] as SeoPriority[],
      current: null,
      previous: null,
      sync: null,
    };
  }

  const [periodRows, syncRows, pageRows, opportunityRows] = await Promise.all([
    sql`
      with bounds as (select ${latestDate}::date as latest), periods as (
        select
          sum(clicks) filter (where date between latest - 27 and latest)::double precision as current_clicks,
          sum(impressions) filter (where date between latest - 27 and latest)::double precision as current_impressions,
          sum(position * impressions) filter (where date between latest - 27 and latest)::double precision as current_position_weight,
          sum(clicks) filter (where date between latest - 55 and latest - 28)::double precision as previous_clicks,
          sum(impressions) filter (where date between latest - 55 and latest - 28)::double precision as previous_impressions,
          sum(position * impressions) filter (where date between latest - 55 and latest - 28)::double precision as previous_position_weight
        from gsc_search_analytics, bounds
        where site_url = ${siteUrl} and search_type = 'web' and grain = 'daily'
      )
      select
        coalesce(current_clicks, 0)::double precision as current_clicks,
        coalesce(current_impressions, 0)::double precision as current_impressions,
        case when current_impressions > 0 then current_clicks / current_impressions else 0 end::double precision as current_ctr,
        case when current_impressions > 0 then current_position_weight / current_impressions else 0 end::double precision as current_position,
        coalesce(previous_clicks, 0)::double precision as previous_clicks,
        coalesce(previous_impressions, 0)::double precision as previous_impressions,
        case when previous_impressions > 0 then previous_clicks / previous_impressions else 0 end::double precision as previous_ctr,
        case when previous_impressions > 0 then previous_position_weight / previous_impressions else 0 end::double precision as previous_position
      from periods
    `,
    sql`
      select started_at, completed_at, status, rows_written, datasets, error_message
      from gsc_sync_runs
      where site_url = ${siteUrl}
      order by started_at desc
      limit 1
    `,
    sql`
      with bounds as (select ${latestDate}::date as latest),
      current_pages as (
        select page,
          sum(clicks)::double precision as clicks,
          sum(impressions)::double precision as impressions,
          (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
          (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
        from gsc_search_analytics, bounds
        where site_url = ${siteUrl} and search_type = 'web' and grain = 'page'
          and date between latest - 27 and latest
        group by page
      ), previous_pages as (
        select page,
          sum(clicks)::double precision as clicks,
          sum(impressions)::double precision as impressions,
          (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
          (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
        from gsc_search_analytics, bounds
        where site_url = ${siteUrl} and search_type = 'web' and grain = 'page'
          and date between latest - 55 and latest - 28
        group by page
      )
      select c.page,
        c.clicks, c.impressions, c.ctr, c.position,
        coalesce(p.clicks, 0)::double precision as previous_clicks,
        coalesce(p.impressions, 0)::double precision as previous_impressions,
        coalesce(p.ctr, 0)::double precision as previous_ctr,
        coalesce(p.position, 0)::double precision as previous_position
      from current_pages c
      left join previous_pages p using (page)
      order by c.impressions desc
      limit 250
    `,
    sql`
      with bounds as (select ${latestDate}::date as latest)
      select query, page,
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
        (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
      from gsc_search_analytics, bounds
      where site_url = ${siteUrl} and search_type = 'web' and grain = 'query_page'
        and date between latest - 27 and latest
      group by query, page
      having sum(impressions) >= 20
        and (sum(position * impressions) / nullif(sum(impressions), 0)) between 4 and 20
      order by impressions desc
      limit 150
    `,
  ]);

  const p = (periodRows as any[])?.[0] || {};
  const current = {
    clicks: num(p.current_clicks),
    impressions: num(p.current_impressions),
    ctr: num(p.current_ctr),
    position: num(p.current_position),
  };
  const previous = {
    clicks: num(p.previous_clicks),
    impressions: num(p.previous_impressions),
    ctr: num(p.previous_ctr),
    position: num(p.previous_position),
  };
  const clickChange = pctChange(current.clicks, previous.clicks);
  const impressionChange = pctChange(current.impressions, previous.impressions);
  const ctrChange = pctChange(current.ctr, previous.ctr);
  const positionChange =
    previous.position > 0 ? current.position - previous.position : 0;
  const sync = (syncRows as any[])?.[0] || null;
  const priorities: SeoPriority[] = [];

  const pages = pageRows as any[];
  const declining = pages
    .map((row) => ({
      ...row,
      change: pctChange(num(row.clicks), num(row.previous_clicks)),
    }))
    .filter(
      (row) =>
        num(row.previous_clicks) >= 5 &&
        row.change <= -25 &&
        num(row.impressions) >= 40,
    )
    .sort((a, b) => a.change - b.change)[0];

  if (declining) {
    const page = String(declining.page);
    const queryBreakdown = await getPageQueryChanges(
      sql,
      siteUrl,
      latestDate,
      page,
    );
    priorities.push({
      severity: "high",
      title: `Έπεσε αισθητά η σελίδα ${shortPath(page)}`,
      explanation:
        "Η σελίδα έχασε οργανικά clicks σε σχέση με τις προηγούμενες 28 ημέρες. Η πρόταση δεν βασίζεται μόνο στο ποσοστό πτώσης: συγκρίνουμε θέση, εμφανίσεις, CTR και τις queries που άλλαξαν περισσότερο.",
      diagnosis: diagnoseDecline(declining),
      action:
        "Πρώτα εξετάζουμε τις queries που έχασαν clicks ή θέσεις. Μόνο μετά αποφασίζουμε αν χρειάζεται αλλαγή σε title/meta, κύριο περιεχόμενο ή internal links. Δεν αλλάζουμε URL ή canonical χωρίς σαφή τεχνικό λόγο.",
      evidence: `Clicks ${fmtPct(declining.change)} · θέση ${num(declining.position).toFixed(1)} από ${num(declining.previous_position).toFixed(1)} · impressions ${Math.round(num(declining.impressions))} από ${Math.round(num(declining.previous_impressions))}`,
      page,
      queryBreakdown,
      queryBreakdownTitle: "Queries που άλλαξαν περισσότερο",
      queryBreakdownNote:
        "Ταξινόμηση με βάση χαμένα clicks και όγκο. Προηγούμενες 28 ημέρες → τελευταίες 28 ημέρες.",
    });
  }

  const lowCtr = pages
    .filter(
      (row) =>
        num(row.impressions) >= 100 &&
        num(row.position) > 0 &&
        num(row.position) <= 10 &&
        num(row.ctr) < 0.02,
    )
    .sort((a, b) => num(b.impressions) - num(a.impressions))[0];

  if (lowCtr) {
    const page = String(lowCtr.page);
    const queryBreakdown = await getPageTopQueries(
      sql,
      siteUrl,
      latestDate,
      page,
    );
    priorities.push({
      severity: "high",
      title: `Καλή ορατότητα αλλά χαμηλά clicks στη ${shortPath(page)}`,
      explanation:
        "Η Google εμφανίζει συχνά τη σελίδα και η μέση θέση είναι ήδη στην πρώτη σελίδα, αλλά σχετικά λίγοι χρήστες κάνουν click. Για CTR ευρήματα κοιτάμε πρώτα τις queries με τις περισσότερες τωρινές εμφανίσεις — όχι απλώς όσες άλλαξαν περισσότερο.",
      diagnosis: diagnoseLowCtr(queryBreakdown),
      action:
        "Ελέγχουμε πρώτα τις κορυφαίες queries σε εμφανίσεις. Αν επιβεβαιώνουν καλή θέση αλλά χαμηλό CTR, δοκιμάζουμε πρώτα μία συγκεκριμένη αλλαγή στο title. Κρατάμε meta description και κύριο περιεχόμενο σταθερά στο πρώτο τεστ ώστε να ξέρουμε τι βοήθησε.",
      evidence: `${Math.round(num(lowCtr.impressions))} impressions · CTR ${(num(lowCtr.ctr) * 100).toFixed(2)}% · θέση ${num(lowCtr.position).toFixed(1)}`,
      page,
      queryBreakdown,
      queryBreakdownTitle: "Top queries σε τωρινές εμφανίσεις",
      queryBreakdownNote:
        "Ταξινόμηση με βάση τις εμφανίσεις των τελευταίων 28 ημερών. Δίπλα φαίνεται και η προηγούμενη περίοδος για σύγκριση.",
    });
  }

  const opportunity = (opportunityRows as any[])
    .filter((row) => num(row.position) >= 4 && num(row.position) <= 15)
    .sort((a, b) => num(b.impressions) - num(a.impressions))[0];

  if (opportunity) {
    priorities.push({
      severity: "medium",
      title: `Ευκαιρία ανόδου για “${String(opportunity.query)}”`,
      explanation:
        "Η συγκεκριμένη αναζήτηση έχει ήδη ζήτηση και η σελίδα βρίσκεται κοντά στις κορυφαίες θέσεις. Συνήθως εδώ αξίζει περισσότερο να ενισχύσουμε υπάρχουσα σελίδα παρά να δημιουργήσουμε καινούργια.",
      diagnosis:
        "Εδώ δεν έχουμε απαραίτητα πρόβλημα. Έχουμε query που ήδη αποδίδει αρκετά ώστε μια μικρή βελτίωση θέσης να μπορεί να φέρει περισσότερα clicks.",
      action:
        "Ενισχύουμε τη σχετική ενότητα της σελίδας, το H1/H2 όπου χρειάζεται, τα εσωτερικά links και τη σαφή απάντηση στην πρόθεση της query. Μετά μετράμε την αλλαγή για 2–4 εβδομάδες.",
      evidence: `${Math.round(num(opportunity.impressions))} impressions · ${Math.round(num(opportunity.clicks))} clicks · θέση ${num(opportunity.position).toFixed(1)}`,
      page: String(opportunity.page),
      query: String(opportunity.query),
    });
  }

  if (ctrChange <= -20 && current.impressions >= 100) {
    priorities.push({
      severity: "medium",
      title: "Το συνολικό CTR υποχώρησε",
      explanation:
        "Οι εμφανίσεις δεν μετατρέπονται σε clicks τόσο αποτελεσματικά όσο στην προηγούμενη περίοδο. Αυτό μπορεί να οφείλεται σε χαμηλότερες θέσεις, διαφορετικό mix queries ή λιγότερο ελκυστικά snippets.",
      diagnosis:
        "Το συνολικό CTR είναι ένδειξη, όχι από μόνο του διάγνωση. Για απόφαση κοιτάμε πρώτα τις επιμέρους σελίδες και queries με αρκετό όγκο.",
      action:
        "Δίνουμε προτεραιότητα στις σελίδες με πολλές εμφανίσεις και θέση 1–10 αλλά χαμηλό CTR. Δεν αλλάζουμε μαζικά όλα τα titles μαζί.",
      evidence: `CTR ${fmtPct(ctrChange)} έναντι προηγούμενων 28 ημερών`,
    });
  }

  if (priorities.length === 0) {
    priorities.push({
      severity: "low",
      title:
        "Δεν εμφανίζεται αυτή τη στιγμή κάποια καθαρή επείγουσα SEO βλάβη",
      explanation:
        "Τα διαθέσιμα δεδομένα δεν δείχνουν μεγάλη πτώση ή προφανή χαμένη ευκαιρία με αρκετό όγκο ώστε να δικαιολογεί βιαστική αλλαγή.",
      diagnosis:
        "Η απουσία επείγοντος προβλήματος είναι θετικό εύρημα. Συνεχίζουμε με ευκαιρίες ανάπτυξης αντί για διορθώσεις χωρίς αποδείξεις.",
      action:
        "Συνεχίζουμε με στοχευμένες βελτιώσεις στις queries που βρίσκονται κοντά στην πρώτη σελίδα και παρακολουθούμε τις μεταβολές ανά 28 ημέρες.",
      evidence: `Clicks ${fmtPct(clickChange)} · impressions ${fmtPct(impressionChange)} έναντι προηγούμενης περιόδου`,
    });
  }

  const syncHasWarnings = Boolean(sync?.error_message);
  let status = "Σταθερή εικόνα";
  let statusTone: "good" | "neutral" | "attention" = "neutral";
  let summary = `Τα οργανικά clicks είναι ${fmtPct(clickChange)} και οι εμφανίσεις ${fmtPct(impressionChange)} σε σύγκριση με τις προηγούμενες 28 ημέρες.`;

  if (sync?.status !== "success") {
    status = "Χρειάζεται τεχνικός έλεγχος";
    statusTone = "attention";
    summary =
      "Το τελευταίο Search Console sync δεν ολοκληρώθηκε επιτυχώς, επομένως δεν πρέπει να πάρουμε SEO απόφαση μέχρι να αποκατασταθεί η ροή δεδομένων.";
  } else if (clickChange <= -20) {
    status = "Χρειάζεται προσοχή";
    statusTone = "attention";
    summary = `Τα clicks έχουν μειωθεί ${Math.abs(clickChange).toFixed(1)}% έναντι της προηγούμενης περιόδου. Η πτώση είναι αρκετή ώστε να χρειάζεται διάγνωση ανά σελίδα και query πριν κάνουμε αλλαγές.`;
  } else if (clickChange >= 10 && impressionChange >= 0) {
    status = "Καλή πορεία";
    statusTone = "good";
    summary = `Τα clicks αυξήθηκαν ${clickChange.toFixed(1)}% και οι εμφανίσεις ${fmtPct(impressionChange)}. Η κατεύθυνση είναι θετική· τώρα προτεραιότητα είναι να ενισχύσουμε τις queries που είναι ήδη κοντά στις κορυφαίες θέσεις.`;
  }

  if (syncHasWarnings && sync?.status === "success") {
    summary +=
      " Το sync ολοκληρώθηκε, αλλά υπάρχουν προειδοποιήσεις για προαιρετικά datasets που πρέπει να έχουμε υπόψη στην ανάλυση.";
  }

  return {
    siteUrl,
    latestDate,
    status,
    statusTone,
    summary,
    priorities: priorities.slice(0, 5),
    current,
    previous,
    changes: {
      clicks: clickChange,
      impressions: impressionChange,
      ctr: ctrChange,
      position: positionChange,
    },
    sync,
  };
}

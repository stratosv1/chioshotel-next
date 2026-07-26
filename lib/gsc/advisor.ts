import { neon } from "@neondatabase/serverless";
import { ensureGscTables } from "@/lib/gsc/store";

const DEFAULT_SITE = "sc-domain:chioshotel.gr";

export type SeoPriority = {
  severity: "high" | "medium" | "low";
  title: string;
  explanation: string;
  action: string;
  evidence: string;
  page?: string;
  query?: string;
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
      summary: "Η σύνδεση υπάρχει, αλλά δεν έχουμε ακόμη αρκετά αποθηκευμένα δεδομένα Search Console για αξιολόγηση.",
      priorities: [] as SeoPriority[],
      current: null,
      previous: null,
      sync: null,
    };
  }

  const [periodRows, syncRows, pageRows, opportunityRows] = await Promise.all([
    sql`
      with bounds as (
        select ${latestDate}::date as latest
      ), periods as (
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
  const positionChange = previous.position > 0 ? current.position - previous.position : 0;
  const sync = (syncRows as any[])?.[0] || null;
  const priorities: SeoPriority[] = [];

  const pages = pageRows as any[];
  const declining = pages
    .map((row) => ({ ...row, change: pctChange(num(row.clicks), num(row.previous_clicks)) }))
    .filter((row) => num(row.previous_clicks) >= 5 && row.change <= -25 && num(row.impressions) >= 40)
    .sort((a, b) => a.change - b.change)[0];

  if (declining) {
    priorities.push({
      severity: "high",
      title: `Έπεσε αισθητά η σελίδα ${shortPath(String(declining.page))}`,
      explanation: "Η σελίδα έχασε οργανικά clicks σε σχέση με τις προηγούμενες 28 ημέρες. Πριν αλλάξουμε κάτι, πρέπει να δούμε αν έπεσε η θέση, το CTR ή η ζήτηση.",
      action: "Ελέγχουμε title/meta, κύριο περιεχόμενο, internal links και τις queries που έχασαν έδαφος. Δεν αλλάζουμε URL ή canonical χωρίς σαφή λόγο.",
      evidence: `Clicks ${fmtPct(declining.change)} · θέση ${num(declining.position).toFixed(1)} από ${num(declining.previous_position).toFixed(1)} · ${Math.round(num(declining.impressions))} impressions`,
      page: String(declining.page),
    });
  }

  const lowCtr = pages
    .filter((row) => num(row.impressions) >= 100 && num(row.position) > 0 && num(row.position) <= 10 && num(row.ctr) < 0.02)
    .sort((a, b) => num(b.impressions) - num(a.impressions))[0];

  if (lowCtr) {
    priorities.push({
      severity: "high",
      title: `Καλή ορατότητα αλλά χαμηλά clicks στη ${shortPath(String(lowCtr.page))}`,
      explanation: "Η Google εμφανίζει συχνά τη σελίδα και η μέση θέση είναι ήδη στην πρώτη σελίδα, αλλά σχετικά λίγοι χρήστες κάνουν click. Αυτό είναι κυρίως θέμα snippet και πρόθεσης αναζήτησης.",
      action: "Βελτιώνουμε πρώτα title και meta description ώστε να ταιριάζουν στις queries που ήδη φέρνουν impressions. Μετά ελέγχουμε αν το περιεχόμενο της σελίδας απαντά ακριβώς σε αυτές τις αναζητήσεις.",
      evidence: `${Math.round(num(lowCtr.impressions))} impressions · CTR ${(num(lowCtr.ctr) * 100).toFixed(2)}% · θέση ${num(lowCtr.position).toFixed(1)}`,
      page: String(lowCtr.page),
    });
  }

  const opportunity = (opportunityRows as any[])
    .filter((row) => num(row.position) >= 4 && num(row.position) <= 15)
    .sort((a, b) => num(b.impressions) - num(a.impressions))[0];

  if (opportunity) {
    priorities.push({
      severity: "medium",
      title: `Ευκαιρία ανόδου για “${String(opportunity.query)}”`,
      explanation: "Η συγκεκριμένη αναζήτηση έχει ήδη ζήτηση και η σελίδα βρίσκεται κοντά στις κορυφαίες θέσεις. Συνήθως εδώ αξίζει περισσότερο να ενισχύσουμε υπάρχουσα σελίδα παρά να δημιουργήσουμε καινούργια.",
      action: "Ενισχύουμε τη σχετική ενότητα της σελίδας, το H1/H2 όπου χρειάζεται, τα εσωτερικά links και τη σαφή απάντηση στην πρόθεση της query. Μετά μετράμε την αλλαγή για 2–4 εβδομάδες.",
      evidence: `${Math.round(num(opportunity.impressions))} impressions · ${Math.round(num(opportunity.clicks))} clicks · θέση ${num(opportunity.position).toFixed(1)}`,
      page: String(opportunity.page),
      query: String(opportunity.query),
    });
  }

  if (ctrChange <= -20 && current.impressions >= 100) {
    priorities.push({
      severity: "medium",
      title: "Το συνολικό CTR υποχώρησε",
      explanation: "Οι εμφανίσεις δεν μετατρέπονται σε clicks τόσο αποτελεσματικά όσο στην προηγούμενη περίοδο. Αυτό μπορεί να οφείλεται σε χαμηλότερες θέσεις, διαφορετικό mix queries ή λιγότερο ελκυστικά snippets.",
      action: "Δίνουμε προτεραιότητα στις σελίδες με πολλές εμφανίσεις και θέση 1–10 αλλά χαμηλό CTR. Δεν αλλάζουμε μαζικά όλα τα titles μαζί.",
      evidence: `CTR ${fmtPct(ctrChange)} έναντι προηγούμενων 28 ημερών`,
    });
  }

  if (priorities.length === 0) {
    priorities.push({
      severity: "low",
      title: "Δεν εμφανίζεται αυτή τη στιγμή κάποια καθαρή επείγουσα SEO βλάβη",
      explanation: "Τα διαθέσιμα δεδομένα δεν δείχνουν μεγάλη πτώση ή προφανή χαμένη ευκαιρία με αρκετό όγκο ώστε να δικαιολογεί βιαστική αλλαγή.",
      action: "Συνεχίζουμε με στοχευμένες βελτιώσεις στις queries που βρίσκονται κοντά στην πρώτη σελίδα και παρακολουθούμε τις μεταβολές ανά 28 ημέρες.",
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
    summary = "Το τελευταίο Search Console sync δεν ολοκληρώθηκε επιτυχώς, επομένως δεν πρέπει να πάρουμε SEO απόφαση μέχρι να αποκατασταθεί η ροή δεδομένων.";
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
    summary += " Το sync ολοκληρώθηκε, αλλά υπάρχουν προειδοποιήσεις για προαιρετικά datasets που πρέπει να έχουμε υπόψη στην ανάλυση.";
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
    changes: { clicks: clickChange, impressions: impressionChange, ctr: ctrChange, position: positionChange },
    sync,
  };
}

import { neon } from "@neondatabase/serverless";
import { getSeoAdvisorData, type SeoPriority } from "@/lib/gsc/advisor";
import { ensureGscTables } from "@/lib/gsc/store";

const DEFAULT_SITE = "sc-domain:chioshotel.gr";

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

function getSeason(latestDate: string) {
  const month = Number(latestDate.slice(5, 7));

  if (month >= 6 && month <= 8) {
    return {
      phase: "peak" as const,
      label: "Peak season",
      note: "Ιούνιος–Αύγουστος: είμαστε στην υψηλή ζήτηση, οπότε οι πραγματικές απώλειες ranking και CTR παραμένουν σημαντικά signals.",
    };
  }

  if (month >= 9 && month <= 10) {
    return {
      phase: "cooldown" as const,
      label: "Φυσική αποκλιμάκωση σεζόν",
      note: "Σεπτέμβριος–Οκτώβριος: η πτώση έναντι των αμέσως προηγούμενων 28 ημερών μπορεί να είναι εποχική, γι’ αυτό ελέγχουμε πρώτα το ίδιο περσινό διάστημα.",
    };
  }

  if (month >= 11 || month <= 3) {
    return {
      phase: "off-season" as const,
      label: "Off-season",
      note: "Νοέμβριος–Μάρτιος: χαμηλότερη ζήτηση είναι αναμενόμενη και δεν τη χαρακτηρίζουμε SEO βλάβη χωρίς επιβεβαίωση από YoY, ranking και CTR.",
    };
  }

  return {
    phase: "ramp-up" as const,
    label: "Άνοδος σεζόν",
    note: "Απρίλιος–Μάιος: η ζήτηση ανεβαίνει και συγκρίνουμε ταυτόχρονα το πρόσφατο trend και το ίδιο περσινό διάστημα.",
  };
}

export async function getSeasonAwareSeoAdvisorData(siteUrl = DEFAULT_SITE) {
  await ensureGscTables();
  const base = (await getSeoAdvisorData(siteUrl)) as any;

  if (!base.latestDate || !base.current || !("changes" in base)) {
    return {
      ...base,
      yearAgo: null,
      yearOverYear: null,
      seasonality: null,
    };
  }

  const sql = getSql();
  const rows = await sql`
    with bounds as (select ${String(base.latestDate)}::date as latest), period as (
      select
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        sum(position * impressions)::double precision as position_weight,
        count(distinct date)::int as days
      from gsc_search_analytics, bounds
      where site_url = ${siteUrl}
        and search_type = 'web'
        and grain = 'daily'
        and is_incomplete = false
        and date between (latest - interval '1 year' - interval '27 days')::date
                     and (latest - interval '1 year')::date
    )
    select
      coalesce(clicks, 0)::double precision as clicks,
      coalesce(impressions, 0)::double precision as impressions,
      case when impressions > 0 then clicks / impressions else 0 end::double precision as ctr,
      case when impressions > 0 then position_weight / impressions else 0 end::double precision as position,
      coalesce(days, 0)::int as days
    from period
  `;

  const row = (rows as any[])?.[0] || {};
  const yearAgo = {
    clicks: num(row.clicks),
    impressions: num(row.impressions),
    ctr: num(row.ctr),
    position: num(row.position),
  };
  const yearAgoDays = num(row.days);
  const yearAgoAvailable = yearAgoDays >= 20 && yearAgo.impressions > 0;
  const yearOverYear = yearAgoAvailable
    ? {
        clicks: pctChange(base.current.clicks, yearAgo.clicks),
        impressions: pctChange(base.current.impressions, yearAgo.impressions),
        ctr: pctChange(base.current.ctr, yearAgo.ctr),
        position:
          base.current.position > 0 && yearAgo.position > 0
            ? base.current.position - yearAgo.position
            : 0,
      }
    : null;

  const seasonality = {
    ...getSeason(String(base.latestDate)),
    yearAgoAvailable,
    yearAgoDays,
  };

  let status = base.status;
  let statusTone = base.statusTone;
  let summary = base.summary;
  let priorities = [...(base.priorities as SeoPriority[])];

  if (yearAgoAvailable && yearOverYear) {
    const yoyHealthy =
      (yearOverYear.clicks >= -15 || yearOverYear.impressions >= -15) &&
      yearOverYear.position <= 1.5;
    const seasonalWindow =
      seasonality.phase === "cooldown" || seasonality.phase === "off-season";

    if (
      base.sync?.status === "success" &&
      seasonalWindow &&
      num(base.changes.clicks) <= -20 &&
      yoyHealthy
    ) {
      status = "Εποχική μεταβολή — όχι SEO alarm";
      statusTone = "neutral";
      summary = `Τα clicks είναι ${fmtPct(base.changes.clicks)} έναντι των προηγούμενων 28 ημερών, αλλά ${fmtPct(yearOverYear.clicks)} έναντι του ίδιου περσινού 28ημέρου και οι εμφανίσεις ${fmtPct(yearOverYear.impressions)}. Με σχετικά σταθερή θέση, η πτώση αντιμετωπίζεται πρώτα ως εποχικότητα και όχι ως SEO βλάβη. ${seasonality.note}`;

      priorities = priorities.map((item) => {
        if (
          item.severity !== "high" ||
          !item.title.startsWith("Έπεσε αισθητά η σελίδα")
        ) {
          return item;
        }

        return {
          ...item,
          severity: "medium" as const,
          diagnosis: `${item.diagnosis || ""} Το site συνολικά παραμένει κοντά ή καλύτερα από το ίδιο περσινό διάστημα, άρα στην τρέχουσα εποχική φάση δεν θεωρούμε την 28ήμερη πτώση από μόνη της επαρκή απόδειξη SEO βλάβης.`.trim(),
          action:
            "Παρακολουθούμε τη σελίδα εβδομαδιαία και ελέγχουμε ranking, CTR και το ίδιο περσινό διάστημα πριν κάνουμε αλλαγή. Επεμβαίνουμε μόνο αν η αδυναμία επιβεβαιώνεται και πέρα από τη φυσική εποχικότητα.",
          evidence: `${item.evidence} · site YoY clicks ${fmtPct(yearOverYear.clicks)} · site YoY impressions ${fmtPct(yearOverYear.impressions)}`,
        };
      });
    } else {
      summary += ` Ίδιο 28ήμερο πέρυσι: clicks ${fmtPct(yearOverYear.clicks)}, impressions ${fmtPct(yearOverYear.impressions)}, μεταβολή μέσης θέσης ${yearOverYear.position >= 0 ? "+" : ""}${yearOverYear.position.toFixed(1)}.`;
    }
  } else {
    summary += ` ${seasonality.note} Δεν υπάρχουν ακόμη τουλάχιστον 20 ημέρες YoY δεδομένων στο Neon, οπότε οι εποχικές προειδοποιήσεις μένουν συντηρητικές μέχρι να συμπληρωθεί η περσινή περίοδος.`;
  }

  return {
    ...base,
    status,
    statusTone,
    summary,
    priorities,
    yearAgo: yearAgoAvailable ? yearAgo : null,
    yearOverYear,
    seasonality,
  };
}

import { type SeoPriority } from "@/lib/gsc/advisor";
import { getSeasonAwareSeoAdvisorData } from "@/lib/gsc/advisor-seasonality";
import { getGa4SeoContext } from "@/lib/ga4/context";
import {
  getSeoAuditOwnerSummary,
  getSeoIntentMatch,
  type SeoIntentMatch,
} from "@/lib/seo/intent-registry";

export type SeoAdvisorPriority = SeoPriority & {
  intent?: {
    audit: number;
    auditLabel: string;
    targetLabel: string;
    ownerPath: string;
    pagePath: string;
    isOwner: boolean;
    matchedBy: "query" | "page";
  };
};

function intentContext(match: SeoIntentMatch) {
  return {
    audit: match.audit,
    auditLabel: match.auditLabel,
    targetLabel: match.target.label,
    ownerPath: match.ownerPath,
    pagePath: match.pagePath,
    isOwner: match.isOwner,
    matchedBy: match.matchedBy,
  } as const;
}

function resolveIntent(item: SeoPriority) {
  const direct = getSeoIntentMatch(item.query, item.page);
  if (!item.query || !item.page) return direct;

  const query = item.query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US");

  const hasDealsSignal = /(deal|offer|package|προσφορ|πακετ|offre|forfait|angebot|aktion|offert|pacchett|oferta|paquete|firsat|paket)/.test(query);
  const hasBookingSignal = /(rate|price|book|booking|reservation|κρατη|τιμ|tarif|preis|buch|prezz|prenot|precio|reserva|rezervasyon|fiyat)/.test(query);

  if (hasDealsSignal) {
    return getSeoIntentMatch("chios accommodation deals", item.page) || direct;
  }

  if (hasBookingSignal) {
    return getSeoIntentMatch("chios direct booking", item.page) || direct;
  }

  return direct;
}

function enrichPriority(item: SeoPriority): SeoAdvisorPriority {
  const match = resolveIntent(item);
  if (!match) return item;

  const ownerSentence = match.isOwner
    ? `Το intent ανήκει ήδη στη σωστή owner σελίδα ${match.ownerPath}. Δεν δημιουργούμε δεύτερη landing για το ίδιο intent.`
    : `Το query αντιστοιχεί στο Audit #${match.audit}, αλλά η σελίδα που εμφανίζεται (${match.pagePath}) δεν είναι ο καθορισμένος owner. Ο owner είναι ${match.ownerPath}. Αυτό είναι πιθανό σήμα intent drift ή cannibalisation και όχι λόγος για νέα landing.`;

  const action = match.isOwner
    ? `${item.action} Guardrail: διατηρούμε το ${match.ownerPath} ως μοναδικό owner για «${match.target.label}» και αποφεύγουμε δεύτερη σελίδα με ίδιο primary intent.`
    : `Πρώτα ενισχύουμε τον καθορισμένο owner ${match.ownerPath} για «${match.target.label}»: σχετικό H1/H2 όπου χρειάζεται, σαφή απάντηση στο intent και internal links από τη σελίδα που σήμερα εμφανίζεται. Στη μη-owner σελίδα μειώνουμε exact-match στόχευση μόνο αν επιβεβαιώνεται επικάλυψη. Δεν δημιουργούμε νέο URL. Μετά μετράμε ξανά πριν από άλλη αλλαγή.`;

  return {
    ...item,
    diagnosis: item.diagnosis
      ? `${item.diagnosis} ${ownerSentence}`
      : ownerSentence,
    action,
    intent: intentContext(match),
  };
}

function fmt(value: number, digits = 0) {
  return new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(value);
}

function ga4Summary(analytics: Awaited<ReturnType<typeof getGa4SeoContext>>) {
  if (!analytics.site || !analytics.latestDate) return "GA4 Organic Search: δεν υπάρχουν ακόμη συγχρονισμένα δεδομένα.";
  const current = analytics.site.current;
  const changes = analytics.site.changes;
  return [
    `GA4 Organic Search έως ${analytics.latestDate}: ${fmt(current.sessions)} sessions (${changes.sessions >= 0 ? "+" : ""}${fmt(changes.sessions, 1)}% vs προηγούμενες 28 ημέρες)`,
    `engagement ${fmt(current.engagementRate * 100, 1)}%`,
    `key events ${fmt(current.keyEvents, 1)}`,
    `session key-event rate ${fmt(current.sessionKeyEventRate * 100, 1)}%.`,
    "Τα GA4 sessions χρησιμοποιούνται ως post-click quality signal και δεν συγκρίνονται 1:1 με τα GSC clicks.",
  ].join(" · ");
}

export async function getSeoAdvisorWithIntentData() {
  const [data, analytics] = await Promise.all([
    getSeasonAwareSeoAdvisorData(),
    getGa4SeoContext(),
  ]);

  return {
    ...data,
    summary: `${data.summary} ${ga4Summary(analytics)}`.trim(),
    analytics,
    // compactAdvisorData already forwards seasonality to the decision model, so
    // GA4 is included there as a corroborating post-click signal without changing
    // the existing GSC decision contract.
    seasonality: {
      ...(data.seasonality || {}),
      ga4: analytics,
    },
    priorities: data.priorities.map(enrichPriority),
    architecture: getSeoAuditOwnerSummary("el"),
    architectureNote:
      "Τα #1–#9 είναι το ενεργό commercial intent map για EN / EL / FR / DE / IT / ES / TR. Το #5 έχει δύο transactional owners (direct booking και deals). Το #9 μοιράζεται σκόπιμα τον owner του #1. Ο Advisor συνδυάζει πλέον GSC visibility/ranking signals με GA4 Organic Search post-click signals (sessions, engagement και key events), μαζί με τις τελευταίες 28 ημέρες, τις προηγούμενες 28 και το ίδιο περσινό διάστημα όπου υπάρχει, ώστε να μη βαφτίζει τη φυσική εποχικότητα ή μια απλή μεταβολή traffic SEO βλάβη. GSC clicks και GA4 sessions δεν θεωρούνται ισοδύναμα counts. Νέα landing δημιουργείται μόνο όταν ένα νέο intent δεν καλύπτεται ήδη από αυτόν τον χάρτη και τα δεδομένα το δικαιολογούν.",
  };
}

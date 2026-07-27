import { getSeoAdvisorData, type SeoPriority } from "@/lib/gsc/advisor";
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

function enrichPriority(item: SeoPriority): SeoAdvisorPriority {
  const match = getSeoIntentMatch(item.query, item.page);
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

export async function getSeoAdvisorWithIntentData() {
  const data = await getSeoAdvisorData();

  return {
    ...data,
    priorities: data.priorities.map(enrichPriority),
    architecture: getSeoAuditOwnerSummary("el"),
    architectureNote:
      "Τα #1–#9 είναι το ενεργό commercial intent map για EN / EL / FR / DE / IT / ES / TR. Το #5 έχει δύο transactional owners (direct booking και deals). Το #9 μοιράζεται σκόπιμα τον owner του #1. Νέα landing δημιουργείται μόνο όταν ένα νέο intent δεν καλύπτεται ήδη από αυτόν τον χάρτη και τα GSC δεδομένα το δικαιολογούν.",
  };
}

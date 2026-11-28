import "server-only";
import { neon } from "@neondatabase/serverless";
import { BULK_LANGUAGES, getBulkStatus, type BulkStatus } from "@/lib/crm/bulk-email";
import { cleanContent, getCampaign, toCampaign } from "@/lib/crm/campaigns";
import type { Campaign, CampaignContent, CampaignOffer, CampaignText } from "@/lib/crm/campaign-templates";
import { dateLabel, SITE_URL, type EmailLanguage, type OfferEmailBlock } from "@/lib/crm/email-design";
import { offerShareLink, roomDefaults, translationFor } from "@/lib/offers/catalog";
import { getPlanDeals } from "@/lib/offers/plan-deals";
import { listAllOffers } from "@/lib/offers/store";
import { isOfferLive } from "@/lib/offers/types";
import { listLivePlanOffers } from "@/lib/pyrgos/plan-offers";

// Offer campaigns (owner, 2026-11-28): every offer on /staff/offers — the catalog
// offers and the room offers from the plan — can be emailed to chosen groups
// (Τούρκοι = tr, Έλληνες = el, Υπόλοιποι = en). The email is written automatically
// from the offer in each group's language; staff can edit it before sending.
// Plan offers: the button opens the owner's WhatsApp (as on the deals page).
// Catalog offers: the button opens the offer on the deals page (with UTM tags).

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

export type OfferKind = "plan" | "catalog";
export const offerKey = (kind: OfferKind, id: string | number) => `${kind}:${id}`;

export function parseOfferKey(value: unknown): { kind: OfferKind; id: string } | null {
  const match = /^(plan|catalog):([A-Za-z0-9-]{1,40})$/.exec(String(value ?? ""));
  return match ? { kind: match[1] as OfferKind, id: match[2] } : null;
}

const absolute = (src: string) => (/^https:\/\//i.test(src) ? src : `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`);

const WORDS: Record<EmailLanguage, {
  room: string; dates: string; price: string; perNight: string; code: string; validUntil: string;
  night: (n: number) => string;
}> = {
  el: { room: "Δωμάτιο", dates: "Ημερομηνίες", price: "Τιμή με την έκπτωση", perNight: "/ νύχτα", code: "Κωδικός", validUntil: "Ισχύει έως", night: (n) => `${n} ${n === 1 ? "νύχτα" : "νύχτες"}` },
  en: { room: "Room", dates: "Dates", price: "Price with the discount", perNight: "/ night", code: "Code", validUntil: "Valid until", night: (n) => `${n} ${n === 1 ? "night" : "nights"}` },
  tr: { room: "Oda", dates: "Tarihler", price: "İndirimli fiyat", perNight: "/ gece", code: "Kod", validUntil: "Son geçerlilik", night: (n) => `${n} gece` },
};

const badge = (language: EmailLanguage, discount: number) => (language === "tr" ? `%${discount} indirim` : `−${discount}%`);

function planTexts(language: EmailLanguage, title: string, dates: string, discount: number): Omit<CampaignText, "buttonUrl"> {
  if (language === "el") {
    return {
      subject: `−${discount}% στο ${title} · ${dates}`,
      heading: `Ειδική προσφορά για εσάς: ${title}`,
      body: `Άνοιξαν μερικές νύχτες στο Voulamandis House, στον Κάμπο της Χίου, και σας τις προσφέρουμε με έκπτωση ${discount}%.\n\nΣτείλτε μας μήνυμα στο WhatsApp με τον κωδικό και θα σας επιβεβαιώσουμε αμέσως τη διαθεσιμότητα. Η προσφορά ισχύει μέχρι να κλειστούν αυτές οι νύχτες.`,
      buttonLabel: "Κλείστε στο WhatsApp",
    };
  }
  if (language === "tr") {
    return {
      subject: `%${discount} indirim: ${title} · ${dates}`,
      heading: `Size özel bir fırsat: ${title}`,
      body: `Sakız Adası'nın Kambos bölgesindeki Voulamandis House'ta birkaç gece boşaldı ve bu geceleri size %${discount} indirimle sunuyoruz.\n\nKodu belirterek bize WhatsApp'tan yazın, müsaitliği hemen teyit edelim. Fırsat, bu geceler dolana kadar geçerlidir.`,
      buttonLabel: "WhatsApp'tan rezervasyon yapın",
    };
  }
  return {
    subject: `${discount}% off: ${title} · ${dates}`,
    heading: `A special offer for you: ${title}`,
    body: `A few nights have opened up at Voulamandis House in Kambos, Chios, and we are offering them to you at ${discount}% off.\n\nSend us a WhatsApp message with the code and we will confirm availability right away. The offer lasts until these nights are booked.`,
    buttonLabel: "Book on WhatsApp",
  };
}

function catalogTexts(language: EmailLanguage, title: string, description: string, discountLabel: string, code: string): Omit<CampaignText, "buttonUrl"> {
  const label = discountLabel.trim();
  if (language === "el") {
    return {
      subject: label ? `${label}: ${title}` : `Προσφορά: ${title}`,
      heading: title,
      body: `${description.trim()}\n\nΚλείστε απευθείας από το site μας με τον κωδικό ${code} και κερδίζετε την καλύτερη τιμή.`,
      buttonLabel: "Δείτε την προσφορά",
    };
  }
  if (language === "tr") {
    return {
      subject: label ? `${label}: ${title}` : `Fırsat: ${title}`,
      heading: title,
      body: `${description.trim()}\n\n${code} koduyla doğrudan web sitemizden rezervasyon yapın, en iyi fiyatı yakalayın.`,
      buttonLabel: "Fırsatı inceleyin",
    };
  }
  return {
    subject: label ? `${label}: ${title}` : `Offer: ${title}`,
    heading: title,
    body: `${description.trim()}\n\nBook directly on our website with the code ${code} for the best price.`,
    buttonLabel: "See the offer",
  };
}

export type OfferDraft = { title: string; image: string; content: CampaignContent; offer: CampaignOffer; live: boolean };

/** Builds the email for an offer in el / en / tr, straight from the offer. Null if the offer is gone. */
export async function buildOfferDraft(kind: OfferKind, id: string): Promise<OfferDraft | null> {
  const content: CampaignContent = {};
  const blocks: CampaignOffer["blocks"] = {};

  if (kind === "plan") {
    const byLanguage = await Promise.all(BULK_LANGUAGES.map(async (language) => [language, (await getPlanDeals(language)).find((deal) => deal.id === `room-${id}`)] as const));
    const greek = byLanguage.find(([language]) => language === "el")?.[1];
    if (!greek) return null;
    for (const [language, deal] of byLanguage) {
      if (!deal) continue;
      const words = WORDS[language];
      const dates = `${dateLabel(deal.from, language)} – ${dateLabel(deal.to, language)}`;
      content[language] = { ...planTexts(language, deal.title, dates, deal.discount), buttonUrl: deal.whatsappHref };
      blocks[language] = {
        badge: badge(language, deal.discount),
        rows: [
          { label: words.room, value: `${deal.room} · ${deal.title}` },
          { label: words.dates, value: `${dates} · ${words.night(deal.nights)}` },
        ],
        price: deal.dealNightPrice !== null && deal.nightPrice !== null
          ? { label: words.price, old: `€${deal.nightPrice}`, now: `€${deal.dealNightPrice}`, unit: words.perNight }
          : null,
        code: { label: words.code, value: deal.code },
      };
    }
    return {
      title: `Πλάνο · Δωμάτιο ${greek.room} · ${greek.from} → ${greek.to} · −${greek.discount}%`,
      image: absolute(greek.image),
      content: cleanContent(content),
      offer: { blocks },
      live: true,
    };
  }

  const stored = (await listAllOffers()).find((offer) => String(offer.id) === id);
  if (!stored) return null;
  for (const language of BULK_LANGUAGES) {
    const text = translationFor(stored, language);
    if (!text) continue;
    const words = WORDS[language];
    content[language] = {
      ...catalogTexts(language, text.title, text.description, text.discountLabel, stored.couponCode),
      buttonUrl: offerShareLink(stored.slug, language),
    };
    const rows = [{ label: words.room, value: text.title }];
    if (stored.validUntil) rows.push({ label: words.validUntil, value: dateLabel(stored.validUntil.slice(0, 10), language) });
    blocks[language] = {
      badge: text.discountLabel.trim() || words.code,
      rows,
      price: null,
      code: stored.couponCode ? { label: words.code, value: stored.couponCode } : null,
    };
  }
  const greekTitle = translationFor(stored, "el")?.title ?? stored.slug;
  return {
    title: `Προσφορά · ${greekTitle}`,
    image: absolute(stored.image || roomDefaults(stored.roomKey, "el").image),
    content: cleanContent(content),
    offer: { blocks },
    live: isOfferLive(stored),
  };
}

/** Is the offer still on the website? (Plan offers vanish once any night is booked.) Throws on a database error. */
export async function isOfferStillLive(key: string) {
  const parsed = parseOfferKey(key);
  if (!parsed) return true;
  if (parsed.kind === "plan") return (await listLivePlanOffers()).some((offer) => String(offer.id) === parsed.id);
  const stored = (await listAllOffers()).find((offer) => String(offer.id) === parsed.id);
  return Boolean(stored && isOfferLive(stored));
}

const CAMPAIGN_COLUMNS = `id, title, image, content, offer_key, offer, send_state, send_languages, send_note,
  to_char(updated_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as updated_at`;

export async function findOfferCampaign(key: string): Promise<Campaign | null> {
  const rows = (await getSql().query(`select ${CAMPAIGN_COLUMNS} from public.crm_campaigns where offer_key = $1`, [key])) as any[];
  return rows[0] ? toCampaign(rows[0]) : null;
}

/** The saved campaign of an offer, or a fresh draft (not saved yet). */
export async function getOfferCampaign(kind: OfferKind, id: string) {
  const key = offerKey(kind, id);
  const [saved, draft] = await Promise.all([findOfferCampaign(key), buildOfferDraft(kind, id)]);
  if (!saved && !draft) return null;
  const campaign: Campaign = saved ?? {
    id: 0, title: draft!.title, image: draft!.image, content: draft!.content, updatedAt: "",
    offerKey: key, offer: draft!.offer, sendState: "draft", sendLanguages: [], sendNote: null,
  };
  const status = saved ? await getBulkStatus(`campaign:${saved.id}:`) : await getBulkStatus("campaign:new:");
  return { campaign, status, live: draft?.live ?? false };
}

/** Saves the staff text; the offer card is refreshed from the offer every time. */
export async function saveOfferCampaign(kind: OfferKind, id: string, content: CampaignContent): Promise<Campaign> {
  const key = offerKey(kind, id);
  const draft = await buildOfferDraft(kind, id);
  const existing = await findOfferCampaign(key);
  if (!draft && !existing) throw new Error("Η προσφορά δεν υπάρχει πια στο site.");
  const sql = getSql();
  const clean = JSON.stringify(cleanContent(content));
  const offer = JSON.stringify(draft?.offer ?? existing?.offer ?? { blocks: {} });
  if (existing) {
    await sql`update public.crm_campaigns set content = ${clean}::jsonb, offer = ${offer}::jsonb,
      image = ${draft?.image ?? existing.image}, updated_at = now() where id = ${existing.id}`;
  } else {
    await sql`insert into public.crm_campaigns (title, image, content, offer_key, offer)
      values (${draft!.title}, ${draft!.image}, ${clean}::jsonb, ${key}, ${offer}::jsonb)`;
  }
  return (await findOfferCampaign(key))!;
}

/** Starts (or resumes) the slow background send to the chosen groups. */
export async function startOfferCampaign(campaignId: number, languages: EmailLanguage[]) {
  const campaign = await getCampaign(campaignId);
  if (!campaign) throw new Error("Η καμπάνια δεν βρέθηκε.");
  if (campaign.offerKey && !(await isOfferStillLive(campaign.offerKey))) throw new Error("Η προσφορά δεν είναι πια live στο site.");
  const ready = languages.filter((language) => campaign.content[language]?.subject.trim() && campaign.content[language]?.body.trim());
  if (!ready.length) throw new Error("Διάλεξε τουλάχιστον μία ομάδα με κείμενο.");
  await getSql()`update public.crm_campaigns set send_state = 'sending', send_languages = ${ready}::text[], send_note = null,
    send_started_at = coalesce(send_started_at, now()), updated_at = now() where id = ${campaignId}`;
}

export async function setOfferCampaignState(campaignId: number, state: "paused" | "sending") {
  await getSql()`update public.crm_campaigns set send_state = ${state}, send_note = null, updated_at = now()
    where id = ${campaignId} and send_state in ('sending', 'paused')`;
}

export type OfferCampaignSummary = { id: number; state: string; note: string | null; languages: EmailLanguage[]; status: BulkStatus | null };

/** One line per offer on /staff/offers: has it been emailed, to whom, how far along. */
export async function listOfferCampaignSummaries(): Promise<Record<string, OfferCampaignSummary>> {
  const rows = (await getSql().query(`select ${CAMPAIGN_COLUMNS} from public.crm_campaigns where offer_key is not null`)) as any[];
  const campaigns = rows.map(toCampaign);
  const started = campaigns.filter((campaign) => campaign.sendState !== "draft");
  const statuses = await Promise.all(started.map((campaign) => getBulkStatus(`campaign:${campaign.id}:`)));
  const statusById = new Map(started.map((campaign, index) => [campaign.id, statuses[index]]));
  return Object.fromEntries(campaigns.map((campaign) => [campaign.offerKey!, {
    id: campaign.id,
    state: campaign.sendState ?? "draft",
    note: campaign.sendNote ?? null,
    languages: campaign.sendLanguages ?? [],
    status: statusById.get(campaign.id) ?? null,
  }]));
}

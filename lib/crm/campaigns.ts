import "server-only";
import { neon } from "@neondatabase/serverless";
import { BULK_LANGUAGES, getBulkStatus, sendBulkBatch, unsubscribeUrl, type BulkStatus } from "@/lib/crm/bulk-email";
import { buildCampaignEmail, isCampaignReady, type Campaign, type CampaignContent, type CampaignText } from "@/lib/crm/campaign-templates";
import { deliverEmail } from "@/lib/crm/guest-emails";
import type { EmailLanguage } from "@/lib/crm/email-design";
import { normalizeEmail } from "@/lib/crm/store";

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

const keyPrefix = (id: number) => `campaign:${id}:`;

function cleanText(value: unknown): CampaignText {
  const source = (value ?? {}) as Record<string, unknown>;
  const field = (key: keyof CampaignText, max: number) => String(source[key] ?? "").slice(0, max);
  return { subject: field("subject", 200), heading: field("heading", 200), body: field("body", 8000), buttonLabel: field("buttonLabel", 80), buttonUrl: field("buttonUrl", 500) };
}

export function cleanContent(value: unknown): CampaignContent {
  const source = (value ?? {}) as Record<string, unknown>;
  return Object.fromEntries(BULK_LANGUAGES.map((language) => [language, cleanText(source[language])])) as CampaignContent;
}

const SEND_STATES = new Set(["draft", "sending", "paused", "done", "stopped"]);

export const toCampaign = (row: any): Campaign => ({
  id: Number(row.id),
  title: row.title,
  image: row.image ?? "",
  content: cleanContent(row.content),
  updatedAt: row.updated_at,
  offerKey: row.offer_key ?? null,
  offer: row.offer && typeof row.offer === "object" ? row.offer : null,
  sendState: SEND_STATES.has(row.send_state) ? row.send_state : "draft",
  sendLanguages: (row.send_languages ?? []).filter((language: string) => BULK_LANGUAGES.includes(language as EmailLanguage)),
  sendNote: row.send_note ?? null,
});

export async function listCampaigns(): Promise<(Campaign & { sent: number })[]> {
  const sql = getSql();
  const rows = (await sql`
    select c.id, c.title, c.image, c.content, to_char(c.updated_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as updated_at,
      (select count(*)::int from public.crm_email_log l where l.email_type = 'campaign_' || c.id and l.status = 'sent') as sent
    from public.crm_campaigns c order by c.created_at desc limit 50
  `) as any[];
  return rows.map((row) => ({ ...toCampaign(row), sent: row.sent }));
}

export async function getCampaign(id: number): Promise<Campaign | null> {
  const sql = getSql();
  const [row] = (await sql`select id, title, image, content, offer_key, offer, send_state, send_languages, send_note,
      to_char(updated_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as updated_at
    from public.crm_campaigns where id = ${id}`) as any[];
  return row ? toCampaign(row) : null;
}

export async function saveCampaign(input: { id: number | null; title: string; image: string; content: CampaignContent }) {
  const sql = getSql();
  const content = JSON.stringify(input.content);
  if (input.id) {
    const rows = (await sql`update public.crm_campaigns set title = ${input.title}, image = ${input.image}, content = ${content}::jsonb, updated_at = now()
      where id = ${input.id} returning id`) as any[];
    if (!rows.length) throw new Error("Η καμπάνια δεν βρέθηκε.");
    return input.id;
  }
  const [row] = (await sql`insert into public.crm_campaigns (title, image, content) values (${input.title}, ${input.image}, ${content}::jsonb) returning id`) as any[];
  return Number(row.id);
}

/** Only a campaign nobody has received can be deleted, so the log stays meaningful. */
export async function deleteUnsentCampaign(id: number) {
  const sql = getSql();
  const [row] = (await sql`select count(*)::int as count from public.crm_email_log where email_type = ${`campaign_${id}`}`) as any[];
  if (Number(row?.count ?? 0) > 0) throw new Error("Η καμπάνια έχει ήδη σταλεί και δεν διαγράφεται.");
  await sql`delete from public.crm_campaigns where id = ${id}`;
}

export async function getCampaignStatus(id: number): Promise<BulkStatus> {
  return getBulkStatus(keyPrefix(id));
}

export async function sendCampaignBatch(campaign: Campaign, languages: EmailLanguage[], retryFailed: boolean, limit?: number) {
  const ready = languages.filter((language) => isCampaignReady(campaign.content[language]));
  if (!ready.length) throw new Error("Συμπλήρωσε θέμα και κείμενο στη γλώσσα που θες να στείλεις.");
  return sendBulkBatch({
    prefix: keyPrefix(campaign.id),
    emailType: `campaign_${campaign.id}`,
    languages: ready,
    retryFailed,
    limit,
    build: (recipient, unsubscribe) => buildCampaignEmail(campaign.content[recipient.language] as CampaignText, recipient.language, {
      firstName: recipient.firstName, lastName: recipient.lastName, image: campaign.image, unsubscribeUrl: unsubscribe,
      offer: campaign.offer?.blocks?.[recipient.language] ?? null,
    }),
  });
}

export async function sendCampaignTest(campaign: Campaign, language: EmailLanguage, to: string) {
  const text = campaign.content[language];
  if (!isCampaignReady(text)) throw new Error("Συμπλήρωσε θέμα και κείμενο σε αυτή τη γλώσσα.");
  const email = buildCampaignEmail(text as CampaignText, language, {
    firstName: "Maria", lastName: "Papadopoulou", image: campaign.image, unsubscribeUrl: unsubscribeUrl(normalizeEmail(to), language),
    offer: campaign.offer?.blocks?.[language] ?? null,
  });
  await deliverEmail(to, `[ΔΟΚΙΜΗ] ${email.subject}`, email.html, email.text);
}

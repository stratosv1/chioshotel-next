import "server-only";
import { neon } from "@neondatabase/serverless";
import { sendCampaignBatch, toCampaign } from "@/lib/crm/campaigns";
import { isOfferStillLive } from "@/lib/crm/offer-campaigns";

// Background sender for campaigns (owner, 2026-11-28): emails leave slowly, one
// about every 25 seconds (~140 an hour), within the shared 300-a-day Gmail limit,
// even with the staff page closed. Each run sends for ~40s, then calls the next
// run; a daily Vercel cron picks up whatever the daily limit left for the next day.
// Only one run at a time (lease row). With nothing queued a run is a single read.

const PACE_MS = 25_000;
const LEASE = "75 seconds";

const NOTE_LIMIT = "Έφτασε το ημερήσιο όριο του Gmail. Συνεχίζει μόνο του αύριο το πρωί.";
const NOTE_CLOSED = "Η προσφορά δεν είναι πια live (κλείστηκε ή έληξε), οπότε η αποστολή σταμάτησε.";
const noteFailed = (error: string) => `Μια αποστολή απέτυχε, οπότε έγινε παύση για ασφάλεια. Έλεγξε και πάτα «Συνέχεια». (${error.slice(0, 160)})`;

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type QueueRun = { busy: boolean; sent: number; more: boolean };

export async function runCampaignQueue(budgetMs = 40_000): Promise<QueueRun> {
  const sql = getSql();
  const lease = (await sql.query(
    `update public.crm_campaign_runner set locked_until = now() + interval '${LEASE}'
     where id and locked_until < now()
       and exists (select 1 from public.crm_campaigns where send_state = 'sending')
     returning last_sent_at`,
  )) as { last_sent_at: string }[];
  if (!lease.length) return { busy: false, sent: 0, more: false };

  const started = Date.now();
  let lastSent = new Date(lease[0].last_sent_at).getTime();
  let sent = 0;
  let more = false;
  try {
    for (;;) {
      const wait = lastSent + PACE_MS - Date.now();
      if (wait > 0) {
        if (Date.now() + wait - started > budgetMs) {
          more = true;
          break;
        }
        await sleep(wait);
      }

      const [row] = (await sql`select id, title, image, content, offer_key, offer, send_state, send_languages, send_note, '' as updated_at
        from public.crm_campaigns where send_state = 'sending' order by send_started_at nulls last, id limit 1`) as any[];
      if (!row) break;
      const campaign = toCampaign(row);

      if (campaign.offerKey) {
        const live = await isOfferStillLive(campaign.offerKey).catch(() => true);
        if (!live) {
          await sql`update public.crm_campaigns set send_state = 'stopped', send_note = ${NOTE_CLOSED}, updated_at = now() where id = ${campaign.id}`;
          continue;
        }
      }

      let result;
      try {
        result = await sendCampaignBatch(campaign, campaign.sendLanguages ?? [], false, 1);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Άγνωστο σφάλμα";
        await sql`update public.crm_campaigns set send_state = 'paused', send_note = ${noteFailed(message)}, updated_at = now() where id = ${campaign.id}`;
        continue;
      }

      if (result.sent || result.failed) {
        lastSent = Date.now();
        await sql`update public.crm_campaign_runner set last_sent_at = now() where id`;
      }
      sent += result.sent;

      if (result.failed) {
        const [log] = (await sql`select error from public.crm_email_log where email_type = ${`campaign_${campaign.id}`} and status = 'failed'
          order by created_at desc limit 1`) as any[];
        await sql`update public.crm_campaigns set send_state = 'paused', send_note = ${noteFailed(String(log?.error ?? ""))}, updated_at = now() where id = ${campaign.id}`;
        continue;
      }
      if (result.remaining <= 0) {
        await sql`update public.crm_campaigns set send_state = 'done', send_note = null, updated_at = now() where id = ${campaign.id}`;
        continue;
      }
      if (result.limitReached) {
        await sql`update public.crm_campaigns set send_note = ${NOTE_LIMIT} where send_state = 'sending'`;
        break;
      }
      if (result.sent && campaign.sendNote) await sql`update public.crm_campaigns set send_note = null where id = ${campaign.id}`;
      if (Date.now() - started > budgetMs) {
        more = true;
        break;
      }
    }
  } finally {
    await sql`update public.crm_campaign_runner set locked_until = now() where id`;
  }
  return { busy: true, sent, more };
}

/** Starts the next run without waiting for it (it lives in its own function call). */
export async function kickCampaignQueue(origin: string) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return;
  await fetch(`${origin}/api/cron/campaign-queue/`, {
    headers: { authorization: `Bearer ${secret}` },
    cache: "no-store",
    signal: AbortSignal.timeout(4_000),
  }).catch(() => undefined);
}

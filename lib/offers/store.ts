import "server-only";
import { neon } from "@neondatabase/serverless";
import { buildSeedOffers } from "@/lib/offers/catalog";
import {
  isOfferLanguage,
  isOfferRoomKey,
  type OfferLanguage,
  type OfferTranslation,
  type StoredOffer,
} from "@/lib/offers/types";

type Sql = ReturnType<typeof neon>;

let schemaReady: Promise<void> | null = null;

export function hasOffersDatabase() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function getSql(): Sql {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

async function ensureSchema(sql: Sql) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`create table if not exists site_offers (
        id bigserial primary key,
        slug text not null unique,
        room_key text not null,
        coupon_code text not null default '',
        image text,
        valid_from timestamptz,
        valid_until timestamptz,
        active boolean not null default true,
        sort_order integer not null default 0,
        translations jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )`;
      await sql`create table if not exists newsletter_subscribers (
        id bigserial primary key,
        email text not null unique,
        language text not null default 'en',
        source text,
        offer_slug text,
        consent_text text,
        consent_at timestamptz not null default now(),
        unsubscribed_at timestamptz,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )`;
      // First run: copy the offers that used to be hard-coded on the deals pages.
      const existing = (await sql`select count(*)::int as count from site_offers`) as Array<{ count: number }>;
      if ((existing[0]?.count ?? 0) === 0) {
        for (const offer of buildSeedOffers()) {
          await sql`insert into site_offers (slug, room_key, coupon_code, image, valid_from, valid_until, active, sort_order, translations)
            values (${offer.slug}, ${offer.roomKey}, ${offer.couponCode}, ${offer.image}, ${offer.validFrom}, ${offer.validUntil},
                    ${offer.active}, ${offer.sortOrder}, ${JSON.stringify(offer.translations)}::jsonb)
            on conflict (slug) do nothing`;
        }
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

type OfferRow = {
  id: string;
  slug: string;
  room_key: string;
  coupon_code: string;
  image: string | null;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
  sort_order: number;
  translations: unknown;
  created_at: string;
  updated_at: string;
};

function cleanTranslations(value: unknown): StoredOffer["translations"] {
  const result: StoredOffer["translations"] = {};
  if (!value || typeof value !== "object") return result;
  for (const [language, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!isOfferLanguage(language) || !raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;
    const title = String(item.title ?? "").trim();
    if (!title) continue;
    result[language] = {
      title,
      description: String(item.description ?? "").trim(),
      tip: String(item.tip ?? "").trim(),
      discountLabel: String(item.discountLabel ?? "").trim(),
      tags: Array.isArray(item.tags) ? item.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 6) : [],
    } satisfies OfferTranslation;
  }
  return result;
}

function rowToOffer(row: OfferRow): StoredOffer {
  return {
    id: String(row.id),
    slug: row.slug,
    roomKey: isOfferRoomKey(row.room_key) ? row.room_key : "economy-double",
    couponCode: row.coupon_code,
    image: row.image,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    active: row.active,
    sortOrder: row.sort_order,
    translations: cleanTranslations(row.translations),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listAllOffers(): Promise<StoredOffer[]> {
  const sql = getSql();
  await ensureSchema(sql);
  const rows = (await sql`select id::text, slug, room_key, coupon_code, image,
      to_char(valid_from at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as valid_from, to_char(valid_until at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as valid_until, active, sort_order, translations, created_at::text, updated_at::text
    from site_offers order by sort_order asc, id asc`) as OfferRow[];
  return rows.map(rowToOffer);
}

/** Offers visible to guests right now (active, started, not expired). */
export async function listLiveOffers(): Promise<StoredOffer[]> {
  const sql = getSql();
  await ensureSchema(sql);
  const rows = (await sql`select id::text, slug, room_key, coupon_code, image,
      to_char(valid_from at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as valid_from, to_char(valid_until at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as valid_until, active, sort_order, translations, created_at::text, updated_at::text
    from site_offers
    where active = true
      and (valid_from is null or valid_from <= now())
      and (valid_until is null or valid_until > now())
    order by sort_order asc, id asc`) as OfferRow[];
  return rows.map(rowToOffer);
}

export type OfferInput = Omit<StoredOffer, "id" | "createdAt" | "updatedAt"> & { id?: string };

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function validateOfferInput(raw: unknown): { ok: true; offer: OfferInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Λείπουν τα στοιχεία της προσφοράς." };
  const item = raw as Record<string, unknown>;
  const roomKey = String(item.roomKey ?? "");
  if (!isOfferRoomKey(roomKey)) return { ok: false, error: "Διαλέξτε δωμάτιο." };
  const translations = cleanTranslations(item.translations);
  if (!translations.el) return { ok: false, error: "Συμπληρώστε τουλάχιστον τον ελληνικό τίτλο." };
  if (!translations.en) return { ok: false, error: "Συμπληρώστε και τον αγγλικό τίτλο (χρησιμοποιείται για τις ξένες γλώσσες που λείπουν)." };
  const couponCode = String(item.couponCode ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const slug = slugify(String(item.slug ?? "") || translations.en.title);
  if (!slug) return { ok: false, error: "Μη έγκυρο όνομα link." };
  const toIso = (value: unknown) => {
    const text = String(value ?? "").trim();
    if (!text) return null;
    const date = new Date(text);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  };
  const validFrom = toIso(item.validFrom);
  const validUntil = toIso(item.validUntil);
  if (validFrom && validUntil && new Date(validUntil) <= new Date(validFrom)) {
    return { ok: false, error: "Η λήξη πρέπει να είναι μετά την έναρξη." };
  }
  const image = String(item.image ?? "").trim();
  if (image && !/^(\/images\/|https:\/\/)/.test(image)) return { ok: false, error: "Η φωτογραφία πρέπει να είναι από το site ή https link." };
  return {
    ok: true,
    offer: {
      id: item.id ? String(item.id) : undefined,
      slug,
      roomKey,
      couponCode,
      image: image || null,
      validFrom,
      validUntil,
      active: item.active !== false,
      sortOrder: Number.isFinite(Number(item.sortOrder)) ? Math.trunc(Number(item.sortOrder)) : 0,
      translations,
    },
  };
}

export async function saveOffer(offer: OfferInput): Promise<StoredOffer> {
  const sql = getSql();
  await ensureSchema(sql);
  const translations = JSON.stringify(offer.translations);
  const rows = (offer.id
    ? await sql`update site_offers set slug = ${offer.slug}, room_key = ${offer.roomKey}, coupon_code = ${offer.couponCode},
          image = ${offer.image}, valid_from = ${offer.validFrom}, valid_until = ${offer.validUntil}, active = ${offer.active},
          sort_order = ${offer.sortOrder}, translations = ${translations}::jsonb, updated_at = now()
        where id = ${offer.id}::bigint
        returning id::text, slug, room_key, coupon_code, image, to_char(valid_from at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as valid_from, to_char(valid_until at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as valid_until, active, sort_order, translations, created_at::text, updated_at::text`
    : await sql`insert into site_offers (slug, room_key, coupon_code, image, valid_from, valid_until, active, sort_order, translations)
        values (${offer.slug}, ${offer.roomKey}, ${offer.couponCode}, ${offer.image}, ${offer.validFrom}, ${offer.validUntil},
                ${offer.active}, ${offer.sortOrder}, ${translations}::jsonb)
        returning id::text, slug, room_key, coupon_code, image, to_char(valid_from at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as valid_from, to_char(valid_until at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as valid_until, active, sort_order, translations, created_at::text, updated_at::text`) as OfferRow[];
  if (!rows[0]) throw new Error("Η προσφορά δεν βρέθηκε.");
  return rowToOffer(rows[0]);
}

export async function deleteOffer(id: string) {
  const sql = getSql();
  await ensureSchema(sql);
  await sql`delete from site_offers where id = ${id}::bigint`;
}

export type NewsletterSubscriber = {
  email: string;
  language: string;
  source: string | null;
  offerSlug: string | null;
  consentAt: string;
  unsubscribedAt: string | null;
};

export async function addNewsletterSubscriber(input: {
  email: string;
  language: OfferLanguage;
  source: string | null;
  offerSlug: string | null;
  consentText: string;
}) {
  const sql = getSql();
  await ensureSchema(sql);
  await sql`insert into newsletter_subscribers (email, language, source, offer_slug, consent_text)
    values (${input.email}, ${input.language}, ${input.source}, ${input.offerSlug}, ${input.consentText})
    on conflict (email) do update set language = excluded.language, consent_text = excluded.consent_text,
      consent_at = now(), unsubscribed_at = null, updated_at = now()`;
}

export async function listNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const sql = getSql();
  await ensureSchema(sql);
  const rows = (await sql`select email, language, source, offer_slug, to_char(consent_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as consent_at, to_char(unsubscribed_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as unsubscribed_at
    from newsletter_subscribers order by created_at desc`) as Array<{
    email: string;
    language: string;
    source: string | null;
    offer_slug: string | null;
    consent_at: string;
    unsubscribed_at: string | null;
  }>;
  return rows.map((row) => ({
    email: row.email,
    language: row.language,
    source: row.source,
    offerSlug: row.offer_slug,
    consentAt: row.consent_at,
    unsubscribedAt: row.unsubscribed_at,
  }));
}

export async function unsubscribeNewsletter(email: string) {
  const sql = getSql();
  await ensureSchema(sql);
  await sql`update newsletter_subscribers set unsubscribed_at = now(), updated_at = now() where email = ${email}`;
}

-- Newsletter list and campaigns. Additive only.
-- The contact list itself is read on the fly from beds24_bookings and
-- newsletter_subscribers (site sign-ups + emails added by staff), with the
-- existing crm_guest_overrides / crm_excluded_emails; nothing is copied.

-- Name for emails added by staff (site sign-ups leave it empty).
alter table public.newsletter_subscribers add column if not exists name text;

-- One campaign = the same message written in el / en / tr; sends are logged
-- in crm_email_log like every other email.
create table if not exists public.crm_campaigns (
  id bigserial primary key,
  title text not null,
  image text,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

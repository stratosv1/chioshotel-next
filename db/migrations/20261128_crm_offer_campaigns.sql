-- Offer campaigns (owner, 2026-11-28). Additive only.
-- A campaign can be tied to an offer (catalog offer or a room offer from the plan)
-- and sent in the background, slowly, to chosen groups (tr / el / en).

alter table public.crm_campaigns add column if not exists offer_key text;
alter table public.crm_campaigns add column if not exists offer jsonb;
-- draft | sending | paused | done | stopped
alter table public.crm_campaigns add column if not exists send_state text not null default 'draft';
alter table public.crm_campaigns add column if not exists send_languages text[] not null default '{}'::text[];
alter table public.crm_campaigns add column if not exists send_note text;
alter table public.crm_campaigns add column if not exists send_started_at timestamptz;

create unique index if not exists crm_campaigns_offer_key_idx on public.crm_campaigns (offer_key) where offer_key is not null;

-- One background sender at a time (lease), and the pace between emails.
create table if not exists public.crm_campaign_runner (
  id boolean primary key default true check (id),
  locked_until timestamptz not null default 'epoch',
  last_sent_at timestamptz not null default 'epoch'
);
insert into public.crm_campaign_runner (id) values (true) on conflict (id) do nothing;

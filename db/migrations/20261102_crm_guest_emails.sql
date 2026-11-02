-- Automated guest emails (phase 2). Everything starts OFF and in test mode.
create table if not exists public.crm_email_settings (
  id boolean primary key default true check (id),
  test_mode boolean not null default true,
  test_email text not null default 'evoulamandis@gmail.com',
  enabled_types text[] not null default '{}',
  updated_at timestamptz not null default now()
);
insert into public.crm_email_settings (id) values (true) on conflict (id) do nothing;

-- One row per email actually attempted; the key makes double sends impossible.
create table if not exists public.crm_email_log (
  dedupe_key text primary key,
  booking_id text,
  email_type text not null,
  language text not null,
  recipient text not null,
  guest_email text,
  mode text not null,
  status text not null,
  error text,
  created_at timestamptz not null default now()
);
create index if not exists crm_email_log_created_idx on public.crm_email_log (created_at desc);

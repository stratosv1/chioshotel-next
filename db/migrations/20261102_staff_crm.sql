-- Staff CRM (phase 1). Additive only: guests are derived from beds24_bookings,
-- so there is no guest table to keep in sync and no extra Neon writes.
alter table public.beds24_bookings add column if not exists country text;
alter table public.beds24_bookings add column if not exists phone text;

-- Addresses that must never count as guests (the owner's own / shared inboxes).
create table if not exists public.crm_excluded_emails (
  email text primary key,
  note text,
  created_at timestamptz not null default now()
);

insert into public.crm_excluded_emails (email, note) values
  ('chioshotel@gmail.com', 'Εσωτερικό'),
  ('evoulamandis@gmail.com', 'Εσωτερικό'),
  ('vhouse.reservations@gmail.com', 'Εσωτερικό')
on conflict (email) do nothing;

-- Manual corrections for one guest; these win over Beds24 values.
create table if not exists public.crm_guest_overrides (
  email text primary key,
  country text,
  language text,
  updated_at timestamptz not null default now()
);

-- Real email added by hand for an OTA booking, or the booking ignored.
create table if not exists public.crm_booking_contacts (
  booking_id text primary key,
  real_email text,
  ignored boolean not null default false,
  updated_at timestamptz not null default now()
);

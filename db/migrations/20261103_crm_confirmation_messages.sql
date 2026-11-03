-- Bank details stay in the database: this repository is public.
alter table public.crm_email_settings add column if not exists bank_details jsonb;

-- Guest and staff emails linked to bookings by the Gmail script.
create table if not exists public.crm_guest_messages (
  message_id text primary key,
  booking_ids text[] not null,
  guest_email text,
  direction text not null,
  subject text,
  body text not null,
  summary text,
  sent_at timestamptz not null default now()
);
create index if not exists crm_guest_messages_email_idx on public.crm_guest_messages (guest_email, sent_at desc);
create index if not exists crm_guest_messages_bookings_idx on public.crm_guest_messages using gin (booking_ids);

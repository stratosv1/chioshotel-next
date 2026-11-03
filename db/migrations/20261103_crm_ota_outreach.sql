-- First message to Booking.com / Expedia guests, asking for email and arrival.
alter table public.crm_email_settings add column if not exists ota_outreach_enabled_at timestamptz;

-- source = 'ota_message' marks emails given for the stay only: never for campaigns.
alter table public.crm_booking_contacts add column if not exists source text;

create table if not exists public.crm_ota_outreach (
  booking_id text primary key,
  language text not null,
  status text not null,
  error text,
  created_at timestamptz not null default now()
);

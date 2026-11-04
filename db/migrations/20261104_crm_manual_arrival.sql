-- Arrival details entered by staff; a saved row closes the pending arrival item.
alter table public.crm_booking_contacts add column if not exists arrival_time text;
alter table public.crm_booking_contacts add column if not exists arrival_details text;
alter table public.crm_booking_contacts add column if not exists arrival_saved_at timestamptz;

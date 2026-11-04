-- Shows staff when a guest's real email could not be written to Beds24.
alter table public.crm_booking_contacts add column if not exists beds24_email_error text;

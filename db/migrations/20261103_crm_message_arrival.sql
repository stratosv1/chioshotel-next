-- Arrival time stated in a guest message, for the monthly bookings board.
alter table public.crm_guest_messages add column if not exists arrival_time text;

-- Arrival time stated in a guest message, for the monthly bookings board.
alter table public.crm_guest_messages add column if not exists arrival_time text;

-- Web app URL of the Gmail script, used by the "Έλεγχος" button.
alter table public.crm_email_settings add column if not exists gmail_webapp_url text;

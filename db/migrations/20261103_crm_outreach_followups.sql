-- Follow-ups for guests who have not given a personal email.
alter table public.crm_ota_outreach add column if not exists reminder_at timestamptz;
alter table public.crm_ota_outreach add column if not exists reminder_status text;
alter table public.crm_ota_outreach add column if not exists reminder2_at timestamptz;
alter table public.crm_ota_outreach add column if not exists sms_at timestamptz;

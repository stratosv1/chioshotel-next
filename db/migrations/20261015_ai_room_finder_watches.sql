-- AI Room Finder: "notify me if these dates open up".
-- A guest who finds no availability leaves an email; when live inventory
-- shows rooms for their exact dates and party, they get one email with the
-- direct price. Rows are deleted 60 days after the stay (data minimization).

create table if not exists ai_room_finder_watches (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  session_id text,
  language text not null default 'en',
  email text not null,
  first_name text,
  checkin date not null,
  checkout date not null,
  guest_groups jsonb not null,
  total_guests integer not null,
  -- active → notifying (claimed by one checker) → notified | expired | cancelled
  status text not null default 'active',
  cancel_token text not null unique,
  privacy_accepted_at timestamptz not null,
  last_checked_at timestamptz,
  notified_at timestamptz,
  notified_total numeric(10, 2),
  constraint ai_room_finder_watches_status_check
    check (status in ('active', 'notifying', 'notified', 'expired', 'cancelled')),
  constraint ai_room_finder_watches_dates_check check (checkout > checkin)
);

create index if not exists ai_room_finder_watches_active_idx
  on ai_room_finder_watches (checkin)
  where status = 'active';

create index if not exists ai_room_finder_watches_email_idx
  on ai_room_finder_watches (lower(email), status);

create schema if not exists property_knowledge;

create table if not exists property_knowledge.entries (
  id text primary key,
  category text not null check (category in ('general', 'location', 'rooms', 'booking', 'arrival')),
  scopes text[] not null default array['all']::text[],
  status text not null default 'published' check (status in ('published', 'needs-verification', 'archived')),
  related_link text,
  sort_order integer not null default 0,
  owner_confirmed boolean not null default true,
  source_note text not null default 'Owner-confirmed Voulamandis House knowledge',
  updated_at timestamptz not null default now()
);

create table if not exists property_knowledge.translations (
  entry_id text not null references property_knowledge.entries(id) on delete cascade,
  language text not null check (language in ('en', 'el', 'fr', 'de', 'it', 'es', 'tr')),
  question text not null,
  answer text not null,
  search_terms text[] not null default array[]::text[],
  search_document tsvector generated always as (
    to_tsvector('simple'::regconfig, coalesce(question, '') || ' ' || coalesce(answer, ''))
  ) stored,
  updated_at timestamptz not null default now(),
  primary key (entry_id, language)
);

create index if not exists property_knowledge_entries_public_idx
  on property_knowledge.entries (status, sort_order)
  where owner_confirmed = true;

create index if not exists property_knowledge_translations_search_idx
  on property_knowledge.translations using gin (search_document);

alter table booking_core.room_features
  add column if not exists size_label text,
  add column if not exists outdoor_space text,
  add column if not exists entrance_steps integer not null default 0,
  add column if not exists has_handrail boolean not null default false,
  add column if not exists wheelchair_accessible boolean not null default false,
  add column if not exists kitchen_type text not null default 'mini_fridge_only';

update booking_core.rooms
set
  display_name = case when room_number = 1 then 'Double / Triple Room 1' else display_name end,
  no_stairs = room_number in (5, 6, 7),
  has_balcony = room_number in (4, 8, 9, 10),
  notes = case
    when room_number = 10 then 'Regular capacity 4 guests. A fifth guest is possible only by prior agreement, with an extra single bed in the bedroom and limited space.'
    else notes
  end
where room_number between 1 and 10;

update booking_core.room_features
set
  size_m2 = case
    when room_number in (1, 3, 4, 5, 7) then 32
    when room_number in (2, 6) then 16
    when room_number in (8, 9) then 40
    when room_number = 10 then 45
    else size_m2
  end,
  size_label = case
    when room_number in (1, 3, 4, 5, 7) then 'approximately 30–35 m²'
    when room_number in (2, 6) then 'approximately 16 m²'
    when room_number in (8, 9) then 'approximately 40 m²'
    when room_number = 10 then 'approximately 45 m²'
    else size_label
  end,
  bed_setup = case
    when room_number = 1 then '{"double_bed":1,"single_bed":2}'::jsonb
    when room_number = 2 then '{"double_bed":1}'::jsonb
    when room_number = 3 then '{"double_bed":1,"single_bed":1}'::jsonb
    when room_number = 4 then '{"double_bed":1,"sofa_bed":1}'::jsonb
    when room_number = 5 then '{"double_bed":1,"single_bed":1}'::jsonb
    when room_number = 6 then '{"double_bed":1}'::jsonb
    when room_number = 7 then '{"double_bed":1,"sofa_bed":1}'::jsonb
    when room_number in (8, 9) then '{"double_bed":1,"sofa_bed":2}'::jsonb
    when room_number = 10 then '{"double_bed":1,"double_sofa_bed":1}'::jsonb
    else bed_setup
  end,
  outdoor_space = case
    when room_number in (1, 2, 3) then 'shared_terrace_access'
    when room_number = 4 then 'private_balcony'
    when room_number in (5, 6, 7) then 'direct_courtyard_and_garden_access'
    when room_number in (8, 9, 10) then 'private_balcony_with_orchard_view'
    else outdoor_space
  end,
  entrance_steps = case
    when room_number between 1 and 4 then 14
    when room_number between 8 and 10 then 5
    else 0
  end,
  has_handrail = room_number between 1 and 4 or room_number between 8 and 10,
  wheelchair_accessible = false,
  kitchen_type = case
    when room_number in (3, 4) then 'kitchenette'
    when room_number in (8, 9, 10) then 'full_kitchen'
    else 'mini_fridge_only'
  end,
  source_note = 'Owner-confirmed Voulamandis House room facts, 2026-09-05',
  updated_at = now()
where room_number between 1 and 10;

insert into booking_core.room_common_amenities (amenity_key, label, source_note, updated_at)
values
  ('heating', 'Heating', 'Owner-confirmed common amenity', now()),
  ('hairdryer', 'Hairdryer', 'Owner-confirmed common amenity', now()),
  ('insect_screens', 'Insect screens', 'Owner-confirmed common amenity', now()),
  ('desk_or_table', 'Desk or table', 'Owner-confirmed common amenity', now()),
  ('shower', 'Private bathroom with shower', 'Owner-confirmed common amenity', now())
on conflict (amenity_key) do update set
  label = excluded.label,
  source_note = excluded.source_note,
  updated_at = excluded.updated_at;

update booking_core.room_common_amenities
set label = 'Smart TV', source_note = 'Owner-confirmed common amenity', updated_at = now()
where amenity_key = 'flat_screen_tv';

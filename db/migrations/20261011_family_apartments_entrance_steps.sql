-- Owner correction (2026-10-11): Apartments 8, 9 and 10 are on the ground floor
-- but are reached by 4–5 entrance steps with a handrail. This reverses
-- 20260913_step_free_family_apartments.sql. Only Rooms 5, 6 and 7 have no stairs.
begin;

update booking_core.rooms
set no_stairs = false
where room_number in (8, 9, 10);

update booking_core.room_features
set
  entrance_steps = 5,
  has_handrail = true,
  source_note = 'Owner-confirmed: 4–5 entrance steps with handrail for Apartments 8, 9 and 10, 2026-10-11',
  updated_at = now()
where room_number in (8, 9, 10);

commit;

begin;

update booking_core.rooms
set no_stairs = true
where room_number in (8, 9, 10);

update booking_core.room_features
set
  entrance_steps = 0,
  has_handrail = false,
  source_note = 'Owner-confirmed step-free access for Apartments 8, 9 and 10, 2026-09-13',
  updated_at = now()
where room_number in (8, 9, 10);

commit;

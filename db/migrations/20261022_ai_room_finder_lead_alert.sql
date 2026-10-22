-- Email alert when a Room Finder guest reaches the booking summary with a chosen room.
alter table ai_room_finder_conversations
  add column if not exists lead_alert_sent_at timestamptz;

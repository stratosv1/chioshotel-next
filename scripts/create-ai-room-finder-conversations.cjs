const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  await client.query(`
    create table if not exists ai_room_finder_conversations (
      session_id text primary key,
      language text not null default 'en',
      source_path text,
      current_step text,
      checkin date,
      checkout date,
      room_count integer,
      guest_total integer,
      guest_groups jsonb not null default '[]'::jsonb,
      selected_rooms jsonb not null default '[]'::jsonb,
      breakfast boolean not null default false,
      first_name text,
      last_name text,
      phone text,
      email text,
      privacy_accepted boolean not null default false,
      privacy_accepted_at timestamptz,
      first_user_message_at timestamptz,
      last_user_message_at timestamptz,
      last_activity_at timestamptz not null default now(),
      enquiry_sent_at timestamptz,
      notification_sent_at timestamptz,
      staff_read_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists ai_room_finder_messages (
      id bigserial primary key,
      session_id text not null references ai_room_finder_conversations(session_id) on delete cascade,
      client_message_id text not null,
      role text not null check (role in ('assistant','user')),
      content text not null,
      kind text,
      reaction text,
      created_at timestamptz not null default now(),
      unique (session_id, client_message_id)
    );

    create index if not exists ai_room_finder_conversations_last_activity_idx
      on ai_room_finder_conversations (last_activity_at desc);

    create index if not exists ai_room_finder_conversations_created_idx
      on ai_room_finder_conversations (created_at desc);

    create index if not exists ai_room_finder_messages_session_idx
      on ai_room_finder_messages (session_id, id);
  `);

  const check = await client.query(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('ai_room_finder_conversations', 'ai_room_finder_messages')
    order by table_name;
  `);

  console.log("AI Room Finder conversation storage is ready:");
  console.table(check.rows);
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

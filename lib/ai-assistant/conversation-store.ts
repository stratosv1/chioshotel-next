import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";

export type RoomFinderTrackedMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  kind?: string;
  reaction?: string;
};

export type RoomFinderTrackingSnapshot = {
  sessionId: string;
  language: string;
  sourcePath?: string;
  step?: string;
  checkin?: string;
  checkout?: string;
  roomCount?: number | null;
  guestTotal?: number | null;
  groups?: number[];
  selectedRooms?: Array<{
    group?: number;
    guests?: number;
    roomNumber?: number | string;
    name?: string;
    directTotal?: number;
  }>;
  breakfast?: boolean;
  messages?: RoomFinderTrackedMessage[];
};

export type RoomFinderGuestDetails = {
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  email?: string;
  privacyAccepted?: boolean;
  privacyAcceptedAt?: string;
};

export type RoomFinderInboxConversation = {
  sessionId: string;
  language: string;
  sourcePath: string;
  currentStep: string;
  checkin: string;
  checkout: string;
  roomCount: number | null;
  guestTotal: number | null;
  guestGroups: number[];
  selectedRooms: Array<Record<string, unknown>>;
  breakfast: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  privacyAccepted: boolean;
  privacyAcceptedAt: string | null;
  firstUserMessageAt: string | null;
  lastUserMessageAt: string | null;
  lastActivityAt: string;
  enquirySentAt: string | null;
  staffReadAt: string | null;
  createdAt: string;
  messageCount: number;
  userMessageCount: number;
  lastUserMessage: string;
  unread: boolean;
  active: boolean;
};

export type RoomFinderInboxMessage = {
  id: number;
  clientMessageId: string;
  role: "assistant" | "user";
  content: string;
  kind: string;
  reaction: string;
  createdAt: string;
};

export type RoomFinderInboxData = {
  stats: {
    today: number;
    last7Days: number;
    active: number;
    unread: number;
    enquiries: number;
  };
  conversations: RoomFinderInboxConversation[];
  selected: {
    conversation: RoomFinderInboxConversation | null;
    messages: RoomFinderInboxMessage[];
  };
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

function text(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

function nullableDate(value: unknown) {
  const cleaned = text(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(cleaned) ? cleaned : null;
}

function sessionId(value: unknown) {
  const cleaned = text(value, 128);
  if (!/^[A-Za-z0-9._:-]{8,128}$/.test(cleaned)) {
    throw new Error("Invalid Room Finder session id.");
  }
  return cleaned;
}

function safeNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toIso(value: unknown) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function safeJsonArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function hasOwn(input: object, key: string) {
  return Object.prototype.hasOwnProperty.call(input, key);
}

function safeSelectedRooms(value: unknown) {
  return safeJsonArray<Record<string, unknown>>(value)
    .slice(0, 3)
    .map((room) => {
      const group = safeNumber(room.group);
      const guests = safeNumber(room.guests);
      const directTotal = safeNumber(room.directTotal);
      return {
        group: group && Number.isInteger(group) && group >= 1 && group <= 3 ? group : undefined,
        guests: guests && Number.isInteger(guests) && guests >= 1 && guests <= 5 ? guests : undefined,
        roomNumber: text(room.roomNumber, 40),
        name: text(room.name, 180),
        directTotal: directTotal != null ? Math.round(directTotal * 100) / 100 : undefined,
      };
    });
}

function mapConversation(row: Record<string, unknown>): RoomFinderInboxConversation {
  return {
    sessionId: text(row.session_id, 128),
    language: text(row.language, 10) || "en",
    sourcePath: text(row.source_path, 300),
    currentStep: text(row.current_step, 60),
    checkin: text(row.checkin, 10),
    checkout: text(row.checkout, 10),
    roomCount: safeNumber(row.room_count),
    guestTotal: safeNumber(row.guest_total),
    guestGroups: safeJsonArray<number>(row.guest_groups),
    selectedRooms: safeJsonArray<Record<string, unknown>>(row.selected_rooms),
    breakfast: Boolean(row.breakfast),
    firstName: text(row.first_name, 120),
    lastName: text(row.last_name, 120),
    phone: text(row.phone, 80),
    email: text(row.email, 254),
    privacyAccepted: Boolean(row.privacy_accepted),
    privacyAcceptedAt: toIso(row.privacy_accepted_at),
    firstUserMessageAt: toIso(row.first_user_message_at),
    lastUserMessageAt: toIso(row.last_user_message_at),
    lastActivityAt: toIso(row.last_activity_at) || new Date().toISOString(),
    enquirySentAt: toIso(row.enquiry_sent_at),
    staffReadAt: toIso(row.staff_read_at),
    createdAt: toIso(row.created_at) || new Date().toISOString(),
    messageCount: Number(row.message_count || 0),
    userMessageCount: Number(row.user_message_count || 0),
    lastUserMessage: text(row.last_user_message, 1000),
    unread: Boolean(row.unread),
    active: Boolean(row.active),
  };
}

async function sendStartedNotification(conversationSessionId: string, language: string, firstUserMessage: string) {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || "465");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const recipient = process.env.AI_ROOM_FINDER_ALERT_TO || process.env.CONTACT_TO || "chioshotel@gmail.com";

  if (!smtpUser || !smtpPass || !smtpFrom || !recipient) {
    throw new Error("AI Room Finder alert email is not configured.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.verify();
  const staffUrl = `https://chioshotel.gr/staff/ai-room-finder?session=${encodeURIComponent(conversationSessionId)}`;
  const info = await transporter.sendMail({
    from: `"Voulamandis House AI Room Finder" <${smtpFrom}>`,
    to: recipient,
    subject: "Νέα συνομιλία στο AI Room Finder",
    text: [
      "Ξεκίνησε νέα πραγματική συνομιλία στο AI Room Finder.",
      `Γλώσσα: ${language.toUpperCase()}`,
      `Πρώτο μήνυμα πελάτη: ${firstUserMessage || "—"}`,
      "",
      `Staff inbox: ${staffUrl}`,
    ].join("\n"),
  });

  const accepted = (info.accepted || []).map(String).map((value) => value.toLowerCase());
  if (!accepted.includes(recipient.toLowerCase())) {
    throw new Error("AI Room Finder alert was not accepted by SMTP server.");
  }
}

export async function recordRoomFinderConversation(input: RoomFinderTrackingSnapshot) {
  const sql = getSql();
  const sid = sessionId(input.sessionId);
  const language = text(input.language, 10).toLowerCase() || "en";
  const sourcePath = text(input.sourcePath, 300);

  const hasStep = hasOwn(input, "step");
  const hasCheckin = hasOwn(input, "checkin");
  const hasCheckout = hasOwn(input, "checkout");
  const hasRoomCount = hasOwn(input, "roomCount");
  const hasGuestTotal = hasOwn(input, "guestTotal");
  const hasGroups = Array.isArray(input.groups);
  const hasSelectedRooms = Array.isArray(input.selectedRooms);
  const hasBreakfast = typeof input.breakfast === "boolean";

  const step = text(input.step, 60);
  const checkin = nullableDate(input.checkin);
  const checkout = nullableDate(input.checkout);
  const roomCount = safeNumber(input.roomCount);
  const guestTotal = safeNumber(input.guestTotal);
  const groups = safeJsonArray<number>(input.groups)
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 5)
    .slice(0, 3);
  const selectedRooms = safeSelectedRooms(input.selectedRooms);
  const breakfast = hasBreakfast ? Boolean(input.breakfast) : false;
  const messages = safeJsonArray<RoomFinderTrackedMessage>(input.messages)
    .filter((message) => message && (message.role === "assistant" || message.role === "user"))
    .map((message) => ({
      id: text(message.id, 160),
      role: message.role,
      content: text(message.content, 4000),
      kind: text(message.kind, 40),
      reaction: text(message.reaction, 20),
    }))
    .filter((message) => message.id && message.content)
    .slice(0, 30);

  const userMessages = messages.filter((message) => message.role === "user");

  await sql`
    insert into ai_room_finder_conversations (
      session_id,
      language,
      source_path,
      current_step,
      checkin,
      checkout,
      room_count,
      guest_total,
      guest_groups,
      selected_rooms,
      breakfast,
      first_user_message_at,
      last_user_message_at,
      last_activity_at,
      updated_at
    ) values (
      ${sid},
      ${language},
      ${sourcePath || null},
      ${step || null},
      ${checkin}::date,
      ${checkout}::date,
      ${roomCount},
      ${guestTotal},
      ${JSON.stringify(groups)}::jsonb,
      ${JSON.stringify(selectedRooms)}::jsonb,
      ${breakfast},
      ${userMessages.length ? new Date().toISOString() : null}::timestamptz,
      ${userMessages.length ? new Date().toISOString() : null}::timestamptz,
      now(),
      now()
    )
    on conflict (session_id) do update set
      language = excluded.language,
      source_path = coalesce(excluded.source_path, ai_room_finder_conversations.source_path),
      current_step = case when ${hasStep} then excluded.current_step else ai_room_finder_conversations.current_step end,
      checkin = case when ${hasCheckin} then excluded.checkin else ai_room_finder_conversations.checkin end,
      checkout = case when ${hasCheckout} then excluded.checkout else ai_room_finder_conversations.checkout end,
      room_count = case when ${hasRoomCount} then excluded.room_count else ai_room_finder_conversations.room_count end,
      guest_total = case when ${hasGuestTotal} then excluded.guest_total else ai_room_finder_conversations.guest_total end,
      guest_groups = case when ${hasGroups} then excluded.guest_groups else ai_room_finder_conversations.guest_groups end,
      selected_rooms = case when ${hasSelectedRooms} then excluded.selected_rooms else ai_room_finder_conversations.selected_rooms end,
      breakfast = case when ${hasBreakfast} then excluded.breakfast else ai_room_finder_conversations.breakfast end,
      first_user_message_at = case
        when ${userMessages.length > 0} then coalesce(ai_room_finder_conversations.first_user_message_at, now())
        else ai_room_finder_conversations.first_user_message_at
      end,
      last_user_message_at = case
        when ${userMessages.length > 0} then now()
        else ai_room_finder_conversations.last_user_message_at
      end,
      last_activity_at = now(),
      updated_at = now()
  `;

  for (const message of messages) {
    await sql`
      insert into ai_room_finder_messages (
        session_id,
        client_message_id,
        role,
        content,
        kind,
        reaction
      ) values (
        ${sid},
        ${message.id},
        ${message.role},
        ${message.content},
        ${message.kind || null},
        ${message.reaction || null}
      )
      on conflict (session_id, client_message_id) do update set
        reaction = coalesce(excluded.reaction, ai_room_finder_messages.reaction)
    `;
  }

  if (userMessages.length) {
    const claimed = await sql`
      update ai_room_finder_conversations
      set notification_sent_at = now(), updated_at = now()
      where session_id = ${sid}
        and notification_sent_at is null
      returning session_id
    `;

    if (claimed.length) {
      try {
        await sendStartedNotification(sid, language, userMessages[0]?.content || "");
      } catch (error) {
        console.error("AI Room Finder started notification failed", error);
        await sql`
          update ai_room_finder_conversations
          set notification_sent_at = null, updated_at = now()
          where session_id = ${sid}
        `;
      }
    }
  }

  return { sessionId: sid };
}

export async function markRoomFinderEnquirySent(rawSessionId: string, guest: RoomFinderGuestDetails) {
  const sql = getSql();
  const sid = sessionId(rawSessionId);
  const firstName = text(guest.firstName, 120);
  const lastName = text(guest.lastName, 120);
  const fallbackName = text(guest.name, 240);
  const phone = text(guest.phone, 80);
  const email = text(guest.email, 254);
  const acceptedAt = toIso(guest.privacyAcceptedAt);

  let resolvedFirstName = firstName;
  let resolvedLastName = lastName;
  if (!resolvedFirstName && fallbackName) {
    const [first, ...rest] = fallbackName.split(/\s+/);
    resolvedFirstName = first || "";
    resolvedLastName = resolvedLastName || rest.join(" ");
  }

  await sql`
    update ai_room_finder_conversations
    set first_name = ${resolvedFirstName || null},
        last_name = ${resolvedLastName || null},
        phone = ${phone || null},
        email = ${email || null},
        privacy_accepted = ${Boolean(guest.privacyAccepted)},
        privacy_accepted_at = ${acceptedAt}::timestamptz,
        enquiry_sent_at = now(),
        last_activity_at = now(),
        updated_at = now()
    where session_id = ${sid}
  `;
}

export async function markRoomFinderConversationRead(rawSessionId: string) {
  const sql = getSql();
  const sid = sessionId(rawSessionId);
  await sql`
    update ai_room_finder_conversations
    set staff_read_at = now(), updated_at = now()
    where session_id = ${sid}
  `;
}

export async function getRoomFinderInbox(selectedSessionId?: string | null): Promise<RoomFinderInboxData> {
  const sql = getSql();

  const statsRows = await sql`
    select
      (count(*) filter (where created_at >= date_trunc('day', now())))::int as today,
      (count(*) filter (where created_at >= now() - interval '7 days'))::int as last_7_days,
      (count(*) filter (where last_activity_at >= now() - interval '5 minutes'))::int as active,
      (count(*) filter (where staff_read_at is null or staff_read_at < last_activity_at))::int as unread,
      (count(*) filter (where enquiry_sent_at is not null and created_at >= now() - interval '30 days'))::int as enquiries
    from ai_room_finder_conversations
    where first_user_message_at is not null
  `;

  const rows = await sql`
    select
      c.*,
      coalesce(m.message_count, 0)::int as message_count,
      coalesce(m.user_message_count, 0)::int as user_message_count,
      coalesce(lu.content, '') as last_user_message,
      (c.staff_read_at is null or c.staff_read_at < c.last_activity_at) as unread,
      (c.last_activity_at >= now() - interval '5 minutes') as active
    from ai_room_finder_conversations c
    left join lateral (
      select
        count(*)::int as message_count,
        count(*) filter (where role = 'user')::int as user_message_count
      from ai_room_finder_messages mm
      where mm.session_id = c.session_id
    ) m on true
    left join lateral (
      select content
      from ai_room_finder_messages mu
      where mu.session_id = c.session_id and mu.role = 'user'
      order by mu.id desc
      limit 1
    ) lu on true
    where c.first_user_message_at is not null
    order by c.last_activity_at desc
    limit 100
  `;

  const conversations = (rows as Record<string, unknown>[]).map(mapConversation);
  const requested = selectedSessionId ? text(selectedSessionId, 128) : "";
  const selectedConversation = conversations.find((row) => row.sessionId === requested) || conversations[0] || null;

  let messages: RoomFinderInboxMessage[] = [];
  if (selectedConversation) {
    const messageRows = await sql`
      select id, client_message_id, role, content, kind, reaction, created_at
      from ai_room_finder_messages
      where session_id = ${selectedConversation.sessionId}
      order by id asc
      limit 500
    `;
    messages = (messageRows as Record<string, unknown>[]).map((row) => ({
      id: Number(row.id),
      clientMessageId: text(row.client_message_id, 160),
      role: row.role === "user" ? "user" : "assistant",
      content: text(row.content, 4000),
      kind: text(row.kind, 40),
      reaction: text(row.reaction, 20),
      createdAt: toIso(row.created_at) || new Date().toISOString(),
    }));
  }

  const stats = statsRows[0] as Record<string, unknown> | undefined;
  return {
    stats: {
      today: Number(stats?.today || 0),
      last7Days: Number(stats?.last_7_days || 0),
      active: Number(stats?.active || 0),
      unread: Number(stats?.unread || 0),
      enquiries: Number(stats?.enquiries || 0),
    },
    conversations,
    selected: {
      conversation: selectedConversation,
      messages,
    },
  };
}

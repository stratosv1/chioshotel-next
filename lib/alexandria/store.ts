import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";
import { ALEXANDRIA_ROOMS, daysBetween, formatGreekDate } from "./config";

export type AlexandriaBooking = {
  id: string;
  room: string;
  checkin: string;
  checkout: string;
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  notes: string;
  updatedAt: string;
  beds24Id: string;
};

type Row = {
  id: number;
  room: string;
  checkin: string;
  checkout: string;
  first_name: string;
  last_name: string;
  country: string;
  phone: string;
  notes: string | null;
  updated_at: string;
  beds24_id: string | null;
};

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing.");
  return neon(url);
}

let tableReady = false;

/** Creates the table only once, the first time it is missing (no writes otherwise). */
async function ensureTable() {
  if (tableReady) return;
  const sql = getSql();
  const rows = (await sql`SELECT to_regclass('public.alexandria_bookings') AS t`) as { t: string | null }[];
  if (!rows[0]?.t) {
    await sql`
      CREATE TABLE IF NOT EXISTS alexandria_bookings (
        id SERIAL PRIMARY KEY,
        room TEXT NOT NULL,
        checkin DATE NOT NULL,
        checkout DATE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        country TEXT NOT NULL DEFAULT '',
        phone TEXT NOT NULL DEFAULT '',
        notes TEXT,
        beds24_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        deleted_at TIMESTAMPTZ
      )`;
    await sql`CREATE INDEX IF NOT EXISTS alexandria_bookings_room_dates ON alexandria_bookings (room, checkin, checkout) WHERE deleted_at IS NULL`;
  } else {
    // Column added 2026-11-18 for the Beds24 mirror; read-only check first so no write happens normally.
    const cols = (await sql`
      SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'alexandria_bookings' AND column_name = 'beds24_id'`) as unknown[];
    if (cols.length === 0) await sql`ALTER TABLE alexandria_bookings ADD COLUMN IF NOT EXISTS beds24_id TEXT`;
  }
  tableReady = true;
}

function mapRow(row: Row): AlexandriaBooking {
  return {
    id: String(row.id),
    room: row.room,
    checkin: String(row.checkin).slice(0, 10),
    checkout: String(row.checkout).slice(0, 10),
    firstName: row.first_name,
    lastName: row.last_name,
    country: row.country,
    phone: row.phone,
    notes: row.notes ?? "",
    updatedAt: row.updated_at,
    beds24Id: row.beds24_id ?? "",
  };
}

const columns = `id, room, to_char(checkin, 'YYYY-MM-DD') AS checkin, to_char(checkout, 'YYYY-MM-DD') AS checkout,
  first_name, last_name, country, phone, notes, updated_at, beds24_id`;

export async function listBookings() {
  await ensureTable();
  const rows = (await getSql().query(
    `SELECT ${columns} FROM alexandria_bookings WHERE deleted_at IS NULL ORDER BY checkin, room::int`,
  )) as Row[];
  return rows.map(mapRow);
}

export async function getBooking(id: string) {
  await ensureTable();
  const rows = (await getSql().query(
    `SELECT ${columns} FROM alexandria_bookings WHERE id = $1 AND deleted_at IS NULL`,
    [Number(id)],
  )) as Row[];
  return rows[0] ? mapRow(rows[0]) : null;
}

/** Returns a booking that overlaps the stay in the same room (excluding `ignoreId`). */
export async function findOverlap(room: string, checkin: string, checkout: string, ignoreId?: string) {
  await ensureTable();
  const rows = (await getSql().query(
    `SELECT ${columns} FROM alexandria_bookings
      WHERE deleted_at IS NULL AND room = $1 AND checkin < $3::date AND checkout > $2::date
        AND ($4::int IS NULL OR id <> $4::int)
      LIMIT 1`,
    [room, checkin, checkout, ignoreId ? Number(ignoreId) : null],
  )) as Row[];
  return rows[0] ? mapRow(rows[0]) : null;
}

export type BookingInput = Omit<AlexandriaBooking, "id" | "updatedAt" | "beds24Id">;

export async function setBeds24Id(id: string, beds24Id: string) {
  await getSql().query(`UPDATE alexandria_bookings SET beds24_id = $2 WHERE id = $1`, [Number(id), beds24Id]);
}

export async function createBooking(input: BookingInput) {
  await ensureTable();
  const rows = (await getSql().query(
    `INSERT INTO alexandria_bookings (room, checkin, checkout, first_name, last_name, country, phone, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ${columns}`,
    [input.room, input.checkin, input.checkout, input.firstName, input.lastName, input.country, input.phone, input.notes],
  )) as Row[];
  return mapRow(rows[0]);
}

export async function updateBooking(id: string, input: BookingInput) {
  await ensureTable();
  const rows = (await getSql().query(
    `UPDATE alexandria_bookings SET room = $2, checkin = $3, checkout = $4, first_name = $5, last_name = $6,
       country = $7, phone = $8, notes = $9, updated_at = now()
     WHERE id = $1 AND deleted_at IS NULL RETURNING ${columns}`,
    [Number(id), input.room, input.checkin, input.checkout, input.firstName, input.lastName, input.country, input.phone, input.notes],
  )) as Row[];
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function deleteBooking(id: string) {
  await ensureTable();
  const rows = (await getSql().query(
    `UPDATE alexandria_bookings SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING ${columns}`,
    [Number(id)],
  )) as Row[];
  return rows[0] ? mapRow(rows[0]) : null;
}

// ---------- Email notification to Stratos ----------

function roomLabel(id: string) {
  return ALEXANDRIA_ROOMS.find((room) => room.id === id)?.label ?? `Δωμάτιο ${id}`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

function describe(b: AlexandriaBooking) {
  return [
    ["Δωμάτιο", roomLabel(b.room)],
    ["Check-in", formatGreekDate(b.checkin)],
    ["Check-out", formatGreekDate(b.checkout)],
    ["Νύχτες", String(daysBetween(b.checkin, b.checkout))],
    ["Όνομα", b.firstName],
    ["Επώνυμο", b.lastName],
    ["Χώρα", b.country || "-"],
    ["Τηλέφωνο", b.phone || "-"],
    ["Σημειώσεις", b.notes || "-"],
  ] as const;
}

export type ChangeKind = "created" | "updated" | "deleted";

export type Beds24Status = { ok: true; bookingId: string } | { ok: false; error: string } | null;

function beds24Line(kind: ChangeKind, status: Beds24Status) {
  if (!status) return "";
  if (status.ok) {
    const verb = { created: "Περάστηκε", updated: "Ενημερώθηκε", deleted: "Ακυρώθηκε" }[kind];
    return `✅ ${verb} αυτόματα στο Beds24 (κράτηση #${status.bookingId}).`;
  }
  const error = (status as { error: string }).error;
  return `⚠️ ΔΕΝ ${kind === "deleted" ? "ακυρώθηκε" : "περάστηκε"} στο Beds24 (${error}) — κάν' το χειροκίνητα.`;
}

export async function notifyChange(
  kind: ChangeKind,
  booking: AlexandriaBooking,
  before?: AlexandriaBooking | null,
  beds24?: Beds24Status,
) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const to =
    process.env.ALEXANDRIA_NOTIFY_EMAIL || process.env.CONTACT_TO || process.env.RECEPTION_EMAIL || "chioshotel@gmail.com";
  if (!smtpUser || !smtpPass || !smtpFrom) {
    console.error("[alexandria] SMTP not configured; notification skipped");
    return false;
  }
  const port = Number(process.env.SMTP_PORT || "465");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const title = { created: "Νέα κράτηση", updated: "Αλλαγή κράτησης", deleted: "Ακύρωση κράτησης" }[kind];
  const guest = `${booking.firstName} ${booking.lastName}`.trim();
  const b24 = beds24Line(kind, beds24 ?? null);
  const subject = `${beds24 && !beds24.ok ? "⚠️ " : ""}Alexandria Institute — ${title}: ${guest}, ${roomLabel(booking.room)} (${formatGreekDate(booking.checkin)}–${formatGreekDate(booking.checkout)})`;

  const after = describe(booking);
  const prev = before ? describe(before) : null;
  const rowsHtml = after
    .map(([label, value], i) => {
      const old = prev?.[i]?.[1];
      const changed = kind === "updated" && old !== undefined && old !== value;
      return `<tr><td style="padding:6px 10px;color:#6b5a48">${label}</td><td style="padding:6px 10px;font-weight:600">${
        changed
          ? `<span style="color:#9a3412;text-decoration:line-through;font-weight:400">${escapeHtml(old)}</span> → <span style="color:#166534">${escapeHtml(value)}</span>`
          : escapeHtml(value)
      }</td></tr>`;
    })
    .join("");
  const text = [
    `${title} από τον Ανδρέα (Alexandria Institute)`,
    "",
    ...after.map(([label, value], i) => {
      const old = prev?.[i]?.[1];
      return kind === "updated" && old !== undefined && old !== value ? `${label}: ${old} → ${value}` : `${label}: ${value}`;
    }),
    "",
    b24,
    "Ημερολόγιο: https://chioshotel.gr/andreas",
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"Voulamandis House Website" <${smtpFrom}>`,
      to,
      subject,
      text,
      html: `<div style="font-family:Arial,sans-serif;color:#2b2118">
        <h2 style="margin:0 0 4px">${title}</h2>
        <p style="margin:0 0 12px;color:#6b5a48">Από τον Ανδρέα — Alexandria Institute</p>
        <table style="border-collapse:collapse;background:#faf6ef;border-radius:8px">${rowsHtml}</table>
        ${b24 ? `<p style="margin-top:12px;font-weight:600;color:${beds24?.ok ? "#166534" : "#9a3412"}">${escapeHtml(b24)}</p>` : ""}
        <p style="margin-top:14px"><a href="https://chioshotel.gr/andreas" style="color:#9a5b1e">Άνοιγμα ημερολογίου</a></p>
      </div>`,
    });
    return true;
  } catch (error) {
    console.error("[alexandria] notification failed", error);
    return false;
  }
}

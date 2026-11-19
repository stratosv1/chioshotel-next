import "server-only";
import { deliverEmail } from "@/lib/crm/guest-emails";
import { logHistory } from "./ledger";
import { roomByNumber } from "./rooms";
import { getSql } from "./store";

// Bookings "σε αναμονή" (owner, 2026-11-19): entered in Beds24 as normal confirmed bookings (so
// availability drops), but not yet confirmed by the guest. On the reminder date the owner gets an
// email "registered but not confirmed — still valid or delete?" and Σήμερα shows an alert.

export type Hold = { bookingId: string; remindOn: string; note: string; due: boolean };

let ready = false;

export async function ensureHoldsTable() {
  if (ready) return;
  const sql = getSql();
  const rows = (await sql`select to_regclass('public.pyrgos_booking_holds') as t`) as { t: string | null }[];
  if (!rows[0]?.t) {
    await sql`create table if not exists public.pyrgos_booking_holds (
      booking_id text primary key,
      remind_on date not null,
      note text,
      created_at timestamptz not null default now(),
      notified_at timestamptz,
      closed_at timestamptz
    )`;
  }
  ready = true;
}

const athensToday = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Athens" }).format(new Date());

export async function getHolds(ids: string[]) {
  await ensureHoldsTable();
  const map = new Map<string, Hold>();
  if (!ids.length) return map;
  const rows = (await getSql()`
    select booking_id, to_char(remind_on, 'YYYY-MM-DD') as remind_on, note from public.pyrgos_booking_holds
    where booking_id = any(${ids}::text[]) and closed_at is null
  `) as any[];
  const today = athensToday();
  for (const row of rows) {
    map.set(String(row.booking_id), { bookingId: String(row.booking_id), remindOn: row.remind_on, note: row.note ?? "", due: row.remind_on <= today });
  }
  return map;
}

export async function setHold(bookingId: string, remindOn: string, note: string) {
  await ensureHoldsTable();
  await getSql()`
    insert into public.pyrgos_booking_holds (booking_id, remind_on, note) values (${bookingId}, ${remindOn}::date, ${note || null})
    on conflict (booking_id) do update set remind_on = excluded.remind_on, note = excluded.note, notified_at = null, closed_at = null
  `;
  await logHistory(bookingId, "Σε αναμονή", `υπενθύμιση ${remindOn}${note ? ` · ${note}` : ""}`, "ok");
}

export async function closeHold(bookingId: string, reason: "confirmed" | "cancelled") {
  await ensureHoldsTable();
  const rows = (await getSql()`
    update public.pyrgos_booking_holds set closed_at = now() where booking_id = ${bookingId} and closed_at is null returning booking_id
  `) as unknown[];
  if (rows.length && reason === "confirmed") await logHistory(bookingId, "Επιβεβαιώθηκε", "βγήκε από την αναμονή", "ok");
}

export type HoldListItem = Hold & { name: string; room: number | null; checkin: string; checkout: string; channel: string };

/** Open holds of active bookings, due ones first (for Σήμερα). */
export async function listOpenHolds(): Promise<HoldListItem[]> {
  await ensureHoldsTable();
  const rows = (await getSql()`
    select h.booking_id, to_char(h.remind_on, 'YYYY-MM-DD') as remind_on, h.note, p.first_name, p.last_name, p.room_number, p.channel,
      to_char(p.checkin, 'YYYY-MM-DD') as checkin, to_char(p.checkout, 'YYYY-MM-DD') as checkout
    from public.pyrgos_booking_holds h
    join public.pyrgos_bookings p on p.booking_id = h.booking_id
    where h.closed_at is null and p.status in ('confirmed', 'new', 'request')
    order by h.remind_on, p.checkin
    limit 50
  `) as any[];
  const today = athensToday();
  return rows.map((row) => ({
    bookingId: String(row.booking_id),
    remindOn: row.remind_on,
    note: row.note ?? "",
    due: row.remind_on <= today,
    name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() || "Χωρίς όνομα",
    room: row.room_number === null ? null : Number(row.room_number),
    checkin: row.checkin,
    checkout: row.checkout,
    channel: row.channel,
  }));
}

const dm = (iso: string) => `${Number(iso.slice(8, 10))}/${Number(iso.slice(5, 7))}/${iso.slice(0, 4)}`;
const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

/** Morning cron: one email for every hold whose reminder date has come (once per reminder date). */
export async function runHoldReminders() {
  await ensureHoldsTable();
  const sql = getSql();
  // Holds of bookings that were cancelled meanwhile are closed silently.
  await sql`
    update public.pyrgos_booking_holds h set closed_at = now()
    from public.pyrgos_bookings p
    where p.booking_id = h.booking_id and h.closed_at is null and p.status not in ('confirmed', 'new', 'request')
  `;
  const today = athensToday();
  const due = (await listOpenHolds()).filter((h) => h.remindOn <= today);
  const notify = (await sql`
    select booking_id from public.pyrgos_booking_holds
    where closed_at is null and remind_on <= ${today}::date and (notified_at is null or notified_at::date < remind_on)
  `) as { booking_id: string }[];
  const ids = new Set(notify.map((r) => String(r.booking_id)));
  const items = due.filter((h) => ids.has(h.bookingId));
  if (!items.length) return { sent: 0 };

  const to = process.env.PYRGOS_NOTIFY_EMAIL || process.env.CONTACT_TO || process.env.RECEPTION_EMAIL || "chioshotel@gmail.com";
  const lines = items.map(
    (h) =>
      `• ${h.name} · ${roomByNumber(h.room)?.label ?? "χωρίς δωμάτιο"} · ${dm(h.checkin)} → ${dm(h.checkout)} · #${h.bookingId}${h.note ? ` · ${h.note}` : ""}`,
  );
  const html = `<div style="font-family:Arial,sans-serif;color:#1f2a3c">
    <h2 style="margin:0 0 8px">⏳ Κρατήσεις σε αναμονή</h2>
    <p>Οι παρακάτω κρατήσεις έχουν καταχωρηθεί (κλείνουν διαθεσιμότητα) αλλά <strong>δεν έχουν επιβεβαιωθεί</strong>.
    Ισχύουν ή να τις διαγράψουμε;</p>
    <ul>${items
      .map(
        (h) =>
          `<li style="margin:6px 0"><strong>${esc(h.name)}</strong> · ${esc(roomByNumber(h.room)?.label ?? "χωρίς δωμάτιο")} · ${dm(h.checkin)} → ${dm(h.checkout)} · #${h.bookingId}${h.note ? `<br><span style="color:#5b6b80">${esc(h.note)}</span>` : ""}<br><a href="https://chioshotel.gr/staff/pyrgos/plano?open=${encodeURIComponent(h.bookingId)}&amp;from=${h.checkin}" style="color:#5443c9">Άνοιγμα κράτησης</a></li>`,
      )
      .join("")}</ul>
    <p><a href="https://chioshotel.gr/staff/pyrgos/plano" style="color:#5443c9;font-weight:bold">Άνοιγμα πλάνου</a> · μέσα στην κράτηση: «Επιβεβαιώθηκε» ή «Ακύρωση κράτησης».</p>
  </div>`;
  await deliverEmail(
    to,
    `⏳ ${items.length} ${items.length === 1 ? "κράτηση" : "κρατήσεις"} σε αναμονή · ισχύει ή διαγραφή;`,
    html,
    ["Κρατήσεις σε αναμονή (καταχωρημένες, όχι επιβεβαιωμένες). Ισχύουν ή να τις διαγράψουμε;", "", ...lines, "", "https://chioshotel.gr/staff/pyrgos/plano"].join("\n"),
  );
  await sql`update public.pyrgos_booking_holds set notified_at = now() where booking_id = any(${[...ids]}::text[])`;
  for (const h of items) await logHistory(h.bookingId, "Υπενθύμιση αναμονής", `email στο ${to}`, "ok");
  return { sent: items.length };
}

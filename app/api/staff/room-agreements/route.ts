import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER_PHONE = "306944474226";
const EMAIL = "chioshotel@gmail.com";

type Selection =
  | { type: "room"; roomNumber: number }
  | { type: "split"; firstRoomNumber: number; secondRoomNumber: number; changeDate: string };

function clean(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function isoDate(value: unknown) {
  const result = clean(value).match(/^\d{4}-\d{2}-\d{2}$/)?.[0] || "";
  return result && !Number.isNaN(new Date(`${result}T12:00:00Z`).getTime()) ? result : "";
}

function normalizePhone(value: unknown) {
  let phone = clean(value).replace(/[^0-9+]/g, "");
  if (phone.startsWith("+")) phone = phone.slice(1);
  if (phone.startsWith("00")) phone = phone.slice(2);
  if (/^69\d{8}$/.test(phone)) phone = `30${phone}`;
  if (!/^\d{10,15}$/.test(phone)) return "";
  return phone;
}

function phoneSearch(value: unknown) {
  const digits = clean(value).replace(/\D/g, "");
  return digits.length >= 3 && digits.length <= 15 ? digits : "";
}

function money(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : 0;
}

function displayDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

function getSql() {
  const url = clean(process.env.DATABASE_URL);
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

async function ensureTable(sql: ReturnType<typeof neon>) {
  await sql`
    create table if not exists staff_room_agreements (
      id bigserial primary key,
      customer_phone text not null,
      owner_phone text not null,
      arrival date not null,
      departure date not null,
      guests integer not null,
      selection jsonb not null,
      agreed_total numeric(12,2) not null,
      message text not null,
      customer_sms_status text not null,
      owner_sms_status text not null,
      provider_response jsonb not null default '{}'::jsonb,
      booking_status text not null default 'pending',
      completed_at timestamptz,
      closed_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`create index if not exists staff_room_agreements_phone_idx on staff_room_agreements(customer_phone, created_at desc)`;
  await sql`create index if not exists staff_room_agreements_status_idx on staff_room_agreements(booking_status, created_at desc)`;
}

async function availability(sql: ReturnType<typeof neon>, arrival: string, departure: string, guests: number) {
  const statusRows = await sql`select * from booking_core.inventory_status(${arrival}::date, ${departure}::date)`;
  const inventoryStatus = String((statusRows as any[])[0]?.status || "DATA_UNAVAILABLE");
  if (inventoryStatus !== "READY") {
    return { ok: false as const, code: inventoryStatus };
  }

  const roomRows = await sql`
    select room_number::int, display_name, room_type, floor, max_guests::int,
           original_total::numeric, direct_total::numeric
    from booking_core.search_availability(${arrival}::date, ${departure}::date, ${guests})
    order by room_number
  `;

  const splitRows = (roomRows as any[]).length === 0
    ? await sql`
        with change_dates as (
          select day::date as change_date
          from generate_series(${arrival}::date + 1, ${departure}::date - 1, interval '1 day') day
        )
        select
          d.change_date::text,
          first_offer.room_number::int as first_room_number,
          first_offer.display_name as first_name,
          first_offer.room_type as first_category,
          second_offer.room_number::int as second_room_number,
          second_offer.display_name as second_name,
          second_offer.room_type as second_category,
          first_offer.direct_total::numeric as first_total,
          second_offer.direct_total::numeric as second_total
        from change_dates d
        cross join lateral booking_core.search_availability(${arrival}::date, d.change_date, ${guests}) first_offer
        cross join lateral booking_core.search_availability(d.change_date, ${departure}::date, ${guests}) second_offer
        where first_offer.room_number <> second_offer.room_number
        order by (first_offer.direct_total + second_offer.direct_total), d.change_date,
                 first_offer.room_number, second_offer.room_number
        limit 20
      `
    : [];

  return {
    ok: true as const,
    rooms: (roomRows as any[]).map((row) => ({
      roomNumber: Number(row.room_number),
      name: String(row.display_name),
      category: String(row.room_type),
      floor: String(row.floor),
      maxGuests: Number(row.max_guests),
      systemTotal: money(row.direct_total),
      originalTotal: money(row.original_total),
    })),
    splits: (splitRows as any[]).map((row) => ({
      changeDate: isoDate(row.change_date),
      firstRoomNumber: Number(row.first_room_number),
      firstName: String(row.first_name),
      firstCategory: String(row.first_category),
      secondRoomNumber: Number(row.second_room_number),
      secondName: String(row.second_name),
      secondCategory: String(row.second_category),
      systemTotal: money(row.first_total) + money(row.second_total),
    })),
  };
}

async function selectionStillAvailable(
  sql: ReturnType<typeof neon>, arrival: string, departure: string, guests: number, selection: Selection,
) {
  if (selection.type === "room") {
    const rows = await sql`
      select 1 from booking_core.search_availability(${arrival}::date, ${departure}::date, ${guests})
      where room_number = ${selection.roomNumber} limit 1
    `;
    return (rows as any[]).length > 0;
  }
  const changeDate = isoDate(selection.changeDate);
  if (!changeDate || changeDate <= arrival || changeDate >= departure) return false;
  const [first, second] = await Promise.all([
    sql`select 1 from booking_core.search_availability(${arrival}::date, ${changeDate}::date, ${guests}) where room_number = ${selection.firstRoomNumber} limit 1`,
    sql`select 1 from booking_core.search_availability(${changeDate}::date, ${departure}::date, ${guests}) where room_number = ${selection.secondRoomNumber} limit 1`,
  ]);
  return (first as any[]).length > 0 && (second as any[]).length > 0 && selection.firstRoomNumber !== selection.secondRoomNumber;
}

function buildMessage(arrival: string, departure: string, guests: number, selection: Selection, total: number) {
  const stay = selection.type === "room"
    ? `στο Δωμάτιο ${selection.roomNumber}`
    : `${displayDate(arrival)}–${displayDate(selection.changeDate)} στο Δωμάτιο ${selection.firstRoomNumber} και ${displayDate(selection.changeDate)}–${displayDate(departure)} στο Δωμάτιο ${selection.secondRoomNumber}`;
  return `Η συμφωνία μας αφορά διαμονή από ${displayDate(arrival)} έως ${displayDate(departure)}, για ${guests} ${guests === 1 ? "επισκέπτη" : "επισκέπτες"}, ${stay}, με συνολική τιμή ${total.toFixed(2).replace(".00", "")}€. Παρακαλούμε στείλτε μας email στο ${EMAIL}, ώστε να σας αποστείλουμε την επιβεβαίωση της κράτησης. Voulamandis House`;
}

async function sendSms(to: string, message: string) {
  const token = clean(process.env.SMSAPI_TOKEN || process.env.VHC_SMSAPI_TOKEN);
  const sender = clean(process.env.SMSAPI_FROM || process.env.VHC_SMSAPI_FROM || "Voulamandis");
  if (!token) throw new Error("SMSAPI_TOKEN is not configured.");
  const params = new URLSearchParams({ to, from: sender, message, format: "json" });
  const response = await fetch("https://api.smsapi.com/sms.do", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    cache: "no-store",
  });
  const raw = await response.text();
  let providerResponse: unknown = raw;
  try { providerResponse = JSON.parse(raw); } catch {}
  const failed = !response.ok || Boolean(providerResponse && typeof providerResponse === "object" && "error" in providerResponse);
  return { ok: !failed, status: failed ? "failed" : "sent", providerResponse };
}

export async function GET(request: NextRequest) {
  try {
    const sql = getSql();
    const mode = request.nextUrl.searchParams.get("mode") || "history";
    if (mode === "availability") {
      const arrival = isoDate(request.nextUrl.searchParams.get("arrival"));
      const departure = isoDate(request.nextUrl.searchParams.get("departure"));
      const guests = Number(request.nextUrl.searchParams.get("guests"));
      if (!arrival || !departure || departure <= arrival || !Number.isInteger(guests) || guests < 1 || guests > 5) {
        return noStore({ ok: false, error: "Έλεγξε τις ημερομηνίες και τους επισκέπτες." }, 400);
      }
      const result = await availability(sql, arrival, departure, guests);
      return result.ok ? noStore({ ok: true, ...result }) : noStore({ ok: false, code: result.code, error: "Η διαθεσιμότητα του Booking Core δεν είναι έτοιμη." }, 503);
    }

    await ensureTable(sql);
    const status = clean(request.nextUrl.searchParams.get("status"));
    const phone = phoneSearch(request.nextUrl.searchParams.get("phone"));
    const rows = await sql`
      select id::text, customer_phone, arrival::text, departure::text, guests, selection,
             agreed_total::numeric, message, customer_sms_status, owner_sms_status,
             booking_status, completed_at, closed_at, created_at, updated_at
      from staff_room_agreements
      where (${status || null}::text is null or booking_status = ${status || null})
        and (${phone || null}::text is null or customer_phone like ${phone ? `%${phone}%` : null})
      order by created_at desc
      limit 200
    `;
    return noStore({ ok: true, agreements: rows });
  } catch (error) {
    console.error("Staff room agreements GET failed", error);
    return noStore({ ok: false, error: "Δεν ήταν δυνατή η φόρτωση." }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const arrival = isoDate(body.arrival);
    const departure = isoDate(body.departure);
    const guests = Number(body.guests);
    const agreedTotal = money(body.agreedTotal);
    const customerPhone = normalizePhone(body.customerPhone);
    const selection = body.selection as Selection;
    const validSelection = selection?.type === "room"
      ? Number.isInteger(selection.roomNumber) && selection.roomNumber >= 1 && selection.roomNumber <= 10
      : selection?.type === "split" && Number.isInteger(selection.firstRoomNumber) && Number.isInteger(selection.secondRoomNumber) && Boolean(isoDate(selection.changeDate));

    if (!arrival || !departure || departure <= arrival || !Number.isInteger(guests) || guests < 1 || guests > 5 || !agreedTotal || !customerPhone || !validSelection) {
      return noStore({ ok: false, error: "Συμπλήρωσε σωστά όλα τα στοιχεία της συμφωνίας." }, 400);
    }

    const sql = getSql();
    await ensureTable(sql);
    const statusRows = await sql`select * from booking_core.inventory_status(${arrival}::date, ${departure}::date)`;
    if (String((statusRows as any[])[0]?.status || "") !== "READY" || !await selectionStillAvailable(sql, arrival, departure, guests, selection)) {
      return noStore({ ok: false, error: "Η επιλογή δεν είναι πλέον διαθέσιμη. Κάνε νέο έλεγχο." }, 409);
    }

    const message = buildMessage(arrival, departure, guests, selection, agreedTotal);
    const recipients = customerPhone === OWNER_PHONE ? [customerPhone] : [customerPhone, OWNER_PHONE];
    const results = await Promise.all(recipients.map(async (to) => {
      try {
        return { to, ...(await sendSms(to, message)) };
      } catch (error) {
        return {
          to,
          ok: false,
          status: "failed",
          providerResponse: { error: error instanceof Error ? error.message : "SMS request failed" },
        };
      }
    }));
    const customerResult = results.find((item) => item.to === customerPhone)!;
    const ownerResult = results.find((item) => item.to === OWNER_PHONE) || customerResult;

    const inserted = await sql`
      insert into staff_room_agreements (
        customer_phone, owner_phone, arrival, departure, guests, selection, agreed_total, message,
        customer_sms_status, owner_sms_status, provider_response
      ) values (
        ${customerPhone}, ${OWNER_PHONE}, ${arrival}::date, ${departure}::date, ${guests},
        ${JSON.stringify(selection)}::jsonb, ${agreedTotal}, ${message},
        ${customerResult.status}, ${ownerResult.status}, ${JSON.stringify(results)}::jsonb
      ) returning id::text
    `;

    const allSent = results.every((item) => item.ok);
    return noStore({
      ok: allSent,
      saved: true,
      id: inserted[0]?.id,
      message,
      results,
      error: allSent ? null : "Η συμφωνία αποθηκεύτηκε, αλλά τουλάχιστον ένα SMS απέτυχε.",
    }, allSent ? 201 : 207);
  } catch (error) {
    console.error("Staff room agreement send failed", error);
    return noStore({ ok: false, error: error instanceof Error && error.message.includes("SMSAPI_TOKEN") ? "Δεν έχει ρυθμιστεί η αποστολή SMS." : "Η αποστολή απέτυχε." }, 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = clean(body.id);
    const status = clean(body.status);
    if (!/^\d+$/.test(id) || !["pending", "completed", "declined"].includes(status)) {
      return noStore({ ok: false, error: "Μη έγκυρη αλλαγή κατάστασης." }, 400);
    }
    const sql = getSql();
    await ensureTable(sql);
    const rows = await sql`
      update staff_room_agreements
      set booking_status = ${status},
          completed_at = case when ${status} = 'completed' then now() else completed_at end,
          closed_at = case when ${status} = 'declined' then now() else closed_at end,
          updated_at = now()
      where id = ${id}::bigint
      returning id::text, booking_status, completed_at, closed_at, updated_at
    `;
    return (rows as any[]).length ? noStore({ ok: true, agreement: (rows as any[])[0] }) : noStore({ ok: false, error: "Η εγγραφή δεν βρέθηκε." }, 404);
  } catch (error) {
    console.error("Staff room agreement PATCH failed", error);
    return noStore({ ok: false, error: "Η αλλαγή δεν αποθηκεύτηκε." }, 500);
  }
}

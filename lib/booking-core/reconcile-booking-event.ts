import "server-only";

import { neon } from "@neondatabase/serverless";

export type BookingCoreBookingEvent = {
  bookingId: string;
  status: string;
  checkin: string;
  checkout: string;
  roomId: string;
  unitId: string;
};

export type BookingCoreReconcileResult = {
  mode: "active" | "cancelled" | "skipped";
  applied: boolean;
  dryRun: boolean;
  reason: string | null;
  roomNumber: number | null;
  expectedNights: number;
  coverageRows: number;
  conflictRows: number;
  rowsReleased: number;
  rowsBooked: number;
};

function databaseUrl() {
  const value = process.env.DATABASE_URL?.trim();
  if (!value) throw new Error("DATABASE_URL is missing");
  return value;
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function nightsBetween(checkin: string, checkout: string) {
  if (!validDate(checkin) || !validDate(checkout)) return 0;
  const start = Date.parse(`${checkin}T00:00:00Z`);
  const end = Date.parse(`${checkout}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000);
}

export function isBeds24CancellationStatus(status: string) {
  const normalized = clean(status).toLowerCase();
  return normalized === "0" || normalized === "cancelled" || normalized === "canceled" || normalized.includes("cancel");
}

function skipped(reason: string, dryRun: boolean): BookingCoreReconcileResult {
  return {
    mode: "skipped",
    applied: false,
    dryRun,
    reason,
    roomNumber: null,
    expectedNights: 0,
    coverageRows: 0,
    conflictRows: 0,
    rowsReleased: 0,
    rowsBooked: 0,
  };
}

export async function reconcileBookingCoreBookingEvent(
  input: BookingCoreBookingEvent,
  options: { dryRun?: boolean } = {},
): Promise<BookingCoreReconcileResult> {
  const dryRun = options.dryRun === true;
  const bookingId = clean(input.bookingId);
  const status = clean(input.status);
  const checkin = clean(input.checkin);
  const checkout = clean(input.checkout);
  const roomId = clean(input.roomId);
  const unitId = clean(input.unitId);

  if (!bookingId) return skipped("missing_booking_id", dryRun);

  const sql = neon(databaseUrl());
  const cancelled = isBeds24CancellationStatus(status);

  if (cancelled) {
    if (dryRun) {
      const rows = await sql`
        select
          count(*)::int as rows_released,
          count(*) filter (where base_price is not null and base_price > 0)::int as restorable_rows
        from booking_core.inventory
        where booking_id = ${bookingId}
      `;
      const row = (rows as any[])[0] || {};
      return {
        mode: "cancelled",
        applied: true,
        dryRun: true,
        reason: null,
        roomNumber: null,
        expectedNights: 0,
        coverageRows: 0,
        conflictRows: 0,
        rowsReleased: Number(row.rows_released || 0),
        rowsBooked: 0,
      };
    }

    const rows = await sql`
      with released as (
        update booking_core.inventory as inventory
        set
          available = (inventory.base_price is not null and inventory.base_price > 0),
          source_status = case
            when inventory.base_price is not null and inventory.base_price > 0 then inventory.base_price::text
            else 'CLOSED'
          end,
          reason = case
            when inventory.base_price is not null and inventory.base_price > 0 then 'PRICE_OK'
            else 'CLOSED'
          end,
          booking_id = null,
          synced_at = now(),
          raw_source = coalesce(inventory.raw_source, '{}'::jsonb) || jsonb_build_object(
            'available', (inventory.base_price is not null and inventory.base_price > 0),
            'status', case
              when inventory.base_price is not null and inventory.base_price > 0 then inventory.base_price::text
              else 'CLOSED'
            end,
            'reason', case
              when inventory.base_price is not null and inventory.base_price > 0 then 'PRICE_OK'
              else 'CLOSED'
            end,
            'bookingId', null,
            'eventReconciledAt', now()
          )
        where inventory.booking_id = ${bookingId}
        returning 1
      )
      select count(*)::int as rows_released from released
    `;

    return {
      mode: "cancelled",
      applied: true,
      dryRun: false,
      reason: null,
      roomNumber: null,
      expectedNights: 0,
      coverageRows: 0,
      conflictRows: 0,
      rowsReleased: Number((rows as any[])[0]?.rows_released || 0),
      rowsBooked: 0,
    };
  }

  const expectedNights = nightsBetween(checkin, checkout);
  if (expectedNights <= 0) return skipped("invalid_or_empty_stay", dryRun);
  if (!roomId || !unitId) return skipped("missing_exact_room_or_unit_id", dryRun);

  if (dryRun) {
    const rows = await sql`
      with target_room as (
        select room_number
        from booking_core.rooms
        where room_id = ${roomId}
          and unit_id = ${unitId}
          and is_active = true
        limit 1
      ), target_rows as (
        select inventory.*
        from booking_core.inventory as inventory
        join target_room on target_room.room_number = inventory.room_number
        where inventory.stay_date >= ${checkin}::date
          and inventory.stay_date < ${checkout}::date
      )
      select
        (select room_number from target_room limit 1) as room_number,
        (select count(*)::int from target_rows) as coverage_rows,
        (select count(*)::int from target_rows
          where (booking_id is not null and booking_id <> ${bookingId})
             or (booking_id is null and upper(coalesce(reason, '')) = 'BOOKED')) as conflict_rows,
        (select count(*)::int from booking_core.inventory as old
          where old.booking_id = ${bookingId}
            and not exists (
              select 1 from target_room
              where target_room.room_number = old.room_number
                and old.stay_date >= ${checkin}::date
                and old.stay_date < ${checkout}::date
            )) as rows_to_release,
        (select count(*)::int from target_rows
          where booking_id is distinct from ${bookingId}
             or available is distinct from false
             or upper(coalesce(reason, '')) <> 'BOOKED') as rows_to_book
    `;
    const row = (rows as any[])[0] || {};
    const roomNumber = row.room_number == null ? null : Number(row.room_number);
    const coverageRows = Number(row.coverage_rows || 0);
    const conflictRows = Number(row.conflict_rows || 0);
    const guardOk = roomNumber !== null && coverageRows === expectedNights && conflictRows === 0;

    return {
      mode: "active",
      applied: guardOk,
      dryRun: true,
      reason: guardOk ? null : roomNumber === null ? "unknown_room_unit_mapping" : coverageRows !== expectedNights ? "inventory_range_incomplete" : "target_inventory_conflict",
      roomNumber,
      expectedNights,
      coverageRows,
      conflictRows,
      rowsReleased: Number(row.rows_to_release || 0),
      rowsBooked: Number(row.rows_to_book || 0),
    };
  }

  const rows = await sql`
    with target_room as (
      select room_number
      from booking_core.rooms
      where room_id = ${roomId}
        and unit_id = ${unitId}
        and is_active = true
      limit 1
    ), target_rows as (
      select inventory.stay_date, inventory.room_number, inventory.booking_id, inventory.available, inventory.reason
      from booking_core.inventory as inventory
      join target_room on target_room.room_number = inventory.room_number
      where inventory.stay_date >= ${checkin}::date
        and inventory.stay_date < ${checkout}::date
    ), guard as (
      select
        (select room_number from target_room limit 1) as room_number,
        (select count(*)::int from target_rows) as coverage_rows,
        (select count(*)::int from target_rows
          where (booking_id is not null and booking_id <> ${bookingId})
             or (booking_id is null and upper(coalesce(reason, '')) = 'BOOKED')) as conflict_rows
    ), released as (
      update booking_core.inventory as inventory
      set
        available = (inventory.base_price is not null and inventory.base_price > 0),
        source_status = case
          when inventory.base_price is not null and inventory.base_price > 0 then inventory.base_price::text
          else 'CLOSED'
        end,
        reason = case
          when inventory.base_price is not null and inventory.base_price > 0 then 'PRICE_OK'
          else 'CLOSED'
        end,
        booking_id = null,
        synced_at = now(),
        raw_source = coalesce(inventory.raw_source, '{}'::jsonb) || jsonb_build_object(
          'available', (inventory.base_price is not null and inventory.base_price > 0),
          'status', case
            when inventory.base_price is not null and inventory.base_price > 0 then inventory.base_price::text
            else 'CLOSED'
          end,
          'reason', case
            when inventory.base_price is not null and inventory.base_price > 0 then 'PRICE_OK'
            else 'CLOSED'
          end,
          'bookingId', null,
          'eventReconciledAt', now()
        )
      from guard, target_room
      where guard.room_number is not null
        and guard.coverage_rows = ${expectedNights}
        and guard.conflict_rows = 0
        and inventory.booking_id = ${bookingId}
        and not (
          inventory.room_number = target_room.room_number
          and inventory.stay_date >= ${checkin}::date
          and inventory.stay_date < ${checkout}::date
        )
      returning 1
    ), booked as (
      update booking_core.inventory as inventory
      set
        available = false,
        source_status = 'BOOKED',
        reason = 'BOOKED',
        booking_id = ${bookingId},
        synced_at = now(),
        raw_source = coalesce(inventory.raw_source, '{}'::jsonb) || jsonb_build_object(
          'available', false,
          'status', 'BOOKED',
          'reason', 'BOOKED',
          'bookingId', ${bookingId}::text,
          'eventReconciledAt', now()
        )
      from guard, target_room
      where guard.room_number is not null
        and guard.coverage_rows = ${expectedNights}
        and guard.conflict_rows = 0
        and inventory.room_number = target_room.room_number
        and inventory.stay_date >= ${checkin}::date
        and inventory.stay_date < ${checkout}::date
        and (
          inventory.booking_id is null
          or inventory.booking_id = ${bookingId}
        )
        and (
          inventory.booking_id is distinct from ${bookingId}
          or inventory.available is distinct from false
          or upper(coalesce(inventory.reason, '')) <> 'BOOKED'
        )
      returning 1
    )
    select
      guard.room_number,
      guard.coverage_rows,
      guard.conflict_rows,
      (select count(*)::int from released) as rows_released,
      (select count(*)::int from booked) as rows_booked
    from guard
  `;

  const row = (rows as any[])[0] || {};
  const roomNumber = row.room_number == null ? null : Number(row.room_number);
  const coverageRows = Number(row.coverage_rows || 0);
  const conflictRows = Number(row.conflict_rows || 0);
  const guardOk = roomNumber !== null && coverageRows === expectedNights && conflictRows === 0;

  return {
    mode: "active",
    applied: guardOk,
    dryRun: false,
    reason: guardOk ? null : roomNumber === null ? "unknown_room_unit_mapping" : coverageRows !== expectedNights ? "inventory_range_incomplete" : "target_inventory_conflict",
    roomNumber,
    expectedNights,
    coverageRows,
    conflictRows,
    rowsReleased: Number(row.rows_released || 0),
    rowsBooked: Number(row.rows_booked || 0),
  };
}

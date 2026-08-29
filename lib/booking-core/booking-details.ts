import "server-only";

import { neon } from "@neondatabase/serverless";

export type BookedStayDetails = {
  stayDate: string;
  roomNumber: number;
  bookingId: string;
  bookingStatus: string | null;
  checkin: string | null;
  checkout: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  property: string | null;
  beds24Room: string | null;
  guestLanguage: string | null;
  price: string | null;
};

function databaseUrl() {
  const value = process.env.DATABASE_URL?.trim();
  if (!value) throw new Error("DATABASE_URL is missing");
  return value;
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function getBookedStayDetails(
  roomNumber: number,
  stayDate: string,
): Promise<BookedStayDetails | null> {
  if (!Number.isInteger(roomNumber) || roomNumber <= 0) {
    throw new Error("roomNumber must be a positive integer");
  }
  if (!validDate(stayDate)) {
    throw new Error("stayDate must use YYYY-MM-DD format");
  }

  const sql = neon(databaseUrl());
  const rows = await sql`
    select
      stay_date::text as stay_date,
      room_number,
      booking_id,
      booking_status,
      checkin::text as checkin,
      checkout::text as checkout,
      firstname,
      lastname,
      email,
      property,
      beds24_room,
      guest_language,
      price
    from booking_core.booked_stay_details
    where room_number = ${roomNumber}
      and stay_date = ${stayDate}::date
    limit 1
  `;

  const row = (rows as any[])[0];
  if (!row?.booking_id) return null;

  return {
    stayDate: String(row.stay_date),
    roomNumber: Number(row.room_number),
    bookingId: String(row.booking_id),
    bookingStatus: row.booking_status == null ? null : String(row.booking_status),
    checkin: row.checkin == null ? null : String(row.checkin),
    checkout: row.checkout == null ? null : String(row.checkout),
    firstname: row.firstname == null ? null : String(row.firstname),
    lastname: row.lastname == null ? null : String(row.lastname),
    email: row.email == null ? null : String(row.email),
    property: row.property == null ? null : String(row.property),
    beds24Room: row.beds24_room == null ? null : String(row.beds24_room),
    guestLanguage: row.guest_language == null ? null : String(row.guest_language),
    price: row.price == null ? null : String(row.price),
  };
}

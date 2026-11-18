import "server-only";
import { appendBookingNote, getBeds24WriteToken } from "@/lib/crm/booking-notes";
import { loadConfirmation, sendConfirmation } from "@/lib/crm/booking-confirmation";
import { cancelBeds24Booking, createBeds24Booking, liveOverlap, modifyBeds24Booking } from "./beds24-write";
import { ensureBookingsTable } from "./bookings";
import { logHistory, resolvePrice, saveMoney, type PriceMode } from "./ledger";
import { freeRooms, getBookingDetail } from "./plan";
import { isCategoryChange, roomByNumber } from "./rooms";
import { bedsText, getSql, saveExtras, type BedSetup } from "./store";

export class ActionError extends Error {
  constructor(message: string, public status = 400, public code?: string) {
    super(message);
  }
}

const OTA = new Set(["Booking", "Expedia"]);
const isDay = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
const nightsOf = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000);
const clean = (v: unknown, max = 120) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const money = (v: unknown) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
};
const int = (v: unknown, fallback: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 && n <= 12 ? n : fallback;
};
const roomLabel = (n: number | null) => roomByNumber(n)?.label ?? `Δωμ. ${n}`;

async function assertFree(room: number, arrival: string, departure: string, ignoreId?: string) {
  const free = await freeRooms(arrival, departure, ignoreId);
  if (!free.includes(room)) throw new ActionError(`Το ${roomLabel(room)} δεν είναι ελεύθερο ή είναι κλειστό εκείνες τις μέρες.`, 409);
  const clash = await liveOverlap(room, arrival, departure, ignoreId ? [ignoreId] : []);
  if (clash) {
    const who = `${clash.firstName ?? ""} ${clash.lastName ?? ""}`.trim();
    throw new ActionError(`Στο Beds24 υπάρχει ήδη κράτηση στο ${roomLabel(room)}${who ? ` (${who})` : ""} εκείνες τις μέρες.`, 409);
  }
}

async function noteToBeds24(id: string, line: string) {
  try {
    const token = await getBeds24WriteToken();
    const outcome = await appendBookingNote(id, line, line, token);
    return outcome === "written" || outcome === "already_noted" ? "ok" : `failed:${outcome}`;
  } catch (error) {
    console.error("[pyrgos] note failed", error);
    return "failed";
  }
}

// ---------- create ----------

export async function createBooking(body: any) {
  await ensureBookingsTable();
  const room = Number(body.room);
  const arrival = body.checkin;
  const departure = body.checkout;
  if (!roomByNumber(room)) throw new ActionError("Διάλεξε δωμάτιο.");
  if (!isDay(arrival) || !isDay(departure) || departure <= arrival) throw new ActionError("Έλεγξε τις ημερομηνίες.");
  const firstName = clean(body.firstName, 60);
  const lastName = clean(body.lastName, 60);
  if (!firstName || !lastName) throw new ActionError("Συμπλήρωσε όνομα και επώνυμο.");
  const adults = int(body.adults, 2);
  const children = int(body.children, 0);
  if (adults < 1) throw new ActionError("Τουλάχιστον 1 ενήλικας.");
  const nights = nightsOf(arrival, departure);
  const mode: PriceMode | null = body.priceMode === "night" || body.priceMode === "total" ? body.priceMode : null;
  const price = resolvePrice(mode, money(body.nightPrice), money(body.totalPrice), nights);

  await assertFree(room, arrival, departure);

  const guest = {
    firstName,
    lastName,
    email: clean(body.email, 120).toLowerCase(),
    phone: clean(body.phone, 30),
    country: clean(body.country, 2).toUpperCase(),
    adults,
    children,
  };
  const notes = clean(body.notes, 500);
  const id = await createBeds24Booking({ ...guest, room, arrival, departure, total: price.totalPrice, notes });

  await getSql()`
    insert into public.pyrgos_bookings (booking_id, status, channel, referer, room_number, checkin, checkout, nights, adults,
      children, first_name, last_name, email, phone, country, price, booked_at, price_source, notes)
    values (${id}, 'confirmed', 'Απευθείας', 'Πύργος ελέγχου', ${room}, ${arrival}::date, ${departure}::date, ${nights}, ${adults},
      ${children}, ${firstName}, ${lastName}, ${guest.email || null}, ${guest.phone || null}, ${guest.country || null},
      ${price.totalPrice}, now(), ${price.totalPrice !== null ? "pyrgos" : null}, ${notes || null})
    on conflict (booking_id) do nothing
  `;
  await saveMoney({
    bookingId: id,
    priceMode: mode,
    nightPrice: price.nightPrice,
    totalPrice: price.totalPrice,
    deposit: money(body.deposit),
    paid: Boolean(body.paid),
  });
  if (body.bedSetup || body.cot || body.rollaway || body.bedOther) {
    await saveExtras({
      bookingId: id,
      bedSetup: (body.bedSetup || null) as BedSetup | null,
      cot: Boolean(body.cot),
      rollaway: Boolean(body.rollaway),
      other: clean(body.bedOther, 120),
    });
  }
  if (money(body.deposit)) await noteToBeds24(id, `Προκαταβολή: €${money(body.deposit)}`);

  let email = "skipped";
  if (body.sendConfirmation && guest.email) {
    try {
      const loaded = await loadConfirmation(id);
      if (loaded) {
        await sendConfirmation(loaded.data, guest.email, "live");
        email = "sent";
      } else email = "failed";
    } catch (error) {
      console.error("[pyrgos] confirmation email failed", error);
      email = "failed";
    }
  }
  await logHistory(
    id,
    "Νέα κράτηση",
    `${roomLabel(room)} · ${arrival} → ${departure} · ${adults}+${children} · ${price.totalPrice ?? "-"}€${email === "sent" ? " · email επιβεβαίωσης" : ""}`,
    "ok",
  );
  return { id, email };
}

// ---------- update (dates / room / guest / people) ----------

export async function updateBooking(body: any) {
  const id = clean(body.id, 20);
  const current = (await getBookingDetail(id))?.booking;
  if (!current) throw new ActionError("Η κράτηση δεν βρέθηκε.", 404);
  if (current.status === "black") throw new ActionError("Τα μπλοκαρίσματα αλλάζουν μόνο στο Beds24.");

  const room = body.room === undefined ? current.room : Number(body.room);
  const arrival = isDay(body.checkin) ? body.checkin : current.checkin;
  const departure = isDay(body.checkout) ? body.checkout : current.checkout;
  if (!roomByNumber(room)) throw new ActionError("Διάλεξε δωμάτιο.");
  if (departure <= arrival) throw new ActionError("Το check-out πρέπει να είναι μετά το check-in.");

  const datesChanged = arrival !== current.checkin || departure !== current.checkout;
  const roomChanged = room !== current.room;
  if (OTA.has(current.channel) && datesChanged) {
    throw new ActionError(`Κράτηση ${current.channel}: οι ημερομηνίες αλλάζουν μόνο από το ${current.channel}. Εδώ μπορείς να αλλάξεις δωμάτιο.`);
  }
  if (roomChanged && isCategoryChange(current.room, room) && !body.confirmCategory) {
    throw new ActionError("Αλλαγή κατηγορίας δωματίου: χρειάζεται επιβεβαίωση.", 409, "category");
  }
  if (roomChanged || datesChanged) await assertFree(room as number, arrival, departure, id);

  const guest = {
    firstName: body.firstName === undefined ? undefined : clean(body.firstName, 60),
    lastName: body.lastName === undefined ? undefined : clean(body.lastName, 60),
    email: body.email === undefined ? undefined : clean(body.email, 120).toLowerCase(),
    phone: body.phone === undefined ? undefined : clean(body.phone, 30),
    adults: body.adults === undefined ? undefined : int(body.adults, current.adults ?? 2),
    children: body.children === undefined ? undefined : int(body.children, current.children ?? 0),
  };

  // Keep the price rule when the dates change: a night price recomputes the total, a total stays.
  let total: number | null | undefined;
  const nights = nightsOf(arrival, departure);
  if (datesChanged && current.priceMode) {
    const resolved = resolvePrice(current.priceMode, current.nightPrice, current.totalPrice, nights);
    total = resolved.totalPrice;
    await saveMoney({
      bookingId: id,
      priceMode: current.priceMode,
      nightPrice: resolved.nightPrice,
      totalPrice: resolved.totalPrice,
      deposit: current.deposit,
      paid: current.paid,
    });
  }

  await modifyBeds24Booking(id, {
    ...(roomChanged ? { room: room as number } : {}),
    ...(datesChanged ? { arrival, departure } : {}),
    ...Object.fromEntries(Object.entries(guest).filter(([, v]) => v !== undefined)),
    ...(total !== undefined && !OTA.has(current.channel) ? { total } : {}),
  });

  await getSql()`
    update public.pyrgos_bookings set room_number = ${room}, checkin = ${arrival}::date, checkout = ${departure}::date,
      nights = ${nights},
      first_name = coalesce(${guest.firstName ?? null}, first_name), last_name = coalesce(${guest.lastName ?? null}, last_name),
      email = coalesce(${guest.email ?? null}, email), phone = coalesce(${guest.phone ?? null}, phone),
      adults = coalesce(${guest.adults ?? null}, adults), children = coalesce(${guest.children ?? null}, children),
      price = coalesce(${total ?? null}, price), updated_at = now()
    where booking_id = ${id}
  `;

  const parts = [
    roomChanged ? `${roomLabel(current.room)} → ${roomLabel(room)}` : "",
    datesChanged ? `${current.checkin}–${current.checkout} → ${arrival}–${departure}` : "",
    guest.adults !== undefined && guest.adults !== current.adults ? `ενήλικες ${current.adults ?? "?"} → ${guest.adults}` : "",
    guest.children !== undefined && guest.children !== current.children ? `παιδιά ${current.children ?? 0} → ${guest.children}` : "",
    guest.firstName !== undefined && (guest.firstName !== current.firstName || guest.lastName !== current.lastName) ? "όνομα" : "",
    guest.email !== undefined && guest.email !== current.email ? "email" : "",
    guest.phone !== undefined && guest.phone !== current.phone ? "τηλέφωνο" : "",
  ].filter(Boolean);
  await logHistory(id, roomChanged && !datesChanged ? "Μετακίνηση" : "Αλλαγή", parts.join(" · ") || "χωρίς αλλαγή", "ok");
  return { id, previousRoom: current.room };
}

// ---------- cancel ----------

export async function cancelBooking(body: any) {
  const id = clean(body.id, 20);
  const current = (await getBookingDetail(id))?.booking;
  if (!current) throw new ActionError("Η κράτηση δεν βρέθηκε.", 404);
  if (OTA.has(current.channel)) {
    throw new ActionError(`Κράτηση ${current.channel}: ακυρώνεται από το ${current.channel}, όχι από εδώ.`);
  }
  await cancelBeds24Booking(id);
  await getSql()`update public.pyrgos_bookings set status = 'cancelled', updated_at = now() where booking_id = ${id}`;
  await logHistory(id, "Ακύρωση", `${roomLabel(current.room)} · ${current.checkin}–${current.checkout}`, "ok");
  return { id };
}

// ---------- money ----------

export async function updateMoney(body: any) {
  const id = clean(body.id, 20);
  const current = (await getBookingDetail(id))?.booking;
  if (!current) throw new ActionError("Η κράτηση δεν βρέθηκε.", 404);
  const mode: PriceMode | null = body.priceMode === "night" || body.priceMode === "total" ? body.priceMode : null;
  const resolved = resolvePrice(mode, money(body.nightPrice), money(body.totalPrice), current.nights);
  const deposit = money(body.deposit);
  const paid = Boolean(body.paid);
  if (OTA.has(current.channel) && resolved.totalPrice !== null && resolved.totalPrice !== current.totalPrice && resolved.totalPrice !== current.beds24Price) {
    throw new ActionError(`Κράτηση ${current.channel}: η τιμή αλλάζει μόνο από το ${current.channel}.`);
  }
  await saveMoney({ bookingId: id, priceMode: mode, nightPrice: resolved.nightPrice, totalPrice: resolved.totalPrice, deposit, paid });

  const beds24: string[] = [];
  if (!OTA.has(current.channel) && resolved.totalPrice !== null && resolved.totalPrice !== current.beds24Price) {
    try {
      await modifyBeds24Booking(id, { total: resolved.totalPrice });
      await getSql()`update public.pyrgos_bookings set price = ${resolved.totalPrice}, price_source = 'pyrgos', updated_at = now() where booking_id = ${id}`;
      beds24.push("ok");
    } catch (error) {
      console.error("[pyrgos] price to Beds24 failed", error);
      beds24.push("failed");
    }
  }
  if (deposit !== current.deposit && deposit) beds24.push(await noteToBeds24(id, `Προκαταβολή: €${deposit}`));
  if (paid && !current.paid) beds24.push(await noteToBeds24(id, `Εξοφλήθηκε (${new Date().toLocaleDateString("el-GR", { timeZone: "Europe/Athens" })})`));

  const balance = resolved.totalPrice === null ? null : Math.round((resolved.totalPrice - (deposit ?? 0)) * 100) / 100;
  await logHistory(
    id,
    "Πληρωμή",
    [
      resolved.totalPrice !== null ? `σύνολο €${resolved.totalPrice}` : "",
      resolved.nightPrice !== null ? `€${resolved.nightPrice}/βραδιά` : "",
      deposit ? `προκαταβολή €${deposit}` : "",
      paid ? "πληρωμένη" : balance !== null ? `υπόλοιπο €${balance}` : "",
    ]
      .filter(Boolean)
      .join(" · "),
    beds24.every((b) => b === "ok") ? "ok" : "failed",
  );
  return { id, beds24: beds24.every((b) => b === "ok") ? "ok" : "failed" };
}

// ---------- beds & notes ----------

export async function updateBeds(body: any) {
  const id = clean(body.id, 20);
  const extras = {
    bookingId: id,
    bedSetup: (["double", "twin", "double_single", "double_two_singles"].includes(body.bedSetup) ? body.bedSetup : null) as BedSetup | null,
    cot: Boolean(body.cot),
    rollaway: Boolean(body.rollaway),
    other: clean(body.bedOther, 120),
  };
  await saveExtras(extras);
  const label = bedsText(extras);
  const beds24 = label ? await noteToBeds24(id, `Κρεβάτια: ${label}`) : "ok";
  await logHistory(id, "Κρεβάτια", label || "καθαρίστηκε", beds24 === "ok" ? "ok" : "failed");
  return { id, beds24: beds24 === "ok" ? "ok" : "failed" };
}

export async function addNote(body: any) {
  const id = clean(body.id, 20);
  const note = clean(body.note, 300);
  if (!note) throw new ActionError("Γράψε τη σημείωση.");
  const beds24 = await noteToBeds24(id, note);
  await getSql()`
    update public.pyrgos_bookings set notes = case when coalesce(notes, '') = '' then ${note} else notes || ' · ' || ${note} end,
      updated_at = now() where booking_id = ${id}
  `;
  await logHistory(id, "Σημείωση", note, beds24 === "ok" ? "ok" : "failed");
  return { id, beds24: beds24 === "ok" ? "ok" : "failed" };
}

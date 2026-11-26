import "server-only";
import { appendBookingNote, getBeds24WriteToken } from "@/lib/crm/booking-notes";
import { loadConfirmation, sendConfirmation } from "@/lib/crm/booking-confirmation";
import { addBeds24Charge, cancelBeds24Booking, createBeds24Booking, ensureClimateFee, ensureStayCharge, liveOverlap, modifyBeds24Booking } from "./beds24-write";
import { ensureBookingsTable } from "./bookings";
import { deleteCharge, insertCharge, logHistory, resolvePrice, saveMoney, type PriceMode } from "./ledger";
import { freeRooms, getBookingDetail } from "./plan";
import { closeHold, setHold } from "./holds";
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

/** Stay line + climate fee (ΤΑΚΚ) on the Beds24 invoice of a direct booking; never blocks the main action. */
async function syncClimateFee(id: string, nights: number) {
  try {
    const stay = await ensureStayCharge(id);
    if (stay === "added" || stay === "adjusted") await logHistory(id, "Διαμονή στο τιμολόγιο", stay === "added" ? "μπήκε στο Beds24" : "διορθώθηκε στο Beds24", "ok");
  } catch (error) {
    console.error("[pyrgos] stay charge sync failed", error);
    await logHistory(id, "Διαμονή στο τιμολόγιο", "δεν πέρασε στο Beds24", "failed").catch(() => undefined);
  }
  try {
    const outcome = await ensureClimateFee(id, nights);
    if (outcome !== "exists") await logHistory(id, "Φόρος διαμονής", `${nights} × €2 · ${outcome === "added" ? "μπήκε στο Beds24" : "διορθώθηκε στο Beds24"}`, "ok");
  } catch (error) {
    console.error("[pyrgos] climate fee sync failed", error);
    await logHistory(id, "Φόρος διαμονής", `${nights} × €2`, "failed").catch(() => undefined);
  }
}

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
  // One room, or a group: several rooms for the same guest with one price on the first (master).
  const rooms: number[] = Array.isArray(body.rooms) && body.rooms.length ? body.rooms.map(Number) : [Number(body.room)];
  const arrival = body.checkin;
  const departure = body.checkout;
  if (!rooms.length || rooms.some((room) => !roomByNumber(room)) || new Set(rooms).size !== rooms.length) {
    throw new ActionError("Διάλεξε δωμάτιο.");
  }
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

  for (const room of rooms) await assertFree(room, arrival, departure);

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
  const created: { id: string; room: number; master: string | null }[] = [];
  for (const [index, room] of rooms.entries()) {
    const master = index === 0 ? null : created[0].id;
    try {
      const { id } = await createBeds24Booking({
        ...guest,
        room,
        arrival,
        departure,
        total: index === 0 ? price.totalPrice : 0,
        notes: index === 0 ? notes : [notes, `Group με την κράτηση #${master}`].filter(Boolean).join("\n"),
        masterId: master ?? undefined,
      });
      created.push({ id, room, master });
    } catch (error) {
      if (!created.length) throw error;
      throw new ActionError(
        `Μπήκαν ${created.length} από ${rooms.length} δωμάτια (${created.map((c) => roomLabel(c.room)).join(", ")}). ` +
          `Το ${roomLabel(room)} απέτυχε: ${error instanceof Error ? error.message : "σφάλμα"}`,
        502,
      );
    }
  }

  for (const c of created) {
    const isMaster = c.master === null;
    await getSql()`
      insert into public.pyrgos_bookings (booking_id, master_id, status, channel, referer, room_number, checkin, checkout, nights,
        adults, children, first_name, last_name, email, phone, country, price, booked_at, price_source, notes)
      values (${c.id}, ${c.master ?? (rooms.length > 1 ? c.id : null)}, 'confirmed', 'Απευθείας', 'Πύργος ελέγχου', ${c.room},
        ${arrival}::date, ${departure}::date, ${nights}, ${adults}, ${children}, ${firstName}, ${lastName},
        ${guest.email || null}, ${guest.phone || null}, ${guest.country || null},
        ${isMaster ? price.totalPrice : null}, now(), ${isMaster && price.totalPrice !== null ? "pyrgos" : null}, ${notes || null})
      on conflict (booking_id) do nothing
    `;
    if (body.bedSetup || body.cot || body.rollaway || body.bedOther || body.breakfast || body.guestNote) {
      await saveExtras({
        bookingId: c.id,
        bedSetup: (body.bedSetup || null) as BedSetup | null,
        cot: Boolean(body.cot),
        rollaway: Boolean(body.rollaway),
        other: clean(body.bedOther, 120),
        breakfast: Boolean(body.breakfast),
        // The agreed note goes on the confirmation once, on the first (master) booking.
        guestNote: c.master === null ? String(body.guestNote ?? "").trim().slice(0, 1000) : "",
      });
    }
  }
  const id = created[0].id;
  const extrasLine = [body.breakfast ? "Πρωινό: περιλαμβάνεται" : "", String(body.guestNote ?? "").trim() ? `Συμφωνία (στην επιβεβαίωση): ${String(body.guestNote).trim().slice(0, 300)}` : ""]
    .filter(Boolean)
    .join(" · ");
  if (extrasLine) await noteToBeds24(id, extrasLine);
  // "Σε αναμονή": normal booking in Beds24, reminder date for the owner (all rooms of a group).
  if (body.hold && isDay(body.hold.remindOn)) {
    for (const c of created) await setHold(c.id, body.hold.remindOn, clean(body.hold.note, 200));
  }
  for (const c of created) await syncClimateFee(c.id, nights);
  for (const charge of Array.isArray(body.charges) ? body.charges.slice(0, 20) : []) {
    try {
      await addCharge({ id, description: charge?.description, qty: charge?.qty, unitPrice: charge?.unitPrice });
    } catch (error) {
      console.error("[pyrgos] charge on new booking failed", error);
    }
  }
  await saveMoney({
    bookingId: id,
    priceMode: mode,
    nightPrice: price.nightPrice,
    totalPrice: price.totalPrice,
    deposit: money(body.deposit),
    paid: Boolean(body.paid),
  });
  if (money(body.deposit)) await noteToBeds24(id, `Προκαταβολή: €${money(body.deposit)}`);

  // Owner (2026-11-20): the confirmation email is never sent automatically —
  // always previewed in the CRM and sent by hand.
  let email = "skipped";
  if (false as boolean) {
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
  for (const c of created) {
    await logHistory(
      c.id,
      rooms.length > 1 ? "Νέα κράτηση (group)" : "Νέα κράτηση",
      `${roomLabel(c.room)} · ${arrival} → ${departure} · ${adults}+${children}` +
        (c.master === null ? ` · ${price.totalPrice ?? "-"}€` : ` · μαζί με #${c.master}`) +
        (rooms.length > 1 && c.master === null ? ` · group: ${created.map((x) => roomLabel(x.room)).join(", ")}` : "") +
        (email === "sent" && c.master === null ? " · email επιβεβαίωσης" : ""),
      "ok",
    );
  }
  return { id, ids: created.map((c) => c.id), email };
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

  if (datesChanged && !OTA.has(current.channel)) await syncClimateFee(id, nights);

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
  await closeHold(id, "cancelled");
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
  if (!OTA.has(current.channel) && current.status !== "black") await syncClimateFee(id, current.nights);
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
  const guestNote = body.guestNote === undefined ? undefined : String(body.guestNote ?? "").trim().slice(0, 1000);
  const extras = {
    bookingId: id,
    bedSetup: (["double", "twin", "double_single", "double_two_singles"].includes(body.bedSetup) ? body.bedSetup : null) as BedSetup | null,
    cot: Boolean(body.cot),
    rollaway: Boolean(body.rollaway),
    other: clean(body.bedOther, 120),
    breakfast: body.breakfast === undefined ? undefined : Boolean(body.breakfast),
    guestNote,
  };
  await saveExtras(extras);
  const label = bedsText(extras);
  const lines = [
    label ? `Κρεβάτια: ${label}` : "",
    extras.breakfast ? "Πρωινό: περιλαμβάνεται" : "",
    guestNote ? `Συμφωνία (στην επιβεβαίωση): ${guestNote.slice(0, 300)}` : "",
  ].filter(Boolean);
  const beds24 = lines.length ? await noteToBeds24(id, lines.join(" · ")) : "ok";
  await logHistory(
    id,
    "Κρεβάτια & πρωινό",
    [label || "χωρίς κρεβάτια", extras.breakfast ? "πρωινό" : "", guestNote ? `σημείωση: ${guestNote.slice(0, 120)}` : ""].filter(Boolean).join(" · "),
    beds24 === "ok" ? "ok" : "failed",
  );
  return { id, beds24: beds24 === "ok" ? "ok" : "failed" };
}

/** (Re)send the booking confirmation email from the booking panel. */
export async function sendConfirmationEmail(body: any) {
  // Disabled (owner, 2026-11-20): only preview + manual send from the CRM.
  throw new ActionError("Η επιβεβαίωση στέλνεται μόνο από το CRM, μετά από preview.");
  const id = clean(body.id, 20);
  const to = clean(body.to, 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new ActionError("Μη έγκυρο email.");
  const loaded = await loadConfirmation(id);
  if (!loaded) throw new ActionError("Δεν φορτώθηκαν τα στοιχεία της κράτησης.", 502);
  await sendConfirmation(loaded.data, to, "live");
  await logHistory(id, "Email επιβεβαίωσης", to, "ok");
  return { id, warnings: loaded.warnings };
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

// ---------- swap two bookings ----------

export async function swapBookings(body: any) {
  const idA = clean(body.idA, 20);
  const idB = clean(body.idB, 20);
  const [a, b] = await Promise.all([getBookingDetail(idA), getBookingDetail(idB)]).then((r) => r.map((x) => x?.booking));
  if (!a || !b) throw new ActionError("Δεν βρέθηκαν οι κρατήσεις.", 404);
  if (!a.room || !b.room || a.room === b.room) throw new ActionError("Οι κρατήσεις πρέπει να είναι σε διαφορετικά δωμάτια.");
  if (a.status === "black" || b.status === "black") throw new ActionError("Τα μπλοκαρίσματα αλλάζουν μόνο στο Beds24.");
  if (isCategoryChange(a.room, b.room) && !body.confirmCategory) {
    throw new ActionError("Αλλαγή κατηγορίας δωματίου: χρειάζεται επιβεβαίωση.", 409, "category");
  }
  const roomA = a.room;
  const roomB = b.room;
  // A goes to B's room for A's dates, B to A's room for B's dates; only each other may be in the way.
  const freeForA = await freeRooms(a.checkin, a.checkout, a.id);
  const freeForB = await freeRooms(b.checkin, b.checkout, b.id);
  const aBlockedOnlyByB = freeForA.includes(roomB) || (await onlyOther(roomB, a.checkin, a.checkout, [a.id, b.id]));
  const bBlockedOnlyByA = freeForB.includes(roomA) || (await onlyOther(roomA, b.checkin, b.checkout, [a.id, b.id]));
  if (!aBlockedOnlyByB || !bBlockedOnlyByA) throw new ActionError("Η αντιμετάθεση δεν χωράει: υπάρχει και άλλη κράτηση στη μέση.", 409);
  for (const [room, s, e] of [[roomB, a.checkin, a.checkout], [roomA, b.checkin, b.checkout]] as const) {
    const clash = await liveOverlap(room, s, e, [a.id, b.id]);
    if (clash) throw new ActionError(`Στο Beds24 υπάρχει άλλη κράτηση στο ${roomLabel(room)} εκείνες τις μέρες.`, 409);
  }

  await modifyBeds24Booking(a.id, { room: roomB });
  try {
    await modifyBeds24Booking(b.id, { room: roomA });
  } catch (error) {
    // Put A back so nothing is left double-booked.
    await modifyBeds24Booking(a.id, { room: roomA }).catch((e) => console.error("[pyrgos] swap rollback failed", e));
    throw error;
  }
  await getSql()`update public.pyrgos_bookings set room_number = ${roomB}, updated_at = now() where booking_id = ${a.id}`;
  await getSql()`update public.pyrgos_bookings set room_number = ${roomA}, updated_at = now() where booking_id = ${b.id}`;
  const detail = `${a.firstName} ${a.lastName}: ${roomLabel(roomA)} → ${roomLabel(roomB)} ⇄ ${b.firstName} ${b.lastName}: ${roomLabel(roomB)} → ${roomLabel(roomA)}`;
  await logHistory(a.id, "Αντιμετάθεση", detail, "ok");
  await logHistory(b.id, "Αντιμετάθεση", detail, "ok");
  return { idA: a.id, idB: b.id };
}

async function onlyOther(room: number, from: string, to: string, ids: string[]) {
  const rows = (await getSql()`
    select booking_id from public.pyrgos_bookings
    where room_number = ${room} and status in ('confirmed', 'new', 'request', 'black')
      and checkin < ${to}::date and checkout > ${from}::date
  `) as { booking_id: string }[];
  const closed = (await getSql()`
    select 1 from booking_core.inventory where room_number = ${room} and stay_date >= ${from}::date and stay_date < ${to}::date
      and booking_id is null and reason = 'CLOSED' limit 1
  `) as unknown[];
  return !closed.length && rows.every((row) => ids.includes(String(row.booking_id)));
}

// ---------- split stay ----------

export async function splitBooking(body: any) {
  const id = clean(body.id, 20);
  const current = (await getBookingDetail(id))?.booking;
  if (!current) throw new ActionError("Η κράτηση δεν βρέθηκε.", 404);
  if (current.status === "black") throw new ActionError("Τα μπλοκαρίσματα αλλάζουν μόνο στο Beds24.");
  const splitDate = body.splitDate;
  const newRoom = Number(body.room);
  if (!isDay(splitDate) || splitDate <= current.checkin || splitDate >= current.checkout) {
    throw new ActionError("Η ημέρα αλλαγής πρέπει να είναι μέσα στη διαμονή.");
  }
  if (!roomByNumber(newRoom) || newRoom === current.room) throw new ActionError("Διάλεξε άλλο δωμάτιο για το δεύτερο κομμάτι.");
  if (isCategoryChange(current.room, newRoom) && !body.confirmCategory) {
    throw new ActionError("Αλλαγή κατηγορίας δωματίου: χρειάζεται επιβεβαίωση.", 409, "category");
  }
  await assertFree(newRoom, splitDate, current.checkout);

  const master = current.masterId ?? current.id;
  const originalCheckout = current.checkout;
  // 1) shorten the original to the split day; 2) create the second part linked to it, price 0
  //    (the price of the whole stay stays on the original / master booking).
  await modifyBeds24Booking(current.id, { arrival: current.checkin, departure: splitDate });
  let secondId: string;
  try {
    const created = await createBeds24Booking({
      firstName: current.firstName,
      lastName: current.lastName,
      email: current.email,
      phone: current.phone,
      country: current.country,
      adults: current.adults ?? 2,
      children: current.children ?? 0,
      room: newRoom,
      arrival: splitDate,
      departure: originalCheckout,
      total: 0,
      notes: `Split stay: συνέχεια της κράτησης #${current.id} (${roomLabel(current.room)} → ${roomLabel(newRoom)} στις ${splitDate})`,
      masterId: master,
    });
    secondId = created.id;
  } catch (error) {
    await modifyBeds24Booking(current.id, { arrival: current.checkin, departure: originalCheckout }).catch((e) =>
      console.error("[pyrgos] split rollback failed", e),
    );
    throw error;
  }
  const firstNights = nightsOf(current.checkin, splitDate);
  const secondNights = nightsOf(splitDate, originalCheckout);
  await getSql()`
    update public.pyrgos_bookings set checkout = ${splitDate}::date, nights = ${firstNights}, master_id = ${master}, updated_at = now()
    where booking_id = ${current.id}
  `;
  await getSql()`
    insert into public.pyrgos_bookings (booking_id, master_id, status, channel, referer, room_number, checkin, checkout, nights,
      adults, children, first_name, last_name, email, phone, country, price, booked_at, notes)
    select ${secondId}, ${master}, 'confirmed', channel, referer, ${newRoom}, ${splitDate}::date, ${originalCheckout}::date, ${secondNights},
      adults, children, first_name, last_name, email, phone, country, null, now(), ${`Split stay από #${current.id}`}
    from public.pyrgos_bookings where booking_id = ${current.id}
    on conflict (booking_id) do nothing
  `;
  // Beds keep following the guest into the second room.
  if (current.bedSetup || current.cot || current.rollaway || current.bedOther) {
    await saveExtras({
      bookingId: secondId,
      bedSetup: current.bedSetup as BedSetup | null,
      cot: current.cot,
      rollaway: current.rollaway,
      other: current.bedOther,
    });
  }
  if (!OTA.has(current.channel)) {
    await syncClimateFee(current.id, firstNights);
    await syncClimateFee(secondId, secondNights);
  }
  const detail = `${roomLabel(current.room)} ${current.checkin}→${splitDate} · ${roomLabel(newRoom)} ${splitDate}→${originalCheckout}`;
  await logHistory(current.id, "Split stay", `${detail} · συνέχεια #${secondId}`, "ok");
  await logHistory(secondId, "Split stay", `${detail} · από #${current.id}`, "ok");
  return { id: current.id, secondId };
}

// ---------- extra charges during the stay ----------

export async function addCharge(body: any) {
  const id = clean(body.id, 20);
  const current = (await getBookingDetail(id))?.booking;
  if (!current) throw new ActionError("Η κράτηση δεν βρέθηκε.", 404);
  const target = current.masterId ?? current.id; // a group pays on its master booking
  const description = clean(body.description, 120);
  const qty = Number(String(body.qty ?? 1).replace(",", "."));
  const unitPrice = money(body.unitPrice);
  if (!description) throw new ActionError("Γράψε περιγραφή χρέωσης.");
  if (!Number.isFinite(qty) || qty <= 0 || qty > 999) throw new ActionError("Μη έγκυρη ποσότητα.");
  if (unitPrice === null || unitPrice <= 0) throw new ActionError("Μη έγκυρη τιμή.");
  let beds24 = "ok";
  try {
    await addBeds24Charge(target, description, qty, unitPrice);
  } catch (error) {
    console.error("[pyrgos] charge to Beds24 failed", error);
    beds24 = "failed";
    await noteToBeds24(target, `Χρέωση: ${description} ${qty} × €${unitPrice}`);
  }
  await insertCharge(target, description, qty, unitPrice, beds24);
  await logHistory(target, "Χρέωση", `${description} · ${qty} × €${unitPrice} = €${Math.round(qty * unitPrice * 100) / 100}`, beds24);
  return { id: target, beds24 };
}

export async function removeCharge(body: any) {
  const chargeId = clean(body.chargeId, 20);
  if (!/^\d+$/.test(chargeId)) throw new ActionError("Μη έγκυρη χρέωση.");
  const removed = await deleteCharge(chargeId);
  if (!removed) throw new ActionError("Η χρέωση δεν βρέθηκε.", 404);
  const qty = Number(removed.qty);
  const unit = Number(removed.unit_price);
  let beds24 = "ok";
  try {
    // Beds24 history stays intact: a reversing line instead of deleting the original one.
    await addBeds24Charge(String(removed.booking_id), `Ακύρωση: ${removed.description}`, qty, -unit);
  } catch (error) {
    console.error("[pyrgos] charge reversal to Beds24 failed", error);
    beds24 = "failed";
  }
  await logHistory(String(removed.booking_id), "Διαγραφή χρέωσης", `${removed.description} · ${qty} × €${unit}`, beds24);
  return { id: String(removed.booking_id), beds24 };
}

// ---------- holds ("σε αναμονή") ----------

export async function holdSet(body: any) {
  const id = clean(body.id, 20);
  if (!isDay(body.remindOn)) throw new ActionError("Διάλεξε ημερομηνία υπενθύμισης.");
  const detail = await getBookingDetail(id);
  if (!detail) throw new ActionError("Η κράτηση δεν βρέθηκε.", 404);
  const ids = detail.group.length > 1 ? detail.group.map((g) => g.id) : [id];
  for (const bookingId of ids) await setHold(bookingId, body.remindOn, clean(body.note, 200));
  return { id };
}

export async function holdConfirm(body: any) {
  const id = clean(body.id, 20);
  const detail = await getBookingDetail(id);
  if (!detail) throw new ActionError("Η κράτηση δεν βρέθηκε.", 404);
  const ids = detail.group.length > 1 ? detail.group.map((g) => g.id) : [id];
  for (const bookingId of ids) await closeHold(bookingId, "confirmed");
  return { id };
}

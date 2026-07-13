import { NextRequest, NextResponse } from "next/server";
import { POST as handleAssistantPost } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROOM_IMAGE: Record<number, string> = {
  1: "/images/rooms/DSC07776-2-e1675109942622.webp",
  2: "/images/rooms/DSC07803-1.webp",
  3: "/images/rooms/DSC07867-1.webp",
  4: "/images/rooms/received_1748354861920234.webp",
  5: "/images/rooms/voulamandis-house-rooms.webp",
  6: "/images/rooms/received_1753964631359257.webp",
  7: "/images/rooms/double-triple-room.jpg",
  8: "/images/rooms/chios-apartments-voulamandis.webp",
  9: "/images/rooms/chios-apartments-voulamandis.webp",
  10: "/images/rooms/DSC07899.webp",
};

const FALSE_BOOKING_CLAIMS = [
  /η κράτησή σας .*επιβεβαιω/i,
  /η κράτηση .*ολοκληρώθηκε/i,
  /your booking .*confirmed/i,
  /reservation .*confirmed/i,
  /réservation .*confirmée/i,
  /buchung .*bestätigt/i,
  /prenotazione .*confermata/i,
  /reserva .*confirmada/i,
  /rezervasyon .*onaylandı/i,
];

function safeInterestMessage(language?: string) {
  if (language === "en") return "No booking has been made. Open the room card and choose Email or WhatsApp to send a request to reception.";
  return "Δεν έχει πραγματοποιηθεί κράτηση. Ανοίξτε την κάρτα και επιλέξτε Email ή WhatsApp για να σταλεί αίτημα στη reception.";
}

function noAvailabilityMessage(language?: string) {
  if (language === "en") return "Based on the most recent availability data, no confirmed option is currently showing for these details. Reception can check this immediately and reply directly. Would you like me to send them a message now?";
  return "Με βάση τα πιο πρόσφατα στοιχεία, δεν προκύπτει αυτή τη στιγμή επιβεβαιωμένη διαθεσιμότητα για τα συγκεκριμένα δεδομένα. Η reception μπορεί να το ελέγξει άμεσα και να σας απαντήσει απευθείας. Θέλετε να της στείλω μήνυμα τώρα;";
}

function splitStayMessage(language?: string) {
  if (language === "en") return "I found a smart split-stay option covering your full stay with only one room change. As a thank-you for the change, the final price includes an extra 10% discount on top of the direct rate.";
  return "Βρήκα μια έξυπνη λύση split stay που καλύπτει ολόκληρη τη διαμονή σας με μία μόνο αλλαγή δωματίου. Ως επιβράβευση για την αλλαγή, η τελική τιμή περιλαμβάνει επιπλέον έκπτωση 10% πάνω στην απευθείας τιμή.";
}

async function findSplitStays(request: NextRequest, search: any) {
  try {
    const url = new URL("/api/booking/split-stay", request.nextUrl.origin);
    url.searchParams.set("checkin", String(search.checkin));
    url.searchParams.set("checkout", String(search.checkout));
    url.searchParams.set("guests", String(search.guests));
    const response = await fetch(url, { cache: "no-store" });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(payload?.splitStays)) return [];
    return payload.splitStays;
  } catch (error) {
    console.error("Split-stay lookup failed", error);
    return [];
  }
}

function splitOffers(splitStays: any[], search: any, language?: string) {
  return splitStays.map((option, index) => {
    const first = option.first;
    const second = option.second;
    const label = language === "en" ? "Split Stay" : "Split Stay";
    const category = language === "en"
      ? `${first.name}: ${first.checkin} → ${first.checkout} · ${second.name}: ${second.checkin} → ${second.checkout}`
      : `${first.name}: ${first.checkin} → ${first.checkout} · ${second.name}: ${second.checkin} → ${second.checkout}`;
    return {
      roomId: `split:${first.roomId}:${first.unitId}:${second.roomId}:${second.unitId}`,
      unitId: String(index + 1),
      name: `${label}: Room ${first.roomNumber} → Room ${second.roomNumber}`,
      category,
      floor: language === "en" ? "One room change · extra 10% reward" : "Μία αλλαγή δωματίου · έξτρα επιβράβευση 10%",
      maxGuests: Number(search.guests || 0),
      features: [
        `${first.nights} ${language === "en" ? "nights" : "νύχτες"} · Room ${first.roomNumber}`,
        `${second.nights} ${language === "en" ? "nights" : "νύχτες"} · Room ${second.roomNumber}`,
        `${language === "en" ? "Change" : "Αλλαγή"}: ${option.changeDate}`,
        language === "en" ? "Extra split-stay discount 10%" : "Επιπλέον έκπτωση split stay 10%",
      ],
      image: ROOM_IMAGE[Number(first.roomNumber)] || "/images/rooms/double-triple-room.jpg",
      nights: Number(first.nights || 0) + Number(second.nights || 0),
      originalTotal: Number(option.originalTotal || 0),
      directTotal: Number(option.splitTotal || 0),
      saving: Number(option.saving || 0),
      splitStay: true,
      splitPlan: option,
    };
  });
}

export async function POST(request: NextRequest) {
  const response = await handleAssistantPost(request);
  const payload = await response.clone().json().catch(() => null);

  if (!payload || typeof payload !== "object") return response;

  const offers = Array.isArray(payload.offers) ? payload.offers : [];
  const isCompletedSearch = payload.action === "search_rooms" && payload.search?.checkin && payload.search?.checkout && payload.search?.guests;

  if (isCompletedSearch && offers.length === 0 && response.ok) {
    const splitStays = await findSplitStays(request, payload.search);
    if (splitStays.length) {
      return NextResponse.json(
        {
          ...payload,
          answer: splitStayMessage(payload.language),
          offers: splitOffers(splitStays, payload.search, payload.language),
          splitStayAvailable: true,
          noAvailability: false,
          receptionHandoffOffered: false,
          bookingConfirmed: false,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        ...payload,
        answer: noAvailabilityMessage(payload.language),
        offers: [],
        noAvailability: true,
        receptionHandoffOffered: true,
        bookingConfirmed: false,
      },
      { status: response.status },
    );
  }

  const answer = typeof payload.answer === "string" ? payload.answer : "";
  if (!FALSE_BOOKING_CLAIMS.some((pattern) => pattern.test(answer))) return response;

  return NextResponse.json(
    { ...payload, answer: safeInterestMessage(payload.language), offers, bookingConfirmed: false },
    { status: response.status },
  );
}

import { NextRequest, NextResponse } from "next/server";
import { POST as handleAssistantPost } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  if (language === "en") return "No booking has been made. Open the room card and choose “I'm interested” to send a request to reception.";
  if (language === "fr") return "Aucune réservation n’a été effectuée. Ouvrez la carte de la chambre et choisissez « Je suis intéressé(e) » pour envoyer une demande à la réception.";
  if (language === "de") return "Es wurde keine Buchung vorgenommen. Öffnen Sie die Zimmerkarte und wählen Sie „Ich bin interessiert“, um eine Anfrage an die Rezeption zu senden.";
  if (language === "it") return "Non è stata effettuata alcuna prenotazione. Apri la scheda della camera e scegli «Sono interessato» per inviare una richiesta alla reception.";
  if (language === "es") return "No se ha realizado ninguna reserva. Abra la tarjeta de la habitación y elija «Me interesa» para enviar una solicitud a recepción.";
  if (language === "tr") return "Herhangi bir rezervasyon yapılmadı. Oda kartını açın ve resepsiyona talep göndermek için “İlgileniyorum” seçeneğini kullanın.";
  return "Δεν έχει πραγματοποιηθεί κράτηση. Ανοίξτε την κάρτα του δωματίου και πατήστε «Ενδιαφέρομαι» για να σταλεί αίτημα στη reception.";
}

function noAvailabilityMessage(language?: string) {
  if (language === "en") return "Based on the most recent availability data, no confirmed option is currently showing for these details. Reception can check this immediately and reply directly. Would you like me to send them a message now?";
  return "Με βάση τα πιο πρόσφατα στοιχεία, δεν προκύπτει αυτή τη στιγμή επιβεβαιωμένη διαθεσιμότητα για τα συγκεκριμένα δεδομένα. Η reception μπορεί να το ελέγξει άμεσα και να σας απαντήσει απευθείας. Θέλετε να της στείλω μήνυμα τώρα;";
}

/**
 * Compatibility endpoint used by the existing room-finder frontend.
 * Every message is handled by the central AI orchestrator in ../route.ts.
 */
export async function POST(request: NextRequest) {
  const response = await handleAssistantPost(request);
  const payload = await response.clone().json().catch(() => null);

  if (!payload || typeof payload !== "object") return response;

  const offers = Array.isArray(payload.offers) ? payload.offers : [];
  const isCompletedSearch = payload.action === "search_rooms" && payload.search?.checkin && payload.search?.checkout && payload.search?.guests;

  if (isCompletedSearch && offers.length === 0 && response.ok) {
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
    {
      ...payload,
      answer: safeInterestMessage(payload.language),
      offers,
      bookingConfirmed: false,
    },
    { status: response.status },
  );
}

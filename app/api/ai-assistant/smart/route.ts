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

type SupportedLanguage = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";

function normalizeLanguage(language?: string): SupportedLanguage {
  return (["el", "en", "de", "fr", "it", "es", "tr"] as const).includes(language as SupportedLanguage)
    ? (language as SupportedLanguage)
    : "en";
}

const SCOPE_ONLY_COPY: Record<SupportedLanguage, string> = {
  el: "Μπορώ να βοηθήσω μόνο με τα δωμάτια του Voulamandis House: χαρακτηριστικά και παροχές, διαθεσιμότητα, τιμές και επικοινωνία με τη reception. Πείτε μου ημερομηνίες και αριθμό επισκεπτών ή ρωτήστε κάτι για τα δωμάτια.",
  en: "I can only help with Voulamandis House rooms: room details and amenities, availability, prices, and contacting reception. Tell me your dates and number of guests, or ask me something about the rooms.",
  de: "Ich kann nur bei Fragen zu den Zimmern im Voulamandis House helfen: Zimmerdetails und Ausstattung, Verfügbarkeit, Preise und Kontakt zur Rezeption. Nennen Sie mir Ihre Reisedaten und die Personenzahl oder fragen Sie nach den Zimmern.",
  fr: "Je peux uniquement vous aider concernant les chambres du Voulamandis House : détails et équipements, disponibilités, tarifs et contact avec la réception. Indiquez-moi vos dates et le nombre de personnes, ou posez une question sur les chambres.",
  it: "Posso aiutarti solo con le camere del Voulamandis House: dettagli e servizi, disponibilità, prezzi e contatto con la reception. Indicami le date e il numero di ospiti oppure chiedimi informazioni sulle camere.",
  es: "Solo puedo ayudarte con las habitaciones de Voulamandis House: detalles y servicios, disponibilidad, precios y contacto con recepción. Indícame las fechas y el número de huéspedes o pregúntame algo sobre las habitaciones.",
  tr: "Yalnızca Voulamandis House odaları hakkında yardımcı olabilirim: oda özellikleri ve olanakları, müsaitlik, fiyatlar ve resepsiyonla iletişim. Tarihlerinizi ve kişi sayısını yazın veya odalar hakkında bir soru sorun.",
};

const OUT_OF_SCOPE_TERMS = /(παραλί|χωρι|αξιοθέατ|μουσεί|εστιατόρ|φαγητ|καιρ|δρομολόγ|πλοί|λεωφορεί|ενοικίαση αυτοκιν|beach|village|sightseeing|museum|restaurant|food|weather|ferry|bus|car rental|strand|dorf|museum|restaurant|wetter|fähre|plage|village|musée|restaurant|météo|ferry|spiaggia|paese|museo|ristorante|meteo|traghetto|playa|pueblo|museo|restaurante|clima|ferry|plaj|köy|müze|restoran|hava|feribot)/iu;

const ROOM_SCOPE_TERMS = /(δωμάτι|διαμέρισμ|διαμον|διαθεσιμ|διαθέσιμ|τιμ|κόστος|κράτησ|ρεσεψιόν|reception|επικοινων|επισκέπτ|άτομα|άφιξ|αναχώρ|check.?in|check.?out|κρεβάτ|κουζίν|ψυγεί|κλιματισ|μπαλκόν|όροφο|σκάλα|ήσυχ|πρωιν|πάρκιν|wifi|μπάνι|ντους|φόρ|έκπτωσ|κατοικίδ|πισίν|σεσουάρ|πετσέτ|κούνια|room|apartment|stay|accommodation|availability|available|price|rate|cost|booking|reserve|reservation|contact|guest|person|arrival|departure|bed|kitchen|fridge|air condition|balcony|floor|stairs|quiet|breakfast|parking|bathroom|shower|tax|discount|pet|pool|hair.?dryer|towel|cot|crib|zimmer|wohnung|aufenthalt|verfügbar|preis|buchung|reservierung|rezeption|gast|person|ankunft|abreise|bett|küche|kühlschrank|klimaanlage|balkon|etage|treppe|ruhig|frühstück|parkplatz|badezimmer|dusche|rabatt|haustier|föhn|handtuch|chambre|appartement|séjour|disponibil|prix|réservation|réception|personne|arrivée|départ|lit|cuisine|réfrigérateur|climatisation|balcon|étage|escalier|calme|petit.?déjeuner|parking|salle de bain|douche|réduction|animal|sèche.?cheveux|serviette|camera|appartamento|soggiorno|disponibil|prezzo|prenotazione|ospit|arrivo|partenza|letto|cucina|frigorifero|aria condizionata|balcone|piano|scale|tranquill|colazione|parcheggio|bagno|doccia|sconto|animale|asciugacapelli|asciugamano|habitación|apartamento|estancia|disponibil|precio|reserva|recepción|huésped|persona|llegada|salida|cama|cocina|nevera|aire acondicionado|balcón|planta|escalera|tranquil|desayuno|aparcamiento|baño|ducha|descuento|mascota|secador|toalla|oda|daire|konaklama|müsait|fiyat|rezervasyon|resepsiyon|iletişim|kişi|giriş|çıkış|yatak|mutfak|buzdolabı|klima|balkon|kat|merdiven|sakin|kahvaltı|otopark|banyo|duş|indirim|evcil|havuz|saç kurutma|havlu)/iu;

const DATE_OR_GUEST_CONTINUATION = /(\b\d{1,2}\s*(?:[-/–]|to|until|έως|ως|bis|au|al|ile)\s*\d{1,2}\b|january|february|march|april|may|june|july|august|september|october|november|december|ιανου|φεβρου|μαρτ|απριλ|μαι|ιουν|ιουλ|αυγουστ|σεπτεμβ|οκτωβ|νοεμβ|δεκεμβ|januar|februar|märz|mai|juni|juli|oktober|dezember|janvier|février|mars|avril|juin|juillet|août|septembre|octobre|novembre|décembre|gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|dicembre|enero|febrero|abril|mayo|junio|julio|septiembre|octubre|diciembre|ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)/iu;

function latestUserText(messages: unknown): string {
  if (!Array.isArray(messages)) return "";
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index] as { role?: unknown; content?: unknown };
    if (message?.role === "user" && typeof message.content === "string") return message.content.trim();
  }
  return "";
}

function hasRoomContext(body: any): boolean {
  const search = body?.search;
  return Boolean(
    body?.selectedRoom ||
    (search && typeof search === "object" && (search.checkin || search.checkout || Number(search.guests)))
  );
}

function isRoomScopeRequest(body: any, text: string): boolean {
  if (!text) return false;
  if (OUT_OF_SCOPE_TERMS.test(text)) return false;
  if (ROOM_SCOPE_TERMS.test(text)) return true;
  if (hasRoomContext(body)) return true;
  if (DATE_OR_GUEST_CONTINUATION.test(text)) return true;
  if (Array.isArray(body?.messages) && body.messages.length > 1 && /^\s*\d{1,2}\s*$/.test(text)) return true;
  return false;
}

const COPY = {
  el: {
    safeInterest: "Δεν έχει πραγματοποιηθεί κράτηση. Ανοίξτε την κάρτα δωματίου και επιλέξτε Email ή WhatsApp για να στείλετε αίτημα στη reception.",
    noAvailability: "Με βάση τα πιο πρόσφατα στοιχεία, δεν εμφανίζεται αυτή τη στιγμή επιβεβαιωμένη διαθεσιμότητα για τα συγκεκριμένα δεδομένα. Η reception μπορεί να το ελέγξει άμεσα και να σας απαντήσει απευθείας. Θέλετε να της στείλετε μήνυμα τώρα μέσω Email ή WhatsApp;",
    splitStay: "Βρήκα μια λύση split stay που καλύπτει ολόκληρη τη διαμονή σας με μία μόνο αλλαγή δωματίου. Η τελική τιμή περιλαμβάνει επιπλέον έκπτωση 10% λόγω της αλλαγής.",
    room: "Δωμάτιο", change: "Αλλαγή", nights: "νύχτες", reward: "Μία αλλαγή δωματίου · επιπλέον έκπτωση 10%", discount: "Επιπλέον έκπτωση split stay 10%",
  },
  en: {
    safeInterest: "No booking has been made. Open the room card and choose Email or WhatsApp to send a request to reception.",
    noAvailability: "Based on the latest availability data, no confirmed option is currently showing for these details. Reception can check immediately and reply directly. Would you like to message them now by Email or WhatsApp?",
    splitStay: "I found a split-stay option covering your full stay with only one room change. The final price includes an extra 10% discount because of the change.",
    room: "Room", change: "Change", nights: "nights", reward: "One room change · extra 10% discount", discount: "Extra split-stay discount 10%",
  },
  de: {
    safeInterest: "Es wurde keine Buchung vorgenommen. Öffnen Sie die Zimmerkarte und wählen Sie E-Mail oder WhatsApp, um eine Anfrage an die Rezeption zu senden.",
    noAvailability: "Nach den neuesten Verfügbarkeitsdaten wird für diese Angaben derzeit keine bestätigte Option angezeigt. Die Rezeption kann dies sofort prüfen und Ihnen direkt antworten. Möchten Sie ihr jetzt per E-Mail oder WhatsApp schreiben?",
    splitStay: "Ich habe eine Split-Stay-Option gefunden, die Ihren gesamten Aufenthalt mit nur einem Zimmerwechsel abdeckt. Wegen des Wechsels enthält der Endpreis einen zusätzlichen Rabatt von 10 %.",
    room: "Zimmer", change: "Wechsel", nights: "Nächte", reward: "Ein Zimmerwechsel · 10 % zusätzlicher Rabatt", discount: "10 % zusätzlicher Split-Stay-Rabatt",
  },
  fr: {
    safeInterest: "Aucune réservation n’a été effectuée. Ouvrez la fiche de la chambre et choisissez E-mail ou WhatsApp pour envoyer une demande à la réception.",
    noAvailability: "D’après les dernières données de disponibilité, aucune option confirmée n’apparaît actuellement pour ces critères. La réception peut vérifier immédiatement et vous répondre directement. Souhaitez-vous lui écrire maintenant par e-mail ou WhatsApp ?",
    splitStay: "J’ai trouvé une option de séjour fractionné couvrant tout votre séjour avec un seul changement de chambre. Le prix final comprend une réduction supplémentaire de 10 % en raison du changement.",
    room: "Chambre", change: "Changement", nights: "nuits", reward: "Un changement de chambre · réduction supplémentaire de 10 %", discount: "Réduction split stay supplémentaire de 10 %",
  },
  it: {
    safeInterest: "Non è stata effettuata alcuna prenotazione. Apri la scheda della camera e scegli Email o WhatsApp per inviare una richiesta alla reception.",
    noAvailability: "In base agli ultimi dati sulla disponibilità, al momento non risulta alcuna opzione confermata per questi criteri. La reception può verificare subito e risponderti direttamente. Vuoi scrivere ora tramite Email o WhatsApp?",
    splitStay: "Ho trovato un’opzione split stay che copre l’intero soggiorno con un solo cambio di camera. Il prezzo finale include uno sconto aggiuntivo del 10% per il cambio.",
    room: "Camera", change: "Cambio", nights: "notti", reward: "Un cambio di camera · sconto aggiuntivo del 10%", discount: "Sconto split stay aggiuntivo del 10%",
  },
  es: {
    safeInterest: "No se ha realizado ninguna reserva. Abre la tarjeta de la habitación y elige Email o WhatsApp para enviar una solicitud a recepción.",
    noAvailability: "Según los datos de disponibilidad más recientes, ahora mismo no aparece ninguna opción confirmada para estos datos. Recepción puede comprobarlo inmediatamente y responderte directamente. ¿Quieres escribirles ahora por Email o WhatsApp?",
    splitStay: "He encontrado una opción de estancia dividida que cubre toda tu estancia con un solo cambio de habitación. El precio final incluye un descuento adicional del 10% por el cambio.",
    room: "Habitación", change: "Cambio", nights: "noches", reward: "Un cambio de habitación · 10% de descuento adicional", discount: "10% de descuento split stay adicional",
  },
  tr: {
    safeInterest: "Herhangi bir rezervasyon yapılmadı. Oda kartını açın ve resepsiyona talep göndermek için E-posta veya WhatsApp seçeneğini kullanın.",
    noAvailability: "En güncel müsaitlik verilerine göre bu bilgiler için şu anda onaylanmış bir seçenek görünmüyor. Resepsiyon hemen kontrol edip size doğrudan yanıt verebilir. Şimdi E-posta veya WhatsApp üzerinden mesaj göndermek ister misiniz?",
    splitStay: "Konaklamanızın tamamını yalnızca bir oda değişikliğiyle kapsayan bir split stay seçeneği buldum. Değişiklik nedeniyle son fiyata ek %10 indirim dahildir.",
    room: "Oda", change: "Değişiklik", nights: "gece", reward: "Bir oda değişikliği · ek %10 indirim", discount: "Ek %10 split stay indirimi",
  },
} satisfies Record<SupportedLanguage, Record<string, string>>;

function copy(language?: string) {
  return COPY[normalizeLanguage(language)];
}

function safeInterestMessage(language?: string) {
  return copy(language).safeInterest;
}

function noAvailabilityMessage(language?: string) {
  return copy(language).noAvailability;
}

function splitStayMessage(language?: string) {
  return copy(language).splitStay;
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
  const text = copy(language);
  return splitStays.map((option, index) => {
    const first = option.first;
    const second = option.second;
    const category = `${first.name}: ${first.checkin} → ${first.checkout} · ${second.name}: ${second.checkin} → ${second.checkout}`;
    return {
      roomId: `split:${first.roomId}:${first.unitId}:${second.roomId}:${second.unitId}`,
      unitId: String(index + 1),
      name: `Split Stay: ${text.room} ${first.roomNumber} → ${text.room} ${second.roomNumber}`,
      category,
      floor: text.reward,
      maxGuests: Number(search.guests || 0),
      features: [
        `${first.nights} ${text.nights} · ${text.room} ${first.roomNumber}`,
        `${second.nights} ${text.nights} · ${text.room} ${second.roomNumber}`,
        `${text.change}: ${option.changeDate}`,
        text.discount,
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
  const body = await request.clone().json().catch(() => null);
  const language = normalizeLanguage(body?.language);
  const userText = latestUserText(body?.messages);

  if (!isRoomScopeRequest(body, userText)) {
    return NextResponse.json({
      answer: SCOPE_ONLY_COPY[language],
      search: body?.search && typeof body.search === "object" ? body.search : {},
      offers: [],
      language,
      action: "respond",
      outOfScope: true,
      scopeRestricted: true,
      bookingConfirmed: false,
    });
  }

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

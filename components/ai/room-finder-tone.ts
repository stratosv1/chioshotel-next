import type { RoomFinderLanguage } from "./room-finder-copy";

export type RoomFinderTone = {
  checkout: string;
  rooms: string;
  guests: (room: number) => string;
  searching: string;
  results: (group: number, guests: number) => string;
  selected: (room: string) => string;
  finalizing: string;
  invalidDate: string;
  invalidCheckout: string;
  unavailable: string;
};

export const ROOM_FINDER_TONE: Record<RoomFinderLanguage, RoomFinderTone> = {
  el: {
    checkout: "Ποια ημερομηνία θα θέλατε για check-out;",
    rooms: "Πόσα δωμάτια χρειάζεστε;",
    guests: room => `Πόσα άτομα θα μείνουν στο δωμάτιο ${room};`,
    searching: "Ελέγχω τώρα τη live διαθεσιμότητα για εσάς…",
    results: (group, guests) => `Βρήκα αυτές τις διαθέσιμες επιλογές για την ομάδα ${group} · ${guests} ${guests === 1 ? "άτομο" : "άτομα"}.`,
    selected: room => `Σημείωσα το ${room} ως επιλογή σας.`,
    finalizing: "Ετοιμάζω τη σύνοψη της αίτησής σας.",
    invalidDate: "Πότε θα θέλατε να κάνετε check-in;",
    invalidCheckout: "Το check-out πρέπει να είναι μετά το check-in. Ποια ημερομηνία θέλετε για αναχώρηση;",
    unavailable: "Πιθανώς δεν υπάρχει διαθεσιμότητα για αυτά τα στοιχεία. Επικοινωνήστε με τη Reception μέσω WhatsApp για επιβεβαίωση και για να ελέγξουμε τυχόν εναλλακτική.",
  },
  en: {
    checkout: "What date would you like to check out?",
    rooms: "How many rooms do you need?",
    guests: room => `How many guests will stay in room ${room}?`,
    searching: "I’m checking live availability for you now…",
    results: (group, guests) => `I found these available options for group ${group} · ${guests} ${guests === 1 ? "guest" : "guests"}.`,
    selected: room => `I’ve saved ${room} as your selection.`,
    finalizing: "I’m preparing your request summary.",
    invalidDate: "When would you like to check in?",
    invalidCheckout: "Check-out must be after check-in. What departure date would you like?",
    unavailable: "There may be no availability for these details. Please contact Reception on WhatsApp so we can confirm and check any alternative.",
  },
  de: {
    checkout: "An welchem Datum möchten Sie auschecken?",
    rooms: "Wie viele Zimmer benötigen Sie?",
    guests: room => `Wie viele Gäste übernachten in Zimmer ${room}?`,
    searching: "Ich prüfe jetzt die Live-Verfügbarkeit für Sie…",
    results: (group, guests) => `Ich habe diese verfügbaren Optionen für Gruppe ${group} · ${guests} ${guests === 1 ? "Gast" : "Gäste"} gefunden.`,
    selected: room => `Ich habe ${room} als Ihre Auswahl gespeichert.`,
    finalizing: "Ich bereite Ihre Anfrageübersicht vor.",
    invalidDate: "Wann möchten Sie einchecken?",
    invalidCheckout: "Der Check-out muss nach dem Check-in liegen. Welches Abreisedatum wünschen Sie?",
    unavailable: "Möglicherweise gibt es für diese Angaben keine Verfügbarkeit. Kontaktieren Sie bitte die Rezeption über WhatsApp, damit wir dies bestätigen und Alternativen prüfen können.",
  },
  fr: {
    checkout: "Quelle date souhaitez-vous pour le check-out ?",
    rooms: "De combien de chambres avez-vous besoin ?",
    guests: room => `Combien de personnes séjourneront dans la chambre ${room} ?`,
    searching: "Je vérifie maintenant les disponibilités en direct…",
    results: (group, guests) => `J’ai trouvé ces options disponibles pour le groupe ${group} · ${guests} ${guests === 1 ? "personne" : "personnes"}.`,
    selected: room => `J’ai enregistré ${room} comme votre choix.`,
    finalizing: "Je prépare le récapitulatif de votre demande.",
    invalidDate: "Quand souhaitez-vous faire le check-in ?",
    invalidCheckout: "Le check-out doit être après le check-in. Quelle date de départ souhaitez-vous ?",
    unavailable: "Il est possible qu’il n’y ait pas de disponibilité pour ces informations. Contactez la réception via WhatsApp afin que nous puissions confirmer et vérifier une éventuelle alternative.",
  },
  it: {
    checkout: "Quale data desiderate per il check-out?",
    rooms: "Di quante camere avete bisogno?",
    guests: room => `Quante persone soggiorneranno nella camera ${room}?`,
    searching: "Sto controllando ora la disponibilità in tempo reale…",
    results: (group, guests) => `Ho trovato queste opzioni disponibili per il gruppo ${group} · ${guests} ${guests === 1 ? "persona" : "persone"}.`,
    selected: room => `Ho salvato ${room} come vostra scelta.`,
    finalizing: "Sto preparando il riepilogo della vostra richiesta.",
    invalidDate: "Quando desiderate effettuare il check-in?",
    invalidCheckout: "Il check-out deve essere successivo al check-in. Quale data di partenza desiderate?",
    unavailable: "È possibile che non ci sia disponibilità per questi dati. Contattate la Reception su WhatsApp per una conferma e per verificare eventuali alternative.",
  },
  es: {
    checkout: "¿Qué fecha desean para el check-out?",
    rooms: "¿Cuántas habitaciones necesitan?",
    guests: room => `¿Cuántas personas se alojarán en la habitación ${room}?`,
    searching: "Estoy comprobando ahora la disponibilidad en tiempo real…",
    results: (group, guests) => `He encontrado estas opciones disponibles para el grupo ${group} · ${guests} ${guests === 1 ? "persona" : "personas"}.`,
    selected: room => `He guardado ${room} como su elección.`,
    finalizing: "Estoy preparando el resumen de su solicitud.",
    invalidDate: "¿Cuándo desean hacer el check-in?",
    invalidCheckout: "El check-out debe ser posterior al check-in. ¿Qué fecha de salida desean?",
    unavailable: "Es posible que no haya disponibilidad para estos datos. Contacten con Recepción por WhatsApp para confirmarlo y revisar alguna alternativa.",
  },
  tr: {
    checkout: "Hangi tarihte çıkış yapmak istersiniz?",
    rooms: "Kaç odaya ihtiyacınız var?",
    guests: room => `${room}. odada kaç kişi kalacak?`,
    searching: "Canlı müsaitliği şimdi kontrol ediyorum…",
    results: (group, guests) => `${group}. grup · ${guests} kişi için bu müsait seçenekleri buldum.`,
    selected: room => `${room} seçiminizi kaydettim.`,
    finalizing: "Talep özetinizi hazırlıyorum.",
    invalidDate: "Ne zaman giriş yapmak istersiniz?",
    invalidCheckout: "Çıkış tarihi giriş tarihinden sonra olmalıdır. Hangi tarihte ayrılmak istersiniz?",
    unavailable: "Bu bilgiler için müsaitlik olmayabilir. Kesinleştirmek ve olası bir alternatifi kontrol etmek için Reception ile WhatsApp üzerinden iletişime geçin.",
  },
};
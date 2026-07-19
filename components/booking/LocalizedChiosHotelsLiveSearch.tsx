"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import type { ChiosHotelsGuideLocale } from "@/lib/chios-hotels-guide-i18n";

const CONSENT_KEY = "vh_cookie_consent_v1";

type SearchRoom = {
  roomId: string;
  unitId: string;
  roomNumber?: number;
  name?: string;
  category?: string;
  floor?: string;
  maxGuests?: number;
  nights?: number;
  totalPrice?: number;
};

type SearchPayload = {
  success?: boolean;
  message?: string;
  nights?: number;
  rooms?: { available?: SearchRoom[]; unavailable?: SearchRoom[] };
  summary?: { availableRooms?: number; unavailableRooms?: number };
  _booking_engine?: { generatedAt?: string; totalMs?: number };
};

type Copy = {
  kicker: string;
  title: string;
  intro: string;
  distinctionLabel: string;
  distinction: string;
  shortcutsLabel: string;
  tonight: string;
  tomorrow: string;
  weekend: string;
  checkin: string;
  checkout: string;
  guests: string;
  guest: string;
  guestsPlural: string;
  search: string;
  loading: string;
  invalidDates: string;
  unavailableError: string;
  resultsKicker: string;
  availableOne: string;
  availableMany: string;
  noOption: string;
  night: string;
  nights: string;
  checked: string;
  availableBadge: string;
  completeStay: string;
  perNight: string;
  viewRoom: string;
  noAvailabilityText: string;
  askWhatsapp: string;
  tryAi: string;
  helpText: string;
  whatsappReception: string;
  continueRates: string;
  whatsappMessage: (checkin: string, checkout: string, guests: number) => string;
};

const COPY: Record<ChiosHotelsGuideLocale, Copy> = {
  en: {
    kicker: "REAL DATES • REAL PROPERTY DATA",
    title: "Search live rooms and apartments in Chios",
    intro: "Enter your actual dates and number of guests. Results come from the same availability system used by the Voulamandis House booking tools. Prices shown are for the complete stay and are not market averages for other Chios hotels.",
    distinctionLabel: "Clear distinction:",
    distinction: "this search only shows rooms and apartments at Voulamandis House, a family-run guest accommodation in Kambos. It is not a directory of every hotel on Chios.",
    shortcutsLabel: "Popular date shortcuts",
    tonight: "Tonight",
    tomorrow: "Tomorrow",
    weekend: "This weekend",
    checkin: "Check-in",
    checkout: "Check-out",
    guests: "Guests",
    guest: "guest",
    guestsPlural: "guests",
    search: "Search available stays",
    loading: "Checking live availability…",
    invalidDates: "Please choose a checkout date after your check-in date.",
    unavailableError: "Live availability is temporarily unavailable.",
    resultsKicker: "LIVE RESULTS",
    availableOne: "1 available option",
    availableMany: "available options",
    noOption: "No confirmed option is showing for these dates",
    night: "night",
    nights: "nights",
    checked: "Checked from current property data",
    availableBadge: "Available for these dates",
    completeStay: "Complete stay",
    perNight: "per night",
    viewRoom: "View room",
    noAvailabilityText: "No confirmed room is currently showing for the selected dates and guest count. This does not create a booking or waiting-list request. Reception can check alternatives, date flexibility or a possible split stay directly.",
    askWhatsapp: "Ask on WhatsApp",
    tryAi: "Try the AI Room Finder",
    helpText: "Need help choosing between floors, bed layouts or apartments? Send the dates to reception before starting a booking.",
    whatsappReception: "WhatsApp reception",
    continueRates: "Continue to direct rates",
    whatsappMessage: (checkin, checkout, guests) => `Hello Voulamandis House, I am checking accommodation in Chios for ${checkin} to ${checkout}, ${guests} guest${guests === 1 ? "" : "s"}. Could you help me with availability?`,
  },
  el: {
    kicker: "ΠΡΑΓΜΑΤΙΚΕΣ ΗΜΕΡΟΜΗΝΙΕΣ • ΠΡΑΓΜΑΤΙΚΑ ΔΕΔΟΜΕΝΑ",
    title: "Ζωντανός έλεγχος για δωμάτια και διαμερίσματα στη Χίο",
    intro: "Εισαγάγετε τις πραγματικές ημερομηνίες και τον αριθμό επισκεπτών. Τα αποτελέσματα προέρχονται από το ίδιο σύστημα διαθεσιμότητας που χρησιμοποιούν τα εργαλεία κρατήσεων του Voulamandis House. Οι τιμές αφορούν ολόκληρη τη διαμονή και όχι μέσες τιμές άλλων ξενοδοχείων στη Χίο.",
    distinctionLabel: "Σαφής διάκριση:",
    distinction: "η αναζήτηση εμφανίζει μόνο δωμάτια και διαμερίσματα του Voulamandis House, ενός οικογενειακού καταλύματος στον Κάμπο. Δεν αποτελεί κατάλογο όλων των ξενοδοχείων της Χίου.",
    shortcutsLabel: "Γρήγορες επιλογές ημερομηνιών",
    tonight: "Απόψε",
    tomorrow: "Αύριο",
    weekend: "Αυτό το Σαββατοκύριακο",
    checkin: "Άφιξη",
    checkout: "Αναχώρηση",
    guests: "Επισκέπτες",
    guest: "επισκέπτης",
    guestsPlural: "επισκέπτες",
    search: "Αναζήτηση διαθεσιμότητας",
    loading: "Έλεγχος διαθεσιμότητας…",
    invalidDates: "Επιλέξτε ημερομηνία αναχώρησης μετά την άφιξη.",
    unavailableError: "Η ζωντανή διαθεσιμότητα δεν είναι προσωρινά διαθέσιμη.",
    resultsKicker: "ΖΩΝΤΑΝΑ ΑΠΟΤΕΛΕΣΜΑΤΑ",
    availableOne: "1 διαθέσιμη επιλογή",
    availableMany: "διαθέσιμες επιλογές",
    noOption: "Δεν εμφανίζεται επιβεβαιωμένη επιλογή για αυτές τις ημερομηνίες",
    night: "νύχτα",
    nights: "νύχτες",
    checked: "Έλεγχος από τα τρέχοντα δεδομένα του καταλύματος",
    availableBadge: "Διαθέσιμο για αυτές τις ημερομηνίες",
    completeStay: "Συνολική διαμονή",
    perNight: "ανά νύχτα",
    viewRoom: "Δείτε το δωμάτιο",
    noAvailabilityText: "Δεν εμφανίζεται επιβεβαιωμένο δωμάτιο για τις επιλεγμένες ημερομηνίες και τον αριθμό επισκεπτών. Δεν δημιουργείται κράτηση ή λίστα αναμονής. Η υποδοχή μπορεί να ελέγξει εναλλακτικές ημερομηνίες ή πιθανό split stay.",
    askWhatsapp: "Ρωτήστε στο WhatsApp",
    tryAi: "Δοκιμάστε το AI Room Finder",
    helpText: "Χρειάζεστε βοήθεια για όροφο, διάταξη κρεβατιών ή διαμέρισμα; Στείλτε τις ημερομηνίες στην υποδοχή πριν ξεκινήσετε κράτηση.",
    whatsappReception: "WhatsApp υποδοχής",
    continueRates: "Συνέχεια στις απευθείας τιμές",
    whatsappMessage: (checkin, checkout, guests) => `Γεια σας Voulamandis House, ελέγχω διαμονή στη Χίο από ${checkin} έως ${checkout} για ${guests} ${guests === 1 ? "επισκέπτη" : "επισκέπτες"}. Μπορείτε να με βοηθήσετε με τη διαθεσιμότητα;`,
  },
  fr: {
    kicker: "VRAIES DATES • DONNÉES RÉELLES",
    title: "Rechercher les chambres et appartements disponibles à Chios",
    intro: "Indiquez vos dates réelles et le nombre de voyageurs. Les résultats proviennent du même système de disponibilités que les outils de réservation du Voulamandis House. Les prix concernent le séjour complet et ne représentent pas la moyenne des autres hôtels de Chios.",
    distinctionLabel: "Distinction claire :",
    distinction: "cette recherche affiche uniquement les chambres et appartements du Voulamandis House, un hébergement familial à Kambos. Elle ne répertorie pas tous les hôtels de Chios.",
    shortcutsLabel: "Raccourcis de dates",
    tonight: "Ce soir",
    tomorrow: "Demain",
    weekend: "Ce week-end",
    checkin: "Arrivée",
    checkout: "Départ",
    guests: "Voyageurs",
    guest: "voyageur",
    guestsPlural: "voyageurs",
    search: "Rechercher les disponibilités",
    loading: "Vérification des disponibilités…",
    invalidDates: "Choisissez une date de départ postérieure à la date d’arrivée.",
    unavailableError: "Les disponibilités en direct sont temporairement indisponibles.",
    resultsKicker: "RÉSULTATS EN DIRECT",
    availableOne: "1 option disponible",
    availableMany: "options disponibles",
    noOption: "Aucune option confirmée pour ces dates",
    night: "nuit",
    nights: "nuits",
    checked: "Vérifié avec les données actuelles de l’hébergement",
    availableBadge: "Disponible pour ces dates",
    completeStay: "Séjour complet",
    perNight: "par nuit",
    viewRoom: "Voir la chambre",
    noAvailabilityText: "Aucune chambre confirmée n’apparaît pour les dates et le nombre de voyageurs choisis. Cela ne crée ni réservation ni liste d’attente. La réception peut vérifier d’autres dates ou un éventuel séjour partagé.",
    askWhatsapp: "Demander sur WhatsApp",
    tryAi: "Essayer l’AI Room Finder",
    helpText: "Besoin d’aide pour choisir l’étage, les lits ou un appartement ? Envoyez vos dates à la réception avant de commencer une réservation.",
    whatsappReception: "WhatsApp réception",
    continueRates: "Voir les tarifs directs",
    whatsappMessage: (checkin, checkout, guests) => `Bonjour Voulamandis House, je recherche un hébergement à Chios du ${checkin} au ${checkout} pour ${guests} ${guests === 1 ? "voyageur" : "voyageurs"}. Pouvez-vous m’aider avec les disponibilités ?`,
  },
  de: {
    kicker: "ECHTE DATEN • ECHTE UNTERKUNFTSDATEN",
    title: "Live verfügbare Zimmer und Apartments auf Chios suchen",
    intro: "Geben Sie Ihre tatsächlichen Reisedaten und die Gästezahl ein. Die Ergebnisse stammen aus demselben Verfügbarkeitssystem wie die Buchungswerkzeuge des Voulamandis House. Die Preise gelten für den gesamten Aufenthalt und sind keine Durchschnittspreise anderer Hotels auf Chios.",
    distinctionLabel: "Klare Abgrenzung:",
    distinction: "die Suche zeigt ausschließlich Zimmer und Apartments im Voulamandis House, einer familiengeführten Gästeunterkunft in Kambos. Sie ist kein Verzeichnis aller Hotels auf Chios.",
    shortcutsLabel: "Schnelle Datumsauswahl",
    tonight: "Heute Nacht",
    tomorrow: "Morgen",
    weekend: "Dieses Wochenende",
    checkin: "Anreise",
    checkout: "Abreise",
    guests: "Gäste",
    guest: "Gast",
    guestsPlural: "Gäste",
    search: "Verfügbarkeit suchen",
    loading: "Live-Verfügbarkeit wird geprüft…",
    invalidDates: "Wählen Sie ein Abreisedatum nach dem Anreisedatum.",
    unavailableError: "Die Live-Verfügbarkeit ist vorübergehend nicht erreichbar.",
    resultsKicker: "LIVE-ERGEBNISSE",
    availableOne: "1 verfügbare Option",
    availableMany: "verfügbare Optionen",
    noOption: "Für diese Daten wird keine bestätigte Option angezeigt",
    night: "Nacht",
    nights: "Nächte",
    checked: "Mit aktuellen Unterkunftsdaten geprüft",
    availableBadge: "Für diese Daten verfügbar",
    completeStay: "Gesamter Aufenthalt",
    perNight: "pro Nacht",
    viewRoom: "Zimmer ansehen",
    noAvailabilityText: "Für die gewählten Daten und die Gästezahl wird aktuell kein bestätigtes Zimmer angezeigt. Dadurch entsteht keine Buchung oder Warteliste. Die Rezeption kann Alternativdaten oder einen möglichen Split Stay prüfen.",
    askWhatsapp: "Per WhatsApp fragen",
    tryAi: "AI Room Finder testen",
    helpText: "Benötigen Sie Hilfe bei Etage, Bettenaufteilung oder Apartment? Senden Sie die Daten vor der Buchung an die Rezeption.",
    whatsappReception: "WhatsApp Rezeption",
    continueRates: "Zu den Direktpreisen",
    whatsappMessage: (checkin, checkout, guests) => `Hallo Voulamandis House, ich suche eine Unterkunft auf Chios vom ${checkin} bis ${checkout} für ${guests} ${guests === 1 ? "Gast" : "Gäste"}. Können Sie mir bei der Verfügbarkeit helfen?`,
  },
  it: {
    kicker: "DATE REALI • DATI REALI DELLA STRUTTURA",
    title: "Cerca camere e appartamenti disponibili a Chios",
    intro: "Inserisci le date effettive e il numero di ospiti. I risultati provengono dallo stesso sistema di disponibilità utilizzato dagli strumenti di prenotazione del Voulamandis House. I prezzi riguardano l’intero soggiorno e non sono medie degli altri hotel di Chios.",
    distinctionLabel: "Distinzione chiara:",
    distinction: "la ricerca mostra soltanto camere e appartamenti del Voulamandis House, una struttura familiare a Kambos. Non è un elenco di tutti gli hotel di Chios.",
    shortcutsLabel: "Scelte rapide delle date",
    tonight: "Questa notte",
    tomorrow: "Domani",
    weekend: "Questo fine settimana",
    checkin: "Arrivo",
    checkout: "Partenza",
    guests: "Ospiti",
    guest: "ospite",
    guestsPlural: "ospiti",
    search: "Cerca disponibilità",
    loading: "Controllo disponibilità…",
    invalidDates: "Scegli una data di partenza successiva all’arrivo.",
    unavailableError: "La disponibilità in tempo reale è temporaneamente non disponibile.",
    resultsKicker: "RISULTATI IN TEMPO REALE",
    availableOne: "1 opzione disponibile",
    availableMany: "opzioni disponibili",
    noOption: "Nessuna opzione confermata per queste date",
    night: "notte",
    nights: "notti",
    checked: "Verificato con i dati attuali della struttura",
    availableBadge: "Disponibile per queste date",
    completeStay: "Soggiorno completo",
    perNight: "a notte",
    viewRoom: "Vedi camera",
    noAvailabilityText: "Nessuna camera confermata risulta disponibile per le date e il numero di ospiti selezionati. Non viene creata una prenotazione o lista d’attesa. La reception può controllare date alternative o un possibile split stay.",
    askWhatsapp: "Chiedi su WhatsApp",
    tryAi: "Prova l’AI Room Finder",
    helpText: "Hai bisogno di aiuto per piano, letti o appartamento? Invia le date alla reception prima di iniziare la prenotazione.",
    whatsappReception: "WhatsApp reception",
    continueRates: "Vai alle tariffe dirette",
    whatsappMessage: (checkin, checkout, guests) => `Buongiorno Voulamandis House, cerco un alloggio a Chios dal ${checkin} al ${checkout} per ${guests} ${guests === 1 ? "ospite" : "ospiti"}. Potete aiutarmi con la disponibilità?`,
  },
  es: {
    kicker: "FECHAS REALES • DATOS REALES",
    title: "Buscar habitaciones y apartamentos disponibles en Chios",
    intro: "Introduzca sus fechas reales y el número de huéspedes. Los resultados proceden del mismo sistema de disponibilidad utilizado por las herramientas de reserva de Voulamandis House. Los precios corresponden a la estancia completa y no son medias de otros hoteles de Chios.",
    distinctionLabel: "Distinción clara:",
    distinction: "la búsqueda muestra únicamente habitaciones y apartamentos de Voulamandis House, un alojamiento familiar en Kambos. No es un directorio de todos los hoteles de Chios.",
    shortcutsLabel: "Accesos rápidos de fechas",
    tonight: "Esta noche",
    tomorrow: "Mañana",
    weekend: "Este fin de semana",
    checkin: "Entrada",
    checkout: "Salida",
    guests: "Huéspedes",
    guest: "huésped",
    guestsPlural: "huéspedes",
    search: "Buscar disponibilidad",
    loading: "Consultando disponibilidad…",
    invalidDates: "Seleccione una fecha de salida posterior a la entrada.",
    unavailableError: "La disponibilidad en directo no está disponible temporalmente.",
    resultsKicker: "RESULTADOS EN DIRECTO",
    availableOne: "1 opción disponible",
    availableMany: "opciones disponibles",
    noOption: "No aparece ninguna opción confirmada para estas fechas",
    night: "noche",
    nights: "noches",
    checked: "Comprobado con los datos actuales del alojamiento",
    availableBadge: "Disponible para estas fechas",
    completeStay: "Estancia completa",
    perNight: "por noche",
    viewRoom: "Ver habitación",
    noAvailabilityText: "No aparece ninguna habitación confirmada para las fechas y el número de huéspedes seleccionados. Esto no crea una reserva ni una lista de espera. Recepción puede revisar fechas alternativas o una posible estancia dividida.",
    askWhatsapp: "Preguntar por WhatsApp",
    tryAi: "Probar AI Room Finder",
    helpText: "¿Necesita ayuda para elegir planta, camas o apartamento? Envíe las fechas a recepción antes de iniciar la reserva.",
    whatsappReception: "WhatsApp recepción",
    continueRates: "Continuar a tarifas directas",
    whatsappMessage: (checkin, checkout, guests) => `Hola Voulamandis House, busco alojamiento en Chios del ${checkin} al ${checkout} para ${guests} ${guests === 1 ? "huésped" : "huéspedes"}. ¿Pueden ayudarme con la disponibilidad?`,
  },
  tr: {
    kicker: "GERÇEK TARİHLER • GERÇEK TESİS VERİLERİ",
    title: "Sakız Adası’nda müsait oda ve daireleri canlı arayın",
    intro: "Gerçek tarihlerinizi ve misafir sayısını girin. Sonuçlar Voulamandis House rezervasyon araçlarının kullandığı aynı müsaitlik sisteminden gelir. Gösterilen fiyatlar tüm konaklama içindir; Sakız Adası’ndaki diğer otellerin ortalama fiyatı değildir.",
    distinctionLabel: "Açık ayrım:",
    distinction: "bu arama yalnızca Kambos’taki aile işletmesi Voulamandis House’un oda ve dairelerini gösterir. Sakız Adası’ndaki tüm otellerin listesi değildir.",
    shortcutsLabel: "Hızlı tarih seçenekleri",
    tonight: "Bu gece",
    tomorrow: "Yarın",
    weekend: "Bu hafta sonu",
    checkin: "Giriş",
    checkout: "Çıkış",
    guests: "Misafirler",
    guest: "misafir",
    guestsPlural: "misafir",
    search: "Müsaitlik ara",
    loading: "Canlı müsaitlik kontrol ediliyor…",
    invalidDates: "Çıkış tarihini giriş tarihinden sonra seçin.",
    unavailableError: "Canlı müsaitlik geçici olarak kullanılamıyor.",
    resultsKicker: "CANLI SONUÇLAR",
    availableOne: "1 müsait seçenek",
    availableMany: "müsait seçenek",
    noOption: "Bu tarihler için doğrulanmış seçenek görünmüyor",
    night: "gece",
    nights: "gece",
    checked: "Güncel tesis verileriyle kontrol edildi",
    availableBadge: "Bu tarihler için müsait",
    completeStay: "Toplam konaklama",
    perNight: "gecelik",
    viewRoom: "Odayı incele",
    noAvailabilityText: "Seçilen tarihler ve misafir sayısı için doğrulanmış oda görünmüyor. Bu işlem rezervasyon veya bekleme listesi oluşturmaz. Resepsiyon alternatif tarihleri ya da olası split stay seçeneğini kontrol edebilir.",
    askWhatsapp: "WhatsApp’tan sor",
    tryAi: "AI Room Finder’ı dene",
    helpText: "Kat, yatak düzeni veya daire seçimi için yardıma mı ihtiyacınız var? Rezervasyona başlamadan önce tarihleri resepsiyona gönderin.",
    whatsappReception: "WhatsApp resepsiyon",
    continueRates: "Doğrudan fiyatlara geç",
    whatsappMessage: (checkin, checkout, guests) => `Merhaba Voulamandis House, ${checkin} - ${checkout} tarihleri arasında ${guests} misafir için Sakız Adası konaklaması arıyorum. Müsaitlik konusunda yardımcı olabilir misiniz?`,
  },
};

const INTL_LOCALE: Record<ChiosHotelsGuideLocale, string> = {
  en: "en-GB",
  el: "el-GR",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
  tr: "tr-TR",
};

const ROUTES: Record<ChiosHotelsGuideLocale, { rooms: string; standard: string; economy: string; family: string; rates: string; ai: string }> = {
  en: { rooms: "/chios-rooms/", standard: "/chios-rooms/standard-double-room/", economy: "/chios-rooms/economy-double-rooms/", family: "/chios-rooms/family-chios-apartments/", rates: "/chios-hotels-rates/", ai: "/ai-assistant/?lang=en" },
  el: { rooms: "/el/domatia-xios/", standard: "/el/domatia-xios/diklina-triklina-domatia/", economy: "/el/domatia-xios/oikonomiko-diklino-domatio/", family: "/el/domatia-xios/oikogeneiako-diamerisma/", rates: "/el/amesi-kratisi-voulamandis-house/", ai: "/ai-assistant/?lang=el" },
  fr: { rooms: "/fr/chambres-a-chios/", standard: "/fr/chambres-a-chios/chambres-doubles-standard/", economy: "/fr/chambres-a-chios/chambres-doubles-economiques/", family: "/fr/chambres-a-chios/appartements-familiaux-de-chios/", rates: "/fr/tarifs-des-hotels-a-chios/", ai: "/ai-assistant/?lang=fr" },
  de: { rooms: "/de/chios-zimmer/", standard: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/", economy: "/de/zimmer-chios/economy-zimmer-auf-chios/", family: "/de/zimmer-chios/familienapartments-in-chios/", rates: "/de/hotelpreise-auf-der-insel-chios/", ai: "/ai-assistant/?lang=de" },
  it: { rooms: "/it/camere-a-chios/", standard: "/it/stanze-a-chios/camere-doppie-standard-chios/", economy: "/it/stanze-a-chios/camera-doppia-economica-chios/", family: "/it/stanze-a-chios/appartamenti-familiari-a-chios/", rates: "/it/prezzi-hotel-chios/", ai: "/ai-assistant/?lang=it" },
  es: { rooms: "/es/habitaciones-en-chios/", standard: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/", economy: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/", family: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/", rates: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/", ai: "/ai-assistant/?lang=es" },
  tr: { rooms: "/tr/sakiz-adasi-odalari/", standard: "/tr/chios-odalari/standart-cift-kisilik-odalar/", economy: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/", family: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/", rates: "/tr/sakiz-adasi-rezervasyon/", ai: "/ai-assistant/?lang=tr" },
};

type FeatureKey = "upperFloor" | "groundFloor" | "privateBalcony" | "doubleBed" | "kitchenette" | "noStairs" | "gardenAccess" | "fullKitchen" | "livingArea" | "familyLayout" | "upTo2" | "upTo3" | "upTo4" | "upTo5";

const FEATURE_COPY: Record<ChiosHotelsGuideLocale, Record<FeatureKey, string>> = {
  en: { upperFloor: "Upper floor", groundFloor: "Ground floor", privateBalcony: "Private balcony", doubleBed: "Double bed", kitchenette: "Kitchenette", noStairs: "No stairs", gardenAccess: "Garden access", fullKitchen: "Full kitchen", livingArea: "Living area", familyLayout: "Family layout", upTo2: "2 guests", upTo3: "Up to 3 guests", upTo4: "Up to 4 guests", upTo5: "Up to 5 guests by arrangement" },
  el: { upperFloor: "Επάνω όροφος", groundFloor: "Ισόγειο", privateBalcony: "Ιδιωτικό μπαλκόνι", doubleBed: "Διπλό κρεβάτι", kitchenette: "Μικρή κουζίνα", noStairs: "Χωρίς σκάλες", gardenAccess: "Πρόσβαση στον κήπο", fullKitchen: "Πλήρης κουζίνα", livingArea: "Καθιστικό", familyLayout: "Οικογενειακή διάταξη", upTo2: "2 επισκέπτες", upTo3: "Έως 3 επισκέπτες", upTo4: "Έως 4 επισκέπτες", upTo5: "Έως 5 επισκέπτες κατόπιν συνεννόησης" },
  fr: { upperFloor: "À l’étage", groundFloor: "Rez-de-chaussée", privateBalcony: "Balcon privé", doubleBed: "Lit double", kitchenette: "Kitchenette", noStairs: "Sans escaliers", gardenAccess: "Accès jardin", fullKitchen: "Cuisine complète", livingArea: "Espace salon", familyLayout: "Configuration familiale", upTo2: "2 personnes", upTo3: "Jusqu’à 3 personnes", upTo4: "Jusqu’à 4 personnes", upTo5: "Jusqu’à 5 personnes sur demande" },
  de: { upperFloor: "Obergeschoss", groundFloor: "Erdgeschoss", privateBalcony: "Privatbalkon", doubleBed: "Doppelbett", kitchenette: "Küchenzeile", noStairs: "Keine Treppen", gardenAccess: "Gartenzugang", fullKitchen: "Vollständige Küche", livingArea: "Wohnbereich", familyLayout: "Familienaufteilung", upTo2: "2 Gäste", upTo3: "Bis 3 Gäste", upTo4: "Bis 4 Gäste", upTo5: "Bis 5 Gäste nach Absprache" },
  it: { upperFloor: "Piano superiore", groundFloor: "Piano terra", privateBalcony: "Balcone privato", doubleBed: "Letto matrimoniale", kitchenette: "Angolo cottura", noStairs: "Senza scale", gardenAccess: "Accesso al giardino", fullKitchen: "Cucina completa", livingArea: "Zona giorno", familyLayout: "Disposizione familiare", upTo2: "2 ospiti", upTo3: "Fino a 3 ospiti", upTo4: "Fino a 4 ospiti", upTo5: "Fino a 5 ospiti su accordo" },
  es: { upperFloor: "Planta superior", groundFloor: "Planta baja", privateBalcony: "Balcón privado", doubleBed: "Cama doble", kitchenette: "Zona de cocina", noStairs: "Sin escaleras", gardenAccess: "Acceso al jardín", fullKitchen: "Cocina completa", livingArea: "Zona de estar", familyLayout: "Distribución familiar", upTo2: "2 huéspedes", upTo3: "Hasta 3 huéspedes", upTo4: "Hasta 4 huéspedes", upTo5: "Hasta 5 huéspedes bajo consulta" },
  tr: { upperFloor: "Üst kat", groundFloor: "Zemin kat", privateBalcony: "Özel balkon", doubleBed: "Çift kişilik yatak", kitchenette: "Mini mutfak", noStairs: "Merdivensiz", gardenAccess: "Bahçe erişimi", fullKitchen: "Tam mutfak", livingArea: "Oturma alanı", familyLayout: "Aile düzeni", upTo2: "2 misafir", upTo3: "3 misafire kadar", upTo4: "4 misafire kadar", upTo5: "Koşullara göre 5 misafire kadar" },
};

const ROOM_LABELS: Record<ChiosHotelsGuideLocale, { upper: string; ground: string; economy: string; apartment: string; standardSub: string; economySub: string; groundSub: string; apartmentSub: string; largeApartmentSub: string }> = {
  en: { upper: "Upper-floor room", ground: "Ground-floor room", economy: "Economy room", apartment: "Family apartment", standardSub: "Double / triple room", economySub: "Best-value double room", groundSub: "Easy-access double / triple room", apartmentSub: "Independent apartment", largeApartmentSub: "Large independent apartment" },
  el: { upper: "Δωμάτιο ορόφου", ground: "Ισόγειο δωμάτιο", economy: "Οικονομικό δωμάτιο", apartment: "Οικογενειακό διαμέρισμα", standardSub: "Δίκλινο / τρίκλινο", economySub: "Οικονομικό δίκλινο", groundSub: "Δίκλινο / τρίκλινο εύκολης πρόσβασης", apartmentSub: "Ανεξάρτητο διαμέρισμα", largeApartmentSub: "Μεγάλο ανεξάρτητο διαμέρισμα" },
  fr: { upper: "Chambre à l’étage", ground: "Chambre au rez-de-chaussée", economy: "Chambre économique", apartment: "Appartement familial", standardSub: "Chambre double / triple", economySub: "Chambre double avantageuse", groundSub: "Chambre double / triple facile d’accès", apartmentSub: "Appartement indépendant", largeApartmentSub: "Grand appartement indépendant" },
  de: { upper: "Zimmer im Obergeschoss", ground: "Zimmer im Erdgeschoss", economy: "Economy-Zimmer", apartment: "Familienapartment", standardSub: "Doppel- / Dreibettzimmer", economySub: "Preiswertes Doppelzimmer", groundSub: "Leicht zugängliches Doppel- / Dreibettzimmer", apartmentSub: "Unabhängiges Apartment", largeApartmentSub: "Großes unabhängiges Apartment" },
  it: { upper: "Camera al piano superiore", ground: "Camera al piano terra", economy: "Camera economy", apartment: "Appartamento familiare", standardSub: "Camera doppia / tripla", economySub: "Camera doppia conveniente", groundSub: "Camera doppia / tripla di facile accesso", apartmentSub: "Appartamento indipendente", largeApartmentSub: "Grande appartamento indipendente" },
  es: { upper: "Habitación en planta superior", ground: "Habitación en planta baja", economy: "Habitación económica", apartment: "Apartamento familiar", standardSub: "Habitación doble / triple", economySub: "Habitación doble económica", groundSub: "Habitación doble / triple de fácil acceso", apartmentSub: "Apartamento independiente", largeApartmentSub: "Apartamento independiente amplio" },
  tr: { upper: "Üst kat oda", ground: "Zemin kat oda", economy: "Ekonomik oda", apartment: "Aile dairesi", standardSub: "Çift / üç kişilik oda", economySub: "Avantajlı çift kişilik oda", groundSub: "Kolay erişimli çift / üç kişilik oda", apartmentSub: "Bağımsız daire", largeApartmentSub: "Geniş bağımsız daire" },
};

const ROOM_META: Record<number, { kind: "upper" | "ground" | "economy" | "apartment"; route: "standard" | "economy" | "family"; image: string; features: FeatureKey[]; large?: boolean }> = {
  1: { kind: "upper", route: "standard", image: "/images/rooms/DSC07776-2-e1675109942622.webp", features: ["upperFloor", "privateBalcony", "upTo4"] },
  2: { kind: "economy", route: "economy", image: "/images/rooms/DSC07803-1.webp", features: ["upperFloor", "doubleBed", "upTo2"] },
  3: { kind: "upper", route: "standard", image: "/images/rooms/DSC07867-1.webp", features: ["upperFloor", "kitchenette", "upTo3"] },
  4: { kind: "upper", route: "standard", image: "/images/rooms/received_1748354861920234.webp", features: ["upperFloor", "kitchenette", "privateBalcony"] },
  5: { kind: "ground", route: "standard", image: "/images/rooms/voulamandis-house-rooms.webp", features: ["groundFloor", "noStairs", "upTo3"] },
  6: { kind: "economy", route: "economy", image: "/images/rooms/received_1753964631359257.webp", features: ["groundFloor", "noStairs", "upTo2"] },
  7: { kind: "ground", route: "standard", image: "/images/rooms/double-triple-room.jpg", features: ["groundFloor", "gardenAccess", "upTo3"] },
  8: { kind: "apartment", route: "family", image: "/images/rooms/chios-apartments-voulamandis.webp", features: ["fullKitchen", "livingArea", "upTo4"] },
  9: { kind: "apartment", route: "family", image: "/images/rooms/chios-apartments-voulamandis.webp", features: ["fullKitchen", "livingArea", "upTo4"] },
  10: { kind: "apartment", route: "family", image: "/images/rooms/DSC07899.webp", features: ["fullKitchen", "familyLayout", "upTo5"], large: true },
};

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function nextFriday(date: Date) {
  const copy = new Date(date);
  const offset = (5 - copy.getDay() + 7) % 7 || 7;
  copy.setDate(copy.getDate() + offset);
  return copy;
}

function emit(name: string, properties: Record<string, string | number | boolean | null | undefined>) {
  if (typeof window === "undefined" || window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;
  const clean = Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined)) as Record<string, string | number | boolean | null>;
  track(name, clean);
  window.gtag?.("event", name, clean);
}

function roomPresentation(locale: ChiosHotelsGuideLocale, room: SearchRoom, fallbackGuests: number) {
  const number = Number(room.roomNumber || 0);
  const meta = ROOM_META[number];
  if (!meta) {
    return {
      title: room.name || `Room ${number || ""}`,
      subtitle: room.category || "Voulamandis House",
      image: "/images/rooms/double-triple-room.jpg",
      href: ROUTES[locale].rooms,
      features: [room.floor || "Voulamandis House", `${room.maxGuests || fallbackGuests} ${COPY[locale].guestsPlural}`],
    };
  }
  const labels = ROOM_LABELS[locale];
  const title = `${labels[meta.kind]} ${number}`;
  const subtitle = meta.kind === "economy" ? labels.economySub : meta.kind === "ground" ? labels.groundSub : meta.kind === "apartment" ? (meta.large ? labels.largeApartmentSub : labels.apartmentSub) : labels.standardSub;
  return {
    title,
    subtitle,
    image: meta.image,
    href: ROUTES[locale][meta.route],
    features: meta.features.map((key) => FEATURE_COPY[locale][key]),
  };
}

export function LocalizedChiosHotelsLiveSearch({ locale, pathname }: { locale: ChiosHotelsGuideLocale; pathname: string }) {
  const copy = COPY[locale];
  const today = useMemo(() => new Date(), []);
  const [checkin, setCheckin] = useState(isoDate(addDays(today, 1)));
  const [checkout, setCheckout] = useState(isoDate(addDays(today, 2)));
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<SearchPayload | null>(null);
  const availableRooms = useMemo(() => [...(payload?.rooms?.available || [])].sort((a, b) => Number(a.totalPrice || 0) - Number(b.totalPrice || 0)), [payload]);

  const formatDate = (value: string) => new Intl.DateTimeFormat(INTL_LOCALE[locale], { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
  const formatMoney = (value: number) => new Intl.NumberFormat(INTL_LOCALE[locale], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  function setShortcut(type: "tonight" | "tomorrow" | "weekend") {
    let start = new Date();
    let end = addDays(start, 1);
    if (type === "tomorrow") { start = addDays(start, 1); end = addDays(start, 1); }
    if (type === "weekend") { start = nextFriday(start); end = addDays(start, 2); }
    setCheckin(isoDate(start));
    setCheckout(isoDate(end));
    setPayload(null);
    setError("");
    emit("chios_hotels_date_shortcut_click", { shortcut: type, search_intent: "chios_hotels", language: locale, pathname });
  }

  async function runSearch(event?: React.FormEvent) {
    event?.preventDefault();
    setError("");
    setPayload(null);
    if (!checkin || !checkout || checkout <= checkin) { setError(copy.invalidDates); return; }
    setLoading(true);
    emit("chios_hotels_search_dates", { search_intent: "chios_hotels", language: locale, pathname, checkin, checkout, guests });
    try {
      const params = new URLSearchParams({ checkin, checkout, guests: String(guests) });
      const response = await fetch(`/api/booking/search-range?${params.toString()}`, { cache: "no-store" });
      const result = (await response.json().catch(() => null)) as SearchPayload | null;
      if (!response.ok || !result?.success) throw new Error(result?.message || copy.unavailableError);
      setPayload(result);
      emit("chios_hotels_search_results", { search_intent: "chios_hotels", language: locale, pathname, checkin, checkout, guests, nights: result.nights, available_room_count: result.summary?.availableRooms || 0, response_ms: result._booking_engine?.totalMs });
    } catch (searchError) {
      const message = searchError instanceof Error ? searchError.message : copy.unavailableError;
      setError(message);
      emit("chios_hotels_search_error", { search_intent: "chios_hotels", language: locale, pathname, error_message: message.slice(0, 120) });
    } finally {
      setLoading(false);
    }
  }

  const whatsappText = encodeURIComponent(copy.whatsappMessage(checkin, checkout, guests));
  const guestWord = guests === 1 ? copy.guest : copy.guestsPlural;

  return (
    <section id="live-availability" className="scroll-mt-24 bg-[#263127] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-24" aria-labelledby={`live-availability-title-${locale}`}>
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200 sm:text-xs">{copy.kicker}</p>
            <h2 id={`live-availability-title-${locale}`} className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">{copy.title}</h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/78 sm:text-lg sm:leading-8">{copy.intro}</p>
            <div className="mt-6 rounded-[24px] border border-amber-200/20 bg-white/8 p-5 text-sm leading-6 text-white/75"><strong className="text-white">{copy.distinctionLabel}</strong> {copy.distinction}</div>
          </div>
          <div className="rounded-[30px] bg-[#fbf6ef] p-4 text-[#2f261f] shadow-2xl sm:p-7 lg:rounded-[38px] lg:p-9">
            <div className="flex flex-wrap gap-2" aria-label={copy.shortcutsLabel}>
              <button type="button" onClick={() => setShortcut("tonight")} className="rounded-full border border-amber-900/15 bg-white px-4 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-50">{copy.tonight}</button>
              <button type="button" onClick={() => setShortcut("tomorrow")} className="rounded-full border border-amber-900/15 bg-white px-4 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-50">{copy.tomorrow}</button>
              <button type="button" onClick={() => setShortcut("weekend")} className="rounded-full border border-amber-900/15 bg-white px-4 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-50">{copy.weekend}</button>
            </div>
            <form onSubmit={runSearch} className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-black">{copy.checkin}<input type="date" value={checkin} min={isoDate(today)} onChange={(event) => setCheckin(event.target.value)} className="min-h-12 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-base font-semibold outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-200/40" required /></label>
              <label className="grid gap-2 text-sm font-black">{copy.checkout}<input type="date" value={checkout} min={checkin || isoDate(today)} onChange={(event) => setCheckout(event.target.value)} className="min-h-12 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-base font-semibold outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-200/40" required /></label>
              <label className="grid gap-2 text-sm font-black">{copy.guests}<select value={guests} onChange={(event) => setGuests(Number(event.target.value))} className="min-h-12 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-base font-semibold outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-200/40">{[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count} {count === 1 ? copy.guest : copy.guestsPlural}</option>)}</select></label>
              <button type="submit" disabled={loading} className="min-h-12 self-end rounded-2xl bg-[#2f261f] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-900 disabled:cursor-wait disabled:opacity-60">{loading ? copy.loading : copy.search}</button>
            </form>
            {error ? <div role="alert" className="mt-5 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-900">{error}</div> : null}
          </div>
        </div>

        {payload ? (
          <div className="mt-10 sm:mt-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">{copy.resultsKicker}</p>
                <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">{availableRooms.length === 1 ? copy.availableOne : availableRooms.length > 1 ? `${availableRooms.length} ${copy.availableMany}` : copy.noOption}</h3>
                <p className="mt-2 text-sm text-white/70">{formatDate(checkin)} → {formatDate(checkout)} · {guests} {guestWord} · {payload.nights} {payload.nights === 1 ? copy.night : copy.nights}</p>
              </div>
              <p className="text-xs text-white/55">{copy.checked}{payload._booking_engine?.totalMs ? ` · ${payload._booking_engine.totalMs} ms` : ""}</p>
            </div>

            {availableRooms.length > 0 ? (
              <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-3">
                {availableRooms.map((room) => {
                  const presentation = roomPresentation(locale, room, guests);
                  const total = Number(room.totalPrice || 0);
                  const nights = Number(room.nights || payload.nights || 1);
                  const perNight = nights > 0 ? total / nights : total;
                  return (
                    <article key={`${room.roomId}:${room.unitId}`} className="min-w-[86vw] snap-start overflow-hidden rounded-[28px] bg-white text-[#2f261f] shadow-2xl sm:min-w-[68vw] lg:min-w-0">
                      <div className="relative h-52"><Image src={presentation.image} alt={`${presentation.title} · Voulamandis House`} fill sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 44vw, 86vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" /><span className="absolute bottom-4 left-4 rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-emerald-900">{copy.availableBadge}</span></div>
                      <div className="p-5 sm:p-6"><p className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-800">{presentation.subtitle}</p><h4 className="mt-2 text-xl font-black tracking-[-0.03em]">{presentation.title}</h4><div className="mt-4 flex flex-wrap gap-2">{presentation.features.map((feature) => <span key={feature} className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-900 ring-1 ring-amber-900/10">{feature}</span>)}</div><div className="mt-5 flex items-end justify-between gap-4 border-t border-amber-900/10 pt-5"><div><p className="text-xs font-bold text-[#6f6257]">{copy.completeStay}</p><p className="mt-1 text-2xl font-black">{formatMoney(total)}</p><p className="mt-1 text-xs text-[#6f6257]">≈ {formatMoney(perNight)} {copy.perNight}</p></div><a href={presentation.href} onClick={() => emit("chios_hotels_room_view", { search_intent: "chios_hotels", language: locale, pathname, room_number: room.roomNumber, checkin, checkout, guests, total_price: room.totalPrice })} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2f261f] px-4 py-2 text-center text-[11px] font-black uppercase tracking-[0.06em] !text-white transition hover:bg-amber-900">{copy.viewRoom}</a></div></div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-[28px] border border-white/15 bg-white/8 p-6 sm:p-8"><p className="max-w-3xl text-base leading-7 text-white/80">{copy.noAvailabilityText}</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><a href={`https://wa.me/306944474226?text=${whatsappText}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-100 px-5 py-3 text-sm font-black !text-emerald-950">{copy.askWhatsapp}</a><a href={ROUTES[locale].ai} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-5 py-3 text-sm font-black !text-white">{copy.tryAi}</a></div></div>
            )}

            {availableRooms.length > 0 ? <div className="mt-7 flex flex-col gap-3 rounded-[26px] border border-white/15 bg-white/8 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><p className="text-sm leading-6 text-white/75">{copy.helpText}</p><div className="flex flex-col gap-2 sm:flex-row"><a href={`https://wa.me/306944474226?text=${whatsappText}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-100 px-4 py-2 text-xs font-black !text-emerald-950">{copy.whatsappReception}</a><a href={ROUTES[locale].rates} className="inline-flex min-h-11 items-center justify-center rounded-full bg-amber-200 px-4 py-2 text-xs font-black !text-[#2f261f]">{copy.continueRates}</a></div></div> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

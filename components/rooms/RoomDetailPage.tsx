"use client";

import { MarkerText } from "@/components/effects/MarkerText";
import { ScrollEffects } from "@/components/effects/ScrollEffects";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import { MobileAvailabilityBar } from "@/components/rooms/MobileAvailabilityBar";
import { TopicBadges } from "@/components/seo/TopicBadges";
import { ChiosCollectionImageGallery } from "@/components/chios/ChiosCollectionImageGallery";
import type { IndividualRoomData, RoomDetailData } from "@/content/room-details";
import { roomFinderHrefForLanguage } from "@/lib/room-finder-cta-routing";
import { roomPanoramas } from "@/content/room-panoramas";
import type { RoomPanoramaViewerLabels } from "@/components/rooms/RoomPanoramaViewer";

// Loaded only when a guest opens a 360° view, so it adds nothing to the initial page.
const RoomPanoramaViewer = dynamic(() => import("@/components/rooms/RoomPanoramaViewer"), { ssr: false });

type RoomDetailPageProps = { data: RoomDetailData; fromPriceLabel?: string | null };
type RoomLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type FloorKind = "ground" | "first" | "other";
type RoomDictionary = Partial<Record<RoomLanguage, string>>;

type RoomUiLabels = {
  upToGuests: (count: number) => string;
  faqKicker: string;
  faqTitle: string;
  nextRoom: string;
  swipe: string;
  photos: string;
  highlights: string;
  keyDetails: string;
  propertyLocation: string;
  checkAvailability: string;
  bookOnline: string;
  priceNote: string;
};

function getRoomLanguage(path: string): RoomLanguage {
  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";
  return "en";
}

const labels: Record<RoomLanguage, RoomUiLabels> = {
  en: { checkAvailability: "Check availability", bookOnline: "Book online", upToGuests: (count) => `Up to ${count} guests`, faqKicker: "Questions", faqTitle: "Room FAQ", nextRoom: "Next room", swipe: "Swipe to see more rooms", photos: "Photos", highlights: "Room highlights", keyDetails: "Room key details", propertyLocation: "Voulamandis House, Chios", priceNote: "Lowest direct price for 2 guests, incl. direct-booking discount" },
  el: { checkAvailability: "Έλεγχος διαθεσιμότητας", bookOnline: "Online κράτηση", upToGuests: (count) => `Έως ${count} άτομα`, faqKicker: "Ερωτήσεις", faqTitle: "Συχνές ερωτήσεις δωματίου", nextRoom: "Επόμενο δωμάτιο", swipe: "Σύρετε για περισσότερα δωμάτια", photos: "Φωτογραφίες", highlights: "Χαρακτηριστικά δωματίου", keyDetails: "Βασικές πληροφορίες δωματίου", propertyLocation: "Voulamandis House, Χίος", priceNote: "Χαμηλότερη τιμή απευθείας κράτησης για 2 άτομα, με την έκπτωση" },
  fr: { checkAvailability: "Voir les disponibilités", bookOnline: "Réserver en ligne", upToGuests: (count) => `Jusqu’à ${count} personnes`, faqKicker: "Questions", faqTitle: "FAQ de la chambre", nextRoom: "Chambre suivante", swipe: "Faites glisser pour voir plus", photos: "Photos", highlights: "Points forts de la chambre", keyDetails: "Informations principales", propertyLocation: "Voulamandis House, Chios", priceNote: "Meilleur prix direct pour 2 personnes, remise directe incluse" },
  de: { checkAvailability: "Verfügbarkeit prüfen", bookOnline: "Online buchen", upToGuests: (count) => `Bis zu ${count} Gäste`, faqKicker: "Fragen", faqTitle: "Zimmer-FAQ", nextRoom: "Nächstes Zimmer", swipe: "Wischen für weitere Zimmer", photos: "Fotos", highlights: "Zimmer-Highlights", keyDetails: "Wichtige Zimmerdetails", propertyLocation: "Voulamandis House, Chios", priceNote: "Günstigster Direktpreis für 2 Gäste, inkl. Direktbuchungsrabatt" },
  it: { checkAvailability: "Verifica disponibilità", bookOnline: "Prenota online", upToGuests: (count) => `Fino a ${count} ospiti`, faqKicker: "Domande", faqTitle: "FAQ della camera", nextRoom: "Camera successiva", swipe: "Scorri per vedere altre camere", photos: "Foto", highlights: "Caratteristiche della camera", keyDetails: "Dettagli principali", propertyLocation: "Voulamandis House, Chios", priceNote: "Prezzo diretto più basso per 2 ospiti, sconto diretto incluso" },
  es: { checkAvailability: "Consultar disponibilidad", bookOnline: "Reservar online", upToGuests: (count) => `Hasta ${count} personas`, faqKicker: "Preguntas", faqTitle: "Preguntas frecuentes", nextRoom: "Habitación siguiente", swipe: "Desliza para ver más habitaciones", photos: "Fotos", highlights: "Características de la habitación", keyDetails: "Datos principales", propertyLocation: "Voulamandis House, Chios", priceNote: "Precio directo más bajo para 2 personas, con descuento directo" },
  tr: { checkAvailability: "Müsaitliği kontrol et", bookOnline: "Online rezervasyon", upToGuests: (count) => `${count} kişiye kadar`, faqKicker: "Sorular", faqTitle: "Oda SSS", nextRoom: "Sonraki oda", swipe: "Daha fazla oda için kaydırın", photos: "Fotoğraflar", highlights: "Oda özellikleri", keyDetails: "Temel oda bilgileri", propertyLocation: "Voulamandis House, Sakız Adası", priceNote: "2 kişi için en düşük direkt fiyat, direkt rezervasyon indirimi dahil" },
};

const panoramaLabels: Record<RoomLanguage, Omit<RoomPanoramaViewerLabels, "title">> = {
  en: { open: "360° view", hint: "Drag to look around", close: "Close 360° view", loading: "Loading 360° view…", unsupported: "Your browser can’t display the 360° view." },
  el: { open: "Περιήγηση 360°", hint: "Σύρετε για να δείτε γύρω", close: "Κλείσιμο περιήγησης 360°", loading: "Φόρτωση περιήγησης 360°…", unsupported: "Ο browser σας δεν μπορεί να εμφανίσει την περιήγηση 360°." },
  fr: { open: "Visite 360°", hint: "Faites glisser pour regarder autour", close: "Fermer la visite 360°", loading: "Chargement de la visite 360°…", unsupported: "Votre navigateur ne peut pas afficher la visite 360°." },
  de: { open: "360°-Ansicht", hint: "Ziehen, um sich umzusehen", close: "360°-Ansicht schließen", loading: "360°-Ansicht wird geladen…", unsupported: "Ihr Browser kann die 360°-Ansicht nicht anzeigen." },
  it: { open: "Vista 360°", hint: "Trascina per guardarti intorno", close: "Chiudi vista 360°", loading: "Caricamento vista 360°…", unsupported: "Il tuo browser non può mostrare la vista 360°." },
  es: { open: "Vista 360°", hint: "Arrastra para mirar alrededor", close: "Cerrar vista 360°", loading: "Cargando vista 360°…", unsupported: "Tu navegador no puede mostrar la vista 360°." },
  tr: { open: "360° görünüm", hint: "Etrafa bakmak için sürükleyin", close: "360° görünümü kapat", loading: "360° görünüm yükleniyor…", unsupported: "Tarayıcınız 360° görünümü gösteremiyor." },
};

const bookingPathByLanguage: Record<RoomLanguage, string> = {
  en: "/chios-hotels-rates/",
  el: "/el/amesi-kratisi-voulamandis-house/",
  fr: "/fr/tarifs-des-hotels-a-chios/",
  de: "/de/hotelpreise-auf-der-insel-chios/",
  it: "/it/prezzi-hotel-chios/",
  es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  tr: "/tr/sakiz-adasi-rezervasyon/",
};

const sectionLabels: Record<RoomLanguage, { groundTitle: string; groundText: string; firstTitle: string; firstText: string }> = {
  en: { groundTitle: "Ground floor rooms", groundText: "Rooms with easy courtyard and garden access, ideal if you prefer fewer steps and a simple outdoor connection.", firstTitle: "First floor rooms", firstText: "Brighter upper-floor rooms with terrace feel or Kambos views, accessed by stairs." },
  el: { groundTitle: "Δωμάτια ισογείου", groundText: "Δωμάτια με εύκολη πρόσβαση στην αυλή και στον κήπο, ιδανικά αν προτιμάτε λιγότερα σκαλιά και άμεση επαφή με τον εξωτερικό χώρο.", firstTitle: "Δωμάτια ορόφου", firstText: "Πιο φωτεινά δωμάτια στον όροφο με αίσθηση βεράντας ή θέα προς τον Κάμπο, με πρόσβαση από σκάλες." },
  fr: { groundTitle: "Chambres au rez-de-chaussée", groundText: "Chambres avec accès facile à la cour et au jardin, idéales si vous préférez peu de marches.", firstTitle: "Chambres au premier étage", firstText: "Chambres plus lumineuses à l’étage, avec atmosphère de terrasse ou vue sur Kambos." },
  de: { groundTitle: "Zimmer im Erdgeschoss", groundText: "Zimmer mit einfachem Zugang zum Hof und Garten, ideal bei wenigen Treppen.", firstTitle: "Zimmer im Obergeschoss", firstText: "Hellere Zimmer im Obergeschoss mit Terrassengefühl oder Blick auf Kambos." },
  it: { groundTitle: "Camere al piano terra", groundText: "Camere con facile accesso al cortile e al giardino, ideali se preferisci pochi gradini.", firstTitle: "Camere al primo piano", firstText: "Camere più luminose al piano superiore, con atmosfera da terrazza o vista su Kambos." },
  es: { groundTitle: "Habitaciones en planta baja", groundText: "Habitaciones con fácil acceso al patio y al jardín, ideales si prefieres menos escaleras.", firstTitle: "Habitaciones en primera planta", firstText: "Habitaciones más luminosas en planta superior, con ambiente de terraza o vistas a Kambos." },
  tr: { groundTitle: "Zemin kat odaları", groundText: "Avlu ve bahçeye kolay erişimli odalar; az merdiven isteyenler için idealdir.", firstTitle: "Üst kat odaları", firstText: "Teras hissi veya Kambos manzarası sunan daha aydınlık üst kat odaları." },
};

const dictionary: Record<string, RoomDictionary> = {
  Room: { el: "Δωμάτιο", fr: "Chambre", de: "Zimmer", it: "Camera", es: "Habitación", tr: "Oda" },
  Apartment: { el: "Διαμέρισμα", fr: "Appartement", de: "Apartment", it: "Appartamento", es: "Apartamento", tr: "Daire" },
  "Ground floor": { el: "Ισόγειο", fr: "Rez-de-chaussée", de: "Erdgeschoss", it: "Piano terra", es: "Planta baja", tr: "Zemin kat" },
  "First floor": { el: "Πρώτος όροφος", fr: "Premier étage", de: "Obergeschoss", it: "Primo piano", es: "Primera planta", tr: "Üst kat" },
  "Independent unit": { el: "Ανεξάρτητη μονάδα", fr: "Unité indépendante", de: "Eigenständige Einheit", it: "Unità indipendente", es: "Unidad independiente", tr: "Bağımsız birim" },
  "Stand alone": { el: "Ανεξάρτητη μονάδα", fr: "Unité indépendante", de: "Eigenständige Einheit", it: "Unità indipendente", es: "Unidad independiente", tr: "Bağımsız birim" },
  "Ground-floor double / triple": { el: "Ισόγειο δίκλινο / τρίκλινο", fr: "Double / triple au rez-de-chaussée", de: "Doppel- / Dreibettzimmer im Erdgeschoss", it: "Doppia / tripla al piano terra", es: "Doble / triple en planta baja", tr: "Zemin kat çift / üç kişilik oda" },
  "First-floor double / triple": { el: "Δίκλινο / τρίκλινο πρώτου ορόφου", fr: "Double / triple au premier étage", de: "Doppel- / Dreibettzimmer im Obergeschoss", it: "Doppia / tripla al primo piano", es: "Doble / triple en primera planta", tr: "Üst kat çift / üç kişilik oda" },
  "Budget double room": { el: "Οικονομικό δίκλινο", fr: "Chambre double économique", de: "Economy-Doppelzimmer", it: "Camera doppia economy", es: "Habitación doble económica", tr: "Ekonomik çift kişilik oda" },
  "Garden access": { el: "Πρόσβαση στον κήπο", fr: "Accès jardin", de: "Gartenzugang", it: "Accesso al giardino", es: "Acceso al jardín", tr: "Bahçe erişimi" },
  "No stairs": { el: "Χωρίς σκάλες", fr: "Sans escaliers", de: "Keine Treppen", it: "Senza scale", es: "Sin escaleras", tr: "Merdivensiz" },
  Economy: { el: "Οικονομικό", fr: "Économique", de: "Economy", it: "Economy", es: "Económico", tr: "Ekonomik" },
  "Kambos view": { el: "Θέα στον Κάμπο", fr: "Vue sur Kambos", de: "Blick auf Kambos", it: "Vista su Kambos", es: "Vista a Kambos", tr: "Kambos manzarası" },
  "Upper-floor view": { el: "Θέα από τον όροφο", fr: "Vue depuis l’étage", de: "Blick vom Obergeschoss", it: "Vista dal piano superiore", es: "Vista desde la planta superior", tr: "Üst kat manzarası" },
  "Private balcony": { el: "Ιδιωτικό μπαλκόνι", fr: "Balcon privé", de: "Privater Balkon", it: "Balcone privato", es: "Balcón privado", tr: "Özel balkon" },
  "Shared terrace": { el: "Κοινόχρηστη βεράντα", fr: "Terrasse commune", de: "Gemeinschaftsterrasse", it: "Terrazza comune", es: "Terraza común", tr: "Ortak teras" },
  "14 stairs": { el: "14 σκαλοπάτια", fr: "14 marches", de: "14 Stufen", it: "14 gradini", es: "14 escalones", tr: "14 basamak" },
  "4–5 entrance steps": { el: "4–5 σκαλοπάτια στην είσοδο", fr: "4–5 marches à l’entrée", de: "4–5 Eingangsstufen", it: "4–5 gradini all’ingresso", es: "4–5 escalones de entrada", tr: "Girişte 4–5 basamak" },
  "Ground floor · 4–5 entrance steps": { el: "Ισόγειο · 4–5 σκαλοπάτια στην είσοδο", fr: "Rez-de-chaussée · 4–5 marches", de: "Erdgeschoss · 4–5 Eingangsstufen", it: "Piano terra · 4–5 gradini", es: "Planta baja · 4–5 escalones", tr: "Zemin kat · girişte 4–5 basamak" },
  "Separate bedroom with door": { el: "Ξεχωριστό υπνοδωμάτιο με πόρτα", fr: "Chambre séparée avec porte", de: "Separates Schlafzimmer mit Tür", it: "Camera separata con porta", es: "Dormitorio separado con puerta", tr: "Kapılı ayrı yatak odası" },
  Kitchenette: { el: "Μικρή κουζίνα", fr: "Kitchenette", de: "Kitchenette", it: "Angolo cottura", es: "Kitchenette", tr: "Mini mutfak" },
  Kitchen: { el: "Κουζίνα", fr: "Cuisine", de: "Küche", it: "Cucina", es: "Cocina", tr: "Mutfak" },
  "Sofa bed": { el: "Καναπές-κρεβάτι", fr: "Canapé-lit", de: "Schlafsofa", it: "Divano letto", es: "Sofá cama", tr: "Çekyat" },
  "Sofa beds": { el: "Καναπέδες-κρεβάτια", fr: "Canapés-lits", de: "Schlafsofas", it: "Divani letto", es: "Sofás cama", tr: "Çekyatlar" },
  "Full kitchen": { el: "Πλήρης κουζίνα", fr: "Cuisine complète", de: "Voll ausgestattete Küche", it: "Cucina completa", es: "Cocina completa", tr: "Tam mutfak" },
  "Garden view": { el: "Θέα στον κήπο", fr: "Vue jardin", de: "Gartenblick", it: "Vista giardino", es: "Vista al jardín", tr: "Bahçe manzarası" },
  "Family space": { el: "Οικογενειακός χώρος", fr: "Espace familial", de: "Familienbereich", it: "Spazio famiglia", es: "Espacio familiar", tr: "Aile alanı" },
  "Open-plan space": { el: "Ενιαίος χώρος", fr: "Espace ouvert", de: "Offener Raum", it: "Spazio open space", es: "Espacio abierto", tr: "Açık plan alan" },
  "Access by stairs": { el: "Πρόσβαση με σκάλες", fr: "Accès par escalier", de: "Zugang über Treppen", it: "Accesso tramite scale", es: "Acceso por escaleras", tr: "Merdivenle erişim" },
  "Two spaces": { el: "Δύο χώροι", fr: "Deux espaces", de: "Zwei Bereiche", it: "Due ambienti", es: "Dos espacios", tr: "İki alan" },
  "Two spaces, no connecting door": { el: "Δύο χώροι, χωρίς ενδιάμεση πόρτα", fr: "Deux espaces, sans porte communicante", de: "Zwei Bereiche, keine Verbindungstür", it: "Due ambienti, senza porta comunicante", es: "Dos espacios, sin puerta comunicante", tr: "İki alan, ara kapı yok" },
  "Air conditioning": { el: "Κλιματισμός", fr: "Climatisation", de: "Klimaanlage", it: "Aria condizionata", es: "Aire acondicionado", tr: "Klima" },
  "Fridge": { el: "Ψυγείο", fr: "Réfrigérateur", de: "Kühlschrank", it: "Frigorifero", es: "Nevera", tr: "Buzdolabı" },
  "Hair dryer": { el: "Σεσουάρ μαλλιών", fr: "Sèche-cheveux", de: "Haartrockner", it: "Asciugacapelli", es: "Secador de pelo", tr: "Saç kurutma makinesi" },
  "Wi-Fi": { el: "Wi‑Fi", fr: "Wi‑Fi", de: "WLAN", it: "Wi‑Fi", es: "Wi‑Fi", tr: "Wi‑Fi" },
  "Coffee and tea kettle": { el: "Βραστήρας για καφέ και τσάι", fr: "Bouilloire pour café et thé", de: "Wasserkocher für Kaffee und Tee", it: "Bollitore per caffè e tè", es: "Hervidor para café y té", tr: "Kahve ve çay için su ısıtıcısı" },
  "Ground-floor view": { el: "Θέα ισογείου", fr: "Vue du rez-de-chaussée", de: "Blick im Erdgeschoss", it: "Vista dal piano terra", es: "Vista de planta baja", tr: "Zemin kat manzarası" },
  "1 double bed": { el: "1 διπλό κρεβάτι", fr: "1 lit double", de: "1 Doppelbett", it: "1 letto matrimoniale", es: "1 cama doble", tr: "1 çift kişilik yatak" },
  "1 single bed": { el: "1 μονό κρεβάτι", fr: "1 lit simple", de: "1 Einzelbett", it: "1 letto singolo", es: "1 cama individual", tr: "1 tek kişilik yatak" },
  "2 single beds": { el: "2 μονά κρεβάτια", fr: "2 lits simples", de: "2 Einzelbetten", it: "2 letti singoli", es: "2 camas individuales", tr: "2 tek kişilik yatak" },
  "1 sofa bed": { el: "1 καναπές-κρεβάτι", fr: "1 canapé-lit", de: "1 Schlafsofa", it: "1 divano letto", es: "1 sofá cama", tr: "1 çekyat" },
  "2 sofa beds": { el: "2 καναπέδες-κρεβάτια", fr: "2 canapés-lits", de: "2 Schlafsofas", it: "2 divani letto", es: "2 sofás cama", tr: "2 çekyat" },
  "1 double sofa bed": { el: "1 διπλός καναπές-κρεβάτι", fr: "1 canapé-lit double", de: "1 Doppelschlafsofa", it: "1 divano letto matrimoniale", es: "1 sofá cama doble", tr: "1 çift kişilik çekyat" },
  "Room view": { el: "Θέα δωματίου", fr: "Vue de la chambre", de: "Zimmerblick", it: "Vista camera", es: "Vista de la habitación", tr: "Oda manzarası" },
  Bedroom: { el: "Υπνοδωμάτιο", fr: "Chambre", de: "Schlafzimmer", it: "Camera da letto", es: "Dormitorio", tr: "Yatak odası" },
  "Double bed": { el: "Διπλό κρεβάτι", fr: "Lit double", de: "Doppelbett", it: "Letto matrimoniale", es: "Cama doble", tr: "Çift kişilik yatak" },
  "Living Room & Kitchen": { el: "Καθιστικό & κουζίνα", fr: "Salon & cuisine", de: "Wohnbereich & Küche", it: "Soggiorno & cucina", es: "Sala de estar y cocina", tr: "Oturma alanı & mutfak" },
  "Living area": { el: "Καθιστικό", fr: "Salon", de: "Wohnbereich", it: "Soggiorno", es: "Sala de estar", tr: "Oturma alanı" },
  Bathroom: { el: "Μπάνιο", fr: "Salle de bain", de: "Bad", it: "Bagno", es: "Baño", tr: "Banyo" },
  Layout: { fr: "Disposition", it: "Disposizione", tr: "Yerleşim", es: "Distribución"},
  Detail: { el: "Λεπτομέρεια", de: "Detail", fr: "Détail", it: "Dettaglio", tr: "Detay", es: "Detalle"},
  Desk: { fr: "Bureau", it: "Scrivania", tr: "Çalışma masası", es: "Escritorio"},
  "Traditional interior": { el: "Παραδοσιακό εσωτερικό", de: "Traditionelles Interieur", fr: "Intérieur traditionnel", it: "Interni tradizionali", tr: "Geleneksel iç mekân", es: "Interior tradicional"},
  "Courtyard access": { el: "Πρόσβαση στην αυλή", de: "Zugang zum Innenhof", fr: "Accès à la cour", it: "Accesso al cortile", tr: "Avlu erişimi", es: "Acceso al patio"},
  "Room layout": { el: "Διαρρύθμιση δωματίου", de: "Zimmeraufteilung", fr: "Agencement de la chambre", it: "Disposizione della camera", tr: "Oda düzeni", es: "Distribución de la habitación"},
  "Stone wall interior": { el: "Εσωτερικό με πέτρινο τοίχο", de: "Interieur mit Steinwand", fr: "Intérieur avec mur en pierre", it: "Interni con parete in pietra", tr: "Taş duvarlı iç mekân", es: "Interior con pared de piedra"},
  "Stone bathroom details": { el: "Πέτρινες λεπτομέρειες μπάνιου", de: "Steindetails im Bad", fr: "Détails en pierre de la salle de bain", it: "Dettagli in pietra del bagno", tr: "Taş banyo detayları", es: "Detalles de piedra en el baño"},
  "Spacious layout": { el: "Ευρύχωρη διαρρύθμιση", de: "Großzügige Aufteilung", fr: "Agencement spacieux", it: "Disposizione spaziosa", tr: "Geniş yerleşim", es: "Distribución amplia"},
  "Traditional details": { el: "Παραδοσιακές λεπτομέρειες", de: "Traditionelle Details", fr: "Détails traditionnels", it: "Dettagli tradizionali", tr: "Geleneksel detaylar", es: "Detalles tradicionales"},
  "Terrace access": { el: "Πρόσβαση στη βεράντα", de: "Zugang zur Terrasse", tr: "Teras erişimi", fr: "Accès à la terrasse", it: "Accesso alla terrazza", es: "Acceso a la terraza"},
  "Kitchenette area": { el: "Χώρος μικρής κουζίνας", de: "Kochnische", tr: "Mini mutfak alanı", fr: "Espace kitchenette", it: "Area angolo cottura", es: "Zona de cocina pequeña"},
  "Traditional decoration": { el: "Παραδοσιακή διακόσμηση", de: "Traditionelle Einrichtung", tr: "Geleneksel dekorasyon", fr: "Décoration traditionnelle", it: "Arredi tradizionali", es: "Decoración tradicional"},
  "Balcony view": { el: "Θέα από το μπαλκόνι", de: "Blick vom Balkon", tr: "Balkon manzarası", fr: "Vue depuis le balcon", it: "Vista dal balcone", es: "Vista desde el balcón"},
  "Bu kategori doğrudan bahçe erişimli zemin kat odalar ve teras hissi veren birinci kat odaları içerir. Bazı birinci kat odalarda kitchenette de bulunur.": { tr: "Bu kategori doğrudan bahçe erişimli zemin kat odalar ve teras hissi veren üst kat odaları içerir. Bazı üst kat odalarda mini mutfak da bulunur." },
  "Economy kategorisine göre daha fazla konfor isteyen çiftler.": { tr: "Ekonomik kategoriye göre daha fazla konfor isteyen çiftler." },
  "Bazı birinci kat odalarda kitchenette bulunabilir. Tam mutfağa ihtiyacınız varsa aile apartları genellikle daha iyi seçimdir.": { tr: "Bazı üst kat odalarda mini mutfak bulunabilir. Tam mutfağa ihtiyacınız varsa aile daireleri genellikle daha iyi seçimdir." },
  "Room 6 is ideal for guests who love nature. Located on the ground floor, it opens directly to the peaceful courtyard and garden.": { el: "Το Δωμάτιο 6 βρίσκεται στο ισόγειο και ανοίγει απευθείας στην ήρεμη αυλή και στον κήπο.", fr: "La chambre 6 est au rez-de-chaussée et s’ouvre directement sur la cour paisible et le jardin.", de: "Zimmer 6 liegt im Erdgeschoss und öffnet sich direkt zum ruhigen Hof und Garten.", it: "La camera 6 è al piano terra e si apre direttamente sul cortile tranquillo e sul giardino.", es: "La habitación 6 está en planta baja y se abre directamente al patio tranquilo y al jardín.", tr: "Oda 6 zemin kattadır ve huzurlu avlu ile bahçeye doğrudan açılır." },
  "Room 2 is located on the first floor and offers access to a shared terrace with views over the estate and the citrus trees of Kambos.": { el: "Το Δωμάτιο 2 βρίσκεται στον πρώτο όροφο και έχει πρόσβαση σε κοινόχρηστη βεράντα με θέα στο κτήμα και στον Κάμπο.", fr: "La chambre 2 se trouve au premier étage avec accès à une terrasse partagée donnant sur le domaine.", de: "Zimmer 2 liegt im Obergeschoss und bietet Zugang zu einer gemeinsamen Terrasse mit Blick auf das Anwesen.", it: "La camera 2 si trova al primo piano e offre accesso a una terrazza condivisa con vista sulla tenuta.", es: "La habitación 2 está en la primera planta y ofrece acceso a una terraza compartida con vistas a la finca.", tr: "Oda 2 üst katta yer alır ve tesise bakan ortak terasa erişim sunar." },
  "Room 5 is a ground-floor double / triple room with direct courtyard and garden access. It is ideal for guests who prefer no stairs and an easy outdoor connection.": { el: "Το Δωμάτιο 5 είναι ισόγειο δίκλινο / τρίκλινο με άμεση πρόσβαση στην αυλή και στον κήπο.", fr: "La chambre 5 est une double / triple au rez-de-chaussée avec accès direct à la cour et au jardin.", de: "Zimmer 5 ist ein Doppel- / Dreibettzimmer im Erdgeschoss mit direktem Zugang zum Hof und Garten.", it: "La camera 5 è una doppia / tripla al piano terra con accesso diretto al cortile e al giardino.", es: "La habitación 5 es una doble / triple en planta baja con acceso directo al patio y al jardín.", tr: "Oda 5, avlu ve bahçeye doğrudan erişimi olan zemin kat çift / üç kişilik odadır." },
  "Room 7 is a ground-floor double / triple room with garden access and a flexible layout with a sofa bed.": { el: "Το Δωμάτιο 7 είναι ισόγειο δίκλινο / τρίκλινο με πρόσβαση στον κήπο και καναπέ-κρεβάτι.", fr: "La chambre 7 est une double / triple au rez-de-chaussée avec accès au jardin et canapé-lit.", de: "Zimmer 7 ist ein Doppel- / Dreibettzimmer im Erdgeschoss mit Gartenzugang und Schlafsofa.", it: "La camera 7 è una doppia / tripla al piano terra con accesso al giardino e divano letto.", es: "La habitación 7 es una doble / triple en planta baja con acceso al jardín y sofá cama.", tr: "Oda 7, bahçe erişimi ve çekyatlı zemin kat çift / üç kişilik odadır." },
  "Room 1 is a first-floor room for up to 4 guests, with upper-floor view, private balcony feel and two sleeping spaces without a connecting door.": { el: "Το Δωμάτιο 1 βρίσκεται στον πρώτο όροφο και φιλοξενεί έως 4 άτομα, με θέα από τον όροφο και δύο χώρους ύπνου.", fr: "La chambre 1 est au premier étage pour jusqu’à 4 personnes, avec deux espaces de couchage.", de: "Zimmer 1 liegt im Obergeschoss und bietet Platz für bis zu 4 Gäste mit zwei Schlafbereichen.", it: "La camera 1 si trova al primo piano e ospita fino a 4 persone con due zone notte.", es: "La habitación 1 está en la primera planta y aloja hasta 4 personas con dos zonas de descanso.", tr: "Oda 1 üst katta yer alır ve iki uyku alanıyla 4 kişiye kadar konaklama sunar." },
  "Room 3 is a first-floor double / triple room with kitchenette, upper-floor view and access by stairs.": { el: "Το Δωμάτιο 3 είναι δίκλινο / τρίκλινο πρώτου ορόφου με μικρή κουζίνα και πρόσβαση με σκάλες.", fr: "La chambre 3 est une double / triple au premier étage avec kitchenette et accès par escalier.", de: "Zimmer 3 ist ein Doppel- / Dreibettzimmer im Obergeschoss mit Kitchenette und Treppenzugang.", it: "La camera 3 è una doppia / tripla al primo piano con angolo cottura e accesso tramite scale.", es: "La habitación 3 es una doble / triple en primera planta con kitchenette y acceso por escaleras.", tr: "Oda 3, mini mutfak ve merdiven erişimi olan üst kat çift / üç kişilik odadır." },
  "Room 4 is a first-floor double / triple room with kitchenette, sofa bed and upper-floor view.": { el: "Το Δωμάτιο 4 είναι δίκλινο / τρίκλινο πρώτου ορόφου με μικρή κουζίνα, καναπέ-κρεβάτι και θέα από τον όροφο.", fr: "La chambre 4 est une double / triple au premier étage avec kitchenette, canapé-lit et vue depuis l’étage.", de: "Zimmer 4 ist ein Doppel- / Dreibettzimmer im Obergeschoss mit Kitchenette, Schlafsofa und Ausblick.", it: "La camera 4 è una doppia / tripla al primo piano con angolo cottura, divano letto e vista dall’alto.", es: "La habitación 4 es una doble / triple en primera planta con kitchenette, sofá cama y vistas.", tr: "Oda 4, mini mutfak, çekyat ve üst kat manzarası sunan çift / üç kişilik odadır." },
  // Current English apartment descriptions (content/room-details.ts) used by fr/de/it/es.
  "Apartment 8 is approximately 40 m², with a separate bedroom, living room/full kitchen and private balcony overlooking the orchard. It sleeps up to 4 guests.": { fr: "L’appartement 8 fait environ 40 m², avec une chambre séparée, un salon avec cuisine complète et un balcon privé donnant sur le verger. Il accueille jusqu’à 4 personnes.", de: "Apartment 8 hat ca. 40 m², ein separates Schlafzimmer, ein Wohnzimmer mit voll ausgestatteter Küche und einen privaten Balkon mit Blick auf den Obstgarten. Es bietet Platz für bis zu 4 Gäste.", it: "L’appartamento 8 misura circa 40 m², con camera da letto separata, soggiorno con cucina completa e balcone privato affacciato sul frutteto. Ospita fino a 4 persone.", es: "El apartamento 8 tiene unos 40 m², con dormitorio independiente, sala de estar con cocina completa y balcón privado con vistas al huerto. Tiene capacidad para hasta 4 personas." },
  "Apartment 9 is approximately 40 m², with a separate bedroom, living room/full kitchen and private balcony overlooking the orchard. It sleeps up to 4 guests.": { fr: "L’appartement 9 fait environ 40 m², avec une chambre séparée, un salon avec cuisine complète et un balcon privé donnant sur le verger. Il accueille jusqu’à 4 personnes.", de: "Apartment 9 hat ca. 40 m², ein separates Schlafzimmer, ein Wohnzimmer mit voll ausgestatteter Küche und einen privaten Balkon mit Blick auf den Obstgarten. Es bietet Platz für bis zu 4 Gäste.", it: "L’appartamento 9 misura circa 40 m², con camera da letto separata, soggiorno con cucina completa e balcone privato affacciato sul frutteto. Ospita fino a 4 persone.", es: "El apartamento 9 tiene unos 40 m², con dormitorio independiente, sala de estar con cocina completa y balcón privado con vistas al huerto. Tiene capacidad para hasta 4 personas." },
  "Apartment 10 is approximately 45 m² and normally sleeps 4 guests, with 1 double bed, 1 double sofa bed, a separate bedroom and full kitchen. A 5th guest is possible only by prior agreement with an extra single bed in the bedroom and limited space.": { fr: "L’appartement 10 fait environ 45 m² et accueille normalement 4 personnes, avec 1 lit double, 1 canapé-lit double, une chambre séparée et une cuisine complète. Une 5e personne est possible uniquement sur accord préalable, avec un lit simple supplémentaire dans la chambre et un espace limité.", de: "Apartment 10 hat ca. 45 m² und bietet normalerweise Platz für 4 Gäste, mit 1 Doppelbett, 1 Doppelschlafsofa, separatem Schlafzimmer und voll ausgestatteter Küche. Ein 5. Gast ist nur nach vorheriger Absprache möglich, mit einem zusätzlichen Einzelbett im Schlafzimmer und begrenztem Platz.", it: "L’appartamento 10 misura circa 45 m² e ospita normalmente 4 persone, con 1 letto matrimoniale, 1 divano letto matrimoniale, camera da letto separata e cucina completa. Un 5° ospite è possibile solo previo accordo, con un letto singolo aggiuntivo in camera e spazio limitato.", es: "El apartamento 10 tiene unos 45 m² y normalmente aloja a 4 personas, con 1 cama doble, 1 sofá cama doble, dormitorio independiente y cocina completa. Una 5.ª persona solo es posible con acuerdo previo, con una cama individual adicional en el dormitorio y espacio limitado." },
  "Apartment 8 is a family apartment with living room and kitchen, separate bedroom and bathroom. It is suitable for up to 4 guests.": { el: "Το Διαμέρισμα 8 διαθέτει καθιστικό με κουζίνα, ξεχωριστό υπνοδωμάτιο και μπάνιο, για έως 4 άτομα.", fr: "L’appartement 8 dispose d’un salon avec cuisine, d’une chambre séparée et d’une salle de bain, pour jusqu’à 4 personnes.", de: "Apartment 8 bietet Wohnbereich mit Küche, separates Schlafzimmer und Bad, für bis zu 4 Gäste.", it: "L’appartamento 8 dispone di soggiorno con cucina, camera separata e bagno, fino a 4 ospiti.", es: "El apartamento 8 tiene sala de estar con cocina, dormitorio separado y baño, hasta 4 personas.", tr: "Daire 8, mutfaklı oturma alanı, ayrı yatak odası ve banyoya sahiptir; 4 kişiye kadar uygundur." },
  "Apartment 9 offers the same family-friendly layout with kitchen, living area, bedroom and bathroom, suitable for up to 4 guests.": { el: "Το Διαμέρισμα 9 έχει πρακτική οικογενειακή διαρρύθμιση με κουζίνα, καθιστικό, υπνοδωμάτιο και μπάνιο, για έως 4 άτομα.", fr: "L’appartement 9 offre un agencement familial avec cuisine, salon, chambre et salle de bain, pour jusqu’à 4 personnes.", de: "Apartment 9 bietet eine familienfreundliche Aufteilung mit Küche, Wohnbereich, Schlafzimmer und Bad, für bis zu 4 Gäste.", it: "L’appartamento 9 offre una disposizione familiare con cucina, soggiorno, camera e bagno, fino a 4 ospiti.", es: "El apartamento 9 ofrece distribución familiar con cocina, sala de estar, dormitorio y baño, hasta 4 personas.", tr: "Daire 9, mutfak, oturma alanı, yatak odası ve banyodan oluşan aile dostu bir düzene sahiptir." },
  "Apartment 10 is a family apartment with living room and kitchen, bedroom and flexible sofa-bed layout.": { el: "Το Διαμέρισμα 10 διαθέτει καθιστικό με κουζίνα, υπνοδωμάτιο και ευέλικτη διαρρύθμιση με καναπέδες-κρεβάτια.", fr: "L’appartement 10 dispose d’un salon avec cuisine, d’une chambre et d’un agencement flexible avec canapés-lits.", de: "Apartment 10 bietet Wohnbereich mit Küche, Schlafzimmer und flexible Schlafsofas.", it: "L’appartamento 10 dispone di soggiorno con cucina, camera e disposizione flessibile con divani letto.", es: "El apartamento 10 tiene sala de estar con cocina, dormitorio y distribución flexible con sofás cama.", tr: "Daire 10, mutfaklı oturma alanı, yatak odası ve çekyatlı esnek yerleşim sunar." },
};

function translate(text: string, language: RoomLanguage) {
  if (language === "en") return text;
  return dictionary[text]?.[language] ?? text;
}

function localizeName(name: string, language: RoomLanguage) {
  if (language === "en") return name;
  const roomMatch = name.match(/^Room (\d+)$/);
  if (roomMatch) return `${dictionary.Room?.[language] ?? "Room"} ${roomMatch[1]}`;
  const apartmentMatch = name.match(/^Apartment (\d+)$/);
  if (apartmentMatch) return `${dictionary.Apartment?.[language] ?? "Apartment"} ${apartmentMatch[1]}`;
  return translate(name, language);
}

function localizeRoomText(text: string, language: RoomLanguage) {
  if (language === "en") return text;
  const guestMatch = text.match(/^Up to (\d+) guests$/);
  if (guestMatch) return labels[language].upToGuests(Number(guestMatch[1]));
  return translate(text, language);
}

function localizeImageAlt(room: IndividualRoomData, image: IndividualRoomData["images"][number], language: RoomLanguage) {
  if (language === "en") return image.alt;
  const roomName = localizeName(room.name, language);
  const caption = localizeRoomText(image.caption, language);
  return `${roomName} – ${caption} – ${labels[language].propertyLocation}`;
}

function shouldGroupRoomsByFloor(data: RoomDetailData) {
  return data.id === "economy-double-rooms";
}

function getFloorKind(room: IndividualRoomData): FloorKind {
  const values = [room.location, ...room.badges].map((value) => value.trim().toLowerCase());
  const groundValues = ["ground floor", "ισόγειο", "rez-de-chaussée", "erdgeschoss", "piano terra", "planta baja", "zemin kat"];
  const firstValues = ["first floor", "πρώτος όροφος", "premier étage", "obergeschoss", "primo piano", "primera planta", "üst kat", "birinci kat"];
  if (values.some((value) => groundValues.includes(value))) return "ground";
  if (values.some((value) => firstValues.includes(value))) return "first";
  return "other";
}

const unitListLabel: Record<RoomLanguage, (count: number, apartments: boolean) => string> = {
  en: (n, apt) => `See the ${n} ${apt ? "apartments" : "rooms"}`,
  el: (n, apt) => `Δείτε τα ${n} ${apt ? "διαμερίσματα" : "δωμάτια"}`,
  fr: (n, apt) => `Voir les ${n} ${apt ? "appartements" : "chambres"}`,
  de: (n, apt) => `Die ${n} ${apt ? "Apartments" : "Zimmer"} ansehen`,
  it: (n, apt) => (apt ? `Vedi i ${n} appartamenti` : `Vedi le ${n} camere`),
  es: (n, apt) => (apt ? `Ver los ${n} apartamentos` : `Ver las ${n} habitaciones`),
  tr: (n, apt) => `${n} ${apt ? "daireyi" : "odayı"} görün`,
};

const unitUi: Record<RoomLanguage, { askDates: string; checkAvailability: string; askMessage: (name: string) => string; size: (m2: number) => string; direct: string }> = {
  en: { askDates: "Ask for dates", checkAvailability: "Check availability", askMessage: (n) => `Hello! I would like to ask about availability for ${n} at Voulamandis House.`, size: (m) => `≈ ${m} m²`, direct: "−10% direct booking" },
  el: { askDates: "Ρωτήστε για ημερομηνίες", checkAvailability: "Δείτε διαθεσιμότητα", askMessage: (n) => `Καλησπέρα! Θα ήθελα να ρωτήσω για διαθεσιμότητα στο ${n} στο Voulamandis House.`, size: (m) => `≈ ${m} m²`, direct: "−10% απευθείας κράτηση" },
  fr: { askDates: "Demander vos dates", checkAvailability: "Voir les disponibilités", askMessage: (n) => `Bonjour ! Je souhaiterais connaître les disponibilités pour : ${n}, Voulamandis House.`, size: (m) => `≈ ${m} m²`, direct: "−10 % réservation directe" },
  de: { askDates: "Termine anfragen", checkAvailability: "Verfügbarkeit prüfen", askMessage: (n) => `Hallo! Ich möchte die Verfügbarkeit für ${n} im Voulamandis House anfragen.`, size: (m) => `≈ ${m} m²`, direct: "−10 % Direktbuchung" },
  it: { askDates: "Chiedi le date", checkAvailability: "Verifica disponibilità", askMessage: (n) => `Buongiorno! Vorrei sapere la disponibilità per ${n} a Voulamandis House.`, size: (m) => `≈ ${m} m²`, direct: "−10% prenotazione diretta" },
  es: { askDates: "Consultar fechas", checkAvailability: "Ver disponibilidad", askMessage: (n) => `¡Hola! Me gustaría consultar la disponibilidad de ${n} en Voulamandis House.`, size: (m) => `≈ ${m} m²`, direct: "−10% reserva directa" },
  tr: { askDates: "Tarihleri sorun", checkAvailability: "Müsaitliği gör", askMessage: (n) => `Merhaba! Voulamandis House'ta ${n} için müsaitlik sormak istiyorum.`, size: (m) => `≈ ${m} m²`, direct: "Doğrudan rezervasyonda −%10" },
};

const WHATSAPP_NUMBER = "306944474226";

const cardIconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  viewBox: "0 0 24 24",
};

function RoomVisualCard({ room, language }: { room: IndividualRoomData; language: RoomLanguage }) {
  const images = room.images.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];
  const [panoramaOpen, setPanoramaOpen] = useState(false);
  const panorama = roomPanoramas[room.id];
  const panoramaText = panoramaLabels[language];
  const roomName = localizeName(room.name, language);
  const ui = unitUi[language];
  const visibleBeds = room.beds.slice(0, 2);
  const bedText = room.beds.join(" ").toLowerCase();
  const visibleAmenities = room.amenities.filter((amenity) => !bedText.includes(amenity.label.toLowerCase())).slice(0, 4);
  const subtitle = [localizeRoomText(room.type, language), room.sizeM2 ? ui.size(room.sizeM2) : null].filter(Boolean).join(" · ");
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(ui.askMessage(roomName))}`;
  // Opens the AI Room Finder focused on this room, so the guest sees live
  // availability and the direct price instead of waiting for a WhatsApp reply.
  // Units without a number (none today) keep the WhatsApp question.
  const roomNumber = Number(room.id.match(/(\d+)$/)?.[1] || 0);
  const roomFinderHref = roomNumber >= 1 && roomNumber <= 10
    ? `${roomFinderHrefForLanguage(language)}?room=${roomNumber}`
    : null;

  return (
    <article data-reveal="" className="flex w-[84vw] max-w-[360px] flex-none snap-start flex-col rounded-3xl border border-[#eadfce] bg-white p-2.5 shadow-[0_1px_2px_rgba(47,38,31,0.06)] md:w-auto md:max-w-none">
      <div className="relative h-[214px] overflow-hidden rounded-[18px] bg-[#e8dccb] sm:h-[230px]">
        {activeImage ? (
          <Image
            src={activeImage.src}
            alt={localizeImageAlt(room, activeImage, language)}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 84vw"
            className="object-cover"
          />
        ) : null}
        <span className="absolute left-3 top-3 inline-flex min-h-7 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-[#2f261f] shadow-sm">
          <svg {...cardIconProps} width="15" height="15" className="text-[#9a3412]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></svg>
          {labels[language].upToGuests(room.maxGuests)}
        </span>
        <span className="absolute bottom-3 left-3 inline-flex min-h-8 max-w-[calc(100%-5.5rem)] items-center gap-1.5 rounded-2xl bg-[#2f261f]/90 px-3 py-1 text-[13px] font-semibold leading-tight text-white">
          <svg {...cardIconProps} width="15" height="15" className="shrink-0"><path d="M4 20h4v-4h4v-4h4V8h4" /></svg>
          {localizeRoomText(room.location, language)}
        </span>
        {images.length > 1 ? (
          <span className="absolute bottom-3 right-3 inline-flex min-h-7 items-center rounded-full bg-white/92 px-2.5 text-xs font-semibold text-[#2f261f]" aria-hidden="true">
            {activeIndex + 1} / {images.length}
          </span>
        ) : null}
        {panorama ? (
          <button
            type="button"
            onClick={() => setPanoramaOpen(true)}
            className="absolute right-3 top-3 inline-flex min-h-9 touch-manipulation items-center gap-1.5 rounded-full bg-[#2f261f]/90 px-3 text-xs font-semibold text-white shadow-lg transition hover:bg-[#2f261f] focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-400"
            aria-label={`${panoramaText.open} – ${roomName}`}
          >
            <svg {...cardIconProps} width="15" height="15" strokeWidth={2}><ellipse cx="12" cy="12" rx="9" ry="4" /><path d="M12 3a4 9 0 0 1 0 18M12 3a4 9 0 0 0 0 18" /></svg>
            {panoramaText.open}
          </button>
        ) : null}
      </div>
      {panorama && panoramaOpen ? (
        <RoomPanoramaViewer
          src={panorama.src}
          initialYawDeg={panorama.initialYawDeg}
          labels={{ ...panoramaText, title: `${roomName} · 360°` }}
          onClose={() => setPanoramaOpen(false)}
        />
      ) : null}

      {images.length > 1 ? (
        <div className="flex gap-1.5 px-0.5 pt-2" aria-label={`${roomName} ${labels[language].photos}`}>
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${labels[language].photos} ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={`relative h-12 flex-1 touch-manipulation overflow-hidden rounded-[10px] bg-[#e8dccb] outline-offset-2 transition ${index === activeIndex ? "outline outline-2 outline-[#2f261f]" : "opacity-75 hover:opacity-100"}`}
            >
              <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col px-2 pb-1.5 pt-3.5">
        <h3 className="text-[21px] font-semibold leading-snug tracking-[-0.01em] text-[#2f261f]">
          <MarkerText>{roomName}</MarkerText>
        </h3>
        {subtitle ? <p className="mt-1 text-[13px] font-semibold text-[#7a5f4b]">{subtitle}</p> : null}
        <p className="mt-2 line-clamp-3 text-sm leading-[1.5] text-[#5f4e41]">{localizeRoomText(room.description, language)}</p>

        {visibleBeds.length ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {visibleBeds.map((bed) => (
              <li key={bed} className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#eadfce] px-3 text-[13px] font-semibold text-[#2f261f]">
                <svg {...cardIconProps} width="15" height="15" className="text-[#9a3412]"><path d="M2 18V7" /><path d="M2 11h18a2 2 0 0 1 2 2v5" /><path d="M2 15h20" /><path d="M6 11V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" /></svg>
                {localizeRoomText(bed, language)}
              </li>
            ))}
          </ul>
        ) : null}

        {visibleAmenities.length ? (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {visibleAmenities.map((amenity) => (
              <li key={`${amenity.icon}-${amenity.label}`} className="inline-flex min-h-7 items-center gap-1 rounded-full bg-[#f7f1e8] px-2.5 text-xs text-[#4a3b30]">
                <svg {...cardIconProps} width="13" height="13" strokeWidth={2} className="text-[#9a3412]"><path d="M20 6 9 17l-5-5" /></svg>
                {localizeRoomText(amenity.label, language)}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-[#f0e7da] pt-3">
            <span className="text-xs font-semibold text-[#166534]">{ui.direct}</span>
            <a
              href={roomFinderHref || whatsappHref}
              {...(roomFinderHref
                ? { "data-room-finder-cta": "false" }
                : { target: "_blank", rel: "noopener noreferrer", "data-booking-cta": "true" })}
              className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full bg-[#fbeee0] px-4 text-sm font-semibold text-[#7c2d12] transition hover:bg-[#f7e0c8]"
            >
              {roomFinderHref ? ui.checkAvailability : ui.askDates}
              <span className="sr-only"> – {roomName}</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function FloorRoomGroup({ title, text, rooms, language }: { title: string; text: string; rooms: IndividualRoomData[]; language: RoomLanguage }) {
  if (!rooms.length) return null;

  return (
    <section className="relative" aria-label={title}>
      <header className="mb-5 max-w-[820px]">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">{title}</span>
        <p className="mt-3 max-w-[760px] text-sm leading-7 text-stone-600">{localizeRoomText(text, language)}</p>
        {rooms.length > 1 ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-amber-900 shadow-sm ring-1 ring-amber-900/10 md:hidden">
            {labels[language].swipe} <span aria-hidden="true">→</span>
          </p>
        ) : null}
      </header>
      <div className="relative">
        <div className={`flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 ${rooms.length <= 2 ? "md:mx-auto md:w-full md:max-w-5xl" : "xl:grid-cols-3"}`}>
          {rooms.map((room) => <RoomVisualCard room={room} language={language} key={room.id} />)}
        </div>
      </div>
    </section>
  );
}

function IndividualRoomsSection({ data, language }: { data: RoomDetailData; language: RoomLanguage }) {
  if (!data.individualRooms.rooms.length) return null;
  const localizedSectionLabels = sectionLabels[language];
  const sectionDescription = localizeRoomText(data.individualRooms.description, language);

  if (shouldGroupRoomsByFloor(data)) {
    const groundFloorRooms = data.individualRooms.rooms.filter((room) => getFloorKind(room) === "ground");
    const firstFloorRooms = data.individualRooms.rooms.filter((room) => getFloorKind(room) === "first");
    const otherRooms = data.individualRooms.rooms.filter((room) => getFloorKind(room) === "other");

    return (
      <section className="px-4 py-9 md:px-6 md:py-12" aria-labelledby="rd-individual-title">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 max-w-[820px]">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">{data.individualRooms.kicker}</span>
            <h2 id="rd-individual-title" className="mt-4 text-[2rem] font-black leading-[0.98] tracking-[-0.05em] text-[#2f261f] md:text-[2.625rem]"><MarkerText>{data.individualRooms.title}</MarkerText></h2>
            <p className="mt-5 max-w-[760px] text-base leading-8 text-stone-600 md:text-lg">{sectionDescription}</p>
          </header>
          <div className="space-y-10">
            <FloorRoomGroup title={localizedSectionLabels.groundTitle} text={localizedSectionLabels.groundText} rooms={groundFloorRooms} language={language} />
            <FloorRoomGroup title={localizedSectionLabels.firstTitle} text={localizedSectionLabels.firstText} rooms={firstFloorRooms} language={language} />
            {otherRooms.length ? <FloorRoomGroup title={data.individualRooms.title} text={sectionDescription} rooms={otherRooms} language={language} /> : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-9 md:px-6 md:py-12" aria-labelledby="rd-individual-title">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 max-w-[820px]">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">{data.individualRooms.kicker}</span>
          <h2 id="rd-individual-title" className="mt-4 text-[2rem] font-black leading-[0.98] tracking-[-0.05em] text-[#2f261f] md:text-[2.625rem]"><MarkerText>{data.individualRooms.title}</MarkerText></h2>
          <p className="mt-5 max-w-[760px] text-base leading-8 text-stone-600 md:text-lg">{sectionDescription}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-amber-900 shadow-sm ring-1 ring-amber-900/10 md:hidden">
            {labels[language].swipe} <span aria-hidden="true">→</span>
          </p>
        </header>
        <div className="relative">
          <div className={`flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 ${data.individualRooms.rooms.length <= 2 ? "md:mx-auto md:w-full md:max-w-5xl" : "xl:grid-cols-3"}`}>
            {data.individualRooms.rooms.map((room) => <RoomVisualCard room={room} language={language} key={room.id} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RoomDetailPage({ data, fromPriceLabel }: RoomDetailPageProps) {
  const language = getRoomLanguage(data.seo.canonicalPath);
  const localLabels = labels[language];
  const primaryBookingHref = bookingPathByLanguage[language] || data.hero.primaryCta.href;
  // The Room Finder answers about this page's rooms first (?rooms=1,3,4).
  const pageRoomNumbers = [...new Set(
    data.individualRooms.rooms
      .map(room => Number(room.id.match(/(\d+)$/)?.[1] || 0))
      .filter(room => room >= 1 && room <= 10),
  )].sort((a, b) => a - b);
  const aiAvailabilityHref = pageRoomNumbers.length
    ? `${roomFinderHrefForLanguage(language)}?rooms=${pageRoomNumbers.join(",")}`
    : roomFinderHrefForLanguage(language);
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf6ef] pb-20 text-[#2f261f] md:pb-0">
      <ScrollEffects />
      <section className="relative overflow-hidden bg-[#f3e7d7] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12" aria-labelledby="rd-hero-title">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-[32px] border border-amber-900/10 bg-[#fffaf3] shadow-[0_24px_70px_rgba(47,38,31,0.12)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <span className="inline-flex w-fit rounded-full border border-amber-900/12 bg-amber-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-800">{data.hero.kicker}</span>
              <h1 id="rd-hero-title" className="mt-5 text-balance text-[2.35rem] font-black leading-[0.98] tracking-[-0.045em] text-[#2f261f] sm:text-[3.25rem] lg:text-[3.75rem]">{data.hero.title}</h1>
              <p className="mt-3 text-base font-semibold leading-7 text-[#5f4e41] sm:text-lg">{data.hero.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-1.5" aria-label={localLabels.highlights}>
                {data.hero.badges.map((badge) => <span key={badge} className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#eadfce] bg-white px-3 text-[13px] font-semibold text-[#2f261f]"><svg {...cardIconProps} width="13" height="13" strokeWidth={2} className="text-[#9a3412]"><path d="M20 6 9 17l-5-5" /></svg>{localizeRoomText(badge, language)}</span>)}
              </div>
              {fromPriceLabel ? (
                <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-2xl font-black tracking-[-0.03em] text-amber-800">{fromPriceLabel}</span>
                  <span className="text-xs font-bold text-[#6a5b4e]">{localLabels.priceNote}</span>
                </p>
              ) : null}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a id="rd-hero-availability" data-room-finder-cta="false" className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-amber-500 px-5 text-center text-[11px] font-black uppercase tracking-[0.12em] !text-[#2f261f] shadow-[0_16px_32px_rgba(180,117,16,0.22)] transition hover:-translate-y-0.5 hover:bg-amber-400 sm:text-xs" href={aiAvailabilityHref} style={{ color: "#2f261f" }}>{localLabels.checkAvailability}</a>
                <a className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-amber-900/20 bg-white px-5 text-center text-[11px] font-black uppercase tracking-[0.12em] text-[#2f261f] transition hover:-translate-y-0.5 hover:bg-amber-50 sm:text-xs" href={primaryBookingHref} data-booking-cta="true">{localLabels.bookOnline}</a>
              </div>
              {data.individualRooms.rooms.length > 1 ? (
                <a href="#rd-individual-title" className="mt-4 inline-flex min-h-11 items-center self-start text-sm font-semibold text-[#7c2d12] underline decoration-amber-300 underline-offset-4">
                  {unitListLabel[language](data.individualRooms.rooms.length, data.individualRooms.rooms.every((room) => /^Apartment /.test(room.name)))} <span aria-hidden="true">&nbsp;↓</span>
                </a>
              ) : null}
            </div>
            <div className="relative order-first min-h-[220px] overflow-hidden sm:min-h-[300px] lg:order-none lg:min-h-[540px]">
              <Image src={data.hero.image} alt={data.hero.imageAlt} fill priority fetchPriority="high" sizes="(min-width: 1024px) 54vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2f261f]/28 via-transparent to-transparent" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Three-photo strip, same as the beaches and villages hubs: search
          engines use it for the image row under the result. */}
      <ChiosCollectionImageGallery
        kind="rooms"
        language={language}
        // One photo per room first, then each room's second photo, so the
        // strip shows different rooms rather than one room twice.
        items={[0, 1].flatMap((photoIndex) =>
          data.individualRooms.rooms.flatMap((room) => {
            const image = room.images[photoIndex];
            return image
              ? [{
                  image: image.src,
                  imageAlt: localizeImageAlt(room, image, language),
                  // Only a room's first photo carries its name, so two tiles
                  // of the same room are not labelled twice.
                  title: photoIndex === 0 ? localizeName(room.name, language) : "",
                  href: "#rd-individual-title",
                }]
              : [];
          }),
        )}
      />

      <IndividualRoomsSection data={data} language={language} />

      {data.comparison ? (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="rd-compare-title">
          <header className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">{data.comparison.kicker}</span>
            <h2 id="rd-compare-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] text-[#2f261f] sm:text-4xl"><MarkerText>{data.comparison.title}</MarkerText></h2>
          </header>
          <div className="mt-6 overflow-hidden rounded-[24px] border border-amber-900/10 bg-white shadow-[0_18px_45px_rgba(47,38,31,0.08)] sm:hidden">
            <dl className="divide-y divide-amber-900/10">
              {data.comparison.rows.map((row) => (
                <div className="px-4 py-3" key={row.label}>
                  <dt className="text-[11px] font-black uppercase tracking-[0.1em] text-[#8a7866]">{row.label}</dt>
                  <dd className="mt-1.5 grid gap-3" style={{ gridTemplateColumns: `repeat(${row.values.length}, minmax(0, 1fr))` }}>
                    {row.values.map((value, index) => (
                      <span className={`min-w-0 hyphens-auto font-bold leading-6 text-[#2f261f] [overflow-wrap:anywhere] ${row.values.length > 2 ? "text-[13px]" : "text-sm"}`} key={`${row.label}-${index}`}>
                        <span className="block text-[11px] font-black text-amber-800">{data.comparison?.columns[index]}</span>
                        {value}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-6 hidden overflow-hidden rounded-[24px] border border-amber-900/10 bg-white shadow-[0_18px_45px_rgba(47,38,31,0.08)] sm:block">
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <thead className="bg-[#f3e7d7] text-[11px] font-black uppercase tracking-[0.12em] text-amber-900">
                <tr>
                  <th scope="col" className="w-[34%] px-5 py-3"><span className="sr-only">{data.comparison.kicker}</span></th>
                  {data.comparison.columns.map((column) => <th scope="col" className="px-3 py-3 text-sm normal-case tracking-normal sm:px-5 sm:text-base" key={column}>{column}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10 text-[#2f261f]">
                {data.comparison.rows.map((row) => (
                  <tr key={row.label} className="align-top">
                    <th scope="row" className="px-5 py-3 text-[11px] font-black uppercase tracking-[0.1em] text-[#8a7866] hyphens-auto">{row.label}</th>
                    {row.values.map((value, index) => <td className="break-words px-3 py-3 font-bold leading-6 sm:px-5" key={`${row.label}-${index}`}>{value}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.comparison.note ? <p className="mt-3 text-xs leading-6 text-[#6a5b4e]">{data.comparison.note}</p> : null}
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12" aria-labelledby="rd-overview-title">
        <div className="mx-auto max-w-4xl">
          <article className="rounded-[30px] border border-amber-900/10 bg-white p-5 shadow-[0_18px_45px_rgba(47,38,31,0.10)] sm:p-8">
            <span className="inline-flex rounded-full border border-amber-900/10 bg-amber-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-amber-800">{data.overview.kicker}</span>
            <h2 id="rd-overview-title" className="break-words hyphens-auto mt-5 text-balance text-3xl font-black tracking-[-0.035em] text-[#2f261f] sm:text-4xl"><MarkerText>{data.overview.title}</MarkerText></h2>
            <div className="mt-5 space-y-4 text-base leading-8 text-[#574b3f]">{[data.hero.description, ...data.overview.paragraphs].filter((paragraph, index, all) => paragraph && all.indexOf(paragraph) === index).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </article>
        </div>
      </section>

      {data.outdoor ? (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="rd-outdoor-title">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">{data.outdoor.kicker}</span>
              <h2 id="rd-outdoor-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] text-[#2f261f] sm:text-4xl"><MarkerText>{data.outdoor.title}</MarkerText></h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-[#574b3f]">{data.outdoor.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.outdoor.images.slice(0, 4).map((image) => (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-stone-200 ring-1 ring-amber-900/10" key={image.src}>
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 28vw, 46vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="rd-amenities-title">
        <header className="mx-auto max-w-3xl text-center"><span className="inline-flex text-[11px] font-black uppercase tracking-[0.28em] text-amber-800">{data.amenities.kicker}</span><h2 id="rd-amenities-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] text-[#2f261f] sm:text-4xl"><MarkerText>{data.amenities.title}</MarkerText></h2></header>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.amenities.items.map((item) => <article data-reveal="" className="min-w-0 break-words rounded-2xl bg-white p-4 shadow-[0_12px_32px_rgba(47,38,31,0.08)] hyphens-auto" key={item.label}><div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-lg grayscale contrast-125" aria-hidden="true">{item.icon}</div><h3 className="mt-3 text-sm font-black text-[#2f261f] sm:text-base">{localizeRoomText(item.label, language)}</h3><p className="mt-2 text-xs leading-5 text-[#574b3f] sm:text-sm">{item.text}</p></article>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="rd-best-title">
        <div className="rounded-[30px] bg-white p-5 shadow-[0_18px_45px_rgba(47,38,31,0.08)] sm:p-8">
          <span className="inline-flex text-[11px] font-black uppercase tracking-[0.28em] text-amber-800">{data.bestFor.kicker}</span>
          <h2 id="rd-best-title" className="break-words hyphens-auto mt-4 text-balance text-3xl font-black tracking-[-0.04em] text-[#2f261f] sm:text-4xl"><MarkerText>{data.bestFor.title}</MarkerText></h2>
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.bestFor.items.map((item) => <div data-reveal="" className="rounded-2xl bg-amber-50/50 p-3 text-sm leading-6 text-[#574b3f] ring-1 ring-amber-900/10" key={item}><span className="mr-2 font-black text-emerald-700">✓</span>{localizeRoomText(item, language)}</div>)}
          </div>
        </div>
      </section>

      <section id="rd-booking-section" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12" aria-labelledby="rd-booking-title">
        <div data-reveal="" className="overflow-hidden rounded-[30px] bg-gradient-to-br from-[#2f261f] via-[#5f421f] to-[#9a6f11] p-5 text-white shadow-[0_28px_70px_rgba(47,38,31,0.22)] sm:p-8 lg:p-10">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><span className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-amber-100 before:h-px before:w-10 before:bg-amber-200/70">{data.booking.kicker}</span><h2 id="rd-booking-title" className="mt-5 text-balance text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-4xl lg:text-[2.625rem]"><MarkerText onDark>{data.booking.title}</MarkerText></h2><p className="mt-5 max-w-3xl text-base leading-8 text-white/88 sm:text-lg">{data.booking.text}</p><small className="mt-4 block text-sm leading-6 text-white/72">{data.booking.note}</small></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px] lg:grid-cols-1"><a className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#25D366] px-6 text-center text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_38px_rgba(37,211,102,0.26)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d]" href={data.booking.whatsappHref}>{data.booking.whatsappLabel}</a><a className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/32 bg-white/10 px-6 text-center text-xs font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#2f261f]" href={data.booking.phoneHref}>{data.booking.phoneLabel}</a></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="rd-faq-title">
        <header className="mx-auto max-w-3xl text-center"><span className="inline-flex text-[11px] font-black uppercase tracking-[0.28em] text-amber-800">{localLabels.faqKicker}</span><h2 id="rd-faq-title" className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#2f261f] sm:text-4xl"><MarkerText>{localLabels.faqTitle}</MarkerText></h2></header>
        <div className="mx-auto mt-8 max-w-3xl space-y-3">{data.faq.map((item) => <details data-reveal="" className="rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(47,38,31,0.07)]" key={item.question}><summary className="cursor-pointer text-base font-black text-[#2f261f]">{item.question}</summary><p className="mt-3 text-sm leading-7 text-[#574b3f]">{localizeRoomText(item.answer, language)}</p></details>)}</div>
      </section>

      <TopicBadges locale={language} context="room-detail" className="border-t border-amber-900/10" />

      {data.related ? (
        <nav className="mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-6 lg:px-8" aria-labelledby="rd-related-title">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">{data.related.kicker}</span>
          <h2 id="rd-related-title" className="mt-3 text-balance text-2xl font-black tracking-[-0.03em] text-[#2f261f] sm:text-3xl"><MarkerText>{data.related.title}</MarkerText></h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.related.links.map((link) => (
              <li key={link.href} data-reveal="">
                <a href={link.href} className="group block h-full rounded-2xl border border-amber-900/10 bg-white p-4 shadow-[0_10px_26px_rgba(47,38,31,0.06)] transition hover:-translate-y-0.5 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-700/25">
                  <span className="block text-base font-black text-[#2f261f] group-hover:text-amber-800">{link.title} <span aria-hidden="true">→</span></span>
                  <span className="mt-1 block text-sm leading-6 text-[#574b3f]">{link.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <MobileAvailabilityBar
        href={aiAvailabilityHref}
        label={localLabels.checkAvailability}
        tone="gold"
        showAfterId="rd-hero-availability"
        hideWhileIds={["rd-booking-section"]}
      />
    </main>
  );
}

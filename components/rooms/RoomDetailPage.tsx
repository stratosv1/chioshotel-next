"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { TopicBadges } from "@/components/seo/TopicBadges";
import type { IndividualRoomData, RoomDetailData } from "@/content/room-details";

type RoomDetailPageProps = { data: RoomDetailData };
type RoomLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type FloorKind = "ground" | "first" | "other";

type RoomDictionary = Partial<Record<RoomLanguage, string>>;

function getRoomLanguage(path: string): RoomLanguage {
  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";
  return "en";
}

const labels: Record<RoomLanguage, { upToGuests: (count: number) => string; faqKicker: string; faqTitle: string; nextRoom: string; swipe: string }> = {
  en: { upToGuests: (count) => `Up to ${count} guests`, faqKicker: "Questions", faqTitle: "Room FAQ", nextRoom: "Next room", swipe: "Swipe to see more rooms" },
  el: { upToGuests: (count) => `Έως ${count} άτομα`, faqKicker: "Ερωτήσεις", faqTitle: "Συχνές ερωτήσεις δωματίου", nextRoom: "Επόμενο δωμάτιο", swipe: "Σύρε για περισσότερα δωμάτια" },
  fr: { upToGuests: (count) => `Jusqu’à ${count} personnes`, faqKicker: "Questions", faqTitle: "FAQ de la chambre", nextRoom: "Chambre suivante", swipe: "Faites glisser pour voir plus" },
  de: { upToGuests: (count) => `Bis zu ${count} Gäste`, faqKicker: "Fragen", faqTitle: "Zimmer-FAQ", nextRoom: "Nächstes Zimmer", swipe: "Wischen für weitere Zimmer" },
  it: { upToGuests: (count) => `Fino a ${count} ospiti`, faqKicker: "Domande", faqTitle: "FAQ della camera", nextRoom: "Camera successiva", swipe: "Scorri per vedere altre camere" },
  es: { upToGuests: (count) => `Hasta ${count} personas`, faqKicker: "Preguntas", faqTitle: "Preguntas frecuentes", nextRoom: "Habitación siguiente", swipe: "Desliza para ver más habitaciones" },
  tr: { upToGuests: (count) => `${count} kişiye kadar`, faqKicker: "Sorular", faqTitle: "Oda SSS", nextRoom: "Sonraki oda", swipe: "Daha fazla oda için kaydırın" },
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
  "Room": { el: "Δωμάτιο", fr: "Chambre", de: "Zimmer", it: "Camera", es: "Habitación", tr: "Oda" },
  "Apartment": { el: "Διαμέρισμα", fr: "Appartement", de: "Apartment", it: "Appartamento", es: "Apartamento", tr: "Daire" },
  "Ground floor": { el: "Ισόγειο", fr: "Rez-de-chaussée", de: "Erdgeschoss", it: "Piano terra", es: "Planta baja", tr: "Zemin kat" },
  "First floor": { el: "Πρώτος όροφος", fr: "Premier étage", de: "Obergeschoss", it: "Primo piano", es: "Primera planta", tr: "Üst kat" },
  "Stand alone": { el: "Ανεξάρτητη μονάδα", fr: "Unité indépendante", de: "Eigenständige Einheit", it: "Unità indipendente", es: "Unidad independiente", tr: "Bağımsız birim" },
  "Ground-floor double / triple": { el: "Ισόγειο δίκλινο / τρίκλινο", fr: "Double / triple au rez-de-chaussée", de: "Doppel- / Dreibettzimmer im Erdgeschoss", it: "Doppia / tripla al piano terra", es: "Doble / triple en planta baja", tr: "Zemin kat çift / üç kişilik oda" },
  "First-floor double / triple": { el: "Δίκλινο / τρίκλινο πρώτου ορόφου", fr: "Double / triple au premier étage", de: "Doppel- / Dreibettzimmer im Obergeschoss", it: "Doppia / tripla al primo piano", es: "Doble / triple en primera planta", tr: "Üst kat çift / üç kişilik oda" },
  "Budget double room": { el: "Οικονομικό δίκλινο", fr: "Chambre double économique", de: "Economy Doppelzimmer", it: "Camera doppia economy", es: "Habitación doble económica", tr: "Ekonomik çift kişilik oda" },
  "Garden access": { el: "Πρόσβαση στον κήπο", fr: "Accès jardin", de: "Gartenzugang", it: "Accesso al giardino", es: "Acceso al jardín", tr: "Bahçe erişimi" },
  "No stairs": { el: "Χωρίς σκάλες", fr: "Sans escaliers", de: "Keine Treppen", it: "Senza scale", es: "Sin escaleras", tr: "Merdivensiz" },
  "Economy": { el: "Οικονομικό", fr: "Économique", de: "Economy", it: "Economy", es: "Económico", tr: "Ekonomik" },
  "Kambos view": { el: "Θέα στον Κάμπο", fr: "Vue sur Kambos", de: "Blick auf Kambos", it: "Vista su Kambos", es: "Vista a Kambos", tr: "Kambos manzarası" },
  "Upper-floor view": { el: "Θέα από τον όροφο", fr: "Vue depuis l’étage", de: "Blick vom Obergeschoss", it: "Vista dal piano superiore", es: "Vista desde la planta superior", tr: "Üst kat manzarası" },
  "Private balcony": { el: "Ιδιωτικό μπαλκόνι", fr: "Balcon privé", de: "Privater Balkon", it: "Balcone privato", es: "Balcón privado", tr: "Özel balkon" },
  "Kitchenette": { el: "Μικρή κουζίνα", fr: "Kitchenette", de: "Kitchenette", it: "Angolo cottura", es: "Kitchenette", tr: "Kitchenette" },
  "Sofa bed": { el: "Καναπές-κρεβάτι", fr: "Canapé-lit", de: "Schlafsofa", it: "Divano letto", es: "Sofá cama", tr: "Çekyat" },
  "Full kitchen": { el: "Πλήρης κουζίνα", fr: "Cuisine complète", de: "Voll ausgestattete Küche", it: "Cucina completa", es: "Cocina completa", tr: "Tam mutfak" },
  "Garden view": { el: "Θέα στον κήπο", fr: "Vue jardin", de: "Gartenblick", it: "Vista giardino", es: "Vista al jardín", tr: "Bahçe manzarası" },
  "Family space": { el: "Οικογενειακός χώρος", fr: "Espace familial", de: "Familienbereich", it: "Spazio famiglia", es: "Espacio familiar", tr: "Aile alanı" },
  "Open-plan space": { el: "Ενιαίος χώρος", fr: "Espace ouvert", de: "Offener Raum", it: "Spazio open space", es: "Espacio abierto", tr: "Açık plan alan" },
  "Access by stairs": { el: "Πρόσβαση με σκάλες", fr: "Accès par escalier", de: "Zugang über Treppen", it: "Accesso tramite scale", es: "Acceso por escaleras", tr: "Merdivenle erişim" },
  "Two spaces, no connecting door": { el: "Δύο χώροι, χωρίς ενδιάμεση πόρτα", fr: "Deux espaces, sans porte communicante", de: "Zwei Bereiche, keine Verbindungstür", it: "Due ambienti, senza porta comunicante", es: "Dos espacios, sin puerta comunicante", tr: "İki alan, ara kapı yok" },
  "Wi-Fi": { el: "Wi‑Fi", fr: "Wi‑Fi", de: "WLAN", it: "Wi‑Fi", es: "Wi‑Fi", tr: "Wi‑Fi" },
  "Coffee and tea kettle": { el: "Βραστήρας για καφέ και τσάι", fr: "Bouilloire pour café et thé", de: "Wasserkocher für Kaffee und Tee", it: "Bollitore per caffè e tè", es: "Hervidor para café y té", tr: "Kahve ve çay için su ısıtıcısı" },
  "Ground-floor view": { el: "Θέα ισογείου", fr: "Vue du rez-de-chaussée", de: "Blick im Erdgeschoss", it: "Vista dal piano terra", es: "Vista de planta baja", tr: "Zemin kat manzarası" },
  "1 double bed": { el: "1 διπλό κρεβάτι", fr: "1 lit double", de: "1 Doppelbett", it: "1 letto matrimoniale", es: "1 cama doble", tr: "1 çift kişilik yatak" },
  "1 single bed": { el: "1 μονό κρεβάτι", fr: "1 lit simple", de: "1 Einzelbett", it: "1 letto singolo", es: "1 cama individual", tr: "1 tek kişilik yatak" },
  "2 single beds": { el: "2 μονά κρεβάτια", fr: "2 lits simples", de: "2 Einzelbetten", it: "2 letti singoli", es: "2 camas individuales", tr: "2 tek kişilik yatak" },
  "1 sofa bed": { el: "1 καναπές-κρεβάτι", fr: "1 canapé-lit", de: "1 Schlafsofa", it: "1 divano letto", es: "1 sofá cama", tr: "1 çekyat" },
  "2 sofa beds": { el: "2 καναπέδες-κρεβάτια", fr: "2 canapés-lits", de: "2 Schlafsofas", it: "2 divani letto", es: "2 sofás cama", tr: "2 çekyat" },
  "Room view": { el: "Θέα δωματίου", fr: "Vue de la chambre", de: "Zimmerblick", it: "Vista camera", es: "Vista de la habitación", tr: "Oda manzarası" },
  "Bedroom": { el: "Υπνοδωμάτιο", fr: "Chambre", de: "Schlafzimmer", it: "Camera da letto", es: "Dormitorio", tr: "Yatak odası" },
  "Double bed": { el: "Διπλό κρεβάτι", fr: "Lit double", de: "Doppelbett", it: "Letto matrimoniale", es: "Cama doble", tr: "Çift kişilik yatak" },
  "Desk": { el: "Γραφείο", fr: "Bureau", de: "Schreibtisch", it: "Scrivania", es: "Escritorio", tr: "Çalışma masası" },
  "Bathroom": { el: "Μπάνιο", fr: "Salle de bain", de: "Bad", it: "Bagno", es: "Baño", tr: "Banyo" },
  "Layout": { el: "Διαρρύθμιση", fr: "Agencement", de: "Aufteilung", it: "Disposizione", es: "Distribución", tr: "Yerleşim" },
  "Detail": { el: "Λεπτομέρεια", fr: "Détail", de: "Detail", it: "Dettaglio", es: "Detalle", tr: "Detay" },
  "Room layout": { el: "Διαρρύθμιση δωματίου", fr: "Agencement de la chambre", de: "Zimmeraufteilung", it: "Disposizione della camera", es: "Distribución de la habitación", tr: "Oda yerleşimi" },
  "Kitchenette area": { el: "Χώρος μικρής κουζίνας", fr: "Coin kitchenette", de: "Kitchenette-Bereich", it: "Zona angolo cottura", es: "Zona de kitchenette", tr: "Kitchenette alanı" },
  "Traditional interior": { el: "Παραδοσιακό εσωτερικό", fr: "Intérieur traditionnel", de: "Traditionelles Interieur", it: "Interni tradizionali", es: "Interior tradicional", tr: "Geleneksel iç mekan" },
  "Traditional decoration": { el: "Παραδοσιακή διακόσμηση", fr: "Décoration traditionnelle", de: "Traditionelle Dekoration", it: "Decorazione tradizionale", es: "Decoración tradicional", tr: "Geleneksel dekorasyon" },
  "Traditional details": { el: "Παραδοσιακές λεπτομέρειες", fr: "Détails traditionnels", de: "Traditionelle Details", it: "Dettagli tradizionali", es: "Detalles tradicionales", tr: "Geleneksel detaylar" },
  "Stone wall interior": { el: "Πέτρινος τοίχος", fr: "Mur en pierre", de: "Steinwand", it: "Parete in pietra", es: "Pared de piedra", tr: "Taş duvar" },
  "Stone bathroom details": { el: "Πέτρινες λεπτομέρειες μπάνιου", fr: "Détails en pierre dans la salle de bain", de: "Steindetails im Bad", it: "Dettagli in pietra nel bagno", es: "Detalles de piedra en el baño", tr: "Banyoda taş detaylar" },
  "Spacious layout": { el: "Ευρύχωρη διαρρύθμιση", fr: "Agencement spacieux", de: "Geräumige Aufteilung", it: "Disposizione spaziosa", es: "Distribución amplia", tr: "Geniş yerleşim" },
  "Terrace access": { el: "Πρόσβαση στη βεράντα", fr: "Accès terrasse", de: "Terrassenzugang", it: "Accesso alla terrazza", es: "Acceso a la terraza", tr: "Teras erişimi" },
  "Balcony view": { el: "Θέα από το μπαλκόνι", fr: "Vue du balcon", de: "Balkonblick", it: "Vista dal balcone", es: "Vista desde el balcón", tr: "Balkon manzarası" },
  "Courtyard access": { el: "Πρόσβαση στην αυλή", fr: "Accès à la cour", de: "Zugang zum Innenhof", it: "Accesso al cortile", es: "Acceso al patio", tr: "Avlu erişimi" },
  "Room 6 is ideal for guests who love nature. Located on the ground floor, it opens directly to the peaceful courtyard and garden.": { el: "Το Δωμάτιο 6 είναι ιδανικό για επισκέπτες που αγαπούν τη φύση. Βρίσκεται στο ισόγειο και ανοίγει απευθείας στην ήρεμη αυλή και στον κήπο.", fr: "La chambre 6 est idéale pour les hôtes qui aiment la nature. Située au rez-de-chaussée, elle s’ouvre directement sur la cour paisible et le jardin.", de: "Zimmer 6 ist ideal für Gäste, die Natur lieben. Es liegt im Erdgeschoss und öffnet sich direkt zum ruhigen Hof und Garten.", it: "La camera 6 è ideale per chi ama la natura. Si trova al piano terra e si apre direttamente sul cortile tranquillo e sul giardino.", es: "La habitación 6 es ideal para quienes aman la naturaleza. Está en planta baja y se abre directamente al patio tranquilo y al jardín.", tr: "Oda 6 doğayı seven konuklar için idealdir. Zemin katta yer alır ve huzurlu avlu ile bahçeye doğrudan açılır." },
  "Room 2 is located on the first floor and offers access to a shared terrace with views over the estate and the citrus trees of Kambos.": { el: "Το Δωμάτιο 2 βρίσκεται στον πρώτο όροφο και προσφέρει πρόσβαση σε κοινόχρηστη βεράντα με θέα στο κτήμα και στα εσπεριδοειδή του Κάμπου.", fr: "La chambre 2 se trouve au premier étage et offre un accès à une terrasse partagée avec vue sur le domaine et les agrumes de Kambos.", de: "Zimmer 2 liegt im Obergeschoss und bietet Zugang zu einer gemeinsamen Terrasse mit Blick auf das Anwesen und die Zitrusbäume von Kambos.", it: "La camera 2 si trova al primo piano e offre accesso a una terrazza condivisa con vista sulla tenuta e sugli agrumi di Kambos.", es: "La habitación 2 está en la primera planta y ofrece acceso a una terraza compartida con vistas a la finca y a los cítricos de Kambos.", tr: "Oda 2 üst katta yer alır ve Kambos’taki tesis ile narenciye ağaçlarına bakan ortak terasa erişim sunar." },
  "Room 5 is a ground-floor double / triple room with direct courtyard and garden access. It is ideal for guests who prefer no stairs and an easy outdoor connection.": { el: "Το Δωμάτιο 5 είναι ισόγειο δίκλινο / τρίκλινο με άμεση πρόσβαση στην αυλή και στον κήπο. Είναι ιδανικό για επισκέπτες που προτιμούν χωρίς σκάλες και εύκολη επαφή με τον εξωτερικό χώρο.", fr: "La chambre 5 est une chambre double / triple au rez-de-chaussée avec accès direct à la cour et au jardin.", de: "Zimmer 5 ist ein Doppel- / Dreibettzimmer im Erdgeschoss mit direktem Zugang zum Hof und Garten.", it: "La camera 5 è una doppia / tripla al piano terra con accesso diretto al cortile e al giardino.", es: "La habitación 5 es una doble / triple en planta baja con acceso directo al patio y al jardín.", tr: "Oda 5, avlu ve bahçeye doğrudan erişimi olan zemin kat çift / üç kişilik odadır." },
  "Room 7 is a ground-floor double / triple room with garden access and a flexible layout with a sofa bed.": { el: "Το Δωμάτιο 7 είναι ισόγειο δίκλινο / τρίκλινο με πρόσβαση στον κήπο και ευέλικτη διαρρύθμιση με καναπέ-κρεβάτι.", fr: "La chambre 7 est une double / triple au rez-de-chaussée avec accès au jardin et un canapé-lit.", de: "Zimmer 7 ist ein Doppel- / Dreibettzimmer im Erdgeschoss mit Gartenzugang und Schlafsofa.", it: "La camera 7 è una doppia / tripla al piano terra con accesso al giardino e divano letto.", es: "La habitación 7 es una doble / triple en planta baja con acceso al jardín y sofá cama.", tr: "Oda 7, bahçe erişimi ve çekyatlı esnek yerleşimi olan zemin kat çift / üç kişilik odadır." },
  "Room 1 is a first-floor room for up to 4 guests, with upper-floor view, private balcony feel and two sleeping spaces without a connecting door.": { el: "Το Δωμάτιο 1 βρίσκεται στον πρώτο όροφο και φιλοξενεί έως 4 άτομα, με θέα από τον όροφο, αίσθηση ιδιωτικού μπαλκονιού και δύο χώρους ύπνου χωρίς ενδιάμεση πόρτα.", fr: "La chambre 1 est au premier étage pour jusqu’à 4 personnes, avec vue depuis l’étage et deux espaces de couchage sans porte communicante.", de: "Zimmer 1 liegt im Obergeschoss und bietet Platz für bis zu 4 Gäste, mit Ausblick und zwei Schlafbereichen ohne Verbindungstür.", it: "La camera 1 si trova al primo piano e ospita fino a 4 persone, con vista dall’alto e due zone notte senza porta comunicante.", es: "La habitación 1 está en la primera planta y aloja hasta 4 personas, con vistas desde arriba y dos zonas de descanso sin puerta comunicante.", tr: "Oda 1 üst katta yer alır, 4 kişiye kadar konaklama sunar ve ara kapı olmayan iki uyku alanına sahiptir." },
  "Room 3 is a first-floor double / triple room with kitchenette, upper-floor view and access by stairs.": { el: "Το Δωμάτιο 3 είναι δίκλινο / τρίκλινο πρώτου ορόφου με μικρή κουζίνα, θέα από τον όροφο και πρόσβαση με σκάλες.", fr: "La chambre 3 est une double / triple au premier étage avec kitchenette et accès par escalier.", de: "Zimmer 3 ist ein Doppel- / Dreibettzimmer im Obergeschoss mit Kitchenette und Treppenzugang.", it: "La camera 3 è una doppia / tripla al primo piano con angolo cottura e accesso tramite scale.", es: "La habitación 3 es una doble / triple en primera planta con kitchenette y acceso por escaleras.", tr: "Oda 3, kitchenette ve merdiven erişimi olan üst kat çift / üç kişilik odadır." },
  "Room 4 is a first-floor double / triple room with kitchenette, sofa bed and upper-floor view.": { el: "Το Δωμάτιο 4 είναι δίκλινο / τρίκλινο πρώτου ορόφου με μικρή κουζίνα, καναπέ-κρεβάτι και θέα από τον όροφο.", fr: "La chambre 4 est une double / triple au premier étage avec kitchenette, canapé-lit et vue depuis l’étage.", de: "Zimmer 4 ist ein Doppel- / Dreibettzimmer im Obergeschoss mit Kitchenette, Schlafsofa und Ausblick.", it: "La camera 4 è una doppia / tripla al primo piano con angolo cottura, divano letto e vista dall’alto.", es: "La habitación 4 es una doble / triple en primera planta con kitchenette, sofá cama y vistas.", tr: "Oda 4, kitchenette, çekyat ve üst kat manzarası sunan çift / üç kişilik odadır." },
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

function shouldGroupRoomsByFloor(data: RoomDetailData) {
  return data.id === "standard-double-room" || data.id === "economy-double-rooms";
}

function shouldShowMixedGallery(_data: RoomDetailData) {
  return false;
}

function getFloorKind(room: IndividualRoomData): FloorKind {
  const values = [room.location, ...room.badges].map((value) => value.trim().toLowerCase());
  const groundValues = ["ground floor", "ισόγειο", "rez-de-chaussée", "erdgeschoss", "piano terra", "planta baja", "zemin kat"];
  const firstValues = ["first floor", "πρώτος όροφος", "premier étage", "obergeschoss", "primo piano", "primera planta", "üst kat", "birinci kat"];
  if (values.some((value) => groundValues.includes(value))) return "ground";
  if (values.some((value) => firstValues.includes(value))) return "first";
  return "other";
}

function IndividualRoomCard({ room, language }: { room: IndividualRoomData; language: RoomLanguage }) {
  const [activeImage, setActiveImage] = useState(room.images[0]);

  return (
    <article className="overflow-hidden rounded-[30px] border border-amber-900/10 bg-white shadow-[0_18px_45px_rgba(47,38,31,0.10)]">
      <div className="p-3 sm:p-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-stone-200">
          {activeImage ? <Image src={activeImage.src} alt={activeImage.alt} fill sizes="(min-width: 768px) 520px, 86vw" className="object-cover" /> : null}
          {activeImage ? (
            <span className="absolute bottom-4 left-4 rounded-full bg-white/92 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-amber-900 shadow-lg">
              {localizeRoomText(activeImage.caption, language)}
            </span>
          ) : null}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2" aria-label={`${localizeName(room.name, language)} photos`}>
          {room.images.slice(0, 4).map((image, index) => (
            <button key={image.src} type="button" onClick={() => setActiveImage(image)} className={`relative aspect-square overflow-hidden rounded-2xl border-2 ${activeImage?.src === image.src ? "border-[#2f261f]" : "border-white"}`} aria-label={`${localizeName(room.name, language)} photo ${index + 1}`}>
              <Image src={image.src} alt={image.alt} fill sizes="22vw" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-amber-900/10 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-amber-900 ring-1 ring-amber-900/10">{localizeRoomText(room.location, language)}</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-emerald-800 ring-1 ring-emerald-800/15">{labels[language].upToGuests(room.maxGuests)}</span>
        </div>
        <h3 className="mt-5 text-4xl font-black tracking-[-0.05em] text-[#2f261f]">{localizeName(room.name, language)}</h3>
        <p className="mt-2 text-sm font-black uppercase tracking-[0.14em] text-amber-800">{localizeRoomText(room.type, language)}</p>
        <p className="mt-4 text-base leading-8 text-[#574b3f]">{localizeRoomText(room.description, language)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {room.badges.map((badge) => <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-amber-900 ring-1 ring-amber-900/12" key={badge}>{localizeRoomText(badge, language)}</span>)}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {room.beds.map((bed) => <span className="rounded-full bg-stone-50 px-3 py-2 text-xs font-bold text-[#2f261f] ring-1 ring-stone-900/10" key={bed}>🛏️ {localizeRoomText(bed, language)}</span>)}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {room.amenities.map((amenity) => <span className="rounded-full bg-amber-50/70 px-3 py-2 text-xs font-bold text-[#574b3f] ring-1 ring-amber-900/10" key={`${amenity.icon}-${amenity.label}`}>{amenity.icon} {localizeRoomText(amenity.label, language)}</span>)}
        </div>
      </div>
    </article>
  );
}

function FloorRoomGroup({ title, text, rooms, language }: { title: string; text: string; rooms: IndividualRoomData[]; language: RoomLanguage }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  if (!rooms.length) return null;

  function scrollToNextRoom() {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const firstCard = carousel.querySelector<HTMLElement>("article");
    carousel.scrollBy({ left: firstCard ? firstCard.offsetWidth + 14 : carousel.clientWidth * 0.86, behavior: "smooth" });
  }

  return (
    <section className="relative rounded-[32px] border border-amber-900/10 bg-[#fffdfa] p-4 shadow-[0_18px_45px_rgba(47,38,31,0.08)] sm:p-6" aria-label={title}>
      <header className="rounded-[28px] bg-[#2f261f] p-5 text-white sm:p-7">
        <h3 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">{title}</h3>
        <p className="mt-3 text-base leading-7 text-white/78">{text}</p>
        {rooms.length > 1 ? <p className="mt-4 inline-flex rounded-full border border-amber-200/30 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-amber-100">↔ {labels[language].swipe}</p> : null}
      </header>
      <div className="mt-4 flex snap-x gap-4 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch]" ref={carouselRef}>
        {rooms.map((room) => (
          <div className="min-w-[86%] snap-start sm:min-w-[520px]" key={room.id}>
            <IndividualRoomCard room={room} language={language} />
          </div>
        ))}
      </div>
      {rooms.length > 1 ? (
        <button type="button" className="absolute right-2 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#2f261f] text-3xl font-black text-amber-100 shadow-xl" onClick={scrollToNextRoom} aria-label={labels[language].nextRoom}>›</button>
      ) : null}
    </section>
  );
}

function IndividualRoomsSection({ data, language }: { data: RoomDetailData; language: RoomLanguage }) {
  if (!data.individualRooms.rooms.length) return null;
  const localizedSectionLabels = sectionLabels[language];

  if (shouldGroupRoomsByFloor(data)) {
    const groundFloorRooms = data.individualRooms.rooms.filter((room) => getFloorKind(room) === "ground");
    const firstFloorRooms = data.individualRooms.rooms.filter((room) => getFloorKind(room) === "first");
    const otherRooms = data.individualRooms.rooms.filter((room) => getFloorKind(room) === "other");

    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="rd-individual-title">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex text-[11px] font-black uppercase tracking-[0.28em] text-amber-800">{data.individualRooms.kicker}</span>
          <h2 id="rd-individual-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] text-[#2f261f] sm:text-4xl">{data.individualRooms.title}</h2>
          <p className="mt-4 text-base leading-8 text-[#574b3f]">{data.individualRooms.description}</p>
        </header>
        <div className="mt-8 space-y-7">
          <FloorRoomGroup title={localizedSectionLabels.groundTitle} text={localizedSectionLabels.groundText} rooms={groundFloorRooms} language={language} />
          <FloorRoomGroup title={localizedSectionLabels.firstTitle} text={localizedSectionLabels.firstText} rooms={firstFloorRooms} language={language} />
          {otherRooms.length ? <FloorRoomGroup title={data.individualRooms.title} text={data.individualRooms.description} rooms={otherRooms} language={language} /> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="rd-individual-title">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex text-[11px] font-black uppercase tracking-[0.28em] text-amber-800">{data.individualRooms.kicker}</span>
        <h2 id="rd-individual-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] text-[#2f261f] sm:text-4xl">{data.individualRooms.title}</h2>
        <p className="mt-4 text-base leading-8 text-[#574b3f]">{data.individualRooms.description}</p>
      </header>
      <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch]">
        {data.individualRooms.rooms.map((room) => (
          <div className="min-w-[86%] snap-start sm:min-w-[520px]" key={room.id}>
            <IndividualRoomCard room={room} language={language} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function RoomDetailPage({ data }: RoomDetailPageProps) {
  const language = getRoomLanguage(data.seo.canonicalPath);
  const localLabels = labels[language];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf6ef] text-[#2f261f]">
      <section className="relative isolate overflow-hidden px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20" aria-labelledby="rd-hero-title">
        <Image src={data.hero.image} alt="" fill priority fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/78 via-black/48 to-black/18" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl rounded-[30px] border border-white/16 bg-[#2f261f]/72 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.32)] backdrop-blur sm:p-6 lg:p-8">
            <span className="inline-flex rounded-full border border-amber-200/30 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-amber-100">{data.hero.kicker}</span>
            <h1 id="rd-hero-title" className="mt-5 text-balance text-[2.45rem] font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">{data.hero.title}</h1>
            <p className="mt-5 text-base font-extrabold text-amber-100 sm:text-xl">{data.hero.subtitle}</p>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-8 text-white/88 sm:text-lg">{data.hero.description}</p>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Room highlights">
              {data.hero.badges.map((badge) => <span key={badge} className="rounded-full border border-white/16 bg-white/12 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur">{localizeRoomText(badge, language)}</span>)}
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <a className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-amber-200 px-4 text-center text-[11px] font-black uppercase tracking-[0.12em] !text-[#2f261f] shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white sm:px-6 sm:text-xs" href={data.hero.primaryCta.href} style={{ color: "#2f261f" }}>{data.hero.primaryCta.label}</a>
              <a className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 text-center text-[11px] font-black uppercase tracking-[0.12em] text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#2f261f] sm:px-6 sm:text-xs" href={data.hero.secondaryCta.href}>{data.hero.secondaryCta.label}</a>
            </div>
          </div>
        </div>
      </section>

      <TopicBadges locale={language} context="room-detail" className="border-b border-amber-900/10" />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16" aria-labelledby="rd-overview-title">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <article className="rounded-[30px] border border-amber-900/10 bg-white p-5 shadow-[0_18px_45px_rgba(47,38,31,0.10)] sm:p-8">
            <span className="inline-flex rounded-full border border-amber-900/10 bg-amber-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-amber-800">{data.overview.kicker}</span>
            <h2 id="rd-overview-title" className="mt-5 text-balance text-3xl font-black tracking-[-0.035em] text-[#2f261f] sm:text-4xl">{data.overview.title}</h2>
            <div className="mt-5 space-y-4 text-base leading-8 text-[#574b3f]">{data.overview.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </article>
          <aside className="rounded-[30px] border border-amber-900/10 bg-[#fffdfa] p-5 shadow-[0_18px_45px_rgba(47,38,31,0.08)] sm:p-6" aria-label="Room key details">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {data.overview.highlights.map((highlight) => <div className="rounded-2xl bg-amber-50/70 p-4 ring-1 ring-amber-900/10" key={highlight.label}><span className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-800">{highlight.label}</span><strong className="mt-1 block text-base font-black text-[#2f261f]">{localizeRoomText(highlight.value, language)}</strong></div>)}
            </div>
          </aside>
        </div>
      </section>

      <IndividualRoomsSection data={data} language={language} />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="rd-amenities-title">
        <header className="mx-auto max-w-3xl text-center"><span className="inline-flex text-[11px] font-black uppercase tracking-[0.28em] text-amber-800">{data.amenities.kicker}</span><h2 id="rd-amenities-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] text-[#2f261f] sm:text-4xl">{data.amenities.title}</h2></header>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.amenities.items.map((item) => <article className="rounded-2xl bg-white p-4 shadow-[0_12px_32px_rgba(47,38,31,0.08)]" key={item.label}><div className="text-2xl" aria-hidden="true">{item.icon}</div><h3 className="mt-3 text-sm font-black text-[#2f261f] sm:text-base">{localizeRoomText(item.label, language)}</h3><p className="mt-2 text-xs leading-5 text-[#574b3f] sm:text-sm">{item.text}</p></article>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="rd-best-title">
        <div className="rounded-[30px] bg-white p-5 shadow-[0_18px_45px_rgba(47,38,31,0.08)] sm:p-8">
          <span className="inline-flex text-[11px] font-black uppercase tracking-[0.28em] text-amber-800">{data.bestFor.kicker}</span>
          <h2 id="rd-best-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] text-[#2f261f] sm:text-4xl">{data.bestFor.title}</h2>
          <div className="mt-7 grid grid-cols-2 gap-3">
            {data.bestFor.items.map((item) => <div className="rounded-2xl bg-amber-50/50 p-3 text-sm leading-6 text-[#574b3f] ring-1 ring-amber-900/10" key={item}><span className="mr-2 font-black text-emerald-700">✓</span>{item}</div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 lg:pt-20" aria-labelledby="rd-booking-title">
        <div className="overflow-hidden rounded-[30px] bg-gradient-to-br from-[#2f261f] via-[#5f421f] to-[#9a6f11] p-5 text-white shadow-[0_28px_70px_rgba(47,38,31,0.22)] sm:p-8 lg:p-10">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><span className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-amber-100 before:h-px before:w-10 before:bg-amber-200/70">{data.booking.kicker}</span><h2 id="rd-booking-title" className="mt-5 text-balance text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">{data.booking.title}</h2><p className="mt-5 max-w-3xl text-base leading-8 text-white/88 sm:text-lg">{data.booking.text}</p><small className="mt-4 block text-sm leading-6 text-white/72">{data.booking.note}</small></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px] lg:grid-cols-1"><a className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#25D366] px-6 text-center text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_38px_rgba(37,211,102,0.26)] transition hover:-translate-y-0.5 hover:bg-[#1ebe5d]" href={data.booking.whatsappHref}>{data.booking.whatsappLabel}</a><a className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/32 bg-white/10 px-6 text-center text-xs font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#2f261f]" href={data.booking.phoneHref}>{data.booking.phoneLabel}</a></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="rd-faq-title">
        <header className="mx-auto max-w-3xl text-center"><span className="inline-flex text-[11px] font-black uppercase tracking-[0.28em] text-amber-800">{localLabels.faqKicker}</span><h2 id="rd-faq-title" className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#2f261f] sm:text-4xl">{localLabels.faqTitle}</h2></header>
        <div className="mx-auto mt-8 max-w-3xl space-y-3">{data.faq.map((item) => <details className="rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(47,38,31,0.07)]" key={item.question}><summary className="cursor-pointer text-base font-black text-[#2f261f]">{item.question}</summary><p className="mt-3 text-sm leading-7 text-[#574b3f]">{item.answer}</p></details>)}</div>
      </section>
    </main>
  );
}

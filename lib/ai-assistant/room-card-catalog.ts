import type { AssistantLanguage } from "./types";

export type RoomCardCopy = {
  name: string;
  category: string;
  floor: string;
  features: string[];
};

export type RoomCardCatalogEntry = {
  roomId: string;
  unitId: string;
  roomNumber: number;
  maxGuests: number;
  image: string;
  gallery: string[];
  detailsUrl: Record<AssistantLanguage, string>;
  copy: Record<AssistantLanguage, RoomCardCopy>;
};

const standardDetails: Record<AssistantLanguage, string> = {
  en: "/chios-rooms/standard-double-room/",
  el: "/el/domatia-xios/diklina-triklina-domatia/",
  fr: "/fr/chambres-a-chios/chambres-doubles-standard/",
  de: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
  it: "/it/stanze-a-chios/camere-doppie-standard-chios/",
  es: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
  tr: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
};

const economyDetails: Record<AssistantLanguage, string> = {
  en: "/chios-rooms/economy-double-rooms/",
  el: "/el/domatia-xios/oikonomiko-diklino-domatio/",
  fr: "/fr/chambres-a-chios/chambres-doubles-economiques/",
  de: "/de/zimmer-chios/economy-zimmer-auf-chios/",
  it: "/it/stanze-a-chios/camera-doppia-economica-chios/",
  es: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
  tr: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
};

const familyDetails: Record<AssistantLanguage, string> = {
  en: "/chios-rooms/family-chios-apartments/",
  el: "/el/domatia-xios/oikogeneiako-diamerisma/",
  fr: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
  de: "/de/zimmer-chios/familienapartments-in-chios/",
  it: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
  es: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
  tr: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
};

export const ROOM_CARD_CATALOG: RoomCardCatalogEntry[] = [
  {
    roomId: "267788", unitId: "1", roomNumber: 1, maxGuests: 4,
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
    gallery: ["/images/rooms/DSC07776-2-e1675109942622.webp", "/images/rooms/DSC07769-1.webp"],
    detailsUrl: standardDetails,
    copy: {
      el: { name: "Δωμάτιο 1", category: "Τετράκλινο δωμάτιο", floor: "Πρώτος όροφος · με σκάλες", features: ["Ιδιωτικό μπαλκόνι", "1 διπλό και 2 μονά κρεβάτια", "Ψυγείο", "Κλιματισμός"] },
      en: { name: "Room 1", category: "Quadruple room", floor: "First floor · stairs required", features: ["Private balcony", "1 double and 2 single beds", "Fridge", "Air conditioning"] },
      de: { name: "Zimmer 1", category: "Vierbettzimmer", floor: "Erster Stock · Treppen erforderlich", features: ["Privater Balkon", "1 Doppelbett und 2 Einzelbetten", "Kühlschrank", "Klimaanlage"] },
      fr: { name: "Chambre 1", category: "Chambre quadruple", floor: "Premier étage · accès par escalier", features: ["Balcon privé", "1 lit double et 2 lits simples", "Réfrigérateur", "Climatisation"] },
      it: { name: "Camera 1", category: "Camera quadrupla", floor: "Primo piano · accesso con scale", features: ["Balcone privato", "1 matrimoniale e 2 singoli", "Frigorifero", "Aria condizionata"] },
      es: { name: "Habitación 1", category: "Habitación cuádruple", floor: "Primera planta · acceso por escaleras", features: ["Balcón privado", "1 cama doble y 2 individuales", "Nevera", "Aire acondicionado"] },
      tr: { name: "Oda 1", category: "Dört kişilik oda", floor: "Birinci kat · merdiven erişimi", features: ["Özel balkon", "1 çift ve 2 tek kişilik yatak", "Buzdolabı", "Klima"] },
    },
  },
  {
    roomId: "268803", unitId: "1", roomNumber: 2, maxGuests: 2,
    image: "/images/rooms/DSC07803-1.webp",
    gallery: ["/images/rooms/DSC07803-1.webp", "/images/rooms/DSC07839.webp"],
    detailsUrl: economyDetails,
    copy: {
      el: { name: "Δωμάτιο 2", category: "Οικονομικό δίκλινο", floor: "Πρώτος όροφος · με σκάλες", features: ["1 διπλό κρεβάτι", "Οικονομική επιλογή", "Ψυγείο", "Κλιματισμός"] },
      en: { name: "Room 2", category: "Economy double room", floor: "First floor · stairs required", features: ["1 double bed", "Economy option", "Fridge", "Air conditioning"] },
      de: { name: "Zimmer 2", category: "Economy-Doppelzimmer", floor: "Erster Stock · Treppen erforderlich", features: ["1 Doppelbett", "Preisgünstige Option", "Kühlschrank", "Klimaanlage"] },
      fr: { name: "Chambre 2", category: "Chambre double économique", floor: "Premier étage · accès par escalier", features: ["1 lit double", "Option économique", "Réfrigérateur", "Climatisation"] },
      it: { name: "Camera 2", category: "Camera doppia economy", floor: "Primo piano · accesso con scale", features: ["1 letto matrimoniale", "Opzione economica", "Frigorifero", "Aria condizionata"] },
      es: { name: "Habitación 2", category: "Habitación doble económica", floor: "Primera planta · acceso por escaleras", features: ["1 cama doble", "Opción económica", "Nevera", "Aire acondicionado"] },
      tr: { name: "Oda 2", category: "Ekonomik çift kişilik oda", floor: "Birinci kat · merdiven erişimi", features: ["1 çift kişilik yatak", "Ekonomik seçenek", "Buzdolabı", "Klima"] },
    },
  },
  {
    roomId: "267788", unitId: "2", roomNumber: 3, maxGuests: 3,
    image: "/images/rooms/DSC07867-1.webp",
    gallery: ["/images/rooms/DSC07867-1.webp", "/images/rooms/DSC07860-1.webp"],
    detailsUrl: standardDetails,
    copy: {
      el: { name: "Δωμάτιο 3", category: "Τρίκλινο δωμάτιο", floor: "Πρώτος όροφος · με σκάλες", features: ["Μικρή κουζίνα", "1 διπλό και 1 μονό κρεβάτι", "Ψυγείο", "Κλιματισμός"] },
      en: { name: "Room 3", category: "Triple room", floor: "First floor · stairs required", features: ["Kitchenette", "1 double and 1 single bed", "Fridge", "Air conditioning"] },
      de: { name: "Zimmer 3", category: "Dreibettzimmer", floor: "Erster Stock · Treppen erforderlich", features: ["Küchenzeile", "1 Doppelbett und 1 Einzelbett", "Kühlschrank", "Klimaanlage"] },
      fr: { name: "Chambre 3", category: "Chambre triple", floor: "Premier étage · accès par escalier", features: ["Kitchenette", "1 lit double et 1 lit simple", "Réfrigérateur", "Climatisation"] },
      it: { name: "Camera 3", category: "Camera tripla", floor: "Primo piano · accesso con scale", features: ["Angolo cottura", "1 matrimoniale e 1 singolo", "Frigorifero", "Aria condizionata"] },
      es: { name: "Habitación 3", category: "Habitación triple", floor: "Primera planta · acceso por escaleras", features: ["Cocina pequeña", "1 cama doble y 1 individual", "Nevera", "Aire acondicionado"] },
      tr: { name: "Oda 3", category: "Üç kişilik oda", floor: "Birinci kat · merdiven erişimi", features: ["Mini mutfak", "1 çift ve 1 tek kişilik yatak", "Buzdolabı", "Klima"] },
    },
  },
  {
    roomId: "267788", unitId: "3", roomNumber: 4, maxGuests: 3,
    image: "/images/rooms/received_1748354861920234.webp",
    gallery: ["/images/rooms/received_1748354861920234.webp", "/images/rooms/received_1748358935253160.webp"],
    detailsUrl: standardDetails,
    copy: {
      el: { name: "Δωμάτιο 4", category: "Τρίκλινο δωμάτιο", floor: "Πρώτος όροφος · με σκάλες", features: ["Μικρή κουζίνα", "Ιδιωτικό μπαλκόνι", "Ψυγείο", "Κλιματισμός"] },
      en: { name: "Room 4", category: "Triple room", floor: "First floor · stairs required", features: ["Kitchenette", "Private balcony", "Fridge", "Air conditioning"] },
      de: { name: "Zimmer 4", category: "Dreibettzimmer", floor: "Erster Stock · Treppen erforderlich", features: ["Küchenzeile", "Privater Balkon", "Kühlschrank", "Klimaanlage"] },
      fr: { name: "Chambre 4", category: "Chambre triple", floor: "Premier étage · accès par escalier", features: ["Kitchenette", "Balcon privé", "Réfrigérateur", "Climatisation"] },
      it: { name: "Camera 4", category: "Camera tripla", floor: "Primo piano · accesso con scale", features: ["Angolo cottura", "Balcone privato", "Frigorifero", "Aria condizionata"] },
      es: { name: "Habitación 4", category: "Habitación triple", floor: "Primera planta · acceso por escaleras", features: ["Cocina pequeña", "Balcón privado", "Nevera", "Aire acondicionado"] },
      tr: { name: "Oda 4", category: "Üç kişilik oda", floor: "Birinci kat · merdiven erişimi", features: ["Mini mutfak", "Özel balkon", "Buzdolabı", "Klima"] },
    },
  },
  {
    roomId: "626129", unitId: "1", roomNumber: 5, maxGuests: 3,
    image: "/images/rooms/voulamandis-house-rooms.webp",
    gallery: ["/images/rooms/voulamandis-house-rooms.webp", "/images/rooms/chios-hotels-triple-rooms_1646x1080.webp"],
    detailsUrl: standardDetails,
    copy: {
      el: { name: "Δωμάτιο 5", category: "Τρίκλινο δωμάτιο ισογείου", floor: "Ισόγειο · χωρίς σκάλες", features: ["Άμεση πρόσβαση στην αυλή", "1 διπλό και 1 μονό κρεβάτι", "Ψυγείο", "Κλιματισμός"] },
      en: { name: "Room 5", category: "Ground-floor triple room", floor: "Ground floor · no stairs", features: ["Direct courtyard access", "1 double and 1 single bed", "Fridge", "Air conditioning"] },
      de: { name: "Zimmer 5", category: "Dreibettzimmer im Erdgeschoss", floor: "Erdgeschoss · keine Treppen", features: ["Direkter Zugang zum Hof", "1 Doppelbett und 1 Einzelbett", "Kühlschrank", "Klimaanlage"] },
      fr: { name: "Chambre 5", category: "Chambre triple au rez-de-chaussée", floor: "Rez-de-chaussée · sans escaliers", features: ["Accès direct à la cour", "1 lit double et 1 lit simple", "Réfrigérateur", "Climatisation"] },
      it: { name: "Camera 5", category: "Camera tripla al piano terra", floor: "Piano terra · senza scale", features: ["Accesso diretto al cortile", "1 matrimoniale e 1 singolo", "Frigorifero", "Aria condizionata"] },
      es: { name: "Habitación 5", category: "Habitación triple en planta baja", floor: "Planta baja · sin escaleras", features: ["Acceso directo al patio", "1 cama doble y 1 individual", "Nevera", "Aire acondicionado"] },
      tr: { name: "Oda 5", category: "Zemin kat üç kişilik oda", floor: "Zemin kat · merdivensiz", features: ["Avluya doğrudan erişim", "1 çift ve 1 tek kişilik yatak", "Buzdolabı", "Klima"] },
    },
  },
  {
    roomId: "268803", unitId: "2", roomNumber: 6, maxGuests: 2,
    image: "/images/rooms/received_1753964631359257.webp",
    gallery: ["/images/rooms/received_1753964631359257.webp", "/images/rooms/received_1753964581359262.webp"],
    detailsUrl: economyDetails,
    copy: {
      el: { name: "Δωμάτιο 6", category: "Οικονομικό δίκλινο ισογείου", floor: "Ισόγειο · χωρίς σκάλες", features: ["1 διπλό κρεβάτι", "Πρόσβαση στον κήπο", "Ψυγείο", "Κλιματισμός"] },
      en: { name: "Room 6", category: "Ground-floor economy double", floor: "Ground floor · no stairs", features: ["1 double bed", "Garden access", "Fridge", "Air conditioning"] },
      de: { name: "Zimmer 6", category: "Economy-Doppelzimmer im Erdgeschoss", floor: "Erdgeschoss · keine Treppen", features: ["1 Doppelbett", "Gartenzugang", "Kühlschrank", "Klimaanlage"] },
      fr: { name: "Chambre 6", category: "Double économique au rez-de-chaussée", floor: "Rez-de-chaussée · sans escaliers", features: ["1 lit double", "Accès au jardin", "Réfrigérateur", "Climatisation"] },
      it: { name: "Camera 6", category: "Doppia economy al piano terra", floor: "Piano terra · senza scale", features: ["1 letto matrimoniale", "Accesso al giardino", "Frigorifero", "Aria condizionata"] },
      es: { name: "Habitación 6", category: "Doble económica en planta baja", floor: "Planta baja · sin escaleras", features: ["1 cama doble", "Acceso al jardín", "Nevera", "Aire acondicionado"] },
      tr: { name: "Oda 6", category: "Zemin kat ekonomik çift kişilik oda", floor: "Zemin kat · merdivensiz", features: ["1 çift kişilik yatak", "Bahçe erişimi", "Buzdolabı", "Klima"] },
    },
  },
  {
    roomId: "626129", unitId: "2", roomNumber: 7, maxGuests: 3,
    image: "/images/rooms/double-triple-room.jpg",
    gallery: ["/images/rooms/double-triple-room.jpg", "/images/rooms/view-double-room-chios-hotels.webp"],
    detailsUrl: standardDetails,
    copy: {
      el: { name: "Δωμάτιο 7", category: "Τρίκλινο δωμάτιο ισογείου", floor: "Ισόγειο · χωρίς σκάλες", features: ["Πρόσβαση στον κήπο", "1 διπλό κρεβάτι και καναπές-κρεβάτι", "Ψυγείο", "Κλιματισμός"] },
      en: { name: "Room 7", category: "Ground-floor triple room", floor: "Ground floor · no stairs", features: ["Garden access", "1 double bed and sofa bed", "Fridge", "Air conditioning"] },
      de: { name: "Zimmer 7", category: "Dreibettzimmer im Erdgeschoss", floor: "Erdgeschoss · keine Treppen", features: ["Gartenzugang", "1 Doppelbett und Schlafsofa", "Kühlschrank", "Klimaanlage"] },
      fr: { name: "Chambre 7", category: "Chambre triple au rez-de-chaussée", floor: "Rez-de-chaussée · sans escaliers", features: ["Accès au jardin", "1 lit double et canapé-lit", "Réfrigérateur", "Climatisation"] },
      it: { name: "Camera 7", category: "Camera tripla al piano terra", floor: "Piano terra · senza scale", features: ["Accesso al giardino", "1 matrimoniale e divano letto", "Frigorifero", "Aria condizionata"] },
      es: { name: "Habitación 7", category: "Habitación triple en planta baja", floor: "Planta baja · sin escaleras", features: ["Acceso al jardín", "1 cama doble y sofá cama", "Nevera", "Aire acondicionado"] },
      tr: { name: "Oda 7", category: "Zemin kat üç kişilik oda", floor: "Zemin kat · merdivensiz", features: ["Bahçe erişimi", "1 çift kişilik yatak ve çekyat", "Buzdolabı", "Klima"] },
    },
  },
  {
    roomId: "265595", unitId: "1", roomNumber: 8, maxGuests: 4,
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    gallery: ["/images/rooms/chios-apartments-voulamandis.webp", "/images/rooms/chios-hotels-family-apartments.webp"],
    detailsUrl: familyDetails,
    copy: {
      el: { name: "Διαμέρισμα 8", category: "Οικογενειακό διαμέρισμα", floor: "Ανεξάρτητο διαμέρισμα", features: ["Πλήρης κουζίνα", "1 διπλό και 2 μονά κρεβάτια", "Ψυγείο", "Κλιματισμός"] },
      en: { name: "Apartment 8", category: "Family apartment", floor: "Independent apartment", features: ["Full kitchen", "1 double and 2 single beds", "Fridge", "Air conditioning"] },
      de: { name: "Apartment 8", category: "Familienapartment", floor: "Unabhängiges Apartment", features: ["Voll ausgestattete Küche", "1 Doppelbett und 2 Einzelbetten", "Kühlschrank", "Klimaanlage"] },
      fr: { name: "Appartement 8", category: "Appartement familial", floor: "Appartement indépendant", features: ["Cuisine complète", "1 lit double et 2 lits simples", "Réfrigérateur", "Climatisation"] },
      it: { name: "Appartamento 8", category: "Appartamento familiare", floor: "Appartamento indipendente", features: ["Cucina completa", "1 matrimoniale e 2 singoli", "Frigorifero", "Aria condizionata"] },
      es: { name: "Apartamento 8", category: "Apartamento familiar", floor: "Apartamento independiente", features: ["Cocina completa", "1 cama doble y 2 individuales", "Nevera", "Aire acondicionado"] },
      tr: { name: "Daire 8", category: "Aile dairesi", floor: "Bağımsız daire", features: ["Tam donanımlı mutfak", "1 çift ve 2 tek kişilik yatak", "Buzdolabı", "Klima"] },
    },
  },
  {
    roomId: "265595", unitId: "2", roomNumber: 9, maxGuests: 4,
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    gallery: ["/images/rooms/chios-apartments-voulamandis.webp", "/images/rooms/family-room.webp"],
    detailsUrl: familyDetails,
    copy: {
      el: { name: "Διαμέρισμα 9", category: "Οικογενειακό διαμέρισμα", floor: "Ανεξάρτητο διαμέρισμα", features: ["Πλήρης κουζίνα", "1 διπλό και 2 μονά κρεβάτια", "Ψυγείο", "Κλιματισμός"] },
      en: { name: "Apartment 9", category: "Family apartment", floor: "Independent apartment", features: ["Full kitchen", "1 double and 2 single beds", "Fridge", "Air conditioning"] },
      de: { name: "Apartment 9", category: "Familienapartment", floor: "Unabhängiges Apartment", features: ["Voll ausgestattete Küche", "1 Doppelbett und 2 Einzelbetten", "Kühlschrank", "Klimaanlage"] },
      fr: { name: "Appartement 9", category: "Appartement familial", floor: "Appartement indépendant", features: ["Cuisine complète", "1 lit double et 2 lits simples", "Réfrigérateur", "Climatisation"] },
      it: { name: "Appartamento 9", category: "Appartamento familiare", floor: "Appartamento indipendente", features: ["Cucina completa", "1 matrimoniale e 2 singoli", "Frigorifero", "Aria condizionata"] },
      es: { name: "Apartamento 9", category: "Apartamento familiar", floor: "Apartamento independiente", features: ["Cocina completa", "1 cama doble y 2 individuales", "Nevera", "Aire acondicionado"] },
      tr: { name: "Daire 9", category: "Aile dairesi", floor: "Bağımsız daire", features: ["Tam donanımlı mutfak", "1 çift ve 2 tek kişilik yatak", "Buzdolabı", "Klima"] },
    },
  },
  {
    roomId: "265595", unitId: "3", roomNumber: 10, maxGuests: 5,
    image: "/images/rooms/DSC07899.webp",
    gallery: ["/images/rooms/DSC07899.webp", "/images/rooms/DSC07909.webp"],
    detailsUrl: familyDetails,
    copy: {
      el: { name: "Διαμέρισμα 10", category: "Μεγάλο οικογενειακό διαμέρισμα", floor: "Ανεξάρτητο διαμέρισμα", features: ["Πλήρης κουζίνα", "Έως 5 επισκέπτες κατόπιν συνεννόησης", "Ψυγείο", "Κλιματισμός"] },
      en: { name: "Apartment 10", category: "Large family apartment", floor: "Independent apartment", features: ["Full kitchen", "Up to 5 guests by arrangement", "Fridge", "Air conditioning"] },
      de: { name: "Apartment 10", category: "Großes Familienapartment", floor: "Unabhängiges Apartment", features: ["Voll ausgestattete Küche", "Bis zu 5 Gäste nach Absprache", "Kühlschrank", "Klimaanlage"] },
      fr: { name: "Appartement 10", category: "Grand appartement familial", floor: "Appartement indépendant", features: ["Cuisine complète", "Jusqu’à 5 personnes sur demande", "Réfrigérateur", "Climatisation"] },
      it: { name: "Appartamento 10", category: "Grande appartamento familiare", floor: "Appartamento indipendente", features: ["Cucina completa", "Fino a 5 ospiti previo accordo", "Frigorifero", "Aria condizionata"] },
      es: { name: "Apartamento 10", category: "Apartamento familiar grande", floor: "Apartamento independiente", features: ["Cocina completa", "Hasta 5 huéspedes previa consulta", "Nevera", "Aire acondicionado"] },
      tr: { name: "Daire 10", category: "Büyük aile dairesi", floor: "Bağımsız daire", features: ["Tam donanımlı mutfak", "Önceden görüşülerek 5 kişiye kadar", "Buzdolabı", "Klima"] },
    },
  },
];

const ROOM_BY_KEY = new Map(ROOM_CARD_CATALOG.map((room) => [`${room.roomId}:${room.unitId}`, room]));

export function localizeRoomOffer<T extends Record<string, any>>(offer: T, language: AssistantLanguage) {
  const room = ROOM_BY_KEY.get(`${String(offer.roomId || "")}:${String(offer.unitId || "")}`);
  if (!room) return offer;
  const copy = room.copy[language] || room.copy.en;
  return {
    ...offer,
    roomNumber: room.roomNumber,
    name: copy.name,
    category: copy.category,
    floor: copy.floor,
    features: copy.features,
    image: room.image,
    gallery: room.gallery,
    detailsUrl: room.detailsUrl[language] || room.detailsUrl.en,
    maxGuests: Number(offer.maxGuests || room.maxGuests),
  };
}

export function roomCatalogForLanguage(language: AssistantLanguage) {
  return ROOM_CARD_CATALOG.map((room) => {
    const copy = room.copy[language] || room.copy.en;
    return {
      roomId: room.roomId,
      unitId: room.unitId,
      roomNumber: room.roomNumber,
      maxGuests: room.maxGuests,
      image: room.image,
      gallery: room.gallery,
      detailsUrl: room.detailsUrl[language] || room.detailsUrl.en,
      ...copy,
    };
  });
}

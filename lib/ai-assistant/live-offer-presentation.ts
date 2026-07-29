import type { AssistantLanguage } from "./types";

type RawOffer = Record<string, any> & { roomId?: string | number; unitId?: string | number; image?: string };

const ROOM_DATA: Record<string, {
  number: number;
  gallery: string[];
  copy: Record<AssistantLanguage, { name: string; category: string; floor: string; features: string[] }>;
}> = {
  "267788:1": {
    number: 1,
    gallery: ["/images/rooms/DSC07776-2-e1675109942622.webp", "/images/rooms/DSC07769-1.webp", "/images/rooms/----1-1.webp", "/images/rooms/voulamandis-house-bathrooms-1.webp"],
    copy: {
      el: { name: "Δωμάτιο 1", category: "Τετράκλινο δωμάτιο", floor: "Πρώτος όροφος · με σκάλες", features: ["Ιδιωτικό μπαλκόνι", "1 διπλό και 2 μονά κρεβάτια"] },
      en: { name: "Room 1", category: "Quadruple room", floor: "First floor · stairs required", features: ["Private balcony", "1 double and 2 single beds"] },
      fr: { name: "Chambre 1", category: "Chambre quadruple", floor: "Premier étage · accès par escalier", features: ["Balcon privé", "1 lit double et 2 lits simples"] },
      de: { name: "Zimmer 1", category: "Vierbettzimmer", floor: "Erster Stock · Treppen erforderlich", features: ["Privater Balkon", "1 Doppelbett und 2 Einzelbetten"] },
      it: { name: "Camera 1", category: "Camera quadrupla", floor: "Primo piano · accesso con scale", features: ["Balcone privato", "1 matrimoniale e 2 singoli"] },
      es: { name: "Habitación 1", category: "Habitación cuádruple", floor: "Primera planta · acceso por escaleras", features: ["Balcón privado", "1 cama doble y 2 individuales"] },
      tr: { name: "Oda 1", category: "Dört kişilik oda", floor: "Birinci kat · merdiven erişimi", features: ["Özel balkon", "1 çift ve 2 tek kişilik yatak"] },
    },
  },
  "268803:1": {
    number: 2,
    gallery: ["/images/rooms/DSC07803-1.webp", "/images/rooms/DSC07839.webp", "/images/rooms/DSC07832.webp", "/images/rooms/received_1385287484893642_1500478431120_1200x800_3240x2160-1.webp"],
    copy: {
      el: { name: "Δωμάτιο 2", category: "Οικονομικό δίκλινο", floor: "Πρώτος όροφος · με σκάλες", features: ["1 διπλό κρεβάτι", "Οικονομική επιλογή"] },
      en: { name: "Room 2", category: "Economy double room", floor: "First floor · stairs required", features: ["1 double bed", "Economy option"] },
      fr: { name: "Chambre 2", category: "Chambre double économique", floor: "Premier étage · accès par escalier", features: ["1 lit double", "Option économique"] },
      de: { name: "Zimmer 2", category: "Economy-Doppelzimmer", floor: "Erster Stock · Treppen erforderlich", features: ["1 Doppelbett", "Preisgünstige Option"] },
      it: { name: "Camera 2", category: "Camera doppia economy", floor: "Primo piano · accesso con scale", features: ["1 letto matrimoniale", "Opzione economica"] },
      es: { name: "Habitación 2", category: "Habitación doble económica", floor: "Primera planta · acceso por escaleras", features: ["1 cama doble", "Opción económica"] },
      tr: { name: "Oda 2", category: "Ekonomik çift kişilik oda", floor: "Birinci kat · merdiven erişimi", features: ["1 çift kişilik yatak", "Ekonomik seçenek"] },
    },
  },
  "267788:2": {
    number: 3,
    gallery: ["/images/rooms/DSC07867-1.webp", "/images/rooms/DSC07860-1.webp", "/images/rooms/DSC07849-1.webp", "/images/rooms/DSC07891-1.webp"],
    copy: {
      el: { name: "Δωμάτιο 3", category: "Τρίκλινο δωμάτιο", floor: "Πρώτος όροφος · με σκάλες", features: ["Kitchenette", "1 διπλό και 1 μονό κρεβάτι"] },
      en: { name: "Room 3", category: "Triple room", floor: "First floor · stairs required", features: ["Kitchenette", "1 double and 1 single bed"] },
      fr: { name: "Chambre 3", category: "Chambre triple", floor: "Premier étage · accès par escalier", features: ["Kitchenette", "1 lit double et 1 lit simple"] },
      de: { name: "Zimmer 3", category: "Dreibettzimmer", floor: "Erster Stock · Treppen erforderlich", features: ["Küchenzeile", "1 Doppelbett und 1 Einzelbett"] },
      it: { name: "Camera 3", category: "Camera tripla", floor: "Primo piano · accesso con scale", features: ["Angolo cottura", "1 matrimoniale e 1 singolo"] },
      es: { name: "Habitación 3", category: "Habitación triple", floor: "Primera planta · acceso por escaleras", features: ["Cocina pequeña", "1 cama doble y 1 individual"] },
      tr: { name: "Oda 3", category: "Üç kişilik oda", floor: "Birinci kat · merdiven erişimi", features: ["Mini mutfak", "1 çift ve 1 tek kişilik yatak"] },
    },
  },
  "267788:3": {
    number: 4,
    gallery: ["/images/rooms/received_1748354861920234.webp", "/images/rooms/received_1748358935253160.webp", "/images/rooms/received_1748356725253381.webp"],
    copy: {
      el: { name: "Δωμάτιο 4", category: "Τρίκλινο δωμάτιο", floor: "Πρώτος όροφος · με σκάλες", features: ["Kitchenette", "Ιδιωτικό μπαλκόνι"] },
      en: { name: "Room 4", category: "Triple room", floor: "First floor · stairs required", features: ["Kitchenette", "Private balcony"] },
      fr: { name: "Chambre 4", category: "Chambre triple", floor: "Premier étage · accès par escalier", features: ["Kitchenette", "Balcon privé"] },
      de: { name: "Zimmer 4", category: "Dreibettzimmer", floor: "Erster Stock · Treppen erforderlich", features: ["Küchenzeile", "Privater Balkon"] },
      it: { name: "Camera 4", category: "Camera tripla", floor: "Primo piano · accesso con scale", features: ["Angolo cottura", "Balcone privato"] },
      es: { name: "Habitación 4", category: "Habitación triple", floor: "Primera planta · acceso por escaleras", features: ["Cocina pequeña", "Balcón privado"] },
      tr: { name: "Oda 4", category: "Üç kişilik oda", floor: "Birinci kat · merdiven erişimi", features: ["Mini mutfak", "Özel balkon"] },
    },
  },
  "626129:1": {
    number: 5,
    gallery: ["/images/rooms/voulamandis-house-rooms.webp", "/images/rooms/chios-hotels-triple-rooms_1646x1080.webp", "/images/rooms/voulamandis-house-double-room-bathroom_1620x1080.webp", "/images/rooms/hotels-chios-voulamandis_1620x1080.webp"],
    copy: {
      el: { name: "Δωμάτιο 5", category: "Τρίκλινο δωμάτιο ισογείου", floor: "Ισόγειο · χωρίς σκάλες", features: ["Άμεση πρόσβαση στην αυλή", "1 διπλό και 1 μονό κρεβάτι"] },
      en: { name: "Room 5", category: "Ground-floor triple room", floor: "Ground floor · no stairs", features: ["Direct courtyard access", "1 double and 1 single bed"] },
      fr: { name: "Chambre 5", category: "Chambre triple au rez-de-chaussée", floor: "Rez-de-chaussée · sans escaliers", features: ["Accès direct à la cour", "1 lit double et 1 lit simple"] },
      de: { name: "Zimmer 5", category: "Dreibettzimmer im Erdgeschoss", floor: "Erdgeschoss · keine Treppen", features: ["Direkter Zugang zum Hof", "1 Doppelbett und 1 Einzelbett"] },
      it: { name: "Camera 5", category: "Camera tripla al piano terra", floor: "Piano terra · senza scale", features: ["Accesso diretto al cortile", "1 matrimoniale e 1 singolo"] },
      es: { name: "Habitación 5", category: "Habitación triple en planta baja", floor: "Planta baja · sin escaleras", features: ["Acceso directo al patio", "1 cama doble y 1 individual"] },
      tr: { name: "Oda 5", category: "Zemin kat üç kişilik oda", floor: "Zemin kat · merdivensiz", features: ["Avluya doğrudan erişim", "1 çift ve 1 tek kişilik yatak"] },
    },
  },
  "268803:2": {
    number: 6,
    gallery: ["/images/rooms/received_1753964631359257.webp", "/images/rooms/received_1753964581359262.webp", "/images/rooms/received_1753968691358851.webp", "/images/rooms/received_1753969201358800.webp"],
    copy: {
      el: { name: "Δωμάτιο 6", category: "Οικονομικό δίκλινο ισογείου", floor: "Ισόγειο · χωρίς σκάλες", features: ["1 διπλό κρεβάτι", "Πρόσβαση στον κήπο"] },
      en: { name: "Room 6", category: "Ground-floor economy double", floor: "Ground floor · no stairs", features: ["1 double bed", "Garden access"] },
      fr: { name: "Chambre 6", category: "Double économique au rez-de-chaussée", floor: "Rez-de-chaussée · sans escaliers", features: ["1 lit double", "Accès au jardin"] },
      de: { name: "Zimmer 6", category: "Economy-Doppelzimmer im Erdgeschoss", floor: "Erdgeschoss · keine Treppen", features: ["1 Doppelbett", "Gartenzugang"] },
      it: { name: "Camera 6", category: "Doppia economy al piano terra", floor: "Piano terra · senza scale", features: ["1 letto matrimoniale", "Accesso al giardino"] },
      es: { name: "Habitación 6", category: "Doble económica en planta baja", floor: "Planta baja · sin escaleras", features: ["1 cama doble", "Acceso al jardín"] },
      tr: { name: "Oda 6", category: "Zemin kat ekonomik çift kişilik oda", floor: "Zemin kat · merdivensiz", features: ["1 çift kişilik yatak", "Bahçe erişimi"] },
    },
  },
  "626129:2": {
    number: 7,
    gallery: ["/images/rooms/double-triple-room.jpg", "/images/rooms/view-double-room-chios-hotels.webp", "/images/rooms/double-room-bathroom.webp", "/images/rooms/voulamandis-stone-bathroom.webp"],
    copy: {
      el: { name: "Δωμάτιο 7", category: "Τρίκλινο δωμάτιο ισογείου", floor: "Ισόγειο · χωρίς σκάλες", features: ["1 διπλό και 1 καναπές-κρεβάτι", "Πρόσβαση στον κήπο"] },
      en: { name: "Room 7", category: "Ground-floor triple room", floor: "Ground floor · no stairs", features: ["1 double and 1 sofa bed", "Garden access"] },
      fr: { name: "Chambre 7", category: "Chambre triple au rez-de-chaussée", floor: "Rez-de-chaussée · sans escaliers", features: ["1 lit double et 1 canapé-lit", "Accès au jardin"] },
      de: { name: "Zimmer 7", category: "Dreibettzimmer im Erdgeschoss", floor: "Erdgeschoss · keine Treppen", features: ["1 Doppelbett und 1 Schlafsofa", "Gartenzugang"] },
      it: { name: "Camera 7", category: "Camera tripla al piano terra", floor: "Piano terra · senza scale", features: ["1 matrimoniale e 1 divano letto", "Accesso al giardino"] },
      es: { name: "Habitación 7", category: "Habitación triple en planta baja", floor: "Planta baja · sin escaleras", features: ["1 cama doble y 1 sofá cama", "Acceso al jardín"] },
      tr: { name: "Oda 7", category: "Zemin kat üç kişilik oda", floor: "Zemin kat · merdivensiz", features: ["1 çift kişilik ve 1 çekyat", "Bahçe erişimi"] },
    },
  },
  "265595:1": {
    number: 8,
    gallery: ["/images/rooms/chios-apartments-voulamandis.webp", "/images/rooms/chios-hotels-family-apartments.webp", "/images/rooms/family-room.webp", "/images/rooms/voulamandis-apartment-bathroom..webp"],
    copy: {
      el: { name: "Διαμέρισμα 8", category: "Οικογενειακό διαμέρισμα", floor: "Ισόγειο · ανεξάρτητη είσοδος", features: ["Πλήρης κουζίνα", "Έως 4 άτομα"] },
      en: { name: "Apartment 8", category: "Family apartment", floor: "Ground floor · independent entrance", features: ["Full kitchen", "Up to 4 guests"] },
      fr: { name: "Appartement 8", category: "Appartement familial", floor: "Rez-de-chaussée · entrée indépendante", features: ["Cuisine complète", "Jusqu’à 4 personnes"] },
      de: { name: "Apartment 8", category: "Familienapartment", floor: "Erdgeschoss · eigener Eingang", features: ["Voll ausgestattete Küche", "Bis zu 4 Gäste"] },
      it: { name: "Appartamento 8", category: "Appartamento familiare", floor: "Piano terra · ingresso indipendente", features: ["Cucina completa", "Fino a 4 ospiti"] },
      es: { name: "Apartamento 8", category: "Apartamento familiar", floor: "Planta baja · entrada independiente", features: ["Cocina completa", "Hasta 4 huéspedes"] },
      tr: { name: "Daire 8", category: "Aile dairesi", floor: "Zemin kat · bağımsız giriş", features: ["Tam mutfak", "4 kişiye kadar"] },
    },
  },
  "265595:2": {
    number: 9,
    gallery: ["/images/rooms/chios-apartments-voulamandis.webp", "/images/rooms/chios-hotels-family-apartments.webp", "/images/rooms/family-room.webp", "/images/rooms/voulamandis-apartment-bathroom..webp"],
    copy: {
      el: { name: "Διαμέρισμα 9", category: "Οικογενειακό διαμέρισμα", floor: "Ισόγειο · ανεξάρτητη είσοδος", features: ["Πλήρης κουζίνα", "Έως 4 άτομα"] },
      en: { name: "Apartment 9", category: "Family apartment", floor: "Ground floor · independent entrance", features: ["Full kitchen", "Up to 4 guests"] },
      fr: { name: "Appartement 9", category: "Appartement familial", floor: "Rez-de-chaussée · entrée indépendante", features: ["Cuisine complète", "Jusqu’à 4 personnes"] },
      de: { name: "Apartment 9", category: "Familienapartment", floor: "Erdgeschoss · eigener Eingang", features: ["Voll ausgestattete Küche", "Bis zu 4 Gäste"] },
      it: { name: "Appartamento 9", category: "Appartamento familiare", floor: "Piano terra · ingresso indipendente", features: ["Cucina completa", "Fino a 4 ospiti"] },
      es: { name: "Apartamento 9", category: "Apartamento familiar", floor: "Planta baja · entrada independiente", features: ["Cocina completa", "Hasta 4 huéspedes"] },
      tr: { name: "Daire 9", category: "Aile dairesi", floor: "Zemin kat · bağımsız giriş", features: ["Tam mutfak", "4 kişiye kadar"] },
    },
  },
  "265595:3": {
    number: 10,
    gallery: ["/images/rooms/DSC07899.webp", "/images/rooms/DSC07909.webp", "/images/rooms/DSC07940.webp", "/images/rooms/DSC07943.webp"],
    copy: {
      el: { name: "Διαμέρισμα 10", category: "Οικογενειακό διαμέρισμα", floor: "Ισόγειο · ανεξάρτητη είσοδος", features: ["Πλήρης κουζίνα", "Έως 5 άτομα υπό προϋποθέσεις"] },
      en: { name: "Apartment 10", category: "Family apartment", floor: "Ground floor · independent entrance", features: ["Full kitchen", "Up to 5 guests subject to conditions"] },
      fr: { name: "Appartement 10", category: "Appartement familial", floor: "Rez-de-chaussée · entrée indépendante", features: ["Cuisine complète", "Jusqu’à 5 personnes sous conditions"] },
      de: { name: "Apartment 10", category: "Familienapartment", floor: "Erdgeschoss · eigener Eingang", features: ["Voll ausgestattete Küche", "Bis zu 5 Gäste unter Bedingungen"] },
      it: { name: "Appartamento 10", category: "Appartamento familiare", floor: "Piano terra · ingresso indipendente", features: ["Cucina completa", "Fino a 5 ospiti con condizioni"] },
      es: { name: "Apartamento 10", category: "Apartamento familiar", floor: "Planta baja · entrada independiente", features: ["Cocina completa", "Hasta 5 huéspedes con condiciones"] },
      tr: { name: "Daire 10", category: "Aile dairesi", floor: "Zemin kat · bağımsız giriş", features: ["Tam mutfak", "Koşullu olarak 5 kişiye kadar"] },
    },
  }
};

export function presentLiveOffers(offers: RawOffer[], language: AssistantLanguage) {
  return offers.map((offer) => {
    const key = `${offer.roomId}:${offer.unitId}`;
    const room = ROOM_DATA[key];
    if (!room) return offer;
    const copy = room.copy[language] || room.copy.en;
    return {
      ...offer,
      roomNumber: room.number,
      name: copy.name,
      category: copy.category,
      floor: copy.floor,
      features: Array.from(new Set([...copy.features, ...(Array.isArray(offer.features) ? offer.features : [])])),
      gallery: Array.from(new Set([offer.image, ...room.gallery].filter(Boolean))),
    };
  });
}

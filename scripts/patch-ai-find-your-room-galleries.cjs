const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'lib/ai-assistant/live-offer-presentation.ts');
let source = fs.readFileSync(file, 'utf8');

const replacements = new Map([
  ['gallery: ["/images/rooms/DSC07776-2-e1675109942622.webp", "/images/rooms/DSC07769-1.webp"]', 'gallery: ["/images/rooms/DSC07776-2-e1675109942622.webp", "/images/rooms/DSC07769-1.webp", "/images/rooms/----1-1.webp", "/images/rooms/voulamandis-house-bathrooms-1.webp"]'],
  ['gallery: ["/images/rooms/DSC07803-1.webp", "/images/rooms/DSC07839.webp"]', 'gallery: ["/images/rooms/DSC07803-1.webp", "/images/rooms/DSC07839.webp", "/images/rooms/DSC07832.webp", "/images/rooms/received_1385287484893642_1500478431120_1200x800_3240x2160-1.webp"]'],
  ['gallery: ["/images/rooms/DSC07867-1.webp", "/images/rooms/DSC07860-1.webp"]', 'gallery: ["/images/rooms/DSC07867-1.webp", "/images/rooms/DSC07860-1.webp", "/images/rooms/DSC07849-1.webp", "/images/rooms/DSC07891-1.webp"]'],
  ['gallery: ["/images/rooms/received_1748354861920234.webp", "/images/rooms/received_1748358935253160.webp"]', 'gallery: ["/images/rooms/received_1748354861920234.webp", "/images/rooms/received_1748358935253160.webp", "/images/rooms/received_1748356725253381.webp"]'],
  ['gallery: ["/images/rooms/voulamandis-house-rooms.webp"]', 'gallery: ["/images/rooms/voulamandis-house-rooms.webp", "/images/rooms/chios-hotels-triple-rooms_1646x1080.webp", "/images/rooms/voulamandis-house-double-room-bathroom_1620x1080.webp", "/images/rooms/hotels-chios-voulamandis_1620x1080.webp"]'],
  ['gallery: ["/images/rooms/received_1753964631359257.webp", "/images/rooms/received_1753964581359262.webp"]', 'gallery: ["/images/rooms/received_1753964631359257.webp", "/images/rooms/received_1753964581359262.webp", "/images/rooms/received_1753968691358851.webp", "/images/rooms/received_1753969201358800.webp"]'],
]);
for (const [from, to] of replacements) source = source.replace(from, to);

if (!source.includes('"626129:2"')) {
  source = source.replace('\n};\n\nexport function presentLiveOffers', `,
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

export function presentLiveOffers`);
}

fs.writeFileSync(file, source);
console.log('Find Your Room galleries applied to AI offers');

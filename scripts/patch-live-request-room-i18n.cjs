const fs = require("fs");

const file = "components/home/LiveDirectRequest.tsx";
let s = fs.readFileSync(file, "utf8");

// Add room/card translation fields into each locale copy
function addFields(localeKey, fields) {
  const marker = `    trustItems: [`;
  const start = s.indexOf(`  ${localeKey}: {`);
  if (start === -1) throw new Error(`Locale ${localeKey} not found`);

  const markerIndex = s.indexOf(marker, start);
  if (markerIndex === -1) throw new Error(`trustItems marker not found for ${localeKey}`);

  if (s.slice(start, markerIndex).includes("topPick:")) return;

  s = s.slice(0, markerIndex) + fields + s.slice(markerIndex);
}

addFields("en", `    topPick: "Top pick",
    directDeal: "Direct deal",
    from: "from",
    roomWord: "Room",
    apartmentWord: "Apartment",
    roomTypes: {
      "Upper Floor Double / Triple": "Upper Floor Double / Triple",
      "Economy Double": "Economy Double",
      "Ground Floor Double / Triple": "Ground Floor Double / Triple",
      "Family Apartment": "Family Apartment",
    },
    badges: {
      Economy: "Economy",
      Kitchenette: "Kitchenette",
      Kitchen: "Kitchen",
      "First floor": "First floor",
      "Ground floor": "Ground floor",
      "No kitchenette": "No kitchenette",
      Stairs: "Stairs",
      "No stairs": "No stairs",
    },
`);

addFields("el", `    topPick: "Κορυφαία επιλογή",
    directDeal: "Απευθείας προσφορά",
    from: "από",
    roomWord: "Δωμάτιο",
    apartmentWord: "Διαμέρισμα",
    roomTypes: {
      "Upper Floor Double / Triple": "Δίκλινο / Τρίκλινο στον επάνω όροφο",
      "Economy Double": "Οικονομικό δίκλινο",
      "Ground Floor Double / Triple": "Δίκλινο / Τρίκλινο στο ισόγειο",
      "Family Apartment": "Οικογενειακό διαμέρισμα",
    },
    badges: {
      Economy: "Οικονομικό",
      Kitchenette: "Μικρή κουζίνα",
      Kitchen: "Κουζίνα",
      "First floor": "Επάνω όροφος",
      "Ground floor": "Ισόγειο",
      "No kitchenette": "Χωρίς μικρή κουζίνα",
      Stairs: "Σκάλες",
      "No stairs": "Χωρίς σκάλες",
    },
`);

addFields("fr", `    topPick: "Meilleur choix",
    directDeal: "Offre directe",
    from: "à partir de",
    roomWord: "Chambre",
    apartmentWord: "Appartement",
    roomTypes: {
      "Upper Floor Double / Triple": "Double / triple à l’étage",
      "Economy Double": "Double économique",
      "Ground Floor Double / Triple": "Double / triple au rez-de-chaussée",
      "Family Apartment": "Appartement familial",
    },
    badges: {
      Economy: "Économique",
      Kitchenette: "Kitchenette",
      Kitchen: "Cuisine",
      "First floor": "Étage",
      "Ground floor": "Rez-de-chaussée",
      "No kitchenette": "Sans kitchenette",
      Stairs: "Escaliers",
      "No stairs": "Sans escaliers",
    },
`);

addFields("de", `    topPick: "Beste Wahl",
    directDeal: "Direktangebot",
    from: "ab",
    roomWord: "Zimmer",
    apartmentWord: "Apartment",
    roomTypes: {
      "Upper Floor Double / Triple": "Doppel- / Dreibettzimmer im Obergeschoss",
      "Economy Double": "Economy Doppelzimmer",
      "Ground Floor Double / Triple": "Doppel- / Dreibettzimmer im Erdgeschoss",
      "Family Apartment": "Familienapartment",
    },
    badges: {
      Economy: "Economy",
      Kitchenette: "Kitchenette",
      Kitchen: "Küche",
      "First floor": "Obergeschoss",
      "Ground floor": "Erdgeschoss",
      "No kitchenette": "Keine Kitchenette",
      Stairs: "Treppen",
      "No stairs": "Keine Treppen",
    },
`);

addFields("it", `    topPick: "Scelta migliore",
    directDeal: "Offerta diretta",
    from: "da",
    roomWord: "Camera",
    apartmentWord: "Appartamento",
    roomTypes: {
      "Upper Floor Double / Triple": "Doppia / tripla al piano superiore",
      "Economy Double": "Doppia economy",
      "Ground Floor Double / Triple": "Doppia / tripla al piano terra",
      "Family Apartment": "Appartamento familiare",
    },
    badges: {
      Economy: "Economy",
      Kitchenette: "Angolo cottura",
      Kitchen: "Cucina",
      "First floor": "Piano superiore",
      "Ground floor": "Piano terra",
      "No kitchenette": "Senza angolo cottura",
      Stairs: "Scale",
      "No stairs": "Senza scale",
    },
`);

addFields("es", `    topPick: "Mejor opción",
    directDeal: "Oferta directa",
    from: "desde",
    roomWord: "Habitación",
    apartmentWord: "Apartamento",
    roomTypes: {
      "Upper Floor Double / Triple": "Doble / triple en planta superior",
      "Economy Double": "Doble económica",
      "Ground Floor Double / Triple": "Doble / triple en planta baja",
      "Family Apartment": "Apartamento familiar",
    },
    badges: {
      Economy: "Económica",
      Kitchenette: "Kitchenette",
      Kitchen: "Cocina",
      "First floor": "Planta superior",
      "Ground floor": "Planta baja",
      "No kitchenette": "Sin kitchenette",
      Stairs: "Escaleras",
      "No stairs": "Sin escaleras",
    },
`);

addFields("tr", `    topPick: "En iyi seçim",
    directDeal: "Doğrudan teklif",
    from: "başlayan",
    roomWord: "Oda",
    apartmentWord: "Daire",
    roomTypes: {
      "Upper Floor Double / Triple": "Üst kat çift / üç kişilik",
      "Economy Double": "Ekonomik çift kişilik",
      "Ground Floor Double / Triple": "Zemin kat çift / üç kişilik",
      "Family Apartment": "Aile dairesi",
    },
    badges: {
      Economy: "Ekonomik",
      Kitchenette: "Mini mutfak",
      Kitchen: "Mutfak",
      "First floor": "Üst kat",
      "Ground floor": "Zemin kat",
      "No kitchenette": "Mini mutfak yok",
      Stairs: "Merdiven",
      "No stairs": "Merdiven yok",
    },
`);

// Extend type definition
s = s.replace(
  `  messageConfirm: string;
  trustItems: { icon: TrustIconType; title: string; text: string }[];`,
  `  messageConfirm: string;
  topPick: string;
  directDeal: string;
  from: string;
  roomWord: string;
  apartmentWord: string;
  roomTypes: Record<string, string>;
  badges: Record<string, string>;
  trustItems: { icon: TrustIconType; title: string; text: string }[];`
);

// Add helper functions
if (!s.includes("function localizeRoomName")) {
  s = s.replace(
`function getLiveRequestLocale(canonicalPath: string): LiveRequestLocale {
  if (canonicalPath.startsWith("/el")) return "el";
  if (canonicalPath.startsWith("/fr")) return "fr";
  if (canonicalPath.startsWith("/de")) return "de";
  if (canonicalPath.startsWith("/it")) return "it";
  if (canonicalPath.startsWith("/es")) return "es";
  if (canonicalPath.startsWith("/tr")) return "tr";
  return "en";
}
`,
`function getLiveRequestLocale(canonicalPath: string): LiveRequestLocale {
  if (canonicalPath.startsWith("/el")) return "el";
  if (canonicalPath.startsWith("/fr")) return "fr";
  if (canonicalPath.startsWith("/de")) return "de";
  if (canonicalPath.startsWith("/it")) return "it";
  if (canonicalPath.startsWith("/es")) return "es";
  if (canonicalPath.startsWith("/tr")) return "tr";
  return "en";
}

function localizeRoomName(value: string, copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale]) {
  return value
    .replace(/^Room\\s+(\\d+)/i, \`\${copy.roomWord} $1\`)
    .replace(/^Apartment\\s+(\\d+)/i, \`\${copy.apartmentWord} $1\`);
}

function localizeRoomType(value: string, copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale]) {
  return copy.roomTypes[value] || value;
}

function localizeBadge(value: string, copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale]) {
  if (/^👤×\\d+/.test(value)) return value;
  return copy.badges[value] || value;
}
`
  );
}

// RoomCard accepts copy
s = s.replace(
  `  onSelect,
}: {
  room: RoomMeta;
  active: boolean | null;
  index: number;
  amount: number | null;
  onSelect: () => void;
}) {`,
  `  onSelect,
  copy,
}: {
  room: RoomMeta;
  active: boolean | null;
  index: number;
  amount: number | null;
  onSelect: () => void;
  copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale];
}) {
  const roomName = localizeRoomName(room.displayName, copy);
  const roomType = localizeRoomType(room.type, copy);
  const primaryBadge = localizeBadge(room.primaryBadge, copy);
  const featureBadges = room.featureBadges.map((badge) => localizeBadge(badge, copy));`
);

// Replace room card visible strings
s = s.replace("Top pick</span>", "{copy.topPick}</span>");
s = s.replace("Direct deal</span>", "{copy.directDeal}</span>");
s = s.replace("alt={`${room.displayName} ${room.type}`}", "alt={`${roomName} ${roomType}`}");
s = s.replace("{room.displayName}</h3>", "{roomName}</h3>");
s = s.replace("{room.type}</p>", "{roomType}</p>");
s = s.replace("{room.primaryBadge}</span>", "{primaryBadge}</span>");
s = s.replace("room.featureBadges.slice(0, 4).map((badge)", "featureBadges.slice(0, 4).map((badge)");
s = s.replace(">from</span>", ">{copy.from}</span>");

// Pass copy into RoomCard
s = s.replace(
  `room={room}
                        index={index}`,
  `room={room}
                        copy={copy}
                        index={index}`
);

// Selected room visible strings
s = s.replace(
  "alt={`${selectedRoom.displayName} ${selectedRoom.type}`}",
  "alt={`${localizeRoomName(selectedRoom.displayName, copy)} ${localizeRoomType(selectedRoom.type, copy)}`}"
);
s = s.replace("{selectedRoom.primaryBadge}</span>", "{localizeBadge(selectedRoom.primaryBadge, copy)}</span>");
s = s.replace("{selectedRoom.displayName}</h3>", "{localizeRoomName(selectedRoom.displayName, copy)}</h3>");
s = s.replace("{selectedRoom.type}</p>", "{localizeRoomType(selectedRoom.type, copy)}</p>");
s = s.replace(
  "selectedRoom.featureBadges.map((badge)",
  "selectedRoom.featureBadges.map((badge)"
);
s = s.replace(
  `<span key={badge} className="rounded-md bg-stone-100/90 px-3 py-1.5 text-xs font-bold text-stone-700 ring-1 ring-stone-200">{badge}</span>`,
  `<span key={badge} className="rounded-md bg-stone-100/90 px-3 py-1.5 text-xs font-bold text-stone-700 ring-1 ring-stone-200">{localizeBadge(badge, copy)}</span>`
);

// Summary room name
s = s.replace(
  `{selectedRoom?.displayName || "-"} · {copy.directOffer}`,
  `{selectedRoom ? localizeRoomName(selectedRoom.displayName, copy) : "-"} · {copy.directOffer}`
);

fs.writeFileSync(file, s, "utf8");
console.log("Patched live request room cards and badges localization.");

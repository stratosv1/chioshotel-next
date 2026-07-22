const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AiRoomDetailsEnhancer.tsx");
let source = fs.readFileSync(file, "utf8");

const oldNames = "(?:Room|Δωμάτιο|Zimmer|Chambre|Camera|Habitación|Oda|Apartment|Διαμέρισμα)";
const newNames = "(?:Room|Δωμάτιο|Zimmer|Chambre|Camera|Habitación|Oda|Apartment|Appartement|Appartamento|Apartamento|Daire|Διαμέρισμα)";
const occurrences = source.split(oldNames).length - 1;

if (occurrences < 1) {
  throw new Error("AI room detail localized-name parser was not found");
}

source = source.split(oldNames).join(newNames);

if (source.includes(oldNames)) {
  throw new Error("AI room detail parser still contains the incomplete localized-name list");
}
if (!source.includes("Appartement|Appartamento|Apartamento|Daire")) {
  throw new Error("Localized apartment names were not added to the detail parser");
}

fs.writeFileSync(file, source);
console.log(`AI room detail parser fixed for localized apartment names (${occurrences} parser occurrence(s))`);

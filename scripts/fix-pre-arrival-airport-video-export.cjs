const fs = require("fs");

const file = "content/pre-arrival.ts";
const backup = `${file}.backup-add-airport-video-export-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)}`;

let s = fs.readFileSync(file, "utf8");
fs.writeFileSync(backup, s, "utf8");

if (!s.includes("export const preArrivalAirportVideoUrl")) {
  const marker = 'export const preArrivalDirectionsUrl =';
  const index = s.indexOf(marker);

  if (index === -1) {
    throw new Error("Could not find preArrivalDirectionsUrl in content/pre-arrival.ts");
  }

  const nextExportIndex = s.indexOf("\nexport const", index + marker.length);

  if (nextExportIndex === -1) {
    throw new Error("Could not find next export after preArrivalDirectionsUrl");
  }

  const insert = `

export const preArrivalAirportVideoUrl =
  "https://www.youtube.com/watch?v=-NJeQz8tLqI";
`;

  s = s.slice(0, nextExportIndex) + insert + s.slice(nextExportIndex);
}

fs.writeFileSync(file, s, "utf8");

const check = fs.readFileSync(file, "utf8");
console.log("preArrivalAirportVideoUrl", check.includes("export const preArrivalAirportVideoUrl") ? "OK" : "MISSING");
console.log("-NJeQz8tLqI", check.includes("-NJeQz8tLqI") ? "OK" : "MISSING");
console.log("Backup:", backup);

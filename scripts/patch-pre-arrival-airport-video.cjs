const fs = require("fs");

const contentFile = "content/pre-arrival.ts";
const componentFile = "components/pre-arrival/PreArrivalPage.tsx";

function backup(file, tag) {
  const backupFile = `${file}.backup-${tag}-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)}`;
  fs.copyFileSync(file, backupFile);
  console.log("Backup:", backupFile);
}

backup(contentFile, "airport-video");
backup(componentFile, "airport-video");

let content = fs.readFileSync(contentFile, "utf8");
let component = fs.readFileSync(componentFile, "utf8");

/* 1. Add airport video constant */
if (!content.includes("preArrivalAirportVideoUrl")) {
  content = content.replace(
`export const preArrivalDirectionsUrl =
  "https://maps.app.goo.gl/XavLJ5Lq7eumLQim7";`,
`export const preArrivalDirectionsUrl =
  "https://maps.app.goo.gl/XavLJ5Lq7eumLQim7";

export const preArrivalAirportVideoUrl =
  "https://www.youtube.com/watch?v=-NJeQz8tLqI";`
  );
}

fs.writeFileSync(contentFile, content, "utf8");

/* 2. Import video URL in component */
if (!component.includes("preArrivalAirportVideoUrl")) {
  component = component.replace(
`  preArrivalContact,
  preArrivalDirectionsUrl,`,
`  preArrivalContact,
  preArrivalDirectionsUrl,
  preArrivalAirportVideoUrl,`
  );
}

/* 3. Add video labels */
if (!component.includes("airportVideo")) {
  component = component.replace(
`    airport: "Route from Chios Airport",`,
`    airport: "Route from Chios Airport",
    airportVideo: "Watch quick video directions from Chios Airport",`
  );

  component = component.replace(
`    airport: "Διαδρομή από αεροδρόμιο Χίου",`,
`    airport: "Διαδρομή από αεροδρόμιο Χίου",
    airportVideo: "Δείτε σύντομο video διαδρομής από το αεροδρόμιο",`
  );

  component = component.replace(
`    airport: "Itinéraire depuis l’aéroport de Chios",`,
`    airport: "Itinéraire depuis l’aéroport de Chios",
    airportVideo: "Voir la vidéo rapide depuis l’aéroport",`
  );

  component = component.replace(
`    airport: "Route vom Flughafen Chios",`,
`    airport: "Route vom Flughafen Chios",
    airportVideo: "Kurzes Video vom Flughafen ansehen",`
  );

  component = component.replace(
`    airport: "Percorso dall’aeroporto di Chios",`,
`    airport: "Percorso dall’aeroporto di Chios",
    airportVideo: "Guarda il video rapido dall’aeroporto",`
  );

  component = component.replace(
`    airport: "Ruta desde el aeropuerto de Chios",`,
`    airport: "Ruta desde el aeropuerto de Chios",
    airportVideo: "Ver video rápido desde el aeropuerto",`
  );

  component = component.replace(
`    airport: "Chios Havalimanı rotası",`,
`    airport: "Chios Havalimanı rotası",
    airportVideo: "Havalimanından kısa rota videosunu izleyin",`
  );
}

/* 4. Add video button after airport route button */
if (!component.includes("href={preArrivalAirportVideoUrl}")) {
  component = component.replace(
`              <a
                href={preArrivalChiosHarborDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-cyan-800 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-teal-900"
              >
                {routeLabels.harbor}
              </a>`,
`              <a
                href={preArrivalAirportVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-red-700 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-red-800"
              >
                ▶ {routeLabels.airportVideo}
              </a>

              <a
                href={preArrivalChiosHarborDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-cyan-800 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-teal-900"
              >
                {routeLabels.harbor}
              </a>`
  );
}

fs.writeFileSync(componentFile, component, "utf8");

console.log("Added airport video directions button.");
console.log("Checking:");
const checkContent = fs.readFileSync(contentFile, "utf8");
const checkComponent = fs.readFileSync(componentFile, "utf8");

for (const word of [
  "-NJeQz8tLqI",
  "preArrivalAirportVideoUrl",
  "airportVideo",
  "Δείτε σύντομο video",
  "Watch quick video directions"
]) {
  console.log(word, checkContent.includes(word) || checkComponent.includes(word) ? "OK" : "MISSING");
}

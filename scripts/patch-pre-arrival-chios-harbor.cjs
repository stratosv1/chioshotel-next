const fs = require("fs");

const contentFile = "content/pre-arrival.ts";
const componentFile = "components/pre-arrival/PreArrivalPage.tsx";

function backup(file, tag) {
  const backupFile = `${file}.backup-${tag}-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)}`;
  fs.copyFileSync(file, backupFile);
  console.log("Backup:", backupFile);
}

backup(contentFile, "chios-harbor");
backup(componentFile, "chios-harbor");

let content = fs.readFileSync(contentFile, "utf8");
let component = fs.readFileSync(componentFile, "utf8");

/* 1. Add Chios Harbor route constant */
if (!content.includes("preArrivalChiosHarborDirectionsUrl")) {
  if (content.includes("export const preArrivalMestaDirectionsUrl")) {
    content = content.replace(
`export const preArrivalMestaDirectionsUrl =
  "https://maps.app.goo.gl/Td32TUBVDnNRC3NXA";`,
`export const preArrivalChiosHarborDirectionsUrl =
  "https://maps.app.goo.gl/FpbnKb8z9hvF6uWc9";

export const preArrivalMestaDirectionsUrl =
  "https://maps.app.goo.gl/Td32TUBVDnNRC3NXA";`
    );
  } else {
    content = content.replace(
`export const preArrivalDirectionsUrl =
  "https://maps.app.goo.gl/XavLJ5Lq7eumLQim7";`,
`export const preArrivalDirectionsUrl =
  "https://maps.app.goo.gl/XavLJ5Lq7eumLQim7";

export const preArrivalChiosHarborDirectionsUrl =
  "https://maps.app.goo.gl/FpbnKb8z9hvF6uWc9";`
    );
  }
}

/* 2. Add English Chios Harbor step after airport warning */
if (!content.includes('title: "From Chios Harbor"')) {
  content = content.replace(
`        {
          title: "Google Maps warning",
          text:
            "If Google Maps suggests CHALKOUSI ZANNI KE MARIAS Street, ignore that turn and continue on the correct route.",
        },`,
`        {
          title: "Google Maps warning",
          text:
            "If Google Maps suggests CHALKOUSI ZANNI KE MARIAS Street, ignore that turn and continue on the correct route.",
        },
        {
          title: "From Chios Harbor",
          text:
            "Leaving the port of Chios, move around the harbor towards Chios Airport. In about 10 minutes, you will see the airport gate on your right; continue straight ahead. Follow the road parallel to the runway until the end. You will see an ELIN gas station on your right, then MY MARKET and Lidl on your left. After Lidl, at the end of the runway, turn left into DIMARCHOU KALVOKORESSI Street and continue only on this road until number 117. If Google Maps suggests CHALKOUSI ZANNI KE MARIAS Street, ignore it. The road has some turns, tall stone walls and Chios mandarin orchards.",
        },`
  );
}

/* 3. Add Greek Chios Harbor step after airport warning */
if (!content.includes('title: "Από λιμάνι Χίου"')) {
  content = content.replace(
`        {
          title: "Προειδοποίηση για Google Maps",
          text:
            "Αν το Google Maps σας προτείνει την οδό Χαλκούση Ζάννη και Μαρίας, αγνοήστε αυτή τη στροφή και συνεχίστε στη σωστή διαδρομή.",
        },`,
`        {
          title: "Προειδοποίηση για Google Maps",
          text:
            "Αν το Google Maps σας προτείνει την οδό Χαλκούση Ζάννη και Μαρίας, αγνοήστε αυτή τη στροφή και συνεχίστε στη σωστή διαδρομή.",
        },
        {
          title: "Από λιμάνι Χίου",
          text:
            "Φεύγοντας από το λιμάνι της Χίου, κινηθείτε γύρω από το λιμάνι προς το αεροδρόμιο Χίου. Σε περίπου 10 λεπτά θα δείτε την πύλη του αεροδρομίου στα δεξιά σας και συνεχίζετε ευθεία. Ακολουθήστε τον δρόμο παράλληλα με τον διάδρομο μέχρι το τέλος. Στη διαδρομή θα δείτε βενζινάδικο ELIN στα δεξιά, και μετά στα αριστερά σας το MY MARKET και δίπλα το Lidl. Μετά το Lidl, στο τέλος του διαδρόμου, στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση και συνεχίστε μόνο σε αυτόν τον δρόμο μέχρι τον αριθμό 117. Αν το Google Maps προτείνει την οδό Χαλκούση Ζάννη και Μαρίας, αγνοήστε την. Η διαδρομή έχει κάποιες στροφές, ψηλούς πέτρινους τοίχους και περιβόλια με μανταρίνια Χίου.",
        },`
  );
}

fs.writeFileSync(contentFile, content, "utf8");

/* 4. Import Chios Harbor route in component */
if (!component.includes("preArrivalChiosHarborDirectionsUrl")) {
  component = component.replace(
`  preArrivalContact,
  preArrivalDirectionsUrl,`,
`  preArrivalContact,
  preArrivalDirectionsUrl,
  preArrivalChiosHarborDirectionsUrl,`
  );
}

/* 5. Add labels for Chios Harbor */
component = component.replace(
`    airport: "Route from Chios Airport / Town",
    mesta: "Route from Mesta Port",`,
`    airport: "Route from Chios Airport",
    harbor: "Route from Chios Harbor",
    mesta: "Route from Mesta Port",`
);

component = component.replace(
`    airport: "Διαδρομή από αεροδρόμιο / πόλη Χίου",
    mesta: "Διαδρομή από λιμάνι Μεστών",`,
`    airport: "Διαδρομή από αεροδρόμιο Χίου",
    harbor: "Διαδρομή από λιμάνι Χίου",
    mesta: "Διαδρομή από λιμάνι Μεστών",`
);

component = component.replace(
`    airport: "Itinéraire depuis l’aéroport / ville de Chios",
    mesta: "Itinéraire depuis le port de Mesta",`,
`    airport: "Itinéraire depuis l’aéroport de Chios",
    harbor: "Itinéraire depuis le port de Chios",
    mesta: "Itinéraire depuis le port de Mesta",`
);

component = component.replace(
`    airport: "Route vom Flughafen / Chios-Stadt",
    mesta: "Route vom Hafen Mesta",`,
`    airport: "Route vom Flughafen Chios",
    harbor: "Route vom Hafen Chios",
    mesta: "Route vom Hafen Mesta",`
);

component = component.replace(
`    airport: "Percorso dall’aeroporto / città di Chios",
    mesta: "Percorso dal porto di Mesta",`,
`    airport: "Percorso dall’aeroporto di Chios",
    harbor: "Percorso dal porto di Chios",
    mesta: "Percorso dal porto di Mesta",`
);

component = component.replace(
`    airport: "Ruta desde el aeropuerto / ciudad de Chios",
    mesta: "Ruta desde el puerto de Mesta",`,
`    airport: "Ruta desde el aeropuerto de Chios",
    harbor: "Ruta desde el puerto de Chios",
    mesta: "Ruta desde el puerto de Mesta",`
);

component = component.replace(
`    airport: "Chios Havalimanı / merkezden rota",
    mesta: "Mesta Limanı’ndan rota",`,
`    airport: "Chios Havalimanı rotası",
    harbor: "Chios Limanı rotası",
    mesta: "Mesta Limanı’ndan rota",`
);

/* 6. Add Chios Harbor button between airport and Mesta buttons */
if (!component.includes("href={preArrivalChiosHarborDirectionsUrl}")) {
  component = component.replace(
`              <a
                href={preArrivalMestaDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-slate-950 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-teal-900"
              >
                {routeLabels.mesta}
              </a>`,
`              <a
                href={preArrivalChiosHarborDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-cyan-800 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-teal-900"
              >
                {routeLabels.harbor}
              </a>

              <a
                href={preArrivalMestaDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-slate-950 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-teal-900"
              >
                {routeLabels.mesta}
              </a>`
  );
}

fs.writeFileSync(componentFile, component, "utf8");

console.log("Added Chios Harbor route.");
console.log("Checking important words:");

const checkContent = fs.readFileSync(contentFile, "utf8");
const checkComponent = fs.readFileSync(componentFile, "utf8");

for (const word of [
  "FpbnKb8z9hvF6uWc9",
  "From Chios Harbor",
  "Από λιμάνι Χίου",
  "ELIN",
  "MY MARKET",
  "Lidl",
  "DIMARCHOU KALVOKORESSI",
  "CHALKOUSI ZANNI KE MARIAS",
  "preArrivalChiosHarborDirectionsUrl",
]) {
  console.log(word, checkContent.includes(word) || checkComponent.includes(word) ? "OK" : "MISSING");
}

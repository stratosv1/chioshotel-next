const fs = require("fs");

function backup(file, tag) {
  const backupFile = `${file}.backup-${tag}-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)}`;
  fs.copyFileSync(file, backupFile);
  console.log("Backup:", backupFile);
}

const contentFile = "content/pre-arrival.ts";
const componentFile = "components/pre-arrival/PreArrivalPage.tsx";

backup(contentFile, "mesta-route");
backup(componentFile, "mesta-route");

let content = fs.readFileSync(contentFile, "utf8");
let component = fs.readFileSync(componentFile, "utf8");

/* 1. Add second route constant for Mesta Port */
if (!content.includes("preArrivalMestaDirectionsUrl")) {
  content = content.replace(
`export const preArrivalMapEmbedUrl =
  "https://www.google.com/maps?q=Voulamandis%20House%20Kampos%20Chios&output=embed";`,
`export const preArrivalMestaDirectionsUrl =
  "https://maps.app.goo.gl/Td32TUBVDnNRC3NXA";

export const preArrivalMapEmbedUrl =
  "https://www.google.com/maps?q=Voulamandis%20House%20Kampos%20Chios&output=embed";`
  );
}

/* 2. Replace English directions intro with airport + Mesta detail */
content = content.replace(
`      text:
        "Voulamandis House is very close to Chios Airport, about 8 minutes away. When you exit the airport gate, turn right towards Voulamandis House and follow the road parallel to the runway.",
      importantTitle: "Important Google Maps warning",
      importantText:
        "After Lidl, Google Maps may suggest turning into Chalkousi Zanni ke Marias Street. Ignore that turn. Continue to the end of the runway and turn left into Dimarchou Kalvokoressi Street. Voulamandis House is at number 117.",`,
`      text:
        "Choose the route according to where you arrive. From Chios Airport, Voulamandis House is about 8 minutes away. From Mesta Port, it takes about 1 hour through the island’s interior, with a comfortable road network.",
      importantTitle: "Important Google Maps warning",
      importantText:
        "From the airport, after Lidl, Google Maps may suggest turning into Chalkousi Zanni ke Marias Street. Ignore that turn. Continue to the end of the runway and turn left into Dimarchou Kalvokoressi Street. Voulamandis House is at number 117. From Mesta Port, follow our exact route through Pyrgi, Armolia and Thymiana; Google Maps might suggest alternatives, but our route is the easiest and fastest.",`
);

content = content.replace(
`        {
          title: "Do not follow the wrong turn",
          text:
            "If Google Maps suggests Chalkousi Zanni ke Marias Street, ignore it and stay on the correct route.",
        },
      ],`,
`        {
          title: "Do not follow the wrong airport turn",
          text:
            "If Google Maps suggests Chalkousi Zanni ke Marias Street, ignore it and stay on the correct route.",
        },
        {
          title: "From Mesta Port",
          text:
            "The drive from Mesta Port takes about 1 hour. Head towards the centre of the island and follow our route through Pyrgi, Armolia and local shops. You will arrive at Voulamandis House through the village of Thymiana.",
        },
      ],`
);

/* 3. Replace Greek directions intro with airport + Mesta detail */
content = content.replace(
`      text:
        "Το Voulamandis House είναι πολύ κοντά στο αεροδρόμιο της Χίου, περίπου 8 λεπτά. Βγαίνοντας από την πύλη του αεροδρομίου, στρίψτε δεξιά προς Voulamandis House και ακολουθήστε τον δρόμο παράλληλα με τον διάδρομο του αεροδρομίου.",
      importantTitle: "Σημαντική προειδοποίηση για Google Maps",
      importantText:
        "Μετά το Lidl, το Google Maps μπορεί να σας προτείνει να στρίψετε στην οδό Χαλκούση Ζάννη και Μαρίας. Αγνοήστε αυτή τη στροφή. Συνεχίστε μέχρι το τέλος του διαδρόμου και στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση. Το Voulamandis House βρίσκεται στον αριθμό 117.",`,
`      text:
        "Επιλέξτε τη διαδρομή ανάλογα με το σημείο άφιξής σας. Από το αεροδρόμιο της Χίου, το Voulamandis House απέχει περίπου 8 λεπτά. Από το λιμάνι των Μεστών, η διαδρομή διαρκεί περίπου 1 ώρα μέσα από το εσωτερικό του νησιού, με άνετο οδικό δίκτυο.",
      importantTitle: "Σημαντική προειδοποίηση για Google Maps",
      importantText:
        "Από το αεροδρόμιο, μετά το Lidl, το Google Maps μπορεί να σας προτείνει να στρίψετε στην οδό Χαλκούση Ζάννη και Μαρίας. Αγνοήστε αυτή τη στροφή. Συνεχίστε μέχρι το τέλος του διαδρόμου και στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση. Το Voulamandis House βρίσκεται στον αριθμό 117. Από το λιμάνι Μεστών, ακολουθήστε την ακριβή διαδρομή μας μέσω Πυργίου, Αρμολίων και Θυμιανών· μπορεί το Google Maps να προτείνει εναλλακτικές, αλλά η δική μας είναι η πιο εύκολη και γρήγορη.",`
);

content = content.replace(
`        {
          title: "Μην ακολουθήσετε τη λάθος στροφή",
          text:
            "Αν το Google Maps σας προτείνει την οδό Χαλκούση Ζάννη και Μαρίας, αγνοήστε την και μείνετε στη σωστή διαδρομή.",
        },
      ],`,
`        {
          title: "Μην ακολουθήσετε τη λάθος στροφή από αεροδρόμιο",
          text:
            "Αν το Google Maps σας προτείνει την οδό Χαλκούση Ζάννη και Μαρίας, αγνοήστε την και μείνετε στη σωστή διαδρομή.",
        },
        {
          title: "Από λιμάνι Μεστών",
          text:
            "Η διαδρομή από το λιμάνι Μεστών διαρκεί περίπου 1 ώρα. Κατευθυνθείτε προς το κέντρο του νησιού και ακολουθήστε τη διαδρομή μας μέσω Πυργίου, Αρμολίων και τοπικών καταστημάτων. Θα φτάσετε στο Voulamandis House μέσα από το χωριό Θυμιανά.",
        },
      ],`
);

fs.writeFileSync(contentFile, content, "utf8");

/* 4. Import Mesta route in component */
component = component.replace(
`  preArrivalContact,
  preArrivalDirectionsUrl,
  preArrivalMapEmbedUrl,`,
`  preArrivalContact,
  preArrivalDirectionsUrl,
  preArrivalMestaDirectionsUrl,
  preArrivalMapEmbedUrl,`
);

/* 5. Add route labels */
if (!component.includes("routeButtonLabels")) {
  component = component.replace(
`const languageLinks = [`,
`const routeButtonLabels = {
  en: {
    airport: "Route from Chios Airport / Town",
    mesta: "Route from Mesta Port",
  },
  el: {
    airport: "Διαδρομή από αεροδρόμιο / πόλη Χίου",
    mesta: "Διαδρομή από λιμάνι Μεστών",
  },
  fr: {
    airport: "Itinéraire depuis l’aéroport / ville de Chios",
    mesta: "Itinéraire depuis le port de Mesta",
  },
  de: {
    airport: "Route vom Flughafen / Chios-Stadt",
    mesta: "Route vom Hafen Mesta",
  },
  it: {
    airport: "Percorso dall’aeroporto / città di Chios",
    mesta: "Percorso dal porto di Mesta",
  },
  es: {
    airport: "Ruta desde el aeropuerto / ciudad de Chios",
    mesta: "Ruta desde el puerto de Mesta",
  },
  tr: {
    airport: "Chios Havalimanı / merkezden rota",
    mesta: "Mesta Limanı’ndan rota",
  },
} as const;

const languageLinks = [`
  );
}

/* 6. Add labels variable inside component */
if (!component.includes("const routeLabels = routeButtonLabels")) {
  component = component.replace(
`  const stayText = useMemo(() => {`,
`  const routeLabels = routeButtonLabels[data.locale] ?? routeButtonLabels.en;

  const stayText = useMemo(() => {`
  );
}

/* 7. Replace map route button with two explicit route buttons */
component = component.replace(
`              <a
                href={preArrivalDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-teal-800 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-teal-900"
              >
                {data.directions.openRoute}
              </a>`,
`              <a
                href={preArrivalDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-teal-800 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-teal-900"
              >
                {routeLabels.airport}
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

fs.writeFileSync(componentFile, component, "utf8");

console.log("Added Mesta Port route and detailed directions.");

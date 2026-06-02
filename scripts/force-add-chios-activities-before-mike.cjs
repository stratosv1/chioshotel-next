const fs = require("fs");

const file = "lib/url-map.ts";
let text = fs.readFileSync(file, "utf8");

if (text.includes('itemId: "chios-activities-hub"')) {
  console.log("SKIPPED: Chios Activities routes already exist.");
  process.exit(0);
}

const routes = [
  ["/el/drastiriotites-sti-xio/", "el", "chios-activities-hub"],
  ["/fr/activites-a-chios/", "fr", "chios-activities-hub"],
  ["/de/aktivitaeten-auf-chios/", "de", "chios-activities-hub"],
  ["/it/attivita-a-chios/", "it", "chios-activities-hub"],
  ["/es/actividades-en-quios/", "es", "chios-activities-hub"],
  ["/tr/sakiz-adasi-aktiviteleri/", "tr", "chios-activities-hub"],

  ["/el/festival-mostra-thymiana-xios/", "el", "chios-activity-mostra"],
  ["/fr/festival-mostra-chios/", "fr", "chios-activity-mostra"],
  ["/de/mostra-festival-chios/", "de", "chios-activity-mostra"],
  ["/it/festival-mostra-chios/", "it", "chios-activity-mostra"],
  ["/es/festival-mostra-quios/", "es", "chios-activity-mostra"],
  ["/tr/sakiz-adasi-mostra-festivali/", "tr", "chios-activity-mostra"],

  ["/el/mathimata-ellinikon-sti-xio/", "el", "chios-activity-greek-courses"],
  ["/fr/cours-de-grec-a-chios/", "fr", "chios-activity-greek-courses"],
  ["/de/griechischkurse-auf-chios/", "de", "chios-activity-greek-courses"],
  ["/it/corsi-di-greco-a-chios/", "it", "chios-activity-greek-courses"],
  ["/es/cursos-de-griego-en-quios/", "es", "chios-activity-greek-courses"],
  ["/tr/sakiz-adasinda-yunanca-kurslari/", "tr", "chios-activity-greek-courses"],

  ["/el/pezoporia-sti-xio/", "el", "chios-activity-hiking"],
  ["/fr/randonnee-a-chios/", "fr", "chios-activity-hiking"],
  ["/de/wandern-auf-chios/", "de", "chios-activity-hiking"],
  ["/it/trekking-a-chios/", "it", "chios-activity-hiking"],
  ["/es/senderismo-en-quios/", "es", "chios-activity-hiking"],
  ["/tr/sakiz-adasinda-yuruyus/", "tr", "chios-activity-hiking"],

  ["/el/iamatika-loutra-xiou/", "el", "chios-activity-thermal-baths"],
  ["/fr/sources-thermales-de-chios/", "fr", "chios-activity-thermal-baths"],
  ["/de/thermalquellen-auf-chios/", "de", "chios-activity-thermal-baths"],
  ["/it/terme-di-chios/", "it", "chios-activity-thermal-baths"],
  ["/es/banos-termales-de-quios/", "es", "chios-activity-thermal-baths"],
  ["/tr/sakiz-adasi-termal-kaplicalari/", "tr", "chios-activity-thermal-baths"],

  ["/el/rouketopolemos-xios/", "el", "chios-activity-rocket-war"],
  ["/fr/guerre-des-fusees-chios/", "fr", "chios-activity-rocket-war"],
  ["/de/raketenkrieg-chios/", "de", "chios-activity-rocket-war"],
  ["/it/guerra-dei-razzi-chios/", "it", "chios-activity-rocket-war"],
  ["/es/guerra-de-cohetes-quios/", "es", "chios-activity-rocket-war"],
  ["/tr/sakiz-adasi-roket-savasi/", "tr", "chios-activity-rocket-war"],

  ["/el/orchidees-xiou/", "el", "chios-activity-orchids"],
  ["/fr/orchidees-de-chios/", "fr", "chios-activity-orchids"],
  ["/de/orchideen-auf-chios/", "de", "chios-activity-orchids"],
  ["/it/orchidee-di-chios/", "it", "chios-activity-orchids"],
  ["/es/orquideas-de-quios/", "es", "chios-activity-orchids"],
  ["/tr/sakiz-adasi-orkideleri/", "tr", "chios-activity-orchids"],
];

const block = `
  // Chios Activities localized routes
${routes.map(([path, language, itemId]) => `  {
    path: "${path}",
    language: "${language}",
    contentType: "landing-page",
    category: "landing",
    itemId: "${itemId}",
    template: "LandingPage",
    action: "KEEP",
    priority: "High",
  },`).join("\n")}

`;

const marker = `  {
    path: "/mike-2/",`;

if (!text.includes(marker)) {
  console.error("ERROR: Could not find /mike-2/ insertion marker.");
  process.exit(1);
}

text = text.replace(marker, block + marker);

fs.writeFileSync(file, text, "utf8");

console.log("SUCCESS: Added Chios Activities localized routes before /mike-2/.");

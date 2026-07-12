const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const scanRoots = ["content", "app"];
const MAX_TITLE_LENGTH = 60;
const BRAND_THRESHOLD = 38;
const BRAND_SUFFIX = " | Voulamandis House";

const preferredTitles = new Map([
  ["Ξενοδοχείο στη Χίο", "Δωμάτια & Διαμερίσματα στη Χίο | Κάμπος"],
  ["Γεύσεις της Χίου", "Γεύσεις της Χίου | Τοπικά προϊόντα & φαγητό"],
  ["Εξερεύνηση Χίου", "Εξερεύνηση Χίου | Αξιοθέατα & εμπειρίες"],
  ["Χωριά της Χίου", "Χωριά της Χίου | Οδηγός για όλο το νησί"],
  ["Μουσεία Χίου", "Μουσεία Χίου | Ιστορία, πολιτισμός & μαστίχα"],
  ["Άμεση Κράτηση στη Χίο", "Δωμάτια στη Χίο | Βρες το κατάλληλο για σένα"],
  ["Παραλίες Χίου", "Παραλίες Χίου | Οδηγός για τις καλύτερες ακτές"],
  ["Quiz Διακοπών στη Χίο 2026", "Quiz διακοπών στη Χίο | Βρες τι σου ταιριάζει"],
  ["Ορχιδέες της Χίου", "Ορχιδέες της Χίου | Είδη & περίοδος ανθοφορίας"],
  ["Δραστηριότητες στη Χίο", "Δραστηριότητες στη Χίο | Τι να κάνεις στο νησί"],
  ["Ρουκετοπόλεμος Χίου", "Ρουκετοπόλεμος Χίου | Πάσχα στο Βροντάδο"],
  ["Μόστρα Θυμιανών στη Χίο", "Μόστρα Θυμιανών | Αποκριάτικο έθιμο της Χίου"],
  ["Πεζοπορία στη Χίο", "Πεζοπορία στη Χίο | Διαδρομές & μονοπάτια"],
  ["Παραλίες με άμμο στη Χίο", "Παραλίες με άμμο στη Χίο | Πλήρης οδηγός"],
  ["Απάνεμες παραλίες Χίου", "Απάνεμες παραλίες Χίου | Ήρεμα νερά & επιλογές"],
  ["Ήσυχες παραλίες Χίου", "Ήσυχες παραλίες Χίου | Χαλάρωση χωρίς κόσμο"],
  ["Οργανωμένες παραλίες Χίου", "Οργανωμένες παραλίες Χίου | Παροχές & επιλογές"],
  ["Παραθαλάσσια χωριά Χίου", "Παραθαλάσσια χωριά Χίου | Οδηγός & διαδρομές"],
  ["Μεσαιωνικά χωριά Χίου", "Μεσαιωνικά χωριά Χίου | Κάστρα & ιστορία"],
  ["Μαστιχοχώρια Χίου", "Μαστιχοχώρια Χίου | Μαστίχα & διαδρομές"],
  ["Παραλία Λιθί Χίος", "Παραλία Λιθί Χίου | Πρόσβαση & παροχές"],
  ["Hôtel à Chios", "Chambres et appartements à Chios | Kambos"],
  ["Quiz vacances à Chios 2026", "Quiz vacances à Chios | Trouvez votre séjour idéal"],
  ["Explorer Chios", "Explorer Chios | Sites, villages et expériences"],
  ["Vacances en Famille à Chios", "Vacances en famille à Chios | Guide pratique"],
  ["Réservation directe à Chios", "Chambres à Chios | Réservation directe"],
  ["Musées de Chios", "Musées de Chios | Histoire, culture et mastic"],
  ["Plages de Chios", "Plages de Chios | Guide des plus belles plages"],
  ["Orchidées de Chios", "Orchidées de Chios | Espèces et floraison"],
  ["Offres de séjour à Chios 2026", "Offres de séjour à Chios | Tarifs directs"],
  ["Saveurs de Chios", "Saveurs de Chios | Cuisine et produits locaux"],
  ["Villages de Chios", "Villages de Chios | Guide des plus beaux villages"],
  ["Guerre des fusées de Chios", "Guerre des fusées à Chios | Pâques à Vrontados"],
  ["Festival Mostra à Chios", "Festival Mostra à Chios | Tradition du carnaval"],
  ["Randonnée à Chios", "Randonnée à Chios | Sentiers et itinéraires"],
  ["Villages du mastic à Chios", "Villages du mastic à Chios | Guide et itinéraires"],
  ["Villages médiévaux de Chios", "Villages médiévaux de Chios | Histoire et châteaux"],
  ["Plages organisées à Chios", "Plages organisées à Chios | Services et accès"],
  ["Plages abritées à Chios", "Plages abritées à Chios | Eaux calmes"],
  ["Plages de sable à Chios", "Plages de sable à Chios | Guide complet"],
  ["Olympoi Chios", "Olympoi à Chios | Village médiéval du mastic"],
  ["Lagada Chios", "Lagada à Chios | Village côtier et tavernes"],
  ["Plage Mavra Volia Emporios Chios | Paysage volcanique unique", "Plage Mavra Volia à Chios | Paysage volcanique"],
]);

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(fullPath);
    return entry.isFile() && /\.(?:ts|tsx)$/.test(fullPath) ? [fullPath] : [];
  });
}

function clipAtWord(title, maxLength) {
  if (title.length <= maxLength) return title;
  const clipped = title.slice(0, maxLength + 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return (lastSpace >= 24 ? clipped.slice(0, lastSpace) : title.slice(0, maxLength)).trim();
}

function normalizeTitle(title) {
  const preferred = preferredTitles.get(title.trim());
  if (preferred) return preferred;

  let clean = title.replace(/\s*\|\s*Voulamandis House\s*$/u, "").trim();

  if (clean.length > MAX_TITLE_LENGTH && clean.includes(" | ")) {
    clean = clean.split(/\s+\|\s+/u)[0].trim();
  }

  clean = clipAtWord(clean, MAX_TITLE_LENGTH);

  if (clean.length <= BRAND_THRESHOLD) {
    const branded = `${clean}${BRAND_SUFFIX}`;
    if (branded.length <= MAX_TITLE_LENGTH) return branded;
  }

  return clean;
}

let changedFiles = 0;
let changedTitles = 0;

for (const scanRoot of scanRoots) {
  for (const filePath of listFiles(path.join(root, scanRoot))) {
    const original = fs.readFileSync(filePath, "utf8");

    const next = original.replace(/seo\s*:\s*\{([\s\S]*?)\n\s*\}/g, (seoBlock) =>
      seoBlock.replace(/title\s*:\s*(["'`])([^"'`\r\n]+)\1/g, (match, quote, title) => {
        const normalized = normalizeTitle(title);
        if (normalized === title) return match;
        changedTitles += 1;
        return `title: ${quote}${normalized}${quote}`;
      })
    );

    if (next !== original) {
      fs.writeFileSync(filePath, next, "utf8");
      changedFiles += 1;
      console.log(`[page-title] updated ${path.relative(root, filePath).replace(/\\/g, "/")}`);
    }
  }
}

console.log(`[page-title] ${changedTitles} final SEO titles normalized in ${changedFiles} files`);

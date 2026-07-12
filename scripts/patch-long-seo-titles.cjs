const fs = require("fs");

const file = "lib/seo.ts";
let source = fs.readFileSync(file, "utf8");

const marker = "const preferredMetadataTitles = new Map<string, string>([";
if (!source.includes(marker)) {
  throw new Error("preferredMetadataTitles marker not found");
}

const entries = [
  ["Taste Lover Chios | Food Experiences from Voulamandis House", "Taste Lover Chios | Local Food Experiences"],
  ["Emporios Mavra Volia Beach Chios | Ultimate Volcanic Landscape", "Emporios Mavra Volia Beach | Volcanic Coast"],
  ["Παραλία Αγία Δύναμη Χίος | Σμαραγδένια νερά & κρυφός όρμος", "Παραλία Αγία Δύναμη Χίου | Πρόσβαση & συμβουλές"],
  ["Εξερεύνηση Χίου | Πολιτιστικές διαδρομές από το Voulamandis House", "Εξερεύνηση Χίου | Πολιτιστικές διαδρομές"],
  ["Komi Beach Chios | Endless Golden Sand & Organized Beach Life", "Komi Beach Chios | Golden Sand & Facilities"],
  ["Sabores de Quíos | Experiencias gastronómicas desde Voulamandis House", "Sabores de Quíos | Cocina y productos locales"],
  ["Saveurs de Chios | Expériences gourmandes depuis Voulamandis House", "Saveurs de Chios | Cuisine et produits locaux"],
  ["Sapori di Chios | Esperienze gastronomiche da Voulamandis House", "Sapori di Chios | Cucina e prodotti locali"],
  ["Chios für Genießer | Kulinarische Erlebnisse ab Voulamandis House", "Chios für Genießer | Küche und lokale Produkte"],
  ["Sakız Adası Lezzetleri | Voulamandis House ile yemek deneyimleri", "Sakız Adası lezzetleri | Yerel yemekler"],
  ["Γεύσεις της Χίου | Γαστρονομική εμπειρία από το Voulamandis House", "Γεύσεις της Χίου | Τοπικά προϊόντα & φαγητό"],
  ["Koraes Library Chios | Rare Books, Manuscripts & Greek Culture", "Koraes Library Chios | History & Visitor Guide"],
  ["Mavra Volia Emporios Strand Chios | Einzigartige Vulkanlandschaft", "Mavra Volia Strand Chios | Vulkanlandschaft"],
  ["Mavra Volia Emporios Plajı Sakız Adası | Eşsiz volkanik manzara", "Mavra Volia Plajı | Volkanik manzara"],
  ["Plage Mavra Volia Emporios Chios | Paysage volcanique unique", "Plage Mavra Volia Chios | Paysage volcanique"],
  ["Spiaggia Mavra Volia Emporios Chios | Paesaggio vulcanico unico", "Spiaggia Mavra Volia | Paesaggio vulcanico"],
  ["Agia Dynami Strand Chios | Smaragdgrünes Wasser & versteckte Bucht", "Agia Dynami Strand Chios | Anfahrt & Tipps"],
  ["Olympoi Chios | Medieval Mastic Village & Walking Route to Mesta", "Olympoi Chios | Medieval Mastic Village"],
  ["Archaeological Museum of Chios | Ancient History & Island Heritage", "Archaeological Museum of Chios | Visitor Guide"],
  ["Explorer Chios | Excursions culturelles depuis Voulamandis House", "Explorer Chios | Excursions culturelles"],
  ["Chios Maritime Museum | Seafaring, Shipbuilding & Island History", "Chios Maritime Museum | History & Visitor Guide"],
  ["Kallimasia Folklore Museum Chios | Village Life & Local Traditions", "Kallimasia Folklore Museum | Local Traditions"],
  ["Komi Strand Chios | Endloser goldener Sand und organisiertes Strandleben", "Komi Strand Chios | Sand und Ausstattung"],
  ["Agia Fotia Strand Chios | Kosmopolitischer organisierter Strand", "Agia Fotia Strand Chios | Anfahrt & Tipps"],
  ["Olympoi Chios | Villaggio medievale del mastice e percorso verso Mesta", "Olympoi Chios | Villaggio medievale"],
  ["Olympoi Chios | Village médiéval du mastic et route vers Mesta", "Olympoi Chios | Village médiéval du mastic"],
  ["Lagada Chios | Village de bord de mer, port et tavernes de poisson", "Lagada Chios | Port et tavernes de poisson"],
  ["Λαγκάδα Χίος | Παραθαλάσσιο χωριό, λιμάνι και ψαροταβέρνες", "Λαγκάδα Χίου | Λιμάνι & ψαροταβέρνες"],
  ["Ολύμποι Χίος | Μεσαιωνικό Μαστιχοχώρι & διαδρομή προς Μεστά", "Ολύμποι Χίου | Μεσαιωνικό Μαστιχοχώρι"],
  ["Komi Plajı Sakız Adası | Sonsuz altın kum ve organize plaj hayatı", "Komi Plajı Sakız Adası | Kum ve olanaklar"],
  ["Spiaggia di Komi Chios | Sabbia dorata e vita da spiaggia organizzata", "Spiaggia di Komi Chios | Sabbia e servizi"],
  ["Παραλία Αγία Φωτιά Χίος | Κοσμοπολίτικη οργανωμένη παραλία", "Παραλία Αγία Φωτιά Χίου | Πρόσβαση & παροχές"],
  ["Παραλία Κώμη Χίος | Ατελείωτη χρυσή άμμος & οργανωμένη ζωή", "Παραλία Κώμη Χίου | Χρυσή άμμος & παροχές"],
  ["Παραλία Λιθί Χίος | Αμμώδης οικογενειακή παραλία & ψαροταβέρνες", "Παραλία Λιθί Χίου | Οικογενειακή παραλία"]
];

const missingLines = entries
  .filter(([from]) => !source.includes(`  [${JSON.stringify(from)},`))
  .map(([from, to]) => `  [${JSON.stringify(from)}, ${JSON.stringify(to)}],`)
  .join("\n");

if (missingLines) {
  source = source.replace(marker, `${marker}\n${missingLines}`);
  fs.writeFileSync(file, source, "utf8");
  console.log(`Inserted ${missingLines.split("\n").length} long-title SEO overrides.`);
} else {
  console.log("Long-title SEO overrides already present.");
}

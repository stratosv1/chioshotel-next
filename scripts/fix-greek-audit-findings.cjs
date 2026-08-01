const fs = require("node:fs");
const path = require("node:path");

function patchFile(relativePath, replacements) {
  const filePath = path.join(process.cwd(), relativePath);
  let source = fs.readFileSync(filePath, "utf8");
  let changed = false;

  for (const [before, after] of replacements) {
    if (source.includes(before)) {
      source = source.replaceAll(before, after);
      changed = true;
      continue;
    }
    if (!source.includes(after)) {
      throw new Error(`${relativePath}: expected source text not found: ${before}`);
    }
  }

  if (changed) fs.writeFileSync(filePath, source, "utf8");
  console.log(`${changed ? "Fixed" : "Verified"} Greek copy in ${relativePath}`);
}

patchFile("content/home.ts", [
  ["🌴 Διακοπές στη Χίο\",\n        \"🍊 Κάμπος Χίου\",\n        \"🛏️ Άνετα δωμάτια\",\n        \"💎 Value for money", "🌴 Διακοπές στη Χίο\",\n        \"🍊 Κάμπος Χίου\",\n        \"🛏️ Άνετα δωμάτια\",\n        \"💎 Καλή σχέση ποιότητας–τιμής"],
  ["title: \"🧭 Room Wizard\"", "title: \"🧭 Βρες το δωμάτιό σου\""],
  ["label: \"Room Wizard\"", "label: \"Βρες το δωμάτιό σου\""],
  ["liveLabel: \"LIVE Κωδικός έκπτωσης\"", "liveLabel: \"Ζωντανός κωδικός έκπτωσης\""],
  ["meta: [\"👥 2 άτομα\", \"Economy\", \"🍊 Κάμπος\"]", "meta: [\"👥 2 άτομα\", \"Οικονομικό\", \"🍊 Κάμπος\"]"],
  ["amenities: [\"❄️ A/C\", \"📶 Wi-Fi\", \"☕ Καφές\", \"🧊 Ψυγείο\"]", "amenities: [\"❄️ Κλιματισμός\", \"📶 Wi-Fi\", \"☕ Καφές\", \"🧊 Ψυγείο\"]"],
  ["bedBadge: \"🛏️ Διπλό + extra\"", "bedBadge: \"🛏️ Διπλό + επιπλέον κλίνη\""],
  ["bedBadge: \"🛏️ Family beds\"", "bedBadge: \"🛏️ Οικογενειακές κλίνες\""],
  ["meta: [\"👤 ×4\", \"Χώρος\", \"🏡 Apt\"]", "meta: [\"👤 ×4\", \"Χώρος\", \"🏡 Διαμέρισμα\"]"],
]);

patchFile("components/seo/TopicBadges.tsx", [
  ["label: \"8 χλμ. από την πόλη της Χίου\"", "label: \"6 χλμ. από την πόλη της Χίου\""],
]);

patchFile("components/chios/ChiosHolidayQuizPage.tsx", [
  ["\"title\": \"Είσαι Chios Insider; 🍋\"", "\"title\": \"Πόσο καλά γνωρίζεις τη Χίο; 🍋\""],
  ["\"insiderTip\": \"Συμβουλή Insider 💡\"", "\"insiderTip\": \"Τοπική συμβουλή 💡\""],
  ["\"resultTitle\": \"Είσαι Chios Insider! 🏆\"", "\"resultTitle\": \"Γνωρίζεις τη Χίο! 🏆\""],
  ["\"miniComplete\": \"Το mini quest ολοκληρώθηκε! 🌟\"", "\"miniComplete\": \"Η σύντομη δοκιμασία ολοκληρώθηκε! 🌟\""],
]);

patchFile("content/organized-beaches.ts", [
  ["πιο εύκολη πρόσβαση, beach service, καφέ, ταβέρνες", "πιο εύκολη πρόσβαση, ξαπλώστρες, ομπρέλες, καφέ και ταβέρνες"],
  ["Θέλετε την πιο εύκολη beach day;", "Θέλετε μια εύκολη ημέρα στην παραλία;"],
]);

patchFile("content/beach-lovers.ts", [
  ["Η ιδανική beach day στη Χίο ξεκινά από το Voulamandis House", "Η ιδανική ημέρα στην παραλία στη Χίο ξεκινά από το Voulamandis House"],
  ["Η τέλεια beach day με το Voulamandis House", "Η τέλεια ημέρα στην παραλία με το Voulamandis House"],
  ["Η σημερινή μέρα έχει τίτλο: Νότια Χίος – Beach Day.", "Η σημερινή μέρα έχει τίτλο: Νότια Χίος – ημέρα στην παραλία."],
  ["Επειδή είσαι beach lover, η μέρα συνεχίζεται", "Επειδή αγαπάς τις παραλίες, η μέρα συνεχίζεται"],
]);

patchFile("content/beach-details.ts", [
  ["για μια ολοκληρωμένη beach day στη νότια Χίο", "για μια ολοκληρωμένη ημέρα στην παραλία στη νότια Χίο"],
]);

patchFile("content/romantic-stay.ts", [
  ["αντί για ένα πολυσύχναστο resort", "αντί για ένα πολυσύχναστο θέρετρο"],
  ["ανάλογα με το budget, την πρόσβαση", "ανάλογα με τον προϋπολογισμό, την πρόσβαση"],
  ["ξεκινήστε από τα Economy Double", "ξεκινήστε από τα οικονομικά δίκλινα δωμάτια"],
]);

patchFile("content/rates.ts", [
  ["κερδίστε direct booking πλεονεκτήματα", "επωφεληθείτε από τα πλεονεκτήματα της απευθείας κράτησης"],
  ["ασφαλή online κράτηση στη Χίο", "ασφαλή ηλεκτρονική κράτηση στη Χίο"],
  ["επιπλέον όφελος στην online κράτησή σας", "επιπλέον όφελος στην ηλεκτρονική κράτησή σας"],
  ["για απευθείας online κρατήσεις", "για απευθείας ηλεκτρονικές κρατήσεις"],
]);

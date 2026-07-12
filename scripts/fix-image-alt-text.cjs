const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const scanRoots = ["components", "app"];

const knownImageAlts = new Map([
  ["/favicon/vh-heart-128.webp", "Voulamandis House logo"],
  ["/images/villages/29651245457_aa8f702ef7_b-768x432.webp", "Traditional village architecture in Chios"],
  ["/images/villages/lagada_3.webp", "Lagada seaside village and harbour in Chios"],
  ["/images/museums/mousio.mastic.webp", "Chios Mastic Museum"],
  ["/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp", "Experiences and activities in Chios"],
  ["/images/villages/Volissos-Chios.webp", "Volissos village in northwest Chios"],
  ["/images/villages/unnamed-e1702830815478.webp", "Armolia village in Chios"],
  ["/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp", "Mesta medieval village in Chios"],
  ["/images/villages/olympoi-1-768x432.webp", "Olympoi village in Chios"],
  ["/images/museums/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp", "Byzantine Museum of Chios"],
  ["/images/museums/caption.webp", "Archaeological Museum of Chios"],
  ["/images/museums/vivlitothiki-korai-1.webp", "Korais Library in Chios"],
  ["/images/museums/IMG_1203-Medium-min-768x487.webp", "Maritime Museum of Chios"],
  ["/images/museums/2-1-768x512.webp", "Traditional museum exhibit in Chios"],
  ["/images/beaches/voulamandis-house-courtyard-chios.webp", "Voulamandis House courtyard in Kambos, Chios"],
  ["/images/beaches/agia-dynami-beach-chios.webp", "Agia Dynami beach in Chios"],
  ["/images/beaches/lithi-beach-chios.webp", "Lithi beach in Chios"],
  ["/images/beaches/salagona-beach-chios.webp", "Salagona beach in Chios"],
  ["/images/beaches/agia-fotia-beach-chios.webp", "Agia Fotia beach in Chios"],
  ["/images/beaches/komi-sandy-beach-chios.webp", "Komi sandy beach in Chios"],
  ["/images/site/Screenshot_2026-04-25-14-11-19-166_com.instagram.android-edit-1.webp", "Voulamandis House in Kambos, Chios"],
  ["/images/rooms/chios-apartments-voulamandis.webp", "Apartments at Voulamandis House in Chios"],
  ["/images/beaches/vroulidia-2-1.jpg", "Vroulidia beach in Chios"],
  ["/images/beaches/kato-fana-beach-chios.webp", "Kato Fana beach in Chios"],
  ["/images/beaches/mavra-volia-beach-chios.webp", "Mavra Volia beach in Chios"],
  ["/images/beaches/nagos-beach-chios.webp", "Nagos beach in Chios"],
  ["/images/beaches/avlonia-1024x768.webp", "Avlonia beach in Chios"],
  ["/images/beaches/lefkathia-2.jpg", "Lefkathia beach in Chios"],
  ["/images/rooms/double-triple-room.jpg", "Double or triple room at Voulamandis House"],
  ["/images/rooms/received_1753964631359257.webp", "Guest room at Voulamandis House"],
  ["/images/family/ChatGPT-Image-Feb-13-2026-08_32_22-PM.webp", "Family holidays in Chios"],
  ["/images/chios-guide/anavatos-1.jpg", "Anavatos medieval village in Chios"],
  ["/images/taste/d8765ffe-dbf2-496c-9190-f1fb82e6318a.webp", "Traditional food and flavours of Chios"],
]);

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(fullPath);
    return entry.isFile() && fullPath.endsWith(".tsx") ? [fullPath] : [];
  });
}

function getAltReplacement(tag) {
  if (/aria-hidden\s*=\s*["{]true/.test(tag)) return null;

  if (/src\s*=\s*\{data\.hero\.image\}/.test(tag)) return "alt={data.hero.title}";
  if (/src\s*=\s*\{beach\.image\}/.test(tag)) return "alt={beach.imageAlt || beach.title}";
  if (/src\s*=\s*\{village\.image\}/.test(tag)) return "alt={village.imageAlt || village.title}";
  if (/src\s*=\s*\{museum\.image\}/.test(tag)) return "alt={museum.imageAlt || museum.title}";

  const stringSrc = tag.match(/src\s*=\s*["']([^"']+)["']/)?.[1];
  if (stringSrc && knownImageAlts.has(stringSrc)) {
    const alt = knownImageAlts.get(stringSrc).replace(/"/g, "&quot;");
    return `alt="${alt}"`;
  }

  return null;
}

let changedFiles = 0;
let changedImages = 0;
const unresolved = [];

for (const scanRoot of scanRoots) {
  for (const filePath of listFiles(path.join(root, scanRoot))) {
    const relativePath = path.relative(root, filePath).replace(/\\/g, "/");
    const original = fs.readFileSync(filePath, "utf8");

    const next = original.replace(/<(?:img|Image)\b[^>]*\balt=""[^>]*>/gs, (tag) => {
      const replacement = getAltReplacement(tag);
      if (!replacement) {
        unresolved.push(relativePath);
        return tag;
      }
      changedImages += 1;
      return tag.replace(/alt=""/, replacement);
    });

    if (next !== original) {
      fs.writeFileSync(filePath, next, "utf8");
      changedFiles += 1;
      console.log(`[alt-text] updated ${relativePath}`);
    }
  }
}

console.log(`[alt-text] ${changedImages} image alt attributes updated in ${changedFiles} files`);
if (unresolved.length) {
  console.log(`[alt-text] ${unresolved.length} decorative or context-specific empty alt attributes left unchanged`);
}

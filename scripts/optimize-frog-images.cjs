const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const targets = [
  "public/images/site/Screenshot_2026-04-25-14-11-19-166_com.instagram.android-edit-1.webp",
  "public/images/taste/d8765ffe-dbf2-496c-9190-f1fb82e6318a.webp",
  "public/images/taste/asteri.jpg",
  "public/images/beaches/voulamandis-house-courtyard-chios.webp",
  "public/images/family/paintball-chios.jpg",
  "public/images/family/The-Pastards-Handmade-pasta-with-cheese-restaurant-chios-3.jpg",
  "public/images/family/ChatGPT-Image-Feb-13-2026-08_32_22-PM.webp",
  "public/images/family/paidiki_xara_daskalopetras_210222_2.webp",
  "public/images/beaches/avlonia-1024x768.webp",
  "public/images/activities/ChatGPT-Image-Feb-13-2026-06_09_19-PM.webp",
  "public/images/chios-guide/anavatos-1.jpg",
  "public/images/kampos/antouaniko-kampos-chios.webp",
  "public/images/kampos/kambos-chios.jpg",
];

async function optimize(file) {
  if (!fs.existsSync(file)) {
    console.warn(`Image not found, skipping: ${file}`);
    return;
  }

  const originalSize = fs.statSync(file).size;
  const ext = path.extname(file).toLowerCase();
  const temp = `${file}.optimized`;
  const image = sharp(file).rotate().resize({
    width: 1920,
    height: 1920,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (ext === ".webp") {
    await image.webp({ quality: 72, effort: 5 }).toFile(temp);
  } else if (ext === ".jpg" || ext === ".jpeg") {
    await image.jpeg({ quality: 72, progressive: true, mozjpeg: true }).toFile(temp);
  } else {
    console.warn(`Unsupported image format, skipping: ${file}`);
    return;
  }

  const optimizedSize = fs.statSync(temp).size;
  if (optimizedSize < originalSize) {
    fs.renameSync(temp, file);
    console.log(`${file}: ${originalSize} -> ${optimizedSize} bytes`);
  } else {
    fs.unlinkSync(temp);
    console.log(`${file}: already smaller than optimized output`);
  }
}

(async () => {
  for (const file of targets) {
    await optimize(file);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

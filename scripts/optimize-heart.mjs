import sharp from "sharp";

await sharp("public/favicon/vh-heart-192x192.png")
  .resize({
    width: 128,
    height: 128,
    fit: "contain",
    withoutEnlargement: true,
  })
  .webp({ quality: 78 })
  .toFile("public/favicon/vh-heart-128.webp");

console.log("Created public/favicon/vh-heart-128.webp");

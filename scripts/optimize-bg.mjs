import sharp from "sharp";

const jobs = [
  {
    input: "public/images/villages/lagada_3.webp",
    avif: "public/images/villages/lagada_3-v2.avif",
    webp: "public/images/villages/lagada_3-v2.webp",
  },
  {
    input: "public/images/rooms/double-triple-room.jpg",
    avif: "public/images/rooms/double-triple-room-v2.avif",
    webp: "public/images/rooms/double-triple-room-v2.webp",
  },
  {
    input: "public/images/rooms/DSC07867-1.webp",
    avif: "public/images/rooms/DSC07867-1-v2.avif",
    webp: "public/images/rooms/DSC07867-1-v2.webp",
  },
];

for (const job of jobs) {
  await sharp(job.input).avif({ quality: 55 }).toFile(job.avif);
  await sharp(job.input).webp({ quality: 72 }).toFile(job.webp);
  console.log(`Created ${job.avif}`);
  console.log(`Created ${job.webp}`);
}

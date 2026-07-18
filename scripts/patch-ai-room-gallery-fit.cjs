const fs = require("node:fs");
const path = require("node:path");

const files = [
  path.join(process.cwd(), "components/ai/GuestAssistantMultilingual.tsx"),
  path.join(process.cwd(), "components/ai/AIRoomFinder.tsx"),
];

let updated = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let source = fs.readFileSync(file, "utf8");
  const before = source;
  source = source.replace(
    /<RoomCarousel images=\{gallery\} roomName=\{([^}]+)\}( compact)?( showThumbnails=\{false\})? \/>/g,
    (_match, roomName, compact = "", noThumbs = "") => `<RoomCarousel images={gallery} roomName={${roomName}}${compact}${noThumbs} imageFit="contain" />`,
  );
  if (source !== before) {
    fs.writeFileSync(file, source);
    updated += 1;
  }
}

if (!updated) {
  throw new Error("AI room gallery call not found");
}

console.log(`Applied uncropped AI room gallery images in ${updated} component(s)`);

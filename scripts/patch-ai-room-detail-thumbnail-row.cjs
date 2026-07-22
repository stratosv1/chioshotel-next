const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AiRoomDetailsEnhancer.tsx");
const source = fs.readFileSync(file, "utf8");

const required = [
  "viewAmenities: string",
  "const [amenitiesOpen,setAmenitiesOpen]=useState(false)",
  "onClick={()=>setAmenitiesOpen(true)}",
  "onClick={()=>setAmenitiesOpen(false)}",
  'role="dialog" aria-modal="true" aria-label={t.amenities}',
  'data-ai-detail-hero="blurred-contain"',
  'data-ai-detail-hero-background="true"',
  "object-cover opacity-70 blur-xl",
  'data-ai-detail-hero-image="true"',
  "h-full w-full object-contain",
  'data-ai-detail-saving="prominent"',
  "✓ {t.saving}: {room.saving}",
  'data-ai-detail-thumbnails="spread"',
  'gridTemplateColumns:`repeat(${room.images.length}, minmax(0, 1fr))`',
  "featureRooms.flatMap",
];

for (const token of required) {
  if (!source.includes(token)) throw new Error(`AI room detail popup requirement missing: ${token}`);
}

if (source.includes('data-ai-detail-thumbnails="white"')) {
  throw new Error("Room detail thumbnails still use the old compact row");
}
if (source.includes('className="block max-h-full max-w-full object-contain"')) {
  throw new Error("Room detail hero still uses the old black-bar image layout");
}
if (source.includes("grid grid-cols-4 gap-1.5")) {
  throw new Error("Amenities are still rendered inline in the room detail card");
}
if (source.includes("expanded?t.less:t.more")) {
  throw new Error("Legacy amenities expand/collapse control is still present");
}

console.log("AI room detail validated: full photo over blurred background, prominent savings, spread thumbnails, amenities popup");

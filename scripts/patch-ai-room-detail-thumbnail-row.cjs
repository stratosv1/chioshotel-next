const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AiRoomDetailsEnhancer.tsx");
const source = fs.readFileSync(file, "utf8");

const required = [
  'viewAmenities: string',
  'const [amenitiesOpen,setAmenitiesOpen]=useState(false)',
  'onClick={()=>setAmenitiesOpen(true)}',
  'onClick={()=>setAmenitiesOpen(false)}',
  'role="dialog" aria-modal="true" aria-label={t.amenities}',
  'block max-h-full max-w-full object-contain',
  '{t.saving}: {room.saving}',
  'data-ai-detail-thumbnails="white"',
  'featureRooms.flatMap',
];

for (const token of required) {
  if (!source.includes(token)) throw new Error(`AI room detail popup requirement missing: ${token}`);
}

if (source.includes('grid grid-cols-4 gap-1.5')) {
  throw new Error("Amenities are still rendered inline in the room detail card");
}
if (source.includes('expanded?t.less:t.more')) {
  throw new Error("Legacy amenities expand/collapse control is still present");
}

console.log("AI room detail validated: full hero, compact card, amenities popup, savings beside title");

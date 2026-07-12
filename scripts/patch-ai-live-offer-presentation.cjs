const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'app/api/ai-assistant/smart/route.ts');
let source = fs.readFileSync(file, 'utf8');

if (!source.includes('presentLiveOffers')) {
  source = source.replace(
    'import { recommendRooms } from "@/lib/ai-assistant/room-catalog";',
    'import { recommendRooms } from "@/lib/ai-assistant/room-catalog";\nimport { presentLiveOffers } from "@/lib/ai-assistant/live-offer-presentation";'
  );
}

source = source.replace(
  'const answer = await composeAvailabilityAnswer({ language: command.language, message: latest, legacyPayload });\n      return NextResponse.json({\n        ...legacyPayload,',
  'const localizedOffers = presentLiveOffers(Array.isArray(legacyPayload.offers) ? legacyPayload.offers : [], command.language);\n      const localizedPayload = { ...legacyPayload, offers: localizedOffers, knowledge: [] };\n      const answer = await composeAvailabilityAnswer({ language: command.language, message: latest, legacyPayload: localizedPayload });\n      return NextResponse.json({\n        ...localizedPayload,'
);

fs.writeFileSync(file, source);
console.log('AI live offer presentation patched');

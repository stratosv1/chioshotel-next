const fs = require('node:fs');

const file = 'components/ai/AiRoomChatPreview.tsx';
let source = fs.readFileSync(file, 'utf8');
const before = `function categoryWithFloor(offer: Offer) {
  const room = offerRoomNumber(offer);
  if (room >= 8 && room <= 10) return offer.category;
  const floor = offer.floor.split(" · ")[0]?.trim();
  if (!floor || offer.category.toLocaleLowerCase().includes(floor.toLocaleLowerCase())) return offer.category;
  return \`${'${offer.category} · ${floor}'}\`;
}`;
const after = `function categoryWithFloor(offer: Offer) {
  const room = offerRoomNumber(offer);
  if (room >= 5) return offer.category;
  const floor = offer.floor.split(" · ")[0]?.trim();
  return floor ? offer.category + " · " + floor : offer.category;
}`;
if (!source.includes(before)) throw new Error('categoryWithFloor target not found');
source = source.replace(before, after);
fs.writeFileSync(file, source);
console.log('Fixed room category floor labels.');

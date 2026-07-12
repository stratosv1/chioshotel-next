const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'app/api/ai-assistant/request/route.ts');
let source = fs.readFileSync(file, 'utf8');

const start = source.indexOf('async function verifyLiveOffer(');
const end = source.indexOf('\nasync function createReceptionSummary', start);
if (start === -1 || end === -1) throw new Error('verifyLiveOffer function not found');

const replacement = `async function verifyLiveOffer(request: NextRequest, input: {
  checkin: string;
  checkout: string;
  guests: number;
  roomId: string;
  unitId: string;
  originalTotal: number;
  directTotal: number;
}) {
  const url = new URL("/api/booking/search-range", request.nextUrl.origin);
  url.searchParams.set("checkin", input.checkin);
  url.searchParams.set("checkout", input.checkout);
  url.searchParams.set("guests", String(input.guests));

  const response = await fetch(url.toString(), { method: "GET", cache: "no-store" });
  const payload = await response.json().catch(() => null);
  const rooms = Array.isArray(payload?.rooms?.available) ? payload.rooms.available : [];
  if (!response.ok || !payload || !Array.isArray(rooms)) {
    return { ok: false as const, reason: "Live availability could not be verified. Please search again." };
  }

  const room = rooms.find((item: any) =>
    String(item?.roomId || "") === input.roomId &&
    String(item?.unitId || "") === input.unitId,
  );
  if (!room) {
    return { ok: false as const, reason: "This room is no longer available for the selected stay. Please search again." };
  }

  const verifiedOriginal = Number(room?.totalPrice ?? room?.price ?? room?.total ?? room?.roomTotal ?? 0);
  const verifiedDirect = Math.round(verifiedOriginal * 0.9 * 100) / 100;
  if (!validMoney(verifiedOriginal) || !validMoney(verifiedDirect)) {
    return { ok: false as const, reason: "The live price could not be verified. Please search again." };
  }

  if (Math.abs(verifiedOriginal - input.originalTotal) > PRICE_TOLERANCE || Math.abs(verifiedDirect - input.directTotal) > PRICE_TOLERANCE) {
    return { ok: false as const, reason: "The live price has changed. Please search again to see the current offer." };
  }

  return {
    ok: true as const,
    offer: {
      roomId: input.roomId,
      unitId: input.unitId,
      name: undefined,
      originalTotal: verifiedOriginal,
      directTotal: verifiedDirect,
      nights: stayNights(input.checkin, input.checkout),
      maxGuests: Number(room?.maxGuests || input.guests),
      preview: false,
    },
  };
}
`;

source = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(file, source);
console.log('AI request live verification patched');

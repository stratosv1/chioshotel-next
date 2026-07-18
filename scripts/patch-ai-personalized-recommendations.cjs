const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "app/api/ai-assistant/route.ts");
let source = fs.readFileSync(file, "utf8");

if (!source.includes('import { personalizeOffers } from "@/lib/ai-assistant/sales-concierge";')) {
  source = source.replace(
    'import { NextRequest, NextResponse } from "next/server";',
    'import { NextRequest, NextResponse } from "next/server";\nimport { personalizeOffers } from "@/lib/ai-assistant/sales-concierge";',
  );
}

const oldBlock = `    const availability = await searchNeon(search, request.nextUrl.origin);\n    const offers = buildOffers(availability, language);\n\n    return NextResponse.json({\n      answer: offers.length ? resultMessage(language, offers.length) : resultMessage(language, 0),\n      search,\n      offers,`;

const newBlock = `    const availability = await searchNeon(search, request.nextUrl.origin);\n    const offers = buildOffers(availability, language);\n    const personalized = offers.length\n      ? await personalizeOffers({ messages, search, offers, language })\n      : { answer: resultMessage(language, 0), offers };\n\n    return NextResponse.json({\n      answer: personalized.answer || resultMessage(language, personalized.offers.length),\n      search,\n      offers: personalized.offers,`;

if (!source.includes("await personalizeOffers({ messages, search, offers, language })")) {
  if (!source.includes(oldBlock)) {
    throw new Error("AI offer response block not found");
  }
  source = source.replace(oldBlock, newBlock);
}

if (!source.includes('import { personalizeOffers } from "@/lib/ai-assistant/sales-concierge";')) {
  throw new Error("Personalized recommendation import was not applied");
}
if (!source.includes("offers: personalized.offers")) {
  throw new Error("Personalized offers response was not applied");
}

fs.writeFileSync(file, source);
console.log("Enabled personalized AI room recommendations");

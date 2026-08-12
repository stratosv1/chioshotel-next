const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const routeFile = path.join(root, "app/api/ai-assistant/route.ts");
const smartFile = path.join(root, "app/api/ai-assistant/smart/route.ts");
const chatFile = path.join(root, "components/ai/AiRoomChatPreview.tsx");

function read(file) { return fs.readFileSync(file, "utf8"); }
function write(file, source) { fs.writeFileSync(file, source); }
function replaceOnce(source, from, to, label) {
  if (source.includes(to)) return source;
  if (!source.includes(from)) throw new Error(`${label} anchor not found`);
  return source.replace(from, to);
}

// Backend interpreter: ChatGPT understands free-form multilingual booking language.
// Application code only validates the structured meaning returned by the model.
{
  let source = read(routeFile);

  source = replaceOnce(
    source,
    'type SearchState = { checkin?: string | null; checkout?: string | null; guests?: number | null };',
    'type SearchState = { checkin?: string | null; checkout?: string | null; guests?: number | null; nights?: number | null };',
    'SearchState nights',
  );

  source = replaceOnce(
    source,
    '  guests: number;\n  clearFields: SearchField[];',
    '  guests: number;\n  nights: number;\n  clearFields: SearchField[];',
    'AiDecision nights',
  );

  if (!source.includes('source.nights')) {
    source = replaceOnce(
      source,
      '  if (Number.isInteger(source.guests) && Number(source.guests) >= 1 && Number(source.guests) <= 5) search.guests = Number(source.guests);\n  return search;',
      '  if (Number.isInteger(source.guests) && Number(source.guests) >= 1 && Number(source.guests) <= 5) search.guests = Number(source.guests);\n  if (Number.isInteger(source.nights) && Number(source.nights) >= 1 && Number(source.nights) <= MAX_NIGHTS) search.nights = Number(source.nights);\n  return search;',
      'normalizeSearch nights',
    );
  }

  if (!source.includes('function addDaysIso(')) {
    source = replaceOnce(
      source,
      'function responseText(payload: any): string {',
      'function addDaysIso(start: string, days: number) {\n  const date = new Date(`${start}T12:00:00Z`);\n  date.setUTCDate(date.getUTCDate() + days);\n  return date.toISOString().slice(0, 10);\n}\n\nfunction responseText(payload: any): string {',
      'addDaysIso helper',
    );
  }

  if (!source.includes('"A duration such as a number of nights is booking data')) {
    source = replaceOnce(
      source,
      '                "Understand natural and relative dates and corrections in Greek, English, French, German, Italian, Spanish and Turkish.",',
      '                "Understand natural and relative dates and corrections in Greek, English, French, German, Italian, Spanish and Turkish.",\n                "A duration such as a number of nights is booking data. Extract it into nights even when the wording is conversational or in a language different from the interface language.",\n                "For a bare or natural date, roomFinderContext.currentStep is authoritative when present: checkin means the date is check-in; checkout means the date is check-out, unless the latest message semantically says it is correcting another field.",\n                "suppliedLanguage is the interface language. Understand the user in any supported language, but do not switch the booking flow language because the user typed in another language.",',
      'semantic duration prompt',
    );
  }

  source = replaceOnce(
    source,
    '                guests: { type: "integer", minimum: 0, maximum: 5 },\n                clearFields:',
    `                guests: { type: "integer", minimum: 0, maximum: 5 },\n                nights: { type: "integer", minimum: 0, maximum: ${30} },\n                clearFields:`,
    'schema nights',
  );

  source = replaceOnce(
    source,
    '              required: ["intent", "language", "checkin", "checkout", "guests", "clearFields", "answer"],',
    '              required: ["intent", "language", "checkin", "checkout", "guests", "nights", "clearFields", "answer"],',
    'schema required nights',
  );

  if (!source.includes('decision.nights >= 1 && decision.nights <= MAX_NIGHTS')) {
    source = replaceOnce(
      source,
      '  if (!restarting && !clearedFields.has("guests") && decision.guests >= 1 && decision.guests <= 5) next.guests = decision.guests;\n\n  return next;',
      '  if (!restarting && !clearedFields.has("guests") && decision.guests >= 1 && decision.guests <= 5) next.guests = decision.guests;\n  if (!restarting && decision.nights >= 1 && decision.nights <= MAX_NIGHTS) next.nights = decision.nights;\n\n  // The model extracts duration; date arithmetic remains deterministic application logic.\n  if (isIsoDate(next.checkin) && !isIsoDate(next.checkout) && next.nights && next.nights >= 1 && next.nights <= MAX_NIGHTS) {\n    next.checkout = addDaysIso(next.checkin, next.nights);\n  }\n  if (isIsoDate(next.checkin) && isIsoDate(next.checkout)) next.nights = nightsBetween(next.checkin, next.checkout);\n\n  return next;',
      'apply duration',
    );
  }

  // The selected UI language owns all deterministic flow copy. The model may understand another input language.
  source = replaceOnce(
    source,
    '    const language = decision.language || "en";',
    '    const language = (["en", "el", "fr", "de", "it", "es", "tr"].includes(body?.language) ? body.language : "en") as Language;',
    'interface language ownership',
  );

  write(routeFile, source);
}

// Smart wrapper must never override the interface language with the language inferred from a user message.
{
  let source = read(smartFile);
  source = replaceOnce(
    source,
    '  const language = normalizeLanguage(rawPayload.language || requestedLanguage);',
    '  const language = requestedLanguage;',
    'smart interface language',
  );
  write(smartFile, source);
}

// Active UI preserves semantic duration state and sends every date/duration/correction message to ChatGPT.
{
  let source = read(chatFile);

  if (!source.includes('const [pendingNights, setPendingNights]')) {
    source = replaceOnce(
      source,
      '  const [checkout, setCheckout] = useState("");\n  const [roomCount, setRoomCount] = useState(1);',
      '  const [checkout, setCheckout] = useState("");\n  const [pendingNights, setPendingNights] = useState<number | null>(null);\n  const [roomCount, setRoomCount] = useState(1);',
      'UI pending nights state',
    );
  }

  if (!source.includes('setPendingNights(null);')) {
    source = replaceOnce(
      source,
      '    setCheckout("");\n    setRoomCount(1);',
      '    setCheckout("");\n    setPendingNights(null);\n    setRoomCount(1);',
      'restart nights reset',
    );
  }

  source = replaceOnce(
    source,
    '        search: { checkin: checkin || null, checkout: checkout || null },',
    '        search: { checkin: checkin || null, checkout: checkout || null, nights: pendingNights },',
    'send pending nights',
  );

  source = replaceOnce(
    source,
    '      search?: { checkin?: string | null; checkout?: string | null };',
    '      search?: { checkin?: string | null; checkout?: string | null; nights?: number | null };',
    'response nights type',
  );

  if (!source.includes('const nextNights = typeof search.nights')) {
    source = replaceOnce(
      source,
      '        const nextCheckout = typeof search.checkout === "string" ? search.checkout : "";\n\n        // Apply the server state exactly.',
      '        const nextCheckout = typeof search.checkout === "string" ? search.checkout : "";\n        const nextNights = typeof search.nights === "number" && Number.isInteger(search.nights) ? search.nights : null;\n\n        // Apply the server state exactly.',
      'read structured nights',
    );
    source = replaceOnce(
      source,
      '        setCheckin(nextCheckin);\n        setCheckout(nextCheckout);',
      '        setCheckin(nextCheckin);\n        setCheckout(nextCheckout);\n        setPendingNights(nextNights);',
      'apply structured nights',
    );
  }

  write(chatFile, source);
}

console.log("AI Room Finder intent engine v2 applied: semantic dates, corrections, duration and stable interface language");

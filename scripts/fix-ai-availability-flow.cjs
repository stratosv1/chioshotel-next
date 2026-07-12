const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'app/api/ai-assistant/smart/route.ts');
let source = fs.readFileSync(file, 'utf8');

if (!source.includes('function shortGuestCount')) {
  const marker = 'function forcedDateContinuation(input: {';
  const insert = `function shortGuestCount(message: string) {
  const match = message.trim().match(/^(?:we are|for|για|ειμαστε|είμαστε)?\\s*(\\d{1,2})\\s*(?:guests?|people|persons?|άτομα|ατομα|επισκέπτες|επισκεπτες|personen|personnes|persone|personas|kişi|kisi)?$/i);
  if (!match) return undefined;
  const guests = Number(match[1]);
  return Number.isInteger(guests) && guests >= 1 && guests <= 5 ? guests : undefined;
}

`;
  source = source.replace(marker, insert + marker);
}

source = source.replace('function forcedDateContinuation(input: {', 'function forcedAvailabilityContinuation(input: {');

const oldReturn = `  return {
    language: input.language,
    replyMode: "execute",
    selectedRoom: input.selectedRoom,
    actions: [action],
  };
}`;

const newReturn = `  return {
    language: input.language,
    replyMode: "execute",
    selectedRoom: input.selectedRoom,
    actions: [action],
  };
}

function forcedGuestContinuation(input: {
  latest: string;
  messages: ChatMessage[];
  search: SearchState;
  language: AssistantLanguage;
  selectedRoom?: number;
}): AssistantCommand | undefined {
  const guests = shortGuestCount(input.latest);
  if (!guests) return undefined;

  const assistantContext = input.messages
    .filter((message) => message.role === "assistant")
    .slice(-4)
    .map((message) => normalize(message.content))
    .join(" ");
  const askedGuests = /how many guests|guest count|combien de personnes|wie viele gaste|quante persone|cuantas personas|kac kisi|πόσα άτομα|ποσα ατομα|επισκέπτες|επισκεπτες/.test(assistantContext);
  if (!askedGuests && !(input.search.checkin && input.search.checkout)) return undefined;

  return {
    language: input.language,
    replyMode: "execute",
    selectedRoom: input.selectedRoom,
    actions: [{
      type: "search_availability",
      checkin: input.search.checkin,
      checkout: input.search.checkout,
      guests,
    }],
  };
}`;

if (!source.includes('function forcedGuestContinuation')) {
  source = source.replace(oldReturn, newReturn);
}

source = source.replace(
  'const forcedCommand = forcedDateContinuation({ latest, messages, search, language, selectedRoom });',
  'const forcedCommand = forcedAvailabilityContinuation({ latest, messages, search, language, selectedRoom }) || forcedGuestContinuation({ latest, messages, search, language, selectedRoom });'
);

source = source.replace(
  'sourceAnswer: legacyPayload.answer,',
  'knowledge: [],\n        sourceAnswer: legacyPayload.answer,'
);

source = source.replace(
  '&& /^\\d{1,2}\\s*[\\/.\\-]\\s*\\d{1,2}/.test(latest)) continue;',
  '&& (/^\\d{1,2}\\s*[\\/.\\-]\\s*\\d{1,2}/.test(latest) || /^\\d{1,2}$/.test(latest))) continue;'
);

fs.writeFileSync(file, source);
console.log('AI availability flow patched');

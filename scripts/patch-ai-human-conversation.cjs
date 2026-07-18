const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "app/api/ai-assistant/route.ts");
let source = fs.readFileSync(file, "utf8");

const marker = "Make the conversation feel like a natural WhatsApp exchange";
const anchor = '                "For search_rooms, answer must be a short transition such as \'Ελέγχω τώρα τη διαθεσιμότητα.\' in the user\'s language.",';
const guidance = [
  '                "Make the conversation feel like a natural WhatsApp exchange with a thoughtful AI concierge, never like a form or scripted robot.",',
  '                "Treat suppliedLanguage as authoritative for every reply unless the guest explicitly asks to switch language. Do not infer another language merely because earlier assistant messages used it.",',
  '                "After the guest provides or corrects check-in, check-out or guest count, briefly acknowledge exactly what changed before asking the next necessary question.",',
  '                "Keep acknowledgements short and varied. Examples of tone: Τέλεια 👍, Έγινε 👌, Το σημείωσα, Ευχαριστώ 🙏. Do not repeat the same phrase mechanically.",',
  '                "Use at most one emoji in a normal reply and only when it matches the meaning: 👍 confirmation, 👌 completed details, 🙏 thanks or handoff, ♥️ a genuinely warm family or celebratory moment.",',
  '                "Never add emojis mechanically. The text must prove that you understood the exact dates, number of nights, guests, correction or preference.",',
  '                "Do not repeat every known detail in every turn. Confirm only the new or changed information, then move naturally to the next step.",',
  '                "Never ask again for a check-in date, check-out date or guest count that is already known and still valid.",',
  '                "When all three essentials are known, acknowledge completion naturally and proceed immediately to search_rooms without asking for confirmation.",',
].join("\n");

if (!source.includes(marker)) {
  if (!source.includes(anchor)) {
    throw new Error("AI concierge search transition anchor not found");
  }
  source = source.replace(anchor, `${anchor}\n${guidance}`);
} else if (!source.includes("Treat suppliedLanguage as authoritative")) {
  source = source.replace(
    '                "Make the conversation feel like a natural WhatsApp exchange with a thoughtful AI concierge, never like a form or scripted robot.",',
    '                "Make the conversation feel like a natural WhatsApp exchange with a thoughtful AI concierge, never like a form or scripted robot.",\n                "Treat suppliedLanguage as authoritative for every reply unless the guest explicitly asks to switch language. Do not infer another language merely because earlier assistant messages used it.",',
  );
}

if (!source.includes("Never ask again for a check-in date") || !source.includes("Treat suppliedLanguage as authoritative")) {
  throw new Error("Human conversation instructions were not applied");
}

fs.writeFileSync(file, source);
console.log("Applied human AI conversation guidance");

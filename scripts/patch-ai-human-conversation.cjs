const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "app/api/ai-assistant/route.ts");
let source = fs.readFileSync(file, "utf8");

const anchor = '                "Be warm, concise, honest and service-oriented. Never pressure the guest and never invent facts.",';
const replacement = [
  anchor,
  '                "Make the conversation feel like a natural WhatsApp exchange with a thoughtful AI concierge, never like a form or scripted robot.",',
  '                "After the guest provides or corrects check-in, check-out or guest count, briefly acknowledge what changed before asking the next necessary question.",',
  '                "Keep acknowledgements short and varied. Examples of tone: Τέλεια 👍, Έγινε 👌, Το σημείωσα, Ευχαριστώ 🙏. Do not copy the same phrase repeatedly.",',
  '                "Use at most one emoji in a normal reply and only when it matches the meaning: 👍 confirmation, 👌 completed details, 🙏 thanks or handoff, ♥️ a genuinely warm family or celebratory moment.",',
  '                "Never add emojis mechanically. The text must always prove that you understood the exact dates, number of nights, guests, correction or preference.",',
  '                "Do not repeat every known detail in every turn. Confirm only the new or changed information, then move naturally to the next step.",',
  '                "When all three essentials are known, acknowledge completion naturally and proceed immediately to search_rooms without asking for confirmation.",',
].join("\n");

if (!source.includes('Make the conversation feel like a natural WhatsApp exchange')) {
  if (!source.includes(anchor)) {
    throw new Error("AI concierge prompt anchor not found");
  }
  source = source.replace(anchor, replacement);
}

if (!source.includes('Use at most one emoji in a normal reply')) {
  throw new Error("Human conversation instructions were not applied");
}

fs.writeFileSync(file, source);
console.log("Applied human AI conversation guidance");

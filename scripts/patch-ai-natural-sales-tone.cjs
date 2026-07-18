const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();

function patchFile(relativePath, transform) {
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const next = transform(source);
  if (next === source) {
    console.log(`No changes needed: ${relativePath}`);
    return;
  }
  fs.writeFileSync(filePath, next, "utf8");
  console.log(`Updated: ${relativePath}`);
}

patchFile("components/ai/ConversationalRoomSalesEnhanced.tsx", (source) => {
  let next = source;

  const replacements = [
    ["📅 Πότε θα θέλατε να έρθετε στη Χίο; Μπορείτε να γράψετε και «είκοσι Ιουλίου».", "📅 Πότε θα θέλατε να έρθετε στη Χίο;"],
    ["📅 When would you like to arrive in Chios? You can also write a date in words.", "📅 When would you like to arrive in Chios?"],
    ["📅 Wann möchten Sie anreisen? Sie können das Datum auch ausschreiben.", "📅 Wann möchten Sie anreisen?"],
    ["📅 Quand souhaitez-vous arriver ? Vous pouvez aussi écrire la date en toutes lettres.", "📅 Quand souhaitez-vous arriver ?"],
    ["📅 Quando desideri arrivare? Puoi scrivere la data anche in lettere.", "📅 Quando desideri arrivare?"],
    ["📅 ¿Cuándo deseas llegar? También puedes escribir la fecha con palabras.", "📅 ¿Cuándo deseas llegar?"],
    ["📅 Ne zaman gelmek istersiniz? Tarihi yazıyla da yazabilirsiniz.", "📅 Ne zaman gelmek istersiniz?"],

    ["interpreting:\"🤖 Καταλαβαίνω την ημερομηνία σας…\"", "interpreting:\"Μισό λεπτό, το ελέγχω για εσάς…\""],
    ["interpreting:\"🤖 Understanding your date…\"", "interpreting:\"Just a moment, I’m checking that for you…\""],
    ["interpreting:\"🤖 Ich verstehe Ihr Datum…\"", "interpreting:\"Einen kleinen Moment, ich prüfe das für Sie…\""],
    ["interpreting:\"🤖 Je comprends votre date…\"", "interpreting:\"Un petit instant, je vérifie cela pour vous…\""],
    ["interpreting:\"🤖 Sto comprendendo la data…\"", "interpreting:\"Un momento, controllo subito per te…\""],
    ["interpreting:\"🤖 Estoy entendiendo la fecha…\"", "interpreting:\"Un momento, lo compruebo por ti…\""],
    ["interpreting:\"🤖 Tarihinizi anlıyorum…\"", "interpreting:\"Bir saniye, sizin için kontrol ediyorum…\""],
  ];

  for (const [from, to] of replacements) next = next.replace(from, to);

  next = next.replace(
    /\{step===\"interpreting\"\?<div className=\"ml-10 rounded-\[20px\] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 shadow-sm\">\{t\.interpreting\}<\/div>:null\}/,
    `{step===\"interpreting\"?<div className=\"flex items-end gap-2\"><div className=\"relative mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-stone-200\"><Image src=\"/images/welcome/voulamandis-welcome-hero.webp\" alt=\"Voulamandis House\" fill sizes=\"32px\" className=\"object-cover\"/></div><div className=\"rounded-[20px] rounded-bl-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 shadow-sm\">{t.interpreting}</div></div>:null}`,
  );

  next = next.replace("addA(result.answer||t.checkout)", "addA(t.checkout)");

  return next;
});

patchFile("app/api/ai-assistant/route.ts", (source) => {
  let next = source;
  const anchor = '"Every user message reaches you first. You decide the next action and the exact short reply shown to the user.",';
  const addition = [
    anchor,
    '                "Speak like a warm, attentive host welcoming a guest at the door. Every conversation is a genuine opportunity to help and convert interest into a stay.",',
    '                "Use natural, polite, pleasant language. Sound human, calm and helpful, never bureaucratic, technical or robotic.",',
    '                "Never say phrases equivalent to: recorded, registered, captured, processing your input, understanding your date, system, database or command.",',
    '                "Do not repeat instructions about how the guest may type a date unless the date is genuinely unclear.",',
    '                "When confirming known details, keep it conversational, for example: Great, arrival on 28 July for 2 guests 😊 When would you like to check out?",',
    '                "Use at most one friendly emoji in a reply and only when it feels natural.",',
  ].join("\n");
  if (!next.includes("Speak like a warm, attentive host")) next = next.replace(anchor, addition);
  return next;
});

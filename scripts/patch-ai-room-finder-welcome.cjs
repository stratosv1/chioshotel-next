const fs = require("node:fs");
const path = require("node:path");

const target = path.join(process.cwd(), "components/ai/AiRoomChatPreview.tsx");
let source = fs.readFileSync(target, "utf8");

const welcomeByLanguage = {
  en: "Welcome to Voulamandis House 👋 I’m here to help you find the best available room for your stay in Chios. When would you like to check in?",
  el: "Καλώς ήρθατε στο Voulamandis House 👋 Είμαι εδώ για να σας βοηθήσω να βρείτε το καλύτερο διαθέσιμο δωμάτιο για τη διαμονή σας στη Χίο. Πότε θα θέλατε να κάνετε check-in;",
  de: "Willkommen im Voulamandis House 👋 Ich helfe Ihnen, das beste verfügbare Zimmer für Ihren Aufenthalt auf Chios zu finden. Wann möchten Sie einchecken?",
  fr: "Bienvenue à Voulamandis House 👋 Je suis là pour vous aider à trouver la meilleure chambre disponible pour votre séjour à Chios. Quand souhaitez-vous effectuer votre check-in ?",
  it: "Benvenuti a Voulamandis House 👋 Sono qui per aiutarvi a trovare la migliore camera disponibile per il vostro soggiorno a Chios. Quando desiderate effettuare il check-in?",
  es: "Bienvenidos a Voulamandis House 👋 Estoy aquí para ayudarles a encontrar la mejor habitación disponible para su estancia en Quíos. ¿Cuándo les gustaría hacer el check-in?",
  tr: "Voulamandis House’a hoş geldiniz 👋 Sakız Adası’ndaki konaklamanız için en uygun müsait odayı bulmanıza yardımcı olmak için buradayım. Ne zaman giriş yapmak istersiniz?",
};

for (const [language, welcome] of Object.entries(welcomeByLanguage)) {
  const pattern = new RegExp(`(\\n  ${language}: \\{\\n    welcome: )\"(?:[^\"\\\\]|\\\\.)*\"`);
  if (!pattern.test(source)) {
    throw new Error(`AI room finder welcome anchor not found for ${language}`);
  }
  source = source.replace(pattern, `$1${JSON.stringify(welcome)}`);
}

fs.writeFileSync(target, source);
console.log("Updated AI Room Finder welcome copy for 7 languages.");

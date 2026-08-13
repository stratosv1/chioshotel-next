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
  if (!pattern.test(source)) throw new Error(`AI room finder welcome anchor not found for ${language}`);
  source = source.replace(pattern, `$1${JSON.stringify(welcome)}`);
}

if (!source.includes("@keyframes ai-reaction-in")) {
  const keyframeAnchor = "        @keyframes ai-dot { 0%, 60%, 100% { transform: translateY(0); opacity: .35; } 30% { transform: translateY(-4px); opacity: 1; } }";
  const keyframeReplacement = `${keyframeAnchor}\n        @keyframes ai-reaction-in { from { opacity: 0; transform: translateY(3px) scale(.82); } to { opacity: 1; transform: translateY(0) scale(1); } }`;
  if (!source.includes(keyframeAnchor)) throw new Error("AI reaction animation anchor not found");
  source = source.replace(keyframeAnchor, keyframeReplacement);
}

if (!source.includes('data-ai-user-reaction="true"')) {
  const oldBubble = `                <div className={\`max-w-[84%] whitespace-pre-line px-4 py-3 text-[15px] leading-6 shadow-sm sm:max-w-[72%] \${message.role === "user" ? "rounded-[20px] rounded-br-[6px] bg-[#6b604f] text-white" : "rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white text-[#302b25]"}\`}>
                  {message.content}
                </div>`;
  const newBubble = `                <div className={\`relative max-w-[84%] sm:max-w-[72%] \${message.role === "user" ? "pb-2" : ""}\`}>
                  <div className={\`whitespace-pre-line px-4 py-3 text-[15px] leading-6 shadow-sm \${message.role === "user" ? "rounded-[20px] rounded-br-[6px] bg-[#6b604f] text-white" : "rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white text-[#302b25]"}\`}>
                    {message.content}
                  </div>
                  {message.role === "user" && <span data-ai-user-reaction="true" aria-hidden="true" className="absolute -bottom-1 right-1 flex h-7 min-w-7 items-center justify-center rounded-full border border-[#ddd4c8] bg-white px-1.5 text-sm opacity-0 shadow-sm [animation:ai-reaction-in_.22s_ease-out_1.5s_forwards]">👍</span>}
                </div>`;
  if (!source.includes(oldBubble)) throw new Error("AI room finder user bubble anchor not found");
  source = source.replace(oldBubble, newBubble);
}

fs.writeFileSync(target, source);
console.log("Updated AI Room Finder welcome copy and delayed user reaction badge.");

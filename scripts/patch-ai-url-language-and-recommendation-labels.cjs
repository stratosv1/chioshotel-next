const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AIRoomFinder.tsx");
let source = fs.readFileSync(file, "utf8");

if (!source.includes("recommendationTitle?: string")) {
  source = source.replace(
    "  saving: number;\n};",
    "  saving: number;\n  recommendationRole?: \"recommended\" | \"budget\" | \"comfort\" | \"alternative\";\n  recommendationTitle?: string;\n  recommendationReason?: string;\n};",
  );
}

const oldLanguageState = `  const [language, setLanguage] = useState<Language>("el");\n  const t = COPY[language];\n  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: COPY.el.welcome }]);`;
const newLanguageState = `  const initialLanguage = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "el";\n  const [language, setLanguage] = useState<Language>(initialLanguage);\n  const t = COPY[language];\n  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: COPY[initialLanguage].welcome }]);`;

if (!source.includes("const initialLanguage = typeof window")) {
  if (!source.includes(oldLanguageState)) {
    throw new Error("AI language state block not found");
  }
  source = source.replace(oldLanguageState, newLanguageState);
}

const oldBadge = `{offerIndex === 0 ? t.best : t.live}`;
const newBadge = `{offer.recommendationTitle || (offerIndex === 0 ? t.best : t.live)}`;
if (!source.includes(newBadge)) {
  if (!source.includes(oldBadge)) {
    throw new Error("AI room card badge label not found");
  }
  source = source.replace(oldBadge, newBadge);
}

if (!source.includes("recommendationTitle?: string") || !source.includes("COPY[initialLanguage].welcome") || !source.includes("offer.recommendationTitle ||")) {
  throw new Error("AI recommendation type, URL language or recommendation label patch was not applied");
}

fs.writeFileSync(file, source);
console.log("Applied AI recommendation types, URL language and recommendation labels");
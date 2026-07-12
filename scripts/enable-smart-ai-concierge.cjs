const fs = require("fs");

const path = "components/ai/GuestAssistant.tsx";
let source = fs.readFileSync(path, "utf8");

if (source.includes('fetch("/api/ai-assistant/smart"')) {
  console.log("enable-smart-ai-concierge: already enabled");
  process.exit(0);
}

const legacy = 'fetch("/api/ai-assistant"';
if (!source.includes(legacy)) {
  console.error("enable-smart-ai-concierge: assistant fetch call not found");
  process.exit(1);
}

source = source.replace(legacy, 'fetch("/api/ai-assistant/smart"');
fs.writeFileSync(path, source);
console.log("enable-smart-ai-concierge: enabled");

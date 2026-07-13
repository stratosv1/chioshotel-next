const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'app/api/ai-assistant/smart/route.ts');
let source = fs.readFileSync(file, 'utf8');

const slow = 'const answer = await composeAvailabilityAnswer({ language: command.language, message: latest, legacyPayload });';
const fast = 'const answer = typeof legacyPayload.answer === "string" ? legacyPayload.answer : "";';

if (source.includes(slow)) {
  source = source.replace(slow, fast);
}

fs.writeFileSync(file, source);
console.log('AI availability response now bypasses the second OpenAI call');

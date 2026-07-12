const fs = require('fs');

const path = 'app/api/ai-assistant/route.ts';
let source = fs.readFileSync(path, 'utf8');

const oldWantsReset = `  const wantsReset = /νέες?\\s+ημερομην|αλλαγή\\s+ημερομην|άλλες?\\s+ημερομην|new\\s+dates?|different\\s+dates?/i.test(latest);\n  const next: SearchState = wantsReset ? { guests: current.guests } : { ...current };`;
const newWantsReset = `  const isCorrection = /\\b(συγγνώμη|συγνωμη|τελικά|τελικα|διόρθωση|διορθωση|εννοούσα|εννοουσα|αλλαγή|αλλαγη|sorry|actually|instead|change|correction)\\b/i.test(latest);\n  const wantsReset = /νέες?\\s+ημερομην|αλλαγή\\s+ημερομην|άλλες?\\s+ημερομην|new\\s+dates?|different\\s+dates?/i.test(latest);\n  const next: SearchState = wantsReset ? { guests: current.guests } : { ...current };`;

const oldNight = `  const nightMatch = latest.match(/\\b(\\d{1,2})\\s*(?:νύχτες|νυχτες|βράδια|βραδια|βραδιά|nights?|nächte|nuits|notti|noches|gece)\\b/i);`;
const newNight = `  const nightMatch = latest.match(/\\b(\\d{1,2})\\s*(?:νύχτες|νυχτες|νύχτα|νυχτα|βράδια|βραδια|βραδιά|βραδια|βράδυ|βραδυ|nights?|night|nächte|nacht|nuits?|notti|notte|noches?|noche|gece)\\b/i);`;

const oldClearlyNewStay = `    const clearlyNewStay = Boolean(nightMatch) || /\\b(θέλω|θελω|από|απο|άφιξη|αφιξη|έρχομαι|ερχομαι|new|from|arrive)\\b/i.test(latest);`;
const newClearlyNewStay = `    const clearlyNewStay = Boolean(nightMatch) || isCorrection || /\\b(θέλω|θελω|από|απο|άφιξη|αφιξη|έρχομαι|ερχομαι|new|from|arrive)\\b/i.test(latest);`;

const oldBare = `  if (bareNumber) {\n    const number = Number(bareNumber[1]);\n    if (next.checkin && !next.checkout) next.checkout = addDays(next.checkin, number);\n    else if (next.checkin && next.checkout && !next.guests) next.guests = Math.min(10, Math.max(1, number));\n  }`;
const newBare = `  if (bareNumber) {\n    const number = Number(bareNumber[1]);\n    if (next.checkin && (!next.checkout || isCorrection)) next.checkout = addDays(next.checkin, number);\n    else if (next.checkin && next.checkout && !next.guests) next.guests = Math.min(10, Math.max(1, number));\n  }`;

for (const [oldText, newText, label] of [
  [oldWantsReset, newWantsReset, 'correction detector'],
  [oldNight, newNight, 'night parser'],
  [oldClearlyNewStay, newClearlyNewStay, 'single-date correction'],
  [oldBare, newBare, 'bare-number correction'],
]) {
  if (!source.includes(oldText)) {
    console.error(`patch-ai-correction-logic: missing ${label}`);
    process.exit(1);
  }
  source = source.replace(oldText, newText);
}

fs.writeFileSync(path, source);
console.log('patch-ai-correction-logic: applied');

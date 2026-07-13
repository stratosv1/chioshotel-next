const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'app/api/ai-assistant/smart/route.ts');
let source = fs.readFileSync(file, 'utf8');

if (!source.includes('function invalidDateOrderMessage')) {
  source = source.replace(
    'function clarification(language: AssistantLanguage, missing: "checkin" | "checkout" | "guests") {',
    `function invalidDateOrderMessage(language: AssistantLanguage) {
  const copy: Record<AssistantLanguage, string> = {
    el: "Η αναχώρηση πρέπει να είναι μετά την άφιξη. Ποια σωστή ημερομηνία αναχώρησης θέλετε;",
    en: "Your check-out date must be after your arrival date. What check-out date would you like instead?",
    fr: "La date de départ doit être postérieure à la date d’arrivée. Quelle date de départ souhaitez-vous ?",
    de: "Das Abreisedatum muss nach dem Anreisedatum liegen. Welches Abreisedatum wünschen Sie stattdessen?",
    it: "La data di partenza deve essere successiva alla data di arrivo. Quale data di partenza desiderate?",
    es: "La fecha de salida debe ser posterior a la fecha de llegada. ¿Qué fecha de salida desea?",
    tr: "Çıkış tarihi giriş tarihinden sonra olmalıdır. Hangi çıkış tarihini istersiniz?",
  };
  return copy[language] || copy.en;
}

function clarification(language: AssistantLanguage, missing: "checkin" | "checkout" | "guests") {`
  );
}

const marker = '      const missing = !mergedSearch.checkin ? "checkin" : !mergedSearch.checkout ? "checkout" : !mergedSearch.guests ? "guests" : null;';
if (source.includes(marker) && !source.includes('invalidDateOrderMessage(command.language)')) {
  source = source.replace(
    marker,
    `      if (mergedSearch.checkin && mergedSearch.checkout) {
        const checkinTime = new Date(\`${'${mergedSearch.checkin}'}T12:00:00Z\`).getTime();
        const checkoutTime = new Date(\`${'${mergedSearch.checkout}'}T12:00:00Z\`).getTime();
        if (!Number.isFinite(checkinTime) || !Number.isFinite(checkoutTime) || checkoutTime <= checkinTime) {
          return NextResponse.json({
            answer: invalidDateOrderMessage(command.language),
            search: { checkin: mergedSearch.checkin, checkout: undefined, guests: mergedSearch.guests },
            offers: [],
            knowledge: [],
            language: command.language,
            selectedRoom: command.selectedRoom,
            command,
          });
        }
      }

      const missing = !mergedSearch.checkin ? "checkin" : !mergedSearch.checkout ? "checkout" : !mergedSearch.guests ? "guests" : null;`
  );
}

fs.writeFileSync(file, source);
console.log('AI date order validation patched');

const fs = require('node:fs');

const file = 'components/ai/AiRoomChatPreview.tsx';
let source = fs.readFileSync(file, 'utf8');

function replaceRequired(before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing target: ${label}`);
  source = source.replace(before, after);
}

replaceRequired(
  '  invalidDate: string;\n  invalidCheckout: string;',
  '  invalidDate: string;\n  invalidPastDate: string;\n  invalidCheckout: string;',
  'past-date copy type',
);

const pastDateTranslations = [
  ['    invalidDate: "I couldn’t understand that date. Try “20 July” or “20/07”.",', '    invalidDate: "I couldn’t understand that date. Try “20 July” or “20/07”.",\n    invalidPastDate: "Check-in cannot be in the past.",'],
  ['    invalidDate: "Δεν κατάλαβα την ημερομηνία. Δοκιμάστε «20 Ιουλίου» ή «20/07».",', '    invalidDate: "Δεν κατάλαβα την ημερομηνία. Δοκιμάστε «20 Ιουλίου» ή «20/07».",\n    invalidPastDate: "Το check-in δεν μπορεί να είναι σε παρελθοντική ημερομηνία.",'],
  ['    invalidDate: "Ich konnte dieses Datum nicht verstehen. Versuchen Sie „20. Juli“ oder „20/07“.",', '    invalidDate: "Ich konnte dieses Datum nicht verstehen. Versuchen Sie „20. Juli“ oder „20/07“.",\n    invalidPastDate: "Das Anreisedatum darf nicht in der Vergangenheit liegen.",'],
  ['    invalidDate: "Je n’ai pas compris cette date. Essayez « 20 juillet » ou « 20/07 ».",', '    invalidDate: "Je n’ai pas compris cette date. Essayez « 20 juillet » ou « 20/07 ».",\n    invalidPastDate: "La date d’arrivée ne peut pas être dans le passé.",'],
  ['    invalidDate: "Non ho capito la data. Prova «20 luglio» o «20/07».",', '    invalidDate: "Non ho capito la data. Prova «20 luglio» o «20/07».",\n    invalidPastDate: "La data di check-in non può essere nel passato.",'],
  ['    invalidDate: "No entendí la fecha. Prueba «20 de julio» o «20/07».",', '    invalidDate: "No entendí la fecha. Prueba «20 de julio» o «20/07».",\n    invalidPastDate: "La fecha de llegada no puede estar en el pasado.",'],
  ['    invalidDate: "Tarihi anlayamadım. «20 Temmuz» veya «20/07» şeklinde tekrar deneyin.",', '    invalidDate: "Tarihi anlayamadım. «20 Temmuz» veya «20/07» şeklinde tekrar deneyin.",\n    invalidPastDate: "Giriş tarihi geçmişte olamaz.",'],
];
for (const [before, after] of pastDateTranslations) replaceRequired(before, after, `past-date translation: ${before.slice(0, 24)}`);

replaceRequired(
  '        if (referenceMonth >= 10 && month <= 2) year += 1;',
  '        if (month < referenceMonth && referenceMonth - month >= 6) year += 1;',
  'cross-year numeric date rollover',
);

replaceRequired(
  '        if (previous === "checkin" && !nextCheckin) throw new Error("missing checkin");\n        if (previous === "checkout" && !nextCheckout) throw new Error("missing checkout");\n\n        if (nextCheckin) setCheckin(nextCheckin);',
  '        if (previous === "checkin" && !nextCheckin) throw new Error("missing checkin");\n        if (previous === "checkout" && !nextCheckout) throw new Error("missing checkout");\n\n        const today = new Date();\n        const minimumCheckin = isoDate(today.getFullYear(), today.getMonth() + 1, today.getDate()) || "";\n        if (nextCheckin && minimumCheckin && nextCheckin < minimumCheckin) {\n          setCheckin("");\n          setCheckout("");\n          setStep("checkin");\n          setError(copy.invalidPastDate);\n          return;\n        }\n\n        if (nextCheckin) setCheckin(nextCheckin);',
  'past check-in validation',
);

replaceRequired(
  '      const available = (offers[nextGroup] || []).filter(item => !nextKeys.has(`${item.roomId}:${item.unitId}`));',
  '      const available = (offers[nextGroup] || [])\n        .filter(item => !nextKeys.has(`${item.roomId}:${item.unitId}`))\n        .filter(item => !item.maxGuests || item.maxGuests >= groups[nextGroup]);',
  'multi-room capacity handoff',
);

replaceRequired(
  '  async function interpretDate(value: string, currentStep: "checkin" | "checkout") {',
  '  function changeLanguage(nextLanguage: Language) {\n    const url = new URL(window.location.href);\n    url.searchParams.set("lang", nextLanguage);\n    window.history.replaceState(window.history.state, "", url);\n    restart(nextLanguage);\n  }\n\n  async function interpretDate(value: string, currentStep: "checkin" | "checkout") {',
  'language URL synchronization',
);

replaceRequired(
  '<select value={language} onChange={event => restart(event.target.value as Language)}',
  '<select value={language} onChange={event => changeLanguage(event.target.value as Language)}',
  'language selector handler',
);

replaceRequired(
  '<div ref={feedRef} data-ai-chat-scroll="true" className="ai-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth">',
  '<div ref={feedRef} data-ai-chat-scroll="true" aria-busy={typing} className="ai-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth">',
  'chat busy state',
);

replaceRequired(
  '<div data-ai-conversation-feed="true" className="mx-auto flex min-h-full max-w-3xl flex-col px-3 pb-7 pt-5 sm:px-5">',
  '<div data-ai-conversation-feed="true" aria-live="polite" aria-relevant="additions text" className="mx-auto flex min-h-full max-w-3xl flex-col px-3 pb-7 pt-5 sm:px-5">',
  'chat live region',
);

fs.writeFileSync(file, source);
console.log('Applied final AI Room Finder audit fixes.');

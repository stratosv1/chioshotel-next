const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'app/api/ai-assistant/smart/route.ts');
let source = fs.readFileSync(file, 'utf8');

if (!source.includes('function fallbackMenu(')) {
  source = source.replace(
    'function clarification(language: AssistantLanguage, missing: "checkin" | "checkout" | "guests") {',
    `function fallbackMenu(language: AssistantLanguage) {
  const menus = {
    el: { answer: "Δεν κατάλαβα με βεβαιότητα τι θέλετε. Επιλέξτε μία ενέργεια για να ξεκινήσουμε ξανά:", actions: ["Έλεγχος διαθεσιμότητας", "Πρόταση δωματίου", "Παραλίες και αξιοθέατα", "Επικοινωνία με τη reception"] },
    en: { answer: "I did not understand your request with enough confidence. Choose an action to start again:", actions: ["Check availability", "Recommend a room", "Beaches and things to do", "Contact reception"] },
    fr: { answer: "Je n’ai pas compris votre demande. Choisissez une action pour recommencer :", actions: ["Vérifier les disponibilités", "Recommander une chambre", "Plages et activités", "Contacter la réception"] },
    de: { answer: "Ich habe Ihre Anfrage nicht sicher verstanden. Wählen Sie eine Aktion:", actions: ["Verfügbarkeit prüfen", "Zimmer empfehlen", "Strände und Aktivitäten", "Rezeption kontaktieren"] },
    it: { answer: "Non ho compreso la richiesta. Scegli un’azione per ricominciare:", actions: ["Controlla disponibilità", "Consiglia una camera", "Spiagge e attività", "Contatta la reception"] },
    es: { answer: "No he entendido la solicitud. Elige una acción para empezar de nuevo:", actions: ["Comprobar disponibilidad", "Recomendar una habitación", "Playas y actividades", "Contactar con recepción"] },
    tr: { answer: "Talebinizi net anlayamadım. Yeniden başlamak için bir işlem seçin:", actions: ["Müsaitlik kontrol et", "Oda öner", "Plajlar ve aktiviteler", "Resepsiyonla iletişim"] },
  };
  return menus[language] || menus.en;
}

function clarification(language: AssistantLanguage, missing: "checkin" | "checkout" | "guests") {`
  );
}

if (!source.includes('const unclearCommand =')) {
  source = source.replace(
    'const availabilityAction = command.actions.find((action) => action.type === "search_availability");',
    `const unclearCommand = !command.actions.length || command.actions.every((action) => action.type === "ask_clarification") || command.actions.every((action) => action.type === "search_content" && (!action.topic || action.topic === "general"));
    if (unclearCommand) {
      const fallback = fallbackMenu(command.language);
      return NextResponse.json({ answer: fallback.answer, menu: fallback.actions, search: {}, offers: [], knowledge: [], language: command.language, command, resetConversation: true });
    }
    const availabilityAction = command.actions.find((action) => action.type === "search_availability");`
  );
}

source = source.replace(
  'return NextResponse.json({ answer, search, offers: roomCards, language: command.language, selectedRoom: command.selectedRoom, command, knowledge: results });',
  'const showCards = command.actions.some((action) => ["recommend_beaches", "recommend_villages", "recommend_museums", "recommend_activities", "build_itinerary", "show_directions"].includes(action.type));\n    return NextResponse.json({ answer, search, offers: roomCards, language: command.language, selectedRoom: command.selectedRoom, command, knowledge: showCards ? results.slice(0, 3) : [] });'
);

fs.writeFileSync(file, source);
console.log('safe fallback backend patched');

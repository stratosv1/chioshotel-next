const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/ConversationalRoomSalesEnhanced.tsx");
let source = fs.readFileSync(file, "utf8");

source = source.replace(
  'type Offer = { roomId:string; unitId:string; name:string; category:string; floor:string; maxGuests:number; features:string[]; image:string; gallery?:string[]; nights:number; originalTotal:number; directTotal:number; saving:number };',
  'type Offer = { roomId:string; unitId:string; name:string; category:string; floor:string; maxGuests:number; features:string[]; image:string; gallery?:string[]; nights:number; originalTotal:number; directTotal:number; saving:number; recommendationRole?:"recommended"|"budget"|"comfort"|"alternative"; recommendationTitle?:string; recommendationReason?:string };'
);

if (!source.includes("const CURRENT_CHOICE_LABEL")) {
  source = source.replace(
    'const BREAKFAST_IMAGE = "/images/welcome/voulamandis-breakfast.jpg";',
    'const CURRENT_CHOICE_LABEL: Record<Language,string> = { el:"Τρέχουσα επιλογή", en:"Current choice", de:"Aktuelle Auswahl", fr:"Choix actuel", it:"Scelta attuale", es:"Selección actual", tr:"Mevcut seçim" };\nconst BREAKFAST_IMAGE = "/images/welcome/voulamandis-breakfast.jpg";'
  );
}

const oldEffect = ' useEffect(()=>{const detected=detectEntryLanguage();setLanguage(detected);setMessages([{role:"assistant",content:LANGUAGE_PROMPTS[detected]}])},[]);';
const newEffect = ' useEffect(()=>{const supported:Language[]=["el","en","de","fr","it","es","tr"];const requested=new URLSearchParams(window.location.search).get("lang")?.toLowerCase().split("-")[0]||"";const detected=supported.includes(requested as Language)?requested as Language:detectEntryLanguage();setLanguage(detected);const explicit=supported.includes(requested as Language);setStep(explicit?"checkin":"language");setMessages([{role:"assistant",content:explicit?T[detected].welcome:LANGUAGE_PROMPTS[detected]}])},[]);';
if (!source.includes('const explicit=supported.includes(requested as Language)')) {
  if (!source.includes(oldEffect)) throw new Error("Active assistant language effect not found");
  source = source.replace(oldEffect, newEffect);
}

source = source.replace(
  '<p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#c1354f]">Τρέχουσα επιλογή</p>',
  '<p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#c1354f]">{current.recommendationTitle || CURRENT_CHOICE_LABEL[language]}</p>'
);

const oldSearch = 'async function search(){setStep("searching");addA(t.searching);try{const all:Offer[][]=[];for(const guests of groups){const r=await fetch("/api/ai-assistant/smart",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:`Check live availability from ${checkin} to ${checkout} for ${guests} guests.`}],search:{checkin,checkout,guests},language})});const p=await r.json();all.push(Array.isArray(p?.offers)?p.offers:[])}setOffers(all);setActiveGroup(0);setIndex(0);setStep("selecting");addA(t.choose(1,groups[0]))}catch{setError("Live availability error");setStep("preferences")}}';
const newSearch = 'async function search(){setStep("searching");addA(t.searching);try{const all:Offer[][]=[];const recommendationAnswers:string[]=[];for(const guests of groups){const r=await fetch("/api/ai-assistant/smart",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:`Check live availability from ${checkin} to ${checkout} for ${guests} guests.`}],search:{checkin,checkout,guests},language})});const p=await r.json();all.push(Array.isArray(p?.offers)?p.offers:[]);if(typeof p?.answer==="string"&&p.answer.trim())recommendationAnswers.push(p.answer.trim())}setOffers(all);setActiveGroup(0);setIndex(0);setStep("selecting");if(recommendationAnswers[0])addA(recommendationAnswers[0]);addA(t.choose(1,groups[0]))}catch{setError("Live availability error");setStep("preferences")}}';
if (!source.includes('const recommendationAnswers:string[]=[]')) {
  if (!source.includes(oldSearch)) throw new Error("Active assistant search function not found");
  source = source.replace(oldSearch, newSearch);
}

if (!source.includes('current.recommendationTitle || CURRENT_CHOICE_LABEL[language]')) {
  throw new Error("Active assistant recommendation label was not applied");
}

fs.writeFileSync(file, source);
console.log("Applied language and recommendation logic to active AI assistant");

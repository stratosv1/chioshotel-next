const fs = require("node:fs");
const path = require("node:path");

function replaceOnce(source, needle, replacement, label) {
  if (!source.includes(needle)) throw new Error(`Missing ${label}`);
  return source.replace(needle, replacement);
}

const componentPath = path.join(process.cwd(), "components/ai/ConversationalRoomSalesEnhanced.tsx");
let component = fs.readFileSync(componentPath, "utf8");

component = replaceOnce(
  component,
  'type Offer = { roomId:string; unitId:string; name:string; category:string; floor:string; maxGuests:number; features:string[]; image:string; gallery?:string[]; nights:number; originalTotal:number; directTotal:number; saving:number; recommendationRole?:"recommended"|"budget"|"comfort"|"alternative"; recommendationTitle?:string; recommendationReason?:string };',
  'type Offer = { roomId:string; unitId:string; name:string; category:string; floor:string; maxGuests:number; features:string[]; image:string; gallery?:string[]; nights:number; originalTotal:number; directTotal:number; saving:number; recommendationRole?:"recommended"|"budget"|"comfort"|"alternative"; recommendationTitle?:string; recommendationReason?:string; splitStay?:boolean; splitPlan?:any };',
  "Offer split-stay fields",
);

const helperNeedle = 'function score(o:Offer,filters:Filter[]){const text=`${o.name} ${o.category} ${o.floor} ${(o.features||[]).join(" ")}`.toLowerCase();return filters.reduce((s,f)=>s+({economy:/econom|οικονομ|économ|preisgünst|ekonom/.test(text),noStairs:/χωρίς σκάλ|no stairs|keine treppen|sans escaliers|senza scale|sin escaleras|merdivensiz/.test(text),ground:/ισόγει|ground floor|erdgeschoss|rez-de-chaussée|piano terra|planta baja|zemin kat/.test(text),first:/πρώτ|first floor|erster stock|premier étage|primo piano|primera planta|birinci kat/.test(text),kitchen:/kitchen|κουζ|küche|cuisine|cucina|mutfak/.test(text),garden:/garden|κήπ|αυλ|garten|jardin|giardino|patio|bahçe|avlu/.test(text),balcony:/balcon|μπαλκόν|balkon/.test(text),family:/family|οικογεν|familien|familial|familiare|familiar|aile/.test(text)}[f]?10:0),0)}';
const helperReplacement = `${helperNeedle}

const SPLIT_COPY:Record<Language,{title:string;intro:string;stay:string;room:string;extra:string;select:string}>={
 el:{title:"Βρέθηκε διαθεσιμότητα",intro:"Βρέθηκε διαθεσιμότητα για ολόκληρη τη διαμονή σας 😊 Θα χρειαστεί μόνο μία αλλαγή δωματίου και για αυτή την αλλαγή σας προσφέρουμε επιπλέον έκπτωση 10%.",stay:"Διαμονή",room:"Δωμάτιο",extra:"Επιπλέον έκπτωση split stay 10%",select:"Επιλογή αυτής της διαμονής"},
 en:{title:"Availability found",intro:"We found availability for your full stay 😊 Only one room change is needed, and we are offering you an additional 10% discount for the change.",stay:"Stay",room:"Room",extra:"Extra split-stay discount 10%",select:"Choose this stay"},
 de:{title:"Verfügbarkeit gefunden",intro:"Wir haben Verfügbarkeit für Ihren gesamten Aufenthalt gefunden 😊 Es ist nur ein Zimmerwechsel nötig, dafür erhalten Sie zusätzlich 10% Rabatt.",stay:"Aufenthalt",room:"Zimmer",extra:"Zusätzlicher Split-Stay-Rabatt 10%",select:"Diesen Aufenthalt wählen"},
 fr:{title:"Disponibilité trouvée",intro:"Nous avons trouvé une disponibilité pour tout votre séjour 😊 Un seul changement de chambre sera nécessaire et nous vous offrons 10% de réduction supplémentaire.",stay:"Séjour",room:"Chambre",extra:"Réduction split stay supplémentaire 10%",select:"Choisir ce séjour"},
 it:{title:"Disponibilità trovata",intro:"Abbiamo trovato disponibilità per tutto il soggiorno 😊 Sarà necessario un solo cambio camera e per questo offriamo un ulteriore sconto del 10%.",stay:"Soggiorno",room:"Camera",extra:"Sconto split stay extra 10%",select:"Scegli questo soggiorno"},
 es:{title:"Disponibilidad encontrada",intro:"Hemos encontrado disponibilidad para toda tu estancia 😊 Solo será necesario un cambio de habitación y te ofrecemos un 10% de descuento adicional.",stay:"Estancia",room:"Habitación",extra:"Descuento split stay adicional 10%",select:"Elegir esta estancia"},
 tr:{title:"Müsaitlik bulundu",intro:"Tüm konaklamanız için müsaitlik bulduk 😊 Yalnızca bir oda değişikliği gerekecek ve bunun için ek %10 indirim sunuyoruz.",stay:"Konaklama",room:"Oda",extra:"Ek split stay indirimi %10",select:"Bu konaklamayı seç"}
};
const SPLIT_ROOM_IMAGE:Record<number,string>={1:"/images/rooms/DSC07776-2-e1675109942622.webp",2:"/images/rooms/DSC07803-1.webp",3:"/images/rooms/DSC07867-1.webp",4:"/images/rooms/received_1748354861920234.webp",5:"/images/rooms/voulamandis-house-rooms.webp",6:"/images/rooms/received_1753964631359257.webp",7:"/images/rooms/double-triple-room.jpg",8:"/images/rooms/chios-apartments-voulamandis.webp",9:"/images/rooms/chios-apartments-voulamandis.webp",10:"/images/rooms/DSC07899.webp"};
function formatSplitDate(value:string,language:Language){if(!value)return "";const date=new Date(value+"T12:00:00Z");return Number.isNaN(date.getTime())?value:new Intl.DateTimeFormat({el:"el-GR",en:"en-GB",de:"de-DE",fr:"fr-FR",it:"it-IT",es:"es-ES",tr:"tr-TR"}[language],{day:"numeric",month:"short"}).format(date)}
function SplitStayPresentation({offer,language,onSelect}:{offer:Offer;language:Language;onSelect:()=>void}){const copy=SPLIT_COPY[language];const plan=offer.splitPlan||{};const segments=[plan.first,plan.second].filter(Boolean);return <div className="mx-auto w-full max-w-xl space-y-3">{segments.map((segment:any,idx:number)=><article key={String(segment.roomNumber)+"-"+idx} className="overflow-hidden rounded-[22px] border border-stone-200 bg-white shadow-sm"><div className="grid grid-cols-[112px_1fr] sm:grid-cols-[160px_1fr]"><div className="relative min-h-[138px]"><Image src={SPLIT_ROOM_IMAGE[Number(segment.roomNumber)]||offer.image} alt={copy.room+" "+segment.roomNumber} fill sizes="160px" className="object-cover"/></div><div className="p-4"><p className="text-[11px] font-black uppercase tracking-[.12em] text-[#c1354f]">{copy.stay} {idx+1}</p><h3 className="mt-1 text-lg font-black">{copy.room} {segment.roomNumber}</h3><p className="mt-1 text-sm text-stone-600">{Number(segment.nights||0)} {language==="el"?(Number(segment.nights)===1?"βραδιά":"βραδιές"):language==="en"?(Number(segment.nights)===1?"night":"nights"):""}</p><p className="mt-2 text-xs font-semibold text-stone-500">{formatSplitDate(String(segment.checkin||""),language)} → {formatSplitDate(String(segment.checkout||""),language)}</p><div className="mt-3 flex flex-wrap gap-1.5"><span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-semibold">{copy.room} {segment.roomNumber}</span>{segment.name?<span className="max-w-full truncate rounded-full bg-stone-100 px-2 py-1 text-[10px] font-semibold">{segment.name}</span>:null}</div></div></div></article>)}<div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">✓ {copy.extra}</div><div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200"><div><p className="text-xs text-red-500 line-through">{money(offer.originalTotal,language)}</p><p className="text-2xl font-black text-emerald-700">{money(offer.directTotal,language)}</p></div><button onClick={onSelect} className="rounded-xl bg-[#ff385c] px-5 py-3 text-sm font-bold text-white">{copy.select}</button></div></div>}
`;
component = replaceOnce(component, helperNeedle, helperReplacement, "split-stay helper insertion");

component = replaceOnce(
  component,
  '{current.recommendationTitle || CURRENT_CHOICE_LABEL[language]}</p><p className="mt-1 text-[15px] font-semibold text-[#222]">{t.choose(activeGroup+1,groups[activeGroup])}</p></div><article className="mx-auto',
  '{current.splitStay?SPLIT_COPY[language].title:(current.recommendationTitle || CURRENT_CHOICE_LABEL[language])}</p><p className="mt-1 text-[15px] font-semibold leading-6 text-[#222]">{current.splitStay?SPLIT_COPY[language].intro:t.choose(activeGroup+1,groups[activeGroup])}</p></div>{current.splitStay?<SplitStayPresentation offer={current} language={language} onSelect={()=>select(current)}/>:<article className="mx-auto',
  "split-stay conditional card opening",
);
component = replaceOnce(component, '</div></article>{visible.length>1?', '</div></article>}{visible.length>1?', "split-stay conditional card closing");
component = component.replace('(current.features||[]).slice(0,3)', '(current.features||[]).slice(0,7)');
component = component.replace('className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-700"', 'className="max-w-full rounded-full bg-stone-100 px-2 py-1 text-[10px] font-medium leading-tight text-stone-700 sm:text-[11px]"');
fs.writeFileSync(componentPath, component);

const enhancerPath = path.join(process.cwd(), "components/ai/AiRoomDetailsEnhancer.tsx");
let enhancer = fs.readFileSync(enhancerPath, "utf8");
enhancer = replaceOnce(
  enhancer,
  '<div className={`mt-2 flex flex-wrap content-start gap-2 pr-1 transition-all ${expanded?"max-h-[220px] overflow-y-auto":"max-h-[128px] overflow-hidden"}`}>',
  '<div className={`mt-2 grid grid-cols-3 content-start gap-1.5 pr-1 transition-all sm:grid-cols-4 ${expanded?"max-h-[220px] overflow-y-auto":"max-h-[92px] overflow-hidden"}`}>',
  "amenity grid",
);
enhancer = replaceOnce(
  enhancer,
  'className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#f7f1e8] px-3 py-2 text-[12px] font-semibold text-stone-700"',
  'className="flex min-w-0 items-center justify-center gap-1 rounded-full border border-stone-200 bg-[#f7f1e8] px-1.5 py-1.5 text-center text-[9px] font-semibold leading-tight text-stone-700 sm:px-2 sm:text-[10px]" title={text}',
  "compact amenity badge",
);
fs.writeFileSync(enhancerPath, enhancer);
console.log("✓ Improved split-stay presentation and compacted amenity badges");

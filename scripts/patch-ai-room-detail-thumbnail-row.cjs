const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AiRoomDetailsEnhancer.tsx");
let source = fs.readFileSync(file, "utf8");

// Keep the full intrinsic image visible inside a compact fixed hero frame.
source = source.replace(
  'style={{height:"min(34dvh,290px)"}}',
  'style={{height:"clamp(210px,34dvh,300px)"}}',
);
source = source.replace(
  'style={{height:"min(42dvh,360px)"}}',
  'style={{height:"clamp(210px,34dvh,300px)"}}',
);
source = source.replace(
  'style={{height:"clamp(280px,48dvh,460px)"}}',
  'style={{height:"clamp(210px,34dvh,300px)"}}',
);
source = source.replace(
  'style={{bottom:"76px"}}',
  'style={{bottom:"10px"}}',
);
source = source.replace(
  'style={{bottom:"12px"}}',
  'style={{bottom:"10px"}}',
);
source = source.replace(
  'className="relative w-full overflow-hidden bg-stone-950" style={{height:"clamp(210px,34dvh,300px)"}}',
  'className="relative flex w-full items-center justify-center overflow-hidden bg-stone-950" style={{height:"clamp(210px,34dvh,300px)"}}',
);
source = source.replace(
  'className="relative w-full overflow-hidden bg-stone-950" style={{height:"min(42dvh,360px)"}}',
  'className="relative flex w-full items-center justify-center overflow-hidden bg-stone-950" style={{height:"clamp(210px,34dvh,300px)"}}',
);
source = source.replace(
  'className="absolute inset-0 h-full w-full object-contain" draggable={false}',
  'className="block max-h-full max-w-full object-contain" style={{width:"auto",height:"auto",objectFit:"contain",objectPosition:"center center"}} draggable={false}',
);
source = source.replace(
  'className="absolute inset-0 h-full w-full !object-contain" style={{objectFit:"contain",objectPosition:"center center"}} draggable={false}',
  'className="block max-h-full max-w-full object-contain" style={{width:"auto",height:"auto",objectFit:"contain",objectPosition:"center center"}} draggable={false}',
);

// Keep a single compact thumbnail row.
source = source.replace(
  /\{room\.images\.length>1\?<div(?: data-ai-detail-thumbnails="white")? className="[^"]*" aria-label=\{`\$\{t\.photo\} thumbnails`\}>\{room\.images\.map\(\(src,i\)=>[\s\S]*?<\/div>:\s*null\}/g,
  "",
);
source = source.replace(
  /<div className="flex gap-2 overflow-x-auto border-t border-white\/10 bg-stone-900[^>]*>\{room\.images\.map\(\(src,i\)=>[\s\S]*?<\/div><\/div>/g,
  "</div>",
);

const titleRow = '<div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="text-2xl font-black text-stone-950">{room.name}</h2><p className="mt-1 text-sm text-stone-500">{room.category}</p></div><div className="shrink-0 text-right">{room.originalPrice?<p className="text-xs text-stone-400 line-through">{room.originalPrice}</p>:null}<p className="text-2xl font-black text-[#43551b]">{room.directPrice}</p></div></div>';
const previousCompactTitleRow = '<div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="text-xl font-black leading-tight text-stone-950 sm:text-2xl">{room.name}</h2><p className="mt-0.5 text-xs text-stone-500 sm:text-sm">{room.category}</p></div><div className="shrink-0 text-right">{room.originalPrice?<p className="text-[11px] text-stone-400 line-through">{room.originalPrice}</p>:null}<p className="text-xl font-black text-[#43551b] sm:text-2xl">{room.directPrice}</p></div></div>';
const compactTitleRow = '<div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-black leading-tight text-stone-950 sm:text-2xl">{room.name}</h2>{room.saving?<span className="rounded-full bg-[#f3f6e8] px-2 py-1 text-[11px] font-bold text-[#63752d]">{t.saving}: {room.saving}</span>:null}</div><p className="mt-0.5 text-xs text-stone-500 sm:text-sm">{room.category}</p></div><div className="shrink-0 text-right">{room.originalPrice?<p className="text-[11px] text-stone-400 line-through">{room.originalPrice}</p>:null}<p className="text-xl font-black text-[#43551b] sm:text-2xl">{room.directPrice}</p></div></div>';
source = source.replace(titleRow, compactTitleRow);
source = source.replace(previousCompactTitleRow, compactTitleRow);

const thumbnailRowClass = 'mt-2 mb-2 flex min-h-[48px] shrink-0 items-start gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
const whiteThumbnails = `{room.images.length>1?<div data-ai-detail-thumbnails="white" className="${thumbnailRowClass}" aria-label={\`${'${t.photo}'} thumbnails\`}>{room.images.map((src,i)=><button key={\`${'${src}'}-${'${i}'}\`} type="button" onClick={()=>setPhoto(i)} className={\`relative h-11 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white shadow-sm ${'${i===photo?"border-[#ff385c] ring-1 ring-[#ffccd6]":"border-stone-200 opacity-90"}'}\`} aria-label={\`${'${t.photo}'} ${'${i+1}'}\`}><img src={src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false}/></button>)}</div>:null}`;

if (!source.includes(compactTitleRow)) throw new Error("AI detail compact title row not found");
source = source.replace(compactTitleRow, `${compactTitleRow}${whiteThumbnails}`);

// A split stay must show photos and amenities for both physical rooms.
source = source.replace(
  'const number=roomNumber(name); const images=ROOM_GALLERIES[number]||[];',
  'const numbers=Array.from(name.matchAll(/(?:Room|Δωμάτιο|Zimmer|Chambre|Camera|Habitación|Oda|Apartment|Διαμέρισμα)\\s*(10|[1-9])/gi)).map((m)=>Number(m[1])); const number=numbers[0]||roomNumber(name); const images=Array.from(new Set((numbers.length?numbers:[number]).flatMap((n)=>ROOM_GALLERIES[n]||[])));',
);
source = source.replace(
  'const image=useMemo(()=>room?.images[photo]||room?.images[0]||"",[room,photo]); if(!mounted||!room)return null; const t=COPY[room.language]; const features=featureList(room.roomNumber,room.language);',
  'const image=useMemo(()=>room?.images[photo]||room?.images[0]||"",[room,photo]); if(!mounted||!room)return null; const t=COPY[room.language]; const detailNumbers=Array.from(room.name.matchAll(/(?:Room|Δωμάτιο|Zimmer|Chambre|Camera|Habitación|Oda|Apartment|Διαμέρισμα)\\s*(10|[1-9])/gi)).map((m)=>Number(m[1])); const featureRooms=Array.from(new Set(detailNumbers.length?detailNumbers:[room.roomNumber])); const features=featureRooms.flatMap((n)=>featureList(n,room.language)).filter((item,index,list)=>list.findIndex((other)=>other.text===item.text)===index);',
);

source = source.replace(
  'const [room,setRoom]=useState<RoomDetails|null>(null); const [photo,setPhoto]=useState(0); const [mounted,setMounted]=useState(false); const [expanded,setExpanded]=useState(false);',
  'const [room,setRoom]=useState<RoomDetails|null>(null); const [photo,setPhoto]=useState(0); const [mounted,setMounted]=useState(false);',
);
source = source.replace('setPhoto(0);setExpanded(false);setRoom(details);', 'setPhoto(0);setRoom(details);');
source = source.replace(
  'className="flex min-h-0 flex-1 flex-col p-4 sm:p-5"',
  'className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-3 sm:p-4"',
);
source = source.replace(
  'className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-4 sm:p-5"',
  'className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-3 sm:p-4"',
);
source = source.replace(
  'className={`mt-2 flex flex-wrap content-start gap-2 pr-1 transition-all ${expanded?"max-h-[220px] overflow-y-auto":"max-h-[128px] overflow-hidden"}`}',
  'className="mt-1.5 grid grid-cols-4 gap-1.5"',
);
source = source.replace(
  'className={`mt-2 grid grid-cols-2 gap-2 pr-1 transition-all ${expanded?"max-h-[260px] overflow-y-auto":"max-h-[150px] overflow-hidden"}`}',
  'className="mt-1.5 grid grid-cols-4 gap-1.5"',
);
source = source.replace('className="mt-2 grid grid-cols-2 gap-2 pr-1 sm:grid-cols-3"', 'className="mt-1.5 grid grid-cols-4 gap-1.5"');
source = source.replace('className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4"', 'className="mt-1.5 grid grid-cols-4 gap-1.5"');
source = source.replace(
  'className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#f7f1e8] px-3 py-2 text-[12px] font-semibold text-stone-700"',
  'className="flex min-h-8 min-w-0 items-center justify-center gap-1 rounded-xl border border-stone-200 bg-[#f7f1e8] px-1.5 py-1.5 text-center text-[10px] font-semibold leading-3 text-stone-700 break-words sm:text-[11px]"',
);
source = source.replace(
  'className="flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-2xl border border-stone-200 bg-[#f7f1e8] px-2.5 py-2 text-center text-[12px] font-semibold leading-4 text-stone-700 break-words"',
  'className="flex min-h-8 min-w-0 items-center justify-center gap-1 rounded-xl border border-stone-200 bg-[#f7f1e8] px-1.5 py-1.5 text-center text-[10px] font-semibold leading-3 text-stone-700 break-words sm:text-[11px]"',
);
source = source.replace(/\{features\.length>7\?<button type="button" onClick=\{\(\)=>setExpanded\(v=>!v\)\} className="mt-2 self-start text-sm font-bold text-\[#435f12\] underline underline-offset-4">\{expanded\?t\.less:t\.more\}<\/button>:null\}/g, "");
source = source.replace('className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-stone-500"', 'className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-stone-500"');
source = source.replace('className="mt-auto pt-3"', 'className="mt-auto pt-2"');
source = source.replace('className="flex items-center justify-between rounded-2xl bg-[#f3f6e8] px-4 py-3 text-sm text-[#63752d]"', 'className="hidden"');
source = source.replace('className="flex items-center justify-between rounded-xl bg-[#f3f6e8] px-3 py-2 text-sm text-[#63752d]"', 'className="hidden"');
source = source.replace('className="mt-3 w-full rounded-2xl bg-[#ff385c] px-5 py-3.5 text-base font-bold text-white shadow-sm"', 'className="mt-2 w-full rounded-xl bg-[#ff385c] px-5 py-2.5 text-base font-bold text-white shadow-sm"');

if ((source.match(/data-ai-detail-thumbnails="white"/g) || []).length !== 1) throw new Error("AI detail modal must contain exactly one thumbnail row");
if (!source.includes('flatMap((n)=>ROOM_GALLERIES[n]||[])')) throw new Error("Split-stay gallery merge was not applied");
if (!source.includes('featureRooms.flatMap')) throw new Error("Split-stay amenities merge was not applied");
if (!source.includes('grid grid-cols-4 gap-1.5')) throw new Error("Four-column amenities grid was not applied");
if (!source.includes('block max-h-full max-w-full object-contain')) throw new Error("Hero image still uses a fill/crop layout");
if (!source.includes('{t.saving}: {room.saving}')) throw new Error("Savings badge was not moved beside the room title");
if (source.includes('expanded?t.less:t.more')) throw new Error("Amenities collapse control is still present");
if (!source.includes('overflow-y-auto overscroll-contain')) throw new Error("Room detail body fallback scroll is missing");

fs.writeFileSync(file, source);
console.log("AI room detail modal fixed: intrinsic full hero, savings beside title, four-column amenities");

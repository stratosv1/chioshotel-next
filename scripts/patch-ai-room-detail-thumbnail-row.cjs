const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AiRoomDetailsEnhancer.tsx");
let source = fs.readFileSync(file, "utf8");

source = source.replace(
  'style={{height:"min(34dvh,290px)"}}',
  'style={{height:"min(42dvh,360px)"}}',
);
source = source.replace(
  'style={{bottom:"76px"}}',
  'style={{bottom:"12px"}}',
);

// Keep a single thumbnail row. Older builds inserted a second row because the
// source row did not yet carry the data attribute used by the legacy patch.
source = source.replace(
  /\{room\.images\.length>1\?<div(?: data-ai-detail-thumbnails="white")? className="[^"]*" aria-label=\{`\$\{t\.photo\} thumbnails`\}>\{room\.images\.map\(\(src,i\)=>[\s\S]*?<\/div>:\s*null\}/g,
  "",
);

// Remove the old dark strip below the hero, if an older patch created it.
source = source.replace(
  /<div className="flex gap-2 overflow-x-auto border-t border-white\/10 bg-stone-900[^>]*>\{room\.images\.map\(\(src,i\)=>[\s\S]*?<\/div><\/div>/g,
  "</div>",
);

const titleRow = '<div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="text-2xl font-black text-stone-950">{room.name}</h2><p className="mt-1 text-sm text-stone-500">{room.category}</p></div><div className="shrink-0 text-right">{room.originalPrice?<p className="text-xs text-stone-400 line-through">{room.originalPrice}</p>:null}<p className="text-2xl font-black text-[#43551b]">{room.directPrice}</p></div></div>';
const thumbnailRowClass = 'mt-3 mb-4 flex min-h-[64px] shrink-0 items-start gap-2.5 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
const whiteThumbnails = `{room.images.length>1?<div data-ai-detail-thumbnails="white" className="${thumbnailRowClass}" aria-label={\`${'${t.photo}'} thumbnails\`}>{room.images.map((src,i)=><button key={\`${'${src}'}-${'${i}'}\`} type="button" onClick={()=>setPhoto(i)} className={\`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white shadow-sm ${'${i===photo?"border-[#ff385c] ring-2 ring-[#ffccd6]":"border-stone-200 opacity-90"}'}\`} aria-label={\`${'${t.photo}'} ${'${i+1}'}\`}><img src={src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false}/></button>)}</div>:null}`;

if (!source.includes(titleRow)) throw new Error("AI detail title row not found");
source = source.replace(titleRow, `${titleRow}${whiteThumbnails}`);

// A split stay must show photos and amenities for both physical rooms.
source = source.replace(
  'const number=roomNumber(name); const images=ROOM_GALLERIES[number]||[];',
  'const numbers=Array.from(name.matchAll(/(?:Room|Δωμάτιο|Zimmer|Chambre|Camera|Habitación|Oda|Apartment|Διαμέρισμα)\\s*(10|[1-9])/gi)).map((m)=>Number(m[1])); const number=numbers[0]||roomNumber(name); const images=Array.from(new Set((numbers.length?numbers:[number]).flatMap((n)=>ROOM_GALLERIES[n]||[])));',
);
source = source.replace(
  'const image=useMemo(()=>room?.images[photo]||room?.images[0]||"",[room,photo]); if(!mounted||!room)return null; const t=COPY[room.language]; const features=featureList(room.roomNumber,room.language);',
  'const image=useMemo(()=>room?.images[photo]||room?.images[0]||"",[room,photo]); if(!mounted||!room)return null; const t=COPY[room.language]; const detailNumbers=Array.from(room.name.matchAll(/(?:Room|Δωμάτιο|Zimmer|Chambre|Camera|Habitación|Oda|Apartment|Διαμέρισμα)\\s*(10|[1-9])/gi)).map((m)=>Number(m[1])); const featureRooms=Array.from(new Set(detailNumbers.length?detailNumbers:[room.roomNumber])); const features=featureRooms.flatMap((n)=>featureList(n,room.language)).filter((item,index,list)=>list.findIndex((other)=>other.text===item.text)===index);',
);

// Make the amenities visible on small screens instead of hiding the first row.
source = source.replace(
  'className={`mt-2 flex flex-wrap content-start gap-2 pr-1 transition-all ${expanded?"max-h-[220px] overflow-y-auto":"max-h-[128px] overflow-hidden"}`}',
  'className={`mt-2 grid grid-cols-2 gap-2 pr-1 transition-all ${expanded?"max-h-[260px] overflow-y-auto":"max-h-[150px] overflow-hidden"}`}',
);

if ((source.match(/data-ai-detail-thumbnails="white"/g) || []).length !== 1) {
  throw new Error("AI detail modal must contain exactly one thumbnail row");
}
if (!source.includes('flatMap((n)=>ROOM_GALLERIES[n]||[])')) throw new Error("Split-stay gallery merge was not applied");
if (!source.includes('featureRooms.flatMap')) throw new Error("Split-stay amenities merge was not applied");

fs.writeFileSync(file, source);
console.log("AI room detail modal fixed: one thumbnail row, combined split-stay gallery and visible amenities");

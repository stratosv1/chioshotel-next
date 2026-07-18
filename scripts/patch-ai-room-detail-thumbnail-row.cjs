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

// Remove the dark thumbnail strip below the hero, regardless of minor class changes.
source = source.replace(
  /<div className="flex gap-2 overflow-x-auto border-t border-white\/10 bg-stone-900[^>]*>\{room\.images\.map\(\(src,i\)=>[\s\S]*?<\/div><\/div>/,
  '</div>',
);

const titleRow = '<div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="text-2xl font-black text-stone-950">{room.name}</h2><p className="mt-1 text-sm text-stone-500">{room.category}</p></div><div className="shrink-0 text-right">{room.originalPrice?<p className="text-xs text-stone-400 line-through">{room.originalPrice}</p>:null}<p className="text-2xl font-black text-[#43551b]">{room.directPrice}</p></div></div>';
const whiteThumbnails = '{room.images.length>1?<div data-ai-detail-thumbnails="white" className="mt-3 flex gap-2.5 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={`${t.photo} thumbnails`}>{room.images.map((src,i)=><button key={src} type="button" onClick={()=>setPhoto(i)} className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white shadow-sm ${i===photo?"border-[#ff385c] ring-2 ring-[#ffccd6]":"border-stone-200 opacity-90"}`} aria-label={`${t.photo} ${i+1}`}><img src={src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false}/></button>)}</div>:null}';

if (!source.includes('data-ai-detail-thumbnails="white"')) {
  if (!source.includes(titleRow)) throw new Error("AI detail title row not found");
  source = source.replace(titleRow, `${titleRow}${whiteThumbnails}`);
} else {
  source = source
    .replace('className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"', 'className="mt-3 flex gap-2.5 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"')
    .replace('relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white shadow-sm', 'relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white shadow-sm')
    .replace('border-[#ff385c] ring-1 ring-[#ffccd6]', 'border-[#ff385c] ring-2 ring-[#ffccd6]')
    .replace('border-stone-200 opacity-80', 'border-stone-200 opacity-90');
}

if (source.includes('bg-stone-900 p-2.5')) throw new Error("Dark thumbnail strip still exists");
if (!source.includes('data-ai-detail-thumbnails="white"')) throw new Error("White thumbnail row was not inserted");
if (!source.includes('h-14 w-20')) throw new Error("Large thumbnail sizing was not applied");

fs.writeFileSync(file, source);
console.log("AI room detail thumbnails enlarged below title");
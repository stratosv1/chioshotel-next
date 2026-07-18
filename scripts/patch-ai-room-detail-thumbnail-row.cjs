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

const oldThumbnails = '<div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-stone-900 p-2.5 [scrollbar-width:none]">{room.images.map((src,i)=><button key={src} type="button" onClick={()=>setPhoto(i)} className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white shadow-sm ${i===photo?"border-white ring-2 ring-[#ff385c]":"border-white/70"}`} aria-label={`${t.photo} ${i+1}`}><img src={src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false}/></button>)}</div>';
source = source.replace(oldThumbnails, "");

const oldTitleRow = '<div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="text-2xl font-black text-stone-950">{room.name}</h2><p className="mt-1 text-sm text-stone-500">{room.category}</p></div><div className="shrink-0 text-right">{room.originalPrice?<p className="text-xs text-stone-400 line-through">{room.originalPrice}</p>:null}<p className="text-2xl font-black text-[#43551b]">{room.directPrice}</p></div></div>';
const newTitleRow = '<div className="flex items-start gap-3"><div className="min-w-0 flex-1"><h2 className="text-2xl font-black text-stone-950">{room.name}</h2><p className="mt-1 text-sm text-stone-500">{room.category}</p></div>{room.images.length>1?<div className="flex max-w-[46%] shrink-0 gap-1.5 overflow-x-auto pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={`${t.photo} thumbnails`}>{room.images.map((src,i)=><button key={src} type="button" onClick={()=>setPhoto(i)} className={`relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white shadow-sm ${i===photo?"border-[#ff385c] ring-1 ring-[#ffccd6]":"border-stone-200 opacity-80"}`} aria-label={`${t.photo} ${i+1}`}><img src={src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false}/></button>)}</div>:null}<div className="shrink-0 text-right">{room.originalPrice?<p className="text-xs text-stone-400 line-through">{room.originalPrice}</p>:null}<p className="text-2xl font-black text-[#43551b]">{room.directPrice}</p></div></div>';
source = source.replace(oldTitleRow, newTitleRow);

if (source.includes(oldThumbnails)) throw new Error("Old thumbnail strip was not removed");
if (!source.includes('max-w-[46%] shrink-0 gap-1.5 overflow-x-auto')) throw new Error("New title-row thumbnails were not applied");

fs.writeFileSync(file, source);
console.log("Moved AI room detail thumbnails beside title");

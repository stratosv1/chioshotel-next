const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AiRoomDetailsEnhancer.tsx");
let source = fs.readFileSync(file, "utf8");

const compactPanel =
  'className="flex h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:h-auto sm:max-h-[720px] sm:max-w-xl sm:rounded-[28px]"';

source = source.replace(
  'className="flex h-[94dvh] max-h-[820px] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"',
  compactPanel,
);

const blurredHero =
  '<div data-ai-detail-hero="blurred-contain" className="relative h-[38dvh] w-full overflow-hidden bg-stone-900 sm:h-[300px]"><img data-ai-detail-hero-background="true" src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-xl" draggable={false}/><div className="absolute inset-0 bg-black/15"/><img data-ai-detail-hero-image="true" src={image} alt={`${room.name} ${t.photo.toLowerCase()} ${photo+1}`} className="absolute inset-0 z-10 h-full w-full object-contain" style={{objectPosition:"center center"}} draggable={false}/></div>';

source = source.replace(
  '<div className="relative flex w-full items-center justify-center overflow-hidden bg-stone-950" style={{height:"clamp(210px,34dvh,300px)"}}><img src={image} alt={`${room.name} ${t.photo.toLowerCase()} ${photo+1}`} className="block max-h-full max-w-full object-contain" style={{width:"auto",height:"auto",objectFit:"contain",objectPosition:"center center"}} draggable={false}/></div>',
  blurredHero,
);
source = source.replace(
  '<div className="relative h-[38dvh] w-full overflow-hidden bg-stone-950 sm:h-[300px]"><img src={image} alt={`${room.name} ${t.photo.toLowerCase()} ${photo+1}`} className="absolute inset-0 h-full w-full object-cover" style={{objectPosition:"center center"}} draggable={false}/></div>',
  blurredHero,
);

source = source.replaceAll(
  'top-[30%] flex h-10 w-10 items-center',
  'top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center',
);
source = source.replaceAll(
  'top-1/2 flex h-10 w-10 -translate-y-1/2 items-center',
  'top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center',
);
source = source.replace(
  'className="absolute right-3 top-3 flex h-11 w-11',
  'className="absolute right-3 top-3 z-20 flex h-11 w-11',
);
source = source.replace(
  'className="absolute right-3 rounded-full',
  'className="absolute right-3 z-20 rounded-full',
);

source = source.replace(
  '<span className="rounded-full bg-[#f3f6e8] px-2 py-1 text-[11px] font-bold text-[#63752d]">{t.saving}: {room.saving}</span>',
  '<span data-ai-detail-saving="prominent" className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-[#c8d99c] bg-[#eef5dc] px-2.5 py-1 text-xs font-black text-[#43551b] shadow-sm">✓ {t.saving}: {room.saving}</span>',
);

source = source.replace(
  '{room.images.length>1?<div data-ai-detail-thumbnails="white" className="mt-2 mb-2 flex min-h-[48px] shrink-0 items-start gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={`${t.photo} thumbnails`}>{room.images.map((src,i)=><button key={`${src}-${i}`} type="button" onClick={()=>setPhoto(i)} className={`relative h-11 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white shadow-sm ${i===photo?"border-[#ff385c] ring-1 ring-[#ffccd6]":"border-stone-200 opacity-90"}`} aria-label={`${t.photo} ${i+1}`}><img src={src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false}/></button>)}</div>:null}',
  '{room.images.length>1?<div data-ai-detail-thumbnails="spread" className="mt-2 mb-2 grid w-full shrink-0 gap-2" style={{gridTemplateColumns:`repeat(${room.images.length}, minmax(0, 1fr))`}} aria-label={`${t.photo} thumbnails`}>{room.images.map((src,i)=><button key={`${src}-${i}`} type="button" onClick={()=>setPhoto(i)} className={`relative h-12 min-w-0 w-full overflow-hidden rounded-lg border-2 bg-white shadow-sm sm:h-14 ${i===photo?"border-[#ff385c] ring-1 ring-[#ffccd6]":"border-stone-200 opacity-90"}`} aria-label={`${t.photo} ${i+1}`}><img src={src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false}/></button>)}</div>:null}',
);

const required = [
  "viewAmenities: string",
  "const [amenitiesOpen,setAmenitiesOpen]=useState(false)",
  "onClick={()=>setAmenitiesOpen(true)}",
  "onClick={()=>setAmenitiesOpen(false)}",
  'role="dialog" aria-modal="true" aria-label={t.amenities}',
  "sm:h-auto sm:max-h-[720px] sm:max-w-xl",
  'data-ai-detail-hero="blurred-contain"',
  'data-ai-detail-hero-background="true"',
  "object-cover opacity-70 blur-xl",
  'data-ai-detail-hero-image="true"',
  "z-10 h-full w-full object-contain",
  'data-ai-detail-saving="prominent"',
  "✓ {t.saving}: {room.saving}",
  'data-ai-detail-thumbnails="spread"',
  'gridTemplateColumns:`repeat(${room.images.length}, minmax(0, 1fr))`',
  "featureRooms.flatMap",
];

for (const token of required) {
  if (!source.includes(token)) throw new Error(`AI room detail popup requirement missing: ${token}`);
}

if (source.includes('data-ai-detail-thumbnails="white"')) {
  throw new Error("Room detail thumbnails still use the old compact row");
}
if (source.includes('className="block max-h-full max-w-full object-contain"')) {
  throw new Error("Room detail hero still uses the old black-bar image layout");
}
if (source.includes("grid grid-cols-4 gap-1.5")) {
  throw new Error("Amenities are still rendered inline in the room detail card");
}
if (source.includes("expanded?t.less:t.more")) {
  throw new Error("Legacy amenities expand/collapse control is still present");
}

fs.writeFileSync(file, source);
console.log("AI room detail patched and validated: full photo over blurred background, prominent savings, spread thumbnails, amenities popup");

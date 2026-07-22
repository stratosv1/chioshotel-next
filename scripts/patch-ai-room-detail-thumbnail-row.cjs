const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AiRoomDetailsEnhancer.tsx");
let source = fs.readFileSync(file, "utf8");

const compactPanel =
  'className="flex max-h-[calc(100dvh-0.5rem)] w-full max-w-2xl flex-col overflow-x-hidden overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:max-h-[90dvh] sm:max-w-xl sm:rounded-[28px]"';

const panelVariants = [
  'className="flex h-[94dvh] max-h-[820px] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"',
  'className="flex h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:h-auto sm:max-h-[720px] sm:max-w-xl sm:rounded-[28px]"',
  'className="flex h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:h-auto sm:max-h-[90dvh] sm:max-w-xl sm:rounded-[28px]"',
];
for (const variant of panelVariants) source = source.replace(variant, compactPanel);

const intrinsicHero =
  '<div data-ai-detail-hero="intrinsic" className="relative w-full shrink-0 overflow-hidden bg-stone-100"><img data-ai-detail-hero-image="true" src={image} alt={`${room.name} ${t.photo.toLowerCase()} ${photo+1}`} className="block h-auto w-full" draggable={false}/></div>';

source = source.replace(
  '<div className="relative flex w-full items-center justify-center overflow-hidden bg-stone-950" style={{height:"clamp(210px,34dvh,300px)"}}><img src={image} alt={`${room.name} ${t.photo.toLowerCase()} ${photo+1}`} className="block max-h-full max-w-full object-contain" style={{width:"auto",height:"auto",objectFit:"contain",objectPosition:"center center"}} draggable={false}/></div>',
  intrinsicHero,
);
source = source.replace(
  '<div className="relative h-[38dvh] w-full overflow-hidden bg-stone-950 sm:h-[300px]"><img src={image} alt={`${room.name} ${t.photo.toLowerCase()} ${photo+1}`} className="absolute inset-0 h-full w-full object-cover" style={{objectPosition:"center center"}} draggable={false}/></div>',
  intrinsicHero,
);
source = source.replace(
  '<div data-ai-detail-hero="blurred-contain" className="relative h-[38dvh] w-full overflow-hidden bg-stone-900 sm:h-[300px]"><img data-ai-detail-hero-background="true" src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-xl" draggable={false}/><div className="absolute inset-0 bg-black/15"/><img data-ai-detail-hero-image="true" src={image} alt={`${room.name} ${t.photo.toLowerCase()} ${photo+1}`} className="absolute inset-0 z-10 h-full w-full object-contain" style={{objectPosition:"center center"}} draggable={false}/></div>',
  intrinsicHero,
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

source = source.replace(
  '<div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">',
  '<div data-ai-detail-content="natural" className="flex min-h-0 flex-col p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-4">',
);
source = source.replace(
  '<div className="mt-auto pt-2">',
  '<div data-ai-detail-action="inline" className="pt-3">',
);
source = source.replace(
  'className="mt-2 w-full rounded-xl bg-[#ff385c] px-5 py-2.5 text-base font-bold text-white shadow-sm"',
  'className="w-full rounded-xl bg-[#ff385c] px-5 py-2.5 text-base font-bold text-white shadow-sm"',
);

const required = [
  "viewAmenities: string",
  "const [amenitiesOpen,setAmenitiesOpen]=useState(false)",
  "onClick={()=>setAmenitiesOpen(true)}",
  "onClick={()=>setAmenitiesOpen(false)}",
  'role="dialog" aria-modal="true" aria-label={t.amenities}',
  "max-h-[calc(100dvh-0.5rem)]",
  "overflow-y-auto",
  "sm:max-h-[90dvh] sm:max-w-xl",
  'data-ai-detail-hero="intrinsic"',
  'data-ai-detail-hero-image="true"',
  'className="block h-auto w-full"',
  'data-ai-detail-saving="prominent"',
  "✓ {t.saving}: {room.saving}",
  'data-ai-detail-thumbnails="spread"',
  'gridTemplateColumns:`repeat(${room.images.length}, minmax(0, 1fr))`',
  'data-ai-detail-content="natural"',
  "pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
  'data-ai-detail-action="inline"',
  'className="pt-3"',
  "featureRooms.flatMap",
];

for (const token of required) {
  if (!source.includes(token)) throw new Error(`AI room detail popup requirement missing: ${token}`);
}

const forbidden = [
  'data-ai-detail-hero="blurred-contain"',
  'data-ai-detail-hero-background="true"',
  'data-ai-detail-thumbnails="white"',
  'className="block max-h-full max-w-full object-contain"',
  'h-[94dvh]',
  'flex min-h-0 flex-1 flex-col',
  'className="mt-auto pt-2"',
  'className="mt-2 w-full rounded-xl bg-[#ff385c]',
  "grid grid-cols-4 gap-1.5",
  "expanded?t.less:t.more",
];
for (const token of forbidden) {
  if (source.includes(token)) throw new Error(`AI room detail popup still contains legacy layout: ${token}`);
}

fs.writeFileSync(file, source);
console.log("AI room detail patched and validated: natural mobile height, inline CTA, intrinsic photo, prominent savings and spread thumbnails");

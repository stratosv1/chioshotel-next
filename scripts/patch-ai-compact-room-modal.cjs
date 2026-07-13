const fs = require('fs');
const path = require('path');

const componentFile = path.join(process.cwd(), 'components/ai/GuestAssistantMultilingual.tsx');
let source = fs.readFileSync(componentFile, 'utf8');

if (!source.includes('showAllAmenities')) {
  source = source.replace(
    '  const [requestSuccess, setRequestSuccess] = useState("");',
    '  const [requestSuccess, setRequestSuccess] = useState("");\n  const [showAllAmenities, setShowAllAmenities] = useState(false);'
  );
}

for (const [original, updated] of [
  ['direct: "Τιμή απευθείας"', 'direct: "Τιμή απευθείας", original: "Αρχική τιμή", amenities: "Παροχές", showAmenities: "Περισσότερα", hideAmenities: "Λιγότερα"'],
  ['direct: "Direct rate"', 'direct: "Direct rate", original: "Original price", amenities: "Amenities", showAmenities: "More", hideAmenities: "Less"'],
  ['direct: "Tarif direct"', 'direct: "Tarif direct", original: "Prix initial", amenities: "Équipements", showAmenities: "Plus", hideAmenities: "Moins"'],
  ['direct: "Direktpreis"', 'direct: "Direktpreis", original: "Ursprünglicher Preis", amenities: "Ausstattung", showAmenities: "Mehr", hideAmenities: "Weniger"'],
  ['direct: "Tariffa diretta"', 'direct: "Tariffa diretta", original: "Prezzo iniziale", amenities: "Servizi", showAmenities: "Altro", hideAmenities: "Meno"'],
  ['direct: "Tarifa directa"', 'direct: "Tarifa directa", original: "Precio original", amenities: "Servicios", showAmenities: "Más", hideAmenities: "Menos"'],
  ['direct: "Direkt fiyat"', 'direct: "Direkt fiyat", original: "İlk fiyat", amenities: "Olanaklar", showAmenities: "Daha fazla", hideAmenities: "Daha az"'],
]) {
  if (!source.includes(`${updated.split(', original:')[0]}, original:`)) source = source.replace(original, updated);
}

source = source.replace(
  'onClick={() => setDetailsOffer(o)}',
  'onClick={() => { setShowAllAmenities(false); setDetailsOffer(o); }}'
);

const modalStart = source.indexOf('{detailsOffer ? <div className="fixed inset-0');
const selectedOfferStart = source.indexOf('{selectedOffer ? <div className="fixed inset-0', modalStart);
if (modalStart === -1 || selectedOfferStart === -1) throw new Error('Room modal boundaries not found');

const newModal = `{detailsOffer ? <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden bg-stone-950/60 sm:items-center sm:p-4" role="dialog" aria-modal="true"><div className="relative flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[94dvh] sm:rounded-[2rem]"><div className="relative shrink-0"><RoomCarousel images={gallery} roomName={detailsOffer.name} /><button onClick={() => setDetailsOffer(null)} className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-xl shadow" aria-label={t.close}>✕</button></div><div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 pb-28"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold sm:text-2xl">{detailsOffer.name}</h2><p className="mt-0.5 text-sm text-stone-600">{detailsOffer.category} · {t.upTo} {detailsOffer.maxGuests} {t.people}</p></div>{!detailsOffer.preview ? <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">{t.live}</span> : null}</div><div className="mt-3 flex flex-wrap gap-1.5">{[detailsOffer.floor, ...detailsOffer.features].slice(0, 3).map((f) => <span key={f} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-stone-700">{f}</span>)}</div>{detailsOffer.features.length > 2 ? <div className="mt-3"><button type="button" onClick={() => setShowAllAmenities((value) => !value)} className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">{showAllAmenities ? t.hideAmenities : t.showAmenities}</button>{showAllAmenities ? <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 p-3"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-500">{t.amenities}</p><div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-stone-700">{detailsOffer.features.map((f) => <span key={f}>• {f}</span>)}</div></div> : null}</div> : null}{!detailsOffer.preview && search.checkin && search.checkout ? <div className="mt-3 flex items-center justify-between rounded-2xl bg-emerald-50 px-3 py-2.5 text-sm"><strong>{date(search.checkin)} → {date(search.checkout)}</strong><span>{search.guests} {t.people}</span></div> : null}</div><div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-stone-200 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]"><div className="min-w-0">{!detailsOffer.preview ? <><div className="flex items-baseline gap-2"><span className="text-xs text-stone-500">{t.original}</span><span className="text-sm text-stone-400 line-through">{euro(detailsOffer.originalTotal)}</span></div><div className="mt-0.5 flex items-baseline gap-2"><span className="text-xs font-semibold text-emerald-800">{t.direct}</span><span className="text-2xl font-black text-emerald-800">{euro(detailsOffer.directTotal)}</span></div></> : <p className="font-semibold">{t.viewRoom}</p>}</div>{detailsOffer.preview ? <button onClick={() => setDetailsOffer(null)} className="rounded-2xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white">{t.close}</button> : <button onClick={() => { setDetailsOffer(null); setSelectedOffer(detailsOffer); setRequestSuccess(""); }} className="shrink-0 rounded-2xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white">{t.interested}</button>}</div></div></div> : null}\n    `;

source = source.slice(0, modalStart) + newModal + source.slice(selectedOfferStart);
fs.writeFileSync(componentFile, source);

const carouselFile = path.join(process.cwd(), 'components/ui/RoomCarousel.tsx');
let carousel = fs.readFileSync(carouselFile, 'utf8');
carousel = carousel.replace('  const isApartment = /^apartment\\s+/i.test(roomName.trim());\n  const filteredImages = images.filter(Boolean);\n  const safeImages = isApartment ? filteredImages.slice(0, 1) : filteredImages;', '  const safeImages = images.filter(Boolean);');
carousel = carousel.replace('className="relative aspect-[16/10] overflow-hidden bg-stone-100 sm:aspect-[16/8]"', 'className="relative h-[36dvh] max-h-[300px] min-h-[220px] overflow-hidden bg-stone-100 sm:h-[360px] sm:max-h-none"');
carousel = carousel.replace('className="flex gap-2 overflow-x-auto px-4 py-3', 'className="flex gap-2 overflow-x-auto px-3 py-2');
carousel = carousel.replace('className={`relative h-16 w-24', 'className={`relative h-12 w-20');
fs.writeFileSync(carouselFile, carousel);
console.log('AI compact room modal applied');

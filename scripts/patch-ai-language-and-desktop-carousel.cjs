const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'components/ai/GuestAssistantMultilingual.tsx');
let source = fs.readFileSync(file, 'utf8');

if (!source.includes('const [languageChosen, setLanguageChosen]')) {
  source = source.replace(
    '  const [language, setLanguage] = useState<Language>("el");',
    '  const [language, setLanguage] = useState<Language>("el");\n  const [languageChosen, setLanguageChosen] = useState(false);'
  );
}

source = source.replace(
  '  useEffect(() => { const detected = detectLanguage(); setLanguage(detected); setMessages([{ role: "assistant", content: COPY[detected].welcome }]); }, []);',
  '  useEffect(() => { const detected = detectLanguage(); setLanguage(detected); }, []);'
);

for (const [from, to] of [
  ['direct: "Τιμή απευθείας"', 'direct: "Τιμή απευθείας", topPick: "Κορυφαία επιλογή", directDeal: "Απευθείας προσφορά", noCard: "Χωρίς κάρτα"'],
  ['direct: "Direct rate"', 'direct: "Direct rate", topPick: "Top pick", directDeal: "Direct deal", noCard: "No card needed"'],
  ['direct: "Tarif direct"', 'direct: "Tarif direct", topPick: "Meilleur choix", directDeal: "Offre directe", noCard: "Sans carte"'],
  ['direct: "Direktpreis"', 'direct: "Direktpreis", topPick: "Beste Wahl", directDeal: "Direktangebot", noCard: "Keine Karte nötig"'],
  ['direct: "Tariffa diretta"', 'direct: "Tariffa diretta", topPick: "Scelta migliore", directDeal: "Offerta diretta", noCard: "Senza carta"'],
  ['direct: "Tarifa directa"', 'direct: "Tarifa directa", topPick: "Mejor opción", directDeal: "Oferta directa", noCard: "Sin tarjeta"'],
  ['direct: "Direkt fiyat"', 'direct: "Direkt fiyat", topPick: "En iyi seçim", directDeal: "Doğrudan teklif", noCard: "Kart gerekmez"'],
]) {
  if (!source.includes(`${from}, topPick:`)) source = source.replace(from, to);
}

if (!source.includes('function chooseLanguage')) {
  source = source.replace(
    '  async function sendMessage(text: string) {',
    `  function chooseLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    setLanguageChosen(true);
    setMessages([{ role: "assistant", content: COPY[nextLanguage].welcome }]);
    setSearch({});
    setSelectedRoom(undefined);
    setError("");
  }

  function scrollOffers(id: string, direction: -1 | 1) {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollBy({ left: direction * Math.max(360, element.clientWidth * 0.72), behavior: "smooth" });
  }

  async function sendMessage(text: string) {`
  );
}

const offersStart = source.indexOf('{m.offers?.length ? <div');
const knowledgeStart = source.indexOf('{m.knowledge?.length ?', offersStart);
if (offersStart === -1 || knowledgeStart === -1) throw new Error('Offer carousel block not found');

const newOffers = `{m.offers?.length ? <div className="relative mt-5"><button type="button" onClick={() => scrollOffers(\`offers-${'${i}'}\`, -1)} className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl text-stone-800 shadow-lg ring-1 ring-stone-200 transition hover:scale-105 sm:grid" aria-label="Previous rooms">‹</button><div id={\`offers-${'${i}'}\`} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 sm:px-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{m.offers.map((o, offerIndex) => <button key={\`${'${o.roomId}:${o.unitId}'}\`} onClick={() => setDetailsOffer(o)} className="group w-[78vw] max-w-[315px] flex-none snap-start rounded-[1.25rem] border border-stone-200/70 bg-white p-2 text-left shadow-md shadow-stone-900/5 transition hover:-translate-y-1 hover:border-[#7b8a4b]/40 hover:shadow-lg hover:shadow-stone-900/10 sm:w-[330px] sm:max-w-none lg:w-[360px]"><div className="relative h-[165px] overflow-hidden rounded-[1rem] bg-stone-100 sm:h-[190px]"><Image src={o.image} alt={o.name} fill sizes="(max-width: 768px) 78vw, 360px" className="object-cover object-center transition duration-500 group-hover:scale-105" /><span className="absolute left-2 top-2 rounded-md bg-[#f8f1e4]/95 px-2.5 py-1 text-[10px] font-black text-[#765735] shadow-sm ring-1 ring-white/80">{offerIndex === 0 ? t.topPick : t.directDeal}</span><span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-950/30 text-white backdrop-blur-sm">♡</span></div><div className="px-1.5 pb-2 pt-2.5 sm:px-2"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate text-[17px] font-black leading-6 text-stone-950 sm:text-xl">{o.name}</h2><p className="mt-0.5 truncate text-[13px] font-semibold text-amber-800 sm:text-sm">{o.category}</p></div>{!o.preview ? <div className="shrink-0 text-right"><p className="text-[11px] text-stone-400 line-through">{euro(o.originalTotal)}</p><p className="text-[1.35rem] font-black leading-none text-[#17351f] sm:text-2xl">{euro(o.directTotal)}</p></div> : null}</div><div className="mt-2 flex flex-wrap gap-1.5"><span className="rounded-md bg-amber-100 px-2 py-1 text-[10px] font-black text-amber-900 ring-1 ring-amber-200">{t.directDeal}</span><span className="rounded-md bg-stone-100 px-2 py-1 text-[10px] font-black text-stone-700 ring-1 ring-stone-200">{t.noCard}</span><span className="rounded-md bg-[#eef2dc] px-2 py-1 text-[10px] font-black text-[#5f6f35] ring-1 ring-[#d9dfbc]">{o.preview ? t.photos : t.live}</span></div><div className="mt-2 flex flex-wrap gap-1.5"><span className="inline-flex items-center rounded-md bg-stone-100/90 px-2 py-1 text-[10px] font-bold text-stone-700 ring-1 ring-stone-200">{o.floor}</span><span className="inline-flex items-center rounded-md bg-stone-100/90 px-2 py-1 text-[10px] font-bold text-stone-700 ring-1 ring-stone-200">👤×{o.maxGuests}</span>{o.features.slice(0, 2).map((feature) => <span key={feature} className="inline-flex items-center rounded-md bg-stone-100/90 px-2 py-1 text-[10px] font-bold text-stone-700 ring-1 ring-stone-200">{feature}</span>)}</div>{!o.preview ? <p className="mt-2 text-xs font-semibold text-[#5f6f35]">{o.nights} {t.nights[o.nights === 1 ? 0 : 1]}</p> : <p className="mt-2 text-sm font-semibold text-[#17351f]">{t.viewRoom}</p>}</div></button>)}</div><button type="button" onClick={() => scrollOffers(\`offers-${'${i}'}\`, 1)} className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl text-stone-800 shadow-lg ring-1 ring-stone-200 transition hover:scale-105 sm:grid" aria-label="Next rooms">›</button></div> : null}\n        `;

source = source.slice(0, offersStart) + newOffers + source.slice(knowledgeStart);

if (!source.includes('Choose your language')) {
  source = source.replace(
    '  return <main className="min-h-[100dvh] bg-[#fbfaf7] text-stone-950">',
    `  if (!languageChosen) return <main className="grid min-h-[100dvh] place-items-center bg-[#fbfaf7] px-4 text-stone-950"><section className="w-full max-w-xl rounded-[2rem] border border-stone-200 bg-white p-6 text-center shadow-xl sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Voulamandis House</p><h1 className="mt-3 text-2xl font-bold sm:text-3xl">Choose your language</h1><p className="mt-2 text-sm text-stone-500">Επιλέξτε τη γλώσσα επικοινωνίας</p><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">{([['el','Ελληνικά'],['en','English'],['fr','Français'],['de','Deutsch'],['it','Italiano'],['es','Español'],['tr','Türkçe']] as [Language,string][]).map(([code,label]) => <button key={code} onClick={() => chooseLanguage(code)} className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900">{label}</button>)}</div></section></main>;

  return <main className="min-h-[100dvh] bg-[#fbfaf7] text-stone-950">`
  );
}

source = source.replace(
  'onChange={(e) => setLanguage(e.target.value as Language)}',
  'onChange={(e) => chooseLanguage(e.target.value as Language)}'
);

fs.writeFileSync(file, source);
console.log('AI language chooser and Live Deals styled carousel applied');

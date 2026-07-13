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

const oldOffers = `{m.offers?.length ? <div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{m.offers.map((o) => <button key={\`${'${o.roomId}:${o.unitId}'}\`} onClick={() => setDetailsOffer(o)} className="flex min-w-[86%] snap-start overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm sm:min-w-[48%]"><div className="relative w-28 shrink-0 bg-stone-100 sm:w-40"><Image src={o.image} alt={o.name} fill sizes="160px" className="object-cover" /></div><div className="flex min-w-0 flex-1 items-center justify-between gap-3 p-4"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold sm:text-lg">{o.name}</h2><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">{o.preview ? t.photos : t.live}</span></div><p className="mt-1 text-xs text-stone-500">{o.category} · {t.upTo} {o.maxGuests} {t.people}</p></div><div className="shrink-0 text-right">{o.preview ? <><p className="text-sm font-semibold text-emerald-800">{t.viewRoom}</p><p className="text-xs text-stone-500">{t.gallery}</p></> : <><p className="text-xs text-stone-400 line-through">{euro(o.originalTotal)}</p><p className="text-xl font-bold text-emerald-800">{euro(o.directTotal)}</p><p className="text-xs text-emerald-700">{o.nights} {t.nights[o.nights === 1 ? 0 : 1]}</p></>}</div></div></button>)}</div> : null}`;

const newOffers = `{m.offers?.length ? <div className="relative mt-5"><button type="button" onClick={() => scrollOffers(\`offers-${'${i}'}\`, -1)} className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl shadow-lg ring-1 ring-stone-200 hover:scale-105 sm:grid" aria-label="Previous rooms">‹</button><div id={\`offers-${'${i}'}\`} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 sm:px-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{m.offers.map((o) => <button key={\`${'${o.roomId}:${o.unitId}'}\`} onClick={() => setDetailsOffer(o)} className="flex min-w-[86%] snap-start overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:min-w-[62%] lg:min-w-[54%]"><div className="relative w-32 shrink-0 bg-stone-100 sm:w-48 lg:w-52"><Image src={o.image} alt={o.name} fill sizes="208px" className="object-cover" /></div><div className="flex min-w-0 flex-1 items-center justify-between gap-4 p-4 sm:p-5"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-semibold sm:text-xl">{o.name}</h2><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">{o.preview ? t.photos : t.live}</span></div><p className="mt-1.5 text-xs leading-5 text-stone-500 sm:text-sm">{o.category} · {t.upTo} {o.maxGuests} {t.people}</p></div><div className="shrink-0 text-right">{o.preview ? <><p className="text-sm font-semibold text-emerald-800">{t.viewRoom}</p><p className="text-xs text-stone-500">{t.gallery}</p></> : <><p className="text-xs text-stone-400 line-through">{euro(o.originalTotal)}</p><p className="text-xl font-bold text-emerald-800 sm:text-2xl">{euro(o.directTotal)}</p><p className="text-xs text-emerald-700">{o.nights} {t.nights[o.nights === 1 ? 0 : 1]}</p></>}</div></div></button>)}</div><button type="button" onClick={() => scrollOffers(\`offers-${'${i}'}\`, 1)} className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl shadow-lg ring-1 ring-stone-200 hover:scale-105 sm:grid" aria-label="Next rooms">›</button></div> : null}`;

if (source.includes(oldOffers)) {
  source = source.replace(oldOffers, newOffers);
} else if (!source.includes('id={`offers-${i}`}')) {
  throw new Error('Offer carousel block not found');
}

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
console.log('AI language chooser and desktop carousel controls applied');

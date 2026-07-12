const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'components/ai/GuestAssistantMultilingual.tsx');
let source = fs.readFileSync(file, 'utf8');

source = source.replace(
  '  preview?: boolean;\n};',
  '  preview?: boolean;\n  roomNumber?: number;\n  gallery?: string[];\n};'
);

source = source.replace(
  '  const [requestSuccess, setRequestSuccess] = useState("");',
  '  const [requestSuccess, setRequestSuccess] = useState("");\n  const [requestEmailSent, setRequestEmailSent] = useState(false);'
);

source = source.replace(
  '  useEffect(() => { document.body.style.overflow = detailsOffer || selectedOffer ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [detailsOffer, selectedOffer]);',
  `  useEffect(() => {
    if (!detailsOffer && !selectedOffer) return;
    const scrollY = window.scrollY;
    const previous = { position: document.body.style.position, top: document.body.style.top, width: document.body.style.width, overflow: document.body.style.overflow };
    document.body.style.position = "fixed";
    document.body.style.top = \`-\${scrollY}px\`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.width = previous.width;
      document.body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [detailsOffer, selectedOffer]);`
);

source = source.replace(
  'const gallery = useMemo(() => detailsOffer ? Array.from(new Set([detailsOffer.image, ...(ROOM_GALLERIES[`${detailsOffer.roomId}:${detailsOffer.unitId}`] || [])])) : [], [detailsOffer]);',
  'const gallery = useMemo(() => detailsOffer ? Array.from(new Set([detailsOffer.image, ...(detailsOffer.gallery || ROOM_GALLERIES[`${detailsOffer.roomId}:${detailsOffer.unitId}`] || [])].filter(Boolean))) : [], [detailsOffer]);'
);

if (!source.includes('function whatsappUrl')) {
  source = source.replace(
    '  async function submitRequest(event: FormEvent<HTMLFormElement>) {',
    `  function whatsappUrl(offer: Offer) {
    const lines = [
      "Hello Voulamandis House, I am interested in:",
      offer.name,
      \`Room ID: \${offer.roomId} · Unit ID: \${offer.unitId}\`,
      search.checkin && search.checkout ? \`\${search.checkin} → \${search.checkout}\` : "",
      search.guests ? \`\${search.guests} guests\` : "",
      requestName ? \`Name: \${requestName}\` : "",
      requestContact ? \`Contact: \${requestContact}\` : "",
      requestMessage ? \`Message: \${requestMessage}\` : "",
    ].filter(Boolean);
    return \`https://wa.me/306944474226?text=\${encodeURIComponent(lines.join("\\n"))}\`;
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {`
  );
}

source = source.replace(
  'const data = await response.json(); if (!response.ok || !data?.ok) throw new Error(data?.error || t.error); setRequestSuccess(t.success);',
  'const data = await response.json(); if (!response.ok || !data?.ok) throw new Error(data?.error || t.error); setRequestEmailSent(data.emailSent === true); setRequestSuccess(data.emailSent === true ? t.success : `${t.success} Email notification is pending; you can also contact us immediately on WhatsApp.`);'
);

source = source.replace(
  '<div className="mt-5 space-y-3">{m.offers.map((o) => <button',
  '<div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{m.offers.map((o) => <button'
);
source = source.replace(
  'className="flex w-full overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm"',
  'className="flex min-w-[86%] snap-start overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm sm:min-w-[48%]"'
);

source = source.replace(
  'className="fixed inset-0 z-40 flex items-end justify-center bg-stone-950/60 sm:items-center sm:p-5"',
  'className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden overscroll-none bg-stone-950/60 sm:items-center sm:p-5"'
);
source = source.replace(
  'className="relative flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]"',
  'className="relative flex h-[96dvh] max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden overscroll-contain rounded-t-[2rem] bg-white shadow-2xl sm:h-auto sm:rounded-[2rem]"'
);
source = source.replace(
  'className="overflow-y-auto p-5 pb-28"',
  'className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-28 touch-pan-y"'
);

source = source.replace(
  '<p className="mt-1 text-sm">{requestSuccess}</p></div>',
  '<p className="mt-1 text-sm">{requestSuccess}</p>{selectedOffer ? <a href={whatsappUrl(selectedOffer)} target="_blank" rel="noreferrer" className="mt-4 flex w-full items-center justify-center rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white">WhatsApp</a> : null}{!requestEmailSent ? <p className="mt-2 text-xs text-stone-500">Your request is saved even if the email notification is delayed.</p> : null}</div>'
);

source = source.replace(
  '<button disabled={requestSending} className="w-full rounded-2xl bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-50">{requestSending ? t.sending : t.submitRequest}</button><p className="text-center text-xs text-stone-500">{t.noAuto}</p>',
  '<button disabled={requestSending} className="w-full rounded-2xl bg-stone-950 px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-50">{requestSending ? t.sending : t.submitRequest}</button><a href={whatsappUrl(selectedOffer)} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white">WhatsApp</a><p className="text-center text-xs text-stone-500">{t.noAuto}</p>'
);

fs.writeFileSync(file, source);
console.log('AI room UI patched');

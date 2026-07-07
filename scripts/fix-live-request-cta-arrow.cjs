const fs = require("fs");

const file = "components/home/LiveDirectRequest.tsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
  'import { useEffect, useMemo, useState } from "react";',
  'import { useEffect, useMemo, useRef, useState } from "react";'
);

if (!s.includes("const roomsScrollerRef = useRef")) {
  s = s.replace(
    '  const [error, setError] = useState("");',
    '  const [error, setError] = useState("");\n  const roomsScrollerRef = useRef<HTMLDivElement | null>(null);'
  );
}

if (!s.includes("const smsHref =")) {
  s = s.replace(
    '  const requestHref = buildRequestHref(selectedRoom, selectedDates, guests, totals);',
    `  const requestHref = buildRequestHref(selectedRoom, selectedDates, guests, totals);
  const smsText = [
    "Instant request to reception - Voulamandis House",
    "",
    \`Room: \${selectedRoom ? \`\${selectedRoom.displayName} - \${selectedRoom.type}\` : "-"}\`,
    \`Guests: \${guests}\`,
    \`Dates: \${selectedDates.length ? selectedDates.join(", ") : "-"}\`,
    totals ? \`Nights: \${totals.nights}\` : null,
    totals ? \`Original price: \${money(totals.original)}\` : null,
    totals ? \`Direct offer: \${money(totals.direct)}\` : null,
    "",
    "Please confirm availability and send your best direct offer.",
  ].filter(Boolean).join("\\n");
  const smsHref = \`sms:+306944474226?&body=\${encodeURIComponent(smsText)}\`;`
  );
}

s = s.replace(
  '<span className="pointer-events-none absolute right-3 top-[88px] z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl font-black text-[#17351f] shadow-lg ring-1 ring-amber-900/10 md:right-4 md:top-[84px] md:h-11 md:w-11 md:text-2xl" aria-hidden="true">→</span>',
  '<button type="button" onClick={() => roomsScrollerRef.current?.scrollBy({ left: 330, behavior: "smooth" })} className="absolute right-3 top-[88px] z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl font-black text-[#17351f] shadow-lg ring-1 ring-amber-900/10 transition hover:scale-105 hover:bg-amber-50 md:right-4 md:top-[84px] md:h-11 md:w-11 md:text-2xl" aria-label="Show more available rooms">→</button>'
);

s = s.replace(
  '<div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-5 pr-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:px-2 md:pr-16 xl:gap-5">',
  '<div ref={roomsScrollerRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-5 pr-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:px-2 md:pr-16 xl:gap-5">'
);

s = s.replace(
  /<div className="mt-4 grid gap-3 pb-28 md:grid-cols-3 md:pb-0">[\s\S]*?<p className="mt-4 text-center text-xs font-semibold text-stone-500">Your instant request at chioshotel\.gr<\/p>/,
  `<div className="mt-4 grid gap-3 pb-28 md:grid-cols-3 md:pb-0">
            <a href={smsHref} className="flex min-h-14 items-center justify-center rounded-2xl bg-[#17351f] px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-[#224d2d]">Send SMS</a>
            <a href={requestHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center rounded-2xl border border-emerald-700/30 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-emerald-800 transition hover:bg-emerald-50">WhatsApp</a>
            <a href={CONTACT.phoneHref} className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-stone-800 transition hover:border-amber-700 hover:bg-amber-50">Call +30 22710 31733</a>
          </div>
          <p className="mt-4 text-center text-xs font-semibold text-stone-500">Your instant request at chioshotel.gr</p>`
);

fs.writeFileSync(file, s);
console.log("Updated LiveDirectRequest CTA buttons and clickable carousel arrow.");

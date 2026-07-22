const fs = require("node:fs");
const path = require("node:path");

const file = path.join(
  process.cwd(),
  "components/ai/ConversationalRoomSalesEnhanced.tsx",
);
let source = fs.readFileSync(file, "utf8");

source = source.replace(
  `!['language','preferences','interpreting','searching','selecting','breakfast','complete'].includes(step)?<form onSubmit={submit}`,
  `!['language','preferences','searching','selecting','breakfast','complete'].includes(step)?<form data-ai-chat-composer="persistent" onSubmit={step==="interpreting"?(event)=>event.preventDefault():submit}`,
);

source = source.replace(
  `placeholder={t.placeholder} className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-5 py-3.5 outline-none focus:border-[#222]"`,
  `placeholder={t.placeholder} enterKeyHint="send" aria-busy={step==="interpreting"} className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-5 py-3.5 outline-none focus:border-[#222]"`,
);

source = source.replace(
  `<button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-lg font-bold text-white shadow">↑</button>`,
  `<button type="submit" onPointerDown={(event)=>event.preventDefault()} disabled={step==="interpreting"||!input.trim()} aria-label={t.send} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-lg font-bold text-white shadow disabled:cursor-not-allowed disabled:opacity-50">↑</button>`,
);

source = source.replace(
  `<button type="submit" disabled={step==="interpreting"||!input.trim()} aria-label={t.send} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-lg font-bold text-white shadow disabled:cursor-not-allowed disabled:opacity-50">↑</button>`,
  `<button type="submit" onPointerDown={(event)=>event.preventDefault()} disabled={step==="interpreting"||!input.trim()} aria-label={t.send} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-lg font-bold text-white shadow disabled:cursor-not-allowed disabled:opacity-50">↑</button>`,
);

source = source.replace(
  `return <main className="min-h-[100dvh] bg-[#f7f7f7] text-[#222222]">`,
  `return <main data-ai-chat-shell="true" className="flex h-[var(--ai-visual-height,100dvh)] min-h-0 flex-col overflow-hidden bg-[#f7f7f7] text-[#222222]">`,
);

source = source.replace(
  `<div className="mx-auto max-w-3xl px-3 pb-28 pt-5 sm:px-5"><div className="space-y-4">`,
  `<div data-ai-chat-scroll="true" className="mx-auto min-h-0 w-full max-w-3xl flex-1 overflow-y-auto overscroll-contain px-3 pb-5 pt-5 sm:px-5"><div data-ai-conversation-feed="true" className="space-y-4">`,
);

source = source.replace(
  `<div className="mx-auto max-w-3xl px-3 pb-28 pt-5 sm:px-5"><div data-ai-conversation-feed="true" className="space-y-4">`,
  `<div data-ai-chat-scroll="true" className="mx-auto min-h-0 w-full max-w-3xl flex-1 overflow-y-auto overscroll-contain px-3 pb-5 pt-5 sm:px-5"><div data-ai-conversation-feed="true" className="space-y-4">`,
);

source = source.replace(
  `className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white/95 p-3 backdrop-blur"`,
  `className="z-20 shrink-0 border-t border-stone-200 bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur"`,
);

const required = [
  `data-ai-chat-shell="true"`,
  `h-[var(--ai-visual-height,100dvh)]`,
  `data-ai-chat-scroll="true"`,
  `min-h-0 w-full max-w-3xl flex-1 overflow-y-auto overscroll-contain`,
  `data-ai-chat-composer="persistent"`,
  `data-ai-conversation-feed="true"`,
  `!['language','preferences','searching','selecting','breakfast','complete'].includes(step)`,
  `onSubmit={step==="interpreting"?(event)=>event.preventDefault():submit}`,
  `enterKeyHint="send"`,
  `aria-busy={step==="interpreting"}`,
  `onPointerDown={(event)=>event.preventDefault()}`,
  `disabled={step==="interpreting"||!input.trim()}`,
  `aria-label={t.send}`,
  `pb-[calc(0.75rem+env(safe-area-inset-bottom))]`,
];

for (const token of required) {
  if (!source.includes(token)) {
    throw new Error(`AI mobile chat viewport requirement missing: ${token}`);
  }
}

const forbidden = [
  `min-h-[100dvh] bg-[#f7f7f7]`,
  `px-3 pb-28 pt-5`,
  `fixed inset-x-0 bottom-0 z-20`,
  `!['language','preferences','interpreting','searching','selecting','breakfast','complete'].includes(step)`,
];

for (const token of forbidden) {
  if (source.includes(token)) {
    throw new Error(`AI mobile chat still contains legacy page scrolling: ${token}`);
  }
}

fs.writeFileSync(file, source);
console.log(
  "AI mobile chat patched: visual viewport shell, internal message scroller, persistent keyboard focus",
);

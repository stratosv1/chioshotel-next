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
  `<div className="mx-auto max-w-3xl px-3 pb-28 pt-5 sm:px-5"><div className="space-y-4">`,
  `<div className="mx-auto max-w-3xl px-3 pb-28 pt-5 sm:px-5"><div data-ai-conversation-feed="true" className="space-y-4">`,
);

const required = [
  `data-ai-chat-composer="persistent"`,
  `data-ai-conversation-feed="true"`,
  `!['language','preferences','searching','selecting','breakfast','complete'].includes(step)`,
  `onSubmit={step==="interpreting"?(event)=>event.preventDefault():submit}`,
  `enterKeyHint="send"`,
  `aria-busy={step==="interpreting"}`,
  `onPointerDown={(event)=>event.preventDefault()}`,
  `disabled={step==="interpreting"||!input.trim()}`,
  `aria-label={t.send}`,
];

for (const token of required) {
  if (!source.includes(token)) {
    throw new Error(`AI mobile composer requirement missing: ${token}`);
  }
}

if (
  source.includes(
    `!['language','preferences','interpreting','searching','selecting','breakfast','complete'].includes(step)`,
  )
) {
  throw new Error("AI composer still unmounts while the assistant is interpreting");
}

fs.writeFileSync(file, source);
console.log(
  "AI mobile composer patched: persistent focus, anchored feed, send button does not steal focus",
);

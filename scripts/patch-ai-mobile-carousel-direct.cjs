const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AIRoomFinder.tsx");
let source = fs.readFileSync(file, "utf8");

source = source.replace(
  /className="mt-5 [^"]*flex snap-x snap-mandatory[^"]*overflow-x-auto[^"]*"/,
  'className="mt-5 -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 pr-16 scroll-px-4 overscroll-x-contain [scrollbar-width:thin] sm:-mx-1 sm:px-1 sm:pr-1"',
);

source = source.replace(
  /w-\[(?:300px|calc\(100vw-[^)]+\))\](?: max-w-\[340px\])? shrink-0 snap-start overflow-hidden rounded-\[20px\]/,
  'w-[calc(100vw-4.25rem)] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[20px]',
);

source = source.replace(
  /className="relative (?:h-\[166px\]|aspect-\[4\/3\] w-full) overflow-hidden bg-stone-100"/,
  'className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100"',
);

source = source.replace(
  /className="object-cover(?: object-center)? transition duration-300 group-hover:scale-\[1\.02\]"/,
  'className="object-cover object-center transition duration-300 group-hover:scale-[1.02]"',
);

if (!source.includes('w-[calc(100vw-4.25rem)]')) throw new Error("Mobile carousel width update failed");
if (!source.includes('pr-16 scroll-px-4')) throw new Error("Mobile carousel spacing update failed");
if (!source.includes('aspect-[4/3]')) throw new Error("Mobile carousel image ratio update failed");

fs.writeFileSync(file, source);
console.log("Applied resilient mobile carousel sizing and swipe affordance");

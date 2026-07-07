const fs = require("fs");

const file = "components/home/LiveDirectRequest.tsx";
let s = fs.readFileSync(file, "utf8");

const oldButton = `<button type="button" onClick={() => roomsScrollerRef.current?.scrollBy({ left: 330, behavior: "smooth" })} className="absolute right-3 top-[88px] z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl font-black text-[#17351f] shadow-lg ring-1 ring-amber-900/10 transition hover:scale-105 hover:bg-amber-50 md:right-4 md:top-[84px] md:h-11 md:w-11 md:text-2xl" aria-label="Show more available rooms">→</button>`;

const newButtons = `<button
                  type="button"
                  onClick={() => roomsScrollerRef.current?.scrollBy({ left: -330, behavior: "smooth" })}
                  className="absolute left-3 top-[88px] z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl font-black text-[#17351f] shadow-lg ring-1 ring-amber-900/10 transition hover:scale-105 hover:bg-amber-50 md:left-4 md:top-[84px] md:h-11 md:w-11 md:text-2xl"
                  aria-label="Show previous available rooms"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => roomsScrollerRef.current?.scrollBy({ left: 330, behavior: "smooth" })}
                  className="absolute right-3 top-[88px] z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl font-black text-[#17351f] shadow-lg ring-1 ring-amber-900/10 transition hover:scale-105 hover:bg-amber-50 md:right-4 md:top-[84px] md:h-11 md:w-11 md:text-2xl"
                  aria-label="Show more available rooms"
                >
                  →
                </button>`;

if (!s.includes(oldButton)) {
  throw new Error("Current carousel arrow button was not found. Stop and inspect LiveDirectRequest.tsx.");
}

s = s.replace(oldButton, newButtons);

fs.writeFileSync(file, s, "utf8");
console.log("Added left and right carousel arrows.");

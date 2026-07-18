const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AIRoomFinder.tsx");
let source = fs.readFileSync(file, "utf8");

source = source.replace('interestedRoom: "Ενδιαφέρομαι για αυτό το δωμάτιο",', 'interestedRoom: "Στείλτε αίτημα στη reception",');
source = source.replace('interestedRoom: "I\'m interested in this room",', 'interestedRoom: "Send request to reception",');

source = source.replace(
  /<div className="mt-3 grid grid-cols-2 gap-3">\s*<a href=\{whatsappHref\}[\s\S]*?<\/a>\s*<button type="button" onClick=\{\(\) => openRequest\(activeOffer\)\}[\s\S]*?<\/button>\s*<\/div>/,
  '<div className="mt-3"><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[1.35rem] border border-[#d8d1c3] bg-white px-4 py-3 text-base font-semibold text-stone-900"><WhatsappIcon className="h-7 w-7 text-[#17944b]" />{t.whatsapp}</a></div>',
);

if (source.includes('<MailIcon className="h-7 w-7" />{t.email}')) {
  throw new Error("Duplicate email CTA still present");
}
if (!source.includes('Στείλτε αίτημα στη reception')) {
  throw new Error("Primary reception CTA label was not updated");
}

fs.writeFileSync(file, source);
console.log("Removed duplicate email CTA and clarified reception request action");

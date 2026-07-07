const fs = require("fs");

const file = "components/home/LiveDirectRequest.tsx";
let s = fs.readFileSync(file, "utf8");

// 1) Add email href to CONTACT, only if it does not already exist
if (!s.includes(`emailHref: "mailto:chioshotel@gmail.com`)) {
  s = s.replace(
    `phoneDisplay: "+30 22710 31733",
  whatsapp: "306944474226",`,
    `phoneDisplay: "+30 22710 31733",
  emailHref: "mailto:chioshotel@gmail.com?subject=Direct%20request%20-%20Voulamandis%20House",
  whatsapp: "306944474226",`
  );
}

// 2) Change the third CTA label from Call to Email in all languages
const replacements = [
  [`call: "Call +30 22710 31733",`, `call: "Email chioshotel@gmail.com",`],
  [`call: "Κλήση +30 22710 31733",`, `call: "Email chioshotel@gmail.com",`],
  [`call: "Appeler +30 22710 31733",`, `call: "Email chioshotel@gmail.com",`],
  [`call: "Anrufen +30 22710 31733",`, `call: "E-Mail chioshotel@gmail.com",`],
  [`call: "Chiama +30 22710 31733",`, `call: "Email chioshotel@gmail.com",`],
  [`call: "Llamar +30 22710 31733",`, `call: "Email chioshotel@gmail.com",`],
  [`call: "+30 22710 31733 ara",`, `call: "E-posta chioshotel@gmail.com",`],
];

for (const [from, to] of replacements) {
  s = s.replace(from, to);
}

// 3) Hide the in-widget CTA block on mobile, keep it visible from md and up
s = s.replace(
  `className="mt-4 grid gap-3 pb-10 md:grid-cols-3 md:pb-0"`,
  `className="mt-4 hidden gap-3 pb-10 md:grid md:grid-cols-3 md:pb-0"`
);

// 4) Change only the third CTA href from phone to email
s = s.replace(
  `<a href={CONTACT.phoneHref} className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] !text-stone-800 transition hover:border-amber-700 hover:bg-amber-50">{copy.call}</a>`,
  `<a href={CONTACT.emailHref} className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] !text-stone-800 transition hover:border-amber-700 hover:bg-amber-50">{copy.call}</a>`
);

fs.writeFileSync(file, s, "utf8");
console.log("Done: desktop third CTA is email, mobile uses sticky CTA only.");

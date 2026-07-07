const fs = require("fs");

const file = "components/home/LiveDirectRequest.tsx";
let s = fs.readFileSync(file, "utf8");

if (!s.includes(`emailHref:`)) {
  s = s.replace(
    `phoneDisplay: "+30 22710 31733",`,
    `phoneDisplay: "+30 22710 31733",
  emailHref: "mailto:chioshotel@gmail.com?subject=Direct%20request%20-%20Voulamandis%20House",`
  );
}

fs.writeFileSync(file, s, "utf8");
console.log("Added CONTACT.emailHref.");

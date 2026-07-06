const fs = require("fs");

const contentFile = "content/pre-arrival.ts";
const componentFile = "components/pre-arrival/PreArrivalPage.tsx";

/* 1. Fix central contact config */
let content = fs.readFileSync(contentFile, "utf8");

content = content.replace(/phoneDisplay:\s*"[^"]*"/, 'phoneDisplay: "+306944764654"');
content = content.replace(/phoneHref:\s*"[^"]*"/, 'phoneHref: "tel:+306944764654"');

content = content.replace(/whatsappDisplay:\s*"[^"]*"/, 'whatsappDisplay: "+306944474226"');
content = content.replace(/whatsappBase:\s*"[^"]*"/, 'whatsappBase: "https://wa.me/306944474226"');

content = content.replace(/smsDisplay:\s*"[^"]*"/, 'smsDisplay: "+6944474226"');
content = content.replace(/smsBase:\s*"[^"]*"/, 'smsBase: "sms:+6944474226"');

content = content.replace(/email:\s*"[^"]*"/, 'email: "chioshotel@gmail.com"');

fs.writeFileSync(contentFile, content, "utf8");

/* 2. Fix displayed numbers inside component copies */
let component = fs.readFileSync(componentFile, "utf8");

component = component.replaceAll("+30 6944764654", "+306944764654");
component = component.replaceAll("+30 6944474226", "+306944474226");

/* SMS display must be the exact SMS number requested */
component = component.replaceAll('smsNumber: "+306944474226"', 'smsNumber: "+6944474226"');
component = component.replaceAll('smsNumber: "+30 6944474226"', 'smsNumber: "+6944474226"');

/* Make SMS href cleaner: sms:+number?body=... */
component = component.replace(
  /const smsHref = `\$\{preArrivalContact\.smsBase\}\?\&body=\$\{encodeURIComponent\(pageCopy\.message\)\}`;/,
  'const smsHref = `${preArrivalContact.smsBase}?body=${encodeURIComponent(pageCopy.message)}`;'
);

component = component.replace(
  /const smsHref = `\$\{preArrivalContact\.smsBase\}\?body=\$\{encodeURIComponent\(pageCopy\.message\)\}`;/,
  'const smsHref = `${preArrivalContact.smsBase}?body=${encodeURIComponent(pageCopy.message)}`;'
);

fs.writeFileSync(componentFile, component, "utf8");

/* 3. Verify */
const finalContent = fs.readFileSync(contentFile, "utf8");
const finalComponent = fs.readFileSync(componentFile, "utf8");

const checks = [
  ["phone href", 'phoneHref: "tel:+306944764654"', finalContent],
  ["email", 'email: "chioshotel@gmail.com"', finalContent],
  ["sms base", 'smsBase: "sms:+6944474226"', finalContent],
  ["whatsapp base", 'whatsappBase: "https://wa.me/306944474226"', finalContent],
  ["sms clean href", "preArrivalContact.smsBase}?body=", finalComponent],
];

for (const [label, needle, source] of checks) {
  console.log(label, source.includes(needle) ? "OK" : "MISSING");
}

const fs = require("fs");

const file = "components/home/LiveDirectRequest.tsx";
let s = fs.readFileSync(file, "utf8");

// Fix buildRequestHref signature: add copy as first argument
s = s.replace(
  /function buildRequestHref\(\s*room: RoomMeta \| null,/,
  `function buildRequestHref(
  copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale],
  room: RoomMeta | null,`
);

// Fix buildRequestHref call
s = s.replace(
  /buildRequestHref\(selectedRoom, selectedDates, guests, totals\)/g,
  `buildRequestHref(copy, selectedRoom, selectedDates, guests, totals)`
);

// Show the function header for verification
const idx = s.indexOf("function buildRequestHref");
console.log(s.slice(idx, idx + 260));

fs.writeFileSync(file, s, "utf8");

const fs = require("fs");

const file = "components/home/LiveDirectRequest.tsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
  `function SalesBadges({ compact = false }: { compact?: boolean }) {`,
  `function SalesBadges({
  compact = false,
  copy,
}: {
  compact?: boolean;
  copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale];
}) {`
);

s = s.replace(`>Best direct offer</span>`, `>{copy.trustItems[0].title}</span>`);
s = s.replace(`>No card needed</span>`, `>{copy.trustItems[3].title}</span>`);
s = s.replace(`>Direct reply</span>`, `>{copy.trustItems[1].title}</span>`);

s = s.replaceAll(`<SalesBadges compact />`, `<SalesBadges compact copy={copy} />`);
s = s.replaceAll(`<SalesBadges />`, `<SalesBadges copy={copy} />`);

fs.writeFileSync(file, s, "utf8");
console.log("Localized live request sales badges.");

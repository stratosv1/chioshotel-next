const fs = require("fs");

const files = [
  "app/chios-rooms/standard-double-room/layout.tsx",
  "app/chios-rooms/economy-double-rooms/layout.tsx",
];

for (const file of files) {
  let s = fs.readFileSync(file, "utf8");

  if (!s.includes('room-detail-floor-groups.css')) {
    s = s.replace(
      'import "../../css-split/pages/room-detail-cards.css";',
      'import "../../css-split/pages/room-detail-cards.css";\nimport "../../css-split/pages/room-detail-floor-groups.css";'
    );
  }

  fs.writeFileSync(file, s, "utf8");
  console.log(`Patched ${file}`);
}

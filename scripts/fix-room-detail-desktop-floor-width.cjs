const fs = require("fs");

const file = "app/css-split/pages/room-detail-floor-groups.css";
let s = fs.readFileSync(file, "utf8");

const patch = `
/* Desktop polish: use the full group width instead of leaving empty space. */
@media (min-width: 901px) {
  .rd-individual-list--carousel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
    align-items: stretch;
  }

  .rd-individual-list--carousel .rd-room-card {
    width: 100%;
  }

  .rd-floor-group:has(.rd-room-card:only-child) .rd-individual-list--carousel {
    grid-template-columns: minmax(0, 1fr);
  }

  .rd-floor-group:has(.rd-room-card:only-child) .rd-room-card {
    max-width: 760px;
    justify-self: center;
  }
}
`;

if (!s.includes("Desktop polish: use the full group width")) {
  s = s.trimEnd() + "\n\n" + patch.trim() + "\n";
  fs.writeFileSync(file, s, "utf8");
  console.log("Patched desktop floor group card width");
} else {
  console.log("Already patched");
}

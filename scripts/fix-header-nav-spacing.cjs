const fs = require("fs");

const file = "app/globals.css";
let text = fs.readFileSync(file, "utf8");

const blockName = "/* Chios Activities header nav fit fix */";

const css = `
${blockName}
.vh-header__inner {
  gap: clamp(0.6rem, 1vw, 1.1rem);
}

.vh-header__brand {
  flex: 0 0 auto;
}

.vh-header__nav {
  flex: 1 1 auto;
  min-width: 0;
  justify-content: center;
  gap: clamp(0.55rem, 0.8vw, 1rem);
}

.vh-header__nav a {
  white-space: nowrap;
  font-size: clamp(0.72rem, 0.78vw, 0.9rem);
}

.vh-header__actions {
  flex: 0 0 auto;
  gap: clamp(0.45rem, 0.7vw, 0.8rem);
}

@media (max-width: 1320px) {
  .vh-header__nav {
    gap: 0.5rem;
  }

  .vh-header__nav a {
    font-size: 0.74rem;
  }

  .vh-header__book {
    padding-inline: 1rem;
  }
}
`;

if (!text.includes(blockName)) {
  text += "\n" + css + "\n";
  fs.writeFileSync(file, text, "utf8");
  console.log("SUCCESS: Header nav spacing CSS added.");
} else {
  console.log("SKIPPED: Header nav spacing CSS already exists.");
}

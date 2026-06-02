const fs = require("fs");

const file = "components/VoulamandisHeader.tsx";
let text = fs.readFileSync(file, "utf8");

text = text.replace(
  /chiosActivities:\s*"Actividades en Qu[^"]*",/,
  'chiosActivities: "Actividades en Quíos",'
);

fs.writeFileSync(file, text, "utf8");

if (text.includes('chiosActivities: "Actividades en Quíos",')) {
  console.log("SUCCESS: Spanish Chios Activities label fixed.");
} else {
  console.log("NEEDS REVIEW: Spanish label was not fixed.");
  process.exit(1);
}

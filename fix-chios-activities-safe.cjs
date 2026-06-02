const fs = require("fs");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

/* Fix homepage links safely */
const homePath = "content/home.ts";
let home = read(homePath);

home = home.replace(
  'href: "/chios-island/",\n        imageClass: "vh-link-image--orchids",',
  'href: "/chios-orchids/",\n        imageClass: "vh-link-image--orchids",'
);

home = home.replace(
  'href: "/chios-island/",\n        imageClass: "vh-link-image--springs",',
  'href: "/chios-thermal-baths/",\n        imageClass: "vh-link-image--springs",'
);

home = home.replace(
  'orchids: "/el/ti-na-do-sti-xio/",\n        "thermal-springs": "/el/ti-na-do-sti-xio/",',
  'orchids: "/el/orchidees-xiou/",\n        "thermal-springs": "/el/iamatika-loutra-xiou/",'
);

home = home.replace(
  'orchids: "/fr/chios-en-grece/",\n        "thermal-springs": "/fr/chios-en-grece/",',
  'orchids: "/fr/orchidees-de-chios/",\n        "thermal-springs": "/fr/sources-thermales-de-chios/",'
);

home = home.replace(
  'orchids: "/de/chios-insel/",\n        "thermal-springs": "/de/chios-insel/",',
  'orchids: "/de/orchideen-auf-chios/",\n        "thermal-springs": "/de/thermalquellen-auf-chios/",'
);

home = home.replace(
  'orchids: "/it/chios-lisola-in-grecia/",\n        "thermal-springs": "/it/chios-lisola-in-grecia/",',
  'orchids: "/it/orchidee-di-chios/",\n        "thermal-springs": "/it/terme-di-chios/",'
);

home = home.replace(
  'orchids: "/es/chios-en-grecia/",\n        "thermal-springs": "/es/chios-en-grecia/",',
  'orchids: "/es/orquideas-de-quios/",\n        "thermal-springs": "/es/banos-termales-de-quios/",'
);

home = home.replace(
  'orchids: "/tr/sakiz-adasi/",\n        "thermal-springs": "/tr/sakiz-adasi/",',
  'orchids: "/tr/sakiz-adasi-orkideleri/",\n        "thermal-springs": "/tr/sakiz-adasi-termal-kaplicalari/",'
);

write(homePath, home);

/* Add Chios Activities hub hero image safely */
const activitiesPath = "content/chios-activities.ts";
let activities = read(activitiesPath);

if (!activities.includes("ChatGPT-Image-Feb-13-2026-06_09_19-PM.png")) {
  activities = activities.replace(
    `hero: {
      eyebrow: "Voulamandis House recommends",
      title: "What Can You Do in Chios?",
      subtitle:
        "Authentic activities, local traditions, natural beauty, and unforgettable experiences during your stay in Chios.",
    },`,
    `hero: {
      eyebrow: "Voulamandis House recommends",
      title: "What Can You Do in Chios?",
      subtitle:
        "Authentic activities, local traditions, natural beauty, and unforgettable experiences during your stay in Chios.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2026/02/ChatGPT-Image-Feb-13-2026-06_09_19-PM.png",
      imageAlt: "Chios activities and experiences recommended by Voulamandis House",
    },`
  );
}

write(activitiesPath, activities);

console.log("Homepage encoding restored, links patched, and Chios Activities hero image patched.");

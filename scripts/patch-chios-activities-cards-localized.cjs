const fs = require("fs");

const file = "content/chios-activities.ts";
let text = fs.readFileSync(file, "utf8");

const start = text.indexOf("\nfunction getHubCards(");
const end = text.indexOf("\nfunction baseCta(", start);

if (start === -1 || end === -1) {
  console.error("ERROR: Could not find getHubCards block.");
  process.exit(1);
}

const replacement = `
const hubCardCopy: Record<
  LanguageCode,
  Record<
    Exclude<ChiosActivityKey, "hub">,
    {
      title: string;
      description: string;
      imageAlt: string;
      buttonLabel: string;
    }
  >
> = {
  en: {
    mostra: {
      title: "Chios Festival - Mostra",
      description:
        "Discover the colorful carnival tradition of Thymiana with music, costumes and local celebration.",
      imageAlt: "Chios Festival Mostra in Thymiana",
      buttonLabel: "Explore Mostra Festival",
    },
    greekCourses: {
      title: "Greek Language Courses in Chios",
      description:
        "Learn Greek while discovering the culture, history, customs and everyday life of Chios.",
      imageAlt: "Greek language courses in Chios",
      buttonLabel: "Discover Greek Courses",
    },
    hiking: {
      title: "Chios Hiking",
      description:
        "Follow scenic trails through mastic villages, mountain landscapes, coastal paths and nature routes.",
      imageAlt: "Hiking trails in Chios",
      buttonLabel: "Go Hiking in Chios",
    },
    thermalBaths: {
      title: "Chios Thermal Baths",
      description:
        "Relax at the natural thermal springs of Agiasmata and enjoy a peaceful wellness experience.",
      imageAlt: "Agiasmata thermal baths in Chios",
      buttonLabel: "Relax at Thermal Baths",
    },
    rocketWar: {
      title: "Rocket War of Chios Island",
      description:
        "Experience Rouketopolemos, the famous Easter tradition of Vrontados that lights up the night sky.",
      imageAlt: "Rocket War of Chios Island",
      buttonLabel: "Experience the Rocket War",
    },
    orchids: {
      title: "Chios Orchids",
      description:
        "Discover the wild orchids and spring flowers that make Chios a special botanical destination.",
      imageAlt: "Wild orchids of Chios",
      buttonLabel: "Discover Chios Orchids",
    },
  },

  el: {
    mostra: {
      title: "Μόστρα Θυμιανών",
      description:
        "Γνωρίστε το πολύχρωμο καρναβαλικό έθιμο των Θυμιανών με μουσική, χορό και τοπική γιορτή.",
      imageAlt: "Μόστρα στα Θυμιανά της Χίου",
      buttonLabel: "Δείτε τη Μόστρα",
    },
    greekCourses: {
      title: "Μαθήματα Ελληνικών στη Χίο",
      description:
        "Μάθετε ελληνικά και γνωρίστε τον πολιτισμό, την ιστορία και την καθημερινή ζωή της Χίου.",
      imageAlt: "Μαθήματα ελληνικών στη Χίο",
      buttonLabel: "Δείτε τα μαθήματα",
    },
    hiking: {
      title: "Πεζοπορία στη Χίο",
      description:
        "Ακολουθήστε μονοπάτια σε μαστιχοχώρια, βουνά, παραθαλάσσιες διαδρομές και φυσικά τοπία.",
      imageAlt: "Πεζοπορία στη Χίο",
      buttonLabel: "Δείτε τις διαδρομές",
    },
    thermalBaths: {
      title: "Ιαματικά Λουτρά Χίου",
      description:
        "Χαλαρώστε στις φυσικές ιαματικές πηγές των Αγιασμάτων μέσα σε ήρεμο φυσικό περιβάλλον.",
      imageAlt: "Ιαματικά λουτρά Αγιασμάτων Χίου",
      buttonLabel: "Δείτε τα λουτρά",
    },
    rocketWar: {
      title: "Ρουκετοπόλεμος Χίου",
      description:
        "Ζήστε το διάσημο πασχαλινό έθιμο του Βροντάδου που φωτίζει τον ουρανό της Χίου.",
      imageAlt: "Ρουκετοπόλεμος Χίου",
      buttonLabel: "Δείτε τον Ρουκετοπόλεμο",
    },
    orchids: {
      title: "Ορχιδέες της Χίου",
      description:
        "Ανακαλύψτε τις άγριες ορχιδέες και τα ανοιξιάτικα λουλούδια της χιώτικης φύσης.",
      imageAlt: "Άγριες ορχιδέες της Χίου",
      buttonLabel: "Δείτε τις ορχιδέες",
    },
  },

  fr: {
    mostra: {
      title: "Festival Mostra à Chios",
      description:
        "Découvrez la tradition carnavalesque colorée de Thymiana avec musique, costumes et fête locale.",
      imageAlt: "Festival Mostra à Thymiana Chios",
      buttonLabel: "Découvrir Mostra",
    },
    greekCourses: {
      title: "Cours de grec à Chios",
      description:
        "Apprenez le grec tout en découvrant la culture, l'histoire et la vie quotidienne de Chios.",
      imageAlt: "Cours de grec à Chios",
      buttonLabel: "Voir les cours",
    },
    hiking: {
      title: "Randonnée à Chios",
      description:
        "Suivez des sentiers à travers villages de mastiha, montagnes, côtes et paysages naturels.",
      imageAlt: "Sentiers de randonnée à Chios",
      buttonLabel: "Voir les randonnées",
    },
    thermalBaths: {
      title: "Sources thermales de Chios",
      description:
        "Détendez-vous aux sources naturelles d'Agiasmata dans un environnement paisible.",
      imageAlt: "Sources thermales d'Agiasmata à Chios",
      buttonLabel: "Voir les sources",
    },
    rocketWar: {
      title: "Guerre des fusées de Chios",
      description:
        "Vivez le Rouketopolemos, la célèbre tradition de Pâques de Vrontados.",
      imageAlt: "Guerre des fusées de Chios",
      buttonLabel: "Découvrir la tradition",
    },
    orchids: {
      title: "Orchidées de Chios",
      description:
        "Découvrez les orchidées sauvages et les fleurs printanières de Chios.",
      imageAlt: "Orchidées sauvages de Chios",
      buttonLabel: "Voir les orchidées",
    },
  },

  de: {
    mostra: {
      title: "Mostra Festival auf Chios",
      description:
        "Entdecken Sie die farbenfrohe Karnevalstradition von Thymiana mit Musik, Kostümen und lokaler Feier.",
      imageAlt: "Mostra Festival in Thymiana Chios",
      buttonLabel: "Mostra entdecken",
    },
    greekCourses: {
      title: "Griechischkurse auf Chios",
      description:
        "Lernen Sie Griechisch und entdecken Sie Kultur, Geschichte und Alltagsleben auf Chios.",
      imageAlt: "Griechischkurse auf Chios",
      buttonLabel: "Kurse ansehen",
    },
    hiking: {
      title: "Wandern auf Chios",
      description:
        "Folgen Sie Wegen durch Mastixdörfer, Berge, Küstenpfade und Naturlandschaften.",
      imageAlt: "Wanderwege auf Chios",
      buttonLabel: "Wanderwege ansehen",
    },
    thermalBaths: {
      title: "Thermalquellen auf Chios",
      description:
        "Entspannen Sie an den natürlichen Quellen von Agiasmata in ruhiger Umgebung.",
      imageAlt: "Thermalquellen von Agiasmata auf Chios",
      buttonLabel: "Quellen ansehen",
    },
    rocketWar: {
      title: "Raketenkrieg auf Chios",
      description:
        "Erleben Sie Rouketopolemos, die berühmte Ostertradition von Vrontados.",
      imageAlt: "Raketenkrieg auf Chios",
      buttonLabel: "Tradition entdecken",
    },
    orchids: {
      title: "Orchideen auf Chios",
      description:
        "Entdecken Sie wilde Orchideen und Frühlingsblumen auf Chios.",
      imageAlt: "Wilde Orchideen auf Chios",
      buttonLabel: "Orchideen ansehen",
    },
  },

  it: {
    mostra: {
      title: "Festival Mostra a Chios",
      description:
        "Scopri la colorata tradizione carnevalesca di Thymiana con musica, costumi e festa locale.",
      imageAlt: "Festival Mostra a Thymiana Chios",
      buttonLabel: "Scopri Mostra",
    },
    greekCourses: {
      title: "Corsi di greco a Chios",
      description:
        "Impara il greco scoprendo cultura, storia e vita quotidiana di Chios.",
      imageAlt: "Corsi di greco a Chios",
      buttonLabel: "Vedi i corsi",
    },
    hiking: {
      title: "Trekking a Chios",
      description:
        "Segui sentieri tra villaggi del mastice, montagne, coste e paesaggi naturali.",
      imageAlt: "Sentieri di trekking a Chios",
      buttonLabel: "Vedi i percorsi",
    },
    thermalBaths: {
      title: "Terme di Chios",
      description:
        "Rilassati alle sorgenti naturali di Agiasmata in un ambiente tranquillo.",
      imageAlt: "Terme di Agiasmata a Chios",
      buttonLabel: "Vedi le terme",
    },
    rocketWar: {
      title: "Guerra dei razzi di Chios",
      description:
        "Vivi il Rouketopolemos, la famosa tradizione pasquale di Vrontados.",
      imageAlt: "Guerra dei razzi di Chios",
      buttonLabel: "Scopri la tradizione",
    },
    orchids: {
      title: "Orchidee di Chios",
      description:
        "Scopri le orchidee selvatiche e i fiori primaverili di Chios.",
      imageAlt: "Orchidee selvatiche di Chios",
      buttonLabel: "Vedi le orchidee",
    },
  },

  es: {
    mostra: {
      title: "Festival Mostra en Quíos",
      description:
        "Descubre la colorida tradición de carnaval de Thymiana con música, trajes y celebración local.",
      imageAlt: "Festival Mostra en Thymiana Quíos",
      buttonLabel: "Descubrir Mostra",
    },
    greekCourses: {
      title: "Cursos de griego en Quíos",
      description:
        "Aprende griego mientras descubres la cultura, historia y vida diaria de Quíos.",
      imageAlt: "Cursos de griego en Quíos",
      buttonLabel: "Ver cursos",
    },
    hiking: {
      title: "Senderismo en Quíos",
      description:
        "Sigue rutas por pueblos de mastiha, montañas, senderos costeros y paisajes naturales.",
      imageAlt: "Rutas de senderismo en Quíos",
      buttonLabel: "Ver rutas",
    },
    thermalBaths: {
      title: "Baños termales de Quíos",
      description:
        "Relájate en las fuentes naturales de Agiasmata en un entorno tranquilo.",
      imageAlt: "Baños termales de Agiasmata en Quíos",
      buttonLabel: "Ver baños termales",
    },
    rocketWar: {
      title: "Guerra de cohetes de Quíos",
      description:
        "Vive el Rouketopolemos, la famosa tradición de Pascua de Vrontados.",
      imageAlt: "Guerra de cohetes de Quíos",
      buttonLabel: "Descubrir la tradición",
    },
    orchids: {
      title: "Orquídeas de Quíos",
      description:
        "Descubre las orquídeas silvestres y las flores de primavera de Quíos.",
      imageAlt: "Orquídeas silvestres de Quíos",
      buttonLabel: "Ver orquídeas",
    },
  },

  tr: {
    mostra: {
      title: "Sakız Adası Mostra Festivali",
      description:
        "Thymiana'nın renkli karnaval geleneğini müzik, kostümler ve yerel kutlamalarla keşfedin.",
      imageAlt: "Thymiana Sakız Adası Mostra Festivali",
      buttonLabel: "Mostra'yı keşfet",
    },
    greekCourses: {
      title: "Sakız Adası'nda Yunanca Kursları",
      description:
        "Yunanca öğrenirken Sakız Adası'nın kültürünü, tarihini ve günlük yaşamını keşfedin.",
      imageAlt: "Sakız Adası'nda Yunanca kursları",
      buttonLabel: "Kursları gör",
    },
    hiking: {
      title: "Sakız Adası'nda yürüyüş",
      description:
        "Mastik köyleri, dağlar, kıyı yolları ve doğal manzaralar arasında yürüyüş yapın.",
      imageAlt: "Sakız Adası yürüyüş rotaları",
      buttonLabel: "Rotaları gör",
    },
    thermalBaths: {
      title: "Sakız Adası termal kaplıcaları",
      description:
        "Agiasmata'nın doğal termal sularında huzurlu bir ortamda rahatlayın.",
      imageAlt: "Sakız Adası Agiasmata termal kaplıcaları",
      buttonLabel: "Kaplıcaları gör",
    },
    rocketWar: {
      title: "Sakız Adası Roket Savaşı",
      description:
        "Vrontados'un ünlü Paskalya geleneği Rouketopolemos'u yaşayın.",
      imageAlt: "Sakız Adası Roket Savaşı",
      buttonLabel: "Geleneği keşfet",
    },
    orchids: {
      title: "Sakız Adası orkideleri",
      description:
        "Sakız Adası'nın yabani orkidelerini ve bahar çiçeklerini keşfedin.",
      imageAlt: "Sakız Adası yabani orkideleri",
      buttonLabel: "Orkideleri gör",
    },
  },
};

function getHubCards(locale: LanguageCode): ChiosActivityCard[] {
  const copy = hubCardCopy[locale] ?? hubCardCopy.en;

  return [
    {
      key: "mostra",
      image: images.mostra,
      href: chiosActivityDetailPaths.mostra[locale],
      ...copy.mostra,
    },
    {
      key: "greekCourses",
      image: images.greekCourses,
      href: chiosActivityDetailPaths.greekCourses[locale],
      ...copy.greekCourses,
    },
    {
      key: "hiking",
      image: images.hiking,
      href: chiosActivityDetailPaths.hiking[locale],
      ...copy.hiking,
    },
    {
      key: "thermalBaths",
      image: images.thermalBaths,
      href: chiosActivityDetailPaths.thermalBaths[locale],
      ...copy.thermalBaths,
    },
    {
      key: "rocketWar",
      image: images.rocketWar,
      href: chiosActivityDetailPaths.rocketWar[locale],
      ...copy.rocketWar,
    },
    {
      key: "orchids",
      image: images.orchids,
      href: chiosActivityDetailPaths.orchids[locale],
      ...copy.orchids,
    },
  ];
}
`;

text = text.slice(0, start) + replacement + text.slice(end);

fs.writeFileSync(file, text, "utf8");

console.log("SUCCESS: Localized Chios Activities hub cards patched.");

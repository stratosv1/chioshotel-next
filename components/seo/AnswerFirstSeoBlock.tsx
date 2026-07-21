type AnswerFirstSeoBlockProps = {
  kind: "villages" | "beaches";
  language?: "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
};

type AnswerFirstLanguage = NonNullable<AnswerFirstSeoBlockProps["language"]>;

type AnswerFirstCopy = {
  eyebrow: string;
  title: string;
  answer: string;
  bullets: string[];
  note: string;
};

const answerFirstCopy: Record<
  AnswerFirstSeoBlockProps["kind"],
  Record<AnswerFirstLanguage, AnswerFirstCopy>
> = {
  villages: {
    en: {
      eyebrow: "Quick answer",
      title: "Which villages should you visit in Chios?",
      answer:
        "The best-known villages in Chios are Pyrgi, Mesta, Olympoi, Vessa, Armolia, Lagada and Volissos. Pyrgi and Mesta are the most famous medieval mastic villages, Olympoi and Vessa are quieter historic villages, Armolia is known for pottery, Lagada is a seaside food stop and Volissos is the main village of northwest Chios.",
      bullets: [
        "Pyrgi — black-and-white geometric house decorations",
        "Mesta — preserved medieval fortress village",
        "Olympoi and Vessa — quieter mastic village routes",
        "Armolia — pottery tradition and local craft",
        "Lagada and Volissos — seaside food, castle views and northern routes",
      ],
      note:
        "For a practical day route, combine Pyrgi, Mesta, Olympoi and Vessa in south Chios, then plan Lagada or Volissos as separate village days.",
    },
    el: {
      eyebrow: "Γρήγορη απάντηση",
      title: "Ποια χωριά αξίζει να δείτε στη Χίο;",
      answer:
        "Τα πιο γνωστά χωριά της Χίου είναι το Πυργί, τα Μεστά, οι Ολύμποι, η Βέσσα, τα Αρμόλια, η Λαγκάδα και η Βολισσός. Το Πυργί και τα Μεστά είναι τα πιο διάσημα μεσαιωνικά Μαστιχοχώρια, οι Ολύμποι και η Βέσσα είναι πιο ήσυχες ιστορικές στάσεις, τα Αρμόλια είναι γνωστά για την κεραμική, η Λαγκάδα για το λιμανάκι και το φαγητό, ενώ η Βολισσός για τη βορειοδυτική Χίο και το κάστρο.",
      bullets: [
        "Πυργί — ξυστά και ασπρόμαυρα γεωμετρικά σχέδια",
        "Μεστά — καλοδιατηρημένο μεσαιωνικό καστροχώρι",
        "Ολύμποι και Βέσσα — πιο ήρεμες διαδρομές στα Μαστιχοχώρια",
        "Αρμόλια — κεραμική παράδοση και τοπική χειροτεχνία",
        "Λαγκάδα και Βολισσός — θάλασσα, φαγητό, κάστρο και βόρεια Χίος",
      ],
      note:
        "Για πρακτική διαδρομή, συνδυάστε Πυργί, Μεστά, Ολύμπους και Βέσσα στη νότια Χίο και κρατήστε Λαγκάδα ή Βολισσό για ξεχωριστή εκδρομή.",
    },
    fr: {
      eyebrow: "Réponse rapide",
      title: "Quels villages visiter à Chios ?",
      answer:
        "Les villages les plus connus de Chios sont Pyrgi, Mesta, Olympoi, Vessa, Armolia, Lagada et Volissos. Pyrgi et Mesta sont les villages médiévaux du mastic les plus célèbres, Olympoi et Vessa offrent des étapes plus calmes, Armolia est connue pour la poterie, Lagada pour le port et les tavernes, et Volissos pour le nord-ouest et son château.",
      bullets: [
        "Pyrgi — décorations géométriques noir et blanc",
        "Mesta — village fortifié médiéval préservé",
        "Olympoi et Vessa — itinéraires plus calmes du mastic",
        "Armolia — poterie et artisanat local",
        "Lagada et Volissos — mer, tavernes, château et nord de Chios",
      ],
      note:
        "Pour un itinéraire pratique, regroupez Pyrgi, Mesta, Olympoi et Vessa dans le sud de Chios, puis prévoyez Lagada ou Volissos séparément.",
    },
    de: {
      eyebrow: "Kurze Antwort",
      title: "Welche Dörfer sollte man auf Chios besuchen?",
      answer:
        "Die bekanntesten Dörfer auf Chios sind Pyrgi, Mesta, Olympoi, Vessa, Armolia, Lagada und Volissos. Pyrgi und Mesta sind die berühmtesten mittelalterlichen Mastixdörfer, Olympoi und Vessa ruhigere historische Stopps, Armolia ist für Keramik bekannt, Lagada für Hafen und Tavernen und Volissos für den Nordwesten und die Burg.",
      bullets: [
        "Pyrgi — schwarz-weiße geometrische Hausmuster",
        "Mesta — erhaltenes mittelalterliches Wehrdorf",
        "Olympoi und Vessa — ruhigere Mastixdorf-Routen",
        "Armolia — Keramiktradition und Handwerk",
        "Lagada und Volissos — Meer, Tavernen, Burg und Nordrouten",
      ],
      note:
        "Für eine praktische Route kombinieren Sie Pyrgi, Mesta, Olympoi und Vessa im Süden und planen Lagada oder Volissos als eigene Ausflüge.",
    },
    it: {
      eyebrow: "Risposta rapida",
      title: "Quali villaggi visitare a Chios?",
      answer:
        "I villaggi più conosciuti di Chios sono Pyrgi, Mesta, Olympoi, Vessa, Armolia, Lagada e Volissos. Pyrgi e Mesta sono i villaggi medievali del mastice più famosi, Olympoi e Vessa sono tappe storiche più tranquille, Armolia è nota per la ceramica, Lagada per il porto e le taverne e Volissos per il nord-ovest e il castello.",
      bullets: [
        "Pyrgi — decorazioni geometriche bianche e nere",
        "Mesta — villaggio fortificato medievale conservato",
        "Olympoi e Vessa — percorsi più tranquilli del mastice",
        "Armolia — ceramica e artigianato locale",
        "Lagada e Volissos — mare, taverne, castello e itinerari del nord",
      ],
      note:
        "Per un itinerario pratico, unite Pyrgi, Mesta, Olympoi e Vessa nel sud di Chios e tenete Lagada o Volissos per giornate separate.",
    },
    es: {
      eyebrow: "Respuesta rápida",
      title: "¿Qué pueblos visitar en Quíos?",
      answer:
        "Los pueblos más conocidos de Quíos son Pyrgi, Mesta, Olympoi, Vessa, Armolia, Lagada y Volissos. Pyrgi y Mesta son los pueblos medievales de la mastiha más famosos, Olympoi y Vessa son paradas históricas más tranquilas, Armolia es conocida por la cerámica, Lagada por el puerto y las tabernas, y Volissos por el noroeste y su castillo.",
      bullets: [
        "Pyrgi — dibujos geométricos blancos y negros",
        "Mesta — pueblo fortaleza medieval conservado",
        "Olympoi y Vessa — rutas más tranquilas de la mastiha",
        "Armolia — cerámica y artesanía local",
        "Lagada y Volissos — mar, tabernas, castillo y rutas del norte",
      ],
      note:
        "Para una ruta práctica, combine Pyrgi, Mesta, Olympoi y Vessa en el sur de Quíos y deje Lagada o Volissos para otro día.",
    },
    tr: {
      eyebrow: "Kısa cevap",
      title: "Sakız Adası’nda hangi köyler gezilmeli?",
      answer:
        "Sakız Adası’nın en bilinen köyleri Pyrgi, Mesta, Olympoi, Vessa, Armolia, Lagada ve Volissos’tur. Pyrgi ve Mesta en ünlü Orta Çağ mastika köyleridir, Olympoi ve Vessa daha sakin tarihi duraklardır, Armolia seramikle, Lagada liman ve tavernalarla, Volissos ise kuzeybatı ve kalesiyle öne çıkar.",
      bullets: [
        "Pyrgi — siyah beyaz geometrik ev süslemeleri",
        "Mesta — korunmuş Orta Çağ kale köyü",
        "Olympoi ve Vessa — daha sakin mastika köyü rotaları",
        "Armolia — seramik geleneği ve yerel zanaat",
        "Lagada ve Volissos — deniz, tavernalar, kale ve kuzey rotaları",
      ],
      note:
        "Pratik bir rota için güneyde Pyrgi, Mesta, Olympoi ve Vessa’yı birlikte planlayın; Lagada veya Volissos’u ayrı günlere bırakın.",
    },
  },
  beaches: {
    en: {
      eyebrow: "Quick answer",
      title: "Which beaches should you visit in Chios?",
      answer:
        "The most famous beaches in Chios are Mavra Volia, Agia Dynami, Komi, Agia Fotia, Lithi, Nagos and Avlonia. Choose Mavra Volia for the dramatic black-pebble landscape, Komi and Agia Fotia for an easier organized beach day, Agia Dynami for turquoise water, Lithi for a relaxed sandy beach and Nagos or Avlonia for a quieter route.",
      bullets: [
        "Mavra Volia — volcanic black pebbles and dramatic scenery",
        "Agia Dynami — turquoise water and a memorable south Chios stop",
        "Komi and Agia Fotia — easier organized beach days",
        "Lithi — sandy beach and relaxed seafood stop",
        "Nagos and Avlonia — quieter coastal routes",
      ],
      note:
        "For a first visit, plan one day for south Chios beaches and another for quieter northern or western coastal routes.",
    },
    el: {
      eyebrow: "Γρήγορη απάντηση",
      title: "Ποιες παραλίες αξίζει να δείτε στη Χίο;",
      answer:
        "Οι πιο γνωστές παραλίες της Χίου είναι τα Μαύρα Βόλια, η Αγία Δύναμη, η Κώμη, η Αγία Φωτιά, το Λιθί, ο Ναγός και η Αυλωνιά. Τα Μαύρα Βόλια ξεχωρίζουν για το ηφαιστειακό τοπίο, η Κώμη και η Αγία Φωτιά για πιο εύκολη οργανωμένη μέρα, η Αγία Δύναμη για τα γαλαζοπράσινα νερά, το Λιθί για άμμο και φαγητό, ενώ ο Ναγός και η Αυλωνιά για πιο ήσυχες διαδρομές.",
      bullets: [
        "Μαύρα Βόλια — ηφαιστειακά μαύρα βότσαλα και εντυπωσιακό τοπίο",
        "Αγία Δύναμη — γαλαζοπράσινα νερά και νότια Χίος",
        "Κώμη και Αγία Φωτιά — πιο εύκολες οργανωμένες επιλογές",
        "Λιθί — άμμος και χαλαρή στάση για φαγητό",
        "Ναγός και Αυλωνιά — πιο ήσυχες παραθαλάσσιες διαδρομές",
      ],
      note:
        "Για πρώτη επίσκεψη, οργανώστε μία μέρα για τις νότιες παραλίες και μία δεύτερη για πιο ήσυχες βόρειες ή δυτικές ακτές.",
    },
    fr: {
      eyebrow: "Réponse rapide",
      title: "Quelles plages visiter à Chios ?",
      answer:
        "Les plages les plus connues de Chios sont Mavra Volia, Agia Dynami, Komi, Agia Fotia, Lithi, Nagos et Avlonia. Choisissez Mavra Volia pour le paysage volcanique, Komi et Agia Fotia pour une journée plus facile, Agia Dynami pour les eaux turquoise, Lithi pour le sable et les tavernes, et Nagos ou Avlonia pour des routes plus calmes.",
      bullets: [
        "Mavra Volia — galets noirs volcaniques et paysage spectaculaire",
        "Agia Dynami — eaux turquoise dans le sud de Chios",
        "Komi et Agia Fotia — options plus faciles et organisées",
        "Lithi — sable et pause repas détendue",
        "Nagos et Avlonia — routes côtières plus calmes",
      ],
      note:
        "Pour une première visite, prévoyez une journée pour les plages du sud et une autre pour les côtes plus calmes du nord ou de l’ouest.",
    },
    de: {
      eyebrow: "Kurze Antwort",
      title: "Welche Strände sollte man auf Chios besuchen?",
      answer:
        "Die bekanntesten Strände auf Chios sind Mavra Volia, Agia Dynami, Komi, Agia Fotia, Lithi, Nagos und Avlonia. Mavra Volia steht für vulkanische Landschaft, Komi und Agia Fotia für einfache organisierte Strandtage, Agia Dynami für türkisfarbenes Wasser, Lithi für Sand und Essen, Nagos oder Avlonia für ruhigere Routen.",
      bullets: [
        "Mavra Volia — schwarze Vulkansteine und dramatische Landschaft",
        "Agia Dynami — türkisfarbenes Wasser im Süden",
        "Komi und Agia Fotia — einfachere organisierte Optionen",
        "Lithi — Sand und entspannte Tavernen",
        "Nagos und Avlonia — ruhigere Küstenrouten",
      ],
      note:
        "Für den ersten Besuch planen Sie einen Tag für die südlichen Strände und einen weiteren für ruhigere nördliche oder westliche Küsten.",
    },
    it: {
      eyebrow: "Risposta rapida",
      title: "Quali spiagge visitare a Chios?",
      answer:
        "Le spiagge più conosciute di Chios sono Mavra Volia, Agia Dynami, Komi, Agia Fotia, Lithi, Nagos e Avlonia. Scegliete Mavra Volia per il paesaggio vulcanico, Komi e Agia Fotia per una giornata più organizzata, Agia Dynami per l’acqua turchese, Lithi per sabbia e cibo, Nagos o Avlonia per itinerari più tranquilli.",
      bullets: [
        "Mavra Volia — ciottoli neri vulcanici e paesaggio spettacolare",
        "Agia Dynami — acque turchesi nel sud di Chios",
        "Komi e Agia Fotia — opzioni più facili e organizzate",
        "Lithi — sabbia e pausa gastronomica rilassata",
        "Nagos e Avlonia — rotte costiere più tranquille",
      ],
      note:
        "Per una prima visita, dedicate un giorno alle spiagge del sud e un altro alle coste più tranquille del nord o dell’ovest.",
    },
    es: {
      eyebrow: "Respuesta rápida",
      title: "¿Qué playas visitar en Quíos?",
      answer:
        "Las playas más conocidas de Quíos son Mavra Volia, Agia Dynami, Komi, Agia Fotia, Lithi, Nagos y Avlonia. Elija Mavra Volia por el paisaje volcánico, Komi y Agia Fotia para un día más organizado, Agia Dynami por el agua turquesa, Lithi por arena y comida, y Nagos o Avlonia para rutas más tranquilas.",
      bullets: [
        "Mavra Volia — guijarros negros volcánicos y paisaje espectacular",
        "Agia Dynami — aguas turquesas en el sur de Quíos",
        "Komi y Agia Fotia — opciones organizadas más fáciles",
        "Lithi — arena y comida relajada",
        "Nagos y Avlonia — rutas costeras más tranquilas",
      ],
      note:
        "Para una primera visita, planifique un día para las playas del sur y otro para costas más tranquilas del norte u oeste.",
    },
    tr: {
      eyebrow: "Kısa cevap",
      title: "Sakız Adası’nda hangi plajlar görülmeli?",
      answer:
        "Sakız Adası’nın en bilinen plajları Mavra Volia, Agia Dynami, Komi, Agia Fotia, Lithi, Nagos ve Avlonia’dır. Mavra Volia volkanik manzara için, Komi ve Agia Fotia daha kolay plaj günü için, Agia Dynami turkuaz su için, Lithi kum ve yemek için, Nagos veya Avlonia daha sakin rotalar için iyi seçimdir.",
      bullets: [
        "Mavra Volia — volkanik siyah çakıllar ve etkileyici manzara",
        "Agia Dynami — güneyde turkuaz sular",
        "Komi ve Agia Fotia — daha kolay ve düzenli seçenekler",
        "Lithi — kum ve rahat yemek molası",
        "Nagos ve Avlonia — daha sakin kıyı rotaları",
      ],
      note:
        "İlk ziyaret için bir günü güney plajlarına, ikinci günü daha sakin kuzey veya batı kıyılarına ayırın.",
    },
  },
};

export function AnswerFirstSeoBlock({ kind, language = "en" }: AnswerFirstSeoBlockProps) {
  const copy = answerFirstCopy[kind][language] ?? answerFirstCopy[kind].en;

  return (
    <section
      className="bg-[#f7efe5] px-4 py-8 text-[#2f261f] md:px-6 md:py-10"
      data-nosnippet
    >
      <div className="mx-auto max-w-[1180px] rounded-[28px] border border-[#8e6607]/20 bg-white p-5 shadow-xl shadow-black/5 md:rounded-[32px] md:p-8">
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8e6607] md:text-xs">
          {copy.eyebrow}
        </span>
        <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] md:text-4xl">
          {copy.title}
        </h2>
        <p className="mt-4 text-sm font-semibold leading-7 text-[#4d4238] md:text-lg md:leading-8">
          {copy.answer}
        </p>
        <ul className="mt-5 grid gap-2 md:grid-cols-2 md:gap-3">
          {copy.bullets.map((item) => (
            <li
              className="rounded-2xl bg-[#fff7e8] px-4 py-3 text-sm font-bold leading-6 text-[#493b2f] ring-1 ring-[#8e6607]/10"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-2xl bg-[#2f261f] px-4 py-3 text-sm font-bold leading-6 text-white md:py-4 md:text-base">
          {copy.note}
        </p>
      </div>
    </section>
  );
}

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
        "This guide covers 11 Chios beaches. The best known are Mavra Volia, Agia Dynami, Karfas, Komi, Agia Fotia and Lithi. Choose Mavra Volia for black volcanic pebbles, Karfas for shallow sand minutes from Kambos, Komi and Agia Fotia for an easy organized beach day, Agia Dynami or Salagona for turquoise water, Lithi for families, and Elinta, Avlonia, Nagos or Lefkathia for quieter swims.",
      bullets: [
        "Mavra Volia — volcanic black pebbles and dramatic scenery",
        "Agia Dynami and Salagona — turquoise coves in south Chios",
        "Karfas — long sandy beach with shallow water, closest to Kambos",
        "Komi and Agia Fotia — easy organized beach days",
        "Lithi — sandy family beach with seafood taverns",
        "Elinta, Avlonia, Nagos and Lefkathia — quieter bays and northern routes",
      ],
      note:
        "For a first visit, plan one day for south Chios beaches and another for quieter northern or western coastal routes. Karfas and Agia Fotia are the easy choices for a short swim from Kambos.",
    },
    el: {
      eyebrow: "Γρήγορη απάντηση",
      title: "Ποιες παραλίες αξίζει να δείτε στη Χίο;",
      answer:
        "Ο οδηγός καλύπτει 11 παραλίες της Χίου. Οι πιο γνωστές είναι τα Μαύρα Βόλια, η Αγία Δύναμη, ο Καρφάς, η Κώμη, η Αγία Φωτιά και το Λιθί. Τα Μαύρα Βόλια ξεχωρίζουν για τα ηφαιστειακά βότσαλα, ο Καρφάς για τη ρηχή αμμουδιά λίγα λεπτά από τον Κάμπο, η Κώμη και η Αγία Φωτιά για μια εύκολη οργανωμένη μέρα, η Αγία Δύναμη και η Σαλάγωνα για τα γαλαζοπράσινα νερά, το Λιθί για οικογένειες, ενώ η Ελίντα, η Αυλωνιά, ο Ναγός και η Λευκάθια για πιο ήσυχο μπάνιο.",
      bullets: [
        "Μαύρα Βόλια — ηφαιστειακά μαύρα βότσαλα και εντυπωσιακό τοπίο",
        "Αγία Δύναμη και Σαλάγωνα — γαλαζοπράσινοι όρμοι στη νότια Χίο",
        "Καρφάς — μεγάλη αμμουδιά με ρηχά νερά, η πιο κοντινή στον Κάμπο",
        "Κώμη και Αγία Φωτιά — εύκολες οργανωμένες επιλογές",
        "Λιθί — οικογενειακή αμμουδιά με ψαροταβέρνες",
        "Ελίντα, Αυλωνιά, Ναγός και Λευκάθια — πιο ήσυχοι κόλποι και βόρειες διαδρομές",
      ],
      note:
        "Για πρώτη επίσκεψη, οργανώστε μία μέρα για τις νότιες παραλίες και μία δεύτερη για πιο ήσυχες βόρειες ή δυτικές ακτές. Για γρήγορο μπάνιο από τον Κάμπο, ο Καρφάς και η Αγία Φωτιά είναι οι εύκολες επιλογές.",
    },
    fr: {
      eyebrow: "Réponse rapide",
      title: "Quelles plages visiter à Chios ?",
      answer:
        "Ce guide présente 11 plages de Chios. Les plus connues sont Mavra Volia, Agia Dynami, Karfas, Komi, Agia Fotia et Lithi. Choisissez Mavra Volia pour les galets volcaniques noirs, Karfas pour le sable peu profond à quelques minutes de Kambos, Komi et Agia Fotia pour une journée organisée facile, Agia Dynami ou Salagona pour l’eau turquoise, Lithi pour les familles, et Elinta, Avlonia, Nagos ou Lefkathia pour une baignade plus calme.",
      bullets: [
        "Mavra Volia — galets noirs volcaniques et paysage spectaculaire",
        "Agia Dynami et Salagona — criques turquoise dans le sud de Chios",
        "Karfas — longue plage de sable peu profonde, la plus proche de Kambos",
        "Komi et Agia Fotia — journées plage organisées et faciles",
        "Lithi — plage de sable familiale avec tavernes de poisson",
        "Elinta, Avlonia, Nagos et Lefkathia — baies plus calmes et routes du nord",
      ],
      note:
        "Pour une première visite, prévoyez une journée pour les plages du sud et une autre pour les côtes plus calmes du nord ou de l’ouest. Karfas et Agia Fotia sont les choix faciles pour une baignade rapide depuis Kambos.",
    },
    de: {
      eyebrow: "Kurze Antwort",
      title: "Welche Strände sollte man auf Chios besuchen?",
      answer:
        "Dieser Guide stellt 11 Strände auf Chios vor. Die bekanntesten sind Mavra Volia, Agia Dynami, Karfas, Komi, Agia Fotia und Lithi. Mavra Volia steht für schwarze Vulkankiesel, Karfas für flachen Sand wenige Minuten von Kambos, Komi und Agia Fotia für einfache organisierte Strandtage, Agia Dynami und Salagona für türkisfarbenes Wasser, Lithi für Familien und Elinta, Avlonia, Nagos oder Lefkathia für ruhigeres Baden.",
      bullets: [
        "Mavra Volia — schwarze Vulkankiesel und dramatische Landschaft",
        "Agia Dynami und Salagona — türkisfarbene Buchten im Süden",
        "Karfas — langer, flacher Sandstrand, am nächsten an Kambos",
        "Komi und Agia Fotia — einfache organisierte Strandtage",
        "Lithi — familienfreundlicher Sandstrand mit Fischtavernen",
        "Elinta, Avlonia, Nagos und Lefkathia — ruhigere Buchten und Nordrouten",
      ],
      note:
        "Für den ersten Besuch planen Sie einen Tag für die südlichen Strände und einen weiteren für ruhigere nördliche oder westliche Küsten. Für ein kurzes Bad ab Kambos sind Karfas und Agia Fotia die einfachste Wahl.",
    },
    it: {
      eyebrow: "Risposta rapida",
      title: "Quali spiagge visitare a Chios?",
      answer:
        "Questa guida presenta 11 spiagge di Chios. Le più conosciute sono Mavra Volia, Agia Dynami, Karfas, Komi, Agia Fotia e Lithi. Scegliete Mavra Volia per i ciottoli vulcanici neri, Karfas per la sabbia e l’acqua bassa a pochi minuti da Kambos, Komi e Agia Fotia per una giornata attrezzata e facile, Agia Dynami o Salagona per l’acqua turchese, Lithi per le famiglie, ed Elinta, Avlonia, Nagos o Lefkathia per nuotare in tranquillità.",
      bullets: [
        "Mavra Volia — ciottoli neri vulcanici e paesaggio spettacolare",
        "Agia Dynami e Salagona — calette turchesi nel sud di Chios",
        "Karfas — lunga spiaggia di sabbia con acqua bassa, la più vicina a Kambos",
        "Komi e Agia Fotia — giornate al mare attrezzate e facili",
        "Lithi — spiaggia di sabbia per famiglie con taverne di pesce",
        "Elinta, Avlonia, Nagos e Lefkathia — baie più tranquille e itinerari del nord",
      ],
      note:
        "Per una prima visita, dedicate un giorno alle spiagge del sud e un altro alle coste più tranquille del nord o dell’ovest. Per un bagno veloce da Kambos, Karfas e Agia Fotia sono le scelte più comode.",
    },
    es: {
      eyebrow: "Respuesta rápida",
      title: "¿Qué playas visitar en Quíos?",
      answer:
        "Esta guía presenta 11 playas de Quíos. Las más conocidas son Mavra Volia, Agia Dynami, Karfas, Komi, Agia Fotia y Lithi. Elija Mavra Volia por los guijarros volcánicos negros, Karfas por la arena y el agua poco profunda a pocos minutos de Kambos, Komi y Agia Fotia para un día de playa organizada y fácil, Agia Dynami o Salagona por el agua turquesa, Lithi para familias, y Elinta, Avlonia, Nagos o Lefkathia para un baño más tranquilo.",
      bullets: [
        "Mavra Volia — guijarros negros volcánicos y paisaje espectacular",
        "Agia Dynami y Salagona — calas turquesas en el sur de Quíos",
        "Karfas — larga playa de arena poco profunda, la más cercana a Kambos",
        "Komi y Agia Fotia — días de playa organizados y fáciles",
        "Lithi — playa de arena familiar con tabernas de pescado",
        "Elinta, Avlonia, Nagos y Lefkathia — bahías más tranquilas y rutas del norte",
      ],
      note:
        "Para una primera visita, planifique un día para las playas del sur y otro para costas más tranquilas del norte u oeste. Para un baño rápido desde Kambos, Karfas y Agia Fotia son las opciones más cómodas.",
    },
    tr: {
      eyebrow: "Kısa cevap",
      title: "Sakız Adası’nda hangi plajlar görülmeli?",
      answer:
        "Bu rehber Sakız Adası’ndaki 11 plajı kapsar. En bilinenleri Mavra Volia, Agia Dynami, Karfas, Komi, Agia Fotia ve Lithi’dir. Volkanik siyah çakıllar için Mavra Volia, Kambos’a birkaç dakika mesafedeki sığ kum için Karfas, kolay ve düzenli bir plaj günü için Komi ve Agia Fotia, turkuaz su için Agia Dynami veya Salagona, aileler için Lithi, daha sakin bir yüzme için Elinta, Avlonia, Nagos veya Lefkathia iyi seçimdir.",
      bullets: [
        "Mavra Volia — volkanik siyah çakıllar ve etkileyici manzara",
        "Agia Dynami ve Salagona — güneyde turkuaz koylar",
        "Karfas — sığ sulu uzun kumsal, Kambos’a en yakın plaj",
        "Komi ve Agia Fotia — kolay ve düzenli plaj günleri",
        "Lithi — balık tavernalı, aileler için kumlu plaj",
        "Elinta, Avlonia, Nagos ve Lefkathia — daha sakin koylar ve kuzey rotaları",
      ],
      note:
        "İlk ziyaret için bir günü güney plajlarına, ikinci günü daha sakin kuzey veya batı kıyılarına ayırın. Kambos’tan kısa bir yüzme için Karfas ve Agia Fotia en pratik seçeneklerdir.",
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
        {language === "el" && (
          <a
            href="/trip-planner/"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-[#8e6607]/25 bg-[#fff7e8] px-5 py-2.5 text-sm font-black text-[#6f5215] transition hover:bg-[#f9edcf]"
          >
            {kind === "beaches"
              ? "Οργάνωσε παραλίες & χωριά στο Chios Trip Planner →"
              : "Βάλε τα χωριά στο δικό σου Chios Trip Planner →"}
          </a>
        )}
      </div>
    </section>
  );
}

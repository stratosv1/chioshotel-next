/**
 * "Why visit?" quick-answer content for every beach page, in all languages.
 * Each entry: a one-paragraph answer plus four concrete reasons, based only on
 * facts already verified in the beach guide (location, sea, facilities, tips).
 */

export type WhyVisitLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

export type WhyVisitEntry = {
  answer: string;
  reasons: [string, string, string, string];
};

type BeachWhyVisit = Record<WhyVisitLanguage, WhyVisitEntry>;

export const beachWhyVisit: Record<string, BeachWhyVisit> = {
  "mavra-volia": {
    el: {
      answer:
        "Τα Μαύρα Βόλια στον Εμπορειό είναι η πιο εμβληματική παραλία της Χίου: τρεις διαδοχικοί κόλποι με μαύρα ηφαιστειακά βότσαλα, άγριους βράχους και βαθιά, δροσερά νερά. Ένα τοπίο που δεν θα βρείτε πουθενά αλλού στο Αιγαίο.",
      reasons: [
        "Μοναδικό ηφαιστειακό τοπίο από την έκρηξη του αρχαίου ηφαιστείου Ψάρωνα",
        "Βαθιά, κρυστάλλινα και δροσερά νερά, ιδανικά για δυνατούς κολυμβητές",
        "Φρέσκο ψάρι στις ψαροταβέρνες του γραφικού λιμανιού του Εμπορειού",
        "Εύκολος συνδυασμός με το Μουσείο Μαστίχας και το μεσαιωνικό Πυργί",
      ],
    },
    en: {
      answer:
        "Mavra Volia in Emporios is the most iconic beach in Chios: three consecutive bays of black volcanic pebbles, wild cliffs and deep, cool water. It is a landscape you will not find anywhere else in the Aegean.",
      reasons: [
        "A unique volcanic landscape created by the ancient Psaronas volcano",
        "Deep, crystal-clear and refreshing water for confident swimmers",
        "Fresh fish at the taverns of the picturesque Emporios harbour",
        "Easy to combine with the Mastic Museum and medieval Pyrgi",
      ],
    },
    fr: {
      answer:
        "Mavra Volia, à Emporios, est la plage la plus emblématique de Chios : trois criques successives de galets volcaniques noirs, des falaises sauvages et une eau profonde et fraîche. Un paysage unique en mer Égée.",
      reasons: [
        "Un paysage volcanique unique, né de l’ancien volcan Psaronas",
        "Une eau profonde, cristalline et rafraîchissante pour bons nageurs",
        "Du poisson frais dans les tavernes du joli port d’Emporios",
        "Facile à combiner avec le Musée du Mastic et le village médiéval de Pyrgi",
      ],
    },
    de: {
      answer:
        "Mavra Volia bei Emporios ist der berühmteste Strand von Chios: drei aufeinanderfolgende Buchten mit schwarzen Vulkankieseln, wilden Felsen und tiefem, kühlem Wasser – eine Landschaft, die es so in der Ägäis kein zweites Mal gibt.",
      reasons: [
        "Einzigartige Vulkanlandschaft, entstanden durch den alten Vulkan Psaronas",
        "Tiefes, kristallklares und erfrischendes Wasser für sichere Schwimmer",
        "Frischer Fisch in den Tavernen am malerischen Hafen von Emporios",
        "Ideal kombinierbar mit dem Mastix-Museum und dem Mittelalterdorf Pyrgi",
      ],
    },
    it: {
      answer:
        "Mavra Volia, a Emporios, è la spiaggia più iconica di Chios: tre baie consecutive di ciottoli vulcanici neri, scogliere selvagge e acque profonde e fresche. Un paesaggio che non troverete altrove nell’Egeo.",
      reasons: [
        "Un paesaggio vulcanico unico, nato dall’antico vulcano Psaronas",
        "Acque profonde, cristalline e rinfrescanti per nuotatori esperti",
        "Pesce fresco nelle taverne del pittoresco porticciolo di Emporios",
        "Facile da abbinare al Museo del Mastice e al borgo medievale di Pyrgi",
      ],
    },
    es: {
      answer:
        "Mavra Volia, en Emporios, es la playa más emblemática de Quíos: tres calas seguidas de guijarros volcánicos negros, acantilados salvajes y aguas profundas y frescas. Un paisaje que no encontrará en ningún otro lugar del Egeo.",
      reasons: [
        "Un paisaje volcánico único, creado por el antiguo volcán Psaronas",
        "Aguas profundas, cristalinas y refrescantes para buenos nadadores",
        "Pescado fresco en las tabernas del pintoresco puerto de Emporios",
        "Fácil de combinar con el Museo del Mástique y el pueblo medieval de Pyrgi",
      ],
    },
    tr: {
      answer:
        "Emporios’taki Mavra Volia, Sakız Adası’nın en ikonik plajıdır: siyah volkanik çakıllarla kaplı art arda üç koy, vahşi kayalıklar ve derin, serin sular. Ege’de başka hiçbir yerde göremeyeceğiniz bir manzara.",
      reasons: [
        "Antik Psaronas yanardağının oluşturduğu eşsiz volkanik manzara",
        "İyi yüzücüler için derin, kristal berraklığında ve serin sular",
        "Pitoresk Emporios limanındaki tavernalarda taze balık",
        "Sakız Müzesi ve ortaçağ köyü Pyrgi ile kolayca birleştirilir",
      ],
    },
  },

  komi: {
    el: {
      answer:
        "Η Κώμη είναι η απόλυτη αμμουδιά της Χίου: απέραντη χρυσή άμμος, ρηχά καθαρά νερά και πλήρης οργάνωση. Ιδανική για οικογένειες και για όσους θέλουν μπάνιο, φαγητό και καφέ δίπλα στο κύμα.",
      reasons: [
        "Απέραντη χρυσή άμμος και ρηχά νερά, τέλεια για παιδιά",
        "Πλήρως οργανωμένη με ξαπλώστρες, ναυαγοσώστη και θαλάσσιες δραστηριότητες",
        "Πεζόδρομος με ψαροταβέρνες, μεζέδες και καφέ-μπαρ πάνω στη θάλασσα",
        "Μόλις 6 χλμ. από το παραδοσιακό μαστιχοχώρι Καλαμωτή",
      ],
    },
    en: {
      answer:
        "Komi is the ultimate sandy beach of Chios: endless golden sand, shallow clear water and full facilities. It is ideal for families and for anyone who wants swimming, food and coffee right by the waves.",
      reasons: [
        "Endless golden sand and shallow water, perfect for children",
        "Fully organised with sunbeds, a lifeguard and water activities",
        "A seafront promenade of fish taverns, meze and café-bars",
        "Just 6 km from the traditional mastic village of Kalamoti",
      ],
    },
    fr: {
      answer:
        "Komi est la grande plage de sable de Chios : sable doré à perte de vue, eau claire et peu profonde, et tous les services. Idéale pour les familles et pour qui veut baignade, repas et café au bord des vagues.",
      reasons: [
        "Un immense sable doré et une eau peu profonde, parfaits pour les enfants",
        "Entièrement aménagée : transats, maître-nageur et activités nautiques",
        "Une promenade en bord de mer avec tavernes de poisson et cafés-bars",
        "À seulement 6 km du village traditionnel du mastic de Kalamoti",
      ],
    },
    de: {
      answer:
        "Komi ist der Sandstrand schlechthin auf Chios: endloser goldener Sand, flaches klares Wasser und komplette Ausstattung. Ideal für Familien und alle, die Baden, Essen und Kaffee direkt am Wasser wollen.",
      reasons: [
        "Endloser goldener Sand und flaches Wasser – perfekt für Kinder",
        "Voll ausgestattet mit Liegen, Rettungsschwimmer und Wassersport",
        "Strandpromenade mit Fischtavernen, Meze und Café-Bars",
        "Nur 6 km vom traditionellen Mastixdorf Kalamoti entfernt",
      ],
    },
    it: {
      answer:
        "Komi è la spiaggia di sabbia per eccellenza di Chios: sabbia dorata a perdita d’occhio, acque basse e limpide e tutti i servizi. Ideale per famiglie e per chi vuole bagno, cibo e caffè sulle onde.",
      reasons: [
        "Infinita sabbia dorata e acque basse, perfette per i bambini",
        "Completamente attrezzata con lettini, bagnino e attività acquatiche",
        "Un lungomare con taverne di pesce, meze e caffè-bar",
        "A soli 6 km dal tradizionale villaggio del mastice di Kalamoti",
      ],
    },
    es: {
      answer:
        "Komi es la gran playa de arena de Quíos: arena dorada sin fin, aguas poco profundas y claras y todos los servicios. Ideal para familias y para quien quiere baño, comida y café junto a las olas.",
      reasons: [
        "Arena dorada infinita y aguas poco profundas, perfectas para niños",
        "Totalmente organizada, con hamacas, socorrista y actividades acuáticas",
        "Un paseo marítimo con tabernas de pescado, meze y cafés-bar",
        "A solo 6 km del pueblo tradicional del mástique de Kalamoti",
      ],
    },
    tr: {
      answer:
        "Komi, Sakız Adası’nın en güzel kumsalıdır: uçsuz bucaksız altın kum, sığ ve berrak su ve eksiksiz hizmet. Aileler ve dalgaların hemen yanında yüzmek, yemek yemek ve kahve içmek isteyenler için ideal.",
      reasons: [
        "Uçsuz bucaksız altın kum ve sığ su, çocuklar için mükemmel",
        "Şezlong, cankurtaran ve su sporlarıyla tamamen düzenli",
        "Balık tavernaları, mezeler ve kafe-barlarla dolu sahil yolu",
        "Geleneksel sakız köyü Kalamoti’ye yalnızca 6 km",
      ],
    },
  },

  "agia-fotia": {
    el: {
      answer:
        "Η Αγία Φωτιά είναι η πιο κοσμοπολίτικη παραλία της Χίου και μόλις 15–20 λεπτά από τον Κάμπο: κρυστάλλινα δροσερά νερά, βότσαλο, θέα στα μικρασιατικά παράλια και ζωή από το πρωί μέχρι αργά το βράδυ.",
      reasons: [
        "Πολύ κοντά στον Κάμπο: η πιο εύκολη επιλογή για γρήγορο, όμορφο μπάνιο",
        "Πεντακάθαρα, δροσερά νερά με βότσαλο",
        "Καφέ, beach bars, ταβέρνες και μίνι μάρκετ πάνω στη θάλασσα",
        "Μαγευτική θέα προς τα παράλια της Μικράς Ασίας",
      ],
    },
    en: {
      answer:
        "Agia Fotia is the most cosmopolitan beach in Chios and only 15–20 minutes from Kambos: crystal-clear cool water, pebbles, views to the Asia Minor coast and life from morning until late at night.",
      reasons: [
        "Very close to Kambos: the easiest choice for a quick, beautiful swim",
        "Spotless, refreshing water over a pebbled seabed",
        "Cafés, beach bars, taverns and a mini-market right by the sea",
        "Stunning views toward the coast of Asia Minor",
      ],
    },
    fr: {
      answer:
        "Agia Fotia est la plage la plus cosmopolite de Chios, à seulement 15–20 minutes de Kambos : eau cristalline et fraîche, galets, vue sur la côte d’Asie Mineure et animation du matin jusqu’à tard le soir.",
      reasons: [
        "Tout près de Kambos : le choix le plus simple pour une belle baignade",
        "Une eau limpide et rafraîchissante sur fond de galets",
        "Cafés, beach bars, tavernes et supérette au bord de l’eau",
        "Une vue magnifique sur la côte d’Asie Mineure",
      ],
    },
    de: {
      answer:
        "Agia Fotia ist der kosmopolitischste Strand von Chios und nur 15–20 Minuten von Kambos entfernt: kristallklares, kühles Wasser, Kiesel, Blick auf die kleinasiatische Küste und Leben von morgens bis spät abends.",
      reasons: [
        "Ganz nah an Kambos: die einfachste Wahl für ein schönes Bad",
        "Glasklares, erfrischendes Wasser über Kieselgrund",
        "Cafés, Beach-Bars, Tavernen und Minimarkt direkt am Meer",
        "Herrlicher Blick auf die Küste Kleinasiens",
      ],
    },
    it: {
      answer:
        "Agia Fotia è la spiaggia più cosmopolita di Chios, a soli 15–20 minuti da Kambos: acque cristalline e fresche, ciottoli, vista sulla costa dell’Asia Minore e vita dal mattino fino a tarda sera.",
      reasons: [
        "Vicinissima a Kambos: la scelta più comoda per un bel bagno",
        "Acque limpide e rinfrescanti su fondale di ciottoli",
        "Caffè, beach bar, taverne e minimarket sul mare",
        "Una vista splendida sulla costa dell’Asia Minore",
      ],
    },
    es: {
      answer:
        "Agia Fotia es la playa más cosmopolita de Quíos y está a solo 15–20 minutos de Kambos: aguas cristalinas y frescas, guijarros, vistas a la costa de Asia Menor y ambiente desde la mañana hasta la noche.",
      reasons: [
        "Muy cerca de Kambos: la opción más fácil para un baño precioso",
        "Aguas limpísimas y refrescantes sobre fondo de guijarros",
        "Cafés, beach bars, tabernas y minimercado junto al mar",
        "Vistas espectaculares a la costa de Asia Menor",
      ],
    },
    tr: {
      answer:
        "Agia Fotia, Sakız Adası’nın en kozmopolit plajıdır ve Kambos’a yalnızca 15–20 dakika uzaklıktadır: kristal berraklığında serin su, çakıl, Anadolu kıyılarına manzara ve sabahtan gece geç saatlere kadar canlılık.",
      reasons: [
        "Kambos’a çok yakın: hızlı ve güzel bir yüzme için en kolay seçenek",
        "Çakıllı zemin üzerinde tertemiz, serin sular",
        "Denizin hemen yanında kafeler, beach barlar, tavernalar ve market",
        "Anadolu kıyılarına muhteşem manzara",
      ],
    },
  },

  "agia-dynami": {
    el: {
      answer:
        "Η Αγία Δύναμη είναι ένας μικρός, ονειρεμένος κόλπος στη νότια Χίο, κοντά στους Ολύμπους, με σμαραγδένια νερά και ένα γραφικό ξωκλήσι. Από τις πιο φωτογενείς παραλίες του νησιού.",
      reasons: [
        "Σμαραγδένια, πεντακάθαρα νερά σε έναν μικρό, προστατευμένο κόλπο",
        "Λεπτή άμμος με μικρό βότσαλο και λίγη φυσική σκιά από δέντρα",
        "Ανοργάνωτη και αυθεντική, ιδανική για ήσυχο μπάνιο και πικνίκ",
        "Τέλειος συνδυασμός με τους Ολύμπους και τα Μαστιχοχώρια",
      ],
    },
    en: {
      answer:
        "Agia Dynami is a small, dreamy cove in southern Chios near Olympoi, with emerald water and a picturesque chapel. It is one of the most photogenic beaches on the island.",
      reasons: [
        "Emerald, crystal-clear water in a small sheltered cove",
        "Fine sand with small pebbles and some natural shade from trees",
        "Unorganised and authentic, ideal for a quiet swim and a picnic",
        "A perfect pairing with Olympoi and the Mastic Villages",
      ],
    },
    fr: {
      answer:
        "Agia Dynami est une petite crique de rêve au sud de Chios, près d’Olympi, avec une eau émeraude et une chapelle pittoresque. L’une des plages les plus photogéniques de l’île.",
      reasons: [
        "Une eau émeraude et cristalline dans une petite crique abritée",
        "Sable fin et petits galets, avec un peu d’ombre naturelle",
        "Sauvage et authentique, idéale pour une baignade calme et un pique-nique",
        "Parfaite à combiner avec Olympi et les villages du mastic",
      ],
    },
    de: {
      answer:
        "Agia Dynami ist eine kleine Traumbucht im Süden von Chios nahe Olympi, mit smaragdgrünem Wasser und einer malerischen Kapelle – einer der fotogensten Strände der Insel.",
      reasons: [
        "Smaragdgrünes, glasklares Wasser in einer kleinen geschützten Bucht",
        "Feiner Sand mit kleinen Kieseln und etwas natürlichem Schatten",
        "Naturbelassen und authentisch – ideal für ruhiges Baden und Picknick",
        "Perfekt kombinierbar mit Olympi und den Mastixdörfern",
      ],
    },
    it: {
      answer:
        "Agia Dynami è una piccola baia da sogno nel sud di Chios, vicino a Olympi, con acque color smeraldo e una pittoresca cappella. Una delle spiagge più fotogeniche dell’isola.",
      reasons: [
        "Acque smeraldo e cristalline in una piccola baia riparata",
        "Sabbia fine con piccoli ciottoli e un po’ d’ombra naturale",
        "Libera e autentica, ideale per un bagno tranquillo e un picnic",
        "Perfetta da abbinare a Olympi e ai villaggi del mastice",
      ],
    },
    es: {
      answer:
        "Agia Dynami es una pequeña cala de ensueño en el sur de Quíos, cerca de Olympi, con aguas esmeralda y una pintoresca capilla. Una de las playas más fotogénicas de la isla.",
      reasons: [
        "Aguas esmeralda y cristalinas en una pequeña cala resguardada",
        "Arena fina con pequeños guijarros y algo de sombra natural",
        "Sin servicios y auténtica, ideal para un baño tranquilo y un pícnic",
        "Combinación perfecta con Olympi y los pueblos del mástique",
      ],
    },
    tr: {
      answer:
        "Agia Dynami, Sakız Adası’nın güneyinde, Olympi yakınında zümrüt renkli suları ve pitoresk şapeliyle küçük, rüya gibi bir koydur. Adanın en fotojenik plajlarından biri.",
      reasons: [
        "Küçük ve korunaklı bir koyda zümrüt renkli, berrak sular",
        "Küçük çakıllı ince kum ve ağaçların sunduğu biraz doğal gölge",
        "Düzenlenmemiş ve otantik; sakin bir yüzme ve piknik için ideal",
        "Olympi ve sakız köyleriyle mükemmel bir ikili",
      ],
    },
  },

  lithi: {
    el: {
      answer:
        "Το Λιθί είναι η πιο οικογενειακή παραλία της δυτικής Χίου: ένα γραφικό φυσικό λιμανάκι με ψιλή άμμο, πολύ ρηχά νερά και ψαροταβέρνες πάνω στο κύμα. Μείνετε μέχρι το ηλιοβασίλεμα — αξίζει.",
      reasons: [
        "Πολύ ρηχά νερά για μεγάλη απόσταση, ιδανικά για μικρά παιδιά",
        "Οργανωμένη αμμουδιά με ξαπλώστρες και ντουζιέρες",
        "Αυθεντικές ψαροταβέρνες με φρέσκο ψάρι δίπλα στη θάλασσα",
        "Μαγευτικό ηλιοβασίλεμα και εύκολος συνδυασμός με Ανάβατο και Αυγώνυμα",
      ],
    },
    en: {
      answer:
        "Lithi is the most family-friendly beach in western Chios: a picturesque natural harbour with fine sand, very shallow water and fish taverns right on the waves. Stay for the sunset — it is worth it.",
      reasons: [
        "Very shallow water for a long way out, ideal for young children",
        "An organised sandy beach with sunbeds and showers",
        "Authentic fish taverns serving fresh fish by the sea",
        "Magical sunsets and an easy pairing with Anavatos and Avgonyma",
      ],
    },
    fr: {
      answer:
        "Lithi est la plage la plus familiale de l’ouest de Chios : un joli port naturel avec du sable fin, une eau très peu profonde et des tavernes de poisson au bord des vagues. Restez pour le coucher de soleil.",
      reasons: [
        "Une eau très peu profonde sur une longue distance, idéale pour les petits",
        "Une plage de sable aménagée avec transats et douches",
        "Des tavernes authentiques avec poisson frais au bord de l’eau",
        "Des couchers de soleil magiques, à combiner avec Anavatos et Avgonyma",
      ],
    },
    de: {
      answer:
        "Lithi ist der familienfreundlichste Strand im Westen von Chios: ein malerischer Naturhafen mit feinem Sand, sehr flachem Wasser und Fischtavernen direkt am Wasser. Bleiben Sie bis zum Sonnenuntergang.",
      reasons: [
        "Sehr flaches Wasser auf langer Strecke – ideal für kleine Kinder",
        "Organisierter Sandstrand mit Liegen und Duschen",
        "Authentische Fischtavernen mit frischem Fisch direkt am Meer",
        "Traumhafte Sonnenuntergänge, gut kombinierbar mit Anavatos und Avgonyma",
      ],
    },
    it: {
      answer:
        "Lithi è la spiaggia più adatta alle famiglie della Chios occidentale: un pittoresco porto naturale con sabbia fine, acque bassissime e taverne di pesce sulle onde. Restate fino al tramonto.",
      reasons: [
        "Acque bassissime per un lungo tratto, ideali per i più piccoli",
        "Spiaggia di sabbia attrezzata con lettini e docce",
        "Autentiche taverne con pesce fresco in riva al mare",
        "Tramonti magici e facile abbinamento con Anavatos e Avgonyma",
      ],
    },
    es: {
      answer:
        "Lithi es la playa más familiar del oeste de Quíos: un pintoresco puerto natural con arena fina, aguas muy poco profundas y tabernas de pescado junto a las olas. Quédese hasta el atardecer.",
      reasons: [
        "Aguas muy poco profundas durante un buen tramo, ideales para niños",
        "Playa de arena organizada con hamacas y duchas",
        "Tabernas auténticas con pescado fresco junto al mar",
        "Atardeceres mágicos y fácil de combinar con Anavatos y Avgonyma",
      ],
    },
    tr: {
      answer:
        "Lithi, batı Sakız’ın en aile dostu plajıdır: ince kumu, çok sığ suyu ve dalgaların hemen yanındaki balık tavernalarıyla pitoresk bir doğal liman. Gün batımına kadar kalın, değer.",
      reasons: [
        "Uzun bir mesafe boyunca çok sığ su, küçük çocuklar için ideal",
        "Şezlong ve duşlu düzenli bir kumsal",
        "Deniz kenarında taze balık sunan otantik tavernalar",
        "Büyüleyici gün batımı; Anavatos ve Avgonyma ile kolayca birleşir",
      ],
    },
  },

  lefkathia: {
    el: {
      answer:
        "Η Λευκάθια είναι ένας πανέμορφος, ημικυκλικός κλειστός κόλπος στη βορειοδυτική Χίο, δίπλα στη Λιμνιά και τη Βολισσό, με κρυστάλλινα νερά και ένα από τα πιο ρομαντικά ηλιοβασιλέματα του νησιού.",
      reasons: [
        "Προστατευμένος κόλπος με κρυστάλλινα, βαθιά και καθαρά νερά",
        "Οργανωμένη με ομπρέλες, ξαπλώστρες και beach bar",
        "Φυσική σκιά από μεγάλα αρμυρίκια και πεύκα",
        "Ρομαντικό ηλιοβασίλεμα και κοντά στην ιστορική Βολισσό",
      ],
    },
    en: {
      answer:
        "Lefkathia is a beautiful, semi-circular enclosed bay in north-west Chios, next to Limnia and Volissos, with crystal-clear water and one of the most romantic sunsets on the island.",
      reasons: [
        "A sheltered bay with crystal-clear, deep and clean water",
        "Organised with umbrellas, sunbeds and a beach bar",
        "Natural shade from large tamarisk and pine trees",
        "Romantic sunsets, close to historic Volissos",
      ],
    },
    fr: {
      answer:
        "Lefkathia est une magnifique baie fermée en demi-cercle au nord-ouest de Chios, près de Limnia et de Volissos, avec une eau cristalline et l’un des couchers de soleil les plus romantiques de l’île.",
      reasons: [
        "Une baie abritée à l’eau cristalline, profonde et propre",
        "Aménagée avec parasols, transats et beach bar",
        "De l’ombre naturelle sous de grands tamaris et des pins",
        "Des couchers de soleil romantiques, près de la Volissos historique",
      ],
    },
    de: {
      answer:
        "Lefkathia ist eine wunderschöne, halbrunde geschlossene Bucht im Nordwesten von Chios bei Limnia und Volissos, mit kristallklarem Wasser und einem der romantischsten Sonnenuntergänge der Insel.",
      reasons: [
        "Geschützte Bucht mit kristallklarem, tiefem und sauberem Wasser",
        "Organisiert mit Schirmen, Liegen und Beach-Bar",
        "Natürlicher Schatten unter großen Tamarisken und Pinien",
        "Romantische Sonnenuntergänge, nahe dem historischen Volissos",
      ],
    },
    it: {
      answer:
        "Lefkathia è una splendida baia chiusa a semicerchio nel nord-ovest di Chios, vicino a Limnia e Volissos, con acque cristalline e uno dei tramonti più romantici dell’isola.",
      reasons: [
        "Una baia riparata con acque cristalline, profonde e pulite",
        "Attrezzata con ombrelloni, lettini e beach bar",
        "Ombra naturale sotto grandi tamerici e pini",
        "Tramonti romantici, vicino alla storica Volissos",
      ],
    },
    es: {
      answer:
        "Lefkathia es una preciosa bahía cerrada en semicírculo en el noroeste de Quíos, junto a Limnia y Volissos, con aguas cristalinas y uno de los atardeceres más románticos de la isla.",
      reasons: [
        "Una bahía resguardada de aguas cristalinas, profundas y limpias",
        "Organizada con sombrillas, hamacas y beach bar",
        "Sombra natural bajo grandes tarajes y pinos",
        "Atardeceres románticos, cerca de la histórica Volissos",
      ],
    },
    tr: {
      answer:
        "Lefkathia, kuzeybatı Sakız’da, Limnia ve Volissos’un hemen yanında, kristal berraklığında suları ve adanın en romantik gün batımlarından biriyle yarım daire şeklinde güzel, kapalı bir koydur.",
      reasons: [
        "Kristal berraklığında, derin ve temiz sulara sahip korunaklı bir koy",
        "Şemsiye, şezlong ve beach barla düzenli",
        "Büyük ılgın ve çam ağaçlarının doğal gölgesi",
        "Romantik gün batımı, tarihi Volissos’a yakın",
      ],
    },
  },

  nagos: {
    el: {
      answer:
        "Ο Ναγός είναι η πιο καταπράσινη παραλία της Χίου: πηγές με τρεχούμενα νερά και αιωνόβια πλατάνια συναντούν τα κρυστάλλινα νερά και τα πολύχρωμα βότσαλα, λίγο έξω από τα ιστορικά Καρδάμυλα.",
      reasons: [
        "Μοναδικό πράσινο τοπίο με πηγές, ρυάκια και αιωνόβια πλατάνια",
        "Πολύχρωμα βότσαλα και κρυστάλλινα, πολύ δροσερά νερά",
        "Φυσική δροσιά και σκιά ακόμη και τις πιο ζεστές μέρες",
        "Ταβέρνες κοντά και πανέμορφη διαδρομή με θέα στο Αιγαίο",
      ],
    },
    en: {
      answer:
        "Nagos is the greenest beach in Chios: springs with running water and century-old plane trees meet crystal-clear water and colourful pebbles, just outside historic Kardamyla.",
      reasons: [
        "A unique green landscape of springs, streams and century-old plane trees",
        "Colourful pebbles and crystal-clear, very refreshing water",
        "Natural coolness and shade even on the hottest days",
        "Taverns nearby and a beautiful drive with Aegean views",
      ],
    },
    fr: {
      answer:
        "Nagos est la plage la plus verdoyante de Chios : sources d’eau vive et platanes centenaires rencontrent une eau cristalline et des galets colorés, juste à côté de la Kardamyla historique.",
      reasons: [
        "Un paysage vert unique de sources, ruisseaux et platanes centenaires",
        "Des galets colorés et une eau cristalline très rafraîchissante",
        "Fraîcheur et ombre naturelles même aux jours les plus chauds",
        "Des tavernes à proximité et une belle route avec vue sur l’Égée",
      ],
    },
    de: {
      answer:
        "Nagos ist der grünste Strand von Chios: Quellen mit fließendem Wasser und jahrhundertealte Platanen treffen auf kristallklares Wasser und bunte Kiesel – direkt beim historischen Kardamyla.",
      reasons: [
        "Einzigartige grüne Landschaft mit Quellen, Bächen und alten Platanen",
        "Bunte Kiesel und kristallklares, sehr erfrischendes Wasser",
        "Natürliche Kühle und Schatten selbst an den heißesten Tagen",
        "Tavernen in der Nähe und eine schöne Fahrt mit Ägäis-Blick",
      ],
    },
    it: {
      answer:
        "Nagos è la spiaggia più verde di Chios: sorgenti d’acqua corrente e platani secolari incontrano acque cristalline e ciottoli colorati, appena fuori dalla storica Kardamyla.",
      reasons: [
        "Un paesaggio verde unico di sorgenti, ruscelli e platani secolari",
        "Ciottoli colorati e acque cristalline molto rinfrescanti",
        "Fresco e ombra naturali anche nei giorni più caldi",
        "Taverne vicine e un bel percorso con vista sull’Egeo",
      ],
    },
    es: {
      answer:
        "Nagos es la playa más verde de Quíos: manantiales de agua corriente y plátanos centenarios se encuentran con aguas cristalinas y guijarros de colores, a las afueras de la histórica Kardamyla.",
      reasons: [
        "Un paisaje verde único de manantiales, arroyos y plátanos centenarios",
        "Guijarros de colores y aguas cristalinas muy refrescantes",
        "Frescor y sombra naturales incluso en los días más calurosos",
        "Tabernas cerca y una bonita ruta con vistas al Egeo",
      ],
    },
    tr: {
      answer:
        "Nagos, Sakız Adası’nın en yeşil plajıdır: akan kaynak suları ve asırlık çınarlar, tarihi Kardamyla’nın hemen dışında kristal berraklığında sular ve rengârenk çakıllarla buluşur.",
      reasons: [
        "Kaynaklar, dereler ve asırlık çınarlarla eşsiz yeşil bir manzara",
        "Rengârenk çakıllar ve kristal berraklığında, çok serin sular",
        "En sıcak günlerde bile doğal serinlik ve gölge",
        "Yakında tavernalar ve Ege manzaralı güzel bir yol",
      ],
    },
  },

  avlonia: {
    el: {
      answer:
        "Η Αυλωνιά (η «Πυργούσικη Αυλωνιά») είναι ένας μαγικός, απομονωμένος κόλπος στη νότια Χίο, 9 χλμ. από το Πυργί, με άγρια ομορφιά, τιρκουάζ νερά και εντυπωσιακό βυθό. Η μικρή περιπέτεια της διαδρομής κάνει το μπάνιο ακόμη πιο ξεχωριστό.",
      reasons: [
        "Τιρκουάζ, κρυστάλλινα νερά και βυθός ιδανικός για snorkeling",
        "Απομονωμένος, ήσυχος κόλπος μακριά από τον κόσμο",
        "Μονοπάτι 700 μέτρων που προσθέτει αίσθηση εξερεύνησης",
        "Μαγευτικό ηλιοβασίλεμα κοντά στο μεσαιωνικό Πυργί",
      ],
    },
    en: {
      answer:
        "Avlonia (locally “Pyrgousiki Avlonia”) is a magical, secluded bay in southern Chios, 9 km from Pyrgi, with wild beauty, turquoise water and an impressive seabed. The short adventure of getting there makes the swim even more special.",
      reasons: [
        "Turquoise, crystal-clear water and a seabed made for snorkelling",
        "A secluded, peaceful bay away from the crowds",
        "A 700-metre path that adds a sense of exploration",
        "Magical sunsets close to medieval Pyrgi",
      ],
    },
    fr: {
      answer:
        "Avlonia (la « Pyrgousiki Avlonia ») est une baie isolée et magique au sud de Chios, à 9 km de Pyrgi, d’une beauté sauvage, avec une eau turquoise et des fonds impressionnants. Le petit trajet d’accès rend la baignade encore plus spéciale.",
      reasons: [
        "Une eau turquoise et cristalline et des fonds parfaits pour le snorkeling",
        "Une baie isolée et paisible, loin de la foule",
        "Un sentier de 700 mètres qui donne un vrai goût d’exploration",
        "Des couchers de soleil magiques près de Pyrgi la médiévale",
      ],
    },
    de: {
      answer:
        "Avlonia (lokal „Pyrgousiki Avlonia“) ist eine magische, abgelegene Bucht im Süden von Chios, 9 km von Pyrgi, mit wilder Schönheit, türkisfarbenem Wasser und beeindruckender Unterwasserwelt. Der kurze Weg dorthin macht das Baden noch besonderer.",
      reasons: [
        "Türkisfarbenes, kristallklares Wasser – ideal zum Schnorcheln",
        "Eine abgelegene, ruhige Bucht fernab der Menschenmengen",
        "Ein 700-Meter-Pfad mit echtem Entdeckergefühl",
        "Traumhafte Sonnenuntergänge nahe dem Mittelalterdorf Pyrgi",
      ],
    },
    it: {
      answer:
        "Avlonia (la “Pyrgousiki Avlonia”) è una baia magica e appartata nel sud di Chios, a 9 km da Pyrgi, dalla bellezza selvaggia, con acque turchesi e un fondale spettacolare. La breve avventura per arrivarci rende il bagno ancora più speciale.",
      reasons: [
        "Acque turchesi e cristalline e un fondale perfetto per lo snorkeling",
        "Una baia appartata e tranquilla, lontana dalla folla",
        "Un sentiero di 700 metri che regala il gusto dell’esplorazione",
        "Tramonti magici vicino alla medievale Pyrgi",
      ],
    },
    es: {
      answer:
        "Avlonia (la «Pyrgousiki Avlonia») es una bahía mágica y apartada en el sur de Quíos, a 9 km de Pyrgi, de belleza salvaje, con aguas turquesa y un fondo marino impresionante. La pequeña aventura del acceso hace el baño aún más especial.",
      reasons: [
        "Aguas turquesa y cristalinas y un fondo ideal para el snorkel",
        "Una bahía apartada y tranquila, lejos de las multitudes",
        "Un sendero de 700 metros con auténtico sabor a exploración",
        "Atardeceres mágicos cerca de la medieval Pyrgi",
      ],
    },
    tr: {
      answer:
        "Avlonia (yerel adıyla “Pyrgousiki Avlonia”), Pyrgi’ye 9 km uzaklıkta, güney Sakız’da vahşi güzelliği, turkuaz suları ve etkileyici deniz tabanıyla büyülü ve ıssız bir koydur. Kısa yürüyüş macerası denize girmeyi daha da özel kılar.",
      reasons: [
        "Turkuaz, kristal berraklığında sular ve şnorkel için harika bir taban",
        "Kalabalıktan uzak, ıssız ve huzurlu bir koy",
        "Keşif duygusu katan 700 metrelik bir patika",
        "Ortaçağ köyü Pyrgi yakınında büyüleyici gün batımı",
      ],
    },
  },

  salagona: {
    el: {
      answer:
        "Τα Σαλάγωνα είναι ένας μαγικός, ήσυχος κόλπος στη νοτιοδυτική Χίο με πεντακάθαρα τιρκουάζ νερά και βότσαλο — ιδανικός για να ξεφύγετε από τον κόσμο και να εξερευνήσετε τον βυθό, κοντά στα μεσαιωνικά χωριά.",
      reasons: [
        "Πεντακάθαρα νερά σε υπέροχες αποχρώσεις του μπλε και του πράσινου",
        "Ήσυχη, σχετικά απομονωμένη παραλία, μακριά από τον πολύ κόσμο",
        "Από τα καλύτερα σημεία της Χίου για snorkeling",
        "Εύκολος συνδυασμός με Μεστά, Ολύμπους και το Σπήλαιο Ολύμπων",
      ],
    },
    en: {
      answer:
        "Salagona is a magical, quiet bay in south-west Chios with spotless turquoise water and pebbles — ideal for escaping the crowds and exploring the seabed, close to the medieval villages.",
      reasons: [
        "Spotless water in beautiful shades of blue and green",
        "A quiet, relatively secluded beach away from the crowds",
        "One of the best spots in Chios for snorkelling",
        "Easy to combine with Mesta, Olympoi and the Olympoi Cave",
      ],
    },
    fr: {
      answer:
        "Salagona est une baie calme et magique au sud-ouest de Chios, avec une eau turquoise impeccable et des galets — idéale pour fuir la foule et explorer les fonds, près des villages médiévaux.",
      reasons: [
        "Une eau limpide aux superbes nuances de bleu et de vert",
        "Une plage calme et assez isolée, loin de la foule",
        "L’un des meilleurs spots de Chios pour le snorkeling",
        "Facile à combiner avec Mesta, Olympi et la grotte d’Olympi",
      ],
    },
    de: {
      answer:
        "Salagona ist eine magische, ruhige Bucht im Südwesten von Chios mit makellos türkisfarbenem Wasser und Kieseln – ideal, um den Menschenmengen zu entfliehen und die Unterwasserwelt zu entdecken, nahe den Mittelalterdörfern.",
      reasons: [
        "Makelloses Wasser in herrlichen Blau- und Grüntönen",
        "Ein ruhiger, recht abgelegener Strand abseits des Trubels",
        "Einer der besten Schnorchelplätze auf Chios",
        "Ideal kombinierbar mit Mesta, Olympi und der Höhle von Olympi",
      ],
    },
    it: {
      answer:
        "Salagona è una baia magica e tranquilla nel sud-ovest di Chios, con acque turchesi impeccabili e ciottoli: ideale per sfuggire alla folla ed esplorare il fondale, vicino ai villaggi medievali.",
      reasons: [
        "Acque limpidissime in splendide sfumature di blu e verde",
        "Una spiaggia tranquilla e appartata, lontana dalla folla",
        "Uno dei posti migliori di Chios per lo snorkeling",
        "Facile da abbinare a Mesta, Olympi e alla Grotta di Olympi",
      ],
    },
    es: {
      answer:
        "Salagona es una bahía mágica y tranquila en el suroeste de Quíos, con aguas turquesa impecables y guijarros: ideal para escapar de las multitudes y explorar el fondo marino, cerca de los pueblos medievales.",
      reasons: [
        "Aguas impecables en preciosos tonos de azul y verde",
        "Una playa tranquila y bastante apartada, lejos del gentío",
        "Uno de los mejores lugares de Quíos para hacer snorkel",
        "Fácil de combinar con Mesta, Olympi y la Cueva de Olympi",
      ],
    },
    tr: {
      answer:
        "Salagona, güneybatı Sakız’da tertemiz turkuaz suları ve çakıllarıyla büyülü ve sakin bir koydur — kalabalıktan kaçmak ve deniz tabanını keşfetmek için ideal, ortaçağ köylerine yakın.",
      reasons: [
        "Mavi ve yeşilin muhteşem tonlarında tertemiz sular",
        "Kalabalıktan uzak, sakin ve oldukça ıssız bir plaj",
        "Sakız Adası’nda şnorkel için en iyi yerlerden biri",
        "Mesta, Olympi ve Olympi Mağarası ile kolayca birleşir",
      ],
    },
  },

  vroulidia: {
    el: {
      answer:
        "Τα Βρουλίδια είναι ένας μικρός, πανέμορφος κολπίσκος στο νοτιότερο άκρο της Χίου, κοντά στον Εμπορειό, με τιρκουάζ νερά και ανοιχτή θέα στο πέλαγος. Είναι απάνεμα με τον βοριά, οπότε σώζουν τις μέρες με μελτέμι.",
      reasons: [
        "Τιρκουάζ, πεντακάθαρα νερά σε έναν μικρό, ειδυλλιακό όρμο",
        "Απάνεμη με τον βοριά: η τέλεια επιλογή τις μέρες με μελτέμι",
        "Ήσυχη, φυσική ατμόσφαιρα με καντίνα ψηλά από την παραλία",
        "Ιδανικός συνδυασμός με Μαύρα Βόλια και Κώμη για ένα τέλειο beach day",
      ],
    },
    en: {
      answer:
        "Vroulidia is a small, beautiful cove at the southern tip of Chios, near Emporios, with turquoise water and open sea views. It is sheltered from the north wind, so it saves the day when the meltemi blows.",
      reasons: [
        "Turquoise, spotless water in a small, idyllic cove",
        "Sheltered from the north wind: the perfect choice on meltemi days",
        "A quiet, natural atmosphere with a canteen above the beach",
        "Ideal with Mavra Volia and Komi for a perfect South Chios beach day",
      ],
    },
    fr: {
      answer:
        "Vroulidia est une petite crique superbe à la pointe sud de Chios, près d’Emporios, avec une eau turquoise et une vue dégagée sur la mer. Abritée du vent du nord, elle sauve les journées de meltem.",
      reasons: [
        "Une eau turquoise et limpide dans une petite crique idyllique",
        "Abritée du vent du nord : le choix parfait les jours de meltem",
        "Une ambiance calme et naturelle, avec une cantine au-dessus de la plage",
        "Idéale avec Mavra Volia et Komi pour une journée plage parfaite",
      ],
    },
    de: {
      answer:
        "Vroulidia ist eine kleine, wunderschöne Bucht an der Südspitze von Chios bei Emporios, mit türkisfarbenem Wasser und offenem Meerblick. Sie ist vor Nordwind geschützt – die Rettung an Meltemi-Tagen.",
      reasons: [
        "Türkisfarbenes, makelloses Wasser in einer kleinen, idyllischen Bucht",
        "Geschützt vor Nordwind: die perfekte Wahl an Meltemi-Tagen",
        "Ruhige, naturbelassene Atmosphäre mit Kantine oberhalb des Strandes",
        "Ideal mit Mavra Volia und Komi für einen perfekten Strandtag im Süden",
      ],
    },
    it: {
      answer:
        "Vroulidia è una piccola, splendida caletta all’estremità sud di Chios, vicino a Emporios, con acque turchesi e vista aperta sul mare. È riparata dal vento da nord, quindi salva le giornate di meltemi.",
      reasons: [
        "Acque turchesi e limpidissime in una piccola baia idilliaca",
        "Riparata dal vento da nord: la scelta perfetta nei giorni di meltemi",
        "Atmosfera tranquilla e naturale, con un chiosco sopra la spiaggia",
        "Ideale con Mavra Volia e Komi per una perfetta giornata al mare",
      ],
    },
    es: {
      answer:
        "Vroulidia es una pequeña y preciosa cala en el extremo sur de Quíos, cerca de Emporios, con aguas turquesa y vistas abiertas al mar. Está resguardada del viento del norte, así que salva los días de meltemi.",
      reasons: [
        "Aguas turquesa e impecables en una pequeña cala idílica",
        "Resguardada del viento del norte: la opción perfecta con meltemi",
        "Ambiente tranquilo y natural, con una cantina sobre la playa",
        "Ideal con Mavra Volia y Komi para un día de playa perfecto en el sur",
      ],
    },
    tr: {
      answer:
        "Vroulidia, Sakız Adası’nın en güney ucunda, Emporios yakınında turkuaz suları ve açık deniz manzarasıyla küçük ve çok güzel bir koydur. Kuzey rüzgârından korunaklıdır, meltemli günlerin kurtarıcısıdır.",
      reasons: [
        "Küçük ve pastoral bir koyda turkuaz, tertemiz sular",
        "Kuzey rüzgârından korunaklı: meltemli günler için mükemmel seçim",
        "Plajın üstünde bir büfe ile sakin, doğal bir atmosfer",
        "Mavra Volia ve Komi ile mükemmel bir güney plaj günü",
      ],
    },
  },

  "kato-fana": {
    el: {
      answer:
        "Τα Κάτω Φανά είναι μια ήσυχη, φυσική παραλία στη νότια Χίο, κοντά στα ιστορικά Φανά, με άμμο, ρηχά νερά και ανοιχτό ορίζοντα. Ιδανική για όσους θέλουν χώρο, ησυχία και την πιο αυθεντική πλευρά του νότου.",
      reasons: [
        "Αμμουδιά με ρηχά νερά, κατάλληλη και για οικογένειες",
        "Ήσυχη και ανοργάνωτη, με ανοιχτό ορίζοντα και πολύ χώρο",
        "Φυσική σκιά από δέντρα για χαλαρό μπάνιο",
        "Ιδανική στάση ανάμεσα σε Πυργί, Ολύμπους και Μαστιχοχώρια",
      ],
    },
    en: {
      answer:
        "Kato Fana is a quiet, natural beach in southern Chios near historic Fana, with sand, shallow water and an open horizon. It is ideal for those who want space, peace and the most authentic side of the south.",
      reasons: [
        "A sandy beach with shallow water, suitable for families too",
        "Quiet and unorganised, with open horizons and plenty of space",
        "Natural shade from trees for a relaxed swim",
        "An ideal stop between Pyrgi, Olympoi and the Mastic Villages",
      ],
    },
    fr: {
      answer:
        "Kato Fana est une plage calme et naturelle au sud de Chios, près de l’historique Fana, avec du sable, une eau peu profonde et un horizon dégagé. Idéale pour qui cherche espace, calme et le visage le plus authentique du sud.",
      reasons: [
        "Une plage de sable à l’eau peu profonde, adaptée aussi aux familles",
        "Calme et sauvage, avec un horizon dégagé et beaucoup d’espace",
        "De l’ombre naturelle sous les arbres pour une baignade détendue",
        "Une étape idéale entre Pyrgi, Olympi et les villages du mastic",
      ],
    },
    de: {
      answer:
        "Kato Fana ist ein ruhiger, naturbelassener Strand im Süden von Chios beim historischen Fana, mit Sand, flachem Wasser und weitem Horizont – ideal für alle, die Platz, Ruhe und die ursprünglichste Seite des Südens suchen.",
      reasons: [
        "Sandstrand mit flachem Wasser, auch für Familien geeignet",
        "Ruhig und unorganisiert, mit weitem Horizont und viel Platz",
        "Natürlicher Schatten unter Bäumen für entspanntes Baden",
        "Idealer Stopp zwischen Pyrgi, Olympi und den Mastixdörfern",
      ],
    },
    it: {
      answer:
        "Kato Fana è una spiaggia tranquilla e naturale nel sud di Chios, vicino alla storica Fana, con sabbia, acque basse e orizzonte aperto. Ideale per chi cerca spazio, quiete e il volto più autentico del sud.",
      reasons: [
        "Spiaggia di sabbia con acque basse, adatta anche alle famiglie",
        "Tranquilla e libera, con orizzonte aperto e tanto spazio",
        "Ombra naturale degli alberi per un bagno rilassante",
        "Una sosta ideale tra Pyrgi, Olympi e i villaggi del mastice",
      ],
    },
    es: {
      answer:
        "Kato Fana es una playa tranquila y natural en el sur de Quíos, cerca de la histórica Fana, con arena, aguas poco profundas y horizonte abierto. Ideal para quien busca espacio, calma y la cara más auténtica del sur.",
      reasons: [
        "Playa de arena con aguas poco profundas, apta también para familias",
        "Tranquila y sin servicios, con horizonte abierto y mucho espacio",
        "Sombra natural de árboles para un baño relajado",
        "Una parada ideal entre Pyrgi, Olympi y los pueblos del mástique",
      ],
    },
    tr: {
      answer:
        "Kato Fana, güney Sakız’da tarihi Fana yakınında kumu, sığ suyu ve açık ufkuyla sakin ve doğal bir plajdır. Alan, huzur ve güneyin en otantik yüzünü arayanlar için ideal.",
      reasons: [
        "Aileler için de uygun, sığ sulu bir kumsal",
        "Açık ufku ve geniş alanıyla sakin ve düzenlenmemiş",
        "Rahat bir yüzme için ağaçların doğal gölgesi",
        "Pyrgi, Olympi ve sakız köyleri arasında ideal bir mola",
      ],
    },
  },

  karfas: {
    el: {
      answer:
        "Ο Καρφάς είναι η πιο εύκολη και γνωστή αμμουδιά της Χίου, μόλις 12–15 λεπτά από τον Κάμπο: μεγάλη παραλία με ψιλή χρυσή άμμο, πολύ ρηχά ζεστά νερά και πλήρη οργάνωση. Ιδανικός για οικογένειες και για μπάνιο χωρίς πολλή οδήγηση.",
      reasons: [
        "Μόλις 12–15 λεπτά από τον Κάμπο και το Voulamandis House",
        "Ψιλή χρυσή άμμος και πολύ ρηχά, ζεστά νερά, τέλεια για παιδιά",
        "Πλήρως οργανωμένη με ξαπλώστρες, beach bars, ταβέρνες και θαλάσσια σπορ",
        "Εύκολη πρόσβαση με αυτοκίνητο ή με το τοπικό λεωφορείο",
      ],
    },
    en: {
      answer:
        "Karfas is the easiest and best-known sandy beach in Chios, only 12–15 minutes from Kambos: a long beach of fine golden sand, very shallow warm water and full facilities. It is ideal for families and for swimming without a long drive.",
      reasons: [
        "Only 12–15 minutes from Kambos and Voulamandis House",
        "Fine golden sand and very shallow, warm water, perfect for children",
        "Fully organised with sunbeds, beach bars, taverns and water sports",
        "Easy access by car or by the local bus",
      ],
    },
    fr: {
      answer:
        "Karfas est la plage de sable la plus facile et la plus connue de Chios, à seulement 12–15 minutes de Kambos : longue plage de sable fin et doré, eau très peu profonde et chaude, et tous les services. Idéale pour les familles.",
      reasons: [
        "À seulement 12–15 minutes de Kambos et de Voulamandis House",
        "Sable fin doré et eau très peu profonde et chaude, parfaits pour les enfants",
        "Entièrement aménagée : transats, beach bars, tavernes et sports nautiques",
        "Accès facile en voiture ou en bus local",
      ],
    },
    de: {
      answer:
        "Karfas ist der bequemste und bekannteste Sandstrand von Chios, nur 12–15 Minuten von Kambos: ein langer Strand mit feinem goldenem Sand, sehr flachem warmem Wasser und kompletter Ausstattung – ideal für Familien.",
      reasons: [
        "Nur 12–15 Minuten von Kambos und Voulamandis House",
        "Feiner goldener Sand und sehr flaches, warmes Wasser – perfekt für Kinder",
        "Voll ausgestattet mit Liegen, Beach-Bars, Tavernen und Wassersport",
        "Leicht erreichbar mit dem Auto oder dem Linienbus",
      ],
    },
    it: {
      answer:
        "Karfas è la spiaggia di sabbia più comoda e conosciuta di Chios, a soli 12–15 minuti da Kambos: una lunga spiaggia di sabbia fine e dorata, acque bassissime e calde e tutti i servizi. Ideale per le famiglie.",
      reasons: [
        "A soli 12–15 minuti da Kambos e da Voulamandis House",
        "Sabbia fine e dorata e acque bassissime e calde, perfette per i bambini",
        "Completamente attrezzata con lettini, beach bar, taverne e sport acquatici",
        "Facile da raggiungere in auto o con l’autobus locale",
      ],
    },
    es: {
      answer:
        "Karfas es la playa de arena más cómoda y conocida de Quíos, a solo 12–15 minutos de Kambos: una larga playa de arena fina y dorada, aguas muy poco profundas y cálidas y todos los servicios. Ideal para familias.",
      reasons: [
        "A solo 12–15 minutos de Kambos y de Voulamandis House",
        "Arena fina y dorada y aguas muy poco profundas y cálidas, perfectas para niños",
        "Totalmente organizada, con hamacas, beach bars, tabernas y deportes acuáticos",
        "Acceso fácil en coche o en el autobús local",
      ],
    },
    tr: {
      answer:
        "Karfas, Kambos’a yalnızca 12–15 dakika uzaklıkta, Sakız Adası’nın en kolay ulaşılan ve en bilinen kumsalıdır: ince altın kumlu uzun bir plaj, çok sığ ve ılık su ve eksiksiz hizmet. Aileler için ideal.",
      reasons: [
        "Kambos’a ve Voulamandis House’a yalnızca 12–15 dakika",
        "İnce altın kum ve çok sığ, ılık su; çocuklar için mükemmel",
        "Şezlong, beach bar, taverna ve su sporlarıyla tamamen düzenli",
        "Arabayla ya da yerel otobüsle kolay ulaşım",
      ],
    },
  },

  elinta: {
    el: {
      answer:
        "Η Ελίντα είναι ένας μεγάλος, κλειστός και γαλήνιος κόλπος στη δυτική Χίο, με δροσερά γαλαζοπράσινα νερά, κάτασπρο βότσαλο και πευκόφυτα βουνά που κατεβαίνουν ως τη θάλασσα. Άγρια ομορφιά χωρίς κανέναν θόρυβο.",
      reasons: [
        "Εξαιρετικά καθαρά, δροσερά γαλαζοπράσινα νερά",
        "Κάτασπρο βότσαλο και πευκόφυτο, εντυπωσιακό τοπίο",
        "Εντελώς ανοργάνωτη και γαλήνια, για όσους αγαπούν τη φύση",
        "Μόλις 5 χλμ. από τον Ανάβατο και το Λιθί",
      ],
    },
    en: {
      answer:
        "Elinta is a large, enclosed and peaceful bay in western Chios, with cool green-blue water, bright white pebbles and pine-covered mountains running down to the sea. Wild beauty without any noise.",
      reasons: [
        "Exceptionally clear, cool green-blue water",
        "Bright white pebbles and a striking pine-covered landscape",
        "Completely unorganised and peaceful, for nature lovers",
        "Only 5 km from Anavatos and Lithi",
      ],
    },
    fr: {
      answer:
        "Elinta est une grande baie fermée et paisible à l’ouest de Chios, avec une eau fraîche vert-bleu, des galets d’un blanc éclatant et des montagnes couvertes de pins qui descendent jusqu’à la mer. Une beauté sauvage, sans bruit.",
      reasons: [
        "Une eau vert-bleu exceptionnellement claire et fraîche",
        "Des galets d’un blanc éclatant et un paysage de pins spectaculaire",
        "Entièrement sauvage et paisible, pour les amoureux de nature",
        "À seulement 5 km d’Anavatos et de Lithi",
      ],
    },
    de: {
      answer:
        "Elinta ist eine große, geschlossene und friedliche Bucht im Westen von Chios, mit kühlem grünblauem Wasser, strahlend weißen Kieseln und pinienbewachsenen Bergen, die bis ans Meer reichen. Wilde Schönheit ohne Lärm.",
      reasons: [
        "Außergewöhnlich klares, kühles grünblaues Wasser",
        "Strahlend weiße Kiesel und eine eindrucksvolle Pinienlandschaft",
        "Völlig naturbelassen und friedlich – für Naturliebhaber",
        "Nur 5 km von Anavatos und Lithi entfernt",
      ],
    },
    it: {
      answer:
        "Elinta è una grande baia chiusa e tranquilla nella Chios occidentale, con acque fresche verde-azzurre, ciottoli bianchissimi e montagne coperte di pini che scendono fino al mare. Bellezza selvaggia senza rumore.",
      reasons: [
        "Acque verde-azzurre eccezionalmente limpide e fresche",
        "Ciottoli bianchissimi e uno spettacolare paesaggio di pini",
        "Completamente libera e tranquilla, per chi ama la natura",
        "A soli 5 km da Anavatos e Lithi",
      ],
    },
    es: {
      answer:
        "Elinta es una gran bahía cerrada y tranquila en el oeste de Quíos, con aguas frescas verdiazules, guijarros blanquísimos y montañas cubiertas de pinos que bajan hasta el mar. Belleza salvaje sin ruido.",
      reasons: [
        "Aguas verdiazules excepcionalmente claras y frescas",
        "Guijarros blanquísimos y un espectacular paisaje de pinos",
        "Totalmente sin servicios y tranquila, para amantes de la naturaleza",
        "A solo 5 km de Anavatos y Lithi",
      ],
    },
    tr: {
      answer:
        "Elinta, batı Sakız’da serin yeşil-mavi suları, bembeyaz çakılları ve denize kadar inen çam kaplı dağlarıyla büyük, kapalı ve huzurlu bir koydur. Gürültüsüz, vahşi bir güzellik.",
      reasons: [
        "Olağanüstü berrak, serin yeşil-mavi sular",
        "Bembeyaz çakıllar ve etkileyici çam ormanı manzarası",
        "Doğa severler için tamamen düzenlenmemiş ve huzurlu",
        "Anavatos ve Lithi’ye yalnızca 5 km",
      ],
    },
  },
};

export function getBeachWhyVisit(beachId: string | null, language: WhyVisitLanguage) {
  if (!beachId) return null;
  return beachWhyVisit[beachId]?.[language] ?? null;
}
